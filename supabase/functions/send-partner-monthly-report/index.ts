import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function esc(s: any): string {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function fmtDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, "/");
}

const PRODUCT_LABELS: Record<string, string> = {
  "/business-central": "Business Central",
  "/finance-supply-chain": "Finance & Supply Chain",
  "/d365sales": "Sales (CRM)",
  "/d365customerservice": "Customer Service",
  "/d365fieldservice": "Field Service",
  "/d365marketing": "Customer Insights – Journeys",
  "/d365contactcenter": "Contact Center",
  "/crm": "CRM-översikt",
  "/erp-oversikt": "ERP-översikt",
  "/agents": "AI-agenter",
  "/copilot": "Copilot",
  "/aioversikt": "AI-översikt",
  "/branschlosningar": "Branschlösningar",
  "/valjdynamics365partner": "Välj partner",
  "/kom-igang": "Kom igång",
  "/kunskapscenter": "Kunskapscenter",
  "/": "Startsidan",
};

function labelForPath(path: string): string {
  if (PRODUCT_LABELS[path]) return PRODUCT_LABELS[path];
  // Strip trailing slash
  const stripped = path.replace(/\/$/, "");
  if (PRODUCT_LABELS[stripped]) return PRODUCT_LABELS[stripped];
  return path;
}

