import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteTrafficWindow {
  pageViews: number;
  uniqueVisitors: number;
}
export interface SiteTrafficPage {
  path: string;
  views: number;
  uniqueVisitors: number;
}
export interface SiteTrafficStats {
  totals: { d7: SiteTrafficWindow; d30: SiteTrafficWindow; d90: SiteTrafficWindow };
  topPages: { d7: SiteTrafficPage[]; d30: SiteTrafficPage[]; d90: SiteTrafficPage[] };
  loading: boolean;
  error: string | null;
}

const empty: SiteTrafficStats = {
  totals: {
    d7: { pageViews: 0, uniqueVisitors: 0 },
    d30: { pageViews: 0, uniqueVisitors: 0 },
    d90: { pageViews: 0, uniqueVisitors: 0 },
  },
  topPages: { d7: [], d30: [], d90: [] },
  loading: true,
  error: null,
};

export function useSiteTrafficStats(token: string | null, enabled: boolean = true) {
  const [stats, setStats] = useState<SiteTrafficStats>(empty);

  useEffect(() => {
    if (!enabled || !token) {
      setStats({ ...empty, loading: false });
      return;
    }
    let cancelled = false;
    setStats((s) => ({ ...s, loading: true, error: null }));

    (async () => {
      const { data, error } = await supabase.functions.invoke("site-traffic-stats", {
        body: { token },
      });
      if (cancelled) return;
      if (error || !data || data.error) {
        setStats({ ...empty, loading: false, error: error?.message || data?.error || "Fel" });
        return;
      }
      setStats({
        totals: data.totals,
        topPages: data.topPages,
        loading: false,
        error: null,
      });
    })().catch((e) => {
      if (!cancelled) setStats({ ...empty, loading: false, error: e.message });
    });

    return () => {
      cancelled = true;
    };
  }, [token, enabled]);

  return stats;
}
