import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD") || "d365admin2024";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnerData {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  website: string;
  email?: string;
  phone?: string;
  address?: string;
  applications?: string[];
  industries?: string[];
  is_featured?: boolean;
}

interface RequestBody {
  action: "create" | "update" | "delete";
  partner?: PartnerData;
  id?: string;
  password: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { action, partner, id, password } = body;

    // Validate password
    if (password !== ADMIN_PASSWORD) {
      console.log("Invalid password attempt");
      return new Response(
        JSON.stringify({ error: "Ogiltigt lösenord" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case "create": {
        if (!partner || !partner.name || !partner.website || !partner.slug) {
          return new Response(
            JSON.stringify({ error: "Namn, slug och hemsida krävs" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { data, error } = await supabase
          .from("partners")
          .insert({
            slug: partner.slug.toLowerCase().trim(),
            name: partner.name.trim(),
            description: partner.description?.trim() || null,
            logo_url: partner.logo_url?.trim() || null,
            website: partner.website.trim(),
            email: partner.email?.trim() || null,
            phone: partner.phone?.trim() || null,
            address: partner.address?.trim() || null,
            applications: partner.applications || [],
            industries: partner.industries || [],
            is_featured: partner.is_featured || false,
          })
          .select()
          .single();

        if (error) {
          console.error("Create error:", error);
          if (error.code === "23505") {
            return new Response(
              JSON.stringify({ error: "En partner med denna slug finns redan" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          throw error;
        }

        console.log("Partner created:", data.name);
        return new Response(
          JSON.stringify({ success: true, partner: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "update": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Partner-ID krävs för uppdatering" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const updateData: Record<string, unknown> = {};
        if (partner?.slug) updateData.slug = partner.slug.toLowerCase().trim();
        if (partner?.name) updateData.name = partner.name.trim();
        if (partner?.description !== undefined) updateData.description = partner.description?.trim() || null;
        if (partner?.logo_url !== undefined) updateData.logo_url = partner.logo_url?.trim() || null;
        if (partner?.website) updateData.website = partner.website.trim();
        if (partner?.email !== undefined) updateData.email = partner.email?.trim() || null;
        if (partner?.phone !== undefined) updateData.phone = partner.phone?.trim() || null;
        if (partner?.address !== undefined) updateData.address = partner.address?.trim() || null;
        if (partner?.applications !== undefined) updateData.applications = partner.applications;
        if (partner?.industries !== undefined) updateData.industries = partner.industries;
        if (partner?.is_featured !== undefined) updateData.is_featured = partner.is_featured;

        const { data, error } = await supabase
          .from("partners")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        console.log("Partner updated:", data.name);
        return new Response(
          JSON.stringify({ success: true, partner: data }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "delete": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Partner-ID krävs för borttagning" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { error } = await supabase
          .from("partners")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Delete error:", error);
          throw error;
        }

        console.log("Partner deleted:", id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Ogiltig action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in manage-partners:", error);
    const message = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
