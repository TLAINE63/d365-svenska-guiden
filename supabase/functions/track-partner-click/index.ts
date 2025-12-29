import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // Max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// HTML sanitization to prevent XSS in emails
function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate URL format
function isValidUrl(url: string): boolean {
  if (typeof url !== "string" || url.length > 500) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Validate partner name
function isValidPartnerName(name: string): boolean {
  return typeof name === "string" && name.trim().length > 0 && name.length <= 200;
}

// Validate optional string fields
function isValidOptionalString(value: string | undefined, maxLength: number = 500): boolean {
  if (value === undefined || value === null || value === "") return true;
  return typeof value === "string" && value.length <= maxLength;
}

interface PartnerClickRequest {
  partnerName: string;
  partnerWebsite: string;
  pageSource?: string;
  userAgent?: string;
  referrer?: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit
    if (isRateLimited(clientIp)) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate request body
    let body: PartnerClickRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { partnerName, partnerWebsite, pageSource, userAgent, referrer } = body;

    // Server-side validation
    const errors: string[] = [];
    
    if (!isValidPartnerName(partnerName)) {
      errors.push("Partner name is required and must be less than 200 characters");
    }
    if (!isValidUrl(partnerWebsite)) {
      errors.push("Valid partner website URL is required (http or https)");
    }
    if (!isValidOptionalString(pageSource, 200)) {
      errors.push("Page source must be less than 200 characters");
    }
    if (!isValidOptionalString(userAgent, 500)) {
      errors.push("User agent must be less than 500 characters");
    }
    if (!isValidOptionalString(referrer, 500)) {
      errors.push("Referrer must be less than 500 characters");
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Partner click tracked: ${partnerName} from ${pageSource}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert click record into database (sanitized values)
    const { data: clickData, error: insertError } = await supabase
      .from("partner_clicks")
      .insert({
        partner_name: partnerName.trim().slice(0, 200),
        partner_website: partnerWebsite.trim().slice(0, 500),
        page_source: pageSource?.trim().slice(0, 200) || null,
        user_agent: userAgent?.trim().slice(0, 500) || null,
        referrer: referrer?.trim().slice(0, 500) || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting click:", insertError);
      throw insertError;
    }

    console.log("Click recorded successfully:", clickData);

    // Sanitize values for HTML email
    const safePartnerName = sanitizeHtml(partnerName.trim());
    const safePartnerWebsite = sanitizeHtml(partnerWebsite.trim());
    const safePageSource = sanitizeHtml(pageSource?.trim() || "Okänd");

    // Send email notification
    const now = new Date();
    const formattedDate = now.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

    const emailResponse = await resend.emails.send({
      from: "Dynamic Factory <onboarding@resend.dev>",
      to: ["thomas.laine@dynamicfactory.se"],
      reply_to: "thomas.laine@dynamicfactory.se",
      subject: `Partnerklick: ${safePartnerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0078d4;">Ny partnerklick registrerad</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Partner:</strong> ${safePartnerName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Hemsida:</strong> <a href="${safePartnerWebsite}">${safePartnerWebsite}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Sida:</strong> ${safePageSource}</p>
            <p style="margin: 0;"><strong>Tidpunkt:</strong> ${formattedDate}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Detta email skickades automatiskt från d365-svenska-guiden.lovable.app
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, clickId: clickData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in track-partner-click function:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
