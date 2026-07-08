import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isPartnerExcluded } from "@/lib/partnerVisibility";


export interface UnprofiledPartner {
  id: string;
  name: string;
  note: string | null;
  website: string | null;
  display_order: number;
  is_visible: boolean;
}

export function useUnprofiledPartners() {
  return useQuery({
    queryKey: ["unprofiled-partners"],
    queryFn: async (): Promise<UnprofiledPartner[]> => {
      const { data, error } = await supabase
        .from("unprofiled_partners")
        .select("id, name, note, website, display_order, is_visible")
        .eq("is_visible", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return ((data || []) as UnprofiledPartner[]).filter(
        (p) => !isPartnerExcluded(p.name)
      );

    },
    staleTime: 5 * 60 * 1000,
  });
}
