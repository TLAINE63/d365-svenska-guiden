import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se", "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173", "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}
function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string) {
  let b = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return b;
}
function b64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [h, p, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch { return false; }
}

function esc(s: any): string {
  if (s == null) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long" });
}

function previousMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  return { start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10) };
}

interface CompanyEntry {
  organisation_uuid: string;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_country: string | null;
  visit_count: number;
  sessions: {
    started_at: string | null;
    profile_urls: string[];
    other_urls: string[];
  }[];
}

const PRODUCT_LABELS: Record<string, string> = {
  "/business-central": "Business Central",
  "/finance-supply-chain": "Finance & Supply Chain",
  "/d365-sales": "Sales (CRM)",
  "/d365-customer-service": "Customer Service",
  "/d365-field-service": "Field Service",
  "/d365-marketing": "Customer Insights – Journeys",
  "/d365-contact-center": "Contact Center",
  "/crm": "CRM-översikt",
  "/erp-oversikt": "ERP-översikt",
  "/agents": "AI-agenter",
  "/copilot": "Copilot",
  "/ai-oversikt": "AI-översikt",
  "/branschlosningar": "Branschlösningar",
  "/valj-partner": "Välj partner",
  "/kom-igang": "Kom igång",
  "/kunskapscenter": "Kunskapscenter",
  "/": "Startsidan",
};
function labelForPath(path: string): string {
  if (PRODUCT_LABELS[path]) return PRODUCT_LABELS[path];
  const stripped = path.replace(/\/$/, "");
  if (PRODUCT_LABELS[stripped]) return PRODUCT_LABELS[stripped];
  return path;
}

function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || "").join("") || "?";
}

