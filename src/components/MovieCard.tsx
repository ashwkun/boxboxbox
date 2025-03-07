'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiBookmark, FiHeart } from 'react-icons/fi';
import { Movie } from '@/services/tmdb';
import { getImageUrl } from '@/services/tmdb';
import { useAuth } from '@/context/AuthContext';
import { addToWatchlist, addToFavorites } from '@/services/userService';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    try {
      setIsAddingToWatchlist(true);
      await addToWatchlist(user.uid, {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        addedAt: Date.now()
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    try {
      setIsAddingToFavorites(true);
      await addToFavorites(user.uid, {
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        addedAt: Date.now()
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-lg overflow-hidden shadow-lg bg-gray-900 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} className="block h-full">
        <div className="relative aspect-[2/3] w-full">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, 'w500') || ''}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
              No Image
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-70 rounded-full px-2 py-1">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="text-white text-sm">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
            <p className="text-gray-300 text-sm mb-2">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text-gray-300 text-sm line-clamp-2 mb-4">
              {movie.overview}
            </p>
            
            {user && (
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToWatchlist}
                  disabled={isAddingToWatchlist}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
                >
                  <FiBookmark className="mr-1" /> Watchlist
                </button>
                <button
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200 text-sm"
                >
                  <FiHeart className="mr-1" /> Favorite
                </button>
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
} 