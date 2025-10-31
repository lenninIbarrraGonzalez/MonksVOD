# 🎬 Monks VOD - Professional Video Streaming Platform

<div align="center">

![Monks VOD Demo](./src/assets/demoDesktop.gif)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge)](https://monks-vod.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![HLS.js](https://img.shields.io/badge/HLS.js-1.6-ff6b35?style=for-the-badge)](https://github.com/video-dev/hls.js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**[View Live Demo →](https://monks-vod.vercel.app/)**

A modern, production-ready Video on Demand (VOD) streaming platform built with React 19, TypeScript, and HLS.js. Features professional-grade adaptive bitrate streaming, custom controls, and real-time widgets with a sleek design inspired by Monks.com.

</div>

---

## ✨ Key Features

### 🎥 Professional Video Streaming
- **Adaptive Bitrate Streaming (ABR)**: Automatic quality adjustment based on network conditions using HLS protocol
- **Multi-Quality Support**: Seamless switching between 480p, 720p, 1080p, and Auto modes
- **Cross-Browser Compatibility**: Native HLS for Safari/iOS, HLS.js for Chrome/Firefox/Edge
- **Network Resilience**: Automatic reconnection and error recovery on network failures
- **Buffer Management**: Smart buffering with configurable back-buffer (90s) and max buffer (30s)

### 🎛️ Advanced Video Controls
- **Custom Player UI**: Fully-featured control bar with modern design
- **Progress Scrubbing**: Click-to-seek and drag-to-seek with real-time preview
- **Volume Control**: Slider with hover effect and mute toggle
- **Quality Selector**: Dynamic quality menu based on available streams
- **Picture-in-Picture**: Floating mini-player mode (browser support required)
- **Fullscreen Mode**: Native fullscreen API integration
- **Auto-hide Controls**: Controls fade out during playback, reappear on interaction
- **Keyboard Shortcuts**: Spacebar for play/pause, arrows for seeking

### 💾 State Persistence & History
- **Video History**: Tracks last 3 watched videos with localStorage persistence
- **Last Played Video**: Automatically loads your last video on return
- **Volume Memory**: Remembers your preferred volume level
- **Cross-Tab Sync**: State syncs across multiple browser tabs

### 📊 Real-Time Widgets
- **Weather Widget**:
  - Live weather data from OpenWeatherMap API
  - Displays temperature, feels-like, humidity, wind speed
  - Auto-updates every 10 minutes
  - Supports any city worldwide

- **Crypto Widget**:
  - Top 5 cryptocurrencies (BTC, ETH, BNB, ADA, SOL)
  - Real-time prices from CoinGecko API
  - 24h price change with trend indicators
  - Auto-updates every 30 seconds

### 🎨 Modern UI/UX
- **Monks-Inspired Design**: Purple-accented dark theme (#3C0C60)
- **Glassmorphism Effects**: Translucent UI elements with backdrop blur
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and buffer indicators
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Smooth Animations**: Polished transitions and micro-interactions

---

## 🛠️ Tech Stack

### Core Technologies
- **[React 19](https://react.dev)** - Latest React with concurrent rendering
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Full type safety
- **[Vite 7](https://vitejs.dev)** - Lightning-fast build tool
- **[Tailwind CSS 4](https://tailwindcss.com)** - Modern utility-first CSS

### Video Streaming Stack
- **[HLS.js 1.6](https://github.com/video-dev/hls.js)** - Industry-standard HLS player
  - MSE (Media Source Extensions) for adaptive streaming
  - Worker-based parsing for better performance
  - Fragment retry logic and network error recovery
  - Automatic level switching based on bandwidth
- **Native HLS** - Safari/iOS native support
- **H.264 Video Codec** - Universal browser compatibility
- **AAC Audio Codec** - High-quality audio streaming

### State Management & Hooks
- **Context API** - Global state management
- **Custom Hooks**:
  - `useHLS`: HLS.js integration and quality management
  - `useVideoControls`: Video element manipulation
  - `useLocalStorage`: Persistent storage with sync
  - `useWeather`: Weather API integration
  - `useCrypto`: Cryptocurrency API integration

### Testing & Quality
- **[Vitest 4](https://vitest.dev)** - Next-generation testing framework
- **[Testing Library](https://testing-library.com)** - React component testing
- **Coverage**: 75 tests passing (100% success rate)
- **ESLint 9** - Code quality and consistency

### APIs
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Weather data
- **[CoinGecko API](https://www.coingecko.com/en/api)** - Cryptocurrency prices

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd monks
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# OpenWeatherMap API (Free tier)
# Get your key at: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Default city for weather
VITE_WEATHER_CITY=Madrid

# CoinGecko Demo API (Free tier)
# Get your key at: https://www.coingecko.com/en/api/pricing
VITE_COINGECKO_API_KEY=your_coingecko_api_key
```

4. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload (port 5173)

# Production
npm run build            # Build optimized production bundle
npm run preview          # Preview production build locally

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Open Vitest UI dashboard
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint checks
```

---

## 📁 Project Structure

```
monks/
├── src/
│   ├── components/
│   │   ├── VideoPlayer/         # Main video player component
│   │   │   └── VideoPlayer.tsx  # HLS integration, playback logic
│   │   ├── Controls/            # Custom player controls
│   │   │   └── Controls.tsx     # Progress bar, volume, quality
│   │   ├── VideoList/           # Video library grid
│   │   ├── BufferIndicator/     # Loading spinner overlay
│   │   ├── ErrorBoundary/       # Global error handling
│   │   ├── MiniPlayer/          # Picture-in-Picture support
│   │   ├── WeatherWidget/       # Real-time weather display
│   │   └── CryptoWidget/        # Real-time crypto prices
│   │
│   ├── context/
│   │   └── VideoContext.tsx     # Global state (video, playback, history)
│   │
│   ├── hooks/
│   │   ├── useHLS.ts            # HLS.js wrapper with quality management
│   │   ├── useVideoControls.ts # Video element control abstraction
│   │   ├── useLocalStorage.ts  # Persistent storage with sync
│   │   ├── useWeather.ts        # Weather API integration
│   │   └── useCrypto.ts         # Crypto API integration
│   │
│   ├── types/
│   │   ├── video.types.ts       # Video, quality, error types
│   │   └── widgets.types.ts     # Weather and crypto types
│   │
│   ├── data/
│   │   └── videos.ts            # Video catalog data
│   │
│   ├── tests/                   # 75 tests (7 test files)
│   │   ├── components/          # Component tests
│   │   ├── hooks/               # Hook tests
│   │   └── context/             # Context tests
│   │
│   ├── assets/                  # Images, videos, icons
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Application entry point
│
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── vitest.config.ts            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.ts              # Vite build configuration
```

---

## 🎯 How to Use

### Watching Videos

1. **Browse Library**: Scroll through the video grid on the home page
2. **Select Video**: Click any video card to start playback
3. **Playback**:
   - Click video or press `Space` to play/pause
   - Click progress bar to seek to specific time
   - Drag progress bar handle for precise seeking
4. **Volume**: Hover over volume icon to reveal slider
5. **Quality**: Click HD icon to select quality (Auto/480p/720p/1080p)
6. **Fullscreen**: Click fullscreen icon or press `F`
7. **Picture-in-Picture**: Click PiP icon to enable floating player

### Video Quality Selection

The quality selector adapts based on available streams:

- **Auto** (Recommended): Automatically adjusts quality based on network speed
- **1080p**: Full HD quality (if available in stream)
- **720p**: HD quality (if available in stream)
- **480p**: SD quality (if available in stream)

### Recent History

Your last 3 watched videos appear at the top for quick access. History persists across browser sessions.

---

## 🎥 HLS Streaming Architecture

### How HLS.js Works

This application uses **HTTP Live Streaming (HLS)**, the industry standard for adaptive video streaming:

```
┌─────────────┐
│   Master    │  ← .m3u8 manifest with quality variants
│  Playlist   │
└──────┬──────┘
       │
       ├─── 1080p ────→ ┌──────────────┐
       │                │  Media       │
       ├─── 720p  ────→ │  Playlists   │ ← Segments list (.ts files)
       │                └──────────────┘
       └─── 480p  ────→      │
                              ├── segment-0.ts (2-10s video chunks)
                              ├── segment-1.ts
                              └── segment-n.ts
```

### Key Features

1. **Adaptive Bitrate (ABR)**:
   - Monitors network bandwidth
   - Automatically switches quality levels
   - Prevents buffering by downscaling when needed

2. **Fragment Loading**:
   - Downloads video in small chunks (2-10 seconds)
   - Enables fast startup and seeking
   - Allows mid-stream quality changes

3. **Error Recovery**:
   ```typescript
   // Network errors: Auto-retry after 1s
   Hls.ErrorTypes.NETWORK_ERROR → startLoad()

   // Media errors: Attempt recovery
   Hls.ErrorTypes.MEDIA_ERROR → recoverMediaError()
   ```

4. **Buffer Management**:
   - `backBufferLength: 90s` - Keeps 90s of past video in memory
   - `maxBufferLength: 30s` - Tries to keep 30s ahead buffered
   - Balances memory usage vs smooth playback

### Browser Compatibility

| Browser | Implementation | Notes |
|---------|---------------|-------|
| Safari 14+ | Native HLS | Uses built-in `canPlayType('application/vnd.apple.mpegurl')` |
| Chrome 90+ | HLS.js | MSE (Media Source Extensions) |
| Firefox 88+ | HLS.js | MSE (Media Source Extensions) |
| Edge 90+ | HLS.js | MSE (Media Source Extensions) |

---

## 🧪 Testing

The project includes comprehensive test coverage:

### Test Statistics
- **75 tests** across 7 test files
- **100% pass rate**
- **Test coverage**: ~71% of critical paths

### Test Suites
```bash
✓ useLocalStorage.test.ts      (7 tests)   # Storage & sync
✓ useVideoControls.test.ts     (10 tests)  # Video controls
✓ BufferIndicator.test.tsx     (3 tests)   # Loading UI
✓ VideoContext.test.tsx        (23 tests)  # State management
✓ VideoList.test.tsx           (4 tests)   # Video grid
✓ useWeather.test.ts           (12 tests)  # Weather API
✓ useCrypto.test.ts            (16 tests)  # Crypto API
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Coverage report is generated in `coverage/` directory.

---

## 🌐 Production Deployment

### Vercel Deployment (Current)

**Live URL**: [https://monks-vod.vercel.app/](https://monks-vod.vercel.app/)

#### Deploy Your Own

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Vite configuration

3. **Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_OPENWEATHER_API_KEY = your_openweather_key
VITE_WEATHER_CITY = Madrid
VITE_COINGECKO_API_KEY = your_coingecko_key
```

Select all environments: **Production**, **Preview**, **Development**

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Get your live URL

#### Manual Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

### Other Platforms

<details>
<summary><b>Netlify</b></summary>

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables (same as Vercel)
VITE_OPENWEATHER_API_KEY
VITE_WEATHER_CITY
VITE_COINGECKO_API_KEY
```
</details>

<details>
<summary><b>GitHub Pages</b></summary>

1. Install `gh-pages`:
```bash
npm install -D gh-pages
```

2. Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```
</details>

---

## 🎨 Customization

### Adding New Videos

Edit `src/data/videos.ts`:

```typescript
export const videos: Video[] = [
  {
    id: 'unique-id',
    title: 'Your Video Title',
    description: 'Compelling description',
    thumbnail: 'https://example.com/thumbnail.jpg',
    url: 'https://example.com/video.m3u8',  // HLS manifest URL
    duration: '12:34',
  },
  // ... more videos
];
```

**Requirements**:
- URL must be a valid HLS manifest (`.m3u8`)
- CORS headers must allow your domain
- Thumbnail should be 16:9 aspect ratio

### Customizing Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  monks: {
    purple: '#3C0C60',        // Primary brand color
    'purple-light': '#DFBBFE', // Accent/hover
    blue: '#001D38',           // Secondary dark
    'blue-sky': '#CBF6FF',     // Secondary light
    'gray-dark': '#2D2D2D',    // Background
    'gray-light': '#EAE8E4',   // Text muted
  },
}
```

### HLS.js Configuration

Edit `src/hooks/useHLS.ts`:

```typescript
const hls = new Hls({
  enableWorker: true,           // Use Web Worker for parsing
  lowLatencyMode: false,        // For live streams
  backBufferLength: 90,         // Keep 90s of past video
  maxBufferLength: 30,          // Try to buffer 30s ahead
  maxMaxBufferLength: 600,      // Max buffer limit

  // Retry configuration
  manifestLoadingMaxRetry: 3,
  manifestLoadingRetryDelay: 1000,
  levelLoadingMaxRetry: 3,
  fragLoadingMaxRetry: 6,
});
```

---

## 📊 Performance Optimization

### Build Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Tree Shaking**: Unused code elimination
- **Minification**: UglifyJS for production
- **Compression**: Gzip/Brotli for static assets

### Runtime Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive computations
- **Lazy Loading**: Components load on demand
- **HLS Worker**: Offload parsing to Web Worker

### Resource Management
- **HLS Cleanup**: Destroys HLS instance on unmount
- **Event Cleanup**: Removes all event listeners
- **Timer Cleanup**: Clears intervals on unmount
- **Memory Management**: Proper buffer disposal

---

## 🐛 Troubleshooting

### Video Won't Play

**Symptoms**: Black screen, no playback

**Solutions**:
1. Check browser console for errors
2. Verify video URL is accessible (try in browser)
3. Check CORS headers on video server
4. Try a different video to isolate issue
5. Check internet connection

### Quality Selector Not Appearing

**Reason**: Stream only has single quality

**Solution**: Quality selector only appears when multiple quality variants exist in the HLS manifest.

### Controls Not Showing

**Reason**: Auto-hide is active

**Solution**: Move mouse over player area - controls will reappear.

### API Keys Not Working

**Vercel/Netlify**:
1. Check environment variables are set in platform dashboard
2. Verify variable names match exactly (including `VITE_` prefix)
3. Redeploy after adding variables

**Local Development**:
1. Check `.env` file exists
2. Restart dev server after changing `.env`
3. Verify API keys are valid

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

## 🙏 Credits & Acknowledgments

- **Design Inspiration**: [Monks.com](https://www.monks.com)
- **Video Streams**: Public domain test videos
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Built with**: React, TypeScript, HLS.js, Tailwind CSS, Vite

---

## 📞 Support

- **Live Demo**: [https://monks-vod.vercel.app/](https://monks-vod.vercel.app/)
- **Issues**: Open an issue on GitHub
- **Documentation**: See [CLAUDE.md](./CLAUDE.md) for development guidelines

---

<div align="center">

**Built with ❤️ for modern video streaming**

[![View Demo](https://img.shields.io/badge/View_Live_Demo-→-black?style=for-the-badge)](https://monks-vod.vercel.app/)

</div>
