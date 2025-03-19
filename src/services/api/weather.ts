import axios from 'axios';
import { getTrackCoordinates } from '../../utils/trackUtils';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherData {
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface SessionWeather {
  [key: string]: WeatherData;
}

// WMO Weather interpretation codes mapped to Basmilius Weather Icons
const weatherCodeMap: { [key: number]: string } = {
  0: 'clear-day',  // Clear sky
  1: 'partly-cloudy-day',  // Mainly clear
  2: 'partly-cloudy-day',  // Partly cloudy
  3: 'cloudy',  // Overcast
  45: 'fog',  // Foggy
  48: 'fog',  // Depositing rime fog
  51: 'drizzle',  // Light drizzle
  53: 'drizzle',  // Moderate drizzle
  55: 'drizzle',  // Dense drizzle
  56: 'sleet',  // Light freezing drizzle
  57: 'sleet',  // Dense freezing drizzle
  61: 'rain',  // Slight rain
  63: 'rain',  // Moderate rain
  65: 'rain',  // Heavy rain
  66: 'sleet',  // Light freezing rain
  67: 'sleet',  // Heavy freezing rain
  71: 'snow',  // Slight snow
  73: 'snow',  // Moderate snow
  75: 'snow',  // Heavy snow
  77: 'snow',  // Snow grains
  80: 'rain',  // Slight rain showers
  81: 'rain',  // Moderate rain showers
  82: 'rain',  // Violent rain showers
  85: 'snow',  // Slight snow showers
  86: 'snow',  // Heavy snow showers
  95: 'thunderstorms',  // Thunderstorm
  96: 'thunderstorms-rain',  // Thunderstorm with slight hail
  99: 'thunderstorms-rain'   // Thunderstorm with heavy hail
};

export const getWeatherForSessions = async (
  circuitId: string,
  sessions: { date: string; time: string }[]
): Promise<SessionWeather> => {
  try {
    const coordinates = getTrackCoordinates(circuitId);
    if (!coordinates) {
      console.error('Could not find coordinates for circuit:', circuitId);
      return {};
    }

    // Create an array of specific timestamps we need
    const timestamps = sessions.map(session => {
      const [year, month, day] = session.date.split('-').map(Number);
      const [hours, minutes] = session.time.split(':').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      return date;
    });

    // Find the earliest and latest dates
    const startDate = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const endDate = new Date(Math.max(...timestamps.map(t => t.getTime())));

    // Make API call to Open-Meteo
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: coordinates.Latitude,
        longitude: coordinates.Longitude,
        hourly: ['temperature_2m', 'precipitation_probability', 'weathercode'],
        timezone: 'GMT',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

    const weatherData: SessionWeather = {};
    const hourlyData = response.data.hourly;
    const timeArray = hourlyData.time;

    // Process each session
    sessions.forEach(session => {
      // Create a Date object in UTC for the session time
      const [year, month, day] = session.date.split('-').map(Number);
      const [hours, minutes] = session.time.split(':').map(Number);
      const sessionDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      // Find the closest time in the API response
      const timeIndex = timeArray.findIndex((time: string) => {
        const apiTime = new Date(time);
        // Use the same hour (allowing for small differences due to API data resolution)
        return apiTime.getUTCFullYear() === sessionDateTime.getUTCFullYear() &&
               apiTime.getUTCMonth() === sessionDateTime.getUTCMonth() &&
               apiTime.getUTCDate() === sessionDateTime.getUTCDate() &&
               apiTime.getUTCHours() === sessionDateTime.getUTCHours();
      });

      if (timeIndex !== -1) {
        weatherData[`${session.date}T${session.time}`] = {
          temperature: Math.round(hourlyData.temperature_2m[timeIndex]),
          precipitationProbability: Math.round(hourlyData.precipitation_probability[timeIndex] || 0),
          weatherCode: hourlyData.weathercode[timeIndex]
        };
      }
    });

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {};
  }
};

export const getWeatherIcon = (weatherCode: number) => {
  const code = weatherCodeMap[weatherCode] || 'clear-day';
  return `https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/svg/${code}.svg`;
}; 