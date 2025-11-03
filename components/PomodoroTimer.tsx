import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../store/useTimerStore';

// A gentle chime sound to play when the timer completes.
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3';

// --- Helper Components for Visual Effects ---

/**
 * Renders a collection of animated bubbles rising from the bottom of the screen.
 * Each bubble has a randomized size, position, and animation duration for a natural look.
 */
const Bubbles: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bottom-[-20px] bg-white/10 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${5 + Math.random() * 20}px`,
          height: `${5 + Math.random() * 20}px`,
        }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: '-100vh', opacity: 0 }}
        transition={{
          duration: 15 + Math.random() * 20,
          repeat: Infinity,
          repeatType: 'loop',
          delay: Math.random() * 25,
          ease: 'linear',
        }}
      />
    ))}
  </div>
);

/**
 * Renders multiple layers of animated SVG waves.
 * The entire wave container's vertical position is controlled by the timer's progress.
 * @param {number} progress - The timer progress from 1 (full) to 0 (empty).
 */
const Waves: React.FC<{ progress: number }> = ({ progress }) => {
  const wavePaths = [
    "M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
    "M-160 22c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
    "M-160 66c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z",
  ];
  const opacities = [0.2, 0.3, 0.4];
  const durations = [18, 15, 12];

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full h-full will-change-transform"
      initial={{ y: '0%' }}
      animate={{ y: `${(1 - progress) * 100}%` }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
        {/* Container for the waves themselves */}
        <div className="absolute bottom-0 left-0 w-full h-[20vh] min-h-[120px]">
            {wavePaths.map((path, i) => (
            <svg key={i} className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 176 44" preserveAspectRatio="none">
                <motion.path
                d={path}
                fill={`rgba(0, 255, 255, ${opacities[i]})`}
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


/**
 * A subtle, shimmering light effect that animates across the water's surface.
 */
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


/**
 * Renders the glassmorphic mode selection buttons (Pomodoro, Short Break, Long Break).
 */
const ModeSelector: React.FC = () => {
  const { mode, setMode } = useTimerStore(state => ({ mode: state.mode, setMode: state.setMode }));
  const modes: Array<'focus' | 'shortBreak' | 'longBreak'> = ['focus', 'shortBreak', 'longBreak'];
  const labels: Record<typeof modes[number], string> = { focus: 'Pomodoro', shortBreak: 'Short Break', longBreak: 'Long Break' };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/20 backdrop-blur-md rounded-full shadow-lg z-20">
      {modes.map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
            mode === m ? 'text-white' : 'text-blue-100/80 hover:text-white'
          }`}
          aria-pressed={mode === m}
        >
          {mode === m && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-white/20 rounded-full"
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
  const { mode, timeRemaining, isActive, durations, tick, toggleIsActive } = useTimerStore();
  
  // Memoize the Audio object to prevent re-creation on every render.
  const notificationSound = useMemo(() => new Audio(NOTIFICATION_SOUND_URL), []);

  // Effect to handle the timer countdown interval.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);

  // Effect to play a notification sound when the timer reaches zero.
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      notificationSound.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [timeRemaining, isActive, notificationSound]);

  const totalDuration = durations[mode];
  // Ensure progress doesn't divide by zero if a duration is ever not set.
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#87CEEB] to-[#0A1F44] overflow-hidden text-white font-['Poppins',_sans-serif]">
      <Waves progress={progress} />
      <LightReflection />
      <Bubbles />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
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
          <AnimatePresence mode="wait">
            <motion.p
              key={isActive ? 'pause' : 'play'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-lg font-medium tracking-widest uppercase"
            >
              {isActive ? 'Pause' : 'Start'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
