import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Radar, Newspaper, Zap, Brain, MessageSquare } from "lucide-react";
import { HeroGlobe } from "@/components/HeroGlobe";
import { ParticleBackground } from "@/components/ParticleBackground";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus Cortex AI — Morning Pulse Market Intelligence" },
      { name: "description", content: "Autonomous real-time market intelligence for EdTech professionals. Powered by Groq AI, 3 live news sources, and role-specific AI analysis." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative overflow-x-hidden">
      <ParticleBackground />
      <div className="grid-bg pointer-events-none fixed inset-0 -z-20" />

      <Navbar />

      {/* HERO */}
      <section className="relative px-4 pt-20 md:pt-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Your Daily
              <br />
              <span className="relative inline-block">
                <span className="gradient-text">Market Pulse</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]"
                />
              </span>
              <br />
              Delivered by AI
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Campus Cortex AI scrapes live news from 3 sources, processes it through Groq AI, and delivers a personalized daily intelligence report — customized to your professional role.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_oklch(0.7_0.24_265/0.5)] transition-transform hover:scale-[1.02]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Open Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                { v: 3, suffix: " sources", label: "Live news feeds" },
                { v: 2, suffix: " models", label: "Groq fallback chain" },
                { v: 5, suffix: " roles", label: "Role-specific AI" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold gradient-text-cyan md:text-3xl">
                    <AnimatedCounter value={s.v} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <HeroGlobe />
            <FloatingChip className="left-2 top-8" delay={0.8} icon={<Zap className="h-3.5 w-3.5" />} label="48h fresh news" color="cyan" />
            <FloatingChip className="right-4 top-32" delay={1.0} icon={<Radar className="h-3.5 w-3.5" />} label="10 competitors" color="purple" />
            <FloatingChip className="bottom-24 left-6" delay={1.2} icon={<Sparkles className="h-3.5 w-3.5" />} label="Groq AI 94%" color="blue" />
            <FloatingChip className="bottom-12 right-8" delay={1.4} icon={<MessageSquare className="h-3.5 w-3.5" />} label="AI Chatbot" color="cyan" />
          </motion.div>
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Personalized for 5 professional roles
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: "🏫", label: "Institute Owner" },
            { icon: "⚙️", label: "Backend Developer" },
            { icon: "📊", label: "Data Engineer" },
            { icon: "🚀", label: "Founder / Entrepreneur" },
            { icon: "🛠️", label: "Product Builder" },
          ].map((r) => (
            <div key={r.label} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-32 max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.85_0.18_200)]">
            One Platform · Five Engines
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Your <span className="gradient-text">AI intelligence</span> command center
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five AI engines work in parallel — surfacing what matters before your competitors even notice.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass tilt-card neon-border group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-transparent blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)] ring-1 ring-white/10">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto my-32 max-w-5xl px-4">
        <div className="glass-strong neon-border relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.65_0.28_300/0.25),transparent_60%)]" />
          <h3 className="relative font-display text-3xl font-bold md:text-5xl">
            Ready for your morning pulse?
          </h3>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Select your role, get your personalized intelligence report, and stay ahead of the market — every single day.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_oklch(0.7_0.24_265/0.5)]"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8C7.8 8 6 9.8 6 12c0 1.2.5 2.3 1.3 3C6.5 15.7 6 16.8 6 18c0 2.2 1.8 4 4 4h1v1.5a1.5 1.5 0 003 0V22h4v1.5a1.5 1.5 0 003 0V22h1c2.2 0 4-1.8 4-4 0-1.2-.5-2.3-1.3-3 .8-.7 1.3-1.8 1.3-3 0-2.2-1.8-4-4-4-.4 0-.8.1-1.2.2C20.1 6.9 18.2 6 16 6s-4.1.9-4.8 2.2C10.8 8.1 10.4 8 10 8z" fill="oklch(0.85 0.18 200)" fillOpacity="0.8"/>
              <path d="M8 16h3l1.5-3 2 6 1.5-4.5 1 2.5 1-1.5H24" stroke="oklch(0.85 0.18 200)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>© 2026 Campus Cortex AI — Morning Pulse Market Intelligence Engine.</span>
          </div>
          <div className="flex gap-5">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Navbar() {
  return (
    <header className="glass fixed left-1/2 top-4 z-50 flex h-14 w-[min(92%,1100px)] -translate-x-1/2 items-center justify-between rounded-2xl border border-border/60 px-4 md:px-6">
      <Link to="/" className="flex items-center gap-2.5">
        {/* Realistic Campus Cortex AI logo — brain with pulse signal */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_20px_oklch(0.7_0.24_265/0.6)]">
          <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
            {/* Brain outline */}
            <path d="M10 8C7.8 8 6 9.8 6 12c0 1.2.5 2.3 1.3 3C6.5 15.7 6 16.8 6 18c0 2.2 1.8 4 4 4h1v1.5a1.5 1.5 0 003 0V22h4v1.5a1.5 1.5 0 003 0V22h1c2.2 0 4-1.8 4-4 0-1.2-.5-2.3-1.3-3 .8-.7 1.3-1.8 1.3-3 0-2.2-1.8-4-4-4-.4 0-.8.1-1.2.2C20.1 6.9 18.2 6 16 6s-4.1.9-4.8 2.2C10.8 8.1 10.4 8 10 8z" fill="white" fillOpacity="0.9"/>
            {/* Pulse line through brain */}
            <path d="M8 16h3l1.5-3 2 6 1.5-4.5 1 2.5 1-1.5H24" stroke="oklch(0.85 0.18 200)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="font-display text-sm font-bold leading-none">
          Campus Cortex <span className="text-muted-foreground">AI</span>
        </div>
      </Link>

      {/* No nav links — clean minimal navbar */}
      <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
        <span className="flex items-center gap-1.5 rounded-full bg-[oklch(0.78_0.2_155/0.15)] px-2.5 py-1 text-[oklch(0.78_0.2_155)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.2_155)] animate-pulse" />
          Live Intelligence
        </span>
      </div>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_18px_oklch(0.7_0.24_265/0.5)] transition-transform hover:scale-[1.03]"
      >
        Launch <ArrowRight className="h-3 w-3" />
      </Link>
    </header>
  );
}

