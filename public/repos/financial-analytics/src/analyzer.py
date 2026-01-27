"""
Financial Analytics Engine
===========================
Technical and Fundamental Analysis for Securities

Author: Bijay Soti
License: MIT
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import numpy as np
from datetime import datetime, timedelta
import random


class Trend(Enum):
    """Price trend direction."""
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"


class Signal(Enum):
    """Trading signal."""
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"


class RiskLevel(Enum):
    """Risk assessment level."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class MovingAverages:
    """Moving averages analysis."""
    ma20: str  # above/below price
    ma50: str  # above/below price
    ma200: Optional[str] = None
    signal: Signal = Signal.HOLD
    
    def to_dict(self) -> Dict:
        result = {
            "ma20": self.ma20,
            "ma50": self.ma50,
            "signal": self.signal.value
        }
        if self.ma200:
            result["ma200"] = self.ma200
        return result


@dataclass
class RSI:
    """Relative Strength Index analysis."""
    value: float
    signal: str  # overbought/oversold/neutral
    
    def to_dict(self) -> Dict:
        return {
            "value": round(self.value, 1),
            "signal": self.signal
        }


@dataclass
class MACD:
    """MACD analysis."""
    value: float
    signal_line: float
    histogram: float
    signal: str  # bullish/bearish crossover
    
    def to_dict(self) -> Dict:
        return {
            "signal": self.signal
        }


@dataclass
class TechnicalAnalysis:
    """Complete technical analysis."""
    trend: Trend
    moving_averages: MovingAverages
    rsi: RSI
    macd: MACD
    support_level: float
    resistance_level: float
    
    def to_dict(self) -> Dict:
        return {
            "trend": self.trend.value,
            "movingAverages": self.moving_averages.to_dict(),
            "rsi": self.rsi.to_dict(),
            "macd": self.macd.to_dict()
        }


@dataclass
class FundamentalAnalysis:
    """Fundamental analysis metrics."""
    pe_ratio: float
    pb_ratio: float
    market_cap: str
    dividend_yield: Optional[float]
    eps: float
    revenue_growth: float
    sentiment: str  # positive/negative/neutral
    
    def to_dict(self) -> Dict:
        return {
            "peRatio": f"{self.pe_ratio:.1f}",
            "marketCap": self.market_cap,
            "sentiment": self.sentiment
        }


@dataclass
class Prediction:
    """Price prediction."""
    short_term: str  # up/down/sideways
    confidence: int
    target_price: Optional[float]
    reasoning: str
    
    def to_dict(self) -> Dict:
        return {
            "shortTerm": self.short_term,
            "confidence": self.confidence,
            "reasoning": self.reasoning
        }


@dataclass
class AnalysisResult:
    """Complete analysis result."""
    ticker: str
    current_price: float
    technical: TechnicalAnalysis
    fundamental: FundamentalAnalysis
    prediction: Prediction
    risk_level: RiskLevel
    recommendation: str
    
    def to_dict(self) -> Dict:
        return {
            "ticker": self.ticker.upper(),
            "technicalAnalysis": self.technical.to_dict(),
            "fundamentalAnalysis": self.fundamental.to_dict(),
            "prediction": self.prediction.to_dict(),
            "riskLevel": self.risk_level.value,
            "recommendation": self.recommendation
        }


