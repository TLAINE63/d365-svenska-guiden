// Anonymous logger for blocked contact attempts against Basic partners.
// STRICT: does NOT accept, log, or persist buyer identity (no email, IP, session, message text).
// Only partner_id + source_context reach the DB.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const ALLOWED_CONTEXTS = new Set(["basic_card", "compare_mix", "list_card", "matching"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const partnerId = typeof body?.partner_id === "string" ? body.partner_id.trim() : "";
  const rawCtx = typeof body?.source_context === "string" ? body.source_context.trim() : "basic_card";
  const sourceContext = ALLOWED_CONTEXTS.has(rawCtx) ? rawCtx : "basic_card";

  if (!UUID_RE.test(partnerId)) {
    return new Response(JSON.stringify({ error: "invalid_partner_id" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    // Fail silently – privacy is more important than accurate stats.
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey);

  // Defensive: only log if partner is actually 'basic'. Never log for profilerad partners.
  const { data: partner } = await supabase
    .from("partners")
    .select("id, profile_level")
    .eq("id", partnerId)
    .maybeSingle();

  if (!partner || (partner as any).profile_level !== "basic") {
    return new Response(JSON.stringify({ ok: true, ignored: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Insert ONLY partner_id + source_context. No IP, no UA, no session, no text.
  await supabase
    .from("contact_attempt_blocked")
    .insert({ partner_id: partnerId, source_context: sourceContext });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
