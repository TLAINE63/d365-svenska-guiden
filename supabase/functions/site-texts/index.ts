import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { verifyAdminJWT } from "../_shared/isvAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SaveSchema = z.object({
  key: z.string().regex(/^[a-z0-9._-]{2,80}$/),
  value: z.string().max(5000),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body: any = await req.json().catch(() => ({}));
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!(await verifyAdminJWT(String(body.token || ""), serviceKey, ["admin", "editor"]))) return json({ error: "unauthorized" }, 401);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

    if (body.action === "list") {
      const { data, error } = await sb.from("site_texts").select("key,value,updated_at");
      if (error) throw error;
      return json({ texts: data ?? [] });
    }
    if (body.action === "save") {
      const p = SaveSchema.safeParse(body);
      if (!p.success) return json({ error: "Ogiltig text" }, 400);
      if (!p.data.value.trim()) {
        await sb.from("site_texts").delete().eq("key", p.data.key);
        return json({ ok: true, reset: true });
      }
      const { error } = await sb.from("site_texts").upsert({ key: p.data.key, value: p.data.value, updated_at: new Date().toISOString() });
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: "unknown action" }, 400);
  } catch (e) {
    console.error("site-texts", e);
    return json({ error: "Något gick fel" }, 500);
  }
});
