import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * One-off maintenance: remove internal source documents that were stored in the
 * PUBLIC 'partner-documents' bucket. Requires the service role key as bearer token.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!token || token !== serviceKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

  const { data: list } = await supabase.storage
    .from("partner-documents")
    .list("_internal", { limit: 100 });

  const paths = (list ?? []).map((f) => `_internal/${f.name}`);
  if (paths.length === 0) {
    return new Response(JSON.stringify({ ok: true, removed: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error } = await supabase.storage.from("partner-documents").remove(paths);
  if (error) {
    console.error("cleanup failed", error);
    return new Response(JSON.stringify({ ok: false, error: "Kunde inte radera" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, removed: paths }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
