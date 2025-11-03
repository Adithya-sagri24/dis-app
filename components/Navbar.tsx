import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';
import { motion } from 'framer-motion';

const NavLink: React.FC<{ href: string; children: React.ReactNode; isActive: boolean }> = ({ href, children, isActive }) => {
    return (
        <a 
            href={href} 
            className={`flex items-center w-full text-lg px-4 py-3 rounded-xl transition-colors duration-200 relative ${
                isActive 
                ? 'text-white font-semibold' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-cyan-400/20 shadow-[0_0_15px_rgba(0,224,255,0.4)] border border-cyan-300/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </a>
    );
};

const navItems = [
    { href: '#/', label: 'Home' },
    { href: '#/mood', label: 'Mood' },
    { href: '#/tasks', label: 'Tasks' },
    { href: '#/analytics', label: 'Analytics' },
    { href: '#/settings', label: 'Settings' },
];

interface NavbarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
    const { user, signOut } = useAuth();
    const [activeHash, setActiveHash] = React.useState(window.location.hash || '#/');

    React.useEffect(() => {
        const onHashChange = () => {
            setActiveHash(window.location.hash || '#/');
            if (window.innerWidth < 768) setIsOpen(false); // Close on mobile nav
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [setIsOpen]);

    const variants = {
        open: { x: 0 },
        closed: { x: '-100%' },
    };

    return (
        <motion.aside
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={variants}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed top-0 left-0 h-full w-64 bg-black/30 backdrop-blur-2xl border-r border-white/10 flex flex-col p-6 z-40"
        >
            <header className="flex items-center space-x-3 mb-10">
                <Logo className="h-9 w-9" />
                <h1 className="text-2xl font-bold text-white">
                    Moodora
                </h1>
            </header>
            
            <nav className="flex-1 flex flex-col space-y-3">
                {navItems.map(item => (
                    <NavLink key={item.href} href={item.href} isActive={activeHash === item.href}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            
            <footer className="mt-auto space-y-4">
                <hr className="border-white/10" />
                {user && (
                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-300 truncate" title={user.email}>
                            {user.email}
                        </p>
                         <button 
                            onClick={signOut} 
                            className="w-auto text-sm text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </footer>
        </motion.aside>
    );
};