import React from 'react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  type: 'all' | 'movie' | 'tv';
  onTypeChange: (type: 'all' | 'movie' | 'tv') => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  type,
  onTypeChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">Type:</span>
        <div className="flex space-x-2">
          <FilterButton 
            active={type === 'all'} 
            onClick={() => onTypeChange('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={type === 'movie'} 
            onClick={() => onTypeChange('movie')}
          >
            Movies
          </FilterButton>
          <FilterButton 
            active={type === 'tv'} 
            onClick={() => onTypeChange('tv')}
          >
            TV Shows
          </FilterButton>
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, children }) => {
  return (
    <motion.button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default SearchFilters; 