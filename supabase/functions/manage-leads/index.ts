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
            try {
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
              await supabase.from("email_send_log").insert({
                recipient_email: partnerEmail,
                template_name: "lead_forward",
                subject: `Ny kundförfrågan: ${safeLead.company_name}`,
                status: "sent",
                metadata: { lead_id: id, company_name: lead.company_name },
              });
            } catch (sendErr: any) {
              console.error("Lead forward email error:", partnerEmail, sendErr);
              await supabase.from("email_send_log").insert({
                recipient_email: partnerEmail,
                template_name: "lead_forward",
                subject: `Ny kundförfrågan: ${safeLead.company_name}`,
                status: "failed",
                error_message: sendErr.message,
                metadata: { lead_id: id, company_name: lead.company_name },
              });
            }
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
        // Get admin IP from JWT to exclude admin clicks
        const adminIp = verification.payload?.ip as string || "";
        const adminIpPrefix = adminIp ? adminIp.split(".").slice(0, 2).join(".") : "";

        // Fetch partner admin emails to build exclusion domains
        const { data: partners } = await supabase
          .from("partners")
          .select("name, admin_contact_email, email")
          .eq("is_featured", true);

        // Build a set of partner email domains for cross-referencing
        const partnerDomains = new Set<string>();
        for (const p of partners || []) {
          for (const emailField of [p.admin_contact_email, p.email]) {
            if (emailField) {
              const domain = emailField.split("@")[1]?.toLowerCase();
              if (domain) partnerDomains.add(domain);
            }
          }
        }

        // Fetch visitor analytics to map IP prefixes to email domains (from referrer patterns)
        // This is a best-effort approach - we look for visitors whose page visits suggest internal traffic
        const partnerIpPrefixes = new Set<string>();
        // We'll check if any visitor IPs that clicked also visited /partner-uppdatering (partner update page)
        const { data: partnerUpdateVisits } = await supabase
          .from("visitor_analytics")
          .select("ip_anonymized")
          .like("page_path", "%partner-uppdatering%");
        
        for (const v of partnerUpdateVisits || []) {
          if (v.ip_anonymized && v.ip_anonymized !== "unknown") {
            const prefix = v.ip_anonymized.split(".").slice(0, 2).join(".");
            partnerIpPrefixes.add(prefix);
          }
        }

        const { data: stats, error } = await supabase
          .from("partner_clicks")
          .select("partner_name, clicked_at, ip_address_anonymized")
          .order("clicked_at", { ascending: false });

        if (error) throw error;

        // Aggregate by partner and month, excluding admin and partner IPs
        const aggregated: Record<string, { partner_name: string; month: string; clicks: number }> = {};
        const ipStats: Record<string, number> = {};
        let excludedCount = 0;
        
        for (const row of stats || []) {
          // Exclude admin's IP prefix
          const rowIpPrefix = row.ip_address_anonymized 
            ? row.ip_address_anonymized.split(".").slice(0, 2).join(".")
            : "";
          
          if (adminIpPrefix && rowIpPrefix === adminIpPrefix) {
            excludedCount++;
            continue;
          }

          // Exclude IPs that visited partner update pages (likely partners themselves)
          if (rowIpPrefix && partnerIpPrefixes.has(rowIpPrefix)) {
            excludedCount++;
            continue;
          }

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
          
          if (row.ip_address_anonymized && row.ip_address_anonymized !== "unknown") {
            ipStats[rowIpPrefix] = (ipStats[rowIpPrefix] || 0) + 1;
          }
        }

        const result = Object.values(aggregated).sort((a, b) => {
          if (a.month !== b.month) return b.month.localeCompare(a.month);
          return b.clicks - a.clicks;
        });

        const ipStatsArray = Object.entries(ipStats)
          .map(([prefix, count]) => ({ ip_prefix: prefix, clicks: count }))
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, 20);

        return new Response(
          JSON.stringify({ stats: result, ipStats: ipStatsArray, excludedClicks: excludedCount }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "visitor-stats": {
        const { startDate } = data;

        // Get admin IP from JWT for filtering
        const vsAdminIp = verification.payload?.ip as string || "";
        const vsAdminIpPrefix = vsAdminIp ? vsAdminIp.split(".").slice(0, 2).join(".") : "";

        // Get partner update page visitor IPs (same logic as click-stats)
        const partnerUpdateIpPrefixes = new Set<string>();
        const { data: puVisits } = await supabase
          .from("visitor_analytics")
          .select("ip_anonymized")
          .like("page_path", "%partner-uppdatering%");
        for (const v of puVisits || []) {
          if (v.ip_anonymized && v.ip_anonymized !== "unknown") {
            partnerUpdateIpPrefixes.add(v.ip_anonymized.split(".").slice(0, 2).join("."));
          }
        }

        // Fetch published partners for slug-to-name mapping
        const { data: pubPartners } = await supabase
          .from("partners")
          .select("name, slug")
          .eq("is_featured", true);
        const slugToName: Record<string, string> = {};
        for (const p of pubPartners || []) {
          slugToName[p.slug] = p.name;
        }
        
        // Fetch all visitor analytics from the specified date (paginated to avoid 1000-row limit)
        let allVisitors: any[] = [];
        let from = 0;
        const pageSize = 1000;
        while (true) {
          const { data: batch, error: batchError } = await supabase
            .from("visitor_analytics")
            .select("*")
            .gte("visited_at", startDate)
            .order("visited_at", { ascending: false })
            .range(from, from + pageSize - 1);
          if (batchError) throw batchError;
          if (!batch || batch.length === 0) break;
          allVisitors = allVisitors.concat(batch);
          if (batch.length < pageSize) break;
          from += pageSize;
        }
        const visitors = allVisitors;

        // Helper to check if an IP should be excluded
        const isExcludedIp = (ipAnon: string | null): boolean => {
          if (!ipAnon || ipAnon === "unknown") return false;
          const prefix = ipAnon.split(".").slice(0, 2).join(".");
          if (vsAdminIpPrefix && prefix === vsAdminIpPrefix) return true;
          if (partnerUpdateIpPrefixes.has(prefix)) return true;
          return false;
        };

        const NORDIC_COUNTRIES = ["SE", "NO", "DK", "FI", "IS"];
        const EUROPEAN_COUNTRIES = [
          "AT", "BE", "BG", "HR", "CY", "CZ", "EE", "FR", "DE", "GR", "HU", 
          "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", 
          "SI", "ES", "GB", "CH", "UA", "BY", "RS", "BA", "ME", "MK", "AL"
        ];

        // Filter out preview/development traffic (lovableproject.com visits)
        const filteredVisitors = (visitors || []).filter(v => {
          // The referrer field may contain lovableproject.com URLs from dev previews
          // But more importantly, we check the page_path doesn't come from preview
          // Preview traffic is identified by referrers from lovableproject.com or lovable.dev
          if (v.referrer) {
            const ref = v.referrer.toLowerCase();
            if (ref.includes("lovableproject.com") || ref.includes("lovable.dev") || ref.includes("lovable.app")) return false;
          }
          return true;
        });

        // Calculate unique sessions
        const uniqueSessions = new Set(filteredVisitors.map(v => v.session_id).filter(Boolean));
        const totalUniqueVisitors = uniqueSessions.size || filteredVisitors.length;
        const totalPageViews = filteredVisitors.length;

        // Calculate stats using filtered visitors
        const swedishVisitors = filteredVisitors.filter(v => v.geo_country_code === "SE") || [];
        const nordicVisitors = filteredVisitors.filter(v => 
          NORDIC_COUNTRIES.includes(v.geo_country_code) && v.geo_country_code !== "SE"
        ) || [];
        const europeanVisitors = filteredVisitors.filter(v => 
          EUROPEAN_COUNTRIES.includes(v.geo_country_code)
        ) || [];
        const otherVisitors = filteredVisitors.filter(v => 
          v.geo_country_code && 
          !NORDIC_COUNTRIES.includes(v.geo_country_code) && 
          !EUROPEAN_COUNTRIES.includes(v.geo_country_code)
        ) || [];

        // Unique sessions per geo category
        const swedishSessions = new Set(swedishVisitors.map(v => v.session_id).filter(Boolean)).size;
        const nordicSessions = new Set(nordicVisitors.map(v => v.session_id).filter(Boolean)).size;
        const europeanSessions = new Set(europeanVisitors.map(v => v.session_id).filter(Boolean)).size;
        const otherSessions = new Set(otherVisitors.map(v => v.session_id).filter(Boolean)).size;

        // Swedish bounce rate
        const swedishBounces = swedishVisitors.filter(v => v.is_bounce === true).length;
        const swedishBounceRate = swedishVisitors.length > 0 
          ? Math.round((swedishBounces / swedishVisitors.length) * 100) 
          : 0;

        // Average time on page (Swedish visitors), capped at 600s to exclude outliers
        const MAX_TIME = 600;
        const validTimes = swedishVisitors
          .filter(v => v.time_on_page_seconds && v.time_on_page_seconds > 0)
          .map(v => Math.min(v.time_on_page_seconds, MAX_TIME));
        const avgTimeOnPage = validTimes.length > 0
          ? Math.round(validTimes.reduce((sum, t) => sum + t, 0) / validTimes.length)
          : 0;

        // Top pages (Swedish visitors) - count unique sessions per page
        const pageCount: Record<string, Set<string>> = {};
        swedishVisitors.forEach(v => {
          if (!pageCount[v.page_path]) pageCount[v.page_path] = new Set();
          if (v.session_id) pageCount[v.page_path].add(v.session_id);
          else pageCount[v.page_path].add(v.id); // fallback for rows without session
        });
        const topPages = Object.entries(pageCount)
          .map(([path, sessionsSet]) => ({ path, visits: sessionsSet.size }))
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

        // Partner profile visits (filtered by IP) - unique sessions
        const partnerProfileVisits: Record<string, Set<string>> = {};
        for (const v of filteredVisitors || []) {
          if (v.page_path?.startsWith("/partner/") && !isExcludedIp(v.ip_anonymized)) {
            const slug = v.page_path.replace("/partner/", "").replace(/\/$/, "");
            const partnerName = slugToName[slug];
            if (partnerName) {
              if (!partnerProfileVisits[partnerName]) partnerProfileVisits[partnerName] = new Set();
              partnerProfileVisits[partnerName].add(v.session_id || v.id);
            }
          }
        }
        const partnerProfileStats = Object.entries(partnerProfileVisits)
          .map(([name, sessionsSet]) => ({ name, visits: sessionsSet.size }))
          .sort((a, b) => b.visits - a.visits);

        // Partner clicks (website clicks) within date range, filtered by IP
        const { data: clickData } = await supabase
          .from("partner_clicks")
          .select("partner_name, clicked_at, ip_address_anonymized")
          .gte("clicked_at", startDate)
          .order("clicked_at", { ascending: false });

        // Historical partner name aliases
        const partnerAliases: Record<string, string> = {
          "Bisqo": "Bisqo AB",
          "B3 Elevate": "B3 Elevate",
          "Nexer": "Nexer",
        };

        const partnerClickCounts: Record<string, number> = {};
        for (const click of clickData || []) {
          const ipPrefix = click.ip_address_anonymized
            ? click.ip_address_anonymized.split(".").slice(0, 2).join(".")
            : "";
          if (vsAdminIpPrefix && ipPrefix === vsAdminIpPrefix) continue;
          if (ipPrefix && partnerUpdateIpPrefixes.has(ipPrefix)) continue;
          
          const name = partnerAliases[click.partner_name] || click.partner_name;
          partnerClickCounts[name] = (partnerClickCounts[name] || 0) + 1;
        }
        const partnerClickStats = Object.entries(partnerClickCounts)
          .map(([name, clicks]) => ({ name, clicks }))
          .sort((a, b) => b.clicks - a.clicks);

        // Partner event clicks within date range
        const partnerEventVisits: Record<string, number> = {};
        for (const v of visitors || []) {
          if (v.page_path?.startsWith("/events/") && !isExcludedIp(v.ip_anonymized)) {
            const eventSlug = v.page_path.replace("/events/", "").replace(/\/$/, "");
            if (eventSlug && eventSlug !== "") {
              partnerEventVisits[eventSlug] = (partnerEventVisits[eventSlug] || 0) + 1;
            }
          }
        }

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
          partnerProfileStats,
          partnerClickStats,
        };

        return new Response(
          JSON.stringify({ stats }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "email-logs": {
        const { limit: logLimit = 100, offset: logOffset = 0, statusFilter } = data;
        let query = supabase
          .from("email_send_log")
          .select("*")
          .order("created_at", { ascending: false })
          .range(logOffset, logOffset + logLimit - 1);
        
        if (statusFilter && statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }

        const { data: logs, error: logError } = await query;
        if (logError) throw logError;

        // Get total count
        let countQuery = supabase
          .from("email_send_log")
          .select("id", { count: "exact", head: true });
        if (statusFilter && statusFilter !== "all") {
          countQuery = countQuery.eq("status", statusFilter);
        }
        const { count } = await countQuery;

        return new Response(
          JSON.stringify({ logs, total: count }),
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
