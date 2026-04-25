import sys
import os

# Add scrape folder to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../scrape")))

from main_scraper import get_all_data
from groq_processor import analyze


def run_pipeline(role="Institute Owner"):
    try:
        data = get_all_data()

        if not data:
            return {
                "daily_brief": "No data available.",
                "top_articles": [],
                "top_trends": [],
                "growth_opportunities": [],
                "threats": [],
                "missed_opportunities": [],
                "strategic_moves": [],
                "tools_to_watch": [],
                "hiring_signals": []
            }

        result = analyze(data[:6], role)
        return result

    except Exception as e:
        print("PIPELINE ERROR:", e)
        return {"error": str(e)}


if __name__ == "__main__":
    import json
    result = run_pipeline()
    print(json.dumps(result, indent=2))
