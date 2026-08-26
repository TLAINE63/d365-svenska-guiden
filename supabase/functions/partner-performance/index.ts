import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}
function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

type EventRow = {
  partner_slug: string;
  event_name: string;
  event_level: number;
  visitor_id: string | null;
  session_id: string | null;
  intent_track: string | null;
  metadata: Record<string, unknown> | null;
  occurred_at: string;
};

const EXPOSURE = new Set([
  "partner_list_impression",
  "partner_filter_impression",
  "partner_comparison_impression",
  "partner_match_impression",
]);
const LEADS = new Set(["partner_contact_request", "partner_intro_request"]);

const monthKey = (iso: string) => iso.slice(0, 7);

function emptyCounts() {
  return {
    exposures: 0,
    listImpressions: 0,
    filterImpressions: 0,
    comparisonImpressions: 0,
    matchImpressions: 0,
    profileViews: 0,
    profileReturns: 0,
    caseClicks: 0,
    competencyClicks: 0,
    saved: 0,
    addedToComparison: 0,
    matchRecommended: 0,
    matchSelected: 0,
    leads: 0,
    contactRequests: 0,
    introRequests: 0,
  };
}
type Counts = ReturnType<typeof emptyCounts>;

function tally(rows: EventRow[]): Counts {
  const c = emptyCounts();
  for (const r of rows) {
    if (EXPOSURE.has(r.event_name)) c.exposures++;
    switch (r.event_name) {
      case "partner_list_impression": c.listImpressions++; break;
      case "partner_filter_impression": c.filterImpressions++; break;
      case "partner_comparison_impression": c.comparisonImpressions++; break;
      case "partner_match_impression": c.matchImpressions++; break;
      case "partner_profile_view": c.profileViews++; break;
      case "partner_profile_return": c.profileReturns++; break;
      case "partner_case_click": c.caseClicks++; break;
      case "partner_competency_click": c.competencyClicks++; break;
      case "partner_saved": c.saved++; break;
      case "partner_added_to_comparison": c.addedToComparison++; break;
      case "partner_match_recommended": c.matchRecommended++; break;
      case "partner_match_selected": c.matchSelected++; break;
      case "partner_contact_request": c.contactRequests++; break;
      case "partner_intro_request": c.introRequests++; break;
    }
    if (LEADS.has(r.event_name)) c.leads++;
  }
  return c;
}

