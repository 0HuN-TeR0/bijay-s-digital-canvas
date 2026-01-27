"""
Tests for Collab-Pro Matching Engine
====================================
"""

import pytest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from matcher import (
    InfluencerMatcher,
    Influencer,
    Brand,
    Platform,
    Niche,
    BudgetTier,
    SAMPLE_INFLUENCERS
)


class TestInfluencer:
    """Tests for Influencer dataclass."""
    
    def test_influencer_creation(self):
        """Test creating an influencer."""
        inf = Influencer(
            name="TestInfluencer",
            platform=Platform.YOUTUBE,
            followers=100000,
            niche=Niche.TECH,
            engagement_rate=4.5
        )
        
        assert inf.name == "TestInfluencer"
        assert inf.platform == Platform.YOUTUBE
        assert inf.followers == 100000
        assert inf.engagement_rate == 4.5
    
    def test_estimated_rate_calculation(self):
        """Test automatic rate estimation."""
        inf = Influencer(
            name="TestInfluencer",
            platform=Platform.INSTAGRAM,
            followers=500000,
            niche=Niche.FASHION,
            engagement_rate=3.0
        )
        
        # Base rate = 500000 * 0.01 = 5000
        # Engagement multiplier = 1 + (3.0 - 2) * 0.1 = 1.1
        # Expected ~ 5500
        assert inf.estimated_rate > 0
        assert inf.estimated_rate >= 100  # Minimum
    
    def test_format_followers(self):
        """Test follower count formatting."""
        inf1 = Influencer("A", Platform.YOUTUBE, 1_500_000, Niche.TECH, 3.0)
        inf2 = Influencer("B", Platform.YOUTUBE, 450_000, Niche.TECH, 3.0)
        inf3 = Influencer("C", Platform.YOUTUBE, 500, Niche.TECH, 3.0)
        
        assert inf1._format_followers() == "1.5M"
        assert inf2._format_followers() == "450K"
        assert inf3._format_followers() == "500"


class TestBrand:
    """Tests for Brand dataclass."""
    
    def test_brand_creation(self):
        """Test creating a brand."""
        brand = Brand(
            name="TechBrand",
            niche=Niche.TECH,
            target_audience="Tech professionals aged 25-40",
            budget=BudgetTier.MEDIUM,
            goals="Brand awareness"
        )
        
        assert brand.name == "TechBrand"
        assert brand.niche == Niche.TECH
    
    def test_parse_demographics(self):
        """Test parsing target demographics."""
        brand = Brand(
            name="Test",
            niche=Niche.TECH,
            target_audience="Young professionals aged 22-35",
            budget=BudgetTier.SMALL,
            goals="Awareness"
        )
        
        demo = brand.parse_target_demographics()
        assert demo["age_range"] == (22, 35)


class TestInfluencerMatcher:
    """Tests for InfluencerMatcher."""
    
    @pytest.fixture
    def matcher(self):
        """Create matcher instance."""
        return InfluencerMatcher(SAMPLE_INFLUENCERS)
    
    def test_match_returns_results(self, matcher):
        """Test that matching returns results."""
        brand = Brand(
            name="TechGear",
            niche=Niche.TECH,
            target_audience="Tech enthusiasts 20-35",
            budget=BudgetTier.MEDIUM,
            goals="Product launch"
        )
        
        matches, strategy = matcher.match(brand, k=5)
        
        assert len(matches) == 5
        assert all(m.score >= 0 for m in matches)
        assert strategy is not None
    
    def test_match_scores_in_order(self, matcher):
        """Test that matches are returned in score order."""
        brand = Brand(
            name="FitBrand",
            niche=Niche.FITNESS,
            target_audience="Fitness enthusiasts",
            budget=BudgetTier.MEDIUM,
            goals="App downloads"
        )
        
        matches, _ = matcher.match(brand, k=5)
        
        scores = [m.score for m in matches]
        assert scores == sorted(scores, reverse=True)
    
    def test_niche_alignment_scoring(self, matcher):
        """Test that niche alignment affects scores."""
        # Tech brand should match better with tech influencers
        tech_brand = Brand(
            name="TechCo",
            niche=Niche.TECH,
            target_audience="Developers",
            budget=BudgetTier.LARGE,
            goals="Awareness"
        )
        
        matches, _ = matcher.match(tech_brand, k=3)
        
        # Top matches should include tech-related niches
        niches = [m.influencer.niche for m in matches[:3]]
        assert Niche.TECH in niches or Niche.GAMING in niches or Niche.EDUCATION in niches
    
    def test_match_generates_reasons(self, matcher):
        """Test that matches include explanations."""
        brand = Brand(
            name="TestBrand",
            niche=Niche.FASHION,
            target_audience="Fashion lovers",
            budget=BudgetTier.MEDIUM,
            goals="Engagement"
        )
        
        matches, _ = matcher.match(brand, k=3)
        
        for match in matches:
            assert match.reason is not None
            assert len(match.reason) > 0


class TestScoringComponents:
    """Tests for individual scoring functions."""
    
    @pytest.fixture
    def matcher(self):
        return InfluencerMatcher(SAMPLE_INFLUENCERS)
    
    def test_niche_alignment_same_niche(self, matcher):
        """Test perfect niche alignment."""
        score = matcher._niche_alignment(Niche.TECH, Niche.TECH)
        assert score == 1.0
    
    def test_niche_alignment_adjacent(self, matcher):
        """Test adjacent niche alignment."""
        score = matcher._niche_alignment(Niche.TECH, Niche.GAMING)
        assert score == 0.6
    
    def test_niche_alignment_unrelated(self, matcher):
        """Test unrelated niche alignment."""
        score = matcher._niche_alignment(Niche.TECH, Niche.FASHION)
        assert score == 0.2
    
    def test_engagement_quality_high(self, matcher):
        """Test high engagement scoring."""
        inf = Influencer("Test", Platform.INSTAGRAM, 50000, Niche.TECH, 5.0)
        score = matcher._engagement_quality(inf)
        assert score >= 1.0  # Above benchmark
    
    def test_engagement_quality_low(self, matcher):
        """Test low engagement scoring."""
        inf = Influencer("Test", Platform.INSTAGRAM, 1000000, Niche.TECH, 0.5)
        score = matcher._engagement_quality(inf)
        assert score < 1.0  # Below benchmark
    
    def test_budget_compatibility_perfect(self, matcher):
        """Test perfect budget fit."""
        score = matcher._budget_compatibility(BudgetTier.MEDIUM, 25000)
        assert score >= 0.7
    
    def test_budget_compatibility_over(self, matcher):
        """Test over-budget scenario."""
        score = matcher._budget_compatibility(BudgetTier.MICRO, 50000)
        assert score < 0.5


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
