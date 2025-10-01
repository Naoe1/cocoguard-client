import { describe, it, expect } from 'vitest';
import { getWeatherCodeIcon } from '../utils/weatherIcons';
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

describe('getWeatherCodeIcon', () => {
  it('returns Sun icon for clear/sunny codes', () => {
    expect(getWeatherCodeIcon(0)).toBe(Sun);
    expect(getWeatherCodeIcon(1000)).toBe(Sun);
  });

  it('returns CloudSun icon for partly cloudy codes', () => {
    expect(getWeatherCodeIcon(1100)).toBe(CloudSun);
    expect(getWeatherCodeIcon(1101)).toBe(CloudSun);
  });

  it('returns Cloud icon for cloudy codes', () => {
    expect(getWeatherCodeIcon(1102)).toBe(Cloud);
    expect(getWeatherCodeIcon(1001)).toBe(Cloud);
  });

  it('returns CloudFog icon for fog codes', () => {
    expect(getWeatherCodeIcon(2000)).toBe(CloudFog);
    expect(getWeatherCodeIcon(2100)).toBe(CloudFog);
  });

  it('returns CloudDrizzle icon for drizzle codes', () => {
    expect(getWeatherCodeIcon(4000)).toBe(CloudDrizzle);
  });

  it('returns CloudRain icon for rain codes', () => {
    expect(getWeatherCodeIcon(4001)).toBe(CloudRain);
    expect(getWeatherCodeIcon(4200)).toBe(CloudRain);
  });

  it('returns CloudRainWind icon for heavy rain codes', () => {
    expect(getWeatherCodeIcon(4201)).toBe(CloudRainWind);
  });

  it('returns CloudSnow icon for snow codes', () => {
    expect(getWeatherCodeIcon(5000)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(5001)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(5100)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(5101)).toBe(CloudSnow);
  });

  it('returns ThermometerSnowflake icon for freezing codes', () => {
    expect(getWeatherCodeIcon(6000)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(6001)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(6200)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(6201)).toBe(ThermometerSnowflake);
  });

  it('returns CloudSnow icon for ice pellet codes', () => {
    expect(getWeatherCodeIcon(7000)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(7101)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(7102)).toBe(CloudSnow);
  });

  it('returns CloudLightning icon for thunderstorm codes', () => {
    expect(getWeatherCodeIcon(8000)).toBe(CloudLightning);
  });

  it('returns default Cloud icon for unknown codes', () => {
    expect(getWeatherCodeIcon(9999)).toBe(Cloud);
    expect(getWeatherCodeIcon(-1)).toBe(Cloud);
    expect(getWeatherCodeIcon(null)).toBe(Cloud);
    expect(getWeatherCodeIcon(undefined)).toBe(Cloud);
  });

  it('handles string weather codes', () => {
    expect(getWeatherCodeIcon('1000')).toBe(Sun);
    expect(getWeatherCodeIcon('4001')).toBe(CloudRain);
  });

  it('handles edge cases gracefully', () => {
    expect(getWeatherCodeIcon(0)).toBe(Sun);
    expect(getWeatherCodeIcon('')).toBe(Cloud);
    expect(getWeatherCodeIcon(false)).toBe(Cloud);
    expect(getWeatherCodeIcon(true)).toBe(Cloud);
  });
});
