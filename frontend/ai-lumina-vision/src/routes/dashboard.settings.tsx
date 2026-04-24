import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, Bell, Cpu, Globe, Shield, Mail, RefreshCw, Check } from "lucide-react";
import { useRole, ROLES, ROLE_META } from "@/context/RoleContext";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Campus Cortex AI" }] }),
  component: Settings,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[oklch(0.7_0.24_255)]" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function Settings() {
  const { role, setRole } = useRole();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, fresh: true, trending: true, competitor: true });
  const [sources, setSources] = useState({ googleNews: true, guardian: true, newsdata: true });
  const [emailTime, setEmailTime] = useState("07:00");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-[oklch(0.85_0.18_200)]">Configuration</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-[oklch(0.85_0.18_200)]" /> Settings
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Role Selection */}
        <div className="glass tilt-card neon-border rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Your Role</h3>
              <p className="text-xs text-muted-foreground">Controls all intelligence, news queries, and AI analysis across the platform.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {ROLES.map((r) => {
              const m = ROLE_META[r];
              const active = r === role;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${active ? "border-[oklch(0.7_0.24_255/0.6)] bg-[oklch(0.7_0.24_255/0.1)]" : "border-border/50 bg-white/5 hover:bg-white/10"}`}
                >
                  {active && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.7_0.24_255)]">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                  )}
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: active ? m.color : undefined }}>{r}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{m.focus.split(",")[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass tilt-card neon-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">Data Sources</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: "googleNews" as const, label: "Google News RSS", desc: "Broad EdTech, AI, SaaS coverage" },
              { key: "guardian" as const, label: "The Guardian API", desc: "High-quality journalism with summaries" },
              { key: "newsdata" as const, label: "NewsData.io API", desc: "Rich descriptions, real-time EdTech" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <Toggle checked={sources[s.key]} onChange={(v) => setSources((p) => ({ ...p, [s.key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass tilt-card neon-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: "email" as const, label: "Daily Email Report", desc: "Full HTML report with all 5 role PDFs" },
              { key: "fresh" as const, label: "Fresh Article Alerts", desc: "Breaking news in the last 48 hours" },
              { key: "trending" as const, label: "Trending Story Alerts", desc: "High-impact stories from 2–14 days" },
              { key: "competitor" as const, label: "Competitor Move Alerts", desc: "Immediate alerts on competitor activity" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.desc}</div>
                </div>
                <Toggle checked={notifications[n.key]} onChange={(v) => setNotifications((p) => ({ ...p, [n.key]: v }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Email Schedule */}
        <div className="glass tilt-card neon-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">Email Schedule</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Daily intelligence report sent via Gmail SMTP with role-specific PDF attachments.</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Send Time (IST)</label>
              <input
                type="time"
                value={emailTime}
                onChange={(e) => setEmailTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]"
              />
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-xs text-muted-foreground">
              Sender: <span className="text-foreground">saipraneethkukunoor45@gmail.com</span>
            </div>
          </div>
        </div>

        {/* AI Engine */}
        <div className="glass tilt-card neon-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">AI Engine</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Google Gemini with 12-model fallback chain. Auto-switches on quota limits.</p>
          <div className="space-y-2">
            {["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro-vision"].map((m, i) => (
              <div key={m} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span className="text-xs font-mono">{m}</span>
                <span className={`text-[10px] font-semibold ${i === 0 ? "text-[oklch(0.78_0.2_155)]" : "text-muted-foreground"}`}>
                  {i === 0 ? "Active" : `Fallback ${i}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass tilt-card neon-border rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">API Keys & Security</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Gemini API Key", value: "AIzaSyD7Az9A••••••••" },
              { label: "Guardian API Key", value: "03dd05e6-f19d-••••" },
              { label: "NewsData.io Key", value: "pub_4c3e2fad••••" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl bg-white/5 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{k.label}</div>
                <div className="font-mono text-xs text-foreground/80">{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_oklch(0.7_0.24_265/0.5)] transition-transform hover:scale-[1.02]"
        >
          {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
