'use client';

import { CSSProperties } from 'react';

interface TextLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: CSSProperties;
}

export default function TextLogo({ 
  size = 'medium', 
  className = '',
  style = {}
}: TextLogoProps) {
  // Set font size based on size prop
  const fontSize = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[size];
  
  return (
    <span 
      className={`font-poppins font-bold text-white ${fontSize} ${className}`}
      style={style}
    >
      tv.io
    </span>
  );
} 