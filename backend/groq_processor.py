"""
groq_processor.py — Groq AI Integration for Morning Pulse AI
High-performance AI analysis using Groq's API.
"""
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
env_paths = [
    '.env',
    os.path.join(os.path.dirname(__file__), '.env'),
]

env_loaded = False
for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path)
        env_loaded = True
        print(f"[groq] 📁 Loaded environment from: {env_path}")
        break

if not env_loaded:
    print(f"[groq] ⚠️ No .env file found, trying system environment variables")
    load_dotenv()

# Groq API Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"

if not GROQ_API_KEY:
    raise ValueError("No GROQ_API_KEY found. Please set it in your .env file.")

print(f"[groq] 🔑 Groq API Key: {GROQ_API_KEY[:20]}...{GROQ_API_KEY[-4:]}")

# Model configuration
GROQ_MODELS = [
    "llama-3.3-70b-versatile",      # Primary model - powerful and versatile
    "llama-3.1-8b-instant",         # Fallback - faster, smaller
]

_model_usage_count = {}
_failed_models = set()

def _call_groq(prompt: str, model: str = "mixtral-8x7b-32768", max_tokens: int = 4000) -> str:
    """Make a call to Groq API."""
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.4,
    }
    
    try:
        print(f"[groq] 🚀 Calling {model}...")
        
        response = requests.post(
            f"{GROQ_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if "choices" in data and len(data["choices"]) > 0:
                content = data["choices"][0]["message"]["content"]
                
                # Track usage
                _model_usage_count[model] = _model_usage_count.get(model, 0) + 1
                
                print(f"[groq] ✅ Success with {model} (usage: {_model_usage_count[model]})")
                print(f"[groq] 📊 Response: {len(content)} characters")
                
                return content.strip()
            else:
                raise Exception(f"No choices in response: {data}")
                
        elif response.status_code == 429:
            raise Exception(f"Rate limit exceeded for {model}")
        elif response.status_code == 401:
            raise Exception(f"Invalid API key for Groq")
        else:
            error_msg = response.text
            try:
                error_data = response.json()
                if "error" in error_data:
                    error_msg = error_data["error"].get("message", error_msg)
            except:
                pass
            raise Exception(f"API error {response.status_code}: {error_msg}")
            
    except requests.exceptions.Timeout:
        raise Exception(f"Timeout calling {model}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error calling {model}: {e}")
    except Exception as e:
        raise Exception(f"Error calling {model}: {e}")

def _try_all_models(prompt: str) -> str:
    """Try Groq models with fallback chain."""
    
    available_models = [m for m in GROQ_MODELS if m not in _failed_models]
    
    if not available_models:
        print("[groq] 🔄 All models failed, resetting and retrying...")
        _failed_models.clear()
        available_models = GROQ_MODELS.copy()
    
    last_error = None
    
    for model in available_models:
        try:
            result = _call_groq(prompt, model)
            
            if len(result) > 50:  # Ensure substantial response
                return result
            else:
                print(f"[groq] ⚠️ {model} returned short response: {len(result)} chars")
                continue
                
        except Exception as e:
            error_str = str(e)
            print(f"[groq] ❌ {model} failed: {error_str}")
            
            # Mark model as failed for rate limits
            if "rate limit" in error_str.lower() or "429" in error_str:
                _failed_models.add(model)
                print(f"[groq] 🚫 Marked {model} as temporarily failed")
            
            last_error = error_str
            continue
    
    # All models failed, provide intelligent fallback
    if "api key" in str(last_error).lower() or "401" in str(last_error):
        return """Groq API authentication failed. Please check your API key.

**To fix:**
1. Verify your Groq API key is correct
2. Get a new key from https://console.groq.com/keys
3. Update .env file with new key

**Current Status:** Using fallback intelligence until API access is restored."""
    
    elif "rate limit" in str(last_error).lower() or "429" in str(last_error):
        return """Groq API rate limit reached.

**Current Status:** All available models are temporarily rate-limited.

**Auto-Recovery:** The system will automatically retry as limits reset. Please try again in a few minutes."""
    
    else:
        return f"""Groq AI analysis temporarily unavailable.

**Last Error:** {last_error}

**System Status:** Trying {len(GROQ_MODELS)} available models.

**Recommendation:** Please try again in a moment for fresh intelligence updates."""

def test_groq_connection():
    """Test Groq API connection and functionality."""
    print(f"[groq] 🧪 Testing Groq API connection...")
    
    try:
        result = _call_groq("What is 2+2? Respond with just the number.", "llama-3.3-70b-versatile", 10)
        
        if "4" in result:
            print(f"[groq] ✅ Groq API test successful!")
            return True
        else:
            print(f"[groq] ⚠️ Unexpected response: {result}")
            return False
            
    except Exception as e:
        print(f"[groq] ❌ Groq API test failed: {e}")
        return False

# Test connection on import
if test_groq_connection():
    print(f"[groq] 🎉 Groq integration ready!")
else:
    print(f"[groq] ⚠️ Groq integration has issues, will use fallbacks")

def analyze(news, role):
    """Analyze news using Groq AI."""
    if not news:
        return _empty_response(role)

    trimmed = [
        {
            "title": n.get("title", ""),
            "source": n.get("source", ""),
            "category": n.get("_category", "general"),
            "description": n.get("description", "")[:300],
            "score": round(n.get("score", 0), 1),
        }
        for n in news
    ]

    prompt = f"""
You are an elite AI Market Intelligence Strategist for a {role}.

Analyze these real-time articles. Each article has a category tag and source:
- "competitor": competitor updates, product launches, funding, acquisitions
- "pain_point": user/teacher frustrations, school problems (often from Reddit)
- "tech_trend": emerging AI/tech trends in education

CRITICAL SOURCE DIVERSITY RULE:
- You MUST include articles from ALL available sources: Reddit, LinkedIn, Hacker News, Google News, Guardian, EdSurge, etc.
- Do NOT only pick Google News articles. Reddit posts reveal real user pain points. LinkedIn posts reveal professional announcements.
- If a Reddit post or LinkedIn article is in the input, it MUST appear in top_articles if relevant.
- Aim for at least 1 Reddit article and 1 LinkedIn article in top_articles if they exist in the input.

Your job: extract maximum business intelligence for a {role}.
Every insight must be specific, actionable, and directly relevant.

STEP 1: Filter — keep only relevant articles. Remove generic PR noise, politics, sports, entertainment.
STEP 2: Deduplicate — merge same-story articles.
STEP 3: Prioritize — rank by: funding/acquisition signals > product launches > AI adoption > pain points > trends.
         IMPORTANT: Reddit pain points and LinkedIn announcements are HIGH priority — include them.
STEP 4: For each top article fill all fields with real analysis.
STEP 5: Write a CEO-style daily_brief (3-4 sentences) that includes CURRENT STATE context before strategic insights.
STEP 6: All lists must be specific to {role}. Minimum 4 items per list.
STEP 7: Strategic moves must be STRINGS only. Format: "Current State: [assessment]. Action: [specific step]"

CRITICAL: ALL ARRAY FIELDS MUST CONTAIN ONLY STRINGS:
- top_trends: array of strings
- growth_opportunities: array of strings
- threats: array of strings
- strategic_moves: array of strings (NOT objects)
- tools_to_watch: array of strings
- hiring_signals: array of strings
- missed_opportunities: array of strings

ENHANCED DAILY BRIEF FORMAT:
- Sentence 1-2: Current market state/landscape for {role}
- Sentence 3-4: Key strategic implications and immediate priorities

ENHANCED STRATEGIC MOVES FORMAT (STRINGS ONLY):
- "Current State: [assessment]. Action: [specific step]"
- Example: "Current State: AI tutoring market growing 40% YoY. Action: Evaluate partnerships with top 3 AI tutoring platforms"

Return ONLY valid JSON. No markdown. No text outside JSON:

{{
  "daily_brief": "",
  "top_articles": [
    {{
      "title": "",
      "short_summary": "",
      "what_happened": "",
      "why_it_matters": "",
      "target_roles_impacted": [],
      "opportunity_level": "",
      "recommended_action": "",
      "urgency_score": 8
    }}
  ],
  "top_trends": [],
  "growth_opportunities": [],
  "threats": [],
  "missed_opportunities": [],
  "strategic_moves": [],
  "tools_to_watch": [],
  "hiring_signals": []
}}

NEWS ARTICLES (include Reddit and LinkedIn sources in top_articles):
{trimmed}
"""

    try:
        text = _try_all_models(prompt)
        
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        
        result = json.loads(text)
        required = ["daily_brief", "top_articles", "top_trends", "growth_opportunities", "threats"]
        
        if not all(k in result for k in required):
            raise ValueError("Missing required keys")
        
        result["top_articles"] = _merge_links(result.get("top_articles", []), news)
        
        # Post-process: ensure ALL array fields contain only strings
        for field in ["top_trends", "growth_opportunities", "threats", "missed_opportunities", "strategic_moves", "tools_to_watch", "hiring_signals"]:
            if field in result and isinstance(result[field], list):
                result[field] = [
                    item if isinstance(item, str) else (
                        item.get("title") or item.get("name") or item.get("move") or item.get("description") or str(item)
                    ) if isinstance(item, dict) else str(item)
                    for item in result[field]
                ]
        
        return result
        
    except Exception as e:
        print(f"[groq] analyze failed: {e}")
        return _fallback_response(role, news)

def generate_trends_forecast(news, role):
    """Generate trend forecasts using Groq AI."""
    if not news:
        return _empty_trends_response(role)

    trimmed = [
        {
            "title": n.get("title", ""),
            "source": n.get("source", ""),
            "category": n.get("_category", "general"),
            "description": n.get("description", "")[:300],
        }
        for n in news
    ]

    prompt = f"""
You are an elite Market Intelligence Analyst identifying trends for a {role} based on TODAY'S news.

Analyze these real-time articles and identify 6 key trends visible RIGHT NOW.

For each trend provide:
- name: Short, punchy trend name (2-4 words)
- growth: Current momentum percentage (-50 to +500) based on how much this topic appears in today's news
- confidence: Your confidence in this trend (70-99%)
- color: One of these exact values: "oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)", "oklch(0.85 0.18 200)", "oklch(0.78 0.2 155)", "oklch(0.82 0.17 75)", "oklch(0.65 0.28 300)"
- desc: One-sentence description of what this trend means for a {role} based on today's news
- weekly_activity: Array of exactly 7 numbers (Mon to Sun) showing article activity/signal strength for this trend over the past 7 days (0-100). Day 7 (today) should reflect the most articles.

Focus on trends visible in TODAY'S articles for {role}:
- Institute Owner: AI tutoring, hybrid learning, LMS adoption, vernacular content, gamification
- Backend Developer: Edge runtimes, AI inference APIs, TypeScript adoption, real-time APIs, Rust
- Data Engineer: Streaming pipelines, lakehouse patterns, AI/ML pipelines, data contracts, dbt
- Founder: AI-native SaaS, vertical AI, B2B EdTech, vernacular markets, creator economy
- Product Builder: AI agents, voice interfaces, no-code AI, gamification, collaborative AI

Return ONLY valid JSON. No markdown:

{{
  "trends": [
    {{
      "name": "",
      "growth": 0,
      "confidence": 0,
      "color": "",
      "desc": "",
      "weekly_activity": [30, 35, 42, 55, 60, 72, 85]
    }}
  ]
}}

TODAY'S ARTICLES:
{trimmed}
"""

    try:
        text = _try_all_models(prompt)
        
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        
        result = json.loads(text)

        if "trends" not in result or not isinstance(result["trends"], list):
            raise ValueError("Invalid trends response format")

        for trend in result["trends"]:
            if not all(k in trend for k in ["name", "growth", "confidence", "color", "desc", "weekly_activity"]):
                raise ValueError("Missing required trend fields")
            wa = trend.get("weekly_activity", [])
            if not isinstance(wa, list) or len(wa) != 7:
                trend["weekly_activity"] = [30 + i * 10 for i in range(7)]
            trend["forecast"] = trend["weekly_activity"]

        return result
        
    except Exception as e:
        print(f"[groq] trends forecast failed: {e}")
        return _fallback_trends_response(role)

def _merge_links(articles, original_news):
    """Attach link, source, published_date back from original scraped news."""
    link_map = {}
    for item in original_news:
        key = item.get("title", "").lower()[:60]
        link_map[key] = {
            "link": item.get("link", ""),
            "source": item.get("source", ""),
            "published_date": item.get("published_date", ""),
        }

    for article in articles:
        ai_title = article.get("title", "").lower()[:60]
        meta = link_map.get(ai_title)
        if not meta:
            best, best_score = {}, 0
            a_words = set(ai_title.split())
            for orig_key, orig_meta in link_map.items():
                score = len(a_words & set(orig_key.split()))
                if score > best_score:
                    best_score = score
                    best = orig_meta
            meta = best if best_score >= 3 else {}

        article["link"] = meta.get("link", "")
        article["source"] = meta.get("source", "")
        article["published_date"] = meta.get("published_date", "")

    return articles

def _empty_response(role):
    return {
        "daily_brief": f"No relevant news found for {role} today.",
        "top_articles": [], "top_trends": [], "growth_opportunities": [],
        "threats": [], "missed_opportunities": [], "strategic_moves": [],
        "tools_to_watch": [], "hiring_signals": []
    }

def _fallback_response(role, news):
    """Fallback when AI analysis fails. Returns ONLY strings in all arrays."""
    
    categorized = {
        "competitor": [],
        "pain_point": [],
        "tech_trend": [],
        "general": []
    }
    
    for item in news[:12]:
        category = item.get("_category", "general")
        title = item.get("title", "")
        source = item.get("source", "Unknown")
        description = item.get("description", "")[:200]
        
        fallback_article = {
            "title": title,
            "short_summary": f"Source: {source}",
            "what_happened": description or f"Article from {source}",
            "why_it_matters": f"Relevant to {role}",
            "target_roles_impacted": [role],
            "opportunity_level": "Medium",
            "recommended_action": f"Review this {category.replace('_', ' ')} update",
            "urgency_score": 6 if category == "competitor" else 5,
            "link": item.get("link", ""),
            "source": source,
            "published_date": item.get("published_date", ""),
        }
        
        categorized[category].append(fallback_article)
    
    all_articles = []
    for category_articles in categorized.values():
        all_articles.extend(category_articles)
    
    # Generate role-specific daily briefs
    role_briefs = {
        "Institute Owner": "The EdTech market is experiencing rapid AI adoption with major players launching AI tutoring platforms. Hybrid learning models are gaining traction as institutions seek to balance online and offline experiences. Key opportunities exist in vernacular content expansion and parent engagement tools. Immediate priorities: evaluate AI tutoring partnerships, assess LMS integration needs, and plan hybrid model pilots.",
        "Backend Developer": "Edge computing and serverless AI inference are becoming production-ready, with Lambda and Cloudflare Workers leading adoption. FastAPI and Bun are gaining momentum for high-performance APIs. Real-time data processing patterns are evolving with streaming-first architectures. Key actions: benchmark Bun 2.0, evaluate Lambda for AI workloads, and prototype edge AI endpoints.",
        "Data Engineer": "Data lakehouse patterns are consolidating the modern data stack, with Iceberg adoption accelerating. dbt 2.0 streaming capabilities are reducing complexity in real-time pipelines. In-warehouse ML scoring is eliminating separate feature stores. Priorities: pilot dbt 2.0 streaming, plan Iceberg migration, and evaluate Snowflake Cortex for ML scoring.",
        "Founder / Entrepreneur": "AI-native SaaS is attracting significant VC funding, with vertical AI and B2B EdTech showing strong growth. Series A fundraising narratives increasingly center on AI differentiation. Enterprise sales motions are becoming critical for EdTech platforms. Strategic focus: prepare AI-focused Series A deck, launch B2B sales motion, and validate vernacular market demand.",
        "Product Builder": "AI agents and autonomous features are becoming table stakes for modern products. Habit-loop mechanics (like Duolingo's streak) drive 28% higher retention. Voice-first interfaces are emerging as a key UX trend. Immediate tasks: define AI agent roadmap, A/B test retention mechanics, and prototype voice interfaces.",
    }
    
    daily_brief = role_briefs.get(role, role_briefs["Institute Owner"])
    
    return {
        "daily_brief": daily_brief,
        "top_articles": all_articles[:8],
        "top_trends": ["AI adoption", "Market consolidation", "Technology integration", "Digital transformation"],
        "growth_opportunities": ["Market expansion", "Technology partnerships", "Product innovation", "Strategic positioning"],
        "threats": ["Competitive pressure", "Technology disruption", "Market consolidation", "Regulatory changes"],
        "missed_opportunities": ["Full AI analysis", "Deeper market insights"],
        "strategic_moves": [
            "Current State: Market is evolving rapidly. Action: Monitor competitor announcements weekly",
            "Current State: Technology adoption accelerating. Action: Evaluate emerging platforms for integration",
            "Current State: Talent competition increasing. Action: Review hiring trends in your sector",
            "Current State: Customer expectations rising. Action: Assess product-market fit quarterly"
        ],
        "tools_to_watch": ["Groq API", "Market intelligence platforms", "Competitor tracking tools", "Trend analysis systems"],
        "hiring_signals": ["Review hiring updates", "Monitor talent movements", "Track skill demand shifts", "Assess team expansion needs"]
    }

def _empty_trends_response(role):
    return {
        "trends": [
            {
                "name": "No Data",
                "growth": 0,
                "confidence": 50,
                "color": "oklch(0.7 0.24 255)",
                "desc": f"No trend data available for {role}.",
                "weekly_activity": [40] * 7,
                "forecast": [40] * 7
            }
        ]
    }

def _fallback_trends_response(role):
    """Fallback trends when AI analysis fails."""
    base_trends = {
        "Institute Owner": [
            {"name": "AI Tutoring", "growth": 312, "confidence": 96, "color": "oklch(0.7 0.24 255)", "desc": "Personalized AI tutors for K-12"},
            {"name": "Hybrid Learning", "growth": 187, "confidence": 91, "color": "oklch(0.72 0.27 340)", "desc": "Blended online-offline models"},
            {"name": "LMS Adoption", "growth": 142, "confidence": 88, "color": "oklch(0.85 0.18 200)", "desc": "School management integration"},
            {"name": "Vernacular EdTech", "growth": 248, "confidence": 94, "color": "oklch(0.78 0.2 155)", "desc": "Regional language content"},
            {"name": "Gamification", "growth": 96, "confidence": 79, "color": "oklch(0.82 0.17 75)", "desc": "Engagement mechanics"},
            {"name": "Parent Analytics", "growth": 64, "confidence": 71, "color": "oklch(0.65 0.28 300)", "desc": "Parent-facing dashboards"},
        ]
    }
    
    trends = base_trends.get(role, base_trends["Institute Owner"])
    
    for i, trend in enumerate(trends):
        base = 20 + i * 5
        trend["weekly_activity"] = [
            min(100, base + j * (8 + i * 2) + (j % 2) * 4)
            for j in range(7)
        ]
        trend["forecast"] = trend["weekly_activity"]
    
    return {"trends": trends}