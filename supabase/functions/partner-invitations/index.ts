import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

// JWT verification for admin operations
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes as unknown as BufferSource, encoder.encode(dataToVerify));

    if (!isValid) return { valid: false, error: "Invalid signature" };

    const payload = JSON.parse(atob(base64UrlToBase64(encodedPayload)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };

    return { valid: true };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

function base64UrlToBase64(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return base64;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = base64UrlToBase64(str);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Public actions (no auth required)
    if (action === "get-invitation") {
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: invitation, error } = await supabase
        .from("partner_invitations")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !invitation) {
        return new Response(
          JSON.stringify({ error: "Inbjudan hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if expired (only for pending invitations - approved ones stay open forever)
      if (new Date(invitation.expires_at) < new Date() && invitation.status === "pending") {
        return new Response(
          JSON.stringify({ error: "Inbjudan har gått ut" }),
          { status: 410, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Invitations are always open for re-editing - no status check blocking access
      // Partners can update their profile at any time using the same link

      // If this is for an existing partner, fetch their current data
      // For re-edits (submitted/approved), always fetch current partner data
      let existingData = null;
      if (invitation.partner_id) {
        const { data: partner } = await supabase
          .from("partners")
          .select("*")
          .eq("id", invitation.partner_id)
          .single();
        existingData = partner;
      } else if (invitation.status === "submitted" || invitation.status === "approved") {
        // For new partners that were already submitted, fetch from the latest submission
        const { data: latestSubmission } = await supabase
          .from("partner_submissions")
          .select("*")
          .eq("invitation_id", invitation.id)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .single();
        if (latestSubmission) {
          existingData = latestSubmission;
        }
      }

      return new Response(
        JSON.stringify({ invitation, existingData }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "submit") {
      const body = await req.json();
      const { token, submissionData } = body;

      if (!token || !submissionData) {
        return new Response(
          JSON.stringify({ error: "Token och formulärdata krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify invitation exists and is valid
      const { data: invitation, error: invError } = await supabase
        .from("partner_invitations")
        .select("*")
        .eq("token", token)
        .single();

      if (invError || !invitation) {
        return new Response(
          JSON.stringify({ error: "Inbjudan hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Only check expiry for pending invitations - approved ones stay open forever
      if (new Date(invitation.expires_at) < new Date() && invitation.status === "pending") {
        return new Response(
          JSON.stringify({ error: "Inbjudan har gått ut" }),
          { status: 410, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Allow re-submissions for open invitations (no status blocking)

      // Create submission
      const { error: subError } = await supabase
        .from("partner_submissions")
        .insert({
          invitation_id: invitation.id,
          partner_id: invitation.partner_id,
          name: submissionData.name,
          description: submissionData.description,
          website: submissionData.website,
          logo_url: submissionData.logo_url,
          contact_person: submissionData.contact_person,
          email: submissionData.email,
          phone: submissionData.phone,
          address: submissionData.address,
          applications: submissionData.applications || [],
          industries: submissionData.industries || [],
          secondary_industries: submissionData.secondary_industries || [],
          geography: submissionData.geography || [],
          product_filters: submissionData.product_filters || {},
          industry_apps: submissionData.industry_apps || [],
          office_cities: submissionData.office_cities || [],
          notes: submissionData.notes,
        });

      // Handle events if provided
      if (submissionData.events && Array.isArray(submissionData.events)) {
        const partnerId = invitation.partner_id;
        
        for (const event of submissionData.events) {
          if (event._deleted && event.id) {
            // Delete existing event
            await supabase
              .from("partner_events")
              .delete()
              .eq("id", event.id);
          } else if (event.id) {
            // Update existing event
            const { id, _deleted, ...eventData } = event;
            await supabase
              .from("partner_events")
              .update({
                ...eventData,
                updated_at: new Date().toISOString(),
              })
              .eq("id", id);
          } else if (event.title && event.event_date) {
            // Create new event
            const { _deleted, ...eventData } = event;
            await supabase
              .from("partner_events")
              .insert({
                ...eventData,
                partner_id: partnerId,
                invitation_token: token,
              });
          }
        }
      }

      if (subError) {
        console.error("Submission error:", subError);
        return new Response(
          JSON.stringify({ error: "Kunde inte spara formulärdata" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Auto-apply partner data immediately (no approval step)
      const partnerData = {
        name: submissionData.name,
        description: submissionData.description,
        website: submissionData.website,
        logo_url: submissionData.logo_url,
        contact_person: submissionData.contact_person,
        email: submissionData.email,
        phone: submissionData.phone,
        address: submissionData.address,
        applications: submissionData.applications || [],
        industries: submissionData.industries || [],
        secondary_industries: submissionData.secondary_industries || [],
        geography: submissionData.geography || [],
        product_filters: submissionData.product_filters || {},
        industry_apps: submissionData.industry_apps || [],
        office_cities: submissionData.office_cities || [],
        updated_at: new Date().toISOString(),
      };

      let partnerId = invitation.partner_id;

      if (partnerId) {
        // Update existing partner
        const { error: updateError } = await supabase
          .from("partners")
          .update(partnerData)
          .eq("id", partnerId);

        if (updateError) {
          console.error("Auto-update partner error:", updateError);
          // Don't fail the submission, just log the error
        }
      } else {
        // Create new partner
        const slug = submissionData.name.toLowerCase().replace(/[^a-z0-9åäöü]+/g, "-").replace(/-+$/, "");
        const { data: newPartner, error: createError } = await supabase
          .from("partners")
          .insert({ ...partnerData, slug, is_featured: false })
          .select()
          .single();

        if (createError) {
          console.error("Auto-create partner error:", createError);
        } else {
          partnerId = newPartner.id;
          // Link invitation to the new partner
          await supabase
            .from("partner_invitations")
            .update({ partner_id: partnerId })
            .eq("id", invitation.id);
        }
      }

      // Update invitation status to approved (auto-approved)
      await supabase
        .from("partner_invitations")
        .update({ 
          status: "approved", 
          submitted_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString(),
          reviewed_by: "auto"
        })
        .eq("id", invitation.id);

      console.log("Partner submission auto-applied for:", submissionData.name, "(partner_id:", partnerId, ")");

      // Send notification email to admin
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const isUpdate = !!invitation.partner_id;
          const adminUrl = "https://d365-svenska-guiden.lovable.app/admin";
          
          await resend.emails.send({
            from: "D365.se <info@d365.se>",
            to: ["info@d365.se", "thomas.laine@dynamicfactory.se"],
            subject: `Partner ${isUpdate ? "uppdaterad" : "skapad"}: ${submissionData.name}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
                  <p style="color: #6b7280; margin: 5px 0 0 0;">Admin-notifikation</p>
                </div>
                
                <h2 style="color: #059669;">Partnerprofil ${isUpdate ? "uppdaterad" : "skapad"}!</h2>
                <p>${submissionData.name} har ${isUpdate ? "uppdaterat sin profil" : "skapat en ny profil"} via sin inbjudningslänk. Ändringarna är redan publicerade.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>Partner:</strong> ${submissionData.name}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Kontaktperson:</strong> ${submissionData.contact_person || 'Ej angivet'}</p>
                  <p style="margin: 0 0 10px 0;"><strong>E-post:</strong> ${submissionData.email || invitation.email}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Webbplats:</strong> ${submissionData.website}</p>
                  <p style="margin: 0;"><strong>Produkter:</strong> ${(submissionData.applications || []).join(', ') || 'Ej angivet'}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${adminUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Visa i Admin</a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                  Detta är en automatisk notifikation från D365.se
                </p>
              </body>
              </html>
            `,
          });
          
          console.log("Admin notification email sent for:", submissionData.name);
        } catch (emailError) {
          console.error("Failed to send admin notification email:", emailError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "Tack! Din profil har uppdaterats." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin actions (require auth)
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Autentisering krävs" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const jwtToken = authHeader.replace("Bearer ", "");
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Serverfel" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const verification = await verifyJWT(jwtToken, JWT_SECRET);
    if (!verification.valid) {
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut" : "Ogiltig session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Create invitation
    if (action === "create" && req.method === "POST") {
      const body = await req.json();
      const { email, partner_name, partner_id, send_email } = body;

      if (!email || !partner_name) {
        return new Response(
          JSON.stringify({ error: "E-post och partnernamn krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: invitation, error } = await supabase
        .from("partner_invitations")
        .insert({
          email,
          partner_name,
          partner_id: partner_id || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Create invitation error:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte skapa inbjudan" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Invitation created for:", partner_name);

      // Send email if requested
      let emailSent = false;
      let emailError = null;
      
      if (send_email) {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          try {
            const resend = new Resend(resendApiKey);
            const baseUrl = "https://d365-svenska-guiden.lovable.app";
            const invitationLink = `${baseUrl}/partner-update/${invitation.token}`;
            
            // Fetch email template from database
            let emailBody = "";
            const { data: setting } = await supabase
              .from("site_settings")
              .select("value")
              .eq("key", "invitation_email_body")
              .single();
            
            if (setting?.value) {
              emailBody = setting.value;
            } else {
              emailBody = "Hej,\n\nDu har blivit inbjuden att uppdatera din partnerprofil på D365.se.\n\n{{INVITATION_LINK}}\n\nAllt Gott!\nThomas Laine";
            }
            
            // Replace placeholder with actual link
            const invitationButton = `<div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Uppdatera partnerprofil</a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
                  <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>`;
            
            // Convert plain text to HTML paragraphs, handling the invitation link placeholder
            const htmlBody = emailBody
              .split("{{INVITATION_LINK}}")
              .map(part => {
                return part
                  .split("\n\n")
                  .map(paragraph => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return "";
                    // Convert single line breaks to <br> within paragraphs
                    const withBr = trimmed.replace(/\n/g, "<br>");
                    // Auto-link URLs
                    const withLinks = withBr.replace(
                      /(https?:\/\/[^\s<,]+)/g,
                      '<a href="$1" style="color: #2563eb;">$1</a>'
                    );
                    // Auto-link email addresses
                    const withEmails = withLinks.replace(
                      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                      '<a href="mailto:$1" style="color: #2563eb;">$1</a>'
                    );
                    return `<p>${withEmails}</p>`;
                  })
                  .filter(Boolean)
                  .join("\n");
              })
              .join(invitationButton);
            
            const fullHtml = `<!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  ${htmlBody}
                </body>
                </html>`;
            
            const emailResponse = await resend.emails.send({
              from: "D365.se <info@d365.se>",
              to: [email],
              subject: `Vem är kundens mest lämpade Dynamics 365-partner?`,
              html: fullHtml,
            });
            
            console.log("Invitation email sent to:", email, emailResponse);
            emailSent = true;
          } catch (sendError: any) {
            console.error("Email send error:", sendError);
            emailError = sendError.message;
          }
        } else {
          emailError = "RESEND_API_KEY ej konfigurerad";
          console.error("RESEND_API_KEY not configured");
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          invitation,
          emailSent,
          emailError
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Get email template
    if (action === "get-email-template" && req.method === "GET") {
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value, updated_at")
        .eq("key", "invitation_email_body")
        .single();

      return new Response(
        JSON.stringify({ template: setting?.value || "", updated_at: setting?.updated_at }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Update email template
    if (action === "update-email-template" && req.method === "POST") {
      const body = await req.json();
      const { template } = body;

      if (typeof template !== "string") {
        return new Response(
          JSON.stringify({ error: "Malltext krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "invitation_email_body", value: template, updated_at: new Date().toISOString() });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Kunde inte spara mall" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: List invitations and submissions
    if (action === "list" && req.method === "GET") {
      const { data: invitations, error: invError } = await supabase
        .from("partner_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: submissions, error: subError } = await supabase
        .from("partner_submissions")
        .select("*, partner_invitations(partner_name, email)")
        .order("submitted_at", { ascending: false });

      if (invError || subError) {
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta data" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ invitations, submissions }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Approve submission
    if (action === "approve" && req.method === "POST") {
      const body = await req.json();
      const { submission_id } = body;

      if (!submission_id) {
        return new Response(
          JSON.stringify({ error: "Submission ID krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Get submission
      const { data: submission, error: getError } = await supabase
        .from("partner_submissions")
        .select("*, partner_invitations(*)")
        .eq("id", submission_id)
        .single();

      if (getError || !submission) {
        return new Response(
          JSON.stringify({ error: "Inskickning hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update or create partner
      const partnerData = {
        name: submission.name,
        description: submission.description,
        website: submission.website,
        logo_url: submission.logo_url,
        contact_person: submission.contact_person,
        email: submission.email,
        phone: submission.phone,
        address: submission.address,
        applications: submission.applications,
        industries: submission.industries,
        secondary_industries: submission.secondary_industries,
        geography: submission.geography,
        product_filters: submission.product_filters,
        industry_apps: submission.industry_apps || [],
        office_cities: submission.office_cities || [],
        updated_at: new Date().toISOString(),
      };

      let partnerId = submission.partner_id;

      if (partnerId) {
        // Update existing partner
        const { error: updateError } = await supabase
          .from("partners")
          .update(partnerData)
          .eq("id", partnerId);

        if (updateError) {
          console.error("Update partner error:", updateError);
          return new Response(
            JSON.stringify({ error: "Kunde inte uppdatera partner" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } else {
        // Create new partner
        const slug = submission.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
        const { data: newPartner, error: createError } = await supabase
          .from("partners")
          .insert({ ...partnerData, slug, is_featured: false })
          .select()
          .single();

        if (createError) {
          console.error("Create partner error:", createError);
          return new Response(
            JSON.stringify({ error: "Kunde inte skapa partner" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        partnerId = newPartner.id;
      }

      // Update invitation status
      await supabase
        .from("partner_invitations")
        .update({ 
          status: "approved", 
          reviewed_at: new Date().toISOString(),
          reviewed_by: "admin"
        })
        .eq("id", submission.invitation_id);

      console.log("Submission approved for:", submission.name);

      return new Response(
        JSON.stringify({ success: true, partner_id: partnerId }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Delete invitation
    if (action === "delete" && req.method === "DELETE") {
      const invitationId = url.searchParams.get("id");
      
      if (!invitationId) {
        return new Response(
          JSON.stringify({ error: "ID krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("partner_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Kunde inte radera inbjudan" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Send reminders to selected pending invitations
    if (action === "send-reminders" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const invitationIds: string[] | undefined = body.invitation_ids;

      // Get pending invitations (not expired), optionally filtered by IDs
      let query = supabase
        .from("partner_invitations")
        .select("*")
        .eq("status", "pending")
        .gte("expires_at", new Date().toISOString());

      if (invitationIds && invitationIds.length > 0) {
        query = query.in("id", invitationIds);
      }

      const { data: pendingInvitations, error: pendErr } = await query;

      if (pendErr) {
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta inbjudningar" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!pendingInvitations || pendingInvitations.length === 0) {
        return new Response(
          JSON.stringify({ success: true, sent: 0, message: "Inga väntande inbjudningar att påminna." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        return new Response(
          JSON.stringify({ error: "RESEND_API_KEY ej konfigurerad" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const resend = new Resend(resendApiKey);

      // Fetch email template
      let emailBody = "";
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "invitation_email_body")
        .single();
      
      if (setting?.value) {
        emailBody = setting.value;
      } else {
        emailBody = "Hej,\n\nDu har blivit inbjuden att uppdatera din partnerprofil på D365.se.\n\n{{INVITATION_LINK}}\n\nAllt Gott!\nThomas Laine";
      }

      const baseUrl = "https://d365-svenska-guiden.lovable.app";
      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const inv of pendingInvitations) {
        try {
          const invitationLink = `${baseUrl}/partner-update/${inv.token}`;

          const invitationButton = `<div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Uppdatera partnerprofil</a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
                  <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>`;

          const htmlBody = emailBody
            .split("{{INVITATION_LINK}}")
            .map(part => {
              return part
                .split("\n\n")
                .map(paragraph => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return "";
                  const withBr = trimmed.replace(/\n/g, "<br>");
                  const withLinks = withBr.replace(
                    /(https?:\/\/[^\s<,]+)/g,
                    '<a href="$1" style="color: #2563eb;">$1</a>'
                  );
                  const withEmails = withLinks.replace(
                    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                    '<a href="mailto:$1" style="color: #2563eb;">$1</a>'
                  );
                  return `<p>${withEmails}</p>`;
                })
                .filter(Boolean)
                .join("\n");
            })
            .join(invitationButton);

          const fullHtml = `<!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                ${htmlBody}
              </body>
              </html>`;

          await resend.emails.send({
            from: "D365.se <info@d365.se>",
            to: [inv.email],
            subject: `Påminnelse: Vem är kundens mest lämpade Dynamics 365-partner?`,
            html: fullHtml,
          });

          sent++;
          console.log("Reminder sent to:", inv.email, inv.partner_name);
        } catch (sendErr: any) {
          failed++;
          errors.push(`${inv.partner_name} (${inv.email}): ${sendErr.message}`);
          console.error("Reminder send error:", inv.email, sendErr);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          sent, 
          failed, 
          total: pendingInvitations.length,
          errors: errors.length > 0 ? errors : undefined,
          message: `Påminnelse skickad till ${sent} av ${pendingInvitations.length} partners.${failed > 0 ? ` ${failed} misslyckades.` : ''}`
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ogiltig åtgärd" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in partner-invitations:", error);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod" }),
      { status: 500, headers: { "Content-Type": "application/json", ...getCorsHeaders(req) } }
    );
  }
});
