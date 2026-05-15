import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".lovableproject.com") ||
    origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

function b64UrlToB64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64ToBytes(s: string) {
  const bin = atob(b64UrlToB64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64ToBytes(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(b64UrlToB64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch {
    return false;
  }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyJWT(token, secret))) {
      return json({ error: "Unauthorized" }, 401, corsHeaders);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    if (action === "list" && req.method === "GET") {
      const { data, error } = await supabase
        .from("industry_pages")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return json({ pages: data || [] }, 200, corsHeaders);
    }

    if (action === "save" && req.method === "POST") {
      const body = await req.json();
      const { id, ...fields } = body;
      const slug = (fields.slug || "").trim();
      const name = (fields.name || "").trim();
      if (!slug || !name) return json({ error: "slug och namn krävs" }, 400, corsHeaders);

      const payload: Record<string, unknown> = {
        slug,
        name,
        meta_title: fields.meta_title?.trim() || null,
        meta_description: fields.meta_description?.trim() || null,
        hero_image_url: fields.hero_image_url?.trim() || null,
        intro: fields.intro?.trim() || null,
        processes: Array.isArray(fields.processes) ? fields.processes : [],
        challenges: Array.isArray(fields.challenges) ? fields.challenges : [],
        roles: Array.isArray(fields.roles) ? fields.roles : [],
        applications: Array.isArray(fields.applications) ? fields.applications : [],
        faq: Array.isArray(fields.faq) ? fields.faq : [],
        related_industries: Array.isArray(fields.related_industries) ? fields.related_industries : [],
        is_published: !!fields.is_published,
      };

      let result;
      if (id) {
        const { data, error } = await supabase
          .from("industry_pages")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      } else {
        const { data, error } = await supabase
          .from("industry_pages")
          .upsert(payload, { onConflict: "slug" })
          .select()
          .single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      }
      return json({ page: result }, 200, corsHeaders);
    }

    if (action === "toggle-publish" && req.method === "POST") {
      const { id, is_published } = await req.json();
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { data, error } = await supabase
        .from("industry_pages")
        .update({ is_published: !!is_published })
        .eq("id", id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ page: data }, 200, corsHeaders);
    }

    if (action === "delete" && req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("industry_pages").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e: any) {
    console.error("manage-industry-pages error", e);
    return json({ error: e?.message || "Internal error" }, 500, corsHeaders);
  }
});
