import React from 'react';
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
  
  return (
    <div className="movie-card" onClick={onClick}> {/* Reusing movie-card styles for consistency */}
      <div className="movie-card-poster">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`${name} poster`}
            loading="lazy" // Optimize by lazy loading images
          />
        ) : (
          <div className="movie-card-no-poster">
            <span>{name[0]}</span>
          </div>
        )}
        
        {rating && (
          <div className={`movie-card-rating ${Number(rating) >= 7 ? 'high' : Number(rating) >= 5 ? 'medium' : 'low'}`}>
            {rating}
          </div>
        )}
      </div>
      
      <div className="movie-card-info">
        <h3 className="movie-card-title">{name}</h3>
        {year && <span className="movie-card-year">{year}</span>}
      </div>
    </div>
  );
};

export default TVShowCard; 