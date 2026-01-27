# Collab-Pro - AI-Powered Influencer Marketing Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

> **🎯 Live Demo:** [bijaysoti.com.np/demo/collab-pro](https://bijaysoti.com.np/demo/collab-pro)

## 🧠 Problem Statement

Matching brands with the right influencers is like finding a needle in a haystack. With millions of content creators across platforms, brands struggle to identify partners who align with their values, audience, and budget. **Collab-Pro** uses AI-powered recommendation algorithms to match brands with ideal influencer partners.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BRAND INPUT                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Brand Name │ │   Industry  │ │   Budget    │ │   Goals     ││
│  │  & Details  │ │   & Niche   │ │   Range     │ │   & KPIs    ││
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘│
└─────────┼───────────────┼───────────────┼───────────────┼───────┘
          │               │               │               │
          └───────────────┴───────┬───────┴───────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MATCHING ENGINE                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Parse brand requirements                              │  │
│  │  2. Query influencer database (10K+ profiles)             │  │
│  │  3. Calculate multi-dimensional similarity:               │  │
│  │     • Niche alignment (content category match)            │  │
│  │     • Audience demographics overlap                       │  │
│  │     • Engagement rate quality                             │  │
│  │     • Budget compatibility                                │  │
│  │     • Brand safety score                                  │  │
│  │  4. Rank by composite match score                         │  │
│  │  5. Generate strategic reasoning via LLM                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTPUT                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Top 5 Influencer Matches:                                   ││
│  │ • Match Score (0-100%)                                      ││
│  │ • Platform, Followers, Engagement Rate                      ││
│  │ • Strategic reasoning for partnership                       ││
│  │ • Recommended campaign approach                             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## 🔬 Algorithm Details

### Multi-Factor Matching

The matching algorithm combines several signals:

```python
def calculate_match_score(brand: Brand, influencer: Influencer) -> float:
    """
    Calculate composite match score between brand and influencer.
    
    Components:
    1. Niche Alignment (30%): How well influencer's content matches brand
    2. Audience Match (25%): Demographics overlap with target audience
    3. Engagement Quality (20%): Authentic engagement vs follower count
    4. Budget Fit (15%): Estimated rates vs brand budget
    5. Brand Safety (10%): Content quality and controversy check
    """
    niche_score = cosine_similarity(brand.niche_embedding, influencer.content_embedding)
    audience_score = demographic_overlap(brand.target_audience, influencer.audience)
    engagement_score = engagement_quality_index(influencer)
    budget_score = budget_compatibility(brand.budget, influencer.estimated_rate)
    safety_score = brand_safety_check(influencer)
    
    weights = [0.30, 0.25, 0.20, 0.15, 0.10]
    scores = [niche_score, audience_score, engagement_score, budget_score, safety_score]
    
    return sum(w * s for w, s in zip(weights, scores)) * 100
```

## 📁 Project Structure

```
collab-pro/
├── src/
│   ├── matcher.py          # Core matching algorithm
│   ├── embeddings.py       # Content embedding generation
│   ├── influencer_db.py    # Influencer database interface
│   ├── brand_parser.py     # Brand requirements parser
│   └── api.py              # REST API endpoints
├── data/
│   └── influencers.json    # Sample influencer database
├── tests/
│   └── test_matcher.py     # Unit tests
├── requirements.txt
├── Dockerfile
└── README.md
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/0HuN-TeR0/collab-pro.git
cd collab-pro

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python src/api.py
```

## 📊 API Reference

### POST /match

Find influencer matches for a brand.

**Request:**
```json
{
  "brandName": "TechGear Pro",
  "niche": "tech",
  "targetAudience": "Tech-savvy millennials aged 25-35",
  "budget": "medium",
  "goals": "Increase brand awareness, drive app downloads"
}
```

**Response:**
```json
{
  "matches": [
    {
      "name": "TechReviewer",
      "platform": "YouTube",
      "followers": "1.2M",
      "niche": "Technology",
      "engagementRate": "4.5%",
      "matchScore": 92,
      "reason": "Strong tech audience overlap with proven conversion rates..."
    }
  ],
  "strategy": "Recommend a multi-platform approach..."
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Bijay Soti** - AI/ML Engineer  
- Website: [bijaysoti.lovable.app](https://bijaysoti.lovable.app)
- GitHub: [@0HuN-TeR0](https://github.com/0HuN-TeR0)
