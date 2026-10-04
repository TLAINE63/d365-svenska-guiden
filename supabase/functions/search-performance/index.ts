// Sökprestanda för d365.se: Google Search Console (primär) + Bing Webmaster Tools (komplement),
// samt kvartalsvis CSV-import av Semrush Organic Positions för konkurrenter.
// Auth: admin-JWT eller x-report-cron-secret.
// Actions (POST body.action): sync, latest, group_counts, import_csv, overview

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const GSC = "https://connector-gateway.lovable.dev/google_search_console";
const BING = "https://ssl.bing.com/webmaster/api.svc/json";
const SITE_HOST = "d365.se";
const COMPETITORS = ["affarssystemguiden.se", "businesswith.se", "crm-systemguiden.se", "herbertnathan.com"];

const ALLOWED = ["https://d365.se", "https://www.d365.se", "http://localhost:5173", "http://localhost:8080"];
function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  const ok = ALLOWED.includes(o) || o.endsWith(".lovableproject.com") || o.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": ok ? o : ALLOWED[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-report-cron-secret",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}
const b64 = (s: string) => { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; };
async function verifyAdmin(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const bin = atob(b64(sig)); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (!(await crypto.subtle.verify("HMAC", key, bytes, enc.encode(`${h}.${p}`)))) return false;
    const payload = JSON.parse(atob(b64(p)));
    if (payload.exp && payload.exp < Date.now() / 1000) return false;
    return payload.role === "admin";
  } catch { return false; }
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}&+ ]/gu, " ").replace(/\s+/g, " ").trim();
const fmt = (d: Date) => d.toISOString().slice(0, 10);

type Phrase = { id: string; phrase: string; group_tag: string; n: string };
async function loadPhrases(sb: any): Promise<Phrase[]> {
  const { data } = await sb.from("serp_watch_phrases").select("id, phrase, group_tag");
  return (data || []).map((p: any) => ({ ...p, n: norm(p.phrase) })).sort((a: Phrase, b: Phrase) => b.n.length - a.n.length);
}
// Grupp: frågan innehåller en bevakad fras (längsta först) som hela ord, annars Övrigt.
function classify(query: string, phrases: Phrase[]): { group: string; phrase_id: string | null; exact: boolean } {
  const q = ` ${norm(query)} `;
  for (const p of phrases) {
    if (q.trim() === p.n) return { group: p.group_tag, phrase_id: p.id, exact: true };
  }
  for (const p of phrases) {
    if (q.includes(` ${p.n} `)) return { group: p.group_tag, phrase_id: p.id, exact: false };
  }
  return { group: "Övrigt", phrase_id: null, exact: false };
}

async function upsertChunks(sb: any, rows: any[]) {
  for (let i = 0; i < rows.length; i += 1000) {
    const { error } = await sb.from("search_perf_daily").upsert(rows.slice(i, i + 1000), { onConflict: "source,day,query,page" });
    if (error) throw new Error(`Kunde inte spara: ${error.message}`);
  }
}

async function resolveGscSite(headers: Record<string, string>) {
  const r = await fetch(`${GSC}/webmasters/v3/sites`, { headers });
  if (!r.ok) throw new Error(`Search Console [${r.status}]: ${(await r.text()).slice(0, 300)}`);
  const { siteEntry = [] } = await r.json();
  const ok = siteEntry.filter((e: any) => e.permissionLevel !== "siteUnverifiedUser");
  const match = ok.find((e: any) => e.siteUrl === `sc-domain:${SITE_HOST}`)
    || ok.find((e: any) => /^https?:\/\/(www\.)?d365\.se\/$/.test(e.siteUrl));
  if (!match) throw new Error("Ingen verifierad Search Console-egendom för d365.se");
  return match.siteUrl as string;
}

