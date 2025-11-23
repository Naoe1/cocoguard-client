import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  normalizeDaily,
  normalizeHourly,
  parseLocationInput,
} from '../utils/utils';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_GEOCODING_URL =
  'https://geocoding-api.open-meteo.com/v1/search';

async function geocodeLocation(nameOrCoords) {
  const parsed = parseLocationInput(nameOrCoords);
  if (parsed) return parsed;

  const res = await axios.get(OPEN_METEO_GEOCODING_URL, {
    params: {
      name: nameOrCoords,
      count: 1,
      language: 'en',
      format: 'json',
    },
  });

  const result = res?.data?.results?.[0];
  if (!result) {
    throw new Error('Location not found. Try a city name or "lat,lon".');
  }
  const { latitude, longitude, name, admin1, country } = result;
  const label = [name, admin1, country].filter(Boolean).join(', ');
  return { latitude, longitude, name: label };
}

async function getWeatherForecast({ location, timesteps = '1d' }) {
  const interval =
    timesteps === '1d' ? 'daily' : timesteps === '1h' ? 'hourly' : timesteps;

  const { latitude, longitude, name } = await geocodeLocation(location);

  const commonParams = {
    latitude,
    longitude,
    timezone: 'auto',
    temperature_unit: 'celsius',
    windspeed_unit: 'ms',
    forecast_days: 16,
  };

  const params = { ...commonParams };

  if (interval === 'daily') {
    params.daily = [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_mean',
      'wind_speed_10m_mean',
      'relative_humidity_2m_mean',
      'sunrise',
      'sunset',
      'weather_code',
    ].join(',');
  } else if (interval === 'hourly') {
    params.hourly = [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'wind_speed_10m',
      'weather_code',
    ].join(',');
  } else {
    throw new Error('Invalid timesteps. Use "daily"/"1d" or "hourly"/"1h".');
  }

  const res = await axios.get(OPEN_METEO_FORECAST_URL, { params });

  const normalized = {
    location: { name, latitude, longitude },
    timelines: {
      [interval]:
        interval === 'daily'
          ? normalizeDaily(res.data)
          : normalizeHourly(res.data),
    },
  };

  return { data: normalized };
}

export const useWeatherForecast = ({
  location,
  timesteps,
  queryConfig = {},
}) => {
  return useQuery({
    queryKey: [
      'weather',
      location,
      timesteps === '1d' ? 'daily' : timesteps === '1h' ? 'hourly' : timesteps,
    ],
    queryFn: () => getWeatherForecast({ location, timesteps }),
    ...queryConfig,
  });
};
