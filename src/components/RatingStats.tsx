import React from 'react';
import { motion } from 'framer-motion';
import { MoodRating, MOOD_DETAILS } from '../types/rating';

interface RatingStatsProps {
  ratings: {
    mood: MoodRating;
    wouldRewatch: boolean;
    title: string;
    type: 'movie' | 'tv';
    id: number;
  }[];
}

const RatingStats: React.FC<RatingStatsProps> = ({ ratings }) => {
  // Calculate mood distribution
  const moodDistribution = Object.keys(MOOD_DETAILS).reduce((acc, mood) => {
    acc[mood as MoodRating] = ratings.filter(r => r.mood === mood).length;
    return acc;
  }, {} as Record<MoodRating, number>);

  // Calculate rewatch percentage
  const rewatchCount = ratings.filter(r => r.wouldRewatch).length;
  const rewatchPercentage = ratings.length > 0 
    ? Math.round((rewatchCount / ratings.length) * 100) 
    : 0;

  // Get most common mood
  const mostCommonMood = (Object.entries(moodDistribution) as [MoodRating, number][])
    .reduce((prev, [mood, count]) => 
      count > moodDistribution[prev] ? mood : prev
    , 'MEH' as MoodRating);

  // Calculate average rating value
  const averageValue = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + MOOD_DETAILS[r.mood].value, 0) / ratings.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Your Rating Stats</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Mood Distribution</h4>
          <div className="space-y-2">
            {(Object.entries(MOOD_DETAILS) as [MoodRating, typeof MOOD_DETAILS[MoodRating]][]).map(([mood, details]) => (
              <div key={mood} className="flex items-center">
                <span className="w-8 text-center mr-2" role="img" aria-label={details.label}>
                  {details.emoji}
                </span>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${ratings.length > 0 
                          ? (moodDistribution[mood] / ratings.length) * 100 
                          : 0}%` 
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-500 w-8 text-right">
                  {moodDistribution[mood]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Most Common Mood</h4>
            <div className="flex items-center">
              <span className="text-2xl mr-2" role="img" aria-label={MOOD_DETAILS[mostCommonMood].label}>
                {MOOD_DETAILS[mostCommonMood].emoji}
              </span>
              <span className="font-medium">{MOOD_DETAILS[mostCommonMood].label}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Average Rating</h4>
            <div className="flex items-center">
              <span className={`inline-block w-10 h-10 rounded-full mr-3 flex items-center justify-center text-sm font-bold text-white ${
                averageValue >= 4 ? 'bg-green-500' : 
                averageValue >= 3 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {averageValue.toFixed(1)}
              </span>
              <span className="text-gray-600">out of 5.0</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Would Rewatch</h4>
            <div className="flex items-center">
              <span className="text-2xl mr-2" role="img" aria-label="rewatch">
                🔄
              </span>
              <span className="font-medium">{rewatchPercentage}% of ratings</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Total Ratings</h4>
            <div className="flex items-center">
              <span className="text-2xl mr-2" role="img" aria-label="total">
                📊
              </span>
              <span className="font-medium">{ratings.length} items rated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingStats; 