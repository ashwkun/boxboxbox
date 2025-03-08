'use client';

import { CSSProperties, useEffect, useState } from 'react';

interface TextLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: CSSProperties;
  animated?: boolean;
}

export default function TextLogo({ 
  size = 'medium', 
  className = '',
  style = {},
  animated = true
}: TextLogoProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Set dimensions based on size prop
  const dimensions = {
    small: {
      fontSize: 'text-xl',
      height: '24px',
      iconSize: '16px',
      dotOffsetY: -10,
      dotOffsetX: 7,
    },
    medium: {
      fontSize: 'text-2xl',
      height: '30px',
      iconSize: '20px',
      dotOffsetY: -12,
      dotOffsetX: 8,
    },
    large: {
      fontSize: 'text-3xl',
      height: '36px',
      iconSize: '24px',
      dotOffsetY: -15,
      dotOffsetX: 10,
    },
  }[size];
  
  // Only enable animations after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // If animations are disabled or we're server-side rendering, use the simple version
  if (!animated || !isClient) {
    return (
      <span 
        className={`font-poppins font-bold text-white ${dimensions.fontSize} ${className} flex items-center`}
        style={style}
      >
        <span className="text-primary">tv</span><span className="text-white">.io</span>
      </span>
    );
  }
  
  return (
    <div 
      className={`logo-container font-poppins font-bold ${dimensions.fontSize} ${className} relative flex items-center`}
      style={{
        ...style,
        height: dimensions.height,
      }}
    >
      {/* Play button icon that morphs into "tv" */}
      <div className="play-icon relative inline-flex items-center justify-center">
        <span className="gradient-text">tv</span>
      </div>
      
      {/* Animated dot that becomes the dot above "i" */}
      <span 
        className="dot-animation inline-block relative"
        aria-hidden="true"
        style={{
          height: '0.25em',
          width: '0.25em',
          marginLeft: '0.05em',
          marginRight: '0.05em'
        }}
      >.</span>
      
      {/* "io" with custom styling */}
      <div className="io-text relative">
        <span className="no-dot-i relative inline-block">ı</span>
        <span className="inline-block">o</span>
        
        {/* Pulse effect around the logo */}
        <div className="pulse-effect"></div>
      </div>
      
      {/* CSS Animations and Styling */}
      <style jsx>{`
        /* Gradient text effect */
        .gradient-text {
          background: linear-gradient(135deg, #e50914 0%, #ff9d26 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        
        /* Position i without a dot */
        .no-dot-i {
          display: inline-block;
        }
        
        /* Container for io text */
        .io-text {
          display: inline-block;
          animation: close-space 4.5s infinite;
          position: relative;
        }
        
        /* Animation for the play-icon */
        .play-icon {
          animation: pulse-scale 4.5s infinite;
        }
        
        /* Animation for the pulsing effect */
        .pulse-effect {
          position: absolute;
          top: -20%;
          left: -30%;
          width: 160%;
          height: 140%;
          background: radial-gradient(circle, rgba(229, 9, 20, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
          border-radius: 50%;
          z-index: -1;
          opacity: 0;
          animation: pulse 4.5s infinite;
          pointer-events: none;
        }
        
        /* Animation for the bouncing dot */
        .dot-animation {
          animation: bounce-dot 4.5s infinite;
          background-color: #e50914;
          border-radius: 50%;
        }
        
        /* Animation for pulsing scale */
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.05);
          }
          85% {
            transform: scale(1);
          }
        }
        
        /* Animation for the pulse effect */
        @keyframes pulse {
          0%, 50%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          75% {
            opacity: 0.6;
            transform: scale(1);
          }
          85% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
        
        /* Animation for closing the space between tv and io */
        @keyframes close-space {
          0%, 40% {
            margin-left: 2px;
            transform: translateX(0);
          }
          /* Start closing space */
          60% {
            margin-left: 0;
            transform: translateX(-2px);
          }
          /* Space fully closed */
          70%, 80% {
            margin-left: 0;
            transform: translateX(-4px);
          }
          /* Return to original spacing */
          90%, 100% {
            margin-left: 2px;
            transform: translateX(0);
          }
        }
        
        /* Animation for the dot to move above the i */
        @keyframes bounce-dot {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
            background-color: #e50914;
          }
          10% {
            transform: translateY(-5px) translateX(0);
            opacity: 1;
          }
          20% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          30% {
            transform: translateY(-3px) translateX(0);
            opacity: 1;
          }
          40% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          /* Start moving toward position above "i" */
          55% {
            transform: translateY(${dimensions.dotOffsetY / 2}px) translateX(${dimensions.dotOffsetX / 2}px);
            opacity: 0.7;
            background-color: #e50914;
          }
          /* Move to position above "i" */
          65% {
            transform: translateY(${dimensions.dotOffsetY}px) translateX(${dimensions.dotOffsetX}px);
            opacity: 1;
            background-color: #ff9d26;
          }
          /* Stay above "i" while spacing closes */
          75% {
            transform: translateY(${dimensions.dotOffsetY}px) translateX(${dimensions.dotOffsetX}px);
            opacity: 1;
            background-color: #ff9d26;
          }
          /* Hold in final position with color pulse */
          80% {
            transform: translateY(${dimensions.dotOffsetY}px) translateX(${dimensions.dotOffsetX}px);
            opacity: 1;
            background-color: #e50914;
          }
          /* Return to original position */
          85% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          90% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 