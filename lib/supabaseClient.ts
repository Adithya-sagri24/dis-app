// Fix: Add reference to Vite client types to inform TypeScript about `import.meta.env`.
/// <reference types="vite/client" />

// Fix: Augment the global ImportMetaEnv interface to include environment variables from .env files, preventing type conflicts with Vite's client types.
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_KEY: string;
    readonly VITE_SPOTIFY_CLIENT_ID: string;
    readonly VITE_REDIRECT_URI: string;
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);