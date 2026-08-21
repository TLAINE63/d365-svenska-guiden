import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PRODUCT_GROUPS, QUESTION_TYPES } from "../_shared/d365-video-taxonomy.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_VIDEOS_PER_RUN = 25;
const LEASE_MINUTES = 10;

type SourceRow = {
  id: string;
  channel_id: string;
  channel_name: string;
  is_active: boolean;
  items_imported: number;
};

type FeedVideo = {
  youtube_id: string;
  title: string;
  description: string;
  published_at: string | null;
  thumbnail_url: string | null;
  channel_name: string | null;
};

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

function parseYouTubeFeed(xml: string): FeedVideo[] {
  const out: FeedVideo[] = [];
  const channelName = decodeEntities(tag(xml.split("<entry")[0] ?? "", "title") ?? "").trim() || null;
  const entries = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  for (const e of entries) {
    const youtube_id = decodeEntities(tag(e, "yt:videoId") ?? "").trim();
    if (!/^[a-zA-Z0-9_-]{11}$/.test(youtube_id)) continue;
    const title = decodeEntities(tag(e, "title") ?? "").trim();
    const description = decodeEntities(tag(e, "media:description") ?? "").trim();
    const published = decodeEntities(tag(e, "published") ?? "").trim();
    const thumb = attr(e, "media:thumbnail", "url");
    out.push({
      youtube_id,
      title: title.slice(0, 300),
      description: description.slice(0, 3000),
      published_at: published ? new Date(published).toISOString() : null,
      thumbnail_url: thumb || `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`,
      channel_name: channelName,
    });
  }
  return out;
}

type Classification = {
  product_groups: string[];
  question_types: string[];
  summary_sv: string;
  relevance_score: number;
};

