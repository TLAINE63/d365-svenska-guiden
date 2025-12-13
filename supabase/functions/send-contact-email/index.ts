import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  return emailRegex.test(email) && email.length <= 255;
}

function isValidName(name: string): boolean {
  return typeof name === "string" && name.trim().length > 0 && name.length <= 100;
}

function isValidPhone(phone: string | undefined): boolean {
  if (!phone || phone === "") return true; // Optional field
  return typeof phone === "string" && phone.length <= 30;
}

function isValidDescription(description: string): boolean {
  return typeof description === "string" && description.trim().length > 0 && description.length <= 5000;
}

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  description: string;
}

serve(async (req: Request): Promise<Response> => {
  console.log("send-contact-email function called");

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
    let body: ContactEmailRequest;
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

    const { name, email, phone, description } = body;

    // Server-side validation
    const errors: string[] = [];
    
    if (!isValidName(name)) {
      errors.push("Name is required and must be less than 100 characters");
    }
    if (!isValidEmail(email)) {
      errors.push("Valid email is required");
    }
    if (!isValidPhone(phone)) {
      errors.push("Phone number must be less than 30 characters");
    }
    if (!isValidDescription(description)) {
      errors.push("Description is required and must be less than 5000 characters");
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

    // Sanitize inputs for HTML email
    const safeName = sanitizeHtml(name.trim());
    const safeEmail = sanitizeHtml(email.trim());
    const safePhone = phone ? sanitizeHtml(phone.trim()) : "Ej angivet";
    const safeDescription = sanitizeHtml(description.trim());

    console.log("Sending contact email from:", safeName, safeEmail);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dynamic Factory Kontakt <onboarding@resend.dev>",
        to: ["thomas.laine@dynamicfactory.se"],
        reply_to: email.trim(),
        subject: `[Kontaktformulär] ${safeName} - Ny förfrågan`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
              <h1 style="margin: 0; font-size: 24px;">📬 Ny kontaktförfrågan</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">från dynamicfactory.se</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Namn:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">E-post:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}" style="color: #2d5a87;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${safePhone}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h2 style="font-size: 18px; color: #1e3a5f; margin-bottom: 10px;">Meddelande:</h2>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2d5a87;">
                <p style="margin: 0; white-space: pre-wrap;">${safeDescription}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>Detta meddelande skickades via kontaktformuläret på dynamicfactory.se</p>
              <p>Svara direkt på detta mail för att kontakta ${safeName}</p>
            </div>
          </div>
        `,
      }),
    });

    const responseData = await emailResponse.json();
    console.log("Contact email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
