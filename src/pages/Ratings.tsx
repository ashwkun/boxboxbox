import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserRatings } from '../services/ratings';
import RatingStats from '../components/RatingStats';
import RatedItems from '../components/RatedItems';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Ratings: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getUserRatings(currentUser.uid);
        setRatings(data);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        setError('Failed to load your ratings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="container-page flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  const ratedItems = ratings.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
    posterPath: item.posterPath,
    mood: item.rating.mood,
    wouldRewatch: item.rating.wouldRewatch,
    updatedAt: item.rating.updatedAt
  }));

  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Ratings</h1>
        <p className="text-white/90">Track and manage your movie and TV show ratings</p>
      </div>

      {ratings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <span className="text-6xl mb-4 block" role="img" aria-label="empty">🎬</span>
          <h2 className="text-xl font-semibold mb-2">No Ratings Yet</h2>
          <p className="text-gray-600 mb-6">
            Start rating movies and TV shows to see your stats and recommendations
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <RatingStats ratings={ratedItems} />
          </motion.div>

          {/* Rated Items Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <RatedItems items={ratedItems} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Ratings; 