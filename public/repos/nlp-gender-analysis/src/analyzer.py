"""
NLP Gender & Sentiment Analyzer
===============================
Analyze text for gender representation, sentiment, and bias patterns.

Author: Bijay Soti
License: MIT
"""

import re
from dataclasses import dataclass, field
from typing import List, Dict, Tuple
from collections import Counter


@dataclass
class SentimentResult:
    """Sentiment analysis result."""
    overall: str  # positive, negative, neutral
    score: float  # -1 to 1
    breakdown: Dict[str, float] = field(default_factory=dict)


@dataclass
class GenderAnalysis:
    """Gender representation analysis."""
    male_references: int
    female_references: int
    neutral_references: int
    bias_indicators: List[str]
    bias_score: float


@dataclass
class SocialRepresentation:
    """Social representation analysis."""
    dominant_themes: List[str]
    representation_score: float
    observations: List[str]


@dataclass
class AnalysisResult:
    """Complete analysis result."""
    sentiment: SentimentResult
    gender_analysis: GenderAnalysis
    social_representation: SocialRepresentation
    recommendations: List[str]
    
    def to_dict(self) -> Dict:
        return {
            "sentiment": {
                "overall": self.sentiment.overall,
                "score": self.sentiment.score,
                "breakdown": self.sentiment.breakdown
            },
            "genderAnalysis": {
                "maleReferences": self.gender_analysis.male_references,
                "femaleReferences": self.gender_analysis.female_references,
                "neutralReferences": self.gender_analysis.neutral_references,
                "biasIndicators": self.gender_analysis.bias_indicators,
                "biasScore": self.gender_analysis.bias_score
            },
            "socialRepresentation": {
                "dominantThemes": self.social_representation.dominant_themes,
                "representationScore": self.social_representation.representation_score,
                "observations": self.social_representation.observations
            },
            "recommendations": self.recommendations
        }


