import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
const RATE_LIMIT = 5; // Max requests per window
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

// Validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  return typeof name === "string" && name.trim().length > 0 && name.length <= 100;
}

function isValidPhone(phone: string | undefined): boolean {
  if (!phone || phone === "") return true; // Optional field
  return typeof phone === "string" && phone.length <= 30;
}

function isValidAnalysisType(type: string): type is "ERP" | "CRM" {
  return type === "ERP" || type === "CRM";
}

function isValidAnalysisData(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

interface AnalysisEmailRequest {
  analysisType: "ERP" | "CRM";
  companyName: string;
  contactName: string;
  phone?: string;
  email: string;
  analysisData: Record<string, unknown>;
  recommendation?: {
    product: string;
    reasons: string[];
  };
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  console.log("send-analysis-email function called");

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
    let body: AnalysisEmailRequest;
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

    const { 
      analysisType, 
      companyName, 
      contactName, 
      phone, 
      email, 
      analysisData,
      recommendation 
    } = body;
    
    // Server-side validation
    const errors: string[] = [];
    
    if (!isValidAnalysisType(analysisType)) {
      errors.push("Analysis type must be 'ERP' or 'CRM'");
    }
    if (!isValidName(companyName)) {
      errors.push("Company name is required and must be less than 100 characters");
    }
    if (!isValidName(contactName)) {
      errors.push("Contact name is required and must be less than 100 characters");
    }
    if (!isValidEmail(email)) {
      errors.push("Valid email is required");
    }
    if (!isValidPhone(phone)) {
      errors.push("Phone number must be less than 30 characters");
    }
    if (!isValidAnalysisData(analysisData)) {
      errors.push("Analysis data must be a valid object");
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

    console.log(`Processing ${analysisType} analysis from:`, companyName, contactName);

    // Sanitize and format analysis data
    const formatAnalysisData = (data: Record<string, unknown>): string => {
      return Object.entries(data)
        .slice(0, 50) // Limit number of fields
        .map(([key, value]) => {
          const safeKey = sanitizeHtml(String(key).slice(0, 100));
          if (Array.isArray(value)) {
            const safeValues = value.slice(0, 20).map(v => sanitizeHtml(String(v).slice(0, 200)));
            return `<p><strong>${safeKey}:</strong> ${safeValues.join(", ")}</p>`;
          }
          const safeValue = sanitizeHtml(String(value).slice(0, 500));
          return `<p><strong>${safeKey}:</strong> ${safeValue}</p>`;
        })
        .join("");
    };

    // Sanitize inputs for HTML email
    const safeCompanyName = sanitizeHtml(companyName.trim().slice(0, 100));
    const safeContactName = sanitizeHtml(contactName.trim().slice(0, 100));
    const safePhone = phone ? sanitizeHtml(phone.trim().slice(0, 30)) : "Ej angivet";
    const safeEmail = sanitizeHtml(email.trim().slice(0, 255));

    const recommendationHtml = recommendation 
      ? `
        <h2>Rekommendation</h2>
        <p><strong>Rekommenderad lösning:</strong> ${sanitizeHtml(String(recommendation.product).slice(0, 200))}</p>
        <p><strong>Anledningar:</strong></p>
        <ul>
          ${(recommendation.reasons || []).slice(0, 10).map(r => `<li>${sanitizeHtml(String(r).slice(0, 500))}</li>`).join("")}
        </ul>
      `
      : "";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dynamic Factory <onboarding@resend.dev>",
        to: ["thomas.laine@dynamicfactory.se"],
        subject: `Ny ${analysisType}-behovsanalys från ${safeCompanyName}`,
        html: `
          <h1>Ny ${analysisType}-behovsanalys slutförd</h1>
          
          <h2>Kontaktinformation</h2>
          <p><strong>Företag:</strong> ${safeCompanyName}</p>
          <p><strong>Kontaktperson:</strong> ${safeContactName}</p>
          <p><strong>Telefon:</strong> ${safePhone}</p>
          <p><strong>E-post:</strong> ${safeEmail}</p>
          
          <h2>Analysresultat</h2>
          ${formatAnalysisData(analysisData)}
          
          ${recommendationHtml}
        `,
      }),
    });

    const responseData = await emailResponse.json();
    console.log("Analysis email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-analysis-email function:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
