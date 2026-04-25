import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CCute6b2.js";
import { u as useRole, R as ROLE_META } from "./router-CPi72iO1.js";
import { a as api } from "./api-afpyfS2M.js";
import { R as Radar } from "./radar-Z6EH3j2W.js";
import { R as RefreshCw } from "./refresh-cw-WrSFsEm1.js";
import { Z as Zap } from "./zap-hn3oVglO.js";
import { c as createLucideIcon } from "./createLucideIcon-BfcRJH-_.js";
import { m as motion } from "./proxy-AGUjS2rb.js";
import { C as Clock } from "./clock-Bqxg8qxN.js";
import { C as ChevronDown } from "./chevron-down-B5hsxROY.js";
import { S as Shield } from "./shield-DbFZHnQv.js";
import { A as ArrowRight } from "./arrow-right-C2mgwYlt.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$3 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
      key: "1slcih"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
const THREAT_COLORS = {
  High: "oklch(0.72 0.27 340)",
  Medium: "oklch(0.82 0.17 75)",
  Low: "oklch(0.78 0.2 155)"
};
const COMP_COLORS = {
  "Byju's": "oklch(0.7 0.24 255)",
  "Unacademy": "oklch(0.72 0.27 340)",
  "Coursera": "oklch(0.85 0.18 200)",
  "upGrad": "oklch(0.82 0.17 75)",
  "Google Classroom": "oklch(0.78 0.2 155)",
  "Khan Academy": "oklch(0.65 0.28 300)",
  "Duolingo": "oklch(0.7 0.24 255)",
  "Chegg": "oklch(0.72 0.27 340)",
  "Vedantu": "oklch(0.85 0.18 200)",
  "PhysicsWallah": "oklch(0.82 0.17 75)"
};
function getColor(name) {
  return COMP_COLORS[name] ?? "oklch(0.7 0.24 255)";
}
function CompetitorCard({
  alert,
  index
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const color = getColor(alert.competitor);
  const urgColor = alert.urgency >= 8 ? "oklch(0.72 0.27 340)" : alert.urgency >= 5 ? "oklch(0.82 0.17 75)" : "oklch(0.78 0.2 155)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 16
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    delay: index * 0.06
  }, className: "glass neon-border relative overflow-hidden rounded-2xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl", style: {
      background: color
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white", style: {
          background: color,
          boxShadow: `0 0 18px ${color}`
        }, children: alert.competitor.slice(0, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold", children: alert.competitor }),
            alert.move_type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground", children: alert.move_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full px-2 py-0.5 text-[10px] font-bold", style: {
              background: `${urgColor.replace(")", " / 0.15)")}`,
              color: urgColor
            }, children: [
              "Urgency ",
              alert.urgency,
              "/10"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5", children: [
            alert.source_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
              alert.source_date
            ] }),
            alert.threat_level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
              color: THREAT_COLORS[alert.threat_level]
            }, children: [
              alert.threat_level,
              " Threat"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        alert.source_link && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: alert.source_link, target: "_blank", rel: "noopener noreferrer", className: "grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpanded((e) => !e), className: "grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-foreground/80", children: alert.move }),
    alert.source_title && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[10px] text-muted-foreground line-clamp-1", children: [
      "Source: ",
      alert.source_title
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      height: 0
    }, animate: {
      opacity: 1,
      height: "auto"
    }, className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-[oklch(0.72_0.27_340/0.1)] p-3 border border-[oklch(0.72_0.27_340/0.2)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[oklch(0.72_0.27_340)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-[oklch(0.72_0.27_340)]", children: "Threat to You" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: alert.threat_to_role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-[oklch(0.78_0.2_155/0.1)] p-3 border border-[oklch(0.78_0.2_155/0.2)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5 text-[oklch(0.78_0.2_155)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-[oklch(0.78_0.2_155)]", children: "Your Opportunity" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: alert.opportunity })
        ] })
      ] }),
      alert.counter_actions?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-[oklch(0.85_0.18_200)] mb-2", children: "Counter-Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: alert.counter_actions.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-xs text-foreground/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 mt-0.5 shrink-0 text-[oklch(0.85_0.18_200)]" }),
          action
        ] }, i)) })
      ] })
    ] })
  ] });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 space-y-3 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-32 rounded bg-white/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-24 rounded bg-white/10" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded bg-white/10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-2/3 rounded bg-white/10" })
  ] });
}
function Competitors() {
  const {
    role
  } = useRole();
  const meta = ROLE_META[role];
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getCompetitors(role);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchData();
  }, [role]);
  const fresh = data?.fresh ?? [];
  const trending = data?.trending ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-[0.25em]", style: {
          color: meta.color
        }, children: [
          meta.icon,
          " ",
          role,
          " · Intelligence"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold md:text-4xl", children: "Competitor Radar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: loading ? "Scanning 10 competitors…" : `${data?.total ?? 0} competitor moves detected · AI-generated counter-strategies` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "h-3.5 w-3.5 text-[oklch(0.7_0.24_255)] animate-spin-slow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10 competitors monitored" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: fetchData, disabled: loading, className: "glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }),
          "Refresh"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl border border-[oklch(0.72_0.27_340/0.4)] p-4 text-sm text-[oklch(0.72_0.27_340)]", children: [
      "⚠ ",
      error,
      " — Make sure the backend is running on port 8000."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-[oklch(0.7_0.24_255/0.15)] px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-[oklch(0.85_0.18_200)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold", children: "Last 48 Hours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[oklch(0.7_0.24_255/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.85_0.18_200)]", children: loading ? "…" : fresh.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Fresh competitor moves" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: loading ? [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) : fresh.length > 0 ? fresh.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompetitorCard, { alert: a, index: i }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "No fresh competitor moves in the last 48 hours." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-[oklch(0.72_0.27_340/0.15)] px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-[oklch(0.72_0.27_340)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold", children: "Still Trending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[oklch(0.72_0.27_340/0.3)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.72_0.27_340)]", children: loading ? "…" : trending.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Older moves still shaping the market" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: loading ? [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) : trending.length > 0 ? trending.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CompetitorCard, { alert: a, index: i }, i)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "No trending competitor moves found." }) })
    ] })
  ] });
}
export {
  Competitors as component
};
