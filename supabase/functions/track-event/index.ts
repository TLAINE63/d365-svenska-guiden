import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { inquiryCors, isInquiryOrigin, siteFromOrigin } from "../_shared/inquiry-cors.ts";

const EVENTS = ["partner_profile_view", "partner_outbound_click", "partner_contact_click", "shortlist_add", "shortlist_remove", "compare_view", "tool_start", "tool_complete", "inquiry_start", "inquiry_submit"] as const;
const s = (n: number) => z.string().trim().max(n).optional().nullable();
const Body = z.object({
  event_name: z.enum(EVENTS),
  partner_slug: s(120), page_path: s(500), session_id: s(100), product_area: s(100),
  utm_source: s(100), utm_medium: s(100), utm_campaign: s(100),
  metadata: z.record(z.unknown()).optional().nullable(),
});

Deno.serve(async (req) => {
  const cors = inquiryCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const origin = req.headers.get("origin") || "";
  if (!isInquiryOrigin(origin)) return new Response(JSON.stringify({ error: "origin" }), { status: 403, headers: cors });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return new Response(JSON.stringify({ error: "invalid" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    const d = parsed.data;
    const meta = d.metadata && JSON.stringify(d.metadata).length <= 2000 ? d.metadata : null;
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error } = await sb.from("partner_tracking_events").insert({ ...d, metadata: meta, source_site: siteFromOrigin(origin) });
    if (error) console.error(error);
    return new Response(JSON.stringify({ ok: !error }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "server" }), { status: 500, headers: cors });
  }
});
