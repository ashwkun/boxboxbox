import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';

// Pages
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import TVShows from '../pages/TVShows';
import Search from '../pages/Search';
import MovieDetails from '../pages/MovieDetails';
import TVShowDetails from '../pages/TVShowDetails';
import Watchlist from '../pages/Watchlist';
import Ratings from '../pages/Ratings';
import Profile from '../pages/Profile';
import Login from '../pages/Login';

// NotFound component
const NotFound = () => (
  <div className="text-center">
    <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/movies" element={<Layout><Movies /></Layout>} />
      <Route path="/tvshows" element={<Layout><TVShows /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/movie/:id" element={<Layout><MovieDetails /></Layout>} />
      <Route path="/tv/:id" element={<Layout><TVShowDetails /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      
      {/* Protected routes */}
      <Route 
        path="/watchlist" 
        element={
          <Layout>
            <RequireAuth>
              <Watchlist />
            </RequireAuth>
          </Layout>
        } 
      />
      
      <Route 
        path="/ratings" 
        element={
          <Layout>
            <RequireAuth>
              <Ratings />
            </RequireAuth>
          </Layout>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <Layout>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </Layout>
        } 
      />
      
      {/* 404 - Not Found */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

export default AppRoutes; 