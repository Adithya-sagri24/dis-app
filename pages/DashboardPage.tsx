import React from 'react';
import { MoodDisplay } from '../components/MoodDisplay';
import { MusicRecommendations } from '../components/MusicRecommendations';
import { Header } from '../components/ui/Header';
import { MoodChart } from '../components/MoodChart';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { TaskSummary } from '../components/TaskSummary';

export const DashboardPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Header 
        title="Dashboard" 
        subtitle="Your real-time command center for focus and well-being."
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <MoodChart />
            <MusicRecommendations />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <MoodDisplay />
          <PomodoroTimer />
          <TaskSummary />
        </div>

      </div>
    </div>
  );
};
