// Implemented unit tests for the Spotify service.
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getRecommendations } from '../spotifyService';

// Mocking global fetch
global.fetch = vi.fn();

describe('spotifyService', () => {
    
  beforeEach(() => {
    // Reset import.meta.env for each test to ensure isolation
    vi.stubGlobal('import.meta', {
        env: {
          VITE_SPOTIFY_CLIENT_ID: 'test_client_id',
          VITE_SPOTIFY_CLIENT_SECRET: 'test_client_secret',
        },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(fetch).mockClear();
  });

  it('should fetch recommendations successfully', async () => {
    // Mock the token response
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'test_token' }), {
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
    
    const recommendations = await getRecommendations(0.5, 0.8);

    expect(fetch).toHaveBeenCalledTimes(2);

    // Check token call
    expect(fetch).toHaveBeenNthCalledWith(1,
      'https://accounts.spotify.com/api/token',
      expect.objectContaining({
        method: 'POST',
        body: 'grant_type=client_credentials',
      })
    );
    
    // Check recommendations call
    const expectedParams = new URLSearchParams({
        limit: '10',
        seed_genres: 'pop,rock,electronic,hip-hop,indie',
        target_valence: '0.75', // (0.5 + 1) / 2
        target_energy: '0.90', // (0.8 + 1) / 2
    }).toString();
    expect(fetch).toHaveBeenNthCalledWith(2,
      `https://api.spotify.com/v1/recommendations?${expectedParams}`,
      expect.objectContaining({
        headers: { Authorization: 'Bearer test_token' },
      })
    );

    expect(recommendations).toEqual(mockTracks);
  });

  it('should throw an error if fetching the access token fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ error_description: 'Invalid credentials' }), { status: 400 })
    );

    await expect(getRecommendations(0.5, 0.8)).rejects.toThrow(
      'Failed to get Spotify token: Invalid credentials'
    );
  });

  it('should throw an error if fetching recommendations fails', async () => {
    // Mock successful token response
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'test_token' }), { status: 200 })
    );
    // Mock failed recommendations response
    vi.mocked(fetch).mockResolvedValueOnce(
        new Response(null, { status: 500, statusText: 'Server Error' })
    );
    
    await expect(getRecommendations(0.5, 0.8)).rejects.toThrow(
      'Failed to fetch Spotify recommendations.'
    );
  });
  
  it('should throw an error if Spotify credentials are not configured', async () => {
     vi.stubGlobal('import.meta', {
        env: {
          VITE_SPOTIFY_CLIENT_ID: '',
          VITE_SPOTIFY_CLIENT_SECRET: '',
        },
     });

    await expect(getRecommendations(0.5, 0.8)).rejects.toThrow(
      'Spotify API credentials are not configured in environment variables.'
    );
  });
});
