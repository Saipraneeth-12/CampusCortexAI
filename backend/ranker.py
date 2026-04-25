"""
ranker.py — Morning Pulse AI
Multi-signal ranking. Scores each article across 6 dimensions,
then sorts by composite score so highest-impact content surfaces first.

Scoring dimensions:
  1. Recency       — fresh articles score higher; decays with age
  2. Impact        — high-signal keywords (funding, launch, AI, acquisition…)
  3. Source auth   — trusted sources score higher
  4. Content depth — articles with descriptions score higher than title-only
  5. Tier bonus    — fresh tier gets a boost over trending/unknown
  6. Role signal   — role-specific keywords amplify score
"""

from datetime import datetime, timezone

# ── Impact keyword weights ────────────────────────────────────────────────────
IMPACT_KEYWORDS = {
    # Funding / business events — highest signal
    "funding":      10,
    "raises":       10,
    "acquisition":  10,
    "acquired":     10,
    "merger":        9,
    "ipo":           9,
    "series a":      9,
    "series b":      9,
    "series c":      9,
    "investment":    8,
    "backed":        8,
    "valuation":     8,

    # Product / launch signals
    "launch":        8,
    "launches":      8,
    "launched":      8,
    "release":       7,
    "announces":     7,
    "announced":     7,
    "new feature":   7,
    "partnership":   7,
    "integrates":    6,
    "expands":       6,

    # AI / tech signals
    "ai":            7,
    "artificial intelligence": 7,
    "machine learning": 6,
    "llm":           7,
    "generative ai": 8,
    "automation":    6,
    "chatbot":       5,

    # Growth / market signals
    "startup":       7,
    "growth":        6,
    "revenue":       6,
    "profit":        6,
    "market share":  7,
    "disruption":    7,
    "breakthrough":  7,

    # Risk / threat signals
    "shutdown":      8,
    "bankrupt":      9,
    "layoffs":       8,
    "breach":        8,
    "hack":          8,
    "regulation":    6,
    "ban":           7,
    "lawsuit":       6,

    # EdTech specific
    "edtech":        6,
    "lms":           5,
    "e-learning":    5,
    "online learning": 5,
    "school":        4,
    "teacher":       4,
    "student":       4,
    "curriculum":    4,
    "upskill":       5,
}

# ── Role-specific amplifiers ──────────────────────────────────────────────────
ROLE_AMPLIFIERS = {
    "CEO / Founder": [
        "startup", "funding", "venture", "saas", "mrr", "arr", "churn",
        "product market fit", "pivot", "acquisition", "exit", "investor",
        "seed", "series", "unicorn", "bootstrapped", "ceo", "founder",
        "scale", "revenue", "growth", "market share",
    ],
    # legacy alias
    "Founder / Entrepreneur": [
        "startup", "funding", "venture", "saas", "mrr", "arr", "churn",
        "product market fit", "pivot", "acquisition", "exit", "investor",
        "seed", "series", "unicorn", "bootstrapped",
    ],
}

# ── Source authority scores ───────────────────────────────────────────────────
SOURCE_AUTHORITY = {
    "The Guardian":    10,
    "TechCrunch":       9,
    "Forbes":           9,
    "Reuters":          9,
    "Bloomberg":        9,
    "Wired":            8,
    "VentureBeat":      8,
    "EdSurge":          8,
    "EdTech Magazine":  8,
    "MIT News":         8,
    "Google News":      5,
    "NewsData":         5,
}


def _recency_score(age_hrs: float) -> float:
    """
    Decay curve:
      0–6 hrs   → 20 pts  (breaking news)
      6–24 hrs  → 15 pts  (today's news)
      24–48 hrs → 10 pts  (yesterday)
      48–72 hrs →  5 pts  (2 days ago)
      >72 hrs   →  2 pts  (trending/evergreen)
    """
    if age_hrs <= 6:    return 20.0
    if age_hrs <= 24:   return 15.0
    if age_hrs <= 48:   return 10.0
    if age_hrs <= 72:   return  5.0
    return 2.0


def _impact_score(text: str) -> float:
    t = text.lower()
    score = 0.0
    for kw, weight in IMPACT_KEYWORDS.items():
        if kw in t:
            score += weight
    return min(score, 50.0)   # cap so one article can't dominate


def _role_score(text: str, role: str) -> float:
    t = text.lower()
    amplifiers = ROLE_AMPLIFIERS.get(role, [])
    score = 0.0
    for kw in amplifiers:
        if kw in t:
            score += 4.0
    return min(score, 20.0)


def _source_score(source: str) -> float:
    for name, weight in SOURCE_AUTHORITY.items():
        if name.lower() in source.lower():
            return float(weight)
    return 4.0   # unknown source


def _depth_score(item: dict) -> float:
    """Articles with real descriptions are more useful than title-only."""
    desc = item.get("description", "") or ""
    if len(desc) > 300: return 8.0
    if len(desc) > 100: return 5.0
    if len(desc) > 0:   return 2.0
    return 0.0


def _tier_bonus(tier: str) -> float:
    return {"fresh": 10.0, "trending": 3.0, "unknown": 0.0}.get(tier, 0.0)


def rank_news(articles: list, role: str = "Institute Owner") -> list:
    """
    Score and sort articles. Returns sorted list with `score` and
    `score_breakdown` attached to each item.
    """
    for item in articles:
        full_text  = f"{item.get('title', '')} {item.get('description', '')}"
        age_hrs    = item.get("_age_hrs", 999.0)
        tier       = item.get("_tier", "unknown")

        r  = _recency_score(age_hrs)
        i  = _impact_score(full_text)
        ro = _role_score(full_text, role)
        s  = _source_score(item.get("source", ""))
        d  = _depth_score(item)
        t  = _tier_bonus(tier)

        item["score"] = round(r + i + ro + s + d + t, 1)
        item["score_breakdown"] = {
            "recency": r, "impact": i, "role": ro,
            "source": s, "depth": d, "tier": t,
        }

    articles.sort(key=lambda x: x["score"], reverse=True)
    return articles
