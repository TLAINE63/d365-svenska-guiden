import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64UrlToBase64(str: string): string {
  return str.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(str.length / 4) * 4, "=");
}
function b64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!(await verifyAdminJWT(token, JWT_SECRET))) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("partner-documents-internal")
      .download("_internal/source_docs.json");
    if (downloadError || !fileData) {
      throw new Error(`download failed: ${downloadError?.message ?? "no data"}`);
    }
    const docs = JSON.parse(await fileData.text()) as Record<string, string>;

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
    console.error("apply-source-docs error:", e);
    return new Response(JSON.stringify({ ok: false, error: "Internt fel" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
