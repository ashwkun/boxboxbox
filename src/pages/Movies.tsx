import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // For now, we'll log to console. In Phase 5, we'll implement a movie details page
    console.log(`Navigate to movie ${movieId}`);
    // navigate(`/movie/${movieId}`);
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
    <div className="page-container movies-page">
      <h1>Movies</h1>
      
      {/* Genres Filter */}
      {!genresLoading && !genresError && (
        <div className="genres-filter">
          <h2>Genres</h2>
          <div className="genre-buttons">
            {genres.map((genre: Genre) => (
              <button 
                key={genre.id}
                className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
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
            <p>No movies found for this genre.</p>
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