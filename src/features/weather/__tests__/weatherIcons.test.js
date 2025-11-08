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
  it('returns Sun icon for clear sky (0)', () => {
    expect(getWeatherCodeIcon(0)).toBe(Sun);
  });

  it('returns CloudSun for mainly/partly cloudy (1-2)', () => {
    expect(getWeatherCodeIcon(1)).toBe(CloudSun);
    expect(getWeatherCodeIcon(2)).toBe(CloudSun);
  });

  it('returns Cloud for overcast (3)', () => {
    expect(getWeatherCodeIcon(3)).toBe(Cloud);
  });

  it('returns CloudFog for fog codes (45, 48)', () => {
    expect(getWeatherCodeIcon(45)).toBe(CloudFog);
    expect(getWeatherCodeIcon(48)).toBe(CloudFog);
  });

  it('returns CloudDrizzle for drizzle (51-55)', () => {
    expect(getWeatherCodeIcon(51)).toBe(CloudDrizzle);
    expect(getWeatherCodeIcon(53)).toBe(CloudDrizzle);
    expect(getWeatherCodeIcon(55)).toBe(CloudDrizzle);
  });

  it('returns ThermometerSnowflake for freezing drizzle/rain (56,57,66,67)', () => {
    expect(getWeatherCodeIcon(56)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(57)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(66)).toBe(ThermometerSnowflake);
    expect(getWeatherCodeIcon(67)).toBe(ThermometerSnowflake);
  });

  it('returns CloudRain for rain (61-65,80)', () => {
    expect(getWeatherCodeIcon(61)).toBe(CloudRain);
    expect(getWeatherCodeIcon(63)).toBe(CloudRain);
    expect(getWeatherCodeIcon(65)).toBe(CloudRain);
    expect(getWeatherCodeIcon(80)).toBe(CloudRain);
  });

  it('returns CloudRainWind for stronger showers (81-82)', () => {
    expect(getWeatherCodeIcon(81)).toBe(CloudRainWind);
    expect(getWeatherCodeIcon(82)).toBe(CloudRainWind);
  });

  it('returns CloudSnow for snow (71-77,85,86)', () => {
    expect(getWeatherCodeIcon(71)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(73)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(75)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(77)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(85)).toBe(CloudSnow);
    expect(getWeatherCodeIcon(86)).toBe(CloudSnow);
  });

  it('returns CloudLightning for thunderstorm (95,96,99)', () => {
    expect(getWeatherCodeIcon(95)).toBe(CloudLightning);
    expect(getWeatherCodeIcon(96)).toBe(CloudLightning);
    expect(getWeatherCodeIcon(99)).toBe(CloudLightning);
  });

  it('returns default Cloud for unknown/invalid codes', () => {
    expect(getWeatherCodeIcon(9999)).toBe(Cloud);
    expect(getWeatherCodeIcon(-1)).toBe(Cloud);
    expect(getWeatherCodeIcon(null)).toBe(Cloud);
    expect(getWeatherCodeIcon(undefined)).toBe(Cloud);
    expect(getWeatherCodeIcon('3')).toBe(Cloud); // strings not coerced
  });
});
