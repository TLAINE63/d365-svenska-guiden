import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedRow {
  id: string;
  partner_id: string;
  feed_url: string;
  source_type: string;
  default_news_type: string;
  default_product_areas: string[];
  is_active: boolean;
}

interface ParsedItem {
  guid: string;
  title: string;
  link: string;
  summary: string;
  image?: string;
  date?: string;
}

// --- Minimal RSS/Atom parser (regex based; safe for well-formed feeds) ---
function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function tag(block: string, name: string): string | null {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i");
  const m = block.match(re);
  return m ? m[1].trim() : null;
}
function attr(block: string, name: string, attrName: string): string | null {
  const re = new RegExp(`<${name}\\b[^>]*\\b${attrName}=["']([^"']+)["'][^>]*>`, "i");
  const m = block.match(re);
  return m ? m[1] : null;
}

function parseFeed(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  // RSS 2.0 <item>
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  for (const b of itemBlocks) {
    const title = stripHtml(tag(b, "title") ?? "");
    const link = decodeEntities(tag(b, "link") ?? "").trim();
    const guid = decodeEntities(tag(b, "guid") ?? "").trim() || link || title;
    const desc = tag(b, "description") ?? tag(b, "content:encoded") ?? "";
    const date = tag(b, "pubDate") ?? tag(b, "dc:date") ?? undefined;
    const image =
      attr(b, "media:thumbnail", "url") ||
      attr(b, "media:content", "url") ||
      attr(b, "enclosure", "url") ||
      (desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? undefined);
    if (title) items.push({ guid, title, link, summary: stripHtml(desc).slice(0, 500), image: image || undefined, date });
  }
  if (items.length) return items;
  // Atom <entry>
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  for (const b of entryBlocks) {
    const title = stripHtml(tag(b, "title") ?? "");
    const link = attr(b, "link", "href") || "";
    const guid = decodeEntities(tag(b, "id") ?? "").trim() || link || title;
    const desc = tag(b, "summary") ?? tag(b, "content") ?? "";
    const date = tag(b, "published") ?? tag(b, "updated") ?? undefined;
    const image = desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    if (title) items.push({ guid, title, link, summary: stripHtml(desc).slice(0, 500), image, date });
  }
  return items;
}

function toISODate(input?: string): string {
  if (!input) return new Date().toISOString().slice(0, 10);
  const d = new Date(input);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

async function processFeed(supabase: ReturnType<typeof createClient>, feed: FeedRow): Promise<{ imported: number; skipped: number; error?: string }> {
  try {
    const res = await fetch(feed.feed_url, {
      headers: { "User-Agent": "d365.se-feed-ingest/1.0", Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseFeed(xml).slice(0, 25); // safety cap per feed
    let imported = 0;
    let skipped = 0;
    for (const it of items) {
      const guid = it.guid.slice(0, 500);
      // Skip if already ingested for this partner
      const { data: existing } = await supabase
        .from("partner_news")
        .select("id")
        .eq("partner_id", feed.partner_id)
        .eq("source_guid", guid)
        .maybeSingle();
      if (existing) { skipped++; continue; }

      const editorial_title = it.title.slice(0, 200);
      const summary = (it.summary || it.title).slice(0, 600) || "Automatiskt inhämtat inlägg – redigera sammanfattning.";
      const payload = {
        partner_id: feed.partner_id,
        editorial_title,
        summary,
        source_url: it.link || feed.feed_url,
        source_type: feed.source_type,
        news_type: feed.default_news_type,
        product_area: feed.default_product_areas[0] ?? "ovrigt",
        product_areas: feed.default_product_areas.length ? feed.default_product_areas : ["ovrigt"],
        image_url: it.image ?? null,
        news_date: toISODate(it.date),
        is_featured: false,
        show_on_home: false,
        show_on_partner_profile: true,
        show_on_product_page: false,
        status: "draft",
        source_feed_id: feed.id,
        source_guid: guid,
        ingest_method: "feed",
        verbatim: true,

      };
      const { error: insErr } = await supabase.from("partner_news").insert(payload);
      if (insErr) {
        if (insErr.code === "23505") { skipped++; continue; } // unique dedup race
        throw insErr;
      }
      imported++;
    }
    await supabase.from("partner_feeds").update({
      last_fetched_at: new Date().toISOString(),
      last_success_at: new Date().toISOString(),
      last_error: null,
      items_imported: (feed as unknown as { items_imported?: number }).items_imported
        ? undefined
        : imported,
    }).eq("id", feed.id);
    // Increment items_imported atomically via a follow-up update
    if (imported > 0) {
      await supabase.rpc("noop_ignore", {}).then(() => {}).catch(() => {});
      await supabase.from("partner_feeds")
        .update({ items_imported: imported + ((feed as unknown as { items_imported?: number }).items_imported ?? 0) })
        .eq("id", feed.id);
    }
    return { imported, skipped };
  } catch (err) {
    const msg = (err as Error).message.slice(0, 500);
    await supabase.from("partner_feeds").update({
      last_fetched_at: new Date().toISOString(),
      last_error: msg,
    }).eq("id", feed.id);
    return { imported: 0, skipped: 0, error: msg };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Auth: require service_role bearer (used by cron) OR feed_id param + service role
  const auth = req.headers.get("Authorization") ?? "";
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!auth || auth !== `Bearer ${serviceRole}`) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceRole);

  let body: { feed_id?: string; partner_id?: string } = {};
  try { body = await req.json(); } catch { /* empty body is fine (cron) */ }

  let query = supabase.from("partner_feeds").select("*").eq("is_active", true);
  if (body.feed_id) query = supabase.from("partner_feeds").select("*").eq("id", body.feed_id);
  else if (body.partner_id) query = supabase.from("partner_feeds").select("*").eq("is_active", true).eq("partner_id", body.partner_id);

  const { data: feeds, error } = await query;
  if (error) {
    console.error("ingest-partner-feeds list error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Endast partnerverifierade profiler (profileringsavtal) får automatiskt inhämtat innehåll.
  const partnerIds = Array.from(new Set(((feeds ?? []) as FeedRow[]).map((f) => f.partner_id)));
  const verifiedIds = new Set<string>();
  if (partnerIds.length > 0) {
    const { data: partnerRows } = await supabase
      .from("partners")
      .select("id, is_featured")
      .in("id", partnerIds);
    for (const p of (partnerRows ?? []) as Array<{ id: string; is_featured: boolean }>) {
      if (p.is_featured) verifiedIds.add(p.id);
    }
  }

  const results: Array<{ feed_id: string; partner_id: string; imported: number; skipped: number; error?: string }> = [];
  for (const f of (feeds ?? []) as FeedRow[]) {
    if (!verifiedIds.has(f.partner_id)) {
      results.push({ feed_id: f.id, partner_id: f.partner_id, imported: 0, skipped: 0, error: "Partnern är inte partnerverifierad – flödet hoppas över." });
      continue;
    }
    const r = await processFeed(supabase, f);
    results.push({ feed_id: f.id, partner_id: f.partner_id, ...r });
  }

  const totalImported = results.reduce((s, r) => s + r.imported, 0);
  console.log(`ingest-partner-feeds: processed ${results.length} feeds, imported ${totalImported}`);
  return new Response(JSON.stringify({ success: true, processed: results.length, imported: totalImported, results }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
