import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVideoControls } from '../../hooks/useVideoControls';
import type { RefObject } from 'react';

describe('useVideoControls', () => {
  let mockVideo: Partial<HTMLVideoElement>;
  let videoRef: RefObject<HTMLVideoElement>;

  beforeEach(() => {
    mockVideo = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      paused: true,
      volume: 0.5,
      muted: false,
      currentTime: 0,
      requestFullscreen: vi.fn().mockResolvedValue(undefined),
      requestPictureInPicture: vi.fn().mockResolvedValue(undefined),
    };

    videoRef = { current: mockVideo as HTMLVideoElement };
  });

  it('should toggle play when video is paused', async () => {
    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    await result.current.togglePlay();

    expect(mockVideo.play).toHaveBeenCalled();
  });

  it('should toggle pause when video is playing', () => {
    Object.defineProperty(mockVideo, 'paused', { value: false, writable: true });
    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    result.current.togglePlay();

    expect(mockVideo.pause).toHaveBeenCalled();
  });

  it('should set volume correctly', () => {
    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    result.current.setVolume(0.8);

    expect(mockVideo.volume).toBe(0.8);
  });

  it('should clamp volume between 0 and 1', () => {
    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    result.current.setVolume(1.5);
    expect(mockVideo.volume).toBe(1);

    result.current.setVolume(-0.5);
    expect(mockVideo.volume).toBe(0);
  });

  it('should toggle mute', () => {
    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    result.current.toggleMute();

    expect(mockVideo.muted).toBe(true);
  });

  it('should seek to specified time', () => {
    const onTimeUpdate = vi.fn();
    const { result } = renderHook(() =>
      useVideoControls({ videoRef, onTimeUpdate })
    );

    result.current.seek(30);

    expect(mockVideo.currentTime).toBe(30);
    expect(onTimeUpdate).toHaveBeenCalledWith(30);
  });

  it('should enter fullscreen when not in fullscreen', async () => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    await result.current.toggleFullscreen();

    expect(mockVideo.requestFullscreen).toHaveBeenCalled();
  });

  it('should exit fullscreen when already in fullscreen', async () => {
    const mockExitFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'fullscreenElement', {
      value: mockVideo,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, 'exitFullscreen', {
      value: mockExitFullscreen,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    await result.current.toggleFullscreen();

    expect(mockExitFullscreen).toHaveBeenCalled();
  });

  it('should toggle picture-in-picture when enabled', async () => {
    Object.defineProperty(document, 'pictureInPictureElement', {
      value: null,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      value: true,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useVideoControls({ videoRef })
    );

    await result.current.togglePiP();

    expect(mockVideo.requestPictureInPicture).toHaveBeenCalled();
  });

  it('should handle null video ref gracefully', () => {
    const nullVideoRef = { current: null };
    const { result } = renderHook(() =>
      useVideoControls({ videoRef: nullVideoRef })
    );

    // None of these should throw errors
    expect(() => result.current.togglePlay()).not.toThrow();
    expect(() => result.current.play()).not.toThrow();
    expect(() => result.current.pause()).not.toThrow();
    expect(() => result.current.seek(10)).not.toThrow();
    expect(() => result.current.setVolume(0.5)).not.toThrow();
    expect(() => result.current.toggleMute()).not.toThrow();
    expect(() => result.current.toggleFullscreen()).not.toThrow();
    expect(() => result.current.togglePiP()).not.toThrow();
  });
});
