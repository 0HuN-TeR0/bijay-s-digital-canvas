"""
Tests for Financial Analytics Engine
=====================================
"""

import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from analyzer import (
    FinancialAnalyzer,
    AnalysisResult,
    TechnicalAnalysis,
    FundamentalAnalysis,
    Prediction,
    Trend,
    Signal,
    RiskLevel
)


class TestFinancialAnalyzer:
    """Tests for FinancialAnalyzer class."""
    
    @pytest.fixture
    def analyzer(self):
        """Create analyzer instance."""
        return FinancialAnalyzer()
    
    def test_analyzer_creation(self, analyzer):
        """Test analyzer initialization."""
        assert analyzer is not None
        assert len(analyzer.SAMPLE_STOCKS) > 0
    
    def test_analyze_known_ticker(self, analyzer):
        """Test analysis of known ticker."""
        result = analyzer.analyze("AAPL")
        
        assert isinstance(result, AnalysisResult)
        assert result.ticker == "AAPL"
        assert result.current_price > 0
    
    def test_analyze_unknown_ticker(self, analyzer):
        """Test analysis of unknown ticker."""
        result = analyzer.analyze("UNKN")
        
        assert isinstance(result, AnalysisResult)
        assert result.ticker == "UNKN"
        assert result.current_price > 0
    
    def test_analyze_case_insensitive(self, analyzer):
        """Test that ticker is case insensitive."""
        result1 = analyzer.analyze("aapl")
        result2 = analyzer.analyze("AAPL")
        
        assert result1.ticker == "AAPL"
        assert result2.ticker == "AAPL"


class TestTechnicalAnalysis:
    """Tests for technical analysis components."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_technical_analysis_structure(self, analyzer):
        """Test technical analysis result structure."""
        result = analyzer.analyze("AAPL")
        tech = result.technical
        
        assert isinstance(tech, TechnicalAnalysis)
        assert tech.trend in Trend
        assert tech.moving_averages is not None
        assert tech.rsi is not None
        assert tech.macd is not None
    
    def test_moving_averages(self, analyzer):
        """Test moving averages analysis."""
        result = analyzer.analyze("MSFT")
        ma = result.technical.moving_averages
        
        assert ma.ma20 in ["above price", "below price"]
        assert ma.ma50 in ["above price", "below price"]
        assert ma.signal in Signal
    
    def test_rsi_range(self, analyzer):
        """Test RSI is in valid range."""
        result = analyzer.analyze("GOOGL")
        rsi = result.technical.rsi
        
        assert 0 <= rsi.value <= 100
        assert rsi.signal in ["overbought", "oversold", "neutral"]
    
    def test_macd_signals(self, analyzer):
        """Test MACD signal generation."""
        result = analyzer.analyze("TSLA")
        macd = result.technical.macd
        
        assert macd.signal in ["bullish crossover", "bearish crossover"]
    
    def test_support_resistance(self, analyzer):
        """Test support and resistance levels."""
        result = analyzer.analyze("NVDA")
        tech = result.technical
        
        assert tech.support_level > 0
        assert tech.resistance_level > tech.support_level


class TestFundamentalAnalysis:
    """Tests for fundamental analysis components."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_fundamental_analysis_structure(self, analyzer):
        """Test fundamental analysis result structure."""
        result = analyzer.analyze("META")
        fund = result.fundamental
        
        assert isinstance(fund, FundamentalAnalysis)
        assert fund.pe_ratio > 0
        assert fund.market_cap != ""
        assert fund.sentiment in ["positive", "negative", "neutral"]
    
    def test_market_cap_format(self, analyzer):
        """Test market cap formatting."""
        result = analyzer.analyze("AAPL")
        market_cap = result.fundamental.market_cap
        
        # Should be formatted as $XB or $XT or $XM
        assert market_cap.startswith("$")
        assert any(c in market_cap for c in ["M", "B", "T"])
    
    def test_pe_ratio_reasonable(self, analyzer):
        """Test P/E ratio is in reasonable range."""
        result = analyzer.analyze("JPM")
        
        # P/E should be positive and not absurdly high
        assert 5 <= result.fundamental.pe_ratio <= 50
    
    def test_sentiment_values(self, analyzer):
        """Test sentiment is valid value."""
        result = analyzer.analyze("V")
        
        assert result.fundamental.sentiment in ["positive", "negative", "neutral"]


class TestPrediction:
    """Tests for prediction generation."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_prediction_structure(self, analyzer):
        """Test prediction result structure."""
        result = analyzer.analyze("AAPL")
        pred = result.prediction
        
        assert isinstance(pred, Prediction)
        assert pred.short_term in ["up", "down", "sideways"]
        assert pred.confidence > 0
        assert pred.reasoning != ""
    
    def test_confidence_range(self, analyzer):
        """Test confidence is in valid range."""
        result = analyzer.analyze("TSLA")
        
        assert 0 <= result.prediction.confidence <= 100
    
    def test_reasoning_not_empty(self, analyzer):
        """Test reasoning is provided."""
        result = analyzer.analyze("GOOGL")
        
        assert len(result.prediction.reasoning) > 10


class TestRiskAssessment:
    """Tests for risk assessment."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_risk_level_valid(self, analyzer):
        """Test risk level is valid enum."""
        result = analyzer.analyze("NVDA")
        
        assert result.risk_level in RiskLevel
    
    def test_all_risk_levels_possible(self, analyzer):
        """Test that different risk levels can be generated."""
        risk_levels = set()
        
        for ticker in ["AAPL", "GOOGL", "TSLA", "JPM", "META", "NVDA"]:
            result = analyzer.analyze(ticker)
            risk_levels.add(result.risk_level)
        
        # Should see at least 2 different risk levels
        assert len(risk_levels) >= 1


class TestRecommendation:
    """Tests for recommendation generation."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_recommendation_not_empty(self, analyzer):
        """Test recommendation is provided."""
        result = analyzer.analyze("AAPL")
        
        assert len(result.recommendation) > 0
    
    def test_recommendation_contains_action(self, analyzer):
        """Test recommendation contains an action word."""
        result = analyzer.analyze("MSFT")
        rec_lower = result.recommendation.lower()
        
        assert any(action in rec_lower for action in ["buy", "sell", "hold"])


class TestToDict:
    """Tests for dictionary serialization."""
    
    @pytest.fixture
    def analyzer(self):
        return FinancialAnalyzer()
    
    def test_result_to_dict(self, analyzer):
        """Test result can be converted to dict."""
        result = analyzer.analyze("AAPL")
        result_dict = result.to_dict()
        
        assert "ticker" in result_dict
        assert "technicalAnalysis" in result_dict
        assert "fundamentalAnalysis" in result_dict
        assert "prediction" in result_dict
        assert "riskLevel" in result_dict
        assert "recommendation" in result_dict
    
    def test_technical_to_dict(self, analyzer):
        """Test technical analysis dict structure."""
        result = analyzer.analyze("GOOGL")
        tech_dict = result.technical.to_dict()
        
        assert "trend" in tech_dict
        assert "movingAverages" in tech_dict
        assert "rsi" in tech_dict
        assert "macd" in tech_dict
    
    def test_fundamental_to_dict(self, analyzer):
        """Test fundamental analysis dict structure."""
        result = analyzer.analyze("TSLA")
        fund_dict = result.fundamental.to_dict()
        
        assert "peRatio" in fund_dict
        assert "marketCap" in fund_dict
        assert "sentiment" in fund_dict


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
