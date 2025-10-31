# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Video on Demand (VOD) streaming application built with React 19, TypeScript, and HLS.js. The application demonstrates professional-grade video streaming with adaptive bitrate, custom player controls, and persistent state management. The design is inspired by Monks.com with a purple-accented dark theme.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Architecture

### State Management

The application uses **Context API + Hooks** pattern for global state:

- **VideoContext** (`src/context/VideoContext.tsx`): Central state manager for all video-related state including playback controls, volume, quality settings, history, and error handling
- State persists to `localStorage` for volume preferences, video history (last 3 videos), and last-played video
- The context enforces a Provider/Consumer pattern - all components must use `useVideoContext()` hook within `<VideoProvider>`

### HLS Streaming Architecture

The `useHLS` hook (`src/hooks/useHLS.ts`) handles adaptive streaming:

- **Safari**: Uses native HLS support via `canPlayType('application/vnd.apple.mpegurl')`
- **Other browsers**: Uses HLS.js library with automatic quality detection
- **Error recovery**: Implements automatic reconnection for network/media errors
- **Buffering detection**: Tracks `BUFFER_APPENDING` and `BUFFER_APPENDED` events

Key HLS.js configuration:
```typescript
{
  enableWorker: true,
  lowLatencyMode: false,
  backBufferLength: 90,
}
```

### Custom Hooks Pattern

Three specialized hooks handle video player logic:

1. **useHLS**: HLS.js initialization, quality management, error handling, and cleanup
2. **useVideoControls**: Video element manipulation (play/pause, seek, volume, fullscreen, PiP)
3. **useLocalStorage**: Generic localStorage hook with sync across tabs via StorageEvent

### Component Architecture

- **VideoPlayer**: Main player component that orchestrates HLS hook, video controls, and UI state
- **Controls**: Full-featured control bar with progress scrubber, volume slider, quality selector, PiP, and fullscreen
- **VideoList**: Grid display of available videos with thumbnails
- **BufferIndicator**: Loading spinner overlay during buffering
- **ErrorBoundary**: React error boundary for graceful error handling
- **MiniPlayer**: Picture-in-Picture mode support using browser PiP API

## Design System (Tailwind)

Color palette from Monks.com:

```javascript
monks: {
  purple: '#3C0C60',        // Primary brand color
  'purple-light': '#DFBBFE', // Accent/hover color
  blue: '#001D38',           // Secondary dark
  'blue-sky': '#CBF6FF',     // Secondary light
  'gray-dark': '#2D2D2D',    // Background
  'gray-light': '#EAE8E4',   // Muted text
}
```

Custom CSS utilities defined in `src/index.css`:
- `.btn-primary`: Main action buttons
- `.btn-icon`: Icon-only buttons
- `.glass-effect`: Glassmorphism effect for overlays
- `.text-shadow`: Text shadow for readability over video

## Testing Setup

- **Vitest** for unit/integration tests
- **Testing Library** for React component testing
- Test setup file: `src/tests/setup.ts` includes mocks for:
  - HTMLMediaElement methods (play, pause, load)
  - Picture-in-Picture API

## Video Data

Mock video data in `src/data/videos.ts` contains 5 demo HLS streams with metadata (title, description, thumbnail, duration). To add new videos, follow the `Video` interface in `src/types/video.types.ts`.

## Key TypeScript Types

See `src/types/video.types.ts` for:
- `Video`: Video metadata interface
- `VideoQuality`: Quality level representation (height, bitrate, level)
- `VideoState`: Complete video player state shape
- `VideoContextType`: Context API interface extending VideoState with action methods
- `HLSError`: HLS.js error representation

## Important Implementation Details

1. **Quality Selection**: `-1` represents "Auto" quality in HLS.js (`currentLevel = -1`)
2. **History Management**: Maximum 3 videos stored in history, most recent first
3. **Volume Persistence**: Volume and mute state saved to localStorage as `video-volume`
4. **Fullscreen**: Uses standard Fullscreen API, not custom CSS-based fullscreen
5. **PiP**: Only available when `document.pictureInPictureEnabled === true`

## Common Patterns

When adding new video-related features:
1. Add state to `VideoContext` if it needs to be shared globally
2. Add actions/setters to `VideoContextType` interface
3. Use `useCallback` for action functions to prevent unnecessary re-renders
4. For video element interactions, extend `useVideoControls` hook
5. For HLS-specific features, extend `useHLS` hook

## Browser Compatibility

- Modern browsers: Chrome, Firefox, Edge (via HLS.js)
- Safari: Native HLS support
- Picture-in-Picture: Chrome, Safari, Edge (requires user gesture)
- Fullscreen API: All modern browsers
