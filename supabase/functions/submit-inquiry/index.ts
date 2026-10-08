import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { Resend } from "npm:resend@2.0.0";
import { inquiryCors, isInquiryOrigin, siteFromOrigin } from "../_shared/inquiry-cors.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";

const ADMIN_EMAILS = ["info@d365.se", "thomas.laine@dynamicfactory.se"];
const s = (n: number) => z.string().trim().max(n).optional().nullable();
const Body = z.object({
  inquiry_type: z.enum(["partner", "kortlista", "fraga"]),
  contact_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(200),
  role: s(80), phone: s(40), product_area: s(100), timeframe: s(60), help_with: s(120), message: s(3000),
  project: z.record(z.unknown()).optional().nullable(),
  include_project: z.boolean().default(true),
  privacy_ack: z.literal(true),
  partners: z.array(z.object({ slug: z.string().trim().min(1).max(120), consent: z.boolean() })).min(1).max(3),
  utm_source: s(100), utm_medium: s(100), utm_campaign: s(100), utm_content: s(100), utm_term: s(100),
  referrer: s(500), landing_page: s(500), session_id: s(100),
});

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status: number, cors: Record<string, string>) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

function productKeys(p?: string | null): string[] {
  const v = (p || "").toLowerCase();
  if (v.includes("business central")) return ["bc"];
  if (/finance|supply|f&scm|f&o/.test(v)) return ["fsc"];
  if (/sales|marketing/.test(v)) return ["sales", "crm"];
  if (/service|contact center|field/.test(v)) return ["service", "crm"];
  if (/crm|customer engagement/.test(v)) return ["sales", "service", "crm"];
  return ["bc", "fsc", "sales", "service", "crm"];
}

function projectText(project: Record<string, unknown> | null | undefined): string {
  if (!project) return "";
  const lines = Object.entries(project).filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && !v.length))
    .slice(0, 30).map(([k, v]) => `${esc(k)}: ${esc(Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : v)}`);
  return lines.length ? `<p><strong>Projektunderlag</strong><br>${lines.join("<br>")}</p>` : "";
}

Deno.serve(async (req) => {
  const cors = inquiryCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const origin = req.headers.get("origin") || "";
  if (!isInquiryOrigin(origin)) return json({ error: "origin" }, 403, cors);
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Kontrollera uppgifterna i formuläret.", fields: parsed.error.flatten().fieldErrors }, 400, cors);
    const d = parsed.data;
    if (isFreeEmailDomain(d.email)) return json({ error: FREE_EMAIL_ERROR_SV }, 400, cors);
    const approved = [...new Set(d.partners.filter((p) => p.consent).map((p) => p.slug))];
    if (!approved.length) return json({ error: "Välj minst en partner som ska få er förfrågan." }, 400, cors);

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: partnerRows } = await sb.from("partners").select("slug, name, email, contactPerson, product_filters").in("slug", approved);
    const partners = partnerRows || [];
    if (!partners.length) return json({ error: "Partnern kunde inte hittas." }, 400, cors);

    const { partners: _p, ...rest } = d;
    const { data: inquiry, error } = await sb.from("inquiries").insert({ ...rest, project: d.include_project ? d.project ?? null : null, source_site: siteFromOrigin(origin) }).select("id").single();
    if (error || !inquiry) { console.error(error); return json({ error: "Förfrågan kunde inte sparas." }, 500, cors); }

    const tokens = new Map(partners.map((p) => [p.slug, crypto.randomUUID().replace(/-/g, "")]));
    await sb.from("inquiry_partners").insert(partners.map((p) => ({
      inquiry_id: inquiry.id, partner_slug: p.slug, share_consent: true,
      consent_text: `Jag godkänner att mina kontaktuppgifter och mitt projektunderlag skickas till ${p.name}.`,
      status_token: tokens.get(p.slug),
    })));

    const key = Deno.env.get("RESEND_API_KEY");
    const names = partners.map((p) => p.name).join(", ");
    if (key) {
      const resend = new Resend(key);
      const body = `<p>Hej,</p>
<p>${esc(d.contact_name)}${d.role ? `, ${esc(d.role)}` : ""} på ${esc(d.company)}, har skickat en förfrågan till er via d365.se och godkänt att uppgifterna delas med er.</p>
<p>Produktområde: ${esc(d.product_area || "–")}<br>Gäller: ${esc(d.help_with || "–")}<br>Tidshorisont: ${esc(d.timeframe || "–")}<br>Meddelande: ${esc(d.message || "–")}</p>
<p>Kontakt: ${esc(d.contact_name)}, ${esc(d.email)}, ${esc(d.phone || "–")}</p>
${d.include_project ? projectText(d.project) : ""}
<p>Kunden förväntar sig att ni hör av er. Vi följer upp med kunden om ungefär två veckor.</p><p>d365.se</p>`;
      for (const p of partners) {
        const pf = (p as any).product_filters || {};
        const c = productKeys(d.product_area).map((k) => pf[k]).find((x: any) => x?.contactEmail);
        const to = (c?.contactEmail || (p as any).email || "").trim();
        try {
          const base = `${siteFromOrigin(origin) === "businesscentral.se" ? "https://businesscentral.se" : "https://d365.se"}/partnersvar/${tokens.get(p.slug)}`;
          const links = `<p><strong>Berätta gärna hur det går (ett klick, ingen inloggning):</strong><br><a href="${base}?s=kontaktad">Vi har kontaktat kunden</a><br><a href="${base}?s=offert">Vi har lämnat offert</a><br><a href="${base}?s=ej_aktuell">Inte aktuellt för oss</a></p>`;
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: to ? [to] : ADMIN_EMAILS, cc: to ? ADMIN_EMAILS : undefined,
            reply_to: d.email, subject: `Förfrågan via d365.se: ${d.company}`,
            html: (to ? body : `<p><strong>Partnern ${esc(p.name)} saknar e-postadress, vidarebefordra manuellt.</strong></p>${body}`) + links,
          });
        } catch (e) { console.error("partner mail", p.slug, e); }
      }
      try {
        await resend.emails.send({
          from: "d365.se <info@d365.se>", to: [d.email], subject: "Er förfrågan via d365.se",
          html: `<p>Hej ${esc(d.contact_name)},</p><p>Tack för er förfrågan. Den har skickats till: ${esc(names)}.</p><p>Vi hör av oss om ungefär två veckor för att höra om ni fått svar.</p><p>d365.se</p>`,
        });
      } catch (e) { console.error("buyer mail", e); }
    } else console.error("RESEND_API_KEY missing");

    return json({ ok: true, partners: partners.map((p) => p.name) }, 200, cors);
  } catch (e) {
    console.error(e);
    return json({ error: "Något gick fel. Försök igen." }, 500, cors);
  }
});
