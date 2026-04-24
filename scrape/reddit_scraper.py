import feedparser

def fetch_reddit_posts():
    urls = [
        "https://www.reddit.com/r/Teachers/.rss",
        "https://www.reddit.com/r/edtech/.rss",
        "https://www.reddit.com/r/education/.rss"
    ]

    posts = []

    for url in urls:
        feed = feedparser.parse(url)

        for entry in feed.entries[:5]:
            posts.append({
                "source": "Reddit RSS",
                "title": entry.title,
                "link": entry.link
            })

    return posts