import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Cpu, Globe, Shield, Mail, RefreshCw, Check, Clock, Loader } from "lucide-react";
import { api } from "@/lib/api";

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
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, fresh: true, trending: true, competitor: true });
  const [sources, setSources] = useState({ googleNews: true, guardian: true, newsdata: true });

  // Email schedule state
  const [emailTime, setEmailTime] = useState("07:00");
  const [emailRecipient, setEmailRecipient] = useState("rithwik140705@gmail.com");
  const [scheduleStatus, setScheduleStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [scheduleMsg, setScheduleMsg] = useState("");

  // Load current schedule from backend on mount
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(r => r.json())
      .catch(() => null);
    // Try to read current config
    fetch("http://localhost:8000/get-email-schedule")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.send_time) setEmailTime(data.send_time);
        if (data?.email) setEmailRecipient(data.email);
      })
      .catch(() => null);
  }, []);

  const handleSaveSchedule = async () => {
    setScheduleStatus("saving");
    setScheduleMsg("");
    try {
      const result = await api.setEmailSchedule(emailTime, emailRecipient);
      setScheduleStatus("saved");
      setScheduleMsg(result.message || `Schedule saved! Email will be sent at ${emailTime} IST.`);
      setTimeout(() => setScheduleStatus("idle"), 4000);
    } catch (e) {
      setScheduleStatus("error");
      setScheduleMsg((e as Error).message || "Failed to save schedule.");
      setTimeout(() => setScheduleStatus("idle"), 4000);
    }
  };

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

        {/* Active Role — read-only display */}
        <div className="glass tilt-card neon-border rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255/0.25)] to-[oklch(0.65_0.28_300/0.25)] text-[oklch(0.85_0.18_200)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Active Role</h3>
              <p className="text-xs text-muted-foreground">All intelligence, news queries, and AI analysis are tailored for this role.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-[oklch(0.7_0.24_255/0.6)] bg-[oklch(0.7_0.24_255/0.08)] px-5 py-4">
            <span className="text-3xl">🏫</span>
            <div>
              <div className="text-base font-semibold text-[oklch(0.7_0.24_255)]">Institute Owner</div>
              <div className="text-xs text-muted-foreground mt-0.5">LMS adoption, student enrollment tech, competitor institutes, school management software</div>
            </div>
            <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.7_0.24_255)]">
              <Check className="h-3.5 w-3.5 text-white" />
            </span>
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
              { key: "email" as const, label: "Daily Email Report", desc: "Full HTML report with role-specific PDF" },
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
          <p className="text-sm text-muted-foreground mb-4">
            Daily intelligence report sent via Gmail SMTP. Set the time and it will auto-send every day.
          </p>
          <div className="space-y-4">
            {/* Time picker */}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Clock className="h-3 w-3" /> Send Time (IST)
              </label>
              <input
                type="time"
                value={emailTime}
                onChange={(e) => { setEmailTime(e.target.value); setScheduleStatus("idle"); }}
                className="w-full rounded-xl border border-border/60 bg-white/5 px-3 py-2.5 text-sm focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]"
              />
            </div>

            {/* Recipient */}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Recipient Email
              </label>
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => { setEmailRecipient(e.target.value); setScheduleStatus("idle"); }}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-border/60 bg-white/5 px-3 py-2.5 text-sm focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]"
              />
            </div>

            {/* Sender info */}
            <div className="rounded-xl bg-white/5 p-3 text-xs text-muted-foreground">
              Sender: <span className="text-foreground">saipraneethkukunoor45@gmail.com</span>
            </div>

            {/* Status message */}
            {scheduleMsg && (
              <div className={`rounded-xl px-3 py-2.5 text-xs font-medium ${
                scheduleStatus === "saved"
                  ? "bg-[oklch(0.78_0.2_155/0.15)] text-[oklch(0.78_0.2_155)] border border-[oklch(0.78_0.2_155/0.3)]"
                  : "bg-[oklch(0.72_0.27_340/0.15)] text-[oklch(0.72_0.27_340)] border border-[oklch(0.72_0.27_340/0.3)]"
              }`}>
                {scheduleStatus === "saved" ? "✅ " : "⚠ "}{scheduleMsg}
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSaveSchedule}
              disabled={scheduleStatus === "saving"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_oklch(0.7_0.24_265/0.4)] transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {scheduleStatus === "saving" ? (
                <><Loader className="h-4 w-4 animate-spin" /> Saving & Sending Confirmation…</>
              ) : scheduleStatus === "saved" ? (
                <><Check className="h-4 w-4" /> Schedule Saved!</>
              ) : (
                <><Clock className="h-4 w-4" /> Save Schedule & Send Confirmation</>
              )}
            </button>
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
            {["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-lite-latest"].map((m, i) => (
              <div key={m} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span className="text-xs font-mono">{m}</span>
                <span className={`text-[10px] font-semibold ${i === 0 ? "text-[oklch(0.78_0.2_155)]" : "text-muted-foreground"}`}>
                  {i === 0 ? "Active" : `Fallback ${i}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
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
