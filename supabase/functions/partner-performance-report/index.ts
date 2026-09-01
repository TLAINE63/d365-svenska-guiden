import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders } from "../_shared/cors.ts";

// ─────────────────────────── Auth ───────────────────────────
function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64UrlDecode(sig) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// ─────────────────────────── Helpers ───────────────────────────
const COMPARE_PAGES = ["/jamfor-partners"];
const FULL_SURFACE_TRACKING_START = "2026-08-27T00:00:00.000Z";

function monthRange(month: string): { start: string; end: string } {
  // month = "YYYY-MM"
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return { start: start.toISOString(), end: end.toISOString() };
}
function prevMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function pct(part: number, total: number): number | null {
  if (!total) return null;
  return Math.round((part / total) * 1000) / 10;
}
function topBreakdown(counts: Record<string, number>, limit = 5) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return [];
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count, share: pct(count, total) }));
}

interface Metrics {
  impressions: number;
  impressionSessions: number;
  profileViews: number;
  profileViewSessions: number;
  cardClicks: number;
  comparisons: number;
  compareAdds: number;
  contactClicks: number;
  websiteClicks: number;
  leads: number;
}

async function collectMetrics(
  supabase: any,
  partner: { id: string; slug: string; name: string },
  month: string,
) {
  const { start, end } = monthRange(month);

  const [expRes, viewRes, clickRes, funnelRes, leadRes] = await Promise.all([
    supabase
      .from("partner_filter_exposures")
      .select("session_id, page_path, filter_context, viewed_at")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", start)
      .lt("viewed_at", end)
      .limit(20000),
    supabase
      .from("partner_profile_views")
      .select("view_type, page_source, viewed_at")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", start)
      .lt("viewed_at", end)
      .limit(20000),
    supabase
      .from("partner_clicks")
      .select("page_source, clicked_at")
      .eq("partner_name", partner.name)
      .gte("clicked_at", start)
      .lt("clicked_at", end)
      .limit(20000),
    supabase
      .from("funnel_events")
      .select("event_name, session_id, metadata, occurred_at")
      .gte("occurred_at", start)
      .lt("occurred_at", end)
      .in("event_name", ["partner_compare_add", "partner_contact_click", "partner_cta_started"])
      .limit(20000),
    supabase
      .from("leads")
      .select("id, assigned_partners, created_at")
      .gte("created_at", start)
      .lt("created_at", end)
      .limit(20000),
  ]);

  const exposures = expRes.data || [];
  const views = viewRes.data || [];
  const clicks = clickRes.data || [];
  const funnel = (funnelRes.data || []).filter(
    (f: any) => (f.metadata?.partner_slug || f.metadata?.slug) === partner.slug,
  );
  const leads = (leadRes.data || []).filter((l: any) =>
    (l.assigned_partners || []).some(
      (p: string) => p === partner.slug || p === partner.name,
    ),
  );

  // Breakdowns from filter context
  const product: Record<string, number> = {};
  const industry: Record<string, number> = {};
  const size: Record<string, number> = {};
  const geography: Record<string, number> = {};
  const impressionSessions = new Set<string>();
  const compareSessions = new Set<string>();

  for (const e of exposures) {
    if (e.session_id) impressionSessions.add(e.session_id);
    const fc = (e.filter_context || {}) as Record<string, unknown>;
    const add = (bag: Record<string, number>, val: unknown) => {
      if (typeof val !== "string" || !val.trim() || val === "all") return;
      for (const part of val.split(",").map((v) => v.trim()).filter(Boolean)) {
        bag[part] = (bag[part] || 0) + 1;
      }
    };
    add(product, fc.product);
    add(industry, fc.industry);
    add(size, fc.size ?? fc.companySize);
    add(geography, fc.geography);

    if (COMPARE_PAGES.some((p) => (e.page_path || "").startsWith(p))) {
      compareSessions.add(e.session_id || `anon-${Math.random()}`);
    }
  }

  const profileViews = views.filter((v: any) => v.view_type === "profile_visit");
  const cardClicks = views.filter((v: any) => v.view_type === "card_click");

  // Partners most often compared with (same session + compare page)
  let comparedWith: { name: string; count: number }[] = [];
  if (compareSessions.size > 0) {
    const sessionIds = Array.from(compareSessions).filter((s) => !s.startsWith("anon-"));
    if (sessionIds.length) {
      const { data: coRows } = await supabase
        .from("partner_filter_exposures")
        .select("partner_slug, session_id")
        .in("session_id", sessionIds.slice(0, 500))
        .gte("viewed_at", start)
        .lt("viewed_at", end)
        .limit(20000);
      const counts: Record<string, number> = {};
      const seen = new Set<string>();
      for (const r of coRows || []) {
        if (r.partner_slug === partner.slug) continue;
        const key = `${r.session_id}|${r.partner_slug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        counts[r.partner_slug] = (counts[r.partner_slug] || 0) + 1;
      }
      const slugs = Object.keys(counts);
      let nameBySlug: Record<string, string> = {};
      if (slugs.length) {
        const { data: names } = await supabase
          .from("partners")
          .select("slug, name")
          .in("slug", slugs);
        nameBySlug = Object.fromEntries((names || []).map((n: any) => [n.slug, n.name]));
      }
      comparedWith = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([slug, count]) => ({ name: nameBySlug[slug] || slug, count }));
    }
  }

  const metrics: Metrics = {
    impressions: exposures.length,
    impressionSessions: impressionSessions.size,
    profileViews: profileViews.length,
    profileViewSessions: profileViews.length,
    cardClicks: cardClicks.length,
    comparisons: compareSessions.size,
    compareAdds: funnel.filter((f: any) => f.event_name === "partner_compare_add").length,
    contactClicks: funnel.filter((f: any) => f.event_name === "partner_contact_click").length,
    websiteClicks: clicks.length,
    leads: leads.length,
  };

  return {
    metrics,
    breakdowns: {
      product: topBreakdown(product),
      industry: topBreakdown(industry),
      size: topBreakdown(size),
      geography: topBreakdown(geography),
    },
    comparedWith,
  };
}

async function collectCoverage(supabase: any, partnerSlug: string, month: string) {
  const { start, end } = monthRange(month);
  const [exposures, views, events] = await Promise.all([
    supabase.from("partner_filter_exposures").select("session_id, viewed_at")
      .eq("partner_slug", partnerSlug).gte("viewed_at", start).lt("viewed_at", end).limit(20000),
    supabase.from("partner_profile_views").select("viewed_at")
      .eq("partner_slug", partnerSlug).gte("viewed_at", start).lt("viewed_at", end).limit(20000),
    supabase.from("partner_engagement_events").select("session_id, occurred_at")
      .eq("partner_slug", partnerSlug).gte("occurred_at", start).lt("occurred_at", end).limit(20000),
  ]);
  const exposureRows = exposures.data || [];
  const eventRows = events.data || [];
  const earliest = (rows: any[], key: string) => rows.reduce<string | null>((min, row) => {
    const value = typeof row[key] === "string" ? row[key] : null;
    return value && (!min || value < min) ? value : min;
  }, null);
  const isCurrentMonth = month === new Date().toISOString().slice(0, 7);
  const complete = start >= FULL_SURFACE_TRACKING_START && !isCurrentMonth;
  const warnings: string[] = [];
  if (start < FULL_SURFACE_TRACKING_START) {
    warnings.push("Exponeringar på alla publika partnerytor blev fullt instrumenterade först 2026/08/27. Äldre profilvisningar, klick och filterexponeringar redovisas, men saknade kortvisningar har inte uppskattats.");
  }
  if (isCurrentMonth) warnings.push("Månaden pågår och siffrorna är preliminära.");
  return {
    complete,
    isCurrentMonth,
    warnings,
    sources: [
      { label: "Filter- och jämförelseexponeringar", source: "partner_filter_exposures", start: earliest(exposureRows, "viewed_at"), rows: exposureRows.length, sessions: new Set(exposureRows.map((r: any) => r.session_id).filter(Boolean)).size },
      { label: "Profilvisningar och kortklick", source: "partner_profile_views", start: earliest(views.data || [], "viewed_at"), rows: (views.data || []).length, sessions: null },
      { label: "Partner Performance-event", source: "partner_engagement_events", start: earliest(eventRows, "occurred_at"), rows: eventRows.length, sessions: new Set(eventRows.map((r: any) => r.session_id).filter(Boolean)).size },
    ],
  };
}

// ─────────────────────────── Profile strength ───────────────────────────
function profileStrength(p: any) {
  const checks: { label: string; ok: boolean; weight: number }[] = [
    { label: "Företagsbeskrivning", ok: !!(p.description && p.description.length > 80), weight: 8 },
    { label: "Positionering", ok: !!p.positioning_statement, weight: 6 },
    { label: "Logotyp", ok: !!p.logo_url, weight: 5 },
    { label: "Verifierade produktområden", ok: (p.applications || []).length > 0, weight: 10 },
    { label: "Branscher", ok: (p.industries || []).length > 0, weight: 10 },
    { label: "Geografi", ok: (p.geography || []).length > 0, weight: 5 },
    { label: "Kontorsorter", ok: (p.office_cities || []).length > 0, weight: 4 },
    { label: "Kontaktperson", ok: !!p.contact_person, weight: 6 },
    { label: "Kontaktuppgifter", ok: !!(p.email || p.phone), weight: 5 },
    { label: "Kontaktfoto", ok: !!p.contact_photo_url, weight: 3 },
    { label: "Kundcase", ok: (p.customer_examples || []).length > 0, weight: 10 },
    { label: "Målgrupp / företagsstorlek", ok: !!(p.delivery_profile && Object.keys(p.delivery_profile).length), weight: 6 },
    { label: "Antal implementationer per område", ok: !!(p.implementations_per_app && Object.keys(p.implementations_per_app).length), weight: 5 },
    { label: "AI-profil", ok: !!(p.ai_profile && Object.keys(p.ai_profile).length), weight: 6 },
    { label: "Videointervju", ok: !!p.youtube_video_id, weight: 6 },
    { label: "Fördjupat innehåll", ok: !!p.extended_content, weight: 5 },
  ];
  const total = checks.reduce((a, c) => a + c.weight, 0);
  const got = checks.filter((c) => c.ok).reduce((a, c) => a + c.weight, 0);
  return {
    score: Math.round((got / total) * 100),
    completed: checks.filter((c) => c.ok).map((c) => c.label),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}

// ─────────────────────────── Recommendations ───────────────────────────
function buildRecommendations(partner: any, data: any, strength: any): { title: string; body: string }[] {
  const recs: { title: string; body: string }[] = [];
  const m = data.metrics;

  const topIndustry = data.breakdowns.industry[0];
  if (topIndustry && (partner.customer_examples || []).length < 2) {
    recs.push({
      title: `Stärk er position inom ${topIndustry.label}`,
      body: `${topIndustry.label} står för ${topIndustry.share}% av de sökningar där ni exponerats, men profilen innehåller få dokumenterade kundcase. Lägg till ytterligare ett relevant case inom området.`,
    });
  }
  if (!partner.youtube_video_id) {
    recs.push({
      title: "Spela in er partnerintervju",
      body: "Profilen saknar video. En videointervju ger köpare möjlighet att lära känna er och innehållet kan publiceras både på d365.se och YouTube.",
    });
  }
  if (m.impressions > 0 && m.profileViews / Math.max(m.impressions, 1) < 0.15) {
    recs.push({
      title: "Öka intresset i sökresultaten",
      body: `Ni exponerades ${m.impressions} gånger men fick ${m.profileViews} profilbesök. En tydligare positionering och fler verifierade kompetenser kan bidra till att fler köpare öppnar profilen.`,
    });
  }
  if (strength.missing.length) {
    recs.push({
      title: "Komplettera profilen",
      body: `Följande delar saknas i profilen: ${strength.missing.slice(0, 4).join(", ")}. En komplett profil kan bidra till ökad synlighet och fler relevanta matchningar.`,
    });
  }
  return recs.slice(0, 3);
}

// ─────────────────────────── Handler ───────────────────────────
Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => ({}));
    const { action, token } = body as { action?: string; token?: string };

    const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SECRET) return json({ error: "Auth not configured" }, 500);
    if (!(await verifyAdminJWT(token || "", SECRET))) {
      return json({ error: "Ogiltig session" }, 401);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", SECRET);

    if (action === "list_partners") {
      const { data } = await supabase
        .from("partners")
        .select("id, slug, name, published_at")
        .not("published_at", "is", null)
        .order("name");
      const { data: firstExp } = await supabase
        .from("partner_filter_exposures")
        .select("viewed_at")
        .order("viewed_at", { ascending: true })
        .limit(1);
      return json({
        partners: data || [],
        data_start: firstExp?.[0]?.viewed_at ?? null,
      });
    }

    if (action === "get") {
      const month: string = body.month;
      const slug: string = body.partner_slug;
      if (!month || !slug) return json({ error: "month och partner_slug krävs" }, 400);

      const { data: partner } = await supabase
        .from("partners")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!partner) return json({ error: "Partner hittades inte" }, 404);

      const current = await collectMetrics(supabase, partner, month);
      const previous = await collectMetrics(supabase, partner, prevMonth(month));
      const strength = profileStrength(partner);
      const coverage = await collectCoverage(supabase, partner.slug, month);

      const { data: saved } = await supabase
        .from("partner_performance_reports")
        .select("*")
        .eq("partner_slug", slug)
        .eq("period_month", `${month}-01`)
        .maybeSingle();

      const { data: firstExp } = await supabase
        .from("partner_filter_exposures")
        .select("viewed_at")
        .order("viewed_at", { ascending: true })
        .limit(1);

      const recommendations =
        saved?.recommendations && (saved.recommendations as any[]).length
          ? saved.recommendations
          : buildRecommendations(partner, current, strength);

      return json({
        partner: { id: partner.id, slug: partner.slug, name: partner.name },
        month,
        current,
        previous: previous.metrics,
        previous_month: prevMonth(month),
        strength,
        recommendations,
        admin_comment: saved?.admin_comment ?? "",
        status: saved?.status ?? "draft",
        approved_at: saved?.approved_at ?? null,
        sent_at: saved?.sent_at ?? null,
        data_start: firstExp?.[0]?.viewed_at ?? null,
        coverage,
      });
    }

    if (action === "save") {
      const { partner_slug, month, admin_comment, recommendations, status, metrics, coverage_confirmed } = body as any;
      if (!partner_slug || !month) return json({ error: "month och partner_slug krävs" }, 400);
      const { data: partner } = await supabase
        .from("partners")
        .select("id, slug, name")
        .eq("slug", partner_slug)
        .maybeSingle();
      if (!partner) return json({ error: "Partner hittades inte" }, 404);
      const coverage = await collectCoverage(supabase, partner.slug, month);
      if (status === "approved" && !coverage.complete && coverage_confirmed !== true) {
        return json({ error: "Ofullständig mättäckning måste bekräftas före godkännande" }, 400);
      }

      const row: Record<string, unknown> = {
        partner_id: partner.id,
        partner_slug: partner.slug,
        partner_name: partner.name,
        period_month: `${month}-01`,
        admin_comment: admin_comment ?? null,
        recommendations: recommendations ?? [],
        metrics: { ...(metrics ?? {}), coverage, coverage_confirmed: coverage_confirmed === true },
        status: status ?? "draft",
        approved_at: status === "approved" ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("partner_performance_reports")
        .upsert(row, { onConflict: "partner_slug,period_month" })
        .select()
        .maybeSingle();
      if (error) {
        console.error("save error", error);
        return json({ error: "Kunde inte spara rapporten" }, 500);
      }
      return json({ success: true, report: data });
    }

    return json({ error: "Okänd action" }, 400);
  } catch (e) {
    console.error("partner-performance-report error", e);
    return json({ error: "Internal server error" }, 500);
  }
});
