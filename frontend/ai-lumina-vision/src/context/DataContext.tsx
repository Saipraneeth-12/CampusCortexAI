/**
 * DataContext — single shared data store for the entire dashboard.
 * When Morning Pulse refreshes → report + trends + competitors all update.
 */
import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { api, type ReportResponse, type CompetitorResponse, type TrendsResponse } from "@/lib/api";

interface DataState {
  report:      ReportResponse | null;
  competitors: CompetitorResponse | null;
  trends:      TrendsResponse | null;
  loading:     boolean;
  error:       string | null;
  lastSync:    string;
}

interface DataContextType extends DataState {
  refreshAll:         (bustCache?: boolean) => Promise<void>;
  refreshReport:      (bustCache?: boolean) => Promise<void>;
  refreshCompetitors: () => Promise<void>;
  refreshTrends:      () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  report:      null,
  competitors: null,
  trends:      null,
  loading:     false,
  error:       null,
  lastSync:    "",
  refreshAll:         async () => {},
  refreshReport:      async () => {},
  refreshCompetitors: async () => {},
  refreshTrends:      async () => {},
});

export function DataProvider({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const [state, setState] = useState<DataState>({
    report:      null,
    competitors: null,
    trends:      null,
    loading:     false,
    error:       null,
    lastSync:    "",
  });

  const roleRef = useRef(role);
  roleRef.current = role;

  const _now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Refresh all three in parallel
  const refreshAll = useCallback(async (bustCache = false) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      if (bustCache) await api.clearCache();
      const [rep, comp, trnd] = await Promise.all([
        api.getReport(roleRef.current),
        api.getCompetitors(roleRef.current),
        api.getTrends(roleRef.current),
      ]);
      setState({
        report:      rep,
        competitors: comp,
        trends:      trnd,
        loading:     false,
        error:       null,
        lastSync:    _now(),
      });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  // Refresh Morning Pulse + Trends (share same scraped data)
  const refreshReport = useCallback(async (bustCache = false) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      if (bustCache) await api.clearCache();
      const rep  = await api.getReport(roleRef.current);
      const trnd = await api.getTrends(roleRef.current);
      setState(s => ({
        ...s,
        report:   rep,
        trends:   trnd,
        loading:  false,
        error:    null,
        lastSync: _now(),
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  // Refresh only Competitor Radar
  const refreshCompetitors = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const comp = await api.getCompetitors(roleRef.current);
      setState(s => ({
        ...s,
        competitors: comp,
        loading:     false,
        error:       null,
        lastSync:    _now(),
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  // Refresh only Trend Forecast
  const refreshTrends = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const trnd = await api.getTrends(roleRef.current);
      setState(s => ({
        ...s,
        trends:   trnd,
        loading:  false,
        error:    null,
        lastSync: _now(),
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: (e as Error).message }));
    }
  }, []);

  // Initial load on mount / role change
  useEffect(() => {
    setState({
      report: null, competitors: null, trends: null,
      loading: false, error: null, lastSync: "",
    });
    refreshAll();
  }, [role]);

  return (
    <DataContext.Provider
      value={{ ...state, refreshAll, refreshReport, refreshCompetitors, refreshTrends }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
