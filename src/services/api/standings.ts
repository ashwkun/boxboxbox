import axios from 'axios';

// We'll use the Ergast API for driver and constructor standings
const BASE_URL = 'https://ergast.com/api/f1';

// Types for API responses
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

export interface DriverStandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings: DriverStanding[];
      }>;
    };
  };
}

export interface ConstructorStandingsResponse {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        season: string;
        round: string;
        ConstructorStandings: ConstructorStanding[];
      }>;
    };
  };
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  FirstPractice?: {
    date: string;
    time: string;
  };
  SecondPractice?: {
    date: string;
    time: string;
  };
  ThirdPractice?: {
    date: string;
    time: string;
  };
  Qualifying: {
    date: string;
    time: string;
  };
  Sprint?: {
    date: string;
    time: string;
  };
}

export interface ScheduleResponse {
  MRData: {
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
}

// Fetch current driver standings
export async function fetchDriverStandings(
  season: string = 'current',
  round: string = 'last'
): Promise<DriverStanding[]> {
  try {
    const response = await axios.get<DriverStandingsResponse>(
      `${BASE_URL}/${season}/${round}/driverStandings.json`
    );
    return response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    throw error;
  }
}

// Fetch current constructor standings
export async function fetchConstructorStandings(
  season: string = 'current',
  round: string = 'last'
): Promise<ConstructorStanding[]> {
  try {
    const response = await axios.get<ConstructorStandingsResponse>(
      `${BASE_URL}/${season}/${round}/constructorStandings.json`
    );
    return response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    throw error;
  }
}

// Fetch race schedule for a season
export async function fetchRaceSchedule(season: string = 'current'): Promise<Race[]> {
  try {
    const response = await axios.get<ScheduleResponse>(`${BASE_URL}/${season}.json`);
    return response.data.MRData.RaceTable.Races || [];
  } catch (error) {
    console.error('Error fetching race schedule:', error);
    throw error;
  }
}

export default {
  fetchDriverStandings,
  fetchConstructorStandings,
  fetchRaceSchedule
}; 