import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HomePage } from '../pages/HomePage';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import { MoodPage } from '../pages/MoodPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { PrivacyPage } from '../pages/PrivacyPage';

const routes: { [key: string]: React.ComponentType } = {
  '': HomePage,
  '/': HomePage,
  '/tasks': TaskManagerPage,
  '/mood': MoodPage,
  '/analytics': AnalyticsPage,
  '/settings': SettingsPage,
  '/privacy': PrivacyPage,
};

export const Layout: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash.substring(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.substring(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Normalize hash to handle cases with or without a leading slash
  const cleanHash = hash.startsWith('/') ? hash : `/${hash}`;
  const Page = routes[cleanHash] || HomePage; // Fallback to HomePage

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-100 flex">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Page />
      </main>
    </div>
  );
};
