import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  compact?: boolean;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search movies, TV shows...', 
  compact = false,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get recent searches from localStorage
  const getRecentSearches = (): string[] => {
    try {
      const searches = localStorage.getItem('recentSearches');
      return searches ? JSON.parse(searches) : [];
    } catch (error) {
      console.error('Error parsing recent searches:', error);
      return [];
    }
  };
  
  const recentSearches = getRecentSearches();
  
  // Add a search term to recent searches
  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    
    try {
      const searches = getRecentSearches();
      // Remove the term if it already exists to avoid duplicates
      const filteredSearches = searches.filter((s: string) => s !== term);
      // Add the new term to the beginning of the array
      const newSearches = [term, ...filteredSearches].slice(0, 10); // Keep only the 10 most recent
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };
  
  // Handle search submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (query.trim()) {
      addToRecentSearches(query.trim());
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    addToRecentSearches(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };
  
  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all ${compact ? 'text-sm' : ''}`}
          />
          {query && (
            <button
              type="button"
              className="absolute right-10 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 text-gray-500 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Recent searches dropdown */}
      <AnimatePresence>
        {showSuggestions && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg py-2 border border-gray-200"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
            </div>
            <ul>
              {recentSearches.map((search: string, index: number) => (
                <li key={index}>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {search}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 