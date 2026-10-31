// Publik (token-skyddad) självservice för ISV-leverantörer.
// Inbjudan gäller antingen en produkt (scope "solution") eller hela leverantören (scope "vendor").
// Allt som skickas in sparas som förslag i isv_submissions och granskas av redaktionen:
// inget publiceras, bekräftas eller verifieras automatiskt.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders, json, cleanText, cleanList } from "../_shared/isvAuth.ts";

const DELIVERY = ["native_isv", "external_saas", "integration_layer", "industry_solution"];
const GEO = ["Sverige", "Norden", "Europa", "Global"];
const PRODUCT_FIELDS =
  "solution_id, name, vendor, vendor_slug, category, short_description, what, when_fits, use_cases, combos, products, industry_focus, partner_slugs, vendor_website, delivery_model, geo, is_published, information_status";

const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : null);
const url = (v: unknown) => {
  const t = cleanText(v, 300);
  return t && /^https?:\/\//i.test(t) ? t : null;
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const reqUrl = new URL(req.url);
    const token = (reqUrl.searchParams.get("token") || "").trim().slice(0, 100);
    if (!token || !/^[a-f0-9]{16,64}$/.test(token)) return json({ error: "Ogiltig länk" }, 400, corsHeaders);

    const { data: invitation } = await supabase
      .from("isv_invitations")
      .select("id, solution_id, solution_name, vendor_name, email, status, expires_at, scope, vendor_slug")
      .eq("token", token)
      .maybeSingle();

    if (!invitation) return json({ error: "Länken är ogiltig" }, 404, corsHeaders);
    if (new Date(invitation.expires_at) < new Date()) {
      return json({ error: "Länken har gått ut. Kontakta d365.se för en ny." }, 410, corsHeaders);
    }
    const isVendor = invitation.scope === "vendor" && !!invitation.vendor_slug;

    if (req.method === "GET") {
      const { data: submissions } = await supabase
        .from("isv_submissions")
        .select("id, kind, solution_id, status, submitted_at, short_description, what, when_fits, use_cases, combos, products, industries, partner_slugs, vendor_website, contact_name, contact_email, notes, payload, confirm_information, request_publication")
        .eq("invitation_id", invitation.id)
        .order("submitted_at", { ascending: false });

      if (!isVendor) {
        // Endast leverantörens egna fält – aldrig interna admin-/säljkontakter
        const { data: override } = await supabase
          .from("isv_solution_overrides")
          .select("solution_id, short_description, what, when_fits, use_cases, combos, products, industries, partner_slugs, vendor_name, vendor_website, vendor_contact_name, vendor_contact_email, vendor_updated_at")
          .eq("solution_id", invitation.solution_id)
          .maybeSingle();
        const submission = (submissions || []).find((s) => s.kind === "solution_update") || null;
        return json({ invitation, override: override || null, submission }, 200, corsHeaders);
      }

      const [{ data: vendor }, { data: internal }, { data: products }] = await Promise.all([
        supabase.from("isv_vendors").select("slug, name, website, description, logo_url, information_status").eq("slug", invitation.vendor_slug).maybeSingle(),
        supabase.from("isv_vendor_internal").select("contact_name, contact_email").eq("vendor_slug", invitation.vendor_slug).maybeSingle(),
        supabase.from("isv_solutions").select(PRODUCT_FIELDS).eq("vendor_slug", invitation.vendor_slug).order("name"),
      ]);
      const ids = (products || []).map((p) => p.solution_id);
      const { data: overrides } = ids.length
        ? await supabase.from("isv_solution_overrides").select("solution_id, short_description, what, when_fits, use_cases, combos, products, industries, partner_slugs, vendor_website").in("solution_id", ids)
        : { data: [] };
      return json({
        invitation,
        vendor: vendor ? { ...vendor, contact_name: internal?.contact_name ?? null, contact_email: internal?.contact_email ?? null } : null,
        products: products || [],
        overrides: overrides || [],
        submissions: submissions || [],
      }, 200, corsHeaders);
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (cleanText(body?.company_website_hp, 200)) return json({ success: true }, 200, corsHeaders);

      const kind = isVendor ? pick(body?.kind, ["vendor_profile", "solution_update", "new_solution"]) : "solution_update";
      if (!kind) return json({ error: "Okänd typ av inskick" }, 400, corsHeaders);

      const base = {
        invitation_id: invitation.id,
        kind,
        vendor_slug: isVendor ? invitation.vendor_slug : null,
        contact_name: cleanText(body?.contact_name, 200),
        contact_email: cleanText(body?.contact_email, 200),
        notes: cleanText(body?.notes, 2000),
        confirm_information: body?.confirm_information === true,
        status: "pending",
        submitted_at: new Date().toISOString(),
      };

      let row: Record<string, unknown>;
      if (kind === "vendor_profile") {
        const payload = {
          website: url(body?.website),
          description: cleanText(body?.description, 2000),
          logo_url: url(body?.logo_url),
        };
        if (!payload.description && !payload.website && !base.confirm_information) {
          return json({ error: "Fyll i en uppgift eller bekräfta att profilen stämmer" }, 400, corsHeaders);
        }
        row = { ...base, solution_id: `vendor:${invitation.vendor_slug}`, payload };
      } else {
        let solution_id: string;
        const payload: Record<string, unknown> = {
          delivery_model: pick(body?.delivery_model, DELIVERY),
          geo: cleanList(body?.geo, 4, 40).filter((g) => GEO.includes(g)),
        };
        if (kind === "new_solution") {
          const name = cleanText(body?.name, 200);
          if (!name) return json({ error: "Ange produktens namn" }, 400, corsHeaders);
          payload.name = name;
          payload.category = cleanText(body?.category, 100);
          const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
          solution_id = `${slug}-${crypto.randomUUID().slice(0, 6)}`;
        } else {
          solution_id = isVendor ? cleanText(body?.solution_id, 100) || "" : invitation.solution_id;
          if (isVendor) {
            const { data: own } = await supabase.from("isv_solutions").select("solution_id").eq("solution_id", solution_id).eq("vendor_slug", invitation.vendor_slug).maybeSingle();
            if (!own) return json({ error: "Produkten tillhör inte leverantören" }, 403, corsHeaders);
          }
        }
        row = {
          ...base,
          solution_id,
          payload,
          request_publication: body?.request_publication === true,
          short_description: cleanText(body?.short_description, 400),
          what: cleanText(body?.what, 4000),
          when_fits: cleanText(body?.when_fits, 4000),
          use_cases: cleanList(body?.use_cases, 12, 300),
          combos: cleanList(body?.combos, 12, 300),
          products: cleanList(body?.products, 12, 100),
          industries: cleanList(body?.industries, 25, 100),
          partner_slugs: cleanList(body?.partner_slugs, 100, 120),
          vendor_website: url(body?.vendor_website),
        };
        if (!row.short_description && !row.what) return json({ error: "Fyll i minst en kort beskrivning" }, 400, corsHeaders);
        if (!(row.products as string[]).length) return json({ error: "Välj minst en Dynamics 365-produkt" }, 400, corsHeaders);
      }

      const { error } = await supabase.from("isv_submissions").insert(row);
      if (error) {
        console.error("isv-profile insert", error);
        return json({ error: "Kunde inte spara inskicket" }, 400, corsHeaders);
      }
      const submittedAt = String(base.submitted_at);
      // Leverantörens egen uppdatering sparar datumet direkt (även för verifierade poster),
      // så att redaktionen ser att uppgifterna behöver kontrolleras och verifieras på nytt.
      if (kind === "vendor_profile") {
        await supabase.from("isv_vendors").update({ vendor_updated_at: submittedAt }).eq("slug", invitation.vendor_slug);
      } else if (kind === "solution_update") {
        await supabase.from("isv_solutions").update({ vendor_updated_at: submittedAt }).eq("solution_id", row.solution_id as string);
      }
      await supabase.from("isv_invitations").update({ status: "submitted", submitted_at: new Date().toISOString() }).eq("id", invitation.id);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Method not allowed" }, 405, corsHeaders);
  } catch (e) {
    console.error("isv-profile error", e);
    return json({ error: "Internal error" }, 500, corsHeaders);
  }
});
