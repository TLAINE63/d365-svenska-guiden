import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  REPORT_STATS,
  REPORT_UPDATED,
  type ReportStat,
} from "@/data/partnerMarketReport2026";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return REPORT_UPDATED;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

/**
 * Läser rapportens nyckeltal från databasen (redigerbara i admin).
 * Faller tillbaka på de statiska siffrorna så att SSG/SEO alltid har innehåll.
 */
export function useMarketReportStats() {
  const [stats, setStats] = useState<ReportStat[]>(REPORT_STATS);
  const [updated, setUpdated] = useState<string>(REPORT_UPDATED);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("market_report_stats")
        .select("label, value, suffix, note, group_key, sort_order, is_active, updated_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled || error || !data || data.length === 0) return;

      setStats(
        data.map((row) => ({
          label: row.label,
          value: Number(row.value),
          suffix: row.suffix || undefined,
          note: row.note || "",
          group: (row.group_key || "overblick") as ReportStat["group"],
        }))
      );

      const latest = data
        .map((r) => r.updated_at)
        .filter(Boolean)
        .sort()
        .pop();
      if (latest) setUpdated(formatDate(latest as string));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, updated };
}