async function syncGsc(sb: any, days: number) {
  const LK = Deno.env.get("LOVABLE_API_KEY"), GK = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!LK || !GK) throw new Error("Search Console är inte kopplat");
  const headers = { Authorization: `Bearer ${LK}`, "X-Connection-Api-Key": GK, "Content-Type": "application/json" };
  const site = await resolveGscSite(headers);
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  const phrases = await loadPhrases(sb);
  const rows: any[] = [];
  for (let startRow = 0; startRow < 250000; startRow += 25000) {
    const r = await fetch(`${GSC}/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: "POST", headers,
      body: JSON.stringify({
        startDate: fmt(start), endDate: fmt(end), dimensions: ["date", "query", "page"],
        dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: "swe" }] }],
        rowLimit: 25000, startRow,
      }),
    });
    if (!r.ok) throw new Error(`Search Console [${r.status}]: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    const batch = j.rows || [];
    for (const x of batch) {
      const [day, query, page] = x.keys;
      rows.push({ source: "gsc", day, query, page, country: "swe", clicks: x.clicks, impressions: x.impressions,
        position: Math.round(x.position * 10) / 10, group_tag: classify(query, phrases).group, fetched_at: new Date().toISOString() });
    }
    if (batch.length < 25000) break;
  }
  await upsertChunks(sb, rows);
  return { site, range: [fmt(start), fmt(end)], rows: rows.length };
}

// Bing: sidor -> frågor per sida. Bing levererar veckovisa datumhinkar och saknar landsfilter.
const bingDate = (s: string) => { const m = /\/Date\((\d+)/.exec(s || ""); return m ? fmt(new Date(Number(m[1]))) : null; };
async function syncBing(sb: any, days: number) {
  const key = Deno.env.get("BING_WEBMASTER_API_KEY");
  if (!key) throw new Error("Bing Webmaster Tools-nyckel saknas");
  const phrases = await loadPhrases(sb);
  const since = fmt(new Date(Date.now() - days * 86400000));
  let siteUrl = "";
  for (const cand of [`https://${SITE_HOST}/`, `https://www.${SITE_HOST}/`, `http://${SITE_HOST}/`]) {
    const r = await fetch(`${BING}/GetPageStats?siteUrl=${encodeURIComponent(cand)}&apikey=${key}`);
    if (r.ok) { const j = await r.json(); if (Array.isArray(j.d)) { siteUrl = cand; break; } }
  }
  if (!siteUrl) throw new Error("Bing hittar ingen verifierad sajt för d365.se");
  const pr = await fetch(`${BING}/GetPageStats?siteUrl=${encodeURIComponent(siteUrl)}&apikey=${key}`);
  const pages = ((await pr.json()).d || []) as any[];
  const topPages = [...new Map(pages.map((p) => [p.Query, p])).keys()].slice(0, 60);
  const agg = new Map<string, any>();
  for (const page of topPages) {
    const r = await fetch(`${BING}/GetPageQueryStats?siteUrl=${encodeURIComponent(siteUrl)}&page=${encodeURIComponent(page)}&apikey=${key}`);
    if (!r.ok) continue;
    for (const q of ((await r.json()).d || []) as any[]) {
      const day = bingDate(q.Date); if (!day || day < since) continue;
      const k = `${day}|${q.Query}|${page}`;
      const cur = agg.get(k) || { source: "bing", day, query: q.Query, page, country: "all", clicks: 0, impressions: 0, position: null,
        group_tag: classify(q.Query, phrases).group, fetched_at: new Date().toISOString() };
      cur.clicks += q.Clicks || 0; cur.impressions += q.Impressions || 0;
      cur.position = q.AvgImpressionPosition > 0 ? q.AvgImpressionPosition : cur.position;
      agg.set(k, cur);
    }
  }
  const rows = [...agg.values()];
  await upsertChunks(sb, rows);
  return { site: siteUrl, pages: topPages.length, rows: rows.length };
}

function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/)[0] || "";
  const delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ";" : ",";
  const out: string[][] = []; let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); out.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  return out.filter((r) => r.some((x) => x.trim()));
}