function FloatingChip({ className, icon, label, delay = 0, color }: {
  className?: string; icon: ReactNode; label: string; delay?: number; color: "cyan" | "purple" | "blue";
}) {
  const colors = {
    cyan: "text-[oklch(0.85_0.18_200)] shadow-[0_0_20px_oklch(0.85_0.18_200/0.4)]",
    purple: "text-[oklch(0.72_0.27_340)] shadow-[0_0_20px_oklch(0.72_0.27_340/0.4)]",
    blue: "text-[oklch(0.7_0.24_255)] shadow-[0_0_20px_oklch(0.7_0.24_255/0.4)]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`glass-strong absolute hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold animate-float md:inline-flex ${colors[color]} ${className ?? ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {icon}
      {label}
    </motion.div>
  );
}

const features = [
  { icon: Newspaper, title: "Morning Pulse Report", desc: "Daily AI-generated intelligence split into 48h fresh news and 2–14d trending stories, with urgency scores and recommended actions." },
  { icon: Radar, title: "Competitor Radar", desc: "Track 10 EdTech competitors — Byju's, Coursera, Duolingo, and more — with AI-generated counter-strategies for your role." },
  { icon: TrendingUp, title: "Trend Forecast", desc: "Real-time demand projections for your role's key signals, powered by Groq AI with confidence scores." },
  { icon: Brain, title: "AI Recommendations", desc: "Strategic next moves ranked by urgency × impact × confidence, with a 7-day action plan tailored to your role." },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Ask anything about today's market intelligence, competitor moves, or trends — your AI assistant knows your role." },
  { icon: Zap, title: "PDF Intelligence Report", desc: "Download a premium 8-section PDF with executive summary, priority articles, growth opportunities, and market signals dashboard." },
];
