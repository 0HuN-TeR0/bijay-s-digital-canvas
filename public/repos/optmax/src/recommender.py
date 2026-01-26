"""
OptMax GPU Recommendation Engine
================================
AI-Powered GPU Recommendation System using Weighted KNN Algorithm

Author: Bijay Soti
License: MIT
"""

import math
from typing import List, Dict, Tuple
from dataclasses import dataclass
import numpy as np


@dataclass
class GPU:
    """Represents a GPU with its specifications."""
    name: str
    price: float  # USD
    benchmark: int  # PassMark score
    vram: int  # GB
    year: int  # Release year
    
    def to_feature_vector(self, normalizers: Dict[str, Tuple[float, float]]) -> np.ndarray:
        """Convert GPU specs to normalized feature vector."""
        price_norm = 1 - self._normalize(self.price, *normalizers['price'])  # Inverse for budget
        benchmark_norm = self._normalize(self.benchmark, *normalizers['benchmark'])
        vram_norm = self._normalize(self.vram, *normalizers['vram'])
        year_norm = self._normalize(self.year, *normalizers['year'])
        return np.array([price_norm, benchmark_norm, vram_norm, year_norm])
    
    @staticmethod
    def _normalize(value: float, min_val: float, max_val: float) -> float:
        """Min-max normalization to [0, 1] range."""
        if max_val == min_val:
            return 0.5
        return (value - min_val) / (max_val - min_val)


@dataclass
class UserPreferences:
    """User's preference weights for GPU selection."""
    budget: int  # 0-100
    performance: int  # 0-100
    vram: int  # 0-100
    recency: int  # 0-100
    
    def to_weights(self) -> np.ndarray:
        """Convert preferences to normalized weight vector."""
        weights = np.array([self.budget, self.performance, self.vram, self.recency], dtype=float)
        total = weights.sum()
        if total == 0:
            return np.array([0.25, 0.25, 0.25, 0.25])
        return weights / total


@dataclass
class Recommendation:
    """GPU recommendation with match score and explanation."""
    gpu: GPU
    match_score: float
    explanation: str = ""
    
    def to_dict(self) -> Dict:
        """Convert recommendation to dictionary."""
        return {
            "name": self.gpu.name,
            "price": f"${self.gpu.price:,.0f}",
            "benchmark": f"{self.gpu.benchmark:,} points",
            "vram": f"{self.gpu.vram} GB",
            "year": str(self.gpu.year),
            "matchScore": round(self.match_score),
            "explanation": self.explanation
        }


class GPURecommender:
    """
    GPU Recommendation Engine using Weighted KNN Algorithm.
    
    This class implements a weighted K-Nearest Neighbors approach to recommend
    GPUs based on user-defined preferences for budget, performance, VRAM, and recency.
    
    Algorithm:
    1. Normalize all GPU features to [0, 1] range
    2. Convert user preferences to weight vector (sum = 1)
    3. Calculate weighted Euclidean distance from ideal (all 1s)
    4. Sort by distance, return top K with lowest distance (best matches)
    """
    
    def __init__(self, gpus: List[GPU]):
        """
        Initialize recommender with GPU database.
        
        Args:
            gpus: List of GPU objects with specifications
        """
        self.gpus = gpus
        self.normalizers = self._calculate_normalizers()
        self._precompute_features()
    
    def _calculate_normalizers(self) -> Dict[str, Tuple[float, float]]:
        """Calculate min/max values for each feature for normalization."""
        prices = [g.price for g in self.gpus]
        benchmarks = [g.benchmark for g in self.gpus]
        vrams = [g.vram for g in self.gpus]
        years = [g.year for g in self.gpus]
        
        return {
            'price': (min(prices), max(prices)),
            'benchmark': (min(benchmarks), max(benchmarks)),
            'vram': (min(vrams), max(vrams)),
            'year': (min(years), max(years))
        }
    
    def _precompute_features(self):
        """Pre-compute feature vectors for all GPUs."""
        self.feature_matrix = np.array([
            gpu.to_feature_vector(self.normalizers) 
            for gpu in self.gpus
        ])
    
    def weighted_euclidean_distance(
        self, 
        features: np.ndarray, 
        ideal: np.ndarray, 
        weights: np.ndarray
    ) -> float:
        """
        Calculate weighted Euclidean distance.
        
        Args:
            features: GPU feature vector [price, benchmark, vram, year]
            ideal: Ideal feature vector (typically all 1s)
            weights: User preference weights
            
        Returns:
            Weighted Euclidean distance (lower = better match)
        """
        squared_diff = weights * (features - ideal) ** 2
        return math.sqrt(squared_diff.sum())
    
    def recommend(
        self, 
        preferences: UserPreferences, 
        k: int = 5
    ) -> List[Recommendation]:
        """
        Get top K GPU recommendations based on user preferences.
        
        Args:
            preferences: User's preference weights
            k: Number of recommendations to return
            
        Returns:
            List of Recommendation objects sorted by match score (descending)
        """
        weights = preferences.to_weights()
        ideal = np.ones(4)  # Ideal GPU: best in all categories
        
        # Calculate distances for all GPUs
        distances = []
        for i, features in enumerate(self.feature_matrix):
            distance = self.weighted_euclidean_distance(features, ideal, weights)
            distances.append((i, distance))
        
        # Sort by distance (ascending = better match first)
        distances.sort(key=lambda x: x[1])
        
        # Convert to recommendations with match scores
        max_distance = math.sqrt(sum(weights))  # Theoretical maximum
        recommendations = []
        
        for idx, distance in distances[:k]:
            # Convert distance to match score (0-100)
            match_score = max(0, min(100, (1 - distance / max_distance) * 100))
            
            recommendations.append(Recommendation(
                gpu=self.gpus[idx],
                match_score=match_score
            ))
        
        return recommendations
    
    def get_analysis(self, preferences: UserPreferences) -> str:
        """
        Generate analysis summary of user preferences.
        
        Args:
            preferences: User's preference weights
            
        Returns:
            Human-readable analysis string
        """
        weights = preferences.to_weights()
        feature_names = ['budget', 'performance', 'VRAM', 'recency']
        
        # Find dominant preference
        max_idx = weights.argmax()
        dominant = feature_names[max_idx]
        
        # Build analysis
        parts = []
        if weights[0] > 0.3:
            parts.append("prioritizing value for money")
        if weights[1] > 0.3:
            parts.append("focusing on raw performance")
        if weights[2] > 0.3:
            parts.append("emphasizing memory capacity")
        if weights[3] > 0.3:
            parts.append("preferring newer architectures")
        
        if not parts:
            return "Your preferences are well-balanced. Recommendations optimize across all factors equally."
        
        return f"Based on your preferences ({', '.join(parts)}), these GPUs best match your needs with {dominant} as the primary consideration."


