// Public site-traffic stats for partners (no auth, hidden URL).
// Mirrors site-traffic-stats logic but without admin JWT.
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

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = Date.now();
    const since90 = new Date(now - 90 * 86400000).toISOString();
    const since30 = new Date(now - 30 * 86400000).toISOString();
    const since7 = new Date(now - 7 * 86400000).toISOString();

    // Build partner exclusion sets (mirrors site-traffic-stats)
    const partnerUpdateIpPrefixes = new Set<string>();
    const { data: puVisits } = await supabase
      .from("visitor_analytics")
      .select("ip_anonymized")
      .like("page_path", "%partner-uppdatering%");
    for (const r of puVisits || []) {
      if (r.ip_anonymized && r.ip_anonymized !== "unknown") {
        partnerUpdateIpPrefixes.add(r.ip_anonymized.split(".").slice(0, 2).join("."));
      }
    }

    const { data: pubPartners } = await supabase
      .from("partners")
      .select("name, website, email")
      .eq("is_featured", true);
    const partnerDomains = new Set<string>();
    const partnerNameKeywords: string[] = [];
    for (const p of pubPartners || []) {
      if (p.website) {
        try {
          const domain = new URL(p.website).hostname.replace(/^www\./, "").toLowerCase();
          partnerDomains.add(domain);
          const mainPart = domain.split(".")[0];
          if (mainPart && mainPart.length > 2) partnerNameKeywords.push(mainPart.toLowerCase());
        } catch { /* ignore */ }
      }
      if (p.email) {
        const emailDomain = p.email.split("@")[1]?.toLowerCase();
        if (emailDomain) partnerDomains.add(emailDomain);
      }
      if (p.name) partnerNameKeywords.push(p.name.toLowerCase());
    }

    const isPartnerOrg = (geoOrg: string | null): boolean => {
      if (!geoOrg) return false;
      const orgLower = geoOrg.toLowerCase();
      for (const k of partnerNameKeywords) if (orgLower.includes(k)) return true;
      for (const d of partnerDomains) if (orgLower.includes(d.split(".")[0])) return true;
      return false;
    };
    const isExcludedIp = (ipAnon: string | null): boolean => {
      if (!ipAnon || ipAnon === "unknown") return false;
      const prefix = ipAnon.split(".").slice(0, 2).join(".");
      if (partnerUpdateIpPrefixes.has(prefix)) return true;
      return false;
    };

    const all: {
      page_path: string;
      session_id: string | null;
      visited_at: string;
      referrer: string | null;
      ip_anonymized: string | null;
      geo_org: string | null;
    }[] = [];
    const pageSize = 1000;
    for (let from = 0; from < 200000; from += pageSize) {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("page_path, session_id, visited_at, referrer, ip_anonymized, geo_org")
        .gte("visited_at", since90)
        .order("visited_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        console.error("query error", error);
        return new Response(JSON.stringify({ error: "query failed" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < pageSize) break;
    }

    const filtered = all.filter((r) => {
      if (r.referrer) {
        const ref = r.referrer.toLowerCase();
        if (ref.includes("lovableproject.com") || ref.includes("lovable.dev") || ref.includes("lovable.app")) return false;
      }
      if (isPartnerOrg(r.geo_org)) return false;
      if (isExcludedIp(r.ip_anonymized)) return false;
      return true;
    });

    function totals(rows: typeof filtered) {
      const s = new Set<string>();
      for (const r of rows) if (r.session_id) s.add(r.session_id);
      return { pageViews: rows.length, uniqueVisitors: s.size };
    }
    function topPages(rows: typeof filtered, limit = 20) {
      const map = new Map<string, { views: number; sessions: Set<string> }>();
      for (const r of rows) {
        const key = r.page_path || "(okänd)";
        let m = map.get(key);
        if (!m) {
          m = { views: 0, sessions: new Set() };
          map.set(key, m);
        }
        m.views++;
        if (r.session_id) m.sessions.add(r.session_id);
      }
      return Array.from(map.entries())
        .map(([path, v]) => ({ path, views: v.views, uniqueVisitors: v.sessions.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }

    const r7 = filtered.filter((r) => r.visited_at >= since7);
    const r30 = filtered.filter((r) => r.visited_at >= since30);
    const r90 = filtered;

    return new Response(
      JSON.stringify({
        totals: { d7: totals(r7), d30: totals(r30), d90: totals(r90) },
        topPages: { d7: topPages(r7), d30: topPages(r30), d90: topPages(r90) },
      }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
