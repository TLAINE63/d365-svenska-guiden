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
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

function base64UrlToBase64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(s: string): Uint8Array {
  const bin = atob(base64UrlToBase64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC", key, base64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`)
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch { return false; }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/å|ä/g, "a").replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyJWT(token, secret))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    if (action === "list" && req.method === "GET") {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ articles: data || [] }, 200, corsHeaders);
    }

    if (action === "save" && req.method === "POST") {
      const body = await req.json();
      const { id, ...fields } = body;

      const title = (fields.title || "").trim();
      const articleUrl = (fields.url || "").trim();
      const isPublished = !!fields.is_published;

      if (!title) return json({ error: "Titel krävs" }, 400, corsHeaders);
      if (isPublished && !articleUrl) {
        return json({ error: "En publicerad artikel måste ha en url" }, 400, corsHeaders);
      }

      const slug = (fields.slug || "").trim() || slugify(title);

      const payload: Record<string, unknown> = {
        title,
        url: articleUrl || null,
        slug,
        description: fields.description?.trim() || null,
        category: fields.category || "artikel",
        content_type: fields.content_type || "artikel",
        format: fields.format || "artikel",
        target_roles: Array.isArray(fields.target_roles) ? fields.target_roles : [],
        image_url: fields.image_url?.trim() || null,
        is_published: isPublished,
        published_at: isPublished
          ? (fields.published_at || new Date().toISOString())
          : null,
      };

      let result;
      if (id) {
        const { data, error } = await supabase
          .from("knowledge_articles").update(payload).eq("id", id).select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      } else {
        const { data, error } = await supabase
          .from("knowledge_articles").insert(payload).select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      }
      return json({ article: result }, 200, corsHeaders);
    }

    if (action === "toggle-publish" && req.method === "POST") {
      const { id, is_published } = await req.json();
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      if (is_published) {
        const { data: existing, error: fetchErr } = await supabase
          .from("knowledge_articles").select("url").eq("id", id).single();
        if (fetchErr) return json({ error: fetchErr.message }, 400, corsHeaders);
        if (!existing?.url || !existing.url.trim()) {
          return json({ error: "Artikeln saknar url – öppna artikeln och lägg till en url innan du publicerar." }, 400, corsHeaders);
        }
      }
      const patch: Record<string, unknown> = { is_published: !!is_published };
      if (is_published) patch.published_at = new Date().toISOString();
      const { data, error } = await supabase
        .from("knowledge_articles").update(patch).eq("id", id).select().single();
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ article: data }, 200, corsHeaders);
    }

    if (action === "delete" && req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("knowledge_articles").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e: any) {
    console.error("manage-knowledge-articles error", e);
    return json({ error: e?.message || "Internal error" }, 500, corsHeaders);
  }
});

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" }
  });
}
