# Crypto Dashboard - Real-Time Cryptocurrency Analytics

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)

> **🎯 Live Demo:** [bijaysoti.com.np/demo/crypto](https://bijaysoti.com.np/demo/crypto)

## 🧠 Overview

A production-grade cryptocurrency dashboard featuring real-time market data from CoinGecko API, interactive sparkline charts, and a portfolio tracker with local storage persistence.

## ✨ Features

- **Real-Time Data**: Live prices for 50+ cryptocurrencies via CoinGecko API
- **Sparkline Charts**: 7-day price history visualizations
- **Portfolio Tracker**: Add holdings, track P/L, with local storage persistence
- **Search & Filter**: Instantly find any cryptocurrency
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CRYPTO DASHBOARD                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  PORTFOLIO OVERVIEW                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │   │
│  │  │ Total    │  │ P/L      │  │ Holdings │               │   │
│  │  │ $12,450  │  │ +$1,230  │  │ 5 coins  │               │   │
│  │  └──────────┘  └──────────┘  └──────────┘               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   YOUR HOLDINGS                           │   │
│  │  BTC: 0.5 ($33,500) +$2,100                              │   │
│  │  ETH: 2.0 ($6,900)  -$200                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   MARKET DATA                             │   │
│  │  ┌────┬──────────┬─────────┬────────┬─────────┬───────┐  │   │
│  │  │ #  │ Coin     │ Price   │ 24h %  │ Mcap    │ Chart │  │   │
│  │  ├────┼──────────┼─────────┼────────┼─────────┼───────┤  │   │
│  │  │ 1  │ Bitcoin  │ $67,234 │ +2.34% │ $1.32T  │ ╱╲╱   │  │   │
│  │  │ 2  │ Ethereum │ $3,456  │ -1.23% │ $415B   │ ╲╱╲   │  │   │
│  │  └────┴──────────┴─────────┴────────┴─────────┴───────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │ CoinGecko    │  │ Local Storage    │  │ Mock Data         │  │
│  │ API (Live)   │  │ (Portfolio)      │  │ (Fallback)        │  │
│  └──────────────┘  └──────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
crypto-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── PortfolioCard.tsx   # Portfolio summary cards
│   │   ├── CoinTable.tsx       # Cryptocurrency table
│   │   ├── SparklineChart.tsx  # Mini price charts
│   │   └── HoldingsList.tsx    # User holdings display
│   ├── hooks/
│   │   ├── useCryptoData.ts    # CoinGecko API hook
│   │   └── usePortfolio.ts     # Portfolio management hook
│   ├── types/
│   │   └── crypto.ts           # TypeScript interfaces
│   ├── utils/
│   │   └── formatters.ts       # Number/currency formatters
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/0HuN-TeR0/crypto-dashboard.git
cd crypto-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 API Integration

### CoinGecko API (Free Tier)
```typescript
const fetchCryptoData = async (): Promise<Coin[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?' +
    'vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true'
  );
  return response.json();
};
```

### Portfolio State Management
```typescript
interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
}

// Persisted to localStorage
const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
  const saved = localStorage.getItem('crypto-portfolio');
  return saved ? JSON.parse(saved) : [];
});
```

## 📊 Features Deep Dive

### Sparkline Charts
SVG-based mini charts showing 7-day price history:

```typescript
const SparklineChart = ({ data }: { data: number[] }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const height = 40;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 120;
    const y = height - ((value - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');
  
  const isPositive = data[data.length - 1] > data[0];
  
  return (
    <svg width={120} height={40}>
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#22c55e' : '#ef4444'}
        strokeWidth="2"
      />
    </svg>
  );
};
```

### Number Formatting
```typescript
const formatNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};
```

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React hooks + localStorage
- **API**: CoinGecko (free tier)
- **Charts**: Custom SVG sparklines

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Bijay Soti** - AI/ML Engineer  
- Website: [bijaysoti.lovable.app](https://bijaysoti.lovable.app)
- GitHub: [@0HuN-TeR0](https://github.com/0HuN-TeR0)