class TextAnalyzer:
    """
    NLP-based text analyzer for gender representation and sentiment.
    
    Features:
    - Sentiment analysis using lexicon-based approach
    - Gender reference detection and counting
    - Bias pattern identification
    - Inclusive language recommendations
    """
    
    # Gendered terms dictionaries
    MALE_TERMS = {
        'he', 'him', 'his', 'himself', 'man', 'men', 'boy', 'boys',
        'gentleman', 'gentlemen', 'sir', 'mr', 'father', 'son', 'brother',
        'husband', 'boyfriend', 'male', 'masculine'
    }
    
    FEMALE_TERMS = {
        'she', 'her', 'hers', 'herself', 'woman', 'women', 'girl', 'girls',
        'lady', 'ladies', 'madam', 'ms', 'mrs', 'miss', 'mother', 'daughter',
        'sister', 'wife', 'girlfriend', 'female', 'feminine'
    }
    
    NEUTRAL_TERMS = {
        'they', 'them', 'their', 'theirs', 'themselves', 'person', 'people',
        'individual', 'individuals', 'someone', 'everyone', 'anyone',
        'one', 'oneself', 'team', 'staff', 'employee', 'employees'
    }
    
    # Gendered job titles and their neutral alternatives
    GENDERED_TITLES = {
        'chairman': 'chairperson',
        'chairwoman': 'chairperson',
        'salesman': 'salesperson',
        'saleswoman': 'salesperson',
        'salesmen': 'salespeople',
        'fireman': 'firefighter',
        'policeman': 'police officer',
        'policewoman': 'police officer',
        'stewardess': 'flight attendant',
        'steward': 'flight attendant',
        'mailman': 'mail carrier',
        'congressman': 'congressperson',
        'businessmen': 'business people',
        'businessman': 'business person',
        'manpower': 'workforce',
        'mankind': 'humanity',
        'man-made': 'artificial',
        'cameraman': 'camera operator',
        'foreman': 'supervisor',
        'waitress': 'server',
        'waiter': 'server'
    }
    
    # Sentiment lexicon (simplified)
    POSITIVE_WORDS = {
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
        'positive', 'happy', 'joy', 'love', 'praised', 'success', 'successful',
        'achieved', 'brilliant', 'outstanding', 'exceptional', 'perfect',
        'best', 'better', 'improved', 'progress', 'growth', 'innovative'
    }
    
    NEGATIVE_WORDS = {
        'bad', 'terrible', 'awful', 'horrible', 'negative', 'sad', 'angry',
        'hate', 'failure', 'failed', 'poor', 'worst', 'worse', 'decline',
        'problem', 'issue', 'difficult', 'hard', 'struggle', 'crisis',
        'disappointing', 'frustrated', 'concern', 'risk', 'threat'
    }
    
    def __init__(self):
        """Initialize the analyzer."""
        pass
    
    def analyze(self, text: str) -> AnalysisResult:
        """
        Perform complete analysis on input text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            AnalysisResult with sentiment, gender analysis, and recommendations
        """
        # Preprocess
        words = self._tokenize(text)
        
        # Analyze components
        sentiment = self._analyze_sentiment(words, text)
        gender = self._analyze_gender(words, text)
        social = self._analyze_social_representation(words, gender)
        recommendations = self._generate_recommendations(gender, text)
        
        return AnalysisResult(
            sentiment=sentiment,
            gender_analysis=gender,
            social_representation=social,
            recommendations=recommendations
        )
    
    def _tokenize(self, text: str) -> List[str]:
        """Tokenize text into lowercase words."""
        # Remove punctuation and split
        text_clean = re.sub(r'[^\w\s]', ' ', text.lower())
        return text_clean.split()
    
    def _analyze_sentiment(self, words: List[str], text: str) -> SentimentResult:
        """Analyze sentiment of text."""
        positive_count = sum(1 for w in words if w in self.POSITIVE_WORDS)
        negative_count = sum(1 for w in words if w in self.NEGATIVE_WORDS)
        total_sentiment_words = positive_count + negative_count
        
        if total_sentiment_words == 0:
            score = 0.0
            overall = "neutral"
        else:
            score = (positive_count - negative_count) / total_sentiment_words
            if score > 0.1:
                overall = "positive"
            elif score < -0.1:
                overall = "negative"
            else:
                overall = "neutral"
        
        total_words = len(words)
        if total_words == 0:
            breakdown = {"positive": 33, "negative": 33, "neutral": 34}
        else:
            pos_pct = (positive_count / total_words) * 100
            neg_pct = (negative_count / total_words) * 100
            neu_pct = 100 - pos_pct - neg_pct
            breakdown = {
                "positive": round(max(0, min(100, pos_pct * 5)), 1),  # Scale up for visibility
                "negative": round(max(0, min(100, neg_pct * 5)), 1),
                "neutral": round(max(0, 100 - pos_pct * 5 - neg_pct * 5), 1)
            }
        
        return SentimentResult(
            overall=overall,
            score=round((score + 1) / 2, 2),  # Convert to 0-1 scale
            breakdown=breakdown
        )
    
    def _analyze_gender(self, words: List[str], text: str) -> GenderAnalysis:
        """Analyze gender references in text."""
        male_count = sum(1 for w in words if w in self.MALE_TERMS)
        female_count = sum(1 for w in words if w in self.FEMALE_TERMS)
        neutral_count = sum(1 for w in words if w in self.NEUTRAL_TERMS)
        
        # Find bias indicators (gendered titles)
        text_lower = text.lower()
        bias_indicators = []
        for term in self.GENDERED_TITLES.keys():
            if term in text_lower:
                bias_indicators.append(term)
        
        # Calculate bias score
        bias_score = self._calculate_bias_score(
            male_count, female_count, neutral_count, len(bias_indicators)
        )
        
        return GenderAnalysis(
            male_references=male_count,
            female_references=female_count,
            neutral_references=neutral_count,
            bias_indicators=bias_indicators,
            bias_score=bias_score
        )
    
    def _calculate_bias_score(
        self, 
        male: int, 
        female: int, 
        neutral: int, 
        bias_count: int
    ) -> float:
        """
        Calculate gender bias score.
        
        0.0 = perfectly balanced
        1.0 = heavily biased
        """
        total_gendered = male + female
        
        if total_gendered == 0:
            base_bias = 0.0
        else:
            imbalance = abs(male - female) / total_gendered
            base_bias = imbalance
        
        # Penalize gendered titles
        title_penalty = min(0.3, bias_count * 0.1)
        
        # Reward neutral language usage
        total = male + female + neutral
        if total > 0:
            neutral_ratio = neutral / total
            neutral_bonus = neutral_ratio * 0.3
        else:
            neutral_bonus = 0.0
        
        final_score = min(1.0, max(0.0, base_bias + title_penalty - neutral_bonus))
        return round(final_score, 2)
    
    def _analyze_social_representation(
        self, 
        words: List[str], 
        gender: GenderAnalysis
    ) -> SocialRepresentation:
        """Analyze social representation patterns."""
        # Identify dominant themes
        word_freq = Counter(words)
        
        # Theme keywords
        theme_keywords = {
            'work': {'work', 'job', 'career', 'employee', 'staff', 'team', 'office'},
            'leadership': {'leader', 'ceo', 'manager', 'director', 'executive', 'boss'},
            'achievement': {'success', 'achieve', 'accomplish', 'goal', 'target', 'exceed'},
            'collaboration': {'team', 'together', 'collaborate', 'partner', 'collective'},
            'innovation': {'new', 'innovative', 'creative', 'develop', 'launch', 'pioneer'}
        }
        
        themes = []
        for theme, keywords in theme_keywords.items():
            if any(kw in words for kw in keywords):
                themes.append(theme.title())
        
        if not themes:
            themes = ["General"]
        
        # Generate observations
        observations = []
        
        if gender.male_references > gender.female_references * 2:
            observations.append("Text shows predominantly male-oriented language")
        elif gender.female_references > gender.male_references * 2:
            observations.append("Text shows predominantly female-oriented language")
        else:
            observations.append("Gender references are relatively balanced")
        
        if gender.bias_indicators:
            observations.append(f"Found {len(gender.bias_indicators)} gendered job title(s)")
        
        if gender.neutral_references > (gender.male_references + gender.female_references):
            observations.append("Good use of gender-neutral language")
        
        # Representation score (inverse of bias)
        rep_score = round(1.0 - gender.bias_score, 2)
        
        return SocialRepresentation(
            dominant_themes=themes[:3],
            representation_score=rep_score,
            observations=observations
        )
    
    def _generate_recommendations(
        self, 
        gender: GenderAnalysis, 
        text: str
    ) -> List[str]:
        """Generate inclusive language recommendations."""
        recommendations = []
        
        # Recommend alternatives for gendered titles
        text_lower = text.lower()
        for gendered, neutral in self.GENDERED_TITLES.items():
            if gendered in text_lower:
                recommendations.append(
                    f"Consider replacing '{gendered}' with '{neutral}' for more inclusive language"
                )
        
        # General recommendations based on analysis
        if gender.bias_score > 0.5:
            recommendations.append(
                "The text shows significant gender imbalance. Consider using more gender-neutral pronouns (they/them)"
            )
        
        if gender.male_references > 0 and gender.female_references == 0:
            recommendations.append(
                "Consider including examples or references that include all genders"
            )
        
        if gender.neutral_references < 2:
            recommendations.append(
                "Increase use of inclusive terms like 'everyone', 'team members', 'individuals'"
            )
        
        if not recommendations:
            recommendations.append(
                "The text demonstrates good inclusive language practices"
            )
        
        return recommendations[:5]


