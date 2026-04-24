"""
mailer.py — Morning Pulse AI
Sends a detailed HTML email with all 5 role reports + PDF attachments.
"""
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from datetime import datetime

# ── Config ────────────────────────────────────────────────────────────────────
SMTP_HOST     = "smtp.gmail.com"
SMTP_PORT     = 587
SENDER_EMAIL  = "saipraneethkukunoor45@gmail.com"
SENDER_PASS   = "dskm vbru skct xarx"   # Gmail App Password
RECIPIENT     = "saipraneethkukunoor45@gmail.com"

ROLE_COLORS = {
    "Institute Owner":       "#6366f1",
    "Backend Developer":     "#0ea5e9",
    "Data Engineer":         "#a855f7",
    "Founder / Entrepreneur":"#22c55e",
    "Product Builder":       "#f59e0b",
}

ROLE_ICONS = {
    "Institute Owner":       "🏫",
    "Backend Developer":     "⚙️",
    "Data Engineer":         "📊",
    "Founder / Entrepreneur":"🚀",
    "Product Builder":       "🛠️",
}


# ── HTML builders ─────────────────────────────────────────────────────────────

def _badge(text, color):
    return f'<span style="background:{color}22;color:{color};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;">{text}</span>'


def _article_block(a, idx):
    urgency = a.get("urgency_score", 5)
    u_color = "#ef4444" if urgency >= 8 else ("#f59e0b" if urgency >= 5 else "#22c55e")
    opp     = a.get("opportunity_level", "Medium")
    o_color = {"High": "#ef4444", "Medium": "#f59e0b", "Low": "#22c55e"}.get(opp, "#6366f1")
    link    = a.get("link", "")
    source  = a.get("source", "")
    date    = a.get("published_date", "")

    link_html = f'<a href="{link}" style="color:#0ea5e9;font-size:12px;">↗ Read Article</a>' if link else ""
    meta_html = ""
    if source or date:
        meta_html = f'<div style="margin:4px 0 8px;">'
        if source: meta_html += f'<span style="background:#6366f122;color:#6366f1;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;margin-right:6px;">{source}</span>'
        if date:   meta_html += f'<span style="color:#64748b;font-size:11px;">{date}</span>'
        meta_html += '</div>'

    return f"""
    <div style="background:#1e2130;border-radius:10px;padding:16px;margin-bottom:12px;border-left:3px solid {u_color};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
        <span style="color:#475569;font-size:11px;font-weight:700;">#{idx}</span>
        {_badge(f"Urgency {urgency}/10", u_color)}
        {_badge(opp, o_color)}
        {link_html}
      </div>
      <div style="font-size:14px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">{a.get('title','')}</div>
      {meta_html}
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">{a.get('short_summary','')}</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="width:110px;padding:4px 0;vertical-align:top;"><span style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;">What Happened</span></td>
            <td style="padding:4px 0;font-size:12px;color:#cbd5e1;">{a.get('what_happened','')}</td></tr>
        <tr><td style="padding:4px 0;vertical-align:top;"><span style="font-size:10px;font-weight:700;color:#0ea5e9;text-transform:uppercase;">Why It Matters</span></td>
            <td style="padding:4px 0;font-size:12px;color:#cbd5e1;">{a.get('why_it_matters','')}</td></tr>
        <tr><td style="padding:4px 0;vertical-align:top;"><span style="font-size:10px;font-weight:700;color:#22c55e;text-transform:uppercase;">Action</span></td>
            <td style="padding:4px 0;font-size:12px;color:#e2e8f0;font-weight:600;">{a.get('recommended_action','')}</td></tr>
      </table>
    </div>"""


def _list_section(title, items, color):
    if not items:
        return ""
    bullets = "".join(f'<li style="margin-bottom:6px;color:#cbd5e1;font-size:13px;">{x}</li>' for x in items)
    return f"""
    <div style="background:#1a1d27;border-radius:10px;padding:16px;margin-bottom:12px;border-top:3px solid {color};">
      <div style="font-size:11px;font-weight:700;color:{color};text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">{title}</div>
      <ul style="margin:0;padding-left:16px;">{bullets}</ul>
    </div>"""


