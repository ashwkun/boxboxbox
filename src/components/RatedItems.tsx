import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodRating, MOOD_DETAILS } from '../types/rating';
import { getImageUrl } from '../services/tmdb';

interface RatedItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  posterPath: string | null;
  mood: MoodRating;
  wouldRewatch: boolean;
  updatedAt: Date;
}

interface RatedItemsProps {
  items: RatedItem[];
}

type SortOption = 'recent' | 'rating' | 'title';
type FilterOption = 'all' | 'movies' | 'tvshows' | 'rewatch';

const RatedItems: React.FC<RatedItemsProps> = ({ items }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);

  // Apply filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    if (filterBy === 'movies') {
      result = result.filter(item => item.type === 'movie');
    } else if (filterBy === 'tvshows') {
      result = result.filter(item => item.type === 'tv');
    } else if (filterBy === 'rewatch') {
      result = result.filter(item => item.wouldRewatch);
    }

    if (selectedMood) {
      result = result.filter(item => item.mood === selectedMood);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'rating':
        result.sort((a, b) => MOOD_DETAILS[b.mood].value - MOOD_DETAILS[a.mood].value);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [items, sortBy, filterBy, selectedMood]);

  const handleItemClick = (item: RatedItem) => {
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-500 mb-2">Filter By</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">All Items</option>
            <option value="movies">Movies Only</option>
            <option value="tvshows">TV Shows Only</option>
            <option value="rewatch">Would Rewatch</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-500 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Mood Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">Filter by Mood</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOOD_DETAILS).map(([mood, details]) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(selectedMood === mood as MoodRating ? null : mood as MoodRating)}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1
                ${selectedMood === mood 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span role="img" aria-label={details.label}>{details.emoji}</span>
              <span>{details.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedItems.map((item) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleItemClick(item)}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3]">
                {item.posterPath ? (
                  <img
                    src={getImageUrl(item.posterPath, 'w342') || ''}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">{item.title[0]}</span>
                  </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/75 rounded-full p-1">
                  <span role="img" aria-label={MOOD_DETAILS[item.mood].label}>
                    {MOOD_DETAILS[item.mood].emoji}
                  </span>
                </div>

                {/* Rewatch Badge */}
                {item.wouldRewatch && (
                  <div className="absolute bottom-2 right-2 bg-black/75 rounded-full p-1">
                    <span role="img" aria-label="would rewatch">🔄</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="p-2">
                <h3 className="font-medium text-sm truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <span className="text-4xl mb-4 block" role="img" aria-label="empty">🤔</span>
          <p className="text-gray-600">No items match your filters</p>
        </div>
      )}
    </div>
  );
};

export default RatedItems; 