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
  
  // Set size based on prop
  const fontSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];
  
  // Only enable animations after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Basic simple version without any animations
  if (!animated || !isClient) {
    return (
      <span 
        className={`font-bold ${fontSize} ${className}`}
        style={style}
      >
        <span className="text-red-600">tv.io</span>
      </span>
    );
  }
  
  // Simple animated version with minimal styling
  return (
    <span 
      className={`font-bold ${fontSize} ${className} inline-flex items-center`}
      style={style}
    >
      <span className="text-red-600">tv</span>
      <span className="dot-animation inline-block w-1 h-1 mx-0.5 bg-red-600 rounded-full"></span>
      <span className="io-text">io</span>
      
      <style jsx>{`
        .dot-animation {
          animation: simple-bounce 3s infinite;
        }
        
        .io-text {
          position: relative;
        }
        
        @keyframes simple-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </span>
  );
} 