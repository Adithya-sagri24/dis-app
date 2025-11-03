import { User } from '@supabase/supabase-js';

export interface Decision {
  question: string;
  optionA: string;
  optionB: string;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

// Corresponds to the output from face-api.js .withFaceExpressions()
export interface EmotionExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

// Represents the processed mood based on expressions
export interface Mood {
  emotion: string; // The dominant emotion (e.g., 'happy', 'sad')
  valence: number; // Pleasantness, from -1 (unpleasant) to 1 (pleasant)
  energy: number;  // Arousal, from -1 (calm) to 1 (energetic)
  timestamp?: number; // Optional timestamp for history
}

export interface PomodoroState {
    isActive: boolean;
    mode: 'work' | 'break';
    timeRemaining: number;
}

export interface WeeklyMoodSummary {
    day: string;
    avg_valence: number;
    avg_energy: number;
}

export interface SpotifyTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export interface SpotifyUser {
    display_name: string;
    id: string;
}

export interface AppState {
    user: User | null;
    currentMood: Mood | null;
    decision: Decision | null;
    logMoodData: boolean; // For privacy opt-out
    moodHistory: Mood[]; // For live dashboard chart
    spotifyTokens: SpotifyTokens | null;
    spotifyUser: SpotifyUser | null;
    authLoading: boolean; // To track initial session fetch
    setUser: (user: User | null) => void;
    setCurrentMood: (mood: Mood) => void;
    setDecision: (decision: Decision) => void;
    setLogMoodData: (log: boolean) => void;
    addMoodToHistory: (mood: Mood) => void;
    setSpotifyTokens: (tokens: SpotifyTokens | null) => void;
    setSpotifyUser: (user: SpotifyUser | null) => void;
    setAuthLoading: (loading: boolean) => void;
    clearState: () => void;
}