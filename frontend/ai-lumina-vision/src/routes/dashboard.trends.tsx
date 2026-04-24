import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Brain, ArrowUpRight, RefreshCw } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { api, type Trend } from "@/lib/api";

export const Route = createFileRoute("/dashboard/trends")({
  head: () => ({ meta: [{ title: "Trend Forecast — Campus Cortex AI" }] }),
  component: Trends,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CHART_COLORS = [
  "oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)",
  "oklch(0.85 0.18 200)", "oklch(0.78 0.2 155)",
];

function buildForecast(trends: Trend[]) {
  return MONTHS.map((m, i) => {
    const row: Record<string, string | number> = { m };
    trends.slice(0, 4).forEach((t) => {
      row[t.name] = t.forecast[i] || 50;
    });
    return row;
  });
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="h-4 w-4 rounded bg-white/10" />
      </div>
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-10 w-24 rounded bg-white/10" />
      <div className="h-2 w-full rounded-full bg-white/10" />
      <div className="flex gap-1 h-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function Trends() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getTrends(role);
      setTrends(result.trends);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrends(); }, [role]);

  const forecast = trends.length > 0 ? buildForecast(trends) : [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role} · Forecast Engine
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Trend Forecast</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            12-month projected demand based on real-time market intelligence.
          </p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={loading}
          className="glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="glass rounded-2xl border border-[oklch(0.72_0.27_340/0.4)] p-4 text-sm text-[oklch(0.72_0.27_340)]">
          ⚠ {error} — Make sure the backend is running on port 8000.
        </div>
      )}

      {/* Big chart */}
      {!loading && trends.length > 0 && (
        <div className="glass neon-border rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Demand Forecast · 12-Month Horizon</h3>
            <div className="flex items-center gap-2 rounded-full bg-[oklch(0.7_0.24_255/0.15)] px-3 py-1 text-xs">
              <Brain className="h-3 w-3 text-[oklch(0.85_0.18_200)]" />
              <span>AI-powered forecast</span>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: "oklch(0.7 0.04 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.04 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.04 265 / 0.95)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {trends.slice(0, 4).map((t, i) => (
                  <Line key={t.name} type="monotone" dataKey={t.name} stroke={CHART_COLORS[i]} strokeWidth={i === 0 ? 3 : 2.5} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Trend cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)
        ) : (
          trends.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass tilt-card neon-border relative overflow-hidden rounded-2xl p-5"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl" style={{ background: t.color }} />
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display text-lg font-semibold">{t.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <TrendingUp className="h-4 w-4 shrink-0" style={{ color: t.color }} />
              </div>
              <div className="mt-3 flex items-end gap-2">
                <div className="font-display text-4xl font-bold" style={{ color: t.color, textShadow: `0 0 20px ${t.color}` }}>
                  {t.growth > 0 ? "+" : ""}{t.growth}%
                </div>
                {t.growth > 0 && <ArrowUpRight className="mb-1 h-5 w-5" style={{ color: t.color }} />}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confidence</span>
                  <span>{t.confidence}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.confidence}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex h-12 items-end gap-1">
                {t.forecast.map((val, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${val}%`,
                      background: `linear-gradient(to top, ${t.color}, transparent)`,
                      opacity: 0.4 + j / 24,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
