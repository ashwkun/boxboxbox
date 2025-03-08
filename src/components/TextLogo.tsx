'use client';

import { CSSProperties } from 'react';

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
  // Set size based on prop
  const fontSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];
  
  // Super simple version with minimal styling - no animations or complex DOM
  return (
    <span 
      className={`font-bold ${fontSize} ${className}`}
      style={style}
    >
      <span className="text-red-600">tv</span>
      <span className="text-red-600 mx-0.5">.</span>
      <span className="text-red-600">io</span>
    </span>
  );
} 