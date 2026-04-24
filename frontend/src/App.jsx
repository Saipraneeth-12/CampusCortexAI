import { useEffect, useState, useRef } from "react";
import "./App.css";

const ROLES = ["CEO / Founder"];

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

// ── Chatbot ───────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What's the biggest threat to me today?",
  "Give me a 7-day action plan",
  "Which competitor should I worry about most?",
  "What opportunities should I act on now?",
  "Summarize today's report in 3 sentences",
  "What skills should I focus on this week?",
];

// Strip markdown so TTS reads cleanly
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(stripMarkdown(text));
  utt.lang  = "en-US";
  utt.rate  = 1.0;
  utt.pitch = 1.0;
  // prefer a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
  ) || voices.find(v => v.lang.startsWith("en"));
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

function Chatbot({ role, data, competitors }) {
  const [open, setOpen]           = useState(false);
  const [input, setInput]         = useState("");
  const [history, setHistory]     = useState([]);
  const [thinking, setThinking]   = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const bottomRef  = useRef(null);
  const recognRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, thinking]);

  useEffect(() => { setHistory([]); }, [role]);

  // Track TTS speaking state
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const interval = setInterval(() => {
      setSpeaking(window.speechSynthesis.speaking);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (msg) => {
    const text = (msg || input).trim();
    if (!text || thinking) return;
    stopSpeaking();
    setInput("");
    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setThinking(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          message: text,
          history: newHistory.slice(-6),
          competitors: competitors || {},
        }),
      });
      const json  = await res.json();
      const reply = json.reply || json.detail || "No response.";
      setHistory(h => [...h, { role: "assistant", content: reply }]);
      if (autoSpeak) speak(reply);
    } catch (e) {
      const err = "Connection error. Make sure the backend is running.";
      setHistory(h => [...h, { role: "assistant", content: err }]);
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported in this browser. Use Chrome."); return; }
    stopSpeaking();
    const recog = new SR();
    recog.lang        = "en-US";
    recog.continuous  = false;
    recog.interimResults = false;
    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);
    recog.onerror  = () => setListening(false);
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      // auto-send after short delay so user sees what was heard
      setTimeout(() => sendMessage(transcript), 400);
    };
    recog.start();
    recognRef.current = recog;
  };

  const stopListening = () => {
    recognRef.current?.stop();
    setListening(false);
  };

  const replayLast = () => {
    const lastBot = [...history].reverse().find(m => m.role === "assistant");
    if (lastBot) speak(lastBot.content);
  };

  return (
    <>
      {/* Floating bubble */}
      <button className="chat-bubble" onClick={() => setOpen(o => !o)} title="Ask Morning Pulse AI">
        {open ? "✕" : "💬"}
        {history.length > 0 && !open && (
          <span className="chat-badge">{history.filter(h => h.role === "assistant").length}</span>
        )}
      </button>

      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div>
              <div className="chat-title">🧠 Morning Pulse Advisor</div>
              <div className="chat-sub">Live report · {role} · Voice enabled</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* Auto-speak toggle */}
              <button
                className={`chat-icon-btn ${autoSpeak ? "active" : ""}`}
                onClick={() => { setAutoSpeak(a => !a); stopSpeaking(); }}
                title={autoSpeak ? "Auto-speak ON (click to mute)" : "Auto-speak OFF (click to enable)"}
              >
                {autoSpeak ? "🔊" : "🔇"}
              </button>
              {/* Replay last response */}
              <button
                className="chat-icon-btn"
                onClick={replayLast}
                disabled={!history.some(m => m.role === "assistant")}
                title="Replay last response"
              >
                ▶
              </button>
              {/* Stop speaking */}
              {speaking && (
                <button className="chat-icon-btn" onClick={stopSpeaking} title="Stop speaking">⏹</button>
              )}
              <button className="chat-close" onClick={() => { setOpen(false); stopSpeaking(); }}>✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {history.length === 0 && (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">🧠</div>
                <div className="chat-welcome-text">
                  Ask me anything about today's market intelligence.<br />
                  <span style={{ fontSize: 11, color: "#475569" }}>
                    Type, press Enter, or tap 🎤 to speak
                  </span>
                </div>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {history.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "chat-msg-user" : "chat-msg-bot"}`}>
                {msg.role === "assistant" && (
                  <button
                    className="chat-avatar-btn"
                    onClick={() => speak(msg.content)}
                    title="Read aloud"
                  >🧠</button>
                )}
                <div className="chat-bubble-text">{msg.content}</div>
                {msg.role === "user" && <span className="chat-user-icon">👤</span>}
              </div>
            ))}

            {thinking && (
              <div className="chat-msg chat-msg-bot">
                <span className="chat-avatar">🧠</span>
                <div className="chat-thinking"><span /><span /><span /></div>
              </div>
            )}

            {listening && (
              <div className="chat-msg chat-msg-bot">
                <span className="chat-avatar">🎤</span>
                <div className="chat-listening">Listening... speak now</div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="chat-input-row">
            {/* Voice input button */}
            <button
              className={`chat-mic-btn ${listening ? "listening" : ""}`}
              onClick={listening ? stopListening : startListening}
              disabled={thinking || !data}
              title={listening ? "Stop listening" : "Speak your question"}
            >
              🎤
            </button>

            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={listening ? "Listening..." : "Ask about today's market..."}
              disabled={thinking || !data || listening}
            />

            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={thinking || !input.trim() || !data}
            >➤</button>
          </div>

          {!data && <div className="chat-no-data">Load a report first to enable the advisor.</div>}
        </div>
      )}
    </>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState("CEO / Founder");
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

      <Chatbot role={role} data={data} competitors={competitors} />
    </div>
  );
}
