/**
 * refresh-sitemaps
 *
 * Resubmits the published sitemaps to Google Search Console and pings
 * IndexNow (Bing/Yandex) so newly published content gets re-crawled
 * without waiting for the next manual SEO action.
 *
 * Triggered by:
 *   - pg_cron (daily at 03:00 UTC)
 *   - Manual invoke from the admin SEO tab
 */
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const HOST = "d365.se";
const SITE_PROPERTY = "sc-domain:d365.se";
const SITEMAP_URLS = [
  `https://${HOST}/sitemap_index.xml`,
  `https://${HOST}/sitemap.xml`,
];
const INDEXNOW_KEY = "1ee300110a6717b5dec524f828e978f2";

const GSC_GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

interface RefreshResult {
  ok: boolean;
  gsc: Array<{ sitemap: string; status: number; ok: boolean; error?: string }>;
  indexnow: { status: number; ok: boolean; urls: number; error?: string };
  ranAt: string;
}

async function submitSitemap(sitemapUrl: string, lovableKey: string, gscKey: string) {
  const encoded = encodeURIComponent(sitemapUrl);
  const path = `/webmasters/v3/sites/${encodeURIComponent(SITE_PROPERTY)}/sitemaps/${encoded}`;
  const res = await fetch(`${GSC_GATEWAY}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gscKey,
    },
  });
  let error: string | undefined;
  if (!res.ok) {
    try {
      error = (await res.text()).slice(0, 500);
    } catch {
      error = "unknown error";
    }
  }
  return { sitemap: sitemapUrl, status: res.status, ok: res.ok, error };
}

async function fetchSitemapUrls(): Promise<string[]> {
  // Fetch the sitemap index, then each child sitemap, and extract <loc>s.
  const indexRes = await fetch(`https://${HOST}/sitemap_index.xml`);
  if (!indexRes.ok) return [];
  const indexXml = await indexRes.text();
  const childSitemaps = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  const all = new Set<string>();
  for (const child of childSitemaps) {
    try {
      const r = await fetch(child);
      if (!r.ok) continue;
      const xml = await r.text();
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        all.add(m[1].trim());
      }
    } catch {
      /* skip */
    }
  }
  return [...all];
}

async function pingIndexNow(urls: string[]) {
  if (!urls.length) {
    return { status: 0, ok: false, urls: 0, error: "no urls" };
  }
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  let error: string | undefined;
  if (!res.ok) {
    try {
      error = (await res.text()).slice(0, 500);
    } catch {
      error = "unknown error";
    }
  }
  return { status: res.status, ok: res.ok, urls: urls.length, error };
}

function b64ToBin(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return atob(b);
}

async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const sigBin = b64ToBin(sig);
    const sigBytes = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) sigBytes[i] = sigBin.charCodeAt(i);
    const ok = await crypto.subtle.verify(
      "HMAC", key, sigBytes as unknown as BufferSource, enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(b64ToBin(p));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  // Authorization: either the scheduled cron job (service role key) or an admin JWT.
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const bearer = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  const cronToken = typeof body?.cron_token === "string" ? body.cron_token : "";
  const adminToken = typeof body?.token === "string" ? body.token : "";

  const isCron = serviceRoleKey.length > 0 && (bearer === serviceRoleKey || cronToken === serviceRoleKey);
  const isAdmin = !isCron && adminToken.length > 0 && serviceRoleKey.length > 0
    && await verifyAdminJWT(adminToken, serviceRoleKey);

  if (!isCron && !isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }


  if (!lovableKey) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!gscKey) {
    return new Response(JSON.stringify({ error: "GOOGLE_SEARCH_CONSOLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const gsc = await Promise.all(
      SITEMAP_URLS.map((u) => submitSitemap(u, lovableKey, gscKey)),
    );

    const urls = await fetchSitemapUrls();
    const indexnow = await pingIndexNow(urls);

    const result: RefreshResult = {
      ok: gsc.every((g) => g.ok) && indexnow.ok,
      gsc,
      indexnow,
      ranAt: new Date().toISOString(),
    };

    console.log("refresh-sitemaps result", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("refresh-sitemaps failed", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
