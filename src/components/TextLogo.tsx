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
  
  // Set font size based on size prop
  const fontSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];
  
  // Only enable animations after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // If animations are disabled or we're server-side rendering, use the simple version
  if (!animated || !isClient) {
    return (
      <span 
        className={`font-poppins font-bold text-white ${fontSize} ${className}`}
        style={style}
      >
        tv.io
      </span>
    );
  }
  
  // Calculate offset values based on font size for responsive animation
  const offsetY = size === 'large' ? -18 : size === 'medium' ? -14 : -10;
  const offsetX = size === 'large' ? 14 : size === 'medium' ? 10 : 8;
  
  // Apply animations to the period that connects to the dot above "i"
  return (
    <span 
      className={`font-poppins font-bold text-white ${fontSize} ${className} relative inline-flex items-center`}
      style={style}
    >
      {/* First part "tv" */}
      <span>tv</span>
      
      {/* Animated period */}
      <span 
        className="dot-animation inline-block relative"
      >.</span>
      
      {/* "io" with hidden dot */}
      <span className="relative ml-[1px]">
        {/* This creates a custom "i" without the dot */}
        <span className="relative">
          <span className="no-dot-i">i</span>
        </span>
        <span>o</span>
      </span>
      
      {/* CSS Animations */}
      <style jsx>{`
        .no-dot-i {
          position: relative;
        }
        
        .no-dot-i::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: ${size === 'large' ? '4px' : size === 'medium' ? '3px' : '2px'};
          background-color: transparent;
          z-index: 10;
        }
        
        .dot-animation {
          animation: bounce-dot 4s infinite;
        }
        
        @keyframes bounce-dot {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
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
          40%, 45% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          /* Start moving to become the dot above "i" */
          50% {
            transform: translateY(${offsetY / 2}px) translateX(${offsetX / 2}px);
            opacity: 0.5;
          }
          /* Appear above the "i" */
          55% {
            transform: translateY(${offsetY}px) translateX(${offsetX}px);
            opacity: 0;
          }
          60% {
            transform: translateY(${offsetY}px) translateX(${offsetX}px);
            opacity: 1;
          }
          /* Stay there for a bit */
          80% {
            transform: translateY(${offsetY}px) translateX(${offsetX}px);
            opacity: 1;
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
    </span>
  );
} 