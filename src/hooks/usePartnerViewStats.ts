import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PartnerViewStats {
  cardClicks30d: number;
  cardClicks90d: number;
  profileVisits30d: number;
  profileVisits90d: number;
  websiteClicks30d: number;
  websiteClicks90d: number;
  topSourcesCardClicks: { source: string; count: number }[];
  topSourcesProfileVisits: { source: string; count: number }[];
  topSourcesWebsiteClicks: { source: string; count: number }[];
  loading: boolean;
}

const empty: PartnerViewStats = {
  cardClicks30d: 0,
  cardClicks90d: 0,
  profileVisits30d: 0,
  profileVisits90d: 0,
  websiteClicks30d: 0,
  websiteClicks90d: 0,
  topSourcesCardClicks: [],
  topSourcesProfileVisits: [],
  topSourcesWebsiteClicks: [],
  loading: true,
};

function aggregateSources(rows: { page_source: string | null }[]) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = r.page_source || "(okänd)";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function usePartnerViewStats(
  partnerSlug: string | undefined,
  partnerName: string | undefined
) {
  const [stats, setStats] = useState<PartnerViewStats>(empty);

  useEffect(() => {
    if (!partnerSlug) {
      setStats({ ...empty, loading: false });
      return;
    }

    let cancelled = false;
    const now = Date.now();
    const since30 = new Date(now - 30 * 86400000).toISOString();
    const since90 = new Date(now - 90 * 86400000).toISOString();

    (async () => {
      // Fetch profile views (card_click + profile_visit) for last 90 days
      const viewsRes = await supabase
        .from("partner_profile_views")
        .select("view_type, page_source, viewed_at")
        .eq("partner_slug", partnerSlug)
        .gte("viewed_at", since90);

      // Fetch website clicks for last 90 days (matched by name)
      let clicksRes: any = { data: [] };
      if (partnerName) {
        clicksRes = await supabase
          .from("partner_clicks")
          .select("page_source, clicked_at")
          .eq("partner_name", partnerName)
          .gte("clicked_at", since90);
      }

      if (cancelled) return;

      const views = viewsRes.data || [];
      const cardClicks = views.filter((v: any) => v.view_type === "card_click");
      const profileVisits = views.filter((v: any) => v.view_type === "profile_visit");

      const cardClicks30 = cardClicks.filter((v: any) => v.viewed_at >= since30);
      const profileVisits30 = profileVisits.filter((v: any) => v.viewed_at >= since30);

      const websiteClicks = clicksRes.data || [];
      const websiteClicks30 = websiteClicks.filter((c: any) => c.clicked_at >= since30);

      setStats({
        cardClicks30d: cardClicks30.length,
        cardClicks90d: cardClicks.length,
        profileVisits30d: profileVisits30.length,
        profileVisits90d: profileVisits.length,
        websiteClicks30d: websiteClicks30.length,
        websiteClicks90d: websiteClicks.length,
        topSourcesCardClicks: aggregateSources(cardClicks),
        topSourcesProfileVisits: aggregateSources(profileVisits),
        topSourcesWebsiteClicks: aggregateSources(
          websiteClicks.map((c: any) => ({ page_source: c.page_source }))
        ),
        loading: false,
      });
    })().catch((err) => {
      console.error("usePartnerViewStats:", err);
      if (!cancelled) setStats({ ...empty, loading: false });
    });

    return () => {
      cancelled = true;
    };
  }, [partnerSlug, partnerName]);

  return stats;
}
