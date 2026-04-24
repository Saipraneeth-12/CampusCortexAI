import sys
import os

print("PIPELINE READY")

# add scrape folder
sys.path.append(os.path.abspath("../scrape"))

from main_scraper import get_all_data
from gemini_processor import analyze_data


def run_pipeline():
    try:
        data = get_all_data()

        if not data:
            return {
                "competitor_updates": [],
                "user_pain_points": [],
                "emerging_trends": []
            }

        result = analyze_data(data)
        return result

    except Exception as e:
        print("PIPELINE ERROR:", e)

        return {
            "competitor_updates": [],
            "user_pain_points": [],
            "emerging_trends": []
        }