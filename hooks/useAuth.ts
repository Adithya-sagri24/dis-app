import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, setUser, clearState, authLoading, setAuthLoading } = useAppStore();

  useEffect(() => {
    // 1. Check for an active session on initial load
    const checkSession = async () => {
      // Fix: Replaced sync session() with async getSession() for Supabase v2 compatibility.
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };
    
    checkSession();

    // 2. Listen for authentication state changes
    // Fix: This is valid for v2. The original error was likely a cascade from the getSession error.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        // Set loading to false on any auth event, like sign-in or sign-out
        setAuthLoading(false);
      }
    );

    // 3. Unsubscribe from the listener on cleanup
    return () => subscription.unsubscribe();
  }, [setUser, setAuthLoading]);

  const signOut = async () => {
    // Fix: The `signOut` method is correct for Supabase v2. The original error was likely a cascade error.
    await supabase.auth.signOut();
    clearState();
  };

  return {
    user,
    signOut,
    isAuthenticated: !!user,
    isLoading: authLoading,
  };
};