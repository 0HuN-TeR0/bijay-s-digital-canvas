"""
Tests for NLP Gender Analysis Engine
=====================================
"""

import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from analyzer import (
    TextAnalyzer,
    SentimentResult,
    GenderAnalysis,
    SocialRepresentation,
    AnalysisResult
)


class TestTextAnalyzer:
    """Tests for TextAnalyzer class."""
    
    @pytest.fixture
    def analyzer(self):
        """Create analyzer instance."""
        return TextAnalyzer()
    
    def test_analyzer_creation(self, analyzer):
        """Test analyzer initialization."""
        assert analyzer is not None
        assert len(analyzer.MALE_TERMS) > 0
        assert len(analyzer.FEMALE_TERMS) > 0
        assert len(analyzer.NEUTRAL_TERMS) > 0
    
    def test_analyze_returns_result(self, analyzer):
        """Test that analyze returns complete result."""
        text = "The team worked hard on the project."
        result = analyzer.analyze(text)
        
        assert isinstance(result, AnalysisResult)
        assert result.sentiment is not None
        assert result.gender_analysis is not None
        assert result.social_representation is not None
        assert result.recommendations is not None


class TestSentimentAnalysis:
    """Tests for sentiment analysis."""
    
    @pytest.fixture
    def analyzer(self):
        return TextAnalyzer()
    
    def test_positive_sentiment(self, analyzer):
        """Test positive text detection."""
        text = "This is excellent, amazing, and wonderful news!"
        result = analyzer.analyze(text)
        
        assert result.sentiment.overall == "positive"
        assert result.sentiment.score > 0.5
    
    def test_negative_sentiment(self, analyzer):
        """Test negative text detection."""
        text = "This is terrible, awful, and disappointing."
        result = analyzer.analyze(text)
        
        assert result.sentiment.overall == "negative"
        assert result.sentiment.score < 0.5
    
    def test_neutral_sentiment(self, analyzer):
        """Test neutral text detection."""
        text = "The meeting is scheduled for tomorrow at three."
        result = analyzer.analyze(text)
        
        assert result.sentiment.overall == "neutral"
    
    def test_sentiment_breakdown(self, analyzer):
        """Test sentiment breakdown structure."""
        text = "Good progress but some problems remain."
        result = analyzer.analyze(text)
        
        breakdown = result.sentiment.breakdown
        assert "positive" in breakdown
        assert "negative" in breakdown
        assert "neutral" in breakdown


class TestGenderAnalysis:
    """Tests for gender reference detection."""
    
    @pytest.fixture
    def analyzer(self):
        return TextAnalyzer()
    
    def test_male_reference_detection(self, analyzer):
        """Test detection of male references."""
        text = "He told him that his brother was successful."
        result = analyzer.analyze(text)
        
        assert result.gender_analysis.male_references > 0
    
    def test_female_reference_detection(self, analyzer):
        """Test detection of female references."""
        text = "She told her that her sister was successful."
        result = analyzer.analyze(text)
        
        assert result.gender_analysis.female_references > 0
    
    def test_neutral_reference_detection(self, analyzer):
        """Test detection of neutral references."""
        text = "They told them that everyone was included."
        result = analyzer.analyze(text)
        
        assert result.gender_analysis.neutral_references > 0
    
    def test_gendered_title_detection(self, analyzer):
        """Test detection of gendered job titles."""
        text = "The chairman and salesmen met with the fireman."
        result = analyzer.analyze(text)
        
        assert len(result.gender_analysis.bias_indicators) >= 2
        assert "chairman" in result.gender_analysis.bias_indicators
        assert "salesmen" in result.gender_analysis.bias_indicators
    
    def test_bias_score_balanced(self, analyzer):
        """Test bias score for balanced text."""
        text = "They worked together as a team of employees."
        result = analyzer.analyze(text)
        
        # Neutral text should have low bias score
        assert result.gender_analysis.bias_score < 0.5
    
    def test_bias_score_imbalanced(self, analyzer):
        """Test bias score for imbalanced text."""
        text = "He told him about his work with the chairman and salesmen."
        result = analyzer.analyze(text)
        
        # Male-dominated text should have higher bias score
        assert result.gender_analysis.bias_score > 0.2


