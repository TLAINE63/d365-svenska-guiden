// Daglig Semrush-baserad rankningssnapshot för bevakade nyckelord.
// Actions (POST body): list, snapshot, history
//
// `list`     → returnerar bevakade nyckelord + senaste position, trafik, trend
// `snapshot` → hämtar färska positioner via Semrush gateway och sparar i seo_keyword_daily
// `history`  → returnerar daglig serie för ett enskilt nyckelord (sparkline)
//
// Auth: admin-JWT (samma HMAC-mönster som övriga SEO-funktioner) eller cron_token = service role

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "http://localhost:5173",
  "http://localhost:8080",
];

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const ok = ALLOWED_ORIGINS.includes(origin)
    || origin.endsWith(".lovableproject.com")
    || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const json = (b: unknown, s: number, h: Record<string, string>) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...h, "Content-Type": "application/json" } });

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

const SEMRUSH_GATEWAY = "https://connector-gateway.lovable.dev/semrush";
const DEFAULT_DOMAIN = "d365.se";
const DEFAULT_DB = "se";

// Parsar Semrush CSV-ish svar (semikolonseparerad) → array av objekt
function parseSemrushCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(";");
  return lines.slice(1).map((line) => {
    const cells = line.split(";");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h.trim()] = (cells[i] ?? "").trim(); });
    return row;
  });
}

