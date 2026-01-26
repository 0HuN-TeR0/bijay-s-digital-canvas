"""
Collab-Pro Influencer Matching Engine
======================================
AI-Powered Influencer Marketing Platform

Author: Bijay Soti
License: MIT
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import math
import numpy as np


class Platform(Enum):
    """Social media platforms."""
    INSTAGRAM = "Instagram"
    YOUTUBE = "YouTube"
    TIKTOK = "TikTok"
    TWITTER = "Twitter/X"
    LINKEDIN = "LinkedIn"


class Niche(Enum):
    """Content niches/categories."""
    TECH = "Technology"
    FASHION = "Fashion & Beauty"
    FITNESS = "Fitness & Health"
    GAMING = "Gaming"
    FOOD = "Food & Lifestyle"
    FINANCE = "Finance & Business"
    TRAVEL = "Travel"
    EDUCATION = "Education"


class BudgetTier(Enum):
    """Campaign budget tiers."""
    MICRO = ("micro", 500, 2000)
    SMALL = ("small", 2000, 10000)
    MEDIUM = ("medium", 10000, 50000)
    LARGE = ("large", 50000, 200000)
    ENTERPRISE = ("enterprise", 200000, float('inf'))
    
    @property
    def range(self) -> Tuple[float, float]:
        return (self.value[1], self.value[2])


@dataclass
class Influencer:
    """Represents an influencer profile."""
    name: str
    platform: Platform
    followers: int
    niche: Niche
    engagement_rate: float  # Percentage
    avg_views: Optional[int] = None
    estimated_rate: float = 0  # USD per post
    audience_age_range: Tuple[int, int] = (18, 45)
    audience_demographics: Dict[str, float] = field(default_factory=dict)
    brand_safety_score: float = 0.9
    
    def __post_init__(self):
        if self.estimated_rate == 0:
            self.estimated_rate = self._estimate_rate()
    
    def _estimate_rate(self) -> float:
        """Estimate influencer rate based on followers and engagement."""
        base_rate = self.followers * 0.01  # $0.01 per follower base
        engagement_multiplier = 1 + (self.engagement_rate - 2) * 0.1
        return max(100, base_rate * engagement_multiplier)
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "platform": self.platform.value,
            "followers": self._format_followers(),
            "niche": self.niche.value,
            "engagementRate": f"{self.engagement_rate:.1f}%"
        }
    
    def _format_followers(self) -> str:
        if self.followers >= 1_000_000:
            return f"{self.followers / 1_000_000:.1f}M"
        if self.followers >= 1_000:
            return f"{self.followers / 1_000:.0f}K"
        return str(self.followers)


@dataclass
class Brand:
    """Represents a brand's campaign requirements."""
    name: str
    niche: Niche
    target_audience: str
    budget: BudgetTier
    goals: str
    
    def parse_target_demographics(self) -> Dict[str, any]:
        """Parse target audience string into structured demographics."""
        demographics = {
            "age_range": (25, 45),
            "interests": [],
            "keywords": self.target_audience.lower().split()
        }
        
        # Extract age if mentioned
        import re
        age_match = re.search(r'(\d+)-(\d+)', self.target_audience)
        if age_match:
            demographics["age_range"] = (int(age_match.group(1)), int(age_match.group(2)))
        
        return demographics


@dataclass
class Match:
    """Represents an influencer match result."""
    influencer: Influencer
    score: float
    reason: str = ""
    
    def to_dict(self) -> Dict:
        result = self.influencer.to_dict()
        result["matchScore"] = round(self.score)
        result["reason"] = self.reason
        return result


