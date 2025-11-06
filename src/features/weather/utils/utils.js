export function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function avg(arr) {
  const nums = arr.filter((x) => typeof x === 'number');
  if (nums.length === 0) return undefined;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function parseLocationInput(input) {
  if (!input || typeof input !== 'string') return null;
  const coordMatch = input
    .trim()
    .match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordMatch) {
    const latitude = parseFloat(coordMatch[1]);
    const longitude = parseFloat(coordMatch[2]);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude, name: `${latitude}, ${longitude}` };
    }
  }
  return null;
}

export function normalizeDaily(data) {
  const daily = data?.daily;
  if (!daily || !daily.time) return [];

  const times = daily.time;
  const out = [];
  for (let i = 0; i < times.length; i++) {
    const temperatureMin = toNumber(daily.temperature_2m_min?.[i]);
    const temperatureMax = toNumber(daily.temperature_2m_max?.[i]);
    const temperatureAvg = avg([temperatureMin, temperatureMax]);
    const precipitationProbabilityAvg = toNumber(
      daily.precipitation_probability_mean?.[i],
    );
    const windSpeedAvg = toNumber(daily.wind_speed_10m_mean?.[i]);
    const humidityAvg = toNumber(daily.relative_humidity_2m_mean?.[i]);
    const sunriseTime = daily.sunrise?.[i] || null;
    const sunsetTime = daily.sunset?.[i] || null;
    const weatherCodeMax = toNumber(daily.weather_code?.[i]);

    out.push({
      time: times[i],
      values: {
        temperatureAvg,
        temperatureMin,
        temperatureMax,
        precipitationProbabilityAvg,
        windSpeedAvg,
        humidityAvg,
        sunriseTime,
        sunsetTime,
        weatherCodeMax,
      },
    });
  }
  return out;
}

export function normalizeHourly(data) {
  const hourly = data?.hourly;
  if (!hourly || !hourly.time) return [];

  const times = hourly.time;
  const out = [];
  for (let i = 0; i < times.length; i++) {
    out.push({
      time: times[i],
      values: {
        temperature: toNumber(hourly.temperature_2m?.[i]),
        humidity: toNumber(hourly.relative_humidity_2m?.[i]),
        precipitationProbability: toNumber(
          hourly.precipitation_probability?.[i],
        ),
        windSpeed: toNumber(hourly.wind_speed_10m?.[i]),
        weatherCode: toNumber(hourly.weather_code?.[i]),
      },
    });
  }
  return out;
}
