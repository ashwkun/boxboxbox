import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  collection, 
  where, 
  orderBy, 
  getDocs,
  Timestamp,
  DocumentReference
} from 'firebase/firestore';
import { MoodRating, Rating } from '../types/rating';

interface RatingData {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  mood: MoodRating;
  wouldRewatch: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Add or update a rating
export const rateMedia = async (
  userId: string,
  mediaId: number,
  mediaType: 'movie' | 'tv',
  title: string,
  mood: MoodRating,
  wouldRewatch: boolean
): Promise<void> => {
  if (!userId) throw new Error('User must be logged in to rate');

  try {
    const ratingRef = doc(db, 'users', userId, 'ratings', `${mediaType}-${mediaId}`);
    const ratingDoc = await getDoc(ratingRef);
    
    const now = Timestamp.now();
    const ratingData: RatingData = {
      mediaId,
      mediaType,
      title,
      mood,
      wouldRewatch,
      updatedAt: now,
      createdAt: ratingDoc.exists() ? ratingDoc.data().createdAt : now
    };
    
    await setDoc(ratingRef, ratingData);
  } catch (error) {
    console.error('Error rating media:', error);
    throw error;
  }
};

// Get a specific rating
export const getRating = async (
  userId: string,
  mediaId: number,
  mediaType: 'movie' | 'tv'
): Promise<Rating | null> => {
  if (!userId) return null;

  try {
    const ratingRef = doc(db, 'users', userId, 'ratings', `${mediaType}-${mediaId}`);
    const ratingDoc = await getDoc(ratingRef);
    
    if (!ratingDoc.exists()) return null;
    
    const data = ratingDoc.data() as RatingData;
    return {
      mood: data.mood,
      wouldRewatch: data.wouldRewatch,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    };
  } catch (error) {
    console.error('Error getting rating:', error);
    throw error;
  }
};

// Get all ratings for a user
export const getUserRatings = async (
  userId: string,
  mediaType?: 'movie' | 'tv'
): Promise<{
  id: number;
  type: 'movie' | 'tv';
  title: string;
  rating: Rating;
}[]> => {
  if (!userId) return [];

  try {
    const ratingsRef = collection(db, 'users', userId, 'ratings');
    let ratingsQuery = query(ratingsRef, orderBy('updatedAt', 'desc'));
    
    if (mediaType) {
      ratingsQuery = query(
        ratingsRef,
        where('mediaType', '==', mediaType),
        orderBy('updatedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(ratingsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as RatingData;
      return {
        id: data.mediaId,
        type: data.mediaType,
        title: data.title,
        rating: {
          mood: data.mood,
          wouldRewatch: data.wouldRewatch,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        }
      };
    });
  } catch (error) {
    console.error('Error getting user ratings:', error);
    throw error;
  }
}; 