from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from concurrent.futures import ThreadPoolExecutor
from pydantic import BaseModel
import asyncio
import io
from typing import List

from scraper import scrape_news
from cleaner import clean_articles
from ranker import rank_news
from gemini_processor import analyze
from pdf_report import build_pdf
from competitor_tracker import get_competitor_alerts
from chatbot import chat as chatbot_chat

app = FastAPI(title="Morning Pulse AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache: {role: result}
_cache = {}

executor = ThreadPoolExecutor(max_workers=4)


def _run_pipeline(role: str):
    """Pipeline that returns fresh + trending blocks separately."""
    news = scrape_news(role)
    if not news:
        raise ValueError("No articles scraped. Check network or RSS feeds.")
    news = clean_articles(news)
    news = rank_news(news, role)

    # Split by tier
    fresh_news    = [n for n in news if n.get("_tier") == "fresh"][:6]
    trending_news = [n for n in news if n.get("_tier") in ("trending", "unknown")][:6]

    # Analyze both blocks
    fresh_result    = analyze(fresh_news, role)    if fresh_news    else _empty_block(role, "fresh")
    trending_result = analyze(trending_news, role) if trending_news else _empty_block(role, "trending")

    return {
        "fresh":    fresh_result,
        "trending": trending_result,
        # keep top-level fields from fresh for backward compat
        "daily_brief":          fresh_result.get("daily_brief", ""),
        "top_trends":           fresh_result.get("top_trends", []),
        "growth_opportunities": fresh_result.get("growth_opportunities", []),
        "threats":              fresh_result.get("threats", []),
        "missed_opportunities": fresh_result.get("missed_opportunities", []),
        "strategic_moves":      fresh_result.get("strategic_moves", []),
        "tools_to_watch":       fresh_result.get("tools_to_watch", []),
        "hiring_signals":       fresh_result.get("hiring_signals", []),
    }


def _empty_block(role, tier):
    label = "last 48 hours" if tier == "fresh" else "trending past news"
    return {
        "daily_brief":          f"No {label} articles found for {role}.",
        "top_articles":         [],
        "top_trends":           [],
        "growth_opportunities": [],
        "threats":              [],
        "missed_opportunities": [],
        "strategic_moves":      [],
        "tools_to_watch":       [],
        "hiring_signals":       [],
    }


@app.get("/report")
async def report(role: str = "Institute Owner"):
    if role in _cache:
        return _cache[role]

    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(executor, _run_pipeline, role)
        _cache[role] = result
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download-report")
async def download_report(role: str = "Institute Owner"):
    # Use cached data if available, otherwise run pipeline
    if role not in _cache:
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(executor, _run_pipeline, role)
            _cache[role] = result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    data = _cache[role]

    try:
        pdf_bytes = build_pdf(data, role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    safe_role = role.replace("/", "-").replace(" ", "_")
    filename  = f"MorningPulse_{safe_role}_{__import__('datetime').datetime.now().strftime('%Y%m%d')}.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.get("/competitor-alerts")
async def competitor_alerts(role: str = "Institute Owner"):
    cache_key = f"competitors_{role}"
    if cache_key in _cache:
        return _cache[cache_key]
    try:
        loop = asyncio.get_event_loop()
        alerts = await loop.run_in_executor(executor, get_competitor_alerts, role)
        result = {"alerts": alerts, "total": len(alerts)}
        _cache[cache_key] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ChatMessage(BaseModel):
    role:        str
    message:     str
    history:     List[dict] = []
    competitors: dict = {}


@app.post("/chat")
async def chat_endpoint(body: ChatMessage):
    report = _cache.get(body.role)
    if not report:
        raise HTTPException(status_code=400, detail="No report loaded for this role. Fetch the report first.")
    try:
        loop = asyncio.get_event_loop()
        reply = await loop.run_in_executor(
            executor,
            lambda: chatbot_chat(
                message=body.message,
                role=body.role,
                report=report,
                competitors=body.competitors,
                history=body.history,
            )
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/cache")
def clear_cache():
    _cache.clear()
    return {"status": "cache cleared", "message": "All cached reports removed"}


@app.get("/health")
def health():
    return {"status": "ok", "cached_roles": list(_cache.keys())}
