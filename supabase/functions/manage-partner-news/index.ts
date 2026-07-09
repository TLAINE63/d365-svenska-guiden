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

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, base64UrlDecode(s) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true };
  } catch (e) {
    console.error("JWT verify failed", e);
    return { valid: false, error: "Token verification failed" };
  }
}

const PRODUCT_AREA_ENUM = z.enum(["business-central", "finance-scm", "crm-sales", "crm-service", "crm", "power-platform", "microsoft-ai", "ovrigt"]);

const NewsSchema = z.object({
  id: z.string().uuid().optional(),
  partner_id: z.string().uuid(),
  editorial_title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(10).max(600),
  source_url: z.string().trim().url().max(1000),
  source_type: z.enum(["linkedin", "partner_web", "blog", "press", "webinar", "event", "other"]),
  product_area: PRODUCT_AREA_ENUM.optional(),
  product_areas: z.array(PRODUCT_AREA_ENUM).min(1).max(8).optional(),
  news_type: z.enum(["kundcase", "event", "webinar", "erbjudande", "artikel", "rapport", "branschlosning", "produktnyhet", "partnernyhet", "analys"]),
  industry: z.string().trim().max(120).optional().nullable(),
  image_url: z.string().trim().url().max(1000).optional().nullable().or(z.literal("")),
  news_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  is_featured: z.boolean().default(false),
  show_on_home: z.boolean().default(false),
  show_on_partner_profile: z.boolean().default(true),
  show_on_product_page: z.boolean().default(false),
  status: z.enum(["draft", "review", "approved", "published", "unpublished", "archived"]).default("draft"),
}).refine((v) => (v.product_areas && v.product_areas.length > 0) || !!v.product_area, {
  message: "Minst ett produktområde krävs",
  path: ["product_areas"],
});

function normalizeAreas<T extends { product_area?: string; product_areas?: string[] }>(data: T): T & { product_area: string; product_areas: string[] } {
  const areas = (data.product_areas && data.product_areas.length > 0)
    ? Array.from(new Set(data.product_areas))
    : (data.product_area ? [data.product_area] : []);
  return { ...data, product_areas: areas, product_area: areas[0] } as T & { product_area: string; product_areas: string[] };
}

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json();
    const { action, token } = body ?? {};

    const jwtSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!jwtSecret) {
      return new Response(JSON.stringify({ error: "Serverfel: autentisering ej konfigurerad" }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
    }
    const v = await verifyJWT(token || "", jwtSecret);
    if (!v.valid) {
      return new Response(JSON.stringify({ error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }), { status: 401, headers: { "Content-Type": "application/json", ...cors } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    switch (action) {
      case "list": {
        const { data, error } = await supabase
          .from("partner_news")
          .select("*, partners(id, name, slug, logo_url)")
          .order("news_date", { ascending: false })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, items: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "create": {
        const parsed = NewsSchema.safeParse(body.news);
        if (!parsed.success) return new Response(JSON.stringify({ error: "Valideringsfel", details: parsed.error.flatten().fieldErrors }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
        const item = { ...parsed.data, image_url: parsed.data.image_url || null, industry: parsed.data.industry || null };
        if (item.status === "published" && !("published_at" in item)) {
          (item as Record<string, unknown>).published_at = new Date().toISOString();
        }
        const { data, error } = await supabase.from("partner_news").insert(item).select("*").maybeSingle();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, item: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "update": {
        const parsed = NewsSchema.safeParse(body.news);
        if (!parsed.success || !parsed.data.id) return new Response(JSON.stringify({ error: "Valideringsfel", details: parsed.error?.flatten().fieldErrors }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
        const { id, ...rest } = parsed.data;
        const patch: Record<string, unknown> = { ...rest, image_url: rest.image_url || null, industry: rest.industry || null };
        if (rest.status === "published") {
          const { data: existing } = await supabase.from("partner_news").select("published_at").eq("id", id).maybeSingle();
          if (!existing?.published_at) patch.published_at = new Date().toISOString();
        }
        const { data, error } = await supabase.from("partner_news").update(patch).eq("id", id).select("*").maybeSingle();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, item: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "set-status": {
        const id = z.string().uuid().parse(body.id);
        const status = z.enum(["draft","review","approved","published","unpublished","archived"]).parse(body.status);
        const patch: Record<string, unknown> = { status };
        if (status === "published") {
          const { data: existing } = await supabase.from("partner_news").select("published_at").eq("id", id).maybeSingle();
          if (!existing?.published_at) patch.published_at = new Date().toISOString();
        }
        const { data, error } = await supabase.from("partner_news").update(patch).eq("id", id).select("*").maybeSingle();
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, item: data }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      case "delete": {
        const id = z.string().uuid().parse(body.id);
        const { error } = await supabase.from("partner_news").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
      }
      default:
        return new Response(JSON.stringify({ error: "Okänd åtgärd" }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
    }
  } catch (err) {
    console.error("manage-partner-news error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Serverfel" }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
  }
});
