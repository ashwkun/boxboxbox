'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { Movie } from '@/services/tmdb';
import { getImageUrl } from '@/services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  movies: Movie[];
}

export default function Hero({ movies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate featured movies
  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [movies.length, isAutoPlaying]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {currentMovie.backdrop_path && (
            <Image
              src={getImageUrl(currentMovie.backdrop_path, 'original') || ''}
              alt={currentMovie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                {currentMovie.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
                {currentMovie.overview}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href={`/movie/${currentMovie.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md flex items-center transition-colors"
                >
                  <FiPlay className="mr-2" /> Watch Trailer
                </Link>
                <Link 
                  href={`/movie/${currentMovie.id}`}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-md flex items-center transition-colors"
                >
                  <FiInfo className="mr-2" /> More Info
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 