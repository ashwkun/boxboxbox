import axios from 'axios';

// Base API URL
const BASE_URL = 'https://api.openf1.org/v1';

// Generic fetch function with type support
async function fetchFromAPI<T>(endpoint: string, params?: Record<string, any>): Promise<T[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Types for API responses
export interface CarData {
  brake: number;
  date: string;
  driver_number: number;
  drs: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;
}

export interface Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export interface Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number;
  interval: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface Lap {
  date: string;
  driver_number: number;
  is_pit_out_lap: boolean;
  is_personal_best: boolean;
  lap_duration: number;
  lap_number: number;
  meeting_key: number;
  session_key: number;
  sector_1_time: number;
  sector_2_time: number;
  sector_3_time: number;
}

export interface Location {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;
}

export interface Meeting {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export interface Pit {
  date: string;
  driver_number: number;
  lap_number: number;
  meeting_key: number;
  pit_duration: number;
  session_key: number;
}

export interface Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
  status: string;
  type: string;
}

export interface RaceControl {
  category: string;
  date: string;
  flag: string;
  meeting_key: number;
  message: string;
  scope: string;
  session_key: number;
  source: string;
  status: string;
}

export interface Session {
  date_end: string;
  date_start: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export interface Stint {
  compound: string;
  date_end: string;
  date_start: string;
  driver_number: number;
  lap_count: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age: number;
}

export interface TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  recording_url: string;
  session_key: number;
}

export interface Weather {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

// API service functions

// Fetch car telemetry data
export function fetchCarData(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<CarData>('car_data', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch driver information
export function fetchDrivers(
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Driver>('drivers', {
    session_key: sessionKey,
    ...params
  });
}

// Fetch intervals between drivers
export function fetchIntervals(
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Interval>('intervals', {
    session_key: sessionKey,
    ...params
  });
}

// Fetch lap time data
export function fetchLaps(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Lap>('laps', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch driver locations on track
export function fetchLocations(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Location>('location', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch race weekend (meeting) data
export function fetchMeetings(params: Record<string, any> = {}) {
  return fetchFromAPI<Meeting>('meetings', params);
}

// Fetch pit stop data
export function fetchPits(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Pit>('pit', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch position data
export function fetchPositions(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Position>('position', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch race control messages
export function fetchRaceControl(
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<RaceControl>('race_control', {
    session_key: sessionKey,
    ...params
  });
}

// Fetch session information
export function fetchSessions(params: Record<string, any> = {}) {
  return fetchFromAPI<Session>('sessions', params);
}

// Fetch stint data (tyre compounds)
export function fetchStints(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Stint>('stints', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch team radio communications
export function fetchTeamRadio(
  driverNumber?: number,
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<TeamRadio>('team_radio', {
    driver_number: driverNumber,
    session_key: sessionKey,
    ...params
  });
}

// Fetch weather data
export function fetchWeather(
  sessionKey: string | number = 'latest',
  params: Record<string, any> = {}
) {
  return fetchFromAPI<Weather>('weather', {
    session_key: sessionKey,
    ...params
  });
}

// Export all functions
export default {
  fetchCarData,
  fetchDrivers,
  fetchIntervals,
  fetchLaps,
  fetchLocations,
  fetchMeetings,
  fetchPits,
  fetchPositions,
  fetchRaceControl,
  fetchSessions,
  fetchStints,
  fetchTeamRadio,
  fetchWeather
}; 