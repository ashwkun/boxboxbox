import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import SearchBar from './components/SearchBar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Search from './pages/Search';

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
      <p className="text-gray-500 text-lg mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary inline-block mt-4">Go to Home</Link>
    </motion.div>
  </div>
);

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow-md py-4 px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-primary text-2xl font-bold hover:no-underline mr-8">tv.io</Link>
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li><Link to="/" className="font-medium text-gray-700 hover:text-primary hover:no-underline transition-colors">Home</Link></li>
                  <li><Link to="/movies" className="font-medium text-gray-700 hover:text-primary hover:no-underline transition-colors">Movies</Link></li>
                  <li><Link to="/tvshows" className="font-medium text-gray-700 hover:text-primary hover:no-underline transition-colors">TV Shows</Link></li>
                  <li><Link to="/watchlist" className="font-medium text-gray-700 hover:text-primary hover:no-underline transition-colors">My Watchlist</Link></li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block w-64">
                <SearchBar compact={true} />
              </div>
              <UserProfile />
              <button 
                className="md:hidden text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <SearchBar className="mb-4" />
              <ul className="space-y-2">
                <li><Link to="/" className="block px-2 py-1 font-medium text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                <li><Link to="/movies" className="block px-2 py-1 font-medium text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Movies</Link></li>
                <li><Link to="/tvshows" className="block px-2 py-1 font-medium text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>TV Shows</Link></li>
                <li><Link to="/watchlist" className="block px-2 py-1 font-medium text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>My Watchlist</Link></li>
                <li><Link to="/profile" className="block px-2 py-1 font-medium text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>
              </ul>
            </div>
          )}
        </header>
        
        <main className="flex-1 py-6 px-4">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tvshows" element={<TVShows />} />
              <Route path="/search" element={<Search />} />
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
        
        <footer className="bg-white py-6 px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} tv.io - All rights reserved</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App; 