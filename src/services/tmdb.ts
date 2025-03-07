import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzE4OWEzNzlkNWE2OGY3Y2VmMjM3YTg1ZmIwMWQzNSIsIm5iZiI6MTY3OTYwNTcwMi40MTI5OTk5LCJzdWIiOiI2NDFjYmZjNmI5YTBiZDAwN2JhOGI1NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Se61ep1AP9sxb9fPhJP_g29-_eJ-PszNakSzemtojl4';

// Create an axios instance with default configuration
const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Define interfaces for the API responses
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// API functions
export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    const response = await tmdbApi.get<MovieResponse>(`/movie/popular?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getUpcomingMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    const response = await tmdbApi.get<MovieResponse>(`/movie/upcoming?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    const response = await tmdbApi.get<MovieResponse>(`/movie/top_rated?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}?append_to_response=credits,videos,recommendations`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for movie ID ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  try {
    const response = await tmdbApi.get<MovieResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Helper function to get complete image URL
export const getImageUrl = (path: string, size = 'original') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export default tmdbApi; 