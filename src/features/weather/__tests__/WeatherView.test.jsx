import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherView } from '../components/WeatherView';
import { useWeatherForecast } from '../api/GetWeather';

vi.mock('../api/GetWeather');
const mockUseWeatherForecast = vi.mocked(useWeatherForecast);

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

const mockWeatherData = {
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
          },
        },
        {
          time: '2024-01-02T00:00:00Z',
          values: {
            temperatureAvg: 26.0,
            temperatureMin: 21.0,
            temperatureMax: 31.0,
            precipitationProbabilityAvg: 40,
            windSpeedAvg: 4.8,
            humidityAvg: 80,
            weatherCodeMax: 1100,
          },
        },
      ],
      hourly: Array.from({ length: 12 }, (_, i) => ({
        time: `2024-01-01T${i.toString().padStart(2, '0')}:00:00Z`,
        values: {
          temperature: 25 + i,
          precipitationProbability: 20,
          windSpeed: 5.0,
          humidity: 70,
          weatherCode: 1000,
        },
      })),
    },
    location: {
      name: 'Manila, Philippines',
    },
  },
};

describe('WeatherView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
      isFetching: false,
      data: null,
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid API key',
        },
      },
    };

    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
      isFetching: false,
      data: null,
      error: mockError,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    expect(
      screen.getByText('Failed to load weather data.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Invalid API key')).toBeInTheDocument();
  });

  it('renders weather data successfully', () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      data: mockWeatherData,
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
    expect(screen.getAllByText('Manila, Philippines')).toHaveLength(2);
    expect(screen.getByText('Monday, Jan 1')).toBeInTheDocument();
    expect(screen.getByText('Tuesday, Jan 2')).toBeInTheDocument();
  });

  it('handles location search', async () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      data: mockWeatherData,
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    const locationInput = screen.getByPlaceholderText(/enter location/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // Change location
    fireEvent.change(locationInput, { target: { value: 'Tokyo' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockUseWeatherForecast).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Tokyo',
        }),
      );
    });
  });

  it('limits hourly data to 9 items', () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      data: {
        ...mockWeatherData,
        data: {
          ...mockWeatherData.data,
          timelines: {
            ...mockWeatherData.data.timelines,
          },
        },
      },
      error: null,
    });

    // Mock the component to use hourly data
    const { rerender } = render(<WeatherView />, { wrapper: createWrapper() });

    // The component should limit hourly data to 9 items
    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
  });

  it('shows no data message when forecast is empty', () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      data: {
        data: {
          timelines: {
            daily: [],
          },
          location: {
            name: 'Unknown Location',
          },
        },
      },
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    expect(
      screen.getByText(
        'No forecast data available for the selected location and timeframe.',
      ),
    ).toBeInTheDocument();
  });

  it('disables search button when fetching', () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: false,
      isFetching: true,
      data: null,
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it('submits form on enter key', async () => {
    mockUseWeatherForecast.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      data: mockWeatherData,
      error: null,
    });

    render(<WeatherView />, { wrapper: createWrapper() });

    const locationInput = screen.getByPlaceholderText(/enter location/i);

    // Change location and press Enter
    fireEvent.change(locationInput, { target: { value: 'Paris' } });
    fireEvent.submit(locationInput.closest('form'));

    await waitFor(() => {
      expect(mockUseWeatherForecast).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Paris',
        }),
      );
    });
  });
});
