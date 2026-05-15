import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function anonymizeIp(ip: string | null): string | null {
  if (!ip) return null;
  if (ip.includes(".")) return ip.split(".").slice(0, 3).join(".") + ".0";
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const exposures: Array<{
      partner_slug: string;
      partner_id?: string | null;
      page_path: string;
      filter_context?: Record<string, unknown>;
      session_id?: string | null;
    }> = Array.isArray(body?.exposures) ? body.exposures : [];

    if (!exposures.length) {
      return new Response(JSON.stringify({ ok: true, inserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cap to avoid abuse
    const capped = exposures.slice(0, 200);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;
    const ipAnon = anonymizeIp(ip);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const rows = capped
      .filter((e) => e.partner_slug && e.page_path)
      .map((e) => ({
        partner_slug: String(e.partner_slug).slice(0, 200),
        partner_id: e.partner_id || null,
        page_path: String(e.page_path).slice(0, 500),
        filter_context: e.filter_context || {},
        session_id: e.session_id ? String(e.session_id).slice(0, 200) : null,
        ip_anonymized: ipAnon,
        user_agent: ua ? ua.slice(0, 500) : null,
      }));

    if (!rows.length) {
      return new Response(JSON.stringify({ ok: true, inserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("partner_filter_exposures").insert(rows);
    if (error) {
      console.error("insert error", error);
      return new Response(JSON.stringify({ error: "insert_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, inserted: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("track-filter-exposure error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
