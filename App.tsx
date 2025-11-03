import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { getAccessToken, getProfile } from './lib/spotifyService';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setSpotifyUser } = useAppStore();

  useEffect(() => {
    // This effect handles the redirect back from Spotify's auth
    const handleAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          // Exchange code for token
          await getAccessToken(code);
          // Fetch user profile
          const profile = await getProfile();
          setSpotifyUser({ display_name: profile.display_name, id: profile.id });
        } catch (error) {
          console.error("Spotify auth failed:", error);
        } finally {
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleAuthRedirect();
  }, [setSpotifyUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-white animate-pulse">Loading Application...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="App">
      <Layout />
    </div>
  );
};

export default App;