async function classify(video: FeedVideo): Promise<{ result?: Classification; status?: number }> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return { status: 401 };

  const prompt = `Du klassificerar en YouTube-video om Microsoft Dynamics 365 för en svensk kunskapsbank.

Titel: ${video.title}
Beskrivning: ${(video.description || "").slice(0, 1200)}

Svara med JSON:
{
  "product_groups": [],   // 0-3 värden ur: ${PRODUCT_GROUPS.join(", ")}
  "question_types": [],   // 0-2 värden ur: ${QUESTION_TYPES.join(", ")}
  "summary_sv": "",        // Neutral svensk sammanfattning, max 250 tecken, ingen säljande ton
  "relevance_score": 0     // 0-100: hur relevant videon är för svenska beslutsfattare som utvärderar Dynamics 365. Sätt lågt (<40) för allmänt Microsoft-innehåll utan koppling till Dynamics 365.
}
Svara enbart med JSON.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return { status: res.status };

  const data = await res.json().catch(() => null);
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = JSON.parse(text.replace(/^```json\s*|```$/g, "").trim());
    const groups = Array.isArray(parsed.product_groups)
      ? parsed.product_groups.filter((g: string) => (PRODUCT_GROUPS as readonly string[]).includes(g)).slice(0, 3)
      : [];
    const questions = Array.isArray(parsed.question_types)
      ? parsed.question_types.filter((q: string) => (QUESTION_TYPES as readonly string[]).includes(q)).slice(0, 2)
      : [];
    const score = Number.isFinite(Number(parsed.relevance_score))
      ? Math.max(0, Math.min(100, Math.round(Number(parsed.relevance_score))))
      : 0;
    return {
      result: {
        product_groups: groups.length ? groups : ["ovrigt"],
        question_types: questions,
        summary_sv: String(parsed.summary_sv ?? "").slice(0, 400),
        relevance_score: score,
      },
    };
  } catch {
    return {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const auth = req.headers.get("Authorization") ?? "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  let authorized = Boolean(serviceRole) && bearer === serviceRole;
  if (!authorized && bearer) {
    // Accept any key with service-role privileges (cron uses a stored key that may differ
    // from the env value): verify by reading a table that RLS blocks for anon/authenticated.
    try {
      const probe = createClient(supabaseUrl, bearer);
      const { data, error } = await probe.from("d365_video_ingest_state").select("id").eq("id", 1).maybeSingle();
      authorized = !error && !!data;
    } catch { authorized = false; }
  }
  if (!authorized) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRole);

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  let body: { source_id?: string; force?: boolean; resume?: boolean } = {};
  try { body = await req.json(); } catch { /* cron sends empty body */ }

  const { data: state } = await supabase.from("d365_video_ingest_state").select("*").eq("id", 1).maybeSingle();

  if (body.resume) {
    await supabase.from("d365_video_ingest_state")
      .update({ paused_reason: null, paused_at: null, is_running: false, lease_until: null })
      .eq("id", 1);
    return json({ success: true, resumed: true });
  }

  // Paused-state guard (credit / policy circuit breaker)
  if (state?.paused_reason && !body.force) {
    return json({ success: false, paused: true, reason: state.paused_reason });
  }

  // Single-flight lease
  const now = new Date();
  if (state?.is_running && state.lease_until && new Date(state.lease_until) > now) {
    return json({ success: false, skipped: "already-running" });
  }
  await supabase.from("d365_video_ingest_state").update({
    is_running: true,
    lease_until: new Date(now.getTime() + LEASE_MINUTES * 60_000).toISOString(),
    last_run_at: now.toISOString(),
  }).eq("id", 1);

  let imported = 0;
  let skipped = 0;
  let classified = 0;
  let pausedReason: string | null = null;
  const errors: string[] = [];

  try {
    let q = supabase.from("d365_video_sources").select("*").eq("is_active", true);
    if (body.source_id) q = supabase.from("d365_video_sources").select("*").eq("id", body.source_id);
    const { data: sources, error: srcErr } = await q;
    if (srcErr) throw srcErr;

    for (const source of (sources ?? []) as SourceRow[]) {
      if (imported >= MAX_VIDEOS_PER_RUN || pausedReason) break;
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(source.channel_id)}`;
        const res = await fetch(feedUrl, {
          headers: { "User-Agent": "d365.se-video-ingest/1.0" },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const videos = parseYouTubeFeed(await res.text());

        let importedForSource = 0;
        for (const v of videos) {
          if (imported >= MAX_VIDEOS_PER_RUN || pausedReason) break;

          const { data: existing } = await supabase
            .from("d365_videos").select("id").eq("youtube_id", v.youtube_id).maybeSingle();
          if (existing) { skipped++; continue; }

          const insertPayload: Record<string, unknown> = {
            youtube_id: v.youtube_id,
            title: v.title,
            description: v.description,
            channel_id: source.channel_id,
            channel_name: v.channel_name || source.channel_name,
            published_at: v.published_at,
            thumbnail_url: v.thumbnail_url,
            source_id: source.id,
            status: "new",
          };

          // Insert first (idempotent progress marking), then classify
          const { data: inserted, error: insErr } = await supabase
            .from("d365_videos").insert(insertPayload).select("id").maybeSingle();
          if (insErr) {
            if (insErr.code === "23505") { skipped++; continue; }
            throw insErr;
          }
          imported++;
          importedForSource++;

          const c = await classify(v);
          if (c.status === 402 || c.status === 403) {
            pausedReason = c.status === 402 ? "AI-krediter slut (402)" : "AI blockerad av policy (403)";
            break;
          }
          if (c.status === 429) {
            errors.push("AI rate limit (429) – återupptas vid nästa körning");
            break;
          }
          if (c.result) {
            classified++;
            await supabase.from("d365_videos").update({
              product_groups: c.result.product_groups,
              question_types: c.result.question_types,
              summary_sv: c.result.summary_sv,
              relevance_score: c.result.relevance_score,
              ai_classified_at: new Date().toISOString(),
              status: c.result.relevance_score >= 40 ? "published" : "hidden",
            }).eq("id", inserted!.id);
          }
        }

        await supabase.from("d365_video_sources").update({
          last_fetched_at: new Date().toISOString(),
          last_success_at: new Date().toISOString(),
          last_error: null,
          items_imported: (source.items_imported ?? 0) + importedForSource,
        }).eq("id", source.id);
      } catch (err) {
        const msg = (err as Error).message.slice(0, 400);
        errors.push(`${source.channel_name}: ${msg}`);
        await supabase.from("d365_video_sources").update({
          last_fetched_at: new Date().toISOString(),
          last_error: msg,
        }).eq("id", source.id);
      }
    }
  } catch (err) {
    errors.push((err as Error).message.slice(0, 400));
  }

  const result = `imported=${imported} classified=${classified} skipped=${skipped}${errors.length ? ` errors=${errors.length}` : ""}`;
  await supabase.from("d365_video_ingest_state").update({
    is_running: false,
    lease_until: null,
    last_result: result,
    paused_reason: pausedReason ?? null,
    paused_at: pausedReason ? new Date().toISOString() : null,
  }).eq("id", 1);

  return json({ success: true, imported, classified, skipped, paused: pausedReason, errors });
});
