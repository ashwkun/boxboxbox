'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { getUserProfile } from '@/services/userService';
import { Movie } from '@/services/tmdb';
import MovieGrid from '@/components/MovieGrid';

export default function FavoritesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Fetch user's favorites
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(user.uid);
        
        if (profile && profile.favorites) {
          // Convert user favorite items to Movie objects
          const favoriteMovies = profile.favorites.map((item: any) => ({
            id: item.id,
            title: item.title,
            poster_path: item.posterPath,
            backdrop_path: '',
            overview: '',
            release_date: '',
            vote_average: 0,
            vote_count: 0,
            genre_ids: []
          }));
          
          setMovies(favoriteMovies);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user, router]);
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Favorites</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <FiHeart className="mx-auto text-gray-600 mb-4" size={48} />
            <h2 className="text-xl font-medium text-white mb-2">Your favorites list is empty</h2>
            <p className="text-gray-400 mb-6">
              Start exploring movies and mark your favorites!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Discover Movies
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
} 