import { useCallback } from 'react';
import type { RefObject } from 'react';

interface UseVideoControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onVolumeChange?: (volume: number, isMuted: boolean) => void;
}

export function useVideoControls({
  videoRef,
  onTimeUpdate,
  onVolumeChange,
}: UseVideoControlsProps) {
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      video.pause();
    }
  }, [videoRef]);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(error => {
      console.error('Error playing video:', error);
    });
  }, [videoRef]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
  }, [videoRef]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [videoRef, onTimeUpdate]);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;

    if (onVolumeChange) {
      onVolumeChange(clampedVolume, video.muted);
    }
  }, [videoRef, onVolumeChange]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;

    if (onVolumeChange) {
      onVolumeChange(video.volume, video.muted);
    }
  }, [videoRef, onVolumeChange]);

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [videoRef]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Error toggling PiP:', error);
    }
  }, [videoRef]);

  return {
    togglePlay,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePiP,
  };
}
