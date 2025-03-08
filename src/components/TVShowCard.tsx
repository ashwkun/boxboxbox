import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../services/tmdb';

interface TVShowCardProps {
  id: number;
  name: string;
  posterPath: string | null;
  firstAirDate?: string;
  voteAverage?: number;
  onClick?: () => void;
}

const TVShowCard: React.FC<TVShowCardProps> = ({
  id,
  name,
  posterPath,
  firstAirDate,
  voteAverage,
  onClick
}) => {
  // Get year from first air date if available
  const year = firstAirDate ? new Date(firstAirDate).getFullYear() : null;
  
  // Format vote average to display only one decimal place
  const rating = voteAverage ? voteAverage.toFixed(1) : null;
  
  // Get poster image with optimized size for cards (w300 instead of original)
  const posterUrl = posterPath ? getImageUrl(posterPath, 'w300') : null;
  
  // Determine the rating color class
  const getRatingColorClass = (rating: number) => {
    if (rating >= 7) return 'bg-green-500';
    if (rating >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
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
            alt={`${name} poster`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold">
            {name[0]}
          </div>
        )}
        
        {rating && (
          <div className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${getRatingColorClass(Number(rating))} shadow-md`}>
            {rating}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
        {year && <span className="text-gray-500 text-xs">{year}</span>}
      </div>
    </motion.div>
  );
};

export default TVShowCard; 