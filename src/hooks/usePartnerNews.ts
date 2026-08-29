import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PartnerNewsStatus = "draft" | "review" | "approved" | "published" | "unpublished" | "archived";
export type PartnerNewsSourceType = "linkedin" | "partner_web" | "blog" | "press" | "webinar" | "event" | "other";
export type PartnerNewsProductArea = "business-central" | "finance-scm" | "crm-sales" | "crm-service" | "crm" | "power-platform" | "microsoft-ai" | "ovrigt";
export type PartnerNewsType = "kundcase" | "event" | "webinar" | "erbjudande" | "artikel" | "rapport" | "branschlosning" | "produktnyhet" | "partnernyhet" | "analys";

export interface PartnerNewsItem {
  id: string;
  partner_id: string;
  editorial_title: string;
  summary: string;
  source_url: string;
  source_type: PartnerNewsSourceType;
  product_area: PartnerNewsProductArea;
  product_areas: PartnerNewsProductArea[];
  news_type: PartnerNewsType;
  industry: string | null;
  image_url: string | null;
  news_date: string;
  is_featured: boolean;
  show_on_home: boolean;
  show_on_partner_profile: boolean;
  show_on_product_page: boolean;
  status: PartnerNewsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  partner?: { id: string; name: string; slug: string; logo_url: string | null } | null;
}

interface UsePublishedPartnerNewsOpts {
  partnerId?: string;
  productArea?: PartnerNewsProductArea;
  showOnHome?: boolean;
  showOnPartnerProfile?: boolean;
  showOnProductPage?: boolean;
  limit?: number;
}

export function usePublishedPartnerNews(opts: UsePublishedPartnerNewsOpts = {}) {
  return useQuery({
    queryKey: ["partner-news-public", opts],
    queryFn: async (): Promise<PartnerNewsItem[]> => {
      let query = supabase
        .from("partner_news")
        .select("*")
        .eq("status", "published");
      if (opts.partnerId) query = query.eq("partner_id", opts.partnerId);
      if (opts.productArea) query = query.contains("product_areas", [opts.productArea]);
      // Placeringsflaggorna (show_on_home / show_on_partner_profile / show_on_product_page)
      // sparas fortfarande men filtrerar inte längre – allt publicerat visas överallt.
      query = query
        .order("news_date", { ascending: false })
        .order("published_at", { ascending: false });
      if (opts.limit) query = query.limit(opts.limit);
      const { data, error } = await query;
      if (error) throw error;
      const rows = (data ?? []).map((row: Record<string, unknown>) => {
        return { ...(row as unknown as PartnerNewsItem), partner: null };
      });


      // Backfill partner name/slug for rows where the RLS-protected join returned null
      // (partners that are not is_featured). Uses SECURITY DEFINER RPC that exposes
      // only safe fields (id, name, slug), so the "Läs mer om ..." CTA always renders.
      const missingIds = Array.from(
        new Set(rows.filter((r) => !r.partner?.slug && r.partner_id).map((r) => r.partner_id)),
      );
      if (missingIds.length > 0) {
        try {
          const { data: names } = await (supabase as unknown as {
            rpc: (fn: string) => Promise<{ data: Array<{ id: string; name: string; slug: string }> | null }>;
          }).rpc("get_all_partner_names");
          const byId = new Map((names ?? []).map((n) => [n.id, n]));
          for (const r of rows) {
            if (!r.partner?.slug && r.partner_id) {
              const n = byId.get(r.partner_id);
              if (n) r.partner = { id: n.id, name: n.name, slug: n.slug, logo_url: null };
            }
          }
        } catch (e) {
          console.warn("partner name backfill failed", e);
        }
      }
      return rows;
    },
    staleTime: 5 * 60_000,
  });
}

export function usePartnerNewsItem(id: string | undefined) {
  return useQuery({
    queryKey: ["partner-news-item", id],
    queryFn: async (): Promise<PartnerNewsItem | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("partner_news")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const row = data as Record<string, unknown>;
      const item = { ...(row as unknown as PartnerNewsItem), partner: null };


      // Backfill partner name/slug for non-featured partners via SECURITY DEFINER RPC
      if (!item.partner?.slug && item.partner_id) {
        try {
          const { data: names } = await (supabase as unknown as {
            rpc: (fn: string) => Promise<{ data: Array<{ id: string; name: string; slug: string }> | null }>;
          }).rpc("get_all_partner_names");
          const byId = new Map((names ?? []).map((n) => [n.id, n]));
          const n = byId.get(item.partner_id);
          if (n) item.partner = { id: n.id, name: n.name, slug: n.slug, logo_url: null };
        } catch (e) {
          console.warn("partner name backfill failed", e);
        }
      }
      return item;
    },
    enabled: !!id,
    staleTime: 5 * 60_000,
  });
}
