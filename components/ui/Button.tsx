import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  const baseClasses =
    'w-full text-white font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  
  const glassmorphicClasses = 'bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 focus:ring-cyan-400/50';

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${glassmorphicClasses} ${className}`}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};