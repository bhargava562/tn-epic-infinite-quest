import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 3D Temple Crown Logo */}
      <div className="relative w-24 h-24 mb-4">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gold/30 rounded-full blur-xl animate-pulse" />
        
        {/* Main logo container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Temple crown shape */}
          <svg
            viewBox="0 0 100 100"
            className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,193,7,0.8)]"
          >
            {/* Circuit pattern base */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(45, 100%, 60%)" />
                <stop offset="50%" stopColor="hsl(45, 100%, 51%)" />
                <stop offset="100%" stopColor="hsl(45, 100%, 40%)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Temple crown silhouette */}
            <path
              d="M50 10 L60 25 L70 25 L75 40 L80 40 L85 55 L90 70 L85 70 L80 85 L20 85 L15 70 L10 70 L15 55 L20 40 L25 40 L30 25 L40 25 Z"
              fill="url(#goldGradient)"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />
            
            {/* Circuit lines */}
            <g stroke="hsl(232, 70%, 15%)" strokeWidth="1" fill="none" opacity="0.6">
              <line x1="50" y1="30" x2="50" y2="70" />
              <line x1="35" y1="50" x2="65" y2="50" />
              <circle cx="50" cy="50" r="8" />
              <circle cx="35" cy="50" r="3" />
              <circle cx="65" cy="50" r="3" />
              <circle cx="50" cy="35" r="3" />
              <circle cx="50" cy="65" r="3" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
