import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';

// Interfaces
export interface UserRating {
  movieId: number;
  rating: number;
  timestamp: number;
}

export interface UserMovie {
  id: number;
  title: string;
  posterPath: string;
  addedAt: number;
}

// Create or update user profile
export const createUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      watchlist: [],
      favorites: [],
      ratings: []
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No user profile found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Add movie to watchlist
export const addToWatchlist = async (userId: string, movie: UserMovie) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      watchlist: arrayUnion({
        ...movie,
        addedAt: Date.now()
      }),
      updatedAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error adding movie to watchlist:', error);
    return false;
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = async (userId: string, movieId: number) => {
  try {
    // First get the current watchlist
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const watchlist = userData.watchlist || [];
      
      // Find the movie to remove
      const movieToRemove = watchlist.find((item: UserMovie) => item.id === movieId);
      
      if (movieToRemove) {
        await updateDoc(userRef, {
          watchlist: arrayRemove(movieToRemove),
          updatedAt: Date.now()
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    return false;
  }
};

// Add movie to favorites
export const addToFavorites = async (userId: string, movie: UserMovie) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion({
        ...movie,
        addedAt: Date.now()
      }),
      updatedAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
    return false;
  }
};

// Remove movie from favorites
export const removeFromFavorites = async (userId: string, movieId: number) => {
  try {
    // First get the current favorites list
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const favorites = userData.favorites || [];
      
      // Find the movie to remove
      const movieToRemove = favorites.find((item: UserMovie) => item.id === movieId);
      
      if (movieToRemove) {
        await updateDoc(userRef, {
          favorites: arrayRemove(movieToRemove),
          updatedAt: Date.now()
        });
      }
    }
    return true;
  } catch (error) {
    console.error('Error removing movie from favorites:', error);
    return false;
  }
};

// Rate a movie
export const rateMovie = async (userId: string, movieId: number, rating: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // First get current ratings
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const ratings = userData.ratings || [];
      
      // Check if movie is already rated
      const existingRatingIndex = ratings.findIndex((r: UserRating) => r.movieId === movieId);
      
      if (existingRatingIndex >= 0) {
        // Update existing rating
        ratings[existingRatingIndex] = {
          movieId,
          rating,
          timestamp: Date.now()
        };
        
        await updateDoc(userRef, {
          ratings,
          updatedAt: Date.now()
        });
      } else {
        // Add new rating
        await updateDoc(userRef, {
          ratings: arrayUnion({
            movieId,
            rating,
            timestamp: Date.now()
          }),
          updatedAt: Date.now()
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error rating movie:', error);
    return false;
  }
};

// Get user's movie rating
export const getUserMovieRating = async (userId: string, movieId: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const ratings = userData.ratings || [];
      
      const movieRating = ratings.find((r: UserRating) => r.movieId === movieId);
      return movieRating ? movieRating.rating : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user movie rating:', error);
    return null;
  }
}; 