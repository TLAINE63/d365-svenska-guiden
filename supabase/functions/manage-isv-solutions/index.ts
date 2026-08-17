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
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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

const clean = (v: unknown, max = 4000): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
};
const cleanList = (v: unknown, max = 20): string[] | null => {
  if (!Array.isArray(v)) return null;
  const list = v
    .map((x) => (typeof x === "string" ? x.trim().slice(0, 500) : ""))
    .filter(Boolean)
    .slice(0, max);
  return list.length ? list : null;
};

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    if (action === "list" && req.method === "GET") {
      const { data, error } = await supabase
        .from("isv_solution_overrides")
        .select("*");
      if (error) throw error;
      return json({ overrides: data || [] }, 200, corsHeaders);
    }

    if (action === "save" && req.method === "POST") {
      const body = await req.json();
      const solution_id = clean(body?.solution_id, 100);
      if (!solution_id) return json({ error: "solution_id krävs" }, 400, corsHeaders);

      const payload = {
        solution_id,
        short_description: clean(body?.short_description, 400),
        what: clean(body?.what),
        when_fits: clean(body?.when_fits),
        use_cases: cleanList(body?.use_cases),
        combos: cleanList(body?.combos),
        products: cleanList(body?.products, 12) || [],
        industries: cleanList(body?.industries, 25) || [],
        vendor_name: clean(body?.vendor_name, 200),
        vendor_website: clean(body?.vendor_website, 300),
        admin_contact_name: clean(body?.admin_contact_name, 200),
        admin_contact_email: clean(body?.admin_contact_email, 200),
        admin_contact_phone: clean(body?.admin_contact_phone, 60),
        sales_contact_name: clean(body?.sales_contact_name, 200),
        sales_contact_email: clean(body?.sales_contact_email, 200),
        sales_contact_phone: clean(body?.sales_contact_phone, 60),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("isv_solution_overrides")
        .upsert(payload, { onConflict: "solution_id" })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ override: data }, 200, corsHeaders);
    }

    if (action === "reset" && req.method === "DELETE") {
      const id = url.searchParams.get("solution_id");
      if (!id) return json({ error: "solution_id krävs" }, 400, corsHeaders);
      const { error } = await supabase
        .from("isv_solution_overrides")
        .delete()
        .eq("solution_id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e) {
    console.error("manage-isv-solutions error", e);
    return json({ error: "Internal error" }, 500, corsHeaders);
  }
});

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" }
  });
}
