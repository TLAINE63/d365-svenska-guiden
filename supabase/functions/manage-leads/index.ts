import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { timingSafeEqual } from "https://deno.land/std@0.190.0/crypto/timing_safe_equal.ts";

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

// Rate limiting for admin actions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;

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

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Rate limited" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, password, ...data } = await req.json();

    // Verify admin password using constant-time comparison
    const adminPassword = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    if (!adminPassword) {
      console.error("PARTNER_ADMIN_PASSWORD environment variable is not configured");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!constantTimeCompare(password || "", adminPassword)) {
      return new Response(
        JSON.stringify({ error: "Ogiltigt lösenord" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "list": {
        const { data: leads, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return new Response(
          JSON.stringify({ leads }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update": {
        const { id, status, admin_notes, assigned_partners } = data;
        
        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
        if (assigned_partners) {
          updateData.assigned_partners = assigned_partners;
          if (status === "forwarded") {
            updateData.forwarded_at = new Date().toISOString();
          }
        }

        const { error } = await supabase
          .from("leads")
          .update(updateData)
          .eq("id", id);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "forward": {
        const { id, partner_emails, partner_names } = data;

        // Get lead details
        const { data: lead, error: leadError } = await supabase
          .from("leads")
          .select("*")
          .eq("id", id)
          .single();

        if (leadError || !lead) {
          throw new Error("Lead not found");
        }

        // Send email to partners
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey && partner_emails?.length > 0) {
          const resend = new Resend(resendApiKey);
          
          for (const partnerEmail of partner_emails) {
            await resend.emails.send({
              from: "Dynamic Factory <onboarding@resend.dev>",
              to: [partnerEmail],
              reply_to: "thomas.laine@dynamicfactory.se",
              subject: `Ny kundförfrågan: ${lead.company_name}`,
              html: `
                <h2>Ny kundförfrågan via Dynamic Factory</h2>
                
                <p>Vi har en potentiell kund som söker hjälp med Microsoft Dynamics 365 och tror att ni kan vara en bra match.</p>
                
                <h3>Kunduppgifter</h3>
                <ul>
                  <li><strong>Företag:</strong> ${lead.company_name}</li>
                  <li><strong>Kontaktperson:</strong> ${lead.contact_name}</li>
                  <li><strong>E-post:</strong> ${lead.email}</li>
                  <li><strong>Telefon:</strong> ${lead.phone || "Ej angivet"}</li>
                </ul>
                
                <h3>Behov</h3>
                <ul>
                  <li><strong>Företagsstorlek:</strong> ${lead.company_size || "Ej angivet"}</li>
                  <li><strong>Bransch:</strong> ${lead.industry || "Ej angivet"}</li>
                  <li><strong>Produkt:</strong> ${lead.selected_product || "Ej angivet"}</li>
                </ul>
                
                ${lead.message ? `<h3>Meddelande från kunden</h3><p>${lead.message}</p>` : ""}
                
                <hr>
                <p>Vänligen kontakta kunden direkt. Svara på detta mail om ni har frågor.</p>
                <p>Med vänlig hälsning,<br>Thomas Laine<br>Dynamic Factory</p>
              `,
            });
          }

          // Update lead status
          await supabase
            .from("leads")
            .update({
              status: "forwarded",
              assigned_partners: partner_names || [],
              forwarded_at: new Date().toISOString(),
            })
            .eq("id", id);

          console.log(`Lead ${id} forwarded to ${partner_emails.length} partners`);
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        const { id } = data;
        const { error } = await supabase
          .from("leads")
          .delete()
          .eq("id", id);

        if (error) throw error;
        
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in manage-leads:", error);
    const corsHeaders = getCorsHeaders(req);
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
