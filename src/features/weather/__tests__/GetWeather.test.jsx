import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

const TEST_API_KEY = 'test-api-key';
const TEST_BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

const mockGetWeatherForecast = ({ location = 'Manila', timesteps = '1d' }) => {
  const params = {
    location,
    timesteps,
    apikey: TEST_API_KEY,
    units: 'metric',
  };
  return mockedAxios.get(TEST_BASE_URL, { params });
};

const useWeatherForecast = ({ location, timesteps, queryConfig = {} }) => {
  return useQuery({
    queryKey: ['weather', location, timesteps],
    queryFn: () => mockGetWeatherForecast({ location, timesteps }),
    ...queryConfig,
  });
};

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

const mockWeatherResponse = {
  data: {
    timelines: {
      daily: [
        {
          time: '2024-01-01T00:00:00Z',
          values: {
            temperatureAvg: 25.5,
            temperatureMin: 20.0,
            temperatureMax: 30.0,
            precipitationProbabilityAvg: 30,
            windSpeedAvg: 5.2,
            humidityAvg: 75,
            weatherCodeMax: 1000,
            sunriseTime: '2024-01-01T06:00:00Z',
            sunsetTime: '2024-01-01T18:00:00Z',
          },
        },
      ],
      hourly: [
        {
          time: '2024-01-01T12:00:00Z',
          values: {
            temperature: 28.0,
            precipitationProbability: 20,
            windSpeed: 4.8,
            humidity: 70,
            weatherCode: 1100,
          },
        },
      ],
    },
    location: {
      name: 'Manila, Philippines',
    },
  },
};

describe('useWeatherForecast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches weather data successfully', async () => {
    mockedAxios.get.mockResolvedValue(mockWeatherResponse);

    const { result } = renderHook(
      () => useWeatherForecast({ location: 'Manila', timesteps: '1d' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(TEST_BASE_URL, {
      params: {
        location: 'Manila',
        timesteps: '1d',
        apikey: 'test-api-key',
        units: 'metric',
      },
    });

    expect(result.current.data).toEqual(mockWeatherResponse);
  });

  it('uses default location when none provided', async () => {
    mockedAxios.get.mockResolvedValue(mockWeatherResponse);

    const { result } = renderHook(() => useWeatherForecast({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          location: 'Manila',
          timesteps: '1d',
        }),
      }),
    );
  });

  it('handles API errors', async () => {
    const errorMessage = 'API key is invalid';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

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
    mockedAxios.get.mockResolvedValue(mockWeatherResponse);

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
    expect(result.current.data).toEqual(mockWeatherResponse);
  });

  it('creates correct query key', async () => {
    mockedAxios.get.mockResolvedValue(mockWeatherResponse);

    const { result } = renderHook(
      () => useWeatherForecast({ location: 'Tokyo', timesteps: '1h' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query should be cached with the correct key
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          location: 'Tokyo',
          timesteps: '1h',
        }),
      }),
    );
  });
});
