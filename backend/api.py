from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from concurrent.futures import ThreadPoolExecutor
from pydantic import BaseModel
import asyncio
import io
import os
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv

# Load .env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from scraper import scrape_news
from cleaner import clean_articles
from ranker import rank_news
from groq_processor import analyze, generate_trends_forecast, _try_all_models
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

# ── In-memory cache ───────────────────────────────────────────────────────────
_cache = {}
executor = ThreadPoolExecutor(max_workers=4)

# ── Email / scheduler config ──────────────────────────────────────────────────
SMTP_HOST    = "smtp.gmail.com"
SMTP_PORT    = 587
SENDER_EMAIL = os.getenv("GMAIL_SENDER", "saipraneethkukunoor45@gmail.com")
SENDER_PASS  = os.getenv("GMAIL_APP_PASSWORD", "dskm vbru skct xarx")

_scheduled_role      = "Institute Owner"
_scheduled_recipient = "rithwik140705@gmail.com"
_scheduled_hour      = 11
_scheduled_minute    = 6

_scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
_scheduler_started = False


# ── Pipeline helpers ──────────────────────────────────────────────────────────

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


def _run_pipeline(role: str):
    """Run full scrape + clean + rank + analyze pipeline."""
    news = scrape_news(role)
    if not news:
        raise ValueError("No articles scraped. Check network or RSS feeds.")
    news = clean_articles(news)
    news = rank_news(news, role)

    fresh_news    = [n for n in news if n.get("_tier") == "fresh"][:6]
    trending_news = [n for n in news if n.get("_tier") in ("trending", "unknown")][:6]

    fresh_result    = analyze(fresh_news, role)    if fresh_news    else _empty_block(role, "fresh")
    trending_result = analyze(trending_news, role) if trending_news else _empty_block(role, "trending")

    return {
        "fresh":                fresh_result,
        "trending":             trending_result,
        "daily_brief":          fresh_result.get("daily_brief", ""),
        "top_trends":           fresh_result.get("top_trends", []),
        "growth_opportunities": fresh_result.get("growth_opportunities", []),
        "threats":              fresh_result.get("threats", []),
        "missed_opportunities": fresh_result.get("missed_opportunities", []),
        "strategic_moves":      fresh_result.get("strategic_moves", []),
        "tools_to_watch":       fresh_result.get("tools_to_watch", []),
        "hiring_signals":       fresh_result.get("hiring_signals", []),
    }


# ── Startup / Shutdown ────────────────────────────────────────────────────────

def _send_scheduled_email():
    try:
        role = _scheduled_role
        if role not in _cache:
            _cache[role] = _run_pipeline(role)
        _send_email_for_role(role, _scheduled_recipient)
        print(f"[scheduler] Daily email sent for {role} to {_scheduled_recipient}")
    except Exception as e:
        print(f"[scheduler] Email failed: {e}")


def _refresh_cached_roles():
    roles = list(_cache.keys())
    if not roles:
        print("[cache] No cached roles to refresh — skipping")
        return
    print(f"[cache] Refreshing {len(roles)} cached roles...")
    for role in roles:
        try:
            _cache[role] = _run_pipeline(role)
            print(f"[cache] Refreshed: {role}")
        except Exception as e:
            print(f"[cache] Failed to refresh {role}: {e}")


@app.on_event("startup")
def startup_event():
    global _scheduler_started
    if not _scheduler_started:
        _scheduler.add_job(
            _send_scheduled_email,
            CronTrigger(hour=_scheduled_hour, minute=_scheduled_minute, timezone="Asia/Kolkata"),
            id="daily_email",
            replace_existing=True,
        )
        _scheduler.add_job(
            _refresh_cached_roles,
            "interval",
            hours=2,
            id="cache_refresh",
            replace_existing=True,
        )
        _scheduler.start()
        _scheduler_started = True
        print(f"[api] Email scheduler started — daily at {_scheduled_hour:02d}:{_scheduled_minute:02d} IST")
        print("[api] Startup complete — 2h cache refresh + daily email scheduler running")
        print("[api] Scraping will only happen on first user request or every 2 hours")


@app.on_event("shutdown")
def shutdown_event():
    if _scheduler_started:
        _scheduler.shutdown(wait=False)


# ── Report ────────────────────────────────────────────────────────────────────

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


# ── Trends ────────────────────────────────────────────────────────────────────

