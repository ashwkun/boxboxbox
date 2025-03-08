import React from 'react';
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
  
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-card-poster">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`${title} poster`}
            loading="lazy" // Optimize by lazy loading images
          />
        ) : (
          <div className="movie-card-no-poster">
            <span>{title[0]}</span>
          </div>
        )}
        
        {rating && (
          <div className={`movie-card-rating ${Number(rating) >= 7 ? 'high' : Number(rating) >= 5 ? 'medium' : 'low'}`}>
            {rating}
          </div>
        )}
      </div>
      
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        {year && <span className="movie-card-year">{year}</span>}
      </div>
    </div>
  );
};

export default MovieCard; 