import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';
import { IconButton } from './ui/IconButton';

const NavLink: React.FC<{ href: string; children: React.ReactNode; icon: React.ReactNode }> = ({ href, children, icon }) => {
    // This is a simple way to track active state for a hash-based router
    const [isActive, setIsActive] = React.useState(window.location.hash === href);

    React.useEffect(() => {
        const onHashChange = () => {
            setIsActive(window.location.hash === href);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [href]);
    
    return (
        <a href={href} className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
            {icon}
            <span className="font-medium">{children}</span>
        </a>
    );
};

// Icons for navigation
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const MoodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


export const Navbar: React.FC = () => {
    const { user, signOut } = useAuth();

    return (
        <aside className="w-64 bg-gray-900/50 backdrop-blur-lg border-r border-white/10 flex-col p-4 space-y-4 hidden md:flex">
            <header className="flex items-center space-x-2 px-3">
                <Logo className="h-8 w-8" />
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                    You Decide
                </h1>
            </header>
            
            <nav className="flex-1 space-y-2">
                <NavLink href="#/" icon={<TimerIcon />}>Timer</NavLink>
                <NavLink href="#/tasks" icon={<TasksIcon />}>Tasks</NavLink>
                <NavLink href="#/mood" icon={<MoodIcon />}>Mood</NavLink>
                <NavLink href="#/analytics" icon={<AnalyticsIcon />}>Analytics</NavLink>
                <NavLink href="#/settings" icon={<SettingsIcon />}>Settings</NavLink>
            </nav>
            
            <footer className="mt-auto">
                {user && (
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate" title={user.email}>
                                {user.email}
                            </p>
                        </div>
                        <IconButton onClick={signOut} aria-label="Sign out" className="text-red-400 hover:bg-red-500/20 ml-2">
                            <LogoutIcon />
                        </IconButton>
                    </div>
                )}
            </footer>
        </aside>
    );
};