# Sample GPU database
SAMPLE_GPUS = [
    GPU("NVIDIA RTX 4090", 1599, 38929, 24, 2022),
    GPU("NVIDIA RTX 4080 Super", 999, 34835, 16, 2024),
    GPU("NVIDIA RTX 4080", 1199, 34595, 16, 2022),
    GPU("NVIDIA RTX 4070 Ti Super", 799, 31560, 16, 2024),
    GPU("NVIDIA RTX 4070 Ti", 799, 31298, 12, 2023),
    GPU("NVIDIA RTX 4070 Super", 599, 27444, 12, 2024),
    GPU("NVIDIA RTX 4070", 549, 23332, 12, 2023),
    GPU("NVIDIA RTX 4060 Ti", 399, 22052, 8, 2023),
    GPU("NVIDIA RTX 4060", 299, 19444, 8, 2023),
    GPU("AMD Radeon RX 7900 XTX", 949, 33611, 24, 2022),
    GPU("AMD Radeon RX 7900 XT", 749, 29563, 20, 2022),
    GPU("AMD Radeon RX 7800 XT", 499, 24987, 16, 2023),
    GPU("AMD Radeon RX 7700 XT", 449, 22155, 12, 2023),
    GPU("AMD Radeon RX 7600", 269, 17016, 8, 2023),
    GPU("Intel Arc A770", 329, 18562, 16, 2022),
    GPU("Intel Arc A750", 249, 16321, 8, 2022),
    GPU("NVIDIA RTX 3090 Ti", 999, 29876, 24, 2022),
    GPU("NVIDIA RTX 3080 Ti", 699, 26444, 12, 2021),
    GPU("NVIDIA RTX 3070", 399, 21987, 8, 2020),
    GPU("NVIDIA RTX 3060", 279, 16976, 12, 2021),
]


if __name__ == "__main__":
    # Example usage
    recommender = GPURecommender(SAMPLE_GPUS)
    
    preferences = UserPreferences(
        budget=70,
        performance=80,
        vram=60,
        recency=40
    )
    
    print("User Preferences:")
    print(f"  Budget: {preferences.budget}%")
    print(f"  Performance: {preferences.performance}%")
    print(f"  VRAM: {preferences.vram}%")
    print(f"  Recency: {preferences.recency}%")
    print()
    
    recommendations = recommender.recommend(preferences, k=5)
    analysis = recommender.get_analysis(preferences)
    
    print("Analysis:", analysis)
    print()
    print("Top 5 Recommendations:")
    print("-" * 60)
    
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec.gpu.name}")
        print(f"   Price: ${rec.gpu.price:,.0f}")
        print(f"   Benchmark: {rec.gpu.benchmark:,} points")
        print(f"   VRAM: {rec.gpu.vram} GB")
        print(f"   Year: {rec.gpu.year}")
        print(f"   Match Score: {rec.match_score:.1f}%")
