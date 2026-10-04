// Månadsvis bevakning av sökpositioner via Semrush domain_organic.
// En hämtning per domän och månad (hög display_limit, matchning lokalt mot bevakade fraser),
// kvotstyrd mot max 10 hämtningar per dag. Admin-JWT eller cron-secret.
// Actions (POST body.action): run, latest, compare, config, add_phrase, delete_phrase, add_domain, delete_domain

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const DAILY_LIMIT = 10;
const ROW_LIMIT = 20000;
const GATEWAY = "https://connector-gateway.lovable.dev/semrush";

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

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const monthStart = (d = new Date()) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;

Deno.serve(async (req) => {
  const ch = cors(req);
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...ch, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: ch });

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  try {
    // Auth
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

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const url = new URL(req.url);
    const action = String(body.action || url.searchParams.get("action") || "latest");

    if (action === "config") {
      const [{ data: domains }, { data: phrases }, { data: usage }] = await Promise.all([
        sb.from("serp_watch_domains").select("*").order("sort_order"),
        sb.from("serp_watch_phrases").select("*").order("sort_order"),
        sb.from("serp_watch_api_usage").select("*").eq("day", new Date().toISOString().slice(0, 10)).maybeSingle(),
      ]);
      return json({ domains, phrases, callsToday: usage?.calls || 0, dailyLimit: DAILY_LIMIT });
    }

    if (action === "add_phrase") {
      const phrase = norm(String(body.phrase || ""));
      const group_tag = String(body.group_tag || "Övrigt").trim().slice(0, 40);
      if (!phrase || phrase.length > 120) return json({ error: "Ogiltig fras" }, 400);
      const { error } = await sb.from("serp_watch_phrases").insert({ phrase, group_tag, sort_order: 999 });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    if (action === "delete_phrase") {
      const { error } = await sb.from("serp_watch_phrases").delete().eq("id", String(body.id || ""));
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    if (action === "add_domain") {
      const domain = norm(String(body.domain || "")).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return json({ error: "Ogiltig domän" }, 400);
      const { error } = await sb.from("serp_watch_domains").insert({ domain, sort_order: 99 });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    if (action === "delete_domain") {
      const { error } = await sb.from("serp_watch_domains").delete().eq("domain", String(body.domain || "")).eq("is_own", false);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "run") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      const SEMRUSH_API_KEY = Deno.env.get("SEMRUSH_API_KEY");
      if (!LOVABLE_API_KEY || !SEMRUSH_API_KEY) return json({ error: "Semrush-kopplingen saknas" }, 500);

      const month = monthStart();
      const today = new Date().toISOString().slice(0, 10);
      const { data: domains } = await sb.from("serp_watch_domains").select("domain").order("sort_order");
      const { data: phrases } = await sb.from("serp_watch_phrases").select("id, phrase");
      const byPhrase = new Map((phrases || []).map((p) => [norm(p.phrase), p.id as string]));
      const log: Array<Record<string, unknown>> = [];

      for (const { domain } of domains || []) {
        const { data: existing } = await sb.from("serp_watch_runs").select("*").eq("month", month).eq("domain", domain).maybeSingle();
        if (existing?.status === "complete") { log.push({ domain, status: "redan klar" }); continue; }

        const { data: usage } = await sb.from("serp_watch_api_usage").select("calls").eq("day", today).maybeSingle();
        const used = usage?.calls || 0;
        if (used >= DAILY_LIMIT) { log.push({ domain, status: "dagskvot slut, fortsätter imorgon" }); break; }
        await sb.from("serp_watch_api_usage").upsert({ day: today, calls: used + 1 });

        const run = existing || (await sb.from("serp_watch_runs").insert({ month, domain, status: "running", chunks_total: 1 }).select().single()).data;

        const qs = new URLSearchParams({ domain, database: "se", export_columns: "Ph,Po,Nq,Ur", display_limit: String(ROW_LIMIT) });
        const res = await fetch(`${GATEWAY}/domains/domain_organic?${qs}`, {
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": SEMRUSH_API_KEY, "Allow-Limit-Offset": "true" },
        });
        const text = await res.text();
        let parsed: any = {}; try { parsed = JSON.parse(text); } catch { /* */ }
        const errStr = !res.ok ? `[${res.status}] ${text.slice(0, 200)}` : (parsed?.error ? String(parsed.error) : "");
        if (errStr) {
          const quota = /LIMIT EXCEEDED|134/.test(errStr);
          await sb.from("serp_watch_runs").update({ status: "error", last_error: quota ? "Semrush-kvoten är slut, försök igen senare." : errStr, calls_used: (run.calls_used || 0) + 1 }).eq("id", run.id);
          log.push({ domain, status: "fel", error: errStr });
          if (quota) break;
          continue;
        }
        const cols: string[] = parsed?.data?.columnNames || [];
        const rows: any[][] = parsed?.data?.rows || [];
        const nothing = cols[0]?.includes("NOTHING FOUND");
        const iPh = cols.indexOf("Keyword"), iPo = cols.indexOf("Position"), iNq = cols.indexOf("Search Volume"), iUr = cols.indexOf("Url");

        const best = new Map<string, { position: number; volume: number | null; url: string }>();
        if (!nothing) for (const r of rows) {
          const pid = byPhrase.get(norm(String(r[iPh] || "")));
          if (!pid) continue;
          const pos = Number(r[iPo]);
          if (!pos || pos > 100) continue;
          const vol = r[iNq] === "" || r[iNq] == null ? null : Number(r[iNq]);
          const cur = best.get(pid);
          if (!cur || pos < cur.position) best.set(pid, { position: pos, volume: vol, url: String(r[iUr] || "") });
        }

        const results = (phrases || []).map((p) => {
          const b = best.get(p.id);
          return { run_id: run.id, phrase_id: p.id, position: b?.position ?? null, volume: b?.volume ?? null, url: b?.url || null, fetched_at: new Date().toISOString() };
        });
        await sb.from("serp_watch_results").upsert(results, { onConflict: "run_id,phrase_id" });
        // Gratisnivån returnerar max 10 rader per hämtning: markera som ofullständig.
        const capped = !nothing && rows.length > 0 && rows.length <= 10;
        await sb.from("serp_watch_runs").update({
          status: capped ? "partial" : "complete", chunks_done: 1, calls_used: (run.calls_used || 0) + 1,
          last_error: capped ? `Semrush returnerade bara ${rows.length} rader (kontots radtak). Fraser utanför dessa kan ranka utan att synas.` : null,
        }).eq("id", run.id);
        log.push({ domain, status: "klar", rowsFromSemrush: rows.length, matched: best.size });
      }
      return json({ month, log });
    }

    if (action === "latest" || action === "compare") {
      const domainFilter = String(body.domain || url.searchParams.get("domain") || "");
      const { data: runs } = await sb.from("serp_watch_runs").select("id, month, domain, status, updated_at").order("month", { ascending: false });
      const months = [...new Set((runs || []).map((r) => r.month as string))];
      const cur = String(body.month || months[0] || "");
      const prev = months[months.indexOf(cur) + 1] || null;
      const pick = (m: string | null) => (runs || []).filter((r) => r.month === m && (!domainFilter || r.domain === domainFilter));
      const curRuns = pick(cur), prevRuns = pick(prev);
      const ids = [...curRuns, ...prevRuns].map((r) => r.id);
      const { data: res } = ids.length
        ? await sb.from("serp_watch_results").select("run_id, phrase_id, position, volume, url").in("run_id", ids)
        : { data: [] as any[] };
      const { data: phrases } = await sb.from("serp_watch_phrases").select("id, phrase, group_tag, sort_order").order("sort_order");
      const runMap = new Map([...curRuns, ...prevRuns].map((r) => [r.id, r]));
      const rows = (res || []).filter((r) => runMap.get(r.run_id)?.month === cur).map((r) => {
        const run = runMap.get(r.run_id)!;
        const ph = (phrases || []).find((p) => p.id === r.phrase_id);
        const prevRun = prevRuns.find((x) => x.domain === run.domain);
        const prevRes = prevRun ? (res || []).find((x) => x.run_id === prevRun.id && x.phrase_id === r.phrase_id) : null;
        return {
          domain: run.domain, phrase: ph?.phrase, group: ph?.group_tag, phrase_id: r.phrase_id,
          position: r.position, position_label: r.position == null ? "ej topp 100" : String(r.position),
          volume: r.volume, volume_label: r.volume == null ? "okänd volym" : String(r.volume),
          url: r.url, previous_position: prevRes ? prevRes.position : undefined,
        };
      });
      return json({ month: cur, previousMonth: prev, months, runs: curRuns, phrases, rows });
    }

    return json({ error: "Okänd action" }, 400);
  } catch (e: any) {
    console.error("serp-watch error", e);
    return json({ error: e?.message || "Internt fel" }, 500);
  }
});
