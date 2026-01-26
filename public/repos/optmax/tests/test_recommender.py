"""
OptMax Unit Tests
=================

Author: Bijay Soti
License: MIT
"""

import pytest
import numpy as np
from src.recommender import (
    GPU, 
    UserPreferences, 
    GPURecommender, 
    Recommendation,
    SAMPLE_GPUS
)


class TestGPU:
    """Tests for GPU dataclass."""
    
    def test_gpu_creation(self):
        gpu = GPU("Test GPU", 500, 20000, 12, 2023)
        assert gpu.name == "Test GPU"
        assert gpu.price == 500
        assert gpu.benchmark == 20000
        assert gpu.vram == 12
        assert gpu.year == 2023
    
    def test_feature_vector_normalization(self):
        gpu = GPU("Test GPU", 500, 20000, 12, 2023)
        normalizers = {
            'price': (100, 1000),
            'benchmark': (10000, 30000),
            'vram': (4, 24),
            'year': (2020, 2024)
        }
        features = gpu.to_feature_vector(normalizers)
        
        # Check all values are in [0, 1]
        assert all(0 <= f <= 1 for f in features)
        assert len(features) == 4


class TestUserPreferences:
    """Tests for UserPreferences dataclass."""
    
    def test_preferences_creation(self):
        prefs = UserPreferences(70, 80, 60, 40)
        assert prefs.budget == 70
        assert prefs.performance == 80
        assert prefs.vram == 60
        assert prefs.recency == 40
    
    def test_weights_normalization(self):
        prefs = UserPreferences(70, 80, 60, 40)
        weights = prefs.to_weights()
        
        # Weights should sum to 1
        assert abs(weights.sum() - 1.0) < 0.001
        
        # Check proportions
        assert weights[1] > weights[0]  # performance > budget
        assert weights[0] > weights[2]  # budget > vram
        assert weights[2] > weights[3]  # vram > recency
    
    def test_zero_preferences(self):
        prefs = UserPreferences(0, 0, 0, 0)
        weights = prefs.to_weights()
        
        # Should default to equal weights
        expected = np.array([0.25, 0.25, 0.25, 0.25])
        np.testing.assert_array_almost_equal(weights, expected)


class TestGPURecommender:
    """Tests for GPURecommender class."""
    
    @pytest.fixture
    def recommender(self):
        return GPURecommender(SAMPLE_GPUS)
    
    def test_recommender_initialization(self, recommender):
        assert len(recommender.gpus) == len(SAMPLE_GPUS)
        assert recommender.feature_matrix.shape == (len(SAMPLE_GPUS), 4)
    
    def test_normalizers_calculated(self, recommender):
        assert 'price' in recommender.normalizers
        assert 'benchmark' in recommender.normalizers
        assert 'vram' in recommender.normalizers
        assert 'year' in recommender.normalizers
    
    def test_recommend_returns_correct_count(self, recommender):
        prefs = UserPreferences(50, 50, 50, 50)
        
        recs = recommender.recommend(prefs, k=5)
        assert len(recs) == 5
        
        recs = recommender.recommend(prefs, k=3)
        assert len(recs) == 3
    
    def test_recommend_returns_recommendations(self, recommender):
        prefs = UserPreferences(50, 50, 50, 50)
        recs = recommender.recommend(prefs, k=5)
        
        for rec in recs:
            assert isinstance(rec, Recommendation)
            assert isinstance(rec.gpu, GPU)
            assert 0 <= rec.match_score <= 100
    
    def test_recommendations_sorted_by_score(self, recommender):
        prefs = UserPreferences(80, 20, 50, 50)
        recs = recommender.recommend(prefs, k=5)
        
        scores = [r.match_score for r in recs]
        assert scores == sorted(scores, reverse=True)
    
    def test_budget_priority_recommends_cheaper(self, recommender):
        # High budget priority should recommend cheaper GPUs
        prefs = UserPreferences(100, 0, 0, 0)
        recs = recommender.recommend(prefs, k=3)
        
        avg_price = sum(r.gpu.price for r in recs) / len(recs)
        
        # Compare with performance priority
        perf_prefs = UserPreferences(0, 100, 0, 0)
        perf_recs = recommender.recommend(perf_prefs, k=3)
        perf_avg_price = sum(r.gpu.price for r in perf_recs) / len(perf_recs)
        
        assert avg_price < perf_avg_price
    
    def test_performance_priority_recommends_faster(self, recommender):
        prefs = UserPreferences(0, 100, 0, 0)
        recs = recommender.recommend(prefs, k=3)
        
        # Top recommendations should have high benchmarks
        benchmarks = [r.gpu.benchmark for r in recs]
        assert benchmarks[0] >= 25000  # Should be high-end
    
    def test_weighted_distance_calculation(self, recommender):
        features = np.array([0.5, 0.5, 0.5, 0.5])
        ideal = np.ones(4)
        weights = np.array([0.25, 0.25, 0.25, 0.25])
        
        distance = recommender.weighted_euclidean_distance(features, ideal, weights)
        
        # Expected: sqrt(0.25 * 0.25 * 4) = sqrt(0.25) = 0.5
        assert abs(distance - 0.5) < 0.001
    
    def test_analysis_generation(self, recommender):
        prefs = UserPreferences(80, 30, 40, 20)
        analysis = recommender.get_analysis(prefs)
        
        assert isinstance(analysis, str)
        assert len(analysis) > 0
        assert "budget" in analysis.lower() or "value" in analysis.lower()


class TestRecommendation:
    """Tests for Recommendation dataclass."""
    
    def test_to_dict(self):
        gpu = GPU("Test GPU", 599, 20000, 12, 2023)
        rec = Recommendation(gpu, 85.5, "Great GPU")
        
        result = rec.to_dict()
        
        assert result["name"] == "Test GPU"
        assert result["price"] == "$599"
        assert result["benchmark"] == "20,000 points"
        assert result["vram"] == "12 GB"
        assert result["year"] == "2023"
        assert result["matchScore"] == 86
        assert result["explanation"] == "Great GPU"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
