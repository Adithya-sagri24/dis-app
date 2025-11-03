import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Mood } from '../types';

const ChartLine: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (data.length < 2) return null;

  const width = 300;
  const height = 80;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val + 1) / 2) * height; // Scale from [-1, 1] to [0, height]
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return <polyline fill="none" stroke={color} strokeWidth="2" points={points} />;
};

export const MoodChart: React.FC = () => {
  const moodHistory = useAppStore((state) => state.moodHistory);
  const valenceData = moodHistory.map(m => m.valence);
  const energyData = moodHistory.map(m => m.energy);

  return (
    <div className="p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-200 mb-4">
        Real-time Mood Summary
      </h3>
      {moodHistory.length < 2 ? (
        <div className="h-40 flex items-center justify-center text-gray-400">
          <p>Collecting mood data...</p>
        </div>
      ) : (
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-indigo-400">Valence (Pleasantness)</h4>
                    <span className="text-xs text-gray-400">Last {moodHistory.length * 0.4}s</span>
                </div>
                <svg viewBox="0 0 300 80" className="w-full h-auto" preserveAspectRatio="none">
                    <ChartLine data={valenceData} color="#818cf8" />
                </svg>
            </div>
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-pink-400">Energy (Arousal)</h4>
                </div>
                <svg viewBox="0 0 300 80" className="w-full h-auto" preserveAspectRatio="none">
                    <ChartLine data={energyData} color="#f472b6" />
                </svg>
            </div>
        </div>
      )}
    </div>
  );
};