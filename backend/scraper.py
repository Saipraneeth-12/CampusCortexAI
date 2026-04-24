import feedparser
import requests

# ── API Keys ──────────────────────────────────────────────────────────────────
GUARDIAN_KEY = "03dd05e6-f19d-4e4f-b2c4-fe5aad59a2c0"
NEWSDATA_KEY  = "pub_4c3e2fad522f4c6bac43b1cdb1ec12ee"

# ── Role-specific query terms ─────────────────────────────────────────────────
ROLE_QUERIES = {
    "Institute Owner": [
        "school management software", "edtech institute", "learning management system",
        "student enrollment technology", "education administration",
    ],
    "Backend Developer": [
        "backend development 2026", "api development trends", "microservices architecture",
        "cloud backend infrastructure", "python fastapi",
    ],
    "Data Engineer": [
        "data engineering 2026", "data pipeline tools", "real time analytics",
        "apache spark databricks", "AI data infrastructure",
    ],
    "Founder / Entrepreneur": [
        "edtech startup funding", "SaaS startup growth", "education technology investment",
        "AI startup launch", "edtech acquisition", "online learning platform growth",
        "venture capital education", "startup product market fit",
    ],
    "Product Builder": [
        "SaaS product launch", "AI product features", "no code low code platform",
        "product management tools 2026", "user experience edtech",
    ],
}

COMMON_QUERIES = [
    "edtech", "ai education", "education technology", "AI tools productivity",
    "automation software 2026",
]


# ── Source fetchers ───────────────────────────────────────────────────────────

def _fetch_rss(queries, per_query=5):
    items = []
    seen = set()
    for q in queries:
        url = f"https://news.google.com/rss/search?q={q.replace(' ', '+')}"
        try:
            feed = feedparser.parse(url)
            for e in feed.entries[:per_query]:
                title = e.get("title", "").strip()
                if title and title not in seen:
                    seen.add(title)
                    # published date
                    pub = ""
                    if e.get("published"):
                        try:
                            import email.utils
                            t = email.utils.parsedate_to_datetime(e.published)
                            pub = t.strftime("%b %d, %Y")
                        except Exception:
                            pub = e.get("published", "")[:16]
                    items.append({
                        "title": title,
                        "link": e.get("link", ""),
                        "source": "Google News",
                        "description": "",
                        "published_date": pub,
                    })
        except Exception as ex:
            print(f"RSS error ({q}): {ex}")
    return items


def _fetch_guardian(queries, per_query=4):
    items = []
    seen = set()
    for q in queries[:6]:
        try:
            r = requests.get(
                "https://content.guardianapis.com/search",
                params={
                    "q": q,
                    "api-key": GUARDIAN_KEY,
                    "page-size": per_query,
                    "show-fields": "headline,trailText",
                    "order-by": "newest",
                },
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for art in r.json().get("response", {}).get("results", []):
                title = art.get("webTitle", "").strip()
                if title and title not in seen:
                    seen.add(title)
                    # format date from ISO string e.g. "2026-04-22T23:17:05Z"
                    raw_date = art.get("webPublicationDate", "")
                    pub = ""
                    if raw_date:
                        try:
                            from datetime import datetime
                            pub = datetime.strptime(raw_date[:10], "%Y-%m-%d").strftime("%b %d, %Y")
                        except Exception:
                            pub = raw_date[:10]
                    items.append({
                        "title": title,
                        "link": art.get("webUrl", ""),
                        "source": "The Guardian",
                        "description": art.get("fields", {}).get("trailText", ""),
                        "published_date": pub,
                    })
        except Exception as ex:
            print(f"Guardian error ({q}): {ex}")
    return items


def _fetch_newsdata(queries, per_query=5):
    items = []
    seen = set()
    for q in queries[:5]:
        try:
            r = requests.get(
                "https://newsdata.io/api/1/news",
                params={
                    "apikey": NEWSDATA_KEY,
                    "q": q,
                    "language": "en",
                    "size": per_query,
                },
                timeout=8,
            )
            if r.status_code != 200:
                continue
            for art in r.json().get("results", []):
                title = art.get("title", "").strip()
                if title and title not in seen:
                    seen.add(title)
                    desc = art.get("description", "") or ""
                    # format date from "2026-04-23 23:30:33"
                    raw_date = art.get("pubDate", "")
                    pub = ""
                    if raw_date:
                        try:
                            from datetime import datetime
                            pub = datetime.strptime(raw_date[:10], "%Y-%m-%d").strftime("%b %d, %Y")
                        except Exception:
                            pub = raw_date[:10]
                    items.append({
                        "title": title,
                        "link": art.get("link", ""),
                        "source": art.get("source_name", "NewsData"),
                        "description": desc[:500],
                        "published_date": pub,
                    })
        except Exception as ex:
            print(f"NewsData error ({q}): {ex}")
    return items


# ── Main entry point ──────────────────────────────────────────────────────────

def scrape_news(role: str = "Institute Owner"):
    role_queries   = ROLE_QUERIES.get(role, [])
    all_queries    = COMMON_QUERIES + role_queries

    rss_items      = _fetch_rss(all_queries, per_query=4)
    guardian_items = _fetch_guardian(role_queries + COMMON_QUERIES[:2], per_query=3)
    newsdata_items = _fetch_newsdata(role_queries + COMMON_QUERIES[:2], per_query=4)

    combined = rss_items + guardian_items + newsdata_items

    # Global dedup by title
    seen, final = set(), []
    for item in combined:
        key = item["title"].lower()[:80]
        if key not in seen:
            seen.add(key)
            final.append(item)

    print(f"[scraper] {role}: RSS={len(rss_items)} Guardian={len(guardian_items)} NewsData={len(newsdata_items)} Total={len(final)}")
    return final
