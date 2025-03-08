import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { searchMedia } from '../services/tmdb';
import MediaGrid from '../components/MediaGrid';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchFilters from '../components/SearchFilters';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: string;
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') || 'all') as 'all' | 'movie' | 'tv';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  
  // Update search params when filters change
  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    setSearchParams(updatedParams);
  };
  
  // Handle type filter change
  const handleTypeChange = (newType: 'all' | 'movie' | 'tv') => {
    updateSearchParams({ type: newType });
  };
  
  // Load more results
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Search for media
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setTotalResults(0);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        if (type === 'all' || type === 'movie') {
          const movieResults = await searchMedia(query, 'movie', page);
          const mappedMovies = movieResults.results.map((movie: any) => ({
            ...movie,
            media_type: 'movie'
          }));
          
          if (page === 1) {
            setResults(mappedMovies);
            setTotalResults(movieResults.total_results);
          } else {
            setResults(prev => [...prev, ...mappedMovies]);
          }
        }
        
        if (type === 'all' || type === 'tv') {
          const tvResults = await searchMedia(query, 'tv', page);
          const mappedTVShows = tvResults.results.map((show: any) => ({
            ...show,
            media_type: 'tv'
          }));
          
          if (type === 'all') {
            if (page === 1) {
              setResults(prev => [...prev, ...mappedTVShows]);
              setTotalResults(prev => prev + tvResults.total_results);
            } else {
              setResults(prev => [...prev, ...mappedTVShows]);
            }
          } else {
            if (page === 1) {
              setResults(mappedTVShows);
              setTotalResults(tvResults.total_results);
            } else {
              setResults(prev => [...prev, ...mappedTVShows]);
            }
          }
        }
      } catch (err) {
        console.error('Error searching media:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Reset pagination when query or type changes
    if (page === 1) {
      fetchResults();
    }
  }, [query, type, page]);
  
  // Reset page number when query or type changes
  useEffect(() => {
    setPage(1);
  }, [query, type]);
  
  // Handle item click
  const handleItemClick = (id: number, mediaType: string) => {
    if (mediaType === 'movie') {
      navigate(`/movie/${id}`);
    } else if (mediaType === 'tv') {
      navigate(`/tv/${id}`);
    }
  };
  
  // If we have search history, use it for suggestions
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-secondary via-primary to-accent text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-white/90">
          {query 
            ? `Found ${totalResults} results for "${query}"` 
            : 'Enter a search term to find movies and TV shows'}
        </p>
      </div>
      
      {/* Search Filters */}
      <SearchFilters 
        type={type} 
        onTypeChange={handleTypeChange} 
      />
      
      {/* Search Results */}
      {loading && page === 1 ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : results.length > 0 ? (
        <>
          <MediaGrid title="Results">
            {results.map((item: SearchResult) => 
              item.media_type === 'movie' ? (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
                  id={item.id}
                  title={item.title || ''}
                  posterPath={item.poster_path}
                  releaseDate={item.release_date || ''}
                  voteAverage={item.vote_average}
                  onClick={() => handleItemClick(item.id, item.media_type)}
                />
              ) : (
                <TVShowCard
                  key={`${item.media_type}-${item.id}`}
                  id={item.id}
                  name={item.name || ''}
                  posterPath={item.poster_path}
                  firstAirDate={item.first_air_date || ''}
                  voteAverage={item.vote_average}
                  onClick={() => handleItemClick(item.id, item.media_type)}
                />
              )
            )}
          </MediaGrid>
          
          {/* Load More Button */}
          {results.length < totalResults && (
            <div className="flex justify-center mt-8 mb-12">
              <motion.button
                className="btn btn-primary px-8 py-3 rounded-full"
                onClick={loadMore}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Loading...' : 'Load More'}
              </motion.button>
            </div>
          )}
        </>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No results found for "{query}"</p>
          <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 mt-4">
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          {recentSearches.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term: string, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                  onClick={() => updateSearchParams({ q: term })}
                >
                  {term}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Your recent searches will appear here</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 