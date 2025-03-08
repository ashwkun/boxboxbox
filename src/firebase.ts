import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQgM4P5jlYDEPrQ-75dml-K6MnW4SFRi8",
  authDomain: "tviodb.firebaseapp.com",
  projectId: "tviodb",
  storageBucket: "tviodb.appspot.com",
  messagingSenderId: "1015568709414",
  appId: "1:1015568709414:web:c8c9f4d4e0e56d9d9a1b8e"
};

// Initialize Firebase - only if not already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // If already initialized, use the existing app
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 