// Implemented hook tests for `useAuth`.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabaseClient';
// Fix: Use a type-only import for the User type.
import type { User } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      session: vi.fn(), // Corresponds to getSession changing to session
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signOut: vi.fn(),
    },
  },
}));

// Mock Zustand store
vi.mock('../../store/useAppStore');

const mockUseAppStore = vi.mocked(useAppStore);
const mockSupabase = vi.mocked(supabase);

const mockUser: User = {
  id: '123',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

describe('useAuth', () => {
  let store: {
    user: User | null;
    setUser: (user: User | null) => void;
    clearState: () => void;
    authLoading: boolean;
    setAuthLoading: (loading: boolean) => void;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup a mock store state for each test
    store = {
      user: null,
      setUser: vi.fn((user) => {
        store.user = user;
      }),
      clearState: vi.fn(() => {
        store.user = null;
      }),
      authLoading: true,
      setAuthLoading: vi.fn((loading) => {
          store.authLoading = loading;
      }),
    };

    mockUseAppStore.mockImplementation((selector: any) => selector(store));
  });

  it('should initialize with no user and fetch session', async () => {
    mockSupabase.auth.session.mockReturnValueOnce({ user: mockUser } as any);

    const { result } = renderHook(() => useAuth());

    // Initially, user is null from the store
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    // Wait for async getSession to resolve and state to update
    await act(async () => {
        // This flushes the promise queue
    });
    
    expect(mockSupabase.auth.session).toHaveBeenCalled();
    expect(store.setUser).toHaveBeenCalledWith(mockUser);
    expect(store.setAuthLoading).toHaveBeenCalledWith(false);
  });

  it('should update user on auth state change', () => {
    let authCallback: (event: string, session: any) => void;
    mockSupabase.auth.onAuthStateChange.mockImplementation(((callback: any) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }) as any);

    renderHook(() => useAuth());

    act(() => {
      authCallback!('SIGNED_IN', { user: mockUser });
    });

    expect(store.setUser).toHaveBeenCalledWith(mockUser);
    expect(store.setAuthLoading).toHaveBeenCalledWith(false);
    
    act(() => {
      authCallback!('SIGNED_OUT', null);
    });

    expect(store.setUser).toHaveBeenCalledWith(null);
    expect(store.setAuthLoading).toHaveBeenCalledWith(false);
  });

  it('should sign out and clear state', async () => {
    store.user = mockUser;
    (mockSupabase.auth.signOut as any).mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
    
    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    expect(store.clearState).toHaveBeenCalled();
  });
  
  it('should unsubscribe from auth state changes on unmount', () => {
    const unsubscribe = vi.fn();
    mockSupabase.auth.onAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe } },
    } as any);

    const { unmount } = renderHook(() => useAuth());

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});