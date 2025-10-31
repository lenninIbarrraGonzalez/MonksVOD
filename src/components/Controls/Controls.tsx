import { useState, useRef, useEffect } from 'react';
import {
  BiPlay,
  BiPause,
  BiVolumeFull,
  BiVolumeMute,
  BiFullscreen,
  BiExitFullscreen,
} from 'react-icons/bi';
import { MdPictureInPictureAlt, MdHighQuality } from 'react-icons/md';
import { useVideoContext } from '../../context/VideoContext';
import clsx from 'clsx';

interface ControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onQualityChange: (level: number) => void;
  onPiPToggle: () => void;
}

export function Controls({
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onQualityChange,
  onPiPToggle,
}: ControlsProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    qualities,
    currentQuality,
  } = useVideoContext();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    onSeek(newTime);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    onSeek(newTime);
  };

  const handleVolumeHover = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 500);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleProgressDrag(e as any);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-smooth">
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="group mb-4 cursor-pointer"
        onClick={handleProgressClick}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-2 transition-all">
          <div
            className="absolute top-0 left-0 h-full bg-monks-purple-light transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="btn-icon"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <BiPause className="w-6 h-6" />
            ) : (
              <BiPlay className="w-6 h-6" />
            )}
          </button>

          {/* Volume */}
          <div
            className="relative flex items-center gap-2"
            onMouseEnter={handleVolumeHover}
            onMouseLeave={handleVolumeLeave}
          >
            <button
              onClick={onMuteToggle}
              className="btn-icon"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <BiVolumeMute className="w-6 h-6" />
              ) : (
                <BiVolumeFull className="w-6 h-6" />
              )}
            </button>

            <div
              className={clsx(
                'absolute left-full ml-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 transition-all',
                showVolumeSlider
                  ? 'opacity-100 visible translate-x-0'
                  : 'opacity-0 invisible -translate-x-2'
              )}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
                className="w-24 accent-monks-purple-light"
              />
            </div>
          </div>

          {/* Time */}
          <div className="text-sm text-white font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quality Selector */}
          {qualities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="btn-icon"
                aria-label="Quality"
              >
                <MdHighQuality className="w-6 h-6" />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[120px]">
                  <button
                    onClick={() => {
                      onQualityChange(-1);
                      setShowQualityMenu(false);
                    }}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded text-sm transition-smooth',
                      currentQuality === -1
                        ? 'bg-monks-purple text-white'
                        : 'text-white hover:bg-white/10'
                    )}
                  >
                    Auto
                  </button>
                  {qualities.map((quality, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onQualityChange(index);
                        setShowQualityMenu(false);
                      }}
                      className={clsx(
                        'w-full text-left px-3 py-2 rounded text-sm transition-smooth',
                        currentQuality === index
                          ? 'bg-monks-purple text-white'
                          : 'text-white hover:bg-white/10'
                      )}
                    >
                      {quality.height}p
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Picture-in-Picture */}
          {document.pictureInPictureEnabled && (
            <button
              onClick={onPiPToggle}
              className="btn-icon"
              aria-label="Picture in Picture"
            >
              <MdPictureInPictureAlt className="w-6 h-6" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={onFullscreenToggle}
            className="btn-icon"
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <BiExitFullscreen className="w-6 h-6" />
            ) : (
              <BiFullscreen className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
