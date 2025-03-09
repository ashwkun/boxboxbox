import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
// import NotificationBell from './NotificationBell'; // Removed social feature
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tvshows' },
    ...(currentUser ? [
      { label: 'Watchlist', path: '/watchlist' },
      { label: 'Ratings', path: '/ratings' }
      // { label: 'People', path: '/people' } // Removed social feature
    ] : [])
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              tv.io
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Search Bar */}
            <div className="w-48 lg:w-64">
              <SearchBar 
                compact={true} 
                onSearch={() => {}}
                placeholder="Search..."
              />
            </div>
          </div>

          {/* User Profile / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* {currentUser && <NotificationBell />} */}
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 