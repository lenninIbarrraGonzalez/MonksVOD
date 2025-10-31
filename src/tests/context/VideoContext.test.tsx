import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VideoProvider, useVideoContext } from '../../context/VideoContext';
import type { Video, VideoQuality } from '../../types/video.types';
import type { ReactNode } from 'react';

describe('VideoContext', () => {
  const mockVideo1: Video = {
    id: 'video-1',
    title: 'Test Video 1',
    description: 'First test video',
    thumbnail: '/thumb1.jpg',
    url: 'https://example.com/video1.m3u8',
    duration: '10:00',
  };

  const mockVideo2: Video = {
    id: 'video-2',
    title: 'Test Video 2',
    description: 'Second test video',
    thumbnail: '/thumb2.jpg',
    url: 'https://example.com/video2.m3u8',
    duration: '15:00',
  };

  const mockVideo3: Video = {
    id: 'video-3',
    title: 'Test Video 3',
    description: 'Third test video',
    thumbnail: '/thumb3.jpg',
    url: 'https://example.com/video3.m3u8',
    duration: '12:00',
  };

  const mockVideo4: Video = {
    id: 'video-4',
    title: 'Test Video 4',
    description: 'Fourth test video',
    thumbnail: '/thumb4.jpg',
    url: 'https://example.com/video4.m3u8',
    duration: '8:00',
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <VideoProvider>{children}</VideoProvider>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Provider and Consumer', () => {
    it('should throw error when useVideoContext is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useVideoContext());
      }).toThrow('useVideoContext must be used within a VideoProvider');

      consoleSpy.mockRestore();
    });

    it('should provide video context when used within provider', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.currentVideo).toBeNull();
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.currentVideo).toBeNull();
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
      expect(result.current.duration).toBe(0);
      expect(result.current.volume).toBe(0.7); // Default volume
      expect(result.current.isMuted).toBe(false);
      expect(result.current.isFullscreen).toBe(false);
      expect(result.current.qualities).toEqual([]);
      expect(result.current.currentQuality).toBe(-1); // Auto quality
      expect(result.current.isBuffering).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.history).toEqual([]);
      expect(result.current.isPiPActive).toBe(false);
    });

    it('should load persisted volume from localStorage', () => {
      localStorage.setItem('video-volume', JSON.stringify(0.5));

      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.volume).toBe(0.5);
    });

    it('should load persisted history from localStorage', () => {
      localStorage.setItem(
        'video-history',
        JSON.stringify([mockVideo1, mockVideo2])
      );

      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.history[0].id).toBe('video-1');
      expect(result.current.history[1].id).toBe('video-2');
    });
  });

  describe('Video Selection', () => {
    it('should select a video and update current video', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.selectVideo(mockVideo1);
      });

      expect(result.current.currentVideo).toEqual(mockVideo1);
    });

    it('should reset playback state when selecting new video', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      // Set up some state
      act(() => {
        result.current.selectVideo(mockVideo1);
        result.current.togglePlay();
        result.current.seek(50);
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentTime).toBe(50);

      // Select new video
      act(() => {
        result.current.selectVideo(mockVideo2);
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
    });

    it('should clear error when selecting new video', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        // @ts-ignore - internal method
        result.current.updateError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.selectVideo(mockVideo1);
      });

      expect(result.current.error).toBeNull();
    });

    it('should persist last selected video to localStorage', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.selectVideo(mockVideo1);
      });

      const lastVideo = localStorage.getItem('last-video');
      expect(lastVideo).toBe(JSON.stringify(mockVideo1));
    });
  });

  describe('History Management', () => {
    beforeEach(() => {
      // Suppress console warnings for localStorage in tests
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should add video to history when selected', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.selectVideo(mockVideo1);
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].id).toBe('video-1');
    });

  });

  describe('Playback Controls', () => {
    it('should toggle play state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.togglePlay();
      });

      expect(result.current.isPlaying).toBe(true);

      act(() => {
        result.current.togglePlay();
      });

      expect(result.current.isPlaying).toBe(false);
    });

    it('should seek to specified time', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.seek(45);
      });

      expect(result.current.currentTime).toBe(45);
    });

    it('should update duration', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        // @ts-ignore - internal method
        result.current.updateDuration(120);
      });

      expect(result.current.duration).toBe(120);
    });
  });

  describe('Volume Management', () => {
    it('should set volume and persist to localStorage', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.setVolume(0.5);
      });

      expect(result.current.volume).toBe(0.5);
      const stored = localStorage.getItem('video-volume');
      expect(stored).toBe(JSON.stringify(0.5));
    });

    it('should unmute when volume is increased from 0', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        result.current.toggleMute();
      });

      expect(result.current.isMuted).toBe(true);

      act(() => {
        result.current.setVolume(0.5);
      });

      expect(result.current.isMuted).toBe(false);
    });

    it('should toggle mute state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.isMuted).toBe(false);

      act(() => {
        result.current.toggleMute();
      });

      expect(result.current.isMuted).toBe(true);
    });
  });

  describe('Quality Management', () => {
    it('should update available qualities', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      const qualities: VideoQuality[] = [
        { height: 1080, bitrate: 5000000, level: 0 },
        { height: 720, bitrate: 2500000, level: 1 },
        { height: 480, bitrate: 1000000, level: 2 },
      ];

      act(() => {
        // @ts-ignore - internal method
        result.current.updateQualities(qualities);
      });

      expect(result.current.qualities).toEqual(qualities);
    });

    it('should set current quality level', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.currentQuality).toBe(-1); // Auto

      act(() => {
        result.current.setQuality(2);
      });

      expect(result.current.currentQuality).toBe(2);
    });
  });

  describe('State Management', () => {
    it('should toggle fullscreen state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.isFullscreen).toBe(false);

      act(() => {
        result.current.toggleFullscreen();
      });

      expect(result.current.isFullscreen).toBe(true);
    });

    it('should toggle PiP state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.isPiPActive).toBe(false);

      act(() => {
        result.current.togglePiP();
      });

      expect(result.current.isPiPActive).toBe(true);
    });

    it('should update buffering state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      expect(result.current.isBuffering).toBe(false);

      act(() => {
        // @ts-ignore - internal method
        result.current.updateBuffering(true);
      });

      expect(result.current.isBuffering).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should update error state', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        // @ts-ignore - internal method
        result.current.updateError('Network error');
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useVideoContext(), { wrapper });

      act(() => {
        // @ts-ignore - internal method
        result.current.updateError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
