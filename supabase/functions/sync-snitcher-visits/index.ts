import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
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

function base64UrlToBase64(s: string): string {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(s: string): Uint8Array {
  const bin = atob(base64UrlToBase64(s));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, base64UrlDecode(s) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

const SNITCHER_BASE = "https://api.snitcher.com/v1";

async function snitcherFetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${SNITCHER_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Snitcher ${path} ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function extractPartnerSlugs(urls: string[]): string[] {
  const slugs = new Set<string>();
  const re = /\/partner\/([a-z0-9-]+)\/?(?:\?|#|$)/i;
  for (const u of urls || []) {
    const m = (u || "").match(re);
    if (m) slugs.add(m[1].toLowerCase());
  }
  return Array.from(slugs);
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SNITCHER_API_KEY = Deno.env.get("SNITCHER_API_KEY");
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SNITCHER_API_KEY) throw new Error("SNITCHER_API_KEY saknas");
    if (!JWT_SECRET) throw new Error("JWT secret saknas");

    let body: any = {};
    try { body = await req.json(); } catch { /* */ }

    // Require admin JWT (from request body or Authorization header)
    const authHeader = req.headers.get("authorization") || "";
    const headerToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : "";
    const token = body?.token || headerToken;
    const isAdmin = token ? await verifyAdminJWT(token, JWT_SECRET) : false;
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );


    const wsResp = await snitcherFetch("/workspaces", SNITCHER_API_KEY);
    const workspaces: any[] = wsResp.data || [];
    if (workspaces.length === 0) throw new Error("Ingen Snitcher-workspace hittad");
    let workspace = workspaces.find(w => (w.url || "").includes("d365")) || workspaces[0];
    const workspaceUuid: string = body.workspaceUuid || workspace.uuid;

    let upserted = 0;
    let orgsScanned = 0;
    let orgsWithPartnerVisit = 0;
    let page = 1;
    const maxPages = Math.min(Math.max(Number(body.maxPages) || 50, 1), 200);
    let lastPage = 1;

    while (page <= maxPages) {
      const orgResp = await snitcherFetch(
        `/workspaces/${workspaceUuid}/organisations?page=${page}&per_page=100`,
        SNITCHER_API_KEY,
      );
      const items: any[] = orgResp.data || [];
      lastPage = Number(orgResp.last_page) || lastPage;
      if (items.length === 0) break;

      for (const org of items) {
        orgsScanned++;
        const pages: string[] = org.pages_visited || [];
        const partnerSlugs = extractPartnerSlugs(pages);
        if (partnerSlugs.length > 0) orgsWithPartnerVisit++;

        const visitedUrls = pages.map((url) => ({ url }));

        const { error } = await supabase
          .from("snitcher_visits")
          .upsert({
            workspace_uuid: workspaceUuid,
            organisation_uuid: org.uuid,
            // We don't have per-session granularity from this endpoint; use org uuid as session key
            session_uuid: `org:${org.uuid}`,
            company_name: org.name ?? null,
            company_domain: org.website ?? null,
            company_industry: org.industry ?? null,
            company_size: org.size ?? null,
            company_country: org.address?.country ?? null,
            company_logo_url: org.logo ?? null,
            session_started_at: org.first_seen ?? null,
            session_ended_at: org.last_seen ?? null,
            visited_urls: visitedUrls,
            partner_slugs: partnerSlugs,
            raw_data: org as Record<string, unknown>,
            synced_at: new Date().toISOString(),
          }, { onConflict: "session_uuid" });

        if (!error) upserted++;
        else console.error("Upsert error", org.uuid, error.message);
      }

      // Snitcher ignores per_page and returns a fixed page size; rely on last_page from response.
      if (page >= lastPage) break;
      page++;
    }

    return new Response(JSON.stringify({
      success: true,
      workspaceUuid,
      orgsScanned,
      orgsWithPartnerVisit,
      upserted,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("sync-snitcher-visits error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
