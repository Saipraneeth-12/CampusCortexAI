import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Calendar } from "lucide-react";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { InlineChatbot } from "@/components/AIChatbot";

export const Route = createFileRoute("/dashboard/recommendations")({
  head: () => ({ meta: [{ title: "AI Recommendations — Campus Cortex AI" }] }),
  component: Recs,
});

interface Rec {
  urgency: "High" | "Medium" | "Low";
  color: string;
  title: string;
  desc: string;
  tags: string[];
  eta: string;
  day: string;
}

const ROLE_RECS: Record<string, Rec[]> = {
  "Institute Owner": [
    { urgency: "High", color: "oklch(0.72 0.27 340)", title: "Launch AI tutoring pilot in 30 days", desc: "Byju's just shipped AI adaptive learning. Your window to match them is closing fast. A pilot on your top 3 courses will signal market readiness.", tags: ["+34% retention", "94% conf."], eta: "30 days", day: "Days 1–7" },
    { urgency: "High", color: "oklch(0.65 0.27 25)", title: "Integrate Google Classroom API", desc: "Google opened its Classroom API. Institutions now expect seamless integrations. Being in this ecosystem is table stakes for school partnerships.", tags: ["School partnerships", "91% conf."], eta: "21 days", day: "Days 1–14" },
    { urgency: "Medium", color: "oklch(0.82 0.17 75)", title: "Launch hybrid model in 3 tier-2 cities", desc: "Unacademy is expanding offline. Partner with local coaching centers for a hybrid model without capital expenditure.", tags: ["Low capex", "87% conf."], eta: "60 days", day: "Days 15–30" },
    { urgency: "Medium", color: "oklch(0.85 0.18 200)", title: "Add vernacular content for top 2 languages", desc: "Vernacular EdTech is a $2.1B untapped market. Adding Hindi and Tamil content to your top courses could unlock a new growth segment.", tags: ["+$2.1B TAM", "82% conf."], eta: "45 days", day: "Days 15–45" },
    { urgency: "Low", color: "oklch(0.7 0.24 255)", title: "Build parent analytics dashboard", desc: "Parent-facing progress dashboards are a key differentiator for K-12 platforms. Low effort, high retention impact.", tags: ["Retention +18%", "78% conf."], eta: "90 days", day: "Days 45–90" },
    { urgency: "Low", color: "oklch(0.78 0.2 155)", title: "Partner with 2 IITs for co-branded certificates", desc: "Brand authority increases significantly with university co-signs. Coursera's Stanford partnership is proof.", tags: ["Brand +14pts", "73% conf."], eta: "90 days", day: "Days 60–90" },
  ],
  "Backend Developer": [
    { urgency: "High", color: "oklch(0.72 0.27 340)", title: "Benchmark Bun 2.0 for your API services", desc: "Bun 2.0 is production-ready with 40% faster cold starts. If you're not evaluating it, you're falling behind the market.", tags: ["40% faster", "94% conf."], eta: "7 days", day: "Days 1–7" },
    { urgency: "High", color: "oklch(0.65 0.27 25)", title: "Migrate AI inference endpoints to Lambda", desc: "AWS Lambda now supports 10GB memory for AI workloads. Serverless inference reduces your infrastructure complexity and cost.", tags: ["Cost -40%", "91% conf."], eta: "14 days", day: "Days 1–14" },
    { urgency: "Medium", color: "oklch(0.82 0.17 75)", title: "Prototype a Cloudflare Workers AI endpoint", desc: "Edge AI inference is now viable without GPU infrastructure. Build one prototype to understand the latency and cost profile.", tags: ["Sub-10ms", "87% conf."], eta: "21 days", day: "Days 7–21" },
    { urgency: "Medium", color: "oklch(0.85 0.18 200)", title: "Upgrade FastAPI and adopt async patterns", desc: "FastAPI 0.115 ships with improved async background tasks and WebSocket streaming. Upgrade now to stay current.", tags: ["Real-time ready", "82% conf."], eta: "14 days", day: "Days 7–14" },
    { urgency: "Low", color: "oklch(0.7 0.24 255)", title: "Evaluate Hono.js for next greenfield service", desc: "Hono.js surpassed Express in npm downloads. Worth evaluating for your next new service to stay ahead of the ecosystem.", tags: ["Ecosystem momentum", "78% conf."], eta: "30 days", day: "Days 21–30" },
    { urgency: "Low", color: "oklch(0.78 0.2 155)", title: "Write a technical blog on edge AI patterns", desc: "Thought leadership in edge AI will attract opportunities. Document your Cloudflare Workers AI prototype as a case study.", tags: ["Brand authority", "73% conf."], eta: "45 days", day: "Days 30–45" },
  ],
  "Data Engineer": [
    { urgency: "High", color: "oklch(0.72 0.27 340)", title: "Pilot dbt 2.0 streaming on your top pipeline", desc: "dbt 2.0 eliminates the need for Flink/Spark Streaming for many use cases. Pilot it on your highest-latency pipeline this week.", tags: ["Simplify stack", "95% conf."], eta: "14 days", day: "Days 1–14" },
    { urgency: "High", color: "oklch(0.65 0.27 25)", title: "Plan Iceberg migration for top 3 data domains", desc: "Iceberg adoption tripled in enterprise. If your data lake isn't on Iceberg, you're accumulating technical debt.", tags: ["Industry standard", "93% conf."], eta: "30 days", day: "Days 1–30" },
    { urgency: "Medium", color: "oklch(0.82 0.17 75)", title: "Test Snowflake Cortex for ML scoring pipelines", desc: "In-warehouse ML inference eliminates separate feature stores for many use cases. Test it on your top 3 ML scoring jobs.", tags: ["Reduce infra", "87% conf."], eta: "21 days", day: "Days 7–21" },
    { urgency: "Medium", color: "oklch(0.85 0.18 200)", title: "Upgrade Kafka to 4.0 — remove ZooKeeper", desc: "Kafka 4.0 removes ZooKeeper entirely. This is a significant ops simplification — plan the upgrade in your next sprint.", tags: ["Ops simplification", "84% conf."], eta: "21 days", day: "Days 14–21" },
    { urgency: "Low", color: "oklch(0.7 0.24 255)", title: "Evaluate Databricks Lakehouse for consolidation", desc: "Databricks + MosaicML is becoming the all-in-one AI + data platform. Evaluate if it can replace 2+ tools in your stack.", tags: ["Tool consolidation", "81% conf."], eta: "45 days", day: "Days 30–45" },
    { urgency: "Low", color: "oklch(0.78 0.2 155)", title: "Implement data contracts for top 5 pipelines", desc: "Data contracts are becoming standard for data quality. Implement them on your most critical pipelines first.", tags: ["Data quality", "78% conf."], eta: "60 days", day: "Days 45–60" },
  ],
  "Founder / Entrepreneur": [
    { urgency: "High", color: "oklch(0.72 0.27 340)", title: "Prepare Series A deck with AI tutoring narrative", desc: "VCs funded $12M in AI tutoring this week alone. Your fundraising narrative needs AI differentiation as the core story.", tags: ["+$12M funded", "96% conf."], eta: "14 days", day: "Days 1–14" },
    { urgency: "High", color: "oklch(0.65 0.27 25)", title: "Launch enterprise B2B sales motion", desc: "B2B learning platform ARR grew 67% in Q1 2026. Enterprise is the fastest-growing segment — you need a dedicated sales motion.", tags: ["67% ARR growth", "92% conf."], eta: "21 days", day: "Days 1–21" },
    { urgency: "Medium", color: "oklch(0.82 0.17 75)", title: "Validate vernacular content demand in 2 weeks", desc: "The vernacular EdTech market is $2.1B and largely untapped. A 2-week landing page test in Hindi and Tamil will validate demand.", tags: ["$2.1B TAM", "89% conf."], eta: "14 days", day: "Days 7–21" },
    { urgency: "Medium", color: "oklch(0.85 0.18 200)", title: "Define your acquisition value proposition", desc: "Coursera acquired Rhyme for $45M. M&A activity is accelerating. Know your acquisition story before someone else defines it.", tags: ["M&A ready", "84% conf."], eta: "30 days", day: "Days 14–30" },
    { urgency: "Low", color: "oklch(0.7 0.24 255)", title: "Assess SEA market entry feasibility", desc: "upGrad raised $60M for SEA expansion. Your window to enter before they establish dominance is 6–12 months.", tags: ["SEA opportunity", "81% conf."], eta: "30 days", day: "Days 21–30" },
    { urgency: "Low", color: "oklch(0.78 0.2 155)", title: "Build a streak retention mechanic", desc: "Duolingo's streak drives 28% higher retention. A domain-specific habit loop could be your key retention differentiator.", tags: ["+28% retention", "78% conf."], eta: "45 days", day: "Days 30–45" },
  ],
  "Product Builder": [
    { urgency: "High", color: "oklch(0.72 0.27 340)", title: "Define and ship AI agent feature roadmap", desc: "Notion AI 3.0 ships autonomous agents. AI-native features are now table stakes. Define your roadmap and ship a beta in 45 days.", tags: ["Table stakes", "97% conf."], eta: "45 days", day: "Days 1–14" },
    { urgency: "High", color: "oklch(0.65 0.27 25)", title: "A/B test a streak retention mechanic", desc: "Duolingo's streak drives 28% higher 30-day retention. Test a habit-loop mechanic in your onboarding flow this sprint.", tags: ["+28% retention", "93% conf."], eta: "14 days", day: "Days 1–14" },
    { urgency: "Medium", color: "oklch(0.82 0.17 75)", title: "Build AI-assisted issue triage feature", desc: "Linear's AI triage auto-assigns and prioritizes issues. Identify your top 3 workflow automation opportunities and build one.", tags: ["Workflow automation", "89% conf."], eta: "21 days", day: "Days 7–21" },
    { urgency: "Medium", color: "oklch(0.85 0.18 200)", title: "Run a Figma AI sprint for next feature", desc: "Figma AI generates complete component libraries from text briefs. Use it for your next feature to measure velocity gains.", tags: ["2x velocity", "87% conf."], eta: "7 days", day: "Days 1–7" },
    { urgency: "Low", color: "oklch(0.7 0.24 255)", title: "Sharpen power-user positioning vs no-code", desc: "Bubble raised $100M. No-code is eating the low-end. Audit your product's complexity and sharpen your power-user story.", tags: ["Differentiation", "82% conf."], eta: "30 days", day: "Days 21–30" },
    { urgency: "Low", color: "oklch(0.78 0.2 155)", title: "Prototype voice-first interface for mobile", desc: "Voice-first UX is trending in mobile EdTech. A prototype will tell you if your users are ready for it.", tags: ["UX trend", "78% conf."], eta: "45 days", day: "Days 30–45" },
  ],
};

