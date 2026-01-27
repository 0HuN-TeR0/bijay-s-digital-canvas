"""
Financial Analytics REST API
============================
FastAPI-based REST API for financial analysis.

Author: Bijay Soti
License: MIT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict
import uvicorn

from analyzer import FinancialAnalyzer


# Initialize FastAPI app
app = FastAPI(
    title="Financial Analytics API",
    description="Technical and Fundamental Analysis for Securities",
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
analyzer = FinancialAnalyzer()


# Pydantic models for request/response
class AnalyzeRequest(BaseModel):
    """Stock analysis request."""
    ticker: str = Field(..., min_length=1, max_length=10, pattern="^[A-Za-z]+$")
    
    class Config:
        schema_extra = {
            "example": {
                "ticker": "AAPL"
            }
        }


class MovingAveragesResponse(BaseModel):
    ma20: str
    ma50: str
    signal: str


class RSIResponse(BaseModel):
    value: float
    signal: str


class MACDResponse(BaseModel):
    signal: str


class TechnicalAnalysisResponse(BaseModel):
    trend: str
    movingAverages: MovingAveragesResponse
    rsi: RSIResponse
    macd: MACDResponse


class FundamentalAnalysisResponse(BaseModel):
    peRatio: str
    marketCap: str
    sentiment: str


class PredictionResponse(BaseModel):
    shortTerm: str
    confidence: int
    reasoning: str


class AnalyzeResponse(BaseModel):
    """Complete analysis response."""
    ticker: str
    technicalAnalysis: TechnicalAnalysisResponse
    fundamentalAnalysis: FundamentalAnalysisResponse
    prediction: PredictionResponse
    riskLevel: str
    recommendation: str


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Financial Analytics",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check for container orchestration."""
    return {"status": "healthy"}


@app.get("/tickers")
async def list_tickers():
    """List sample tickers available for analysis."""
    return {
        "tickers": list(analyzer.SAMPLE_STOCKS.keys()),
        "note": "Any valid stock symbol can be analyzed"
    }


@app.get("/analyze/{ticker}")
async def analyze_get(ticker: str):
    """Analyze a stock ticker (GET method)."""
    if not ticker.isalpha():
        raise HTTPException(status_code=400, detail="Ticker must be letters only")
    
    try:
        result = analyzer.analyze(ticker)
        return result.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_post(request: AnalyzeRequest):
    """
    Analyze a stock ticker (POST method).
    
    Provides:
    - Technical analysis (Moving Averages, RSI, MACD)
    - Fundamental analysis (P/E, Market Cap, Sentiment)
    - Price prediction with confidence score
    - Risk assessment
    - Buy/Sell/Hold recommendation
    """
    try:
        result = analyzer.analyze(request.ticker)
        return result.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
