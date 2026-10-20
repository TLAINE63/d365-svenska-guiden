// Anonymt köparunderlag: sparar sektioner per buyer_id. Ingen klient läser/skriver tabellen direkt.
// Varje profil ägs av en hemlig ägarnyckel (owner_token) som bara finns i besökarens webbläsare;
// servern lagrar endast dess SHA-256-hash. Utan rätt nyckel kan profilen inte ändras eller raderas.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "../_shared/cors.ts";

const SECTIONS = ["company", "current_erp", "scope", "fscm", "crm", "contact_center", "integrations", "project", "assessment"] as const;

// Värden: korta strängar, tal, booleans eller listor av korta strängar. Inga fria texter.
const Primitive = z.union([z.string().max(80), z.number().finite(), z.boolean(), z.null()]);
const Value = z.union([Primitive, z.array(z.string().max(80)).max(20)]);
const Section = z.record(z.string().regex(/^[a-z0-9_]{1,40}$/), Value).refine((o) => Object.keys(o).length <= 30);

const Body = z.object({
  action: z.enum(["save", "clear"]),
  buyer_id: z.string().uuid(),
  owner_token: z.string().regex(/^[A-Za-z0-9-]{32,128}$/),
  patch: z.object(Object.fromEntries(SECTIONS.map((s) => [s, Section.optional()])) as Record<(typeof SECTIONS)[number], z.ZodOptional<typeof Section>>).optional(),
});

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Ogiltig förfrågan" }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Ogiltiga uppgifter" }, 400);
  const { action, buyer_id, owner_token, patch } = parsed.data;
  const tokenHash = await sha256Hex(owner_token);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { data: existing } = await sb.from("buyer_profiles").select("*").eq("buyer_id", buyer_id).maybeSingle();
    // Befintlig profil får bara röras med matchande ägarnyckel (äldre profiler utan nyckel är låsta).
    if (existing && existing.owner_token_hash !== tokenHash) return json({ error: "Ingen behörighet" }, 403);

    if (action === "clear") {
      if (existing) await sb.from("buyer_profiles").delete().eq("buyer_id", buyer_id).eq("owner_token_hash", tokenHash);
      return json({ ok: true });
    }

    const row: Record<string, unknown> = {};
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

    if (existing) {
      const { error } = await sb.from("buyer_profiles").update(row).eq("buyer_id", buyer_id).eq("owner_token_hash", tokenHash);
      if (error) throw error;
    } else {
      const { error } = await sb.from("buyer_profiles").insert({ ...row, buyer_id, owner_token_hash: tokenHash });
      if (error) {
        if ((error as { code?: string }).code === "23505") return json({ error: "Ingen behörighet" }, 403);
        throw error;
      }
    }
    return json({ ok: true });
  } catch (e) {
    console.error("buyer-profile error", e);
    return json({ error: "Kunde inte spara" }, 500);
  }
});
