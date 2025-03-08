import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

export interface WatchlistItem {
  id: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  addedAt: Timestamp;
  watched: boolean;
  watchedAt?: Timestamp;
  rating?: number;
}

// Add an item to the user's watchlist
export const addToWatchlist = async (
  userId: string,
  mediaId: number,
  mediaType: 'movie' | 'tv',
  title: string,
  posterPath: string | null
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to add to watchlist');
  
  const itemId = `${mediaType}-${mediaId}`;
  const itemRef = doc(db, 'watchlists', userId, 'items', itemId);
  
  await setDoc(itemRef, {
    mediaId,
    mediaType,
    title,
    posterPath,
    addedAt: Timestamp.now(),
    watched: false
  });
};

// Remove an item from the user's watchlist
export const removeFromWatchlist = async (
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to remove from watchlist');
  
  const itemId = `${mediaType}-${mediaId}`;
  const itemRef = doc(db, 'watchlists', userId, 'items', itemId);
  
  await deleteDoc(itemRef);
};

// Check if an item is in the user's watchlist
export const isInWatchlist = async (
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<boolean> => {
  if (!userId) return false;
  
  const itemId = `${mediaType}-${mediaId}`;
  const itemRef = doc(db, 'watchlists', userId, 'items', itemId);
  const docSnap = await getDoc(itemRef);
  
  return docSnap.exists();
};

// Get all items in the user's watchlist
export const getWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  if (!userId) return [];
  
  const itemsRef = collection(db, 'watchlists', userId, 'items');
  const q = query(itemsRef, orderBy('addedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WatchlistItem[];
};

// Get unwatched items in the user's watchlist
export const getUnwatchedItems = async (userId: string): Promise<WatchlistItem[]> => {
  if (!userId) return [];
  
  const itemsRef = collection(db, 'watchlists', userId, 'items');
  const q = query(itemsRef, where('watched', '==', false), orderBy('addedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WatchlistItem[];
};

// Get watched items in the user's watchlist
export const getWatchedItems = async (userId: string): Promise<WatchlistItem[]> => {
  if (!userId) return [];
  
  const itemsRef = collection(db, 'watchlists', userId, 'items');
  const q = query(itemsRef, where('watched', '==', true), orderBy('watchedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WatchlistItem[];
};

// Mark an item as watched
export const markAsWatched = async (
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number,
  rating?: number
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to update watchlist');
  
  const itemId = `${mediaType}-${mediaId}`;
  const itemRef = doc(db, 'watchlists', userId, 'items', itemId);
  
  const updateData: Partial<WatchlistItem> = {
    watched: true,
    watchedAt: Timestamp.now()
  };
  
  if (rating !== undefined) {
    updateData.rating = rating;
  }
  
  await setDoc(itemRef, updateData, { merge: true });
};

// Mark an item as unwatched
export const markAsUnwatched = async (
  userId: string,
  mediaType: 'movie' | 'tv',
  mediaId: number
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to update watchlist');
  
  const itemId = `${mediaType}-${mediaId}`;
  const itemRef = doc(db, 'watchlists', userId, 'items', itemId);
  
  await setDoc(itemRef, {
    watched: false,
    watchedAt: null,
    rating: null
  }, { merge: true });
}; 