// Fix: Manually define types for `import.meta.env` to resolve errors where `vite/client` types cannot be found.
// This ensures that TypeScript recognizes the `env` property on `import.meta` and the specific environment variables.
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_KEY: string;
    readonly VITE_SPOTIFY_CLIENT_ID: string;
    readonly VITE_REDIRECT_URI: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
