from reddit_scraper import fetch_reddit_posts
from rss_scraper import fetch_rss_news

def get_all_data():
    data = []

    reddit = fetch_reddit_posts()
    news = fetch_rss_news()

    print("Reddit:", len(reddit))
    print("News:", len(news))

    data.extend(reddit)
    data.extend(news)

    return data


if __name__ == "__main__":
    result = get_all_data()
    print("TOTAL:", len(result))

    for item in result[:5]:
        print(item)