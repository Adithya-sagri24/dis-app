import React from 'react';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { Header } from '../components/ui/Header';
import { TaskSummary } from '../components/TaskSummary';
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

export const HomePage: React.FC = () => {
  const currentMood = useAppStore((state) => state.currentMood);

  return (
    <div className="animate-fade-in">
        <Header title="Dashboard" subtitle="Welcome back! Here's your daily overview." />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column: Pomodoro */}
            <div className="lg:col-span-2">
                <div className="relative w-full h-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <PomodoroTimer />
                </div>
            </div>

            {/* Side Column */}
            <div className="space-y-8">
                <TaskSummary />
                
                {/* MoodSummary component logic inlined */}
                <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">
                        Current Mood
                    </h3>
                    {currentMood ? (
                        <div className="flex items-center gap-4">
                            <span className="text-5xl">{emotionEmojiMap[currentMood.emotion] || '🤔'}</span>
                            <div>
                                <p className="text-lg font-semibold capitalize text-white">{currentMood.emotion}</p>
                                <p className="text-sm text-gray-300">Pleasantness: {currentMood.valence.toFixed(2)}</p>
                                <p className="text-sm text-gray-300">Energy: {currentMood.energy.toFixed(2)}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">No mood detected yet. Navigate to the Mood page to start!</p>
                    )}
                    <a href="#/mood" className="block text-center mt-4 text-cyan-400 hover:underline font-medium text-sm">
                        Analyze Mood &rarr;
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};