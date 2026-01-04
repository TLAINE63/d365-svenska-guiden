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
      const resend = new Resend(resendApiKey);
      
      // Determine if this is a lead magnet download
      const isLeadMagnet = sanitizedData.source_type === "lead_magnet";
      
      // Send email to customer if lead magnet download
      if (isLeadMagnet) {
        try {
          await resend.emails.send({
            from: "D365 Guiden <resend@d365.se>",
            to: [sanitizedData.email],
            subject: "Din guide: Så väljer du rätt Dynamics 365-partner",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">
                    Tack för ditt intresse!
                  </h1>
                </div>
                
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                    Hej!
                  </p>
                  <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                    Tack för att du laddade ner vår guide <strong>"Så väljer du rätt Dynamics 365-partner"</strong>.
                  </p>
                  
                  <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                    <p style="color: #065f46; font-size: 14px; margin: 0 0 16px 0;">
                      Din guide har laddats ner automatiskt i din webbläsare.
                    </p>
                    <p style="color: #6b7280; font-size: 13px; margin: 0;">
                      Om nedladdningen inte startade automatiskt, besök <a href="https://www.d365.se" style="color: #10b981;">www.d365.se</a> och ladda ner igen.
                    </p>
                  </div>
                  
                  <h3 style="color: #374151; font-size: 18px; margin-top: 30px;">
                    I guiden hittar du:
                  </h3>
                  <ul style="color: #4b5563; font-size: 15px; line-height: 1.8;">
                    <li>Checklista för att utvärdera Dynamics 365-partners</li>
                    <li>Viktiga frågor att ställa till potentiella partners</li>
                    <li>Varningssignaler att vara uppmärksam på</li>
                    <li>Tips för att säkerställa en lyckad implementation</li>
                  </ul>
                  
                  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 30px;">
                    <h4 style="color: #374151; margin: 0 0 12px 0;">Behöver du mer hjälp?</h4>
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0;">
                      Vi hjälper dig gärna att hitta rätt partner för dina behov.
                    </p>
                    <a href="https://www.d365.se/valj-partner" 
                       style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                      Se våra partners →
                    </a>
                  </div>
                </div>
                
                <div style="background: #374151; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    D365 Guiden | <a href="https://www.d365.se" style="color: #10b981;">www.d365.se</a>
                  </p>
                </div>
              </div>
            `,
          });
          
          console.log("Customer email sent to:", sanitizedData.email);
        } catch (customerEmailError) {
          console.error("Customer email failed:", customerEmailError);
          // Continue with admin notification even if customer email fails
        }
      }
      
      // Send notification to admin
      try {
        const emailSubject = isLeadMagnet 
          ? `📥 Guide nedladdad: ${sanitizedData.email}`
          : `🎯 Ny lead: ${sanitizedData.company_name}`;
        
        await resend.emails.send({
          from: "D365 Guiden <resend@d365.se>",
          to: ["info@d365.se"],
          reply_to: sanitizedData.email,
          subject: emailSubject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">
                  ${isLeadMagnet ? "📥 Ny guide-nedladdning" : "🎯 Ny lead från webbplatsen"}
                </h2>
              </div>
              
              <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                ${isLeadMagnet ? `
                  <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin-bottom: 20px;">
                    <strong>Nedladdad guide:</strong><br>
                    ${sanitizedData.message || "Så väljer du rätt Dynamics 365-partner"}
                  </div>
                ` : ""}
                
                <h3 style="color: #374151; border-bottom: 2px solid #10b981; padding-bottom: 8px;">
                  Kontaktuppgifter
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 120px;">E-post:</td>
                    <td style="padding: 8px 0; color: #111827;"><strong>${sanitizedData.email}</strong></td>
                  </tr>
                  ${!isLeadMagnet ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Företag:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.company_name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Kontaktperson:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.contact_name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Telefon:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.phone || "Ej angivet"}</td>
                    </tr>
                  ` : ""}
                </table>
                
                ${!isLeadMagnet ? `
                  <h3 style="color: #374151; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 24px;">
                    Kvalificeringsdata
                  </h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; width: 120px;">Företagsstorlek:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.company_size || "Ej angivet"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Bransch:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.industry || "Ej angivet"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Produkt:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.selected_product || "Ej angivet"}</td>
                    </tr>
                  </table>
                ` : ""}
                
                <h3 style="color: #374151; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 24px;">
                  Källa
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 120px;">Sida:</td>
                    <td style="padding: 8px 0; color: #111827;">${sanitizedData.source_page || "Okänd"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Typ:</td>
                    <td style="padding: 8px 0; color: #111827;">${isLeadMagnet ? "Lead Magnet (Guide-nedladdning)" : sanitizedData.source_type}</td>
                  </tr>
                </table>
                
                ${sanitizedData.message && !isLeadMagnet ? `
                  <h3 style="color: #374151; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 24px;">
                    Meddelande
                  </h3>
                  <p style="color: #374151; background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
                    ${sanitizedData.message}
                  </p>
                ` : ""}
              </div>
              
              <div style="background: #374151; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
                <a href="https://www.d365.se/lead-admin" style="color: #10b981; text-decoration: none; font-weight: bold;">
                  Hantera leads i admin →
                </a>
              </div>
            </div>
          `,
        });
        
        console.log("Admin email notification sent");
      } catch (emailError) {
        console.error("Admin email notification failed:", emailError);
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
