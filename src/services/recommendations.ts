import { 
  getMovieDetails, 
  getTVShowDetails, 
  getMovieRecommendations, 
  getTVShowRecommendations,
  getMoviesByGenre,
  getTVShowsByGenre 
} from './tmdb';
import { getWatchedItems, WatchlistItem } from './watchlist';
import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  arrayUnion, 
  arrayRemove,
  Timestamp
} from 'firebase/firestore';

// Store user genre preferences
export interface GenrePreference {
  id: number;
  name: string;
  type: 'movie' | 'tv';
  weight: number; // 1-5, where 5 is most preferred
}

// Store actor/director preferences
export interface PersonPreference {
  id: number;
  name: string;
  type: 'actor' | 'director';
  weight: number; // 1-5, where 5 is most preferred
}

export interface RecommendationSettings {
  enableGenreRecommendations: boolean;
  enableCastRecommendations: boolean;
  enableDirectorRecommendations: boolean;
  enableWatchedBasedRecommendations: boolean;
  preferredGenres: GenrePreference[];
  preferredPeople: PersonPreference[];
  lastUpdated: Timestamp;
}

// Default settings for new users
export const defaultSettings: RecommendationSettings = {
  enableGenreRecommendations: true,
  enableCastRecommendations: true,
  enableDirectorRecommendations: true,
  enableWatchedBasedRecommendations: true,
  preferredGenres: [],
  preferredPeople: [],
  lastUpdated: Timestamp.now()
};

