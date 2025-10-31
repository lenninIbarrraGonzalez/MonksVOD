import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Video, VideoContextType, VideoQuality } from '../types/video.types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const MAX_HISTORY = 3;

export function VideoProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useLocalStorage<number>('video-volume', 0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualities, setQualities] = useState<VideoQuality[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 means auto
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<Video[]>('video-history', []);
  const [isPiPActive, setIsPiPActive] = useState(false);

  const selectVideo = useCallback((video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);

    // Update history
    setHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      return [video, ...filtered].slice(0, MAX_HISTORY);
    });

    // Store last video
    localStorage.setItem('last-video', JSON.stringify(video));
  }, [setHistory]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }, [setVolumeState]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const setQuality = useCallback((level: number) => {
    setCurrentQuality(level);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const togglePiP = useCallback(() => {
    setIsPiPActive(prev => !prev);
  }, []);

  // Internal setters for VideoPlayer
  const updateDuration = useCallback((newDuration: number) => {
    setDuration(newDuration);
  }, []);

  const updateQualities = useCallback((newQualities: VideoQuality[]) => {
    setQualities(newQualities);
  }, []);

  const updateBuffering = useCallback((buffering: boolean) => {
    setIsBuffering(buffering);
  }, []);

  const updateError = useCallback((errorMsg: string) => {
    setError(errorMsg);
  }, []);

  const value: VideoContextType = {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    qualities,
    currentQuality,
    isBuffering,
    error,
    history,
    isPiPActive,
    selectVideo,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    setQuality,
    clearError,
    togglePiP,
    // @ts-ignore - Internal use only
    updateDuration,
    // @ts-ignore - Internal use only
    updateQualities,
    // @ts-ignore - Internal use only
    updateBuffering,
    // @ts-ignore - Internal use only
    updateError,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

export function useVideoContext() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}
