import axios from 'axios';

// TMDB API Configuration from the README-CREDENTIALS.md file
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzE4OWEzNzlkNWE2OGY3Y2VmMjM3YTg1ZmIwMWQzNSIsIm5iZiI6MTY3OTYwNTcwMi40MTI5OTk5LCJzdWIiOiI2NDFjYmZjNmI5YTBiZDAwN2JhOGI1NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Se61ep1AP9sxb9fPhJP_g29-_eJ-PszNakSzemtojl4';

// Create an Axios instance with the TMDB API configuration
const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Helper function to get complete image URL
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// API Functions
export const getTrendingMovies = () => 
  tmdbApi.get('/trending/movie/week');

export const getTrendingTVShows = () => 
  tmdbApi.get('/trending/tv/week');

export const searchMedia = (query: string, type: 'movie' | 'tv' = 'movie') => 
  tmdbApi.get(`/search/${type}`, { params: { query } });

export const getMovieDetails = (movieId: number) => 
  tmdbApi.get(`/movie/${movieId}`, { params: { append_to_response: 'credits,videos,similar' } });

export const getTVShowDetails = (tvId: number) => 
  tmdbApi.get(`/tv/${tvId}`, { params: { append_to_response: 'credits,videos,similar' } });

export const getMovieRecommendations = (movieId: number) => 
  tmdbApi.get(`/movie/${movieId}/recommendations`);

export const getTVShowRecommendations = (tvId: number) => 
  tmdbApi.get(`/tv/${tvId}/recommendations`);

export default tmdbApi; 