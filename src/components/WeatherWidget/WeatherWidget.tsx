import { useWeather } from '../../hooks/useWeather';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNightClear,
  WiHumidity,
  WiStrongWind,
} from 'react-icons/wi';
import { BiRefresh, BiError } from 'react-icons/bi';

export function WeatherWidget() {
  const { weather, isLoading, error, refetch } = useWeather();

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, icon: string) => {
    const isNight = icon.includes('n');
    const iconClass = 'w-16 h-16';

    switch (condition.toLowerCase()) {
      case 'clear':
        return isNight ? (
          <WiNightClear className={iconClass} />
        ) : (
          <WiDaySunny className={iconClass} />
        );
      case 'clouds':
        return <WiCloudy className={iconClass} />;
      case 'rain':
      case 'drizzle':
        return <WiRain className={iconClass} />;
      case 'snow':
        return <WiSnow className={iconClass} />;
      case 'thunderstorm':
        return <WiThunderstorm className={iconClass} />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <WiFog className={iconClass} />;
      default:
        return <WiDaySunny className={iconClass} />;
    }
  };

  if (error) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BiError className="w-5 h-5 text-red-500" />
            Weather Error
          </h3>
          <button
            onClick={refetch}
            className="btn-icon"
            aria-label="Retry"
          >
            <BiRefresh className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-monks-gray-light">{error}</p>
      </div>
    );
  }

  if (isLoading || !weather) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-monks-purple/20 rounded w-32 animate-pulse" />
          <div className="w-8 h-8 bg-monks-purple/20 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-monks-purple/20 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-monks-purple/20 rounded w-24 animate-pulse" />
            <div className="h-4 bg-monks-purple/20 rounded w-32 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-12 bg-monks-purple/20 rounded animate-pulse" />
          <div className="h-12 bg-monks-purple/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 animate-fade-in hover:bg-monks-purple/5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🌤️</span>
          Weather
        </h3>
        <button
          onClick={refetch}
          className="btn-icon hover:rotate-180 transition-transform duration-500"
          aria-label="Refresh weather"
        >
          <BiRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-monks-purple-light">
          {getWeatherIcon(weather.condition, weather.icon)}
        </div>
        <div>
          <div className="text-4xl font-bold text-white">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-monks-gray-light capitalize">
            {weather.description}
          </div>
          <div className="text-xs text-monks-gray-light mt-1">
            {weather.city}, {weather.country}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-monks-blue/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-monks-blue-sky mb-1">
            <WiHumidity className="w-5 h-5" />
            <span className="text-xs font-medium">Humidity</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {weather.humidity}%
          </div>
        </div>
        <div className="bg-monks-blue/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-monks-blue-sky mb-1">
            <WiStrongWind className="w-5 h-5" />
            <span className="text-xs font-medium">Wind</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {weather.windSpeed} km/h
          </div>
        </div>
      </div>

      {/* Feels Like */}
      <div className="mt-3 text-xs text-monks-gray-light text-center">
        Feels like {weather.feelsLike}°C
      </div>
    </div>
  );
}
