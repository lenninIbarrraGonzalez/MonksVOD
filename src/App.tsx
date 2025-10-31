import { useEffect } from 'react';
import { VideoProvider, useVideoContext } from './context/VideoContext';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { VideoList } from './components/VideoList/VideoList';
import { videos } from './data/videos';
import { BiVideo } from 'react-icons/bi';

function AppContent() {
  const { currentVideo, selectVideo } = useVideoContext();

  // Load last video on mount
  useEffect(() => {
    if (!currentVideo) {
      const lastVideo = localStorage.getItem('last-video');
      if (lastVideo) {
        try {
          const video = JSON.parse(lastVideo);
          selectVideo(video);
        } catch (error) {
          console.error('Error loading last video:', error);
          selectVideo(videos[0]);
        }
      } else {
        selectVideo(videos[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-monks-gray-dark">
      {/* Header */}
      <header className="bg-monks-blue border-b border-monks-purple/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-monks-purple to-monks-purple-light rounded-lg flex items-center justify-center">
              <BiVideo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Monks VOD</h1>
              <p className="text-sm text-monks-gray-light">
                Video on Demand Streaming Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <VideoPlayer />

            {/* Video Details */}
            {currentVideo && (
              <div className="mt-6 glass-effect rounded-xl p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-2">
                  {currentVideo.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-monks-gray-light mb-4">
                  {currentVideo.duration && (
                    <span className="flex items-center gap-1">
                      <BiVideo className="w-4 h-4" />
                      {currentVideo.duration}
                    </span>
                  )}
                </div>
                <p className="text-monks-gray-light leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>
            )}
          </div>

          {/* Video List Sidebar */}
          <div className="lg:col-span-1">
            <VideoList videos={videos} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-monks-purple/20 py-6">
        <div className="container mx-auto px-6 text-center text-monks-gray-light text-sm">
          <p>Built with React, TypeScript, HLS.js & Tailwind CSS</p>
          <p className="mt-1">Design inspired by Monks.com</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <VideoProvider>
        <AppContent />
      </VideoProvider>
    </ErrorBoundary>
  );
}

export default App;
