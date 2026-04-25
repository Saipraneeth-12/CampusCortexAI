"""
scraper.py — Morning Pulse AI
Scrapes last 24-48h high-value articles from reliable sources.
Categories: Competitor Updates | User Pain Points | Emerging Tech Trends
Sources: Reddit RSS, Hacker News, Google News RSS, Guardian API, NewsData.io
"""
import feedparser
import requests
import email.utils
from datetime import datetime, timezone, timedelta

# ── API Keys ──────────────────────────────────────────────────────────────────
GUARDIAN_KEY = "03dd05e6-f19d-4e4f-b2c4-fe5aad59a2c0"
NEWSDATA_KEY = "pub_4c3e2fad522f4c6bac43b1cdb1ec12ee"

FRESH_WINDOW_HRS  = 48
TREND_WINDOW_DAYS = 14

# ── Targeted query sets by category ──────────────────────────────────────────

# COMPETITOR UPDATES — product launches, funding, acquisitions, pricing
COMPETITOR_QUERIES = [
    "edtech product launch 2026",
    "LMS new feature release",
    "edtech funding round 2026",
    "edtech acquisition 2026",
    "school management software launch",
    "classroom platform update",
    "edtech startup funding",
    "online learning platform expansion",
    "edtech pricing change",
    "education technology partnership",
    "Byju's Unacademy Coursera upGrad news",
    "Google Classroom Canvas Blackboard update",
    "Khan Academy Duolingo Chegg launch",
]

# USER PAIN POINTS — teacher/school frustrations
PAIN_POINT_QUERIES = [
    "teachers grading workload problem",
    "classroom management software issues",
    "school attendance tracking problems",
    "parent communication school app",
    "student engagement online learning",
    "school data privacy breach",
    "LMS integration problems teachers",
    "teacher burnout technology",
    "school admin inefficiency software",
    "edtech usability complaints",
    "reddit teachers frustration tools",
    "school software too complicated",
]

# EMERGING TECH TRENDS — AI, automation, analytics in education
TECH_TREND_QUERIES = [
    "AI tutor education 2026",
    "AI grading automation school",
    "AI lesson planning teachers",
    "personalized learning platform AI",
    "school analytics dashboard",
    "education automation workflow",
    "generative AI classroom",
    "adaptive testing edtech",
    "AI proctoring online exam",
    "voice assistant education",
    "edtech AI innovation 2026",
    "machine learning student outcomes",
]

# REDDIT — direct community signals
REDDIT_FEEDS = [
    "https://www.reddit.com/r/Teachers/.rss",
    "https://www.reddit.com/r/edtech/.rss",
    "https://www.reddit.com/r/education/.rss",
    "https://www.reddit.com/r/Teachers/search.rss?q=grading+workload&sort=new",
    "https://www.reddit.com/r/Teachers/search.rss?q=classroom+management&sort=new",
    "https://www.reddit.com/r/edtech/search.rss?q=AI+tools&sort=new",
]

# HACKER NEWS — tech community signals
HN_QUERIES = [
    "edtech", "education technology", "AI tutor", "learning management",
    "school software", "teacher tools",
]

# HIGH-VALUE RSS SOURCES
PRIORITY_RSS = [
    # EdSurge
    "https://edsurge.com/feed",
    # EdTech Magazine
    "https://edtechmagazine.com/k12/rss.xml",
    # TechCrunch Education
    "https://techcrunch.com/tag/education/feed/",
    # VentureBeat AI
    "https://venturebeat.com/category/ai/feed/",
    # THE Journal (ed tech)
    "https://thejournal.com/rss-feeds/all-articles.aspx",
]

# ── Date helpers ──────────────────────────────────────────────────────────────

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
    return dt.strftime("%b %d, %Y") if dt else ""


def _age_hrs(dt: datetime | None) -> float:
    if dt is None:
        return 999.0
    return max((datetime.now(timezone.utc) - dt).total_seconds() / 3600, 0)


def _make_item(title, link, source, description, dt, category="general") -> dict:
    return {
        "title":          title.strip(),
        "link":           link,
        "source":         source,
        "description":    (description or "")[:500],
        "published_date": _fmt(dt),
        "_dt":            dt,
        "_age_hrs":       _age_hrs(dt),
        "_category":      category,
    }


# ── Source fetchers ───────────────────────────────────────────────────────────

def _fetch_google_news(queries: list, category: str, per_query: int = 5) -> list:
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
                items.append(_make_item(title, e.get("link", ""), "Google News", "", dt, category))
        except Exception as ex:
            print(f"[rss] {q}: {ex}")
    return items


