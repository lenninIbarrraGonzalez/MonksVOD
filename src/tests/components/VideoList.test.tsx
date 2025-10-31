import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoList } from '../../components/VideoList/VideoList';
import { VideoProvider } from '../../context/VideoContext';
import type { Video } from '../../types/video.types';

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Test Video 1',
    description: 'Test description 1',
    thumbnail: 'https://example.com/thumb1.jpg',
    url: 'https://example.com/video1.m3u8',
    duration: '10:00',
  },
  {
    id: '2',
    title: 'Test Video 2',
    description: 'Test description 2',
    thumbnail: 'https://example.com/thumb2.jpg',
    url: 'https://example.com/video2.m3u8',
    duration: '15:00',
  },
];

describe('VideoList', () => {
  it('should render all videos', () => {
    render(
      <VideoProvider>
        <VideoList videos={mockVideos} />
      </VideoProvider>
    );

    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });

  it('should display video durations', () => {
    render(
      <VideoProvider>
        <VideoList videos={mockVideos} />
      </VideoProvider>
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('should show "All Videos" heading', () => {
    render(
      <VideoProvider>
        <VideoList videos={mockVideos} />
      </VideoProvider>
    );

    expect(screen.getByText('All Videos')).toBeInTheDocument();
  });

  it('should render video thumbnails', () => {
    render(
      <VideoProvider>
        <VideoList videos={mockVideos} />
      </VideoProvider>
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockVideos.length);
    expect(images[0]).toHaveAttribute('src', mockVideos[0].thumbnail);
  });
});
