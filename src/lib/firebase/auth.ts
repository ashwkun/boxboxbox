import { auth, db } from './config';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  onboardingCompleted: boolean;
  preferences?: {
    age_group?: string;
    country?: string;
    genres?: Record<string, number>;
    creators?: Record<string, number>;
  };
  createdAt: Date;
  lastLoginAt: Date;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        onboardingCompleted: false,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });

      return newUser;
    } else {
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      }, { merge: true });

      return userDoc.data() as UserProfile;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOut = () => firebaseSignOut(auth);

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Save onboarding ratings
export const saveOnboardingRatings = async (
  uid: string,
  ratings: Array<{
    movieId: string;
    rating: string;
    timestamp: Date;
  }>
) => {
  try {
    // Save each rating
    const batch = ratings.map(rating => 
      setDoc(doc(db, 'users', uid, 'ratings', rating.movieId), {
        rating: rating.rating,
        timestamp: rating.timestamp,
        context: 'onboarding'
      })
    );

    // Mark onboarding as completed
    batch.push(
      setDoc(doc(db, 'users', uid), {
        onboardingCompleted: true,
        lastUpdated: serverTimestamp()
      }, { merge: true })
    );

    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving onboarding ratings:', error);
    throw error;
  }
}; 