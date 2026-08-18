import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Check if origin is allowed
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  
  const allowedDomains = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  
  if (allowedDomains.includes(origin)) return true;
  
  // Allow all Lovable preview domains
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365.se";
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Grov leverantörsstorlek 1..5 (intern signal – ingen publik UI).
// Alla värden utanför intervallet nollas till NULL för att skydda CHECK-constrainten.
function normalizeSizeTier(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  return r >= 1 && r <= 5 ? r : null;
}

// JWT verification using HMAC-SHA256
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; payload?: Record<string, unknown>; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes as unknown as BufferSource, encoder.encode(dataToVerify));

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    // Decode and validate payload
    const payload = JSON.parse(atob(base64UrlToBase64(encodedPayload)));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    // Check role
    if (payload.role !== "admin") {
      return { valid: false, error: "Insufficient permissions" };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

function base64UrlToBase64(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = base64UrlToBase64(str);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

interface ProductFilterData {
  industries: string[];
  secondaryIndustries: string[];
  companySize: string[];
  geography: string[];  // Changed to array for multi-select
  ranking: number;
}

interface PartnerData {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website: string;
  email?: string;
  contact_person?: string;
  contact_photo_url?: string;
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  geography?: string[];
  product_filters?: {
    bc?: ProductFilterData;
    fsc?: ProductFilterData;
    sales?: ProductFilterData;
    service?: ProductFilterData;
  };
  industry_apps?: Array<{
    name: string;
    url: string;
    application: string;
    industry: string;
    description: string;
  }>;
  is_featured?: boolean;
  activation_date?: string;
  monthly_fee?: number;
  cancellation_date?: string;
  admin_notes?: string;
  agreement_signed?: boolean;
  agreement_notes?: string;
  admin_contact_name?: string;
  admin_contact_email?: string;
  invoice_email?: string;
  invoice_contact?: string;
  org_number?: string;
  legal_name?: string;
  office_cities?: string[];
  map_url?: string;
  youtube_video_id?: string;
  partner_size_tier?: number | null;
  partner_size_tier_needs_review?: boolean;
  industry_pitches?: Array<{
    industry: string;
    product: string | null;
    text: string;
    generated_at?: string | null;
    edited_by?: string | null;
    updated_at?: string;
  }>;
  ai_profile?: Record<string, unknown>;
  extended_content?: string;
  extended_summary?: string;
  profile_level?: "basic" | "profilerad";
  observed_products?: Record<string, boolean>;
  observed_industries?: Record<string, string[]>;
  observed_company_sizes?: Record<string, string[]>;
  observed_revenue?: Record<string, string[]>;
  observed_delivery_geo?: Record<string, string[]>;
  observed_locations?: string[];
  observed_updated_at?: string | null;
}

interface RequestBody {
  action: "create" | "update" | "delete" | "get-full" | "get-one" | "get-sales-pitch-segments" | "list-contact-blocked-counts";
  partner?: PartnerData;
  id?: string;
  token: string;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { action, partner, id, token } = body;

    // Validate JWT token
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      console.error("JWT secret not available");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const verification = await verifyJWT(token || "", JWT_SECRET);
    if (!verification.valid) {
      console.log(`Invalid token: ${verification.error}`);
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case "get-one": {
        // Get a single partner by ID
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Partner-ID krävs" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Get one error:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, partner: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "get-sales-pitch-segments": {
        const [partnersRes, subsRes, invitesRes, refreshRes] = await Promise.all([
          supabase
            .from("partners")
            .select("id, slug, name, email, admin_contact_email, admin_contact_name, contact_person, is_featured")
            .order("name"),
          supabase.from("partner_submissions").select("partner_id"),
          supabase.from("partner_invitations").select("partner_id, email"),
          supabase
            .from("email_send_log")
            .select("recipient_email")
            .eq("template_name", "partner_profile_refresh")
            .eq("status", "sent")
            .gte("created_at", "2026-04-27T00:00:00Z")
            .lt("created_at", "2026-04-28T00:00:00Z"),
        ]);
        if (partnersRes.error) throw partnersRes.error;
        if (subsRes.error) throw subsRes.error;
        if (invitesRes.error) throw invitesRes.error;
        if (refreshRes.error) throw refreshRes.error;
        return new Response(
          JSON.stringify({
            success: true,
            partners: partnersRes.data || [],
            submission_partner_ids: (subsRes.data || []).map((s: any) => s.partner_id).filter(Boolean),
            invited_partner_ids: (invitesRes.data || []).map((i: any) => i.partner_id).filter(Boolean),
            invited_emails: (invitesRes.data || []).map((i: any) => i.email).filter(Boolean),
            april27_emails: (refreshRes.data || []).map((r: any) => r.recipient_email).filter(Boolean),
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "get-full": {
        // Get full partner data including admin fields (not from public view)
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .order("name");

        if (error) {
          console.error("Get full error:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, partners: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "create": {
        if (!partner || !partner.name || !partner.website || !partner.slug) {
          return new Response(
            JSON.stringify({ error: "Namn, slug och hemsida krävs" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { data, error } = await supabase
          .from("partners")
          .insert({
            slug: partner.slug.toLowerCase().trim(),
            name: partner.name.trim(),
            description: partner.description?.trim() || null,
            logo_url: partner.logo_url?.trim() || null,
            website: partner.website.trim(),
            email: partner.email?.trim() || null,
            contact_person: partner.contact_person?.trim() || null,
            contact_photo_url: partner.contact_photo_url?.trim() || null,
            phone: partner.phone?.trim() || null,
            address: partner.address?.trim() || null,
            applications: partner.applications || [],
            industries: partner.industries || [],
            secondary_industries: partner.secondary_industries || [],
            geography: partner.geography || ['Sverige'],
            product_filters: partner.product_filters || {},
            industry_apps: partner.industry_apps || [],
            is_featured: partner.is_featured || false,
            activation_date: partner.activation_date || null,
            monthly_fee: partner.monthly_fee || null,
            cancellation_date: partner.cancellation_date || null,
            admin_notes: partner.admin_notes?.trim() || null,
            agreement_signed: partner.agreement_signed || false,
            agreement_notes: partner.agreement_notes?.trim() || null,
            admin_contact_name: partner.admin_contact_name?.trim() || null,
            admin_contact_email: partner.admin_contact_email?.trim() || null,
            invoice_email: partner.invoice_email?.trim() || null,
            invoice_contact: partner.invoice_contact?.trim() || null,
            org_number: partner.org_number?.trim() || null,
            legal_name: partner.legal_name?.trim() || null,
            office_cities: partner.office_cities || [],
            map_url: partner.map_url?.trim() || null,
            youtube_video_id: partner.youtube_video_id?.trim() || null,
            partner_size_tier: normalizeSizeTier(partner.partner_size_tier),
            partner_size_tier_needs_review: partner.partner_size_tier_needs_review === true,
            industry_pitches: partner.industry_pitches || [],
            positioning_statement: (partner as any).positioning_statement || null,
            delivery_profile: (partner as any).delivery_profile || {},
            team_size_sweden: (partner as any).team_size_sweden || null,
            implementations_done: (partner as any).implementations_done || null,
            not_a_fit: (partner as any).not_a_fit || [],
            ai_profile: (partner as any).ai_profile || {},
            product_profiles: (partner as any).product_profiles || {},
            implementations_per_app: (partner as any).implementations_per_app || {},
            extended_content: (partner as any).extended_content?.trim() || null,
            extended_content_updated_at: (partner as any).extended_content?.trim() ? new Date().toISOString() : null,
            extended_summary: (partner as any).extended_summary?.trim() || null,
            profile_level: partner.profile_level || "profilerad",
            observed_products: partner.observed_products || {},
            observed_industries: partner.observed_industries || {},
            observed_company_sizes: (partner as any).observed_company_sizes || {},
            observed_revenue: (partner as any).observed_revenue || {},
            observed_delivery_geo: (partner as any).observed_delivery_geo || {},
            observed_locations: partner.observed_locations || [],
            observed_updated_at: partner.observed_updated_at || null,
          })
          .select()
          .single();

        if (error) {
          console.error("Create error:", error);
          if (error.code === "23505") {
            return new Response(
              JSON.stringify({ error: "En partner med denna slug finns redan" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          throw error;
        }

        console.log("Partner created:", data.name);
        return new Response(
          JSON.stringify({ success: true, partner: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "update": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Partner-ID krävs för uppdatering" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const updateData: Record<string, unknown> = {};
        if (partner?.slug) updateData.slug = partner.slug.toLowerCase().trim();
        if (partner?.name) updateData.name = partner.name.trim();
        if (partner?.description !== undefined) updateData.description = partner.description?.trim() || null;
        if (partner?.logo_url !== undefined) updateData.logo_url = partner.logo_url?.trim() || null;
        if (partner?.website) updateData.website = partner.website.trim();
        if (partner?.email !== undefined) updateData.email = partner.email?.trim() || null;
        if (partner?.contact_person !== undefined) updateData.contact_person = partner.contact_person?.trim() || null;
        if (partner?.contact_photo_url !== undefined) updateData.contact_photo_url = partner.contact_photo_url?.trim() || null;
        if (partner?.phone !== undefined) updateData.phone = partner.phone?.trim() || null;
        if (partner?.address !== undefined) updateData.address = partner.address?.trim() || null;
        if (partner?.applications !== undefined) updateData.applications = partner.applications;
        if (partner?.industries !== undefined) updateData.industries = partner.industries;
        if (partner?.secondary_industries !== undefined) updateData.secondary_industries = partner.secondary_industries;
        if (partner?.geography !== undefined) updateData.geography = partner.geography;
        if (partner?.product_filters !== undefined) updateData.product_filters = partner.product_filters;
        if (partner?.industry_apps !== undefined) updateData.industry_apps = partner.industry_apps;
        if (partner?.is_featured !== undefined) updateData.is_featured = partner.is_featured;
        if (partner?.activation_date !== undefined) updateData.activation_date = partner.activation_date || null;
        if (partner?.monthly_fee !== undefined) updateData.monthly_fee = partner.monthly_fee || null;
        if (partner?.cancellation_date !== undefined) updateData.cancellation_date = partner.cancellation_date || null;
        if (partner?.admin_notes !== undefined) updateData.admin_notes = partner.admin_notes?.trim() || null;
        if (partner?.agreement_signed !== undefined) updateData.agreement_signed = partner.agreement_signed;
        if (partner?.agreement_notes !== undefined) updateData.agreement_notes = partner.agreement_notes?.trim() || null;
        if (partner?.admin_contact_name !== undefined) updateData.admin_contact_name = partner.admin_contact_name?.trim() || null;
        if (partner?.admin_contact_email !== undefined) updateData.admin_contact_email = partner.admin_contact_email?.trim() || null;
        if (partner?.invoice_email !== undefined) updateData.invoice_email = partner.invoice_email?.trim() || null;
        if (partner?.invoice_contact !== undefined) updateData.invoice_contact = partner.invoice_contact?.trim() || null;
        if (partner?.org_number !== undefined) updateData.org_number = partner.org_number?.trim() || null;
        if (partner?.legal_name !== undefined) updateData.legal_name = partner.legal_name?.trim() || null;
        if (partner?.office_cities !== undefined) updateData.office_cities = partner.office_cities;
        if (partner?.map_url !== undefined) updateData.map_url = partner.map_url?.trim() || null;
        if (partner?.youtube_video_id !== undefined) updateData.youtube_video_id = partner.youtube_video_id?.trim() || null;
        if (partner?.partner_size_tier !== undefined) updateData.partner_size_tier = normalizeSizeTier(partner.partner_size_tier);
        if (partner?.partner_size_tier_needs_review !== undefined) updateData.partner_size_tier_needs_review = partner.partner_size_tier_needs_review === true;
        if (partner?.industry_pitches !== undefined) updateData.industry_pitches = partner.industry_pitches;
        if ((partner as any)?.positioning_statement !== undefined) updateData.positioning_statement = (partner as any).positioning_statement || null;
        if ((partner as any)?.delivery_profile !== undefined) updateData.delivery_profile = (partner as any).delivery_profile || {};
        if ((partner as any)?.team_size_sweden !== undefined) updateData.team_size_sweden = (partner as any).team_size_sweden || null;
        if ((partner as any)?.implementations_done !== undefined) updateData.implementations_done = (partner as any).implementations_done || null;
        if ((partner as any)?.not_a_fit !== undefined) updateData.not_a_fit = (partner as any).not_a_fit || [];
        if ((partner as any)?.ai_profile !== undefined) updateData.ai_profile = (partner as any).ai_profile || {};
        if ((partner as any)?.product_profiles !== undefined) updateData.product_profiles = (partner as any).product_profiles || {};
        if ((partner as any)?.implementations_per_app !== undefined) updateData.implementations_per_app = (partner as any).implementations_per_app || {};
        if ((partner as any)?.extended_content !== undefined) {
          const trimmed = (partner as any).extended_content?.trim() || null;
          updateData.extended_content = trimmed;
          updateData.extended_content_updated_at = trimmed ? new Date().toISOString() : null;
        }
        if ((partner as any)?.ai_summary !== undefined) {
          const trimmed = (partner as any).ai_summary?.trim() || null;
          updateData.ai_summary = trimmed;
          updateData.ai_summary_generated_at = trimmed ? new Date().toISOString() : null;
        }
        if ((partner as any)?.ai_summary_full !== undefined) {
          updateData.ai_summary_full = (partner as any).ai_summary_full?.trim() || null;
        }
        if ((partner as any)?.best_fit_for !== undefined) {
          updateData.best_fit_for = Array.isArray((partner as any).best_fit_for)
            ? (partner as any).best_fit_for.map((s: unknown) => String(s).trim()).filter(Boolean)
            : [];
        }
        if ((partner as any)?.ai_tags !== undefined) {
          updateData.ai_tags = Array.isArray((partner as any).ai_tags)
            ? (partner as any).ai_tags.map((s: unknown) => String(s).trim()).filter(Boolean)
            : [];
        }
        if ((partner as any)?.not_a_fit !== undefined) {
          updateData.not_a_fit = Array.isArray((partner as any).not_a_fit)
            ? (partner as any).not_a_fit.map((s: unknown) => String(s).trim()).filter(Boolean)
            : [];
        }
        if ((partner as any)?.extended_summary !== undefined) {
          updateData.extended_summary = (partner as any).extended_summary?.trim() || null;
        }
        if (partner?.profile_level !== undefined) updateData.profile_level = partner.profile_level;
        if (partner?.observed_products !== undefined) updateData.observed_products = partner.observed_products || {};
        if (partner?.observed_industries !== undefined) updateData.observed_industries = partner.observed_industries || {};
        if ((partner as any)?.observed_company_sizes !== undefined) updateData.observed_company_sizes = (partner as any).observed_company_sizes || {};
        if ((partner as any)?.observed_revenue !== undefined) updateData.observed_revenue = (partner as any).observed_revenue || {};
        if ((partner as any)?.observed_delivery_geo !== undefined) updateData.observed_delivery_geo = (partner as any).observed_delivery_geo || {};
        if (partner?.observed_locations !== undefined) updateData.observed_locations = partner.observed_locations || [];
        if (partner?.observed_updated_at !== undefined) updateData.observed_updated_at = partner.observed_updated_at;
        if ((partner as any)?.hide_basic_card !== undefined) updateData.hide_basic_card = (partner as any).hide_basic_card === true;


        const { data, error } = await supabase
          .from("partners")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        console.log("Partner updated:", data.name);
        return new Response(
          JSON.stringify({ success: true, partner: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "delete": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Partner-ID krävs för borttagning" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { error } = await supabase
          .from("partners")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Delete error:", error);
          throw error;
        }

        console.log("Partner deleted:", id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "list-contact-blocked-counts": {
        // Aggregated counter for admin – count of anonymous blocked contact
        // attempts per Basic partner. No buyer data is stored, so nothing
        // beyond raw counts can be returned even in principle.
        const { data, error } = await supabase
          .from("contact_attempt_blocked")
          .select("partner_id");
        if (error) throw error;
        const counts: Record<string, number> = {};
        (data || []).forEach((r: { partner_id: string }) => {
          counts[r.partner_id] = (counts[r.partner_id] || 0) + 1;
        });
        const arr = Object.entries(counts).map(([partner_id, count]) => ({
          partner_id,
          count,
        }));
        return new Response(
          JSON.stringify({ counts: arr }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Ogiltig action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
  } catch (error: unknown) {
    // Log full error server-side for debugging, return generic message to client
    console.error("Error in manage-partners:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod vid bearbetning av förfrågan" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});