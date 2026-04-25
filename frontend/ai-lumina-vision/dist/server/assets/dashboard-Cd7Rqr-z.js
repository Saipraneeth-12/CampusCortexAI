import { M as useRouter, r as reactExports, T as jsxRuntimeExports, Z as Outlet } from "./worker-entry-CCute6b2.js";
import { u as useRole, R as ROLE_META, a as ROLES, L as Link } from "./router-CPi72iO1.js";
import { C as ChevronDown } from "./chevron-down-B5hsxROY.js";
import { A as AnimatePresence, a as AIChatbot } from "./AIChatbot-CLOjyH1h.js";
import { m as motion } from "./proxy-AGUjS2rb.js";
import { C as Check, S as Settings, B as Bell } from "./settings-g0GiYwrI.js";
import { C as Cpu } from "./cpu-BAwhttxl.js";
import { c as createLucideIcon } from "./createLucideIcon-BfcRJH-_.js";
import { N as Newspaper } from "./newspaper-DiKpjFij.js";
import { R as Radar } from "./radar-Z6EH3j2W.js";
import { T as TrendingUp } from "./trending-up-CSlYU9Ah.js";
import { S as Sparkles } from "./sparkles-C5R8qfhP.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./api-afpyfS2M.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode);
function RoleSelector() {
  const { role, setRole } = useRole();
  const [open, setOpen] = reactExports.useState(false);
  const meta = ROLE_META[role];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "glass flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", style: { color: meta.color }, children: role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-40", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 8, scale: 0.96 },
          transition: { duration: 0.15 },
          className: "glass-strong absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border/60 p-1.5 shadow-[0_20px_60px_oklch(0.05_0.02_265/0.8)]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground", children: "Switch Role" }),
            ROLES.map((r) => {
              const m = ROLE_META[r];
              const active = r === role;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setRole(r);
                    setOpen(false);
                  },
                  className: `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-white/10" : "hover:bg-white/5"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: m.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", style: { color: active ? m.color : void 0 }, children: r }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-muted-foreground", children: m.focus.split(",")[0] })
                    ] }),
                    active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 shrink-0", style: { color: m.color } })
                  ]
                },
                r
              );
            })
          ]
        }
      )
    ] }) })
  ] });
}
const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/reports", label: "Morning Pulse", icon: Newspaper },
  { to: "/dashboard/competitors", label: "Competitor Radar", icon: Radar },
  { to: "/dashboard/trends", label: "Trend Forecast", icon: TrendingUp },
  { to: "/dashboard/recommendations", label: "AI Recommendations", icon: Sparkles },
  { to: "/dashboard/settings", label: "Settings", icon: Settings }
];
function DashboardLayout() {
  const location = useLocation();
  const { role } = useRole();
  const meta = ROLE_META[role];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid-bg pointer-events-none fixed inset-0 -z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/50 p-4 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-8 flex items-center gap-2.5 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_24px_oklch(0.7_0.24_265/0.6)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5 text-white", strokeWidth: 2.4 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold leading-tight", children: "Campus Cortex" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-widest text-muted-foreground", children: "AI Intelligence" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-xl border px-3 py-2.5", style: { borderColor: `${meta.color.replace(")", " / 0.3)")}`, background: `${meta.color.replace(")", " / 0.08)")}` }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: meta.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold truncate", style: { color: meta.color }, children: role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground truncate", children: meta.focus.split(",")[0] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-1 flex-col gap-1", children: navItems.map((item) => {
          const active = location.pathname === item.to || item.to !== "/dashboard" && location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              className: `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${active ? "bg-gradient-to-r from-[oklch(0.7_0.24_255/0.18)] to-transparent text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`,
              children: [
                active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_12px_oklch(0.7_0.24_265)]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 transition-colors ${active ? "text-[oklch(0.85_0.18_200)]" : ""}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
              ]
            },
            item.to
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass mt-4 rounded-xl p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-2 w-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 animate-ping rounded-full bg-[oklch(0.78_0.2_155)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-[oklch(0.78_0.2_155)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "AI Engine Online" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "3 sources · Gemini 12-model chain" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "glass sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/50 px-4 md:px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 lg:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5 text-[oklch(0.85_0.18_200)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold", children: "Campus Cortex" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3 md:ml-0 md:flex-1 md:justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1.5 sm:flex", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 animate-ping rounded-full bg-[oklch(0.85_0.18_200)]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-[oklch(0.85_0.18_200)]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[oklch(0.85_0.18_200)]", children: "Live" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RoleSelector, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-white/5 transition-colors hover:bg-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.27_340)] shadow-[0_0_8px_oklch(0.72_0.27_340)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                style: { background: `linear-gradient(135deg, ${meta.color}, oklch(0.65 0.28 300))` },
                children: meta.initials
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AIChatbot, {})
  ] });
}
const SplitComponent = DashboardLayout;
export {
  SplitComponent as component
};
