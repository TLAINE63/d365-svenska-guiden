import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { Resend } from "../_shared/branded-resend.ts";
import { inquiryCors, isInquiryOrigin, siteFromOrigin } from "../_shared/inquiry-cors.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";

const ADMIN_EMAILS = ["thomas.laine@dynamicfactory.se"];
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
  partners: z.array(z.object({ slug: z.string().trim().min(1).max(120), name: z.string().trim().max(200).optional(), consent: z.boolean() })).max(3).default([]),
  /** Rådgivning direkt med d365.se, ingen partner kontaktas. */
  advisory: z.boolean().optional(),
  /** Var rådgivningen bokades (beslutspunkt, CTA, sidtyp). Inga personuppgifter. */
  advisory_context: z.object({
    placement: z.enum(["compare", "partner_switch", "needs_guide", "tool_result", "second_opinion", "plan", "home", "partner_search", "expert_requirement", "existing_dynamics", "partner_relationship_review", "solution_assessment", "solution_advice", "cost_help", "next_step_help"]),
    cta: z.string().trim().max(120),
    page_type: z.string().trim().max(60).optional().nullable(),
    page_path: z.string().trim().max(300).optional().nullable(),
  }).optional().nullable(),
  utm_source: s(100), utm_medium: s(100), utm_campaign: s(100), utm_content: s(100), utm_term: s(100),
  referrer: s(500), landing_page: s(500), session_id: s(100),
});

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status: number, cors: Record<string, string>) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

const F = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const INK = "#15202B", MUTED = "#5B6670", LINE = "#E3E7EA", PETROL = "#0E7C86";

// The provider boundary appends the common signature once.
const SIGNATURE = "";

/** Mappar formulärets fria produktområde till partnerns product_filters-nycklar (bc, fsc, sales, service). */
function productKeys(area: string | null | undefined): string[] {
  const a = (area || "").toLowerCase();
  const keys: string[] = [];
  if (/business central|\bbc\b/.test(a)) keys.push("bc");
  if (/finance|supply chain|f&scm|fscm/.test(a)) keys.push("fsc");
  if (/sales|försäljning|marketing|customer insights/.test(a)) keys.push("sales");
  if (/service|contact center|field/.test(a)) keys.push("service");
  return keys.length ? keys : ["bc", "fsc", "sales", "service"];
}

/** Premiumram för alla mejl: mörk header, vitt kort, diskret footer. */
function layout(title: string, inner: string, preheader = ""): string {
  return `<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span><h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${INK}">${title}</h1>${inner}`;
}

const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const box = (label: string, inner: string, tone: "petrol" | "soft" = "soft") =>
  `<table role="presentation" width="100%" style="margin:18px 0;background:${tone === "petrol" ? "#EAF5F6" : "#F7F8F9"};border-left:3px solid ${tone === "petrol" ? PETROL : "#C9D1D6"};border-radius:6px"><tr><td style="padding:14px 18px;${F};font-size:14px;line-height:1.6;color:${INK}">
<div style="font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${MUTED};margin-bottom:6px">${label}</div>${inner}</td></tr></table>`;
const rows = (items: [string, unknown][]) => {
  const r = items.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (!r.length) return "";
  return `<table role="presentation" width="100%" style="border-collapse:collapse">${r.map(([k, v]) =>
    `<tr><td style="padding:5px 12px 5px 0;color:${MUTED};width:38%;vertical-align:top;${F};font-size:14px">${esc(k)}</td><td style="padding:5px 0;vertical-align:top;${F};font-size:14px;color:${INK}">${esc(v)}</td></tr>`).join("")}</table>`;
};

