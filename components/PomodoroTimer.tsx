import React, { useEffect, useMemo, useRef } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Custom hook for playing sound
const useAudio = (url: string) => {
  const audio = useMemo(() => typeof Audio !== 'undefined' && new Audio(url), [url]);
  const play = () => {
    audio?.play().catch(e => console.error("Error playing sound:", e));
  };
  return play;
};

const ModeButton: React.FC<{
  label: string;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  currentMode: 'focus' | 'shortBreak' | 'longBreak';
  onClick: () => void;
}> = ({ label, mode, currentMode, onClick }) => {
  const isActive = mode === currentMode;
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-sm font-semibold text-white transition-colors rounded-full"
    >
      {isActive && (
        <motion.div
          layoutId="timer-mode-pill"
          className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full shadow-lg"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export const PomodoroTimer: React.FC = () => {
  const {
    mode,
    timeRemaining,
    isActive,
    durations,
    toggleIsActive,
    resetTimer,
    setMode,
    tick,
  } = useTimerStore();

  const prevMode = useRef(mode);
  const playChime = useAudio('https://cdn.pixabay.com/audio/2021/08/04/audio_bb630282b0.mp3'); // Gentle chime sound

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => tick(), 1000);
    } else if (isActive && timeRemaining <= 0) {
      tick(); // Final tick to trigger mode change
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, tick]);

  useEffect(() => {
    if (prevMode.current !== mode) {
      playChime();
    }
    prevMode.current = mode;
  }, [mode, playChime]);
  
  const totalDuration = durations[mode];
  const progress = totalDuration > 0 ? (timeRemaining / totalDuration) : 0;
  const waterLevel = 10 + progress * 90; // Water level from 10% to 100%

  // Bubbles
  const bubbles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${10 + Math.random() * 10}s`,
      delay: `${Math.random() * 10}s`,
      size: `${5 + Math.random() * 15}px`,
  })), []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden text-white select-none">
      
      {/* Mode Toggles */}
      <div className="absolute top-8 z-20 flex items-center p-2 space-x-2 bg-black/20 backdrop-blur-lg border border-white/10 rounded-full">
        <ModeButton label="Pomodoro" mode="focus" currentMode={mode} onClick={() => setMode('focus')} />
        <ModeButton label="Short Break" mode="shortBreak" currentMode={mode} onClick={() => setMode('shortBreak')} />
        <ModeButton label="Long Break" mode="longBreak" currentMode={mode} onClick={() => setMode('longBreak')} />
      </div>
      
      {/* Timer Display */}
      <div className="relative z-10 text-center cursor-pointer" onClick={toggleIsActive}>
        <h1 
          className="text-7xl sm:text-8xl md:text-9xl font-bold font-mono tracking-wider"
          style={{ textShadow: '0 0 15px rgba(0,255,255,0.4), 0 0 30px rgba(0,255,255,0.2)'}}
        >
          {formatTime(timeRemaining)}
        </h1>
        <AnimatePresence>
            <motion.div
                key={isActive ? 'pause' : 'start'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 text-lg font-semibold tracking-widest uppercase text-cyan-200/80"
            >
                {isActive ? 'Click to Pause' : 'Click to Start'}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 z-20">
         <button onClick={resetTimer} className="px-6 py-2 text-sm font-semibold uppercase tracking-wider bg-black/20 backdrop-blur-lg border border-white/10 rounded-full hover:bg-white/20 transition-colors">
            Reset
        </button>
      </div>

      {/* Wave and Bubble Animations */}
      <div className="absolute inset-0 z-0">
        {/* Bubbles */}
        <div className="absolute inset-0">
            {bubbles.map(bubble => (
                <motion.div
                    key={bubble.id}
                    className="absolute bottom-0 rounded-full bg-white/10"
                    style={{
                        left: bubble.left,
                        width: bubble.size,
                        height: bubble.size,
                    }}
                    animate={{ y: '-100vh', opacity: 0 }}
                    transition={{
                        duration: parseFloat(bubble.duration),
                        delay: parseFloat(bubble.delay),
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>

        {/* Waves */}
        <motion.div
            className="absolute bottom-0 w-full"
            animate={{ height: `${waterLevel}%` }}
            transition={{ duration: 1, ease: 'easeInOut' }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D37] to-[#1E3A8A] opacity-80" />
            
            {/* Light Reflection */}
            <motion.div 
                className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            {/* SVG Waves */}
            <svg className="absolute bottom-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <motion.path 
                    fill="#1E3A8A" 
                    fillOpacity="0.5" 
                    d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,138.7C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    animate={{ d: [
                        "M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,192C672,160,768,128,864,138.7C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                        "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,240C672,256,768,256,864,229.3C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ]}}
                    transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
                <motion.path 
                    fill="#0A1D37" 
                    fillOpacity="0.5" 
                    d="M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,224C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    animate={{ d: [
                        "M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,224C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                        "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,256C672,245,768,203,864,197.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ]}}
                    transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
            </svg>
        </motion.div>

      </div>
    </div>
  );
};