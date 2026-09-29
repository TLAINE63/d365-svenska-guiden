// Partnermastermodell (BizApps) – endast redaktion/admin.
// Ingen ranking, matchning eller AI. Se docs/PARTNER-MASTER-MODEL.md.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { computeReview, runPrefill, decideChange, reviewOverview } from "../_shared/partner-review.ts";

const ALLOWED_ORIGINS = ["https://d365.se", "https://www.d365.se", "http://localhost:5173", "http://localhost:8080"];
function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const ok = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".lovableproject.com") || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}
const b64 = (s: string) => { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; };
async function verifyAdmin(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const bin = atob(b64(sig)); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (!(await crypto.subtle.verify("HMAC", key, bytes, enc.encode(`${h}.${p}`)))) return false;
    const payload = JSON.parse(atob(b64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch { return false; }
}

const STATUSES = ["partner_verified", "editorial_verified", "public_source", "legacy_import", "unverified"];
const VERIFIED_BY = ["partner", "redaktion", "publik_kalla", "import"];
const dateOrNull = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const urlOrNull = (v: unknown) => (typeof v === "string" && /^https?:\/\/\S+$/.test(v.trim()) ? v.trim().slice(0, 500) : null);

function validateVerification(v: any) {
  const status = STATUSES.includes(v?.verification_status) ? v.verification_status : "unverified";
  const verified_by = VERIFIED_BY.includes(v?.verified_by) ? v.verified_by : null;
  const verified_at = dateOrNull(v?.verified_at);
  if (["partner_verified", "editorial_verified", "public_source"].includes(status) && !verified_by)
    throw new Error("Verifieringsstatus kräver en verifieringskälla (verifierad av)");
  if (status === "partner_verified" && !verified_at) throw new Error("Partnerverifierad uppgift kräver ett datum");
  return { verification_status: status, verified_by, verified_at, source_url: urlOrNull(v?.source_url) };
}

serve(async (req) => {
  const h = cors(req);
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: h });
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyAdmin(token, secret))) return json({ error: "Unauthorized" }, 401);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, secret);
    const action = new URL(req.url).searchParams.get("action") || "";
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    if (action === "bootstrap") {
      const [{ data: partners }, { data: products }, { data: options }, { data: groups }] = await Promise.all([
        sb.from("partners").select("id, name, slug, is_featured, agreement_signed").order("name"),
        sb.from("product_catalog").select("*").order("sort_order"),
        sb.from("product_attribute_options").select("*").eq("is_active", true).order("sort_order"),
        sb.from("product_groups").select("group_key, name, purpose, members:product_group_members(product_id)").eq("is_active", true),
      ]);
      return json({ partners, products, options, groups });
    }

    if (action === "partner") {
      const id = String(body.partner_id || "");
      const { data: partner, error } = await sb.from("partners").select(
        "id, name, slug, logo_url, website, is_featured, agreement_signed, agreement_signed_at, geography, office_cities, applications, industries, product_filters, team_size_sweden, implementations_done, updated_at",
      ).eq("id", id).single();
      if (error || !partner) return json({ error: "Partnern finns inte" }, 404);
      const { data: profiles } = await sb.from("partner_product_profiles")
        .select("*, product:product_catalog(product_key, name, category, catalog_type, display_group)").eq("partner_id", id);
      const ids = (profiles || []).map((p: any) => p.id);
      const [{ data: attributes }, { data: capabilities }, { data: solutions }, { data: certifications }] = await Promise.all([
        ids.length ? sb.from("partner_product_attributes").select("*").in("partner_product_profile_id", ids) : Promise.resolve({ data: [] }),
        ids.length ? sb.from("partner_product_capabilities").select("*").in("partner_product_profile_id", ids) : Promise.resolve({ data: [] }),
        ids.length ? sb.from("partner_industry_solutions").select("*").in("profile_id", ids).order("created_at") : Promise.resolve({ data: [] }),
        sb.from("partner_certifications").select("*").eq("partner_id", id),
      ]);
      return json({ partner, profiles, attributes, capabilities, solutions, certifications });
    }

    if (action === "create-profile") {
      const { data: prod } = await sb.from("product_catalog").select("id, is_active").eq("product_key", String(body.product_key || "")).maybeSingle();
      if (!prod) return json({ error: "Ogiltig produktnyckel" }, 400);
      if (!prod.is_active) return json({ error: "Produkten är inaktiv" }, 400);
      const { data, error } = await sb.from("partner_product_profiles").insert({ partner_id: body.partner_id, product_id: prod.id }).select().single();
      if (error) return json({ error: error.code === "23505" ? "Partnern har redan en profil för produkten" : error.message }, 400);
      return json({ profile: data });
    }

    if (action === "save-profile") {
      const v = validateVerification(body);
      const upd: Record<string, unknown> = {
        ...v,
        status: ["draft", "active", "archived"].includes(body.status) ? body.status : "draft",
        is_primary: !!body.is_primary,
        is_published: !!body.is_published,
      };
      const { error } = await sb.from("partner_product_profiles").update(upd).eq("id", body.profile_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    const pickMeta = (a: any) => ({
      ...validateVerification(a),
      source_type: ["partner", "redaktion", "publik_kalla", "import"].includes(a.verified_by) ? a.verified_by : null,
      is_published: !!a.is_published,
      editorial_note: typeof a.editorial_note === "string" ? a.editorial_note.slice(0, 500) : null,
    });

    // Generiskt: ersätter hela uppsättningen attributval för en produktprofil.
    // "save-bc-attributes" finns kvar som alias för bakåtkompatibilitet.
    if (action === "save-attributes" || action === "save-bc-attributes") {
      const list = Array.isArray(body.attributes) ? body.attributes : [];
      const { data: prof } = await sb.from("partner_product_profiles").select("product_id").eq("id", body.profile_id).single();
      if (!prof) return json({ error: "Profilen finns inte" }, 404);
      const { data: opts } = await sb.from("product_attribute_options").select("id, dimension_key, attribute_key").eq("product_id", prof.product_id);
      const byKey = new Map((opts || []).map((o: any) => [`${o.dimension_key}:${o.attribute_key}`, o.id]));
      const byId = new Set((opts || []).map((o: any) => o.id));
      const seen = new Set<string>();
      const rows = list.map((a: any) => {
        const optId = a.product_attribute_option_id && byId.has(a.product_attribute_option_id)
          ? a.product_attribute_option_id
          : byKey.get(`${a.dimension_key ?? a.attribute_type}:${a.attribute_key ?? a.value_key}`);
        if (!optId) throw new Error("Attributet tillhör inte profilens produkt");
        if (seen.has(optId)) throw new Error("Ett val förekommer flera gånger");
        seen.add(optId);
        return { partner_product_profile_id: body.profile_id, product_attribute_option_id: optId, ...pickMeta(a) };
      });
      const { error: dErr } = await sb.from("partner_product_attributes").delete().eq("partner_product_profile_id", body.profile_id);
      if (dErr) return json({ error: dErr.message }, 400);
      if (rows.length) {
        const { error } = await sb.from("partner_product_attributes").insert(rows);
        if (error) return json({ error: error.message }, 400);
      }
      return json({ ok: true, count: rows.length });
    }

    // Tvärgående förmågor på en produktprofil (ersätter hela uppsättningen)
    if (action === "save-capabilities") {
      const list = Array.isArray(body.capabilities) ? body.capabilities : [];
      const seen = new Set<string>();
      const rows = list.map((c: any) => {
        const pid = String(c.capability_product_id || "");
        if (!pid || seen.has(pid)) throw new Error("Ogiltig eller dubblerad förmåga");
        seen.add(pid);
        return { partner_product_profile_id: body.profile_id, capability_product_id: pid, ...pickMeta(c) };
      });
      const { error: dErr } = await sb.from("partner_product_capabilities").delete().eq("partner_product_profile_id", body.profile_id);
      if (dErr) return json({ error: dErr.message }, 400);
      if (rows.length) {
        const { error } = await sb.from("partner_product_capabilities").insert(rows);
        if (error) return json({ error: error.message }, 400);
      }
      return json({ ok: true, count: rows.length });
    }

    if (action === "save-solution") {
      const name = String(body.name || "").trim();
      if (!name) return json({ error: "En branschlösning måste ha ett namn" }, 400);
      const row = {
        profile_id: body.profile_id, name: name.slice(0, 120),
        description: typeof body.description === "string" ? body.description.slice(0, 800) : null,
        industries: Array.isArray(body.industries) ? [...new Set(body.industries.map(String))].slice(0, 10) : [],
        solution_type: ["own", "third_party", "packaged_offering"].includes(body.solution_type) ? body.solution_type : "own",
        source_url: urlOrNull(body.source_url),
        partner_verified: !!body.partner_verified, editorial_verified: !!body.editorial_verified,
        verified_at: dateOrNull(body.verified_at), is_published: !!body.is_published,
      };
      if (row.partner_verified && !row.verified_at) return json({ error: "Partnerverifierad lösning kräver datum" }, 400);
      const q = body.id ? sb.from("partner_industry_solutions").update(row).eq("id", body.id) : sb.from("partner_industry_solutions").insert(row);
      const { error } = await q;
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "delete-solution") {
      const { error } = await sb.from("partner_industry_solutions").delete().eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "migration-report") {
      const { data: partners } = await sb.from("partners").select(
        "id, name, slug, description, applications, customer_examples, product_profiles, positioning_statement, delivery_profile, industry_apps, agreement_signed_at, updated_at",
      ).eq("agreement_signed", true).order("name");
      const { data: bc } = await sb.from("product_catalog").select("id").eq("product_key", "business-central").single();
      const ids = (partners || []).map((p: any) => p.id);
      const { data: profiles } = await sb.from("partner_product_profiles").select("id, partner_id, verification_status, verified_at, is_published").eq("product_id", bc!.id).in("partner_id", ids);
      const pids = (profiles || []).map((p: any) => p.id);
      const [{ data: attrs }, { data: sols }] = await Promise.all([
        pids.length ? sb.from("partner_product_attributes").select("profile_id:partner_product_profile_id, verification_status, option:product_attribute_options!inner(dimension_key)").in("partner_product_profile_id", pids) : Promise.resolve({ data: [] }),
        pids.length ? sb.from("partner_industry_solutions").select("profile_id").in("profile_id", pids) : Promise.resolve({ data: [] }),
      ]);
      const rows = (partners || []).map((p: any) => {
        const prof = (profiles || []).find((x: any) => x.partner_id === p.id) || null;
        const a = (attrs || []).filter((x: any) => x.profile_id === prof?.id);
        const count = (t: string) => a.filter((x: any) => x.option?.dimension_key === t).length;
        const bcText = p.product_profiles?.["Business Central"] || null;
        const examples = Array.isArray(p.customer_examples) ? p.customer_examples.filter((e: any) => !e?.application || e.application === "Business Central") : [];
        const missing = [
          !count("migration") && "Migreringserfarenhet", !count("competency") && "BC-kompetens",
          !count("project_type") && "Typiska projekt", !count("delivery_model") && "Leveransmodell",
          !(sols || []).some((s: any) => s.profile_id === prof?.id) && "Branschlösning (eller uttryckligt Nej)",
        ].filter(Boolean);
        return {
          partner_id: p.id, name: p.name, slug: p.slug,
          has_bc: (p.applications || []).includes("Business Central"),
          bc_profile: prof,
          free_text: {
            description: p.description || null,
            bc_positioning: bcText?.positioning || p.positioning_statement || null,
            bc_methodology: bcText?.methodology || p.delivery_profile?.methodology || null,
            customer_examples: examples.slice(0, 5).map((e: any) => e?.title || e?.name || e?.description || "").filter(Boolean),
            industry_apps: (p.industry_apps || []).map((x: any) => x?.name).filter(Boolean),
          },
          counts: { migration: count("migration"), competency: count("competency"), project_type: count("project_type"), delivery_model: count("delivery_model") },
          needs_partner_confirmation: a.filter((x: any) => !["partner_verified", "editorial_verified"].includes(x.verification_status)).length,
          missing,
          last_verified_at: prof?.verified_at || null,
        };
      });
      return json({ rows });
    }

    // ---- Partner Review Queue ----
    if (action === "review-overview") return json(await reviewOverview(sb));
    if (action === "review-partner") return json(await computeReview(sb, String(body.partner_id || ""), ["bc", "fsc", "sales", "service"].includes(body.product) ? body.product : "bc"));
    if (action === "review-prefill") {
      const product = ["bc", "fsc", "sales", "service"].includes(body.product) ? body.product : "bc";
      if (body.all) {
        const { data: ps } = await sb.from("partners").select("id").eq("agreement_signed", true);
        let created = 0;
        for (const p of ps || []) created += (await runPrefill(sb, p.id, product)).created || 0;
        return json({ created });
      }
      return json(await runPrefill(sb, String(body.partner_id || ""), product));
    }
    if (action === "review-changes") {
      const status = ["pending", "clarification", "approved", "rejected"].includes(body.status) ? body.status : "pending";
      const { data, error } = await sb.from("partner_review_changes").select("*, partner:partners(name, slug), profile:partner_product_profiles(product_id, product:product_catalog(product_key, name))")
        .eq("status", status).order("created_at", { ascending: false }).limit(300);
      if (error) return json({ error: error.message }, 400);
      return json({ changes: data });
    }
    if (action === "review-decide") {
      return json(await decideChange(sb, String(body.id || ""), String(body.decision || ""), typeof body.note === "string" ? body.note : null));
    }

    if (action === "export-bc") {
      const { data, error } = await sb.from("export_bc_partner_v1").select("*");
      if (error) return json({ error: error.message }, 400);
      return json({ schemaVersion: "1.0", partners: data });
    }

    return json({ error: "Okänd åtgärd" }, 400);
  } catch (e) {
    console.error("manage-partner-master:", e);
    return json({ error: e instanceof Error ? e.message : "Serverfel" }, 400);
  }
});
