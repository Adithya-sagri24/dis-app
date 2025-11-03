// Implemented hook tests for `useAuth`.
import { renderHook, act } from '@testing-library/react';
// Fix: Import `Mock` type from vitest to resolve namespace error.
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { useAuth } from '../useAuth';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabaseClient';
// Fix: Use a type-only import for the User type.
import type { User, Session } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(), // Fix: Changed from session to getSession for v2
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
    // Fix: Mock getSession (async) instead of session (sync)
    // Fix: Cast to Mock to provide type information for the mocked function.
    (mockSupabase.auth.getSession as Mock).mockResolvedValue({ data: { session: { user: mockUser } } });

    const { result } = renderHook(() => useAuth());

    // Initially, user is null from the store
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    // Wait for async getSession to resolve and state to update
    await act(async () => {
        // This flushes the promise queue
    });
    
    // Fix: Expect getSession to have been called
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
    expect(store.setUser).toHaveBeenCalledWith(mockUser);
    expect(store.setAuthLoading).toHaveBeenCalledWith(false);
  });

  it('should update user on auth state change', () => {
    let authCallback: (event: string, session: Session | null) => void;
    // Fix: Cast to Mock to provide type information for the mocked function.
    (mockSupabase.auth.onAuthStateChange as Mock).mockImplementation(((callback: any) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }) as any);

    renderHook(() => useAuth());

    act(() => {
      authCallback!('SIGNED_IN', { user: mockUser } as Session);
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
    // Fix: Cast to Mock to provide type information for the mocked function.
    (mockSupabase.auth.onAuthStateChange as Mock).mockReturnValueOnce({
      data: { subscription: { unsubscribe } },
    } as any);

    const { unmount } = renderHook(() => useAuth());

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});