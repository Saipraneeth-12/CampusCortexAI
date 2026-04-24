import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, Brain, ArrowUpRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useRole, ROLE_META } from "@/context/RoleContext";

export const Route = createFileRoute("/dashboard/trends")({
  head: () => ({ meta: [{ title: "Trend Forecast — Campus Cortex AI" }] }),
  component: Trends,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ROLE_TRENDS: Record<string, { name: string; growth: number; confidence: number; color: string; desc: string }[]> = {
  "Institute Owner": [
    { name: "AI Tutoring", growth: 312, confidence: 96, color: "oklch(0.7 0.24 255)", desc: "Personalized AI tutors for K-12 and competitive exam prep" },
    { name: "Hybrid Learning", growth: 187, confidence: 91, color: "oklch(0.72 0.27 340)", desc: "Blended online-offline models gaining traction in tier-2 cities" },
    { name: "LMS Adoption", growth: 142, confidence: 88, color: "oklch(0.85 0.18 200)", desc: "School management + LMS integration demand accelerating" },
    { name: "Vernacular EdTech", growth: 248, confidence: 94, color: "oklch(0.78 0.2 155)", desc: "Regional language content demand surging in rural markets" },
    { name: "Gamification", growth: 96, confidence: 79, color: "oklch(0.82 0.17 75)", desc: "Engagement mechanics driving retention in competitive exam apps" },
    { name: "Parent Analytics", growth: 64, confidence: 71, color: "oklch(0.65 0.28 300)", desc: "Parent-facing dashboards for student progress tracking" },
  ],
  "Backend Developer": [
    { name: "Edge Runtimes", growth: 287, confidence: 94, color: "oklch(0.7 0.24 255)", desc: "Bun, Deno, and Cloudflare Workers replacing Node.js for new projects" },
    { name: "AI Inference APIs", growth: 342, confidence: 97, color: "oklch(0.72 0.27 340)", desc: "Serverless AI inference demand exploding across all verticals" },
    { name: "TypeScript-First", growth: 156, confidence: 92, color: "oklch(0.85 0.18 200)", desc: "Full-stack TypeScript adoption accelerating in enterprise" },
    { name: "WebSockets/SSE", growth: 198, confidence: 89, color: "oklch(0.78 0.2 155)", desc: "Real-time streaming APIs becoming standard for AI-powered apps" },
    { name: "Rust for APIs", growth: 124, confidence: 83, color: "oklch(0.82 0.17 75)", desc: "Rust backend adoption growing for performance-critical services" },
    { name: "GraphQL Decline", growth: -34, confidence: 76, color: "oklch(0.65 0.28 300)", desc: "REST + tRPC replacing GraphQL in new projects" },
  ],
  "Data Engineer": [
    { name: "Streaming-First", growth: 298, confidence: 95, color: "oklch(0.7 0.24 255)", desc: "Real-time data pipelines replacing batch as the default architecture" },
    { name: "Lakehouse Pattern", growth: 234, confidence: 93, color: "oklch(0.72 0.27 340)", desc: "Unified storage + compute replacing separate data lake and warehouse" },
    { name: "AI/ML Pipelines", growth: 312, confidence: 96, color: "oklch(0.85 0.18 200)", desc: "Feature stores and ML pipeline tooling demand accelerating" },
    { name: "Data Contracts", growth: 178, confidence: 87, color: "oklch(0.78 0.2 155)", desc: "Schema enforcement and data quality contracts becoming standard" },
    { name: "Reverse ETL", growth: 142, confidence: 84, color: "oklch(0.82 0.17 75)", desc: "Syncing warehouse data back to operational tools growing fast" },
    { name: "dbt Adoption", growth: 267, confidence: 94, color: "oklch(0.65 0.28 300)", desc: "dbt becoming the standard transformation layer across all stacks" },
  ],
  "Founder / Entrepreneur": [
    { name: "AI-Native SaaS", growth: 387, confidence: 97, color: "oklch(0.7 0.24 255)", desc: "Products built AI-first from day one commanding premium valuations" },
    { name: "Vertical AI", growth: 312, confidence: 95, color: "oklch(0.72 0.27 340)", desc: "Domain-specific AI tools outperforming horizontal platforms" },
    { name: "B2B EdTech", growth: 234, confidence: 92, color: "oklch(0.85 0.18 200)", desc: "Enterprise learning platforms growing 67% ARR YoY" },
    { name: "Vernacular Markets", growth: 198, confidence: 89, color: "oklch(0.78 0.2 155)", desc: "$2.1B untapped vernacular EdTech opportunity in India" },
    { name: "Creator Economy", growth: 156, confidence: 84, color: "oklch(0.82 0.17 75)", desc: "Individual educators building $1M+ businesses on owned platforms" },
    { name: "Micro-SaaS", growth: 124, confidence: 81, color: "oklch(0.65 0.28 300)", desc: "Niche, high-margin SaaS products with low CAC gaining traction" },
  ],
  "Product Builder": [
    { name: "AI Agents", growth: 412, confidence: 97, color: "oklch(0.7 0.24 255)", desc: "Autonomous AI agents completing multi-step tasks becoming standard" },
    { name: "Voice Interfaces", growth: 287, confidence: 93, color: "oklch(0.72 0.27 340)", desc: "Voice-first UX patterns emerging in mobile and desktop apps" },
    { name: "No-Code AI", growth: 234, confidence: 91, color: "oklch(0.85 0.18 200)", desc: "AI-assisted no-code tools enabling non-technical product builders" },
    { name: "Gamification", growth: 178, confidence: 87, color: "oklch(0.78 0.2 155)", desc: "Streak mechanics and habit loops driving retention across categories" },
    { name: "Collaborative AI", growth: 198, confidence: 89, color: "oklch(0.82 0.17 75)", desc: "Real-time AI collaboration features in productivity tools" },
    { name: "Micro-Interactions", growth: 124, confidence: 82, color: "oklch(0.65 0.28 300)", desc: "Delightful micro-animations and feedback loops improving UX scores" },
  ],
};

function buildForecast(trends: { name: string }[]) {
  return MONTHS.map((m, i) => {
    const row: Record<string, string | number> = { m };
    trends.slice(0, 4).forEach((t, j) => {
      row[t.name] = Math.round(40 + i * (15 + j * 4) + Math.sin(i + j) * 10);
    });
    return row;
  });
}

const CHART_COLORS = [
  "oklch(0.7 0.24 255)", "oklch(0.72 0.27 340)",
  "oklch(0.85 0.18 200)", "oklch(0.78 0.2 155)",
];

function Trends() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const trends = ROLE_TRENDS[role] ?? ROLE_TRENDS["Institute Owner"];
  const forecast = buildForecast(trends);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
            {meta.icon} {role} · Forecast Engine
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Trend Forecast</h1>
          <p className="mt-1 text-sm text-muted-foreground">12-month projected demand for your role's key signals.</p>
        </div>
      </header>

      {/* Big chart */}
      <div className="glass neon-border rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Demand Forecast · 12-Month Horizon</h3>
          <div className="flex items-center gap-2 rounded-full bg-[oklch(0.7_0.24_255/0.15)] px-3 py-1 text-xs">
            <Brain className="h-3 w-3 text-[oklch(0.85_0.18_200)]" />
            <span>94% model confidence</span>
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

      {/* Trend cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trends.map((t, i) => (
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
              {Array.from({ length: 12 }).map((_, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${20 + ((j * 7 + i * 3) % 80)}%`,
                    background: `linear-gradient(to top, ${t.color}, transparent)`,
                    opacity: 0.4 + j / 24,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
