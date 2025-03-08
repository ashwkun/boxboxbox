import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  getTVShowDetails, 
  getImageUrl, 
  formatDate,
  formatCountries 
} from '../services/tmdb';
import CastSection from '../components/CastSection';
import VideoSection from '../components/VideoSection';
import RelatedContent from '../components/RelatedContent';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WatchlistButton from '../components/WatchlistButton';

interface TVShowDetailsData {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string;
  }>;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  networks: Array<{ id: number; name: string; logo_path: string | null }>;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  status: string;
  tagline: string;
  type: string;
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
      name: string;
      poster_path: string | null;
      first_air_date: string;
      vote_average: number;
    }>;
  };
}

const TVShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tvShow, setTVShow] = useState<TVShowDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      if (!id) {
        navigate('/tvshows');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getTVShowDetails(parseInt(id, 10));
        setTVShow(data);
      } catch (err) {
        console.error('Error fetching TV show details:', err);
        setError('Failed to load TV show details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container-page flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="container-page">
        <ErrorMessage 
          message={error || 'TV show not found'} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  // Get creator
  const creator = tvShow.credits.crew.find(
    person => person.job.toLowerCase() === 'creator' || person.job.toLowerCase() === 'executive producer'
  );

  // Format runtime (average if there are multiple episode runtimes)
  const formatTVRuntime = (runtimes: number[]): string => {
    if (!runtimes || runtimes.length === 0) return 'N/A';
    
    const avgRuntime = runtimes.reduce((sum, time) => sum + time, 0) / runtimes.length;
    return `${Math.round(avgRuntime)} min`;
  };

  return (
    <>
      {/* Backdrop Image */}
      {tvShow.backdrop_path && (
        <div className="w-full h-[40vh] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
          <img
            src={getImageUrl(tvShow.backdrop_path, 'w1280') || ''}
            alt={tvShow.name}
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
                {tvShow.poster_path ? (
                  <img
                    src={getImageUrl(tvShow.poster_path, 'w500') || ''}
                    alt={tvShow.name}
                    className="w-full"
                  />
                ) : (
                  <div className="bg-gray-200 w-full aspect-[2/3] flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">{tvShow.name[0]}</span>
                  </div>
                )}
                
                {/* Watchlist button */}
                <div className="absolute top-2 right-2">
                  <WatchlistButton 
                    mediaId={tvShow.id}
                    mediaType="tv"
                    title={tvShow.name}
                    posterPath={tvShow.poster_path}
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
                  <h1 className="text-3xl font-bold mb-2">{tvShow.name}</h1>
                  <div className="hidden md:block">
                    <WatchlistButton 
                      mediaId={tvShow.id}
                      mediaType="tv"
                      title={tvShow.name}
                      posterPath={tvShow.poster_path}
                      size="large"
                    />
                  </div>
                </div>
                
                {tvShow.tagline && (
                  <p className="text-gray-500 italic mb-4">{tvShow.tagline}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {tvShow.genres.map(genre => (
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
                    <h3 className="text-sm font-medium text-gray-500">First Air Date</h3>
                    <p>{formatDate(tvShow.first_air_date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Episode Runtime</h3>
                    <p>{formatTVRuntime(tvShow.episode_run_time)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                    <div className="flex items-center">
                      <span className={`inline-block w-8 h-8 rounded-full mr-2 flex items-center justify-center text-sm font-bold text-white ${
                        tvShow.vote_average >= 7 ? 'bg-green-500' : 
                        tvShow.vote_average >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {tvShow.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({tvShow.vote_count.toLocaleString()} votes)</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p>{tvShow.status}</p>
                  </div>
                </div>

                {tvShow.overview && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <p className="text-gray-700">{tvShow.overview}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {creator && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Creator</h3>
                      <p>{creator.name}</p>
                    </div>
                  )}
                  {tvShow.production_countries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Country</h3>
                      <p>{formatCountries(tvShow.production_countries)}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Seasons</h3>
                    <p>{tvShow.number_of_seasons}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Episodes</h3>
                    <p>{tvShow.number_of_episodes}</p>
                  </div>
                </div>

                {/* Networks */}
                {tvShow.networks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Networks</h3>
                    <div className="flex flex-wrap gap-4">
                      {tvShow.networks.map(network => (
                        <div key={network.id} className="flex items-center">
                          {network.logo_path ? (
                            <img
                              src={getImageUrl(network.logo_path, 'w92') || ''}
                              alt={network.name}
                              className="h-6 mr-2"
                            />
                          ) : (
                            <span>{network.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <div className="p-6">
            {/* Seasons */}
            {tvShow.seasons.length > 0 && (
              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Seasons</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {tvShow.seasons.map(season => (
                    <div key={season.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {season.poster_path ? (
                        <img
                          src={getImageUrl(season.poster_path, 'w300') || ''}
                          alt={season.name}
                          className="w-full"
                          loading="lazy"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full aspect-[2/3] flex items-center justify-center">
                          <span className="text-gray-400 text-lg">{season.name}</span>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="font-medium text-sm">{season.name}</h3>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{season.episode_count} episodes</span>
                          <span>{season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {tvShow.videos.results.length > 0 && (
              <VideoSection videos={tvShow.videos.results} />
            )}

            {/* Cast */}
            {tvShow.credits.cast.length > 0 && (
              <CastSection cast={tvShow.credits.cast} />
            )}

            {/* Similar TV Shows */}
            {tvShow.similar.results.length > 0 && (
              <RelatedContent 
                title="Similar TV Shows" 
                items={tvShow.similar.results} 
                mediaType="tv" 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TVShowDetails; 