import React, { useState, useMemo } from 'react';
import { useWeatherForecast } from '../api/GetWeather';
import { WeatherCard } from './WeatherCard';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAuth } from '@/lib/auth';

export const WeatherView = () => {
  const { auth } = useAuth();
  const [location, setLocation] = useState(auth.user?.city || 'Manila');
  const [tempLocation, setTempLocation] = useState(location);
  const [timesteps, setTimesteps] = useState('daily');
  const weatherQuery = useWeatherForecast({
    location,
    timesteps: timesteps === 'daily' ? '1d' : '1h',
    queryConfig: {
      staleTime: 1000 * 60 * 15,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(tempLocation);
  };

  const forecastData = weatherQuery.data?.data?.timelines?.[timesteps];
  const locationName = weatherQuery.data?.data?.location?.name;

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <h1 className="text-2xl font-semibold">Weather Forecast</h1>
        <form
          onSubmit={handleSearch}
          className="flex gap-2 flex-grow sm:justify-end"
        >
          <Input
            placeholder="Enter location (e.g., city, coordinates)"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
            className="max-w-xs"
          />
          <Select value={timesteps} onValueChange={setTimesteps}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={weatherQuery.isFetching}>
            {weatherQuery.isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Search
          </Button>
        </form>
      </div>

      {weatherQuery.isLoading && (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {weatherQuery.isError && (
        <div className="flex flex-col items-center justify-center h-60 bg-red-50 border border-red-200 rounded-md p-4">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-red-700 font-medium">
            Failed to load weather data.
          </p>
          <p className="text-red-600 text-sm">
            {weatherQuery.error?.response?.data?.message ||
              weatherQuery.error?.message ||
              'Please check the location or try again later.'}
          </p>
        </div>
      )}

      {weatherQuery.isSuccess && forecastData && forecastData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forecastData.map((item, index) => (
            <WeatherCard
              key={index}
              dayData={{ ...item, startTime: item.time }}
              locationName={locationName}
              interval={timesteps}
            />
          ))}
        </div>
      )}

      {weatherQuery.isSuccess &&
        (!forecastData || forecastData.length === 0) && (
          <div className="text-center text-muted-foreground mt-8">
            No forecast data available for the selected location and timeframe.
          </div>
        )}
    </div>
  );
};
