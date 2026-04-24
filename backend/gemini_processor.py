import os
import time
import json
import google.generativeai as genai

API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyD7Az9AKrwyAzWcUvv6QYHF2IMZTlxksQ4")
genai.configure(api_key=API_KEY)

# Full fallback chain — every model that supports generateContent
MODEL_FALLBACK = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemma-3-27b-it",
    "gemma-3-12b-it",
    "gemma-3-4b-it",
]

# Track which models are quota-exhausted this session
_exhausted: set = set()


def _pick_model():
    """Return (model, model_name) for the first non-exhausted model."""
    for name in MODEL_FALLBACK:
        if name in _exhausted:
            continue
        try:
            m = genai.GenerativeModel(name)
            # lightweight probe
            m.generate_content("hi", request_options={"timeout": 8})
            print(f"[gemini] Using model: {name}")
            return m, name
        except Exception as e:
            err = str(e)
            if "429" in err or "quota" in err.lower():
                print(f"[gemini] {name} quota exhausted, trying next...")
                _exhausted.add(name)
            else:
                # model exists but probe failed for another reason — still use it
                print(f"[gemini] Using model (probe failed): {name}")
                return genai.GenerativeModel(name), name
    raise RuntimeError("All Gemini models are quota-exhausted. Try again tomorrow or add a new API key.")


# Pick best available model at startup
try:
    _model, _model_name = _pick_model()
except RuntimeError as e:
    print(f"[gemini] WARNING: {e}")
    _model = genai.GenerativeModel(MODEL_FALLBACK[0])
    _model_name = MODEL_FALLBACK[0]


def _get_model():
    """Always return a working model, re-picking if current one got exhausted."""
    global _model, _model_name
    if _model_name in _exhausted:
        try:
            _model, _model_name = _pick_model()
        except RuntimeError:
            pass
    return _model


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
            "description": n.get("description", "")[:300],
        }
        for n in news
    ]

    prompt = f"""
You are an elite AI Market Intelligence Strategist and Competitive Growth Advisor.

Target User Role: {role}

Analyze these real-time articles SPECIFICALLY for a {role}.
Every insight, recommendation, trend, opportunity, and threat must be directly relevant to a {role}.
Do NOT include generic advice.

STEP 1: Filter articles relevant to {role}'s world:
- Founder / Entrepreneur: startup funding, competitor moves, market gaps, SaaS growth, EdTech investment, monetization, product-market fit
- Institute Owner: school/college management software, student enrollment, LMS, operations, competitor institutes
- Backend Developer: backend frameworks, APIs, cloud infra, developer tools, stack trends
- Data Engineer: data pipelines, ETL, real-time analytics, cloud data platforms, AI data stacks
- Product Builder: product launches, UX trends, no-code tools, SaaS features, AI product integrations
Remove: celebrity news, politics, sports, entertainment, crime, spam, duplicates.

STEP 2: Deduplicate — merge articles covering the same story.

STEP 3: Prioritize by: immediate business impact for {role}, funding signals, competitor moves, growth opportunities, new tools, disruption risks.

STEP 4: For each top article fill all fields with real analysis. Make recommended_action specific to {role}.

STEP 5: Write a CEO-style daily_brief (2-3 sentences) for a {role}.

STEP 6: All lists must be specific to {role}'s context. Minimum 4 items per list.

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

    last_err = None
    # Try each non-exhausted model
    for model_name in MODEL_FALLBACK:
        if model_name in _exhausted:
            continue
        try:
            m = genai.GenerativeModel(model_name)
            response = m.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.4,
                    max_output_tokens=8192,
                )
            )
            text = response.text.strip()
            if "```" in text:
                text = text.split("```json")[-1].split("```")[0].strip()

            result = json.loads(text)

            required = ["daily_brief", "top_articles", "top_trends", "growth_opportunities", "threats"]
            if not all(k in result for k in required):
                raise ValueError("Missing required keys in Gemini response")

            result["top_articles"] = _merge_links(result.get("top_articles", []), news)
            print(f"[gemini] Analysis complete using {model_name}")
            return result

        except Exception as e:
            err = str(e)
            if "429" in err or "quota" in err.lower():
                print(f"[gemini] {model_name} quota exhausted during analysis, trying next...")
                _exhausted.add(model_name)
                last_err = err
                continue
            elif isinstance(e, json.JSONDecodeError):
                print(f"[gemini] JSON parse error on {model_name}, trying next...")
                last_err = err
                continue
            elif "403" in err or "api key" in err.lower():
                raise Exception("Invalid API key. Set GEMINI_API_KEY environment variable.")
            else:
                last_err = err
                continue

    print(f"[gemini] All models exhausted. Using fallback response. Last error: {last_err}")
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
