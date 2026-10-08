// Sprint 2: partnersvar (status_token), köparuppföljning efter 14 dagar och adminstatistik per partner.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { Resend } from "npm:resend@2.0.0";
import { inquiryCors } from "../_shared/inquiry-cors.ts";

const NOTIFY = ["info@d365.se", "thomas.laine@dynamicfactory.se"];
const SITE: Record<string, string> = { "d365.se": "https://d365.se", "businesscentral.se": "https://businesscentral.se" };
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status: number, cors: Record<string, string>) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("partner_status"), token: z.string().regex(/^[a-f0-9]{32}$/), s: z.enum(["kontaktad", "offert", "ej_aktuell"]) }),
  z.object({ action: z.literal("buyer_reply"), token: z.string().regex(/^[a-f0-9]{32}$/), answer: z.enum(["ja", "nej"]) }),
  z.object({ action: z.literal("send_followups") }),
  z.object({ action: z.literal("partner_stats"), token: z.string().min(10), month: z.string().regex(/^\d{4}-\d{2}$/) }),
]);

function b64(s: string) { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; }
async function isAdmin(token: string): Promise<boolean> {
  try {
    const [h, p, s] = token.split(".");
    if (!s) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = Uint8Array.from(atob(b64(s)), (c) => c.charCodeAt(0));
    if (!(await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(`${h}.${p}`)))) return false;
    const payload = JSON.parse(atob(b64(p)));
    return payload.role === "admin" && (!payload.exp || payload.exp > Date.now() / 1000);
  } catch { return false; }
}

const SIZE_RE = /size|storlek|employees|anstallda|anställda/i;
const IND_RE = /industry|bransch/i;
function pick(project: Record<string, unknown> | null, re: RegExp): string | null {
  if (!project) return null;
  for (const [k, v] of Object.entries(project)) if (re.test(k) && v) return Array.isArray(v) ? String(v[0]) : String(v);
  return null;
}

