import os
import time
import json
import google.generativeai as genai

API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyATBCBbduInSpu3-OiMagrfWeQLxkocKpg")
genai.configure(api_key=API_KEY)

# Full fallback chain — every model that supports generateContent
MODEL_FALLBACK = [
    "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite", "gemini-2.5-flash-lite", "gemini-flash-latest",
    "gemini-flash-lite-latest", "gemini-pro-latest",
    "gemma-3-27b-it", "gemma-3-12b-it", "gemma-3-4b-it",
]
_exhausted: set = set()


def _call_gemini(prompt: str, model_name: str) -> str:
    """Single model call — raises on quota, returns text on success."""
    m = genai.GenerativeModel(model_name)
    response = m.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(temperature=0.4, max_output_tokens=8192),
    )
    return response.text.strip()


def _try_all_models(prompt: str) -> str:
    """Try every model in fallback order, skip exhausted ones."""
    last_err = None
    for name in MODEL_FALLBACK:
        if name in _exhausted:
            continue
        try:
            text = _call_gemini(prompt, name)
            print(f"[gemini] Success with {name}")
            return text
        except Exception as e:
            err = str(e)
            if "429" in err or "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err:
                print(f"[gemini] {name} quota exhausted")
                _exhausted.add(name)
                last_err = err
                continue
            if "403" in err or "api key" in err.lower() or "API_KEY_INVALID" in err:
                raise Exception("Invalid API key. Update GEMINI_API_KEY.")
            last_err = err
            continue
    raise Exception(f"All Gemini models exhausted. Last error: {last_err}")


def _merge_links(articles, original_news):
    """Attach link, source, published_date back from original scraped news."""
    link_map = {}
    for item in original_news:
        key = item.get("title", "").lower()[:60]
        link_map[key] = {
            "link":           item.get("link", ""),
            "source":         item.get("source", ""),
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

        article["link"]           = meta.get("link", "")
        article["source"]         = meta.get("source", "")
        article["published_date"] = meta.get("published_date", "")

    return articles


def analyze(news, role):
    if not news:
        return _empty_response(role)

    trimmed = [
        {
            "title":       n.get("title", ""),
            "source":      n.get("source", ""),
            "category":    n.get("_category", "general"),
            "description": n.get("description", "")[:300],
        }
        for n in news
    ]

    prompt = f"""
You are an elite AI Market Intelligence Strategist for a {role}.

Analyze these real-time articles. Each article has a category tag:
- "competitor": competitor updates, product launches, funding, acquisitions
- "pain_point": user/teacher frustrations, school problems
- "tech_trend": emerging AI/tech trends in education

Your job: extract maximum business intelligence for a {role}.
Every insight must be specific, actionable, and directly relevant.

STEP 1: Filter — keep only relevant articles. Remove generic PR noise, politics, sports, entertainment.
STEP 2: Deduplicate — merge same-story articles.
STEP 3: Prioritize — rank by: funding/acquisition signals > product launches > AI adoption > pain points > trends.
STEP 4: For each top article fill all fields with real analysis.
STEP 5: Write a CEO-style daily_brief (2-3 sentences) for a {role}.
STEP 6: All lists must be specific to {role}. Minimum 4 items per list.

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

NEWS ARTICLES:
{trimmed}
"""

    try:
        text = _try_all_models(prompt)
        if "```" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        result = json.loads(text)
        required = ["daily_brief", "top_articles", "top_trends", "growth_opportunities", "threats"]
        if not all(k in result for k in required):
            raise ValueError("Missing required keys")
        result["top_articles"] = _merge_links(result.get("top_articles", []), news)
        return result
    except Exception as e:
        print(f"[gemini] analyze failed: {e}")
        return _fallback_response(role, news)


def _empty_response(role):
    return {
        "daily_brief": f"No relevant news found for {role} today.",
        "top_articles": [], "top_trends": [], "growth_opportunities": [],
        "threats": [], "missed_opportunities": [], "strategic_moves": [],
        "tools_to_watch": [], "hiring_signals": []
    }


def _fallback_response(role, news):
    return {
        "daily_brief": f"AI analysis temporarily unavailable. Showing {len(news)} raw articles for {role}.",
        "top_articles": [
            {
                "title":                 item.get("title", ""),
                "short_summary":         f"Source: {item.get('source', 'Unknown')}",
                "what_happened":         "AI analysis failed. Click the link to read the full article.",
                "why_it_matters":        "Manual review required.",
                "target_roles_impacted": [role],
                "opportunity_level":     "Medium",
                "recommended_action":    "Open the article link and assess relevance manually.",
                "urgency_score":         5,
                "link":                  item.get("link", ""),
                "source":                item.get("source", ""),
                "published_date":        item.get("published_date", ""),
            }
            for item in news[:6]
        ],
        "top_trends":           ["AI analysis temporarily unavailable — check back shortly"],
        "growth_opportunities": [],
        "threats":              [],
        "missed_opportunities": [],
        "strategic_moves":      [],
        "tools_to_watch":       [],
        "hiring_signals":       []
    }
