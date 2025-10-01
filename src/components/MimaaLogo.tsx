import React from 'react';

interface MimaaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const MimaaLogo: React.FC<MimaaLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo SVG */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="url(#gradient1)"
            className="drop-shadow-lg"
          />
          
          {/* Mother and baby silhouette */}
          <g transform="translate(60, 40)">
            {/* Mother's head */}
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="#E91E63"
            />
            
            {/* Mother's body */}
            <ellipse
              cx="25"
              cy="70"
              rx="18"
              ry="35"
              fill="#E91E63"
            />
            
            {/* Baby */}
            <circle
              cx="35"
              cy="50"
              r="12"
              fill="#E91E63"
            />
            
            {/* Baby's body */}
            <ellipse
              cx="35"
              cy="65"
              rx="8"
              ry="15"
              fill="#E91E63"
            />
            
            {/* Golden rays from baby */}
            <g stroke="#FFD700" strokeWidth="2" fill="none">
              <line x1="35" y1="35" x2="35" y2="25" />
              <line x1="30" y1="38" x2="25" y2="35" />
              <line x1="40" y1="38" x2="45" y2="35" />
            </g>
          </g>
          
          {/* Flowing hair/embrace */}
          <path
            d="M 30 50 Q 20 30 40 20 Q 60 15 80 25 Q 100 35 120 30 Q 140 25 160 35 Q 170 40 165 60 Q 160 80 140 85 Q 120 90 100 85 Q 80 80 60 85 Q 40 90 30 70 Z"
            fill="#BA68C8"
            opacity="0.8"
          />
          
          {/* Leaves */}
          <g fill="#81C784">
            <ellipse cx="40" cy="30" rx="8" ry="15" transform="rotate(-30 40 30)" />
            <ellipse cx="50" cy="25" rx="6" ry="12" transform="rotate(20 50 25)" />
            <ellipse cx="150" cy="40" rx="7" ry="14" transform="rotate(45 150 40)" />
          </g>
          
          {/* Heart */}
          <path
            d="M 140 25 C 140 20 135 15 130 15 C 125 15 120 20 120 25 C 120 20 115 15 110 15 C 105 15 100 20 100 25 C 100 35 120 45 120 45 C 120 45 140 35 140 25 Z"
            fill="#FF8A65"
          />
          
          {/* Small decorative elements */}
          <circle cx="70" cy="60" r="3" fill="#FFB74D" opacity="0.7" />
          <circle cx="130" cy="70" r="2" fill="#64B5F6" opacity="0.7" />
          <circle cx="60" cy="120" r="2" fill="#FFB74D" opacity="0.7" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E1F5FE" />
              <stop offset="50%" stopColor="#F3E5F5" />
              <stop offset="100%" stopColor="#E8F5E8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* App name */}
      {showText && (
        <div className="mt-4 text-center">
          <h1 className={`${textSizes[size]} font-bold text-gray-800 tracking-wide`}>
            MIMA'A
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Suivi de grossesse
          </p>
        </div>
      )}
    </div>
  );
};

export default MimaaLogo;
