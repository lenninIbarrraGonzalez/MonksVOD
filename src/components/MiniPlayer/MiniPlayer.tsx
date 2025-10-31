import { useEffect } from 'react';
import { useVideoContext } from '../../context/VideoContext';

interface MiniPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function MiniPlayer({ videoRef }: MiniPlayerProps) {
  const { isPiPActive, togglePiP } = useVideoContext();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => {
      if (!isPiPActive) {
        togglePiP();
      }
    };

    const handleLeavePiP = () => {
      if (isPiPActive) {
        togglePiP();
      }
    };

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [videoRef, isPiPActive, togglePiP]);

  // This component manages PiP state but doesn't render anything
  // The actual PiP window is handled by the browser
  return null;
}
