import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
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
  
  const { displayName, email, photoURL, uid } = user;
  const now = new Date();
  
  try {
    if (!snapshot.exists()) {
      // Create new user document
      await setDoc(userRef, {
        displayName,
        displayNameLower: displayName?.toLowerCase() || '',
        email,
        photoURL,
        uid,
        createdAt: now,
        watchlist: [],
        watched: [],
        preferences: {
          favoriteGenres: []
        }
      });
    } else {
      // Update existing user's displayNameLower if needed
      const data = snapshot.data();
      if (data.displayName && (!data.displayNameLower || data.displayNameLower !== data.displayName.toLowerCase())) {
        await setDoc(userRef, {
          ...data,
          displayNameLower: data.displayName.toLowerCase(),
          updatedAt: now
        }, { merge: true });
      }
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
  }
  
  return userRef;
};

export const getCurrentUser = () => auth.currentUser;

// Migrate existing users to add displayNameLower field
export const migrateExistingUsers = async () => {
  const usersRef = collection(firestore, 'users');
  const snapshot = await getDocs(usersRef);
  
  // Process users in batches of 500 (Firestore batch limit)
  const batchSize = 500;
  const batches: Promise<void>[] = [];
  let currentBatch = writeBatch(firestore);
  let operationsCount = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.displayName && (!data.displayNameLower || data.displayNameLower !== data.displayName.toLowerCase())) {
      if (operationsCount >= batchSize) {
        // Commit current batch and start a new one
        batches.push(currentBatch.commit());
        currentBatch = writeBatch(firestore);
        operationsCount = 0;
      }
      
      currentBatch.update(doc.ref, {
        displayNameLower: data.displayName.toLowerCase(),
        updatedAt: new Date()
      });
      operationsCount++;
    }
  }
  
  // Commit the last batch if it has any operations
  if (operationsCount > 0) {
    batches.push(currentBatch.commit());
  }
  
  // Wait for all batches to complete
  await Promise.all(batches);
  
  console.log(`Migration completed. Updated ${operationsCount} users.`);
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  const adminRef = doc(firestore, 'admins', userId);
  const adminDoc = await getDoc(adminRef);
  return adminDoc.exists();
}; 