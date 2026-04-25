import feedparser

def fetch_rss_news():
    urls = [
        "https://news.google.com/rss/search?q=edtech",
        "https://news.google.com/rss/search?q=teacher+tools",
        "https://news.google.com/rss/search?q=school+management+software"
    ]

    news = []

    for url in urls:
        feed = feedparser.parse(url)

        for entry in feed.entries[:5]:
            news.append({
                "source": "Google News",
                "title": entry.title,
                "link": entry.link
            })

    return news