import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// CORS headers - allow all lovable domains
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

function isValidAnalysisType(type: string): boolean {
  const validTypes = ["ERP", "CRM", "Kundservice", "Sälj & Marknad"];
  return validTypes.includes(type);
}

function isValidAnalysisData(data: unknown): data is Record<string, unknown> {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}

function isValidBase64(str: string): boolean {
  if (typeof str !== "string") return false;
  // Check if it's a valid base64 string (basic check)
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str) && str.length > 0;
}

interface AnalysisEmailRequest {
  analysisType: string;
  companyName: string;
  contactName: string;
  phone?: string;
  email: string;
  analysisData: Record<string, unknown>;
  recommendation?: {
    product: string;
    reasons: string[];
  };
  pdfBase64?: string;
  pdfFilename?: string;
}

serve(async (req: Request): Promise<Response> => {
  
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
      recommendation,
      pdfBase64,
      pdfFilename
    } = body;
    
    // Server-side validation
    const errors: string[] = [];
    
    if (!isValidAnalysisType(analysisType)) {
      errors.push("Analysis type must be 'ERP', 'CRM', 'Kundservice', or 'Sälj & Marknad'");
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
    if (pdfBase64 && !isValidBase64(pdfBase64)) {
      errors.push("PDF data must be valid base64");
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
    console.log(`PDF attachment included: ${!!pdfBase64}`);

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
    const safeAnalysisType = sanitizeHtml(analysisType);

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

    // Build email payload - send to customer with CC to admin
    const emailPayload: Record<string, unknown> = {
      from: "D365 Guiden <noreply@cloudahead.se>",
      to: [email], // Send to customer
      cc: ["thomas.laine@cloudahead.se"], // Copy to admin
      reply_to: "thomas.laine@cloudahead.se",
      subject: `Din ${safeAnalysisType}-behovsanalys från d365.se`,
      html: `
        <h1>Tack för din ${safeAnalysisType}-behovsanalys!</h1>
        
        <p>Hej ${safeContactName},</p>
        
        <p>Tack för att du genomförde vår behovsanalys. Här är en sammanfattning av dina svar och vår rekommendation.</p>
        
        <h2>Kontaktinformation</h2>
        <p><strong>Företag:</strong> ${safeCompanyName}</p>
        <p><strong>Kontaktperson:</strong> ${safeContactName}</p>
        <p><strong>Telefon:</strong> ${safePhone}</p>
        <p><strong>E-post:</strong> ${safeEmail}</p>
        
        <h2>Analysresultat</h2>
        ${formatAnalysisData(analysisData)}
        
        ${recommendationHtml}
        
        <h2>Nästa steg</h2>
        <p>Vi kontaktar dig inom kort för att diskutera hur vi kan hjälpa er vidare. Du är också välkommen att kontakta oss direkt:</p>
        <p>
          <strong>Thomas Laine</strong><br>
          Partner & Rådgivare, Cloudahead<br>
          E-post: <a href="mailto:thomas.laine@cloudahead.se">thomas.laine@cloudahead.se</a><br>
          Tel: 070-678 90 12
        </p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          ${pdfBase64 ? "📎 PDF-analysen är bifogad i detta mail." : ""}
          <br>
          Detta mail skickades från <a href="https://d365.se">d365.se</a>
        </p>
      `,
    };

    // Add PDF attachment if provided
    if (pdfBase64 && pdfFilename) {
      const safeFilename = pdfFilename.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100) + ".pdf";
      emailPayload.attachments = [
        {
          filename: safeFilename,
          content: pdfBase64,
        },
      ];
      console.log(`Adding PDF attachment: ${safeFilename}`);
    }

    // Send customer email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await emailResponse.json();
    console.log("Customer email response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(responseData.message || "Failed to send customer email");
    }

    // Send separate admin notification email
    const adminNotificationPayload = {
      from: "D365 Guiden <noreply@cloudahead.se>",
      to: ["thomas.laine@cloudahead.se"],
      reply_to: email, // Reply goes to customer
      subject: `🔔 Ny ${safeAnalysisType}-behovsanalys från ${safeCompanyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0078D4 0%, #00BCF2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📋 Ny behovsanalys inskickad</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Typ av analys:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeAnalysisType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Företag:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeCompanyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Kontaktperson:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safeContactName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>E-post:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Telefon:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Tidpunkt:</strong></td>
                <td style="padding: 8px 0;">${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })}</td>
              </tr>
            </table>
          </div>
          
          ${recommendation ? `
          <div style="background: #e7f3ff; padding: 15px; margin-top: 15px; border-radius: 6px; border-left: 4px solid #0078D4;">
            <h3 style="margin: 0 0 10px 0; color: #0078D4;">💡 Rekommendation</h3>
            <p style="margin: 0;"><strong>${sanitizeHtml(String(recommendation.product))}</strong></p>
          </div>
          ` : ""}
          
          <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h3 style="margin: 0 0 15px 0;">Sammanfattning av svar</h3>
            ${formatAnalysisData(analysisData)}
          </div>
          
          <div style="background: #f1f1f1; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              ${pdfBase64 ? "📎 PDF-analysen är bifogad i kundmailet." : ""}
              <br>
              Notifikation från <a href="https://d365.se">d365.se</a>
            </p>
          </div>
        </div>
      `,
    };

    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(adminNotificationPayload),
    });

    const adminData = await adminResponse.json();
    console.log("Admin notification response:", adminData);

    if (!adminResponse.ok) {
      console.error("Failed to send admin notification:", adminData);
      // Don't throw - customer email was already sent successfully
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-analysis-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
