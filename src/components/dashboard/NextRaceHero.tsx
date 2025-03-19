import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, SunIcon, CloudIcon, CloudIcon as CloudRainIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Race, RaceResult, fetchRaceResults } from '../../services/api/jolpica';
import { getWeatherForSessions, SessionWeather } from '../../services/api/weather';
import { getCountryCode } from '../../utils/countryCodeMap';
import WeatherIcon from '../WeatherIcon';
import Header from '../Header';
import tracksData from '../../data/tracks.json';

interface CountdownData {
  event: string;
  eventTime: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Session {
  date: string;
  time: string;
}

interface TrackDetails {
  TrackName: string;
  Location: string;
  TrackLengthPerLap: number;
  CircuitLayout: {
    TotalNumberOfTurns: number;
    NotableFeatures: string[];
  };
  PerformanceRecords: {
    LapRecord: {
      Time: string;
      Driver: string;
      Team: string;
      Year: number | string;
    };
  };
  HistoricalAndStrategicInsights: {
    KeyHistoricalMoments: string;
    RaceStrategyInfluence: string;
  };
}

interface NextRaceHeroProps {
  race: Race | null;
  loading: boolean;
}

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

const NextRaceHero: React.FC<NextRaceHeroProps> = ({ race, loading }) => {
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [weatherData, setWeatherData] = useState<SessionWeather>({});
  const [lastYearResults, setLastYearResults] = useState<RaceResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (!race) return;

    const getNextMajorEvent = () => {
      const now = new Date();
      const events = [
        { name: 'Sprint Qualifying', time: race.SprintQualifying ? new Date(`${race.SprintQualifying.date}T${race.SprintQualifying.time}`) : 
                                         race.SprintShootout ? new Date(`${race.SprintShootout.date}T${race.SprintShootout.time}`) : null },
        { name: 'Sprint', time: race.Sprint ? new Date(`${race.Sprint.date}T${race.Sprint.time}`) : null },
        { name: 'Qualifying', time: race.Qualifying ? new Date(`${race.Qualifying.date}T${race.Qualifying.time}`) : null },
        { name: 'Race', time: new Date(`${race.date}T${race.time}`) }
      ].filter((event): event is { name: string; time: Date } => event.time !== null && event.time > now);

      return events[0] || null;
    };

    const calculateCountdown = () => {
      const nextEvent = getNextMajorEvent();
      if (!nextEvent) return null;

      const now = new Date().getTime();
      const distance = nextEvent.time.getTime() - now;

      if (distance < 0) return null;

      return {
        event: nextEvent.name,
        eventTime: nextEvent.time,
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    };

    const updateCountdown = () => {
      setCountdown(calculateCountdown());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [race]);

  useEffect(() => {
    if (!race) return;

    const fetchWeatherData = async () => {
      const sessions: Session[] = [];
      
      // Always fetch all sessions regardless of expanded state
      // This ensures we have all data available even for the collapsed view
      if (race.FirstPractice) sessions.push(race.FirstPractice);
      if (race.SecondPractice) sessions.push(race.SecondPractice);
      if (race.ThirdPractice) sessions.push(race.ThirdPractice);
      if (race.SprintQualifying) sessions.push(race.SprintQualifying);
      if (race.SprintShootout) sessions.push(race.SprintShootout);
      if (race.Sprint) sessions.push(race.Sprint);
      if (race.Qualifying) sessions.push(race.Qualifying);
      sessions.push({ date: race.date, time: race.time });

      const weather = await getWeatherForSessions(
        race.Circuit.circuitId,
        sessions
      );
      setWeatherData(weather);
    };

    // Always fetch weather data
    fetchWeatherData();
  }, [race]);

  useEffect(() => {
    if (!race || !isExpanded) return;

    const fetchLastYearResults = async () => {
      try {
        setLoadingResults(true);
        const lastYear = (parseInt(race.season) - 1).toString();
        const results = await fetchRaceResults(lastYear, race.round);
        setLastYearResults(results);
      } catch (error) {
        console.error('Error fetching last year results:', error);
        setLastYearResults([]);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchLastYearResults();
  }, [race, isExpanded]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="w-full bg-card rounded-xl border border-border p-8 animate-pulse">
          <div className="h-8 bg-background/50 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-background/50 rounded w-1/4"></div>
        </div>
      </>
    );
  }

  if (!race) {
    return (
      <>
        <Header />
        <div className="w-full bg-card rounded-xl border border-border p-8">
          <h2 className="text-2xl font-bold font-display mb-2">No Upcoming Races</h2>
          <p className="text-white/70">Check back later for the next race schedule.</p>
        </div>
      </>
    );
  }

  const countryCode = getCountryCode(race.Circuit.Location.country);

  const getCircuitImageName = (circuitId: string): string => {
    return CIRCUIT_NAME_MAP[circuitId] || circuitId.charAt(0).toUpperCase() + circuitId.slice(1);
  };

  const getTrackInfo = (race: Race) => {
    // Try to match by circuit name first
    let trackInfo = tracksData.tracks.find(
      track => track.TrackName.toLowerCase().includes(race.raceName.toLowerCase().replace(' grand prix', ''))
    );
    
    // If not found, try to match by location
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
    // First letter of first name in caps for the directory
    const firstLetterDir = givenName.charAt(0).toUpperCase();
    
    // First 3 letters of first name + First 3 letters of last name + "01" in caps for the folder
    const driverCode = (givenName.slice(0, 3) + familyName.slice(0, 3)).toUpperCase() + '01';
    
    // First name and Last name with first letters capitalized for the folder name
    const driverName = `${givenName.charAt(0).toUpperCase() + givenName.slice(1)}_${familyName.charAt(0).toUpperCase() + familyName.slice(1)}`;
    
    // First 3 letters of first name + First 3 letters of last name + "01" in lowercase for the file
    const fileName = (givenName.slice(0, 3) + familyName.slice(0, 3)).toLowerCase() + '01';
    
    return `https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${firstLetterDir}/${driverCode}_${driverName}/${fileName}.png`;
  };

  const getTeamLogoUrl = (constructorId: string) => {
    // Convert constructor ID to team name format
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

  const getCountryGradient = (countryCode: string) => {
    return COUNTRY_GRADIENTS[countryCode.toLowerCase()] || 'from-primary/40';
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="w-full bg-card rounded-xl border border-border overflow-hidden cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Hero Section */}
          <div 
            className="relative min-h-[500px] bg-cover bg-center flex flex-col"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%),
                url(https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${getCircuitImageName(race.Circuit.circuitId)}%20carbon.png)`
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/75 z-[1]" />
            
            {/* Gradient Accent */}
            <div className={`absolute inset-0 bg-gradient-to-bl ${getCountryGradient(countryCode)} via-transparent to-transparent z-[2] opacity-90`} />

            {/* Main Content */}
            <div className="flex flex-col h-full p-8 relative z-[3]">
              {/* Top Bar - Country & Round */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold font-display mb-4">NEXT RACE</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://flagcdn.com/w160/${countryCode}.png`}
                  alt={`${race.Circuit.Location.country} flag`}
                      className="w-12 h-8 rounded-md shadow-lg object-cover"
                />
                <div>
                      <h3 className="text-xl font-medium text-white">
                    {race.Circuit.Location.country}
                  </h3>
                      <p className="text-sm font-medium text-white/50">Round {race.round}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">Click to {isExpanded ? 'collapse' : 'expand'}</span>
                  <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Race Title & Circuit */}
              <div className="flex-1 flex flex-col justify-center mb-8">
                <h2 className="text-5xl font-bold font-display mb-4 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                    {race.raceName}
                  </h2>
                <p className="text-2xl text-white/70">{race.Circuit.circuitName}</p>
              </div>

              {/* Bottom Section - Next Session & Weather */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Countdown Timer */}
                {countdown && (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6">
                    <div className="mb-4">
                      <p className="text-white/70 text-sm uppercase tracking-wider">Next main event</p>
                      <h3 className="text-2xl font-bold text-white">{countdown.event}</h3>
                      <p className="text-sm text-white/50 mt-1">
                        {countdown.eventTime.toLocaleString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                      {renderSessionWeather(
                        countdown.event === 'Race' ? race.date : 
                        countdown.event === 'Qualifying' ? race.Qualifying?.date || '' : 
                        countdown.event === 'Sprint' ? race.Sprint?.date || '' :
                        countdown.event === 'Sprint Qualifying' ? (race.SprintQualifying?.date || race.SprintShootout?.date || '') : '',
                        countdown.event === 'Race' ? race.time :
                        countdown.event === 'Qualifying' ? race.Qualifying?.time || '' :
                        countdown.event === 'Sprint' ? race.Sprint?.time || '' :
                        countdown.event === 'Sprint Qualifying' ? (race.SprintQualifying?.time || race.SprintShootout?.time || '') : ''
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                        <div className="text-3xl font-bold bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    {countdown.days}
                  </div>
                  <div className="text-sm text-white/70 mt-2">Days</div>
                </div>
                <div className="text-center">
                        <div className="text-3xl font-bold bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    {countdown.hours}
                  </div>
                  <div className="text-sm text-white/70 mt-2">Hours</div>
                </div>
                <div className="text-center">
                        <div className="text-3xl font-bold bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    {countdown.minutes}
                  </div>
                  <div className="text-sm text-white/70 mt-2">Minutes</div>
                </div>
                <div className="text-center">
                        <div className="text-3xl font-bold bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    {countdown.seconds}
                  </div>
                  <div className="text-sm text-white/70 mt-2">Seconds</div>
                </div>
              </div>
            </div>
          )}

                {/* Quick Schedule Overview */}
                <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6">
                  <div className="flex flex-col space-y-4">
                    {(() => {
                      // Create an array of all available sessions
                      const sessions = [];
                      
                      if (race.FirstPractice) {
                        sessions.push({
                          name: 'Practice 1',
                          date: race.FirstPractice.date,
                          time: race.FirstPractice.time
                        });
                      }
                      
                      if (race.SecondPractice) {
                        sessions.push({
                          name: 'Practice 2',
                          date: race.SecondPractice.date,
                          time: race.SecondPractice.time
                        });
                      }
                      
                      if (race.ThirdPractice) {
                        sessions.push({
                          name: 'Practice 3',
                          date: race.ThirdPractice.date,
                          time: race.ThirdPractice.time
                        });
                      }
                      
                      if (race.SprintShootout || race.SprintQualifying) {
                        sessions.push({
                          name: 'Sprint Qualifying',
                          date: race.SprintQualifying?.date || race.SprintShootout?.date,
                          time: race.SprintQualifying?.time || race.SprintShootout?.time
                        });
                      }
                      
                      if (race.Sprint) {
                        sessions.push({
                          name: 'Sprint',
                          date: race.Sprint.date,
                          time: race.Sprint.time
                        });
                      }
                      
                      if (race.Qualifying) {
                        sessions.push({
                          name: 'Qualifying',
                          date: race.Qualifying.date,
                          time: race.Qualifying.time
                        });
                      }
                      
                      sessions.push({
                        name: 'Race',
                        date: race.date,
                        time: race.time
                      });
                      
                      // Sort the sessions by date and time
                      sessions.sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.time}`);
                        const dateB = new Date(`${b.date}T${b.time}`);
                        return dateA.getTime() - dateB.getTime();
                      });
                      
                      // Return the next few sessions (up to 4)
                      const today = new Date();
                      const upcomingSessions = sessions.filter(session => {
                        const sessionDate = new Date(`${session.date}T${session.time}`);
                        return sessionDate > today;
                      });
                      
                      // If no upcoming sessions, show the last 4 sessions
                      const sessionsToShow = upcomingSessions.length > 0 ? upcomingSessions.slice(0, 4) : sessions.slice(-4);
                      
                      return sessionsToShow.map((session, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">{session.name}</p>
                            <p className="text-white font-medium">
                              {new Date(`${session.date}T${session.time}`).toLocaleString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                  </div>
                          {session.date && session.time && renderSessionWeather(session.date, session.time)}
                </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10"
              >
                {/* Circuit Information */}
                <div className="bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md p-8">
                  <div className="max-w-7xl mx-auto">
                    {/* Circuit Layout & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                      {/* Left Column - Track Layout */}
                      <div className="lg:col-span-1">
                        <div className="sticky top-8">
                          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Circuit Layout
                          </h3>
                          <div className="relative rounded-xl overflow-hidden bg-white/5 aspect-video mb-6">
                            <img
                              src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${getCircuitImageName(race.Circuit.circuitId)}_Circuit`}
                              alt={`${race.Circuit.circuitName} layout`}
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

                          {/* Track Stats */}
                          {(() => {
                            const trackInfo = getTrackInfo(race);
                            if (!trackInfo) return null;

                            return (
                              <div className="space-y-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-white/50 mb-1">Length</p>
                                      <p className="text-lg font-medium text-white">{trackInfo.TrackLengthPerLap.toFixed(3)} km</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-white/50 mb-1">Turns</p>
                                      <p className="text-lg font-medium text-white">{trackInfo.CircuitLayout.TotalNumberOfTurns}</p>
                                    </div>
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

                                {/* Last Year's Results */}
                                <div className="mt-4">
                                  <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                    <TrophyIcon className="w-5 h-5 text-yellow-500" />
                                    Last Year's Results
                                  </h3>
                                  {loadingResults ? (
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                      <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/10 rounded w-2/3"></div>
                                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                      </div>
                                    </div>
                                  ) : lastYearResults.length > 0 ? (
                                    <div className="space-y-6">
                                      {lastYearResults.slice(0, 3).map((result, index) => (
                                        <div
                                          key={result.position}
                                          className={`bg-gradient-to-br ${
                                            index === 0 ? 'from-yellow-500/20 to-yellow-700/10' :
                                            index === 1 ? 'from-gray-400/20 to-gray-600/10' :
                                            'from-amber-700/20 to-amber-900/10'
                                          } backdrop-blur-sm rounded-xl p-6 border border-white/10`}
                                        >
                                          <div className="flex items-center gap-6">
                                            <div className={`text-4xl font-bold min-w-[48px] ${
                                              index === 0 ? 'text-yellow-500' :
                                              index === 1 ? 'text-gray-400' :
                                              'text-amber-700'
                                            }`}>
                                              P{result.position}
                                            </div>
                                            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-white/5">
                                              <img
                                                src={getDriverImageUrl(
                                                  result.Driver.driverId,
                                                  result.Driver.givenName,
                                                  result.Driver.familyName
                                                )}
                                                alt={`${result.Driver.givenName} ${result.Driver.familyName}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                                                }}
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="text-2xl font-bold text-white leading-tight">
                                                {result.Driver.givenName} {result.Driver.familyName}
                                              </div>
                                              <div className="flex items-center gap-3 mt-2">
                                                <img
                                                  src={getTeamLogoUrl(result.Constructor.constructorId)}
                                                  alt={result.Constructor.name}
                                                  className="h-6 w-auto object-contain"
                                                  onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                  }}
                                                />
                                                <span className="text-lg text-white/70">
                                                  {result.Constructor.name}
                                                </span>
                                              </div>
                                              {result.Time && (
                                                <div className="text-base text-white/50 mt-2">
                                                  Race Time: {result.Time.time}
                                                </div>
                                              )}
                                            </div>
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
                            );
                          })()}
                        </div>
                      </div>

                      {/* Middle & Right Columns - Schedule & Weather */}
                      <div className="lg:col-span-2">
                        <div className="h-full flex flex-col space-y-8">
                          {/* Schedule */}
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Full Schedule
                            </h3>
                            <div className="space-y-4">
                              {/* Practice 1 */}
                              {race.FirstPractice && (
                                <motion.div 
                                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSession(expandedSession === 'practice1' ? null : 'practice1');
                                  }}
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white">Practice 1</h4>
                                        <p className="text-white/70 mt-1">
                                          {new Date(`${race.FirstPractice.date}T${race.FirstPractice.time}`).toLocaleString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        {weatherData[`${race.FirstPractice.date}T${race.FirstPractice.time}`] && (
                                          <div className="flex items-center">
                                            <WeatherIcon
                                              weatherCode={weatherData[`${race.FirstPractice.date}T${race.FirstPractice.time}`].weatherCode}
                                              precipitationProbability={weatherData[`${race.FirstPractice.date}T${race.FirstPractice.time}`].precipitationProbability}
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-2">
                                              <span className="text-2xl font-bold text-white">{weatherData[`${race.FirstPractice.date}T${race.FirstPractice.time}`].temperature}°C</span>
                                              <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.FirstPractice.date}T${race.FirstPractice.time}`].precipitationProbability}% rain</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className={`transition-transform duration-300 ${expandedSession === 'practice1' ? 'rotate-180' : ''}`}>
                                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {expandedSession === 'practice1' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                      >
                                        <div className="p-4 space-y-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                            <p className="text-white/70">60-minute free practice session for car setup and track familiarization.</p>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Focus Areas</h5>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                              <li>Baseline setup evaluation</li>
                                              <li>Tire degradation analysis</li>
                                              <li>Aero correlation validation</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}

                              {/* Practice 2 */}
                              {race.SecondPractice && (
                                <motion.div 
                                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSession(expandedSession === 'practice2' ? null : 'practice2');
                                  }}
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white">Practice 2</h4>
                                        <p className="text-white/70 mt-1">
                                          {new Date(`${race.SecondPractice.date}T${race.SecondPractice.time}`).toLocaleString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        {weatherData[`${race.SecondPractice.date}T${race.SecondPractice.time}`] && (
                                          <div className="flex items-center">
                                            <WeatherIcon
                                              weatherCode={weatherData[`${race.SecondPractice.date}T${race.SecondPractice.time}`].weatherCode}
                                              precipitationProbability={weatherData[`${race.SecondPractice.date}T${race.SecondPractice.time}`].precipitationProbability}
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-2">
                                              <span className="text-2xl font-bold text-white">{weatherData[`${race.SecondPractice.date}T${race.SecondPractice.time}`].temperature}°C</span>
                                              <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.SecondPractice.date}T${race.SecondPractice.time}`].precipitationProbability}% rain</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className={`transition-transform duration-300 ${expandedSession === 'practice2' ? 'rotate-180' : ''}`}>
                                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {expandedSession === 'practice2' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                      >
                                        <div className="p-4 space-y-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                            <p className="text-white/70">60-minute practice session with focus on long run pace and race preparation.</p>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Focus Areas</h5>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                              <li>Race simulation runs</li>
                                              <li>Fuel load performance</li>
                                              <li>Setup refinement</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}

                              {/* Practice 3 */}
                              {race.ThirdPractice && (
                                <motion.div 
                                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSession(expandedSession === 'practice3' ? null : 'practice3');
                                  }}
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white">Practice 3</h4>
                                        <p className="text-white/70 mt-1">
                                          {new Date(`${race.ThirdPractice.date}T${race.ThirdPractice.time}`).toLocaleString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        {weatherData[`${race.ThirdPractice.date}T${race.ThirdPractice.time}`] && (
                                          <div className="flex items-center">
                                            <WeatherIcon
                                              weatherCode={weatherData[`${race.ThirdPractice.date}T${race.ThirdPractice.time}`].weatherCode}
                                              precipitationProbability={weatherData[`${race.ThirdPractice.date}T${race.ThirdPractice.time}`].precipitationProbability}
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-2">
                                              <span className="text-2xl font-bold text-white">{weatherData[`${race.ThirdPractice.date}T${race.ThirdPractice.time}`].temperature}°C</span>
                                              <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.ThirdPractice.date}T${race.ThirdPractice.time}`].precipitationProbability}% rain</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className={`transition-transform duration-300 ${expandedSession === 'practice3' ? 'rotate-180' : ''}`}>
                                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {expandedSession === 'practice3' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                      >
                                        <div className="p-4 space-y-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                            <p className="text-white/70">60-minute practice session focusing on qualifying preparation and final setup changes.</p>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Focus Areas</h5>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                              <li>Qualifying simulation runs</li>
                                              <li>Low fuel performance</li>
                                              <li>Final setup adjustments</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}

                              {/* Sprint Qualifying (either SprintShootout or SprintQualifying) */}
                              {(race.SprintShootout || race.SprintQualifying) && (
                                <motion.div 
                                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSession(expandedSession === 'sprintShootout' ? null : 'sprintShootout');
                                  }}
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white">Sprint Qualifying</h4>
                                        <p className="text-white/70 mt-1">
                                          {new Date(`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`).toLocaleString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        {weatherData[`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`] && (
                                          <div className="flex items-center">
                                            <WeatherIcon
                                              weatherCode={weatherData[`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`].weatherCode}
                                              precipitationProbability={weatherData[`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`].precipitationProbability}
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-2">
                                              <span className="text-2xl font-bold text-white">{weatherData[`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`].temperature}°C</span>
                                              <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.SprintQualifying?.date || race.SprintShootout?.date}T${race.SprintQualifying?.time || race.SprintShootout?.time}`].precipitationProbability}% rain</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className={`transition-transform duration-300 ${expandedSession === 'sprintShootout' ? 'rotate-180' : ''}`}>
                                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {expandedSession === 'sprintShootout' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                      >
                                        <div className="p-4 space-y-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                            <p className="text-white/70">Three knockout sessions (Q1, Q2, Q3) to determine the grid order. Bottom 5 drivers eliminated in Q1 and Q2.</p>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Breakdown</h5>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                              <li>Q1: 18 minutes, all cars</li>
                                              <li>Q2: 15 minutes, 15 cars</li>
                                              <li>Q3: 12 minutes, top 10 shootout</li>
                                              <li>Free tire choice for race start</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}

                              {/* Sprint */}
                              {race.Sprint && (
                                <motion.div 
                                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSession(expandedSession === 'sprint' ? null : 'sprint');
                                  }}
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-white">Sprint</h4>
                                        <p className="text-white/70 mt-1">
                                          {new Date(`${race.Sprint.date}T${race.Sprint.time}`).toLocaleString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        {weatherData[`${race.Sprint.date}T${race.Sprint.time}`] && (
                                          <div className="flex items-center">
                                            <WeatherIcon
                                              weatherCode={weatherData[`${race.Sprint.date}T${race.Sprint.time}`].weatherCode}
                                              precipitationProbability={weatherData[`${race.Sprint.date}T${race.Sprint.time}`].precipitationProbability}
                                              className="w-10 h-10"
                                            />
                                            <div className="ml-2">
                                              <span className="text-2xl font-bold text-white">{weatherData[`${race.Sprint.date}T${race.Sprint.time}`].temperature}°C</span>
                                              <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.Sprint.date}T${race.Sprint.time}`].precipitationProbability}% rain</span>
                                            </div>
                                          </div>
                                        )}
                                        <div className={`transition-transform duration-300 ${expandedSession === 'sprint' ? 'rotate-180' : ''}`}>
                                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {expandedSession === 'sprint' && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/10"
                                      >
                                        <div className="p-4 space-y-4">
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                            <p className="text-white/70">A shorter race (100km) with no mandatory pit stops. Points awarded to top 8 finishers (8-7-6-5-4-3-2-1).</p>
                                          </div>
                                          <div>
                                            <h5 className="text-sm font-medium text-white/70 mb-2">Key Considerations</h5>
                                            <ul className="list-disc list-inside space-y-1 text-white/70">
                                              <li>Tire management crucial</li>
                                              <li>Risk vs reward balance</li>
                                              <li>No mandatory pit stops</li>
                                              <li>Points scoring opportunity</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}

                              {/* Qualifying */}
                              <motion.div 
                                className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSession(expandedSession === 'qualifying' ? null : 'qualifying');
                                }}
                              >
                                <div className="p-5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-xl font-semibold text-white">Qualifying</h4>
                                      <p className="text-white/70 mt-1">
                                        {new Date(`${race.Qualifying.date}T${race.Qualifying.time}`).toLocaleString(undefined, {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      {weatherData[`${race.Qualifying.date}T${race.Qualifying.time}`] && (
                                        <div className="flex items-center">
                                          <WeatherIcon
                                            weatherCode={weatherData[`${race.Qualifying.date}T${race.Qualifying.time}`].weatherCode}
                                            precipitationProbability={weatherData[`${race.Qualifying.date}T${race.Qualifying.time}`].precipitationProbability}
                                            className="w-10 h-10"
                                          />
                                          <div className="ml-2">
                                            <span className="text-2xl font-bold text-white">{weatherData[`${race.Qualifying.date}T${race.Qualifying.time}`].temperature}°C</span>
                                            <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.Qualifying.date}T${race.Qualifying.time}`].precipitationProbability}% rain</span>
                                          </div>
                                        </div>
                                      )}
                                      <div className={`transition-transform duration-300 ${expandedSession === 'qualifying' ? 'rotate-180' : ''}`}>
                                        <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedSession === 'qualifying' && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-white/10"
                                    >
                                      <div className="p-4 space-y-4">
                                        <div>
                                          <h5 className="text-sm font-medium text-white/70 mb-2">Session Format</h5>
                                          <p className="text-white/70">Three knockout sessions (Q1, Q2, Q3) to determine the grid order. Bottom 5 drivers eliminated in Q1 and Q2.</p>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-white/70 mb-2">Session Breakdown</h5>
                                          <ul className="list-disc list-inside space-y-1 text-white/70">
                                            <li>Q1: 18 minutes, all cars</li>
                                            <li>Q2: 15 minutes, 15 cars</li>
                                            <li>Q3: 12 minutes, top 10 shootout</li>
                                            <li>Three sets of tires required</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>

                              {/* Race */}
                              <motion.div 
                                className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSession(expandedSession === 'race' ? null : 'race');
                                }}
                              >
                                <div className="p-5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-xl font-semibold text-white">Race</h4>
                                      <p className="text-white/70 mt-1">
                                        {new Date(`${race.date}T${race.time}`).toLocaleString(undefined, {
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      {weatherData[`${race.date}T${race.time}`] && (
                                        <div className="flex items-center">
                                          <WeatherIcon
                                            weatherCode={weatherData[`${race.date}T${race.time}`].weatherCode}
                                            precipitationProbability={weatherData[`${race.date}T${race.time}`].precipitationProbability}
                                            className="w-10 h-10"
                                          />
                                          <div className="ml-2">
                                            <span className="text-2xl font-bold text-white">{weatherData[`${race.date}T${race.time}`].temperature}°C</span>
                                            <span className="ml-2 text-lg text-blue-400">{weatherData[`${race.date}T${race.time}`].precipitationProbability}% rain</span>
                                          </div>
                                        </div>
                                      )}
                                      <div className={`transition-transform duration-300 ${expandedSession === 'race' ? 'rotate-180' : ''}`}>
                                        <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedSession === 'race' && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="border-t border-white/10"
                                    >
                                      <div className="p-4 space-y-4">
                                        <div>
                                          <h5 className="text-sm font-medium text-white/70 mb-2">Race Distance</h5>
                                          <p className="text-white/70">Approximately 305 km (190 miles) or a maximum of 2 hours, whichever comes first.</p>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-medium text-white/70 mb-2">Key Rules</h5>
                                          <ul className="list-disc list-inside space-y-1 text-white/70">
                                            <li>Mandatory pit stop required</li>
                                            <li>Two tire compounds must be used</li>
                                            <li>Points awarded to top 10 finishers</li>
                                            <li>Extra point for fastest lap (if finished in top 10)</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            </div>
                          </div>

                          {/* Track Insights */}
                          {(() => {
                            const trackInfo = getTrackInfo(race);
                            if (!trackInfo) return null;

                            return (
                              <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                                  <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Track Insights
                                </h3>
                                <div className="space-y-4">
                                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-medium text-white mb-3">Notable Features</h4>
                                    <ul className="list-disc list-inside space-y-2">
                                      {trackInfo.CircuitLayout.NotableFeatures.map((feature, index) => (
                                        <li key={index} className="text-white/70">{feature}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-medium text-white mb-3">Historical Insights</h4>
                                    <p className="text-white/70">{trackInfo.HistoricalAndStrategicInsights.KeyHistoricalMoments}</p>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-medium text-white mb-3">Strategic Considerations</h4>
                                    <p className="text-white/70">{trackInfo.HistoricalAndStrategicInsights.RaceStrategyInfluence}</p>
                                  </div>
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
                    src={`https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_2000/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${getCircuitImageName(race.Circuit.circuitId)}_Circuit`}
                    alt={`${race.Circuit.circuitName} layout`}
                    className="w-full h-full object-contain p-4"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default NextRaceHero; 