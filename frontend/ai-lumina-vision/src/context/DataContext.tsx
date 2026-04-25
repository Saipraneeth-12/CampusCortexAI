/**
 * DataContext — single shared data store for the entire dashboard.
 *
 * FETCH POLICY:
 * - Data is cached in sessionStorage per role.
 * - On mount / role change: serve from cache instantly, NO network call.
 * - Network fetch only happens when:
 *   1. Cache is empty for that role (first visit ever).
 *   2. User explicitly clicks a Refresh button (bustCache = true).
 * - Competitors and action-plan are fetched lazily (only when their page is visited).
 */
import {
  createContext, useContext, useState, useCallback, useRef, useEffect,
} from "react";
import {
  api,
  type ReportResponse,
  type CompetitorResponse,
  type TrendsResponse,
  type ActionPlanResponse,
  type CompetitorSummary,
} from "@/lib/api";

// ── Cache helpers ─────────────────────────────────────────────────────────────

function cacheKey(role: string, kind: string) {
  return `mp_cache_${kind}_${role}`;
}

function readCache<T>(role: string, kind: string): T | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(role, kind));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache<T>(role: string, kind: string, data: T) {
  try {
    sessionStorage.setItem(cacheKey(role, kind), JSON.stringify(data));
  } catch {
    // sessionStorage full — ignore
  }
}

