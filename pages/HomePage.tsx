import React from 'react';
import { PomodoroTimer } from '../components/PomodoroTimer';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full">
      <PomodoroTimer />
    </div>
  );
};
