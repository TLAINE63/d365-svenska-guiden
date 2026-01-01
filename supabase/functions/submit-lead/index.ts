import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Get allowed origins for CORS - allow all Lovable preview domains
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  
  // Allow localhost for development
  if (origin.startsWith("http://localhost:")) return true;
  
  // Allow all Lovable domains (production and preview)
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365-svenska-guiden.lovable.app";
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

interface LeadRequest {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  company_size?: string;
  industry?: string;
  selected_product?: string;
  source_page?: string;
  source_type?: string;
  message?: string;
  _hp?: string; // Honeypot field
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(clientIP)) {
      console.log(`Rate limited IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "För många förfrågningar. Försök igen senare." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: LeadRequest = await req.json();

    // Honeypot check - if filled, silently "succeed" to fool bots
    if (data._hp) {
      console.log("Honeypot triggered - bot detected");
      return new Response(
        JSON.stringify({ success: true, id: "blocked" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    if (!data.company_name || !data.contact_name || !data.email) {
      return new Response(
        JSON.stringify({ error: "Företagsnamn, kontaktperson och e-post är obligatoriska." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email
    if (!isValidEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig e-postadress." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      company_name: sanitizeInput(data.company_name).slice(0, 100),
      contact_name: sanitizeInput(data.contact_name).slice(0, 100),
      email: sanitizeInput(data.email).slice(0, 255),
      phone: sanitizeInput(data.phone).slice(0, 20),
      company_size: sanitizeInput(data.company_size).slice(0, 50),
      industry: sanitizeInput(data.industry).slice(0, 100),
      selected_product: sanitizeInput(data.selected_product).slice(0, 100),
      source_page: sanitizeInput(data.source_page).slice(0, 200),
      source_type: sanitizeInput(data.source_type).slice(0, 50) || "cta",
      message: sanitizeInput(data.message).slice(0, 1000),
    };

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        company_name: sanitizedData.company_name,
        contact_name: sanitizedData.contact_name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        company_size: sanitizedData.company_size || null,
        industry: sanitizedData.industry || null,
        selected_product: sanitizedData.selected_product || null,
        source_page: sanitizedData.source_page || null,
        source_type: sanitizedData.source_type,
        message: sanitizedData.message || null,
        status: "new",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error("Kunde inte spara lead");
    }

    console.log("Lead saved successfully:", lead.id);

    // Send email notification
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        await resend.emails.send({
          from: "Dynamic Factory <onboarding@resend.dev>",
          to: ["thomas.laine@dynamicfactory.se"],
          reply_to: sanitizedData.email,
          subject: `Ny lead: ${sanitizedData.company_name}`,
          html: `
            <h2>Ny lead från webbplatsen</h2>
            
            <h3>Kontaktuppgifter</h3>
            <ul>
              <li><strong>Företag:</strong> ${sanitizedData.company_name}</li>
              <li><strong>Kontaktperson:</strong> ${sanitizedData.contact_name}</li>
              <li><strong>E-post:</strong> ${sanitizedData.email}</li>
              <li><strong>Telefon:</strong> ${sanitizedData.phone || "Ej angivet"}</li>
            </ul>
            
            <h3>Kvalificeringsdata</h3>
            <ul>
              <li><strong>Företagsstorlek:</strong> ${sanitizedData.company_size || "Ej angivet"}</li>
              <li><strong>Bransch:</strong> ${sanitizedData.industry || "Ej angivet"}</li>
              <li><strong>Produkt:</strong> ${sanitizedData.selected_product || "Ej angivet"}</li>
            </ul>
            
            <h3>Källa</h3>
            <ul>
              <li><strong>Sida:</strong> ${sanitizedData.source_page || "Okänd"}</li>
              <li><strong>Typ:</strong> ${sanitizedData.source_type}</li>
            </ul>
            
            ${sanitizedData.message ? `<h3>Meddelande</h3><p>${sanitizedData.message}</p>` : ""}
            
            <hr>
            <p><a href="https://d9e90f0f-f133-4101-acbb-fd63a5b8b573.lovableproject.com/lead-admin">Hantera leads i admin →</a></p>
          `,
        });
        
        console.log("Email notification sent");
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the request if email fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: lead.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in submit-lead:", error);
    const corsHeaders = getCorsHeaders(req);
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
