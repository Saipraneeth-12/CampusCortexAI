import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Radar as RadarIcon, ExternalLink, Clock, ChevronDown, ChevronUp, Zap, Flame, Shield, Target, ArrowRight, RefreshCw } from "lucide-react";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { api, type CompetitorAlert, type CompetitorResponse } from "@/lib/api";

export const Route = createFileRoute("/dashboard/competitors")({
  head: () => ({ meta: [{ title: "Competitor Radar — Campus Cortex AI" }] }),
  component: Competitors,
});

const THREAT_COLORS: Record<string, string> = {
  High: "oklch(0.72 0.27 340)",
  Medium: "oklch(0.82 0.17 75)",
  Low: "oklch(0.78 0.2 155)",
};

const COMP_COLORS: Record<string, string> = {
  "Byju's": "oklch(0.7 0.24 255)",
  "Unacademy": "oklch(0.72 0.27 340)",
  "Coursera": "oklch(0.85 0.18 200)",
  "upGrad": "oklch(0.82 0.17 75)",
  "Google Classroom": "oklch(0.78 0.2 155)",
  "Khan Academy": "oklch(0.65 0.28 300)",
  "Duolingo": "oklch(0.7 0.24 255)",
  "Chegg": "oklch(0.72 0.27 340)",
  "Vedantu": "oklch(0.85 0.18 200)",
  "PhysicsWallah": "oklch(0.82 0.17 75)",
};

function getColor(name: string) {
  return COMP_COLORS[name] ?? "oklch(0.7 0.24 255)";
}

function CompetitorCard({ alert, index }: { alert: CompetitorAlert; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = getColor(alert.competitor);
  const urgColor = alert.urgency >= 8 ? "oklch(0.72 0.27 340)" : alert.urgency >= 5 ? "oklch(0.82 0.17 75)" : "oklch(0.78 0.2 155)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass neon-border relative overflow-hidden rounded-2xl p-5"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl" style={{ background: color }} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: color, boxShadow: `0 0 18px ${color}` }}>
            {alert.competitor.slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-semibold">{alert.competitor}</h3>
              {alert.move_type && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {alert.move_type}
                </span>
              )}
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${urgColor.replace(")", " / 0.15)")}`, color: urgColor }}
              >
                Urgency {alert.urgency}/10
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              {alert.source_date && <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{alert.source_date}</span>}
              {alert.threat_level && (
                <span style={{ color: THREAT_COLORS[alert.threat_level] }}>
                  {alert.threat_level} Threat
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alert.source_link && (
            <a href={alert.source_link} target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button onClick={() => setExpanded(e => !e)} className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/80">{alert.move}</p>

      {alert.source_title && (
        <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">Source: {alert.source_title}</p>
      )}

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[oklch(0.72_0.27_340/0.1)] p-3 border border-[oklch(0.72_0.27_340/0.2)]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Shield className="h-3.5 w-3.5 text-[oklch(0.72_0.27_340)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.72_0.27_340)]">Threat to You</span>
              </div>
              <p className="text-xs text-foreground/80">{alert.threat_to_role}</p>
            </div>
            <div className="rounded-xl bg-[oklch(0.78_0.2_155/0.1)] p-3 border border-[oklch(0.78_0.2_155/0.2)]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="h-3.5 w-3.5 text-[oklch(0.78_0.2_155)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.78_0.2_155)]">Your Opportunity</span>
              </div>
              <p className="text-xs text-foreground/80">{alert.opportunity}</p>
            </div>
          </div>
          {alert.counter_actions?.length > 0 && (
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.85_0.18_200)] mb-2">Counter-Actions</p>
              <ul className="space-y-1.5">
                {alert.counter_actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[oklch(0.85_0.18_200)]" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/10" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-2/3 rounded bg-white/10" />
    </div>
  );
}

function Competitors() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [data, setData] = useState<CompetitorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getCompetitors(role);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fresh = data?.fresh ?? [];
  const trending = data?.trending ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role} · Intelligence
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Competitor Radar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Scanning 10 competitors…" : `${data?.total ?? 0} competitor moves detected · AI-generated counter-strategies`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs">
            <RadarIcon className="h-3.5 w-3.5 text-[oklch(0.7_0.24_255)] animate-spin-slow" />
            <span>10 competitors monitored</span>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="glass rounded-2xl border border-[oklch(0.72_0.27_340/0.4)] p-4 text-sm text-[oklch(0.72_0.27_340)]">
          ⚠ {error} — Make sure the backend is running on port 8000.
        </div>
      )}

      {/* Executive Summary */}
      <div className="glass-strong neon-border relative overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.72_0.27_340/0.25),transparent_55%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Competitive Intelligence Summary</p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {(() => {
                  const allMoves = [...fresh, ...trending];
                  const bullets: { text: string; color: string }[] = [];

                  // Real competitor moves as bullet points
                  allMoves.slice(0, 4).forEach((c) => {
                    const urgColor =
                      c.urgency >= 8
                        ? "bg-[oklch(0.72_0.27_340)]"
                        : c.urgency >= 5
                        ? "bg-[oklch(0.82_0.17_75)]"
                        : "bg-[oklch(0.78_0.2_155)]";
                    bullets.push({
                      text: `${c.competitor} — ${c.move.length > 80 ? c.move.slice(0, 80) + "…" : c.move}`,
                      color: urgColor,
                    });
                  });

                  // Fallback if no data
                  if (bullets.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground">
                        No competitor activity detected. Click Refresh to scan.
                      </p>
                    );
                  }

                  return bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${b.color}`} />
                      <p className="text-sm leading-relaxed text-foreground/90">{b.text}</p>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Competitors", v: "10" },
              { l: "Fresh Moves", v: loading ? "—" : `${fresh.length}` },
              { l: "Trending", v: loading ? "—" : `${trending.length}` },
              { l: "Total Alerts", v: loading ? "—" : `${data?.total ?? 0}` },
            ].map((s) => (
              <div key={s.l} className="glass min-w-[90px] rounded-xl p-3 text-center">
                <div className="font-display text-xl font-bold gradient-text-pink">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fresh */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.7_0.24_255/0.15)] px-3 py-2">
            <Zap className="h-4 w-4 text-[oklch(0.85_0.18_200)]" />
            <span className="font-display text-base font-semibold">Last 48 Hours</span>
            <span className="rounded-full bg-[oklch(0.7_0.24_255/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.85_0.18_200)]">
              {loading ? "…" : fresh.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Fresh competitor moves</p>
        </div>
        <div className="space-y-4">
          {loading ? [1, 2].map(i => <SkeletonCard key={i} />) :
            fresh.length > 0 ? fresh.map((a, i) => <CompetitorCard key={i} alert={a} index={i} />) :
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">No fresh competitor moves in the last 48 hours.</div>
          }
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.72_0.27_340/0.15)] px-3 py-2">
            <Flame className="h-4 w-4 text-[oklch(0.72_0.27_340)]" />
            <span className="font-display text-base font-semibold">Still Trending</span>
            <span className="rounded-full bg-[oklch(0.72_0.27_340/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.72_0.27_340)]">
              {loading ? "…" : trending.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Older moves still shaping the market</p>
        </div>
        <div className="space-y-4">
          {loading ? [1, 2].map(i => <SkeletonCard key={i} />) :
            trending.length > 0 ? trending.map((a, i) => <CompetitorCard key={i} alert={a} index={i} />) :
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">No trending competitor moves found.</div>
          }
        </div>
      </section>
    </div>
  );
}
