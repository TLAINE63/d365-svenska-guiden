import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, json, verifyAdminJWT, cleanText, cleanList } from "../_shared/isvAuth.ts";

/**
 * WP1 – administration av rådgivning (endast roll admin).
 * Advisory Booking = inquiries (is_advisory), Advisory Case = advisory_cases, Partner Introduction = partner_introductions.
 * Affärsregler (godkännande, kvalificering, statusflöde) upprätthålls av databasens triggers.
 * Partnerintroduktioner skapas bara här, genom ett aktivt adminbeslut.
 */

const CASE_FIELDS = ["contact_name", "company", "email", "phone", "need_summary", "notes", "status", "next_step", "budget", "timeline"] as const;
const INTRO_FIELDS = ["consent_note", "partner_response", "business_status", "estimated_project_size", "business_outcome", "next_step", "admin_notes"] as const;
const SCOPES = new Set(["kontaktuppgifter", "behovssammanfattning", "kopresans_underlag", "budget_tidplan"]);
const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);
const toDate = (v: unknown): string | null => {
  if (typeof v !== "string" || !v.trim()) return null;
  const d = new Date(v.length === 10 ? `${v}T12:00:00Z` : v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};
const pick = (body: Record<string, unknown>, keys: readonly string[], max = 4000) => {
  const out: Record<string, unknown> = {};
  for (const k of keys) if (k in body) out[k] = cleanText(body[k], max);
  return out;
};

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!token) return json({ error: "Unauthorized" }, 401, cors);
  const isAdmin = await verifyAdminJWT(token, secret, ["admin"]);
  // Redaktionen (roll editor) når bara hjälpvägarnas ärendelista och statusändring, aldrig introduktioner.
  const isEditor = !isAdmin && (await verifyAdminJWT(token, secret, ["editor"]));
  if (!isAdmin && !isEditor) return json({ error: "Unauthorized" }, 401, cors);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, secret);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* tom */ }
  const action = String(body.action || "list");
  if (isEditor && action !== "help_requests" && action !== "update_help_status") return json({ error: "Unauthorized" }, 401, cors);

  const fail = (e: { message?: string; code?: string } | null) => {
    console.error(e);
    // Regelbrott från triggers (P0001) och unika krav (23505) visas för administratören.
    if (e?.code === "P0001") return json({ error: e.message }, 400, cors);
    if (e?.code === "23505") return json({ error: "Det finns redan en sådan koppling." }, 400, cors);
    return json({ error: "Kunde inte spara." }, 500, cors);
  };

  try {
    if (action === "list") {
      const [cases, bookings, intros, links, partners, direct, events] = await Promise.all([
        sb.from("advisory_cases").select("*").order("created_at", { ascending: false }).limit(500),
        sb.from("inquiries").select("id, created_at, advisory_case_id, contact_name, company, email, phone, help_with, message, project, include_project, advisory_placement, advisory_cta, page_type, landing_page, booking_status, meeting_at, meeting_held_at, source_site").eq("is_advisory", true).order("created_at", { ascending: false }).limit(1000),
        sb.from("partner_introductions").select("*").order("created_at", { ascending: true }),
        sb.from("advisory_case_links").select("*"),
        sb.from("partners").select("slug, name, is_featured").order("name"),
        sb.from("inquiries").select("id", { count: "exact", head: true }).eq("is_advisory", false),
        sb.from("funnel_events").select("event_name, metadata").eq("event_type", "advisory").gte("occurred_at", new Date(Date.now() - 180 * 86400000).toISOString()).limit(20000),
      ]);
      for (const r of [cases, bookings, intros, links, partners]) if (r.error) return fail(r.error);
      // Mätning per beslutspunkt: CTA-visning → klick → bokning (klient) och möte → introduktion (server).
      const funnel: Record<string, Record<string, number>> = {};
      for (const e of events.data || []) {
        const placement = String((e.metadata as Record<string, unknown> | null)?.placement ?? "okänd");
        funnel[placement] ??= {};
        funnel[placement][e.event_name] = (funnel[placement][e.event_name] || 0) + 1;
      }
      const introCase = new Set((intros.data || []).filter((i) => i.introduced_at).map((i) => i.case_id));
      return json({
        cases: cases.data, bookings: bookings.data, intros: intros.data, links: links.data, partners: partners.data,
        summary: {
          direct_partner_requests: direct.count ?? 0,
          advisory_with_introduction: (cases.data || []).filter((c) => introCase.has(c.id)).length,
          advisory_without_introduction: (cases.data || []).filter((c) => !introCase.has(c.id)).length,
        },
        funnel,
      }, 200, cors);
    }

    // Ärenden från alla hjälpvägar: en rad per inskick med ärendets status, val och underlag.
    if (action === "help_requests") {
      const [bookings, cases] = await Promise.all([
        sb.from("inquiries").select("id, created_at, advisory_case_id, contact_name, company, email, phone, help_with, message, project, advisory_placement, advisory_cta, page_type, landing_page, booking_status, source_site").eq("is_advisory", true).order("created_at", { ascending: false }).limit(1000),
        sb.from("advisory_cases").select("id, status, next_step, notes, journey_selection, origin_placement, updated_at").limit(2000),
      ]);
      if (bookings.error) return fail(bookings.error);
      if (cases.error) return fail(cases.error);
      const byId = new Map((cases.data || []).map((c) => [c.id, c]));
      return json({
        requests: (bookings.data || []).map((b) => {
          const c = b.advisory_case_id ? byId.get(b.advisory_case_id) : null;
          return { ...b, case_status: c?.status ?? null, next_step: c?.next_step ?? null, notes: c?.notes ?? null, selection: c?.journey_selection ?? {}, case_updated_at: c?.updated_at ?? null };
        }),
      }, 200, cors);
    }

    if (action === "update_help_status") {
      if (!isUuid(body.id)) return json({ error: "id saknas" }, 400, cors);
      const { data: row } = await sb.from("inquiries").select("is_advisory, advisory_case_id").eq("id", body.id).maybeSingle();
      if (!row?.is_advisory) return json({ error: "Ärendet finns inte" }, 404, cors);
      if (typeof body.booking_status === "string") {
        const { error } = await sb.from("inquiries").update({ booking_status: body.booking_status }).eq("id", body.id);
        if (error) return fail(error);
      }
      if (row.advisory_case_id) {
        const upd = pick(body, ["status", "next_step", "notes"]);
        if ("status" in upd && !upd.status) delete upd.status;
        if (Object.keys(upd).length) {
          const { error } = await sb.from("advisory_cases").update(upd).eq("id", row.advisory_case_id);
          if (error) return fail(error);
        }
      }
      return json({ ok: true }, 200, cors);
    }

    if (action === "create_case") {
      const fields = pick(body, CASE_FIELDS);
      const { data, error } = await sb.from("advisory_cases").insert({ ...fields, origin_placement: "manuell", status: (fields.status as string) || "ny" }).select("id").single();
      return error ? fail(error) : json({ id: data.id }, 200, cors);
    }

    if (action === "update_case") {
      if (!isUuid(body.id)) return json({ error: "id saknas" }, 400, cors);
      const fields = pick(body, CASE_FIELDS);
      if ("status" in fields && !fields.status) delete fields.status;
      const { error } = await sb.from("advisory_cases").update(fields).eq("id", body.id);
      return error ? fail(error) : json({ ok: true }, 200, cors);
    }

    if (action === "update_booking") {
      if (!isUuid(body.id)) return json({ error: "id saknas" }, 400, cors);
      const upd: Record<string, unknown> = {};
      if (typeof body.booking_status === "string") upd.booking_status = body.booking_status;
      if ("meeting_at" in body) upd.meeting_at = toDate(body.meeting_at);
      if (body.meeting_held === true) { upd.meeting_held_at = new Date().toISOString(); upd.booking_status = "genomford"; }
      if (isUuid(body.advisory_case_id)) upd.advisory_case_id = body.advisory_case_id;
      const { data: row } = await sb.from("inquiries").select("is_advisory").eq("id", body.id).maybeSingle();
      if (!row?.is_advisory) return json({ error: "Bokningen finns inte" }, 404, cors);
      const { error } = await sb.from("inquiries").update(upd).eq("id", body.id);
      return error ? fail(error) : json({ ok: true }, 200, cors);
    }

    if (action === "link_cases" || action === "unlink_cases") {
      if (!isUuid(body.a) || !isUuid(body.b) || body.a === body.b) return json({ error: "Välj två olika ärenden" }, 400, cors);
      const [a, b] = [body.a, body.b].sort();
      const q = action === "link_cases"
        ? sb.from("advisory_case_links").insert({ case_a: a, case_b: b, note: cleanText(body.note, 500) })
        : sb.from("advisory_case_links").delete().eq("case_a", a).eq("case_b", b);
      const { error } = await q;
      return error ? fail(error) : json({ ok: true }, 200, cors);
    }

    if (action === "create_intro") {
      if (!isUuid(body.case_id)) return json({ error: "Ärende saknas" }, 400, cors);
      const slug = cleanText(body.partner_slug, 120);
      if (!slug) return json({ error: "Välj en partner" }, 400, cors);
      const { data: p } = await sb.from("partners").select("slug, name").eq("slug", slug).maybeSingle();
      if (!p) return json({ error: "Partnern finns inte" }, 400, cors);
      const scope = cleanList(body.consent_scope, 10, 60).filter((s) => SCOPES.has(s));
      const { data, error } = await sb.from("partner_introductions").insert({
        case_id: body.case_id, partner_slug: p.slug, partner_name: p.name,
        consent_given: body.consent_given === true, consent_at: toDate(body.consent_at), consent_scope: scope,
        consent_note: cleanText(body.consent_note, 1000),
      }).select("id").single();
      if (error) return fail(error);
      await sb.from("advisory_cases").update({ status: "introduktion" }).eq("id", body.case_id).in("status", ["ny", "mote_bokat", "mote_genomfort"]);
      return json({ id: data.id }, 200, cors);
    }

    if (action === "update_intro") {
      if (!isUuid(body.id)) return json({ error: "id saknas" }, 400, cors);
      const upd: Record<string, unknown> = pick(body, INTRO_FIELDS);
      for (const k of ["partner_response", "business_status"]) if (k in upd && !upd[k]) delete upd[k];
      if ("consent_given" in body) upd.consent_given = body.consent_given === true;
      if ("consent_at" in body) upd.consent_at = toDate(body.consent_at);
      if ("consent_scope" in body) upd.consent_scope = cleanList(body.consent_scope, 10, 60).filter((s) => SCOPES.has(s));
      if (body.mark_sent === true) {
        upd.introduced_at = new Date().toISOString();
        if (!upd.business_status || upd.business_status === "forberedd") upd.business_status = "introducerad";
      }
      const { error } = await sb.from("partner_introductions").update(upd).eq("id", body.id);
      return error ? fail(error) : json({ ok: true }, 200, cors);
    }

    return json({ error: "Okänd åtgärd" }, 400, cors);
  } catch (e) {
    return fail(e as { message?: string });
  }
});
