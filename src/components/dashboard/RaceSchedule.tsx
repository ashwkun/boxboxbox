import React, { useEffect, useRef, useState } from 'react';
import { Race, RaceResult, fetchRaceResults } from '../../services/api/jolpica';
import { getCountryCode } from '../../utils/countryCodeMap';
import { getWeatherForSessions, SessionWeather } from '../../services/api/weather';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WeatherIcon from '../WeatherIcon';
import tracksData from '../../data/tracks.json';

interface RaceScheduleProps {
  races: Race[];
}

const COUNTRY_GRADIENTS: { [key: string]: string } = {
  'cn': 'from-red-600/40',  // China
  'jp': 'from-red-500/40',  // Japan
  'bh': 'from-red-700/40',  // Bahrain
  'sa': 'from-green-600/40', // Saudi Arabia
  'au': 'from-blue-600/40', // Australia
  'us': 'from-blue-700/40', // USA
  'it': 'from-green-500/40', // Italy
  'mc': 'from-red-500/40',  // Monaco
  'es': 'from-yellow-600/40', // Spain
  'ca': 'from-red-600/40',  // Canada
  'gb': 'from-blue-500/40', // Great Britain
  'hu': 'from-red-500/40',  // Hungary
  'be': 'from-yellow-500/40', // Belgium
  'nl': 'from-orange-500/40', // Netherlands
  'az': 'from-blue-500/40', // Azerbaijan
  'sg': 'from-red-500/40',  // Singapore
  'mx': 'from-green-600/40', // Mexico
  'br': 'from-green-500/40', // Brazil
  'ae': 'from-red-600/40',  // UAE
  'qa': 'from-purple-600/40', // Qatar
};