if __name__ == "__main__":
    # Example usage
    analyzer = TextAnalyzer()
    
    sample_texts = [
        "The CEO announced that all employees should work harder. The chairman praised the salesmen for exceeding targets. Meanwhile, the cleaning ladies continued their work.",
        
        "Our diverse team of engineers collaborated to solve complex problems. The project lead ensured everyone's voice was heard, regardless of their background.",
    ]
    
    for i, text in enumerate(sample_texts, 1):
        print(f"\n{'='*60}")
        print(f"Sample {i}:")
        print(f"Text: {text[:80]}...")
        print("="*60)
        
        result = analyzer.analyze(text)
        
        print(f"\nSentiment: {result.sentiment.overall} (score: {result.sentiment.score})")
        print(f"\nGender Analysis:")
        print(f"  Male references: {result.gender_analysis.male_references}")
        print(f"  Female references: {result.gender_analysis.female_references}")
        print(f"  Neutral references: {result.gender_analysis.neutral_references}")
        print(f"  Bias score: {result.gender_analysis.bias_score}")
        
        if result.gender_analysis.bias_indicators:
            print(f"  Bias indicators: {', '.join(result.gender_analysis.bias_indicators)}")
        
        print(f"\nRecommendations:")
        for rec in result.recommendations:
            print(f"  • {rec}")