@app.get("/trends")
async def trends(role: str = "Institute Owner"):
    cache_key = f"trends_{role}"
    if cache_key in _cache:
        return _cache[cache_key]
    try:
        news = []
        if role in _cache:
            fresh_articles    = _cache[role].get("fresh", {}).get("top_articles", [])
            trending_articles = _cache[role].get("trending", {}).get("top_articles", [])
            news = fresh_articles + trending_articles
        if not news:
            loop = asyncio.get_event_loop()
            raw  = await loop.run_in_executor(executor, scrape_news, role)
            news = rank_news(clean_articles(raw), role)
        loop   = asyncio.get_event_loop()
        result = await loop.run_in_executor(executor, generate_trends_forecast, news, role)
        _cache[cache_key] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Action Plan ───────────────────────────────────────────────────────────────

def _generate_action_plan(role: str, report_data: dict) -> dict:
    fresh          = report_data.get("fresh", {})
    top_articles   = fresh.get("top_articles", [])[:5]
    top_trends     = report_data.get("top_trends", [])[:5]
    opportunities  = report_data.get("growth_opportunities", [])[:4]
    threats        = report_data.get("threats", [])[:4]
    strategic_moves= report_data.get("strategic_moves", [])[:4]
    daily_brief    = report_data.get("daily_brief", "")

    articles_text = "\n".join(
        f"- {a.get('title','')}: {a.get('why_it_matters','')}"
        for a in top_articles
    )

    prompt = f"""You are a strategic advisor generating a 7-day action plan for a {role}.

CONTEXT FROM TODAY'S INTELLIGENCE REPORT:
Daily Brief: {daily_brief}
Top Trends: {', '.join(top_trends)}
Growth Opportunities: {', '.join(opportunities)}
Threats: {', '.join(threats)}
Strategic Moves: {', '.join(strategic_moves)}
Key Articles:
{articles_text}

Generate exactly 7 actionable tasks — one per day (Day 1 through Day 7).
Each task must be specific, measurable, and directly tied to the intelligence above.

Return ONLY valid JSON. No markdown:
{{
  "tasks": [
    {{
      "day": "Day 1",
      "title": "Short action title (5-8 words)",
      "description": "Specific 2-3 sentence description of what to do and why",
      "urgency": "High",
      "eta": "2 hours",
      "tags": ["tag1", "tag2"],
      "color": "oklch(0.7 0.24 255)"
    }}
  ]
}}

Color options (vary them): "oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)", "oklch(0.85 0.18 200)", "oklch(0.78 0.2 155)", "oklch(0.82 0.17 75)", "oklch(0.65 0.28 300)"
Urgency must be exactly "High", "Medium", or "Low"."""

    try:
        text = _try_all_models(prompt)
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        result = json.loads(text)
        if "tasks" in result and isinstance(result["tasks"], list) and len(result["tasks"]) > 0:
            return result
    except Exception as e:
        print(f"[api] Action plan generation failed: {e}")

    # Fallback
    colors = ["oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)", "oklch(0.85 0.18 200)",
              "oklch(0.78 0.2 155)", "oklch(0.82 0.17 75)", "oklch(0.65 0.28 300)",
              "oklch(0.7 0.24 255)"]
    urgencies = ["High", "High", "Medium", "Medium", "Medium", "Low", "High"]
    tasks = []
    for i, move in enumerate((strategic_moves + ["Review market intelligence", "Plan next sprint"])[:7]):
        day = i + 1
        tasks.append({
            "day": f"Day {day}",
            "title": move[:60] if move else f"Strategic action {day}",
            "description": f"Based on today's intelligence: {move}. Review relevant data and take concrete steps forward.",
            "urgency": urgencies[i],
            "eta": "2 hours",
            "tags": [role.split()[0], "Strategy"],
            "color": colors[i],
        })
    return {"tasks": tasks}


@app.get("/action-plan")
async def action_plan(role: str = "Institute Owner"):
    cache_key = f"action_plan_{role}"
    if cache_key in _cache:
        return _cache[cache_key]
    if role not in _cache:
        try:
            loop = asyncio.get_event_loop()
            _cache[role] = await loop.run_in_executor(executor, _run_pipeline, role)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    try:
        loop = asyncio.get_event_loop()
        plan = await loop.run_in_executor(executor, _generate_action_plan, role, _cache[role])
        _cache[cache_key] = plan
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Download PDF ──────────────────────────────────────────────────────────────

