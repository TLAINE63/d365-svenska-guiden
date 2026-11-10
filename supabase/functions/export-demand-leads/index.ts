// Skyddad export av köparformulär till Demand Engine. En rad per inskickning, sorterad på created_at.
// Loggar aldrig formulärinnehåll.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportAuthOk, exportCors } from "../_shared/demandExportAuth.ts";
import { exportHeaders as baseHeaders, isoStockholm, parseRange, str, toCsv } from "../_shared/demandExport.ts";

const COLUMNS = ["external_id", "site", "created_at", "request_type", "name", "company", "title", "email", "phone", "message", "product_areas", "selected_partners", "consent_partner_share", "consent_text_version", "source_page", "landing_page", "session_pages", "consent_followup", "utm_source", "utm_medium", "utm_campaign"];

const PRODUCT_RULES: [RegExp, string[]][] = [
  [/business central|\bbc\b/i, ["Business Central"]],
  [/finance\s*(&|och|and)\s*(scm|supply)|f&scm|fscm|f&o|finance\s*&\s*operations/i, ["Finance", "Supply Chain Management"]],
  [/^finance$|\bfinance\b(?!\s*(&|och|and))/i, ["Finance"]],
  [/supply chain/i, ["Supply Chain Management"]],
  [/project operations|projektverksamhet/i, ["Project Operations"]],
  [/commerce/i, ["Commerce"]],
  [/human resources|\bhr\b/i, ["Human Resources"]],
  [/\bsales\b|försäljning|säljstöd/i, ["Sales"]],
  [/customer service|kundservice/i, ["Customer Service"]],
  [/field service/i, ["Field Service"]],
  [/contact center/i, ["Contact Center"]],
  [/customer insights|marketing|marknad/i, ["Customer Insights"]],
  [/power platform|power apps|power automate|dataverse/i, ["Power Platform"]],
  [/copilot|agent/i, ["Copilot och agenter"]],
  [/fp&a|fpaa/i, ["FP&A"]],
];
const ORDER = ["Business Central", "Finance", "Supply Chain Management", "Project Operations", "Commerce", "Human Resources", "Sales", "Customer Service", "Field Service", "Contact Center", "Customer Insights", "Power Platform", "Copilot och agenter", "FP&A"];

function productAreas(values: unknown[]): string {
  const out = new Set<string>();
  for (const raw of values.flat(2)) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    for (const part of raw.split(/[,;|/]| och (?=[A-ZÅÄÖ])/)) {
      for (const [re, names] of PRODUCT_RULES) if (re.test(part.trim())) names.forEach((n) => out.add(n));
    }
  }
  return ORDER.filter((n) => out.has(n)).join(" | ");
}

const PLACEHOLDER = /download|nedladdning|ej angivet|okänt|^privatperson$|^-+$|^n\/?a$/i;
const company = (v: unknown) => (typeof v === "string" && v.trim() && !PLACEHOLDER.test(v.trim()) ? v.trim() : "");
const clip = (v: unknown, n: number) => str(v).slice(0, n);
const join = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x).join(" | ") : "");

const LEAD_TYPES: Record<string, string> = {
  kontakt: "kontakt",
  kompetens_behov: "kompetens",
  basic_partner_inquiry: "partnermatchning",
  compare_partners_intro: "partnermatchning",
  partner_contact_request: "partnermatchning",
  partner_demo_request: "partnermatchning",
  partner_quote_request: "partnermatchning",
  partner_multi_quote_request: "partnermatchning",
};

