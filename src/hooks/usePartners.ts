import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

// Swedish regions for granular geography filtering
export type SwedishRegion = 
  | "Storstockholm / Mälardalen" 
  | "Syd / Sydväst" 
  | "Väst" 
  | "Sydost" 
  | "Mellansverige" 
  | "Norr";

export interface ProductFilterInput {
  industries: string[];         // Max 3 focus industries
  secondaryIndustries: string[]; // Legacy - hidden in UI
  companySize: string[];        // Target customer size buckets (employees)
  revenue?: string[];           // Target customer revenue buckets (MSEK)
  geography: string[];          // Multi-select geography
  swedenRegions?: SwedishRegion[]; // Which regions in Sweden the partner covers
  swedenCities?: string[];      // Specific cities in Sweden where they have consultants
  ranking: number;
  customerExamples?: string[];  // Reference customers for this product
  customerCaseLinks?: string[]; // Links to customer case studies
  productDescription?: string;  // Short description of partner's offering for this product
  // AI capability fields
  aiCapabilities?: string[];    // Which AI solution types the partner has delivered
  aiProjectCount?: string;      // Number of AI projects last 24 months: "0-2", "3-5", "6+"
  hasBuiltAgents?: boolean;     // Has built custom AI agents or Copilot solutions
  aiCaseDescription?: string;   // Short description of an AI case (max 200 chars)
  aiBusinessImpact?: string;    // Required for advanced (🔴) AI: business impact description (max 200 chars)
  aiSegmentationDetails?: string[]; // Follow-up for customer segmentation capability
  aiPredictiveDetails?: string[];   // Follow-up for predictive maintenance capability
  aiOtherPartner?: string;          // Free-text for custom partner-built AI solution
  aiOtherAdvanced?: string;         // Free-text for custom advanced AI solution
  // Per-product sales contact
  contactName?: string;             // Sales contact name for this product area
  contactEmail?: string;            // Sales contact email for this product area
  contactPhone?: string;            // Sales contact phone for this product area
  contactPhotoUrl?: string;         // Sales contact photo URL for this product area
  youtubeVideoId?: string;          // Optional YouTube video ID for this product area
  landingPageUrl?: string;          // Optional partner landing page URL for this product area
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
  logo_dark_bg?: boolean;
  website: string;
  email: string | null;
  contactPerson: string | null;
  contact_photo_url: string | null;
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
  customer_examples?: string[];
  office_cities?: string[];
  map_url?: string;
  industry_apps?: Array<{
    name: string;
    url: string;
    application: string;
    industry: string;
    description: string;
  }>;
  // Invoice fields
  invoice_email: string | null;
  invoice_contact: string | null;
  org_number: string | null;
  legal_name: string | null;
  // Admin fields
  activation_date: string | null;
  monthly_fee: number | null;
  cancellation_date: string | null;
  admin_notes: string | null;
  admin_contact_name: string | null;
  admin_contact_email: string | null;
  agreement_signed?: boolean | null;
  agreement_notes?: string | null;
  youtube_video_id?: string | null;
  industry_pitches?: Array<{
    industry: string;
    product: string | null;
    text: string;
    generated_at?: string | null;
    edited_by?: string | null;
    updated_at?: string;
  }>;
}

export interface PartnerInput {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website: string;
  email?: string;
  contactPerson?: string;
  contact_photo_url?: string;
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  geography?: string[];  // Changed to array for multi-select
  product_filters?: ProductFilters;
  is_featured?: boolean;
  // Invoice fields
  invoice_email?: string;
  invoice_contact?: string;
  // Admin fields
  activation_date?: string;
  monthly_fee?: number;
  cancellation_date?: string;
  admin_notes?: string;
  admin_contact_name?: string;
  admin_contact_email?: string;
  agreement_signed?: boolean;
  agreement_notes?: string;
  office_cities?: string[];
  map_url?: string;
  youtube_video_id?: string;
  industry_pitches?: Array<{
    industry: string;
    product: string | null;
    text: string;
    generated_at?: string | null;
    edited_by?: string | null;
    updated_at?: string;
  }>;
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
        contact_photo_url: null,
        phone: null,
        address: null,
        secondary_industries: p.secondary_industries || [],
        geography: p.geography || ['Sverige'],
        product_filters: (p.product_filters as ProductFilters) || {},
        industry_apps: (p.industry_apps as DatabasePartner['industry_apps']) || [],
        industry_pitches: (p.industry_pitches as DatabasePartner['industry_pitches']) || [],
        invoice_email: null,
        invoice_contact: null,
        org_number: null,
        legal_name: null,
        activation_date: null,
        monthly_fee: null,
        cancellation_date: null,
        admin_notes: null,
        admin_contact_name: null,
        admin_contact_email: null,
        agreement_signed: (p as any).agreement_signed ?? false,
        youtube_video_id: (p as any).youtube_video_id || null,
      }));
    },
  });
}

// Fetch a single partner by slug with public contact info for profile display
// Now uses partners_public view which includes contact_person, email, phone
export function usePartner(slug: string | undefined) {
  return useQuery({
    queryKey: ["partner", slug],
    queryFn: async (): Promise<DatabasePartner | null> => {
      if (!slug) return null;
      
      // Fetch from partners_public view - includes public contact info, excludes admin fields
      const { data, error } = await supabase
        .from("partners_public")
        .select("*")
        .eq("slug", slug)
        .eq("is_featured", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Map database field names to frontend field names
      return {
        ...data,
        contactPerson: data.contact_person,
        contact_photo_url: (data as any).contact_photo_url || null,
        address: null,
        secondary_industries: data.secondary_industries || [],
        geography: data.geography || ['Sverige'],
        product_filters: (data.product_filters as ProductFilters) || {},
        industry_apps: (data.industry_apps as DatabasePartner['industry_apps']) || [],
        industry_pitches: (data.industry_pitches as DatabasePartner['industry_pitches']) || [],
        invoice_email: (data as any).invoice_email || null,
        invoice_contact: (data as any).invoice_contact || null,
        org_number: (data as any).org_number || null,
        legal_name: (data as any).legal_name || null,
        activation_date: null,
        monthly_fee: null,
        cancellation_date: null,
        admin_notes: null,
        admin_contact_name: null,
        admin_contact_email: null,
        agreement_signed: (data as any).agreement_signed ?? false,
        youtube_video_id: (data as any).youtube_video_id || null,
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
      const { data, error } = await invokeAdminEdgeWithRetry<any>("manage-partners", {
        action: "create", partner: mappedPartner, token,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.partner;
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
      const { data, error } = await invokeAdminEdgeWithRetry<any>("manage-partners", {
        action: "update", id, partner: mappedPartner, token,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data?.partner;
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
      const { data, error } = await invokeAdminEdgeWithRetry<any>("manage-partners", {
        action: "delete", id, token,
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
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
