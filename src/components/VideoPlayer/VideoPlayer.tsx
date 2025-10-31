import { useRef, useEffect, useState, useCallback } from 'react';
import { useVideoContext } from '../../context/VideoContext';
import { useHLS } from '../../hooks/useHLS';
import { useVideoControls } from '../../hooks/useVideoControls';
import { Controls } from '../Controls/Controls';
import { BufferIndicator } from '../BufferIndicator/BufferIndicator';
import { BiPlay, BiError } from 'react-icons/bi';
import clsx from 'clsx';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const context = useVideoContext();
  const {
    currentVideo,
    isPlaying,
    volume,
    isMuted,
    isBuffering,
    error,
    togglePlay,
    seek,
    setQuality,
    clearError,
    togglePiP,
  } = context;

  // @ts-ignore - Access internal methods
  const updateQualitiesRef = useRef(context.updateQualities);
  // @ts-ignore - Access internal methods
  const updateBufferingRef = useRef(context.updateBuffering);
  // @ts-ignore - Access internal methods
  const updateErrorRef = useRef(context.updateError);
  // @ts-ignore - Access internal methods
  const updateDurationRef = useRef(context.updateDuration);

  // Update refs when context changes
  useEffect(() => {
    // @ts-ignore
    updateQualitiesRef.current = context.updateQualities;
    // @ts-ignore
    updateBufferingRef.current = context.updateBuffering;
    // @ts-ignore
    updateErrorRef.current = context.updateError;
    // @ts-ignore
    updateDurationRef.current = context.updateDuration;
  }, [context]);

  // Stable callbacks for HLS hook
  const handleQualitiesChange = useCallback((qualities: any) => {
    console.log('Qualities updated:', qualities);
    updateQualitiesRef.current?.(qualities);
  }, []);

  const handleError = useCallback((hlsError: any) => {
    console.error('HLS Error received:', hlsError);
    updateErrorRef.current?.(hlsError.details || 'Error loading video');
  }, []);

  const handleBuffering = useCallback((buffering: boolean) => {
    console.log('Buffering state:', buffering);
    updateBufferingRef.current?.(buffering);
  }, []);

  // Initialize HLS only when we have a valid video
  const { setQuality: setHLSQuality, isReady: hlsReady } = useHLS({
    videoRef,
    url: currentVideo?.url || '',
    onQualitiesChange: handleQualitiesChange,
    onError: handleError,
    onBuffering: handleBuffering,
  });

  // Sync HLS ready state with initialized state
  useEffect(() => {
    if (hlsReady) {
      console.log('✅ HLS ready - video initialized');
      setIsInitialized(true);
    }
  }, [hlsReady]);

  // Video controls
  const {
    play,
    pause,
    seek: videoSeek,
    setVolume: videoSetVolume,
    toggleMute: videoToggleMute,
    toggleFullscreen: videoToggleFullscreen,
    togglePiP: videoTogglePiP,
  } = useVideoControls({
    videoRef,
    onPlay: () => togglePlay(),
    onPause: () => togglePlay(),
  });

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      seek(video.currentTime);
    };

    const handleDurationChange = () => {
      if (isFinite(video.duration)) {
        updateDurationRef.current?.(video.duration);
      }
    };

    const handlePlay = () => {
      console.log('▶️ Play event - video starting');
      setIsInitialized(true);
      if (!isPlaying) togglePlay();
    };

    const handlePause = () => {
      if (isPlaying) togglePlay();
    };

    const handleWaiting = () => {
      console.log('⏳ Buffering...');
      updateBufferingRef.current?.(true);
    };

    const handlePlaying = () => {
      console.log('▶️ Playing - buffering complete');
      updateBufferingRef.current?.(false);
    };

    const handleCanPlay = () => {
      console.log('🎬 Video can play - ready for playback');
      setIsInitialized(true);
      updateBufferingRef.current?.(false);
    };

    const handleLoadedMetadata = () => {
      console.log('📊 Metadata loaded, duration:', video.duration);
      if (isFinite(video.duration)) {
        updateDurationRef.current?.(video.duration);
      }
    };

    const handleLoadedData = () => {
      console.log('📦 First frame loaded');
      setIsInitialized(true);
      updateBufferingRef.current?.(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isPlaying, togglePlay, seek]);

  // Sync volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Auto-hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setShowControls(false);
    }
  }, [isPlaying]);

  // Control handlers
  const handlePlay = useCallback(() => {
    if (!isPlaying) {
      togglePlay(); // Update state immediately so button disappears
    }
    play();
  }, [play, isPlaying, togglePlay]);

  const handlePause = useCallback(() => {
    if (isPlaying) {
      togglePlay(); // Update state immediately so button appears
    }
    pause();
  }, [pause, isPlaying, togglePlay]);

  const handleSeek = useCallback(
    (time: number) => {
      videoSeek(time);
    },
    [videoSeek]
  );

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      videoSetVolume(newVolume);
    },
    [videoSetVolume]
  );

  const handleMuteToggle = useCallback(() => {
    videoToggleMute();
  }, [videoToggleMute]);

  const handleFullscreenToggle = useCallback(() => {
    videoToggleFullscreen();
  }, [videoToggleFullscreen]);

  const handleQualityChange = useCallback(
    (level: number) => {
      setHLSQuality(level);
      setQuality(level);
    },
    [setHLSQuality, setQuality]
  );

  const handlePiPToggle = useCallback(() => {
    videoTogglePiP();
    togglePiP();
  }, [videoTogglePiP, togglePiP]);

  const handleVideoClick = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  if (!currentVideo) {
    return (
      <div className="relative w-full aspect-video bg-monks-gray-dark rounded-xl overflow-hidden flex items-center justify-center glass-effect">
        <div className="text-center p-8">
          <BiPlay className="w-20 h-20 mx-auto mb-4 text-monks-purple-light opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No video selected
          </h3>
          <p className="text-monks-gray-light">
            Choose a video from the list to start watching
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-monks-gray-dark rounded-xl overflow-hidden flex items-center justify-center glass-effect">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiError className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Playback Error
          </h3>
          <p className="text-monks-gray-light mb-6">{error}</p>
          <button onClick={clearError} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={e => e.stopPropagation()}
      />

      {/* Buffer Indicator */}
      <BufferIndicator isVisible={isBuffering || !isInitialized} />

      {/* Video Info Overlay */}
      <div
        className={clsx(
          'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 transition-smooth',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        <h2 className="text-2xl font-bold text-white text-shadow mb-1">
          {currentVideo.title}
        </h2>
        <p className="text-sm text-monks-gray-light text-shadow">
          {currentVideo.description}
        </p>
      </div>

      {/* Play/Pause Center Button */}
      {!isPlaying && isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={handlePlay}
            className="w-20 h-20 bg-monks-purple/80 rounded-full flex items-center justify-center backdrop-blur-sm animate-fade-in pointer-events-auto cursor-pointer hover:bg-monks-purple transition-all hover:scale-110"
            aria-label="Play video"
          >
            <BiPlay className="w-12 h-12 text-white ml-1" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={clsx(
          'transition-smooth',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
        onClick={e => e.stopPropagation()}
      >
        <Controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
          onFullscreenToggle={handleFullscreenToggle}
          onQualityChange={handleQualityChange}
          onPiPToggle={handlePiPToggle}
        />
      </div>
    </div>
  );
}
