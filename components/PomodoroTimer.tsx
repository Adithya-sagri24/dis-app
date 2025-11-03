import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../store/useTimerStore';

const NOTIFICATION_SOUND_URL = 'https://cdn.freesound.org/previews/220/220170_4100837-lq.mp3';

// --- Helper Components ---

const Bubbles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bottom-0 bg-cyan-400/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${5 + Math.random() * 15}px`,
          height: `${5 + Math.random() * 15}px`,
        }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: -window.innerHeight, opacity: 0 }}
        transition={{
          duration: 10 + Math.random() * 15,
          repeat: Infinity,
          repeatType: 'loop',
          delay: Math.random() * 20,
          ease: 'linear',
        }}
      />
    ))}
  </div>
);

const Waves = ({ progress }: { progress: number }) => {
  const wavePaths = [
    "M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
    "M-160 66c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
    "M-160 22c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z",
  ];
  const opacities = [0.8, 0.6, 0.4];
  const durations = [12, 15, 18];

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full h-full"
      animate={{ y: `${(1 - progress) * 100}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="absolute bottom-0 w-full">
        {wavePaths.map((path, i) => (
          <svg key={i} className="absolute bottom-0 w-full h-48" viewBox="0 0 88 44">
            <motion.path
              d={path}
              fill="rgba(0,255,255,0.1)"
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

const ModeSelector = () => {
  const { mode, setMode } = useTimerStore(state => ({ mode: state.mode, setMode: state.setMode }));
  const modes: Array<'focus' | 'shortBreak' | 'longBreak'> = ['focus', 'shortBreak', 'longBreak'];
  const labels = { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg">
      {modes.map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            mode === m ? 'text-white' : 'text-blue-100 hover:text-white'
          }`}
        >
          {mode === m && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-cyan-500/50 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{labels[m]}</span>
        </button>
      ))}
    </div>
  );
};


// --- Main Component ---

export const PomodoroTimer: React.FC = () => {
  const { mode, timeRemaining, isActive, durations, tick, toggleIsActive } = useTimerStore();
  
  const notificationSound = useMemo(() => new Audio(NOTIFICATION_SOUND_URL), []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
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
    if (timeRemaining === 0 && isActive) {
      notificationSound.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [timeRemaining, isActive, notificationSound]);

  const totalDuration = durations[mode];
  const progress = timeRemaining / totalDuration;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#87CEEB] to-[#0A1F44] overflow-hidden text-white font-sans">
      <Bubbles />
      <Waves progress={progress} />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <ModeSelector />

        <div 
          className="flex flex-col items-center justify-center cursor-pointer"
          onClick={toggleIsActive}
        >
          <p className="font-bold text-7xl sm:text-8xl md:text-9xl tracking-wider" style={{ textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>
            {formatTime(timeRemaining)}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={isActive ? 'pause' : 'play'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-lg font-medium tracking-widest uppercase"
            >
              {isActive ? 'Click to Pause' : 'Click to Start'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
