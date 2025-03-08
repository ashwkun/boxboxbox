import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../services/watchlist';

interface WatchlistButtonProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onAdd?: () => void;
  onRemove?: () => void;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  mediaId,
  mediaType,
  title,
  posterPath,
  className = '',
  size = 'medium',
  onAdd,
  onRemove
}) => {
  const { currentUser } = useAuth();
  const [isInList, setIsInList] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Size classes
  const sizeClasses = {
    small: 'p-1.5 text-sm',
    medium: 'p-2 text-base',
    large: 'p-3 text-lg'
  };
  
  // Check if the item is in the watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!currentUser) {
        setIsInList(false);
        return;
      }
      
      try {
        const result = await isInWatchlist(currentUser.uid, mediaType, mediaId);
        setIsInList(result);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };
    
    checkWatchlist();
  }, [currentUser, mediaId, mediaType]);
  
  // Handle adding/removing from watchlist
  const handleToggleWatchlist = async () => {
    if (!currentUser) {
      // Redirect to login or show login prompt
      alert('Please log in to add items to your watchlist');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isInList) {
        await removeFromWatchlist(currentUser.uid, mediaType, mediaId);
        setIsInList(false);
        onRemove?.();
      } else {
        await addToWatchlist(currentUser.uid, mediaId, mediaType, title, posterPath);
        setIsInList(true);
        onAdd?.();
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.button
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]} ${
        isInList 
          ? 'bg-primary text-white hover:bg-primary/90' 
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
      } transition-colors ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={handleToggleWatchlist}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isInList ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isInList ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )}
    </motion.button>
  );
};

export default WatchlistButton; 