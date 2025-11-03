import React from 'react';

interface IconButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className = '', disabled = false, ...props }) => {
  const baseClasses =
    'p-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const defaultClasses =
    'text-gray-400 hover:bg-white/10 focus:ring-sky-400';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className || defaultClasses}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};