import React from 'react';
import { useNavigate } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useMediaData from '../hooks/useMediaData';
import { getTrendingMovies, getTrendingTVShows } from '../services/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  media_type: string;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  media_type: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch trending movies (limited to 10 for optimization)
  const { 
    data: trendingMoviesData, 
    loading: moviesLoading, 
    error: moviesError,
    refetch: refetchMovies
  } = useMediaData(() => getTrendingMovies('day'));
  
  // Fetch trending TV shows (limited to 10 for optimization)
  const { 
    data: trendingTVShowsData, 
    loading: tvShowsLoading, 
    error: tvShowsError,
    refetch: refetchTVShows
  } = useMediaData(() => getTrendingTVShows('day'));
  
  const handleMovieClick = (movieId: number) => {
    console.log(`Navigate to movie ${movieId}`);
    // navigate(`/movie/${movieId}`); // Implement in Phase 5
  };
  
  const handleTVShowClick = (tvShowId: number) => {
    console.log(`Navigate to TV show ${tvShowId}`);
    // navigate(`/tv/${tvShowId}`); // Implement in Phase 5
  };
  
  // Extract data from API responses
  const trendingMovies = trendingMoviesData?.results?.slice(0, 10) || [];
  const trendingTVShows = trendingTVShowsData?.results?.slice(0, 10) || [];
  
  return (
    <div className="page-container home-page">
      <div className="home-hero">
        <h1>Welcome to tv.io</h1>
        <p>Discover movies and TV shows, track what you've watched, and get personalized recommendations.</p>
      </div>
      
      {/* Trending Movies Section */}
      <section className="home-section">
        {moviesLoading ? (
          <LoadingSpinner />
        ) : moviesError ? (
          <ErrorMessage 
            message="Failed to load trending movies" 
            onRetry={refetchMovies} 
          />
        ) : (
          <MediaGrid title="Trending Movies Today">
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
      </section>
      
      {/* Trending TV Shows Section */}
      <section className="home-section">
        {tvShowsLoading ? (
          <LoadingSpinner />
        ) : tvShowsError ? (
          <ErrorMessage 
            message="Failed to load trending TV shows" 
            onRetry={refetchTVShows} 
          />
        ) : (
          <MediaGrid title="Trending TV Shows Today">
            {trendingTVShows.map((tvShow: TVShow) => (
              <TVShowCard
                key={tvShow.id}
                id={tvShow.id}
                name={tvShow.name}
                posterPath={tvShow.poster_path}
                firstAirDate={tvShow.first_air_date}
                voteAverage={tvShow.vote_average}
                onClick={() => handleTVShowClick(tvShow.id)}
              />
            ))}
          </MediaGrid>
        )}
      </section>
      
      {/* Feature Highlights */}
      <section className="feature-highlights">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎬</div>
            <h3>Browse</h3>
            <p>Discover trending and popular movies and TV shows.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Search</h3>
            <p>Find your favorite movies and TV shows.</p>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Track</h3>
            <p>Keep track of what you've watched and want to watch.</p>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👍</div>
            <h3>Rate & Review</h3>
            <p>Share your thoughts and ratings with others.</p>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 