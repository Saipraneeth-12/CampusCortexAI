from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from concurrent.futures import ThreadPoolExecutor
import asyncio
import io

from scraper import scrape_news
from cleaner import clean_articles
from ranker import rank_news
from gemini_processor import analyze
from pdf_report import build_pdf

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
    """Synchronous pipeline — scrape, clean, rank, analyze"""
    news = scrape_news(role)
    if not news:
        raise ValueError("No articles scraped. Check network or RSS feeds.")
    news = clean_articles(news)
    news = rank_news(news)
    top_news = news[:6]
    return analyze(top_news, role)


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


@app.delete("/cache")
def clear_cache():
    _cache.clear()
    return {"status": "cache cleared", "message": "All cached reports removed"}


@app.get("/health")
def health():
    return {"status": "ok", "cached_roles": list(_cache.keys())}
