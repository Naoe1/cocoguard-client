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

// https://docs.tomorrow.io/reference/data-layers-weather-codes
const weatherCodeMap = {
  0: Sun,
  1000: Sun, // Clear, Sunny
  1100: CloudSun, // Mostly Clear
  1101: CloudSun, // Partly Cloudy
  1102: Cloud, // Mostly Cloudy
  1001: Cloud, // Cloudy
  2000: CloudFog, // Fog
  2100: CloudFog, // Light Fog
  4000: CloudDrizzle, // Drizzle
  4001: CloudRain, // Rain
  4200: CloudRain, // Light Rain
  4201: CloudRainWind, // Heavy Rain
  5000: CloudSnow, // Snow
  5001: CloudSnow, // Flurries
  5100: CloudSnow, // Light Snow
  5101: CloudSnow, // Heavy Snow
  6000: ThermometerSnowflake, // Freezing Drizzle
  6001: ThermometerSnowflake, // Freezing Rain
  6200: ThermometerSnowflake, // Light Freezing Rain
  6201: ThermometerSnowflake, // Heavy Freezing Rain
  7000: CloudSnow, // Ice Pellets (Using Snow icon)
  7101: CloudSnow, // Heavy Ice Pellets
  7102: CloudSnow, // Light Ice Pellets
  8000: CloudLightning, // Thunderstorm
};

export const getWeatherCodeIcon = (code) => {
  return weatherCodeMap[code] || Cloud;
};
