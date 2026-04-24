import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Radar,
  TrendingUp,
  Sparkles,
  Settings,
  Bell,
  Cpu,
  Newspaper,
  Bot,
  Sun,
  Moon,
} from "lucide-react";
import { RoleSelector } from "./RoleSelector";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/reports", label: "Morning Pulse", icon: Newspaper },
  { to: "/dashboard/competitors", label: "Competitor Radar", icon: Radar },
  { to: "/dashboard/trends", label: "Trend Forecast", icon: TrendingUp },
  { to: "/dashboard/recommendations", label: "AI Recommendations", icon: Sparkles },
  { to: "/dashboard/chatbot", label: "AI Chatbot", icon: Bot },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardLayout() {
  const location = useLocation();
  const { role } = useRole();
  const meta = ROLE_META[role];
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10" />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/50 p-4 lg:flex">
          <Link to="/" className="mb-8 flex items-center gap-2.5 px-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_24px_oklch(0.7_0.24_265/0.6)]">
              <Cpu className="h-5 w-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold leading-tight">Campus Cortex</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                AI Intelligence
              </span>
            </div>
          </Link>

          {/* Role badge in sidebar */}
          <div className="mb-4 rounded-xl border px-3 py-2.5" style={{ borderColor: `${meta.color.replace(")", " / 0.3)")}`, background: `${meta.color.replace(")", " / 0.08)")}` }}>
            <div className="flex items-center gap-2">
              <span className="text-base">{meta.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: meta.color }}>{role}</div>
                <div className="text-[10px] text-muted-foreground truncate">{meta.focus.split(",")[0]}</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to ||
                (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-[oklch(0.7_0.24_255/0.18)] to-transparent text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_12px_oklch(0.7_0.24_265)]" />
                  )}
                  <Icon className={`h-4 w-4 transition-colors ${active ? "text-[oklch(0.85_0.18_200)]" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="glass mt-4 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="relative h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.78_0.2_155)]" />
                <span className="absolute inset-0 rounded-full bg-[oklch(0.78_0.2_155)]" />
              </div>
              <span className="text-xs font-medium">AI Engine Online</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">3 sources · Gemini 12-model chain</p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="glass sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border/50 px-4 md:px-6">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <Cpu className="h-5 w-5 text-[oklch(0.85_0.18_200)]" />
              <span className="font-display text-sm font-bold">Campus Cortex</span>
            </Link>

            <div className="ml-auto flex items-center gap-3 md:ml-0 md:flex-1 md:justify-end">
              <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1.5 sm:flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.85_0.18_200)]" />
                  <span className="absolute inset-0 rounded-full bg-[oklch(0.85_0.18_200)]" />
                </span>
                <span className="text-xs font-medium text-[oklch(0.85_0.18_200)]">Live</span>
              </div>

              {/* Global role selector */}
              <RoleSelector />

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-white/5 transition-all hover:bg-white/10"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-[oklch(0.82_0.17_75)]" />
                ) : (
                  <Moon className="h-4 w-4 text-[oklch(0.5_0.24_255)]" />
                )}
              </button>

              <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-white/5 transition-colors hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.27_340)] shadow-[0_0_8px_oklch(0.72_0.27_340)]" />
              </button>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${meta.color}, oklch(0.65 0.28 300))` }}
              >
                {meta.initials}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
