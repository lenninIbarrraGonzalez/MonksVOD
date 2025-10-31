import { useState, useEffect, useCallback } from 'react';
import type {
  CryptoCurrency,
  CryptoAPIResponse,
  UseCryptoReturn,
} from '../types/widgets.types';

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const REFRESH_INTERVAL = 30 * 1000; // 30 seconds
const TOP_CRYPTOS = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana'];

export function useCrypto(): UseCryptoReturn {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrypto = useCallback(async () => {
    if (!API_KEY || API_KEY === 'your_coingecko_api_key_here') {
      setError('API key not configured. Please add VITE_COINGECKO_API_KEY to .env');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const ids = TOP_CRYPTOS.join(',');
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h`,
        {
          headers: {
            'x-cg-demo-api-key': API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Crypto API error: ${response.status}`);
      }

      const data: CryptoAPIResponse[] = await response.json();

      const cryptoData: CryptoCurrency[] = data.map((crypto) => ({
        id: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        currentPrice: crypto.current_price,
        priceChange24h: crypto.price_change_24h,
        priceChangePercentage24h: crypto.price_change_percentage_24h,
        marketCap: crypto.market_cap,
        image: crypto.image,
      }));

      setCryptos(cryptoData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching crypto:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto data');
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchCrypto();

    const interval = setInterval(() => {
      fetchCrypto();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCrypto]);

  return {
    cryptos,
    isLoading,
    error,
    refetch: fetchCrypto,
  };
}
