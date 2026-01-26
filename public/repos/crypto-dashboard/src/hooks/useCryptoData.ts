import { useState, useEffect, useCallback } from 'react';

/**
 * Cryptocurrency data interface from CoinGecko API
 */
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  sparkline_in_7d: { price: number[] };
}

/**
 * Portfolio holding interface
 */
export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
}

/**
 * Custom hook for fetching cryptocurrency data from CoinGecko API
 * Includes automatic fallback to mock data on API failure
 */
export const useCryptoData = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?' +
        'vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true'
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
      setError('Failed to fetch data. Using cached data.');
      
      // Fallback mock data
      setCoins(generateMockData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  return { coins, loading, error, refetch: fetchCoins };
};

/**
 * Custom hook for portfolio management with localStorage persistence
 */
export const usePortfolio = (coins: Coin[]) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('crypto-portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = (coin: Coin, amount: number) => {
    if (amount <= 0) return false;

    setPortfolio(prev => {
      const existingIndex = prev.findIndex(p => p.coinId === coin.id);
      
      if (existingIndex >= 0) {
        // Update existing holding
        const existing = prev[existingIndex];
        const newTotal = existing.amount + amount;
        const newAvgPrice = (
          (existing.amount * existing.avgPrice) + 
          (amount * coin.current_price)
        ) / newTotal;
        
        const updated = [...prev];
        updated[existingIndex] = { 
          ...existing, 
          amount: newTotal, 
          avgPrice: newAvgPrice 
        };
        return updated;
      }
      
      // Add new holding
      return [...prev, {
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        amount,
        avgPrice: coin.current_price,
      }];
    });

    return true;
  };

  const removeFromPortfolio = (coinId: string) => {
    setPortfolio(prev => prev.filter(p => p.coinId !== coinId));
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const coin = coins.find(c => c.id === item.coinId);
      const price = coin?.current_price ?? item.avgPrice;
      return total + (price * item.amount);
    }, 0);
  };

  const calculatePortfolioPL = () => {
    return portfolio.reduce((total, item) => {
      const coin = coins.find(c => c.id === item.coinId);
      if (!coin) return total;
      return total + ((coin.current_price - item.avgPrice) * item.amount);
    }, 0);
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    portfolioValue: calculatePortfolioValue(),
    portfolioPL: calculatePortfolioPL(),
  };
};

/**
 * Generate sparkline-compatible random price data
 */
const generateSparkline = (basePrice: number): number[] => {
  return Array.from({ length: 168 }, () => 
    basePrice * (0.95 + Math.random() * 0.1)
  );
};

/**
 * Generate mock data for API fallback
 */
const generateMockData = (): Coin[] => [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    current_price: 67234.12,
    market_cap: 1320000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.34,
    total_volume: 28000000000,
    sparkline_in_7d: { price: generateSparkline(65000) },
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    current_price: 3456.78,
    market_cap: 415000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.23,
    total_volume: 15000000000,
    sparkline_in_7d: { price: generateSparkline(3400) },
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    current_price: 178.45,
    market_cap: 82000000000,
    market_cap_rank: 4,
    price_change_percentage_24h: 5.67,
    total_volume: 3500000000,
    sparkline_in_7d: { price: generateSparkline(170) },
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    current_price: 0.89,
    market_cap: 31000000000,
    market_cap_rank: 8,
    price_change_percentage_24h: 3.45,
    total_volume: 890000000,
    sparkline_in_7d: { price: generateSparkline(0.85) },
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    current_price: 8.23,
    market_cap: 12000000000,
    market_cap_rank: 12,
    price_change_percentage_24h: -2.11,
    total_volume: 340000000,
    sparkline_in_7d: { price: generateSparkline(8.0) },
  },
];

/**
 * Format large numbers to readable format
 */
export const formatNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

/**
 * Format price based on value magnitude
 */
export const formatPrice = (price: number): string => {
  if (price < 1) return `$${price.toFixed(6)}`;
  return `$${price.toLocaleString()}`;
};

/**
 * SVG Sparkline Chart Component
 */
export const SparklineChart = ({ 
  data, 
  width = 120, 
  height = 40 
}: { 
  data: number[]; 
  width?: number; 
  height?: number;
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] > data[0];
  const color = isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';

  return `
    <svg width="${width}" height="${height}" style="overflow: visible;">
      <polyline
        points="${points}"
        fill="none"
        stroke="${color}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
};
