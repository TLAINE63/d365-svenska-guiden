// Hämtar live konkurrentdata via Semrush gateway:
//  - top organic keywords (domain_organic) -> härleds även "topp sidor" från landningssidornas URL
//  - top referring domains (backlinks_refdomains)
//  - backlinks overview (backlinks_overview) -> total/AS
// Admin-only (custom JWT, samma mönster som manage-semrush-stats).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin)
    || origin.endsWith(".lovableproject.com")
    || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function base64UrlToBase64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(s: string): Uint8Array {
  const bin = atob(base64UrlToBase64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyAdminJWT(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC", key, base64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`)
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch { return false; }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" }
  });
}

const GATEWAY = "https://connector-gateway.lovable.dev/semrush";

async function semrush(path: string, params: Record<string, string>) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SEMRUSH_API_KEY = Deno.env.get("SEMRUSH_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!SEMRUSH_API_KEY) throw new Error("SEMRUSH_API_KEY missing");

  const qs = new URLSearchParams(params).toString();
  const url = `${GATEWAY}${path}?${qs}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SEMRUSH_API_KEY,
    },
  });
  const text = await res.text();
  let body: any;
  try { body = JSON.parse(text); } catch { body = { raw: text }; }
  if (!res.ok) {
    throw new Error(`Semrush ${path} [${res.status}]: ${text.slice(0, 200)}`);
  }
  // Standard envelope: { data: { columnNames, rows }, status }
  return body;
}

function rowsToObjects(data: any): Array<Record<string, string>> {
  const cols: string[] = data?.data?.columnNames || [];
  const rows: any[][] = data?.data?.rows || [];
  return rows.map((r) => {
    const o: Record<string, string> = {};
    cols.forEach((c, i) => { o[c] = String(r[i] ?? ""); });
    return o;
  });
}

// Strip protocol + path → "businesswith.se"
function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "").replace(/^www\./, "");
  d = d.split("/")[0];
  return d;
}

function urlPathLabel(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    const p = u.pathname.replace(/\/$/, "") || "/";
    return p;
  } catch {
    return rawUrl;
  }
}

interface DomainInsights {
  domain: string;
  keywords: Array<{ keyword: string; position: number; volume: number; url: string }>;
  topPages: Array<{ url: string; estTraffic: number; keywordCount: number }>;
  refDomains: Array<{ domain: string; authorityScore: number; backlinks: number }>;
  overview: { total: number | null; referringDomains: number | null; authorityScore: number | null };
  errors: string[];
}

async function fetchDomain(domain: string, database: string): Promise<DomainInsights> {
  const errors: string[] = [];
  const norm = normalizeDomain(domain);

  let keywords: DomainInsights["keywords"] = [];
  let topPages: DomainInsights["topPages"] = [];
  let refDomains: DomainInsights["refDomains"] = [];
  let overview: DomainInsights["overview"] = { total: null, referringDomains: null, authorityScore: null };

  // 1) Top organic keywords
  try {
    const r = await semrush("/domains/domain_organic", {
      domain: norm,
      database,
      display_limit: "25",
      export_columns: "Ph,Po,Nq,Cp,Tr,Ur",
    });
    const objs = rowsToObjects(r);
    keywords = objs.map((o) => ({
      keyword: o.Ph || "",
      position: Number(o.Po || 0),
      volume: Number(o.Nq || 0),
      url: o.Ur || "",
    }));

    // Härled topp sidor från landningssidor i top keywords
    const map = new Map<string, { url: string; estTraffic: number; keywordCount: number }>();
    for (const o of objs) {
      const url = o.Ur || "";
      if (!url) continue;
      const tr = Number(o.Tr || 0);
      const cur = map.get(url) || { url, estTraffic: 0, keywordCount: 0 };
      cur.estTraffic += tr;
      cur.keywordCount += 1;
      map.set(url, cur);
    }
    topPages = Array.from(map.values()).sort((a, b) => b.estTraffic - a.estTraffic).slice(0, 10);
  } catch (e: any) {
    errors.push(`keywords: ${e.message}`);
  }

  // 2) Top referring domains
  try {
    const r = await semrush("/backlinks/backlinks_refdomains", {
      target: norm,
      target_type: "root_domain",
      display_limit: "15",
      export_columns: "domain_ascore,domain,backlinks_num",
    });
    const objs = rowsToObjects(r);
    refDomains = objs.map((o) => ({
      domain: o.domain || "",
      authorityScore: Number(o.domain_ascore || 0),
      backlinks: Number(o.backlinks_num || 0),
    }));
  } catch (e: any) {
    errors.push(`refdomains: ${e.message}`);
  }

  // 3) Backlinks overview
  try {
    const r = await semrush("/backlinks/backlinks_overview", {
      target: norm,
      target_type: "root_domain",
      export_columns: "ascore,total,domains_num",
    });
    const o = rowsToObjects(r)[0];
    if (o) {
      overview = {
        total: Number(o.total || 0),
        referringDomains: Number(o.domains_num || 0),
        authorityScore: Number(o.ascore || 0),
      };
    }
  } catch (e: any) {
    errors.push(`overview: ${e.message}`);
  }

  return { domain: norm, keywords, topPages, refDomains, overview, errors };
}

serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyAdminJWT(token, secret))) {
      return json({ error: "Sessionen har gått ut. Logga in igen." }, 401, cors);
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const domainsInput: string[] = Array.isArray(body.domains) ? body.domains : [];
    const database: string = body.database || "se";
    if (domainsInput.length === 0) {
      return json({ error: "domains krävs" }, 400, cors);
    }
    if (domainsInput.length > 8) {
      return json({ error: "max 8 domäner per anrop" }, 400, cors);
    }

    const results = await Promise.all(
      domainsInput.map((d) => fetchDomain(d, database).catch((e) => ({
        domain: normalizeDomain(d),
        keywords: [], topPages: [], refDomains: [],
        overview: { total: null, referringDomains: null, authorityScore: null },
        errors: [String(e?.message || e)],
      } as DomainInsights)))
    );

    return json({ database, results, generatedAt: new Date().toISOString() }, 200, cors);
  } catch (err: any) {
    console.error("competitor-insights error", err);
    return json({ error: err?.message || "Internt fel" }, 500, cors);
  }
});
