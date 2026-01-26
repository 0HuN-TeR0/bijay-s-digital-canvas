# Financial Analytics - AI Stock Analysis

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-green.svg)
![AI](https://img.shields.io/badge/AI-Gemini-orange.svg)

> **🎯 Live Demo:** [bijaysoti.lovable.app/demos/financial-analytics](https://bijaysoti.lovable.app/demos/financial-analytics)

## ⚠️ Disclaimer

**This is an educational demo. Not financial advice.** Always do your own research before making investment decisions.

## 🧠 Problem Statement

Understanding stock market indicators requires expertise in technical and fundamental analysis. This tool provides **AI-powered stock analysis** combining technical indicators (RSI, MACD, Moving Averages) with fundamental metrics and sentiment analysis.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      TICKER INPUT                                │
│                        [AAPL]                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA COLLECTION                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Price Data  │  │ Fundamentals│  │ News/Sentiment          │  │
│  │ (OHLCV)     │  │ (P/E, MCap) │  │ (Headlines)             │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYSIS ENGINES                              │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │ Technical Analysis   │  │ Fundamental Analysis             │ │
│  │ • RSI (14-period)    │  │ • P/E Ratio vs Industry         │ │
│  │ • MACD (12,26,9)     │  │ • Market Cap Classification     │ │
│  │ • MA(20), MA(50)     │  │ • Revenue/Earnings Growth       │ │
│  │ • Trend Detection    │  │ • Sector Comparison             │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
│                    ┌──────────────────────┐                     │
│                    │ Sentiment Analysis   │                     │
│                    │ • News Headlines     │                     │
│                    │ • Social Media       │                     │
│                    │ • Analyst Ratings    │                     │
│                    └──────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI SYNTHESIS                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Combine signals → Generate prediction → Assess risk        ││
│  │ → Produce recommendation with reasoning                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       OUTPUT                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │  Technical │ │Fundamental │ │ Prediction │ │Recommendation│  │
│  │  Signals   │ │  Summary   │ │ 65% conf.  │ │ HOLD (Medium)│  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔬 Technical Indicators

### RSI (Relative Strength Index)
```python
def calculate_rsi(prices: List[float], period: int = 14) -> float:
    """
    RSI measures momentum on a 0-100 scale.
    - RSI > 70: Overbought (potential sell signal)
    - RSI < 30: Oversold (potential buy signal)
    """
    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    
    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])
    
    rs = avg_gain / avg_loss if avg_loss != 0 else 100
    return 100 - (100 / (1 + rs))
```

### MACD (Moving Average Convergence Divergence)
```python
def calculate_macd(prices: List[float]) -> Tuple[float, float, str]:
    """
    MACD = EMA(12) - EMA(26)
    Signal Line = EMA(9) of MACD
    
    Bullish: MACD crosses above signal
    Bearish: MACD crosses below signal
    """
    ema12 = exponential_moving_average(prices, 12)
    ema26 = exponential_moving_average(prices, 26)
    macd = ema12 - ema26
    signal = exponential_moving_average(macd_history, 9)
    
    return macd, signal, "Bullish" if macd > signal else "Bearish"
```

## 📁 Project Structure

```
financial-analytics/
├── src/
│   ├── analyzer.py         # Core analysis engine
│   ├── technical.py        # Technical indicators
│   ├── fundamental.py      # Fundamental analysis
│   ├── sentiment.py        # News sentiment analysis
│   └── api.py              # REST API endpoints
├── tests/
│   └── test_indicators.py  # Unit tests
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

```bash
git clone https://github.com/0HuN-TeR0/financial-analytics.git
cd financial-analytics
pip install -r requirements.txt
python src/api.py
```

## 📊 API Reference

### POST /analyze

**Request:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "technicalAnalysis": {
    "trend": "bullish",
    "rsi": { "value": 58, "signal": "neutral" },
    "macd": { "signal": "bullish crossover" },
    "movingAverages": { "ma20": "above price", "signal": "buy" }
  },
  "fundamentalAnalysis": {
    "peRatio": "28.5",
    "marketCap": "$2.8T",
    "sentiment": "positive"
  },
  "prediction": {
    "shortTerm": "up",
    "confidence": 72,
    "reasoning": "Strong technical momentum with positive market sentiment..."
  },
  "riskLevel": "medium",
  "recommendation": "HOLD - Strong fundamentals but approaching resistance levels..."
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Bijay Soti** - AI/ML Engineer  
- Website: [bijaysoti.lovable.app](https://bijaysoti.lovable.app)
- GitHub: [@0HuN-TeR0](https://github.com/0HuN-TeR0)
