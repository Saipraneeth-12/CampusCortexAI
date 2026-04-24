"""
competitor_tracker.py — Morning Pulse AI
Scrapes competitor-specific news, detects what they did,
and generates counter-action recommendations via Gemini.
"""
import feedparser
import requests
import json
import google.generativeai as genai
import os

API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyD7Az9AKrwyAzWcUvv6QYHF2IMZTlxksQ4")
genai.configure(api_key=API_KEY)

# ── Competitor registry ───────────────────────────────────────────────────────
COMPETITORS = {
    "Byju's": {
        "queries": ["Byju's", "Byjus edtech", "Byju Raveendran"],
        "category": "EdTech Platform",
        "threat_level": "High",
    },
    "Unacademy": {
        "queries": ["Unacademy", "Unacademy launch", "Unacademy funding"],
        "category": "EdTech Platform",
        "threat_level": "High",
    },
    "Coursera": {
        "queries": ["Coursera launch", "Coursera new course", "Coursera AI"],
        "category": "Online Learning",
        "threat_level": "Medium",
    },
    "upGrad": {
        "queries": ["upGrad", "upGrad launch", "upGrad funding"],
        "category": "EdTech Platform",
        "threat_level": "High",
    },
    "Google Classroom": {
        "queries": ["Google Classroom update", "Google for Education", "Google Workspace Education"],
        "category": "School Tech",
        "threat_level": "High",
    },
    "Khan Academy": {
        "queries": ["Khan Academy AI", "Khan Academy Khanmigo", "Khan Academy update"],
        "category": "Learning Platform",
        "threat_level": "Medium",
    },
    "Duolingo": {
        "queries": ["Duolingo launch", "Duolingo AI", "Duolingo update"],
        "category": "Learning App",
        "threat_level": "Medium",
    },
    "Chegg": {
        "queries": ["Chegg AI", "Chegg launch", "Chegg update"],
        "category": "Study Tools",
        "threat_level": "Low",
    },
    "Vedantu": {
        "queries": ["Vedantu", "Vedantu launch", "Vedantu funding"],
        "category": "EdTech Platform",
        "threat_level": "High",
    },
    "PhysicsWallah": {
        "queries": ["PhysicsWallah", "PW app", "Physics Wallah launch"],
        "category": "EdTech Platform",
        "threat_level": "High",
    },
}

GUARDIAN_KEY = "03dd05e6-f19d-4e4f-b2c4-fe5aad59a2c0"
NEWSDATA_KEY = "pub_4c3e2fad522f4c6bac43b1cdb1ec12ee"

MODEL_FALLBACK = [
    "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite",
    "gemini-2.5-flash-lite", "gemini-flash-latest", "gemma-3-12b-it",
]
_exhausted: set = set()


def _scrape_competitor(name: str, queries: list) -> list:
    """Scrape news for a specific competitor from multiple sources."""
    articles = []
    seen = set()

    for q in queries[:3]:
        # Google News RSS
        try:
            url = f"https://news.google.com/rss/search?q={q.replace(' ', '+')}"
            feed = feedparser.parse(url)
            for e in feed.entries[:4]:
                title = e.get("title", "").strip()
                if title and title not in seen:
                    seen.add(title)
                    import email.utils
                    pub = ""
                    try:
                        t = email.utils.parsedate_to_datetime(e.published)
                        pub = t.strftime("%b %d, %Y")
                    except Exception:
                        pub = e.get("published", "")[:16]
                    articles.append({
                        "title": title,
                        "link": e.get("link", ""),
                        "source": "Google News",
                        "published_date": pub,
                        "competitor": name,
                    })
        except Exception:
            pass

        # NewsData.io
        try:
            r = requests.get(
                "https://newsdata.io/api/1/news",
                params={"apikey": NEWSDATA_KEY, "q": q, "language": "en", "size": 3},
                timeout=8,
            )
            if r.status_code == 200:
                for art in r.json().get("results", []):
                    title = art.get("title", "").strip()
                    if title and title not in seen:
                        seen.add(title)
                        from datetime import datetime
                        raw = art.get("pubDate", "")
                        pub = ""
                        try:
                            pub = datetime.strptime(raw[:10], "%Y-%m-%d").strftime("%b %d, %Y")
                        except Exception:
                            pub = raw[:10]
                        articles.append({
                            "title": title,
                            "link": art.get("link", ""),
                            "source": art.get("source_name", "NewsData"),
                            "published_date": pub,
                            "description": (art.get("description") or "")[:300],
                            "competitor": name,
                        })
        except Exception:
            pass

    return articles


