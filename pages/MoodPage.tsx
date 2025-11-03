import React from 'react';
import { EmotionDetector } from '../components/EmotionDetector';
import { MoodDisplay } from '../components/MoodDisplay';
import { MusicRecommendations } from '../components/MusicRecommendations';
import { Header } from '../components/ui/Header';
import { MoodChart } from '../components/MoodChart';

export const MoodPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Header 
        title="Mood" 
        subtitle="Discover your emotional state and get music to match."
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-8">
            <EmotionDetector />
            <MoodChart />
        </div>

        {/* Side Column */}
        <div className="lg:col-span-2 space-y-8">
          <MoodDisplay />
          <MusicRecommendations />
        </div>

      </div>
    </div>
  );
};
