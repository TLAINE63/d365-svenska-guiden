import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicContentItem {
  kind: string;
  title: string;
  date?: string | null;
  url?: string | null;
}

export interface PartnerPublicInsights {
  partner_id: string;
  generated_market_profile: string | null;
  observed_topics: string[];
  observed_products: string[];
  observed_industries: string[];
  articles_count: number;
  webinars_count: number;
  case_studies_count: number;
  latest_content: PublicContentItem[];
  last_updated: string | null;
}

/**
 * Separat informationslager: publikt identifierat innehåll per partner.
 * Läses enbart, skriver aldrig till partnerns egen profil.
 */
export function usePartnerPublicInsights(partnerId?: string | null) {
  return useQuery({
    queryKey: ["partner-public-insights", partnerId],
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<PartnerPublicInsights | null> => {
      const { data, error } = await (supabase as any)
        .from("partner_public_insights")
        .select("*")
        .eq("partner_id", partnerId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        partner_id: data.partner_id,
        generated_market_profile: data.generated_market_profile ?? null,
        observed_topics: data.observed_topics ?? [],
        observed_products: data.observed_products ?? [],
        observed_industries: data.observed_industries ?? [],
        articles_count: data.articles_count ?? 0,
        webinars_count: data.webinars_count ?? 0,
        case_studies_count: data.case_studies_count ?? 0,
        latest_content: Array.isArray(data.latest_content) ? data.latest_content : [],
        last_updated: data.last_updated ?? null,
      };
    },
  });
}
