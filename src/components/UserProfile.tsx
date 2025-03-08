import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="user-profile">
      <div className="user-profile-info">
        {currentUser.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt={currentUser.displayName || 'User'} 
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '?'}
          </div>
        )}
        <span className="user-name">{currentUser.displayName}</span>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default UserProfile; 