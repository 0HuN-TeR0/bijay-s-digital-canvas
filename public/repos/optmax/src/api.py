"""
OptMax REST API
===============
FastAPI-based REST API for GPU recommendations.

Author: Bijay Soti
License: MIT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

from recommender import (
    GPURecommender, 
    UserPreferences, 
    SAMPLE_GPUS,
    Recommendation
)


# Initialize FastAPI app
app = FastAPI(
    title="OptMax API",
    description="AI-Powered GPU Recommendation System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender with GPU database
recommender = GPURecommender(SAMPLE_GPUS)


# Pydantic models for request/response
class PreferencesRequest(BaseModel):
    """User preferences for GPU recommendation."""
    budget: int = Field(..., ge=0, le=100, description="Budget importance (0-100)")
    performance: int = Field(..., ge=0, le=100, description="Performance importance (0-100)")
    vram: int = Field(..., ge=0, le=100, description="VRAM importance (0-100)")
    recency: int = Field(..., ge=0, le=100, description="Release year importance (0-100)")
    
    class Config:
        schema_extra = {
            "example": {
                "budget": 70,
                "performance": 80,
                "vram": 60,
                "recency": 40
            }
        }


class GPUResponse(BaseModel):
    """Single GPU recommendation."""
    name: str
    price: str
    benchmark: str
    vram: str
    year: str
    matchScore: int
    explanation: str


class RecommendationResponse(BaseModel):
    """Complete recommendation response."""
    recommendations: List[GPUResponse]
    analysis: str


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "OptMax GPU Recommender",
        "version": "1.0.0"
    }


@app.get("/gpus")
async def list_gpus():
    """List all available GPUs in database."""
    return {
        "count": len(SAMPLE_GPUS),
        "gpus": [
            {
                "name": gpu.name,
                "price": gpu.price,
                "benchmark": gpu.benchmark,
                "vram": gpu.vram,
                "year": gpu.year
            }
            for gpu in SAMPLE_GPUS
        ]
    }


@app.post("/recommend", response_model=RecommendationResponse)
async def recommend(preferences: PreferencesRequest):
    """
    Get GPU recommendations based on user preferences.
    
    The algorithm uses weighted K-Nearest Neighbors to find GPUs
    that best match the user's priorities for budget, performance,
    VRAM, and release year.
    """
    try:
        user_prefs = UserPreferences(
            budget=preferences.budget,
            performance=preferences.performance,
            vram=preferences.vram,
            recency=preferences.recency
        )
        
        # Get recommendations
        recommendations = recommender.recommend(user_prefs, k=5)
        analysis = recommender.get_analysis(user_prefs)
        
        # Generate explanations (in production, use LLM)
        result_recs = []
        for rec in recommendations:
            explanation = _generate_explanation(rec, user_prefs)
            result_recs.append(GPUResponse(
                name=rec.gpu.name,
                price=f"${rec.gpu.price:,.0f}",
                benchmark=f"{rec.gpu.benchmark:,} points",
                vram=f"{rec.gpu.vram} GB",
                year=str(rec.gpu.year),
                matchScore=round(rec.match_score),
                explanation=explanation
            ))
        
        return RecommendationResponse(
            recommendations=result_recs,
            analysis=analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _generate_explanation(rec: Recommendation, prefs: UserPreferences) -> str:
    """Generate human-readable explanation for recommendation."""
    gpu = rec.gpu
    parts = []
    
    if prefs.budget > 50:
        if gpu.price < 500:
            parts.append("excellent value under $500")
        elif gpu.price < 800:
            parts.append("solid mid-range pricing")
        else:
            parts.append("premium but justified by capabilities")
    
    if prefs.performance > 50:
        if gpu.benchmark > 30000:
            parts.append("top-tier performance for demanding workloads")
        elif gpu.benchmark > 20000:
            parts.append("strong performance for most use cases")
        else:
            parts.append("adequate performance for mainstream tasks")
    
    if prefs.vram > 50:
        if gpu.vram >= 16:
            parts.append("generous VRAM for AI/ML and high-res gaming")
        elif gpu.vram >= 12:
            parts.append("sufficient VRAM for most applications")
        else:
            parts.append("standard VRAM allocation")
    
    if prefs.recency > 50:
        if gpu.year >= 2024:
            parts.append("latest architecture with newest features")
        elif gpu.year >= 2023:
            parts.append("recent release with current-gen technology")
        else:
            parts.append("proven architecture with driver maturity")
    
    if not parts:
        parts.append("well-balanced option matching your preferences")
    
    return f"This GPU offers {', '.join(parts)}."


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
