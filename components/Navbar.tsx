import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive }) => {
  const activeClasses = 'bg-white/20 text-white';
  const inactiveClasses = 'hover:bg-white/10 text-slate-200';
  
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
        <aside className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-3 p-2 mb-8">
                    <Logo className="w-9 h-9" />
                    <h1 className="text-2xl font-bold text-white">
                        You Decide
                    </h1>
                </div>
                <nav className="space-y-2">
                    <NavLink href="#/home" label="Home" isActive={activeRoute === '#/home'} />
                    <NavLink href="#/mood" label="Mood" isActive={activeRoute === '#/mood'} />
                    <NavLink href="#/tasks" label="Tasks" isActive={activeRoute === '#/tasks'} />
                    <NavLink href="#/analytics" label="Analytics" isActive={activeRoute === '#/analytics'} />
                    <NavLink href="#/settings" label="Settings" isActive={activeRoute === '#/settings'} />
                </nav>
            </div>
            <div className="border-t border-white/20 pt-4">
                <div className="px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-white truncate" title={user?.email ?? 'No user'}>
                        {user?.email}
                    </p>
                </div>
                <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 mt-2 rounded-lg text-red-300 hover:bg-red-500/20 font-medium transition-colors duration-150"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
