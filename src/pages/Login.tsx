import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login, signup, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      if (isSignup) {
        // Create account
        const { user } = await signup(email, password);
        
        // Update profile with display name
        if (user && displayName) {
          await updateUserProfile({
            displayName,
            photoURL: null
          });
        }
      } else {
        // Login
        await login(email, password);
      }
      
      navigate('/');
    } catch (err: any) {
      console.error(`Error during ${isSignup ? 'signup' : 'login'}:`, err);
      setError(err.message || `Failed to ${isSignup ? 'create account' : 'log in'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError(null);
  };

  return (
    <div className="container-page flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-gray-700 mb-2">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required={isSignup}
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded font-medium hover:bg-primary-dark transition-colors"
            disabled={loading}
          >
            {loading 
              ? (isSignup ? 'Creating Account...' : 'Logging in...') 
              : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={toggleMode} 
            className="text-primary hover:underline"
          >
            {isSignup 
              ? 'Already have an account? Log In' 
              : 'Need an account? Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 