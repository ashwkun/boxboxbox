import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

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
    <div className="page-container profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>
      
      <div className="profile-card">
        <div className="profile-image">
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              className="user-avatar-large"
            />
          ) : (
            <div className="user-avatar-placeholder-large">
              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '?'}
            </div>
          )}
        </div>
        
        <div className="profile-details">
          <h2>{currentUser.displayName}</h2>
          <p>{currentUser.email}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Watchlist</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Watched</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
          
          <button className="logout-button-large" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="profile-sections">
        <div className="profile-section">
          <h3>Preferences</h3>
          <p>Coming soon: Set your favorite genres and other preferences.</p>
        </div>
        
        <div className="profile-section">
          <h3>Account Settings</h3>
          <p>Coming soon: Manage your account settings.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 