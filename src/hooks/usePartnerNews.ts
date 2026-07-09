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
        .select("*, partners:partner_id(id, name, slug, logo_url)")
        .eq("status", "published");
      if (opts.partnerId) query = query.eq("partner_id", opts.partnerId);
      if (opts.productArea) query = query.eq("product_area", opts.productArea);
      if (opts.showOnHome) query = query.eq("show_on_home", true);
      if (opts.showOnPartnerProfile) query = query.eq("show_on_partner_profile", true);
      if (opts.showOnProductPage) query = query.eq("show_on_product_page", true);
      query = query
        .order("is_featured", { ascending: false })
        .order("news_date", { ascending: false })
        .order("published_at", { ascending: false });
      if (opts.limit) query = query.limit(opts.limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => {
        const partner = (row.partners ?? null) as PartnerNewsItem["partner"];
        const { partners: _p, ...rest } = row as Record<string, unknown>;
        return { ...(rest as unknown as PartnerNewsItem), partner };
      });
    },
    staleTime: 5 * 60_000,
  });
}