function clearRoleCache(role: string) {
  ["report", "competitors", "trends", "actionPlan", "competitorSummary"].forEach((k) => {
    sessionStorage.removeItem(cacheKey(role, k));
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DataState {
  report:             ReportResponse | null;
  competitors:        CompetitorResponse | null;
  trends:             TrendsResponse | null;
  actionPlan:         ActionPlanResponse | null;
  competitorSummary:  CompetitorSummary | null;
  loading:            boolean;
  competitorsLoading: boolean;
  error:              string | null;
  lastSync:           string;
}

interface DataContextType extends DataState {
  /** Refresh Morning Pulse report + trends. Pass true to bust cache. */
  refreshReport:      (bustCache?: boolean) => Promise<void>;
  /** Refresh Competitor Radar. Pass true to bust cache. */
  refreshCompetitors: (bustCache?: boolean) => Promise<void>;
  /** Fetch action plan (lazy — only called from recommendations page). */
  ensureActionPlan:   () => Promise<void>;
  /** Fetch competitor summary (lazy — only called from competitors page). */
  ensureCompetitorSummary: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  report: null, competitors: null, trends: null,
  actionPlan: null, competitorSummary: null,
  loading: false, competitorsLoading: false, error: null, lastSync: "",
  refreshReport:           async () => {},
  refreshCompetitors:      async () => {},
  ensureActionPlan:        async () => {},
  ensureCompetitorSummary: async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function DataProvider({ children, role }: { children: React.ReactNode; role: string }) {
  const [state, setState] = useState<DataState>(() => ({
    // Hydrate from sessionStorage immediately — no flash of empty state
    report:            readCache<ReportResponse>(role, "report"),
    competitors:       readCache<CompetitorResponse>(role, "competitors"),
    trends:            readCache<TrendsResponse>(role, "trends"),
    actionPlan:        readCache<ActionPlanResponse>(role, "actionPlan"),
    competitorSummary: readCache<CompetitorSummary>(role, "competitorSummary"),
    loading:           false,
    competitorsLoading: false,
    error:             null,
    lastSync:          "",
  }));

  const roleRef = useRef(role);
  roleRef.current = role;

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── Refresh Morning Pulse report + trends ──────────────────────────────────
  const refreshReport = useCallback(async (bustCache = false) => {
    const r = roleRef.current;
    if (bustCache) clearRoleCache(r);

    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [rep, trnd] = await Promise.all([
        api.getReport(r),
        api.getTrends(r),
      ]);
      writeCache(r, "report", rep);
      writeCache(r, "trends", trnd);
      // Invalidate derived caches so they re-generate from new data
      sessionStorage.removeItem(cacheKey(r, "actionPlan"));
      setState(s => ({
        ...s,
        report: rep, trends: trnd,
        actionPlan: null,   // force re-fetch on next visit
        loading: false, error: null, lastSync: now(),
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  // ── Refresh Competitor Radar ───────────────────────────────────────────────
  const refreshCompetitors = useCallback(async (bustCache = false) => {
    const r = roleRef.current;
    if (bustCache) {
      sessionStorage.removeItem(cacheKey(r, "competitors"));
      sessionStorage.removeItem(cacheKey(r, "competitorSummary"));
    }

    setState(s => ({ ...s, competitorsLoading: true, error: null }));
    try {
      const comp = await api.getCompetitors(r);
      writeCache(r, "competitors", comp);
      sessionStorage.removeItem(cacheKey(r, "competitorSummary")); // invalidate summary
      setState(s => ({
        ...s,
        competitors: comp,
        competitorSummary: null,  // force re-fetch
        competitorsLoading: false, error: null, lastSync: now(),
      }));
    } catch (e) {
      setState(s => ({ ...s, competitorsLoading: false, error: (e as Error).message }));
    }
  }, []);

  // ── Lazy: action plan (only fetched when recommendations page opens) ────────
  const ensureActionPlan = useCallback(async () => {
    const r = roleRef.current;
    // Already have it — skip
    if (readCache<ActionPlanResponse>(r, "actionPlan")) {
      const cached = readCache<ActionPlanResponse>(r, "actionPlan");
      if (cached) {
        setState(s => ({ ...s, actionPlan: cached }));
        return;
      }
    }
    if (state.actionPlan) return;

    try {
      const plan = await api.getActionPlan(r);
      writeCache(r, "actionPlan", plan);
      setState(s => ({ ...s, actionPlan: plan }));
    } catch {
      // silently fail — page will show fallback
    }
  }, [state.actionPlan]);

  // ── Lazy: competitor summary (only fetched when competitors page opens) ─────
  const ensureCompetitorSummary = useCallback(async () => {
    const r = roleRef.current;
    const cached = readCache<CompetitorSummary>(r, "competitorSummary");
    if (cached) {
      setState(s => ({ ...s, competitorSummary: cached }));
      return;
    }
    if (state.competitorSummary) return;

    try {
      const summary = await api.getCompetitorSummary(r);
      writeCache(r, "competitorSummary", summary);
      setState(s => ({ ...s, competitorSummary: summary }));
    } catch {
      // silently fail
    }
  }, [state.competitorSummary]);

  // ── On role change: load from cache, fetch only if cache is empty ──────────
  useEffect(() => {
    const r = role;
    const cachedReport     = readCache<ReportResponse>(r, "report");
    const cachedTrends     = readCache<TrendsResponse>(r, "trends");
    const cachedComp       = readCache<CompetitorResponse>(r, "competitors");
    const cachedPlan       = readCache<ActionPlanResponse>(r, "actionPlan");
    const cachedSummary    = readCache<CompetitorSummary>(r, "competitorSummary");

    // Restore from cache immediately
    setState({
      report:            cachedReport,
      competitors:       cachedComp,
      trends:            cachedTrends,
      actionPlan:        cachedPlan,
      competitorSummary: cachedSummary,
      loading:           !cachedReport,   // show loading only if no cache
      competitorsLoading: false,
      error:             null,
      lastSync:          cachedReport ? "cached" : "",
    });

    // Only fetch from network if cache is empty
    if (!cachedReport) {
      (async () => {
        try {
          const [rep, trnd] = await Promise.all([
            api.getReport(r),
            api.getTrends(r),
          ]);
          writeCache(r, "report", rep);
          writeCache(r, "trends", trnd);
          setState(s => ({
            ...s,
            report: rep, trends: trnd,
            loading: false, error: null, lastSync: now(),
          }));
        } catch (e) {
          setState(s => ({ ...s, loading: false, error: (e as Error).message }));
        }
      })();
    }
  }, [role]);

  return (
    <DataContext.Provider value={{
      ...state,
      refreshReport,
      refreshCompetitors,
      ensureActionPlan,
      ensureCompetitorSummary,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
