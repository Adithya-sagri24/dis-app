import React from 'react';

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  const baseClasses =
    'w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  
  const defaultClasses = 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className || defaultClasses}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
