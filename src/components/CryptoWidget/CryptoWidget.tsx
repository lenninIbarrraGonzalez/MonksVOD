import { useCrypto } from '../../hooks/useCrypto';
import { BiRefresh, BiError, BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import clsx from 'clsx';

export function CryptoWidget() {
  const { cryptos, isLoading, error, refetch } = useCrypto();

  // Format price with appropriate decimals
  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    } else if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
    }
  };

  // Format percentage change
  const formatPercentage = (percentage: number): string => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (error) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BiError className="w-5 h-5 text-red-500" />
            Crypto Error
          </h3>
          <button
            onClick={refetch}
            className="btn-icon"
            aria-label="Retry"
          >
            <BiRefresh className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-monks-gray-light">{error}</p>
      </div>
    );
  }

  if (isLoading || cryptos.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-monks-purple/20 rounded w-32 animate-pulse" />
          <div className="w-8 h-8 bg-monks-purple/20 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-monks-purple/20 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-monks-purple/20 rounded w-20 animate-pulse" />
                <div className="h-3 bg-monks-purple/20 rounded w-16 animate-pulse" />
              </div>
              <div className="h-4 bg-monks-purple/20 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 animate-fade-in hover:bg-monks-purple/5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">₿</span>
          Cryptocurrency
        </h3>
        <button
          onClick={refetch}
          className="btn-icon hover:rotate-180 transition-transform duration-500"
          aria-label="Refresh crypto prices"
        >
          <BiRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Crypto List */}
      <div className="space-y-3">
        {cryptos.map((crypto) => {
          const isPositive = crypto.priceChangePercentage24h >= 0;

          return (
            <div
              key={crypto.id}
              className="flex items-center gap-3 p-3 bg-monks-blue/20 rounded-lg hover:bg-monks-blue/30 transition-colors"
            >
              {/* Crypto Icon */}
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-8 h-8 rounded-full"
                loading="lazy"
              />

              {/* Crypto Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">
                    {crypto.symbol}
                  </span>
                  <span className="text-xs text-monks-gray-light truncate">
                    {crypto.name}
                  </span>
                </div>
                <div className="text-xs text-monks-gray-light">
                  {formatPrice(crypto.currentPrice)}
                </div>
              </div>

              {/* Price Change */}
              <div className="text-right">
                <div
                  className={clsx(
                    'flex items-center gap-1 text-sm font-semibold',
                    isPositive ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  {isPositive ? (
                    <BiTrendingUp className="w-4 h-4" />
                  ) : (
                    <BiTrendingDown className="w-4 h-4" />
                  )}
                  <span>{formatPercentage(crypto.priceChangePercentage24h)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last Update Info */}
      <div className="mt-4 text-xs text-monks-gray-light text-center">
        Updates every 30 seconds
      </div>
    </div>
  );
}
