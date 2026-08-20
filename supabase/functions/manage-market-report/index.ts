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

const GROUPS = ["overblick", "produkt", "bransch", "storlek"];

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
        .from("market_report_stats")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return json({ stats: data || [] }, 200, corsHeaders);
    }

    if (action === "save" && req.method === "POST") {
      const body = await req.json();
      const { id, ...fields } = body;

      const label = String(fields.label || "").trim();
      if (!label || label.length > 120) {
        return json({ error: "Etikett krävs (max 120 tecken)" }, 400, corsHeaders);
      }

      const value = Number(
        typeof fields.value === "string"
          ? fields.value.replace(/\s/g, "").replace(",", ".")
          : fields.value
      );
      if (!Number.isFinite(value) || value < 0 || value > 1_000_000) {
        return json({ error: "Värdet måste vara ett positivt tal" }, 400, corsHeaders);
      }

      const group_key = String(fields.group_key || "overblick").trim();
      if (!GROUPS.includes(group_key)) {
        return json({ error: "Ogiltig kategori" }, 400, corsHeaders);
      }

      const note = String(fields.note ?? "").trim().slice(0, 600);
      const suffix = fields.suffix ? String(fields.suffix).trim().slice(0, 20) : null;

      const payload = {
        label,
        value,
        suffix,
        note,
        group_key,
        sort_order: Number.isFinite(Number(fields.sort_order)) ? Number(fields.sort_order) : 0,
        is_active: fields.is_active !== false,
      };

      let result;
      if (id) {
        const { data, error } = await supabase
          .from("market_report_stats").update(payload).eq("id", id).select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      } else {
        const { data, error } = await supabase
          .from("market_report_stats").insert(payload).select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      }
      return json({ stat: result }, 200, corsHeaders);
    }

    if (action === "delete" && req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("market_report_stats").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e: any) {
    console.error("manage-market-report error", e);
    return json({ error: e?.message || "Internal error" }, 500, corsHeaders);
  }
});

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" }
  });
}
