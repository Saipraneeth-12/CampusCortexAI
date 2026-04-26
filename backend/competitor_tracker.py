"""
competitor_tracker.py — Morning Pulse AI
Scrapes competitor-specific news and generates counter-action recommendations via Groq.
"""
import feedparser
import requests
import json
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

GUARDIAN_KEY = os.getenv("GUARDIAN_API_KEY", "")
NEWSDATA_KEY = os.getenv("NEWSDATA_API_KEY", "")

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


def _scrape_competitor(name: str, queries: list) -> list:
    """Scrape news for a specific competitor from multiple sources."""
    articles = []
    seen = set()

    for q in queries[:2]:
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
        if NEWSDATA_KEY:
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
    """Use Groq to analyze what the competitor did and recommend counter-actions."""
    from groq_processor import _try_all_models

    if not articles:
        return None

    trimmed = [
        {"title": a.get("title", ""), "source": a.get("source", ""),
         "description": a.get("description", ""), "date": a.get("published_date", "")}
        for a in articles[:6]
    ]

    prompt = f"""You are a competitive intelligence analyst for a {role}.

Competitor: {competitor_name}

Analyze these recent news articles about {competitor_name} and determine:
1. What specific new thing did {competitor_name} do?
2. How does this threaten a {role}?
3. What exact counter-action should the {role} take in the next 7 days?

Only return data if there is a REAL, SPECIFIC, RECENT action by {competitor_name}.
If articles are old or irrelevant, return null for "move".

Return ONLY valid JSON, no markdown:

{{
  "competitor": "{competitor_name}",
  "move": "one sentence: exactly what they did",
  "move_type": "one of: Product Launch / Funding / Partnership / Feature Update / Expansion / Acquisition / Marketing",
  "threat_to_role": "one sentence: why this matters to {role}",
  "urgency": 7,
  "counter_actions": ["action 1", "action 2", "action 3"],
  "opportunity": "one sentence: how you can turn this into your advantage",
  "source_title": "title of the most relevant article",
  "source_link": "link of the most relevant article",
  "source_date": "date of the most relevant article"
}}

If no real recent move found, return: {{"competitor": "{competitor_name}", "move": null}}

ARTICLES:
{json.dumps(trimmed, indent=2)}"""

    try:
        text = _try_all_models(prompt)
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        result = json.loads(text)
        return result if result.get("move") else None
    except Exception as e:
        print(f"[competitor] Analysis failed for {competitor_name}: {e}")
        return None


def get_competitor_alerts(role: str) -> dict:
    """
    Returns {fresh: [...], trending: [...]} — competitor alerts split by recency.
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

    fresh    = sorted([a for a in all_alerts if a["_age_hrs"] <= 48],  key=lambda x: x.get("urgency", 0), reverse=True)
    trending = sorted([a for a in all_alerts if a["_age_hrs"] >  48],  key=lambda x: x.get("urgency", 0), reverse=True)

    # Ensure fresh always has content
    if not fresh and trending:
        fresh = trending[:3]
        trending = trending[3:]

    return {
        "fresh":    fresh[:5],
        "trending": trending[:5],
        "total":    len(all_alerts),
    }
