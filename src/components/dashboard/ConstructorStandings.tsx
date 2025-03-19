import React, { useEffect, useState } from 'react';
import { fetchConstructorStandings, ConstructorStanding } from '../../services/api/jolpica';

interface ConstructorStandingsProps {
  className?: string;
}

const ConstructorStandings: React.FC<ConstructorStandingsProps> = ({ className }) => {
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
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
        const standings = await fetchConstructorStandings(selectedSeason);
        setConstructorStandings(standings);
      } catch (err) {
        console.error('Error fetching constructor standings:', err);
        setError('Failed to load constructor standings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [selectedSeason]);

  const getTeamLogoUrl = (constructorId: string) => {
    // Special case for Racing Bulls - using the direct URL
    if (constructorId === 'rb') {
      return 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/fom-website/2018-redesign-assets/team%20logos/racing%20bulls';
    }
    
    // Convert constructor ID to team name format for the new URL structure
    const teamNameMap: { [key: string]: string } = {
      'mclaren': 'mclaren',
      'mercedes': 'mercedes',
      'red_bull': 'red bull',
      'williams': 'williams',
      'aston_martin': 'aston martin',
      'sauber': 'kick sauber',
      'ferrari': 'ferrari',
      'alpine': 'alpine',
      'haas': 'haas'
    };

    const teamName = teamNameMap[constructorId] || constructorId.replace('_', ' ');
    return `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/2018-redesign-assets/team%20logos/${teamName}`;
  };

  // Get full team display name
  const getFullTeamName = (constructorId: string, constructorName: string) => {
    // Map constructor IDs to their full display names
    const fullNameMap: { [key: string]: string } = {
      'mclaren': 'McLaren Formula 1 Team',
      'mercedes': 'Mercedes-AMG PETRONAS F1 Team',
      'red_bull': 'Oracle Red Bull Racing',
      'williams': 'Williams Racing',
      'aston_martin': 'Aston Martin Aramco F1 Team',
      'sauber': 'Stake F1 Team Kick Sauber',
      'ferrari': 'Scuderia Ferrari',
      'alpine': 'BWT Alpine F1 Team',
      'rb': 'Visa Cash App RB Formula One Team',
      'haas': 'MoneyGram Haas F1 Team'
    };

    return fullNameMap[constructorId] || constructorName;
  };

  const getTeamCarImageUrl = (constructorId: string) => {
    // Convert constructor ID to team name format for car images
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
    return `https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${teamName}.png`;
  };

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-display">Constructor Standings</h2>
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
                  <div className="w-16 h-8 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-32"></div>
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
      ) : constructorStandings.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/70">No constructor standings available for {selectedSeason}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {constructorStandings.map((standing) => (
            <div
              key={standing.Constructor.constructorId}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3">
                <div className="flex justify-center w-8">
                  <span className={`font-bold text-lg ${
                    standing.position === '1' ? 'text-yellow-500' :
                    standing.position === '2' ? 'text-gray-400' :
                    standing.position === '3' ? 'text-amber-700' : 'text-white'
                  }`}>
                    {standing.position}
                  </span>
                </div>
                <div className="bg-white rounded-md p-1 flex items-center justify-center">
                  <img
                    src={getTeamLogoUrl(standing.Constructor.constructorId)}
                    alt={standing.Constructor.name}
                    className="h-10 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="font-bold text-white flex items-center">
                  <span>{getFullTeamName(standing.Constructor.constructorId, standing.Constructor.name)}</span>
                  <img
                    src={getTeamCarImageUrl(standing.Constructor.constructorId)}
                    alt={`${standing.Constructor.name} car`}
                    className="h-7 w-auto object-contain opacity-50 ml-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-lg font-bold text-white whitespace-nowrap">
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

export default ConstructorStandings; 