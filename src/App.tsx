import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/main.scss';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';

// Placeholder for Watchlist component (will be implemented in Phase 6)
const Watchlist = () => (
  <div className="container-page">
    <h1 className="text-2xl font-semibold text-primary mb-4">My Watchlist</h1>
    <div className="card p-8 mt-6">
      <p className="mb-4">Your watchlist will appear here once Phase 6 is implemented.</p>
      <p className="mb-2">You'll be able to:</p>
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Add movies and TV shows to your watchlist</li>
        <li>Mark items as watched</li>
        <li>Filter and sort your watchlist</li>
        <li>Get recommendations based on your watchlist</li>
      </ul>
    </div>
  </div>
);

const NotFound = () => (
  <div className="container-page flex flex-col items-center justify-center min-h-[60vh]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-primary mb-4">404 - Page Not Found</h1>
      <p className="text-text-light text-lg mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary inline-block mt-4">Go to Home</Link>
    </motion.div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-card shadow-card py-4 px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-primary text-2xl font-bold hover:no-underline">tv.io</Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link to="/" className="font-medium text-text-primary hover:text-primary hover:no-underline transition-colors">Home</Link></li>
                <li><Link to="/movies" className="font-medium text-text-primary hover:text-primary hover:no-underline transition-colors">Movies</Link></li>
                <li><Link to="/tvshows" className="font-medium text-text-primary hover:text-primary hover:no-underline transition-colors">TV Shows</Link></li>
                <li><Link to="/watchlist" className="font-medium text-text-primary hover:text-primary hover:no-underline transition-colors">My Watchlist</Link></li>
                <li><Link to="/profile" className="font-medium text-text-primary hover:text-primary hover:no-underline transition-colors">Profile</Link></li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              <UserProfile />
              {/* Mobile menu button would go here */}
            </div>
          </div>
        </header>
        
        <main className="flex-1 py-6 px-4">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tvshows" element={<TVShows />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <footer className="bg-card py-6 px-4 text-center text-text-light text-sm">
          <p>&copy; {new Date().getFullYear()} tv.io - All rights reserved</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App; 