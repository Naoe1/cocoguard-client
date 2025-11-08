import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useWeatherForecast } from '../api/GetWeather';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockGeocodeResponse = {
  data: {
    results: [
      {
        latitude: 14.5995,
        longitude: 120.9842,
        name: 'Manila',
        admin1: 'Metro Manila',
        country: 'Philippines',
      },
    ],
  },
};

const mockForecastDailyResponse = {
  data: {
    daily: {
      time: ['2024-01-01'],
      temperature_2m_min: [20.0],
      temperature_2m_max: [30.0],
      precipitation_probability_mean: [30],
      wind_speed_10m_mean: [5.2],
      relative_humidity_2m_mean: [75],
      sunrise: ['2024-01-01T06:00:00Z'],
      sunset: ['2024-01-01T18:00:00Z'],
      weather_code: [0],
    },
  },
};

const mockForecastHourlyResponse = {
  data: {
    hourly: {
      time: ['2024-01-01T12:00:00Z'],
      temperature_2m: [28.0],
      relative_humidity_2m: [70],
      precipitation_probability: [20],
      wind_speed_10m: [4.8],
      weather_code: [2],
    },
  },
};

describe('useWeatherForecast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches weather data successfully', async () => {
    // First call: geocoding; Second call: forecast daily
    mockedAxios.get
      .mockResolvedValueOnce(mockGeocodeResponse)
      .mockResolvedValueOnce(mockForecastDailyResponse);

    const { result } = renderHook(
      () => useWeatherForecast({ location: 'Manila', timesteps: '1d' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert geocoding request
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      1,
      GEOCODE_URL,
      expect.objectContaining({
        params: expect.objectContaining({
          name: 'Manila',
          count: 1,
          language: 'en',
          format: 'json',
        }),
      }),
    );

    // Assert forecast request
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      FORECAST_URL,
      expect.objectContaining({
        params: expect.objectContaining({
          latitude: 14.5995,
          longitude: 120.9842,
          daily: expect.stringContaining('temperature_2m_max'),
          timezone: 'auto',
        }),
      }),
    );

    // Data normalized shape
    expect(result.current.data).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          location: expect.objectContaining({
            name: expect.stringContaining('Manila'),
          }),
          timelines: expect.objectContaining({
            daily: [
              expect.objectContaining({
                time: '2024-01-01',
                values: expect.objectContaining({
                  temperatureAvg: 25,
                  temperatureMin: 20,
                  temperatureMax: 30,
                  precipitationProbabilityAvg: 30,
                  windSpeedAvg: 5.2,
                  humidityAvg: 75,
                }),
              }),
            ],
          }),
        }),
      }),
    );
  });

  it('uses default location when none provided', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockGeocodeResponse)
      .mockResolvedValueOnce(mockForecastDailyResponse);

    const { result } = renderHook(() => useWeatherForecast({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Should geocode default "Manila"
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      1,
      GEOCODE_URL,
      expect.objectContaining({
        params: expect.objectContaining({ name: 'Manila' }),
      }),
    );
  });

  it('handles API errors', async () => {
    const errorMessage = 'Forecast failed';
    // Geocode succeeds, forecast fails
    mockedAxios.get
      .mockResolvedValueOnce(mockGeocodeResponse)
      .mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(
      () => useWeatherForecast({ location: 'InvalidLocation' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe(errorMessage);
  });

  it('uses custom query configuration', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockGeocodeResponse)
      .mockResolvedValueOnce(mockForecastDailyResponse);

    const customConfig = {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    };

    const { result } = renderHook(
      () =>
        useWeatherForecast({
          location: 'Manila',
          queryConfig: customConfig,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The hook should still work with custom config
    expect(result.current.data).toEqual(
      expect.objectContaining({ data: expect.any(Object) }),
    );
  });

  it('creates correct query key', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          results: [
            {
              latitude: 35.6762,
              longitude: 139.6503,
              name: 'Tokyo',
              admin1: 'Tokyo',
              country: 'Japan',
            },
          ],
        },
      })
      .mockResolvedValueOnce(mockForecastHourlyResponse);

    const { result } = renderHook(
      () => useWeatherForecast({ location: 'Tokyo', timesteps: '1h' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Forecast should request hourly parameters, not daily
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      FORECAST_URL,
      expect.objectContaining({
        params: expect.objectContaining({
          hourly: expect.stringContaining('temperature_2m'),
        }),
      }),
    );
  });
});
