import type { Video } from '../../types/video.types';
import { useVideoContext } from '../../context/VideoContext';
import { BiPlay, BiTime, BiHistory } from 'react-icons/bi';
import clsx from 'clsx';

interface VideoListProps {
  videos: Video[];
}

export function VideoList({ videos }: VideoListProps) {
  const { currentVideo, selectVideo, history } = useVideoContext();

  return (
    <div className="space-y-6">
      {/* History Section */}
      {history.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <BiHistory className="w-5 h-5 text-monks-purple-light" />
            <h3 className="text-lg font-semibold text-white">Recently Watched</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {history.map(video => (
              <VideoCard
                key={`history-${video.id}`}
                video={video}
                isActive={currentVideo?.id === video.id}
                onSelect={selectVideo}
                isCompact
              />
            ))}
          </div>
        </div>
      )}

      {/* All Videos Section */}
      <div className="animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">All Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={currentVideo?.id === video.id}
              onSelect={selectVideo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onSelect: (video: Video) => void;
  isCompact?: boolean;
}

function VideoCard({ video, isActive, onSelect, isCompact = false }: VideoCardProps) {
  return (
    <div
      onClick={() => onSelect(video)}
      className={clsx(
        'group relative overflow-hidden rounded-lg cursor-pointer transition-smooth',
        isActive
          ? 'ring-2 ring-monks-purple-light shadow-lg shadow-monks-purple/30'
          : 'hover:ring-2 hover:ring-monks-purple/50',
        isCompact ? 'glass-effect' : 'bg-monks-blue'
      )}
    >
      <div className={clsx('flex', isCompact ? 'flex-row gap-3 p-3' : 'flex-col')}>
        {/* Thumbnail */}
        <div
          className={clsx(
            'relative overflow-hidden bg-monks-gray-dark',
            isCompact ? 'w-24 h-16 flex-shrink-0 rounded' : 'w-full aspect-video'
          )}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 bg-monks-purple rounded-full flex items-center justify-center">
              <BiPlay className="w-7 h-7 text-white ml-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-white flex items-center gap-1">
              <BiTime className="w-3 h-3" />
              {video.duration}
            </div>
          )}

          {/* Active Indicator */}
          {isActive && (
            <div className="absolute top-2 left-2 bg-monks-purple-light text-monks-purple px-2 py-0.5 rounded text-xs font-bold">
              NOW PLAYING
            </div>
          )}
        </div>

        {/* Info */}
        <div className={clsx(isCompact ? 'flex-1' : 'p-4')}>
          <h4
            className={clsx(
              'font-semibold text-white group-hover:text-monks-purple-light transition-colors line-clamp-1',
              isCompact ? 'text-sm mb-1' : 'text-base mb-2'
            )}
          >
            {video.title}
          </h4>
          {!isCompact && (
            <p className="text-sm text-monks-gray-light line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
