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
      <ul>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

export default function App() {
  const [role, setRole]           = useState("Institute Owner");
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchReport = async (r, bustCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (bustCache) {
        await fetch("http://127.0.0.1:8000/cache", { method: "DELETE" });
      }
      const res = await fetch(
        `http://127.0.0.1:8000/report?role=${encodeURIComponent(r)}`
      );
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

  const downloadReport = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/download-report?role=${encodeURIComponent(role)}`
      );
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

  useEffect(() => { fetchReport(role); }, []);

  const handleRole = (e) => {
    const r = e.target.value;
    setRole(r);
    fetchReport(r);
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
          <button onClick={() => fetchReport(role, true)} disabled={loading}>
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
          <div className="brief-card">
            <div className="brief-label">Today's Executive Brief</div>
            <p className="brief-text">{data.daily_brief}</p>
          </div>

          <div className="stats-row">
            {[
              ["Trends",         data.top_trends?.length,           "#6366f1"],
              ["Opportunities",  data.growth_opportunities?.length,  "#22c55e"],
              ["Threats",        data.threats?.length,               "#ef4444"],
              ["Articles",       data.top_articles?.length,          "#f59e0b"],
              ["Strategic Moves",data.strategic_moves?.length,       "#0ea5e9"],
            ].map(([label, val, color]) => (
              <div className="stat-box" key={label} style={{ borderTopColor: color }}>
                <div className="stat-num" style={{ color }}>{val ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="articles-section">
            <h2>Priority Intelligence</h2>
            <div className="articles-grid">
              {data.top_articles?.map((a, i) => (
                <div className="article-card" key={i}>
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
                    {a.source       && <span className="meta-source">{a.source}</span>}
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
              ))}
            </div>
          </div>

          <div className="insights-grid">
            <Section title="Top Trends"           items={data.top_trends}            color="#6366f1" />
            <Section title="Growth Opportunities" items={data.growth_opportunities}  color="#22c55e" />
            <Section title="Threats"              items={data.threats}               color="#ef4444" />
            <Section title="Missed Opportunities" items={data.missed_opportunities}  color="#f59e0b" />
            <Section title="Strategic Moves"      items={data.strategic_moves}       color="#0ea5e9" />
            <Section title="Tools to Watch"       items={data.tools_to_watch}        color="#a855f7" />
          </div>

          {data.hiring_signals?.length > 0 && (
            <div className="section-card" style={{ borderTopColor: "#ec4899" }}>
              <h3>Hiring Signals</h3>
              <ul>
                {data.hiring_signals.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          )}
        </main>
      )}

      <footer className="footer">
        Morning Pulse AI © 2026 · Powered by Gemini + Real-Time News · Role: {role}
      </footer>
    </div>
  );
}
