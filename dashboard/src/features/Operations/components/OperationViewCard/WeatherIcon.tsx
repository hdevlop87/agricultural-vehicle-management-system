import React from 'react';
import { Cloud } from 'lucide-react';

export const WeatherIcon = ({ weather, className = "w-4 h-4" }) => {
  if (!weather) return <Cloud className={`${className} text-gray-400`} />;

  const weatherLower = weather.toLowerCase();
  if (weatherLower.includes('sun') || weatherLower.includes('clear')) {
    return <div className={`${className} bg-yellow-400 rounded-full shadow-sm`}></div>;
  }
  if (weatherLower.includes('rain')) {
    return <Cloud className={`${className} text-blue-500`} />;
  }
  if (weatherLower.includes('cloud') || weatherLower.includes('fog')) {
    return <Cloud className={`${className} text-gray-500`} />;
  }
  return <Cloud className={`${className} text-gray-400`} />;
};
