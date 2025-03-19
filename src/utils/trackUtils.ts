import tracksData from '../data/tracks.json';

interface Coordinates {
  Latitude: number;
  Longitude: number;
}

const CIRCUIT_ID_TO_TRACK_NAME: { [key: string]: string } = {
  'albert_park': 'Australian Grand Prix',
  'shanghai': 'Chinese Grand Prix',
  'suzuka': 'Japanese Grand Prix',
  'bahrain': 'Bahrain Grand Prix',
  'jeddah': 'Saudi Arabian Grand Prix',
  'miami': 'Miami Grand Prix',
  'imola': 'Emilia Romagna Grand Prix',
  'monaco': 'Monaco Grand Prix',
  'catalunya': 'Spanish Grand Prix',
  'villeneuve': 'Canadian Grand Prix',
  'red_bull_ring': 'Austrian Grand Prix',
  'silverstone': 'British Grand Prix',
  'spa': 'Belgian Grand Prix',
  'hungaroring': 'Hungarian Grand Prix',
  'zandvoort': 'Dutch Grand Prix',
  'monza': 'Italian Grand Prix',
  'baku': 'Azerbaijan Grand Prix',
  'marina_bay': 'Singapore Grand Prix',
  'americas': 'United States Grand Prix',
  'rodriguez': 'Mexican Grand Prix',
  'interlagos': 'Brazilian Grand Prix',
  'las_vegas': 'Las Vegas Grand Prix',
  'losail': 'Qatar Grand Prix',
  'yas_marina': 'Abu Dhabi Grand Prix'
};

export const getTrackCoordinates = (circuitId: string): Coordinates | null => {
  const trackName = CIRCUIT_ID_TO_TRACK_NAME[circuitId];
  if (!trackName) return null;

  const track = tracksData.tracks.find(t => t.TrackName === trackName);
  if (!track) return null;

  return track.Coordinates;
};

export const getTrackInfo = (circuitId: string) => {
  const trackName = CIRCUIT_ID_TO_TRACK_NAME[circuitId];
  if (!trackName) return null;

  const track = tracksData.tracks.find(t => t.TrackName === trackName);
  if (!track) return null;

  return {
    name: track.TrackName,
    location: track.Location,
    coordinates: track.Coordinates,
    length: track.TrackLengthPerLap,
    turns: track.CircuitLayout.TotalNumberOfTurns,
    features: track.CircuitLayout.NotableFeatures,
    lapRecord: track.PerformanceRecords.LapRecord,
    history: track.HistoricalAndStrategicInsights
  };
}; 