'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiStar, FiClock, FiCalendar, FiPlay } from 'react-icons/fi';
import Layout from '@/components/Layout';
import MovieGrid from '@/components/MovieGrid';
import { getMovieDetails, getImageUrl } from '@/services/tmdb';

interface MovieDetailProps {
  id: string;
}

export default function MovieDetail({ id }: MovieDetailProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieId = parseInt(id);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !movie) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Movie not found</h1>
          <p className="text-gray-400 mb-8">The movie you're looking for doesn't exist or there was an error fetching the data.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }
  
  // Format release date
  const releaseDate = new Date(movie.release_date);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format runtime
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;
  
  // Get trailer if available
  const trailer = movie.videos?.results.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return (
    <Layout>
      {/* Hero section with backdrop */}
      <div className="relative w-full h-[70vh]">
        {movie.backdrop_path ? (
          <Image
            src={getImageUrl(movie.backdrop_path, 'original') || ''}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
      
      {/* Movie details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              {movie.poster_path ? (
                <Image
                  src={getImageUrl(movie.poster_path, 'w500') || ''}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
          
          {/* Info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-6">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <FiStar className="mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">({movie.vote_count} votes)</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <FiCalendar className="mr-1" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <FiClock className="mr-1" />
                <span>{formattedRuntime}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres && movie.genres.map((genre: any) => (
                <span 
                  key={genre.id} 
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
            
            {trailer && (
              <a 
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors mb-8"
              >
                <FiPlay className="mr-2" /> Watch Trailer
              </a>
            )}
            
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Top Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.credits.cast.slice(0, 6).map((person: any) => (
                    <div key={person.id} className="text-center">
                      <div className="w-full aspect-square rounded-full overflow-hidden mb-2 bg-gray-800">
                        {person.profile_path ? (
                          <Image
                            src={getImageUrl(person.profile_path, 'w185') || ''}
                            alt={person.name}
                            width={185}
                            height={185}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-white">{person.name}</p>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations */}
        {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
          <div className="mt-16">
            <MovieGrid 
              movies={movie.recommendations.results} 
              title="You May Also Like" 
            />
          </div>
        )}
      </div>
    </Layout>
  );
} 