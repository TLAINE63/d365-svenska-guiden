import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// ── CORS ──────────────────────────────────────────────────────────────
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

// ── JWT ───────────────────────────────────────────────────────────────
function b64UrlToB64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64UrlDecode(s: string) {
  const bin = atob(b64UrlToB64(s));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, payload: null as any };
    const [h, p, s] = parts;
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
      b64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return { valid: false, payload: null };
    const payload = JSON.parse(atob(b64UrlToB64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, payload: null };
    if (payload.role !== "admin") return { valid: false, payload: null };
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────
function anonymizeOrg(org: string): string {
  // Strip ASN/ISP suffixes; keep the company-ish prefix
  return org
    .replace(/\bAB\b|\bAS\b|\bOY\b|\bAPS\b|\bGMBH\b|\bLTD\b|\bLLC\b|\bINC\b/gi, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const partnerId: string | null = body?.partnerId || null;
    const daysRaw = body?.days;
    const isAllTime = daysRaw === null || daysRaw === "all" || daysRaw === 0;
    const days: number | null = isAllTime ? null : ([7, 30, 90, 180, 365].includes(daysRaw) ? daysRaw : 30);

    const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SECRET) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = await verifyJWT(token, SECRET);
    if (!v.valid) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const since: string | null = days === null ? null : new Date(Date.now() - days * 86400000).toISOString();

    // ── Build exclusion sets (admin IP, partner-update IP, partner orgs) ──
    const adminIp = (v.payload?.ip as string) || "";
    const adminPrefix = adminIp ? adminIp.split(".").slice(0, 2).join(".") : "";

    const puPrefixes = new Set<string>();
    const { data: pu } = await supabase
      .from("visitor_analytics")
      .select("ip_anonymized")
      .like("page_path", "%partner-uppdatering%");
    for (const r of pu || []) {
      if (r.ip_anonymized && r.ip_anonymized !== "unknown") {
        puPrefixes.add(r.ip_anonymized.split(".").slice(0, 2).join("."));
      }
    }

    const { data: pubPartners } = await supabase
      .from("partners")
      .select("id, name, slug, website, email, is_featured")
      .eq("is_featured", true);

    const partnerKeywords: string[] = [];
    const partnerDomains = new Set<string>();
    for (const p of pubPartners || []) {
      if (p.website) {
        try {
          const d = new URL(p.website).hostname.replace(/^www\./, "").toLowerCase();
          partnerDomains.add(d);
          const main = d.split(".")[0];
          if (main && main.length > 2) partnerKeywords.push(main.toLowerCase());
        } catch { /* ignore */ }
      }
      if (p.email) {
        const ed = p.email.split("@")[1]?.toLowerCase();
        if (ed) partnerDomains.add(ed);
      }
      if (p.name) partnerKeywords.push(p.name.toLowerCase());
    }
    const isPartnerOrg = (org: string | null) => {
      if (!org) return false;
      const o = org.toLowerCase();
      for (const k of partnerKeywords) if (o.includes(k)) return true;
      for (const d of partnerDomains) if (o.includes(d.split(".")[0])) return true;
      return false;
    };
    const isExcludedIp = (ip: string | null) => {
      if (!ip || ip === "unknown") return false;
      const p = ip.split(".").slice(0, 2).join(".");
      if (adminPrefix && p === adminPrefix) return true;
      if (puPrefixes.has(p)) return true;
      return false;
    };

    // ── 1. Sajttrafik (paginated) ──────────────────────────────────────
    const visits: {
      page_path: string;
      session_id: string | null;
      visited_at: string;
      referrer: string | null;
      ip_anonymized: string | null;
      geo_org: string | null;
    }[] = [];
    for (let from = 0; from < 200000; from += 1000) {
      let q = supabase
        .from("visitor_analytics")
        .select("page_path, session_id, visited_at, referrer, ip_anonymized, geo_org")
        .order("visited_at", { ascending: false })
        .range(from, from + 999);
      if (since) q = q.gte("visited_at", since);
      const { data, error } = await q;
      if (error) break;
      if (!data || data.length === 0) break;
      visits.push(...data);
      if (data.length < 1000) break;
    }
    const filtered = visits.filter((r) => {
      if (r.referrer) {
        const ref = r.referrer.toLowerCase();
        if (ref.includes("lovableproject.com") || ref.includes("lovable.dev") || ref.includes("lovable.app")) return false;
      }
      if (isPartnerOrg(r.geo_org)) return false;
      if (isExcludedIp(r.ip_anonymized)) return false;
      return true;
    });

    const uniqueSessions = new Set<string>();
    for (const r of filtered) if (r.session_id) uniqueSessions.add(r.session_id);

    // Top topics — group knowledge-center / product pages
    const topicCount = new Map<string, number>();
    for (const r of filtered) {
      const p = (r.page_path || "").replace(/\/$/, "") || "/";
      // Group articles by product slug
      const m = p.match(/^\/kunskapscenter\/([^/]+)/);
      const key = m ? `Kunskapscenter: ${m[1]}` : p;
      topicCount.set(key, (topicCount.get(key) || 0) + 1);
    }
    const topTopics = Array.from(topicCount.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15);

    // ── 2. Behovsanalyser (started vs completed) ───────────────────────
    const analysisPaths = filtered.filter(
      (r) => r.page_path?.includes("behovsanalys") || r.page_path?.includes("ai-readiness"),
    );
    const analysisStarted = new Set(analysisPaths.map((r) => r.session_id).filter(Boolean));
    // "Completed" proxy: lead submission with source_type/source_page tied to analysis
    let leadsQ = supabase
      .from("leads")
      .select("id, source_page, source_type, industry, selected_product");
    if (since) leadsQ = leadsQ.gte("created_at", since);
    const { data: analysisLeads } = await leadsQ;
    const completed = (analysisLeads || []).filter(
      (l) => (l.source_page || "").includes("behovsanalys") || (l.source_type || "").includes("analys"),
    ).length;

    // ── 3. Partner-specifika siffror ───────────────────────────────────
    let partnerProfileViews = 0;
    let partnerClicks = 0;
    let partnerName: string | null = null;
    let partnerSlug: string | null = null;
    if (partnerId) {
      const partner = (pubPartners || []).find((p) => p.id === partnerId);
      partnerName = partner?.name || null;
      partnerSlug = partner?.slug || null;

      let pvQ = supabase
        .from("partner_profile_views")
        .select("*", { count: "exact", head: true })
        .eq("partner_id", partnerId);
      if (since) pvQ = pvQ.gte("viewed_at", since);
      const { count: pvCount } = await pvQ;
      partnerProfileViews = pvCount || 0;

      if (partnerName) {
        let clQ = supabase
          .from("partner_clicks")
          .select("*", { count: "exact", head: true })
          .eq("partner_name", partnerName);
        if (since) clQ = clQ.gte("clicked_at", since);
        const { count: clCount } = await clQ;
        partnerClicks = clCount || 0;
      }
    }

    // Globala partner-tot (alltid)
    let gpvQ = supabase
      .from("partner_profile_views")
      .select("*", { count: "exact", head: true });
    if (since) gpvQ = gpvQ.gte("viewed_at", since);
    const { count: globalProfileViews } = await gpvQ;
    let gclQ = supabase
      .from("partner_clicks")
      .select("*", { count: "exact", head: true });
    if (since) gclQ = gclQ.gte("clicked_at", since);
    const { count: globalClicks } = await gclQ;

    // ── 4. Mest använda filter (industry + product) från leads ─────────
    const industryMap = new Map<string, number>();
    const productMap = new Map<string, number>();
    for (const l of analysisLeads || []) {
      if (l.industry) industryMap.set(l.industry, (industryMap.get(l.industry) || 0) + 1);
      if (l.selected_product) productMap.set(l.selected_product, (productMap.get(l.selected_product) || 0) + 1);
    }
    const topIndustries = Array.from(industryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    const topProducts = Array.from(productMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ── 5. Identifierade företagssegment (anonymiserat) ────────────────
    const orgMap = new Map<string, number>();
    for (const r of filtered) {
      if (!r.geo_org) continue;
      if (isPartnerOrg(r.geo_org)) continue;
      // Filter out hosting / ISPs (best-effort)
      const lower = r.geo_org.toLowerCase();
      if (
        lower.includes("telia") || lower.includes("comhem") || lower.includes("bredband") ||
        lower.includes("telenor") || lower.includes("tele2") || lower.includes("hetzner") ||
        lower.includes("amazon") || lower.includes("google") || lower.includes("microsoft corp") ||
        lower.includes("cloudflare") || lower.includes("digital ocean") || lower.includes("ovh") ||
        lower.includes("bahnhof") || lower.includes("hosting")
      ) continue;
      const clean = anonymizeOrg(r.geo_org);
      if (!clean || clean.length < 3) continue;
      orgMap.set(clean, (orgMap.get(clean) || 0) + 1);
    }
    const companySegments = Array.from(orgMap.entries())
      .map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20);

    return new Response(
      JSON.stringify({
        days,
        partner: { id: partnerId, name: partnerName, slug: partnerSlug },
        traffic: {
          uniqueVisitors: uniqueSessions.size,
          pageViews: filtered.length,
          topTopics,
        },
        analyses: {
          startedSessions: analysisStarted.size,
          completed,
        },
        partnerStats: {
          profileViews: partnerProfileViews,
          clicks: partnerClicks,
          globalProfileViews: globalProfileViews || 0,
          globalClicks: globalClicks || 0,
        },
        filters: {
          topIndustries,
          topProducts,
        },
        companySegments,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("partner-dashboard error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
