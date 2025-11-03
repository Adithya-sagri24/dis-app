// Informs TypeScript that a 'faceapi' global variable exists, loaded from a script tag.
declare const faceapi: any;

import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { mapExpressionsToEmotionVector } from '../lib/emotionUtils';
import { EmotionExpressions } from '../types';
import { supabase } from '../lib/supabaseClient';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
const EMA_ALPHA = 0.2; // Smoothing factor for Exponential Moving Average

export const EmotionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothedValenceRef = useRef<number>(0);
  const smoothedEnergyRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  const { setCurrentMood, addMoodToHistory, logMoodData, user } = useAppStore(
      (state) => ({
          setCurrentMood: state.setCurrentMood,
          addMoodToHistory: state.addMoodToHistory,
          logMoodData: state.logMoodData,
          user: state.user,
      })
  );

  // 1. Load Models and Get Camera Feed
  useEffect(() => {
    const setup = async () => {
      try {
        if (typeof faceapi === 'undefined') {
            throw new Error('face-api.js not loaded yet.');
        }
        // Load models
        setStatus('Loading models...');
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        // Get camera feed
        setStatus('Accessing camera...');
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported by your browser.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
            throw new Error('Video element not available.');
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setStatus('Error');
      }
    };
    setup();

    return () => {
        // Cleanup interval and camera stream
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);
  
  // 2. Start Detection Loop when video is playing
  const handleVideoPlay = () => {
    setStatus('Detecting emotions...');
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        return;
      }

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions as EmotionExpressions;
        const { emotion, valence, energy } = mapExpressionsToEmotionVector(expressions);

        smoothedValenceRef.current = EMA_ALPHA * valence + (1 - EMA_ALPHA) * smoothedValenceRef.current;
        smoothedEnergyRef.current = EMA_ALPHA * energy + (1 - EMA_ALPHA) * smoothedEnergyRef.current;

        const currentMood = {
          emotion,
          valence: smoothedValenceRef.current,
          energy: smoothedEnergyRef.current,
        };

        // Update global state for UI
        setCurrentMood(currentMood);
        addMoodToHistory(currentMood);

        // Persist data if user has opted in
        if (logMoodData && user) {
          const { error: insertError } = await supabase.from('moods').insert({
            user_id: user.id,
            emotion: currentMood.emotion,
            valence: currentMood.valence,
            energy: currentMood.energy,
          });
          if (insertError) {
            console.error('Error logging mood:', insertError.message);
          }
        }
      }
    }, 400); // Sample every 400ms
  };

  return (
    <div className="relative aspect-video w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onPlay={handleVideoPlay}
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }} // Mirror the video feed
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 pointer-events-none">
        <p className="text-white text-center font-medium">
          {error || status}
        </p>
      </div>
    </div>
  );
};