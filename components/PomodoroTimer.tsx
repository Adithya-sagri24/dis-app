import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';

// --- Timer Settings ---
const FOCUS_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const INTERVALS_BEFORE_LONG_BREAK = 4;

// --- Sound ---
const NOTIFICATION_SOUND_URL = 'https://cdn.freesound.org/previews/220/220170_4100837-lq.mp3';

// --- Icons ---
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>;
const SkipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.168V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.832L4.555 5.168z" /></svg>;


export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0); // Completed focus sessions this set

  const notificationSound = useMemo(() => {
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.5;
    return audio;
  }, []);

  const totalDuration = useMemo(() => {
    switch (mode) {
      case 'focus': return FOCUS_DURATION;
      case 'shortBreak': return SHORT_BREAK_DURATION;
      case 'longBreak': return LONG_BREAK_DURATION;
    }
  }, [mode]);

  const showNotification = useCallback((message: string) => {
    // Play sound effect
    notificationSound.play().catch(error => console.warn("Audio notification blocked by browser:", error));

    // Show browser notification
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('You Decide', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('You Decide', { body: message });
        }
      });
    }
  }, [notificationSound]);

  const handleNextMode = useCallback(() => {
    if (mode === 'focus') {
      const newPomodoros = pomodoros + 1;
      setPomodoros(newPomodoros);
      if (newPomodoros % INTERVALS_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeRemaining(LONG_BREAK_DURATION);
        showNotification('Time for a long break!');
      } else {
        setMode('shortBreak');
        setTimeRemaining(SHORT_BREAK_DURATION);
        showNotification('Time for a short break!');
      }
    } else { // After any break
      setMode('focus');
      setTimeRemaining(FOCUS_DURATION);
      showNotification('Time to focus!');
    }
  }, [mode, pomodoros, showNotification]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      handleNextMode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, handleNextMode]);
  
  const handleToggle = () => setIsActive(prev => !prev);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setMode('focus');
    setTimeRemaining(FOCUS_DURATION);
    setPomodoros(0);
  }, []);

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }

  const modeDetails = {
    focus: { label: "Focus", color: "text-indigo-400", trackColor: "stroke-indigo-500/20", progressColor: "stroke-indigo-500" },
    shortBreak: { label: "Short Break", color: "text-green-400", trackColor: "stroke-green-500/20", progressColor: "stroke-green-500" },
    longBreak: { label: "Long Break", color: "text-pink-400", trackColor: "stroke-pink-500/20", progressColor: "stroke-pink-500" },
  }

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeRemaining / totalDuration) * circumference;

  // Fix: Using variants to bypass potential TypeScript errors with direct animation props like 'transition'.
  const circleVariants = {
    animate: (customStrokeDashoffset: number) => ({
      strokeDashoffset: customStrokeDashoffset,
      transition: { duration: 0.5, ease: "linear" },
    }),
  };

  // Fix: Using variants to bypass potential TypeScript errors with direct animation props like 'initial'.
  const labelVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="15" className={modeDetails[mode].trackColor} />
            <motion.circle
                cx="100" cy="100" r={radius}
                fill="none"
                strokeWidth="15"
                className={modeDetails[mode].progressColor}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                strokeDasharray={circumference}
                variants={circleVariants}
                custom={strokeDashoffset}
                animate="animate"
            />
        </svg>
        <div className="z-10 text-center">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={mode}
                    variants={labelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`font-semibold text-lg ${modeDetails[mode].color}`}
                >
                    {modeDetails[mode].label}
                </motion.p>
            </AnimatePresence>
            <p className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 dark:text-gray-100">
                {formatTime(timeRemaining)}
            </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 w-full">
        <IconButton onClick={handleReset} aria-label="Reset Timer"><ResetIcon /></IconButton>
        <Button
            onClick={handleToggle}
            className="w-32 h-16 text-2xl rounded-full"
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <IconButton onClick={handleNextMode} aria-label="Skip Session"><SkipIcon /></IconButton>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wider">
        Pomodoros: <span className="font-bold">{pomodoros}</span>
      </p>
    </div>
  );
};