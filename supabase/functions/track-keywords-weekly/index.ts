// Spårning av nyckelord vecka-för-vecka via Google Search Console.
// Admin-skyddad via custom JWT (samma mönster som gsc-stats).
// Actions (POST body): list, save, delete, snapshot, trends

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function b64ToBin(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return atob(b);
}
async function verifyAdminJWT(token: string, secret: string) {
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
  } catch { return false; }
}

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE = "sc-domain:d365.se";
const SITE_ENC = encodeURIComponent(SITE);

// Måndag i veckan för ett givet datum (UTC) → ISO YYYY-MM-DD
function mondayOf(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = d.getUTCDay(); // 0=Sun .. 6=Sat
  const diff = (day + 6) % 7; // dagar tillbaka till måndag
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function gscQuery(headers: Record<string, string>, body: unknown): Promise<GscRow[]> {
  const res = await fetch(
    `${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`,
    { method: "POST", headers, body: JSON.stringify(body) },
  );
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    throw new Error(`GSC ${res.status}: ${text.slice(0, 200)}`);
  }
  return (data?.rows || []) as GscRow[];
}

serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("authorization") || "";
    const tok = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // För `snapshot` tillåter vi även cron (apikey + body.cron_secret matchar service role)
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = String(body.action || "list");

    const isAdmin = tok && (await verifyAdminJWT(tok, secret));
    const isCron = action === "snapshot" && body.cron_token === secret;
    if (!isAdmin && !isCron) {
      return json({ error: "Sessionen har gått ut. Logga in igen." }, 401, cors);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ---------- list ----------
    if (action === "list") {
      const { data, error } = await supabase
        .from("seo_tracked_keywords")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return json({ keywords: data || [] }, 200, cors);
    }

    // ---------- save (create/update) ----------
    if (action === "save") {
      const kw = String(body.keyword || "").trim().toLowerCase();
      if (!kw) return json({ error: "keyword krävs" }, 400, cors);
      const target_url = body.target_url ? String(body.target_url).trim() : null;
      const notes = body.notes ? String(body.notes) : null;
      const is_active = body.is_active !== false;

      if (body.id) {
        const { error } = await supabase
          .from("seo_tracked_keywords")
          .update({ keyword: kw, target_url, notes, is_active })
          .eq("id", String(body.id));
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("seo_tracked_keywords")
          .upsert({ keyword: kw, target_url, notes, is_active }, { onConflict: "keyword,target_url" });
        if (error) throw error;
      }
      return json({ ok: true }, 200, cors);
    }

    // ---------- delete ----------
    if (action === "delete") {
      if (!body.id) return json({ error: "id krävs" }, 400, cors);
      const { error } = await supabase
        .from("seo_tracked_keywords")
        .delete()
        .eq("id", String(body.id));
      if (error) throw error;
      return json({ ok: true }, 200, cors);
    }

    // ---------- snapshot (hämtar nya GSC-veckor för alla aktiva sökord) ----------
    if (action === "snapshot") {
      const LK = Deno.env.get("LOVABLE_API_KEY");
      const GK = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
      if (!LK || !GK) return json({ error: "GSC ej kopplad" }, 500, cors);

      const gscHeaders = {
        "Authorization": `Bearer ${LK}`,
        "X-Connection-Api-Key": GK,
        "Content-Type": "application/json",
      };

      // 12 hela veckor bakåt
      const weeks = Math.max(1, Math.min(26, Number(body.weeks || 12)));
      const now = new Date();
      const end = new Date(now.getTime() - 3 * 24 * 3600 * 1000); // GSC har 2-3 dagars delay
      const start = new Date(end.getTime() - weeks * 7 * 24 * 3600 * 1000);

      const { data: keywords, error: kwErr } = await supabase
        .from("seo_tracked_keywords")
        .select("*")
        .eq("is_active", true);
      if (kwErr) throw kwErr;

      type Bucket = { clicks: number; impressions: number; pos_weighted: number; pos_weight: number };
      let inserted = 0;
      const errors: string[] = [];

      for (const kw of keywords || []) {
        try {
          const filters: any[] = [{
            dimension: "query",
            operator: "equals",
            expression: kw.keyword,
          }];
          if (kw.target_url) {
            filters.push({
              dimension: "page",
              operator: "equals",
              expression: kw.target_url,
            });
          }

          const rows = await gscQuery(gscHeaders, {
            startDate: fmtDate(start),
            endDate: fmtDate(end),
            dimensions: ["date"],
            dimensionFilterGroups: [{ filters }],
            rowLimit: 1000,
          });

          // Bucket per måndag (vecka)
          const buckets = new Map<string, Bucket>();
          for (const r of rows) {
            const day = r.keys?.[0];
            if (!day) continue;
            const wk = mondayOf(day);
            const b = buckets.get(wk) || { clicks: 0, impressions: 0, pos_weighted: 0, pos_weight: 0 };
            b.clicks += r.clicks || 0;
            b.impressions += r.impressions || 0;
            // Viktad medelposition (vikt = impressions)
            b.pos_weighted += (r.position || 0) * (r.impressions || 0);
            b.pos_weight += r.impressions || 0;
            buckets.set(wk, b);
          }

          // Upsert (en rad per vecka). Hoppa över innevarande (ofullständiga) vecka? Vi tar med, GSC ger redan -3 dagar.
          for (const [wk, b] of buckets.entries()) {
            const ctr = b.impressions > 0 ? b.clicks / b.impressions : null;
            const pos = b.pos_weight > 0 ? b.pos_weighted / b.pos_weight : null;
            const row = {
              keyword: kw.keyword,
              target_url: kw.target_url,
              week_start: wk,
              clicks: b.clicks,
              impressions: b.impressions,
              ctr,
              position: pos,
              source: "gsc",
            };
            // Använd vanlig upsert via unique-index (keyword, week_start, COALESCE(target_url,''))
            // Postgres tillåter inte direkt upsert mot COALESCE-index, kör delete-then-insert
            await supabase
              .from("seo_keyword_weekly")
              .delete()
              .eq("keyword", row.keyword)
              .eq("week_start", row.week_start)
              .is("target_url", row.target_url === null ? null : undefined as any)
              .eq("target_url", row.target_url || "");
            // Den ovanstående är klumpig — gör enklare: radera matchande och infoga.
            const delQ = supabase.from("seo_keyword_weekly").delete().eq("keyword", row.keyword).eq("week_start", row.week_start);
            if (row.target_url) await delQ.eq("target_url", row.target_url);
            else await delQ.is("target_url", null);

            const { error: insErr } = await supabase.from("seo_keyword_weekly").insert(row);
            if (insErr) throw insErr;
            inserted++;
          }
        } catch (e: any) {
          errors.push(`${kw.keyword}: ${e.message}`);
        }
      }

      return json({
        ok: true,
        keywords_processed: keywords?.length || 0,
        weeks_inserted: inserted,
        errors,
      }, 200, cors);
    }

    // ---------- trends (returnerar tidsserier + week-over-week-delta) ----------
    if (action === "trends") {
      const weeks = Math.max(2, Math.min(26, Number(body.weeks || 12)));
      const sinceDate = new Date();
      sinceDate.setUTCDate(sinceDate.getUTCDate() - weeks * 7);
      const since = sinceDate.toISOString().slice(0, 10);

      const { data: keywords, error: kwErr } = await supabase
        .from("seo_tracked_keywords")
        .select("*")
        .order("created_at", { ascending: true });
      if (kwErr) throw kwErr;

      const { data: snaps, error: snErr } = await supabase
        .from("seo_keyword_weekly")
        .select("keyword, target_url, week_start, clicks, impressions, ctr, position")
        .gte("week_start", since)
        .order("week_start", { ascending: true });
      if (snErr) throw snErr;

      // Bygg per-keyword series
      const byKey = new Map<string, any[]>();
      for (const s of snaps || []) {
        const key = `${s.keyword}::${s.target_url || ""}`;
        const arr = byKey.get(key) || [];
        arr.push(s);
        byKey.set(key, arr);
      }

      const result = (keywords || []).map((kw: any) => {
        const key = `${kw.keyword}::${kw.target_url || ""}`;
        const series = byKey.get(key) || [];
        const latest = series[series.length - 1] || null;
        const previous = series[series.length - 2] || null;
        const oldest = series[0] || null;

        const delta = (cur: any, base: any, field: string) => {
          if (!cur || !base) return null;
          const c = Number(cur[field] ?? 0);
          const b = Number(base[field] ?? 0);
          return { current: c, previous: b, change: c - b };
        };

        return {
          ...kw,
          series,
          latest,
          previous,
          oldest,
          week_over_week: {
            position: delta(latest, previous, "position"),
            clicks: delta(latest, previous, "clicks"),
            impressions: delta(latest, previous, "impressions"),
            ctr: delta(latest, previous, "ctr"),
          },
          period_change: {
            position: delta(latest, oldest, "position"),
            clicks: delta(latest, oldest, "clicks"),
          },
        };
      });

      return json({ weeks, since, keywords: result }, 200, cors);
    }

    return json({ error: "okänd action" }, 400, cors);
  } catch (err: any) {
    console.error("track-keywords-weekly error", err);
    return json({ error: err?.message || "Internt fel" }, 500, cors);
  }
});
