import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import {
  TrendingUp, AlertTriangle, Newspaper, Radar, Sparkles,
  ArrowUpRight, ArrowDownRight, Zap, Activity, Brain, Clock, RefreshCw,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { api, type ReportResponse, type CompetitorResponse } from "@/lib/api";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview — Campus Cortex AI" }] }),
  component: Overview,
});

const signalData = Array.from({ length: 24 }, (_, i) => ({
  t: `${i}h`,
  fresh: Math.round(300 + Math.sin(i / 3) * 100 + Math.random() * 60 + i * 10),
  trending: Math.round(150 + Math.cos(i / 4) * 50 + Math.random() * 30),
}));

function Overview() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (bustCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (bustCache) await api.clearCache();
      const [rep, comp] = await Promise.all([
        api.getReport(role),
        api.getCompetitors(role),
      ]);
      setReport(rep);
      setCompetitors(comp);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const freshCount = report?.fresh?.top_articles?.length ?? 0;
  const trendingCount = report?.trending?.top_articles?.length ?? 0;
  const oppsCount = report?.growth_opportunities?.length ?? 0;
  const threatsCount = report?.threats?.length ?? 0;
  const movesCount = report?.strategic_moves?.length ?? 0;
  const compCount = (competitors?.fresh?.length ?? 0) + (competitors?.trending?.length ?? 0);

  const kpis = [
    { title: "Fresh Articles (48h)", value: freshCount, change: 18.4, icon: Newspaper, accent: "from-[oklch(0.7_0.24_255)] to-[oklch(0.85_0.18_200)]", glow: "oklch(0.7 0.24 255 / 0.4)" },
    { title: "Competitor Moves", value: compCount, change: 12.0, icon: Radar, accent: "from-[oklch(0.72_0.27_340)] to-[oklch(0.65_0.27_25)]", glow: "oklch(0.72 0.27 340 / 0.4)" },
    { title: "Growth Opportunities", value: oppsCount, change: 9.3, icon: TrendingUp, accent: "from-[oklch(0.82_0.17_75)] to-[oklch(0.78_0.2_155)]", glow: "oklch(0.82 0.17 75 / 0.4)" },
    { title: "Trending Stories", value: trendingCount, change: 5.1, icon: Sparkles, accent: "from-[oklch(0.78_0.2_155)] to-[oklch(0.85_0.18_200)]", glow: "oklch(0.78 0.2 155 / 0.4)" },
    { title: "Threats Detected", value: threatsCount, change: -3.2, icon: AlertTriangle, accent: "from-[oklch(0.65_0.28_300)] to-[oklch(0.72_0.27_340)]", glow: "oklch(0.65 0.28 300 / 0.4)" },
    { title: "Strategic Moves", value: movesCount, change: 2.1, icon: Brain, accent: "from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]", glow: "oklch(0.7 0.24 255 / 0.4)" },
  ];

  const marketSignals = [
    { label: "Trend Score", value: Math.min(10, (report?.top_trends?.length ?? 0) * 2), color: "oklch(0.7 0.24 255)" },
    { label: "Opportunity Score", value: Math.min(10, oppsCount * 2), color: "oklch(0.78 0.2 155)" },
    { label: "Threat Score", value: Math.min(10, threatsCount * 2), color: "oklch(0.72 0.27 340)" },
    { label: "Competition Intensity", value: Math.min(10, compCount + 3), color: "oklch(0.82 0.17 75)" },
    { label: "AI Adoption Signal", value: 8, color: "oklch(0.85 0.18 200)" },
  ];

  // Build live feed from real articles
  const liveFeed = [
    ...(report?.fresh?.top_articles?.slice(0, 2).map(a => ({
      tag: "Fresh", text: a.title, time: a.published_date || "just now",
      color: "text-[oklch(0.85_0.18_200)]",
    })) ?? []),
    ...(competitors?.fresh?.slice(0, 2).map(c => ({
      tag: "Competitor", text: `${c.competitor}: ${c.move}`, time: c.source_date || "recent",
      color: "text-[oklch(0.72_0.27_340)]",
    })) ?? []),
    ...(report?.trending?.top_articles?.slice(0, 1).map(a => ({
      tag: "Trending", text: a.title, time: a.published_date || "this week",
      color: "text-[oklch(0.7_0.24_255)]",
    })) ?? []),
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role}
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Good morning</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Fetching live intelligence from 3 sources…" : error ? `Error: ${error}` :
              `Campus Cortex found ${freshCount} fresh articles and ${compCount} competitor moves for you.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs">
            <Activity className="h-3.5 w-3.5 text-[oklch(0.78_0.2_155)]" />
            <span className="text-muted-foreground">Last sync</span>
            <span className="font-medium">just now</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Refresh"}
          </button>
          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_oklch(0.7_0.24_265/0.4)] transition-transform hover:scale-[1.02]"
          >
            <Newspaper className="h-3.5 w-3.5" /> View Morning Pulse
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k, i) => (
          <motion.div
            key={k.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass tilt-card neon-border group relative overflow-hidden rounded-2xl p-5"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 blur-3xl" style={{ background: k.glow }} />
            <div className="flex items-start justify-between">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${k.accent} text-white shadow-lg`}>
                <k.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${k.change >= 0 ? "bg-[oklch(0.78_0.2_155/0.15)] text-[oklch(0.78_0.2_155)]" : "bg-[oklch(0.65_0.27_25/0.15)] text-[oklch(0.72_0.27_340)]"}`}>
                {k.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(k.change)}%
              </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{k.title}</p>
            <div className="mt-1 font-display text-3xl font-bold">
              {loading ? <span className="text-muted-foreground">—</span> : <AnimatedCounter value={k.value} />}
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${k.accent} animate-shimmer`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Signal chart + Confidence */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass neon-border rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">Signal Pulse · Last 24h</h3>
              <p className="text-xs text-muted-foreground">Fresh articles (48h) vs trending stories (2–14d)</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.7_0.24_255)]" />Fresh</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.27_340)]" />Trending</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signalData}>
                <defs>
                  <linearGradient id="gFresh" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.24 255)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.7 0.24 255)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTrending" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.27 340)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.27 340)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: "oklch(0.7 0.04 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.04 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.04 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="fresh" stroke="oklch(0.7 0.24 255)" strokeWidth={2.5} fill="url(#gFresh)" />
                <Area type="monotone" dataKey="trending" stroke="oklch(0.72 0.27 340)" strokeWidth={2} fill="url(#gTrending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass neon-border rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">AI Confidence</h3>
          <p className="text-xs text-muted-foreground">Gemini 12-model chain</p>
          <div className="relative mt-2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ value: 94, fill: "oklch(0.7 0.24 255)" }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold gradient-text">94%</span>
              <span className="text-xs text-muted-foreground">confidence</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {[{ l: "Fresh", v: 96 }, { l: "Trend", v: 91 }, { l: "Comp.", v: 95 }].map((m) => (
              <div key={m.l} className="rounded-lg bg-white/5 p-2">
                <div className="font-semibold text-[oklch(0.85_0.18_200)]">{m.v}%</div>
                <div className="text-[10px] uppercase text-muted-foreground">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Signals + Live Feed */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass neon-border rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold mb-4">Market Signals Dashboard</h3>
          <div className="space-y-4">
            {marketSignals.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold" style={{ color: s.color }}>{s.value}/10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value * 10}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass neon-border rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Live Feed</h3>
            <span className="flex items-center gap-1.5 text-xs text-[oklch(0.78_0.2_155)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.78_0.2_155)]" />
                <span className="absolute inset-0 rounded-full bg-[oklch(0.78_0.2_155)]" />
              </span>
              Live
            </span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : liveFeed.length > 0 ? (
            <ul className="space-y-3">
              {liveFeed.map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                >
                  <Zap className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${a.color}`}>{a.tag}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{a.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/90 line-clamp-2">{a.text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No live data yet. Click Refresh to fetch.</p>
          )}
        </div>
      </div>

      {/* Executive Summary from backend */}
      {report?.fresh?.daily_brief && (
        <div className="glass neon-border rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold mb-3">Today's Executive Brief</h3>
          <p className="text-sm text-foreground/80 leading-relaxed italic">{report.fresh.daily_brief}</p>
          {report.trending?.daily_brief && (
            <>
              <div className="my-3 h-px bg-border/50" />
              <p className="text-sm text-foreground/60 leading-relaxed italic">{report.trending.daily_brief}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
