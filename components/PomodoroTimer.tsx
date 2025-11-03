import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';

const WORK_MINS = 25;
const BREAK_MINS = 5;

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeRemaining, setTimeRemaining] = useState(WORK_MINS * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Switch modes
      if (mode === 'work') {
        setMode('break');
        setTimeRemaining(BREAK_MINS * 60);
        setCycles(c => c + 1);
        // Add notification if possible
        alert('Time for a break!');
      } else {
        setMode('work');
        setTimeRemaining(WORK_MINS * 60);
        alert('Break is over. Time to focus!');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMode('work');
    setTimeRemaining(WORK_MINS * 60);
    setCycles(0);
  }, []);
  
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Focus Timer
      </h3>
      <div 
        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
            mode === 'work' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}
      >
        {mode === 'work' ? 'Work' : 'Break'}
      </div>
      <div className="text-6xl font-mono font-bold text-gray-800 dark:text-gray-100 mb-4">
        {formatTime(timeRemaining)}
      </div>
      <div className="flex gap-4">
        <Button onClick={toggleTimer} className={!isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer} className="bg-gray-500 hover:bg-gray-600">
          Reset
        </Button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Completed cycles: {cycles}
      </p>
    </div>
  );
};
