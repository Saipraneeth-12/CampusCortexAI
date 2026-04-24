def score(title):

    t = title.lower()

    s = 0

    keywords = {
        "ai": 5,
        "funding": 5,
        "teacher": 4,
        "backend": 4,
        "data": 4,
        "launch": 4,
        "growth": 4,
        "startup": 5,
        "security": 5
    }

    for k, v in keywords.items():
        if k in t:
            s += v

    return s


def rank_news(arr):

    for x in arr:
        x["score"] = score(x["title"])

    arr.sort(
        key=lambda z: z["score"],
        reverse=True
    )

    return arr