def _analyze_competitor_moves(competitor_name: str, articles: list, role: str) -> dict:
    """Use Gemini to analyze what the competitor did and recommend counter-actions."""
    if not articles:
        return None

    trimmed = [
        {"title": a.get("title", ""), "source": a.get("source", ""),
         "description": a.get("description", ""), "date": a.get("published_date", "")}
        for a in articles[:6]
    ]

    prompt = f"""
You are a competitive intelligence analyst for a {role}.

Competitor being analyzed: {competitor_name}

Analyze these recent news articles about {competitor_name} and determine:
1. What specific new thing did {competitor_name} do? (product launch, funding, partnership, feature, expansion)
2. How does this threaten a {role}?
3. What exact counter-action should the {role} take in the next 7 days?

Only return data if there is a REAL, SPECIFIC, RECENT action by {competitor_name}.
If articles are old news or irrelevant, return null for "move".

Return ONLY valid JSON, no markdown:

{{
  "competitor": "{competitor_name}",
  "move": "one sentence: exactly what they did",
  "move_type": "one of: Product Launch / Funding / Partnership / Feature Update / Expansion / Acquisition / Marketing",
  "threat_to_role": "one sentence: why this matters to {role}",
  "urgency": 8,
  "counter_actions": [
    "specific action 1",
    "specific action 2",
    "specific action 3"
  ],
  "opportunity": "one sentence: how you can turn this into your advantage",
  "source_title": "title of the most relevant article",
  "source_link": "link of the most relevant article",
  "source_date": "date of the most relevant article"
}}

If no real recent move found, return: {{"competitor": "{competitor_name}", "move": null}}

ARTICLES:
{trimmed}
"""

    for model_name in MODEL_FALLBACK:
        if model_name in _exhausted:
            continue
        try:
            m = genai.GenerativeModel(model_name)
            response = m.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(temperature=0.3, max_output_tokens=1024),
            )
            text = response.text.strip()
            if "```" in text:
                text = text.split("```json")[-1].split("```")[0].strip()
            result = json.loads(text)
            if result.get("move"):
                return result
            return None
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                _exhausted.add(model_name)
                continue
            return None

    return None


def get_competitor_alerts(role: str) -> dict:
    """
    Returns {fresh: [...], trending: [...]} — competitor alerts split by recency.
    Fresh = competitor moves from last 48hrs.
    Trending = competitor moves from last 2–14 days still worth knowing.
    """
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    all_alerts = []

    for name, config in COMPETITORS.items():
        try:
            articles = _scrape_competitor(name, config["queries"])
            if not articles:
                continue
            result = _analyze_competitor_moves(name, articles, role)
            if result and result.get("move"):
                result["threat_level"] = config["threat_level"]
                result["category"]     = config["category"]
                # determine tier from source_date
                raw_date = result.get("source_date", "")
                age_hrs  = 999.0
                try:
                    dt = datetime.strptime(raw_date, "%b %d, %Y").replace(tzinfo=timezone.utc)
                    age_hrs = (now - dt).total_seconds() / 3600
                except Exception:
                    pass
                result["_age_hrs"] = age_hrs
                all_alerts.append(result)
        except Exception as e:
            print(f"[competitor] Error tracking {name}: {e}")

    # Split into fresh (≤48hrs) and trending (>48hrs)
    fresh    = sorted([a for a in all_alerts if a["_age_hrs"] <= 48],  key=lambda x: x.get("urgency", 0), reverse=True)
    trending = sorted([a for a in all_alerts if a["_age_hrs"] >  48],  key=lambda x: x.get("urgency", 0), reverse=True)

    return {
        "fresh":    fresh,
        "trending": trending,
        "total":    len(all_alerts),
    }
