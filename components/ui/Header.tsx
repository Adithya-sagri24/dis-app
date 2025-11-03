import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </header>
  );
};