import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="logoGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#6366f1" /> 
          <stop offset="50%" stopColor="#a855f7" /> 
          <stop offset="100%" stopColor="#ec4899" /> 
        </linearGradient>
      </defs>
      <rect
        width="32"
        height="32"
        rx="8"
        fill="url(#logoGradient)"
      />
      <path
        d="M16 24V15M16 15L10 8M16 15L22 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
