"""
Collab-Pro REST API
===================
FastAPI-based REST API for influencer matching.

Author: Bijay Soti
License: MIT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

from matcher import (
    InfluencerMatcher,
    Brand,
    Niche,
    BudgetTier,
    SAMPLE_INFLUENCERS
)


# Initialize FastAPI app
app = FastAPI(
    title="Collab-Pro API",
    description="AI-Powered Influencer Marketing Platform",
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

# Initialize matcher with influencer database
matcher = InfluencerMatcher(SAMPLE_INFLUENCERS)


# Pydantic models for request/response
class BrandRequest(BaseModel):
    """Brand campaign requirements."""
    brandName: str = Field(..., min_length=1, max_length=100)
    niche: str = Field(..., min_length=1, max_length=50)
    targetAudience: str = Field(default="", max_length=200)
    budget: str = Field(default="medium", max_length=50)
    goals: str = Field(default="", max_length=500)
    
    class Config:
        schema_extra = {
            "example": {
                "brandName": "TechGear Pro",
                "niche": "Technology",
                "targetAudience": "Tech-savvy millennials aged 25-35",
                "budget": "medium",
                "goals": "Increase brand awareness, drive app downloads"
            }
        }


class InfluencerResponse(BaseModel):
    """Single influencer match."""
    name: str
    platform: str
    followers: str
    niche: str
    engagementRate: str
    matchScore: int
    reason: str


class MatchResponse(BaseModel):
    """Complete match response."""
    matches: List[InfluencerResponse]
    strategy: str


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Collab-Pro Influencer Matcher",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check for container orchestration."""
    return {"status": "healthy"}


@app.get("/influencers")
async def list_influencers():
    """List all available influencers in database."""
    return {
        "count": len(SAMPLE_INFLUENCERS),
        "influencers": [inf.to_dict() for inf in SAMPLE_INFLUENCERS]
    }


@app.get("/niches")
async def list_niches():
    """List all available niches."""
    return {
        "niches": [n.value for n in Niche]
    }


@app.get("/budgets")
async def list_budgets():
    """List all available budget tiers."""
    return {
        "budgets": [
            {"name": b.name.lower(), "range": f"${b.range[0]:,.0f} - ${b.range[1]:,.0f}"}
            for b in BudgetTier
            if b.range[1] != float('inf')
        ] + [{"name": "enterprise", "range": "$200,000+"}]
    }


def _parse_niche(niche_str: str) -> Niche:
    """Parse niche string to Niche enum."""
    niche_map = {n.value.lower(): n for n in Niche}
    niche_map.update({n.name.lower(): n for n in Niche})
    return niche_map.get(niche_str.lower(), Niche.TECH)


def _parse_budget(budget_str: str) -> BudgetTier:
    """Parse budget string to BudgetTier enum."""
    budget_map = {b.name.lower(): b for b in BudgetTier}
    return budget_map.get(budget_str.lower(), BudgetTier.MEDIUM)


@app.post("/match", response_model=MatchResponse)
async def match_influencers(request: BrandRequest):
    """
    Find matching influencers for a brand.
    
    Uses multi-factor scoring algorithm to match brands with ideal influencers:
    - Niche alignment (content relevance)
    - Audience demographics overlap
    - Engagement quality
    - Budget compatibility
    - Brand safety
    """
    try:
        brand = Brand(
            name=request.brandName,
            niche=_parse_niche(request.niche),
            target_audience=request.targetAudience or "General audience",
            budget=_parse_budget(request.budget),
            goals=request.goals or "Brand awareness"
        )
        
        matches, strategy = matcher.match(brand, k=5)
        
        return MatchResponse(
            matches=[
                InfluencerResponse(
                    name=m.influencer.name,
                    platform=m.influencer.platform.value,
                    followers=m.influencer._format_followers(),
                    niche=m.influencer.niche.value,
                    engagementRate=f"{m.influencer.engagement_rate:.1f}%",
                    matchScore=round(m.score),
                    reason=m.reason
                )
                for m in matches
            ],
            strategy=strategy
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
