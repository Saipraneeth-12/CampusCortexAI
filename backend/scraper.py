"""
scraper.py — Morning Pulse AI
Fetches last 48hrs of news. If fresh content is thin (<6 articles),
backfills with trending/evergreen content still circulating.
Each article carries a parsed datetime for downstream ranking.
"""
import feedparser
import requests
import email.utils
from datetime import datetime, timezone, timedelta

# ── API Keys ──────────────────────────────────────────────────────────────────
GUARDIAN_KEY = "03dd05e6-f19d-4e4f-b2c4-fe5aad59a2c0"
NEWSDATA_KEY = "pub_4c3e2fad522f4c6bac43b1cdb1ec12ee"

FRESH_WINDOW_HRS  = 48   # primary window
TREND_WINDOW_DAYS = 14   # backfill window for evergreen/trending

# ── Role-specific queries ─────────────────────────────────────────────────────
ROLE_QUERIES = {
    "Institute Owner": [
        "school management software", "edtech institute",
        "learning management system", "student enrollment technology",
        "education administration software",
    ],
    "Backend Developer": [
        "backend development 2026", "api development trends",
        "microservices architecture", "cloud backend infrastructure",
        "python fastapi developer",
    ],
    "Data Engineer": [
        "data engineering 2026", "data pipeline tools",
        "real time analytics platform", "apache spark databricks",
        "AI data infrastructure",
    ],
    "Founder / Entrepreneur": [
        "edtech startup funding", "SaaS startup growth",
        "education technology investment", "AI startup launch",
        "edtech acquisition", "online learning platform growth",
        "venture capital education", "startup product market fit",
    ],
    "Product Builder": [
        "SaaS product launch", "AI product features",
        "no code low code platform", "product management tools 2026",
        "user experience edtech",
    ],
}

COMMON_QUERIES = [
    "edtech", "ai education", "education technology",
    "AI tools productivity", "automation software 2026",
]

# ── Source authority weights (used by ranker) ─────────────────────────────────
SOURCE_AUTHORITY = {
    "The Guardian":   10,
    "TechCrunch":      9,
    "Forbes":          9,
    "Reuters":         9,
    "Bloomberg":       9,
    "Wired":           8,
    "VentureBeat":     8,
    "EdSurge":         8,
    "EdTech Magazine": 8,
    "Google News":     5,
    "NewsData":        5,
}


# ── Date parsing helpers ──────────────────────────────────────────────────────

def _parse_rss_date(entry) -> datetime | None:
    for field in ("published", "updated"):
        raw = entry.get(field, "")
        if not raw:
            continue
        try:
            return email.utils.parsedate_to_datetime(raw).astimezone(timezone.utc)
        except Exception:
            pass
    return None


