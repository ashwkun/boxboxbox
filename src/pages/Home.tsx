import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MediaGrid from '../components/MediaGrid';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
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
    navigate(`/movie/${movieId}`);
  };
  
  const handleTVShowClick = (tvShowId: number) => {
    navigate(`/tv/${tvShowId}`);
  };
  
  // Extract data from API responses
  const trendingMovies = trendingMoviesData?.results?.slice(0, 10) || [];
  const trendingTVShows = trendingTVShowsData?.results?.slice(0, 10) || [];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="container-page">
      <motion.div 
        className="bg-gradient-to-r from-primary to-secondary text-white p-8 md:p-12 rounded-lg mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to tv.io</h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
          Discover movies and TV shows, track what you've watched, and get personalized recommendations.
        </p>
        
        {/* Prominent Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar placeholder="Search for a movie or TV show..." />
        </div>
      </motion.div>
      
      {/* Trending Movies Section */}
      <section className="mb-12">
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
      <section className="mb-12">
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
      <motion.section 
        className="mt-16 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="text-5xl mb-4 text-primary">🎬</div>
            <h3 className="text-lg font-semibold mb-2">Browse</h3>
            <p className="text-gray-600">Discover trending and popular movies and TV shows.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="text-5xl mb-4 text-primary">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Search</h3>
            <p className="text-gray-600">Find your favorite movies and TV shows.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="absolute top-2 right-2">
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <div className="text-5xl mb-4 text-primary">📋</div>
            <h3 className="text-lg font-semibold mb-2">Track</h3>
            <p className="text-gray-600">Keep track of what you've watched and want to watch.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="absolute top-2 right-2">
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <div className="text-5xl mb-4 text-primary">👍</div>
            <h3 className="text-lg font-semibold mb-2">Rate & Review</h3>
            <p className="text-gray-600">Share your thoughts and ratings with others.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home; 