Deno.serve(async (req) => {
  const ch = cors(req);
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...ch, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: ch });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  try {
    const cronHeader = req.headers.get("x-report-cron-secret");
    let authed = false;
    if (cronHeader) {
      const { data } = await sb.rpc("report_cron_secret");
      authed = !!data && data === cronHeader;
    } else {
      const auth = req.headers.get("authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      authed = !!token && (await verifyAdmin(token, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""));
    }
    if (!authed) return json({ error: "Sessionen har gått ut. Logga in igen." }, 401);

    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : Object.fromEntries(url.searchParams);
    const action = String(body.action || "latest");
    const source = String(body.source || "gsc");

    if (action === "sync") {
      const days = Math.min(Math.max(Number(body.days) || 3, 1), 480);
      const out: Record<string, unknown> = {};
      for (const s of source === "all" ? ["gsc", "bing"] : [source]) {
        const { data: run } = await sb.from("search_perf_runs").insert({ source: s }).select().single();
        try {
          const r = s === "gsc" ? await syncGsc(sb, days) : await syncBing(sb, days);
          await sb.from("search_perf_runs").update({ status: "ok", rows_saved: r.rows }).eq("id", run.id);
          out[s] = r;
        } catch (e: any) {
          await sb.from("search_perf_runs").update({ status: "error", error: e.message }).eq("id", run.id);
          out[s] = { error: e.message };
        }
      }
      return json(out);
    }

    if (action === "latest") {
      const { data: last } = await sb.from("search_perf_daily").select("day").eq("source", source).order("day", { ascending: false }).limit(1).maybeSingle();
      if (!last) return json({ source, day: null, rows: [] });
      const { data } = await sb.from("search_perf_daily").select("query, page, position, impressions, clicks, group_tag")
        .eq("source", source).eq("day", last.day).order("impressions", { ascending: false }).limit(Math.min(Number(body.limit) || 50, 500));
      return json({ source, day: last.day, rows: (data || []).map((r: any) => ({ fras: r.query, sida: r.page, position: r.position, visningar: r.impressions, klick: r.clicks, grupp: r.group_tag })) });
    }

    if (action === "group_counts") {
      const counts: Record<string, Set<string>> = {};
      for (let from = 0; from < 500000; from += 1000) {
        const { data } = await sb.from("search_perf_daily").select("query, group_tag").eq("source", source).range(from, from + 999);
        if (!data?.length) break;
        for (const r of data) (counts[r.group_tag] ||= new Set()).add(r.query);
        if (data.length < 1000) break;
      }
      return json({ source, uniqueQueriesPerGroup: Object.fromEntries(Object.entries(counts).map(([g, s]) => [g, s.size])) });
    }

    if (action === "import_csv") {
      const domain = String(body.domain || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      const exportDate = String(body.export_date || "");
      if (!COMPETITORS.includes(domain) && domain !== SITE_HOST) return json({ error: "Okänd domän" }, 400);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(exportDate)) return json({ error: "Exportdatum måste vara ÅÅÅÅ-MM-DD" }, 400);
      const csv = String(body.csv || "");
      if (!csv || csv.length > 15_000_000) return json({ error: "Tom eller för stor fil" }, 400);
      const table = parseCsv(csv.replace(/^\uFEFF/, ""));
      const head = (table[0] || []).map((h) => h.trim().toLowerCase());
      const iK = head.indexOf("keyword"), iP = head.indexOf("position"), iV = head.indexOf("search volume"), iU = head.indexOf("url");
      if (iK < 0 || iP < 0) return json({ error: "Filen ser inte ut som en Semrush Organic Positions-export (saknar Keyword/Position)" }, 400);
      const phrases = await loadPhrases(sb);
      const best = new Map<string, any>();
      for (const r of table.slice(1)) {
        const kw = (r[iK] || "").trim(); if (!kw) continue;
        const pos = Number(r[iP]) || null;
        const c = classify(kw, phrases);
        const k = norm(kw);
        const cur = best.get(k);
        if (cur && cur.position != null && (pos == null || pos >= cur.position)) continue;
        best.set(k, { keyword: kw, position: pos, volume: iV >= 0 && r[iV] ? Number(r[iV]) || null : null, url: iU >= 0 ? r[iU] || null : null,
          phrase_id: c.exact ? c.phrase_id : null, group_tag: c.group });
      }
      const rows = [...best.values()];
      const { data: imp, error } = await sb.from("competitor_csv_imports").insert({ domain, export_date: exportDate, filename: String(body.filename || "").slice(0, 200),
        rows_total: rows.length, rows_matched: rows.filter((r) => r.phrase_id).length }).select().single();
      if (error) return json({ error: error.message }, 400);
      for (let i = 0; i < rows.length; i += 1000) {
        await sb.from("competitor_csv_rows").insert(rows.slice(i, i + 1000).map((r) => ({ ...r, import_id: imp.id })));
      }
      return json({ ok: true, import: imp });
    }

    if (action === "overview") {
      // d365.se per grupp och månad (GSC + Bing) + senaste CSV-import per konkurrent.
      const agg: Record<string, Record<string, { impressions: number; clicks: number; posW: number; queries: Set<string> }>> = {};
      for (const s of ["gsc", "bing"]) {
        for (let from = 0; from < 1000000; from += 1000) {
          const { data } = await sb.from("search_perf_daily").select("day, query, group_tag, impressions, clicks, position").eq("source", s).range(from, from + 999);
          if (!data?.length) break;
          for (const r of data) {
            const k = `${s}|${r.day.slice(0, 7)}`;
            const g = ((agg[k] ||= {})[r.group_tag] ||= { impressions: 0, clicks: 0, posW: 0, queries: new Set() });
            g.impressions += r.impressions; g.clicks += r.clicks; g.posW += (Number(r.position) || 0) * r.impressions; g.queries.add(r.query);
          }
          if (data.length < 1000) break;
        }
      }
      const trend = Object.entries(agg).flatMap(([k, groups]) => {
        const [src, month] = k.split("|");
        return Object.entries(groups).map(([group, g]) => ({ source: src, month, group, impressions: g.impressions, clicks: g.clicks,
          avgPosition: g.impressions ? Math.round((g.posW / g.impressions) * 10) / 10 : null, queries: g.queries.size }));
      }).sort((a, b) => a.month.localeCompare(b.month));

      const { data: imports } = await sb.from("competitor_csv_imports").select("*").order("export_date", { ascending: false });
      const latest = new Map<string, any>();
      for (const i of imports || []) if (!latest.has(i.domain)) latest.set(i.domain, i);
      const ids = [...latest.values()].map((i) => i.id);
      const { data: crow } = ids.length ? await sb.from("competitor_csv_rows").select("import_id, phrase_id, position, url").in("import_id", ids).not("phrase_id", "is", null) : { data: [] as any[] };
      const { data: phrasesRaw } = await sb.from("serp_watch_phrases").select("id, phrase, group_tag, sort_order").order("sort_order");

      // d365.se: senaste 28 dagars GSC-position för exakt fras
      const since = fmt(new Date(Date.now() - 31 * 86400000));
      const own = new Map<string, { posW: number; imp: number; clicks: number }>();
      const phrases = await loadPhrases(sb);
      for (let from = 0; from < 500000; from += 1000) {
        const { data } = await sb.from("search_perf_daily").select("query, impressions, clicks, position").eq("source", "gsc").gte("day", since).range(from, from + 999);
        if (!data?.length) break;
        for (const r of data) {
          const c = classify(r.query, phrases); if (!c.exact || !c.phrase_id) continue;
          const o = own.get(c.phrase_id) || { posW: 0, imp: 0, clicks: 0 };
          o.posW += (Number(r.position) || 0) * r.impressions; o.imp += r.impressions; o.clicks += r.clicks; own.set(c.phrase_id, o);
        }
        if (data.length < 1000) break;
      }
      const domainOf = new Map([...latest.values()].map((i) => [i.id, i.domain]));
      const comparison = (phrasesRaw || []).map((p: any) => {
        const o = own.get(p.id);
        const comp: Record<string, number | null> = {};
        for (const d of COMPETITORS) comp[d] = null;
        for (const r of crow || []) if (r.phrase_id === p.id) comp[domainOf.get(r.import_id)] = r.position;
        return { phrase: p.phrase, group: p.group_tag, d365: o && o.imp ? Math.round((o.posW / o.imp) * 10) / 10 : null, d365Impressions: o?.imp || 0, competitors: comp };
      });
      const { data: runs } = await sb.from("search_perf_runs").select("*").order("started_at", { ascending: false }).limit(6);
      return json({ trend, comparison, imports: [...latest.values()], competitors: COMPETITORS, runs });
    }

    return json({ error: "Okänd action" }, 400);
  } catch (e: any) {
    console.error("search-performance error", e);
    return json({ error: e?.message || "Internt fel" }, 500);
  }
});
