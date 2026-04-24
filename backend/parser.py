from newspaper import Article

def parse_article(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text[:4000]
    except:
        return ""