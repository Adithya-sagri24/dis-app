import React from 'react';
import { Header } from '../components/ui/Header';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { TaskSummary } from '../components/TaskSummary';

export const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in flex flex-col items-center">
      <Header 
        title="Home" 
        subtitle="Your command center for focus and productivity."
      />
      <div className="mt-8 w-full flex flex-col items-center gap-12">
        <PomodoroTimer />
        <div className="w-full max-w-sm">
          <TaskSummary />
        </div>
      </div>
    </div>
  );
};