// Anonymt köparunderlag: sparar sektioner per buyer_id. Ingen klient läser/skriver tabellen direkt.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "../_shared/cors.ts";

const SECTIONS = ["company", "current_erp", "scope", "fscm", "crm", "contact_center", "integrations", "project", "assessment"] as const;

// Värden: korta strängar, tal, booleans eller listor av korta strängar. Inga fria texter.
const Primitive = z.union([z.string().max(80), z.number().finite(), z.boolean(), z.null()]);
const Value = z.union([Primitive, z.array(z.string().max(80)).max(20)]);
const Section = z.record(z.string().regex(/^[a-z0-9_]{1,40}$/), Value).refine((o) => Object.keys(o).length <= 30);

const Body = z.object({
  action: z.enum(["save", "get", "clear"]),
  buyer_id: z.string().uuid(),
  patch: z.object(Object.fromEntries(SECTIONS.map((s) => [s, Section.optional()])) as Record<(typeof SECTIONS)[number], z.ZodOptional<typeof Section>>).optional(),
});

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Ogiltig förfrågan" }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Ogiltiga uppgifter" }, 400);
  const { action, buyer_id, patch } = parsed.data;

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    if (action === "clear") {
      await sb.from("buyer_profiles").delete().eq("buyer_id", buyer_id);
      return json({ ok: true });
    }
    const { data: existing } = await sb.from("buyer_profiles").select("*").eq("buyer_id", buyer_id).maybeSingle();
    if (action === "get") return json({ profile: existing ?? null });

    const row: Record<string, unknown> = { buyer_id };
    for (const s of SECTIONS) {
      const p = patch?.[s];
      const base = (existing?.[s] as Record<string, unknown>) ?? {};
      if (p) {
        const merged: Record<string, unknown> = { ...base };
        for (const [k, v] of Object.entries(p)) {
          if (v === null) delete merged[k]; else merged[k] = v;
        }
        row[s] = merged;
      } else if (!existing) row[s] = {};
    }
    const { data, error } = await sb.from("buyer_profiles").upsert(row, { onConflict: "buyer_id" }).select("*").single();
    if (error) throw error;
    return json({ profile: data });
  } catch (e) {
    console.error("buyer-profile error", e);
    return json({ error: "Kunde inte spara" }, 500);
  }
});
