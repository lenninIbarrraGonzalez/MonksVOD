import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock import.meta.env before importing the hook
vi.stubGlobal('import.meta', { env: {} });

import { useCrypto } from '../../hooks/useCrypto';

describe('useCrypto', () => {
  const mockCryptoResponse = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://example.com/bitcoin.png',
      current_price: 45000.5,
      market_cap: 850000000000,
      price_change_24h: 1500.25,
      price_change_percentage_24h: 3.45,
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://example.com/ethereum.png',
      current_price: 3200.75,
      market_cap: 380000000000,
      price_change_24h: -50.5,
      price_change_percentage_24h: -1.55,
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: 'https://example.com/bnb.png',
      current_price: 420.0,
      market_cap: 65000000000,
      price_change_24h: 10.2,
      price_change_percentage_24h: 2.49,
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.stubEnv('VITE_COINGECKO_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Successful Data Fetching', () => {
    it('should fetch crypto data successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { result } = renderHook(() => useCrypto());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cryptos).toHaveLength(3);
      expect(result.current.cryptos[0]).toEqual({
        id: 'bitcoin',
        symbol: 'BTC', // Uppercase
        name: 'Bitcoin',
        currentPrice: 45000.5,
        priceChange24h: 1500.25,
        priceChangePercentage24h: 3.45,
        marketCap: 850000000000,
        image: 'https://example.com/bitcoin.png',
      });
      expect(result.current.error).toBeNull();
    });

    it('should convert symbol to uppercase', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.cryptos[0].symbol).toBe('BTC');
        expect(result.current.cryptos[1].symbol).toBe('ETH');
        expect(result.current.cryptos[2].symbol).toBe('BNB');
      });
    });

    it('should fetch all 5 configured cryptocurrencies', async () => {
      const fullResponse = [
        ...mockCryptoResponse,
        {
          id: 'cardano',
          symbol: 'ada',
          name: 'Cardano',
          image: 'https://example.com/cardano.png',
          current_price: 0.5,
          market_cap: 17000000000,
          price_change_24h: 0.02,
          price_change_percentage_24h: 4.2,
        },
        {
          id: 'solana',
          symbol: 'sol',
          name: 'Solana',
          image: 'https://example.com/solana.png',
          current_price: 150.0,
          market_cap: 65000000000,
          price_change_24h: -5.0,
          price_change_percentage_24h: -3.23,
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => fullResponse,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.cryptos).toHaveLength(5);
      });
    });
  });


  describe('Error Handling', () => {
    it('should handle HTTP error responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.error).toBe('Crypto API error: 429');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.cryptos).toEqual([]);
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Failed to fetch')
      );

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle JSON parsing errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token');
        },
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.error).toBe('Unexpected token');
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as any).mockRejectedValueOnce('CORS error');

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch crypto data');
      });
    });
  });

  describe('Auto-refresh', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-refresh every 30 seconds', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      renderHook(() => useCrypto());

      // Initial call
      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Fast-forward 30 seconds
      vi.advanceTimersByTime(30 * 1000);

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });

      // Fast-forward another 30 seconds
      vi.advanceTimersByTime(30 * 1000);

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });
    });

    it('should clear interval on unmount', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { unmount } = renderHook(() => useCrypto());

      await vi.waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Fast-forward 30 seconds
      vi.advanceTimersByTime(30 * 1000);

      // Should not fetch again after unmount
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manual Refetch', () => {
    it('should allow manual refetch', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Manual refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should update loading state during manual refetch', async () => {
      let resolvePromise: any;
      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = () =>
              resolve({
                ok: true,
                json: async () => mockCryptoResponse,
              });
          })
      );

      const { result } = renderHook(() => useCrypto());

      // Resolve initial fetch
      resolvePromise();
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Manual refetch
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      resolvePromise();

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('API Request', () => {
    it('should request specific cryptocurrencies', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      renderHook(() => useCrypto());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(
            'ids=bitcoin,ethereum,binancecoin,cardano,solana'
          ),
          expect.any(Object)
        );
      });
    });

    it('should include custom header for CoinGecko Demo API', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      renderHook(() => useCrypto());

      await waitFor(() => {
        const callArgs = (global.fetch as any).mock.calls[0];
        expect(callArgs[1]).toHaveProperty('headers');
        expect(callArgs[1].headers).toHaveProperty('x-cg-demo-api-key');
      });
    });
  });

  describe('Data Transformation', () => {
    it('should map all required fields correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCryptoResponse[0]],
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        const crypto = result.current.cryptos[0];
        expect(crypto).toHaveProperty('id');
        expect(crypto).toHaveProperty('symbol');
        expect(crypto).toHaveProperty('name');
        expect(crypto).toHaveProperty('currentPrice');
        expect(crypto).toHaveProperty('priceChange24h');
        expect(crypto).toHaveProperty('priceChangePercentage24h');
        expect(crypto).toHaveProperty('marketCap');
        expect(crypto).toHaveProperty('image');
      });
    });

    it('should preserve price precision', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        expect(result.current.cryptos[0].currentPrice).toBe(45000.5);
        expect(result.current.cryptos[1].currentPrice).toBe(3200.75);
      });
    });

    it('should handle negative price changes', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCryptoResponse,
      });

      const { result } = renderHook(() => useCrypto());

      await waitFor(() => {
        const ethereum = result.current.cryptos[1];
        expect(ethereum.priceChange24h).toBe(-50.5);
        expect(ethereum.priceChangePercentage24h).toBe(-1.55);
      });
    });
  });
});
