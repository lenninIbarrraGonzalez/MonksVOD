import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock import.meta.env before importing the hook
vi.stubGlobal('import.meta', { env: {} });

import { useWeather } from '../../hooks/useWeather';

describe('useWeather', () => {
  const mockWeatherResponse = {
    coord: { lon: -3.7026, lat: 40.4165 },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    base: 'stations',
    main: {
      temp: 22.5,
      feels_like: 21.8,
      temp_min: 20.0,
      temp_max: 24.0,
      pressure: 1013,
      humidity: 65,
    },
    wind: {
      speed: 3.5, // m/s
      deg: 180,
    },
    clouds: { all: 0 },
    dt: 1635000000,
    sys: {
      type: 2,
      id: 2004296,
      country: 'ES',
      sunrise: 1634968800,
      sunset: 1635007200,
    },
    timezone: 3600,
    id: 3117735,
    name: 'Madrid',
    cod: 200,
  };

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key');
    vi.stubEnv('VITE_WEATHER_CITY', 'Madrid');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Successful Data Fetching', () => {
    it('should fetch weather data successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const { result } = renderHook(() => useWeather());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.weather).toEqual({
        temperature: 23, // Rounded
        feelsLike: 22, // Rounded
        condition: 'Clear',
        description: 'clear sky',
        humidity: 65,
        windSpeed: 13, // 3.5 m/s * 3.6 = 12.6, rounded to 13
        city: 'Madrid',
        country: 'ES',
        icon: '01d',
        timestamp: 1635000000,
      });
      expect(result.current.error).toBeNull();
    });

    it('should round temperature correctly', async () => {
      const response = {
        ...mockWeatherResponse,
        main: {
          ...mockWeatherResponse.main,
          temp: 22.7,
          feels_like: 22.3,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(result.current.weather?.temperature).toBe(23);
        expect(result.current.weather?.feelsLike).toBe(22);
      });
    });

    it('should convert wind speed from m/s to km/h', async () => {
      const response = {
        ...mockWeatherResponse,
        wind: { speed: 5.0, deg: 180 },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => response,
      });

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        // 5.0 m/s * 3.6 = 18 km/h
        expect(result.current.weather?.windSpeed).toBe(18);
      });
    });
  });


  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(result.current.error).toBe('Weather API error: 401');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.weather).toBeNull();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network connection failed')
      );

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(result.current.error).toBe('Network connection failed');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle JSON parsing errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid JSON');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as any).mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch weather');
      });
    });
  });

  describe('Auto-refresh', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-refresh every 10 minutes', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      renderHook(() => useWeather());

      // Initial call
      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Fast-forward 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000);

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      // Fast-forward another 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000);

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });

    it('should clear interval on unmount', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const { unmount } = renderHook(() => useWeather());

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Fast-forward 10 minutes
      vi.advanceTimersByTime(10 * 60 * 1000);

      // Should not fetch again after unmount
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manual Refetch', () => {
    it('should allow manual refetch', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const { result } = renderHook(() => useWeather());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Manual refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should update loading state during manual refetch', async () => {
      let resolvePromise: any;
      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = () =>
              resolve({
                ok: true,
                json: async () => mockWeatherResponse,
              });
          })
      );

      const { result } = renderHook(() => useWeather());

      // Resolve initial fetch
      resolvePromise();
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Manual refetch
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      resolvePromise();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('API Request', () => {
    it('should use default city when not specified', async () => {
      vi.stubEnv('VITE_WEATHER_CITY', undefined);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      renderHook(() => useWeather());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('q=Madrid')
        );
      });
    });
  });
});
