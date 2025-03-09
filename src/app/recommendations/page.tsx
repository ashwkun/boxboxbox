'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase/config';
import { recommendations } from '@/lib/services/recommendations';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RecommendationsPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [genrePreferences, setGenrePreferences] = useState<Array<{id: number, score: number}>>([]);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const [recommendedMovies, genres] = await Promise.all([
            recommendations.getRecommendations(user.uid, page),
            recommendations.getGenreRecommendations(user.uid)
          ]);
          setMovies(recommendedMovies);
          setGenrePreferences(genres);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-display text-white/70 text-center"
          >
            Finding your next favorite movies...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display mb-8"
        >
          Your Personalized Recommendations
        </motion.h1>

        {/* Genre Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display mb-4">Your Genre Preferences</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {genrePreferences.map((genre, index) => (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 px-6 py-3 rounded-xl bg-[#1E1E1E] text-white/70"
              >
                {genre.id} ({genre.score.toFixed(1)})
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05
                }}
                className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#1E1E1E] cursor-pointer"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  priority={index < 8}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <h3 className="font-display text-lg mb-1">{movie.title}</h3>
                  <p className="text-sm text-white/70">{movie.year}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-4">
          <button
            className="px-6 py-3 rounded-xl bg-[#1E1E1E] text-white/70 hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-[#1E1E1E] text-white/70 hover:bg-[#2A2A2A]"
            onClick={() => setPage(p => p + 1)}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
} 