function buildEmailHtml(opts: {
  partnerName: string;
  partnerSlug: string;
  intro: string;
  companies: CompanyEntry[];
  periodLabel: string;
  siteOrigin: string;
}): string {
  const { partnerName, partnerSlug, intro, companies, periodLabel, siteOrigin } = opts;
  const profileUrl = `${siteOrigin}/partner/${partnerSlug}`;
  const totalVisits = companies.reduce((s, c) => s + c.visit_count, 0);
  const withIndustry = companies.filter(c => c.company_industry).length;

  const meta = (c: CompanyEntry) =>
    [c.company_domain, c.company_industry, c.company_size, c.company_country]
      .filter(Boolean)
      .map(v => `<span style="display:inline-block;background:#f1f5f9;color:#475569;font-size:11px;padding:3px 8px;border-radius:999px;margin:2px 4px 0 0">${esc(v as string)}</span>`)
      .join("");

  const rows = companies.map((c, idx) => {
    const allOther = new Set<string>();
    c.sessions.forEach(s => s.other_urls.forEach(u => allOther.add(u)));
    const otherList = Array.from(allOther).slice(0, 6).map(u => {
      try {
        const url = new URL(u);
        const label = url.pathname === "/" ? "Startsidan" : labelForPath(url.pathname);
        return `<li style="margin:3px 0;font-size:13px;color:#475569"><a href="${esc(u)}" style="color:#1e3a5f;text-decoration:none">${esc(label)}</a></li>`;
      } catch { return ""; }
    }).join("");

    const domainLink = c.company_domain
      ? `<a href="https://${esc(c.company_domain)}" style="color:#64748b;text-decoration:none;font-size:12px">${esc(c.company_domain)} ↗</a>`
      : "";

    return `
      <tr><td style="padding:0 0 14px">
        <table style="width:100%;border-collapse:separate;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <tr>
            <td style="padding:18px 20px;vertical-align:top">
              <table style="width:100%;border-collapse:collapse"><tr>
                <td style="vertical-align:top;width:48px;padding-right:14px">
                  <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#1e3a5f,#2d5a87);color:#fff;font-weight:700;font-size:16px;text-align:center;line-height:44px;font-family:-apple-system,'Segoe UI',sans-serif">${esc(initials(c.company_name))}</div>
                </td>
                <td style="vertical-align:top">
                  <div style="font-weight:700;font-size:16px;color:#0f172a;line-height:1.3">${esc(c.company_name || "Okänt företag")}</div>
                  ${domainLink ? `<div style="margin-top:2px">${domainLink}</div>` : ""}
                  <div style="margin-top:8px">${meta(c)}</div>
                </td>
                <td style="vertical-align:top;text-align:right;white-space:nowrap;padding-left:12px">
                  <div style="display:inline-block;background:#fff7ed;color:#9a3412;border-radius:999px;padding:4px 12px;font-weight:600;font-size:12px">${c.visit_count} besök</div>
                </td>
              </tr></table>
              ${otherList ? `
                <div style="margin-top:14px;padding-top:14px;border-top:1px dashed #e2e8f0">
                  <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px">Andra sidor de tittade på</div>
                  <ul style="margin:0;padding-left:18px">${otherList}</ul>
                </div>` : ""}
            </td>
          </tr>
        </table>
      </td></tr>`;
  }).join("");

  const stat = (label: string, value: string | number, color: string) => `
    <td style="padding:16px 12px;text-align:center;background:#f8fafc;border-radius:10px;width:33%">
      <div style="font-size:28px;font-weight:700;color:${color};line-height:1">${value}</div>
      <div style="font-size:11px;color:#64748b;margin-top:6px;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
    </td>`;

  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="utf-8"><title>Besöksrapport ${esc(partnerName)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
  <div style="max-width:660px;margin:0 auto;padding:24px 16px">

    <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a87 100%);color:#fff;padding:28px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;opacity:0.85;letter-spacing:1.2px;text-transform:uppercase">D365.se · Besöksrapport</div>
      <h1 style="margin:6px 0 4px;font-size:24px;line-height:1.25">${esc(partnerName)}</h1>
      <div style="font-size:14px;opacity:0.9">Period: ${esc(periodLabel)}</div>
    </div>

    <div style="background:#ffffff;padding:28px;border-radius:0 0 14px 14px;box-shadow:0 1px 3px rgba(15,23,42,0.06)">

      <p style="margin:0 0 22px;color:#334155;font-size:15px;line-height:1.55">${esc(intro)}</p>

      <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin:0 0 24px">
        <tr>
          ${stat("Identifierade företag", companies.length, "#1e3a5f")}
          ${stat("Profilbesök totalt", totalVisits, "#2d5a87")}
          ${stat("Med branschdata", withIndustry, "#ea580c")}
        </tr>
      </table>

      <h2 style="margin:0 0 14px;font-size:17px;color:#0f172a">Företag som besökt er profil</h2>

      <table style="width:100%;border-collapse:collapse">
        ${rows || `<tr><td style="padding:24px;color:#94a3b8;text-align:center;background:#f8fafc;border-radius:10px">Inga identifierade besök denna period.</td></tr>`}
      </table>

      <div style="margin:22px 0 0;padding:16px 18px;background:#f8fafc;border-left:4px solid #1e3a5f;border-radius:6px">
        <div style="color:#475569;font-size:13px;line-height:1.55">
          <strong style="color:#0f172a">Hur tolkar vi datan?</strong> Listan visar bara företag som Snitcher har sett besöka <em>just er partnerprofil</em> (<code style="background:#e2e8f0;padding:1px 5px;border-radius:4px;font-size:12px">/partner/${esc(partnerSlug)}</code>) på d365.se. "Andra sidor" visar vilka produktområden samma företag tittade på i samma session – ofta en signal om vad de undersöker.
        </div>
      </div>

      <div style="text-align:center;margin:26px 0 8px">
        <a href="${esc(profileUrl)}" style="display:inline-block;background:#1e3a5f;color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-weight:600;font-size:14px">
          Öppna er partnerprofil →
        </a>
      </div>

      <p style="color:#94a3b8;font-size:11px;line-height:1.55;margin:26px 0 0;text-align:center">
        Identifieringen sker via IP-baserad reverse lookup (Snitcher) och är inte 100 % exakt, men ger en god indikation om vilka företag som varit aktiva. Rapporten skickas månadsvis till partners på d365.se.
      </p>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:11px;margin:16px 0 0">
      D365.se · Den oberoende guiden till Microsoft Dynamics 365
    </p>
  </div>
</body></html>`;
}

async function generateDrafts(supabase: any, opts: { period_start?: string; period_end?: string }) {
  const { start, end } = opts.period_start && opts.period_end
    ? { start: opts.period_start, end: opts.period_end }
    : previousMonthRange();

  const { data: partners, error: pErr } = await supabase
    .from("partners")
    .select("id, slug, name, email, admin_contact_email")
    .eq("is_featured", true);
  if (pErr) throw pErr;

  // Fetch all visits active in period (use session_ended_at = Snitcher last_seen,
  // since pages_visited is cumulative per organisation).
  const { data: visits, error: vErr } = await supabase
    .from("snitcher_visits")
    .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, session_uuid, session_started_at, session_ended_at, visited_urls, partner_slugs")
    .gte("session_ended_at", `${start}T00:00:00Z`)
    .lte("session_ended_at", `${end}T23:59:59Z`);
  if (vErr) throw vErr;

  const visitsBySlug = new Map<string, any[]>();
  for (const v of visits || []) {
    for (const slug of v.partner_slugs || []) {
      if (!visitsBySlug.has(slug)) visitsBySlug.set(slug, []);
      visitsBySlug.get(slug)!.push(v);
    }
  }

  const periodLabel = monthLabel(new Date(`${start}T00:00:00Z`));
  let created = 0, skipped = 0;

  for (const partner of partners || []) {
    const partnerVisits = visitsBySlug.get(partner.slug) || [];
    if (partnerVisits.length === 0) { skipped++; continue; }

    // Group by organisation_uuid
    const byOrg = new Map<string, CompanyEntry>();
    for (const v of partnerVisits) {
      const urls: { url: string }[] = (v.visited_urls || []) as any;
      const profileRe = new RegExp(`/partner/${partner.slug}(?:/|$|\\?)`, "i");
      const profile_urls = urls.map(u => u.url).filter(u => profileRe.test(u));
      const other_urls = urls.map(u => u.url).filter(u => !profileRe.test(u));

      let entry = byOrg.get(v.organisation_uuid);
      if (!entry) {
        entry = {
          organisation_uuid: v.organisation_uuid,
          company_name: v.company_name,
          company_domain: v.company_domain,
          company_industry: v.company_industry,
          company_size: v.company_size,
          company_country: v.company_country,
          visit_count: 0,
          sessions: [],
        };
        byOrg.set(v.organisation_uuid, entry);
      }
      entry.visit_count++;
      entry.sessions.push({
        started_at: v.session_started_at,
        profile_urls,
        other_urls,
      });
    }

    const companies = Array.from(byOrg.values()).sort((a,b) => b.visit_count - a.visit_count);
    const recipient = partner.admin_contact_email || partner.email;

    const subject = `Besöksrapport ${periodLabel} – ${companies.length} identifierade företag`;
    const intro = `Här kommer din månadsrapport för ${periodLabel}. Under perioden identifierades ${companies.length} företag som besökt din profil på d365.se. Rapporten visar även vilka andra sidor besökarna tittade på i samma session – ofta en signal om vilka produktområden de undersöker.`;

    const { error: upErr } = await supabase
      .from("partner_report_drafts")
      .upsert({
        partner_id: partner.id,
        partner_slug: partner.slug,
        partner_name: partner.name,
        recipient_email: recipient,
        period_start: start,
        period_end: end,
        subject,
        intro_text: intro,
        companies,
        status: "pending_review",
      }, { onConflict: "partner_slug,period_start" });
    if (upErr) console.error("Draft upsert error", partner.slug, upErr);
    else created++;
  }

  return { created, skipped, period_start: start, period_end: end };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, token, ...data } = await req.json();
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!(await verifyJWT(token || "", JWT_SECRET))) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    switch (action) {
      case "list": {
        const { period_start } = data;
        let query = supabase.from("partner_report_drafts").select("*").order("created_at", { ascending: false });
        if (period_start) query = query.eq("period_start", period_start);
        const { data: drafts, error } = await query;
        if (error) throw error;
        return new Response(JSON.stringify({ drafts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "explore": {
        // Returns per-partner aggregation of identified companies + URLs for a date range.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const range = period_start && period_end
          ? { start: period_start, end: period_end }
          : previousMonthRange();

        const { data: visits, error: vErr } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, session_started_at, session_ended_at, visited_urls, partner_slugs")
          .gte("session_ended_at", `${range.start}T00:00:00Z`)
          .lte("session_ended_at", `${range.end}T23:59:59Z`);
        if (vErr) throw vErr;

        const { data: partners, error: pErr } = await supabase
          .from("partners")
          .select("id, slug, name, is_featured");
        if (pErr) throw pErr;
        const partnerBySlug = new Map<string, any>();
        for (const p of partners || []) partnerBySlug.set(p.slug, p);

        const bySlug = new Map<string, { partner_slug: string; partner_name: string; is_featured: boolean; companies: Map<string, any> }>();

        for (const v of visits || []) {
          const urls: { url: string }[] = (v.visited_urls || []) as any;
          for (const slug of v.partner_slugs || []) {
            const partner = partnerBySlug.get(slug);
            let bucket = bySlug.get(slug);
            if (!bucket) {
              bucket = {
                partner_slug: slug,
                partner_name: partner?.name || slug,
                is_featured: !!partner?.is_featured,
                companies: new Map(),
              };
              bySlug.set(slug, bucket);
            }
            const profileRe = new RegExp(`/partner/${slug}(?:/|$|\\?)`, "i");
            const profile_urls = urls.map(u => u.url).filter(u => profileRe.test(u));
            const other_urls = urls.map(u => u.url).filter(u => !profileRe.test(u));

            let entry = bucket.companies.get(v.organisation_uuid);
            if (!entry) {
              entry = {
                organisation_uuid: v.organisation_uuid,
                company_name: v.company_name,
                company_domain: v.company_domain,
                company_industry: v.company_industry,
                company_size: v.company_size,
                company_country: v.company_country,
                first_seen: v.session_started_at,
                last_seen: v.session_ended_at,
                profile_urls: new Set<string>(),
                other_urls: new Set<string>(),
              };
              bucket.companies.set(v.organisation_uuid, entry);
            }
            profile_urls.forEach((u: string) => entry.profile_urls.add(u));
            other_urls.forEach((u: string) => entry.other_urls.add(u));
            if (v.session_ended_at && (!entry.last_seen || v.session_ended_at > entry.last_seen)) entry.last_seen = v.session_ended_at;
          }
        }

        const partners_out = Array.from(bySlug.values())
          .map(b => ({
            partner_slug: b.partner_slug,
            partner_name: b.partner_name,
            is_featured: b.is_featured,
            companies: Array.from(b.companies.values()).map((c: any) => ({
              ...c,
              profile_urls: Array.from(c.profile_urls),
              other_urls: Array.from(c.other_urls),
            })).sort((a: any, b: any) => b.profile_urls.length - a.profile_urls.length),
          }))
          .sort((a, b) => b.companies.length - a.companies.length);

        return new Response(JSON.stringify({
          period_start: range.start,
          period_end: range.end,
          partners: partners_out,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "list_all_visitors": {
        // Returns all identified companies (Snitcher) for a date range, regardless of partner visit.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const range = period_start && period_end
          ? { start: period_start, end: period_end }
          : previousMonthRange();

        const { data: visits, error: vErr } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, company_logo_url, session_started_at, session_ended_at, visited_urls, partner_slugs, synced_at")
          .gte("session_ended_at", `${range.start}T00:00:00Z`)
          .lte("session_ended_at", `${range.end}T23:59:59Z`)
          .order("session_ended_at", { ascending: false })
          .limit(2000);
        if (vErr) throw vErr;

        // Aggregate per organisation_uuid (one row per company in the range)
        const byOrg = new Map<string, any>();
        for (const v of visits || []) {
          const urls: { url: string }[] = (v.visited_urls || []) as any;
          const urlList = urls.map(u => u.url).filter(Boolean);
          let entry = byOrg.get(v.organisation_uuid);
          if (!entry) {
            entry = {
              organisation_uuid: v.organisation_uuid,
              company_name: v.company_name,
              company_domain: v.company_domain,
              company_industry: v.company_industry,
              company_size: v.company_size,
              company_country: v.company_country,
              company_logo_url: v.company_logo_url,
              first_seen: v.session_started_at,
              last_seen: v.session_ended_at,
              partner_slugs: new Set<string>(),
              urls: new Set<string>(),
              session_count: 0,
            };
            byOrg.set(v.organisation_uuid, entry);
          }
          for (const s of v.partner_slugs || []) entry.partner_slugs.add(s);
          urlList.forEach(u => entry.urls.add(u));
          entry.session_count += 1;
          if (v.session_started_at && (!entry.first_seen || v.session_started_at < entry.first_seen)) entry.first_seen = v.session_started_at;
          if (v.session_ended_at && (!entry.last_seen || v.session_ended_at > entry.last_seen)) entry.last_seen = v.session_ended_at;
        }

        const companies = Array.from(byOrg.values())
          .map(c => ({
            ...c,
            partner_slugs: Array.from(c.partner_slugs),
            urls: Array.from(c.urls),
            url_count: c.urls.size,
            visited_partner: c.partner_slugs.size > 0,
          }))
          .sort((a, b) => (b.last_seen || "").localeCompare(a.last_seen || ""));

        return new Response(JSON.stringify({
          period_start: range.start,
          period_end: range.end,
          total: companies.length,
          companies,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "generate": {
        const result = await generateDrafts(supabase, data);
        return new Response(JSON.stringify({ success: true, ...result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }


      case "update": {
        const { id, subject, intro_text, recipient_email, excluded_organisation_uuids, status } = data;
        const update: Record<string, unknown> = {};
        if (subject !== undefined) update.subject = subject;
        if (intro_text !== undefined) update.intro_text = intro_text;
        if (recipient_email !== undefined) update.recipient_email = recipient_email;
        if (excluded_organisation_uuids !== undefined) update.excluded_organisation_uuids = excluded_organisation_uuids;
        if (status !== undefined) update.status = status;
        const { error } = await supabase.from("partner_report_drafts").update(update).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "send": {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
        const resend = new Resend(RESEND_API_KEY);

        const { ids } = data as { ids: string[] };
        if (!Array.isArray(ids) || ids.length === 0) {
          return new Response(JSON.stringify({ error: "Inga utkast valda" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const { data: drafts, error: dErr } = await supabase
          .from("partner_report_drafts").select("*").in("id", ids);
        if (dErr) throw dErr;

        const results: any[] = [];
        for (const d of drafts || []) {
          if (!d.recipient_email) {
            await supabase.from("partner_report_drafts").update({ status: "failed", error_message: "Saknar mottagaradress" }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: "no_recipient" });
            continue;
          }
          const excluded = new Set<string>(d.excluded_organisation_uuids || []);
          const companies: CompanyEntry[] = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
          if (companies.length === 0) {
            await supabase.from("partner_report_drafts").update({ status: "skipped", error_message: "Inga företag att rapportera efter exkludering" }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: "empty_after_exclusions" });
            continue;
          }
          const html = buildEmailHtml({
            partnerName: d.partner_name,
            partnerSlug: d.partner_slug,
            intro: d.intro_text || "",
            companies,
            periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
            siteOrigin: "https://www.d365.se",
          });

          try {
            const { error: sendErr } = await resend.emails.send({
              from: "D365.se Rapporter <noreply@d365.se>",
              to: [d.recipient_email],
              subject: d.subject,
              html,
            });
            if (sendErr) throw new Error(sendErr.message || JSON.stringify(sendErr));

            await supabase.from("partner_report_drafts").update({
              status: "sent", sent_at: new Date().toISOString(), error_message: null,
            }).eq("id", d.id);
            await supabase.from("email_send_log").insert({
              recipient_email: d.recipient_email,
              template_name: "partner-monthly-report",
              subject: d.subject,
              status: "sent",
              metadata: { partner_slug: d.partner_slug, period_start: d.period_start, companies: companies.length },
            });
            results.push({ id: d.id, ok: true });
          } catch (e: any) {
            await supabase.from("partner_report_drafts").update({
              status: "failed", error_message: e.message || String(e),
            }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: e.message });
          }
        }

        return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "delete": {
        const { id } = data;
        const { error } = await supabase.from("partner_report_drafts").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "preview-html": {
        const { id } = data;
        const { data: d, error } = await supabase.from("partner_report_drafts").select("*").eq("id", id).single();
        if (error || !d) throw error || new Error("Hittades ej");
        const excluded = new Set<string>(d.excluded_organisation_uuids || []);
        const companies = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
        const html = buildEmailHtml({
          partnerName: d.partner_name,
          partnerSlug: d.partner_slug,
          intro: d.intro_text || "",
          companies,
          periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
          siteOrigin: "https://www.d365.se",
        });
        return new Response(JSON.stringify({ html }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      default:
        return new Response(JSON.stringify({ error: "Okänd action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
  } catch (e: any) {
    console.error("manage-partner-reports error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }
    });
  }
});
