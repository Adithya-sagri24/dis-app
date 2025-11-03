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
    'p-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const defaultClasses =
    'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:ring-blue-500';

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