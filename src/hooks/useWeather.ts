import { useState, useEffect, useCallback } from 'react';
import type {
  WeatherData,
  WeatherAPIResponse,
  UseWeatherReturn,
} from '../types/widgets.types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEFAULT_CITY = import.meta.env.VITE_WEATHER_CITY || 'Madrid';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!API_KEY || API_KEY === 'demo_key_replace_with_real_key') {
      setError('API key not configured. Please add VITE_OPENWEATHER_API_KEY to .env');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherAPIResponse = await response.json();

      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        city: data.name,
        country: data.sys.country,
        icon: data.weather[0].icon,
        timestamp: data.dt,
      };

      setWeather(weatherData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchWeather();

    const interval = setInterval(() => {
      fetchWeather();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weather,
    isLoading,
    error,
    refetch: fetchWeather,
  };
}
