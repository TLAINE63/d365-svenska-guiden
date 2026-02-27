import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Sanitize HTML to prevent XSS in emails
function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Check if origin is allowed
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  
  const allowedDomains = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  
  if (allowedDomains.includes(origin)) return true;
  
  // Allow all Lovable preview domains
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365.se";
  
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

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, token, ...data } = await req.json();

    // Validate JWT token
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      console.error("JWT secret not available");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verification = await verifyJWT(token || "", JWT_SECRET);
    if (!verification.valid) {
      console.log(`Invalid token: ${verification.error}`);
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
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
          
          // Sanitize lead data to prevent XSS in emails
          const safeLead = {
            company_name: sanitizeHtml(lead.company_name),
            contact_name: sanitizeHtml(lead.contact_name),
            email: sanitizeHtml(lead.email),
            phone: sanitizeHtml(lead.phone),
            company_size: sanitizeHtml(lead.company_size),
            industry: sanitizeHtml(lead.industry),
            selected_product: sanitizeHtml(lead.selected_product),
            message: sanitizeHtml(lead.message),
          };

          for (const partnerEmail of partner_emails) {
            await resend.emails.send({
              from: "Dynamic Factory <onboarding@resend.dev>",
              to: [partnerEmail],
              reply_to: "thomas.laine@dynamicfactory.se",
              subject: `Ny kundförfrågan: ${safeLead.company_name}`,
              html: `
                <h2>Ny kundförfrågan via Dynamic Factory</h2>
                
                <p>Vi har en potentiell kund som söker hjälp med Microsoft Dynamics 365 och tror att ni kan vara en bra match.</p>
                
                <h3>Kunduppgifter</h3>
                <ul>
                  <li><strong>Företag:</strong> ${safeLead.company_name}</li>
                  <li><strong>Kontaktperson:</strong> ${safeLead.contact_name}</li>
                  <li><strong>E-post:</strong> ${safeLead.email}</li>
                  <li><strong>Telefon:</strong> ${safeLead.phone || "Ej angivet"}</li>
                </ul>
                
                <h3>Behov</h3>
                <ul>
                  <li><strong>Företagsstorlek:</strong> ${safeLead.company_size || "Ej angivet"}</li>
                  <li><strong>Bransch:</strong> ${safeLead.industry || "Ej angivet"}</li>
                  <li><strong>Produkt:</strong> ${safeLead.selected_product || "Ej angivet"}</li>
                </ul>
                
                ${safeLead.message ? `<h3>Meddelande från kunden</h3><p>${safeLead.message}</p>` : ""}
                
                <hr>
                <p>Vänligen kontakta kunden direkt. Svara på detta mail om ni har frågor.</p>
                <p>Med vänlig hälsning,<br>Thomas Laine<br>Senior Rådgivare inom Microsoft CRM- och Affärssystem<br>Dynamic Factory</p>
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

case "click-stats": {
        const { data: stats, error } = await supabase
          .from("partner_clicks")
          .select("partner_name, clicked_at, ip_address_anonymized")
          .order("clicked_at", { ascending: false });

        if (error) throw error;

        // Aggregate by partner and month
        const aggregated: Record<string, { partner_name: string; month: string; clicks: number }> = {};
        // Aggregate by IP prefix for geographic overview
        const ipStats: Record<string, number> = {};
        
        for (const row of stats || []) {
          const date = new Date(row.clicked_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          const key = `${row.partner_name}_${monthKey}`;
          
          if (!aggregated[key]) {
            aggregated[key] = {
              partner_name: row.partner_name,
              month: monthKey,
              clicks: 0,
            };
          }
          aggregated[key].clicks++;
          
          // Count IP prefixes (first two octets for broader geographic grouping)
          if (row.ip_address_anonymized && row.ip_address_anonymized !== "unknown") {
            const ipPrefix = row.ip_address_anonymized.split(".").slice(0, 2).join(".");
            ipStats[ipPrefix] = (ipStats[ipPrefix] || 0) + 1;
          }
        }

        const result = Object.values(aggregated).sort((a, b) => {
          if (a.month !== b.month) return b.month.localeCompare(a.month);
          return b.clicks - a.clicks;
        });

        // Convert IP stats to sorted array
        const ipStatsArray = Object.entries(ipStats)
          .map(([prefix, count]) => ({ ip_prefix: prefix, clicks: count }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 20); // Top 20 IP prefixes

        return new Response(
          JSON.stringify({ stats: result, ipStats: ipStatsArray }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "visitor-stats": {
        const { startDate } = data;
        
        // Fetch all visitor analytics from the specified date
        const { data: visitors, error } = await supabase
          .from("visitor_analytics")
          .select("*")
          .gte("visited_at", startDate)
          .order("visited_at", { ascending: false });

        if (error) throw error;

        const NORDIC_COUNTRIES = ["SE", "NO", "DK", "FI", "IS"];
        const EUROPEAN_COUNTRIES = [
          "AT", "BE", "BG", "HR", "CY", "CZ", "EE", "FR", "DE", "GR", "HU", 
          "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", 
          "SI", "ES", "GB", "CH", "UA", "BY", "RS", "BA", "ME", "MK", "AL"
        ];

        // Calculate stats
        const swedishVisitors = visitors?.filter(v => v.geo_country_code === "SE") || [];
        const nordicVisitors = visitors?.filter(v => 
          NORDIC_COUNTRIES.includes(v.geo_country_code) && v.geo_country_code !== "SE"
        ) || [];
        const europeanVisitors = visitors?.filter(v => 
          EUROPEAN_COUNTRIES.includes(v.geo_country_code)
        ) || [];
        const otherVisitors = visitors?.filter(v => 
          v.geo_country_code && 
          !NORDIC_COUNTRIES.includes(v.geo_country_code) && 
          !EUROPEAN_COUNTRIES.includes(v.geo_country_code)
        ) || [];

        // Swedish bounce rate
        const swedishBounces = swedishVisitors.filter(v => v.is_bounce === true).length;
        const swedishBounceRate = swedishVisitors.length > 0 
          ? Math.round((swedishBounces / swedishVisitors.length) * 100) 
          : 0;

        // Average time on page (Swedish visitors)
        const validTimes = swedishVisitors.filter(v => v.time_on_page_seconds && v.time_on_page_seconds > 0);
        const avgTimeOnPage = validTimes.length > 0
          ? Math.round(validTimes.reduce((sum, v) => sum + v.time_on_page_seconds, 0) / validTimes.length)
          : 0;

        // Top pages (Swedish visitors)
        const pageCount: Record<string, number> = {};
        swedishVisitors.forEach(v => {
          pageCount[v.page_path] = (pageCount[v.page_path] || 0) + 1;
        });
        const topPages = Object.entries(pageCount)
          .map(([path, visits]) => ({ path, visits }))
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10);

        // Top cities (Swedish visitors)
        const cityCount: Record<string, { city: string; region: string; visits: number }> = {};
        swedishVisitors.forEach(v => {
          if (v.geo_city && v.geo_city !== "Unknown") {
            const key = `${v.geo_city}_${v.geo_region}`;
            if (!cityCount[key]) {
              cityCount[key] = { city: v.geo_city, region: v.geo_region || "", visits: 0 };
            }
            cityCount[key].visits++;
          }
        });
        const topCities = Object.values(cityCount)
          .sort((a, b) => b.visits - a.visits);

        const stats = {
          totalVisitors: visitors?.length || 0,
          swedishVisitors: swedishVisitors.length,
          nordicVisitors: nordicVisitors.length,
          europeanVisitors: europeanVisitors.length,
          otherVisitors: otherVisitors.length,
          swedishBounceRate,
          avgTimeOnPage,
          topPages,
          topCities,
        };

        return new Response(
          JSON.stringify({ stats }),
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
    // Log full error server-side for debugging, return generic message to client
    console.error("Error in manage-leads:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod vid bearbetning av förfrågan" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
