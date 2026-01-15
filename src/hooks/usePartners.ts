import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductFilterInput {
  industries: string[];         // Max 2 focus industries
  secondaryIndustries: string[]; // Max 2 "erfarenhet även inom"
  companySize: string[];
  geography: string;
  ranking: number;
  customerExamples?: string[];  // Reference customers for this product
}

// Updated product filters to include 4 product areas plus combined crm
export interface ProductFilters {
  bc?: ProductFilterInput;      // Business Central
  fsc?: ProductFilterInput;     // Finance & Supply Chain
  sales?: ProductFilterInput;   // Sales & Customer Insights
  service?: ProductFilterInput; // Customer Service / Field Service / Contact Center
  crm?: ProductFilterInput;     // Combined CRM (for backwards compatibility)
}

export interface DatabasePartner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string;
  email: string | null;
  contactPerson: string | null;
  phone: string | null;
  address: string | null;
  applications: string[];
  industries: string[];
  secondary_industries: string[];
  geography: string[];  // Changed to array for multi-select
  product_filters: ProductFilters;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Admin fields
  activation_date: string | null;
  monthly_fee: number | null;
  cancellation_date: string | null;
  admin_notes: string | null;
  admin_contact_name: string | null;
  admin_contact_email: string | null;
}

export interface PartnerInput {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  geography?: string[];  // Changed to array for multi-select
  product_filters?: ProductFilters;
  is_featured?: boolean;
  // Admin fields
  activation_date?: string;
  monthly_fee?: number;
  cancellation_date?: string;
  admin_notes?: string;
  admin_contact_name?: string;
  admin_contact_email?: string;
}

// Fetch all featured partners from database (public view - excludes sensitive contact info)
// IMPORTANT: Only returns partners marked as is_featured = true
export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async (): Promise<DatabasePartner[]> => {
      const { data, error } = await supabase
        .from("partners_public")
        .select("*")
        .eq("is_featured", true)
        .order("name");

      if (error) throw error;
      // Add null values for fields not in the public view
      return (data || []).map(p => ({
        ...p,
        email: null,
        contactPerson: null,
        phone: null,
        address: null,
        secondary_industries: p.secondary_industries || [],
        geography: p.geography || ['Sverige'],
        product_filters: (p.product_filters as ProductFilters) || {},
        activation_date: null,
        monthly_fee: null,
        cancellation_date: null,
        admin_notes: null,
        admin_contact_name: null,
        admin_contact_email: null,
      }));
    },
  });
}

// Fetch a single partner by slug (public view - excludes sensitive contact info)
export function usePartner(slug: string | undefined) {
  return useQuery({
    queryKey: ["partner", slug],
    queryFn: async (): Promise<DatabasePartner | null> => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("partners_public")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      // Add null values for fields not in the public view
      return {
        ...data,
        email: null,
        contactPerson: null,
        phone: null,
        address: null,
        secondary_industries: data.secondary_industries || [],
        geography: data.geography || ['Sverige'],
        product_filters: (data.product_filters as ProductFilters) || {},
        activation_date: null,
        monthly_fee: null,
        cancellation_date: null,
        admin_notes: null,
        admin_contact_name: null,
        admin_contact_email: null,
      };
    },
    enabled: !!slug,
  });
}

// Create a new partner (requires admin token via edge function)
// Map frontend field names to database field names
function mapPartnerToDbFormat(partner: PartnerInput | Partial<PartnerInput>) {
  return {
    ...partner,
    contact_person: partner.contactPerson,
    contactPerson: undefined, // Remove the frontend field name
  };
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partner, token }: { partner: PartnerInput; token: string }) => {
      const mappedPartner = mapPartnerToDbFormat(partner);
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "create", partner: mappedPartner, token },
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

// Update an existing partner (requires admin token via edge function)
export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, partner, token }: { id: string; partner: Partial<PartnerInput>; token: string }) => {
      const mappedPartner = mapPartnerToDbFormat(partner);
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "update", id, partner: mappedPartner, token },
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

// Delete a partner (requires admin token via edge function)
export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "delete", id, token },
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
