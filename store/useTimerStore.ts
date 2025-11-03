import { create } from 'zustand';

type Mode = 'focus' | 'shortBreak' | 'longBreak';

interface Durations {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface TimerState {
  mode: Mode;
  timeRemaining: number;
  isActive: boolean;
  pomodoros: number;
  durations: Durations;
  setMode: (mode: Mode) => void;
  toggleIsActive: () => void;
  tick: () => void;
  resetTimer: () => void;
  setDurations: (newDurations: Partial<Durations>) => void;
}

const POMODOROS_BEFORE_LONG_BREAK = 4;

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  timeRemaining: 25 * 60,
  isActive: false,
  pomodoros: 0,
  durations: {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },

  setMode: (mode) => {
    set({
      mode,
      isActive: false,
      timeRemaining: get().durations[mode],
    });
  },

  toggleIsActive: () => {
    set(state => ({ isActive: !state.isActive }));
  },

  resetTimer: () => {
    const currentMode = get().mode;
    set({
      isActive: false,
      timeRemaining: get().durations[currentMode],
    });
  },

  tick: () => {
    const { timeRemaining, mode, pomodoros, durations } = get();
    
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      let nextMode: Mode;
      let newPomodoros = pomodoros;

      if (mode === 'focus') {
        newPomodoros += 1;
        if (newPomodoros > 0 && newPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0) {
          nextMode = 'longBreak';
        } else {
          nextMode = 'shortBreak';
        }
      } else { // After any break
        nextMode = 'focus';
      }

      set({
        mode: nextMode,
        isActive: false,
        timeRemaining: durations[nextMode],
        pomodoros: newPomodoros,
      });
    }
  },

  setDurations: (newDurations) => {
    const currentDurations = get().durations;
    const updatedDurations = { ...currentDurations, ...newDurations };
    set({ durations: updatedDurations });

    // If the timer is not active, update the current timeRemaining to the new duration
    if (!get().isActive) {
        const currentMode = get().mode;
        set({ timeRemaining: updatedDurations[currentMode] });
    }
  }
}));