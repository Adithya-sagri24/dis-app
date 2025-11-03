import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, setUser, clearState, authLoading, setAuthLoading } = useAppStore();

  useEffect(() => {
    // 1. Check for an active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // 2. Listen for authentication state changes
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