class TestSocialRepresentation:
    """Tests for social representation analysis."""
    
    @pytest.fixture
    def analyzer(self):
        return TextAnalyzer()
    
    def test_theme_detection_work(self, analyzer):
        """Test work theme detection."""
        text = "The job requires hard work from every employee in the office."
        result = analyzer.analyze(text)
        
        themes = [t.lower() for t in result.social_representation.dominant_themes]
        assert any("work" in t for t in themes)
    
    def test_theme_detection_leadership(self, analyzer):
        """Test leadership theme detection."""
        text = "The CEO and manager met with the director about executive decisions."
        result = analyzer.analyze(text)
        
        themes = [t.lower() for t in result.social_representation.dominant_themes]
        assert any("leadership" in t for t in themes)
    
    def test_observations_generated(self, analyzer):
        """Test that observations are generated."""
        text = "The team achieved their goals together."
        result = analyzer.analyze(text)
        
        assert len(result.social_representation.observations) > 0
    
    def test_representation_score(self, analyzer):
        """Test representation score calculation."""
        text = "Everyone on the team contributed to the success."
        result = analyzer.analyze(text)
        
        assert 0 <= result.social_representation.representation_score <= 1


class TestRecommendations:
    """Tests for inclusive language recommendations."""
    
    @pytest.fixture
    def analyzer(self):
        return TextAnalyzer()
    
    def test_gendered_title_recommendations(self, analyzer):
        """Test recommendations for gendered titles."""
        text = "The chairman addressed the salesmen."
        result = analyzer.analyze(text)
        
        # Should recommend alternatives
        recs_text = " ".join(result.recommendations).lower()
        assert "chairperson" in recs_text or "salesperson" in recs_text or "salespeople" in recs_text
    
    def test_balanced_text_recommendations(self, analyzer):
        """Test recommendations for already balanced text."""
        text = "The team members worked together collaboratively."
        result = analyzer.analyze(text)
        
        # Should have positive feedback or minimal recommendations
        assert len(result.recommendations) >= 1
    
    def test_recommendation_limit(self, analyzer):
        """Test that recommendations are limited."""
        text = "The chairman, congressmen, firemen, policemen, and businessman met."
        result = analyzer.analyze(text)
        
        # Should not exceed 5 recommendations
        assert len(result.recommendations) <= 5


class TestEdgeCases:
    """Tests for edge cases."""
    
    @pytest.fixture
    def analyzer(self):
        return TextAnalyzer()
    
    def test_empty_like_text(self, analyzer):
        """Test with minimal text."""
        text = "Hello world."
        result = analyzer.analyze(text)
        
        # Should not crash
        assert result is not None
    
    def test_numbers_and_symbols(self, analyzer):
        """Test with numbers and symbols."""
        text = "The 50 employees earned $100,000 in Q4 2023!!!"
        result = analyzer.analyze(text)
        
        # Should handle gracefully
        assert result is not None
    
    def test_mixed_case(self, analyzer):
        """Test with mixed case text."""
        text = "HE and SHE and THEY all worked together."
        result = analyzer.analyze(text)
        
        assert result.gender_analysis.male_references > 0
        assert result.gender_analysis.female_references > 0
        assert result.gender_analysis.neutral_references > 0
    
    def test_to_dict_structure(self, analyzer):
        """Test result dictionary structure."""
        text = "The team achieved success."
        result = analyzer.analyze(text)
        result_dict = result.to_dict()
        
        assert "sentiment" in result_dict
        assert "genderAnalysis" in result_dict
        assert "socialRepresentation" in result_dict
        assert "recommendations" in result_dict


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