@app.get("/download-report")
async def download_report(role: str = "Institute Owner"):
    if role not in _cache:
        try:
            loop = asyncio.get_event_loop()
            _cache[role] = await loop.run_in_executor(executor, _run_pipeline, role)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    data = _cache[role]
    try:
        pdf_bytes = build_pdf(data, role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")
    safe_role = role.replace("/", "-").replace(" ", "_")
    filename  = f"MorningPulse_{safe_role}_{datetime.now().strftime('%Y%m%d')}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ── Competitor Alerts ─────────────────────────────────────────────────────────

@app.get("/competitor-alerts")
async def competitor_alerts(role: str = "Institute Owner"):
    cache_key = f"competitors_{role}"
    if cache_key in _cache:
        return _cache[cache_key]
    try:
        loop   = asyncio.get_event_loop()
        alerts = await loop.run_in_executor(executor, get_competitor_alerts, role)
        result = {"alerts": alerts, "fresh": alerts, "trending": [], "total": len(alerts)}
        _cache[cache_key] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Competitor Summary ────────────────────────────────────────────────────────

def _generate_competitor_summary(role: str, alerts: list) -> dict:
    if not alerts:
        return {
            "summary": f"No competitor activity detected for {role} in the current monitoring window.",
            "key_insights": ["Monitor competitor channels for updates", "Set up alerts for key competitor domains"],
            "recommended_actions": ["Review competitor pricing quarterly", "Track product launch announcements"],
        }
    alert_text = "\n".join(
        f"- {a.get('competitor','')}: {a.get('move','')} (Urgency: {a.get('urgency',5)}/10)"
        for a in alerts[:8]
    )
    prompt = f"""You are a competitive intelligence analyst for a {role}.
Recent competitor moves:
{alert_text}
Return ONLY valid JSON:
{{
  "summary": "2-3 sentence executive summary of the competitive landscape",
  "key_insights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "recommended_actions": ["action 1", "action 2", "action 3"]
}}"""
    try:
        text = _try_all_models(prompt)
        if "```json" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        return json.loads(text)
    except Exception as e:
        print(f"[api] Competitor summary failed: {e}")
        return {
            "summary": f"Competitive activity detected across {len(alerts)} signals for {role}. Key players are making moves in AI integration and market expansion.",
            "key_insights": [
                "Multiple competitors launching AI-powered features",
                "Funding rounds indicate increased market competition",
                "Product launches accelerating in your core market",
                "Talent acquisition signals strategic expansion",
            ],
            "recommended_actions": [
                "Accelerate your AI feature roadmap",
                "Review pricing against newly funded competitors",
                "Monitor competitor job postings for strategic signals",
            ],
        }


@app.get("/competitor-summary")
async def competitor_summary(role: str = "Institute Owner"):
    cache_key = f"comp_summary_{role}"
    if cache_key in _cache:
        return _cache[cache_key]
    alerts_key = f"competitors_{role}"
    if alerts_key not in _cache:
        try:
            loop   = asyncio.get_event_loop()
            alerts = await loop.run_in_executor(executor, get_competitor_alerts, role)
            _cache[alerts_key] = {"alerts": alerts, "fresh": alerts, "trending": [], "total": len(alerts)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    alerts = _cache[alerts_key].get("alerts", [])
    try:
        loop    = asyncio.get_event_loop()
        summary = await loop.run_in_executor(executor, _generate_competitor_summary, role, alerts)
        _cache[cache_key] = summary
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role:        str
    message:     str
    history:     List[dict] = []
    competitors: dict = {}


@app.post("/chat")
async def chat_endpoint(body: ChatMessage):
    report_data = _cache.get(body.role)
    if not report_data:
        raise HTTPException(status_code=400, detail="No report loaded for this role. Fetch the report first.")
    try:
        loop  = asyncio.get_event_loop()
        reply = await loop.run_in_executor(
            executor,
            lambda: chatbot_chat(
                message=body.message,
                role=body.role,
                report=report_data,
                competitors=body.competitors,
                history=body.history,
            )
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Email endpoints ───────────────────────────────────────────────────────────

def _send_email_for_role(role: str, recipient: str):
    data  = _cache.get(role, {})
    fresh = data.get("fresh", data)

    articles = fresh.get("top_articles", [])[:5]
    articles_html = ""
    for i, a in enumerate(articles, 1):
        urgency = a.get("urgency_score", 5)
        u_color = "#ef4444" if urgency >= 8 else ("#f59e0b" if urgency >= 5 else "#22c55e")
        articles_html += f"""
        <div style="background:#1e2130;border-radius:8px;padding:14px;margin-bottom:10px;border-left:3px solid {u_color};">
          <div style="font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">#{i} {a.get('title','')}</div>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">{a.get('short_summary','')}</div>
          <div style="font-size:12px;color:#cbd5e1;"><b>Why it matters:</b> {a.get('why_it_matters','')}</div>
          <div style="font-size:12px;color:#22c55e;margin-top:4px;"><b>Action:</b> {a.get('recommended_action','')}</div>
        </div>"""

    def list_section(title, items, color):
        if not items:
            return ""
        bullets = "".join(f'<li style="color:#cbd5e1;font-size:12px;margin-bottom:4px;">{x}</li>' for x in items[:4])
        return f'<div style="margin-bottom:12px;"><div style="font-size:11px;font-weight:700;color:{color};text-transform:uppercase;margin-bottom:6px;">{title}</div><ul style="margin:0;padding-left:16px;">{bullets}</ul></div>'

    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:640px;margin:0 auto;padding:24px 16px;">
  <div style="text-align:center;padding:24px 0;">
    <div style="font-size:24px;font-weight:800;color:#fff;">Morning Pulse AI</div>
    <div style="font-size:12px;color:#64748b;margin-top:4px;">{datetime.now().strftime('%B %d, %Y · %I:%M %p')} IST</div>
    <div style="font-size:14px;color:#6366f1;margin-top:8px;font-weight:600;">{role}</div>
  </div>
  <div style="background:#1a1d27;border-radius:10px;padding:16px;margin-bottom:16px;">
    <div style="font-size:13px;color:#94a3b8;line-height:1.6;">{fresh.get('daily_brief','')}</div>
  </div>
  <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:10px;">Priority Intelligence</div>
  {articles_html}
  {list_section("Top Trends", data.get("top_trends",[]), "#6366f1")}
  {list_section("Growth Opportunities", data.get("growth_opportunities",[]), "#22c55e")}
  {list_section("Threats", data.get("threats",[]), "#ef4444")}
  {list_section("Strategic Moves", data.get("strategic_moves",[]), "#0ea5e9")}
  <div style="text-align:center;padding:20px 0;color:#334155;font-size:11px;">
    Morning Pulse AI · Powered by Groq + Real-Time News
  </div>
</div>
</body></html>"""

    msg = MIMEMultipart("mixed")
    msg["From"]    = SENDER_EMAIL
    msg["To"]      = recipient
    msg["Subject"] = f"Morning Pulse AI — {role} · {datetime.now().strftime('%b %d, %Y')}"
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASS)
        server.sendmail(SENDER_EMAIL, recipient, msg.as_string())

    print(f"[mailer] Email sent to {recipient} for {role}")


class EmailRequest(BaseModel):
    role:      str
    recipient: str


@app.post("/send-email")
async def send_email(body: EmailRequest):
    if body.role not in _cache:
        try:
            loop = asyncio.get_event_loop()
            _cache[body.role] = await loop.run_in_executor(executor, _run_pipeline, body.role)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, _send_email_for_role, body.role, body.recipient)
        return {"status": "sent", "recipient": body.recipient}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email failed: {e}")


class ScheduleRoleRequest(BaseModel):
    role:      str
    recipient: str


@app.post("/set-scheduled-role")
async def set_scheduled_role(body: ScheduleRoleRequest):
    global _scheduled_role, _scheduled_recipient
    _scheduled_role      = body.role
    _scheduled_recipient = body.recipient
    return {"status": "updated", "role": body.role, "email": body.recipient}


class EmailScheduleRequest(BaseModel):
    send_time: str
    recipient: str


@app.post("/set-email-schedule")
async def set_email_schedule(body: EmailScheduleRequest):
    global _scheduled_hour, _scheduled_minute, _scheduled_recipient
    try:
        parts = body.send_time.split(":")
        _scheduled_hour      = int(parts[0])
        _scheduled_minute    = int(parts[1])
        _scheduled_recipient = body.recipient
        _scheduler.reschedule_job(
            "daily_email",
            trigger=CronTrigger(hour=_scheduled_hour, minute=_scheduled_minute, timezone="Asia/Kolkata"),
        )
        return {
            "status":    "updated",
            "send_time": body.send_time,
            "recipient": body.recipient,
            "message":   f"Daily email rescheduled to {body.send_time} IST",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Scheduler error: {e}")


# ── WhatsApp (stub) ───────────────────────────────────────────────────────────

class WhatsAppRequest(BaseModel):
    role: str
    to:   str


@app.post("/send-whatsapp")
async def send_whatsapp(body: WhatsAppRequest):
    raise HTTPException(status_code=501, detail="WhatsApp not configured. Add Twilio credentials to .env.")


# ── Video Generation ──────────────────────────────────────────────────────────

@app.get("/generate-video")
async def generate_video(role: str = "Institute Owner"):
    try:
        from video_generator import generate_video as gen_vid
        if role not in _cache:
            loop = asyncio.get_event_loop()
            _cache[role] = await loop.run_in_executor(executor, _run_pipeline, role)
        loop         = asyncio.get_event_loop()
        video_result = await loop.run_in_executor(executor, gen_vid, _cache[role], role)
        return video_result
    except ImportError:
        raise HTTPException(status_code=501, detail="Video generation module not available.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Cache / Health ────────────────────────────────────────────────────────────

@app.delete("/cache")
def clear_cache():
    _cache.clear()
    return {"status": "cache cleared", "message": "All cached reports removed"}


@app.get("/health")
def health():
    return {"status": "ok", "cached_roles": list(_cache.keys())}
