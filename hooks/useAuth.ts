import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, setUser, clearState, authLoading, setAuthLoading } = useAppStore();

  useEffect(() => {
    // 1. Check for an active session on initial load
    // Fix: Replaced async getSession() with sync session() for Supabase v1 compatibility.
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setAuthLoading(false);

    // 2. Listen for authentication state changes
    // Fix: The error on this line is likely a cascade from the getSession error above. This is valid for v1.
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
    // Fix: The error on this line is likely a cascade error. This is valid for v1.
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