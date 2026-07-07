import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = "https://vnvphfrrmoaskiwlspeo.supabase.co/storage/v1/object/public/partner-documents/_internal/source_docs.json";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const docs = await res.json() as Record<string, string>;

    const results: Record<string, string> = {};
    for (const [slug, text] of Object.entries(docs)) {
      const { error, count } = await supabase
        .from("partners")
        .update({
          source_document_text: text,
          extended_content_updated_at: new Date().toISOString(),
        }, { count: "exact" })
        .eq("slug", slug);
      results[slug] = error ? `error: ${error.message}` : `ok (${count})`;
    }

    return new Response(JSON.stringify({ ok: true, results }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
