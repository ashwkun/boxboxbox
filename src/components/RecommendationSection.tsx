import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import TVShowCard from './TVShowCard';

interface RecommendationProps {
  title: string;
  items: any[];
  mediaType: 'movie' | 'tv';
  sourceTitle?: string;
  sourceId?: number;
  showSourceLink?: boolean;
}

const RecommendationSection: React.FC<RecommendationProps> = ({
  title,
  items,
  mediaType,
  sourceTitle,
  sourceId,
  showSourceLink = false
}) => {
  const navigate = useNavigate();

  // Filter out items without posters
  const filteredItems = items.filter(item => item.poster_path);

  if (filteredItems.length === 0) {
    return null;
  }

  const handleSourceClick = () => {
    if (sourceId && showSourceLink) {
      navigate(`/${mediaType}/${sourceId}`);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary pl-4 border-l-4 border-primary">
          {title}
          {sourceTitle && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              {sourceTitle}
              {showSourceLink && (
                <button
                  onClick={handleSourceClick}
                  className="text-primary hover:underline ml-2 text-sm"
                >
                  View
                </button>
              )}
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredItems.slice(0, 6).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mediaType === 'movie' ? (
              <MovieCard
                id={item.id}
                title={item.title || ''}
                posterPath={item.poster_path}
                releaseDate={item.release_date}
                voteAverage={item.vote_average}
                onClick={() => navigate(`/movie/${item.id}`)}
              />
            ) : (
              <TVShowCard
                id={item.id}
                name={item.name || ''}
                posterPath={item.poster_path}
                firstAirDate={item.first_air_date}
                voteAverage={item.vote_average}
                onClick={() => navigate(`/tv/${item.id}`)}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection; 