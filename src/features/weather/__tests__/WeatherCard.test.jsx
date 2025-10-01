import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../components/WeatherCard';

const mockDailyData = {
  startTime: '2024-01-01T00:00:00Z',
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
};

const mockHourlyData = {
  startTime: '2024-01-01T12:00:00Z',
  values: {
    temperature: 28.0,
    precipitationProbability: 20,
    windSpeed: 4.8,
    humidity: 70,
    weatherCode: 1100,
  },
};

describe('WeatherCard', () => {
  it('renders daily weather data correctly', () => {
    render(
      <WeatherCard
        dayData={mockDailyData}
        locationName="Manila, Philippines"
        interval="daily"
      />,
    );

    // Check if location name is displayed
    expect(screen.getByText('Manila, Philippines')).toBeInTheDocument();

    // Check if temperature is displayed
    expect(screen.getByText('25.5°C')).toBeInTheDocument();

    // Check if min/max temperatures are shown for daily
    expect(screen.getByText(/Min: 20.0°/)).toBeInTheDocument();
    expect(screen.getByText(/Max: 30.0°/)).toBeInTheDocument();

    // Check if precipitation is displayed
    expect(screen.getByText('Precip: 30%')).toBeInTheDocument();

    // Check if wind speed is displayed
    expect(screen.getByText('Wind: 5.2 m/s')).toBeInTheDocument();

    // Check if humidity is displayed
    expect(screen.getByText('Humidity: 75%')).toBeInTheDocument();

    // Check if sunrise/sunset times are displayed for daily
    expect(screen.getByText(/Sunrise:/)).toBeInTheDocument();
    expect(screen.getByText(/Sunset:/)).toBeInTheDocument();
  });

  it('renders hourly weather data correctly', () => {
    render(
      <WeatherCard
        dayData={mockHourlyData}
        locationName="Tokyo, Japan"
        interval="hourly"
      />,
    );

    // Check if location name is displayed
    expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();

    // Check if temperature is displayed (no avg for hourly)
    expect(screen.getByText('28.0°C')).toBeInTheDocument();

    // Min/max should not be shown for hourly
    expect(screen.queryByText(/Min:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Max:/)).not.toBeInTheDocument();

    // Check if precipitation is displayed
    expect(screen.getByText('Precip: 20%')).toBeInTheDocument();

    // Check if wind speed is displayed
    expect(screen.getByText('Wind: 4.8 m/s')).toBeInTheDocument();

    // Check if humidity is displayed
    expect(screen.getByText('Humidity: 70%')).toBeInTheDocument();

    // Sunrise/sunset should not be shown for hourly
    expect(screen.queryByText(/Sunrise:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sunset:/)).not.toBeInTheDocument();
  });

  it('formats daily date correctly', () => {
    render(
      <WeatherCard
        dayData={mockDailyData}
        locationName="Manila"
        interval="daily"
      />,
    );

    // Should show weekday format for daily
    const dateElement = screen.getByText(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
    );
    expect(dateElement).toBeInTheDocument();
  });

  it('formats hourly time correctly', () => {
    render(
      <WeatherCard
        dayData={mockHourlyData}
        locationName="Manila"
        interval="hourly"
      />,
    );

    // Should show time format for hourly (like "12:00 PM")
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const incompleteData = {
      startTime: '2024-01-01T00:00:00Z',
      values: {
        temperatureAvg: 25.5,
        // Missing other values
      },
    };

    render(
      <WeatherCard
        dayData={incompleteData}
        locationName="Test Location"
        interval="daily"
      />,
    );

    // Should still render without crashing
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
  });

  it('handles null/undefined values gracefully', () => {
    const dataWithNulls = {
      startTime: '2024-01-01T00:00:00Z',
      values: {
        temperatureAvg: null,
        precipitationProbabilityAvg: undefined,
        windSpeedAvg: 0,
        humidityAvg: 50,
      },
    };

    render(
      <WeatherCard
        dayData={dataWithNulls}
        locationName="Test Location"
        interval="daily"
      />,
    );

    // Should handle null/undefined gracefully
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('Wind: 0.0 m/s')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 50%')).toBeInTheDocument();
  });
});
