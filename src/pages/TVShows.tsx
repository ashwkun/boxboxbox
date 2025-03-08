import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';
import TVShowCard from '../components/TVShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useMediaData from '../hooks/useMediaData';
import { getTrendingTVShows, getPopularTVShows, getTVShowsByGenre, getTVGenres } from '../services/tmdb';

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

const TVShows: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  // Fetch trending TV shows
  const { 
    data: trendingTVShowsData, 
    loading: trendingLoading, 
    error: trendingError,
    refetch: refetchTrending
  } = useMediaData(() => getTrendingTVShows('week'));
  
  // Fetch popular TV shows
  const { 
    data: popularTVShowsData, 
    loading: popularLoading, 
    error: popularError,
    refetch: refetchPopular
  } = useMediaData(() => getPopularTVShows());
  
  // Fetch TV show genres
  const { 
    data: genresData, 
    loading: genresLoading, 
    error: genresError 
  } = useMediaData(() => getTVGenres());
  
  // Fetch TV shows by genre when a genre is selected
  const { 
    data: genreTVShowsData, 
    loading: genreTVShowsLoading, 
    error: genreTVShowsError,
    refetch: refetchGenreTVShows 
  } = useMediaData(
    () => selectedGenre ? getTVShowsByGenre(selectedGenre) : Promise.resolve(null), 
    { dependencies: [selectedGenre] }
  );
  
  const handleTVShowClick = (tvShowId: number) => {
    // For now, we'll log to console. In Phase 5, we'll implement a TV show details page
    console.log(`Navigate to TV show ${tvShowId}`);
    // navigate(`/tv/${tvShowId}`);
  };
  
  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };
  
  // Extract TV shows from API response
  const trendingTVShows = trendingTVShowsData?.results || [];
  const popularTVShows = popularTVShowsData?.results || [];
  const genreTVShows = genreTVShowsData?.results || [];
  const genres = genresData?.genres || [];
  
  // Get the selected genre name
  const selectedGenreName = selectedGenre 
    ? genres.find(g => g.id === selectedGenre)?.name 
    : null;

  return (
    <div className="page-container tvshows-page">
      <h1>TV Shows</h1>
      
      {/* Genres Filter */}
      {!genresLoading && !genresError && (
        <div className="genres-filter">
          <h2>Genres</h2>
          <div className="genre-buttons">
            {genres.map((genre: Genre) => (
              <button 
                key={genre.id}
                className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Display TV shows by selected genre */}
      {selectedGenre && (
        <>
          {genreTVShowsLoading ? (
            <LoadingSpinner />
          ) : genreTVShowsError ? (
            <ErrorMessage 
              message="Failed to load TV shows for this genre" 
              onRetry={refetchGenreTVShows} 
            />
          ) : genreTVShows.length > 0 ? (
            <MediaGrid title={`${selectedGenreName} TV Shows`}>
              {genreTVShows.map((tvShow: TVShow) => (
                <TVShowCard
                  key={tvShow.id}
                  id={tvShow.id}
                  name={tvShow.name}
                  posterPath={tvShow.poster_path}
                  firstAirDate={tvShow.first_air_date}
                  voteAverage={tvShow.vote_average}
                  onClick={() => handleTVShowClick(tvShow.id)}
                />
              ))}
            </MediaGrid>
          ) : (
            <p>No TV shows found for this genre.</p>
          )}
        </>
      )}
      
      {/* Display trending TV shows */}
      {!selectedGenre && (
        <>
          {trendingLoading ? (
            <LoadingSpinner />
          ) : trendingError ? (
            <ErrorMessage 
              message="Failed to load trending TV shows" 
              onRetry={refetchTrending} 
            />
          ) : (
            <MediaGrid title="Trending This Week">
              {trendingTVShows.map((tvShow: TVShow) => (
                <TVShowCard
                  key={tvShow.id}
                  id={tvShow.id}
                  name={tvShow.name}
                  posterPath={tvShow.poster_path}
                  firstAirDate={tvShow.first_air_date}
                  voteAverage={tvShow.vote_average}
                  onClick={() => handleTVShowClick(tvShow.id)}
                />
              ))}
            </MediaGrid>
          )}
        </>
      )}
      
      {/* Display popular TV shows */}
      {!selectedGenre && (
        <>
          {popularLoading ? (
            <LoadingSpinner />
          ) : popularError ? (
            <ErrorMessage 
              message="Failed to load popular TV shows" 
              onRetry={refetchPopular} 
            />
          ) : (
            <MediaGrid title="Popular TV Shows">
              {popularTVShows.map((tvShow: TVShow) => (
                <TVShowCard
                  key={tvShow.id}
                  id={tvShow.id}
                  name={tvShow.name}
                  posterPath={tvShow.poster_path}
                  firstAirDate={tvShow.first_air_date}
                  voteAverage={tvShow.vote_average}
                  onClick={() => handleTVShowClick(tvShow.id)}
                />
              ))}
            </MediaGrid>
          )}
        </>
      )}
    </div>
  );
};

export default TVShows; 