import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MediaGrid from '../components/MediaGrid';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useMediaData from '../hooks/useMediaData';
import { getTrendingMovies, getPopularMovies, getMoviesByGenre, getMovieGenres } from '../services/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

const Movies: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  // Fetch trending movies
  const { 
    data: trendingMoviesData, 
    loading: trendingLoading, 
    error: trendingError,
    refetch: refetchTrending
  } = useMediaData(() => getTrendingMovies('week'));
  
  // Fetch popular movies
  const { 
    data: popularMoviesData, 
    loading: popularLoading, 
    error: popularError,
    refetch: refetchPopular
  } = useMediaData(() => getPopularMovies());
  
  // Fetch movie genres
  const { 
    data: genresData, 
    loading: genresLoading, 
    error: genresError 
  } = useMediaData(() => getMovieGenres());
  
  // Fetch movies by genre when a genre is selected
  const { 
    data: genreMoviesData, 
    loading: genreMoviesLoading, 
    error: genreMoviesError,
    refetch: refetchGenreMovies 
  } = useMediaData(
    () => selectedGenre ? getMoviesByGenre(selectedGenre) : Promise.resolve(null), 
    { dependencies: [selectedGenre] }
  );
  
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };
  
  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };
  
  // Extract movies from API response
  const trendingMovies = trendingMoviesData?.results || [];
  const popularMovies = popularMoviesData?.results || [];
  const genreMovies = genreMoviesData?.results || [];
  const genres = genresData?.genres || [];
  
  // Get the selected genre name
  const selectedGenreName = selectedGenre 
    ? genres.find(g => g.id === selectedGenre)?.name 
    : null;

  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Movies</h1>
        <p className="text-white/90">Discover the latest and greatest films from around the world.</p>
      </div>
      
      {/* Genres Filter */}
      {!genresLoading && !genresError && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre: Genre) => (
              <motion.button 
                key={genre.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedGenre === genre.id 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleGenreClick(genre.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {genre.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      {/* Display movies by selected genre */}
      {selectedGenre && (
        <>
          {genreMoviesLoading ? (
            <LoadingSpinner />
          ) : genreMoviesError ? (
            <ErrorMessage 
              message="Failed to load movies for this genre" 
              onRetry={refetchGenreMovies} 
            />
          ) : genreMovies.length > 0 ? (
            <MediaGrid title={`${selectedGenreName} Movies`}>
              {genreMovies.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </MediaGrid>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p>No movies found for this genre.</p>
            </div>
          )}
        </>
      )}
      
      {/* Display trending movies */}
      {!selectedGenre && (
        <>
          {trendingLoading ? (
            <LoadingSpinner />
          ) : trendingError ? (
            <ErrorMessage 
              message="Failed to load trending movies" 
              onRetry={refetchTrending} 
            />
          ) : (
            <MediaGrid title="Trending This Week">
              {trendingMovies.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </MediaGrid>
          )}
        </>
      )}
      
      {/* Display popular movies */}
      {!selectedGenre && (
        <>
          {popularLoading ? (
            <LoadingSpinner />
          ) : popularError ? (
            <ErrorMessage 
              message="Failed to load popular movies" 
              onRetry={refetchPopular} 
            />
          ) : (
            <MediaGrid title="Popular Movies">
              {popularMovies.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  releaseDate={movie.release_date}
                  voteAverage={movie.vote_average}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </MediaGrid>
          )}
        </>
      )}
    </div>
  );
};

export default Movies; 