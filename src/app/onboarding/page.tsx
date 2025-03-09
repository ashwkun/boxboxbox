'use client';

import { useState, useEffect } from 'react';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { RatingCard } from '@/components/onboarding/RatingCard';
import { NeuralNetwork } from '@/components/onboarding/NeuralNetwork';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdb } from '@/lib/services/tmdb';
import { auth } from '@/lib/firebase/config';
import { saveOnboardingRatings } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMovie, setCurrentMovie] = useState(0);
  const [ratings, setRatings] = useState<Array<{movieId: string, rating: string, timestamp: Date}>>([]);
  const [complexity, setComplexity] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch movies for current round
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await tmdb.getOnboardingMovies(currentRound);
        const formattedMovies = response.results.map(tmdb.formatMovie);
        setMovies(formattedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [currentRound]);

  // Update network complexity based on ratings count
  useEffect(() => {
    if (ratings.length > 10) {
      setComplexity('advanced');
    } else if (ratings.length > 5) {
      setComplexity('intermediate');
    }
  }, [ratings]);

  const handleRate = async (rating: string) => {
    const currentMovieData = movies[currentMovie];
    const newRating = {
      movieId: currentMovieData.id,
      rating,
      timestamp: new Date()
    };
    
    setRatings(prev => [...prev, newRating]);
    
    // Move to next movie
    if (currentMovie < movies.length - 1) {
      setCurrentMovie(curr => curr + 1);
    } else {
      // Save ratings to Firestore if this is the last movie
      try {
        const user = auth.currentUser;
        if (user) {
          await saveOnboardingRatings(user.uid, ratings);
          // Redirect to recommendations page after saving
          router.push('/recommendations');
        }
      } catch (error) {
        console.error('Error saving ratings:', error);
      }
      
      // Move to next round
      setCurrentRound(curr => curr + 1);
      setCurrentMovie(0);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await tmdb.getOnboardingMovies(currentRound);
      const formattedMovies = response.results.map(tmdb.formatMovie);
      setMovies(formattedMovies);
      setCurrentMovie(0);
    } catch (error) {
      console.error('Error refreshing movies:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <OnboardingLayout step={currentRound} totalSteps={12}>
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-display text-white/70"
          >
            Loading amazing movies...
          </motion.div>
        </div>
      </OnboardingLayout>
    );
  }

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
          <AnimatePresence mode="wait">
            {movies.map((movie, index) => {
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
            onClick={handleRefresh}
          >
            Show Different Movies
          </button>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
} 