class InfluencerMatcher:
    """
    AI-powered influencer matching engine.
    
    Uses multi-factor scoring to match brands with ideal influencers:
    - Niche alignment (content relevance)
    - Audience demographics overlap
    - Engagement quality
    - Budget compatibility
    - Brand safety
    """
    
    # Scoring weights
    NICHE_WEIGHT = 0.30
    AUDIENCE_WEIGHT = 0.25
    ENGAGEMENT_WEIGHT = 0.20
    BUDGET_WEIGHT = 0.15
    SAFETY_WEIGHT = 0.10
    
    def __init__(self, influencers: List[Influencer]):
        """Initialize with influencer database."""
        self.influencers = influencers
    
    def match(self, brand: Brand, k: int = 5) -> Tuple[List[Match], str]:
        """
        Find top K influencer matches for a brand.
        
        Args:
            brand: Brand requirements
            k: Number of matches to return
            
        Returns:
            Tuple of (matches, strategy recommendation)
        """
        scores = []
        
        for influencer in self.influencers:
            score = self._calculate_match_score(brand, influencer)
            scores.append((influencer, score))
        
        # Sort by score descending
        scores.sort(key=lambda x: x[1], reverse=True)
        
        # Create match objects with explanations
        matches = []
        for influencer, score in scores[:k]:
            reason = self._generate_reason(brand, influencer, score)
            matches.append(Match(influencer, score, reason))
        
        strategy = self._generate_strategy(brand, matches)
        
        return matches, strategy
    
    def _calculate_match_score(self, brand: Brand, influencer: Influencer) -> float:
        """Calculate composite match score."""
        niche_score = self._niche_alignment(brand.niche, influencer.niche)
        audience_score = self._audience_overlap(brand, influencer)
        engagement_score = self._engagement_quality(influencer)
        budget_score = self._budget_compatibility(brand.budget, influencer.estimated_rate)
        safety_score = influencer.brand_safety_score
        
        composite = (
            self.NICHE_WEIGHT * niche_score +
            self.AUDIENCE_WEIGHT * audience_score +
            self.ENGAGEMENT_WEIGHT * engagement_score +
            self.BUDGET_WEIGHT * budget_score +
            self.SAFETY_WEIGHT * safety_score
        )
        
        return composite * 100
    
    def _niche_alignment(self, brand_niche: Niche, influencer_niche: Niche) -> float:
        """Calculate niche alignment score."""
        if brand_niche == influencer_niche:
            return 1.0
        
        # Adjacent niches get partial credit
        adjacent_niches = {
            Niche.TECH: [Niche.GAMING, Niche.EDUCATION],
            Niche.FASHION: [Niche.TRAVEL, Niche.FOOD],
            Niche.FITNESS: [Niche.FOOD, Niche.TRAVEL],
            Niche.GAMING: [Niche.TECH, Niche.EDUCATION],
            Niche.FOOD: [Niche.FITNESS, Niche.TRAVEL, Niche.FASHION],
            Niche.FINANCE: [Niche.TECH, Niche.EDUCATION],
            Niche.TRAVEL: [Niche.FOOD, Niche.FASHION, Niche.FITNESS],
            Niche.EDUCATION: [Niche.TECH, Niche.FINANCE],
        }
        
        if influencer_niche in adjacent_niches.get(brand_niche, []):
            return 0.6
        
        return 0.2
    
    def _audience_overlap(self, brand: Brand, influencer: Influencer) -> float:
        """Calculate audience demographics overlap."""
        brand_demo = brand.parse_target_demographics()
        
        # Age overlap
        brand_age = brand_demo["age_range"]
        inf_age = influencer.audience_age_range
        
        overlap_start = max(brand_age[0], inf_age[0])
        overlap_end = min(brand_age[1], inf_age[1])
        
        if overlap_end <= overlap_start:
            return 0.3
        
        overlap_range = overlap_end - overlap_start
        brand_range = brand_age[1] - brand_age[0]
        
        age_overlap = min(1.0, overlap_range / brand_range) if brand_range > 0 else 0.5
        
        # Keyword matching in target audience
        keywords = brand_demo["keywords"]
        niche_keywords = influencer.niche.value.lower().split()
        
        keyword_matches = sum(1 for kw in keywords if any(nkw in kw for nkw in niche_keywords))
        keyword_score = min(1.0, keyword_matches / max(len(keywords), 1))
        
        return 0.6 * age_overlap + 0.4 * keyword_score
    
    def _engagement_quality(self, influencer: Influencer) -> float:
        """Calculate engagement quality index."""
        # Engagement rate benchmarks by follower count
        if influencer.followers < 10000:
            benchmark = 5.0  # Micro-influencers expected higher
        elif influencer.followers < 100000:
            benchmark = 3.5
        elif influencer.followers < 1000000:
            benchmark = 2.5
        else:
            benchmark = 1.5
        
        # Score relative to benchmark
        ratio = influencer.engagement_rate / benchmark
        return min(1.0, ratio)
    
    def _budget_compatibility(self, budget: BudgetTier, estimated_rate: float) -> float:
        """Calculate budget compatibility score."""
        min_budget, max_budget = budget.range
        
        if estimated_rate <= max_budget:
            if estimated_rate >= min_budget * 0.5:
                return 1.0  # Perfect fit
            return 0.7  # Under budget but might be too small
        
        # Over budget
        over_ratio = estimated_rate / max_budget
        if over_ratio <= 1.2:
            return 0.8  # Slightly over
        if over_ratio <= 1.5:
            return 0.5  # Moderately over
        return 0.2  # Significantly over
    
    def _generate_reason(self, brand: Brand, influencer: Influencer, score: float) -> str:
        """Generate explanation for match."""
        reasons = []
        
        if influencer.niche == brand.niche:
            reasons.append(f"direct {brand.niche.value.lower()} content alignment")
        else:
            reasons.append(f"complementary {influencer.niche.value.lower()} content")
        
        if influencer.engagement_rate >= 4:
            reasons.append("exceptional engagement rate")
        elif influencer.engagement_rate >= 2.5:
            reasons.append("strong engagement metrics")
        
        if influencer.followers >= 1000000:
            reasons.append("massive reach potential")
        elif influencer.followers >= 100000:
            reasons.append("significant audience reach")
        
        return f"Strong match with {', '.join(reasons)}. Well-suited for {brand.goals.lower().split(',')[0]}."
    
    def _generate_strategy(self, brand: Brand, matches: List[Match]) -> str:
        """Generate campaign strategy recommendation."""
        platforms = set(m.influencer.platform for m in matches)
        
        if len(platforms) > 1:
            return f"Recommend a multi-platform approach across {', '.join(p.value for p in platforms)} to maximize reach. Start with the top-scoring influencer for initial campaign testing, then scale based on performance metrics."
        
        platform = matches[0].influencer.platform.value
        return f"Focus on {platform} for this campaign. Consider a tiered approach: partner with the top match for anchor content, supplemented by 2-3 additional influencers for broader reach."


