import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { tmdb } from './tmdb';

// Convert rating text to numerical value
const ratingToScore = (rating: string): number => {
  switch (rating) {
    case 'GREAT!': return 5;
    case 'GOOD': return 4;
    case 'MEH': return 2;
    case 'NOOO': return 1;
    case 'THINKING': return 3;
    default: return 0;
  }
};

// Calculate similarity between two users based on their ratings
const calculateUserSimilarity = (userRatings: Record<string, number>, otherRatings: Record<string, number>): number => {
  const commonMovies = Object.keys(userRatings).filter(movieId => otherRatings[movieId]);
  
  if (commonMovies.length === 0) return 0;

  const userAvg = commonMovies.reduce((sum, movieId) => sum + userRatings[movieId], 0) / commonMovies.length;
  const otherAvg = commonMovies.reduce((sum, movieId) => sum + otherRatings[movieId], 0) / commonMovies.length;

  let numerator = 0;
  let userDenominator = 0;
  let otherDenominator = 0;

  commonMovies.forEach(movieId => {
    const userDiff = userRatings[movieId] - userAvg;
    const otherDiff = otherRatings[movieId] - otherAvg;
    
    numerator += userDiff * otherDiff;
    userDenominator += userDiff * userDiff;
    otherDenominator += otherDiff * otherDiff;
  });

  const denominator = Math.sqrt(userDenominator) * Math.sqrt(otherDenominator);
  return denominator === 0 ? 0 : numerator / denominator;
};

export const recommendations = {
  // Get user's rating map
  async getUserRatings(userId: string): Promise<Record<string, number>> {
    const ratingsRef = collection(db, 'users', userId, 'ratings');
    const snapshot = await getDocs(ratingsRef);
    
    const ratings: Record<string, number> = {};
    snapshot.forEach(doc => {
      ratings[doc.id] = ratingToScore(doc.data().rating);
    });
    
    return ratings;
  },

  // Get similar users
  async getSimilarUsers(userId: string, userRatings: Record<string, number>, limit = 10): Promise<string[]> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const similarities: Array<{id: string, similarity: number}> = [];
    
    for (const doc of snapshot.docs) {
      if (doc.id === userId) continue;
      
      const otherRatings = await this.getUserRatings(doc.id);
      const similarity = calculateUserSimilarity(userRatings, otherRatings);
      
      if (similarity > 0) {
        similarities.push({ id: doc.id, similarity });
      }
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(user => user.id);
  },

  // Get movie recommendations
  async getRecommendations(userId: string, page = 1): Promise<any[]> {
    try {
      // Get user's ratings
      const userRatings = await this.getUserRatings(userId);
      
      // Get similar users
      const similarUsers = await this.getSimilarUsers(userId, userRatings);
      
      // Get recommendations from similar users
      const recommendedMovies = new Map<string, { score: number, count: number }>();
      
      for (const similarUserId of similarUsers) {
        const ratings = await this.getUserRatings(similarUserId);
        
        for (const [movieId, rating] of Object.entries(ratings)) {
          // Skip movies the user has already rated
          if (userRatings[movieId]) continue;
          
          const current = recommendedMovies.get(movieId) || { score: 0, count: 0 };
          recommendedMovies.set(movieId, {
            score: current.score + rating,
            count: current.count + 1
          });
        }
      }
      
      // Calculate average scores and sort
      const recommendations = Array.from(recommendedMovies.entries())
        .map(([movieId, { score, count }]) => ({
          movieId,
          score: score / count
        }))
        .sort((a, b) => b.score - a.score)
        .slice((page - 1) * 20, page * 20);
      
      // Fetch movie details from TMDB
      const movieDetails = await Promise.all(
        recommendations.map(rec => 
          tmdb.getMovieDetails(parseInt(rec.movieId)).then(tmdb.formatMovie)
        )
      );
      
      return movieDetails;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  // Get personalized genre recommendations
  async getGenreRecommendations(userId: string): Promise<Array<{id: number, score: number}>> {
    const userRatings = await this.getUserRatings(userId);
    const genreScores: Record<number, { total: number, count: number }> = {};
    
    // Get movies details to access their genres
    for (const [movieId, rating] of Object.entries(userRatings)) {
      const movie = await tmdb.getMovieDetails(parseInt(movieId));
      
      movie.genre_ids.forEach(genreId => {
        if (!genreScores[genreId]) {
          genreScores[genreId] = { total: 0, count: 0 };
        }
        genreScores[genreId].total += rating;
        genreScores[genreId].count += 1;
      });
    }
    
    // Calculate average scores
    return Object.entries(genreScores)
      .map(([genreId, { total, count }]) => ({
        id: parseInt(genreId),
        score: total / count
      }))
      .sort((a, b) => b.score - a.score);
  }
}; 