import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  return false;
}

function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`)
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin" || payload.role === "editor";
  } catch (e) {
    console.error("JWT verify failed", e);
    return false;
  }
}

const EvidenceSchema = z.object({
  evidence_type: z.enum([
    "customer_case",
    "customer_reference",
    "microsoft_certification",
    "internal_reference",
  ]),
  title: z.string().trim().min(2).max(200),
  url: z.string().trim().url().max(1000).nullable().optional().or(z.literal("")),
  is_public: z.boolean().default(false),
});

const ProfileSchema = z.object({
  id: z.string().uuid().optional(),
  partner_id: z.string().uuid(),
  guide_slug: z.string().trim().min(2).max(120),
  heading: z.string().trim().min(3).max(160),
  experience_summary: z.string().trim().min(20).max(1200),
  typical_assignments: z.array(z.string().trim().max(200)).max(10).default([]),
  products: z.array(z.string().trim().max(80)).max(12).default([]),
  industries: z.array(z.string().trim().max(80)).max(12).default([]),
  regions: z.array(z.string().trim().max(80)).max(10).default([]),
  // Orter där konsulten kan arbeta på plats hos kunden (leveransort).
  onsite_cities: z.array(z.string().trim().max(80)).max(40).default([]),
  remote_available: z.boolean().default(false),
  delivery_modes: z.array(z.enum(["onsite", "hybrid", "remote"])).max(3).default([]),
  last_reviewed_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  internal_notes: z.string().trim().max(2000).nullable().optional(),
  evidence: z.array(EvidenceSchema).max(20).default([]),
});

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...cors },
    });

  try {
    const body = await req.json();
    const { action, token } = body ?? {};

    const svc = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ---- Partnerns egen profileringslänk (invite-token) ----
    if (typeof action === "string" && action.startsWith("invitation-")) {
      const invToken = typeof body?.inviteToken === "string" ? body.inviteToken : "";
      if (!invToken) return json({ error: "Token krävs" }, 400);

      const { data: invitation, error: invError } = await svc
        .from("partner_invitations")
        .select("partner_id, expires_at")
        .eq("token", invToken)
        .maybeSingle();

      if (invError || !invitation || !invitation.partner_id) {
        return json({ error: "Ogiltig länk eller partner ej kopplad" }, 403);
      }
      if (new Date(invitation.expires_at) < new Date()) {
        return json({ error: "Inbjudan har gått ut" }, 403);
      }
      const partnerId = invitation.partner_id as string;

      if (action === "invitation-list-profiles") {
        const { data, error } = await svc
          .from("partner_assignment_profiles")
          .select(
            "id, guide_slug, heading, experience_summary, typical_assignments, products, industries, regions, onsite_cities, remote_available, delivery_modes, status, updated_at"
          )
          .eq("partner_id", partnerId)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return json({ profiles: data || [] });
      }

      if (action === "invitation-save-profile") {
        const PartnerProfileSchema = ProfileSchema.omit({
          partner_id: true,
          status: true,
          last_reviewed_at: true,
          internal_notes: true,
          evidence: true,
        });
        const parsed = PartnerProfileSchema.safeParse(body?.profile);
        if (!parsed.success) {
          return json(
            { error: "Kontrollera fälten", details: parsed.error.flatten().fieldErrors },
            400
          );
        }
        const { id, ...p } = parsed.data;

        // Partnerinskickat innehåll publiceras aldrig automatiskt.
        const payload = { ...p, partner_id: partnerId, status: "draft" };

        if (id) {
          const { data: existing } = await svc
            .from("partner_assignment_profiles")
            .select("id")
            .eq("id", id)
            .eq("partner_id", partnerId)
            .maybeSingle();
          if (!existing) return json({ error: "Profilen hittades inte" }, 403);
          const { error } = await svc
            .from("partner_assignment_profiles")
            .update(payload)
            .eq("id", id)
            .eq("partner_id", partnerId);
          if (error) return json({ error: error.message }, 400);
          return json({ id });
        }

        const { count } = await svc
          .from("partner_assignment_profiles")
          .select("id", { count: "exact", head: true })
          .eq("partner_id", partnerId);
        if ((count ?? 0) >= 6) {
          return json({ error: "Max sex kompetensprofiler per partner" }, 400);
        }

        const { data, error } = await svc
          .from("partner_assignment_profiles")
          .insert(payload)
          .select("id")
          .single();
        if (error) {
          return json(
            {
              error: error.message.includes("duplicate")
                ? "Ni har redan en profil för den här kompetensen"
                : error.message,
            },
            400
          );
        }
        return json({ id: data.id });
      }

      if (action === "invitation-delete-profile") {
        const id = body?.id;
        if (typeof id !== "string") return json({ error: "id krävs" }, 400);
        const { error } = await svc
          .from("partner_assignment_profiles")
          .delete()
          .eq("id", id)
          .eq("partner_id", partnerId);
        if (error) throw error;
        return json({ ok: true });
      }

      return json({ error: "Okänd åtgärd" }, 400);
    }

    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (typeof token !== "string" || !(await verifyJWT(token, secret))) {
      return json({ error: "Behörighet saknas" }, 401);
    }

    if (action === "list") {
      const { data, error } = await svc
        .from("partner_assignment_profiles")
        .select("*, partners(name, slug, is_featured)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      const ids = (data || []).map((p: { id: string }) => p.id);
      let evidence: unknown[] = [];
      if (ids.length) {
        const { data: ev, error: evErr } = await svc
          .from("assignment_profile_evidence")
          .select("*")
          .in("profile_id", ids);
        if (evErr) throw evErr;
        evidence = ev || [];
      }
      return json({ profiles: data || [], evidence });
    }

    if (action === "save") {
      const parsed = ProfileSchema.safeParse(body?.profile);
      if (!parsed.success) {
        console.error("save validation failed", JSON.stringify(parsed.error.flatten().fieldErrors));
        return json({ error: "Ogiltiga fält", details: parsed.error.flatten().fieldErrors }, 400);
      }
      const { evidence, id, ...profile } = parsed.data;

      if (profile.status === "published" && !profile.last_reviewed_at) {
        return json({ error: "Datum för redaktionell kontroll krävs vid publicering" }, 400);
      }

      let profileId = id;
      if (profileId) {
        const { error } = await svc
          .from("partner_assignment_profiles")
          .update(profile)
          .eq("id", profileId);
        if (error) return json({ error: error.message }, 400);
      } else {
        const { data, error } = await svc
          .from("partner_assignment_profiles")
          .insert(profile)
          .select("id")
          .single();
        if (error) return json({ error: error.message }, 400);
        profileId = data.id;
      }

      await svc.from("assignment_profile_evidence").delete().eq("profile_id", profileId);
      if (evidence.length) {
        const rows = evidence.map((e) => ({
          profile_id: profileId,
          evidence_type: e.evidence_type,
          title: e.title,
          url: e.url || null,
          // Interna referenser får aldrig visas publikt.
          is_public: e.evidence_type === "internal_reference" ? false : e.is_public,
        }));
        const { error } = await svc.from("assignment_profile_evidence").insert(rows);
        if (error) throw error;
      }

      return json({ id: profileId });
    }

    if (action === "delete") {
      const id = body?.id;
      if (typeof id !== "string") return json({ error: "id krävs" }, 400);
      const { error } = await svc.from("partner_assignment_profiles").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Okänd åtgärd" }, 400);
  } catch (e) {
    console.error("manage-assignment-profiles error", e);
    return json({ error: "Något gick fel" }, 500);
  }
});
