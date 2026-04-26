import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain, ArrowUpRight, ArrowDownRight,
  Newspaper, Clock, Zap, ExternalLink,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { useData } from "@/context/DataContext";
import type { Trend, TopArticle } from "@/lib/api";

export const Route = createFileRoute("/dashboard/trends")({
  head: () => ({ meta: [{ title: "Trend Intelligence — Campus Cortex AI" }] }),
  component: TrendsPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];

const BUILD_SUGGESTIONS: Record<string, { build: string; roi: string; icon: string }> = {
  "AI Tutoring":       { build: "Auto-evaluation module with AI feedback for students", roi: "High", icon: "🤖" },
  "Hybrid Learning":   { build: "Blended classroom management dashboard", roi: "High", icon: "🎓" },
  "LMS Adoption":      { build: "One-click LMS integration toolkit for institutes", roi: "Medium", icon: "📚" },
  "Vernacular EdTech": { build: "Regional language content delivery platform", roi: "High", icon: "��" },
  "Gamification":      { build: "Streak-based engagement engine for student retention", roi: "Medium", icon: "🎮" },
  "Parent Analytics":  { build: "WhatsApp-integrated parent progress dashboard", roi: "High", icon: "📱" },
  "Edge Runtimes":     { build: "Edge-first API deployment boilerplate", roi: "Medium", icon: "⚡" },
  "AI Inference APIs": { build: "Serverless AI inference wrapper service", roi: "High", icon: "🧠" },
  "TypeScript-First":  { build: "Full-stack TypeScript starter with AI integration", roi: "Medium", icon: "⚙️" },
  "Real-time APIs":    { build: "WebSocket-based real-time collaboration SDK", roi: "High", icon: "🔄" },
  "AI Agents":         { build: "Autonomous task agent framework for EdTech workflows", roi: "High", icon: "🤖" },
  "Voice Interfaces":  { build: "Voice-first tutoring interface for mobile learners", roi: "High", icon: "🎙️" },
  "No-Code AI":        { build: "Drag-and-drop AI workflow builder for educators", roi: "Medium", icon: "🔧" },
  "AI-Native SaaS":    { build: "AI-first SaaS boilerplate with Groq integration", roi: "High", icon: "🚀" },
  "Vertical AI":       { build: "Domain-specific AI model fine-tuning pipeline", roi: "High", icon: "📊" },
  "Streaming-First":   { build: "Real-time data pipeline with Kafka + Flink", roi: "Medium", icon: "🌊" },
  "Lakehouse Pattern": { build: "Unified lakehouse architecture starter kit", roi: "Medium", icon: "🏗️" },
  "AI/ML Pipelines":   { build: "Feature store + ML pipeline automation tool", roi: "High", icon: "🔬" },
  "Data Contracts":    { build: "Schema enforcement + data quality monitoring", roi: "Medium", icon: "📋" },
  "B2B EdTech":        { build: "Enterprise LMS with SSO + analytics dashboard", roi: "High", icon: "🏢" },
  "Creator Economy":   { build: "Educator monetization platform with AI tools", roi: "High", icon: "💡" },
};

function getSuggestion(name: string) {
  return BUILD_SUGGESTIONS[name] ?? {
    build: `Build a ${name.toLowerCase()} solution for your target market`,
    roi: "Medium",
    icon: "💡",
  };
}

function computeTrendScore(trend: Trend): number {
  const activity = trend.weekly_activity ?? trend.forecast ?? [];
  const avg = activity.reduce((a, b) => a + b, 0) / Math.max(activity.length, 1);
  const recency = activity[activity.length - 1] ?? 0;
  return Math.round((trend.growth * 0.4 + trend.confidence * 0.3 + avg * 0.2 + recency * 0.1) / 10);
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="h-6 w-16 rounded-full bg-white/10" />
      </div>
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-10 w-24 rounded bg-white/10" />
      <div className="h-2 w-full rounded-full bg-white/10" />
      <div className="flex gap-1 h-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function TrendCard({ trend, index, onSelect, selected }: {
  trend: Trend; index: number; onSelect: () => void; selected: boolean;
}) {
  const activity = trend.weekly_activity ?? trend.forecast ?? [];
  const isRising = trend.growth > 0;
  const isHigh   = trend.growth > 200;
  const isMedium = trend.growth > 100;
  const score    = computeTrendScore(trend);
  const suggestion = getSuggestion(trend.name);

  const badgeClass = isHigh
    ? "bg-[oklch(0.72_0.27_340/0.2)] text-[oklch(0.72_0.27_340)]"
    : isMedium
    ? "bg-[oklch(0.82_0.17_75/0.2)] text-[oklch(0.82_0.17_75)]"
    : "bg-[oklch(0.78_0.2_155/0.2)] text-[oklch(0.78_0.2_155)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onSelect}
      className={`glass tilt-card neon-border relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${selected ? "ring-2 ring-[oklch(0.7_0.24_255/0.6)]" : ""}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl" style={{ background: trend.color }} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-base font-semibold truncate">{trend.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{trend.desc}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}>
          {isHigh ? "HIGH" : isMedium ? "MED" : "LOW"}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <div className="font-display text-3xl font-bold" style={{ color: trend.color, textShadow: `0 0 20px ${trend.color}` }}>
          {isRising ? "+" : ""}{trend.growth}%
        </div>
        {isRising
          ? <ArrowUpRight className="mb-1 h-5 w-5" style={{ color: trend.color }} />
          : <ArrowDownRight className="mb-1 h-5 w-5 text-[oklch(0.72_0.27_340)]" />}
      </div>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Brain className="h-2.5 w-2.5" /> {trend.confidence}% confidence</span>
        <span className="flex items-center gap-1"><Zap className="h-2.5 w-2.5" /> Score {score}/10</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${trend.confidence}%` }}
          transition={{ delay: index * 0.1, duration: 1 }}
          className="h-full rounded-full"
          style={{ background: trend.color, boxShadow: `0 0 8px ${trend.color}` }}
        />
      </div>
      <div className="mt-3">
        <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">7-Day Signal</p>
        <div className="flex h-10 items-end gap-0.5">
          {activity.slice(0, 7).map((val, j) => (
            <div key={j} className="flex-1 rounded-sm" style={{
              height: `${Math.max(4, val)}%`,
              background: `linear-gradient(to top, ${trend.color}, transparent)`,
              opacity: 0.4 + j / 10,
            }} />
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-white/5 px-3 py-2 flex items-start gap-2">
        <span className="text-sm">{suggestion.icon}</span>
        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
          <span className="text-foreground/70 font-medium">Build: </span>{suggestion.build}
        </p>
      </div>
    </motion.div>
  );
}

function SourceCard({ article, index }: { article: TopArticle; index: number }) {
  const urgColor = article.urgency_score >= 8
    ? "oklch(0.72 0.27 340)"
    : article.urgency_score >= 5
    ? "oklch(0.82 0.17 75)"
    : "oklch(0.78 0.2 155)";
  const sourceIcon = article.source?.toLowerCase().includes("reddit") ? "🔴"
    : article.source?.toLowerCase().includes("linkedin") ? "💼"
    : article.source?.toLowerCase().includes("hacker") ? "🟠"
    : "📰";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-white/5 transition-colors"
    >
      <span className="text-lg shrink-0 mt-0.5">{sourceIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground/90 line-clamp-2 leading-snug">{article.title}</p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          {article.source && <span className="font-medium text-[oklch(0.85_0.18_200)]">{article.source}</span>}
          {article.published_date && <span>{article.published_date}</span>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[10px] font-bold rounded-full px-2 py-0.5"
          style={{ background: `${urgColor.replace(")", " / 0.15)")}`, color: urgColor }}>
          {article.urgency_score}/10
        </span>
        {article.link && (
          <a href={article.link} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
function TrendsPage() {
  const { role } = useRole();
  const { trends: trendsResponse, report, loading } = useData();
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  const roleTrends = useMemo(() => {
    const trends = trendsResponse?.trends;
    if (!trends) return [];
    return trends;
  }, [trendsResponse]);

  const roleArticles = useMemo(() => {
    const articles = report?.fresh?.top_articles;
    if (!articles) return [];
    return articles;
  }, [report]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="h-8 w-48 rounded bg-white/10 animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold">Trend Intelligence</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time market signals for {role}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated just now</span>
          </div>
        </div>

        {/* Trend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleTrends.map((trend: Trend, i: number) => (
            <TrendCard
              key={trend.name}
              trend={trend}
              index={i}
              selected={selectedTrend?.name === trend.name}
              onSelect={() => setSelectedTrend(selectedTrend?.name === trend.name ? null : trend)}
            />
          ))}
        </div>
      </div>

      {/* Top Articles Section */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-[oklch(0.85_0.18_200)]" />
          <h3 className="font-display text-lg font-semibold">Top Sources</h3>
        </div>
        <div className="space-y-2">
          {roleArticles.slice(0, 5).map((article: TopArticle, i: number) => (
            <SourceCard key={article.title} article={article} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
