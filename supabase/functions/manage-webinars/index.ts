import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { requestIsEditor } from "../_shared/editorAuth.ts";
import { str, toCsv } from "../_shared/demandExport.ts";

const THEMES = ["partnerval", "pris", "migrering", "business-central", "fscm", "crm", "ai"] as const;
const STATUSES = ["utkast", "publicerad", "genomford", "installd"] as const;
const optionalHttps = z.union([z.string().trim().url().startsWith("https://").max(2000), z.literal(""), z.null(), z.undefined()]);
const webinarSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(1).max(400),
  body: z.string().trim().max(30000).optional().nullable(),
  starts_at: z.string().datetime({ offset: true }),
  duration_min: z.coerce.number().int().min(5).max(480),
  theme: z.enum(THEMES),
  speakers: z.string().trim().max(500).optional().nullable(),
  join_url: optionalHttps,
  recording_url: optionalHttps,
  status: z.enum(STATUSES),
});

const REGISTRATION_COLUMNS = [
  "created_at", "first_name", "last_name", "company", "title", "email",
  "consent_reminder", "consent_followup", "consent_text_version", "source_page",
  "landing_page", "session_pages", "utm_source", "utm_medium", "utm_campaign", "cancelled_at",
];

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (!(await requestIsEditor(req))) return json({ error: "Unauthorized" }, 401);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "list";

  try {
    if (action === "list" && req.method === "GET") {
      const [{ data: webinars, error }, { data: registrations, error: registrationError }] = await Promise.all([
        db.from("webinars").select("*").order("starts_at", { ascending: false }),
        db.from("webinar_registrations").select("webinar_id, cancelled_at"),
      ]);
      if (error || registrationError) return json({ error: "Kunde inte hämta webinar." }, 500);
      const counts = new Map<string, number>();
      for (const row of registrations || []) {
        if (!row.cancelled_at) counts.set(row.webinar_id, (counts.get(row.webinar_id) || 0) + 1);
      }
      return json({ webinars: (webinars || []).map((row) => ({ ...row, registration_count: counts.get(row.id) || 0 })) });
    }

    if (action === "save" && req.method === "POST") {
      const parsed = webinarSchema.safeParse(await req.json());
      if (!parsed.success) return json({ error: "Kontrollera fälten. Beskrivningen får vara högst 400 tecken och länkar måste börja med https://." }, 400);
      const { id, ...input } = parsed.data;
      const payload = {
        ...input,
        body: input.body || null,
        speakers: input.speakers || null,
        join_url: input.join_url || null,
        recording_url: input.recording_url || null,
      };
      if (payload.status === "publicerad" && !payload.join_url) {
        return json({ error: "Lägg till deltagarlänken innan webinaret publiceras." }, 400);
      }
      const query = id
        ? db.from("webinars").update(payload).eq("id", id).select().single()
        : db.from("webinars").insert(payload).select().single();
      const { data, error } = await query;
      if (error) return json({ error: error.code === "23505" ? "Adressen används redan." : "Kunde inte spara webinaret." }, 400);
      return json({ ok: true, webinar: data });
    }

    if (action === "delete" && req.method === "POST") {
      const { id } = z.object({ id: z.string().uuid() }).parse(await req.json());
      const { error } = await db.from("webinars").delete().eq("id", id);
      if (error) return json({ error: "Kunde inte ta bort webinaret." }, 400);
      return json({ ok: true });
    }

    if ((action === "registrations" || action === "registrations-csv") && req.method === "GET") {
      const webinarId = z.string().uuid().parse(url.searchParams.get("webinar_id"));
      const { data, error } = await db.from("webinar_registrations")
        .select(REGISTRATION_COLUMNS.join(","))
        .eq("webinar_id", webinarId)
        .order("created_at", { ascending: false });
      if (error) return json({ error: "Kunde inte hämta anmälningarna." }, 500);
      if (action === "registrations") return json({ registrations: data || [] });
      const rows = (data || []).map((row) => Object.fromEntries(REGISTRATION_COLUMNS.map((column) => [
        column,
        column === "session_pages"
          ? (Array.isArray(row.session_pages) ? row.session_pages.join(" | ") : "")
          : str(row[column as keyof typeof row]),
      ])));
      return new Response(toCsv(REGISTRATION_COLUMNS, rows), {
        status: 200,
        headers: {
          ...cors,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="webinar-anmalningar-${webinarId}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return json({ error: "Unknown action" }, 404);
  } catch {
    return json({ error: "Förfrågan kunde inte genomföras." }, 400);
  }
});
