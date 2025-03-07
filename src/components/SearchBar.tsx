'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

export default function SearchBar({ initialQuery = '', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <div className={`relative flex items-center w-full rounded-full transition-all duration-200 ${
        isFocused ? 'bg-white shadow-lg' : 'bg-gray-800'
      }`}>
        <FiSearch 
          className={`absolute left-4 ${isFocused ? 'text-gray-600' : 'text-gray-400'}`} 
          size={18} 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for movies..."
          className={`w-full py-3 pl-12 pr-10 rounded-full focus:outline-none ${
            isFocused 
              ? 'text-gray-900 placeholder-gray-500' 
              : 'bg-gray-800 text-white placeholder-gray-400'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-gray-500 hover:text-gray-700"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
      >
        <FiSearch size={18} />
      </button>
    </form>
  );
} 