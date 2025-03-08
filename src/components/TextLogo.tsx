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
        aria-hidden="true"
      >.</span>
      
      {/* "io" with no dot initially */}
      <span className="io-text relative ml-[1px]">
        {/* Custom "i" with no dot */}
        <span className="no-dot-i">ı</span>
        <span>o</span>
      </span>
      
      {/* CSS Animations */}
      <style jsx>{`
        /* Remove the dot from the i using a special character (dotless i) */
        .no-dot-i {
          display: inline-block;
        }
        
        /* Container for io text that will have spacing animated */
        .io-text {
          display: inline-block;
          animation: close-space 4s infinite;
        }
        
        /* Animation for the bouncing dot */
        .dot-animation {
          animation: bounce-dot 4s infinite;
        }
        
        @keyframes close-space {
          0%, 60% {
            margin-left: 1px; /* Normal spacing */
            transform: translateX(0);
          }
          /* Start closing space as the dot moves above the i */
          70% {
            margin-left: 0;
            transform: translateX(-1px);
          }
          /* Space fully closed */
          80%, 90% {
            margin-left: 0;
            transform: translateX(-3px);
          }
          /* Return to original spacing */
          95%, 100% {
            margin-left: 1px;
            transform: translateX(0);
          }
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
          40%, 50% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          /* Start moving toward position above "i" */
          60% {
            transform: translateY(${offsetY / 2}px) translateX(${offsetX / 2}px);
            opacity: 0.7;
          }
          /* Move to position above "i" */
          70% {
            transform: translateY(${offsetY}px) translateX(${offsetX}px);
            opacity: 1;
          }
          /* Stay above "i" while spacing closes */
          80% {
            transform: translateY(${offsetY}px) translateX(${offsetX - 3}px);
            opacity: 1;
          }
          /* Hold in final position for a moment */
          90% {
            transform: translateY(${offsetY}px) translateX(${offsetX - 3}px);
            opacity: 1;
          }
          /* Return to original position */
          95% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          98% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
} 