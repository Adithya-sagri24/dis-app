import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types';

const MAX_HISTORY_LENGTH = 50; // Keep last ~20 seconds of data (50 * 400ms)

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      currentMood: null,
      decision: null,
      logMoodData: true, // Opt-in by default
      moodHistory: [],
      spotifyTokens: null,
      spotifyUser: null,
      authLoading: true, // Start in a loading state
      setUser: (user) => set({ user }),
      setCurrentMood: (mood) => set({ currentMood: mood }),
      setDecision: (decision) => set({ decision }),
      setLogMoodData: (log) => set({ logMoodData: log }),
      setSpotifyTokens: (tokens) => set({ spotifyTokens: tokens }),
      setSpotifyUser: (user) => set({ spotifyUser: user }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      addMoodToHistory: (mood) => {
        const history = [...get().moodHistory, { ...mood, timestamp: Date.now() }];
        if (history.length > MAX_HISTORY_LENGTH) {
          history.shift(); // Remove the oldest entry
        }
        set({ moodHistory: history });
      },
      clearState: () => set({ 
          user: null, 
          currentMood: null, 
          decision: null, 
          moodHistory: [],
          spotifyTokens: null,
          spotifyUser: null,
      }),
    }),
    {
      name: 'you-decide-storage', // Name of the item in localStorage
      // Persist user preferences and session tokens
      partialize: (state) => ({ 
          logMoodData: state.logMoodData,
          spotifyTokens: state.spotifyTokens,
          spotifyUser: state.spotifyUser,
      }), 
    }
  )
);