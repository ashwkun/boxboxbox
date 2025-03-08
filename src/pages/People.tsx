import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getFollowers, getFollowing, followUser, unfollowUser, isFollowing, UserProfile } from '../services/social';
import LoadingSpinner from '../components/LoadingSpinner';

const People: React.FC = () => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const [followersData, followingData] = await Promise.all([
          getFollowers(currentUser.uid),
          getFollowing(currentUser.uid)
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (error) {
        console.error('Error fetching social data:', error);
        setError('Failed to load social data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">People</h1>
        <p className="text-white/90">Connect with other movie and TV show enthusiasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Following Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Following ({following.length})</h2>
          <div className="space-y-4">
            {following.map(user => (
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
                  </div>
                </div>
                <button
                  onClick={() => handleUnfollow(user.uid)}
                  className="btn btn-secondary"
                >
                  Unfollow
                </button>
              </motion.div>
            ))}
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
            {followers.map(user => (
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
                  </div>
                </div>
                {following.some(f => f.uid === user.uid) ? (
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
                    Follow Back
                  </button>
                )}
              </motion.div>
            ))}
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