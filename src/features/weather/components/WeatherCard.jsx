import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import {
  Thermometer,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  CloudRain,
} from 'lucide-react';
import { getWeatherCodeIcon } from '../utils/weatherIcons';

export const WeatherCard = ({ dayData, locationName, interval }) => {
  const { startTime, values } = dayData;

  const isDaily = interval === 'daily';
  const {
    temperature,
    precipitationProbability,
    windSpeed,
    humidity,
    weatherCode,
    temperatureAvg,
    temperatureMin,
    temperatureMax,
    precipitationProbabilityAvg,
    windSpeedAvg,
    humidityAvg,
    sunriseTime,
    sunsetTime,
    weatherCodeMax,
  } = values;

  const date = new Date(startTime);
  const formattedDateTime = isDaily
    ? date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

  const WeatherIcon = getWeatherCodeIcon(
    isDaily ? weatherCodeMax : weatherCode,
  );

  const displayTemp = isDaily ? temperatureAvg : temperature;
  const displayPrecip = isDaily
    ? precipitationProbabilityAvg
    : precipitationProbability;
  const displayWind = isDaily ? windSpeedAvg : windSpeed;
  const displayHumidity = isDaily ? humidityAvg : humidity;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{formattedDateTime}</CardTitle>
            <CardDescription>{locationName}</CardDescription>
          </div>
          {WeatherIcon && (
            <WeatherIcon className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm flex-grow">
        <div className="flex items-center gap-2 col-span-2 border-b pb-2 mb-1">
          <Thermometer className="h-5 w-5 text-red-500" />
          <span className="text-lg font-semibold">
            {displayTemp?.toFixed(1)}°C
          </span>
          {isDaily && (
            <span className="text-xs text-muted-foreground ml-auto">
              (Min: {temperatureMin?.toFixed(1)}° / Max:{' '}
              {temperatureMax?.toFixed(1)}°)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-blue-500" />
          <span className="font-medium">
            Precip: {displayPrecip?.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-gray-500" />
          <span>Wind: {displayWind?.toFixed(1)} m/s</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-cyan-500" />
          <span>Humidity: {displayHumidity?.toFixed(0)}%</span>
        </div>
        {isDaily && sunriseTime && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t">
            <Sunrise className="h-4 w-4 text-orange-400" />
            <span>
              Sunrise:{' '}
              {new Date(sunriseTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        {isDaily && sunsetTime && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t">
            <Sunset className="h-4 w-4 text-orange-600" />
            <span>
              Sunset:{' '}
              {new Date(sunsetTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        {!isDaily && <div className="col-span-2 mt-auto"></div>}
      </CardContent>
    </Card>
  );
};
