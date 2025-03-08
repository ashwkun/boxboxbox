import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  getFollowers, 
  getFollowing, 
  followUser, 
  unfollowUser, 
  searchUsers,
  getSuggestedUsers,
  UserProfile 
} from '../services/social';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import AdminPanel from '../components/AdminPanel';

const People: React.FC = () => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const [followersData, followingData, suggestedUsers] = await Promise.all([
          getFollowers(currentUser.uid),
          getFollowing(currentUser.uid),
          getSuggestedUsers(currentUser.uid)
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
        setSuggestions(suggestedUsers);
      } catch (error) {
        console.error('Error fetching social data:', error);
        setError('Failed to load social data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSearch = async (query: string) => {
    if (!currentUser || !query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await searchUsers(query, currentUser.uid);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;

    try {
      await followUser(currentUser.uid, userId);
      // Refresh following list
      const followingData = await getFollowing(currentUser.uid);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUser) return;

    try {
      await unfollowUser(currentUser.uid, userId);
      // Refresh following list
      const followingData = await getFollowing(currentUser.uid);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const renderUserCard = (user: UserProfile, isFollowing: boolean) => (
    <motion.div
      key={user.uid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">
              {user.displayName[0]}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium">{user.displayName}</h3>
          {user.bio && (
            <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
          )}
        </div>
      </div>
      {isFollowing ? (
        <button
          onClick={() => handleUnfollow(user.uid)}
          className="btn btn-secondary"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={() => handleFollow(user.uid)}
          className="btn btn-primary"
        >
          Follow
        </button>
      )}
    </motion.div>
  );

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
        <div className="text-center text-red-500 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <AdminPanel />
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">People</h1>
        <p className="text-white/90 mb-6">Connect with other movie and TV show enthusiasts</p>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search users..."
          className="max-w-xl"
          compact
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map(user => 
              renderUserCard(user, following.some(f => f.uid === user.uid))
            )}
          </div>
        </div>
      )}

      {/* Suggested Users */}
      {!searching && searchResults.length === 0 && suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Suggested for You</h2>
          <div className="space-y-4">
            {suggestions.map(user => 
              renderUserCard(user, following.some(f => f.uid === user.uid))
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Following Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Following ({following.length})</h2>
          <div className="space-y-4">
            {following.map(user => renderUserCard(user, true))}
            {following.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You're not following anyone yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Followers Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Followers ({followers.length})</h2>
          <div className="space-y-4">
            {followers.map(user => 
              renderUserCard(user, following.some(f => f.uid === user.uid))
            )}
            {followers.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No followers yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default People; 