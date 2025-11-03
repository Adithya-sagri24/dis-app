import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header>
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-gray-300">
          {subtitle}
        </p>
      )}
    </header>
  );
};