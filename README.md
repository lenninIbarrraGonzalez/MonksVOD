# Monks VOD - Video Streaming Platform

A modern, production-ready Video on Demand (VOD) streaming application built with React 19, TypeScript, and HLS.js. Features adaptive bitrate streaming, custom video controls, and persistent state management with a sleek design inspired by Monks.com.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-blue)
![HLS.js](https://img.shields.io/badge/HLS.js-1.6-green)

## Features

### Video Player
- ✅ **Adaptive Streaming**: HLS support with automatic quality detection
- ✅ **Browser Compatibility**: Native HLS for Safari, HLS.js for Chrome/Firefox/Edge
- ✅ **Custom Controls**: Play/pause, progress bar, volume, quality selector, fullscreen
- ✅ **Picture-in-Picture**: Floating mini-player mode
- ✅ **Auto-hide Controls**: Controls fade out during playback
- ✅ **Error Handling**: Automatic reconnection and graceful error messages

### User Experience
- ✅ **Video Library**: Grid view with thumbnails and descriptions
- ✅ **Watch History**: Tracks last 3 videos watched
- ✅ **Persistent State**: Remembers volume, last video, and viewing history
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Loading Indicators**: Visual feedback during buffering
- ✅ **Smooth Animations**: Polished transitions and interactions

### Design
- ✅ **Monks-Inspired Theme**: Purple-accented dark theme
- ✅ **Glassmorphism Effects**: Modern translucent UI elements
- ✅ **Professional Typography**: Clean, readable font hierarchy
- ✅ **Accessibility**: ARIA labels and keyboard-friendly controls

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Video Streaming**: HLS.js
- **State Management**: Context API + React Hooks
- **Testing**: Vitest + Testing Library
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone or navigate to the repository**
```bash
cd monks
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── VideoPlayer/     # Main video player with HLS integration
│   ├── VideoList/       # Video library grid
│   ├── Controls/        # Custom player controls
│   ├── BufferIndicator/ # Loading spinner
│   ├── ErrorBoundary/   # Error handling
│   └── MiniPlayer/      # Picture-in-Picture support
├── context/
│   └── VideoContext.tsx # Global state management
├── hooks/
│   ├── useHLS.ts        # HLS.js integration hook
│   ├── useVideoControls.ts # Video element control hook
│   └── useLocalStorage.ts  # Persistent storage hook
├── types/
│   └── video.types.ts   # TypeScript interfaces
├── data/
│   └── videos.ts        # Mock video data
└── tests/               # Unit and integration tests
```

## How to Use

### Watching Videos

1. **Select a Video**: Click any video card from the library
2. **Playback Controls**:
   - Click video or spacebar to play/pause
   - Click progress bar to seek
   - Hover over volume icon to adjust volume
   - Click HD icon to change quality (Auto/720p/1080p)
   - Click PiP icon for picture-in-picture mode
   - Click fullscreen icon for fullscreen mode

### Video Quality

- **Auto**: Automatically adjusts quality based on network (recommended)
- **Manual**: Choose specific quality (720p, 1080p) if available
- Quality selection appears when multiple streams are available

### History

Your last 3 watched videos appear in the "Recently Watched" section for quick access.

### Persistence

The app remembers:
- Last video played (auto-loads on next visit)
- Volume level
- Watch history

## Testing the Application

### Testing Video Playback

The app includes 5 public HLS streams:

1. **NASA TV** - Live stream from NASA
2. **Sintel** - Fantasy short film (14:48)
3. **Big Buck Bunny** - Comedy animation (9:56)
4. **Tears of Steel** - Sci-fi short (12:14)
5. **Demo Stream** - High-quality test stream

### Testing Features

**Video Controls:**
- ✅ Play/pause with spacebar or click
- ✅ Seek by clicking progress bar
- ✅ Drag progress bar handle
- ✅ Adjust volume with slider
- ✅ Toggle mute
- ✅ Change quality settings
- ✅ Enter/exit fullscreen
- ✅ Enable picture-in-picture

**State Persistence:**
- ✅ Adjust volume, refresh page (volume preserved)
- ✅ Watch a video, refresh page (last video loads)
- ✅ Watch 3+ videos (history shows last 3)

**Responsive Design:**
- ✅ Resize browser window
- ✅ Test on mobile device
- ✅ Verify controls adapt to screen size

**Error Handling:**
- ✅ Disconnect network during playback
- ✅ Use invalid video URL
- ✅ Check automatic recovery

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage
```

Tests cover:
- Hook functionality (useLocalStorage, useVideoControls)
- Component rendering (BufferIndicator, VideoList)
- User interactions
- State management

## Browser Support

| Browser | Version | HLS Support |
|---------|---------|-------------|
| Chrome  | 90+     | HLS.js      |
| Firefox | 88+     | HLS.js      |
| Safari  | 14+     | Native      |
| Edge    | 90+     | HLS.js      |

### Feature Support

- **Picture-in-Picture**: Chrome 70+, Safari 13.1+, Edge 79+
- **Fullscreen API**: All modern browsers
- **Local Storage**: All browsers

## Configuration

### Adding New Videos

Edit `src/data/videos.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Video Title',
  description: 'Video description',
  thumbnail: 'https://example.com/thumbnail.jpg',
  url: 'https://example.com/video.m3u8',
  duration: '10:00',
}
```

### Customizing Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  monks: {
    purple: '#3C0C60',        // Primary color
    'purple-light': '#DFBBFE', // Accent color
    // ... other colors
  },
}
```

## Performance

- **Lazy Loading**: Components load on demand
- **Memoization**: Optimized re-renders with React.memo and useMemo
- **HLS Optimization**: Adaptive bitrate reduces buffering
- **Cleanup**: Proper resource disposal prevents memory leaks

## Troubleshooting

### Video Won't Play

- Check internet connection
- Try a different video
- Check browser console for errors
- Verify CORS headers on video server

### Controls Not Appearing

- Move mouse over video player
- Check if auto-hide is active (they reappear on hover)

### Quality Selection Missing

- Quality options only appear if stream has multiple quality levels
- Some streams only have single quality

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder contains optimized production files.

### Deploy to Vercel/Netlify

1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Environment Variables

No environment variables required - all video URLs are in code.

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- Design inspired by [Monks.com](https://www.monks.com)
- Video streams from public test sources
- Built with React, TypeScript, HLS.js, and Tailwind CSS

---

**Built with ❤️ for modern video streaming**
