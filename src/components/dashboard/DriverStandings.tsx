import React, { useEffect, useState } from 'react';
import { fetchDriverStandings, DriverStanding } from '../../services/api/jolpica';

interface DriverStandingsProps {
  className?: string;
}

const DriverStandings: React.FC<DriverStandingsProps> = ({ className }) => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('2025');
  
  // Available seasons for dropdown
  const seasons = ['2025', '2024', '2023', '2022', '2021'];

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        const standings = await fetchDriverStandings(selectedSeason);
        setDriverStandings(standings);
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
          {driverStandings.map((standing) => (
            <div
              key={standing.Driver.driverId}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 flex justify-center">
                  <span className={`font-bold text-lg ${
                    standing.position === '1' ? 'text-yellow-500' :
                    standing.position === '2' ? 'text-gray-400' :
                    standing.position === '3' ? 'text-amber-700' : 'text-white'
                  }`}>
                    {standing.position}
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5">
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
                  <div>
                    <div className="font-bold text-white">
                      {standing.Driver.givenName} {standing.Driver.familyName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {standing.Constructors[0] && (
                        <>
                          <img
                            src={getTeamLogoUrl(standing.Constructors[0].constructorId)}
                            alt={standing.Constructors[0].name}
                            className="h-4 w-auto"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <span className="text-sm text-white/70">
                            {standing.Constructors[0].name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-white">
                  {standing.points} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverStandings; 