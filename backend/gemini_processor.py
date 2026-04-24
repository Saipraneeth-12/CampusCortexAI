import google.generativeai as genai
import json
import time

# ===============================
# Gemini Config
# ===============================
genai.configure(api_key="AIzaSyBlayLxTA2w2S_Hs1tBigVefos3_2ocxBU")

model = genai.GenerativeModel("gemini-2.5-flash")

# ===============================
# Gemini Runtime Status
# ===============================
GEMINI_AVAILABLE = True
NEXT_RETRY_TIME = 0


# ===============================
# Main Analyzer
# ===============================
def analyze_data(raw_data):
    global GEMINI_AVAILABLE, NEXT_RETRY_TIME

    # --------------------------------
    # Cooldown check
    # --------------------------------
    if not GEMINI_AVAILABLE:
        remaining = NEXT_RETRY_TIME - time.time()

        if remaining > 0:
            raise Exception(
                f"Gemini cooling down. Retry in {int(remaining)} sec"
            )
        else:
            # retry allowed now
            GEMINI_AVAILABLE = True

    prompt = f"""
You are an expert Market Intelligence AI.

Analyze the following live EdTech news headlines.

Return ONLY valid JSON in this exact format:

{{
  "competitor_updates": [
    "short insight",
    "short insight"
  ],
  "user_pain_points": [
    "short insight",
    "short insight"
  ],
  "emerging_trends": [
    "short insight",
    "short insight"
  ]
}}

Rules:
- Keep points concise
- Use business language
- No markdown
- No explanation outside JSON

DATA:
{raw_data}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        # Remove accidental markdown fences
        text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)

        # success
        GEMINI_AVAILABLE = True

        return result

    except Exception as e:
        msg = str(e).lower()

        # --------------------------------
        # If quota exceeded / rate limited
        # --------------------------------
        if "429" in msg or "quota" in msg or "rate" in msg:
            GEMINI_AVAILABLE = False
            NEXT_RETRY_TIME = time.time() + 60

            print("Gemini quota exceeded. Cooling down for 60 sec.")

        raise e


# ===============================
# Optional Helper Functions
# ===============================
def gemini_status():
    global GEMINI_AVAILABLE, NEXT_RETRY_TIME

    if GEMINI_AVAILABLE:
        return {
            "status": "ACTIVE",
            "retry_in": 0
        }

    remaining = max(0, int(NEXT_RETRY_TIME - time.time()))

    return {
        "status": "COOLDOWN",
        "retry_in": remaining
    }