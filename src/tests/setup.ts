import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers as any);

afterEach(() => {
  cleanup();
});

// Mock HTMLMediaElement methods
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  configurable: true,
  value: vi.fn(),
});

// Mock Picture-in-Picture API
Object.defineProperty(document, 'pictureInPictureEnabled', {
  configurable: true,
  value: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'requestPictureInPicture', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(document, 'exitPictureInPicture', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