function projectText(project: Record<string, unknown> | null | undefined): string {
  if (!project) return "";
  const entries = Object.entries(project).filter(([k, v]) => k !== "introduktion_begard" && v !== null && v !== "" && !(Array.isArray(v) && !v.length)).slice(0, 30);
  if (!entries.length) return "";
  const sections = entries.map(([k, v]) => {
    const body = Array.isArray(v)
      ? `<ul style="margin:0;padding-left:18px">${v.map((x) => `<li style="margin:2px 0">${esc(typeof x === "object" ? JSON.stringify(x) : x)}</li>`).join("")}</ul>`
      : esc(typeof v === "object" ? JSON.stringify(v) : v);
    return `<div style="margin:0 0 14px"><div style="font-weight:600;color:${INK};margin-bottom:2px">${esc(k)}</div><div style="color:#2F3A42">${body}</div></div>`;
  }).join("");
  return box("Sammanställning av köpresan", sections, "petrol");
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
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Rådgivning med d365.se: inga partners kontaktas.
    // Varje bokning (Advisory Booking = inquiries-rad) får ett eget nytt Advisory Case; ärenden slås aldrig ihop automatiskt.
    if (d.advisory && d.inquiry_type === "fraga") {
      const { partners: _a, advisory: _b, advisory_context: ac, ...restA } = d;
      const project = d.include_project ? d.project ?? null : null;
      const { data: advCase, error: caseErr } = await sb.from("advisory_cases").insert({
        contact_name: d.contact_name, company: d.company, email: d.email, phone: d.phone || null,
        journey_context: project, origin_placement: ac?.placement ?? "plan", origin_cta: ac?.cta ?? d.help_with ?? null,
      }).select("id").single();
      if (caseErr || !advCase) { console.error(caseErr); return json({ error: "Förfrågan kunde inte sparas." }, 500, cors); }
      const { data: booking, error: errA } = await sb.from("inquiries").insert({
        ...restA, project, source_site: siteFromOrigin(origin),
        is_advisory: true, advisory_case_id: advCase.id, booking_status: "forfragan",
        advisory_placement: ac?.placement ?? "plan", advisory_cta: ac?.cta ?? null, page_type: ac?.page_type ?? null,
        landing_page: restA.landing_page ?? ac?.page_path ?? null,
      }).select("id").single();
      if (errA || !booking) { console.error(errA); await sb.from("advisory_cases").delete().eq("id", advCase.id); return json({ error: "Förfrågan kunde inte sparas." }, 500, cors); }
      const keyA = Deno.env.get("RESEND_API_KEY");
      const isExpert = ac?.placement === "expert_requirement";
      if (keyA) {
        const resend = new Resend(keyA);
        try {
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: ADMIN_EMAILS, reply_to: d.email, subject: isExpert ? `Kompetensbehov (expert/konsult): ${d.company}` : ac?.placement === "partner_relationship_review" ? `Utvärdera partnersamarbetet: ${d.company}` : ac?.placement === "existing_dynamics" ? `Befintlig Dynamics 365, nästa steg: ${d.company}` : ac?.placement === "solution_assessment" ? `Bedömning att diskutera, CRM- eller affärssystem: ${d.company}` : ac?.placement === "solution_advice" ? `Prata med d365.se, CRM- eller affärssystem: ${d.company}` : ac?.placement === "cost_help" ? `Kostnadsbild: ${d.company}` : ac?.placement === "next_step_help" ? `Hjälp med nästa steg: ${d.company}` : `Rådgivning${ac?.cta ? ` (${ac.cta})` : " via Min D365-plan"}: ${d.company}`,
            html: layout(`Rådgivning: ${esc(d.company)}`, p(`${esc(d.contact_name)}${d.role ? `, ${esc(d.role)}` : ""} på ${esc(d.company)} vill ha hjälp med nästa steg. Ingen partner har kontaktats.`) + box("Kontakt och förfrågan", rows([["Namn", d.contact_name], ["Företag", d.company], ["E-post", d.email], ["Telefon", d.phone || "–"], ["Gäller", d.help_with || "–"], ["Meddelande", d.message || "–"]])) + (d.include_project ? projectText(d.project) : "")),
          });
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: [d.email], subject: "Er förfrågan till d365.se",
            html: layout("Tack, vi har tagit emot er förfrågan", p(`Hej ${esc(d.contact_name)},`) + p("Tack för er förfrågan. Vi har tagit emot ert underlag och återkommer personligen. Inget har skickats till någon partner.") + box("Det här händer nu", isExpert ? "Vi går igenom ert kompetensbehov manuellt. Tillgänglighet och lämplig leveransform behöver verifieras innan vi kan föreslå ett nästa steg. Vill ni bli introducerade till en namngiven partner frågar vi er först." : "Vi går igenom er sammanställning och hör av oss för att diskutera nästa steg i er utvärdering. Ni behöver inte göra något under tiden.") + (d.include_project ? projectText(d.project) : "") + p(`<span style="color:${MUTED};font-size:13px">Spara gärna detta mejl, sammanställningen kan användas som internt underlag.</span>`) + SIGNATURE, "Vi har tagit emot ert underlag"),
          });
        } catch (e) { console.error("advisory mail", e); }
      }
      return json({ ok: true, partners: [], booking_id: booking.id }, 200, cors);
    }

    if (!approved.length) return json({ error: "Välj minst en partner som ska få er förfrågan." }, 400, cors);
    const { data: partnerRows } = await sb.from("partners").select("slug, name, email, contactPerson, product_filters, is_featured").in("slug", approved);
    const all = partnerRows || [];
    // Grundprofiler får aldrig köparens uppgifter automatiskt: introduktion via d365.se.
    const partners = all.filter((p: any) => p.is_featured === true);
    const intros = approved.filter((s) => !partners.some((p) => p.slug === s));
    if (!partners.length && !intros.length) return json({ error: "Partnern kunde inte hittas." }, 400, cors);
    const introNames = intros.map((s) => all.find((p) => p.slug === s)?.name || d.partners.find((p) => p.slug === s)?.name || s);
    const dbProject = d.include_project ? { ...(d.project || {}), ...(intros.length ? { introduktion_begard: intros } : {}) } : (intros.length ? { introduktion_begard: intros } : null);

    const { partners: _p, advisory: _adv, advisory_context: _ctx, ...rest } = d;
    const { data: inquiry, error } = await sb.from("inquiries").insert({ ...rest, project: dbProject, source_site: siteFromOrigin(origin) }).select("id").single();
    if (error || !inquiry) { console.error(error); return json({ error: "Förfrågan kunde inte sparas." }, 500, cors); }

    const tokens = new Map(partners.map((p) => [p.slug, crypto.randomUUID().replace(/-/g, "")]));
    if (partners.length) await sb.from("inquiry_partners").insert(partners.map((p) => ({
      inquiry_id: inquiry.id, partner_slug: p.slug, share_consent: true,
      consent_text: `Jag godkänner att mina kontaktuppgifter och mitt projektunderlag skickas till ${p.name}.`,
      status_token: tokens.get(p.slug),
    })));

    const key = Deno.env.get("RESEND_API_KEY");
    const names = partners.map((p) => p.name).join(", ");
    if (key) {
      const resend = new Resend(key);
      const body = p("Hej,") + p(`${esc(d.contact_name)}${d.role ? `, ${esc(d.role)}` : ""} på ${esc(d.company)} har skickat en förfrågan till er via d365.se och godkänt att uppgifterna delas med er.`)
        + box("Kontaktuppgifter", rows([["Namn", d.contact_name], ["Företag", d.company], ["E-post", d.email], ["Telefon", d.phone || "–"]]))
        + box("Förfrågan", rows([["Produktområde", d.product_area || "–"], ["Gäller", d.help_with || "–"], ["Tidshorisont", d.timeframe || "–"], ["Meddelande", d.message || "–"]]))
        + (d.include_project ? projectText(d.project) : "")
        + p("Kunden förväntar sig att ni hör av er. Vi följer upp med kunden om ungefär två veckor.");
      for (const pt of partners) {
        const pf = (pt as any).product_filters || {};
        const c = productKeys(d.product_area).map((k) => pf[k]).find((x: any) => x?.contactEmail);
        const to = (c?.contactEmail || (pt as any).email || "").trim();
        try {
          const base = `${siteFromOrigin(origin) === "businesscentral.se" ? "https://businesscentral.se" : "https://d365.se"}/partnersvar/${tokens.get(pt.slug)}`;
          const btn = (h: string, t: string) => `<a href="${h}" style="display:inline-block;margin:4px 6px 4px 0;padding:9px 14px;border:1px solid ${PETROL};border-radius:6px;color:${PETROL};text-decoration:none;font-size:13px;font-weight:600">${t}</a>`;
          const links = box("Berätta hur det går (ett klick, ingen inloggning)", btn(`${base}?s=kontaktad`, "Vi har kontaktat kunden") + btn(`${base}?s=offert`, "Vi har lämnat offert") + btn(`${base}?s=ej_aktuell`, "Inte aktuellt för oss")) + SIGNATURE;
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: to ? [to] : ADMIN_EMAILS, cc: to ? ADMIN_EMAILS : undefined,
            reply_to: d.email, subject: `Förfrågan via d365.se: ${d.company}`,
            html: layout(`Ny förfrågan: ${esc(d.company)}`, (to ? body : p(`<strong>Partnern ${esc(pt.name)} saknar e-postadress, vidarebefordra manuellt.</strong>`) + body) + links, `Förfrågan från ${d.company}`),
          });
        } catch (e) { console.error("partner mail", pt.slug, e); }
      }
      if (intros.length) {
        try {
          await resend.emails.send({
            from: "d365.se <info@d365.se>", to: ADMIN_EMAILS, reply_to: d.email, subject: `Introduktion begärd: ${d.company}`,
            html: layout(`Introduktion begärd: ${esc(d.company)}`, p(`${esc(d.contact_name)} på ${esc(d.company)} vill ha en introduktion till: <strong>${esc(introNames.join(", "))}</strong> (grundprofil). Uppgifterna har INTE skickats till partnern.`) + box("Kontakt", rows([["Namn", d.contact_name], ["E-post", d.email], ["Telefon", d.phone || "–"], ["Meddelande", d.message || "–"]])) + (d.include_project ? projectText(d.project) : "")),
          });
        } catch (e) { console.error("intro mail", e); }
      }
      try {
        const parts = [names ? `<div style="margin-bottom:6px"><strong>Förfrågan skickad till:</strong> ${esc(names)}</div>` : "", introNames.length ? `<div><strong>Introduktion via d365.se:</strong> ${esc(introNames.join(", "))}<br><span style="color:${MUTED}">Inga uppgifter har skickats till dem, vi tar kontakt om introduktionen.</span></div>` : ""].filter(Boolean).join("");
        await resend.emails.send({
          from: "d365.se <info@d365.se>", to: [d.email], subject: "Er förfrågan via d365.se",
          html: layout("Tack, er förfrågan är skickad", p(`Hej ${esc(d.contact_name)},`) + p("Tack för er förfrågan. Här är en sammanfattning av vad som har skickats och till vem.") + box("Mottagare", parts) + (d.include_project ? projectText(d.project) : "") + box("Det här händer nu", (names ? "Partnerna tar själva kontakt med er. " : "") + "Vi hör av oss om ungefär två veckor för att höra hur det har gått.") + p(`<span style="color:${MUTED};font-size:13px">Spara gärna detta mejl, sammanställningen kan användas som internt underlag.</span>`) + SIGNATURE, "Er förfrågan är skickad"),
        });
      } catch (e) { console.error("buyer mail", e); }
    } else console.error("RESEND_API_KEY missing");

    return json({ ok: true, partners: partners.map((p) => p.name), intros: introNames }, 200, cors);
  } catch (e) {
    console.error(e);
    return json({ error: "Något gick fel. Försök igen." }, 500, cors);
  }
});
