import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container-page flex items-center justify-center min-h-[80vh]">
      <motion.div 
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Welcome to tv.io</h1>
        </div>
        <div className="p-8">
          <p className="text-gray-600 mb-8 text-center">
            Track your favorite movies and TV shows, get personalized recommendations, and more.
          </p>
          <div className="flex flex-col items-center">
            <LoginButton />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 