import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ActivityFeed from '../components/ActivityFeed';

const Activity: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
        <p className="text-white/90">See what your friends are watching and rating</p>
      </div>

      <ActivityFeed />
    </div>
  );
};

export default Activity; 