def _parse_iso_date(raw: str) -> datetime | None:
    if not raw:
        return None
    try:
        return datetime.strptime(raw[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except Exception:
        return None


def _fmt(dt: datetime | None) -> str:
    if dt is None:
        return ""
    return dt.strftime("%b %d, %Y")


def _age_hrs(dt: datetime | None) -> float:
    """Hours since article was published. None → treated as 999 (old)."""
    if dt is None:
        return 999.0
    now = datetime.now(timezone.utc)
    return max((now - dt).total_seconds() / 3600, 0)


# ── Source fetchers ───────────────────────────────────────────────────────────

def _fetch_rss(queries: list, per_query: int = 6) -> list:
    items, seen = [], set()
    for q in queries:
        url = f"https://news.google.com/rss/search?q={q.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
        try:
            feed = feedparser.parse(url)
            for e in feed.entries[:per_query]:
                title = e.get("title", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt = _parse_rss_date(e)
                items.append({
                    "title":          title,
                    "link":           e.get("link", ""),
                    "source":         "Google News",
                    "description":    "",
                    "published_date": _fmt(dt),
                    "_dt":            dt,
                    "_age_hrs":       _age_hrs(dt),
                })
        except Exception as ex:
            print(f"[rss] error ({q}): {ex}")
    return items


def _fetch_guardian(queries: list, per_query: int = 4) -> list:
    items, seen = [], set()
    now = datetime.now(timezone.utc)
    from_date = (now - timedelta(days=TREND_WINDOW_DAYS)).strftime("%Y-%m-%d")

    for q in queries[:6]:
        try:
            r = requests.get(
                "https://content.guardianapis.com/search",
                params={
                    "q":            q,
                    "api-key":      GUARDIAN_KEY,
                    "page-size":    per_query,
                    "show-fields":  "headline,trailText",
                    "order-by":     "newest",
                    "from-date":    from_date,
                },
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for art in r.json().get("response", {}).get("results", []):
                title = art.get("webTitle", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt = _parse_iso_date(art.get("webPublicationDate", ""))
                items.append({
                    "title":          title,
                    "link":           art.get("webUrl", ""),
                    "source":         "The Guardian",
                    "description":    art.get("fields", {}).get("trailText", ""),
                    "published_date": _fmt(dt),
                    "_dt":            dt,
                    "_age_hrs":       _age_hrs(dt),
                })
        except Exception as ex:
            print(f"[guardian] error ({q}): {ex}")
    return items


def _fetch_newsdata(queries: list, per_query: int = 5) -> list:
    items, seen = [], set()
    for q in queries[:5]:
        try:
            r = requests.get(
                "https://newsdata.io/api/1/news",
                params={
                    "apikey":   NEWSDATA_KEY,
                    "q":        q,
                    "language": "en",
                    "size":     per_query,
                },
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for art in r.json().get("results", []):
                title = art.get("title", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt  = _parse_iso_date(art.get("pubDate", ""))
                desc = (art.get("description") or "")[:500]
                items.append({
                    "title":          title,
                    "link":           art.get("link", ""),
                    "source":         art.get("source_name", "NewsData"),
                    "description":    desc,
                    "published_date": _fmt(dt),
                    "_dt":            dt,
                    "_age_hrs":       _age_hrs(dt),
                })
        except Exception as ex:
            print(f"[newsdata] error ({q}): {ex}")
    return items


# ── Main entry point ──────────────────────────────────────────────────────────

def scrape_news(role: str = "Institute Owner") -> list:
    role_queries = ROLE_QUERIES.get(role, [])
    all_queries  = COMMON_QUERIES + role_queries

    rss_items      = _fetch_rss(all_queries, per_query=5)
    guardian_items = _fetch_guardian(role_queries + COMMON_QUERIES[:2], per_query=4)
    newsdata_items = _fetch_newsdata(role_queries + COMMON_QUERIES[:2], per_query=5)

    combined = rss_items + guardian_items + newsdata_items

    # Global dedup by normalised title prefix
    seen, all_articles = set(), []
    for item in combined:
        key = item["title"].lower()[:80]
        if key not in seen:
            seen.add(key)
            all_articles.append(item)

    # Split into FRESH (≤48 hrs) and TRENDING (48 hrs – 14 days)
    fresh    = [a for a in all_articles if a["_age_hrs"] <= FRESH_WINDOW_HRS]
    trending = [a for a in all_articles if FRESH_WINDOW_HRS < a["_age_hrs"] <= TREND_WINDOW_DAYS * 24]
    unknown  = [a for a in all_articles if a["_age_hrs"] > TREND_WINDOW_DAYS * 24]

    # Tag each article so ranker knows its tier
    for a in fresh:    a["_tier"] = "fresh"
    for a in trending: a["_tier"] = "trending"
    for a in unknown:  a["_tier"] = "unknown"

    # If fresh pool is thin, backfill with trending
    MIN_FRESH = 6
    if len(fresh) < MIN_FRESH:
        backfill_needed = MIN_FRESH - len(fresh)
        backfill = trending[:backfill_needed * 3]   # grab extra, ranker will sort
        result = fresh + backfill
        print(f"[scraper] {role}: fresh={len(fresh)} (thin) → backfilled with {len(backfill)} trending. Total={len(result)}")
    else:
        result = fresh + trending[:20]   # always include some trending for context
        print(f"[scraper] {role}: fresh={len(fresh)} trending={len(trending)} Total={len(result)}")

    return result
