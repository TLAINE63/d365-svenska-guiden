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

// Rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

// Validation functions
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  return name.length >= 1 && name.length <= 100;
}

function isValidUrl(url: string): boolean {
  if (!url || url.trim() === "") return true; // Empty URLs are allowed
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(phone: string | undefined): boolean {
  if (!phone || phone.trim() === "") return true;
  // Allow digits, spaces, dashes, parentheses, plus sign
  const phoneRegex = /^[+\d\s\-()]{0,30}$/;
  return phoneRegex.test(phone);
}

function truncate(str: string | undefined, maxLength: number): string {
  if (!str) return "";
  return str.slice(0, maxLength);
}

interface ChangeRequestBody {
  partner_id: string;
  requester_name: string;
  requester_email: string;
  partner_name?: string;
  changes: {
    description?: string;
    logo_url?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    applications?: string[];
    industries?: string[];
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIp)) {
      console.log(`Rate limited IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "För många förfrågningar. Vänta en stund och försök igen." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: ChangeRequestBody = await req.json();

    // Validate required fields
    if (!body.partner_id || typeof body.partner_id !== "string") {
      return new Response(
        JSON.stringify({ error: "Ogiltigt partner-ID" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!body.requester_name || !isValidName(body.requester_name.trim())) {
      return new Response(
        JSON.stringify({ error: "Ogiltigt namn (1-100 tecken)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!body.requester_email || !isValidEmail(body.requester_email.trim())) {
      return new Response(
        JSON.stringify({ error: "Ogiltig e-postadress" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate changes object
    const changes = body.changes || {};

    if (changes.website && !isValidUrl(changes.website)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig webbadress (måste börja med http:// eller https://)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (changes.logo_url && !isValidUrl(changes.logo_url)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig logotyp-URL (måste börja med http:// eller https://)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (changes.email && changes.email.trim() !== "" && !isValidEmail(changes.email)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig kontakt-e-postadress" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidPhone(changes.phone)) {
      return new Response(
        JSON.stringify({ error: "Ogiltigt telefonnummer" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate arrays
    const validApplications = [
      "Business Central",
      "Finance & SCM",
      "Sales",
      "Customer Service",
      "Customer Insights (Marketing)",
      "Field Service",
      "Contact Center",
      "Project Operations",
    ];

    const validIndustries = [
      "Tillverkning",
      "Handel & Distribution",
      "IT & Tech",
      "Konsultföretag",
      "Bygg & Entreprenad",
      "Transport & Logistik",
      "Livsmedel",
      "Läkemedel & Life Science",
      "Energi",
      "Fastigheter",
      "Service & Underhåll",
      "Miljö & Återvinning",
      "Medlemsorganisationer",
      "Detaljhandel",
      "Parti- & Agenturhandel",
    ];

    const applications = Array.isArray(changes.applications) 
      ? changes.applications.filter((a: string) => validApplications.includes(a))
      : [];

    const industries = Array.isArray(changes.industries)
      ? changes.industries.filter((i: string) => validIndustries.includes(i))
      : [];

    // Sanitize and truncate all string fields
    const sanitizedChanges = {
      description: truncate(changes.description, 5000),
      logo_url: truncate(changes.logo_url, 500),
      website: truncate(changes.website, 500),
      email: truncate(changes.email, 255),
      phone: truncate(changes.phone, 30),
      address: truncate(changes.address, 300),
      applications,
      industries,
    };

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify partner exists
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id, name")
      .eq("id", body.partner_id)
      .single();

    if (partnerError || !partner) {
      console.error("Partner not found:", body.partner_id);
      return new Response(
        JSON.stringify({ error: "Partner hittades inte" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Insert change request
    const { error: insertError } = await supabase
      .from("partner_change_requests")
      .insert({
        partner_id: body.partner_id,
        requester_name: truncate(body.requester_name.trim(), 100),
        requester_email: truncate(body.requester_email.trim(), 255),
        changes: sanitizedChanges,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Kunde inte spara ändringsförfrågan" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Change request submitted for partner: ${partner.name} by ${body.requester_email.trim()}`);

    // Send email notification (fire and forget)
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = "info@dynamicfactory.se";
    
    if (RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Dynamic Factory <noreply@dynamicfactory.se>",
            to: [ADMIN_EMAIL],
            subject: `Ny ändringsförfrågan: ${sanitizeHtml(partner.name)}`,
            html: `
              <h2>Ny ändringsförfrågan har inkommit</h2>
              <p><strong>Partner:</strong> ${sanitizeHtml(partner.name)}</p>
              <p><strong>Från:</strong> ${sanitizeHtml(body.requester_name.trim())} (${sanitizeHtml(body.requester_email.trim())})</p>
              <p>Logga in på adminpanelen för att granska och godkänna/avslå förfrågan.</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the request if email fails
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in submit-change-request:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "Ett oväntat fel uppstod" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
