import axios from 'axios';

// Base API URL
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// Types
export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructors: Array<{
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  }>;
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
}

interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

interface Session {
  date: string;
  time: string;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying: Session;
  Sprint?: Session;
  SprintShootout?: Session;
  SprintQualifying?: Session;
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
  grid: string;
  laps: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
    AverageSpeed: {
      units: string;
      speed: string;
    };
  };
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

// API Functions
export async function fetchDriverStandings(
  season: string = 'current',
  round: string = 'last'
): Promise<DriverStanding[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/driverStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    throw error;
  }
}

export async function fetchConstructorStandings(
  season: string = 'current',
  round: string = 'last'
): Promise<ConstructorStanding[]> {
  try {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/constructorStandings.json`);
    return response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    throw error;
  }
}

export const fetchNextRace = async (): Promise<Race | null> => {
  try {
    // First try to get next race from current season
    const currentResponse = await axios.get(`${BASE_URL}/2025/next.json`);
    if (currentResponse.data.MRData.RaceTable.Races.length > 0) {
      return currentResponse.data.MRData.RaceTable.Races[0];
    }

    // If no next race found, get the full 2025 schedule and find next race
    const response = await axios.get(`${BASE_URL}/2025.json`);
    const races = response.data.MRData.RaceTable.Races as Race[];
    
    // Find the next upcoming race
    const now = new Date();
    const nextRace = races.find((race: Race) => new Date(`${race.date}T${race.time}`) > now);
    return nextRace || null;
  } catch (error) {
    console.error('Error fetching next race:', error);
    return null;
  }
};

export const fetchRaceSchedule = async (season: string = '2025'): Promise<Race[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${season}.json`);
    return response.data.MRData.RaceTable.Races;
  } catch (error) {
    console.error(`Error fetching race schedule for ${season}:`, error);
    return [];
  }
};

export const fetchRaceResults = async (season: string, round: string): Promise<RaceResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/results.json`);
    return response.data.MRData.RaceTable.Races[0]?.Results || [];
  } catch (error) {
    console.error('Error fetching race results:', error);
    return [];
  }
};

export const fetchQualifyingResults = async (season: string, round: string): Promise<RaceResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/qualifying.json`);
    return response.data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
  } catch (error) {
    console.error('Error fetching qualifying results:', error);
    return [];
  }
};

export const fetchSprintResults = async (season: string, round: string): Promise<RaceResult[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${season}/${round}/sprint.json`);
    return response.data.MRData.RaceTable.Races[0]?.SprintResults || [];
  } catch (error) {
    console.error('Error fetching sprint results:', error);
    return [];
  }
};

// Export a default object with all functions
export default {
  fetchDriverStandings,
  fetchConstructorStandings,
  fetchNextRace,
  fetchRaceSchedule,
  fetchRaceResults,
  fetchQualifyingResults,
  fetchSprintResults
}; 