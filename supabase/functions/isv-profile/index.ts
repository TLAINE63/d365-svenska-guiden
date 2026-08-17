// Publik (token-skyddad) funktion där ISV-leverantörer beskriver sin lösning.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { getCorsHeaders, json, cleanText, cleanList } from "../_shared/isvAuth.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const token = (url.searchParams.get("token") || "").trim().slice(0, 100);
    if (!token || !/^[a-f0-9]{16,64}$/.test(token)) {
      return json({ error: "Ogiltig länk" }, 400, corsHeaders);
    }

    const { data: invitation } = await supabase
      .from("isv_invitations")
      .select("id, solution_id, solution_name, vendor_name, email, status, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (!invitation) return json({ error: "Länken är ogiltig" }, 404, corsHeaders);
    if (new Date(invitation.expires_at) < new Date()) {
      return json({ error: "Länken har gått ut. Kontakta d365.se för en ny." }, 410, corsHeaders);
    }

    if (req.method === "GET") {
      const { data: override } = await supabase
        .from("isv_solution_overrides")
        .select("*")
        .eq("solution_id", invitation.solution_id)
        .maybeSingle();
      const { data: submission } = await supabase
        .from("isv_submissions")
        .select("*")
        .eq("invitation_id", invitation.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return json({ invitation, override: override || null, submission: submission || null }, 200, corsHeaders);
    }

    if (req.method === "POST") {
      const body = await req.json();
      // Honeypot mot bottar
      if (cleanText(body?.company_website_hp, 200)) {
        return json({ success: true }, 200, corsHeaders);
      }

      const payload = {
        invitation_id: invitation.id,
        solution_id: invitation.solution_id,
        short_description: cleanText(body?.short_description, 400),
        what: cleanText(body?.what, 4000),
        when_fits: cleanText(body?.when_fits, 4000),
        use_cases: cleanList(body?.use_cases, 12, 300),
        combos: cleanList(body?.combos, 12, 300),
        products: cleanList(body?.products, 12, 100),
        industries: cleanList(body?.industries, 25, 100),
        partner_slugs: cleanList(body?.partner_slugs, 100, 120),
        vendor_website: cleanText(body?.vendor_website, 300),
        contact_name: cleanText(body?.contact_name, 200),
        contact_email: cleanText(body?.contact_email, 200),
        notes: cleanText(body?.notes, 2000),
        status: "pending",
        submitted_at: new Date().toISOString(),
      };

      if (!payload.short_description && !payload.what) {
        return json({ error: "Fyll i minst en kort beskrivning" }, 400, corsHeaders);
      }
      if (!payload.products.length) {
        return json({ error: "Välj minst en Dynamics 365-produkt" }, 400, corsHeaders);
      }

      const { error } = await supabase.from("isv_submissions").insert(payload);
      if (error) return json({ error: error.message }, 400, corsHeaders);

      await supabase.from("isv_invitations")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", invitation.id);

      return json({ success: true }, 200, corsHeaders);
    }

    return json({ error: "Method not allowed" }, 405, corsHeaders);
  } catch (e) {
    console.error("isv-profile error", e);
    return json({ error: "Internal error" }, 500, corsHeaders);
  }
});