Deno.serve(async (req) => {
  const cors = inquiryCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  try {
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: "Ogiltig länk." }, 400, cors);
    const d = parsed.data;

    if (d.action === "partner_status") {
      const { data, error } = await sb.from("inquiry_partners").update({ status: d.s, status_updated_at: new Date().toISOString() })
        .eq("status_token", d.token).select("id").maybeSingle();
      if (error) { console.error(error); return json({ error: "Statusen kunde inte sparas." }, 500, cors); }
      if (!data) return json({ error: "Länken är ogiltig." }, 404, cors);
      return json({ ok: true }, 200, cors);
    }

    if (d.action === "buyer_reply") {
      const { data, error } = await sb.from("inquiries").update({ buyer_reply: d.answer, buyer_replied_at: new Date().toISOString() })
        .eq("followup_token", d.token).select("id, created_at, source_site").maybeSingle();
      if (error) { console.error(error); return json({ error: "Svaret kunde inte sparas." }, 500, cors); }
      if (!data) return json({ error: "Länken är ogiltig." }, 404, cors);
      if (d.answer === "nej") {
        const key = Deno.env.get("RESEND_API_KEY");
        const { data: ip } = await sb.from("inquiry_partners").select("partner_slug, status").eq("inquiry_id", data.id);
        if (key) try {
          await new Resend(key).emails.send({
            from: "d365.se <info@d365.se>", to: NOTIFY, subject: "Köpare har inte fått svar på förfrågan",
            html: `<p>En köpare svarade "Nej, inte ännu" på uppföljningen.</p><p>Förfrågan: ${esc(data.id)} (${esc(String(data.created_at).slice(0, 10))}, ${esc(data.source_site)})</p><p>Partners: ${(ip || []).map((r) => `${esc(r.partner_slug)} (${esc(r.status)})`).join(", ")}</p><p>Kontaktuppgifter finns i adminvyn.</p>`,
          });
        } catch (e) { console.error("notify", e); }
      }
      return json({ ok: true }, 200, cors);
    }

    if (d.action === "send_followups") {
      const provided = (req.headers.get("x-report-cron-secret") || "").trim();
      const { data: secret } = await sb.rpc("report_cron_secret");
      if (!provided || provided !== secret) return json({ error: "unauthorized" }, 401, cors);
      const cutoff = new Date(Date.now() - 14 * 86400000).toISOString();
      const { data: due } = await sb.from("inquiries").select("id, contact_name, email, source_site, followup_token")
        .lte("created_at", cutoff).is("followup_sent_at", null).limit(50);
      const key = Deno.env.get("RESEND_API_KEY");
      if (!key) { console.error("RESEND_API_KEY missing"); return json({ sent: 0 }, 200, cors); }
      const resend = new Resend(key);
      let sent = 0;
      for (const q of due || []) {
        const { data: ip } = await sb.from("inquiry_partners").select("partner_slug").eq("inquiry_id", q.id);
        const slugs = (ip || []).map((r) => r.partner_slug);
        const { data: names } = await sb.from("partners").select("name").in("slug", slugs.length ? slugs : ["-"]);
        const base = `${SITE[q.source_site] || SITE["d365.se"]}/forfragan/svar/${q.followup_token}`;
        const site = q.source_site || "d365.se";
        try {
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: [q.email], subject: "Har ni fått svar på er förfrågan?",
            html: `<p>Hej ${esc(q.contact_name)}, för två veckor sedan skickade ni en förfrågan till ${esc((names || []).map((n) => n.name).join(", "))} via ${esc(site)}. Har ni fått svar?</p>
<p><a href="${base}?svar=ja">Ja, vi har fått svar</a></p><p><a href="${base}?svar=nej">Nej, inte ännu</a></p><p>${esc(site)}</p>`,
          });
          await sb.from("inquiries").update({ followup_sent_at: new Date().toISOString() }).eq("id", q.id);
          sent++;
        } catch (e) { console.error("followup", q.id, e); }
      }
      return json({ sent }, 200, cors);
    }

    // partner_stats (admin)
    if (!(await isAdmin(d.token))) return json({ error: "Ogiltig session" }, 401, cors);
    const start = new Date(`${d.month}-01T00:00:00Z`);
    const end = new Date(start); end.setUTCMonth(end.getUTCMonth() + 1);
    const EVENTS: Record<string, string> = { partner_profile_view: "views", partner_outbound_click: "website", partner_contact_click: "contact", shortlist_add: "shortlist" };
    const events: any[] = [];
    for (let from = 0; from < 100000; from += 1000) {
      const { data } = await sb.from("partner_tracking_events").select("partner_slug, event_name, source_site, product_area")
        .in("event_name", Object.keys(EVENTS)).not("partner_slug", "is", null)
        .gte("created_at", start.toISOString()).lt("created_at", end.toISOString()).range(from, from + 999);
      events.push(...(data || []));
      if (!data || data.length < 1000) break;
    }
    const { data: ips } = await sb.from("inquiry_partners").select("partner_slug, status, inquiries!inner(source_site, product_area, project, created_at)")
      .gte("inquiries.created_at", start.toISOString()).lt("inquiries.created_at", end.toISOString());
    type Row = { views: number; website: number; contact: number; shortlist: number; inquiries: number; answered: number; products: Record<string, number>; industries: Record<string, number>; sizes: Record<string, number> };
    const blank = (): Row => ({ views: 0, website: 0, contact: 0, shortlist: 0, inquiries: 0, answered: 0, products: {}, industries: {}, sizes: {} });
    const out: Record<string, Record<string, Row>> = {};
    const get = (slug: string, site: string) => {
      out[slug] ??= {};
      const s = site === "businesscentral.se" ? "businesscentral.se" : "d365.se";
      return [out[slug][s] ??= blank(), out[slug].total ??= blank()];
    };
    const inc = (m: Record<string, number>, k: string | null) => { if (k) m[k] = (m[k] || 0) + 1; };
    for (const e of events) for (const r of get(e.partner_slug, e.source_site)) {
      (r as any)[EVENTS[e.event_name]]++;
      if (e.event_name === "partner_profile_view") inc(r.products, e.product_area);
    }
    for (const ip of (ips || []) as any[]) {
      const q = ip.inquiries;
      for (const r of get(ip.partner_slug, q.source_site)) {
        r.inquiries++;
        if (ip.status && ip.status !== "skickad") r.answered++;
        inc(r.products, q.product_area); inc(r.industries, pick(q.project, IND_RE)); inc(r.sizes, pick(q.project, SIZE_RE));
      }
    }
    const { data: partners } = await sb.from("partners").select("slug, name").in("slug", Object.keys(out).length ? Object.keys(out) : ["-"]);
    const nameOf = new Map((partners || []).map((p) => [p.slug, p.name]));
    return json({ month: d.month, partners: Object.entries(out).map(([slug, sites]) => ({ slug, name: nameOf.get(slug) || slug, sites })).sort((a, b) => (b.sites.total?.views || 0) - (a.sites.total?.views || 0)) }, 200, cors);
  } catch (e) {
    console.error(e);
    return json({ error: "Något gick fel." }, 500, cors);
  }
});
