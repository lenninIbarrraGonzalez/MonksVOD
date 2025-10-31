import type { Video } from '../types/video.types';

export const videos: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    description: 'Comedy about a giant rabbit with a heart bigger than himself, and three rodents who awaken his wrath.',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '9:56',
  },
  {
    id: '2',
    title: 'Tears of Steel',
    description: 'Sci-fi short film set in a post-apocalyptic world with stunning visual effects.',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    duration: '12:14',
  },
  {
    id: '3',
    title: 'Sintel Trailer',
    description: 'A fantasy short film about a girl named Sintel who is searching for her baby dragon.',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    duration: '14:48',
  },
  {
    id: '4',
    title: 'Angel One',
    description: 'Demo stream with multiple quality levels for adaptive bitrate testing.',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    duration: '8:30',
  },
];
