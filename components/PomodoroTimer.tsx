import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../store/useTimerStore';
import { Navbar } from './Navbar';

// A gentle chime sound to play when the timer completes.
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3';

// --- Helper Components for Visual Effects & UI ---

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Bubbles: React.FC = React.memo(() => {
    const bubbles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${5 + Math.random() * 20}px`,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 25,
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {bubbles.map(bubble => (
                <motion.div
                    key={bubble.id}
                    className="absolute bottom-[-20px] bg-white/10 rounded-full"
                    style={{ left: bubble.left, width: bubble.size, height: bubble.size }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: '-100vh', opacity: 0 }}
                    transition={{
                        duration: bubble.duration,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: bubble.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
});


const Waves: React.FC<{ progress: number }> = ({ progress }) => {
  const wavePaths = [
    "M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
    "M-160 22c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
    "M-160 66c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
  ];
  const opacities = [0.1, 0.15, 0.2];
  const durations = [18, 15, 12];

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full h-full will-change-transform"
      initial={{ y: '0%' }}
      animate={{ y: `${(1 - progress) * 100}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
        <div className="absolute bottom-0 left-0 w-full h-[20vh] min-h-[120px]">
            {wavePaths.map((path, i) => (
            <svg key={i} className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 176 44" preserveAspectRatio="none">
                <motion.path
                d={path}
                fill={`rgba(255, 255, 255, ${opacities[i]})`}
                initial={{ x: 0 }}
                animate={{ x: -176 }}
                transition={{
                    duration: durations[i],
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'linear',
                }}
                />
            </svg>
            ))}
        </div>
    </motion.div>
  );
};


const LightReflection: React.FC = () => (
    <motion.div
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 mix-blend-soft-light"
      style={{
          background: 'linear-gradient(45deg, transparent 40%, white 50%, transparent 60%)',
          backgroundSize: '200% 100%',
      }}
      initial={{ backgroundPosition: '200% 0' }}
      animate={{ backgroundPosition: '-200% 0' }}
      transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
      }}
      aria-hidden="true"
    />
);

const ModeSelector: React.FC = () => {
  const { mode, setMode } = useTimerStore(state => ({ mode: state.mode, setMode: state.setMode }));
  const modes: Array<'focus' | 'shortBreak' | 'longBreak'> = ['focus', 'shortBreak', 'longBreak'];
  const labels: Record<typeof modes[number], string> = { focus: 'Pomodoro', shortBreak: 'Short Break', longBreak: 'Long Break' };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-sky-900/40 backdrop-blur-lg rounded-full shadow-lg z-20">
      {modes.map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-5 py-1.5 rounded-full text-sm font-bold transition-colors duration-300 ${
            mode === m ? 'text-white' : 'text-sky-200/80 hover:text-white'
          }`}
          aria-pressed={mode === m}
        >
          {mode === m && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-black/20 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{labels[m]}</span>
        </button>
      ))}
    </div>
  );
};

// --- Main Pomodoro Timer Component ---

export const PomodoroTimer: React.FC = () => {
  const { mode, timeRemaining, isActive, durations, tick, toggleIsActive, resetTimer } = useTimerStore();
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const notificationSound = useMemo(() => new Audio(NOTIFICATION_SOUND_URL), []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => tick(), 1000);
    } else if (isActive && timeRemaining === 0) {
        tick(); // Trigger mode switch
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      notificationSound.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [timeRemaining, isActive, notificationSound]);

  const totalDuration = durations[mode];
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#87CEEB] to-[#0A1F44] overflow-hidden text-white font-['Poppins',_sans-serif]">
      <AnimatePresence>
        {isNavOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsNavOpen(false)}
                    aria-hidden="true"
                />
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 h-full z-40"
                    // Pass a function to Navbar to close itself on link click
                    onClick={() => setIsNavOpen(false)}
                >
                    <Navbar activeRoute="#/home" />
                </motion.div>
            </>
        )}
      </AnimatePresence>

      <Waves progress={progress} />
      <LightReflection />
      <Bubbles />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <button 
            onClick={() => setIsNavOpen(true)}
            className="absolute top-6 left-6 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Open navigation menu"
        >
            <MenuIcon className="w-6 h-6" />
        </button>
        <ModeSelector />

        <div 
          className="flex flex-col items-center justify-center cursor-pointer p-8"
          onClick={toggleIsActive}
          role="button"
          aria-label={isActive ? 'Pause timer' : 'Start timer'}
        >
          <h1 className="font-bold text-7xl sm:text-8xl md:text-9xl tracking-wider" style={{ textShadow: '0 0 20px rgba(0,255,255,0.4)' }}>
            {formatTime(timeRemaining)}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 h-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={isActive ? 'pause' : 'play'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-medium tracking-widest uppercase"
              >
                {isActive ? 'Pause' : 'Start'}
              </motion.p>
            </AnimatePresence>
             <motion.button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling timer when clicking reset
                    resetTimer();
                }}
                className="px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-widest"
                aria-label="Reset timer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                Reset
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};