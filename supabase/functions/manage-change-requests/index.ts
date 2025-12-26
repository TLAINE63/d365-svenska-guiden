import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Rate limiting for brute-force protection
const adminRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const ADMIN_RATE_LIMIT = 5; // Max attempts per window
const ADMIN_RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isAdminRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = adminRateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    adminRateLimitMap.set(ip, { count: 1, resetTime: now + ADMIN_RATE_WINDOW_MS });
    return false;
  }
  
  if (record.count >= ADMIN_RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@dynamicfactory.se";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured, skipping email");
    return;
  }
  
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dynamic Factory <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      return;
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw - email failure shouldn't block the main operation
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, id, password, adminNotes, partnerName, requesterEmail, requesterName } = await req.json();

    // Rate limiting check for admin actions (not for notify-new which is public)
    if (action !== "notify-new") {
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      
      if (isAdminRateLimited(clientIp)) {
        console.log(`Rate limited IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: "För många inloggningsförsök. Försök igen om 5 minuter." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate password for admin actions
    const adminPassword = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    
    // Allow "notify-new" action without password (called from frontend after insert)
    if (action !== "notify-new") {
      if (!adminPassword) {
        console.error("PARTNER_ADMIN_PASSWORD environment variable is not configured");
        return new Response(
          JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (password !== adminPassword) {
        const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        console.log(`Invalid password attempt from IP: ${clientIp}`);
        return new Response(
          JSON.stringify({ error: "Felaktigt lösenord" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case "notify-new": {
        // Send email notification to admin about new change request
        console.log(`Sending notification for new change request from ${requesterName} for ${partnerName}`);
        
        await sendEmail(
          ADMIN_EMAIL,
          `Ny ändringsförfrågan för ${partnerName}`,
          `
            <h2>Ny ändringsförfrågan</h2>
            <p>En ny ändringsförfrågan har skickats in för partnern <strong>${partnerName}</strong>.</p>
            <p><strong>Inskickad av:</strong> ${requesterName} (${requesterEmail})</p>
            <p>Logga in på admin-panelen för att granska och godkänna eller avvisa förfrågan.</p>
          `
        );

        return new Response(
          JSON.stringify({ success: true, message: "Notifiering skickad" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
          .select(`
            *,
            partner:partners(name)
          `)
          .eq("id", id)
          .single();

        if (fetchError || !request) {
          console.error("Error fetching request:", fetchError);
          throw new Error("Ändringsförfrågan hittades inte");
        }

        const changes = request.changes as Record<string, any>;
        const partnerData = request.partner as { name: string } | null;

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

        // Send email notification to requester
        await sendEmail(
          request.requester_email,
          `Din ändringsförfrågan för ${partnerData?.name || 'partnern'} har godkänts`,
          `
            <h2>Ändringsförfrågan godkänd</h2>
            <p>Hej ${request.requester_name},</p>
            <p>Din ändringsförfrågan för <strong>${partnerData?.name || 'partnern'}</strong> har granskats och godkänts.</p>
            <p>Ändringarna är nu publicerade på webbplatsen.</p>
            ${adminNotes ? `<p><strong>Kommentar från admin:</strong> ${adminNotes}</p>` : ''}
            <p>Med vänliga hälsningar,<br>Dynamic Factory</p>
          `
        );

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

        // Get the change request first to send email
        const { data: request, error: fetchError } = await supabase
          .from("partner_change_requests")
          .select(`
            *,
            partner:partners(name)
          `)
          .eq("id", id)
          .single();

        if (fetchError || !request) {
          console.error("Error fetching request:", fetchError);
          throw new Error("Ändringsförfrågan hittades inte");
        }

        const partnerData = request.partner as { name: string } | null;

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

        // Send email notification to requester
        await sendEmail(
          request.requester_email,
          `Din ändringsförfrågan för ${partnerData?.name || 'partnern'} har avvisats`,
          `
            <h2>Ändringsförfrågan avvisad</h2>
            <p>Hej ${request.requester_name},</p>
            <p>Din ändringsförfrågan för <strong>${partnerData?.name || 'partnern'}</strong> har granskats och avvisats.</p>
            ${adminNotes ? `<p><strong>Anledning:</strong> ${adminNotes}</p>` : '<p>Kontakta oss om du har frågor.</p>'}
            <p>Med vänliga hälsningar,<br>Dynamic Factory</p>
          `
        );

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
