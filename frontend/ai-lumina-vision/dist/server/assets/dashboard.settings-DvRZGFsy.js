import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CCute6b2.js";
import { u as useRole, a as ROLES, R as ROLE_META } from "./router-CPi72iO1.js";
import { S as Settings$1, C as Check, B as Bell } from "./settings-g0GiYwrI.js";
import { C as Cpu } from "./cpu-BAwhttxl.js";
import { c as createLucideIcon } from "./createLucideIcon-BfcRJH-_.js";
import { R as RefreshCw } from "./refresh-cw-WrSFsEm1.js";
import { S as Shield } from "./shield-DbFZHnQv.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
function Toggle({
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(!checked), className: `relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[oklch(0.7_0.24_255)]" : "bg-white/10"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}` }) });
}
function Settings() {
  const {
    role,
    setRole
  } = useRole();
  const [saved, setSaved] = reactExports.useState(false);
  const [notifications, setNotifications] = reactExports.useState({
    email: true,
    fresh: true,
    trending: true,
    competitor: true
  });
  const [sources, setSources] = reactExports.useState({
    googleNews: true,
    guardian: true,
    newsdata: true
  });
  const [emailTime, setEmailTime] = reactExports.useState("07:00");
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-[oklch(0.85_0.18_200)]", children: "Configuration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold md:text-4xl flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$1, { className: "h-7 w-7 text-[oklch(0.85_0.18_200)]" }),
        " Settings"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Your Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Controls all intelligence, news queries, and AI analysis across the platform." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5", children: ROLES.map((r) => {
          const m = ROLE_META[r];
          const active = r === role;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRole(r), className: `relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${active ? "border-[oklch(0.7_0.24_255/0.6)] bg-[oklch(0.7_0.24_255/0.1)]" : "border-border/50 bg-white/5 hover:bg-white/10"}`, children: [
            active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.7_0.24_255)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: m.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", style: {
                color: active ? m.color : void 0
              }, children: r }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5 leading-relaxed", children: m.focus.split(",")[0] })
            ] })
          ] }, r);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Data Sources" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
          key: "googleNews",
          label: "Google News RSS",
          desc: "Broad EdTech, AI, SaaS coverage"
        }, {
          key: "guardian",
          label: "The Guardian API",
          desc: "High-quality journalism with summaries"
        }, {
          key: "newsdata",
          label: "NewsData.io API",
          desc: "Rich descriptions, real-time EdTech"
        }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: s.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: sources[s.key], onChange: (v) => setSources((p) => ({
            ...p,
            [s.key]: v
          })) })
        ] }, s.key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Notifications" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [{
          key: "email",
          label: "Daily Email Report",
          desc: "Full HTML report with all 5 role PDFs"
        }, {
          key: "fresh",
          label: "Fresh Article Alerts",
          desc: "Breaking news in the last 48 hours"
        }, {
          key: "trending",
          label: "Trending Story Alerts",
          desc: "High-impact stories from 2–14 days"
        }, {
          key: "competitor",
          label: "Competitor Move Alerts",
          desc: "Immediate alerts on competitor activity"
        }].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: n.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: n.desc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: notifications[n.key], onChange: (v) => setNotifications((p) => ({
            ...p,
            [n.key]: v
          })) })
        ] }, n.key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Email Schedule" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Daily intelligence report sent via Gmail SMTP with role-specific PDF attachments." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Send Time (IST)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", value: emailTime, onChange: (e) => setEmailTime(e.target.value), className: "mt-1.5 w-full rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 p-3 text-xs text-muted-foreground", children: [
            "Sender: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "saipraneethkukunoor45@gmail.com" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "AI Engine" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Google Gemini with 12-model fallback chain. Auto-switches on quota limits." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro-vision"].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-white/5 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", children: m }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-semibold ${i === 0 ? "text-[oklch(0.78_0.2_155)]" : "text-muted-foreground"}`, children: i === 0 ? "Active" : `Fallback ${i}` })
        ] }, m)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass tilt-card neon-border rounded-2xl p-6 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "API Keys & Security" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: [{
          label: "Gemini API Key",
          value: "AIzaSyD7Az9A••••••••"
        }, {
          label: "Guardian API Key",
          value: "03dd05e6-f19d-••••"
        }, {
          label: "NewsData.io Key",
          value: "pub_4c3e2fad••••"
        }].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: k.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-foreground/80", children: k.value })
        ] }, k.label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_oklch(0.7_0.24_265/0.5)] transition-transform hover:scale-[1.02]", children: saved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
      " Saved"
    ] }) : "Save Settings" }) })
  ] });
}
export {
  Settings as component
};
