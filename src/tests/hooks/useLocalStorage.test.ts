import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update stored value when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should support function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10));

    act(() => {
      result.current[1]((prev: number) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('should handle complex objects', () => {
    const testObject = { name: 'test', value: 42 };
    const { result } = renderHook(() => useLocalStorage('test-key', testObject));

    expect(result.current[0]).toEqual(testObject);

    act(() => {
      result.current[1]({ name: 'updated', value: 100 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', value: 100 });
  });

  it('should sync across tabs with storage event', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('from-another-tab'),
        oldValue: JSON.stringify('initial'),
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe('from-another-tab');
  });

  it('should handle JSON parse errors gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('test-key', 'invalid-json{');

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    // Should return initial value when parse fails
    expect(result.current[0]).toBe('fallback');

    consoleSpy.mockRestore();
  });

});