async function fetchDomainOrganic(domain: string, database: string): Promise<Record<string, string>[]> {
  const LK = Deno.env.get("LOVABLE_API_KEY");
  const SK = Deno.env.get("SEMRUSH_API_KEY");
  if (!LK || !SK) throw new Error("Semrush ej kopplad (LOVABLE_API_KEY/SEMRUSH_API_KEY saknas)");

  const params = new URLSearchParams({
    domain,
    database,
    export_columns: "Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc",
    display_limit: "500",
  });
  const res = await fetch(`${SEMRUSH_GATEWAY}/domains/domain_organic?${params}`, {
    headers: {
      "Authorization": `Bearer ${LK}`,
      "X-Connection-Api-Key": SK,
      "Allow-Limit-Offset": "true",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Semrush ${res.status}: ${text.slice(0, 300)}`);
  // Försök JSON först, annars CSV-fallback
  try {
    const j = JSON.parse(text);
    const cols: string[] = j?.data?.columnNames || [];
    const rows: any[] = j?.data?.rows || [];
    return rows.map((r) => {
      const obj: Record<string, string> = {};
      cols.forEach((c, i) => { obj[c] = String(r[i] ?? ""); });
      return obj;
    });
  } catch {
    return parseSemrushCsv(text);
  }
}

serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: h });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = String(body.action || "list");

    const tok = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const isAdmin = tok && await verifyAdminJWT(tok, secret);
    const isCron = action === "snapshot" && body.cron_token === secret;
    if (!isAdmin && !isCron) {
      return json({ error: "Sessionen har gått ut. Logga in igen." }, 401, h);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ============ LIST ============
    if (action === "list") {
      const days = Math.min(90, Math.max(7, Number(body.days || 30)));
      const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);

      const { data: kws, error: kErr } = await supabase
        .from("seo_tracked_keywords")
        .select("id, keyword, target_url, notes, is_active")
        .eq("is_active", true)
        .order("keyword");
      if (kErr) throw kErr;

      const keywords = (kws || []).map((k) => k.keyword);
      let daily: any[] = [];
      if (keywords.length > 0) {
        const { data, error } = await supabase
          .from("seo_keyword_daily")
          .select("keyword, snapshot_date, position, search_volume, estimated_traffic, cpc, url")
          .in("keyword", keywords)
          .gte("snapshot_date", since)
          .order("snapshot_date", { ascending: true });
        if (error) throw error;
        daily = data || [];
      }

      // Bygg per-keyword summary + serie
      const byKeyword: Record<string, any[]> = {};
      for (const row of daily) {
        (byKeyword[row.keyword] ||= []).push(row);
      }

      const rows = (kws || []).map((k) => {
        const series = byKeyword[k.keyword] || [];
        const latest = series[series.length - 1] || null;
        const prev = series[series.length - 2] || null;
        const week = series.find((r) => r.snapshot_date <= new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10));
        const month = series[0] || null;
        const delta = (a: any, b: any) =>
          a?.position != null && b?.position != null ? Number(a.position) - Number(b.position) : null;
        return {
          id: k.id,
          keyword: k.keyword,
          target_url: k.target_url,
          notes: k.notes,
          current_position: latest?.position ?? null,
          current_url: latest?.url ?? null,
          search_volume: latest?.search_volume ?? null,
          estimated_traffic: latest?.estimated_traffic ?? null,
          cpc: latest?.cpc ?? null,
          last_snapshot: latest?.snapshot_date ?? null,
          delta_1d: delta(latest, prev),
          delta_7d: delta(latest, week),
          delta_30d: delta(latest, month),
          series: series.map((r) => ({ d: r.snapshot_date, p: r.position, t: r.estimated_traffic })),
        };
      });

      const totalSnapshots = daily.length;
      return json({ rows, totalSnapshots, days, since }, 200, h);
    }

    // ============ HISTORY (one keyword) ============
    if (action === "history") {
      const kw = String(body.keyword || "").trim().toLowerCase();
      if (!kw) return json({ error: "keyword krävs" }, 400, h);
      const days = Math.min(180, Math.max(7, Number(body.days || 90)));
      const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("seo_keyword_daily")
        .select("snapshot_date, position, search_volume, estimated_traffic, cpc, url")
        .eq("keyword", kw)
        .gte("snapshot_date", since)
        .order("snapshot_date", { ascending: true });
      if (error) throw error;
      return json({ series: data || [] }, 200, h);
    }

    // ============ SNAPSHOT ============
    if (action === "snapshot") {
      const domain = String(body.domain || DEFAULT_DOMAIN);
      const database = String(body.database || DEFAULT_DB);

      const { data: kws, error: kErr } = await supabase
        .from("seo_tracked_keywords")
        .select("id, keyword, target_url")
        .eq("is_active", true);
      if (kErr) throw kErr;

      if (!kws || kws.length === 0) {
        return json({ ok: true, inserted: 0, note: "Inga bevakade nyckelord" }, 200, h);
      }

      const semrushRows = await fetchDomainOrganic(domain, database);
      // Indexera per fras (lowercase)
      const byPhrase = new Map<string, Record<string, string>>();
      for (const r of semrushRows) {
        const p = (r.Ph || r.Keyword || "").trim().toLowerCase();
        if (p && !byPhrase.has(p)) byPhrase.set(p, r);
      }

      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);

      // Hämta gårdagens positioner i ett svep för att räkna previous_position
      const { data: prev } = await supabase
        .from("seo_keyword_daily")
        .select("keyword, position")
        .eq("snapshot_date", yesterday)
        .eq("database", database);
      const prevByKw = new Map<string, number | null>();
      for (const row of prev || []) prevByKw.set(row.keyword, row.position == null ? null : Number(row.position));

      const inserts: any[] = [];
      const missing: string[] = [];
      for (const k of kws) {
        const match = byPhrase.get(k.keyword.toLowerCase());
        if (!match) {
          missing.push(k.keyword);
          inserts.push({
            keyword: k.keyword,
            snapshot_date: today,
            database,
            position: null,
            previous_position: prevByKw.get(k.keyword) ?? null,
            search_volume: null,
            estimated_traffic: null,
            cpc: null,
            url: null,
            source: "semrush",
            raw: null,
          });
          continue;
        }
        const num = (s?: string) => {
          if (s == null || s === "") return null;
          const n = Number(s.toString().replace(",", "."));
          return Number.isFinite(n) ? n : null;
        };
        inserts.push({
          keyword: k.keyword,
          snapshot_date: today,
          database,
          position: num(match.Po),
          previous_position: prevByKw.get(k.keyword) ?? num(match.Pp),
          search_volume: num(match.Nq) == null ? null : Math.round(num(match.Nq)!),
          estimated_traffic: num(match.Tr) == null ? null : Math.round(num(match.Tr)!),
          cpc: num(match.Cp),
          url: match.Ur || null,
          source: "semrush",
          raw: match,
        });
      }

      // Upsert i batch
      const { error: upErr } = await supabase
        .from("seo_keyword_daily")
        .upsert(inserts, { onConflict: "keyword,snapshot_date,database" });
      if (upErr) throw upErr;

      return json({
        ok: true,
        inserted: inserts.length,
        with_position: inserts.filter((r) => r.position != null).length,
        missing,
        domain,
        database,
        snapshot_date: today,
      }, 200, h);
    }

    return json({ error: "okänd action" }, 400, h);
  } catch (e: any) {
    console.error("semrush-daily-rankings error", e);
    return json({ error: e?.message || String(e) }, 500, cors(req));
  }
});