def _fetch_reddit(per_feed: int = 8) -> list:
    items, seen = [], set()
    for url in REDDIT_FEEDS:
        try:
            feed = feedparser.parse(url)
            for e in feed.entries[:per_feed]:
                title = e.get("title", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt   = _parse_rss_date(e)
                desc = e.get("summary", "")[:300]
                items.append(_make_item(title, e.get("link", ""), "Reddit", desc, dt, "pain_point"))
        except Exception as ex:
            print(f"[reddit] {url}: {ex}")
    return items


def _fetch_hacker_news(per_query: int = 4) -> list:
    items, seen = [], set()
    for q in HN_QUERIES[:4]:
        try:
            r = requests.get(
                "http://hn.algolia.com/api/v1/search_by_date",
                params={"query": q, "tags": "story", "numericFilters": "created_at_i>0"},
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for hit in r.json().get("hits", [])[:per_query]:
                title = (hit.get("title") or "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                ts = hit.get("created_at_i", 0)
                dt = datetime.fromtimestamp(ts, tz=timezone.utc) if ts else None
                url = hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID','')}"
                items.append(_make_item(title, url, "Hacker News", "", dt, "tech_trend"))
        except Exception as ex:
            print(f"[hn] {q}: {ex}")
    return items


def _fetch_priority_rss(per_feed: int = 6) -> list:
    items, seen = [], set()
    for url in PRIORITY_RSS:
        try:
            feed = feedparser.parse(url)
            source = feed.feed.get("title", url.split("/")[2])
            for e in feed.entries[:per_feed]:
                title = e.get("title", "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt   = _parse_rss_date(e)
                desc = e.get("summary", "")[:300]
                items.append(_make_item(title, e.get("link", ""), source, desc, dt, "tech_trend"))
        except Exception as ex:
            print(f"[priority_rss] {url}: {ex}")
    return items


def _fetch_guardian(queries: list, category: str, per_query: int = 3) -> list:
    items, seen = [], set()
    from_date = (datetime.now(timezone.utc) - timedelta(days=TREND_WINDOW_DAYS)).strftime("%Y-%m-%d")
    for q in queries[:6]:
        try:
            r = requests.get(
                "https://content.guardianapis.com/search",
                params={
                    "q": q, "api-key": GUARDIAN_KEY,
                    "page-size": per_query, "show-fields": "headline,trailText",
                    "order-by": "newest", "from-date": from_date,
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
                desc = art.get("fields", {}).get("trailText", "")
                items.append(_make_item(title, art.get("webUrl", ""), "The Guardian", desc, dt, category))
        except Exception as ex:
            print(f"[guardian] {q}: {ex}")
    return items


def _fetch_newsdata(queries: list, category: str, per_query: int = 4) -> list:
    items, seen = [], set()
    for q in queries[:5]:
        try:
            r = requests.get(
                "https://newsdata.io/api/1/news",
                params={"apikey": NEWSDATA_KEY, "q": q, "language": "en", "size": per_query},
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for art in r.json().get("results", []):
                title = (art.get("title") or "").strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                dt   = _parse_iso_date(art.get("pubDate", ""))
                desc = (art.get("description") or "")[:500]
                items.append(_make_item(title, art.get("link", ""), art.get("source_name", "NewsData"), desc, dt, category))
        except Exception as ex:
            print(f"[newsdata] {q}: {ex}")
    return items


# ── Low-value noise filter ────────────────────────────────────────────────────
NOISE_PATTERNS = [
    "horoscope", "celebrity", "sports score", "weather forecast",
    "stock price", "crypto price", "recipe", "fashion", "entertainment",
    "box office", "nfl", "nba", "fifa", "cricket score",
]

def _is_noise(title: str) -> bool:
    t = title.lower()
    return any(p in t for p in NOISE_PATTERNS)


# ── Main entry point ──────────────────────────────────────────────────────────

def scrape_news(role: str = "CEO / Founder") -> list:
    print(f"[scraper] Starting scrape for {role}...")

    all_items = []

    # 1. Competitor updates
    all_items += _fetch_google_news(COMPETITOR_QUERIES, "competitor", per_query=4)
    all_items += _fetch_guardian(COMPETITOR_QUERIES[:4], "competitor", per_query=3)
    all_items += _fetch_newsdata(COMPETITOR_QUERIES[:4], "competitor", per_query=4)

    # 2. User pain points
    all_items += _fetch_google_news(PAIN_POINT_QUERIES, "pain_point", per_query=3)
    all_items += _fetch_reddit(per_feed=6)

    # 3. Emerging tech trends
    all_items += _fetch_google_news(TECH_TREND_QUERIES, "tech_trend", per_query=4)
    all_items += _fetch_hacker_news(per_query=4)
    all_items += _fetch_priority_rss(per_feed=5)
    all_items += _fetch_guardian(TECH_TREND_QUERIES[:4], "tech_trend", per_query=3)
    all_items += _fetch_newsdata(TECH_TREND_QUERIES[:4], "tech_trend", per_query=4)

    # Global dedup by normalised title
    seen, final = set(), []
    for item in all_items:
        if _is_noise(item["title"]):
            continue
        key = item["title"].lower()[:80]
        if key not in seen:
            seen.add(key)
            final.append(item)

    # Tag tiers
    for a in final:
        age = a["_age_hrs"]
        a["_tier"] = "fresh" if age <= FRESH_WINDOW_HRS else ("trending" if age <= TREND_WINDOW_DAYS * 24 else "unknown")

    fresh    = [a for a in final if a["_tier"] == "fresh"]
    trending = [a for a in final if a["_tier"] == "trending"]

    print(f"[scraper] Total={len(final)} | Fresh={len(fresh)} | Trending={len(trending)}")
    print(f"[scraper] Categories: competitor={sum(1 for a in final if a['_category']=='competitor')} "
          f"pain_point={sum(1 for a in final if a['_category']=='pain_point')} "
          f"tech_trend={sum(1 for a in final if a['_category']=='tech_trend')}")

    # Backfill if fresh is thin
    if len(fresh) < 6:
        result = fresh + trending[:20]
        print(f"[scraper] Fresh thin — backfilled with trending. Total for ranking: {len(result)}")
    else:
        result = fresh + trending[:15]

    return result
