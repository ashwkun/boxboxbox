import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Race, RaceResult, fetchRaceResults, fetchQualifyingResults, fetchSprintResults, fetchRaceSchedule } from '../../services/api/jolpica';
import { getCountryCode } from '../../utils/countryCodeMap';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import tracksData from '../../data/tracks.json';
import { MagnifyingGlassIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

// Types
interface CompletedRacesProps {
  races: Race[];
}

interface SessionResults {
  race: RaceResult[];
  qualifying: RaceResult[];
  sprint: RaceResult[];
}

interface RaceCardProps {
  race: Race;
  isExpanded: boolean;
  results: SessionResults;
  loadingResults: boolean;
  onExpand: (race: Race | null) => void;
  mapRef: L.Map | null;
}

// Constants
const SEASONS = ['2025', '2024', '2023', '2022', '2021'];

const COUNTRY_GRADIENTS: { [key: string]: string } = {
  'cn': 'from-red-600/40',  // China
  'jp': 'from-red-500/40',  // Japan
  'au': 'from-green-600/40', // Australia
  'it': 'from-green-500/40', // Italy
  'gb': 'from-blue-600/40',  // Great Britain
  'us': 'from-blue-500/40',  // USA
  'br': 'from-yellow-500/40', // Brazil
  'mx': 'from-green-600/40', // Mexico
  'ae': 'from-red-600/40',   // UAE
  'sa': 'from-green-500/40', // Saudi Arabia
  'bh': 'from-red-500/40',   // Bahrain
  'az': 'from-blue-500/40',  // Azerbaijan
  'mc': 'from-red-600/40',   // Monaco
  'es': 'from-yellow-600/40', // Spain
  'ca': 'from-red-500/40',   // Canada
  'at': 'from-red-600/40',   // Austria
  'hu': 'from-green-500/40', // Hungary
  'be': 'from-yellow-600/40', // Belgium
  'nl': 'from-orange-500/40', // Netherlands
  'sg': 'from-red-500/40',   // Singapore
  'qa': 'from-purple-500/40', // Qatar
  'lv': 'from-red-600/40',   // Las Vegas
};

const CIRCUIT_NAME_MAP: { [key: string]: string } = {
  'silverstone': 'Great_Britain',
  'spa': 'Belgium',
  'monza': 'Italy',
  'monaco': 'Monaco',
  'shanghai': 'China',
  'suzuka': 'Japan',
  'marina_bay': 'Singapore',
  'albert_park': 'Australia',
  'americas': 'United_States',
  'interlagos': 'Brazil',
  'baku': 'Azerbaijan',
  'catalunya': 'Spain',
  'hungaroring': 'Hungary',
  'red_bull_ring': 'Austria',
  'zandvoort': 'Netherlands',
  'yas_marina': 'Abu_Dhabi',
  'jeddah': 'Saudi_Arabia',
  'losail': 'Qatar',
  'bahrain': 'Bahrain',
  'las_vegas': 'Las_Vegas',
  'miami': 'Miami'
};

// Utility Functions
const getDateRange = (race: Race) => {
  const firstPracticeDate = race.FirstPractice ? new Date(race.FirstPractice.date) : new Date(race.date);
  const raceDate = new Date(race.date);
  
  if (firstPracticeDate.getMonth() === raceDate.getMonth()) {
    return `${firstPracticeDate.toLocaleDateString('en-US', { month: 'long' })} ${firstPracticeDate.getDate()}-${raceDate.getDate()}`;
  } else {
    return `${firstPracticeDate.toLocaleDateString('en-US', { month: 'long' })} ${firstPracticeDate.getDate()} - ${raceDate.toLocaleDateString('en-US', { month: 'long' })} ${raceDate.getDate()}`;
  }
};

const getCountryGradient = (countryCode: string) => {
  return COUNTRY_GRADIENTS[countryCode.toLowerCase()] || 'from-primary/30';
};

const getTeamLogoUrl = (constructorId: string) => {
  const teamNameMap: { [key: string]: string } = {
    'mclaren': 'mclaren',
    'mercedes': 'mercedes',
    'red_bull': 'red-bull-racing',
    'williams': 'williams',
    'aston_martin': 'aston-martin',
    'sauber': 'kick-sauber',
    'ferrari': 'ferrari',
    'alpine': 'alpine',
    'rb': 'racing-bulls',
    'haas': 'haas'
  };

  const teamName = teamNameMap[constructorId] || constructorId.replace('_', '-');
  return `https://media.formula1.com/content/dam/fom-website/teams/2025/${teamName}-logo.png`;
};

const getDriverImageUrl = (driverId: string, givenName: string, familyName: string) => {
  const firstLetterDir = givenName.charAt(0).toUpperCase();
  const driverCode = (givenName.slice(0, 3) + familyName.slice(0, 3)).toUpperCase() + '01';
  const driverName = `${givenName.charAt(0).toUpperCase() + givenName.slice(1)}_${familyName.charAt(0).toUpperCase() + familyName.slice(1)}`;
  const fileName = (givenName.slice(0, 3) + familyName.slice(0, 3)).toLowerCase() + '01';
  
  return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${firstLetterDir}/${driverCode}_${driverName}/${fileName}.png`;
};

const getCircuitImageName = (circuitId: string): string => {
  return CIRCUIT_NAME_MAP[circuitId] || circuitId.charAt(0).toUpperCase() + circuitId.slice(1);
};

const getTrackInfo = (race: Race) => {
  let trackInfo = tracksData.tracks.find(
    track => track.TrackName.toLowerCase().includes(race.raceName.toLowerCase().replace(' grand prix', ''))
  );
  
  if (!trackInfo) {
    trackInfo = tracksData.tracks.find(
      track => track.Location.toLowerCase().includes(race.Circuit.Location.locality.toLowerCase()) ||
              track.Location.toLowerCase().includes(race.Circuit.Location.country.toLowerCase())
    );
  }
  
  return trackInfo;
};

// Race Card Component
const RaceCard: React.FC<RaceCardProps> = ({ race, isExpanded, results, loadingResults, onExpand, mapRef }) => {
  const countryCode = getCountryCode(race.Circuit.Location.country);
  const gradientClass = getCountryGradient(countryCode);
  const podium = results.race.slice(0, 3);

  const handleClick = () => {
    onExpand(isExpanded ? null : race);
  };

  return (
    <div className="w-[260px] sm:w-[320px] flex-shrink-0">
      <motion.div
        layout
        className="relative rounded-xl overflow-hidden group cursor-pointer bg-black h-[200px] sm:h-[250px]"
        onClick={handleClick}
      >
        {/* Map Container */}
        <div 
          id={`completed-map-${race.round}`} 
          className="absolute inset-0 w-full h-full z-0"
          style={{ minHeight: '200px' }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/75 z-[1]" />
        
        {/* Gradient Accent */}
        <div className={`absolute inset-0 bg-gradient-to-bl ${gradientClass} via-transparent to-transparent z-[2] opacity-90`} />
        
        {/* Content */}
        <div className="absolute inset-0 z-[3]">
          <div className="h-full flex flex-col p-4 sm:p-6">
            <div className="flex items-start justify-between mb-auto">
              <img
                src={`https://flagcdn.com/w160/${countryCode}.png`}
                alt={`${race.Circuit.Location.country} flag`}
                className="w-10 h-7 sm:w-14 sm:h-9 rounded-md shadow-lg object-cover"
              />
              <span className="text-xs sm:text-sm font-medium text-white/90 bg-black/50 px-2 sm:px-3 py-1 rounded-full">
                Round {race.round}
              </span>
            </div>

            <div className="mt-auto">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 line-clamp-1">
                {race.raceName}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">
                {race.Circuit.circuitName}
              </p>
              <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">
                {getDateRange(race)}
              </p>

              {/* Podium Results */}
              {loadingResults ? (
                <div className="flex gap-2">
                  <div className="h-3 sm:h-4 bg-white/10 rounded w-16 sm:w-24 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-white/10 rounded w-16 sm:w-24 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-white/10 rounded w-16 sm:w-24 animate-pulse"></div>
                </div>
              ) : podium.length > 0 ? (
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
                  {podium.map((result, index) => (
                    <div key={index} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span className={`text-xs sm:text-sm font-medium ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-amber-700'
                      }`}>P{result.position}</span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {result.Driver.code}
                      </span>
                      <img
                        src={getTeamLogoUrl(result.Constructor.constructorId)}
                        alt={result.Constructor.name}
                        className="h-2.5 sm:h-3 w-auto"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 border-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white/30 z-[5]" />
      </motion.div>
    </div>
  );
};

// Main Component
const CompletedRaces: React.FC<CompletedRacesProps> = ({ races }) => {
  // State
  const [expandedRace, setExpandedRace] = useState<Race | null>(null);
  const [raceResults, setRaceResults] = useState<Record<string, SessionResults>>({});
  const [loadingResults, setLoadingResults] = useState<Record<string, boolean>>({});
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [activeSession, setActiveSession] = useState<'race' | 'qualifying' | 'sprint'>('race');
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('2025');
  const [seasonRaces, setSeasonRaces] = useState<Race[]>(races);
  const [loading, setLoading] = useState(false);
  const [loadingRaceResults, setLoadingRaceResults] = useState(false);
  const [resultsLoadingError, setResultsLoadingError] = useState<string | null>(null);
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);

  // Refs
  const mapRefs = useRef<{ [key: string]: L.Map }>({});
  const fetchRetryCount = useRef<Record<string, number>>({});
  
  // Fetch race results
  const fetchRaceResultsForRace = useCallback(async (raceSeason: number, raceRound: number, retryAttempt = 0) => {
    if (!raceRound || !raceSeason) return;
    
    const raceKey = `${raceSeason}-${raceRound}`;
    try {
      setLoadingResults(prev => ({ ...prev, [String(raceRound)]: true }));
      
      const promises = [
        fetchRaceResults(String(raceSeason), String(raceRound)),
        fetchQualifyingResults(String(raceSeason), String(raceRound)),
      ];
      
      const currentRace = seasonRaces.find(r => r.round === String(raceRound) && r.season === String(raceSeason));
      
      if (currentRace?.Sprint || currentRace?.SprintShootout || currentRace?.SprintQualifying) {
        promises.push(fetchSprintResults(String(raceSeason), String(raceRound)));
      }
      
      const [raceResults, qualifyingResults, sprintResults] = await Promise.all(promises);
      
      if (raceResults.length === 0 && retryAttempt < 3) {
        throw new Error('Race results came back empty, will retry');
      }
      
      setRaceResults(prev => ({
        ...prev,
        [String(raceRound)]: {
          race: raceResults,
          qualifying: qualifyingResults,
          sprint: sprintResults || []
        }
      }));
      
      fetchRetryCount.current[raceKey] = 0;
      setResultsLoadingError(null);
    } catch (err) {
      console.error(`Error fetching race results for ${raceSeason}-${raceRound}:`, err);
      
      fetchRetryCount.current[raceKey] = (fetchRetryCount.current[raceKey] || 0) + 1;
      
      if (retryAttempt < 3) {
        const delay = Math.pow(2, retryAttempt) * 500;
        setTimeout(() => {
          fetchRaceResultsForRace(raceSeason, raceRound, retryAttempt + 1);
        }, delay);
      } else {
        setResultsLoadingError(`Failed to load race results after multiple attempts. Please try refreshing.`);
        setRaceResults(prev => ({
          ...prev,
          [String(raceRound)]: { race: [], qualifying: [], sprint: [] }
        }));
      }
    } finally {
      setLoadingResults(prev => ({ ...prev, [String(raceRound)]: false }));
    }
  }, [seasonRaces]);

  // Initialize maps
  useEffect(() => {
    if (filteredRaces.length === 0) return;
    
    setLoadingRaceResults(true);
    
    const initializeMaps = () => {
      Object.values(mapRefs.current).forEach(map => map.remove());
      mapRefs.current = {};

    filteredRaces.forEach((race) => {
      const mapContainer = document.getElementById(`completed-map-${race.round}`);
      if (!mapContainer) return;

      try {
        const map = L.map(mapContainer, {
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false
        }).setView([
          parseFloat(race.Circuit.Location.lat),
          parseFloat(race.Circuit.Location.long)
          ], 13);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        }).addTo(map);

        mapRefs.current[race.round] = map;
          map.invalidateSize();
      } catch (err) {
        console.error(`Error initializing map for race ${race.round}:`, err);
      }
    });
    };

    const timer = setTimeout(initializeMaps, 500);

    const fetchAllRaceResults = async () => {
      try {
        const fetchPromises = filteredRaces.map(race => 
          fetchRaceResultsForRace(Number(race.season), Number(race.round))
        );
        await Promise.all(fetchPromises.map(p => p.catch(e => console.error('Fetch promise failed:', e))));
      } finally {
        setLoadingRaceResults(false);
      }
    };
    
    fetchAllRaceResults();

    return () => {
      clearTimeout(timer);
      Object.values(mapRefs.current).forEach(map => map.remove());
      mapRefs.current = {};
    };
  }, [filteredRaces, fetchRaceResultsForRace]);

  // Filter completed races
  useEffect(() => {
    if (!seasonRaces || seasonRaces.length === 0) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container { z-index: 0 !important; }
      .leaflet-control-container { display: none; }
    `;
    document.head.appendChild(style);

    const completedRaces = seasonRaces.filter(race => new Date(race.date) < new Date());
    setFilteredRaces(completedRaces);
    
    return () => {
      Object.values(mapRefs.current).forEach(map => map.remove());
      mapRefs.current = {};
      document.head.removeChild(style);
    };
  }, [seasonRaces]);

  // Fetch season races
  useEffect(() => {
    const fetchSeasonRaces = async () => {
      try {
        setLoading(true);
        setResultsLoadingError(null);
        const data = await fetchRaceSchedule(selectedSeason);
        setSeasonRaces(data);
      } catch (error) {
        console.error(`Error fetching race schedule for ${selectedSeason}:`, error);
        setResultsLoadingError(`Failed to load race schedule for ${selectedSeason}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    
    setRaceResults({});
    setExpandedRace(null);
    setActiveSession('race');
    
    if (selectedSeason === '2025') {
      setSeasonRaces(races);
    } else {
      fetchSeasonRaces();
    }
  }, [selectedSeason, races]);

  // Loading state
  if (loading || loadingRaceResults) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold font-display">Completed Races</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="min-w-[80px] bg-black/30 text-white border border-white/20 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {SEASONS.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 h-[250px]"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (resultsLoadingError) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold font-display">Completed Races</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="min-w-[80px] bg-black/30 text-white border border-white/20 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {SEASONS.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-900/30">
          <p className="text-red-400">{resultsLoadingError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary/20 hover:bg-primary/30 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredRaces.length === 0) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold font-display">Completed Races</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="min-w-[80px] bg-black/30 text-white border border-white/20 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {SEASONS.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <p className="text-white/70">No completed races yet for {selectedSeason}.</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="w-full bg-card rounded-xl border border-border p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold font-display">Completed Races</h2>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="min-w-[80px] bg-black/30 text-white border border-white/20 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {SEASONS.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Race Cards Row */}
        <div className="relative -mx-4 sm:mx-0">
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            <div className="flex gap-3 sm:gap-4 px-4 sm:px-0 min-w-min">
              {filteredRaces.map((race) => (
                <RaceCard
                  key={race.round}
                  race={race}
                  isExpanded={expandedRace?.round === race.round}
                  results={raceResults[race.round] || { race: [], qualifying: [], sprint: [] }}
                  loadingResults={loadingResults[race.round] || false}
                  onExpand={setExpandedRace}
                  mapRef={mapRefs.current[race.round]}
                />
                              ))}
                            </div>
          </div>
          {/* Gradient fade indicators */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-card to-transparent pointer-events-none sm:hidden" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none sm:hidden" />
        </div>

        {/* Expanded Race Details */}
        <AnimatePresence>
          {expandedRace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                {/* Header with close button */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <img
                      src={`https://flagcdn.com/w160/${getCountryCode(expandedRace.Circuit.Location.country)}.png`}
                      alt={`${expandedRace.Circuit.Location.country} flag`}
                      className="w-10 h-7 sm:w-14 sm:h-9 rounded-md shadow-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {expandedRace.raceName}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70">
                        {expandedRace.Circuit.circuitName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedRace(null);
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Full Race Results */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <TrophyIcon className="w-5 h-5 text-yellow-500" />
                          Results
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveSession('race')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activeSession === 'race'
                                ? 'bg-white/10 text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            Race
                          </button>
                          <button
                            onClick={() => setActiveSession('qualifying')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activeSession === 'qualifying'
                                ? 'bg-white/10 text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            Qualifying
                          </button>
                          {(expandedRace?.Sprint || expandedRace?.SprintShootout || expandedRace?.SprintQualifying) && (
                            <button
                              onClick={() => setActiveSession('sprint')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeSession === 'sprint'
                                  ? 'bg-white/10 text-white'
                                  : 'text-white/50 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              Sprint
                            </button>
                          )}
                        </div>
                      </div>
                      {loadingResults[expandedRace.round] ? (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-white/10 rounded w-3/4"></div>
                            <div className="h-4 bg-white/10 rounded w-2/3"></div>
                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                          </div>
                        </div>
                      ) : raceResults[expandedRace.round]?.[activeSession]?.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 pr-2">
                          {raceResults[expandedRace.round][activeSession].map((result, index) => (
                            <motion.div
                              key={result.position}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`bg-gradient-to-br ${
                                index === 0 ? 'from-yellow-500/20 to-yellow-700/10' :
                                index === 1 ? 'from-gray-400/20 to-gray-600/10' :
                                index === 2 ? 'from-amber-700/20 to-amber-900/10' :
                                'from-white/10 to-white/5'
                              } backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:bg-white/5 transition-colors`}
                              onClick={() => {
                                const driverId = result.Driver.driverId;
                                setExpandedDriver(expandedDriver === driverId ? null : driverId);
                              }}
                            >
                              <div className="p-4">
                              <div className="flex items-center gap-4">
                                  <div className={`text-xl sm:text-2xl font-bold min-w-[40px] sm:min-w-[48px] ${
                                  index === 0 ? 'text-yellow-500' :
                                  index === 1 ? 'text-gray-400' :
                                  index === 2 ? 'text-amber-700' :
                                  'text-white/70'
                                }`}>
                                  P{result.position}
                                </div>
                                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                  <img
                                    src={getDriverImageUrl(result.Driver.driverId, result.Driver.givenName, result.Driver.familyName)}
                                    alt={`${result.Driver.givenName} ${result.Driver.familyName}`}
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                      <div className="text-base sm:text-lg font-bold text-white truncate">
                                        {result.Driver.familyName}
                                    </div>
                                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                                      <img
                                        src={getTeamLogoUrl(result.Constructor.constructorId)}
                                        alt={result.Constructor.name}
                                          className="h-3 sm:h-4 w-auto"
                                      />
                                        <span className="text-xs sm:text-sm text-white/70 truncate">
                                        {result.Constructor.name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                  {activeSession === 'race' && (
                                    <>
                                      {Number(result.points) > 0 && (
                                        <div className="text-sm font-medium text-green-400">
                                          +{result.points} pts
                                        </div>
                                      )}
                                      {result.Time ? (
                                          <div className="text-sm text-white/50">
                                            {result.Time.time}
                                          </div>
                                      ) : result.status !== 'Finished' ? (
                                        <div className="text-sm text-red-400">
                                          {result.status}
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                  {activeSession === 'qualifying' && result.Q3 && (
                                    <div className="text-sm text-white/50">
                                      {result.Q3}
                                    </div>
                                  )}
                                  {activeSession === 'sprint' && (
                                    <>
                                      {Number(result.points) > 0 && (
                                        <div className="text-sm font-medium text-green-400">
                                          +{result.points} pts
                                        </div>
                                      )}
                                      {result.Time ? (
                                        <div className="text-sm text-white/50">
                                          {result.Time.time}
                                        </div>
                                      ) : result.status !== 'Finished' ? (
                                        <div className="text-sm text-red-400">
                                          {result.status}
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                              <AnimatePresence>
                                {expandedDriver === result.Driver.driverId && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden border-t border-white/10"
                                  >
                                    <div className="p-4 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-white/50">Full Name</span>
                                        <span className="text-white">{result.Driver.givenName} {result.Driver.familyName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-white/50">Nationality</span>
                                        <span className="text-white">{result.Driver.nationality}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-white/50">Driver Number</span>
                                        <span className="text-white">#{result.Driver.permanentNumber}</span>
                                      </div>
                                      {activeSession === 'race' && result.FastestLap && (
                                        <div className="flex justify-between">
                                          <span className="text-white/50">Fastest Lap</span>
                                          <span className={result.FastestLap.rank === "1" ? "text-purple-400 font-medium flex items-center gap-1" : "text-white"}>
                                            {result.FastestLap.rank === "1" && <ClockIcon className="w-4 h-4" />}
                                            {result.FastestLap.Time.time}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                          <p className="text-white/70">No results available for this session</p>
                        </div>
                      )}
                    </div>

                    {/* Circuit Layout and Info Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Circuit Layout */}
                      <div className="lg:col-span-2">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                          <div className="relative">
                            <img
                              src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${getCircuitImageName(expandedRace!.Circuit.circuitId)}_Circuit`}
                              alt={`${expandedRace!.Circuit.circuitName} layout`}
                              className="w-full h-full object-contain p-4"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowLargeImage(true);
                              }}
                              className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Track Info */}
                      <div>
                        {(() => {
                          const trackInfo = getTrackInfo(expandedRace);
                          if (!trackInfo) return null;

                          return (
                            <div className="space-y-4">
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Length</p>
                                <p className="text-lg font-medium text-white">{trackInfo.TrackLengthPerLap.toFixed(3)} km</p>
                              </div>
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Turns</p>
                                <p className="text-lg font-medium text-white">{trackInfo.CircuitLayout.TotalNumberOfTurns}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Large Image Modal */}
        <AnimatePresence>
          {showLargeImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
              onClick={() => setShowLargeImage(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl w-full bg-card rounded-xl overflow-hidden"
              >
                <img
                  src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_2000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${getCircuitImageName(expandedRace!.Circuit.circuitId)}_Circuit`}
                  alt={`${expandedRace!.Circuit.circuitName} layout`}
                  className="w-full h-full object-contain p-4"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompletedRaces; 