const pctChange = (now: number, prev: number): number | null => {
  if (prev === 0) return now > 0 ? 100 : null;
  return Math.round(((now - prev) / prev) * 1000) / 10;
};

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token: string = String(body?.token || "");
    if (!token || token.length < 8) {
      return new Response(JSON.stringify({ error: "Ogiltig länk" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: tokenData } = await supabase
      .from("partner_event_tokens")
      .select("id, partner_id, partners:partner_id (id, name, slug, logo_url, is_featured, customer_examples, ai_profile, extended_competencies, industries, office_cities, product_filters, positioning_statement, team_size_sweden)")
      .eq("token", token)
      .maybeSingle();

    const partner = (tokenData as any)?.partners;
    if (!tokenData || !partner || !partner.is_featured) {
      return new Response(JSON.stringify({ error: "Ogiltig länk eller otillräckliga rättigheter" }), {
        status: 403,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("partner_event_tokens")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("id", tokenData.id);

    const since = new Date(Date.now() - 400 * 86400000).toISOString();

    const { data: allRows } = await supabase
      .from("partner_engagement_events")
      .select("partner_slug, event_name, event_level, visitor_id, session_id, intent_track, metadata, occurred_at")
      .gte("occurred_at", since)
      .limit(200000);

    const rows = (allRows ?? []) as EventRow[];
    const mine = rows.filter((r) => r.partner_slug === partner.slug);

    // ── KPI: innevarande 30 dagar vs föregående 30 dagar ────────────────
    const now = Date.now();
    const d30 = new Date(now - 30 * 86400000).toISOString();
    const d60 = new Date(now - 60 * 86400000).toISOString();

    const current = tally(mine.filter((r) => r.occurred_at >= d30));
    const previous = tally(mine.filter((r) => r.occurred_at >= d60 && r.occurred_at < d30));

    const kpis = [
      { key: "exposures", label: "Exponeringar", value: current.exposures, change: pctChange(current.exposures, previous.exposures) },
      { key: "profileViews", label: "Profilvisningar", value: current.profileViews + current.profileReturns, change: pctChange(current.profileViews + current.profileReturns, previous.profileViews + previous.profileReturns) },
      { key: "comparisons", label: "Partnerjämförelser", value: current.addedToComparison, change: pctChange(current.addedToComparison, previous.addedToComparison) },
      { key: "leads", label: "Leads", value: current.leads, change: pctChange(current.leads, previous.leads) },
    ];

    // ── 12 månaders historik ────────────────────────────────────────────
    const months: string[] = [];
    const d = new Date();
    d.setUTCDate(1);
    for (let i = 11; i >= 0; i--) {
      const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1));
      months.push(m.toISOString().slice(0, 7));
    }
    const byMonth = new Map<string, EventRow[]>();
    for (const r of mine) {
      const k = monthKey(r.occurred_at);
      if (!byMonth.has(k)) byMonth.set(k, []);
      byMonth.get(k)!.push(r);
    }
    const visibilitySeries = months.map((m) => {
      const c = tally(byMonth.get(m) ?? []);
      return {
        month: m,
        list: c.listImpressions,
        filter: c.filterImpressions,
        comparison: c.comparisonImpressions,
        match: c.matchImpressions,
        total: c.exposures,
        profileViews: c.profileViews + c.profileReturns,
        leads: c.leads,
      };
    });

    // ── Nivå 3: köpsignaler (samma besökare som sett profilen) ──────────
    const profileVisitors = new Set(
      mine
        .filter((r) => r.event_name === "partner_profile_view" || r.event_name === "partner_profile_return")
        .map((r) => r.visitor_id)
        .filter(Boolean) as string[],
    );
    const intent = { erp: new Set<string>(), crm: new Set<string>(), ai: new Set<string>() };
    for (const r of rows) {
      if (!r.intent_track || !r.visitor_id) continue;
      if (!profileVisitors.has(r.visitor_id)) continue;
      const track = r.intent_track as "erp" | "crm" | "ai";
      if (intent[track]) intent[track].add(r.visitor_id);
    }

    const buyingSignals = {
      profileVisitors: profileVisitors.size,
      erp: intent.erp.size,
      crm: intent.crm.size,
      ai: intent.ai.size,
    };

    // ── Benchmark mot jämförbara verifierade partner ────────────────────
    const { data: verified } = await supabase
      .from("partners")
      .select("slug")
      .eq("is_featured", true);
    const verifiedSlugs = new Set((verified ?? []).map((p: { slug: string }) => p.slug));

    const per = new Map<string, Counts>();
    for (const slug of verifiedSlugs) per.set(slug, emptyCounts());
    for (const r of rows) {
      if (r.occurred_at < d30) continue;
      if (!per.has(r.partner_slug)) continue;
      const c = per.get(r.partner_slug)!;
      const single = tally([r]);
      for (const k of Object.keys(c) as (keyof Counts)[]) c[k] += single[k];
    }
    const metricsForBenchmark: { key: keyof Counts | "profileTotal"; label: string }[] = [
      { key: "profileTotal", label: "Profilvisningar" },
      { key: "addedToComparison", label: "Partnerjämförelser" },
      { key: "saved", label: "Shortlists" },
      { key: "matchRecommended", label: "Partnermatchningar" },
      { key: "exposures", label: "Exponeringar" },
    ];
    const valueOf = (c: Counts, key: string) =>
      key === "profileTotal" ? c.profileViews + c.profileReturns : (c as any)[key] as number;

    const benchmark = metricsForBenchmark.map(({ key, label }) => {
      const values = Array.from(per.values()).map((c) => valueOf(c, String(key)));
      const mineValue = valueOf(current, String(key));
      const avg = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0;
      const better = values.filter((v) => v < mineValue).length;
      const percentile = values.length ? Math.round((better / values.length) * 100) : 0;
      return { label, value: mineValue, average: avg, percentile };
    });

    // ── Automatiska rekommendationer ───────────────────────────────────
    const recommendations: { title: string; body: string }[] = [];
    const customerExamples = (partner.customer_examples ?? []) as string[];
    if (!customerExamples.filter(Boolean).length) {
      recommendations.push({
        title: "Lägg till kundcase",
        body: "Profilen saknar kundexempel. Kundcase är en av de starkaste signalerna när köpare jämför partner – lägg till minst tre referenser.",
      });
    }
    const aiProfile = (partner.ai_profile ?? {}) as Record<string, unknown>;
    if (!aiProfile || Object.keys(aiProfile).length === 0 || !aiProfile["ai_experience_summary"]) {
      recommendations.push({
        title: "Komplettera AI- och Copilot-kompetens",
        body: "Din AI-/Copilot-profil är ofullständig. Köpare filtrerar allt oftare på AI-erfarenhet – fyll i din AI-profil för att matcha fler förfrågningar.",
      });
    }
    if (!((partner.industries ?? []) as string[]).length) {
      recommendations.push({
        title: "Ange fokusbranscher",
        body: "Bransch väger tyngst i matchningen. Utan branschval syns du mer sällan i filtrerade sökningar.",
      });
    }
    if (!((partner.office_cities ?? []) as string[]).length) {
      recommendations.push({
        title: "Fyll i kontorsorter",
        body: "Geografisk närvaro används i både filter och matchning. Lägg till dina kontorsorter för högre träffsäkerhet.",
      });
    }
    if (!partner.positioning_statement) {
      recommendations.push({
        title: "Skriv en tydlig positionering",
        body: "En kort och tydlig positionering ökar sannolikheten att köparen går vidare till jämförelse eller shortlist.",
      });
    }
    if (current.caseClicks === 0 && current.profileViews > 10) {
      recommendations.push({
        title: "Gör kundcasen mer synliga",
        body: "Profilen får besök men inga klick på kundcase. Skärp rubriker och resultat i dina case.",
      });
    }

    // ── Dynamisk CTA ───────────────────────────────────────────────────
    const activity = current.profileViews + current.profileReturns + current.addedToComparison * 2 + current.leads * 5;
    let cta: { level: "low" | "normal" | "high"; title: string; button: string };
    if (activity < 15) {
      cta = { level: "low", title: "Få ut mer av er partnerprofil", button: "Få personliga förbättringsförslag" };
    } else if (activity < 60) {
      cta = { level: "normal", title: "Vill ni synas oftare i köparnas utvärderingar?", button: "Boka en profilgenomgång" };
    } else {
      cta = { level: "high", title: "Ni presterar starkt. Nästa steg är fler affärsdialoger.", button: "Boka ett strategimöte" };
    }

    return new Response(
      JSON.stringify({
        partner: { name: partner.name, slug: partner.slug, logo_url: partner.logo_url },
        kpis,
        current,
        previous,
        visibilitySeries,
        buyingSignals,
        benchmark,
        recommendations,
        cta,
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("partner-performance error:", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
