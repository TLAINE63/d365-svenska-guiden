import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DatabasePartner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  applications: string[];
  industries: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerInput {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website: string;
  email?: string;
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  is_featured?: boolean;
}

// Fetch all partners from database
export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async (): Promise<DatabasePartner[]> => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch a single partner by slug
export function usePartner(slug: string | undefined) {
  return useQuery({
    queryKey: ["partner", slug],
    queryFn: async (): Promise<DatabasePartner | null> => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Create a new partner (requires admin password via edge function)
export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partner, password }: { partner: PartnerInput; password: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "create", partner, password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data.partner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

// Update an existing partner (requires admin password via edge function)
export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, partner, password }: { id: string; partner: Partial<PartnerInput>; password: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "update", id, partner, password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data.partner;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner", variables.partner.slug] });
    },
  });
}

// Delete a partner (requires admin password via edge function)
export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "delete", id, password },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
  });
}

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
