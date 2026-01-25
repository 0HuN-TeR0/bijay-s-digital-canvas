import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Star, Wallet, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Coin {
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

interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
}

const CryptoDashboard = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [buyAmount, setBuyAmount] = useState('');

  useEffect(() => {
    fetchCoins();
    const savedPortfolio = localStorage.getItem('crypto-portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error('Error fetching coins:', error);
      toast.error('Failed to fetch crypto data. Using cached data.');
      // Fallback mock data
      setCoins([
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 67234.12, market_cap: 1320000000000, market_cap_rank: 1, price_change_percentage_24h: 2.34, total_volume: 28000000000, sparkline_in_7d: { price: Array.from({ length: 168 }, () => 65000 + Math.random() * 5000) } },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 3456.78, market_cap: 415000000000, market_cap_rank: 2, price_change_percentage_24h: -1.23, total_volume: 15000000000, sparkline_in_7d: { price: Array.from({ length: 168 }, () => 3300 + Math.random() * 300) } },
        { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', current_price: 178.45, market_cap: 82000000000, market_cap_rank: 4, price_change_percentage_24h: 5.67, total_volume: 3500000000, sparkline_in_7d: { price: Array.from({ length: 168 }, () => 160 + Math.random() * 30) } },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', current_price: 0.89, market_cap: 31000000000, market_cap_rank: 8, price_change_percentage_24h: 3.45, total_volume: 890000000, sparkline_in_7d: { price: Array.from({ length: 168 }, () => 0.8 + Math.random() * 0.2) } },
        { id: 'polkadot', symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', current_price: 8.23, market_cap: 12000000000, market_cap_rank: 12, price_change_percentage_24h: -2.11, total_volume: 340000000, sparkline_in_7d: { price: Array.from({ length: 168 }, () => 7.5 + Math.random() * 1.5) } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToPortfolio = (coin: Coin) => {
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const existingIndex = portfolio.findIndex(p => p.coinId === coin.id);
    let newPortfolio: PortfolioItem[];

    if (existingIndex >= 0) {
      const existing = portfolio[existingIndex];
      const newTotal = existing.amount + amount;
      const newAvgPrice = ((existing.amount * existing.avgPrice) + (amount * coin.current_price)) / newTotal;
      newPortfolio = [...portfolio];
      newPortfolio[existingIndex] = { ...existing, amount: newTotal, avgPrice: newAvgPrice };
    } else {
      newPortfolio = [...portfolio, {
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        amount,
        avgPrice: coin.current_price,
      }];
    }

    setPortfolio(newPortfolio);
    localStorage.setItem('crypto-portfolio', JSON.stringify(newPortfolio));
    setBuyAmount('');
    setSelectedCoin(null);
    toast.success(`Added ${amount} ${coin.symbol.toUpperCase()} to portfolio`);
  };

  const removeFromPortfolio = (coinId: string) => {
    const newPortfolio = portfolio.filter(p => p.coinId !== coinId);
    setPortfolio(newPortfolio);
    localStorage.setItem('crypto-portfolio', JSON.stringify(newPortfolio));
    toast.success('Removed from portfolio');
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const coin = coins.find(c => c.id === item.coinId);
      return total + (coin ? coin.current_price * item.amount : item.avgPrice * item.amount);
    }, 0);
  };

  const calculatePortfolioPL = () => {
    return portfolio.reduce((total, item) => {
      const coin = coins.find(c => c.id === item.coinId);
      if (coin) {
        return total + ((coin.current_price - item.avgPrice) * item.amount);
      }
      return total;
    }, 0);
  };

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const SparklineChart = ({ data }: { data: number[] }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 120;
    const height = 40;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] > data[0];

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/#projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-mono text-foreground">Crypto Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time cryptocurrency analytics</p>
              </div>
            </div>
            <Button onClick={fetchCoins} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatNumber(calculatePortfolioValue())}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total P/L</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold font-mono ${calculatePortfolioPL() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculatePortfolioPL() >= 0 ? '+' : ''}{formatNumber(calculatePortfolioPL())}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Holdings</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{portfolio.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Holdings */}
        {portfolio.length > 0 && (
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="font-mono">Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map(item => {
                  const coin = coins.find(c => c.id === item.coinId);
                  const currentValue = coin ? coin.current_price * item.amount : item.avgPrice * item.amount;
                  const pl = coin ? (coin.current_price - item.avgPrice) * item.amount : 0;
                  
                  return (
                    <div key={item.coinId} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.amount} {item.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold">{formatNumber(currentValue)}</p>
                        <p className={`text-sm ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {pl >= 0 ? '+' : ''}{formatNumber(pl)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFromPortfolio(item.coinId)}>
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-secondary border-border"
          />
        </div>

        {/* Coin Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Coin</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">24h %</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Market Cap</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">7d Chart</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border animate-pulse">
                        <td className="p-4"><div className="h-4 w-8 bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                        <td className="p-4"><div className="h-4 w-24 bg-muted rounded ml-auto" /></td>
                        <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                        <td className="p-4"><div className="h-4 w-24 bg-muted rounded ml-auto" /></td>
                        <td className="p-4"><div className="h-8 w-24 bg-muted rounded ml-auto" /></td>
                        <td className="p-4"><div className="h-8 w-16 bg-muted rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    filteredCoins.map((coin) => (
                      <motion.tr
                        key={coin.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="p-4 font-mono text-muted-foreground">{coin.market_cap_rank}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-semibold">{coin.name}</p>
                              <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono">
                          ${coin.current_price < 1 ? coin.current_price.toFixed(6) : coin.current_price.toLocaleString()}
                        </td>
                        <td className={`p-4 text-right font-mono ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono text-muted-foreground">
                          {formatNumber(coin.market_cap)}
                        </td>
                        <td className="p-4 text-right">
                          {coin.sparkline_in_7d && <SparklineChart data={coin.sparkline_in_7d.price} />}
                        </td>
                        <td className="p-4 text-right">
                          {selectedCoin?.id === coin.id ? (
                            <div className="flex items-center gap-2 justify-end">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={buyAmount}
                                onChange={(e) => setBuyAmount(e.target.value)}
                                className="w-24 h-8 text-sm"
                              />
                              <Button size="sm" onClick={() => addToPortfolio(coin)}>Add</Button>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedCoin(null)}>✕</Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => setSelectedCoin(coin)}>
                              <DollarSign className="h-4 w-4 mr-1" />
                              Buy
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CryptoDashboard;
