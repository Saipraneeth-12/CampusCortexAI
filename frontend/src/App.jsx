import { useEffect, useState } from "react";
import "./App.css";

const ROLES = [
  "Institute Owner",
  "Backend Developer",
  "Data Engineer",
  "Founder / Entrepreneur",
  "Product Builder",
];

const URGENCY_COLOR = (score) => {
  if (score >= 8) return "#ef4444";
  if (score >= 5) return "#f59e0b";
  return "#22c55e";
};

const OPP_COLOR = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

function Tag({ label, color }) {
  return (
    <span className="tag" style={{ background: color + "22", color }}>
      {label}
    </span>
  );
}

function Section({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <div className="section-card" style={{ borderTopColor: color }}>
      <h3>{title}</h3>
      <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );
}

// ── Competitor Radar block ────────────────────────────────────────────────────
function CompetitorBlock({ alerts, loading, label }) {
  if (loading) {
    return (
      <div className="comp-scanning">
        <span className="scan-dot" />
        Scanning competitors for {label} moves...
      </div>
    );
  }
  if (!alerts?.length) {
    return <div className="comp-empty">No competitor moves found for {label}.</div>;
  }
  return (
    <>
      {alerts.map((alert, i) => {
        const urgColor    = alert.urgency >= 8 ? "#ef4444" : alert.urgency >= 5 ? "#f59e0b" : "#22c55e";
        const threatColor = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" }[alert.threat_level] || "#6366f1";
        return (
          <div className="comp-card" key={i} style={{ borderLeftColor: urgColor }}>
            <div className="comp-card-header">
              <div className="comp-name-row">
                <span className="comp-name">{alert.competitor}</span>
                <Tag label={alert.move_type}                 color={urgColor} />
                <Tag label={`Threat: ${alert.threat_level}`} color={threatColor} />
                <Tag label={`Urgency ${alert.urgency}/10`}   color={urgColor} />
              </div>
              {alert.source_link && (
                <a href={alert.source_link} target="_blank" rel="noopener noreferrer"
                   className="article-link-btn" title="Read source">↗</a>
              )}
            </div>
            <div className="comp-row">
              <span className="comp-label">What They Did</span>
              <span className="comp-text">{alert.move}</span>
            </div>
            <div className="comp-row">
              <span className="comp-label" style={{ color: "#ef4444" }}>Threat to You</span>
              <span className="comp-text">{alert.threat_to_role}</span>
            </div>
            <div className="comp-row">
              <span className="comp-label" style={{ color: "#22c55e" }}>Your Opportunity</span>
              <span className="comp-text">{alert.opportunity}</span>
            </div>
            <div className="comp-actions-block">
              <span className="comp-label" style={{ color: "#0ea5e9" }}>Counter-Actions</span>
              <div className="comp-action-list">
                {alert.counter_actions?.map((action, j) => (
                  <div className="comp-action-item" key={j}>
                    <span className="comp-action-num">{j + 1}</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
            {alert.source_title && (
              <div className="comp-source">
                Source: {alert.source_title?.slice(0, 80)}
                {alert.source_date && (
                  <span className="meta-date" style={{ marginLeft: 8 }}>{alert.source_date}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ a, i }) {
  return (
    <div className="article-card">
      <div className="article-header">
        <span className="article-num">#{i + 1}</span>
        <Tag label={`Urgency ${a.urgency_score}/10`} color={URGENCY_COLOR(a.urgency_score)} />
        <Tag label={a.opportunity_level} color={OPP_COLOR[a.opportunity_level] || "#6366f1"} />
        {a.link && (
          <a href={a.link} target="_blank" rel="noopener noreferrer"
             className="article-link-btn" title="Read full article">↗</a>
        )}
      </div>
      <h4 className="article-title">{a.title}</h4>
      <div className="article-meta">
        {a.source        && <span className="meta-source">{a.source}</span>}
        {a.published_date && <span className="meta-date">{a.published_date}</span>}
      </div>
      <p className="article-summary">{a.short_summary}</p>
      <div className="article-row">
        <span className="field-label">What Happened</span>
        <span>{a.what_happened}</span>
      </div>
      <div className="article-row">
        <span className="field-label">Why It Matters</span>
        <span>{a.why_it_matters}</span>
      </div>
      <div className="article-action">
        <span className="field-label">Action</span>
        <span>{a.recommended_action}</span>
      </div>
      {a.target_roles_impacted?.length > 0 && (
        <div className="roles-row">
          {a.target_roles_impacted.map((r) => (
            <Tag key={r} label={r} color="#6366f1" />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Intelligence block (articles + competitor radar + insights) ───────────────
function IntelBlock({ blockData, compAlerts, compLoading, label, accentColor, icon }) {
  const articles = blockData?.top_articles || [];

  return (
    <div className="intel-block" style={{ borderTopColor: accentColor }}>
      {/* Block header */}
      <div className="intel-block-header" style={{ borderBottomColor: accentColor + "44" }}>
        <span className="intel-block-icon">{icon}</span>
        <div>
          <div className="intel-block-title" style={{ color: accentColor }}>{label}</div>
          <div className="intel-block-sub">{blockData?.daily_brief}</div>
        </div>
      </div>

      {/* Priority Intelligence */}
      <div className="intel-sub-header">📰 Priority Intelligence</div>
      {articles.length === 0
        ? <div className="comp-empty">No articles found for this period.</div>
        : (
          <div className="articles-grid">
            {articles.map((a, i) => <ArticleCard key={i} a={a} i={i} />)}
          </div>
        )
      }

      {/* Competitor Radar */}
      <div className="intel-sub-header" style={{ marginTop: 20 }}>🎯 Competitor Radar</div>
      <CompetitorBlock alerts={compAlerts} loading={compLoading} label={label} />

      {/* Insights */}
      {(blockData?.top_trends?.length > 0 || blockData?.growth_opportunities?.length > 0) && (
        <>
          <div className="intel-sub-header" style={{ marginTop: 20 }}>📊 Insights</div>
          <div className="insights-grid">
            <Section title="Top Trends"           items={blockData?.top_trends}           color="#6366f1" />
            <Section title="Growth Opportunities" items={blockData?.growth_opportunities} color="#22c55e" />
            <Section title="Threats"              items={blockData?.threats}              color="#ef4444" />
            <Section title="Strategic Moves"      items={blockData?.strategic_moves}      color="#0ea5e9" />
            <Section title="Tools to Watch"       items={blockData?.tools_to_watch}       color="#a855f7" />
            <Section title="Hiring Signals"       items={blockData?.hiring_signals}       color="#ec4899" />
          </div>
        </>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole]               = useState("Institute Owner");
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [pdfLoading, setPdfLoading]   = useState(false);
  const [competitors, setCompetitors] = useState(null);
  const [compLoading, setCompLoading] = useState(false);

  const fetchReport = async (r, bustCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (bustCache) await fetch("http://127.0.0.1:8000/cache", { method: "DELETE" });
      const res = await fetch(`http://127.0.0.1:8000/report?role=${encodeURIComponent(r)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "API error " + res.status);
      }
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitors = async (r) => {
    setCompLoading(true);
    setCompetitors(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/competitor-alerts?role=${encodeURIComponent(r)}`);
      setCompetitors(res.ok ? await res.json() : { fresh: [], trending: [], total: 0 });
    } catch (e) {
      setCompetitors({ fresh: [], trending: [], total: 0 });
    } finally {
      setCompLoading(false);
    }
  };

  const downloadReport = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/download-report?role=${encodeURIComponent(role)}`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `MorningPulse_${role.replace(/\//g, "-").replace(/ /g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("PDF download failed: " + e.message);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => { fetchReport(role); fetchCompetitors(role); }, []);

  const handleRole = (e) => {
    const r = e.target.value;
    setRole(r);
    fetchReport(r);
    fetchCompetitors(r);
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <span className="logo">Morning Pulse AI</span>
          <span className="subtitle">Real-Time Growth Intelligence</span>
        </div>
        <div className="controls">
          <select value={role} onChange={handleRole} disabled={loading}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button onClick={() => { fetchReport(role, true); fetchCompetitors(role); }} disabled={loading}>
            {loading ? "Analyzing..." : "↻ Refresh"}
          </button>
          {data && (
            <button className="btn-pdf" onClick={downloadReport} disabled={pdfLoading}>
              {pdfLoading ? "Generating..." : "⬇ Download Report"}
            </button>
          )}
        </div>
      </header>

      {error && <div className="error">Error: {error}</div>}
      {loading && !data && <div className="loading">Fetching real-time intelligence...</div>}

      {data && (
        <main className="main">
          {/* Stats row */}
          <div className="stats-row">
            {[
              ["Fresh Articles",  data.fresh?.top_articles?.length,    "#22c55e"],
              ["Trending",        data.trending?.top_articles?.length,  "#f59e0b"],
              ["Opportunities",   data.growth_opportunities?.length,    "#6366f1"],
              ["Threats",         data.threats?.length,                 "#ef4444"],
              ["Strategic Moves", data.strategic_moves?.length,         "#0ea5e9"],
            ].map(([label, val, color]) => (
              <div className="stat-box" key={label} style={{ borderTopColor: color }}>
                <div className="stat-num" style={{ color }}>{val ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* BLOCK 1 — Last 48 Hours */}
          <IntelBlock
            blockData={data.fresh}
            compAlerts={competitors?.fresh}
            compLoading={compLoading}
            label="Last 48 Hours"
            accentColor="#22c55e"
            icon="⚡"
          />

          {/* BLOCK 2 — Still Trending */}
          <IntelBlock
            blockData={data.trending}
            compAlerts={competitors?.trending}
            compLoading={compLoading}
            label="Still Trending"
            accentColor="#f59e0b"
            icon="🔥"
          />
        </main>
      )}

      <footer className="footer">
        Morning Pulse AI © 2026 · Powered by Gemini + Real-Time News · Role: {role}
      </footer>
    </div>
  );
}
