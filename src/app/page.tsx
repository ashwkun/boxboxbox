'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import SearchBar from '@/components/SearchBar';
import { getPopularMovies, getUpcomingMovies, getTopRatedMovies, Movie } from '@/services/tmdb';

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [popularData, upcomingData, topRatedData] = await Promise.all([
          getPopularMovies(),
          getUpcomingMovies(),
          getTopRatedMovies()
        ]);
        
        // Get the first 5 popular movies for the hero section
        setHeroMovies(popularData.results.slice(0, 5));
        
        // Get the rest of the popular movies for the grid
        setPopularMovies(popularData.results.slice(5));
        
        setUpcomingMovies(upcomingData.results);
        setTopRatedMovies(topRatedData.results);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="h-[70vh] bg-gray-900 animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : heroMovies.length > 0 ? (
        <Hero movies={heroMovies} />
      ) : null}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar className="max-w-2xl mx-auto" />
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-8">
            <div className="h-64 bg-gray-900 animate-pulse rounded-lg"></div>
            <div className="h-64 bg-gray-900 animate-pulse rounded-lg"></div>
            <div className="h-64 bg-gray-900 animate-pulse rounded-lg"></div>
          </div>
        ) : (
          <>
            {popularMovies.length > 0 && (
              <MovieGrid movies={popularMovies} title="Popular Movies" />
            )}
            
            {upcomingMovies.length > 0 && (
              <MovieGrid movies={upcomingMovies} title="Upcoming Movies" />
            )}
            
            {topRatedMovies.length > 0 && (
              <MovieGrid movies={topRatedMovies} title="Top Rated Movies" />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
