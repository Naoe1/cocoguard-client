import { WeatherView } from '@/features/weather/components/WeatherView';

export const WeatherRoute = () => {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <WeatherView />
      </div>
    </div>
  );
};
