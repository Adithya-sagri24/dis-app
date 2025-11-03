import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HomePage } from '../pages/HomePage';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import { MoodPage } from '../pages/MoodPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { IconButton } from './ui/IconButton';

const routes: { [key: string]: React.ComponentType } = {
  '#/': HomePage,
  '#/tasks': TaskManagerPage,
  '#/mood': MoodPage,
  '#/analytics': AnalyticsPage,
  '#/settings': SettingsPage,
  '#/privacy': PrivacyPage,
};

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const Layout: React.FC = () => {
  const [hash, setHash] = useState(window.location.hash || '#/');
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth > 768); // Open by default on desktop

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    const handleResize = () => {
        if (window.innerWidth > 768) {
            setIsNavOpen(true);
        } else {
            setIsNavOpen(false);
        }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const Page = routes[hash] || HomePage;

  return (
    <div className="relative min-h-screen flex">
      <Navbar isOpen={isNavOpen} />
      <main 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: isNavOpen ? '16rem' : '0' }}
      >
        <div className="absolute top-4 left-4 z-20">
            <IconButton onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Toggle navigation" className="bg-black/20 backdrop-blur-sm">
                <MenuIcon />
            </IconButton>
        </div>
        <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto">
            <Page />
        </div>
      </main>
    </div>
  );
};