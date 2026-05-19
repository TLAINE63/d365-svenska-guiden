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

      case "partner-view-stats": {
        const { partnerSlug, partnerName } = data;

        if (!partnerSlug || typeof partnerSlug !== "string") {
          return new Response(
            JSON.stringify({ error: "partnerSlug krävs" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
        const since90 = new Date(Date.now() - 90 * 86400000).toISOString();

        const { data: views, error: viewsError } = await supabase
          .from("partner_profile_views")
          .select("view_type, page_source, viewed_at")
          .eq("partner_slug", partnerSlug)
          .gte("viewed_at", since90);

        if (viewsError) throw viewsError;

        let websiteClicks: Array<{ page_source: string | null; clicked_at: string }> = [];
        if (partnerName && typeof partnerName === "string") {
          const { data: clickRows, error: clicksError } = await supabase
            .from("partner_clicks")
            .select("page_source, clicked_at")
            .eq("partner_name", partnerName)
            .gte("clicked_at", since90);

          if (clicksError) throw clicksError;
          websiteClicks = clickRows || [];
        }

        const aggregateSources = (rows: Array<{ page_source: string | null }>) => {
          const map = new Map<string, number>();
          for (const r of rows) {
            const key = r.page_source || "(okänd)";
            map.set(key, (map.get(key) || 0) + 1);
          }
          return Array.from(map.entries())
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        };

        const cardClicks = (views || []).filter((v) => v.view_type === "card_click");
        const profileVisits = (views || []).filter((v) => v.view_type === "profile_visit");
        const cardClicks30 = cardClicks.filter((v) => v.viewed_at >= since30);
        const profileVisits30 = profileVisits.filter((v) => v.viewed_at >= since30);
        const websiteClicks30 = websiteClicks.filter((v) => v.clicked_at >= since30);

        return new Response(
          JSON.stringify({
            stats: {
              cardClicks30d: cardClicks30.length,
              cardClicks90d: cardClicks.length,
              profileVisits30d: profileVisits30.length,
              profileVisits90d: profileVisits.length,
              websiteClicks30d: websiteClicks30.length,
              websiteClicks90d: websiteClicks.length,
              topSourcesCardClicks: aggregateSources(cardClicks),
              topSourcesProfileVisits: aggregateSources(profileVisits),
              topSourcesWebsiteClicks: aggregateSources(websiteClicks),
            },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "visitor-stats": {
        const { startDate, excludePartnerTraffic } = data;

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

        // Fetch published partners for slug-to-name mapping AND domain extraction
        const { data: pubPartners } = await supabase
          .from("partners")
          .select("name, slug, website, email")
          .eq("is_featured", true);
        const slugToName: Record<string, string> = {};
        const partnerDomains = new Set<string>();
        const partnerNameKeywords: string[] = [];
        for (const p of pubPartners || []) {
          slugToName[p.slug] = p.name;
          // Extract domain from website for org matching
          if (p.website) {
            try {
              const domain = new URL(p.website).hostname.replace(/^www\./, "").toLowerCase();
              partnerDomains.add(domain);
              // Also add the main part (e.g., "nemely" from "nemely.se")
              const mainPart = domain.split(".")[0];
              if (mainPart && mainPart.length > 2) partnerNameKeywords.push(mainPart.toLowerCase());
            } catch { /* ignore invalid URLs */ }
          }
          if (p.email) {
            const emailDomain = p.email.split("@")[1]?.toLowerCase();
            if (emailDomain) partnerDomains.add(emailDomain);
          }
          // Add partner name as keyword for org matching
          if (p.name) {
            partnerNameKeywords.push(p.name.toLowerCase());
          }
        }
        
        // Fetch all visitor analytics from the specified date (paginated to avoid 1000-row limit)
        // Select only required columns to avoid response size truncation that can cut pagination short.
        let allVisitors: any[] = [];
        let from = 0;
        const pageSize = 1000;
        while (true) {
          let q = supabase
            .from("visitor_analytics")
            .select("id, session_id, visited_at, page_path, referrer, ip_anonymized, geo_org, geo_country_code, geo_country, geo_region, geo_city, is_bounce, time_on_page_seconds")
            .order("visited_at", { ascending: false })
            .range(from, from + pageSize - 1);
          if (startDate) q = q.gte("visited_at", startDate);
          const { data: batch, error: batchError } = await q;
          if (batchError) throw batchError;
          if (!batch || batch.length === 0) break;
          allVisitors = allVisitors.concat(batch);
          if (batch.length < pageSize) break;
          from += pageSize;
        }
        console.log(`[visitor-stats] Fetched ${allVisitors.length} rows since ${startDate ?? "start"}`);
        const visitors = allVisitors;

        // Helper to check if visitor is from a partner organization
        const isPartnerOrg = (geoOrg: string | null): boolean => {
          if (!geoOrg || !excludePartnerTraffic) return false;
          const orgLower = geoOrg.toLowerCase();
          // Check if org contains any partner domain or name keyword
          for (const keyword of partnerNameKeywords) {
            if (orgLower.includes(keyword)) return true;
          }
          for (const domain of partnerDomains) {
            if (orgLower.includes(domain.split(".")[0])) return true;
          }
          return false;
        };

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

        // Filter out preview/development traffic AND optionally partner traffic
        const filteredVisitors = (visitors || []).filter(v => {
          if (v.referrer) {
            const ref = v.referrer.toLowerCase();
            if (ref.includes("lovableproject.com") || ref.includes("lovable.dev") || ref.includes("lovable.app")) return false;
          }
          // Filter partner employee traffic by org
          if (excludePartnerTraffic && isPartnerOrg(v.geo_org)) return false;
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
        let clickQuery = supabase
          .from("partner_clicks")
          .select("partner_name, clicked_at, ip_address_anonymized")
          .order("clicked_at", { ascending: false });
        if (startDate) clickQuery = clickQuery.gte("clicked_at", startDate);
        const { data: clickData } = await clickQuery;

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
        for (const v of filteredVisitors || []) {
          if (v.page_path?.startsWith("/events/") && !isExcludedIp(v.ip_anonymized)) {
            const eventSlug = v.page_path.replace("/events/", "").replace(/\/$/, "");
            if (eventSlug && eventSlug !== "") {
              partnerEventVisits[eventSlug] = (partnerEventVisits[eventSlug] || 0) + 1;
            }
          }
        }

        // Daily unique visitors trend (by date, unique sessions)
        const dailyVisitorMap: Record<string, Set<string>> = {};
        for (const v of filteredVisitors) {
          const day = v.visited_at ? v.visited_at.substring(0, 10) : null;
          if (!day) continue;
          if (!dailyVisitorMap[day]) dailyVisitorMap[day] = new Set();
          dailyVisitorMap[day].add(v.session_id || v.id);
        }
        const dailyVisitors = Object.entries(dailyVisitorMap)
          .map(([date, sessions]) => ({ date, visitors: sessions.size }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Sales summary page-path counts (pageviews) using the same filtered set
        let komIgangCount = 0;
        let valjPartnerCount = 0;
        let analysisCount = 0;
        for (const v of filteredVisitors) {
          const p = v.page_path || "";
          if (p.startsWith("/kom-igang")) komIgangCount++;
          if (p.startsWith("/valjdynamics365partner")) valjPartnerCount++;
          if (p.includes("behovsanalys") || p.includes("kravspec") || p.includes("ai-readiness")) analysisCount++;
        }

        const stats = {
          totalVisitors: totalUniqueVisitors,
          totalPageViews: totalPageViews,
          publishedPartners: (pubPartners || []).length,
          swedishVisitors: swedishSessions || swedishVisitors.length,
          nordicVisitors: nordicSessions || nordicVisitors.length,
          europeanVisitors: europeanSessions || europeanVisitors.length,
          otherVisitors: otherSessions || otherVisitors.length,
          swedishBounceRate,
          avgTimeOnPage,
          topPages,
          topCities,
          partnerProfileStats,
          partnerClickStats,
          dailyVisitors,
          komIgangCount,
          valjPartnerCount,
          analysisCount,
        };

        return new Response(
          JSON.stringify({ stats }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "email-logs": {
        const { limit: logLimit = 100, offset: logOffset = 0, statusFilter, templateFilter } = data;
        let query = supabase
          .from("email_send_log")
          .select("*")
          .order("created_at", { ascending: false })
          .range(logOffset, logOffset + logLimit - 1);
        
        if (statusFilter && statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }
        if (templateFilter && templateFilter !== "all") {
          query = query.eq("template_name", templateFilter);
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
        if (templateFilter && templateFilter !== "all") {
          countQuery = countQuery.eq("template_name", templateFilter);
        }
        const { count } = await countQuery;

        return new Response(
          JSON.stringify({ logs, total: count }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "page-path-counts": {
        const { startDate: pStart = null } = data;
        const runCount = async (filter: (q: any) => any) => {
          let q = supabase.from("visitor_analytics").select("id", { count: "exact", head: true });
          q = filter(q);
          if (pStart) q = q.gte("visited_at", pStart);
          const { count, error } = await q;
          if (error) throw error;
          return count || 0;
        };
        const [komIgang, valjPartner, analysisTotal] = await Promise.all([
          runCount((q) => q.like("page_path", "/kom-igang%")),
          runCount((q) => q.like("page_path", "/valjdynamics365partner%")),
          runCount((q) => q.or("page_path.like.%behovsanalys%,page_path.like.%kravspec%,page_path.like.%ai-readiness%")),
        ]);
        return new Response(
          JSON.stringify({ komIgang, valjPartner, analysisTotal }),
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
