import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string, allowedRoles: string[] = ["admin"]) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format", payload: null as any };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`)
    );
    if (!valid) return { valid: false, error: "Invalid signature", payload: null };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired", payload: null };
    if (!allowedRoles.includes(payload.role)) return { valid: false, error: "Insufficient permissions", payload: null };
    return { valid: true, payload };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed", payload: null };
  }
}

interface FunnelRow {
  key: string;
  label: string;
  count: number;
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const daysRaw = body?.days;
    const isAllTime = daysRaw === null || daysRaw === "all" || daysRaw === 0;
    const days: number | null = isAllTime ? null : Math.min(Math.max(Number(daysRaw) || 30, 1), 365);
    const pageFilter: string | null = body?.page_filter || null; // e.g. "/business-central"

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    // Underlag action is also readable by editors (Redaktion); all other actions stay admin-only.
    const v = await verifyJWT(token, JWT_SECRET, body?.action === "underlag" || body?.action === "buyer" || body?.action === "buyer_paths" || body?.action === "ai_library" ? ["admin", "editor"] : ["admin"]);
    if (!v.valid) {
      return new Response(
        JSON.stringify({ error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (body?.action === "underlag") {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const rows: any[] = [];
      for (let from = 0; from < 200000; from += 1000) {
        const { data, error } = await supabase.from("funnel_events").select("event_name, session_id, metadata").eq("event_type", "underlag").gte("occurred_at", since).range(from, from + 999);
        if (error) { console.error(error); break; }
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      const STEPS_U = ["test_started", "test_completed", "underlag_viewed", "compare_prefilled", "partner_saved", "partners_compared", "partner_profile_opened", "decision_package_exported", "underlag_sent"];
      const sets: Record<string, Record<string, Set<string>>> = { fscm: {}, crm: {}, all: {} };
      for (const t of Object.keys(sets)) for (const s of STEPS_U) sets[t][s] = new Set();
      const trackOf = new Map<string, string>();
      for (const r of rows) {
        const tr = (r.metadata?.track as string) || "";
        if (r.session_id && (tr === "fscm" || tr === "crm")) trackOf.set(r.session_id, tr);
      }
      for (const r of rows) {
        if (!r.session_id || !STEPS_U.includes(r.event_name)) continue;
        sets.all[r.event_name].add(r.session_id);
        const tr = (r.metadata?.track as string) || trackOf.get(r.session_id);
        if (tr === "fscm" || tr === "crm") sets[tr][r.event_name].add(r.session_id);
      }
      const funnels: Record<string, { key: string; count: number }[]> = Object.fromEntries(Object.entries(sets).map(([t, m]) => [t, STEPS_U.map((s) => ({ key: s, count: m[s].size }))]));
      const EXTRA = ["plan_created", "kompetens_need_form_open", "kompetens_need_form_submit", "intro_sent"];
      const extra: Record<string, Set<string>> = Object.fromEntries(EXTRA.map((e) => [e, new Set<string>()]));
      for (let from = 0; from < 200000; from += 1000) {
        const { data, error } = await supabase.from("funnel_events").select("event_name, session_id").in("event_name", EXTRA).gte("occurred_at", since).range(from, from + 999);
        if (error) { console.error(error); break; }
        for (const r of data || []) if (r.session_id) extra[r.event_name]?.add(r.session_id);
        if (!data || data.length < 1000) break;
      }
      funnels.journey = EXTRA.map((k) => ({ key: k, count: extra[k].size }));
      const { data: subs } = await supabase.from("underlag_submissions").select("id, created_at, name, company, email, phone, buying_signal, email_status, underlag_text").order("created_at", { ascending: false }).limit(100);
      return new Response(JSON.stringify({ funnels, submissions: subs || [] }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (body?.action === "competence") {
      const d = Math.min(Math.max(Number(body?.days) || 30, 1), 365);
      const since = new Date(Date.now() - d * 86400000).toISOString();
      const fetchAll = async (table: string, cols: string, tsCol: string) => {
        const out: any[] = [];
        for (let from = 0; from < 300000; from += 1000) {
          const { data, error } = await supabase.from(table).select(cols).gte(tsCol, since).range(from, from + 999);
          if (error) { console.error(table, error); break; }
          out.push(...(data || []));
          if (!data || data.length < 1000) break;
        }
        return out;
      };
      const [visits, events] = await Promise.all([
        fetchAll("visitor_analytics", "page_path, session_id", "visited_at"),
        fetchAll("funnel_events", "event_type, event_name, step, session_id, occurred_at", "occurred_at"),
      ]);
      const visitS = new Set<string>();
      for (const v of visits) if ((v.page_path || "").startsWith("/kompetens") && v.session_id) visitS.add(v.session_id);
      const sets: Record<string, Set<string>> = { search: new Set(), result: new Set(), profile: new Set(), shortlist: new Set(), need: new Set(), intro: new Set() };
      const firstComp = new Map<string, string>();
      for (const e of events) {
        const sid = e.session_id; if (!sid) continue;
        if (e.event_type === "competence") {
          visitS.add(sid);
          const t = firstComp.get(sid); if (!t || e.occurred_at < t) firstComp.set(sid, e.occurred_at);
          if (e.event_name === "kompetens_search") sets.search.add(sid);
          if (e.event_name === "kompetens_partner_card_view") sets.result.add(sid);
          if (e.event_name === "kompetens_partner_profile_click") sets.profile.add(sid);
          if (e.event_name === "kompetens_need_form_submit") sets.need.add(sid);
        }
        // Sprint 1.2: kompetensbehovet skickas via rådgivningsflödet (event_type advisory).
        if (e.event_name === "expert_requirement_submitted") sets.need.add(sid);
      }
      for (const e of events) {
        const sid = e.session_id; if (!sid) continue;
        const t = firstComp.get(sid); if (!t || e.occurred_at < t) continue;
        if (e.step === "shortlist_add" || e.event_name === "shortlist_add") sets.shortlist.add(sid);
        if (e.step === "intro_sent") sets.intro.add(sid);
      }
      const steps = [
        { key: "visit", label: "Besök på kompetenssidorna", count: visitS.size },
        { key: "search", label: "Börjar söka kompetens", count: sets.search.size },
        { key: "result", label: "Ser resultat", count: sets.result.size },
        { key: "profile", label: "Öppnar en partner", count: sets.profile.size },
        { key: "shortlist", label: "Lägger på shortlist", count: sets.shortlist.size },
        { key: "need", label: "Beskriver sitt behov", count: sets.need.size },
        { key: "intro", label: "Vill ha introduktion", count: sets.intro.size },
      ];
      return new Response(JSON.stringify({ steps }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (body?.action === "engagement") {
      const d = Math.min(Math.max(Number(body?.days) || 30, 1), 365);
      const since = new Date(Date.now() - d * 86400000).toISOString();
      const fetchAll = async (table: string, cols: string, tsCol: string) => {
        const out: any[] = [];
        for (let from = 0; from < 300000; from += 1000) {
          const { data, error } = await supabase.from(table).select(cols).gte(tsCol, since).range(from, from + 999);
          if (error) { console.error(table, error); break; }
          out.push(...(data || []));
          if (!data || data.length < 1000) break;
        }
        return out;
      };
      const [visits, funnel, clicks, leads] = await Promise.all([
        fetchAll("visitor_analytics", "page_path, session_id", "visited_at"),
        fetchAll("funnel_events", "event_type, event_name, session_id", "occurred_at"),
        fetchAll("partner_clicks", "id, ip_address_anonymized", "clicked_at"),
        fetchAll("leads", "source_type", "created_at"),
      ]);
      const pageGroup = (p: string): string | null => {
        const s = (p || "").toLowerCase();
        if (s.startsWith("/partner/")) return "partner_profile";
        if (s.includes("jamfor") || s.startsWith("/compare/")) return "comparison";
        if (s.startsWith("/artiklar/") || s.startsWith("/aktuellt/") || /^\/kunskapscenter\/[^/]+\/[^/]+/.test(s) || s.startsWith("/basic/")) return "article";
        return null;
      };
      const agg = (key: string) => ({ views: 0, sessions: new Set<string>() });
      const pages: Record<string, { views: number; sessions: Set<string> }> = {
        article: agg("a"), partner_profile: agg("p"), comparison: agg("c"),
      };
      for (const v of visits) {
        const g = pageGroup(v.page_path);
        if (!g) continue;
        pages[g].views++;
        if (v.session_id) pages[g].sessions.add(v.session_id);
      }
      const clickAgg: Record<string, { count: number; sessions: Set<string> }> = {
        ebook: { count: 0, sessions: new Set() },
        needs_analysis: { count: 0, sessions: new Set() },
        kravspec: { count: 0, sessions: new Set() },
      };
      for (const f of funnel) {
        let k: string | null = null;
        if (f.event_name === "ebook_click" || f.event_name === "ebook_banner") k = "ebook";
        else if (f.event_name === "needs_analysis_click") k = "needs_analysis";
        else if (f.event_name === "kravspec_click") k = "kravspec";
        if (f.event_type === "cta_view") k = null;
        if (!k) continue;
        clickAgg[k].count++;
        if (f.session_id) clickAgg[k].sessions.add(f.session_id);
      }
      const leadsByType: Record<string, number> = {};
      for (const l of leads) leadsByType[l.source_type || "okänd"] = (leadsByType[l.source_type || "okänd"] || 0) + 1;
      const extUnique = new Set(clicks.map((c) => c.ip_address_anonymized).filter(Boolean)).size;
      const metrics = [
        { key: "article", label: "Artikelbesök", count: pages.article.views, unique: pages.article.sessions.size },
        { key: "partner_profile", label: "Partnerprofilbesök", count: pages.partner_profile.views, unique: pages.partner_profile.sessions.size },
        { key: "comparison", label: "Jämförelsesidor", count: pages.comparison.views, unique: pages.comparison.sessions.size },
        { key: "ebook", label: "E-boksklick", count: clickAgg.ebook.count, unique: clickAgg.ebook.sessions.size, extra: `${leadsByType["lead_magnet"] || 0} nedladdningar` },
        { key: "needs_analysis", label: "Behovsanalysklick", count: clickAgg.needs_analysis.count, unique: clickAgg.needs_analysis.sessions.size },
        { key: "kravspec", label: "Kravspecklick", count: clickAgg.kravspec.count, unique: clickAgg.kravspec.sessions.size, extra: `${leadsByType["requirements_spec"] || 0} skickade kravspecar` },
        { key: "external_partner", label: "Externa partnerklick", count: clicks.length, unique: extUnique },
        { key: "contact_form", label: "Kontaktformulär", count: leads.length, unique: leads.length },
      ];
      return new Response(JSON.stringify({ metrics, leads_by_type: leadsByType }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (body?.action === "ai_library") {
      // Sprint 8: AI-exempelbibliotekets uppföljning. Endast faktiska händelser, inga uppskattningar, ingen persondata.
      const month: string | null = typeof body?.month === "string" && /^\d{4}-\d{2}$/.test(body.month) ? body.month : null;
      const start = month ? new Date(`${month}-01T00:00:00Z`) : new Date(Date.now() - 30 * 86400000);
      const end = month ? new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1)) : new Date();
      const rows: any[] = [];
      for (let from = 0; from < 200000; from += 1000) {
        const { data, error } = await supabase.from("funnel_events").select("event_name, session_id, metadata, traffic_source").eq("event_type", "ai_library").gte("occurred_at", start.toISOString()).lt("occurred_at", end.toISOString()).range(from, from + 999);
        if (error) { console.error(error); break; }
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      const inc = (m: Record<string, number>, k?: string | null) => { if (k) m[k] = (m[k] || 0) + 1; };
      const events: Record<string, number> = {};
      const sessions = new Set<string>();
      const byExample: Record<string, Record<string, number>> = {};
      const filters: Record<string, Record<string, number>> = { category: {}, application: {}, role: {}, ai_type: {} };
      const zero: Record<string, number> = {};
      const entries: Record<string, number> = {};
      const sources: Record<string, number> = {};
      for (const r of rows) {
        const m = r.metadata || {};
        inc(events, r.event_name);
        if (r.session_id) sessions.add(r.session_id);
        if (r.event_name === "ai_library_view") inc(sources, r.traffic_source || "okänt");
        if (m.example_id) { byExample[m.example_id] ??= {}; inc(byExample[m.example_id], r.event_name); }
        const fk = { ai_category_filter: "category", ai_application_filter: "application", ai_role_filter: "role", ai_type_filter: "ai_type" }[r.event_name as string];
        if (fk) for (const v of String(m[fk] || "").split(",")) inc(filters[fk], v || null);
        if (r.event_name === "ai_zero_results") inc(zero, String(m.filters || "").slice(0, 200));
        if (r.event_name === "ai_library_entry_click") inc(entries, String(m.source_page || "okänt"));
      }
      return new Response(JSON.stringify({ period: { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) }, total: rows.length, sessions: sessions.size, events, byExample, filters, zero, entries, sources }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (body?.action === "buyer_paths") {
      // Rapport per köpväg: endast aggregerade antal. Läser aldrig namn, e-post, telefon eller fritext.
      const dP = Math.min(Math.max(Number(body?.days) || 30, 1), 365);
      const sinceP = new Date(Date.now() - dP * 86400000).toISOString();
      type Ev = { name: string; label: string; kind: "click" | "submit"; by?: string };
      const PATHS: { key: string; label: string; events: Ev[]; placements?: string[]; leadTypes?: string[] }[] = [
        { key: "hero", label: "Startsidans fyra köpvägar", events: [{ name: "hero_intent_clicked", label: "Klick på kort i startsidans hero", kind: "click", by: "card_id" }] },
        { key: "solution", label: "Nytt CRM- eller affärssystem (ERP)", placements: ["solution_assessment", "solution_advice", "needs_guide"], events: [
          { name: "solution_journey_started", label: "Resan startad", kind: "click" },
          { name: "business_need_selected", label: "Verksamhetsbehov valt", kind: "click", by: "need" },
          { name: "solution_area_viewed", label: "Lösningsområde visat eller klickat", kind: "click" },
          { name: "assessment_started", label: "Bedömning påbörjad", kind: "click" },
          { name: "assessment_completed", label: "Bedömning visad", kind: "click" },
          { name: "assessment_selfservice_continued", label: "Fortsatte utforska själv", kind: "click" },
          { name: "assessment_contact_requested", label: "Diskutera bedömningen med d365.se", kind: "submit" },
          { name: "solution_assessment_requested", label: "Få en första bedömning (före Sprint 1.7)", kind: "submit" },
          { name: "solution_advice_requested", label: "Prata med d365.se", kind: "submit" } ] },
        { key: "cost", label: "Kostnad", placements: ["cost_help"], events: [
          { name: "cost_journey_started", label: "Resan startad", kind: "click" },
          { name: "cost_calculation_completed", label: "Kalkyl gjord", kind: "click", by: "calculator" },
          { name: "cost_next_step_clicked", label: "Nästa steg klickat", kind: "click", by: "step" },
          { name: "cost_help_requested", label: "Få hjälp att bedöma kostnadsbilden", kind: "submit" } ] },
        { key: "existing", label: "Befintlig Dynamics 365", placements: ["existing_dynamics", "partner_relationship_review", "second_opinion"], events: [
          { name: "existing_dynamics_option_selected", label: "Val gjort", kind: "click", by: "option" },
          { name: "existing_dynamics_help_requested", label: "Prata med d365.se om nästa steg", kind: "submit" },
          { name: "partner_relationship_review_requested", label: "Utvärdera partnersamarbetet", kind: "submit" } ] },
        { key: "competence", label: "Kompetens: partner eller expert", leadTypes: ["kompetens_behov"], events: [
          { name: "competence_path_opened", label: "Valet Vad söker ni? öppnat", kind: "click" },
          { name: "competence_type_selected", label: "Typ vald", kind: "click", by: "competence_type" },
          { name: "competence_help_requested", label: "Osäker: Beskriv behovet", kind: "submit" } ] },
        { key: "partner", label: "Partnersökning", placements: ["partner_search"], events: [
          { name: "partner_search_started", label: "Sökning startad", kind: "click" },
          { name: "partner_need_selected", label: "Behov valt", kind: "click", by: "need" },
          { name: "partner_filters_applied", label: "Filter använda", kind: "click" },
          { name: "partner_verification_filter_applied", label: "Informationsstatus filtrerad", kind: "click", by: "information_status" },
          { name: "partner_profile_viewed", label: "Profil besökt", kind: "click" },
          { name: "partner_compare_started", label: "Jämförelse startad", kind: "click" },
          { name: "partner_selfservice_clicked", label: "Besök partnern", kind: "click" },
          { name: "partner_selection_help_requested", label: "Få hjälp att bedöma partners", kind: "submit" } ] },
        { key: "next_step", label: "Fortsätt er utvärdering (pilot)", placements: ["next_step_help"], events: [
          { name: "next_step_view", label: "Blocket visat", kind: "click" },
          { name: "next_step_clicked", label: "Nästa steg klickat", kind: "click", by: "step" },
          { name: "next_step_help_requested", label: "Få hjälp att bedöma nästa steg", kind: "submit" } ] },
        { key: "expert", label: "Expert eller konsult", placements: ["expert_requirement"], events: [
          { name: "expert_search_started", label: "Sökning startad", kind: "click" },
          { name: "expert_role_selected", label: "Roll vald", kind: "click", by: "role" },
          { name: "expert_specialism_selected", label: "Specialistområde valt", kind: "click" },
          { name: "expert_requirement_started", label: "Behovsformulär öppnat", kind: "click" },
          { name: "expert_requirement_submitted", label: "Kompetensbehov skickat", kind: "submit" } ] },
      ];
      const evByName = new Map<string, Ev>();
      for (const pth of PATHS) for (const e of pth.events) evByName.set(e.name, e);
      const names = [...evByName.keys()];
      // Bara uppräkningsbara värden redovisas; fritext eller ovanliga tecken blir "övrigt".
      const safeVal = (v: unknown) => (typeof v === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : "övrigt");
      const stats = new Map<string, { total: number; sessions: Set<string>; by: Map<string, number> }>();
      const add = (name: string, sid: string | null, meta: any) => {
        const e = evByName.get(name); if (!e) return;
        let st = stats.get(name);
        if (!st) { st = { total: 0, sessions: new Set(), by: new Map() }; stats.set(name, st); }
        st.total++;
        if (sid) st.sessions.add(sid);
        if (e.by) { const k = safeVal(meta?.[e.by]); st.by.set(k, (st.by.get(k) || 0) + 1); }
      };
      for (let from = 0; from < 300000; from += 1000) {
        const { data, error } = await supabase.from("funnel_events").select("event_name, session_id, metadata").in("event_name", names).gte("occurred_at", sinceP).range(from, from + 999);
        if (error) { console.error(error); break; }
        for (const r of data || []) add(r.event_name, r.session_id, r.metadata);
        if (!data || data.length < 1000) break;
      }
      // Startsidans kortklick mäts via track-event (partner_tracking_events).
      for (let from = 0; from < 300000; from += 1000) {
        const { data, error } = await supabase.from("partner_tracking_events").select("event_name, session_id, metadata").eq("event_name", "hero_intent_clicked").gte("created_at", sinceP).range(from, from + 999);
        if (error) { console.error(error); break; }
        for (const r of data || []) add(r.event_name, r.session_id, r.metadata);
        if (!data || data.length < 1000) break;
      }
      // Registrerade ärenden räknas per ingång; endast ingång och typ läses, aldrig kontaktuppgifter.
      const placementCount = new Map<string, number>();
      for (let from = 0; from < 100000; from += 1000) {
        const { data, error } = await supabase.from("inquiries").select("advisory_placement").eq("is_advisory", true).gte("created_at", sinceP).range(from, from + 999);
        if (error) { console.error(error); break; }
        for (const r of data || []) { const k = r.advisory_placement || "plan"; placementCount.set(k, (placementCount.get(k) || 0) + 1); }
        if (!data || data.length < 1000) break;
      }
      const leadCount = new Map<string, number>();
      const { data: leadRows, error: leadErr } = await supabase.from("leads").select("source_type").eq("source_type", "kompetens_behov").gte("created_at", sinceP).limit(10000);
      if (leadErr) console.error(leadErr);
      for (const r of leadRows || []) leadCount.set(r.source_type, (leadCount.get(r.source_type) || 0) + 1);
      const paths = PATHS.map((pth) => {
        const events = pth.events.map((e) => {
          const st = stats.get(e.name);
          return { name: e.name, label: e.label, kind: e.kind, total: st?.total || 0, sessions: st?.sessions.size || 0,
            breakdown: st ? [...st.by.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count })) : [] };
        });
        const registered = [
          ...(pth.placements || []).map((pl) => ({ key: pl, count: placementCount.get(pl) || 0 })),
          ...(pth.leadTypes || []).map((lt) => ({ key: lt, count: leadCount.get(lt) || 0 })),
        ];
        return { key: pth.key, label: pth.label, clicks: events.filter((e) => e.kind === "click").reduce((a, e) => a + e.total, 0),
          submits: events.filter((e) => e.kind === "submit").reduce((a, e) => a + e.total, 0), events, registered };
      });
      return new Response(JSON.stringify({ days: dP, since: sinceP.slice(0, 10), paths }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (body?.action === "buyer") {
      // Sprint 6: köparfunnel från faktiska händelser. Unika sessioner per steg, ingen persondata läses.
      const d = Math.min(Math.max(Number(body?.days) || 30, 1), 365);
      const sinceB = new Date(Date.now() - d * 86400000).toISOString();
      const areaF: string | null = body?.area || null;
      const stateF: string | null = body?.state || null;
      const STEP_EVENTS: Record<string, string[]> = {
        visit: ["landing"],
        guide_started: ["kom_igang_start", "systemval_guide_started"],
        guide_to_plan: ["systemval_plan_transfer"],
        guide_completed: ["kom_igang_results", "systemval_result"],
        plan_created: ["plan_created"],
        plan_viewed: ["plan_viewed"],
        deep_started: ["needs_analysis_erp", "needs_analysis_sales_marketing", "needs_analysis_customer_service", "kravspec_erp", "kravspec_sales", "kravspec_marketing", "kravspec_customer_service"],
        partner_saved: ["partner_added_to_shortlist"],
        compared: ["partner_comparison_started"],
        advisory_started: ["advisory_started", "advisory_form_opened"],
        partner_contact_started: ["partner_contact_started"],
        share_preview: ["share_preview_viewed"],
        advisory_submitted: ["advisory_submitted", "advisory_booking_completed"],
        partner_request_submitted: ["partner_request_submitted"],
        intro_requested: ["basic_profile_intro_requested"],
        nba_viewed: ["next_best_action_viewed"],
        nba_clicked: ["next_best_action_clicked"],
        existing_customer_page: [],
        partner_profile: [],
      };
      const nameToStep = new Map<string, string>();
      for (const [k, names] of Object.entries(STEP_EVENTS)) for (const n of names) nameToStep.set(n, k);
      const rows: any[] = [];
      for (let from = 0; from < 300000; from += 1000) {
        const { data, error } = await supabase
          .from("funnel_events")
          .select("session_id, event_type, event_name, page_path, landing_path, traffic_source, metadata")
          .gte("occurred_at", sinceB)
          .not("session_id", "is", null)
          .order("occurred_at", { ascending: true })
          .range(from, from + 999);
        if (error) { console.error(error); break; }
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      type S = { steps: Set<string>; area: string | null; state: string | null; source: string; landing: string; partners: Set<string>; deepDone: boolean };
      const sessions = new Map<string, S>();
      const nba = new Map<string, { label: string; viewed: Set<string>; clicked: Set<string> }>();
      for (const r of rows) {
        const m0 = (r.metadata || {}) as Record<string, any>;
        // Gruppera per anonym resa (återkommande besök) när den finns, annars per session.
        const jk = typeof m0.journey_id === "string" && m0.journey_id ? m0.journey_id : r.session_id;
        let s = sessions.get(jk);
        if (!s) { s = { steps: new Set(), area: null, state: null, source: r.traffic_source || "direct", landing: r.landing_path || "(okänd)", partners: new Set(), deepDone: false }; sessions.set(jk, s); }
        const m = (r.metadata || {}) as Record<string, any>;
        if (typeof m.main_area === "string") s.area = m.main_area;
        if (typeof m.journey_state === "string") s.state = m.journey_state;
        const step = nameToStep.get(r.event_name);
        if (step === "deep_started") { if (r.event_type === "analysis_start") s.steps.add("deep_started"); if (r.event_type === "analysis_complete") s.deepDone = true; }
        else if (step) s.steps.add(step);
        if (r.event_name === "partner_added_to_shortlist" && typeof m.partner === "string") s.partners.add(m.partner);
        if (typeof r.page_path === "string" && r.page_path.startsWith("/befintlig-kund")) s.steps.add("existing_customer_page");
        if (typeof r.page_path === "string" && r.page_path.startsWith("/partner/")) s.steps.add("partner_profile");
        if (r.event_name === "next_best_action_viewed" || r.event_name === "next_best_action_clicked") {
          const key = String(m.action_key || "okand").slice(0, 60);
          let n = nba.get(key); if (!n) { n = { label: String(m.action_label || key).slice(0, 120), viewed: new Set(), clicked: new Set() }; nba.set(key, n); }
          (r.event_name === "next_best_action_viewed" ? n.viewed : n.clicked).add(r.session_id);
        }
      }
      const list = [...sessions.values()].filter((s) => (!areaF || s.area === areaF) && (!stateF || s.state === stateF));
      const count = (k: string) => list.filter((s) => s.steps.has(k)).length;
      const has = (s: S, k: string) => s.steps.has(k);
      const main = [
        { key: "visit", label: "Besökare (anonyma resor)", count: list.length },
        { key: "guide_started", label: "Behovsguide startad", count: count("guide_started") },
        { key: "guide_completed", label: "Behovsguide slutförd", count: count("guide_completed") },
        { key: "plan_created", label: "Min D365-plan skapad", count: count("plan_created") },
        { key: "deep_started", label: "Fördjupning startad", count: count("deep_started") },
        { key: "deep_completed", label: "Fördjupning slutförd", count: list.filter((s) => s.deepDone).length },
        { key: "partner_saved", label: "Partner sparad", count: count("partner_saved") },
        { key: "compared", label: "Partners jämförda", count: count("compared") },
        { key: "dialog", label: "Rådgivning eller partnerförfrågan skickad", count: list.filter((s) => has(s, "advisory_submitted") || has(s, "partner_request_submitted") || has(s, "intro_requested")).length },
      ];
      const seq = (keys: ((s: S) => boolean)[], labels: string[]) => {
        let pool = list;
        return labels.map((label, i) => { pool = pool.filter(keys[i]); return { label, count: pool.length }; });
      };
      const funnels = {
        a: seq([(s) => has(s, "guide_started"), (s) => has(s, "plan_created"), (s) => has(s, "deep_started") || has(s, "plan_viewed"), (s) => has(s, "partner_saved"), (s) => has(s, "advisory_submitted") || has(s, "partner_request_submitted") || has(s, "intro_requested")], ["Behovsguide", "D365-plan", "Fördjupning eller planvisning", "Partner sparad", "Dialog skickad"]),
        b: seq([(s) => has(s, "partner_profile"), (s) => has(s, "partner_saved"), (s) => has(s, "compared"), (s) => has(s, "partner_request_submitted") || has(s, "intro_requested")], ["Partnerprofil", "Kortlista", "Jämförelse", "Partnerförfrågan eller introduktion"]),
        d: seq([(s) => has(s, "guide_started"), (s) => has(s, "guide_completed"), (s) => has(s, "guide_to_plan") || has(s, "plan_created") || has(s, "plan_viewed"), (s) => has(s, "partner_request_submitted") || has(s, "intro_requested")], ["Startade behovsguiden", "Fick resultat", "Gick till Min D365-plan", "Kontaktade en partner"]),
        c: seq([(s) => has(s, "existing_customer_page") || s.state === "existing_customer", (s) => has(s, "plan_created"), (s) => has(s, "deep_started") || has(s, "plan_viewed"), (s) => has(s, "advisory_submitted") || has(s, "partner_request_submitted") || has(s, "intro_requested")], ["Befintlig kund", "D365-plan", "Fördjupning eller planvisning", "Rådgivning eller partner"]),
      };
      const dropoffs = [
        { label: "Behovsguide startad → slutförd", from: count("guide_started"), to: list.filter((s) => has(s, "guide_started") && has(s, "guide_completed")).length },
        { label: "Plan skapad → rekommenderat steg klickat", from: count("plan_created"), to: list.filter((s) => has(s, "plan_created") && has(s, "nba_clicked")).length },
        { label: "En partner sparad → minst två", from: list.filter((s) => s.partners.size >= 1).length, to: list.filter((s) => s.partners.size >= 2).length },
        { label: "Minst två partners → jämförelse", from: list.filter((s) => s.partners.size >= 2).length, to: list.filter((s) => s.partners.size >= 2 && has(s, "compared")).length },
        { label: "Delningsgranskning → skickat", from: count("share_preview"), to: list.filter((s) => has(s, "share_preview") && (has(s, "advisory_submitted") || has(s, "partner_request_submitted") || has(s, "intro_requested"))).length },
        { label: "Rådgivning startad → skickad", from: count("advisory_started"), to: list.filter((s) => has(s, "advisory_started") && has(s, "advisory_submitted")).length },
        { label: "Partnerkontakt startad → skickad", from: count("partner_contact_started"), to: list.filter((s) => has(s, "partner_contact_started") && (has(s, "partner_request_submitted") || has(s, "intro_requested"))).length },
      ];
      const conversions = {
        advisory: count("advisory_submitted"),
        partner_request: count("partner_request_submitted"),
        intro: count("intro_requested"),
      };
      const segOf = (pick: (s: S) => string | null) => {
        const m = new Map<string, { sessions: number; plan: number; dialog: number }>();
        for (const s of list) {
          const k = pick(s) || "okänt";
          const e = m.get(k) || { sessions: 0, plan: 0, dialog: 0 };
          e.sessions++; if (has(s, "plan_created")) e.plan++;
          if (has(s, "advisory_submitted") || has(s, "partner_request_submitted") || has(s, "intro_requested")) e.dialog++;
          m.set(k, e);
        }
        return [...m.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.sessions - a.sessions);
      };
      return new Response(JSON.stringify({
        days: d,
        sessions: list.length,
        main, funnels, dropoffs, conversions,
        nba: [...nba.entries()].map(([key, v]) => ({ key, label: v.label, viewed: v.viewed.size, clicked: v.clicked.size })).sort((a, b) => b.viewed - a.viewed),
        by_area: segOf((s) => s.area),
        by_state: segOf((s) => s.state),
        by_source: segOf((s) => s.source),
        by_landing: segOf((s) => (s.landing === "/" ? "/" : "/" + (s.landing.split("/")[1] || ""))).slice(0, 12),
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (body?.action === "journey") {
      const d = Math.min(Math.max(Number(body?.days) || 30, 1), 365);
      const sinceJ = new Date(Date.now() - d * 86400000).toISOString();
      const src: string | null = body?.source || null;
      const dev: string | null = body?.device || null;
      const toolF: string | null = body?.tool || null;
      const landF: string | null = body?.landing || null;
      const rows: any[] = [];
      for (let from = 0; from < 200000; from += 1000) {
        const { data, error } = await supabase
          .from("funnel_events")
          .select("session_id, step, landing_path, traffic_source, tool, device")
          .gte("occurred_at", sinceJ)
          .not("step", "is", null)
          .not("session_id", "is", null)
          .order("occurred_at", { ascending: true })
          .range(from, from + 999);
        if (error) { console.error(error); break; }
        rows.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
      // Session attributes come from its first event
      const sessions = new Map<string, { landing: string; source: string; device: string; tools: Set<string>; steps: Set<string> }>();
      for (const r of rows) {
        const m0 = (r.metadata || {}) as Record<string, any>;
        // Gruppera per anonym resa (återkommande besök) när den finns, annars per session.
        const jk = typeof m0.journey_id === "string" && m0.journey_id ? m0.journey_id : r.session_id;
        let s = sessions.get(jk);
        if (!s) {
          s = { landing: r.landing_path || "(okänd)", source: r.traffic_source || "direct", device: r.device || "desktop", tools: new Set(), steps: new Set() };
          sessions.set(r.session_id, s);
        }
        if (r.tool) s.tools.add(r.tool);
        s.steps.add(r.step);
      }
      const STEP_ORDER = ["landing","cta_view","cta_click","tool_start","tool_step_1","tool_result","shortlist_add","compare_open","intro_open","intro_sent"];
      const filtered = [...sessions.values()].filter((s) =>
        (!src || s.source === src) && (!dev || s.device === dev) && (!toolF || s.tools.has(toolF)) && (!landF || s.landing === landF));
      const counts: Record<string, number> = Object.fromEntries(STEP_ORDER.map((k) => [k, 0]));
      for (const s of filtered) {
        // Ett senare steg innebär att sessionen passerat landningen
        s.steps.add("landing");
        for (const st of s.steps) if (st in counts) counts[st]++;
      }
      const ratio = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : 0);
      const organic = filtered.filter((s) => s.source === "seo" || s.source === "geo_ai");
      const withStart = filtered.filter((s) => s.steps.has("tool_start"));
      const withResult = filtered.filter((s) => s.steps.has("tool_result"));
      const withShort = filtered.filter((s) => s.steps.has("shortlist_add"));
      const sub = [
        { key: "organic_to_start", label: "SEO/GEO-besök → verktygsstart", from: organic.length, to: organic.filter((s) => s.steps.has("tool_start")).length },
        { key: "start_to_result", label: "Verktygsstart → resultat", from: withStart.length, to: withStart.filter((s) => s.steps.has("tool_result")).length },
        { key: "result_to_shortlist", label: "Resultat → shortlist", from: withResult.length, to: withResult.filter((s) => s.steps.has("shortlist_add")).length },
        { key: "shortlist_to_contact", label: "Shortlist → skickad förfrågan", from: withShort.length, to: withShort.filter((s) => s.steps.has("intro_sent")).length },
      ].map((x) => ({ ...x, rate: ratio(x.to, x.from) }));
      const pages = new Map<string, { landing: string; sessions: number; cta_click: number; tool_start: number; tool_result: number; intro_sent: number }>();
      for (const s of filtered) {
        const p = pages.get(s.landing) || { landing: s.landing, sessions: 0, cta_click: 0, tool_start: 0, tool_result: 0, intro_sent: 0 };
        p.sessions++;
        if (s.steps.has("cta_click")) p.cta_click++;
        if (s.steps.has("tool_start")) p.tool_start++;
        if (s.steps.has("tool_result")) p.tool_result++;
        if (s.steps.has("intro_sent")) p.intro_sent++;
        pages.set(s.landing, p);
      }
      const toolSet = new Set<string>();
      for (const s of sessions.values()) for (const t of s.tools) toolSet.add(t);
      return new Response(JSON.stringify({
        success: true,
        days: d,
        sessions: filtered.length,
        steps: STEP_ORDER.map((k) => ({ key: k, count: counts[k] })),
        sub_conversions: sub,
        top_landings: [...pages.values()].sort((a, b) => b.sessions - a.sessions).slice(0, 20),
        tools: [...toolSet].sort(),
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    const since: string | null = days === null ? null : new Date(Date.now() - days * 86400000).toISOString();
    const gte = <T extends { gte: (col: string, v: string) => T }>(q: T, col: string): T =>
      since ? q.gte(col, since) : q;

    // ─── 1. Page visits (visitor_analytics) ───
    let visitQuery = supabase
      .from("visitor_analytics")
      .select("session_id, page_path", { count: "exact", head: false })
      .limit(50000);
    visitQuery = gte(visitQuery, "visited_at");
    if (pageFilter) visitQuery = visitQuery.like("page_path", `${pageFilter}%`);
    const { data: visits, error: visitsErr } = await visitQuery;
    if (visitsErr) console.error("visits err", visitsErr);

    const visitSessions = new Set<string>();
    let visitRows = 0;
    for (const v of visits || []) {
      visitRows++;
      if (v.session_id) visitSessions.add(v.session_id);
    }

    // ─── 2. Funnel events ───
    let feQuery = supabase
      .from("funnel_events")
      .select("event_type, event_name, page_path, session_id")
      .limit(50000);
    feQuery = gte(feQuery, "occurred_at");
    if (pageFilter) feQuery = feQuery.like("page_path", `${pageFilter}%`);
    const { data: feRows, error: feErr } = await feQuery;
    if (feErr) console.error("funnel events err", feErr);

    const ctaViewSessions = new Set<string>();
    const ctaClickSessions = new Set<string>();
    const analysisStartSessions = new Set<string>();
    const analysisCompleteSessions = new Set<string>();
    const pdfSessions = new Set<string>();

    // Per-name breakdowns
    const byEventName: Record<string, Record<string, number>> = {};

    for (const r of feRows || []) {
      const sid = r.session_id || `__no_session_${Math.random()}`;
      const t = r.event_type as string;
      switch (t) {
        case "cta_view": ctaViewSessions.add(sid); break;
        case "cta_click": ctaClickSessions.add(sid); break;
        case "analysis_start": analysisStartSessions.add(sid); break;
        case "analysis_complete": analysisCompleteSessions.add(sid); break;
        case "pdf_download": pdfSessions.add(sid); break;
      }
      if (!byEventName[t]) byEventName[t] = {};
      const name = r.event_name || "(unknown)";
      byEventName[t][name] = (byEventName[t][name] || 0) + 1;
    }

    // ─── 3. Partner profile views & website clicks ───
    const { data: profileViews } = await gte(
      supabase.from("partner_profile_views").select("id").limit(50000),
      "viewed_at",
    );
    const { data: partnerClicks } = await gte(
      supabase.from("partner_clicks").select("id").limit(50000),
      "clicked_at",
    );

    // ─── 4. Leads ───
    const { data: leads } = await gte(
      supabase.from("leads").select("id, source_page, source_type").limit(50000),
      "created_at",
    );

    let leadCount = leads?.length || 0;
    if (pageFilter) {
      leadCount = (leads || []).filter((l) =>
        (l.source_page || "").startsWith(pageFilter)
      ).length;
    }

    // ─── 5. Time series (daily). When all-time, cap to 365 days for chart. ───
    const seriesDays = days ?? 365;
    const seriesSince = since ?? new Date(Date.now() - seriesDays * 86400000).toISOString();
    const dailyMap = new Map<string, { visits: number; clicks: number; analyses: number; leads: number }>();
    const dayKey = (iso: string) => iso.slice(0, 10);
    for (let i = 0; i < seriesDays; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      dailyMap.set(d, { visits: 0, clicks: 0, analyses: 0, leads: 0 });
    }

    const { data: dailyVisits } = await supabase
      .from("visitor_analytics")
      .select("visited_at")
      .gte("visited_at", seriesSince)
      .limit(50000);
    for (const r of dailyVisits || []) {
      const k = dayKey(r.visited_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.visits++;
    }
    const { data: dailyClicks } = await supabase
      .from("funnel_events")
      .select("occurred_at")
      .eq("event_type", "cta_click")
      .gte("occurred_at", seriesSince)
      .limit(50000);
    for (const r of dailyClicks || []) {
      const k = dayKey(r.occurred_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.clicks++;
    }
    const { data: dailyAnal } = await supabase
      .from("funnel_events")
      .select("occurred_at")
      .eq("event_type", "analysis_complete")
      .gte("occurred_at", seriesSince)
      .limit(50000);
    for (const r of dailyAnal || []) {
      const k = dayKey(r.occurred_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.analyses++;
    }
    const { data: dailyLeads } = await supabase
      .from("leads")
      .select("created_at")
      .gte("created_at", seriesSince)
      .limit(50000);
    for (const r of dailyLeads || []) {
      const k = dayKey(r.created_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.leads++;
    }

    const timeseries = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ date, ...v }));

    // ─── Funnel rows ───
    const funnel: FunnelRow[] = [
      { key: "visits", label: "Sidvisningar", count: visitRows },
      { key: "cta_view", label: "Sett CTA", count: ctaViewSessions.size },
      { key: "cta_click", label: "Klickat CTA", count: ctaClickSessions.size },
      { key: "analysis_start", label: "Startat analys", count: analysisStartSessions.size },
      { key: "analysis_complete", label: "Slutfört analys", count: analysisCompleteSessions.size },
      { key: "pdf_download", label: "Laddat ner PDF", count: pdfSessions.size },
      { key: "lead", label: "Skickat lead", count: leadCount },
      { key: "partner_profile", label: "Besökt partnerprofil", count: profileViews?.length || 0 },
      { key: "partner_click", label: "Klickat till partner", count: partnerClicks?.length || 0 },
    ];

    return new Response(
      JSON.stringify({
        success: true,
        days: days ?? "all",
        page_filter: pageFilter,
        funnel,
        by_event_name: byEventName,
        timeseries,
        unique_visitors: visitSessions.size,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("funnel-stats error", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
