import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HomePage } from '../pages/HomePage';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import { MoodPage } from '../pages/MoodPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { IconButton } from './ui/IconButton';
import { motion } from 'framer-motion';

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
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash || '#/');
    const handleResize = () => {
        if (window.innerWidth > 768) setIsNavOpen(true);
        else setIsNavOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('resize', handleResize);
    
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const Page = routes[hash] || HomePage;
  const isHomePage = hash === '#/';

  const sidebarWidth = isNavOpen ? '256px' : '0px';

  return (
    <div className="relative min-h-screen flex w-full">
      <Navbar isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
      
      <motion.main 
        className="flex-1 flex flex-col h-screen"
        animate={{ paddingLeft: window.innerWidth > 768 ? sidebarWidth : '0px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {!isHomePage && (
          <div className="absolute top-4 left-4 z-30">
            <IconButton onClick={() => setIsNavOpen(!isNavOpen)} aria-label="Toggle navigation">
                <MenuIcon />
            </IconButton>
          </div>
        )}
        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full h-full overflow-y-auto">
            <Page />
        </div>
      </motion.main>
    </div>
  );
};