Deno.serve(async (req) => {
  const exportHeaders = { ...baseHeaders, ...exportCors(req) };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: exportHeaders });
  if (req.method !== "GET") return new Response(null, { status: 405, headers: exportHeaders });
  if (!(await exportAuthOk(req))) return new Response(null, { status: 401, headers: exportHeaders });
  const url = new URL(req.url);
  const range = parseRange(url);
  const json = (b: unknown, status: number) => new Response(JSON.stringify(b), { status, headers: { ...exportHeaders, "Content-Type": "application/json; charset=utf-8" } });
  if (!range) return json({ ok: false, error: "invalid_date" }, 400);
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";

  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const between = <T>(q: T) => (q as any).gte("created_at", range.start).lt("created_at", range.end);
    const [inq, leads, fwd, sub, webinarRegistrations] = await Promise.all([
      between(sb.from("inquiries").select("id, created_at, inquiry_type, contact_name, company, role, email, phone, message, product_area, project, is_advisory, advisory_placement, source_site, source_page, landing_page, session_pages, consent_text_version, inquiry_partners(partner_slug, share_consent)").eq("source_site", "d365.se")),
      between(sb.from("leads").select("id, created_at, source_type, contact_name, company_name, role, email, phone, message, selected_product, assigned_partners, source_page, landing_page, session_pages, consent_partner_share, consent_text_version, submission_id, is_partner_self").in("source_type", Object.keys(LEAD_TYPES))),
      between(sb.from("underlag_forward_requests").select("id, created_at, contact_name, company_name, email, phone, message, underlag_summary, products, partner_slugs, source_page, landing_page, session_pages, consent_partner_share, consent_text_version")),
      between(sb.from("underlag_submissions").select("id, created_at, name, company, email, phone, underlag_text, profile, source_page, landing_page, session_pages, consent_text_version")),
      between(sb.from("webinar_registrations").select("id, created_at, first_name, last_name, company, title, email, consent_followup, consent_text_version, source_page, landing_page, session_pages, utm_source, utm_medium, utm_campaign, webinars(title, starts_at, theme)")),
    ]);
    if (inq.error || leads.error || fwd.error || sub.error || webinarRegistrations.error) return json({ ok: false, error: "query_failed" }, 500);

    const rows: Record<string, string>[] = [];
    const base = (table: string, r: any) => ({ external_id: `${table}:${r.id}`, site: "d365.se", created_at: isoStockholm(r.created_at), _ts: str(r.created_at), session_pages: join(r.session_pages), landing_page: str(r.landing_page), source_page: str(r.source_page).split("?")[0].split("#")[0], consent_text_version: str(r.consent_text_version), consent_followup: str(r.consent_followup), utm_source: str(r.utm_source), utm_medium: str(r.utm_medium), utm_campaign: str(r.utm_campaign) });

    for (const r of inq.data || []) {
      const advisory = r.is_advisory === true;
      const type = !advisory ? "partnermatchning" : r.advisory_placement === "second_opinion" ? "second_opinion" : r.advisory_placement === "expert_requirement" ? "kompetens" : "radgivning";
      const ip = (r as any).inquiry_partners || [];
      const intros = Array.isArray((r.project as any)?.introduktion_begard) ? (r.project as any).introduktion_begard : [];
      const project = (r.project || {}) as Record<string, unknown>;
      rows.push({
        ...base("inquiries", r), request_type: type, name: str(r.contact_name), company: company(r.company), title: str(r.role), email: str(r.email), phone: str(r.phone),
        message: clip(r.message, 2000),
        product_areas: productAreas([r.product_area, project.produkter, project.products, project.produkt]),
        selected_partners: [...new Set([...ip.map((p: any) => p.partner_slug), ...intros])].join(" | "),
        consent_partner_share: str(!advisory && (ip.some((p: any) => p.share_consent === true) || intros.length > 0)),
      });
    }
    // Ett formulär som skapar en lead per partner (samma submission_id) blir en rad.
    const groups = new Map<string, any[]>();
    for (const r of leads.data || []) {
      const k = r.submission_id ? `s:${r.submission_id}` : `id:${r.id}`;
      groups.set(k, [...(groups.get(k) || []), r]);
    }
    for (const group of groups.values()) {
      group.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
      const r = { ...group[0], assigned_partners: [...new Set(group.flatMap((g) => g.assigned_partners || []))] };
      rows.push({
        ...base("leads", r), request_type: group.some((g) => g.is_partner_self === true) ? "partneransokan" : LEAD_TYPES[r.source_type] || "kontakt", name: str(r.contact_name), company: company(r.company_name), title: str(r.role), email: str(r.email), phone: str(r.phone),
        message: clip(r.message, 2000), product_areas: productAreas([r.selected_product]), selected_partners: join(r.assigned_partners),
        consent_partner_share: str(r.consent_partner_share === true),
      });
    }
    for (const r of fwd.data || []) {
      rows.push({
        ...base("underlag_forward_requests", r), request_type: "partnermatchning", name: str(r.contact_name), company: company(r.company_name), title: "", email: str(r.email), phone: str(r.phone),
        message: clip(r.underlag_summary || r.message, 2000), product_areas: productAreas([r.products]), selected_partners: join(r.partner_slugs),
        consent_partner_share: str(r.consent_partner_share === true),
      });
    }
    for (const r of sub.data || []) {
      const prof = (r.profile || {}) as Record<string, unknown>;
      rows.push({
        ...base("underlag_submissions", r), request_type: "radgivning", name: str(r.name), company: company(r.company), title: "", email: str(r.email), phone: str(r.phone),
        message: clip(r.underlag_text, 2000), product_areas: productAreas([prof.products, prof.produkter, prof.product, prof.mainArea]), selected_partners: "",
        consent_partner_share: "false",
      });
    }
    for (const r of webinarRegistrations.data || []) {
      const webinar = (r as any).webinars;
      const themeProducts: Record<string, string> = {
        "business-central": "Business Central",
        fscm: "Finance | Supply Chain Management",
        crm: "Sales | Customer Service",
        ai: "Copilot och agenter",
      };
      const date = webinar?.starts_at ? isoStockholm(webinar.starts_at).slice(0, 10) : "";
      rows.push({
        ...base("webinar_registrations", r), request_type: "webinar",
        name: `${str(r.first_name)} ${str(r.last_name)}`.trim(), company: company(r.company), title: str(r.title), email: str(r.email), phone: "",
        message: `Webinar: ${str(webinar?.title)}, ${date}${r.consent_followup ? "\nVill bli kontaktad efter webinaret." : ""}`,
        product_areas: themeProducts[str(webinar?.theme)] || "", selected_partners: "", consent_partner_share: "false",
      });
    }
    rows.sort((a, b) => a._ts.localeCompare(b._ts));
    const clean = rows.map((r) => Object.fromEntries(COLUMNS.map((c) => [c, r[c] ?? ""])));

    if (format === "json") return json({ ok: true, rows: clean }, 200);
    return new Response(toCsv(COLUMNS, clean), { status: 200, headers: { ...exportHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="d365se-formular.csv"` } });
  } catch {
    return json({ ok: false, error: "export_failed" }, 500);
  }
});
