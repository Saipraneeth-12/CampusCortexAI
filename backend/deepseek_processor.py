"""
deepseek_processor.py — DeepSeek AI Integration for Morning Pulse AI
High-performance AI analysis using DeepSeek's API with automatic fallback.
"""
import os
import json
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

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
        print(f"[deepseek] 📁 Loaded environment from: {env_path}")
        break

if not env_loaded:
    print(f"[deepseek] ⚠️ No .env file found, trying system environment variables")
    load_dotenv()

# DeepSeek API Configuration
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"

if not DEEPSEEK_API_KEY:
    raise ValueError("No DEEPSEEK_API_KEY found. Please set it in your .env file.")

print(f"[deepseek] 🔑 DeepSeek API Key: {DEEPSEEK_API_KEY[:20]}...{DEEPSEEK_API_KEY[-4:]}")

# Model configuration with fallback chain
DEEPSEEK_MODELS = [
    "deepseek-chat",           # Primary model - best for general tasks
]

_model_usage_count = {}
_failed_models = set()
_rate_limit_until = None

def _call_deepseek(prompt: str, model: str = "deepseek-chat", max_tokens: int = 4000) -> str:
    """Make a call to DeepSeek API with error handling."""
    global _rate_limit_until
    
    # Check if we're rate limited
    if _rate_limit_until and datetime.now() < _rate_limit_until:
        wait_time = (_rate_limit_until - datetime.now()).total_seconds()
        raise Exception(f"Rate limited. Wait {wait_time:.0f} seconds before retry")
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
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
        "stream": False
    }
    
    try:
        print(f"[deepseek] 🚀 Calling {model}...")
        
        response = requests.post(
            f"{DEEPSEEK_BASE_URL}/chat/completions",
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
                
                print(f"[deepseek] ✅ Success with {model} (usage: {_model_usage_count[model]})")
                print(f"[deepseek] 📊 Response: {len(content)} characters")
                
                return content.strip()
            else:
                raise Exception(f"No choices in response: {data}")
                
        elif response.status_code == 429:
            # Rate limited - set retry time
            retry_after = response.headers.get('Retry-After', '60')
            try:
                retry_seconds = int(retry_after)
            except:
                retry_seconds = 60
            
            _rate_limit_until = datetime.now() + timedelta(seconds=retry_seconds)
            raise Exception(f"Rate limit exceeded. Retry after {retry_seconds}s")
            
        elif response.status_code == 401:
            raise Exception(f"Invalid API key for DeepSeek")
            
        elif response.status_code == 402:
            raise Exception(f"Insufficient balance on DeepSeek account")
            
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
    """Try DeepSeek models with fallback chain."""
    
    available_models = [m for m in DEEPSEEK_MODELS if m not in _failed_models]
    
    if not available_models:
        print("[deepseek] 🔄 All models failed, resetting and retrying...")
        _failed_models.clear()
        available_models = DEEPSEEK_MODELS.copy()
    
    last_error = None
    
    for model in available_models:
        try:
            result = _call_deepseek(prompt, model)
            
            if len(result) > 50:  # Ensure substantial response
                return result
            else:
                print(f"[deepseek] ⚠️ {model} returned short response: {len(result)} chars")
                continue
                
        except Exception as e:
            error_str = str(e)
            print(f"[deepseek] ❌ {model} failed: {error_str}")
            
            # Mark model as failed for rate limits or persistent errors
            if "rate limit" in error_str.lower() or "429" in error_str:
                _failed_models.add(model)
                print(f"[deepseek] 🚫 Marked {model} as temporarily failed")
            
            last_error = error_str
            continue
    
    # All models failed, provide intelligent fallback
    if "api key" in str(last_error).lower() or "401" in str(last_error):
        return """DeepSeek API authentication failed. Please check your API key.

**To fix:**
1. Verify your DeepSeek API key is correct
2. Check your account has sufficient credits
3. Ensure the key has proper permissions

**Current Status:** Using fallback intelligence until API access is restored."""
    
    elif "insufficient balance" in str(last_error).lower() or "402" in str(last_error):
        return """DeepSeek API: Insufficient balance on account.

**To fix:**
1. Add credits to your DeepSeek account
2. Visit https://platform.deepseek.com/account/billing/overview
3. Add payment method and top up balance

**Current Status:** Using fallback intelligence until balance is restored."""
    
    elif "rate limit" in str(last_error).lower() or "429" in str(last_error):
        return """DeepSeek API rate limit reached.

**Current Status:** All available models are temporarily rate-limited.

**Auto-Recovery:** The system will automatically retry as limits reset. Please try again in a few minutes."""
    
    else:
        return f"""DeepSeek AI analysis temporarily unavailable.

**Last Error:** {last_error}

**System Status:** Trying {len(DEEPSEEK_MODELS)} available models.

**Recommendation:** Please try again in a moment for fresh intelligence updates."""

def test_deepseek_connection():
    """Test DeepSeek API connection and functionality."""
    print(f"[deepseek] 🧪 Testing DeepSeek API connection...")
    
    try:
        result = _call_deepseek("What is 2+2? Respond with just the number.", "deepseek-chat", 10)
        
        if "4" in result:
            print(f"[deepseek] ✅ DeepSeek API test successful!")
            return True
        else:
            print(f"[deepseek] ⚠️ Unexpected response: {result}")
            return False
            
    except Exception as e:
        print(f"[deepseek] ❌ DeepSeek API test failed: {e}")
        return False

# Test connection on import
if test_deepseek_connection():
    print(f"[deepseek] 🎉 DeepSeek integration ready!")
else:
    print(f"[deepseek] ⚠️ DeepSeek integration has issues, will use fallbacks")

def analyze(news, role):
    """Analyze news using DeepSeek AI."""
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
STEP 7: Strategic moves should include both current state assessment AND actionable next steps.

ENHANCED DAILY BRIEF FORMAT:
- Sentence 1-2: Current market state/landscape for {role}
- Sentence 3-4: Key strategic implications and immediate priorities

ENHANCED STRATEGIC MOVES FORMAT:
- Include "Current State: [assessment]" followed by "Action: [specific step]"

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
        
        # Clean up response
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        
        result = json.loads(text)
        required = ["daily_brief", "top_articles", "top_trends", "growth_opportunities", "threats"]
        
        if not all(k in result for k in required):
            raise ValueError("Missing required keys")
        
        # Merge links back
        result["top_articles"] = _merge_links(result.get("top_articles", []), news)
        return result
        
    except Exception as e:
        print(f"[deepseek] analyze failed: {e}")
        return _fallback_response(role, news)

def generate_trends_forecast(news, role):
    """Generate trend forecasts using DeepSeek AI."""
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
            trend["forecast"] = trend["weekly_activity"]  # backward compat

        return result
        
    except Exception as e:
        print(f"[deepseek] trends forecast failed: {e}")
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
    """Enhanced fallback when AI analysis fails."""
    
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
            "what_happened": description or f"Article from {source} about {title.lower()}",
            "why_it_matters": f"Relevant to {role} - manual review recommended for detailed analysis.",
            "target_roles_impacted": [role],
            "opportunity_level": "Medium",
            "recommended_action": f"Review this {category.replace('_', ' ')} update and assess its impact on your {role.lower()} strategy.",
            "urgency_score": 6 if category == "competitor" else 5,
            "link": item.get("link", ""),
            "source": source,
            "published_date": item.get("published_date", ""),
        }
        
        categorized[category].append(fallback_article)
    
    all_articles = []
    for category_articles in categorized.values():
        all_articles.extend(category_articles)
    
    role_insights = {
        "Institute Owner": {
            "brief": f"Found {len(news)} education technology updates using DeepSeek AI fallback analysis.",
            "trends": ["AI tutoring adoption", "LMS integration", "Teacher training", "Student engagement"],
            "opportunities": ["AI curriculum design", "Teacher development", "Student analytics"],
            "threats": ["Competitor launches", "Regulatory changes", "Adoption barriers"],
            "moves": ["Evaluate AI solutions", "Assess competitors", "Review integration options"]
        },
        "Backend Developer": {
            "brief": f"Identified {len(news)} technology updates using DeepSeek AI fallback analysis.",
            "trends": ["AI inference APIs", "Edge computing", "Real-time processing", "MLOps platforms"],
            "opportunities": ["AI deployment", "API optimization", "Cloud development"],
            "threats": ["Technology obsolescence", "Security vulnerabilities", "Performance issues"],
            "moves": ["Explore AI patterns", "Evaluate frameworks", "Assess infrastructure"]
        }
    }
    
    insights = role_insights.get(role, role_insights["Institute Owner"])
    
    return {
        "daily_brief": insights["brief"],
        "top_articles": all_articles[:8],
        "top_trends": insights["trends"][:5],
        "growth_opportunities": insights["opportunities"][:4],
        "threats": insights["threats"][:3],
        "missed_opportunities": [
            f"Full DeepSeek AI analysis of {len(news)} articles",
            "Personalized strategic recommendations",
            "Advanced competitive intelligence"
        ],
        "strategic_moves": insights["moves"][:4],
        "tools_to_watch": [
            "DeepSeek AI (restore for full analysis)",
            "Market intelligence platforms",
            "Competitive analysis tools"
        ],
        "hiring_signals": [
            f"Review {len([a for a in news if 'hiring' in a.get('title', '').lower()])} hiring updates",
            "Monitor skill demand trends",
            "Track compensation changes"
        ]
    }

