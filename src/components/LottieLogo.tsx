'use client';

import { useEffect, useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import Image from 'next/image';

interface LottieLogoProps {
  width?: string | number;
  height?: string | number;
}

export default function LottieLogo({ width = '100%', height = '100%' }: LottieLogoProps) {
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [usePNG, setUsePNG] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Check if we need to use PNG instead
    // This can be due to browser compatibility issues
    const userAgent = window.navigator.userAgent;
    const isIE = userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
    const isOldBrowser = isIE || (!!window.MSInputMethodContext && !!(document as any).documentMode);
    
    if (isOldBrowser) {
      setUsePNG(true);
    }
  }, []);

  useEffect(() => {
    // Set a timeout to detect if animation doesn't load in time
    const timeoutId = setTimeout(() => {
      if (playerRef.current && !playerRef.current.isPlaying) {
        setLoadError(true);
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient]);

  // Use static PNG if Lottie fails or is not supported
  if (loadError || usePNG) {
    // First try to use a PNG backup
    return (
      <div style={{ width, height, position: 'relative' }}>
        <Image 
          src="/logo.png" 
          alt="TV.io Logo"
          fill
          style={{ objectFit: 'contain' }}
          onError={() => {
            // If PNG also fails, fallback to SVG
            setUsePNG(false);
            setLoadError(true);
          }}
        />
      </div>
    );
  }

  // Final fallback - SVG logo in case both Lottie and PNG fail
  if (loadError && !usePNG) {
    return (
      <svg 
        width={width} 
        height={height}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="10" fill="#e50914" />
        <text
          x="50"
          y="60"
          fontSize="24"
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
        >
          TV.io
        </text>
      </svg>
    );
  }

  // Don't render the Lottie player on the server
  if (!isClient) {
    return (
      <div style={{ width, height, backgroundColor: '#e50914', borderRadius: '8px' }}></div>
    );
  }

  return (
    <Player
      ref={playerRef}
      autoplay
      loop
      src="/logo.lottie"
      style={{ width, height }}
      onEvent={event => {
        if (event === 'error') {
          setLoadError(true);
        }
      }}
    />
  );
} 