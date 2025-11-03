import React from 'react';
import { motion } from 'framer-motion';

interface IconButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className = '', disabled = false, ...props }) => {
  const baseClasses =
    'p-2.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const glassmorphicClasses =
    'bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 text-gray-200 focus:ring-cyan-400';

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${glassmorphicClasses} ${className}`}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};