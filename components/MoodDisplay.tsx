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
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
};


export const MoodDisplay: React.FC = () => {
  const currentMood = useAppStore((state) => state.currentMood);

  if (!currentMood) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
        <p className="text-gray-500 dark:text-gray-400">Awaiting mood data...</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Make sure your face is visible to the camera.</p>
      </div>
    );
  }

  const { emotion, valence, energy } = currentMood;
  const emoji = emotionEmojiMap[emotion] || '🤔';

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Current Mood</h3>
            <span className="text-4xl" role="img" aria-label={emotion}>{emoji}</span>
        </div>
        <div className="space-y-4">
            <ProgressBar label="Valence (Pleasantness)" value={valence} color="#4f46e5" />
            <ProgressBar label="Energy (Arousal)" value={energy} color="#db2777" />
        </div>
    </div>
  );
};