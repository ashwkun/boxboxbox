import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  // Redirect if user is not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-white/80">Manage your personal information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Panel */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-6 text-center border-b border-gray-100">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary text-white flex items-center justify-center text-4xl font-bold">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '?'}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800">{currentUser.displayName}</h2>
              <p className="text-gray-500 mt-1">{currentUser.email}</p>
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">Watched</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">Watchlist</p>
                </div>
                <div className="p-3">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">Reviews</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Settings Panels */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
          {/* Account Settings */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Account Settings</h3>
            <p className="text-gray-500 italic">Coming soon: Account management options</p>
          </motion.div>
          
          {/* Preferences */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Preferences</h3>
            <p className="text-gray-500 italic mb-4">Coming soon: Set your favorite genres and other preferences</p>
            
            <div className="opacity-50 pointer-events-none">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Favorite Genres</label>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Action</span>
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Comedy</span>
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Drama</span>
                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Sci-Fi</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email Notifications</label>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary rounded" disabled />
                  <span className="ml-2 text-gray-700">Receive recommendations</span>
                </div>
                <div className="flex items-center mt-2">
                  <input type="checkbox" className="h-4 w-4 text-primary rounded" disabled />
                  <span className="ml-2 text-gray-700">New releases for watched shows</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Connected Services */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Connected Services</h3>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
                <span className="ml-3 font-medium text-gray-700">Google</span>
              </div>
              <span className="text-green-500 text-sm font-medium">Connected</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 