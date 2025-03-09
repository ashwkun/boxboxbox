import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAiqIVKcOV8JDAoFuLPqRkTI-zkRhsea3g",
  authDomain: "tviodb.firebaseapp.com",
  projectId: "tviodb",
  storageBucket: "tviodb.firebasestorage.app",
  messagingSenderId: "808986648679",
  appId: "1:808986648679:web:29ce4ea122d500cd0f74c2",
  measurementId: "G-DV0YMJEJRT"
};

const app = initializeApp(firebaseConfig);

export default app; 