import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

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

const PRODUCT_AREA = z.enum(["business-central","finance-scm","crm-sales","crm-service","crm","power-platform","microsoft-ai","ovrigt"]);
const FeedSchema = z.object({
  id: z.string().uuid().optional(),
  partner_id: z.string().uuid(),
  feed_url: z.string().trim().url().max(1000),
  feed_type: z.enum(["rss","atom"]).default("rss"),
  source_type: z.enum(["linkedin","webinar","blog","press","partner_web","event","other"]).default("linkedin"),
  default_news_type: z.enum(["kundcase","event","webinar","erbjudande","artikel","rapport","branschlosning","produktnyhet","partnernyhet","analys"]).default("partnernyhet"),
  default_product_areas: z.array(PRODUCT_AREA).min(1).max(8).default(["ovrigt"]),
  is_active: z.boolean().default(true),
});

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const body = await req.json();
    const { action, token } = body ?? {};
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!await verifyJWT(token || "", svc)) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), { status: 401, headers: { "Content-Type": "application/json", ...cors } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, svc);

    switch (action) {
      case "list": {
        const { data, error } = await supabase.from("partner_feeds").select("*, partners(id, name, slug)").order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, items: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "create": {
        const p = FeedSchema.safeParse(body.feed);
        if (!p.success) return new Response(JSON.stringify({ error: "Valideringsfel", details: p.error.flatten().fieldErrors }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
        const { id: _ignore, ...insert } = p.data;
        const { data, error } = await supabase.from("partner_feeds").insert(insert).select("*").maybeSingle();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, item: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "update": {
        const p = FeedSchema.safeParse(body.feed);
        if (!p.success || !p.data.id) return new Response(JSON.stringify({ error: "Valideringsfel" }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
        const { id, ...rest } = p.data;
        const { data, error } = await supabase.from("partner_feeds").update(rest).eq("id", id).select("*").maybeSingle();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, item: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "delete": {
        const id = z.string().uuid().parse(body.id);
        const { error } = await supabase.from("partner_feeds").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "run-now": {
        const id = body.id ? z.string().uuid().parse(body.id) : undefined;
        const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/ingest-partner-feeds`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${svc}` },
          body: JSON.stringify(id ? { feed_id: id } : {}),
        });
        const out = await res.json().catch(() => ({}));
        return new Response(JSON.stringify({ success: res.ok, result: out }), { status: res.ok ? 200 : 500, headers: { "Content-Type": "application/json", ...cors } });
      }
      default:
        return new Response(JSON.stringify({ error: "Okänd åtgärd" }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
    }
  } catch (err) {
    console.error("manage-partner-feeds error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Serverfel" }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
  }
});
