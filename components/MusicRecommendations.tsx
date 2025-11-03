import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useDebounce } from '../hooks/useDebounce';
import { getRecommendations, redirectToAuth } from '../lib/spotifyService';
import { getEmotionRegulationTarget } from '../lib/emotionUtils';
import { Button } from './ui/Button';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
}

export const MusicRecommendations: React.FC = () => {
  const { currentMood, spotifyTokens, spotifyUser } = useAppStore((state) => ({
      currentMood: state.currentMood,
      spotifyTokens: state.spotifyTokens,
      spotifyUser: state.spotifyUser,
  }));
  const debouncedMood = useDebounce(currentMood, 1500); // Debounce for 1.5 seconds
  
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!debouncedMood || !spotifyTokens) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Emotion Regulation Logic: Get targets to balance the mood
        const target = getEmotionRegulationTarget(debouncedMood.emotion);
        const data = await getRecommendations(target.valence, target.energy);
        setRecommendations(data.tracks || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load music.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [debouncedMood, spotifyTokens]); // Refetch when the debounced mood or token changes

  const renderContent = () => {
      if (!spotifyTokens) {
          return (
              <div className="text-center">
                  <p className="mb-4 text-gray-300">Connect Spotify to get music recommendations based on your mood.</p>
                  <Button onClick={redirectToAuth} className="w-auto px-6 !bg-green-600 hover:!bg-green-700 focus:!ring-green-400">
                      Connect Spotify
                  </Button>
              </div>
          );
      }

      return (
        <>
            {loading && <p className="text-center text-gray-300">Finding tracks for you...</p>}
            {error && <p className="text-center text-red-400">Error: {error}</p>}
            {!loading && !error && recommendations.length === 0 && <p className="text-center text-gray-300">No recommendations available. Waiting for mood detection.</p>}
            {recommendations.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {recommendations.map((track) => (
                    <a
                    key={track.id}
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                    <img 
                        src={track.album.images[2]?.url || ''}
                        alt={track.name}
                        className="w-12 h-12 rounded-lg mr-4 object-cover"
                    />
                    <div className="overflow-hidden">
                        <p className="font-semibold text-gray-100 truncate">{track.name}</p>
                        <p className="text-sm text-gray-300 truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                        </p>
                    </div>
                    </a>
                ))}
                </div>
            )}
        </>
      );
  }

  return (
    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-100">
            Music to Balance Your Mood
        </h3>
        {spotifyUser && (
            <span className="text-sm text-gray-300">
                Connected
            </span>
        )}
      </div>
      {renderContent()}
    </div>
  );
};