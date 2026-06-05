import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PartnerNameRow {
  id: string;
  name: string;
  slug: string;
  is_featured: boolean;
  agreement_signed: boolean;
  product_filters: Record<string, any>;
}

/**
 * Fetches lightweight name/slug/status for ALL partners in the database
 * (both featured/published and unpublished). Used for marketplace overview lists.
 */
export function useAllPartnerNames() {
  return useQuery({
    queryKey: ["all-partner-names"],
    queryFn: async (): Promise<PartnerNameRow[]> => {
      const { data, error } = await supabase
        .from("partners_public")
        .select("id, name, slug, is_featured, agreement_signed, product_filters")
        .order("name");
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        is_featured: !!p.is_featured,
        agreement_signed: !!p.agreement_signed,
        product_filters: (p.product_filters as Record<string, any>) || {},
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
