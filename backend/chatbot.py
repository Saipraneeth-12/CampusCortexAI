"""
chatbot.py — Morning Pulse AI
Context-aware chatbot that answers questions about the live report.
Uses Groq AI for intelligent responses.
"""
import os
from groq_processor import _try_all_models


def _build_context(role: str, report: dict, competitors: dict) -> str:
    """Compress report data into a concise context string for the prompt."""
    lines = [f"ROLE: {role}"]

    # Fresh block
    fresh = report.get("fresh", {})
    if fresh.get("daily_brief"):
        lines.append(f"\nTODAY'S BRIEF: {fresh['daily_brief']}")

    arts = fresh.get("top_articles", []) + report.get("trending", {}).get("top_articles", [])
    if arts:
        lines.append("\nTOP ARTICLES:")
        for a in arts[:8]:
            lines.append(f"- {a.get('title','')} | {a.get('what_happened','')} | Action: {a.get('recommended_action','')}")

    trends = fresh.get("top_trends", [])
    if trends:
        lines.append(f"\nTOP TRENDS: {' | '.join(trends[:5])}")

    opps = fresh.get("growth_opportunities", [])
    if opps:
        lines.append(f"\nOPPORTUNITIES: {' | '.join(opps[:4])}")

    threats = fresh.get("threats", [])
    if threats:
        lines.append(f"\nTHREATS: {' | '.join(threats[:4])}")

    moves = fresh.get("strategic_moves", [])
    if moves:
        lines.append(f"\nSTRATEGIC MOVES: {' | '.join(moves[:4])}")

    # Competitor alerts
    comp_alerts = []
    if competitors:
        comp_alerts = competitors.get("fresh", []) + competitors.get("trending", [])
    if comp_alerts:
        lines.append("\nCOMPETITOR MOVES:")
        for c in comp_alerts[:6]:
            lines.append(f"- {c.get('competitor','')}: {c.get('move','')} | Counter: {', '.join(c.get('counter_actions',[])[:2])}")

    return "\n".join(lines)


def chat(
    message: str,
    role: str,
    report: dict,
    competitors: dict,
    history: list,
) -> str:
    """
    Send a message and get a response grounded in the live report data.
    history: list of {role: "user"|"assistant", content: str}
    """
    context = _build_context(role, report, competitors)

    system_prompt = f"""You are an elite AI Market Intelligence Advisor embedded inside Morning Pulse AI.

You have access to today's live market intelligence report for a {role}.
Answer every question using ONLY the data provided below — be specific, actionable, and concise.
Never say "I don't have access to" — use the data you have.
Keep responses under 200 words unless the user asks for a detailed plan.
Use bullet points for lists. Be direct. Think like a strategic advisor, not a chatbot.

LIVE REPORT DATA:
{context}
"""

    # Build conversation turns for context
    history_text = ""
    for turn in history[-6:]:
        prefix = "User" if turn["role"] == "user" else "Advisor"
        history_text += f"{prefix}: {turn['content']}\n"

    full_prompt = f"""{system_prompt}

CONVERSATION HISTORY:
{history_text}
User: {message}
Advisor:"""

    try:
        return _try_all_models(full_prompt)
    except Exception:
        return "All AI models are currently at capacity. Please try again in a moment."
