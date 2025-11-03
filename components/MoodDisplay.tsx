import React from 'react';
import { useAppStore } from '../store/useAppStore';

const emotionEmojiMap: { [key: string]: string } = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😮',
};

const ProgressBar: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => {
  // Clamp value between -1 and 1, then scale to 0-100 for the progress bar
  const percentage = ((value + 1) / 2) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-200">{label}</span>
        <span className="text-sm font-medium text-gray-200">{value.toFixed(2)}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2.5">
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
      </div>
    </div>
  );
};


export const MoodDisplay: React.FC = () => {
  const currentMood = useAppStore((state) => state.currentMood);

  const containerClasses = "p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl";

  if (!currentMood) {
    return (
      <div className={`${containerClasses} text-center`}>
        <p className="text-gray-300">Awaiting mood data...</p>
        <p className="text-xs text-gray-400 mt-2">Make sure your face is visible to the camera.</p>
      </div>
    );
  }

  const { emotion, valence, energy } = currentMood;
  const emoji = emotionEmojiMap[emotion] || '🤔';

  return (
    <div className={`${containerClasses} animate-fade-in`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-100">Current Mood</h3>
            <span className="text-4xl" role="img" aria-label={emotion}>{emoji}</span>
        </div>
        <div className="space-y-4">
            <ProgressBar label="Valence (Pleasantness)" value={valence} color="#7A7FFF" />
            <ProgressBar label="Energy (Arousal)" value={energy} color="#00E0FF" />
        </div>
    </div>
  );
};