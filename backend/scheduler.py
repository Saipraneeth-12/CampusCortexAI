"""
scheduler.py — Morning Pulse AI
Runs the full pipeline for all 5 roles and sends a detailed email report.
Set RUN_HOUR / RUN_MINUTE to control when it fires.
"""
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime

from scraper import scrape_news
from cleaner import clean_articles
from ranker import rank_news
from groq_processor import analyze
from pdf_report import build_pdf
from mailer import send_report_email

# ── Schedule config — change these to set the time ───────────────────────────
RUN_HOUR   = 19   # 24-hour format  (8 = 8 AM, 19 = 7 PM)
RUN_MINUTE = 8
# ─────────────────────────────────────────────────────────────────────────────

ROLES = ["CEO / Founder"]

scheduler = BlockingScheduler(timezone="Asia/Kolkata")


def run_pipeline_for_role(role: str):
    """Full pipeline for one role — returns (data, pdf_bytes)"""
    print(f"  [{role}] Scraping...")
    news = scrape_news(role)
    news = clean_articles(news)
    news = rank_news(news)
    top  = news[:6]

    print(f"  [{role}] Analyzing with Gemini ({len(top)} articles)...")
    data = analyze(top, role)

    print(f"  [{role}] Generating PDF...")
    pdf  = build_pdf(data, role)

    return data, pdf


@scheduler.scheduled_job(CronTrigger(hour=RUN_HOUR, minute=RUN_MINUTE, timezone="Asia/Kolkata"))
def morning_pulse():
    start = datetime.now()
    print(f"\n{'='*60}")
    print(f"Morning Pulse AI — Pipeline started at {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    all_reports = {}
    all_pdfs    = {}

    for role in ROLES:
        try:
            data, pdf = run_pipeline_for_role(role)
            all_reports[role] = data
            all_pdfs[role]    = pdf
            print(f"  [{role}] ✓ Done")
        except Exception as e:
            print(f"  [{role}] ✗ Error: {e}")
            all_reports[role] = {
                "daily_brief": f"Pipeline error for {role}: {e}",
                "top_articles": [], "top_trends": [], "growth_opportunities": [],
                "threats": [], "missed_opportunities": [], "strategic_moves": [],
                "tools_to_watch": [], "hiring_signals": []
            }

    print(f"\nSending email...")
    try:
        send_report_email(all_reports, all_pdfs)
        print("Email sent successfully.")
    except Exception as e:
        print(f"Email failed: {e}")

    elapsed = (datetime.now() - start).seconds
    print(f"\nPipeline complete in {elapsed}s")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    print(f"Scheduler ready. Will fire at {RUN_HOUR:02d}:{RUN_MINUTE:02d} IST every day.")
    print(f"Roles: {', '.join(ROLES)}")
    print(f"Email will be sent to: saipraneethkukunoor45@gmail.com")
    print("Press Ctrl+C to stop.\n")
    scheduler.start()
