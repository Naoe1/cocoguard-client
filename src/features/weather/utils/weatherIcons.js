// ...existing code...
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  ThermometerSnowflake,
} from 'lucide-react';

const weatherCodeMap = {
  0: Sun, // Clear sky
  1: CloudSun, // Mainly clear
  2: CloudSun, // Partly cloudy
  3: Cloud, // Overcast
  45: CloudFog, // Fog
  48: CloudFog, // Depositing rime fog
  51: CloudDrizzle, // Light drizzle
  53: CloudDrizzle, // Moderate drizzle
  55: CloudDrizzle, // Dense drizzle
  56: ThermometerSnowflake, // Light freezing drizzle
  57: ThermometerSnowflake, // Dense freezing drizzle
  61: CloudRain, // Slight rain
  63: CloudRain, // Moderate rain
  65: CloudRain, // Heavy rain
  66: ThermometerSnowflake, // Light freezing rain
  67: ThermometerSnowflake, // Heavy freezing rain
  71: CloudSnow, // Slight snow fall
  73: CloudSnow, // Moderate snow fall
  75: CloudSnow, // Heavy snow fall
  77: CloudSnow, // Snow grains
  80: CloudRain, // Rain showers: slight
  81: CloudRainWind, // Rain showers: moderate
  82: CloudRainWind, // Rain showers: violent
  85: CloudSnow, // Snow showers: slight
  86: CloudSnow, // Snow showers: heavy
  95: CloudLightning, // Thunderstorm
  96: CloudLightning, // Thunderstorm with slight hail
  99: CloudLightning, // Thunderstorm with heavy hail
};

export const getWeatherCodeIcon = (code) => {
  return weatherCodeMap[code] || Cloud;
};
// ...existing code...
