import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive }) => {
  const activeClasses = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
  const inactiveClasses = 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300';
  
  return (
    <a 
      href={href} 
      className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </a>
  );
};

interface NavbarProps {
  activeRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeRoute }) => {
    const { signOut, user } = useAuth();

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col justify-between shadow-lg flex-shrink-0">
            <div>
                <div className="p-2 mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        You Decide
                    </h1>
                </div>
                <nav className="space-y-2">
                    <NavLink href="#" label="Dashboard" isActive={activeRoute === '#'} />
                    <NavLink href="#/tasks" label="Tasks" isActive={activeRoute === '#/tasks'} />
                    <NavLink href="#/analytics" label="Analytics" isActive={activeRoute === '#/analytics'} />
                    <NavLink href="#/settings" label="Settings" isActive={activeRoute === '#/settings'} />
                </nav>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={user?.email ?? 'No user'}>
                        {user?.email}
                    </p>
                </div>
                <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 mt-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-medium transition-colors duration-150"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
