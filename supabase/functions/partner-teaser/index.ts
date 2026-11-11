// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/cors.ts";
import { requestIsEditor } from "../_shared/editorAuth.ts";
import { computePartnerMetrics, isInternalPath, type PartnerMetrics } from "../_shared/partnerMonthlyMetrics.ts";

const AREAS: Record<string, { label: string; pages: string[]; analysis: string[]; krav: string[]; compare: string[] }> = {
  bc: { label: "Business Central", pages: ["/businesscentral", "/business-central-partners-sverige"], analysis: ["/erpbehovsanalys"], krav: ["/kravspecifikation"], compare: ["business-central"] },
  fsc: { label: "Finance & Supply Chain Management", pages: ["/finance-supply-chain"], analysis: ["/erpbehovsanalys"], krav: ["/kravspecifikation"], compare: ["finance", "supply-chain", "fscm"] },
  sales: { label: "Sales", pages: ["/d365sales", "/crm", "/dynamics-365-crm-partners-sverige"], analysis: ["/crmbehovsanalys"], krav: ["/kravspecifikation-sales"], compare: ["sales", "crm"] },
  marketing: { label: "Customer Insights (Marketing)", pages: ["/d365marketing", "/customer-insights"], analysis: ["/crmbehovsanalys"], krav: ["/kravspecifikation-marketing"], compare: ["marketing", "customer-insights"] },
  service: { label: "Customer Service, Contact Center och Field Service", pages: ["/d365customerservice", "/d365contactcenter", "/d365fieldservice", "/kundservicesystem"], analysis: ["/kundservice-behovsanalys"], krav: ["/kravspecifikation-kundservice"], compare: ["customer-service", "kundservice", "field-service"] },
};
const LAUNCH = new Date(Date.UTC(2026, 2, 1));
const FIELDS = ["listed", "profileViews", "profileVisitors", "matched", "compared", "websiteClicks"] as const;
const OUT: Record<string, string> = { listed: "visad_i_listan", profileViews: "profilvisningar", profileVisitors: "unika_profilbesokare", matched: "matchad", compared: "jamford", websiteClicks: "klick_till_webbplats" };
const METHOD = "Källa: d365.se:s egen besöks- och partnerstatistik, samma beräkning som partnerns månadsrapport. Unika besökare räknas per anonymiserad IP och dag. Exkluderat: sidor riktade till partners och redaktionen (Partnerprogram, ISV-program, Redaktion, Admin, partneruppdatering), förhandsvisningar via lovable-domäner samt kända sökmotorrobotar. Besök från d365.se och partners själva ingår i övrigt.";

