"""
NLP Gender Analysis REST API
============================
FastAPI-based REST API for text analysis.

Author: Bijay Soti
License: MIT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
import uvicorn

from analyzer import TextAnalyzer


# Initialize FastAPI app
app = FastAPI(
    title="NLP Gender Analysis API",
    description="Text Analysis for Gender Representation and Sentiment",
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

# Initialize analyzer
analyzer = TextAnalyzer()


# Pydantic models for request/response
class AnalyzeRequest(BaseModel):
    """Text analysis request."""
    text: str = Field(..., min_length=10, max_length=5000)
    
    class Config:
        schema_extra = {
            "example": {
                "text": "The CEO announced that all employees should work harder. The chairman praised the salesmen for exceeding targets."
            }
        }


class SentimentResponse(BaseModel):
    overall: str
    score: float
    breakdown: Dict[str, float]


class GenderAnalysisResponse(BaseModel):
    maleReferences: int
    femaleReferences: int
    neutralReferences: int
    biasIndicators: List[str]
    biasScore: float


class SocialRepresentationResponse(BaseModel):
    dominantThemes: List[str]
    representationScore: float
    observations: List[str]


class AnalyzeResponse(BaseModel):
    """Complete analysis response."""
    sentiment: SentimentResponse
    genderAnalysis: GenderAnalysisResponse
    socialRepresentation: SocialRepresentationResponse
    recommendations: List[str]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "NLP Gender Analysis",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check for container orchestration."""
    return {"status": "healthy"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze text for gender representation and sentiment.
    
    Features:
    - Sentiment analysis using lexicon-based approach
    - Gender reference detection and counting
    - Bias pattern identification
    - Inclusive language recommendations
    """
    try:
        result = analyzer.analyze(request.text)
        return result.to_dict()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/gendered-terms")
async def get_gendered_terms():
    """Get lists of gendered terms tracked by the analyzer."""
    return {
        "male_terms": list(analyzer.MALE_TERMS),
        "female_terms": list(analyzer.FEMALE_TERMS),
        "neutral_terms": list(analyzer.NEUTRAL_TERMS),
        "gendered_titles": analyzer.GENDERED_TITLES
    }


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
