'use client';

import { useState, useEffect } from 'react';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { RatingCard } from '@/components/onboarding/RatingCard';
import { NeuralNetwork } from '@/components/onboarding/NeuralNetwork';
import { motion, AnimatePresence } from 'framer-motion';

// Temporary movie data for testing
const SAMPLE_MOVIES = [
  {
    id: '1',
    title: 'Inception',
    year: '2010',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    runtime: '2h 28m'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    year: '2008',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    runtime: '2h 32m'
  },
  {
    id: '3',
    title: 'Interstellar',
    year: '2014',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    runtime: '2h 49m'
  }
];

export default function OnboardingPage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMovie, setCurrentMovie] = useState(0);
  const [ratings, setRatings] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  // Update network complexity based on ratings count
  useEffect(() => {
    if (ratings.length > 10) {
      setComplexity('advanced');
    } else if (ratings.length > 5) {
      setComplexity('intermediate');
    }
  }, [ratings]);

  const handleRate = (rating: string) => {
    setRatings([...ratings, rating]);
    
    // Move to next movie
    if (currentMovie < SAMPLE_MOVIES.length - 1) {
      setCurrentMovie(curr => curr + 1);
    } else {
      // Move to next round
      setCurrentRound(curr => curr + 1);
      setCurrentMovie(0);
    }
  };

  return (
    <OnboardingLayout step={currentRound} totalSteps={12}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Neural Network Visualization */}
        <div className="w-full mb-12">
          <NeuralNetwork
            ratings={ratings.length}
            complexity={complexity}
          />
        </div>

        {/* Rating Cards */}
        <div className="relative w-full h-[60vh] max-w-4xl mx-auto">
          <AnimatePresence>
            {SAMPLE_MOVIES.map((movie, index) => {
              const position = 
                index === currentMovie ? 'center' :
                index === currentMovie - 1 ? 'left' :
                index === currentMovie + 1 ? 'right' : 'center';

              return (
                <RatingCard
                  key={movie.id}
                  movie={movie}
                  isActive={index === currentMovie}
                  position={position}
                  onRate={handleRate}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Skip/Refresh Options */}
        <motion.div
          className="mt-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className="px-6 py-3 rounded-xl bg-[#1E1E1E] text-[rgba(255,255,255,0.7)]
                     hover:bg-[#2A2A2A] transition-colors"
            onClick={() => handleRate('SKIP')}
          >
            Skip These Movies
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-[#1E1E1E] text-[rgba(255,255,255,0.7)]
                     hover:bg-[#2A2A2A] transition-colors"
          >
            Show Different Movies
          </button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
} 