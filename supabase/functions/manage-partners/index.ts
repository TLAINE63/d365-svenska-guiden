import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://d365-svenska-guiden.lovable.app",
  "https://vnvphfrrmoaskiwlspeo.lovableproject.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
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
  geography: string;
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
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  secondary_industries?: string[];
  geography?: string;
  product_filters?: {
    bc?: ProductFilterData;
    fsc?: ProductFilterData;
    sales?: ProductFilterData;
    service?: ProductFilterData;
  };
  is_featured?: boolean;
  activation_date?: string;
  monthly_fee?: number;
  cancellation_date?: string;
  admin_notes?: string;
}

interface RequestBody {
  action: "create" | "update" | "delete" | "get-full";
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
            phone: partner.phone?.trim() || null,
            address: partner.address?.trim() || null,
            applications: partner.applications || [],
            industries: partner.industries || [],
            secondary_industries: partner.secondary_industries || [],
            geography: partner.geography || 'Sverige',
            product_filters: partner.product_filters || {},
            is_featured: partner.is_featured || false,
            activation_date: partner.activation_date || null,
            monthly_fee: partner.monthly_fee || null,
            cancellation_date: partner.cancellation_date || null,
            admin_notes: partner.admin_notes?.trim() || null,
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
        if (partner?.phone !== undefined) updateData.phone = partner.phone?.trim() || null;
        if (partner?.address !== undefined) updateData.address = partner.address?.trim() || null;
        if (partner?.applications !== undefined) updateData.applications = partner.applications;
        if (partner?.industries !== undefined) updateData.industries = partner.industries;
        if (partner?.secondary_industries !== undefined) updateData.secondary_industries = partner.secondary_industries;
        if (partner?.geography !== undefined) updateData.geography = partner.geography;
        if (partner?.product_filters !== undefined) updateData.product_filters = partner.product_filters;
        if (partner?.is_featured !== undefined) updateData.is_featured = partner.is_featured;
        if (partner?.activation_date !== undefined) updateData.activation_date = partner.activation_date || null;
        if (partner?.monthly_fee !== undefined) updateData.monthly_fee = partner.monthly_fee || null;
        if (partner?.cancellation_date !== undefined) updateData.cancellation_date = partner.cancellation_date || null;
        if (partner?.admin_notes !== undefined) updateData.admin_notes = partner.admin_notes?.trim() || null;

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

      default:
        return new Response(
          JSON.stringify({ error: "Ogiltig action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in manage-partners:", error);
    const corsHeaders = getCorsHeaders(req);
    const message = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});