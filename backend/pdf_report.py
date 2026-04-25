"""
pdf_report.py — Morning Pulse AI
Generates a premium executive-style PDF report using ReportLab.
"""
import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Frame, HRFlowable, PageTemplate,
    Paragraph, Spacer, Table, TableStyle, KeepTogether,
)

# ── Brand palette ─────────────────────────────────────────────────────────────
C_BG        = colors.HexColor("#0f1117")
C_CARD      = colors.HexColor("#1a1d27")
C_ACCENT    = colors.HexColor("#6366f1")
C_GREEN     = colors.HexColor("#22c55e")
C_RED       = colors.HexColor("#ef4444")
C_AMBER     = colors.HexColor("#f59e0b")
C_BLUE      = colors.HexColor("#0ea5e9")
C_PURPLE    = colors.HexColor("#a855f7")
C_WHITE     = colors.HexColor("#f1f5f9")
C_MUTED     = colors.HexColor("#64748b")
C_BORDER    = colors.HexColor("#2d3148")
C_TEXT      = colors.HexColor("#cbd5e1")

W, H = A4   # 595 x 842 pt

MARGIN = 18 * mm


# ── Style helpers ─────────────────────────────────────────────────────────────
def _style(name, **kw):
    base = getSampleStyleSheet()["Normal"]
    return ParagraphStyle(name, parent=base, **kw)


S_TITLE   = _style("title",   fontSize=26, textColor=C_WHITE,  leading=32, alignment=TA_CENTER, fontName="Helvetica-Bold")
S_SUB     = _style("sub",     fontSize=11, textColor=C_MUTED,  leading=16, alignment=TA_CENTER)
S_ROLE    = _style("role",    fontSize=13, textColor=C_ACCENT, leading=18, alignment=TA_CENTER, fontName="Helvetica-Bold")
S_H1      = _style("h1",      fontSize=13, textColor=C_WHITE,  leading=18, fontName="Helvetica-Bold", spaceBefore=6)
S_H2      = _style("h2",      fontSize=10, textColor=C_ACCENT, leading=14, fontName="Helvetica-Bold", spaceBefore=4)
S_BODY    = _style("body",    fontSize=9,  textColor=C_TEXT,   leading=14)
S_SMALL   = _style("small",   fontSize=8,  textColor=C_MUTED,  leading=12)
S_BULLET  = _style("bullet",  fontSize=9,  textColor=C_TEXT,   leading=13, leftIndent=10, bulletIndent=0)
S_BADGE_H = _style("badge_h", fontSize=8,  textColor=C_RED,    leading=11, fontName="Helvetica-Bold")
S_BADGE_M = _style("badge_m", fontSize=8,  textColor=C_AMBER,  leading=11, fontName="Helvetica-Bold")
S_BADGE_L = _style("badge_l", fontSize=8,  textColor=C_GREEN,  leading=11, fontName="Helvetica-Bold")
S_LINK    = _style("link",    fontSize=8,  textColor=C_BLUE,   leading=12)
S_BRIEF   = _style("brief",   fontSize=10, textColor=C_WHITE,  leading=16, fontName="Helvetica-Oblique")


def _hr(color=C_BORDER, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=4, spaceBefore=4)


def _sp(h=4):
    return Spacer(1, h)


def _badge_style(level):
    level = (level or "").lower()
    if level == "high":   return S_BADGE_H, C_RED,   "HIGH"
    if level == "medium": return S_BADGE_M, C_AMBER, "MED"
    return S_BADGE_L, C_GREEN, "LOW"


def _score_bar(label, score, color, col_w):
    """Returns a Table row acting as a mini progress bar."""
    pct = max(0, min(score, 10)) / 10
    bar_w = (col_w - 80) * pct
    bar_w = max(bar_w, 2)
    data = [[
        Paragraph(label, S_SMALL),
        Paragraph(f"{score}/10", _style("sc", fontSize=8, textColor=color, fontName="Helvetica-Bold")),
        Table([[""]], colWidths=[bar_w], rowHeights=[6],
              style=TableStyle([("BACKGROUND", (0,0), (-1,-1), color),
                                ("LINEABOVE",  (0,0), (-1,-1), 0, colors.transparent),
                                ("LINEBELOW",  (0,0), (-1,-1), 0, colors.transparent),
                                ("LINEBEFORE", (0,0), (-1,-1), 0, colors.transparent),
                                ("LINEAFTER",  (0,0), (-1,-1), 0, colors.transparent),
                                ("ROUNDEDCORNERS", [3]),
                                ])),
    ]]
    return Table(data, colWidths=[90, 30, col_w - 120],
                 style=TableStyle([
                     ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
                     ("LEFTPADDING", (0,0), (-1,-1), 0),
                     ("RIGHTPADDING",(0,0), (-1,-1), 4),
                     ("TOPPADDING",  (0,0), (-1,-1), 3),
                     ("BOTTOMPADDING",(0,0),(-1,-1), 3),
                 ]))