function aggregateTop(rows: { page_source: string | null }[], limit = 5) {
  const m = new Map<string, number>();
  for (const r of rows) {
    if (!r.page_source) continue;
    // Normalize: ignore querystring/hash
    const path = r.page_source.split("?")[0].split("#")[0];
    m.set(path, (m.get(path) || 0) + 1);
  }
  return Array.from(m.entries())
    .map(([path, count]) => ({ path, label: labelForPath(path), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

interface PartnerStats {
  partner: any;
  profileVisits: number;
  cardClicks: number;
  websiteClicks: number;
  identifiedCompanies: number;
  exposures: number;
  exposuresByPage: { path: string; label: string; count: number }[];
  topFilterContexts: { label: string; count: number }[];
  topReferrers: { label: string; count: number }[];
  topProductPages: { path: string; label: string; count: number }[];
  siteEventsList: number;
  siteEventsDetail: number;
  siteNeedsAnalysis: number;
  siteRequirementsSpec: number;
  siteAssessments: number;
}

function normalizeReferrer(ref: string | null): string | null {
  if (!ref) return null;
  try {
    const u = new URL(ref);
    const h = u.hostname.replace(/^www\./, "");
    if (h.includes("google")) return "Google";
    if (h.includes("bing")) return "Bing";
    if (h.includes("linkedin")) return "LinkedIn";
    if (h.includes("facebook")) return "Facebook";
    if (h.includes("d365.se")) return null; // internal
    return h;
  } catch {
    return null;
  }
}

async function buildStats(supabase: any, partner: any, startIso: string): Promise<PartnerStats> {
  const profilePath = `/partner/${partner.slug}`;
  const [viewsRes, clicksRes, snitcherRes, exposureRes] = await Promise.all([
    supabase
      .from("partner_profile_views")
      .select("view_type, page_source, referrer")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", startIso),
    supabase
      .from("partner_clicks")
      .select("page_source")
      .eq("partner_name", partner.name)
      .gte("clicked_at", startIso),
    supabase
      .from("snitcher_visits")
      .select("company_name, partner_slugs, visited_urls")
      .gte("session_started_at", startIso)
      .limit(2000),
    supabase
      .from("partner_filter_exposures")
      .select("page_path, filter_context")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", startIso),
  ]);

  const views = viewsRes.data || [];
  const clicks = clicksRes.data || [];
  const exposures = exposureRes.data || [];

  const profileVisits = views.filter((v: any) => v.view_type === "profile_visit");
  const cardClicks = views.filter((v: any) => v.view_type === "card_click");

  // Count unique identified companies that visited this partner's profile
  const companyNames = new Set<string>();
  for (const r of snitcherRes.data || []) {
    const partnerSlugs: string[] = Array.isArray(r.partner_slugs) ? r.partner_slugs : [];
    const visitedUrls: string[] = Array.isArray(r.visited_urls)
      ? r.visited_urls.map((u: any) => (typeof u === "string" ? u : u?.url || u?.path || "")).filter(Boolean)
      : [];
    const matched =
      partnerSlugs.includes(partner.slug) ||
      visitedUrls.some((u) => u.includes(profilePath));
    if (!matched) continue;
    const name = (r.company_name || "").trim().toLowerCase();
    if (name) companyNames.add(name);
  }

  // Exposures by page (where partner card was shown after a filter)
  const expPageMap = new Map<string, number>();
  const filterCtxMap = new Map<string, number>();
  for (const e of exposures) {
    const path = (e.page_path || "").split("?")[0].split("#")[0];
    if (path) expPageMap.set(path, (expPageMap.get(path) || 0) + 1);
    const fc = (e.filter_context || {}) as Record<string, string | null>;
    const parts: string[] = [];
    if (fc.product) parts.push(`Produkt: ${fc.product}`);
    if (fc.industry) parts.push(`Bransch: ${fc.industry}`);
    if (fc.geography) parts.push(`Geografi: ${fc.geography}`);
    if (fc.size) parts.push(`Storlek: ${fc.size}`);
    if (parts.length) {
      const label = parts.join(" · ");
      filterCtxMap.set(label, (filterCtxMap.get(label) || 0) + 1);
    }
  }
  const exposuresByPage = Array.from(expPageMap.entries())
    .map(([path, count]) => ({ path, label: labelForPath(path), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topFilterContexts = Array.from(filterCtxMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Referrers from profile views
  const refMap = new Map<string, number>();
  for (const v of views) {
    const r = normalizeReferrer(v.referrer);
    if (r) refMap.set(r, (refMap.get(r) || 0) + 1);
  }
  const topReferrers = Array.from(refMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top product page sources combine all interaction sources (where they came from)
  const allInteractions = [
    ...views.map((v: any) => ({ page_source: v.page_source })),
    ...clicks.map((c: any) => ({ page_source: c.page_source })),
  ];

  // Site-wide engagement signals (not partner-specific) — useful to show ecosystem activity
  // Helps motivate partners to add events and shows demand on tools/assessments.
  async function countPaths(patterns: string[]): Promise<number> {
    let total = 0;
    for (const p of patterns) {
      const { count } = await supabase
        .from("visitor_analytics")
        .select("id", { count: "exact", head: true })
        .gte("visited_at", startIso)
        .like("page_path", p);
      total += count || 0;
    }
    return total;
  }

  const [siteEventsList, siteEventsDetail, siteNeedsAnalysis, siteRequirementsSpec, siteAssessments] = await Promise.all([
    countPaths(["/events", "/events/"]),
    countPaths(["/events/%"]),
    countPaths(["/ERPbehovsanalys%", "/CRMbehovsanalys%", "/kundservice-behovsanalys%", "/behovsanalys%"]),
    countPaths(["/kravspecifikation%"]),
    countPaths(["/ai-readiness%", "/beslutsmognad%", "/Beslutsmognad%"]),
  ]);
  // siteEventsDetail includes the list page pattern in some DBs; subtract list to keep clean
  const eventsDetailOnly = Math.max(0, siteEventsDetail - siteEventsList);

  return {
    partner,
    profileVisits: profileVisits.length,
    cardClicks: cardClicks.length,
    websiteClicks: clicks.length,
    identifiedCompanies: companyNames.size,
    exposures: exposures.length,
    exposuresByPage,
    topFilterContexts,
    topReferrers,
    topProductPages: aggregateTop(allInteractions, 5),
    siteEventsList,
    siteEventsDetail: eventsDetailOnly,
    siteNeedsAnalysis,
    siteRequirementsSpec,
    siteAssessments,
  };
}




function buildHtml(stats: PartnerStats, periodLabel: string, siteOrigin: string): string {
  const { partner, profileVisits, cardClicks, websiteClicks, topProductPages, identifiedCompanies, exposures, exposuresByPage, topFilterContexts, topReferrers } = stats;
  const profileUrl = `${siteOrigin}/partner/${partner.slug}`;
  const totalEngagement = profileVisits + cardClicks + websiteClicks;

  const topRows = topProductPages.length
    ? topProductPages.map((p, i) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eef0f3;color:#94a3b8;font-size:13px;width:30px">${i + 1}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px">
            <div style="font-weight:600">${esc(p.label)}</div>
            <div style="color:#64748b;font-size:12px;font-family:monospace">${esc(p.path)}</div>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;text-align:right;font-weight:600">${p.count}</td>
        </tr>`).join("")
    : `<tr><td colspan="3" style="padding:18px;text-align:center;color:#94a3b8;font-size:13px">Inga produktsidor registrerade under perioden</td></tr>`;

  const stat = (label: string, value: number | string, color: string) => `
    <td style="padding:16px 8px;text-align:center;background:#f8fafc;border-radius:10px">
      <div style="font-size:28px;font-weight:700;color:${color};line-height:1">${value}</div>
      <div style="font-size:11px;color:#64748b;margin-top:6px;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
    </td>`;

  const exposurePagesRows = exposuresByPage.length
    ? exposuresByPage.map((p) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px">
            <div style="font-weight:600">${esc(p.label)}</div>
            <div style="color:#64748b;font-size:11px;font-family:monospace">${esc(p.path)}</div>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px;text-align:right;font-weight:600">${p.count}</td>
        </tr>`).join("")
    : "";

  const filterCtxRows = topFilterContexts.length
    ? topFilterContexts.map((c) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px">${esc(c.label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px;text-align:right;font-weight:600">${c.count}</td>
        </tr>`).join("")
    : "";

  const referrerRows = topReferrers.length
    ? topReferrers.map((r) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px">${esc(r.label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:13px;text-align:right;font-weight:600">${r.count}</td>
        </tr>`).join("")
    : "";


  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><title>Månadsrapport ${esc(partner.name)}</title></head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef2f7" style="background:#eef2f7">
    <tr><td align="center" style="padding:24px 12px">

      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.08)">

        <!-- Header -->
        <tr>
          <td bgcolor="#0f1f3d" style="background-color:#0f1f3d;background:#0f1f3d;padding:28px 28px 24px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="background:#ea580c;width:4px;height:28px;line-height:28px;font-size:0">&nbsp;</td>
                    <td style="padding-left:10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;line-height:1">d365<span style="color:#ea580c">.</span><span style="color:rgba(255,255,255,0.65);font-weight:300">se</span></td>
                  </tr></table>
                </td>
                <td align="right" style="vertical-align:middle;color:#94a3b8;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600">
                  Månadsrapport
                </td>
              </tr>
            </table>

            <div style="height:1px;background:#1e3a5f;margin:20px 0 18px"></div>
            <div style="color:#ffffff;font-size:24px;font-weight:700;line-height:1.2">${esc(partner.name)}</div>
            <div style="color:#cbd5e1;font-size:14px;margin-top:6px">Period: ${esc(periodLabel)}</div>
          </td>
        </tr>

        <!-- Orange accent strip -->
        <tr><td bgcolor="#ea580c" style="background:#ea580c;height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>

        <!-- Body -->
        <tr><td style="padding:28px">

          <p style="margin:0 0 18px;color:#334155;font-size:15px;line-height:1.5">
            Hej! Här kommer er månadsöversikt över aktiviteten på er partnerprofil hos D365.se.
            Totalt registrerade vi <strong>${totalEngagement}</strong> interaktioner kopplade till er under perioden.
          </p>

          <table style="width:100%;border-collapse:separate;border-spacing:6px 0;margin:20px 0">
            <tr>
              ${stat("Exponeringar", exposures, "#0f1f3d")}
              ${stat("Profilbesök", profileVisits, "#1e3a5f")}
              ${stat("Kortklick", cardClicks, "#2d5a87")}
              ${stat("Klick till er sajt", websiteClicks, "#ea580c")}
            </tr>
          </table>

          <p style="margin:18px 0 8px;color:#64748b;font-size:13px;line-height:1.5">
            <strong>Exponeringar</strong> = antal gånger ert kort visades i en filtrerad partnerlista.<br>
            <strong>Profilbesök</strong> = personer som öppnade er fullständiga partnerprofil.<br>
            <strong>Kortklick</strong> = klick på ert partnerkort i sökresultat och listor.<br>
            <strong>Klick till er sajt</strong> = klick på er webblänk eller produktlandningssida.
          </p>

          ${exposurePagesRows ? `
          <h2 style="margin:28px 0 8px;font-size:17px;color:#0f172a">Var visades ert kort?</h2>
          <p style="margin:0 0 12px;color:#64748b;font-size:13px">Sidor där ert partnerkort exponerades efter att en besökare filtrerat.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tbody>${exposurePagesRows}</tbody>
          </table>` : ""}

          ${filterCtxRows ? `
          <h2 style="margin:28px 0 8px;font-size:17px;color:#0f172a">Vilka filter ledde till exponering?</h2>
          <p style="margin:0 0 12px;color:#64748b;font-size:13px">Topp filterkombinationer (bransch, produkt, geografi, storlek) som matchade er profil. Visar vad köparna faktiskt sökte efter.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tbody>${filterCtxRows}</tbody>
          </table>` : ""}

          <h2 style="margin:28px 0 12px;font-size:17px;color:#0f172a">Vad var besökarna intresserade av?</h2>
          <p style="margin:0 0 12px;color:#64748b;font-size:13px">
            Topp 5 sidor på D365.se där besökarna kom från innan de interagerade med er.
          </p>

          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#f8fafc">
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">#</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Produktsida / område</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Antal</th>
              </tr>
            </thead>
            <tbody>${topRows}</tbody>
          </table>

          ${referrerRows ? `
          <h2 style="margin:28px 0 8px;font-size:17px;color:#0f172a">Externa trafikkällor</h2>
          <p style="margin:0 0 12px;color:#64748b;font-size:13px">Externa sajter som skickade besökare till er profil.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tbody>${referrerRows}</tbody>
          </table>` : ""}


          <div style="margin:28px 0 0;padding:18px;background:#fff7ed;border-left:4px solid #ea580c;border-radius:6px">
            <div style="font-weight:600;color:#9a3412;margin-bottom:6px;font-size:14px">Vill ni veta vilka företag som besökt er?</div>
            <div style="color:#7c2d12;font-size:13px;line-height:1.5">
              ${identifiedCompanies > 0
                ? `<div style="margin-bottom:8px;padding:8px 12px;background:#fed7aa;border-radius:4px;color:#7c2d12;font-weight:600">
                    ✓ Vi har identifierat <strong>${identifiedCompanies}</strong> ${identifiedCompanies === 1 ? "företag" : "företag"} som besökt er profil under perioden. Svara på detta mejl så delar vi listan (namn, bransch, storlek).
                  </div>`
                : ""}
              Identifieringen sker via vårt verktyg för uppslag av webbplatsbesökare. Alla besök går inte att koppla till ett företag – t.ex. mobil- eller privattrafik förblir anonym – men för de som identifieras får ni namn, bransch och storlek.
            </div>
          </div>


          <div style="text-align:center;margin:28px 0 8px">
            <a href="${esc(profileUrl)}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-weight:600;font-size:14px">
              Öppna er partnerprofil →
            </a>
          </div>

          <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;text-align:center;line-height:1.5">
            Rapporten genereras automatiskt månadsvis. Har ni frågor eller vill ändra mottagare?<br>
            Svara direkt på detta mejl eller hör av er till <a href="mailto:info@d365.se" style="color:#1e3a5f">info@d365.se</a>.
          </p>
        </td></tr>

        <!-- Footer band -->
        <tr><td bgcolor="#0f1f3d" style="background:#0f1f3d;padding:18px 28px;text-align:center;color:#94a3b8;font-size:11px;letter-spacing:0.5px">
          D365.se · Guiden till Microsoft Dynamics 365-partners
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}


async function sendOne(supabase: any, partner: any, startIso: string, periodLabel: string, siteOrigin: string, dryRun: boolean, overrideRecipient?: string) {
  const recipient = overrideRecipient || partner.admin_contact_email || partner.email;
  if (!recipient) {
    return { partner: partner.name, status: "skipped", reason: "no_recipient" };
  }


  const stats = await buildStats(supabase, partner, startIso);

  // Skip if no activity at all
  if (stats.profileVisits + stats.cardClicks + stats.websiteClicks + stats.exposures === 0) {
    return { partner: partner.name, status: "skipped", reason: "no_activity" };
  }

  const html = buildHtml(stats, periodLabel, siteOrigin);
  const subject = `Månadsrapport för ${partner.name} – ${periodLabel}`;

  if (dryRun) {
    return { partner: partner.name, status: "preview", recipient, stats, html };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "D365 Guiden <info@d365.se>",
      to: [recipient],
      bcc: ["info@d365.se"],
      reply_to: "info@d365.se",
      subject,
      html,
    }),
  });

  const body = await res.json();

  await supabase.from("email_send_log").insert({
    template_name: "partner-monthly-report",
    recipient_email: recipient,
    subject,
    status: res.ok ? "sent" : "failed",
    error_message: res.ok ? null : (body?.message || JSON.stringify(body)),
    metadata: {
      partner_slug: partner.slug,
      partner_name: partner.name,
      period_start: startIso,
      profile_visits: stats.profileVisits,
      card_clicks: stats.cardClicks,
      website_clicks: stats.websiteClicks,
    },
  });

  return {
    partner: partner.name,
    status: res.ok ? "sent" : "failed",
    recipient,
    stats: { profileVisits: stats.profileVisits, cardClicks: stats.cardClicks, websiteClicks: stats.websiteClicks },
    error: res.ok ? undefined : body,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      adminPassword,
      cronSecret,
      partnerSlug,        // optional: send to a single partner
      dryRun = false,     // if true: don't send, return preview HTML
      days = 30,          // lookback window
      siteOrigin = "https://www.d365.se",
      overrideRecipient,  // optional: send to this email instead of partner's
    } = body || {};


    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Auth: either admin password (manual trigger) or cron secret stored in site_settings
    const isAdmin = ADMIN_PASSWORD && adminPassword === ADMIN_PASSWORD;
    let isCron = false;
    if (!isAdmin && cronSecret) {
      const { data: secretRow } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monthly_report_cron_secret")
        .maybeSingle();
      isCron = !!secretRow?.value && secretRow.value === cronSecret;
    }
    if (!isAdmin && !isCron) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startDate = new Date(Date.now() - days * 86400000);
    const startIso = startDate.toISOString();
    const endLabel = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
    const startLabel = startIso.slice(0, 10).replace(/-/g, "/");
    const periodLabel = `${startLabel} – ${endLabel}`;

    // Fetch featured partners
    let query = supabase
      .from("partners")
      .select("id, slug, name, email, admin_contact_email, is_featured")
      .eq("is_featured", true);
    if (partnerSlug) query = query.eq("slug", partnerSlug);

    const { data: partners, error } = await query;
    if (error) throw error;
    if (!partners?.length) {
      return new Response(JSON.stringify({ error: "No partners found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    for (const p of partners) {
      try {
        results.push(await sendOne(supabase, p, startIso, periodLabel, siteOrigin, dryRun, overrideRecipient));
      } catch (e: any) {
        console.error("Partner failed:", p.slug, e);
        results.push({ partner: p.name, status: "error", error: e?.message });
      }
    }

    const summary = {
      total: results.length,
      sent: results.filter(r => r.status === "sent").length,
      skipped: results.filter(r => r.status === "skipped").length,
      failed: results.filter(r => r.status === "failed" || r.status === "error").length,
      preview: results.filter(r => r.status === "preview").length,
    };

    return new Response(JSON.stringify({ summary, results, periodLabel }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-partner-monthly-report error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
