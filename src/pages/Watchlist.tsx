import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getWatchlist, getUnwatchedItems, getWatchedItems, markAsWatched, markAsUnwatched, removeFromWatchlist, WatchlistItem } from '../services/watchlist';
import { getImageUrl } from '../services/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Watchlist: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'unwatched' | 'watched'>('all');
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch watchlist items
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!currentUser) {
        setWatchlistItems([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        let items: WatchlistItem[] = [];
        
        switch (activeTab) {
          case 'all':
            items = await getWatchlist(currentUser.uid);
            break;
          case 'unwatched':
            items = await getUnwatchedItems(currentUser.uid);
            break;
          case 'watched':
            items = await getWatchedItems(currentUser.uid);
            break;
        }
        
        setWatchlistItems(items);
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load your watchlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatchlist();
  }, [currentUser, activeTab]);
  
  // Handle marking item as watched/unwatched
  const handleToggleWatched = async (item: WatchlistItem) => {
    if (!currentUser) return;
    
    try {
      if (item.watched) {
        await markAsUnwatched(currentUser.uid, item.mediaType, item.mediaId);
      } else {
        await markAsWatched(currentUser.uid, item.mediaType, item.mediaId);
      }
      
      // Update the local state
      setWatchlistItems(prev => 
        prev.map(i => 
          i.id === item.id 
            ? { ...i, watched: !i.watched } 
            : i
        )
      );
    } catch (err) {
      console.error('Error updating watched status:', err);
    }
  };
  
  // Handle removing item from watchlist
  const handleRemove = async (item: WatchlistItem) => {
    if (!currentUser) return;
    
    try {
      await removeFromWatchlist(currentUser.uid, item.mediaType, item.mediaId);
      
      // Update the local state
      setWatchlistItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };
  
  // Navigate to details page
  const handleItemClick = (item: WatchlistItem) => {
    navigate(`/${item.mediaType}/${item.mediaId}`);
  };
  
  // If user is not logged in, show login prompt
  if (!currentUser) {
    return (
      <div className="container-page">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
          <p className="text-white/90">Keep track of what you want to watch</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
          <p className="mb-6">You need to be signed in to view and manage your watchlist.</p>
          <Link to="/login" className="btn btn-primary px-6 py-2">Sign In</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-white/90">Keep track of what you want to watch</p>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'all' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'unwatched' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('unwatched')}
          >
            To Watch
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'watched' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('watched')}
          >
            Watched
          </button>
        </div>
        
        {/* Watchlist Content */}
        <div className="p-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : watchlistItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' 
                  ? 'Your watchlist is empty.' 
                  : activeTab === 'unwatched' 
                    ? 'You don\'t have any unwatched items.' 
                    : 'You haven\'t marked any items as watched yet.'}
              </p>
              {activeTab !== 'all' && (
                <button 
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab('all')}
                >
                  View all items
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {watchlistItems.map(item => (
                  <motion.div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Poster */}
                      <div 
                        className="sm:w-24 md:w-32 flex-shrink-0 cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        {item.posterPath ? (
                          <img
                            src={getImageUrl(item.posterPath, 'w185') || ''}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-[2/3]">
                            <span className="text-gray-400 text-2xl">{item.title[0]}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 
                              className="text-lg font-semibold cursor-pointer hover:text-primary"
                              onClick={() => handleItemClick(item)}
                            >
                              {item.title}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                              {item.mediaType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Added on {item.addedAt.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <button
                            className={`text-sm px-3 py-1 rounded-full ${
                              item.watched 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            onClick={() => handleToggleWatched(item)}
                          >
                            {item.watched ? 'Watched' : 'Mark as Watched'}
                          </button>
                          
                          <button
                            className="text-sm text-red-500 hover:text-red-700"
                            onClick={() => handleRemove(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist; 