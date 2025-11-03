import { useAppStore } from '../store/useAppStore';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

// Helper to generate a random string for the code verifier
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Helper to generate the code challenge from the code verifier
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// 1. Redirect user to Spotify for authorization
export const redirectToAuth = async () => {
  const codeVerifier = generateRandomString(64);
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'user-read-private user-read-email ugc-image-upload',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

// 2. Exchange authorization code for an access token
export const getAccessToken = async (code: string) => {
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    throw new Error('Code verifier not found in session storage.');
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange authorization code for token.');
  }
  const data = await response.json();
  
  // Set tokens in global state
  useAppStore.getState().setSpotifyTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
  });

  sessionStorage.removeItem('spotify_code_verifier');
};

// API call helper
const fetchWithAuth = async (url: string) => {
    let { spotifyTokens, setSpotifyTokens } = useAppStore.getState();

    if (!spotifyTokens) throw new Error('Not authenticated with Spotify.');

    // Check if token is expired
    if (Date.now() > spotifyTokens.expires_at) {
        // Refresh the token
        const response = await fetch(SPOTIFY_TOKEN_URL, {
             method: 'POST',
             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
             body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: spotifyTokens.refresh_token,
                client_id: clientId,
             }),
        });
        if (!response.ok) throw new Error("Failed to refresh token.");

        const data = await response.json();
        const newTokens = {
            access_token: data.access_token,
            refresh_token: data.refresh_token || spotifyTokens.refresh_token,
            expires_at: Date.now() + data.expires_in * 1000,
        };
        setSpotifyTokens(newTokens);
        spotifyTokens = newTokens;
    }

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${spotifyTokens.access_token}` },
    });
    
    if (!response.ok) throw new Error(`Spotify API request failed: ${response.statusText}`);
    return response.json();
};

export const getProfile = async () => {
    return await fetchWithAuth(`${SPOTIFY_API_BASE_URL}/me`);
};


export const getRecommendations = async (valence: number, energy: number) => {
    const targetValence = (valence + 1) / 2;
    const targetEnergy = (energy + 1) / 2;

    const params = new URLSearchParams({
        limit: '10',
        seed_genres: 'pop,rock,electronic,hip-hop,indie',
        target_valence: targetValence.toFixed(2),
        target_energy: targetEnergy.toFixed(2),
    });

    return await fetchWithAuth(`${SPOTIFY_API_BASE_URL}/recommendations?${params.toString()}`);
};