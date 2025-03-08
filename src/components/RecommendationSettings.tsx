import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  getRecommendationSettings, 
  updateRecommendationSettings,
  addGenrePreference,
  removeGenrePreference,
  GenrePreference
} from '../services/recommendations';
import { getMovieGenres, getTVGenres } from '../services/tmdb';
import LoadingSpinner from './LoadingSpinner';

interface Genre {
  id: number;
  name: string;
}

const RecommendationSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enableGenreRecommendations: true,
    enableCastRecommendations: true,
    enableDirectorRecommendations: true,
    enableWatchedBasedRecommendations: true
  });
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [userGenres, setUserGenres] = useState<GenrePreference[]>([]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userSettings = await getRecommendationSettings(currentUser.uid);
        setSettings({
          enableGenreRecommendations: userSettings.enableGenreRecommendations,
          enableCastRecommendations: userSettings.enableCastRecommendations,
          enableDirectorRecommendations: userSettings.enableDirectorRecommendations,
          enableWatchedBasedRecommendations: userSettings.enableWatchedBasedRecommendations
        });
        setUserGenres(userSettings.preferredGenres || []);
        
        // Fetch genres
        const movieGenresData = await getMovieGenres();
        const tvGenresData = await getTVGenres();
        
        setMovieGenres(movieGenresData.genres || []);
        setTVGenres(tvGenresData.genres || []);
      } catch (error) {
        console.error('Error fetching recommendation settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [currentUser]);
  
  const handleToggleSetting = async (settingName: string) => {
    if (!currentUser) return;
    
    try {
      setSaving(true);
      
      const newSettings = {
        ...settings,
        [settingName]: !settings[settingName as keyof typeof settings]
      };
      
      setSettings(newSettings);
      await updateRecommendationSettings(currentUser.uid, newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const isGenreSelected = (genreId: number, type: 'movie' | 'tv') => {
    return userGenres.some(g => g.id === genreId && g.type === type);
  };
  
  const handleToggleGenre = async (genre: Genre, type: 'movie' | 'tv') => {
    if (!currentUser) return;
    
    try {
      setSaving(true);
      
      if (isGenreSelected(genre.id, type)) {
        // Remove genre
        await removeGenrePreference(currentUser.uid, genre.id, type);
        setUserGenres(prev => prev.filter(g => !(g.id === genre.id && g.type === type)));
      } else {
        // Add genre
        const genrePreference: GenrePreference = {
          id: genre.id,
          name: genre.name,
          type,
          weight: 3 // Default medium preference
        };
        
        await addGenrePreference(currentUser.uid, genrePreference);
        setUserGenres(prev => [...prev, genrePreference]);
      }
    } catch (error) {
      console.error('Error updating genre preferences:', error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600">You need to be signed in to manage recommendation settings.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendation Types</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Genre-based Recommendations</h4>
              <p className="text-sm text-gray-600">Get recommendations based on your preferred genres</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="toggle-genre" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={settings.enableGenreRecommendations}
                onChange={() => handleToggleSetting('enableGenreRecommendations')}
                disabled={saving}
                style={{
                  right: settings.enableGenreRecommendations ? '0' : '6px',
                  transition: 'right 0.3s',
                  borderColor: settings.enableGenreRecommendations ? '#1E88E5' : '#D1D5DB'
                }}
              />
              <label 
                htmlFor="toggle-genre" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                style={{ backgroundColor: settings.enableGenreRecommendations ? '#BBDEFB' : '#D1D5DB' }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Watch History Recommendations</h4>
              <p className="text-sm text-gray-600">Get recommendations based on what you've watched</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="toggle-watched" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={settings.enableWatchedBasedRecommendations}
                onChange={() => handleToggleSetting('enableWatchedBasedRecommendations')}
                disabled={saving}
                style={{
                  right: settings.enableWatchedBasedRecommendations ? '0' : '6px',
                  transition: 'right 0.3s',
                  borderColor: settings.enableWatchedBasedRecommendations ? '#1E88E5' : '#D1D5DB'
                }}
              />
              <label 
                htmlFor="toggle-watched" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                style={{ backgroundColor: settings.enableWatchedBasedRecommendations ? '#BBDEFB' : '#D1D5DB' }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Cast Recommendations</h4>
              <p className="text-sm text-gray-600">Get recommendations based on your favorite actors</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="toggle-cast" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={settings.enableCastRecommendations}
                onChange={() => handleToggleSetting('enableCastRecommendations')}
                disabled={saving}
                style={{
                  right: settings.enableCastRecommendations ? '0' : '6px',
                  transition: 'right 0.3s',
                  borderColor: settings.enableCastRecommendations ? '#1E88E5' : '#D1D5DB'
                }}
              />
              <label 
                htmlFor="toggle-cast" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                style={{ backgroundColor: settings.enableCastRecommendations ? '#BBDEFB' : '#D1D5DB' }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Director Recommendations</h4>
              <p className="text-sm text-gray-600">Get recommendations based on your favorite directors</p>
            </div>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="toggle-director" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                checked={settings.enableDirectorRecommendations}
                onChange={() => handleToggleSetting('enableDirectorRecommendations')}
                disabled={saving}
                style={{
                  right: settings.enableDirectorRecommendations ? '0' : '6px',
                  transition: 'right 0.3s',
                  borderColor: settings.enableDirectorRecommendations ? '#1E88E5' : '#D1D5DB'
                }}
              />
              <label 
                htmlFor="toggle-director" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                style={{ backgroundColor: settings.enableDirectorRecommendations ? '#BBDEFB' : '#D1D5DB' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Genre Preferences */}
      <AnimatePresence>
        {settings.enableGenreRecommendations && (
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Preferred Movie Genres</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {movieGenres.map(genre => (
                <button
                  key={genre.id}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    isGenreSelected(genre.id, 'movie')
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleToggleGenre(genre, 'movie')}
                  disabled={saving}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Preferred TV Show Genres</h3>
            <div className="flex flex-wrap gap-2">
              {tvGenres.map(genre => (
                <button
                  key={genre.id}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    isGenreSelected(genre.id, 'tv')
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleToggleGenre(genre, 'tv')}
                  disabled={saving}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <LoadingSpinner size="small" />
            <p className="mt-2">Saving preferences...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationSettings; 