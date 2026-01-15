import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DatabasePartner, ProductFilters } from "./usePartners";

// Fetch ALL partners for admin dashboard (includes non-featured partners)
// Uses the manage-partners edge function with admin token
// Returns full partner data including admin fields
export function useAdminPartners(token: string | null) {
  return useQuery({
    queryKey: ["admin-partners", token],
    queryFn: async (): Promise<DatabasePartner[]> => {
      if (!token) return [];

      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "get-full", token },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return (data.partners || []).map((p: any) => ({
        ...p,
        secondary_industries: p.secondary_industries || [],
        geography: p.geography || ['Sverige'],
        product_filters: (p.product_filters as ProductFilters) || {},
        contactPerson: p.contact_person || null,
      }));
    },
    enabled: !!token,
  });
}
