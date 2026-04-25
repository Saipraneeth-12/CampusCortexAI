"""
cleaner.py — Morning Pulse AI
Deduplicates articles by normalised title AND link.
Preserves all fields including _dt, _age_hrs, _tier for ranking.
"""
import re


def _normalise(text: str) -> str:
    return re.sub(r'[^a-z0-9]', '', text.lower())[:80]


def clean_articles(articles: list) -> list:
    seen_titles = set()
    seen_links  = set()
    final       = []

    for item in articles:
        title_key = _normalise(item.get("title", ""))
        link_key  = item.get("link", "").strip().rstrip("/")

        if title_key in seen_titles:
            continue
        if link_key and link_key in seen_links:
            continue

        seen_titles.add(title_key)
        if link_key:
            seen_links.add(link_key)

        final.append(item)

    return final