class FinancialAnalyzer:
    """
    Financial analysis engine providing technical and fundamental analysis.
    
    Features:
    - Moving Average analysis (20, 50, 200 day)
    - RSI calculation and interpretation
    - MACD signal detection
    - Fundamental metrics analysis
    - Risk assessment
    - Price predictions
    """
    
    # Sample stock database for demo
    SAMPLE_STOCKS = {
        "AAPL": {"name": "Apple Inc.", "sector": "Technology", "base_price": 178.50},
        "GOOGL": {"name": "Alphabet Inc.", "sector": "Technology", "base_price": 141.20},
        "MSFT": {"name": "Microsoft Corp.", "sector": "Technology", "base_price": 378.90},
        "AMZN": {"name": "Amazon.com Inc.", "sector": "Consumer Cyclical", "base_price": 178.25},
        "TSLA": {"name": "Tesla Inc.", "sector": "Automotive", "base_price": 248.50},
        "NVDA": {"name": "NVIDIA Corp.", "sector": "Technology", "base_price": 875.30},
        "META": {"name": "Meta Platforms", "sector": "Technology", "base_price": 505.75},
        "BRK": {"name": "Berkshire Hathaway", "sector": "Financial", "base_price": 408.20},
        "JPM": {"name": "JPMorgan Chase", "sector": "Financial", "base_price": 198.50},
        "V": {"name": "Visa Inc.", "sector": "Financial", "base_price": 278.30},
    }
    
    def __init__(self):
        """Initialize the analyzer."""
        pass
    
    def analyze(self, ticker: str) -> AnalysisResult:
        """
        Perform complete analysis on a stock ticker.
        
        Args:
            ticker: Stock symbol (e.g., "AAPL")
            
        Returns:
            AnalysisResult with technical, fundamental, and prediction data
        """
        ticker = ticker.upper()
        
        # Get stock info (simulated for demo)
        stock_info = self.SAMPLE_STOCKS.get(ticker, self._generate_random_stock(ticker))
        current_price = stock_info["base_price"] * (0.95 + random.random() * 0.1)
        
        # Generate analysis
        technical = self._analyze_technical(current_price)
        fundamental = self._analyze_fundamental(ticker, current_price)
        prediction = self._generate_prediction(technical, fundamental)
        risk_level = self._assess_risk(technical, fundamental)
        recommendation = self._generate_recommendation(technical, prediction, risk_level)
        
        return AnalysisResult(
            ticker=ticker,
            current_price=current_price,
            technical=technical,
            fundamental=fundamental,
            prediction=prediction,
            risk_level=risk_level,
            recommendation=recommendation
        )
    
    def _generate_random_stock(self, ticker: str) -> Dict:
        """Generate random stock data for unknown tickers."""
        return {
            "name": f"{ticker} Corp.",
            "sector": "Unknown",
            "base_price": 50 + random.random() * 200
        }
    
    def _analyze_technical(self, price: float) -> TechnicalAnalysis:
        """Perform technical analysis."""
        # Simulate price history
        prices = [price * (0.9 + random.random() * 0.2) for _ in range(200)]
        prices.append(price)
        
        # Calculate moving averages
        ma20 = np.mean(prices[-20:])
        ma50 = np.mean(prices[-50:])
        ma200 = np.mean(prices)
        
        ma20_pos = "above" if price > ma20 else "below"
        ma50_pos = "above" if price > ma50 else "below"
        
        # Determine MA signal
        if price > ma20 > ma50:
            ma_signal = Signal.BUY
        elif price < ma20 < ma50:
            ma_signal = Signal.SELL
        else:
            ma_signal = Signal.HOLD
        
        moving_averages = MovingAverages(
            ma20=f"{ma20_pos} price",
            ma50=f"{ma50_pos} price",
            signal=ma_signal
        )
        
        # Calculate RSI
        rsi_value = 30 + random.random() * 40  # Simulated
        if rsi_value > 70:
            rsi_signal = "overbought"
        elif rsi_value < 30:
            rsi_signal = "oversold"
        else:
            rsi_signal = "neutral"
        
        rsi = RSI(value=rsi_value, signal=rsi_signal)
        
        # Calculate MACD
        macd_value = random.random() * 2 - 1
        signal_line = random.random() * 2 - 1
        histogram = macd_value - signal_line
        
        if macd_value > signal_line:
            macd_signal = "bullish crossover"
        else:
            macd_signal = "bearish crossover"
        
        macd = MACD(
            value=macd_value,
            signal_line=signal_line,
            histogram=histogram,
            signal=macd_signal
        )
        
        # Determine trend
        if price > ma20 and rsi_value < 70:
            trend = Trend.BULLISH
        elif price < ma20 and rsi_value > 30:
            trend = Trend.BEARISH
        else:
            trend = Trend.NEUTRAL
        
        # Support/Resistance levels
        support = price * 0.95
        resistance = price * 1.05
        
        return TechnicalAnalysis(
            trend=trend,
            moving_averages=moving_averages,
            rsi=rsi,
            macd=macd,
            support_level=support,
            resistance_level=resistance
        )
    
    def _analyze_fundamental(self, ticker: str, price: float) -> FundamentalAnalysis:
        """Perform fundamental analysis."""
        # Simulated fundamental metrics
        pe_ratio = 15 + random.random() * 25
        pb_ratio = 1 + random.random() * 5
        eps = price / pe_ratio
        
        # Market cap calculation (simulated shares outstanding)
        shares = random.randint(100, 5000) * 1_000_000
        market_cap = price * shares
        
        if market_cap >= 1_000_000_000_000:
            market_cap_str = f"${market_cap / 1_000_000_000_000:.1f}T"
        elif market_cap >= 1_000_000_000:
            market_cap_str = f"${market_cap / 1_000_000_000:.1f}B"
        else:
            market_cap_str = f"${market_cap / 1_000_000:.1f}M"
        
        revenue_growth = -5 + random.random() * 30
        dividend_yield = random.random() * 3 if random.random() > 0.3 else None
        
        # Determine sentiment based on fundamentals
        if pe_ratio < 20 and revenue_growth > 10:
            sentiment = "positive"
        elif pe_ratio > 30 or revenue_growth < 0:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return FundamentalAnalysis(
            pe_ratio=pe_ratio,
            pb_ratio=pb_ratio,
            market_cap=market_cap_str,
            dividend_yield=dividend_yield,
            eps=eps,
            revenue_growth=revenue_growth,
            sentiment=sentiment
        )
    
    def _generate_prediction(
        self, 
        technical: TechnicalAnalysis, 
        fundamental: FundamentalAnalysis
    ) -> Prediction:
        """Generate price prediction."""
        # Combine technical and fundamental signals
        tech_score = 0
        if technical.trend == Trend.BULLISH:
            tech_score += 1
        elif technical.trend == Trend.BEARISH:
            tech_score -= 1
        
        if technical.rsi.signal == "oversold":
            tech_score += 1
        elif technical.rsi.signal == "overbought":
            tech_score -= 1
        
        if fundamental.sentiment == "positive":
            tech_score += 1
        elif fundamental.sentiment == "negative":
            tech_score -= 1
        
        if tech_score > 0:
            short_term = "up"
            confidence = 60 + int(tech_score * 10)
        elif tech_score < 0:
            short_term = "down"
            confidence = 60 + int(abs(tech_score) * 10)
        else:
            short_term = "sideways"
            confidence = 50
        
        confidence = min(85, max(40, confidence + random.randint(-10, 10)))
        
        # Generate reasoning
        reasons = []
        if technical.trend != Trend.NEUTRAL:
            reasons.append(f"{technical.trend.value} trend")
        reasons.append(f"RSI at {technical.rsi.value:.0f}")
        reasons.append(f"P/E of {fundamental.pe_ratio:.1f}")
        
        reasoning = f"Based on {', '.join(reasons[:3])}"
        
        return Prediction(
            short_term=short_term,
            confidence=confidence,
            target_price=None,  # Would require more complex calculation
            reasoning=reasoning
        )
    
    def _assess_risk(
        self, 
        technical: TechnicalAnalysis, 
        fundamental: FundamentalAnalysis
    ) -> RiskLevel:
        """Assess investment risk level."""
        risk_score = 0
        
        # High volatility indicators
        if technical.rsi.value > 70 or technical.rsi.value < 30:
            risk_score += 1
        
        # High valuation
        if fundamental.pe_ratio > 35:
            risk_score += 1
        
        # Negative sentiment
        if fundamental.sentiment == "negative":
            risk_score += 1
        
        # Trend uncertainty
        if technical.trend == Trend.NEUTRAL:
            risk_score += 0.5
        
        if risk_score >= 2:
            return RiskLevel.HIGH
        elif risk_score >= 1:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
    
    def _generate_recommendation(
        self,
        technical: TechnicalAnalysis,
        prediction: Prediction,
        risk: RiskLevel
    ) -> str:
        """Generate final recommendation."""
        if prediction.short_term == "up" and risk != RiskLevel.HIGH:
            action = "Buy"
            reason = f"bullish outlook with {prediction.confidence}% confidence"
        elif prediction.short_term == "down" or risk == RiskLevel.HIGH:
            action = "Sell" if prediction.short_term == "down" else "Hold"
            reason = f"elevated risk with {technical.trend.value} trend"
        else:
            action = "Hold"
            reason = "mixed signals suggest waiting for clearer direction"
        
        return f"{action}: {reason}. {prediction.reasoning}."


if __name__ == "__main__":
    # Example usage
    analyzer = FinancialAnalyzer()
    
    tickers = ["AAPL", "GOOGL", "TSLA"]
    
    for ticker in tickers:
        print(f"\n{'='*60}")
        print(f"Analysis for {ticker}")
        print("="*60)
        
        result = analyzer.analyze(ticker)
        
        print(f"\nTechnical Analysis:")
        print(f"  Trend: {result.technical.trend.value}")
        print(f"  RSI: {result.technical.rsi.value:.1f} ({result.technical.rsi.signal})")
        print(f"  MACD: {result.technical.macd.signal}")
        
        print(f"\nFundamental Analysis:")
        print(f"  P/E Ratio: {result.fundamental.pe_ratio:.1f}")
        print(f"  Market Cap: {result.fundamental.market_cap}")
        print(f"  Sentiment: {result.fundamental.sentiment}")
        
        print(f"\nPrediction:")
        print(f"  Short-term: {result.prediction.short_term}")
        print(f"  Confidence: {result.prediction.confidence}%")
        
        print(f"\nRisk Level: {result.risk_level.value}")
        print(f"Recommendation: {result.recommendation}")
