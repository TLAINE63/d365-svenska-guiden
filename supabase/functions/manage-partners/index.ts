import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { timingSafeEqual } from "https://deno.land/std@0.190.0/crypto/timing_safe_equal.ts";

// Rate limiting for brute-force protection
const adminRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const ADMIN_RATE_LIMIT = 5; // Max attempts per window
const ADMIN_RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isAdminRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = adminRateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    adminRateLimitMap.set(ip, { count: 1, resetTime: now + ADMIN_RATE_WINDOW_MS });
    return false;
  }
  
  if (record.count >= ADMIN_RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Constant-time password comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  try {
    // Pad both strings to same length to prevent length-based timing
    const maxLen = Math.max(a.length, b.length, 64);
    const aBytes = new TextEncoder().encode(a.padEnd(maxLen, '\0'));
    const bBytes = new TextEncoder().encode(b.padEnd(maxLen, '\0'));
    
    return timingSafeEqual(aBytes, bBytes);
  } catch {
    return false;
  }
}

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

interface PartnerData {
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

interface RequestBody {
  action: "create" | "update" | "delete";
  partner?: PartnerData;
  id?: string;
  password: string;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    
    if (isAdminRateLimited(clientIp)) {
      console.log(`Rate limited IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "För många inloggningsförsök. Försök igen om 5 minuter." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: RequestBody = await req.json();
    const { action, partner, id, password } = body;

    // Validate password - require environment variable, no fallback
    const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD) {
      console.error("PARTNER_ADMIN_PASSWORD environment variable is not configured");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Use constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(password || "", ADMIN_PASSWORD)) {
      console.log(`Invalid password attempt from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Ogiltigt lösenord" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
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
            phone: partner.phone?.trim() || null,
            address: partner.address?.trim() || null,
            applications: partner.applications || [],
            industries: partner.industries || [],
            is_featured: partner.is_featured || false,
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
        if (partner?.phone !== undefined) updateData.phone = partner.phone?.trim() || null;
        if (partner?.address !== undefined) updateData.address = partner.address?.trim() || null;
        if (partner?.applications !== undefined) updateData.applications = partner.applications;
        if (partner?.industries !== undefined) updateData.industries = partner.industries;
        if (partner?.is_featured !== undefined) updateData.is_featured = partner.is_featured;

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