# Sample influencer database
SAMPLE_INFLUENCERS = [
    Influencer("TechReviewer Pro", Platform.YOUTUBE, 1_200_000, Niche.TECH, 4.5, audience_age_range=(22, 40)),
    Influencer("CodeWithSara", Platform.YOUTUBE, 450_000, Niche.TECH, 5.2, audience_age_range=(18, 35)),
    Influencer("GadgetGuru", Platform.INSTAGRAM, 890_000, Niche.TECH, 3.8, audience_age_range=(20, 38)),
    Influencer("StyleByMia", Platform.INSTAGRAM, 2_100_000, Niche.FASHION, 3.2, audience_age_range=(18, 32)),
    Influencer("FitLifeCoach", Platform.INSTAGRAM, 1_500_000, Niche.FITNESS, 4.1, audience_age_range=(22, 45)),
    Influencer("GameStreamKing", Platform.TIKTOK, 3_500_000, Niche.GAMING, 6.8, audience_age_range=(14, 28)),
    Influencer("FinanceSimplified", Platform.YOUTUBE, 780_000, Niche.FINANCE, 4.9, audience_age_range=(25, 50)),
    Influencer("WanderlustJane", Platform.INSTAGRAM, 920_000, Niche.TRAVEL, 3.5, audience_age_range=(24, 40)),
    Influencer("ChefMasterClass", Platform.YOUTUBE, 650_000, Niche.FOOD, 4.2, audience_age_range=(28, 55)),
    Influencer("LearnWithAlex", Platform.YOUTUBE, 1_100_000, Niche.EDUCATION, 5.5, audience_age_range=(18, 35)),
]


if __name__ == "__main__":
    # Example usage
    matcher = InfluencerMatcher(SAMPLE_INFLUENCERS)
    
    brand = Brand(
        name="TechGear Pro",
        niche=Niche.TECH,
        target_audience="Tech-savvy millennials aged 25-35 interested in gadgets",
        budget=BudgetTier.MEDIUM,
        goals="Increase brand awareness, drive app downloads"
    )
    
    matches, strategy = matcher.match(brand, k=5)
    
    print(f"Brand: {brand.name}")
    print(f"Niche: {brand.niche.value}")
    print(f"Budget: {brand.budget.name}")
    print()
    print("Strategy:", strategy)
    print()
    print("Top 5 Influencer Matches:")
    print("-" * 60)
    
    for i, match in enumerate(matches, 1):
        inf = match.influencer
        print(f"\n{i}. {inf.name} ({inf.platform.value})")
        print(f"   Followers: {inf._format_followers()}")
        print(f"   Engagement: {inf.engagement_rate:.1f}%")
        print(f"   Match Score: {match.score:.1f}%")
        print(f"   Reason: {match.reason}")
