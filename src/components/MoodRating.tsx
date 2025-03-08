import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodRating as MoodRatingType, MOOD_DETAILS } from '../types/rating';

interface MoodRatingProps {
  initialMood?: MoodRatingType;
  initialWouldRewatch?: boolean;
  onRate?: (mood: MoodRatingType, wouldRewatch: boolean) => void;
  disabled?: boolean;
}

const MoodRating: React.FC<MoodRatingProps> = ({
  initialMood,
  initialWouldRewatch = false,
  onRate,
  disabled = false
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodRatingType | null>(initialMood || null);
  const [wouldRewatch, setWouldRewatch] = useState(initialWouldRewatch);
  const [hoveredMood, setHoveredMood] = useState<MoodRatingType | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMoodSelect = (mood: MoodRatingType) => {
    if (disabled) return;
    
    setSelectedMood(mood);
    onRate?.(mood, wouldRewatch);
  };

  const handleRewatchToggle = () => {
    if (disabled) return;
    
    setWouldRewatch(prev => {
      const newValue = !prev;
      if (selectedMood) {
        onRate?.(selectedMood, newValue);
      }
      return newValue;
    });
  };

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {(Object.entries(MOOD_DETAILS) as [MoodRatingType, typeof MOOD_DETAILS[MoodRatingType]][]).map(([mood, details]) => (
            <motion.button
              key={mood}
              className={`p-3 rounded-full transition-transform ${
                selectedMood === mood 
                  ? 'bg-primary/10 scale-110' 
                  : 'hover:bg-gray-100'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileHover={{ scale: disabled ? 1 : 1.1 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              onClick={() => handleMoodSelect(mood)}
              onMouseEnter={() => {
                setHoveredMood(mood);
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setHoveredMood(null);
                setShowTooltip(false);
              }}
            >
              <span className="text-3xl" role="img" aria-label={details.label}>
                {details.emoji}
              </span>
              
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && hoveredMood === mood && (
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    <div className="font-medium">{details.label}</div>
                    <div className="text-gray-300 text-[10px]">{details.description}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        
        {/* Selected Mood Description */}
        <AnimatePresence mode="wait">
          {selectedMood && (
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-gray-600 text-center"
            >
              {MOOD_DETAILS[selectedMood].description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Would Rewatch Toggle */}
      {selectedMood && (
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleRewatchToggle}
            disabled={disabled}
            className={`
              flex items-center space-x-3 px-6 py-3 rounded-full text-sm font-medium
              transition-all duration-200
              ${wouldRewatch 
                ? 'bg-secondary text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span role="img" aria-label="rewatch" className="text-xl">
              {wouldRewatch ? '🔄' : '⭕'}
            </span>
            <span>{wouldRewatch ? 'Would watch again!' : 'Would you watch this again?'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MoodRating; 