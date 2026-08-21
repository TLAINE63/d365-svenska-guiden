import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";
import { PRODUCT_GROUPS, QUESTION_TYPES } from "../_shared/d365-video-taxonomy.ts";

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
function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(s: string): string { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; }
function base64UrlDecode(s: string): Uint8Array { const bin = atob(base64UrlToBase64(s)); const b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b; }
async function verifyJWT(token: string, secret: string): Promise<boolean> {
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
  } catch { return false; }
}

/** Accepts a UC… channel id, an @handle or a channel URL and resolves it to a UC… id. */
async function resolveChannelId(input: string): Promise<string | null> {
  const value = input.trim();
  if (/^UC[a-zA-Z0-9_-]{20,}$/.test(value)) return value;

  let url = value;
  if (value.startsWith("@")) url = `https://www.youtube.com/${value}`;
  else if (!value.startsWith("http")) url = `https://www.youtube.com/@${value.replace(/^\/+/, "")}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; d365.se-video-ingest/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/"(?:channelId|externalId)"\s*:\s*"(UC[a-zA-Z0-9_-]{20,})"/) ||
      html.match(/channel_id=(UC[a-zA-Z0-9_-]{20,})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const SourceSchema = z.object({
  id: z.string().uuid().optional(),
  channel_id: z.string().trim().min(3).max(120),
  channel_name: z.string().trim().min(1).max(200),
  channel_url: z.string().trim().url().max(500).optional().nullable(),
  is_active: z.boolean().default(true),
});

const VideoUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(300).optional(),
  summary_sv: z.string().trim().max(600).optional().nullable(),
  product_groups: z.array(z.enum(PRODUCT_GROUPS)).max(4).optional(),
  question_types: z.array(z.enum(QUESTION_TYPES)).max(3).optional(),
  relevance_score: z.number().int().min(0).max(100).optional(),
  status: z.enum(["new", "published", "hidden"]).optional(),
});

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

  try {
    const body = await req.json();
    const { action, token } = body ?? {};
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!(await verifyJWT(token || "", svc))) return json({ error: "Ogiltig session" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, svc);

    switch (action) {
      case "list": {
        const status = typeof body.status === "string" && ["new", "published", "hidden"].includes(body.status) ? body.status : null;
        let q = supabase.from("d365_videos").select("*").order("published_at", { ascending: false, nullsFirst: false }).limit(500);
        if (status) q = q.eq("status", status);
        const { data: videos, error } = await q;
        if (error) throw error;
        const { data: sources } = await supabase.from("d365_video_sources").select("*").order("channel_name");
        const { data: state } = await supabase.from("d365_video_ingest_state").select("*").eq("id", 1).maybeSingle();
        return json({ success: true, videos, sources, state });
      }
      case "create-source": {
        const p = SourceSchema.safeParse(body.source);
        if (!p.success) return json({ error: "Valideringsfel", details: p.error.flatten().fieldErrors }, 400);
        const { id: _ignore, ...insert } = p.data;
        const resolved = await resolveChannelId(insert.channel_id);
        if (!resolved) return json({ error: "Kunde inte hitta kanal-ID. Ange ett ID som börjar med UC, en @handle eller en kanal-URL." }, 400);
        insert.channel_id = resolved;
        const { data, error } = await supabase.from("d365_video_sources").insert(insert).select("*").maybeSingle();
        if (error) throw error;
        return json({ success: true, item: data });
      }
      case "update-source": {
        const p = SourceSchema.safeParse(body.source);
        if (!p.success || !p.data.id) return json({ error: "Valideringsfel" }, 400);
        const { id, ...rest } = p.data;
        const { data, error } = await supabase.from("d365_video_sources").update(rest).eq("id", id).select("*").maybeSingle();
        if (error) throw error;
        return json({ success: true, item: data });
      }
      case "delete-source": {
        const id = z.string().uuid().parse(body.id);
        const { error } = await supabase.from("d365_video_sources").delete().eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
      case "update-video": {
        const p = VideoUpdateSchema.safeParse(body.video);
        if (!p.success) return json({ error: "Valideringsfel", details: p.error.flatten().fieldErrors }, 400);
        const { id, ...rest } = p.data;
        const { data, error } = await supabase.from("d365_videos").update(rest).eq("id", id).select("*").maybeSingle();
        if (error) throw error;
        return json({ success: true, item: data });
      }
      case "delete-video": {
        const id = z.string().uuid().parse(body.id);
        const { error } = await supabase.from("d365_videos").delete().eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }
      case "resume":
      case "run-now": {
        const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/ingest-d365-videos`;
        const payload: Record<string, unknown> = action === "resume" ? { resume: true } : {};
        if (action === "run-now" && body.source_id) payload.source_id = z.string().uuid().parse(body.source_id);
        if (action === "run-now" && body.force) payload.force = true;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${svc}` },
          body: JSON.stringify(payload),
        });
        const out = await res.json().catch(() => ({}));
        return json({ success: res.ok, result: out }, res.ok ? 200 : 500);
      }
      default:
        return json({ error: "Okänd åtgärd" }, 400);
    }
  } catch (err) {
    console.error("manage-d365-videos error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Serverfel" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