# ── Page template with dark background ───────────────────────────────────────
class _DarkPage(PageTemplate):
    def __init__(self, doc):
        frame = Frame(MARGIN, MARGIN, W - 2*MARGIN, H - 2*MARGIN,
                      leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        super().__init__("dark", [frame])

    def beforeDrawPage(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(C_BG)
        canvas.rect(0, 0, W, H, fill=1, stroke=0)
        # footer line
        canvas.setStrokeColor(C_BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN, 14*mm, W - MARGIN, 14*mm)
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(C_MUTED)
        canvas.drawString(MARGIN, 10*mm, "Morning Pulse AI  ·  Confidential Intelligence Report")
        canvas.drawRightString(W - MARGIN, 10*mm, f"Page {doc.page}")
        canvas.restoreState()


# ── Section header ────────────────────────────────────────────────────────────
def _section_header(num, title, color=C_ACCENT):
    data = [[
        Paragraph(f"0{num}", _style("sn", fontSize=9, textColor=color, fontName="Helvetica-Bold")),
        Paragraph(title.upper(), _style("st", fontSize=11, textColor=C_WHITE, fontName="Helvetica-Bold", leading=14)),
    ]]
    t = Table(data, colWidths=[24, W - 2*MARGIN - 24],
              style=TableStyle([
                  ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
                  ("LEFTPADDING",  (0,0), (-1,-1), 0),
                  ("RIGHTPADDING", (0,0), (-1,-1), 0),
                  ("TOPPADDING",   (0,0), (-1,-1), 6),
                  ("BOTTOMPADDING",(0,0), (-1,-1), 6),
                  ("LINEBELOW",    (0,0), (-1,-1), 0.5, color),
              ]))
    return t


# ── Card wrapper ──────────────────────────────────────────────────────────────
def _card(content_rows, bg=C_CARD, border_color=C_BORDER, border_top=None):
    inner = Table([[r] for r in content_rows],
                  colWidths=[W - 2*MARGIN - 16],
                  style=TableStyle([
                      ("LEFTPADDING",  (0,0), (-1,-1), 8),
                      ("RIGHTPADDING", (0,0), (-1,-1), 8),
                      ("TOPPADDING",   (0,0), (-1,-1), 2),
                      ("BOTTOMPADDING",(0,0), (-1,-1), 2),
                  ]))
    style = [
        ("BACKGROUND",   (0,0), (-1,-1), bg),
        ("ROUNDEDCORNERS", [6]),
        ("LEFTPADDING",  (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING",   (0,0), (-1,-1), 0),
        ("BOTTOMPADDING",(0,0), (-1,-1), 0),
        ("BOX",          (0,0), (-1,-1), 0.5, border_color),
    ]
    if border_top:
        style.append(("LINEABOVE", (0,0), (-1,0), 3, border_top))
    return Table([[inner]], colWidths=[W - 2*MARGIN],
                 style=TableStyle(style))


# ── Main builder ──────────────────────────────────────────────────────────────
def build_pdf(data: dict, role: str) -> bytes:
    buf = io.BytesIO()
    doc = BaseDocTemplate(buf, pagesize=A4,
                          leftMargin=MARGIN, rightMargin=MARGIN,
                          topMargin=MARGIN, bottomMargin=20*mm)
    doc.addPageTemplates([_DarkPage(doc)])

    story = []
    col_w = W - 2 * MARGIN
    now   = datetime.now()
    date_str = now.strftime("%B %d, %Y  ·  %I:%M %p")

    articles    = data.get("top_articles", [])
    trends      = data.get("top_trends", [])
    opps        = data.get("growth_opportunities", [])
    threats     = data.get("threats", [])
    missed      = data.get("missed_opportunities", [])
    moves       = data.get("strategic_moves", [])
    tools       = data.get("tools_to_watch", [])
    hiring      = data.get("hiring_signals", [])
    brief       = data.get("daily_brief", "")

    # ── COVER ─────────────────────────────────────────────────────────────────
    story += [
        _sp(20),
        Paragraph("Morning Pulse AI", S_TITLE),
        _sp(6),
        Paragraph("Daily Personalized Intelligence Report", S_SUB),
        _sp(10),
        _hr(C_ACCENT, 1),
        _sp(8),
        Paragraph(f"Generated for: {role}", S_ROLE),
        _sp(4),
        Paragraph(date_str, S_SUB),
        _sp(4),
        Paragraph("Confidence Score: High  ·  Sources: Google News · The Guardian · NewsData.io", S_SMALL),
        _sp(20),
        _hr(C_BORDER),
        _sp(16),
    ]

    # ── SECTION 1: EXECUTIVE SUMMARY ─────────────────────────────────────────
    story += [
        _section_header(1, "Executive Summary", C_ACCENT),
        _sp(8),
        _card([
            _sp(4),
            Paragraph(brief or "No summary available.", S_BRIEF),
            _sp(4),
        ], border_top=C_ACCENT),
        _sp(16),
    ]

    # ── SECTION 2: TOP PRIORITY NEWS ─────────────────────────────────────────
    story.append(_section_header(2, "Top Priority News", C_AMBER))
    story.append(_sp(8))

    for i, art in enumerate(articles[:5]):
        badge_s, badge_c, badge_txt = _badge_style(art.get("opportunity_level"))
        urgency = art.get("urgency_score", 5)
        u_color = C_RED if urgency >= 8 else (C_AMBER if urgency >= 5 else C_GREEN)

        rows = [
            # title row with badges
            Table([[
                Paragraph(f"{i+1}. {art.get('title','')}", _style("at", fontSize=10, textColor=C_WHITE, fontName="Helvetica-Bold", leading=14)),
                Paragraph(badge_txt, _style("b", fontSize=7, textColor=badge_c, fontName="Helvetica-Bold", alignment=TA_RIGHT)),
                Paragraph(f"U:{urgency}/10", _style("u", fontSize=7, textColor=u_color, fontName="Helvetica-Bold", alignment=TA_RIGHT)),
            ]], colWidths=[col_w - 80, 40, 40],
               style=TableStyle([
                   ("VALIGN",       (0,0), (-1,-1), "TOP"),
                   ("LEFTPADDING",  (0,0), (-1,-1), 0),
                   ("RIGHTPADDING", (0,0), (-1,-1), 0),
                   ("TOPPADDING",   (0,0), (-1,-1), 0),
                   ("BOTTOMPADDING",(0,0), (-1,-1), 4),
               ])),
        ]

        # meta: source + date
        meta_parts = []
        if art.get("source"):      meta_parts.append(art["source"])
        if art.get("published_date"): meta_parts.append(art["published_date"])
        if meta_parts:
            rows.append(Paragraph("  ·  ".join(meta_parts), S_SMALL))

        # summary
        if art.get("short_summary"):
            rows.append(Paragraph(art["short_summary"], S_BODY))

        rows.append(_sp(2))

        # what happened / why it matters / action
        for label, key, lcolor in [
            ("What Happened",   "what_happened",      C_MUTED),
            ("Why It Matters",  "why_it_matters",     C_BLUE),
            ("Recommended Action", "recommended_action", C_GREEN),
        ]:
            val = art.get(key, "")
            if val:
                rows.append(Table([[
                    Paragraph(label, _style("lbl", fontSize=7, textColor=lcolor, fontName="Helvetica-Bold")),
                    Paragraph(val, _style("val", fontSize=8, textColor=C_TEXT, leading=12)),
                ]], colWidths=[90, col_w - 90 - 16],
                   style=TableStyle([
                       ("VALIGN",       (0,0), (-1,-1), "TOP"),
                       ("LEFTPADDING",  (0,0), (-1,-1), 0),
                       ("RIGHTPADDING", (0,0), (-1,-1), 0),
                       ("TOPPADDING",   (0,0), (-1,-1), 2),
                       ("BOTTOMPADDING",(0,0), (-1,-1), 2),
                   ])))

        # link
        if art.get("link"):
            rows.append(Paragraph(
                f'<link href="{art["link"]}" color="#0ea5e9">↗ Read Full Article</link>',
                S_LINK))

        rows.append(_sp(4))
        story.append(KeepTogether(_card(rows, border_top=u_color)))
        story.append(_sp(8))

    story.append(_sp(8))

    # ── SECTION 3: ROLE-SPECIFIC INSIGHTS ────────────────────────────────────
    story.append(_section_header(3, f"Role-Specific Insights  ·  {role}", C_PURPLE))
    story.append(_sp(8))

    role_sections = {
        "Institute Owner":       [("Student Acquisition", opps), ("Operational Efficiency", moves), ("Tech to Adopt", tools)],
        "Backend Developer":     [("High-Demand Skills", trends), ("Tools & Frameworks Rising", tools), ("Hiring Signals", hiring)],
        "Data Engineer":         [("Data Stack Trends", trends), ("Pipeline & Cloud Opportunities", opps), ("AI Infra Signals", tools)],
        "Founder / Entrepreneur":[("Startup Gaps & Opportunities", opps), ("Competitor Funding Moves", threats), ("Build Ideas", moves)],
        "Product Builder":       [("Product Trends", trends), ("Fast Build Opportunities", opps), ("Competitor Features", threats)],
    }

    for sub_title, items in role_sections.get(role, [("Key Insights", trends)]):
        if not items:
            continue
        rows = [
            Paragraph(sub_title, S_H2),
            _sp(2),
        ]
        for item in items[:5]:
            rows.append(Paragraph(f"› {item}", S_BULLET))
        rows.append(_sp(4))
        story.append(_card(rows, border_top=C_PURPLE))
        story.append(_sp(6))

    story.append(_sp(8))

    # ── SECTION 4: GROWTH OPPORTUNITIES ──────────────────────────────────────
    story.append(_section_header(4, "Growth Opportunities", C_GREEN))
    story.append(_sp(8))
    if opps:
        rows = []
        for i, opp in enumerate(opps):
            rows.append(Paragraph(f"{i+1}.  {opp}", S_BULLET))
            rows.append(_sp(2))
        story.append(_card(rows, border_top=C_GREEN))
    story.append(_sp(16))

    # ── SECTION 5: THREATS & RISKS ────────────────────────────────────────────
    story.append(_section_header(5, "Threats & Risks", C_RED))
    story.append(_sp(8))
    if threats:
        rows = []
        for t in threats:
            rows.append(Paragraph(f"⚠  {t}", _style("thr", fontSize=9, textColor=C_RED, leading=13, leftIndent=10)))
            rows.append(_sp(2))
        story.append(_card(rows, border_top=C_RED))
    story.append(_sp(16))

    # ── SECTION 6: ACTION PLAN (NEXT 7 DAYS) ─────────────────────────────────
    story.append(_section_header(6, "Recommended Action Plan — Next 7 Days", C_AMBER))
    story.append(_sp(8))

    action_items = moves[:6] if moves else ["Review top articles", "Identify one quick win", "Monitor competitor moves"]
    day_ranges   = ["Day 1–2", "Day 3–4", "Day 5–6", "Day 7", "Day 7", "Day 7"]
    rows = []
    for i, action in enumerate(action_items):
        day = day_ranges[i] if i < len(day_ranges) else f"Day {i*2+1}–{i*2+2}"
        rows.append(Table([[
            Paragraph(day, _style("day", fontSize=8, textColor=C_AMBER, fontName="Helvetica-Bold")),
            Paragraph(f"→  {action}", _style("act", fontSize=9, textColor=C_TEXT, leading=13)),
        ]], colWidths=[52, col_w - 52 - 16],
           style=TableStyle([
               ("VALIGN",       (0,0), (-1,-1), "TOP"),
               ("LEFTPADDING",  (0,0), (-1,-1), 0),
               ("RIGHTPADDING", (0,0), (-1,-1), 0),
               ("TOPPADDING",   (0,0), (-1,-1), 3),
               ("BOTTOMPADDING",(0,0), (-1,-1), 3),
               ("LINEBELOW",    (0,0), (-1,-1), 0.3, C_BORDER),
           ])))
    story.append(_card(rows, border_top=C_AMBER))
    story.append(_sp(16))

    # ── SECTION 7: MARKET SIGNALS DASHBOARD ──────────────────────────────────
    story.append(_section_header(7, "Market Signals Dashboard", C_BLUE))
    story.append(_sp(8))

    trend_score = min(len(trends) * 2, 10)
    opp_score   = min(len(opps)   * 2, 10)
    threat_score= min(len(threats)* 2, 10)
    comp_score  = min(len(missed) * 2 + 3, 10)
    ai_score    = 8  # AI adoption is consistently high signal

    rows = [_sp(4)]
    for label, score, color in [
        ("Trend Score",           trend_score,  C_ACCENT),
        ("Opportunity Score",     opp_score,    C_GREEN),
        ("Threat Score",          threat_score, C_RED),
        ("Competition Intensity", comp_score,   C_AMBER),
        ("AI Adoption Signal",    ai_score,     C_PURPLE),
    ]:
        rows.append(_score_bar(label, score, color, col_w - 16))
        rows.append(_sp(4))
    rows.append(_sp(4))
    story.append(_card(rows, border_top=C_BLUE))
    story.append(_sp(16))

    # ── SECTION 8: SOURCES ────────────────────────────────────────────────────
    story.append(_section_header(8, "Sources", C_MUTED))
    story.append(_sp(8))
    rows = []
    for i, art in enumerate(articles):
        link = art.get("link", "")
        title = art.get("title", f"Article {i+1}")
        source = art.get("source", "")
        date   = art.get("published_date", "")
        meta   = f"  [{source}]  {date}" if source else ""
        if link:
            rows.append(Paragraph(
                f'{i+1}.  <link href="{link}" color="#0ea5e9">{title}</link>{meta}',
                S_LINK))
        else:
            rows.append(Paragraph(f"{i+1}.  {title}{meta}", S_SMALL))
        rows.append(_sp(3))
    if rows:
        story.append(_card(rows))
    story.append(_sp(20))

    # ── BUILD ─────────────────────────────────────────────────────────────────
    doc.build(story)
    buf.seek(0)
    return buf.read()
