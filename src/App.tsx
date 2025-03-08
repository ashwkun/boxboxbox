import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/main.scss';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Placeholder components for pages not yet implemented
const Home = () => (
  <div className="page-container">
    <h1>Welcome to TV.io</h1>
    <p>Your personal movie and TV show tracking platform</p>
    <div className="coming-soon-container">
      <h2>Coming Soon</h2>
      <ul className="feature-list">
        <li>Browse trending movies and TV shows</li>
        <li>Search for specific titles</li>
        <li>View detailed information about movies and TV shows</li>
        <li>Track your watchlist</li>
        <li>Get personalized recommendations</li>
      </ul>
    </div>
  </div>
);

const Movies = () => (
  <div className="page-container">
    <h1>Movies</h1>
    <div className="coming-soon-container">
      <p>This page will display popular and trending movies from TMDB API.</p>
      <p>Check back soon for the completed feature!</p>
    </div>
  </div>
);

const TVShows = () => (
  <div className="page-container">
    <h1>TV Shows</h1>
    <div className="coming-soon-container">
      <p>This page will display popular and trending TV shows from TMDB API.</p>
      <p>Check back soon for the completed feature!</p>
    </div>
  </div>
);

const Watchlist = () => (
  <div className="page-container">
    <h1>My Watchlist</h1>
    <div className="coming-soon-container">
      <p>Your watchlist will appear here once Phase 6 is implemented.</p>
      <p>You'll be able to:</p>
      <ul>
        <li>Add movies and TV shows to your watchlist</li>
        <li>Mark items as watched</li>
        <li>Filter and sort your watchlist</li>
        <li>Get recommendations based on your watchlist</li>
      </ul>
    </div>
  </div>
);

const NotFound = () => (
  <div className="page-container">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <Link to="/" className="go-home-button">Go to Home</Link>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <header className="app-header">
          <div className="logo">TV.io</div>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/tvshows">TV Shows</Link></li>
              <li><Link to="/watchlist">My Watchlist</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </nav>
          <UserProfile />
        </header>
        
        <main className="app-main">
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
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} TV.io - All rights reserved</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App; 