// Campus Cortex AI — API client aligned with FastAPI backend

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

// ── Types matching backend response shapes ────────────────────────────────────

export interface TopArticle {
  title: string;
  short_summary: string;
  what_happened: string;
  why_it_matters: string;
  target_roles_impacted: string[];
  opportunity_level: "High" | "Medium" | "Low";
  recommended_action: string;
  urgency_score: number;
  link: string;
  source: string;
  published_date: string;
}

export interface IntelBlock {
  daily_brief: string;
  top_articles: TopArticle[];
  top_trends: string[];
  growth_opportunities: string[];
  threats: string[];
  missed_opportunities: string[];
  strategic_moves: string[];
  tools_to_watch: string[];
  hiring_signals: string[];
}

export interface ReportResponse {
  fresh: IntelBlock;
  trending: IntelBlock;
  daily_brief: string;
  top_trends: string[];
  growth_opportunities: string[];
  threats: string[];
  missed_opportunities: string[];
  strategic_moves: string[];
  tools_to_watch: string[];
  hiring_signals: string[];
  _cached_at?: string;  // e.g. "09:42, Apr 25"
}

export interface CompetitorAlert {
  competitor: string;
  move: string;
  move_type: string;
  threat_to_role: string;
  urgency: number;
  counter_actions: string[];
  opportunity: string;
  source_title: string;
  source_link: string;
  source_date: string;
  threat_level: "High" | "Medium" | "Low";
  category: string;
  _age_hrs: number;
}

export interface CompetitorResponse {
  fresh: CompetitorAlert[];
  trending: CompetitorAlert[];
  total: number;
}

export interface ChatMessage {
  role: string;
  message: string;
  history: { role: string; content: string }[];
  competitors?: Record<string, unknown>;
}

export interface Trend {
  name: string;
  growth: number;
  confidence: number;
  color: string;
  desc: string;
  weekly_activity: number[];  // 7 values: Mon–Sun
  forecast: number[];         // alias for weekly_activity (backward compat)
}

export interface TrendsResponse {
  trends: Trend[];
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string };
    throw new Error(err.detail ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getReport: (role: string) =>
    apiFetch<ReportResponse>(`/report?role=${encodeURIComponent(role)}`),

  getCompetitors: (role: string) =>
    apiFetch<CompetitorResponse>(`/competitor-alerts?role=${encodeURIComponent(role)}`),

  getTrends: (role: string) =>
    apiFetch<TrendsResponse>(`/trends?role=${encodeURIComponent(role)}`),

  downloadReport: (role: string) =>
    `${API_BASE}/download-report?role=${encodeURIComponent(role)}`,

  clearCache: () =>
    apiFetch<{ status: string }>("/cache", { method: "DELETE" }),

  health: () =>
    apiFetch<{ status: string; cached_roles: string[] }>("/health"),

  chat: (body: ChatMessage) =>
    apiFetch<{ reply: string }>("/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  sendEmail: (role: string, recipient: string) =>
    apiFetch<{ status: string; recipient: string }>("/send-email", {
      method: "POST",
      body: JSON.stringify({ role, recipient }),
    }),

  setScheduledRole: (role: string, recipient: string) =>
    apiFetch<{ status: string; role: string; email: string }>("/set-scheduled-role", {
      method: "POST",
      body: JSON.stringify({ role, recipient }),
    }),

  sendWhatsApp: (role: string, to: string) =>
    apiFetch<{ status: string; sid: string; to: string }>("/send-whatsapp", {
      method: "POST",
      body: JSON.stringify({ role, to }),
    }),
};
