import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="page-container login-page">
      <div className="login-card">
        <h1>Welcome to TV.io</h1>
        <p className="login-description">
          Track your favorite movies and TV shows, get personalized recommendations, and more.
        </p>
        <div className="login-options">
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login; 