def _empty_trends_response(role):
    return {
        "trends": [
            {
                "name": "No Data",
                "growth": 0,
                "confidence": 50,
                "color": "oklch(0.7 0.24 255)",
                "desc": f"No trend data available for {role}. Check back after news scraping completes.",
                "weekly_activity": [40] * 7,
                "forecast": [40] * 7
            }
        ]
    }

def _fallback_trends_response(role):
    """Fallback trends when AI analysis fails."""
    base_trends = {
        "Institute Owner": [
            {"name": "AI Tutoring", "growth": 312, "confidence": 96, "color": "oklch(0.7 0.24 255)", "desc": "Personalized AI tutors for K-12 and competitive exam prep"},
            {"name": "Hybrid Learning", "growth": 187, "confidence": 91, "color": "oklch(0.72 0.27 340)", "desc": "Blended online-offline models gaining traction"},
            {"name": "LMS Adoption", "growth": 142, "confidence": 88, "color": "oklch(0.85 0.18 200)", "desc": "School management + LMS integration demand"},
            {"name": "Vernacular EdTech", "growth": 248, "confidence": 94, "color": "oklch(0.78 0.2 155)", "desc": "Regional language content demand surging"},
            {"name": "Gamification", "growth": 96, "confidence": 79, "color": "oklch(0.82 0.17 75)", "desc": "Engagement mechanics driving retention"},
            {"name": "Parent Analytics", "growth": 64, "confidence": 71, "color": "oklch(0.65 0.28 300)", "desc": "Parent-facing dashboards for tracking"},
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