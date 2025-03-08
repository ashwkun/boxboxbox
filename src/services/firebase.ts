import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from the README-CREDENTIALS.md file
const firebaseConfig = {
  apiKey: "AIzaSyAiqIVKcOV8JDAoFuLPqRkTI-zkRhsea3g",
  authDomain: "tviodb.firebaseapp.com",
  projectId: "tviodb",
  storageBucket: "tviodb.firebasestorage.app",
  messagingSenderId: "808986648679",
  appId: "1:808986648679:web:29ce4ea122d500cd0f74c2",
  measurementId: "G-DV0YMJEJRT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Helper functions for authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create/update user document in Firestore
    await createUserProfileDocument(user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

// Store user data in Firestore
export const createUserProfileDocument = async (user: User) => {
  if (!user) return;
  
  const userRef = doc(firestore, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);
  
  // If user doesn't exist in Firestore, create a new document
  if (!snapshot.exists()) {
    const { displayName, email, photoURL, uid } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        uid,
        createdAt,
        watchlist: [],
        watched: [],
        preferences: {
          favoriteGenres: []
        }
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }
  
  return userRef;
};

export const getCurrentUser = () => auth.currentUser; 