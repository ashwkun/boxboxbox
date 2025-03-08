import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MediaGrid from '../components/MediaGrid';
import MovieCard from '../components/MovieCard';
import TVShowCard from '../components/TVShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import RecommendationSection from '../components/RecommendationSection';
import { useAuth } from '../contexts/AuthContext';
import useMediaData from '../hooks/useMediaData';
import { getTrendingMovies, getTrendingTVShows } from '../services/tmdb';
import { getAllRecommendations } from '../services/recommendations';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  media_type: string;
  recommendedBecause?: {
    id: number;
    title: string;
    mediaType: 'movie' | 'tv';
  };
  recommendedBecauseGenre?: {
    id: number;
    name: string;
    mediaType: 'movie' | 'tv';
  };
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  media_type: string;
  recommendedBecause?: {
    id: number;
    title: string;
    mediaType: 'movie' | 'tv';
  };
  recommendedBecauseGenre?: {
    id: number;
    name: string;
    mediaType: 'movie' | 'tv';
  };
}

interface Recommendations {
  watchedBased: {
    movies: Movie[];
    tvShows: TVShow[];
  };
  genreBased: {
    movies: Movie[];
    tvShows: TVShow[];
  };
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  
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
  
  // Fetch recommendations if user is logged in
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser) {
        setRecommendations(null);
        return;
      }
      
      try {
        setLoadingRecommendations(true);
        const recs = await getAllRecommendations(currentUser.uid);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    
    fetchRecommendations();
  }, [currentUser]);
  
  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };
  
  const handleTVShowClick = (tvShowId: number) => {
    navigate(`/tv/${tvShowId}`);
  };
  
  // Extract data from API responses
  const trendingMovies = trendingMoviesData?.results?.slice(0, 10) || [];
  const trendingTVShows = trendingTVShowsData?.results?.slice(0, 10) || [];
  
  // Group "Because you watched" recommendations by source
  const groupRecommendationsBySource = (items: (Movie | TVShow)[]) => {
    const grouped: Record<string, (Movie | TVShow)[]> = {};
    
    items.forEach(item => {
      if (item.recommendedBecause) {
        const key = `${item.recommendedBecause.mediaType}-${item.recommendedBecause.id}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      }
    });
    
    return Object.entries(grouped).map(([key, items]) => {
      const [mediaType, id] = key.split('-');
      const sourceInfo = items[0].recommendedBecause;
      
      return {
        sourceId: parseInt(id),
        sourceTitle: sourceInfo?.title || '',
        sourceType: mediaType as 'movie' | 'tv',
        items
      };
    }).slice(0, 3); // Limit to top 3 sources
  };
  
  // Group recommendations by genre
  const groupRecommendationsByGenre = (items: (Movie | TVShow)[]) => {
    const grouped: Record<string, (Movie | TVShow)[]> = {};
    
    items.forEach(item => {
      if (item.recommendedBecauseGenre) {
        const key = `${item.recommendedBecauseGenre.mediaType}-${item.recommendedBecauseGenre.id}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      }
    });
    
    return Object.entries(grouped).map(([key, items]) => {
      const genreInfo = items[0].recommendedBecauseGenre;
      
      return {
        genreId: genreInfo?.id || 0,
        genreName: genreInfo?.name || '',
        genreType: genreInfo?.mediaType || 'movie',
        items
      };
    }).slice(0, 3); // Limit to top 3 genres
  };
  
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
  
  // Group recommendations
  const movieWatchedBasedGroups = recommendations?.watchedBased.movies?.length 
    ? groupRecommendationsBySource(recommendations.watchedBased.movies) 
    : [];
    
  const tvWatchedBasedGroups = recommendations?.watchedBased.tvShows?.length 
    ? groupRecommendationsBySource(recommendations.watchedBased.tvShows) 
    : [];
    
  const movieGenreBasedGroups = recommendations?.genreBased.movies?.length 
    ? groupRecommendationsByGenre(recommendations.genreBased.movies) 
    : [];
    
  const tvGenreBasedGroups = recommendations?.genreBased.tvShows?.length 
    ? groupRecommendationsByGenre(recommendations.genreBased.tvShows) 
    : [];
  
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
      
      {/* Personalized Recommendations */}
      {currentUser && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Recommendations</h2>
          
          {loadingRecommendations ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (!recommendations || 
              (movieWatchedBasedGroups.length === 0 && 
               tvWatchedBasedGroups.length === 0 && 
               movieGenreBasedGroups.length === 0 && 
               tvGenreBasedGroups.length === 0)) ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-3">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-4">
                We'll generate personalized recommendations based on your preferences and watch history.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => navigate('/profile')} 
                  className="btn btn-primary"
                >
                  Update Preferences
                </button>
                <button 
                  onClick={() => navigate('/movies')} 
                  className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Browse Content
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Because You Watched - Movies */}
              {movieWatchedBasedGroups.map((group, index) => (
                <RecommendationSection
                  key={`movie-watched-${index}`}
                  title="Because You Watched"
                  items={group.items as Movie[]}
                  mediaType="movie"
                  sourceTitle={group.sourceTitle}
                  sourceId={group.sourceId}
                  showSourceLink={true}
                />
              ))}
              
              {/* Because You Watched - TV Shows */}
              {tvWatchedBasedGroups.map((group, index) => (
                <RecommendationSection
                  key={`tv-watched-${index}`}
                  title="Because You Watched"
                  items={group.items as TVShow[]}
                  mediaType="tv"
                  sourceTitle={group.sourceTitle}
                  sourceId={group.sourceId}
                  showSourceLink={true}
                />
              ))}
              
              {/* Based on Genre - Movies */}
              {movieGenreBasedGroups.map((group, index) => (
                <RecommendationSection
                  key={`movie-genre-${index}`}
                  title={`Top ${group.genreName} Movies`}
                  items={group.items as Movie[]}
                  mediaType="movie"
                />
              ))}
              
              {/* Based on Genre - TV Shows */}
              {tvGenreBasedGroups.map((group, index) => (
                <RecommendationSection
                  key={`tv-genre-${index}`}
                  title={`Top ${group.genreName} TV Shows`}
                  items={group.items as TVShow[]}
                  mediaType="tv"
                />
              ))}
            </div>
          )}
        </div>
      )}
      
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
            <div className="text-5xl mb-4 text-primary">📋</div>
            <h3 className="text-lg font-semibold mb-2">Track</h3>
            <p className="text-gray-600">Keep track of what you've watched and want to watch.</p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="text-5xl mb-4 text-primary">👍</div>
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <p className="text-gray-600">Get personalized recommendations based on your taste.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home; 