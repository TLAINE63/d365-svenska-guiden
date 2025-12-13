import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnerClickRequest {
  partnerName: string;
  partnerWebsite: string;
  pageSource?: string;
  userAgent?: string;
  referrer?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { partnerName, partnerWebsite, pageSource, userAgent, referrer }: PartnerClickRequest = await req.json();

    console.log(`Partner click tracked: ${partnerName} from ${pageSource}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert click record into database
    const { data: clickData, error: insertError } = await supabase
      .from("partner_clicks")
      .insert({
        partner_name: partnerName,
        partner_website: partnerWebsite,
        page_source: pageSource,
        user_agent: userAgent,
        referrer: referrer,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting click:", insertError);
      throw insertError;
    }

    console.log("Click recorded successfully:", clickData);

    // Send email notification
    const now = new Date();
    const formattedDate = now.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

    const emailResponse = await resend.emails.send({
      from: "Dynamic Factory <onboarding@resend.dev>",
      to: ["thomas.laine@dynamicfactory.se"],
      reply_to: "thomas.laine@dynamicfactory.se",
      subject: `Partnerklick: ${partnerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0078d4;">Ny partnerklick registrerad</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Partner:</strong> ${partnerName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Hemsida:</strong> <a href="${partnerWebsite}">${partnerWebsite}</a></p>
            <p style="margin: 0 0 10px 0;"><strong>Sida:</strong> ${pageSource || "Okänd"}</p>
            <p style="margin: 0;"><strong>Tidpunkt:</strong> ${formattedDate}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Detta email skickades automatiskt från d365-svenska-guiden.lovable.app
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, clickId: clickData.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in track-partner-click function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
