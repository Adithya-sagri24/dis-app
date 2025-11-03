import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HomePage } from '../pages/HomePage';
import { MoodPage } from '../pages/MoodPage';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { PrivacyPage } from '../pages/PrivacyPage';

const routes: Record<string, React.FC> = {
  '#/home': HomePage,
  '#/mood': MoodPage,
  '#/tasks': TaskManagerPage,
  '#/settings': SettingsPage,
  '#/analytics': AnalyticsPage,
  '#/privacy': PrivacyPage,
};

type RouteKeys = keyof typeof routes;

export const Layout: React.FC = () => {
    // Helper to get the correct page from the hash, defaulting to '#/home'
    const getPageFromHash = (): RouteKeys => {
        const hash = window.location.hash;
        if (routes[hash as RouteKeys]) {
            return hash as RouteKeys;
        }
        // Default for empty hash or invalid hash
        return '#/home';
    }

    const [page, setPage] = useState<RouteKeys>(getPageFromHash());

    useEffect(() => {
        const handleHashChange = () => {
            setPage(getPageFromHash());
        };

        window.addEventListener('hashchange', handleHashChange, false);
        // Also update on initial load in case the hash was already there
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const PageComponent = routes[page] || HomePage;
    const isHomePage = page === '#/home';

    if (isHomePage) {
        return <PageComponent />;
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#0A1F44] text-white font-sans">
            <Navbar activeRoute={page} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                <PageComponent />
            </main>
        </div>
    );
};