def _role_section(role, data):
    color = ROLE_COLORS.get(role, "#6366f1")
    icon  = ROLE_ICONS.get(role, "📌")
    articles = data.get("top_articles", [])
    brief    = data.get("daily_brief", "")

    articles_html = "".join(_article_block(a, i+1) for i, a in enumerate(articles[:5]))

    insights = f"""
    {_list_section("Top Trends",           data.get("top_trends", []),           "#6366f1")}
    {_list_section("Growth Opportunities", data.get("growth_opportunities", []), "#22c55e")}
    {_list_section("Threats",              data.get("threats", []),              "#ef4444")}
    {_list_section("Strategic Moves",      data.get("strategic_moves", []),      "#0ea5e9")}
    {_list_section("Tools to Watch",       data.get("tools_to_watch", []),       "#a855f7")}
    {_list_section("Hiring Signals",       data.get("hiring_signals", []),       "#ec4899")}
    """

    return f"""
    <div style="margin-bottom:40px;">
      <!-- Role Header -->
      <div style="background:linear-gradient(135deg,{color}22,#1a1d27);border-radius:12px;padding:20px;margin-bottom:16px;border:1px solid {color}44;">
        <div style="font-size:22px;font-weight:800;color:#fff;">{icon} {role}</div>
        <div style="font-size:13px;color:#94a3b8;margin-top:8px;line-height:1.6;font-style:italic;">{brief}</div>
      </div>

      <!-- Articles -->
      <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;">Priority Intelligence</div>
      {articles_html}

      <!-- Insights -->
      <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin:16px 0 10px;">Insights & Signals</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        {insights}
      </div>

      <hr style="border:none;border-top:1px solid #2d3148;margin:24px 0;">
    </div>"""


def build_html(all_reports: dict, date_str: str) -> str:
    roles_html = "".join(_role_section(role, data) for role, data in all_reports.items())

    toc = "".join(
        f'<span style="background:{ROLE_COLORS.get(r,"#6366f1")}22;color:{ROLE_COLORS.get(r,"#6366f1")};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin:4px;">{ROLE_ICONS.get(r,"")} {r}</span>'
        for r in all_reports.keys()
    )

    return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:700px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Morning Pulse AI</div>
      <div style="font-size:13px;color:#64748b;margin-top:6px;">Daily Personalized Intelligence Report</div>
      <div style="font-size:12px;color:#475569;margin-top:4px;">{date_str}</div>
      <div style="margin-top:16px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;">{toc}</div>
    </div>

    <hr style="border:none;border-top:1px solid #2d3148;margin-bottom:32px;">

    <!-- All Role Reports -->
    {roles_html}

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#334155;font-size:12px;">
      Morning Pulse AI © {datetime.now().year} · Powered by Gemini + Real-Time News<br>
      Sources: Google News · The Guardian · NewsData.io
    </div>
  </div>
</body>
</html>"""


def send_report_email(all_reports: dict, pdf_attachments: dict = None):
    """
    all_reports: {role: data_dict}
    pdf_attachments: {role: pdf_bytes} — optional
    """
    date_str  = datetime.now().strftime("%B %d, %Y  ·  %I:%M %p")
    subject   = f"Morning Pulse AI — Daily Intelligence Report · {datetime.now().strftime('%b %d, %Y')}"

    msg = MIMEMultipart("mixed")
    msg["From"]    = SENDER_EMAIL
    msg["To"]      = RECIPIENT
    msg["Subject"] = subject

    # HTML body
    html_body = build_html(all_reports, date_str)
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    # PDF attachments — one per role
    if pdf_attachments:
        for role, pdf_bytes in pdf_attachments.items():
            safe = role.replace("/", "-").replace(" ", "_")
            part = MIMEApplication(pdf_bytes, _subtype="pdf")
            part.add_header("Content-Disposition", "attachment",
                            filename=f"MorningPulse_{safe}_{datetime.now().strftime('%Y%m%d')}.pdf")
            msg.attach(part)

    # Send
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASS)
        server.sendmail(SENDER_EMAIL, RECIPIENT, msg.as_string())

    print(f"[mailer] Email sent to {RECIPIENT}")