const RaceSchedule: React.FC<RaceScheduleProps> = ({ races }) => {
  const mapRefs = useRef<{ [key: string]: L.Map }>({});
  const [expandedRace, setExpandedRace] = useState<Race | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<SessionWeather>({});
  const [lastYearResults, setLastYearResults] = useState<RaceResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const getCountryGradient = (countryCode: string) => {
    return COUNTRY_GRADIENTS[countryCode.toLowerCase()] || 'from-primary/30';
  };

  useEffect(() => {
    // Add global styles for Leaflet containers
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        z-index: 0 !important;
      }
      .leaflet-control-container {
        display: none;
      }
    `;
    document.head.appendChild(style);

    // Initialize maps for each race
    const futureRaces = races.filter(isUpcoming).slice(1); // Skip the next race
    
    futureRaces.forEach((race) => {
      const mapContainer = document.getElementById(`map-${race.round}`);
      if (!mapContainer) return;

      const map = L.map(mapContainer, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false
      }).setView([
        parseFloat(race.Circuit.Location.lat),
        parseFloat(race.Circuit.Location.long)
      ], 17);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      }).addTo(map);

      mapRefs.current[race.round] = map;
    });

    return () => {
      Object.values(mapRefs.current).forEach(map => map.remove());
      mapRefs.current = {};
      document.head.removeChild(style);
    };
  }, [races]);

  useEffect(() => {
    if (!expandedRace) return;

    const fetchWeatherData = async () => {
      const sessions: { date: string; time: string; }[] = [];
      
      if (expandedRace.FirstPractice) sessions.push(expandedRace.FirstPractice);
      if (expandedRace.SecondPractice) sessions.push(expandedRace.SecondPractice);
      if (expandedRace.ThirdPractice) sessions.push(expandedRace.ThirdPractice);
      if (expandedRace.Sprint) sessions.push(expandedRace.Sprint);
      if (expandedRace.SprintShootout) sessions.push(expandedRace.SprintShootout);
      if (expandedRace.SprintQualifying) sessions.push(expandedRace.SprintQualifying);
      if (expandedRace.Qualifying) sessions.push(expandedRace.Qualifying);
      sessions.push({ date: expandedRace.date, time: expandedRace.time });

      const weather = await getWeatherForSessions(
        expandedRace.Circuit.circuitId,
        sessions
      );
      setWeatherData(weather);
    };

    fetchWeatherData();
  }, [expandedRace]);

  useEffect(() => {
    if (!expandedRace) return;

    const fetchLastYearResults = async () => {
      try {
        setLoadingResults(true);
        const lastYear = (parseInt(expandedRace.season) - 1).toString();
        const results = await fetchRaceResults(lastYear, expandedRace.round);
        setLastYearResults(results);
      } catch (error) {
        console.error('Error fetching last year results:', error);
        setLastYearResults([]);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchLastYearResults();
  }, [expandedRace]);

  const getDateRange = (race: Race) => {
    const firstPracticeDate = race.FirstPractice ? new Date(race.FirstPractice.date) : new Date(race.date);
    const raceDate = new Date(race.date);
    
    if (firstPracticeDate.getMonth() === raceDate.getMonth()) {
      return `${firstPracticeDate.toLocaleDateString('en-US', { month: 'long' })} ${firstPracticeDate.getDate()}-${raceDate.getDate()}`;
    } else {
      return `${firstPracticeDate.toLocaleDateString('en-US', { month: 'long' })} ${firstPracticeDate.getDate()} - ${raceDate.toLocaleDateString('en-US', { month: 'long' })} ${raceDate.getDate()}`;
    }
  };

  const isUpcoming = (race: Race) => {
    const raceDate = new Date(race.date);
    return raceDate > new Date();
  };

  const futureRaces = races.filter(isUpcoming).slice(1); // Skip the next race

  if (futureRaces.length === 0) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-6">
        <h2 className="text-2xl font-bold font-display mb-6">2025 Race Calendar</h2>
        <p className="text-white/70">No upcoming races scheduled.</p>
      </div>
    );
  }

  const getCircuitImageName = (circuitId: string): string => {
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

  const renderSessionWeather = (date: string, time: string) => {
    const weather = weatherData[`${date}T${time}`];
    if (!weather) return null;

    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3">
          <WeatherIcon
            weatherCode={weather.weatherCode}
            precipitationProbability={weather.precipitationProbability}
            className="w-8 h-8"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{weather.temperature}°C</span>
              <span className="text-sm text-blue-400">
                {weather.precipitationProbability}% rain
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getDriverImageUrl = (driverId: string, givenName: string, familyName: string) => {
    const firstLetterDir = givenName.charAt(0).toUpperCase();
    const driverCode = (givenName.slice(0, 3) + familyName.slice(0, 3)).toUpperCase() + '01';
    const driverName = `${givenName.charAt(0).toUpperCase() + givenName.slice(1)}_${familyName.charAt(0).toUpperCase() + familyName.slice(1)}`;
    const fileName = (givenName.slice(0, 3) + familyName.slice(0, 3)).toLowerCase() + '01';
    
    return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${firstLetterDir}/${driverCode}_${driverName}/${fileName}.png`;
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

  return (
    <div className="w-full bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">2025 Race Calendar</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Click to {expandedRace ? 'collapse' : 'expand'}</span>
          <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${expandedRace ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {/* Race Cards Row */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="flex gap-3 sm:gap-4 pb-4 px-4 sm:px-0">
            {futureRaces.map((race) => {
              const countryCode = getCountryCode(race.Circuit.Location.country);
              const gradientClass = getCountryGradient(countryCode);
              const isExpanded = expandedRace?.round === race.round;
              
              return (
                <div
                  key={race.round}
                  className="flex-shrink-0 w-[280px] sm:w-[400px]"
                >
                  <motion.div
                    layout
                    className="relative rounded-xl overflow-hidden group cursor-pointer bg-black h-[200px] sm:h-[250px]"
                    onClick={() => setExpandedRace(isExpanded ? null : race)}
                  >
                    {/* Map Container */}
                    <div 
                      id={`map-${race.round}`} 
                      className="absolute inset-0 w-full h-full z-0"
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
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                            {race.raceName}
                          </h3>
                          <p className="text-sm text-white/80 mb-1 sm:mb-2">
                            {race.Circuit.circuitName}
                          </p>
                          <p className="text-xs sm:text-sm text-white/70">
                            {getDateRange(race)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white/30 z-[5]" />
                  </motion.div>
                </div>
              );
            })}
          </div>
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
                      src={`https://flagcdn.com/w40/${getCountryCode(expandedRace.Circuit.Location.country)}.png`}
                      alt={`${expandedRace.Circuit.Location.country} flag`}
                      className="w-10 h-7 sm:w-14 sm:h-9 rounded-md shadow-lg"
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
                    onClick={() => setExpandedRace(null)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Circuit Layout */}
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${getCircuitImageName(expandedRace.Circuit.circuitId)}_Circuit`}
                          alt={`${expandedRace.Circuit.circuitName} layout`}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>

                      {/* Track Info */}
                      {(() => {
                        const trackInfo = getTrackInfo(expandedRace);
                        if (!trackInfo) return null;

                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Length</p>
                                <p className="text-lg font-medium text-white">{trackInfo.TrackLengthPerLap.toFixed(3)} km</p>
                              </div>
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <p className="text-sm text-white/50 mb-1">Turns</p>
                                <p className="text-lg font-medium text-white">{trackInfo.CircuitLayout.TotalNumberOfTurns}</p>
                              </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white/70 mb-2">Lap Record</h4>
                              <p className="text-xl font-medium text-white mb-1">{trackInfo.PerformanceRecords.LapRecord.Time}</p>
                              <p className="text-sm text-white/70">
                                {trackInfo.PerformanceRecords.LapRecord.Driver}
                                <span className="text-white/50"> • </span>
                                {trackInfo.PerformanceRecords.LapRecord.Team}
                                <span className="text-white/50"> • </span>
                                {trackInfo.PerformanceRecords.LapRecord.Year}
                              </p>
                            </div>

                            {/* Track Insights */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold text-white">Track Insights</h3>
                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <h4 className="text-lg font-medium text-white mb-3">Notable Features</h4>
                                <ul className="list-disc list-inside space-y-2">
                                  {trackInfo.CircuitLayout.NotableFeatures.map((feature, index) => (
                                    <li key={index} className="text-white/70">{feature}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <h4 className="text-lg font-medium text-white mb-3">Strategic Considerations</h4>
                                <p className="text-white/70">{trackInfo.HistoricalAndStrategicInsights.RaceStrategyInfluence}</p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Session Schedule */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Schedule</h3>
                        {(() => {
                          // Create an array of all available sessions
                          const sessions = [];
                          
                          if (expandedRace.FirstPractice) {
                            sessions.push({
                              name: 'Practice 1',
                              date: expandedRace.FirstPractice.date,
                              time: expandedRace.FirstPractice.time,
                              session: expandedRace.FirstPractice
                            });
                          }
                          
                          if (expandedRace.SecondPractice) {
                            sessions.push({
                              name: 'Practice 2',
                              date: expandedRace.SecondPractice.date,
                              time: expandedRace.SecondPractice.time,
                              session: expandedRace.SecondPractice
                            });
                          }
                          
                          if (expandedRace.ThirdPractice) {
                            sessions.push({
                              name: 'Practice 3',
                              date: expandedRace.ThirdPractice.date,
                              time: expandedRace.ThirdPractice.time,
                              session: expandedRace.ThirdPractice
                            });
                          }
                          
                          if (expandedRace.SprintShootout || expandedRace.SprintQualifying) {
                            sessions.push({
                              name: 'Sprint Qualifying',
                              date: expandedRace.SprintQualifying?.date || expandedRace.SprintShootout?.date,
                              time: expandedRace.SprintQualifying?.time || expandedRace.SprintShootout?.time,
                              session: expandedRace.SprintQualifying || expandedRace.SprintShootout
                            });
                          }
                          
                          if (expandedRace.Sprint) {
                            sessions.push({
                              name: 'Sprint',
                              date: expandedRace.Sprint.date,
                              time: expandedRace.Sprint.time,
                              session: expandedRace.Sprint
                            });
                          }
                          
                          if (expandedRace.Qualifying) {
                            sessions.push({
                              name: 'Qualifying',
                              date: expandedRace.Qualifying.date,
                              time: expandedRace.Qualifying.time,
                              session: expandedRace.Qualifying
                            });
                          }
                          
                          sessions.push({
                            name: 'Race',
                            date: expandedRace.date,
                            time: expandedRace.time,
                            session: { date: expandedRace.date, time: expandedRace.time }
                          });
                          
                          // Sort the sessions by date and time
                          sessions.sort((a, b) => {
                            const dateA = new Date(`${a.date}T${a.time}`);
                            const dateB = new Date(`${b.date}T${b.time}`);
                            return dateA.getTime() - dateB.getTime();
                          });
                          
                          // Render all sessions in chronological order
                          return sessions.map((sessionItem, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                              <h4 className="text-lg font-medium text-white mb-1">{sessionItem.name}</h4>
                              <p className="text-white/70">
                                {new Date(`${sessionItem.date}T${sessionItem.time}`).toLocaleString(undefined, {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </p>
                            </div>
                          ));
                        })()}
                      </div>

                      {/* Last Year's Results */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Last Year's Results</h3>
                        {loadingResults ? (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-white/10 rounded w-3/4"></div>
                              <div className="h-4 bg-white/10 rounded w-2/3"></div>
                              <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            </div>
                          </div>
                        ) : lastYearResults.length > 0 ? (
                          <div className="space-y-2">
                            {lastYearResults.slice(0, 3).map((result, index) => (
                              <div
                                key={result.position}
                                className={`bg-gradient-to-br ${
                                  index === 0 ? 'from-yellow-500/20 to-yellow-700/10' :
                                  index === 1 ? 'from-gray-400/20 to-gray-600/10' :
                                  'from-amber-700/20 to-amber-900/10'
                                } backdrop-blur-sm rounded-xl p-3 border border-white/10`}
                              >
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <div className={`text-lg sm:text-2xl font-bold min-w-[32px] sm:min-w-[48px] text-center ${
                                    index === 0 ? 'text-yellow-500' :
                                    index === 1 ? 'text-gray-400' :
                                    'text-amber-700'
                                  }`}>
                                    P{result.position}
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                    <img
                                      src={getDriverImageUrl(result.Driver.driverId, result.Driver.givenName, result.Driver.familyName)}
                                      alt={`${result.Driver.givenName} ${result.Driver.familyName}`}
                                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-base sm:text-lg font-bold text-white truncate">
                                        {result.Driver.code}
                                        <span className="hidden sm:inline"> - {result.Driver.givenName} {result.Driver.familyName}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
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
                                  {result.Time && (
                                    <div className="text-xs sm:text-sm text-white/50 hidden sm:block">
                                      {result.Time.time}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <p className="text-white/70">No results available for last year's race</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RaceSchedule; 