function periodOf(p: string) {
  const now = new Date();
  if (p === "last_30_days" || p === "last_90_days") {
    const days = p === "last_30_days" ? 30 : 90;
    const end = now, start = new Date(now.getTime() - days * 864e5), prev = new Date(now.getTime() - 2 * days * 864e5);
    return { start, end, prev };
  }
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return { start, end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), prev: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)) };
}
const d = (x: Date) => x.toISOString().slice(0, 10);

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!req.headers.get("authorization")?.startsWith("Bearer ")) return json({ error: "Inloggning krävs" }, 401);
  if (!(await requestIsEditor(req))) return json({ error: "Behörighet saknas" }, 403);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Ogiltig JSON" }, 400); }
  const mode = body?.mode === "area" ? "area" : body?.mode === "partner" ? "partner" : null;
  const period = ["last_month", "last_30_days", "last_90_days"].includes(body?.period) ? body.period : null;
  if (!mode || !period) return json({ error: "mode och period krävs" }, 400);
  const slug = typeof body?.partner_slug === "string" ? body.partner_slug.slice(0, 120) : "";
  if (mode === "partner" && !/^[a-z0-9-]+$/.test(slug)) return json({ error: "partner_slug krävs" }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { start, end, prev } = periodOf(period);

  let partner: any = null;
  let areas: string[] = [];
  if (mode === "partner") {
    const { data } = await supabase.from("partners").select("slug, name, is_featured, product_filters").eq("slug", slug).maybeSingle();
    if (!data) return json({ error: "Partnern hittades inte" }, 404);
    partner = data;
    areas = Object.keys(data.product_filters || {}).filter((k) => AREAS[k]);
  } else {
    areas = (Array.isArray(body?.product_areas) ? body.product_areas : []).filter((k: any) => typeof k === "string" && AREAS[k]);
    if (!areas.length) return json({ error: "product_areas krävs" }, 400);
  }

  const rows = await computePartnerMetrics(supabase, prev, start, end);

  // Visibility
  let synlighet: any = null, forandring: any = null, flags: string[] = [];
  const pick = (m: PartnerMetrics | null | undefined) => {
    const o: any = {};
    for (const f of FIELDS) o[OUT[f]] = m ? m[f] : null;
    return o;
  };
  if (mode === "partner") {
    const r = rows.find((x) => x.slug === slug);
    synlighet = pick(r?.current);
    const p = pick(r?.previous);
    forandring = {};
    for (const k of Object.values(OUT)) forandring[k] = synlighet[k] != null && p[k] != null ? synlighet[k] - p[k] : null;
    if (!partner.is_featured) { synlighet.klick_till_webbplats = null; forandring.klick_till_webbplats = null; flags.push("ej_tillgangligt_i_grundprofil"); }
  } else {
    const { data: all } = await supabase.from("partners").select("slug, product_filters").eq("is_featured", true);
    const inArea = (all || []).filter((p: any) => areas.some((a) => p.product_filters?.[a])).map((p: any) => p.slug);
    const n = inArea.length;
    synlighet = { antal_partners: n >= 3 ? n : null };
    forandring = {};
    for (const f of FIELDS) {
      if (n < 3) { synlighet[OUT[f]] = null; forandring[OUT[f]] = null; continue; }
      const sum = (k: "current" | "previous") => inArea.reduce((s: number, sl: string) => s + (rows.find((r) => r.slug === sl)?.[k]?.[f] || 0), 0);
      const cur = Math.round(sum("current") / n), pr = Math.round(sum("previous") / n);
      synlighet[OUT[f]] = cur; forandring[OUT[f]] = cur - pr;
    }
  }

  // Visits (since launch), buyer traffic only
  const visits: any[] = [];
  for (let from = 0; from < 300000; from += 1000) {
    const { data, error } = await supabase.from("visitor_analytics").select("page_path, session_id, visited_at, referrer, ip_anonymized").gte("visited_at", LAUNCH.toISOString()).lt("visited_at", end.toISOString()).range(from, from + 999);
    if (error) return json({ error: "Kunde inte läsa besöksdata" }, 500);
    visits.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  const buyer = visits.filter((r) => !isInternalPath(r.page_path) && !/lovable(project\.com|\.dev|\.app)/i.test(r.referrer || ""));
  const key = (r: any) => { const b = r.ip_anonymized && r.ip_anonymized !== "unknown" ? r.ip_anonymized : r.session_id; return b ? `${b}|${String(r.visited_at).slice(0, 10)}` : null; };
  const uniq = (list: any[]) => { const s = new Set<string>(); for (const r of list) { const k = key(r); if (k) s.add(k); } return s.size; };
  const inPeriod = buyer.filter((r) => new Date(r.visited_at) >= start);
  const norm = (p: string) => String(p || "").toLowerCase().replace(/\/+$/, "");
  const match = (prefixes: string[]) => (r: any) => prefixes.some((x) => { const p = norm(r.page_path); return p === x || p.startsWith(x + "/"); });
  const cfg = areas.map((a) => AREAS[a]);
  const all = <T,>(f: (c: typeof cfg[number]) => T[]) => [...new Set(cfg.flatMap(f))] as any[];
  const comparePaths = (r: any) => { const p = norm(r.page_path); return (p.startsWith("/jamfor") || p.startsWith("/compare")) && all((c) => c.compare).some((k: string) => p.includes(k)); };
  const nz = (n: number) => (areas.length ? n : null);

  const { data: completed } = await supabase.from("funnel_events").select("session_id, page_path").eq("event_type", "analysis_complete").gte("occurred_at", start.toISOString()).lt("occurred_at", end.toISOString());
  const doneInArea = (completed || []).filter(match(all((c) => c.analysis)));

  return json({
    mode,
    partner: partner ? { namn: partner.name, slug: partner.slug, niva: partner.is_featured ? "premium" : "grundprofil", produktomraden: areas.map((a) => AREAS[a].label) } : null,
    produktomraden: areas.map((a) => AREAS[a].label),
    period: { typ: period, fran: d(start), till: d(new Date(end.getTime() - 1)), foregaende_fran: d(prev), foregaende_till: d(new Date(start.getTime() - 1)) },
    synlighet, forandring, flaggor: flags,
    efterfragan_omrade: areas.length ? {
      unika_besokare_omradessidor: nz(uniq(inPeriod.filter(match(all((c) => c.pages))))),
      paborjade_behovsanalyser: nz(uniq(inPeriod.filter(match(all((c) => c.analysis))))),
      slutforda_behovsanalyser: (completed || []).length ? doneInArea.length : null,
      kravspecifikationer: nz(uniq(inPeriod.filter(match(all((c) => c.krav))))),
      jamforelser: nz(uniq(inPeriod.filter(comparePaths))),
    } : null,
    sajt_totalt: { unika_besokare_period: uniq(inPeriod), unika_besokare_sedan_lansering: uniq(buyer), lansering: d(LAUNCH) },
    metod: METHOD,
  });
});
