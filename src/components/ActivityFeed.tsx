import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Activity, getActivityFeed } from '../services/social';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../services/tmdb';
import LoadingSpinner from './LoadingSpinner';

const ActivityFeed: React.FC = () => {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getActivityFeed(currentUser.uid);
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activity feed:', error);
        setError('Failed to load activity feed');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <span className="text-4xl mb-4 block" role="img" aria-label="empty">🎬</span>
        <h3 className="text-xl font-semibold mb-2">No Activity Yet</h3>
        <p className="text-gray-600">
          Follow other users to see their activity here
        </p>
      </div>
    );
  }

  const getImageUrlSafe = (path: string | null | undefined): string | undefined => {
    return path ? getImageUrl(path, 'w92') : undefined;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            {/* User Info */}
            <div className="flex items-center mb-4">
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
              <div className="ml-3">
                <Link 
                  to={`/profile/${activity.userId}`}
                  className="font-semibold hover:text-primary"
                >
                  {activity.userDisplayName}
                </Link>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Activity Content */}
            <div className="ml-13">
              {activity.type === 'rating' && activity.mediaTitle && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16">
                    {activity.mediaPosterPath && (
                      <img
                        src={getImageUrlSafe(activity.mediaPosterPath)}
                        alt={activity.mediaTitle}
                        className="w-full rounded"
                      />
                    )}
                  </div>
                  <div>
                    <p>
                      rated{' '}
                      <Link 
                        to={`/${activity.mediaType}/${activity.mediaId}`}
                        className="font-semibold hover:text-primary"
                      >
                        {activity.mediaTitle}
                      </Link>
                    </p>
                    {activity.rating && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xl" role="img" aria-label={activity.rating.mood}>
                          {activity.rating.mood}
                        </span>
                        {activity.rating.wouldRewatch && (
                          <span className="text-sm text-secondary">Would watch again 🔄</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activity.type === 'watch' && activity.mediaTitle && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16">
                    {activity.mediaPosterPath && (
                      <img
                        src={getImageUrlSafe(activity.mediaPosterPath)}
                        alt={activity.mediaTitle}
                        className="w-full rounded"
                      />
                    )}
                  </div>
                  <div>
                    <p>
                      watched{' '}
                      <Link 
                        to={`/${activity.mediaType}/${activity.mediaId}`}
                        className="font-semibold hover:text-primary"
                      >
                        {activity.mediaTitle}
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {activity.type === 'follow' && activity.targetUserDisplayName && (
                <p>
                  started following{' '}
                  <Link 
                    to={`/profile/${activity.targetUserId}`}
                    className="font-semibold hover:text-primary"
                  >
                    {activity.targetUserDisplayName}
                  </Link>
                </p>
              )}

              {activity.type === 'share' && activity.sharedListTitle && (
                <p>
                  shared their list{' '}
                  <span className="font-semibold">"{activity.sharedListTitle}"</span>
                  {activity.targetUserId && activity.targetUserDisplayName && (
                    <>
                      {' '}with{' '}
                      <Link 
                        to={`/profile/${activity.targetUserId}`}
                        className="font-semibold hover:text-primary"
                      >
                        {activity.targetUserDisplayName}
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ActivityFeed; 