function Recs() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const recs = ROLE_RECS[role] ?? ROLE_RECS["Institute Owner"];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.25em]" style={{ color: meta.color }}>
          {meta.icon} {role} · Strategic AI
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">AI Recommendations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ranked by urgency × impact × confidence — role-specific to you.</p>
      </header>

      {/* 7-day action plan */}
      <div className="glass neon-border rounded-2xl p-5">
        <h3 className="font-display text-lg font-semibold mb-4">7-Day Action Plan</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recs.slice(0, 6).map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ background: r.color }}>
                {i + 1}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />{r.day}
                </div>
                <p className="text-xs font-medium mt-0.5 leading-snug">{r.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {recs.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass tilt-card neon-border relative overflow-hidden rounded-2xl p-6"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-40 blur-3xl" style={{ background: r.color }} />
            <div className="flex items-start justify-between">
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: `${r.color.replace(")", " / 0.15)")}`, color: r.color, borderColor: `${r.color.replace(")", " / 0.4)")}` }}
              >
                <Sparkles className="h-3 w-3" /> {r.urgency} urgency
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {r.eta}
              </div>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold">
                    {t}
                  </span>
                ))}
              </div>
              <button className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.85_0.18_200)] hover:text-[oklch(0.7_0.24_255)]">
                Apply now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Advisor — grounded in live report data */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[oklch(0.85_0.18_200)] shadow-[0_0_6px_oklch(0.85_0.18_200)]" />
          <h2 className="font-display text-lg font-semibold">AI Market Advisor</h2>
          <span className="rounded-full bg-[oklch(0.7_0.24_255/0.15)] px-2.5 py-0.5 text-[10px] font-bold text-[oklch(0.85_0.18_200)]">
            Powered by Gemini · Live Report
          </span>
        </div>
        <InlineChatbot />
      </div>
    </div>
  );
}
