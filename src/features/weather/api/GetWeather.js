import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

const getWeatherForecast = ({ location = 'Manila', timesteps = '1d' }) => {
  const params = {
    location,
    timesteps,
    apikey: API_KEY,
    units: 'metric',
  };

  return axios.get(BASE_URL, { params });
};

export const useWeatherForecast = ({
  location,
  timesteps,
  queryConfig = {},
}) => {
  return useQuery({
    queryKey: ['weather', location, timesteps],
    queryFn: () => getWeatherForecast({ location, timesteps }),
    ...queryConfig,
  });
};
