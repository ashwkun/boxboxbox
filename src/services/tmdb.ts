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

// Simple in-memory cache to reduce API calls
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Helper function to make API requests with caching
const apiRequestWithCache = async (url: string, params = {}) => {
  const cacheKey = `${url}:${JSON.stringify(params)}`;
  const now = Date.now();

  // Check if data is in cache and not expired
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  // If not in cache or expired, make the API request
  try {
    const response = await tmdbApi.get(url, { params });
    
    // Store the response in cache
    cache[cacheKey] = {
      data: response.data,
      timestamp: now
    };
    
    return response.data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

// Helper function to get complete image URL with optimal sizing
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// API Functions with caching
export const getTrendingMovies = (timeWindow: 'day' | 'week' = 'week', page = 1) => 
  apiRequestWithCache('/trending/movie/' + timeWindow, { page });

export const getTrendingTVShows = (timeWindow: 'day' | 'week' = 'week', page = 1) => 
  apiRequestWithCache('/trending/tv/' + timeWindow, { page });

export const getPopularMovies = (page = 1) => 
  apiRequestWithCache('/movie/popular', { page });

export const getPopularTVShows = (page = 1) => 
  apiRequestWithCache('/tv/popular', { page });

export const getMovieGenres = () => 
  apiRequestWithCache('/genre/movie/list');

export const getTVGenres = () => 
  apiRequestWithCache('/genre/tv/list');

export const getMoviesByGenre = (genreId: number, page = 1) => 
  apiRequestWithCache('/discover/movie', { with_genres: genreId, page });

export const getTVShowsByGenre = (genreId: number, page = 1) => 
  apiRequestWithCache('/discover/tv', { with_genres: genreId, page });

export const searchMedia = (query: string, type: 'movie' | 'tv' = 'movie', page = 1) => 
  apiRequestWithCache(`/search/${type}`, { query, page });

export const getMovieDetails = (movieId: number) => 
  apiRequestWithCache(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar' });

export const getTVShowDetails = (tvId: number) => 
  apiRequestWithCache(`/tv/${tvId}`, { append_to_response: 'credits,videos,similar' });

export const getMovieRecommendations = (movieId: number, page = 1) => 
  apiRequestWithCache(`/movie/${movieId}/recommendations`, { page });

export const getTVShowRecommendations = (tvId: number, page = 1) => 
  apiRequestWithCache(`/tv/${tvId}/recommendations`, { page });

// Clear cache function (call periodically to prevent memory leaks)
export const clearCache = () => {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp > CACHE_DURATION) {
      delete cache[key];
    }
  });
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
};

// Format date to readable format
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format currency amount
export const formatCurrency = (amount: number | null): string => {
  if (!amount) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get production countries as a string
export const formatCountries = (countries: Array<{ iso_3166_1: string, name: string }> | null): string => {
  if (!countries || countries.length === 0) return 'N/A';
  
  return countries.map(country => country.name).join(', ');
};

export default tmdbApi; 