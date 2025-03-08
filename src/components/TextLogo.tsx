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
  
  // Only enable animations after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Size mappings
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  }[size];
  
  // Static fallback version for SSR or non-animated mode
  if (!animated || !isClient) {
    return (
      <span 
        className={`font-poppins logo-text ${sizeClasses} ${className}`}
        style={style}
      >
        <span className="accent-text">tv</span>
        <span style={{ color: 'var(--foreground)' }}>io</span>
      </span>
    );
  }
  
  // Full animated version
  return (
    <div 
      className={`logo-container font-poppins ${sizeClasses} ${className} relative`}
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {/* Bracket element */}
      <div className="bracket left-bracket" />
      
      {/* Main text */}
      <div className="logo-text flex items-center">
        {/* "t" with special styling */}
        <span className="t-letter relative">
          <span className="accent-text">t</span>
        </span>
        
        {/* "v" with special styling */}
        <span className="v-letter relative">
          <span className="accent-text">v</span>
          <div className="v-highlight" />
        </span>
        
        {/* "io" with special styling */}
        <span className="io-text relative">
          <span className="i-letter">i</span>
          <span className="o-letter">o</span>
          <div className="cursor-blink" />
        </span>
      </div>
      
      {/* Bracket element */}
      <div className="bracket right-bracket" />
      
      <style jsx>{`
        /* Basic styling */
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .relative {
          position: relative;
        }
      
        /* Container styles */
        .logo-container {
          perspective: 1000px;
        }
        
        /* Bracket styling */
        .bracket {
          position: absolute;
          width: 2px;
          height: 100%;
          background: var(--accent-primary);
          transition: all 0.5s ease;
          opacity: 0.7;
        }
        
        .left-bracket {
          left: -6px;
          transform: translateZ(0);
          animation: pulse-left 4s infinite;
        }
        
        .right-bracket {
          right: -6px;
          transform: translateZ(0);
          animation: pulse-right 4s infinite;
        }
        
        /* Letter styling */
        .logo-text {
          position: relative;
          z-index: 2;
        }
        
        .t-letter, .v-letter {
          display: inline-block;
          transform-style: preserve-3d;
          animation: float-t 5s infinite ease-in-out;
        }
        
        .v-letter {
          animation: float-v 5s infinite ease-in-out;
          animation-delay: 0.2s;
        }
        
        .io-text {
          position: relative;
          display: inline-block;
          margin-left: 1px;
          animation: slide-in 5s infinite;
        }
        
        .i-letter {
          position: relative;
          display: inline-block;
          color: var(--foreground);
        }
        
        .o-letter {
          display: inline-block;
          color: var(--foreground);
          animation: pulse-o 5s infinite;
        }
        
        /* Highlight effect */
        .v-highlight {
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background: var(--accent-gradient);
          transform: scaleX(0);
          transform-origin: left;
          animation: expand-highlight 5s infinite;
        }
        
        /* Cursor blink effect */
        .cursor-blink {
          position: absolute;
          bottom: 0;
          right: -5px;
          width: 2px;
          height: 70%;
          background-color: var(--accent-secondary);
          animation: blink 1.2s infinite;
        }
        
        /* Animations */
        @keyframes pulse-left {
          0%, 100% {
            height: 90%;
            opacity: 0.6;
          }
          50% {
            height: 100%;
            opacity: 0.8;
          }
        }
        
        @keyframes pulse-right {
          0%, 100% {
            height: 100%;
            opacity: 0.8;
          }
          50% {
            height: 90%;
            opacity: 0.6;
          }
        }
        
        @keyframes float-t {
          0%, 100% {
            transform: translateY(0) rotateX(0);
          }
          50% {
            transform: translateY(-3px) rotateX(5deg);
          }
        }
        
        @keyframes float-v {
          0%, 100% {
            transform: translateY(0) rotateX(0);
          }
          50% {
            transform: translateY(-2px) rotateX(-5deg);
          }
        }
        
        @keyframes slide-in {
          0%, 10%, 90%, 100% {
            transform: translateX(0);
          }
          30%, 70% {
            transform: translateX(-1px);
          }
        }
        
        @keyframes expand-highlight {
          0%, 20%, 80%, 100% {
            transform: scaleX(0);
          }
          40%, 60% {
            transform: scaleX(1);
          }
        }
        
        @keyframes pulse-o {
          0%, 100% {
            color: var(--foreground);
          }
          50% {
            color: rgb(180, 180, 180);
          }
        }
        
        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 