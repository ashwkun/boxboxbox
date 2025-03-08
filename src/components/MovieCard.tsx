import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate?: string;
  voteAverage?: number;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  onClick
}) => {
  // Get year from release date if available
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  
  // Format vote average to display only one decimal place
  const rating = voteAverage ? voteAverage.toFixed(1) : null;
  
  // Get poster image with optimized size for cards (w300 instead of original)
  const posterUrl = posterPath ? getImageUrl(posterPath, 'w300') : null;
  
  // Determine the rating color class
  const getRatingColorClass = (rating: number) => {
    if (rating >= 7) return 'bg-success';
    if (rating >= 5) return 'bg-warning';
    return 'bg-error';
  };
  
  return (
    <motion.div 
      className="card card-hover group"
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-poster overflow-hidden">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`${title} poster`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
            {title[0]}
          </div>
        )}
        
        {rating && (
          <div className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRatingColorClass(Number(rating))} bg-opacity-90`}>
            {rating}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        {year && <span className="text-text-light text-xs">{year}</span>}
      </div>
    </motion.div>
  );
};

export default MovieCard; 