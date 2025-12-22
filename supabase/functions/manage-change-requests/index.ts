import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, id, password, adminNotes } = await req.json();

    // Validate password
    const adminPassword = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(
        JSON.stringify({ error: "Felaktigt lösenord" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "list": {
        console.log("Fetching change requests...");
        
        const { data: requests, error } = await supabase
          .from("partner_change_requests")
          .select(`
            *,
            partner:partners(name, slug)
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching requests:", error);
          throw error;
        }

        console.log(`Found ${requests?.length || 0} change requests`);
        return new Response(
          JSON.stringify({ requests }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "approve": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID krävs" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Approving change request ${id}...`);

        // Get the change request
        const { data: request, error: fetchError } = await supabase
          .from("partner_change_requests")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError || !request) {
          console.error("Error fetching request:", fetchError);
          throw new Error("Ändringsförfrågan hittades inte");
        }

        const changes = request.changes as Record<string, any>;

        // Update the partner with the changes
        const { error: updatePartnerError } = await supabase
          .from("partners")
          .update({
            description: changes.description || null,
            logo_url: changes.logo_url || null,
            website: changes.website,
            email: changes.email || null,
            phone: changes.phone || null,
            address: changes.address || null,
            applications: changes.applications || [],
            industries: changes.industries || [],
            updated_at: new Date().toISOString(),
          })
          .eq("id", request.partner_id);

        if (updatePartnerError) {
          console.error("Error updating partner:", updatePartnerError);
          throw updatePartnerError;
        }

        // Update the change request status
        const { error: updateRequestError } = await supabase
          .from("partner_change_requests")
          .update({
            status: "approved",
            admin_notes: adminNotes || null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: "admin",
          })
          .eq("id", id);

        if (updateRequestError) {
          console.error("Error updating request:", updateRequestError);
          throw updateRequestError;
        }

        console.log(`Change request ${id} approved successfully`);
        return new Response(
          JSON.stringify({ success: true, message: "Ändringar godkända och tillämpade" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reject": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID krävs" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Rejecting change request ${id}...`);

        const { error } = await supabase
          .from("partner_change_requests")
          .update({
            status: "rejected",
            admin_notes: adminNotes || null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: "admin",
          })
          .eq("id", id);

        if (error) {
          console.error("Error rejecting request:", error);
          throw error;
        }

        console.log(`Change request ${id} rejected`);
        return new Response(
          JSON.stringify({ success: true, message: "Ändringsförfrågan avvisad" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Ogiltig åtgärd" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: any) {
    console.error("Error in manage-change-requests:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Ett fel uppstod" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
