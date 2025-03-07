'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import SearchPage from '@/components/SearchPage';

// This is a client component that will be used to hydrate the search page
export default function SearchClient() {
  useEffect(() => {
    // Client-side only code
    const rootElement = document.getElementById('search-root');
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(<SearchPage />);
    }
  }, []);

  // Return nothing as this is just a wrapper for client-side hydration
  return null;
} 