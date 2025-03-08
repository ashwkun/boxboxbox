import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
}

interface RelatedContentProps {
  title: string;
  items: MediaItem[];
  mediaType: 'movie' | 'tv';
}

const RelatedContent: React.FC<RelatedContentProps> = ({ title, items, mediaType }) => {
  const navigate = useNavigate();
  
  // Only show up to 6 items (will be shown in a horizontal scroll)
  const displayItems = items?.slice(0, 6) || [];
  
  if (displayItems.length === 0) {
    return null;
  }
  
  const handleItemClick = (id: number) => {
    navigate(`/${mediaType}/${id}`);
  };
  
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-4">
          {displayItems.map((item) => (
            mediaType === 'movie' ? (
              <div className="flex-shrink-0 w-40" key={item.id}>
                <MovieCard
                  id={item.id}
                  title={item.title || ''}
                  posterPath={item.poster_path}
                  releaseDate={item.release_date}
                  voteAverage={item.vote_average}
                  onClick={() => handleItemClick(item.id)}
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-40" key={item.id}>
                <TVShowCard
                  id={item.id}
                  name={item.name || ''}
                  posterPath={item.poster_path}
                  firstAirDate={item.first_air_date}
                  voteAverage={item.vote_average}
                  onClick={() => handleItemClick(item.id)}
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedContent; 