import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  getMovieDetails, 
  getImageUrl, 
  formatRuntime, 
  formatDate, 
  formatCurrency,
  formatCountries 
} from '../services/tmdb';
import CastSection from '../components/CastSection';
import VideoSection from '../components/VideoSection';
import RelatedContent from '../components/RelatedContent';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WatchlistButton from '../components/WatchlistButton';
import MoodRating from '../components/MoodRating';
import { useAuth } from '../contexts/AuthContext';
import { getRating, rateMedia } from '../services/ratings';
import { MoodRating as MoodRatingType } from '../types/rating';

interface MovieDetailsData {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  videos: { results: Array<{ id: string; key: string; name: string; site: string; type: string }> };
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }>;
  };
  similar: {
    results: Array<{
      id: number;
      title: string;
      poster_path: string | null;
      release_date: string;
      vote_average: number;
    }>;
  };
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<{ mood: MoodRatingType; wouldRewatch: boolean } | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        navigate('/movies');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(parseInt(id, 10));
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, navigate]);

  // Fetch user's rating
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!currentUser || !id) return;

      try {
        const rating = await getRating(currentUser.uid, parseInt(id, 10), 'movie');
        if (rating) {
          setUserRating({
            mood: rating.mood,
            wouldRewatch: rating.wouldRewatch
          });
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    fetchUserRating();
  }, [currentUser, id]);

  const handleRate = async (mood: MoodRatingType, wouldRewatch: boolean) => {
    if (!currentUser || !movie || !id) return;

    try {
      setRatingLoading(true);
      await rateMedia(
        currentUser.uid,
        movie.id,
        'movie',
        movie.title,
        movie.poster_path,
        mood,
        wouldRewatch
      );
      setUserRating({ mood, wouldRewatch });
    } catch (error) {
      console.error('Error rating movie:', error);
      setError('Failed to save your rating. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container-page">
        <ErrorMessage 
          message={error || 'Movie not found'} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Get director
  const director = movie.credits.crew.find(
    person => person.job.toLowerCase() === 'director'
  );

  return (
    <>
      {/* Backdrop Image */}
      {movie.backdrop_path && (
        <div className="w-full h-[40vh] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
          <img
            src={getImageUrl(movie.backdrop_path, 'w1280') || ''}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container-page relative z-10 -mt-20">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Poster */}
            <div className="md:w-1/3 lg:w-1/4 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg shadow-md overflow-hidden relative"
              >
                {movie.poster_path ? (
                  <img
                    src={getImageUrl(movie.poster_path, 'w500') || ''}
                    alt={movie.title}
                    className="w-full"
                  />
                ) : (
                  <div className="bg-gray-200 w-full aspect-[2/3] flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">{movie.title[0]}</span>
                  </div>
                )}
                
                {/* Watchlist button */}
                <div className="absolute top-2 right-2">
                  <WatchlistButton 
                    mediaId={movie.id}
                    mediaType="movie"
                    title={movie.title}
                    posterPath={movie.poster_path}
                    size="medium"
                  />
                </div>
              </motion.div>
            </div>

            {/* Info */}
            <div className="md:w-2/3 lg:w-3/4 p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                  <div className="hidden md:block">
                    <WatchlistButton 
                      mediaId={movie.id}
                      mediaType="movie"
                      title={movie.title}
                      posterPath={movie.poster_path}
                      size="large"
                    />
                  </div>
                </div>
                
                {movie.tagline && (
                  <p className="text-gray-500 italic mb-4">{movie.tagline}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Release Date</h3>
                    <p>{formatDate(movie.release_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Runtime</h3>
                    <p>{formatRuntime(movie.runtime)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                    <div className="flex items-center">
                      <span className={`inline-block w-8 h-8 rounded-full mr-2 flex items-center justify-center text-sm font-bold text-white ${
                        movie.vote_average >= 7 ? 'bg-green-500' : 
                        movie.vote_average >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({movie.vote_count.toLocaleString()} votes)</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p>{movie.status}</p>
                  </div>
                </div>

                {movie.overview && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <p className="text-gray-700">{movie.overview}</p>
                  </div>
                )}

                {/* Rating Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Your Rating</h3>
                  {currentUser ? (
                    <MoodRating
                      initialMood={userRating?.mood}
                      initialWouldRewatch={userRating?.wouldRewatch}
                      onRate={handleRate}
                      disabled={ratingLoading}
                    />
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-2">Sign in to rate this movie</p>
                      <button
                        onClick={() => navigate('/login')}
                        className="btn btn-primary"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {director && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Director</h3>
                      <p>{director.name}</p>
                    </div>
                  )}
                  {movie.production_countries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Country</h3>
                      <p>{formatCountries(movie.production_countries)}</p>
                    </div>
                  )}
                  {movie.budget > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                      <p>{formatCurrency(movie.budget)}</p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                      <p>{formatCurrency(movie.revenue)}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <div className="p-6">
            {/* Videos */}
            {movie.videos.results.length > 0 && (
              <VideoSection videos={movie.videos.results} />
            )}

            {/* Cast */}
            {movie.credits.cast.length > 0 && (
              <CastSection cast={movie.credits.cast} />
            )}

            {/* Similar Movies */}
            {movie.similar.results.length > 0 && (
              <RelatedContent 
                title="Similar Movies" 
                items={movie.similar.results} 
                mediaType="movie" 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails; 