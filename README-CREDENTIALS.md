# tv.io Credentials Reference

This file contains the API keys and Firebase credentials extracted from the original project for reference.

## Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAiqIVKcOV8JDAoFuLPqRkTI-zkRhsea3g",
  authDomain: "tviodb.firebaseapp.com",
  projectId: "tviodb",
  storageBucket: "tviodb.firebasestorage.app",
  messagingSenderId: "808986648679",
  appId: "1:808986648679:web:29ce4ea122d500cd0f74c2",
  measurementId: "G-DV0YMJEJRT"
};
```

## TMDB API Configuration

```javascript
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzE4OWEzNzlkNWE2OGY3Y2VmMjM3YTg1ZmIwMWQzNSIsIm5iZiI6MTY3OTYwNTcwMi40MTI5OTk5LCJzdWIiOiI2NDFjYmZjNmI5YTBiZDAwN2JhOGI1NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Se61ep1AP9sxb9fPhJP_g29-_eJ-PszNakSzemtojl4';
```

## Image Base URL (TMDB)

```javascript
// Helper function to get complete image URL
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
```

## Deployment Information

- Firebase Project: tviodb
- Hosting URL: https://tviodb.web.app
- GitHub Repository: https://github.com/ashwkun/tvio

## Note

These credentials are provided for reference only and should be properly secured in a production environment. 