// Get user recommendation settings
export const getRecommendationSettings = async (userId: string): Promise<RecommendationSettings> => {
  if (!userId) return defaultSettings;
  
  try {
    const settingsRef = doc(db, 'users', userId, 'preferences', 'recommendations');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return settingsDoc.data() as RecommendationSettings;
    } else {
      // Initialize with default settings
      await setDoc(settingsRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error getting recommendation settings:', error);
    return defaultSettings;
  }
};

// Update user recommendation settings
export const updateRecommendationSettings = async (
  userId: string, 
  settings: Partial<RecommendationSettings>
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to update settings');
  
  try {
    const settingsRef = doc(db, 'users', userId, 'preferences', 'recommendations');
    await setDoc(settingsRef, {
      ...settings,
      lastUpdated: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating recommendation settings:', error);
    throw error;
  }
};

// Add a genre preference
export const addGenrePreference = async (
  userId: string,
  genre: GenrePreference
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to update preferences');
  
  try {
    const settingsRef = doc(db, 'users', userId, 'preferences', 'recommendations');
    
    // Check if genre already exists and remove it to avoid duplicates
    await setDoc(settingsRef, {
      preferredGenres: arrayRemove(...(await getGenrePreferences(userId)).filter(g => g.id === genre.id && g.type === genre.type)),
    }, { merge: true });
    
    // Add the genre with new weight
    await setDoc(settingsRef, {
      preferredGenres: arrayUnion(genre),
      lastUpdated: Timestamp.now()
    }, { merge: true });
    
  } catch (error) {
    console.error('Error adding genre preference:', error);
    throw error;
  }
};

// Remove a genre preference
export const removeGenrePreference = async (
  userId: string,
  genreId: number,
  type: 'movie' | 'tv'
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to update preferences');
  
  try {
    const settingsRef = doc(db, 'users', userId, 'preferences', 'recommendations');
    const genresToRemove = (await getGenrePreferences(userId)).filter(g => g.id === genreId && g.type === type);
    
    await setDoc(settingsRef, {
      preferredGenres: arrayRemove(...genresToRemove),
      lastUpdated: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error removing genre preference:', error);
    throw error;
  }
};

// Get user genre preferences
export const getGenrePreferences = async (userId: string): Promise<GenrePreference[]> => {
  if (!userId) return [];
  
  try {
    const settings = await getRecommendationSettings(userId);
    return settings.preferredGenres || [];
  } catch (error) {
    console.error('Error getting genre preferences:', error);
    return [];
  }
};

// Generate recommendations based on watched content
export const getWatchedBasedRecommendations = async (userId: string, limit = 10) => {
  if (!userId) return { movies: [], tvShows: [] };
  
  try {
    // Get user's watched items
    const watchedItems = await getWatchedItems(userId);
    
    if (watchedItems.length === 0) {
      return { movies: [], tvShows: [] };
    }
    
    // Separate movies and TV shows
    const watchedMovies = watchedItems.filter(item => item.mediaType === 'movie');
    const watchedTVShows = watchedItems.filter(item => item.mediaType === 'tv');
    
    // Get recommendations for most recently watched items
    let movieRecs: any[] = [];
    let tvRecs: any[] = [];
    
    // Get movie recommendations
    if (watchedMovies.length > 0) {
      // Sort by watchedAt (most recent first)
      const sortedMovies = watchedMovies.sort((a, b) => 
        b.watchedAt?.toDate().getTime() - a.watchedAt?.toDate().getTime()
      );
      
      // Get recommendations for up to 3 most recently watched movies
      const recentMovies = sortedMovies.slice(0, 3);
      
      for (const movie of recentMovies) {
        try {
          const recs = await getMovieRecommendations(movie.mediaId);
          if (recs.results && recs.results.length > 0) {
            // Add source movie info for "Because you watched..." sections
            const results = recs.results.map(rec => ({
              ...rec,
              recommendedBecause: {
                id: movie.mediaId,
                title: movie.title,
                mediaType: 'movie'
              }
            }));
            movieRecs = [...movieRecs, ...results];
          }
        } catch (error) {
          console.error(`Error getting recommendations for movie ${movie.mediaId}:`, error);
        }
      }
    }
    
    // Get TV show recommendations
    if (watchedTVShows.length > 0) {
      // Sort by watchedAt (most recent first)
      const sortedTVShows = watchedTVShows.sort((a, b) => 
        b.watchedAt?.toDate().getTime() - a.watchedAt?.toDate().getTime()
      );
      
      // Get recommendations for up to 3 most recently watched TV shows
      const recentTVShows = sortedTVShows.slice(0, 3);
      
      for (const tvShow of recentTVShows) {
        try {
          const recs = await getTVShowRecommendations(tvShow.mediaId);
          if (recs.results && recs.results.length > 0) {
            // Add source show info for "Because you watched..." sections
            const results = recs.results.map(rec => ({
              ...rec,
              recommendedBecause: {
                id: tvShow.mediaId,
                title: tvShow.title,
                mediaType: 'tv'
              }
            }));
            tvRecs = [...tvRecs, ...results];
          }
        } catch (error) {
          console.error(`Error getting recommendations for TV show ${tvShow.mediaId}:`, error);
        }
      }
    }
    
    // Remove duplicates (in case the same item is recommended multiple times)
    const uniqueMovieRecs = [...new Map(movieRecs.map(item => [item.id, item])).values()];
    const uniqueTVRecs = [...new Map(tvRecs.map(item => [item.id, item])).values()];
    
    // Limit the number of recommendations
    return {
      movies: uniqueMovieRecs.slice(0, limit),
      tvShows: uniqueTVRecs.slice(0, limit)
    };
    
  } catch (error) {
    console.error('Error generating watched-based recommendations:', error);
    return { movies: [], tvShows: [] };
  }
};

// Generate recommendations based on user's preferred genres
export const getGenreBasedRecommendations = async (userId: string, limit = 10) => {
  if (!userId) return { movies: [], tvShows: [] };
  
  try {
    // Get user's genre preferences
    const genrePreferences = await getGenrePreferences(userId);
    
    if (genrePreferences.length === 0) {
      return { movies: [], tvShows: [] };
    }
    
    // Separate movie and TV show genres
    const movieGenres = genrePreferences.filter(g => g.type === 'movie').sort((a, b) => b.weight - a.weight);
    const tvGenres = genrePreferences.filter(g => g.type === 'tv').sort((a, b) => b.weight - a.weight);
    
    let movieRecs: any[] = [];
    let tvRecs: any[] = [];
    
    // Get movie recommendations based on genres
    if (movieGenres.length > 0) {
      // Use up to 3 top genres
      const topMovieGenres = movieGenres.slice(0, 3);
      
      for (const genre of topMovieGenres) {
        try {
          const results = await getMoviesByGenre(genre.id);
          if (results.results && results.results.length > 0) {
            // Add genre info for "Based on your interest in..." sections
            const genreResults = results.results.map(movie => ({
              ...movie,
              recommendedBecauseGenre: {
                id: genre.id,
                name: genre.name,
                mediaType: 'movie'
              }
            }));
            movieRecs = [...movieRecs, ...genreResults];
          }
        } catch (error) {
          console.error(`Error getting movies for genre ${genre.id}:`, error);
        }
      }
    }
    
    // Get TV show recommendations based on genres
    if (tvGenres.length > 0) {
      // Use up to 3 top genres
      const topTVGenres = tvGenres.slice(0, 3);
      
      for (const genre of topTVGenres) {
        try {
          const results = await getTVShowsByGenre(genre.id);
          if (results.results && results.results.length > 0) {
            // Add genre info for "Based on your interest in..." sections
            const genreResults = results.results.map(tvShow => ({
              ...tvShow,
              recommendedBecauseGenre: {
                id: genre.id,
                name: genre.name,
                mediaType: 'tv'
              }
            }));
            tvRecs = [...tvRecs, ...genreResults];
          }
        } catch (error) {
          console.error(`Error getting TV shows for genre ${genre.id}:`, error);
        }
      }
    }
    
    // Remove duplicates
    const uniqueMovieRecs = [...new Map(movieRecs.map(item => [item.id, item])).values()];
    const uniqueTVRecs = [...new Map(tvRecs.map(item => [item.id, item])).values()];
    
    // Limit the number of recommendations
    return {
      movies: uniqueMovieRecs.slice(0, limit),
      tvShows: uniqueTVRecs.slice(0, limit)
    };
    
  } catch (error) {
    console.error('Error generating genre-based recommendations:', error);
    return { movies: [], tvShows: [] };
  }
};

// Combine different recommendation types
export const getAllRecommendations = async (userId: string) => {
  if (!userId) return { watchedBased: { movies: [], tvShows: [] }, genreBased: { movies: [], tvShows: [] } };
  
  try {
    // Get user settings to check what's enabled
    const settings = await getRecommendationSettings(userId);
    
    // Initialize recommendations object
    const recommendations = {
      watchedBased: { movies: [], tvShows: [] },
      genreBased: { movies: [], tvShows: [] }
    };
    
    // Get watched-based recommendations if enabled
    if (settings.enableWatchedBasedRecommendations) {
      recommendations.watchedBased = await getWatchedBasedRecommendations(userId);
    }
    
    // Get genre-based recommendations if enabled
    if (settings.enableGenreRecommendations) {
      recommendations.genreBased = await getGenreBasedRecommendations(userId);
    }
    
    return recommendations;
    
  } catch (error) {
    console.error('Error generating all recommendations:', error);
    return { watchedBased: { movies: [], tvShows: [] }, genreBased: { movies: [], tvShows: [] } };
  }
}; 