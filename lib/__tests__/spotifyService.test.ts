// Implemented unit tests for the Spotify service.
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getRecommendations } from '../spotifyService';
import { useAppStore } from '../../store/useAppStore';

// Mocking global fetch
// Fix: Replaced 'global' with 'window' which is appropriate for a jsdom environment.
window.fetch = vi.fn();

// Mocking the zustand store
vi.mock('../../store/useAppStore');
const mockUseAppStore = vi.mocked(useAppStore);


describe('spotifyService', () => {
    
  const mockTokens = {
    access_token: 'test_token',
    refresh_token: 'test_refresh_token',
    expires_at: Date.now() + 3600 * 1000, // Expires in 1 hour
  };
  
  beforeEach(() => {
    // Mock the getState function to return our mock tokens
    mockUseAppStore.getState = vi.fn().mockReturnValue({
      spotifyTokens: mockTokens,
      setSpotifyTokens: vi.fn(),
    });

    vi.mocked(fetch).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch recommendations successfully without refreshing token', async () => {
    const mockTracks = { tracks: [{ id: '1', name: 'Test Track' }] };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockTracks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const recommendations = await getRecommendations(0.5, 0.8);

    // Should only be called once for the recommendations
    expect(fetch).toHaveBeenCalledTimes(1);

    const expectedParams = new URLSearchParams({
      limit: '10',
      seed_genres: 'pop,rock,electronic,hip-hop,indie',
      target_valence: '0.75', // (0.5 + 1) / 2
      target_energy: '0.90', // (0.8 + 1) / 2
    }).toString();
    expect(fetch).toHaveBeenCalledWith(
      `https://api.spotify.com/v1/recommendations?${expectedParams}`,
      expect.objectContaining({
        headers: { Authorization: `Bearer ${mockTokens.access_token}` },
      })
    );

    expect(recommendations).toEqual(mockTracks);
  });

  it('should refresh token if expired and then fetch recommendations', async () => {
    const expiredTokens = {
        ...mockTokens,
        expires_at: Date.now() - 1000 // Expired 1 second ago
    };
    const newTokensResponse = {
        access_token: 'new_test_token',
        expires_in: 3600
    };
    const setSpotifyTokensMock = vi.fn();
    // For the first call inside `fetchWithAuth`, return the expired token
    mockUseAppStore.getState = vi.fn().mockReturnValue({ 
        spotifyTokens: expiredTokens, 
        setSpotifyTokens: setSpotifyTokensMock 
    });


    // Mock the refresh token response
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(newTokensResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    );
    
    // Mock the recommendations response
    const mockTracks = { tracks: [{ id: '1', name: 'Test Track' }] };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockTracks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await getRecommendations(0.5, 0.8);

    expect(fetch).toHaveBeenCalledTimes(2);

    // Check refresh call
    expect(fetch).toHaveBeenNthCalledWith(1,
      'https://accounts.spotify.com/api/token',
      expect.objectContaining({
        method: 'POST',
      })
    );
    expect(setSpotifyTokensMock).toHaveBeenCalled();

    // Check recommendations call
    const expectedParams = new URLSearchParams({
      limit: '10',
      seed_genres: 'pop,rock,electronic,hip-hop,indie',
      target_valence: '0.75',
      target_energy: '0.90',
    }).toString();
    expect(fetch).toHaveBeenNthCalledWith(2,
      `https://api.spotify.com/v1/recommendations?${expectedParams}`,
      expect.objectContaining({
        headers: { Authorization: `Bearer ${newTokensResponse.access_token}` },
      })
    );
  });

  it('should throw an error if not authenticated', async () => {
     mockUseAppStore.getState = vi.fn().mockReturnValue({ spotifyTokens: null });

    await expect(getRecommendations(0.5, 0.8)).rejects.toThrow(
      'Not authenticated with Spotify.'
    );
  });
  
  it('should throw an error if fetching recommendations fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(null, { status: 500, statusText: 'Server Error' })
    );
    
    await expect(getRecommendations(0.5, 0.8)).rejects.toThrow(
      'Spotify API request failed: Server Error'
    );
  });
});