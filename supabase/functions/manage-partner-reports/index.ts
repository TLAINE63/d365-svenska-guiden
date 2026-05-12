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
  const rows = companies.map(c => {
    const allOther = new Set<string>();
    c.sessions.forEach(s => s.other_urls.forEach(u => allOther.add(u)));
    const otherList = Array.from(allOther).slice(0, 8).map(u => {
      try {
        const url = new URL(u);
        return `<li style="color:#cbd5e1;font-size:13px;margin:2px 0"><a href="${esc(u)}" style="color:#fbbf24;text-decoration:none">${esc(url.pathname)}</a></li>`;
      } catch { return ""; }
    }).join("");
    return `
      <tr><td style="padding:14px 16px;border-bottom:1px solid #1e293b">
        <div style="font-weight:600;font-size:15px;color:#f8fafc">${esc(c.company_name || "Okänt företag")}</div>
        <div style="color:#94a3b8;font-size:12px;margin-top:2px">
          ${[c.company_domain, c.company_industry, c.company_size, c.company_country].filter(Boolean).map(esc).join(" • ")}
        </div>
        <div style="color:#cbd5e1;font-size:13px;margin-top:8px">${c.visit_count} besök på din profil</div>
        ${otherList ? `<div style="margin-top:8px"><div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Andra sidor i samma session</div><ul style="margin:4px 0 0 16px;padding:0">${otherList}</ul></div>` : ""}
      </td></tr>`;
  }).join("");

  return `<!doctype html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:640px;margin:0 auto;padding:32px 16px">
      <div style="background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:16px;padding:32px;color:#f1f5f9">
        <div style="font-size:13px;color:#94a3b8;letter-spacing:1px;text-transform:uppercase">Månadsrapport ${esc(periodLabel)}</div>
        <h1 style="font-size:24px;margin:8px 0 16px;color:#fff">Identifierade företag som besökt din profil</h1>
        <p style="color:#cbd5e1;line-height:1.6;font-size:15px;margin:0 0 24px">${esc(intro)}</p>
        <div style="background:#0b1220;border:1px solid #1e293b;border-radius:12px;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">${rows || `<tr><td style="padding:24px;color:#94a3b8;text-align:center">Inga identifierade besök denna period.</td></tr>`}</table>
        </div>
        <div style="margin-top:28px;text-align:center">
          <a href="${esc(profileUrl)}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">Öppna din profil</a>
        </div>
        <p style="color:#64748b;font-size:12px;line-height:1.5;margin-top:32px;text-align:center">
          Datan kommer från Snitcher som identifierar besökande företag baserat på IP. Identifiering är inte 100% säker men ger en god indikation. Rapporten skickas månadsvis till partners på d365.se.
        </p>
      </div>
    </div></body></html>`;
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
