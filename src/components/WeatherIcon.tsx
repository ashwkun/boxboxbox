import React from 'react';
import { getWeatherIcon } from '../services/api/weather';

interface WeatherIconProps {
  weatherCode: number;
  precipitationProbability: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ weatherCode, precipitationProbability, className = '' }) => {
  const iconUrl = getWeatherIcon(weatherCode);

  return (
    <div className={`relative ${className}`}>
      <img
        src={iconUrl}
        alt="Weather icon"
        className="w-full h-full"
        style={{ filter: 'brightness(1.2)' }}
      />
    </div>
  );
};

export default WeatherIcon; 