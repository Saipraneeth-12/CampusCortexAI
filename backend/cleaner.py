import re

def clean_articles(arr):

    seen = set()
    final = []

    for x in arr:

        key = re.sub(
            r'[^a-z0-9]',
            '',
            x["title"].lower()
        )

        if key not in seen:
            seen.add(key)
            final.append(x)

    return final