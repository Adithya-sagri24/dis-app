import React, { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const PomodoroTimer: React.FC = () => {
  const {
    mode,
    timeRemaining,
    isActive,
    pomodoros,
    toggleIsActive,
    resetTimer,
    tick,
  } = useTimerStore();

  const prevMode = useRef(mode);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);

  useEffect(() => {
    // This effect handles the alerts when modes change by comparing the current mode to the previous one.
    if (prevMode.current !== mode) {
        if (mode === 'shortBreak' || mode === 'longBreak') {
            alert('Time for a break!');
        } else if (mode === 'focus' && pomodoros > 0) {
            alert('Break is over. Time to focus!');
        }
    }
    prevMode.current = mode;
  }, [mode, pomodoros]);

  const modeText = mode === 'focus' ? 'Work' : mode === 'shortBreak' ? 'Break' : 'Long Break';
  const modeColor = mode === 'focus' ? 'border-sky-400' : 'border-green-400';

  return (
    <div className="w-full max-w-md mx-auto text-center p-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
        <header className="mb-6">
            <h2 className="text-3xl font-bold text-white">Focus Timer</h2>
            <p className="text-gray-400 mt-1">Stay on track with the Pomodoro technique.</p>
        </header>

        <div className={`relative w-48 h-48 mx-auto flex items-center justify-center border-8 rounded-full ${modeColor} transition-colors`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono font-bold text-white tracking-wider">
                    {formatTime(timeRemaining)}
                </span>
                <span className="mt-1 text-sm font-semibold uppercase tracking-widest text-gray-300">
                    {modeText}
                </span>
            </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4">
            <Button 
                onClick={toggleIsActive}
                className="w-40"
            >
                {isActive ? 'Pause' : 'Start'}
            </Button>
            <IconButton onClick={resetTimer} aria-label="Reset timer">
                <ResetIcon />
            </IconButton>
        </div>
        
        <footer className="mt-6">
            <p className="text-gray-400">Completed cycles: <span className="font-bold text-white">{pomodoros}</span></p>
        </footer>
    </div>
  );
};
