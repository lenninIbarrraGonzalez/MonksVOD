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
});
