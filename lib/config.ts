export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const tmdbConfig = {
  apiUrl: process.env.NEXT_PUBLIC_TMDB_API_URL,
  bearerToken: process.env.TMDB_BEARER_TOKEN,
  imageBaseUrl: process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL,
};

// Helper function to get complete image URL
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return null;
  return `${tmdbConfig.imageBaseUrl}/${size}${path}`;
}; 