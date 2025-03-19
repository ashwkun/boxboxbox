import React, { useEffect, useState } from 'react';
import { fetchDriverStandings, DriverStanding } from '../../services/api/jolpica';
import { motion } from 'framer-motion';

interface DriverStandingsProps {
  className?: string;
}

const DriverStandings: React.FC<DriverStandingsProps> = ({ className }) => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('2025');
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  
  // Available seasons for dropdown
  const seasons = ['2025', '2024', '2023', '2022', '2021'];

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        const standings = await fetchDriverStandings(selectedSeason);
        // Sort standings by position, handling both numbered positions and "-" positions
        const sortedStandings = standings.sort((a, b) => {
          // If both have numeric positions, compare them
          if (a.position && b.position) {
            return parseInt(a.position) - parseInt(b.position);
          }
          // If only one has a position, the one with position comes first
          if (a.position) return -1;
          if (b.position) return 1;
          // If neither has a position, maintain their original order
          return 0;
        });
        console.log('Fetched standings:', sortedStandings); // Debug log
        setDriverStandings(sortedStandings);
      } catch (err) {
        console.error('Error fetching driver standings:', err);
        setError('Failed to load driver standings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [selectedSeason]);

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

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">Driver Standings</h2>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="bg-black/30 text-white border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season} Season
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-6 bg-white/10 rounded"></div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-32"></div>
                    <div className="h-3 bg-white/10 rounded w-24"></div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-900/30">
          <p className="text-red-400">{error}</p>
        </div>
      ) : driverStandings.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/70">No driver standings available for {selectedSeason}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {driverStandings.map((standing, index) => {
            const isExpanded = expandedDriver === standing.Driver.driverId;
            return (
              <div
                key={standing.Driver.driverId}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors overflow-hidden"
                onClick={() => setExpandedDriver(isExpanded ? null : standing.Driver.driverId)}
              >
                <div className="p-2 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-7 sm:w-10 flex justify-center shrink-0">
                      <span className={`font-bold text-base sm:text-lg ${
                        String(standing.position) === '1' ? 'text-yellow-500' :
                        String(standing.position) === '2' ? 'text-gray-400' :
                        String(standing.position) === '3' ? 'text-amber-700' : 'text-white/90'
                      }`}>
                        {standing.position ? String(standing.position).padStart(2, ' ') : 
                         standing.positionText === '-' ? String(index + 1).padStart(2, ' ') : 
                         String(standing.positionText).padStart(2, ' ')}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white/5 shrink-0">
                        <img
                          src={getDriverImageUrl(
                            standing.Driver.driverId,
                            standing.Driver.givenName,
                            standing.Driver.familyName
                          )}
                          alt={`${standing.Driver.givenName} ${standing.Driver.familyName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white truncate">
                          <span className="sm:hidden">{standing.Driver.code}</span>
                          <span className="hidden sm:inline">{standing.Driver.givenName} {standing.Driver.familyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                          {standing.Constructors[0] && (
                            <>
                              <img
                                src={getTeamLogoUrl(standing.Constructors[0].constructorId)}
                                alt={standing.Constructors[0].name}
                                className="h-3 sm:h-4 w-auto"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <span className="text-xs sm:text-sm text-white/70 truncate">
                                {standing.Constructors[0].name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-base sm:text-lg font-bold text-white whitespace-nowrap pl-2">
                        {standing.points}
                        <span className="text-sm sm:text-base text-white/70"> pts</span>
                      </div>
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="p-3 sm:p-4 flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/5">
                      <img
                        src={getDriverImageUrl(
                          standing.Driver.driverId,
                          standing.Driver.givenName,
                          standing.Driver.familyName
                        )}
                        alt={`${standing.Driver.givenName} ${standing.Driver.familyName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://media.formula1.com/d_driver_fallback_image.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-medium text-white mb-1">
                        {standing.Driver.givenName} {standing.Driver.familyName}
                      </h4>
                      <div className="text-xs sm:text-sm text-white/70 space-y-1">
                        <p>Driver Code: {standing.Driver.code}</p>
                        <p>Nationality: {standing.Driver.nationality}</p>
                        <p>Position: {standing.position}</p>
                        <p>Points: {standing.points}</p>
                        <p>Wins: {standing.wins}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverStandings; 