import { useEffect, useRef, useCallback, useState } from 'react';
import Hls from 'hls.js';
import type { VideoQuality, HLSError } from '../types/video.types';

interface UseHLSProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  url: string;
  onQualitiesChange: (qualities: VideoQuality[]) => void;
  onError: (error: HLSError) => void;
  onBuffering: (isBuffering: boolean) => void;
}

export function useHLS({
  videoRef,
  url,
  onQualitiesChange,
  onError,
  onBuffering,
}: UseHLSProps) {
  const hlsRef = useRef<Hls | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Store callbacks in refs to avoid recreating effect
  const onQualitiesChangeRef = useRef(onQualitiesChange);
  const onErrorRef = useRef(onError);
  const onBufferingRef = useRef(onBuffering);

  useEffect(() => {
    onQualitiesChangeRef.current = onQualitiesChange;
    onErrorRef.current = onError;
    onBufferingRef.current = onBuffering;
  }, [onQualitiesChange, onError, onBuffering]);

  const setQuality = useCallback((level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
  }, []);

  const destroy = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setIsReady(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    // Clean up previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
      setIsReady(false);
    }

    // Safari native HLS support
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      setIsReady(true);
      return;
    }

    // Other browsers using HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        debug: false,
        // Robust error handling configuration
        manifestLoadingMaxRetry: 3,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 3,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000,
        // Improve parsing reliability
        abrEwmaDefaultEstimate: 500000,
      });

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        console.log('✅ Manifest parsed successfully, levels:', data.levels.length);
        const qualities: VideoQuality[] = data.levels.map((level, index) => ({
          height: level.height,
          bitrate: level.bitrate,
          level: index,
        }));
        onQualitiesChangeRef.current(qualities);
        setIsReady(true);

        // Start loading the first fragments
        hls.startLoad();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        // Only report fatal errors to user
        if (data.fatal) {
          console.error('Fatal HLS Error:', data.type, data.details);

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover from network errors
              console.log('Attempting to recover from network error...');
              setTimeout(() => {
                if (hlsRef.current) {
                  hls.startLoad();
                }
              }, 1000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              // Try to recover from media errors
              console.log('Attempting to recover from media error...');
              hls.recoverMediaError();
              break;
            default:
              // For other fatal errors, notify user
              onErrorRef.current({
                type: data.type,
                details: data.details,
                fatal: data.fatal,
              });
              break;
          }
        } else {
          // Non-fatal errors - just log, HLS.js will handle recovery
          console.warn('Non-fatal HLS error:', data.details);
        }
      });

      // Note: Buffering is now handled by video element events in VideoPlayer
      // (waiting/playing events are more reliable than BUFFER_APPENDING/APPENDED)
    } else {
      console.error('HLS is not supported in this browser');
      onErrorRef.current({
        type: 'UNSUPPORTED',
        details: 'HLS is not supported in this browser',
        fatal: true,
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]); // Only re-run when URL changes

  return {
    hls: hlsRef.current,
    isReady,
    setQuality,
    destroy,
  };
}
