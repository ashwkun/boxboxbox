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
  UserProfile,
  enableSocialFeatures,
  hasSocialFeatures,
  getActivityFeed,
  getFollowingActivityFeed,
  Activity
} from '../services/social';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';

const People: React.FC = () => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [followingActivities, setFollowingActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSocial, setHasSocial] = useState(false);
  const [enablingSocial, setEnablingSocial] = useState(false);

  useEffect(() => {
    const checkSocialFeatures = async () => {
      if (!currentUser) return;
      const enabled = await hasSocialFeatures(currentUser.uid);
      setHasSocial(enabled);
    };
    checkSocialFeatures();
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !hasSocial) return;

      try {
        setLoading(true);
        setError(null);
        const [followersData, followingData, suggestedUsers, activityData, followingActivityData] = await Promise.all([
          getFollowers(currentUser.uid),
          getFollowing(currentUser.uid),
          getSuggestedUsers(currentUser.uid),
          getActivityFeed(currentUser.uid),
          getFollowingActivityFeed(currentUser.uid, 10)
        ]);
        setFollowers(followersData);
        setFollowing(followingData);
        setSuggestions(suggestedUsers);
        setActivities(activityData);
        setFollowingActivities(followingActivityData);
      } catch (error) {
        console.error('Error fetching social data:', error);
        setError('Failed to load social data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, hasSocial]);

  const handleEnableSocial = async () => {
    if (!currentUser) return;

    try {
      setEnablingSocial(true);
      await enableSocialFeatures(
        currentUser.uid,
        currentUser.displayName || 'Anonymous User',
        currentUser.photoURL
      );
      setHasSocial(true);
    } catch (error) {
      console.error('Error enabling social features:', error);
      setError('Failed to enable social features');
    } finally {
      setEnablingSocial(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!currentUser || !query.trim() || !hasSocial) {
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

  const renderActivityCard = (activity: Activity) => {
    const getActivityText = () => {
      switch (activity.type) {
        case 'rating':
          return (
            <>
              rated <Link to={`/${activity.mediaType}/${activity.mediaId}`} className="font-medium hover:underline">{activity.mediaTitle}</Link>
              {activity.rating && (
                <span className="text-gray-500">
                  {' '}with {activity.rating.mood} mood{activity.rating.wouldRewatch ? ' and would rewatch' : ''}
                </span>
              )}
            </>
          );
        case 'watch':
          return (
            <>watched <Link to={`/${activity.mediaType}/${activity.mediaId}`} className="font-medium hover:underline">{activity.mediaTitle}</Link></>
          );
        case 'follow':
          return (
            <>started following {activity.targetUserDisplayName}</>
          );
        case 'share':
          return (
            <>shared {activity.sharedListTitle} with {activity.targetUserDisplayName}</>
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <div className="flex items-start space-x-3">
          {activity.userPhotoURL ? (
            <img
              src={activity.userPhotoURL}
              alt={activity.userDisplayName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">
                {activity.userDisplayName[0]}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p>
              <span className="font-medium">{activity.userDisplayName}</span>
              {' '}
              {getActivityText()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(activity.createdAt).toLocaleDateString()}
            </p>
          </div>
          {activity.mediaPosterPath && (
            <Link 
              to={`/${activity.mediaType}/${activity.mediaId}`}
              className="flex-shrink-0 w-16 h-24 rounded overflow-hidden"
            >
              <img
                src={getImageUrl(activity.mediaPosterPath, 'w92')}
                alt={activity.mediaTitle}
                className="w-full h-full object-cover"
              />
            </Link>
          )}
        </div>
      </motion.div>
    );
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

  if (!hasSocial) {
    return (
      <div className="container-page">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Enable Social Features</h1>
          <p className="text-gray-600 mb-6">
            Connect with other movie and TV show enthusiasts by enabling social features.
            This will make your profile visible to other users.
          </p>
          <button
            onClick={handleEnableSocial}
            disabled={enablingSocial}
            className="btn btn-primary"
          >
            {enablingSocial ? 'Enabling...' : 'Enable Social Features'}
          </button>
        </div>
      </div>
    );
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
        <h1 className="text-3xl font-bold mb-4">People</h1>
        <p className="text-white/90 mb-6">Connect with other movie and TV show enthusiasts</p>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search users..."
          className="max-w-xl"
          compact
        />
      </div>

      {/* Following Users' Activity Feed */}
      {followingActivities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity From People You Follow</h2>
          <div className="space-y-4">
            {followingActivities.map(activity => renderActivityCard(activity))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      {activities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
          <div className="space-y-4">
            {activities.map(activity => renderActivityCard(activity))}
          </div>
        </div>
      )}

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