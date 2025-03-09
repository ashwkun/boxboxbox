interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genre_ids: number[];
  overview: string;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzE4OWEzNzlkNWE2OGY3Y2VmMjM3YTg1ZmIwMWQzNSIsIm5iZiI6MTY3OTYwNTcwMi40MTI5OTk5LCJzdWIiOiI2NDFjYmZjNmI5YTBiZDAwN2JhOGI1NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Se61ep1AP9sxb9fPhJP_g29-_eJ-PszNakSzemtojl4';

const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json'
};

export const tmdb = {
  // Get popular movies for initial onboarding
  async getPopularMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    const response = await fetch(
      `${TMDB_API_URL}/movie/popular?page=${page}`,
      { headers }
    );
    return response.json();
  },

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    const response = await fetch(
      `${TMDB_API_URL}/discover/movie?with_genres=${genreId}&page=${page}`,
      { headers }
    );
    return response.json();
  },

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    const response = await fetch(
      `${TMDB_API_URL}/movie/${movieId}`,
      { headers }
    );
    return response.json();
  },

  // Format movie data for our app
  formatMovie(movie: TMDBMovie) {
    return {
      id: String(movie.id),
      title: movie.title,
      year: movie.release_date?.split('-')[0] || '',
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      runtime: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : undefined,
      rating: movie.vote_average,
      genres: movie.genre_ids,
      overview: movie.overview
    };
  },

  // Get a curated mix of movies for onboarding
  async getOnboardingMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    // Get a mix of popular and highly rated movies
    const [popularMovies, topRatedMovies] = await Promise.all([
      this.getPopularMovies(page),
      fetch(`${TMDB_API_URL}/movie/top_rated?page=${page}`, { headers }).then(r => r.json())
    ]);

    // Combine and shuffle results
    const combined = [...popularMovies.results, ...topRatedMovies.results]
      .filter(movie => movie.poster_path && movie.release_date)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // Get 5 random movies

    return {
      page,
      results: combined,
      total_pages: Math.min(popularMovies.total_pages, topRatedMovies.total_pages),
      total_results: combined.length
    };
  }
}; 