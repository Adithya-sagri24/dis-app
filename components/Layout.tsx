import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { DashboardPage } from '../pages/DashboardPage';
import { TaskManagerPage } from '../pages/TaskManagerPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { PrivacyPage } from '../pages/PrivacyPage';

const routes: Record<string, React.FC> = {
  '#': DashboardPage,
  '#/tasks': TaskManagerPage,
  '#/settings': SettingsPage,
  '#/analytics': AnalyticsPage,
  '#/privacy': PrivacyPage,
};

type RouteKeys = keyof typeof routes;

export const Layout: React.FC = () => {
    const [page, setPage] = useState<RouteKeys>(window.location.hash as RouteKeys || '#');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash as RouteKeys;
            setPage(routes[hash] ? hash : '#');
        };

        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange(); // Set initial page on load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const PageComponent = routes[page] || DashboardPage;

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Navbar activeRoute={page} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                <PageComponent />
            </main>
        </div>
    );
};
