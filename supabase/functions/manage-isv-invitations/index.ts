import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "../_shared/branded-resend.ts";
import { getCorsHeaders, verifyAdminJWT, json, cleanText, cleanList } from "../_shared/isvAuth.ts";

const PUBLIC_BASE_URL = "https://www.d365.se";

function makeToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("authorization") || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!bearer || !(await verifyAdminJWT(bearer, serviceKey))) {
      return json({ error: "Unauthorized" }, 401, corsHeaders);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    if (action === "list" && req.method === "GET") {
      const [{ data: invitations }, { data: submissions }] = await Promise.all([
        supabase.from("isv_invitations").select("*").order("created_at", { ascending: false }),
        supabase.from("isv_submissions").select("*").order("submitted_at", { ascending: false }),
      ]);
      return json({ invitations: invitations || [], submissions: submissions || [] }, 200, corsHeaders);
    }

    if (action === "create" && req.method === "POST") {
      const body = await req.json();
      const isVendor = body?.scope === "vendor";
      const vendor_slug = isVendor ? cleanText(body?.vendor_slug, 120) : null;
      let solution_id = cleanText(body?.solution_id, 100);
      let solution_name = cleanText(body?.solution_name, 200);
      const email = cleanText(body?.email, 200);
      let vendor_name = cleanText(body?.vendor_name, 200);
      if (isVendor) {
        if (!vendor_slug) return json({ error: "Leverantör krävs" }, 400, corsHeaders);
        const { data: v } = await supabase.from("isv_vendors").select("slug, name").eq("slug", vendor_slug).maybeSingle();
        if (!v) return json({ error: "Leverantören finns inte" }, 404, corsHeaders);
        solution_id = `vendor:${v.slug}`;
        solution_name = v.name;
        vendor_name = vendor_name || v.name;
      }
      if (!solution_id || !solution_name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return json({ error: "Lösning eller leverantör och giltig e-postadress krävs" }, 400, corsHeaders);
      }

      const token = makeToken();
      const { data: invitation, error } = await supabase
        .from("isv_invitations")
        .insert({ solution_id, solution_name, email, vendor_name, token, scope: isVendor ? "vendor" : "solution", vendor_slug })
        .select()
        .single();
      if (error) return json({ error: error.message }, 400, corsHeaders);

      const link = `${PUBLIC_BASE_URL}/isv-profil/${token}`;
      let emailError: string | null = null;

      if (body?.send_email) {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
          emailError = "RESEND_API_KEY saknas";
        } else {
          try {
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
              from: "d365.se <noreply@d365.se>",
              to: [email],
              subject: `Beskriv ${solution_name} i ISV-katalogen på d365.se`,
              html: `
                <div style="font-family:Segoe UI,Arial,sans-serif;color:#1f2933;line-height:1.6">
                  <p>Hej${vendor_name ? ` ${vendor_name}` : ""},</p>
                  <p>d365.se kartlägger tillägg och ISV-lösningar för Microsoft Dynamics 365 på den svenska marknaden.
                  <strong>${solution_name}</strong> finns med i katalogen och ni får gärna beskriva lösningen med era egna ord.</p>
                  <p>Via länken nedan anger ni bland annat vilka Dynamics 365-produkter lösningen är byggd för,
                  vilka branscher den passar för, vad den gör och när den passar.</p>
                  <p><a href="${link}" style="background:#D64A1F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">Fyll i er profil</a></p>
                  <p style="font-size:13px;color:#52606d">Länken är personlig och giltig i 14 dagar.<br>${link}</p>
                  <p style="font-size:13px;color:#52606d">Frågor? Svara på detta mejl eller kontakta thomas.laine@dynamicfactory.se.</p>
                </div>`,
            });
          } catch (e) {
            emailError = (e as Error).message;
          }
        }
      }

      return json({ invitation, link, emailError }, 200, corsHeaders);
    }

    if (action === "delete" && req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("isv_invitations").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    if (action === "approve" && req.method === "POST") {
      const body = await req.json();
      const submission_id = cleanText(body?.submission_id, 100);
      if (!submission_id) return json({ error: "submission_id krävs" }, 400, corsHeaders);

      const { data: sub, error: subErr } = await supabase
        .from("isv_submissions").select("*").eq("id", submission_id).single();
      if (subErr || !sub) return json({ error: "Inskickad profil hittades inte" }, 404, corsHeaders);
      if (sub.status !== "pending") return json({ error: "Inskicket är redan hanterat" }, 409, corsHeaders);
      const p = (sub.payload || {}) as Record<string, unknown>;
      const now = new Date().toISOString();
      // Leverantörens källa blir "mixed" när den kompletterar redaktionens research.
      const mergedSource = (cur: string | null | undefined) => (cur === "vendor_submitted" ? "vendor_submitted" : "mixed");

      if (sub.kind === "vendor_profile") {
        // Bara leverantörsnivån ändras. Produkternas status påverkas inte.
        const { data: v } = await supabase.from("isv_vendors").select("profile_source").eq("slug", sub.vendor_slug).single();
        const upd: Record<string, unknown> = { updated_at: now, profile_source: mergedSource(v?.profile_source) };
        if (typeof p.website === "string" && p.website) upd.website = p.website;
        if (typeof p.description === "string" && p.description) upd.description = p.description;
        if (typeof p.logo_url === "string" && p.logo_url) upd.logo_url = p.logo_url;
        if (sub.confirm_information) upd.confirmation_status = "confirmed";
        const { error } = await supabase.from("isv_vendors").update(upd).eq("slug", sub.vendor_slug);
        if (error) return json({ error: error.message }, 400, corsHeaders);
        if (sub.contact_name || sub.contact_email) {
          await supabase.from("isv_vendor_internal").upsert(
            { vendor_slug: sub.vendor_slug, contact_name: cleanText(sub.contact_name, 200), contact_email: cleanText(sub.contact_email, 200) },
            { onConflict: "vendor_slug" },
          );
        }
      } else if (sub.kind === "new_solution") {
        const { data: v } = await supabase.from("isv_vendors").select("name").eq("slug", sub.vendor_slug).single();
        const { error } = await supabase.from("isv_solutions").insert({
          solution_id: sub.solution_id,
          name: cleanText(p.name, 200) || sub.solution_id,
          vendor: v?.name || sub.vendor_slug,
          vendor_slug: sub.vendor_slug,
          category: cleanText(p.category, 100) || "Integration / iPaaS",
          type: "BC-native (ISV)",
          tier: "Tier 2",
          delivery_model: typeof p.delivery_model === "string" ? p.delivery_model : "native_isv",
          geo: Array.isArray(p.geo) ? p.geo : [],
          short_description: cleanText(sub.short_description, 400),
          what: cleanText(sub.what),
          when_fits: cleanText(sub.when_fits),
          use_cases: cleanList(sub.use_cases),
          combos: cleanList(sub.combos),
          products: cleanList(sub.products, 12, 100),
          industry_focus: cleanList(sub.industries, 25, 100),
          partner_slugs: cleanList(sub.partner_slugs, 100, 120),
          vendor_website: cleanText(sub.vendor_website, 300),
          product_source: "vendor_submitted",
          confirmation_status: sub.confirm_information ? "confirmed" : "not_confirmed",
          // Publiceras bara om leverantören bad om det och redaktionen godkänner här.
          is_published: sub.request_publication === true,
        });
        if (error) return json({ error: error.message }, 400, corsHeaders);
      } else {
        const payload = {
          solution_id: sub.solution_id,
          short_description: cleanText(sub.short_description, 400),
          what: cleanText(sub.what),
          when_fits: cleanText(sub.when_fits),
          use_cases: cleanList(sub.use_cases),
          combos: cleanList(sub.combos),
          products: cleanList(sub.products, 12, 100),
          industries: cleanList(sub.industries, 25, 100),
          partner_slugs: cleanList(sub.partner_slugs, 100, 120),
          vendor_website: cleanText(sub.vendor_website, 300),
          vendor_contact_name: cleanText(sub.contact_name, 200),
          vendor_contact_email: cleanText(sub.contact_email, 200),
          vendor_updated_at: now,
          updated_at: now,
        };
        const { error: upErr } = await supabase
          .from("isv_solution_overrides")
          .upsert(payload, { onConflict: "solution_id" });
        if (upErr) return json({ error: upErr.message }, 400, corsHeaders);

        // Produktnivån: källa, bekräftelse och strukturerade fält. Leverantören påverkas inte.
        const { data: cur } = await supabase.from("isv_solutions").select("product_source").eq("solution_id", sub.solution_id).maybeSingle();
        if (cur) {
          const upd: Record<string, unknown> = { product_source: mergedSource(cur.product_source), updated_at: now };
          if (sub.confirm_information) upd.confirmation_status = "confirmed";
          if (typeof p.delivery_model === "string") upd.delivery_model = p.delivery_model;
          if (Array.isArray(p.geo) && p.geo.length) upd.geo = p.geo;
          await supabase.from("isv_solutions").update(upd).eq("solution_id", sub.solution_id);
        }
      }

      await supabase.from("isv_submissions")
        .update({ status: "approved", reviewed_at: now })
        .eq("id", submission_id);
      await supabase.from("isv_invitations")
        .update({ status: "approved", reviewed_at: now })
        .eq("id", sub.invitation_id);

      return json({ success: true }, 200, corsHeaders);
    }

    if (action === "reject" && req.method === "POST") {
      const body = await req.json();
      const submission_id = cleanText(body?.submission_id, 100);
      if (!submission_id) return json({ error: "submission_id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("isv_submissions")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", submission_id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e) {
    console.error("manage-isv-invitations error", e);
    return json({ error: "Internal error" }, 500, corsHeaders);
  }
});
