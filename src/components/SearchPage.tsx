'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import { searchMovies, MovieResponse } from '@/services/tmdb';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<MovieResponse>({
    results: [],
    page: 1,
    total_pages: 0,
    total_results: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults({
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0
        });
        return;
      }
      
      try {
        setLoading(true);
        const results = await searchMovies(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">Search Movies</h1>
        
        <div className="mb-12">
          <SearchBar initialQuery={query} />
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : query ? (
          <MovieGrid 
            movies={searchResults.results} 
            title={`Search Results for "${query}"`} 
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Enter a movie title to search
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 