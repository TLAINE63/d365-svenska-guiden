import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { XMLParser } from "npm:fast-xml-parser";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";
import { safeFetch } from "../_shared/safe-fetch.ts";

const FEED = "https://www.microsoft.com/en-us/dynamics-365/blog/feed/";
const strip = (v: unknown) => String(v ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const denied = authenticateCronRequest(req);
  if (denied) return new Response(denied.body, { status: denied.status, headers: corsHeaders });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const url = Deno.env.get("SUPABASE_URL"); const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "Konfiguration saknas" }, 500);
  const db = createClient(url, key); const owner = crypto.randomUUID();
  await db.from("editor_news_import_state").upsert({ id: "microsoft" }, { onConflict: "id", ignoreDuplicates: true });
  const { data: lock, error: lockError } = await db.from("editor_news_import_state").update({ lease_owner: owner, lease_until: new Date(Date.now() + 600000).toISOString() }).eq("id", "microsoft").or(`lease_until.is.null,lease_until.lt.${new Date().toISOString()}`).select("id");
  if (lockError) return json({ error: lockError.message }, 500);
  if (!lock?.length) return json({ skipped: "already_running" });
  let imported = 0;
  try {
    const response = await safeFetch(FEED);
    if (!response.ok) throw new Error(`Microsoft-flödet svarade ${response.status}`);
    const reader = response.body?.getReader(); if (!reader) throw new Error("Tomt flöde");
    let xml = ""; let size = 0; const decoder = new TextDecoder();
    while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 3000000) { await reader.cancel(); throw new Error("Flödet är för stort"); } xml += decoder.decode(chunk.value, { stream: true }); }
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const items = parsed.rss?.channel?.item; const list = Array.isArray(items) ? items : items ? [items] : [];
    for (const item of list.slice(0, 10)) {
      const source = String(item.link ?? ""); let sourceUrl: URL;
      try { sourceUrl = new URL(source); } catch { continue; }
      if (sourceUrl.protocol !== "https:" || !["www.microsoft.com", "microsoft.com"].includes(sourceUrl.hostname)) continue;
      const title = strip(item.title).slice(0, 200); const lead = strip(item.description).slice(0, 600); if (!title) continue;
      const { data: duplicate, error: dupError } = await db.from("knowledge_articles").select("id").eq("content_type", "aktuellt").eq("source_url", source).limit(1);
      if (dupError) throw dupError; if (duplicate?.length) continue;
      const date = new Date(item.pubDate); const published = Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
      const slug = "microsoft-" + Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source)))).map(x => x.toString(16).padStart(2, "0")).join("").slice(0, 16);
      const { error } = await db.from("knowledge_articles").insert({ title, description: lead || null, slug, content_type: "aktuellt", category: "aktuellt", format: "artikel", editorial_status: "draft", is_published: false, source_url: source, source_name: "Microsoft Dynamics\u00a0365 Blog", source_published_at: published, needs_verification: true, analysis: { what_happened: lead }, product_keys: [] });
      if (error) throw error; imported++;
    }
    await db.from("editor_news_import_state").update({ last_completed_at: new Date().toISOString(), imported, last_error: null }).eq("id", "microsoft").eq("lease_owner", owner);
    return json({ imported });
  } catch (e) {
    const message = (e as Error).message;
    await db.from("editor_news_import_state").update({ last_error: message, imported }).eq("id", "microsoft").eq("lease_owner", owner);
    return json({ error: message }, 500);
  } finally {
    await db.from("editor_news_import_state").update({ lease_until: null, lease_owner: null }).eq("id", "microsoft").eq("lease_owner", owner);
  }
});