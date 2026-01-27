# NLP Gender & Sentiment Analyzer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

> **🎯 Live Demo:** [bijaysoti.com.np/demo/nlp-analysis](https://bijaysoti.com.np/demo/nlp-analysis)

## 🧠 Problem Statement

Language carries implicit biases that often go unnoticed. Gender-biased language in corporate communications, media, and everyday writing perpetuates stereotypes. This tool analyzes text for **gender representation**, **sentiment**, and **social bias patterns**, providing actionable recommendations for more inclusive language.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEXT INPUT                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  "The CEO announced that all employees should work harder.  ││
│  │   The chairman praised the salesmen for exceeding targets." ││
│  └──────────────────────────────┬──────────────────────────────┘│
└─────────────────────────────────┼───────────────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NLP PIPELINE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Tokenize  │→ │     NER     │→ │   POS Tag   │              │
│  │   & Parse   │  │  (Entities) │  │  (Grammar)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │               │               │                        │
│         └───────────────┴───────┬───────┘                        │
│                                 ▼                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ANALYSIS MODULES:                                         │  │
│  │  • Sentiment Analysis (positive/negative/neutral)          │  │
│  │  • Gender Reference Detection (he/she/they/gendered terms) │  │
│  │  • Bias Pattern Matching (gendered job titles, pronouns)   │  │
│  │  • Social Representation Scoring                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTPUT                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ Sentiment Report │  │ Gender Analysis  │  │Recommendations │ │
│  │ • Overall: Neg   │  │ • Male: 5 refs   │  │ • Use "chair"  │ │
│  │ • Score: 0.65    │  │ • Female: 1 ref  │  │ • Use "sales-  │ │
│  │ • Breakdown      │  │ • Bias: 0.72     │  │   people"      │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔬 Analysis Components

### 1. Sentiment Analysis
Uses VADER (Valence Aware Dictionary and Sentiment Reasoner) for robust sentiment scoring:

```python
def analyze_sentiment(text: str) -> SentimentResult:
    scores = sia.polarity_scores(text)
    return SentimentResult(
        overall=classify_sentiment(scores['compound']),
        score=scores['compound'],
        breakdown={
            'positive': scores['pos'] * 100,
            'negative': scores['neg'] * 100,
            'neutral': scores['neu'] * 100
        }
    )
```

### 2. Gender Reference Detection
Identifies gendered language patterns:

| Category | Examples |
|----------|----------|
| Male Terms | he, him, his, chairman, salesman, fireman |
| Female Terms | she, her, hers, chairwoman, saleswoman |
| Neutral Terms | they, them, chair, salesperson, firefighter |
| Bias Indicators | Gendered job titles, default male pronouns |

### 3. Bias Score Calculation

```python
def calculate_bias_score(male_refs: int, female_refs: int, neutral_refs: int) -> float:
    """
    Calculate gender bias score (0 = balanced, 1 = heavily biased).
    
    Formula considers:
    - Ratio imbalance between male and female references
    - Proportion of neutral language used
    - Presence of gendered job titles
    """
    total = male_refs + female_refs + neutral_refs
    if total == 0:
        return 0.0
    
    imbalance = abs(male_refs - female_refs) / max(male_refs + female_refs, 1)
    neutral_ratio = neutral_refs / total
    
    # Lower neutral usage increases bias score
    return imbalance * (1 - neutral_ratio * 0.5)
```

## 📁 Project Structure

```
nlp-gender-analysis/
├── src/
│   ├── analyzer.py         # Core NLP analysis engine
│   ├── sentiment.py        # Sentiment analysis module
│   ├── gender_detector.py  # Gender reference detection
│   ├── bias_scorer.py      # Bias calculation
│   ├── recommender.py      # Inclusive language suggestions
│   └── api.py              # REST API endpoints
├── data/
│   ├── gendered_terms.json # Dictionary of gendered terms
│   └── neutral_alternatives.json # Gender-neutral alternatives
├── tests/
│   └── test_analyzer.py    # Unit tests
├── requirements.txt
├── Dockerfile
└── README.md
```

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/0HuN-TeR0/nlp-gender-analysis.git
cd nlp-gender-analysis
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Run the application
python src/api.py
```

## 📊 API Reference

### POST /analyze

**Request:**
```json
{
  "text": "The CEO announced that all employees should work harder. The chairman praised the salesmen."
}
```

**Response:**
```json
{
  "sentiment": {
    "overall": "neutral",
    "score": 0.42,
    "breakdown": { "positive": 15, "negative": 12, "neutral": 73 }
  },
  "genderAnalysis": {
    "maleReferences": 4,
    "femaleReferences": 0,
    "neutralReferences": 2,
    "biasIndicators": ["chairman", "salesmen"],
    "biasScore": 0.72
  },
  "recommendations": [
    "Replace 'chairman' with 'chairperson' or 'chair'",
    "Replace 'salesmen' with 'salespeople' or 'sales team'"
  ]
}
```

## 🧪 Testing

```bash
pytest tests/ -v --cov=src
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Bijay Soti** - AI/ML Engineer  
- Website: [bijaysoti.lovable.app](https://bijaysoti.lovable.app)
- GitHub: [@0HuN-TeR0](https://github.com/0HuN-TeR0)
