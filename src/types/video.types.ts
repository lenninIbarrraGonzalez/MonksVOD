export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration?: string;
}

export interface VideoQuality {
  height: number;
  bitrate: number;
  level: number;
}

export interface VideoState {
  currentVideo: Video | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  qualities: VideoQuality[];
  currentQuality: number;
  isBuffering: boolean;
  error: string | null;
  history: Video[];
  isPiPActive: boolean;
}

export interface VideoContextType extends VideoState {
  selectVideo: (video: Video) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setQuality: (level: number) => void;
  clearError: () => void;
  togglePiP: () => void;
}

export type HLSError = {
  type: string;
  details: string;
  fatal: boolean;
};
