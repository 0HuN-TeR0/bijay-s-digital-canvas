import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "optmax":
        systemPrompt = `You are OptMax, an intelligent GPU recommendation system. You analyze user preferences and recommend the best GPUs based on weighted criteria.

Given user preferences for:
- Budget importance (0-100)
- Performance importance (0-100)  
- VRAM importance (0-100)
- Release year importance (0-100)

You must:
1. Recommend 5 GPUs that best match these preferences
2. Explain WHY each GPU was recommended with specific reasoning
3. Show a match score (0-100) for each
4. Format response as JSON with structure:
{
  "recommendations": [
    {
      "name": "GPU Name",
      "price": "$XXX",
      "benchmark": "XXX points",
      "vram": "XX GB",
      "year": "YYYY",
      "matchScore": XX,
      "explanation": "Why this GPU matches your preferences..."
    }
  ],
  "analysis": "Overall analysis of your preferences and recommendations"
}`;
        userPrompt = `User preferences: Budget: ${data.budget}%, Performance: ${data.performance}%, VRAM: ${data.vram}%, Recency: ${data.recency}%. Recommend 5 GPUs.`;
        break;

      case "collab-pro":
        systemPrompt = `You are Collab-Pro, an AI-powered influencer marketing platform. You match brands with influencers using recommendation algorithms.

Given a brand's requirements:
- Niche/Industry
- Target audience
- Budget range
- Campaign goals

You must:
1. Recommend 5 influencers that best match the brand
2. Provide match confidence scores (0-100)
3. Explain why each influencer is a good fit
4. Format as JSON:
{
  "matches": [
    {
      "name": "Influencer Name",
      "platform": "Instagram/YouTube/TikTok",
      "followers": "XXk",
      "niche": "Their niche",
      "engagementRate": "X.X%",
      "matchScore": XX,
      "reason": "Why they match..."
    }
  ],
  "strategy": "Recommended campaign strategy"
}`;
        userPrompt = `Brand: ${data.brandName}, Niche: ${data.niche}, Target: ${data.targetAudience}, Budget: ${data.budget}, Goals: ${data.goals}. Find matching influencers.`;
        break;

      case "nlp-analysis":
        systemPrompt = `You are an NLP Gender & Sentiment Analysis tool. You analyze text for:
1. Gender representation and bias
2. Sentiment (positive/negative/neutral)
3. Social representation patterns
4. Language bias indicators

Format response as JSON:
{
  "sentiment": {
    "overall": "positive/negative/neutral",
    "score": 0.XX,
    "breakdown": { "positive": X, "negative": X, "neutral": X }
  },
  "genderAnalysis": {
    "maleReferences": X,
    "femaleReferences": X,
    "neutralReferences": X,
    "biasIndicators": ["list of bias patterns found"],
    "biasScore": 0.XX
  },
  "socialRepresentation": {
    "dominantThemes": ["theme1", "theme2"],
    "representationScore": 0.XX,
    "observations": ["observation1", "observation2"]
  },
  "recommendations": ["How to improve representation..."]
}`;
        userPrompt = `Analyze this text for gender representation and sentiment: "${data.text}"`;
        break;

      case "financial-analytics":
        systemPrompt = `You are a Financial Analytics AI providing technical and fundamental analysis.

Given a stock ticker, provide:
1. Technical indicators analysis (Moving Averages, RSI, MACD)
2. Fundamental analysis summary
3. Price prediction insights
4. Risk assessment

Format as JSON:
{
  "ticker": "SYMBOL",
  "technicalAnalysis": {
    "trend": "bullish/bearish/neutral",
    "movingAverages": {
      "ma20": "above/below price",
      "ma50": "above/below price",
      "signal": "buy/sell/hold"
    },
    "rsi": {
      "value": XX,
      "signal": "overbought/oversold/neutral"
    },
    "macd": {
      "signal": "bullish/bearish crossover"
    }
  },
  "fundamentalAnalysis": {
    "peRatio": "XX.X",
    "marketCap": "$XXB",
    "sentiment": "positive/negative/neutral"
  },
  "prediction": {
    "shortTerm": "up/down/sideways",
    "confidence": XX,
    "reasoning": "..."
  },
  "riskLevel": "low/medium/high",
  "recommendation": "Buy/Sell/Hold with reasoning"
}`;
        userPrompt = `Provide comprehensive financial analysis for ticker: ${data.ticker}`;
        break;

      default:
        throw new Error("Unknown analysis type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { rawResponse: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI demo error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
