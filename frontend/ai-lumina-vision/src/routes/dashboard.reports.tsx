import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download, Zap, Flame, ExternalLink, Clock, AlertTriangle,
  TrendingUp, Lightbulb, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { api, type ReportResponse, type TopArticle } from "@/lib/api";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Morning Pulse — Campus Cortex AI" }] }),
  component: Reports,
});

function urgencyColor(u: number) {
  if (u >= 8) return { bg: "bg-[oklch(0.65_0.27_25/0.18)]", text: "text-[oklch(0.72_0.27_340)]", border: "border-[oklch(0.72_0.27_340/0.4)]", bar: "oklch(0.72 0.27 340)" };
  if (u >= 5) return { bg: "bg-[oklch(0.82_0.17_75/0.18)]", text: "text-[oklch(0.82_0.17_75)]", border: "border-[oklch(0.82_0.17_75/0.4)]", bar: "oklch(0.82 0.17 75)" };
  return { bg: "bg-[oklch(0.7_0.24_255/0.18)]", text: "text-[oklch(0.85_0.18_200)]", border: "border-[oklch(0.7_0.24_255/0.4)]", bar: "oklch(0.85 0.18 200)" };
}

function oppColor(o: string) {
  if (o === "High") return "text-[oklch(0.78_0.2_155)]";
  if (o === "Medium") return "text-[oklch(0.82_0.17_75)]";
  return "text-muted-foreground";
}

function ArticleCard({ article, index }: { article: TopArticle; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const uc = urgencyColor(article.urgency_score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass neon-border relative overflow-hidden rounded-2xl p-5"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl" style={{ background: uc.bar }} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${uc.bg} ${uc.text} ${uc.border}`}>
              <AlertTriangle className="h-3 w-3" /> Urgency {article.urgency_score}/10
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${oppColor(article.opportunity_level)}`}>
              <TrendingUp className="inline h-3 w-3 mr-0.5" />{article.opportunity_level} Opportunity
            </span>
          </div>
          <h3 className="font-display text-base font-semibold leading-snug">{article.title}</h3>
          <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
            {article.source && <span className="font-medium text-[oklch(0.85_0.18_200)]">{article.source}</span>}
            {article.published_date && <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{article.published_date}</span>}
          </div>
          {article.short_summary && (
            <p className="mt-1.5 text-xs text-muted-foreground">{article.short_summary}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {article.link && (
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button onClick={() => setExpanded(e => !e)} className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full" style={{ width: `${article.urgency_score * 10}%`, background: uc.bar, boxShadow: `0 0 8px ${uc.bar}` }} />
      </div>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, label: "What Happened", text: article.what_happened, color: "oklch(0.7 0.24 255)" },
            { icon: TrendingUp, label: "Why It Matters", text: article.why_it_matters, color: "oklch(0.82 0.17 75)" },
            { icon: Lightbulb, label: "Recommended Action", text: article.recommended_action, color: "oklch(0.78 0.2 155)" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex gap-2">
        <div className="h-5 w-24 rounded-full bg-white/10" />
        <div className="h-5 w-20 rounded-full bg-white/10" />
      </div>
      <div className="h-4 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-white/10" />
      <div className="h-1 w-full rounded-full bg-white/10" />
    </div>
  );
}

function Reports() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchReport = async (bustCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (bustCache) await api.clearCache();
      const data = await api.getReport(role);
      setReport(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [role]);

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      const res = await fetch(api.downloadReport(role));
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MorningPulse_${role.replace(/\//g, "-").replace(/ /g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("PDF download failed: " + (e as Error).message);
    } finally {
      setPdfLoading(false);
    }
  };

  const fresh = report?.fresh?.top_articles ?? [];
  const trending = report?.trending?.top_articles ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role} · Daily Briefing
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Morning Pulse Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · Powered by Google Gemini · 3 live sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchReport(true)}
            disabled={loading}
            className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Refresh"}
          </button>
          <button
            onClick={handleDownload}
            disabled={pdfLoading || !report}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_oklch(0.7_0.24_265/0.5)] transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {pdfLoading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </header>

      <div className="glass-strong neon-border relative overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.65_0.28_300/0.25),transparent_55%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Executive Summary</p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2">
                {(() => {
                  const brief = report?.fresh?.daily_brief || "Fetching your personalized intelligence…";
                  // Split into sentences and take first 3
                  const sentences = brief
                    .replace(/\. /g, '.|')
                    .replace(/\? /g, '?|')
                    .replace(/! /g, '!|')
                    .split('|')
                    .filter(s => s.trim())
                    .slice(0, 3);
                  
                  return sentences.map((sentence, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.7_0.24_255)]" />
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {sentence.trim().replace(/\.$/, '')}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Sources", v: "3" },
              { l: "Articles", v: loading ? "—" : `${fresh.length + trending.length}` },
              { l: "Actions", v: loading ? "—" : `${fresh.length}` },
              { l: "Confidence", v: "94%" },
            ].map((s) => (
              <div key={s.l} className="glass min-w-[90px] rounded-xl p-3 text-center">
                <div className="font-display text-xl font-bold gradient-text-cyan">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="glass rounded-2xl border border-[oklch(0.72_0.27_340/0.4)] p-4 text-sm text-[oklch(0.72_0.27_340)]">
          ⚠ {error} — Make sure the backend is running on port 8000.
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.7_0.24_255/0.15)] px-3 py-2">
            <Zap className="h-4 w-4 text-[oklch(0.85_0.18_200)]" />
            <span className="font-display text-base font-semibold">Last 48 Hours</span>
            <span className="rounded-full bg-[oklch(0.7_0.24_255/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.85_0.18_200)]">
              {loading ? "…" : fresh.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Breaking news and fresh developments</p>
        </div>
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : fresh.length > 0 ? (
            fresh.map((a, i) => <ArticleCard key={i} article={a} index={i} />)
          ) : (
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
              No fresh articles found. Try refreshing or check back later.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.72_0.27_340/0.15)] px-3 py-2">
            <Flame className="h-4 w-4 text-[oklch(0.72_0.27_340)]" />
            <span className="font-display text-base font-semibold">Still Trending</span>
            <span className="rounded-full bg-[oklch(0.72_0.27_340/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.72_0.27_340)]">
              {loading ? "…" : trending.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">High-impact stories from the past 2–14 days</p>
        </div>
        <div className="space-y-4">
          {loading ? (
            [1, 2].map(i => <SkeletonCard key={i} />)
          ) : trending.length > 0 ? (
            trending.map((a, i) => <ArticleCard key={i} article={a} index={i} />)
          ) : (
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
              No trending articles found for this period.
            </div>
          )}
        </div>
      </section>

      {report && (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Top Trends", items: report.top_trends, color: "oklch(0.7 0.24 255)" },
            { title: "Growth Opportunities", items: report.growth_opportunities, color: "oklch(0.78 0.2 155)" },
            { title: "Threats", items: report.threats, color: "oklch(0.72 0.27 340)" },
            { title: "Strategic Moves", items: report.strategic_moves, color: "oklch(0.85 0.18 200)" },
            { title: "Tools to Watch", items: report.tools_to_watch, color: "oklch(0.65 0.28 300)" },
            { title: "Hiring Signals", items: report.hiring_signals, color: "oklch(0.82 0.17 75)" },
          ].filter(s => s.items?.length > 0).map((s) => (
            <div key={s.title} className="glass neon-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                <h3 className="text-sm font-semibold" style={{ color: s.color }}>{s.title}</h3>
              </div>
              <ul className="space-y-2">
                {s.items.slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: s.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
