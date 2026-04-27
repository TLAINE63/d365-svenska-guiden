import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://www.d365.se",
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

/**
 * Splits an email field into a list of addresses.
 * Accepts ";" or "," as separators so admins can mail multiple
 * contacts at the same partner in one send (both visible in To:).
 */
function parseRecipients(input: string | null | undefined): string[] {
  if (!input) return [];
  return String(input)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
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
          .select(`
            id, slug, name, description, logo_url, logo_dark_bg,
            website, email, phone, contact_person, address,
            applications, industries, secondary_industries,
            geography, product_filters, industry_apps,
            is_featured, office_cities, map_url, customer_examples,
            created_at, updated_at
          `)
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
          contact_photo_url: submissionData.contact_photo_url,
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
        contact_photo_url: submissionData.contact_photo_url,
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
          const adminUrl = "https://www.d365.se/admin";
          
          await resend.emails.send({
            from: "D365 Guiden <info@d365.se>",
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

    // Admin: Get or create a permanent self-service link for a published partner
    // Re-uses an existing approved invitation token, or creates a new one with far-future expiry.
    if (action === "get-permanent-link" && req.method === "POST") {
      const body = await req.json();
      const { partner_id } = body;

      if (!partner_id) {
        return new Response(
          JSON.stringify({ error: "partner_id krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Look up partner
      const { data: partner, error: partnerErr } = await supabase
        .from("partners")
        .select("id, name, admin_contact_email, email")
        .eq("id", partner_id)
        .maybeSingle();

      if (partnerErr || !partner) {
        return new Response(
          JSON.stringify({ error: "Partnern hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Try to find an existing invitation tied to this partner (prefer approved/submitted)
      const { data: existing } = await supabase
        .from("partner_invitations")
        .select("id, token, status, expires_at")
        .eq("partner_id", partner_id)
        .order("created_at", { ascending: false })
        .limit(1);

      const farFuture = new Date(Date.now() + 100 * 365 * 86400000).toISOString();

      let token: string;
      if (existing && existing.length > 0) {
        const inv = existing[0];
        token = inv.token;
        // Mark as approved + extend expiry to far future
        await supabase
          .from("partner_invitations")
          .update({ status: "approved", expires_at: farFuture })
          .eq("id", inv.id);
      } else {
        // Create a fresh approved invitation linked to this partner
        const inviteEmail = partner.admin_contact_email || partner.email || "noreply@d365.se";
        const { data: created, error: createErr } = await supabase
          .from("partner_invitations")
          .insert({
            email: inviteEmail,
            partner_name: partner.name,
            partner_id: partner_id,
            status: "approved",
            expires_at: farFuture,
          })
          .select("token")
          .single();

        if (createErr || !created) {
          console.error("Failed to create permanent invitation:", createErr);
          return new Response(
            JSON.stringify({ error: "Kunde inte skapa länk" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        token = created.token;
      }

      return new Response(
        JSON.stringify({ token }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      // Remove existing pending invitations for the same partner
      if (partner_id) {
        await supabase
          .from("partner_invitations")
          .delete()
          .eq("partner_id", partner_id)
          .eq("status", "pending");
        console.log("Removed existing pending invitations for partner:", partner_id);
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
            const baseUrl = "https://www.d365.se";
            const invitationLink = `${baseUrl}/partner-update/${invitation.token}`;
            
            // New invitations always use the welcome template
            const isNewPartner = true;
            const templateKey = "invitation_welcome_email_body";
            
            // Fetch email template from database
            let emailBody = "";
            const { data: setting } = await supabase
              .from("site_settings")
              .select("value")
              .eq("key", templateKey)
              .single();
            
            if (setting?.value) {
              emailBody = setting.value;
            } else if (isNewPartner) {
              emailBody = `Hej,

Välkommen till D365.se – Sveriges ledande oberoende guide för Microsoft Dynamics 365!

Vi hjälper svenska företag att hitta rätt Dynamics 365-partner, och vi vill gärna ha med er. Genom att skapa en partnerprofil på D365.se blir ni synliga för potentiella kunder som aktivt söker efter just den kompetens ni erbjuder.

Nedan följer en kort guide för hur ni bäst profilerar er verksamhet.


📋 SÅ HÄR FYLLER NI I ER PROFIL

1. Välj era Dynamics 365-applikationer
Ange vilka produkter ni implementerar och supportar, t.ex. Business Central, Sales, Customer Service, Field Service, Marketing (Customer Insights), Contact Center eller Project Operations. Detta är det viktigaste steget – era applikationsval styr hur ni matchas med potentiella kunder.

💡 Tips: Välj bara de produkter ni verkligen har kompetens och erfarenhet inom. Kvalitet slår kvantitet.

2. Definiera era branscher
Kunder filtrerar ofta på bransch, så detta är avgörande för er synlighet. Ni kan välja max 3 primära branscher per produktområde.

Primära branscher (max 3 per produkt): De branscher där ni har djupast erfarenhet, referenskunder och specialistkunskap. Dessa viktas högst i vår matchning.
Sekundära branscher: Branscher ni kan hantera men där ni inte har samma djup. Dessa ger bredare synlighet utan att urvattna era kärnkompetenser.

💡 Tips: Eftersom ni har max 3 primära branscher per produkt, välj de där ni verkligen utmärker er. Partners som fokuserar hamnar högre i matchningen.

3. Ange geografisk närvaro
Fyll i vilka städer ni har kontor och var ni är verksamma. Många kunder söker partners med lokal närvaro.

4. Skriv en säljande företagsbeskrivning
Er beskrivning syns direkt på partnerprofilen. Beskriv kort:
- Vad som gör er unika som Dynamics 365-partner
- Vilken typ av kunder ni är bäst lämpade för
- Eventuella specialiseringar, branschlösningar eller tilläggsmoduler

💡 Tips: Undvik generiska texter. Var specifika om vad som skiljer er från andra partners.

5. Beskriv er AI-kompetens
D365.se erbjuder en AI Business Impact Assessment där potentiella kunder kan utvärdera sin AI-mognad och matchas med partners som har rätt AI-kompetens. Er AI-profil påverkar direkt hur ni rankas i matchningen när kunder anger högt AI-intresse.

Ni kan ange:
- AI-kapabiliteter per produkt (t.ex. Copilot, Copilot Studio, Azure AI Foundry, AI-agenter)
- Antal genomförda AI-projekt
- En kort beskrivning av ett AI-case ni genomfört
- Vilken affärseffekt AI-implementationen gav kunden

💡 Tips: Partners med dokumenterad AI-kompetens premieras i matchningen. Även om ni bara har erfarenhet av Microsofts standard-AI (Copilot) är det värdefullt att ange det – det skiljer er från partners utan registrerad AI-kompetens.

6. Lägg till events
Ni kan marknadsföra era webinarier, workshops och demos direkt i profilformuläret. Events som fokuserar på Dynamics 365, AI, Copilot, agenter, BI eller Power Platform publiceras på D365.se efter godkännande. Ange titel, datum, tid och en länk till er anmälningssida.

💡 Tips: Events ökar er synlighet och visar potentiella kunder att ni är aktiva i ekosystemet.

7. Ladda upp er logotyp
En professionell logotyp ökar trovärdigheten avsevärt. Använd gärna en högupplöst version i PNG- eller JPG-format.

8. Ange kontaktuppgifter
Se till att potentiella kunder enkelt kan nå er. Ange kontaktperson, e-post och telefonnummer.


🔄 NI KAN ALLTID UPPDATERA

Er profil kan uppdateras när som helst via samma länk. Vi rekommenderar att ni ser över er profil minst en gång per kvartal för att hålla informationen aktuell.


{{INVITATION_LINK}}


Har du frågor? Svara gärna på detta mail eller kontakta oss på info@d365.se.

Vi ser fram emot att ha er som partner på D365.se!

Allt Gott!
Thomas Laine
Senior Rådgivare inom Microsoft CRM- och Affärssystem
D365.se`;
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
            
            const emailSubject = isNewPartner 
              ? "Välkommen till D365.se – Vilken Dynamics 365-partner passar kunden bäst?"
              : "Vem är kundens mest lämpade Dynamics 365-partner?";
            
            const emailResponse = await resend.emails.send({
              from: "D365 Guiden <info@d365.se>",
              to: parseRecipients(email),
              bcc: ["thomas.laine@dynamicfactory.se"],
              subject: emailSubject,
              html: fullHtml,
            });
            
            console.log("Invitation email sent to:", email, emailResponse);
            emailSent = true;
            await supabase.from("email_send_log").insert({
              recipient_email: email,
              template_name: "partner_welcome",
              subject: emailSubject,
              status: "sent",
              metadata: { partner_name: partner_name },
            });
          } catch (sendError: any) {
            console.error("Email send error:", sendError);
            emailError = sendError.message;
            const logTemplateName = "partner_welcome";
            await supabase.from("email_send_log").insert({
              recipient_email: email,
              template_name: logTemplateName,
              status: "failed",
              error_message: sendError.message,
              metadata: { partner_name: partner_name },
            });
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
      const templateKey = url.searchParams.get("template_key") || "invitation_email_body";
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value, updated_at")
        .eq("key", templateKey)
        .single();

      return new Response(
        JSON.stringify({ template: setting?.value || "", updated_at: setting?.updated_at }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Update email template
    if (action === "update-email-template" && req.method === "POST") {
      const body = await req.json();
      const { template, template_key } = body;
      const key = template_key || "invitation_email_body";

      if (typeof template !== "string") {
        return new Response(
          JSON.stringify({ error: "Malltext krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value: template, updated_at: new Date().toISOString() });

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
        .select("id, partner_id, partner_name, email, status, token, expires_at, created_at, submitted_at, reviewed_at, reviewed_by")
        .order("created_at", { ascending: false })
        .limit(500);

      const { data: submissions, error: subError } = await supabase
        .from("partner_submissions")
        .select("id, invitation_id, partner_id, name, email, website, contact_person, submitted_at")
        .order("submitted_at", { ascending: false })
        .limit(500);

      if (invError || subError) {
        console.error("List error:", invError, subError);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta data" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Manually join partner_name/email from invitations onto submissions
      const invMap = new Map((invitations || []).map((i: any) => [i.id, { partner_name: i.partner_name, email: i.email }]));
      const enrichedSubmissions = (submissions || []).map((s: any) => ({
        ...s,
        partner_invitations: invMap.get(s.invitation_id) || null,
      }));

      return new Response(
        JSON.stringify({ invitations, submissions: enrichedSubmissions }),
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

    // Admin: Delete invitation(s) - supports single id or bulk ids
    if (action === "delete" && req.method === "DELETE") {
      const invitationId = url.searchParams.get("id");
      const idsParam = url.searchParams.get("ids");
      
      const idsToDelete: string[] = [];
      if (idsParam) {
        idsToDelete.push(...idsParam.split(",").filter(Boolean));
      } else if (invitationId) {
        idsToDelete.push(invitationId);
      }

      if (idsToDelete.length === 0) {
        return new Response(
          JSON.stringify({ error: "ID krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("partner_invitations")
        .delete()
        .in("id", idsToDelete);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Kunde inte radera inbjudan" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, deleted: idsToDelete.length }),
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

      const baseUrl = "https://www.d365.se";
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
            from: "D365 Guiden <info@d365.se>",
            to: parseRecipients(inv.email),
            bcc: ["thomas.laine@dynamicfactory.se"],
            subject: `Påminnelse: Vilken Dynamics 365-partner passar kunden bäst?`,
            html: fullHtml,
          });

          sent++;
          console.log("Reminder sent to:", inv.email, inv.partner_name);
          await supabase.from("email_send_log").insert({
            recipient_email: inv.email,
            template_name: "partner_reminder",
            subject: "Påminnelse: Vilken Dynamics 365-partner passar kunden bäst?",
            status: "sent",
            metadata: { partner_name: inv.partner_name },
          });
        } catch (sendErr: any) {
          failed++;
          errors.push(`${inv.partner_name} (${inv.email}): ${sendErr.message}`);
          console.error("Reminder send error:", inv.email, sendErr);
          await supabase.from("email_send_log").insert({
            recipient_email: inv.email,
            template_name: "partner_reminder",
            subject: "Påminnelse: Vilken Dynamics 365-partner passar kunden bäst?",
            status: "failed",
            error_message: sendErr.message,
            metadata: { partner_name: inv.partner_name },
          });
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

    // Admin: Start a new update round
    if (action === "start-update-round" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const label = body.label || "";
      const roundDate = new Date().toISOString();

      const { error } = await supabase
        .from("site_settings")
        .upsert({ 
          key: "profile_update_round_date", 
          value: JSON.stringify({ date: roundDate, label }), 
          updated_at: roundDate 
        });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Kunde inte starta uppdateringsrunda" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, date: roundDate, label }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Get current update round
    if (action === "get-update-round" && req.method === "GET") {
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value, updated_at")
        .eq("key", "profile_update_round_date")
        .single();

      return new Response(
        JSON.stringify({ round: setting?.value ? JSON.parse(setting.value) : null }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Bulk create invitations for multiple partners
    if (action === "bulk-create" && req.method === "POST") {
      const body = await req.json();
      const { partners: partnerList, send_email } = body;

      if (!partnerList || !Array.isArray(partnerList) || partnerList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Partnerlista krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Remove existing pending invitations for these partners
      const partnerIds = partnerList.map((p: { id: string }) => p.id).filter(Boolean);
      if (partnerIds.length > 0) {
        await supabase
          .from("partner_invitations")
          .delete()
          .in("partner_id", partnerIds)
          .eq("status", "pending");
        console.log("Removed existing pending invitations for", partnerIds.length, "partners");
      }

      // Create invitations for all partners
      const invitations = partnerList.map((p: { id: string; name: string; email: string }) => ({
        email: p.email,
        partner_name: p.name,
        partner_id: p.id,
      }));

      const { data: createdInvitations, error: insertError } = await supabase
        .from("partner_invitations")
        .insert(invitations)
        .select();

      if (insertError) {
        console.error("Bulk create error:", insertError);
        return new Response(
          JSON.stringify({ error: "Kunde inte skapa inbjudningar" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      if (send_email && createdInvitations) {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          const baseUrl = "https://www.d365.se";

          // Fetch email template
          let emailBody = "";
          const { data: setting } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "invitation_email_body")
            .single();
          
          emailBody = setting?.value || "Hej,\n\nDu har blivit inbjuden att uppdatera din partnerprofil på D365.se.\n\n{{INVITATION_LINK}}\n\nAllt Gott!\nThomas Laine";

          for (const inv of createdInvitations) {
            try {
              const invitationLink = `${baseUrl}/partner-update/${inv.token}`;
              const invitationButton = `<div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Uppdatera partnerprofil</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
              <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>`;

              const htmlBody = emailBody
                .split("{{INVITATION_LINK}}")
                .map((part: string) => {
                  return part
                    .split("\n\n")
                    .map((paragraph: string) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return "";
                      const withBr = trimmed.replace(/\n/g, "<br>");
                      const withLinks = withBr.replace(/(https?:\/\/[^\s<,]+)/g, '<a href="$1" style="color: #2563eb;">$1</a>');
                      const withEmails = withLinks.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #2563eb;">$1</a>');
                      return `<p>${withEmails}</p>`;
                    })
                    .filter(Boolean)
                    .join("\n");
                })
                .join(invitationButton);

              const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">${htmlBody}</body></html>`;

              await resend.emails.send({
                from: "D365 Guiden <info@d365.se>",
                to: parseRecipients(inv.email),
                bcc: ["thomas.laine@dynamicfactory.se"],
                subject: "Vem är kundens mest lämpade Dynamics 365-partner?",
                html: fullHtml,
              });
              sent++;
              console.log("Bulk invitation sent to:", inv.email, inv.partner_name);
              await supabase.from("email_send_log").insert({
                recipient_email: inv.email,
                template_name: "partner_bulk_invitation",
                subject: "Vem är kundens mest lämpade Dynamics 365-partner?",
                status: "sent",
                metadata: { partner_name: inv.partner_name },
              });
            } catch (sendErr: any) {
              failed++;
              errors.push(`${inv.partner_name} (${inv.email}): ${sendErr.message}`);
              console.error("Bulk send error:", inv.email, sendErr);
              await supabase.from("email_send_log").insert({
                recipient_email: inv.email,
                template_name: "partner_bulk_invitation",
                subject: "Vem är kundens mest lämpade Dynamics 365-partner?",
                status: "failed",
                error_message: sendErr.message,
                metadata: { partner_name: inv.partner_name },
              });
            }
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          created: createdInvitations?.length || 0,
          sent,
          failed,
          errors: errors.length > 0 ? errors : undefined,
          message: send_email 
            ? `${createdInvitations?.length} inbjudningar skapade, ${sent} e-post skickade.${failed > 0 ? ` ${failed} misslyckades.` : ''}`
            : `${createdInvitations?.length} inbjudningar skapade (utan e-post).`
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Send agreement email to selected partners
    if (action === "send-agreement" && req.method === "POST") {
      const body = await req.json();
      const { partners: partnerList, deadline, start_date, subject: customSubject, email_body: customBody, cc } = body;

      if (!partnerList || !Array.isArray(partnerList) || partnerList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Partnerlista krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      const pdfUrl = `${supabaseUrl}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;
      const deadlineStr = deadline || "2026-04-30";
      const startDateStr = start_date || "2026-05-01";
      const emailSubject = customSubject || "Fortsätt vara synliga på d365.se från 1 maj";

      // Use custom body from request, or fetch from site_settings, or use default
      let emailBody = "";
      if (customBody) {
        emailBody = customBody;
      } else {
        const { data: setting } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "agreement_email_body")
          .single();
        emailBody = setting?.value || "Hej,\n\nVi vill gärna att ni fortsätter som partner på d365.se.\n\n{{PDF_LINK}}\n\nVänliga hälsningar\nThomas Laine & Michael Uhman";
      }

      // Build CC list
      const ccList: string[] = Array.isArray(cc) ? cc : (cc ? [cc] : []);

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const partner of partnerList) {
        try {
          const email = partner.email;
          if (!email) {
            errors.push(`${partner.name}: Ingen e-postadress`);
            failed++;
            continue;
          }

          // Replace placeholders
          let bodyText = emailBody
            .replace(/\{\{DEADLINE\}\}/g, deadlineStr)
            .replace(/\{\{START_DATE\}\}/g, startDateStr);

          // Build PDF link button
          const pdfButton = `<div style="text-align: center; margin: 20px 0;">
            <a href="${pdfUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">📄 Ladda ner partneravtal (PDF)</a>
          </div>`;

          // Convert plain text to HTML
          const htmlBody = bodyText
            .split("{{PDF_LINK}}")
            .map((part: string) => {
              return part
                .split("\n\n")
                .map((paragraph: string) => {
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
                  const withBold = withEmails.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                  return `<p>${withBold}</p>`;
                })
                .filter(Boolean)
                .join("\n");
            })
            .join(pdfButton);

          const fullHtml = `<!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
                <p style="color: #6b7280; margin: 5px 0 0 0;">Partneravtal</p>
              </div>
              ${htmlBody}
            </body>
            </html>`;

          const emailOptions: any = {
            from: "D365 Guiden <info@d365.se>",
            to: parseRecipients(email),
            subject: emailSubject,
            html: fullHtml,
          };
          if (ccList.length > 0) {
            emailOptions.cc = ccList;
          }

          await resend.emails.send(emailOptions);

          sent++;
          console.log("Agreement email sent to:", email, partner.name);
          await supabase.from("email_send_log").insert({
            recipient_email: email,
            template_name: "partner_agreement",
            subject: emailSubject,
            status: "sent",
            metadata: { partner_name: partner.name, deadline: deadlineStr, start_date: startDateStr, cc: ccList },
          });

          // Update partner activation_date if provided
          if (partner.id && startDateStr) {
            await supabase
              .from("partners")
              .update({ activation_date: startDateStr })
              .eq("id", partner.id);
          }
        } catch (sendErr: any) {
          failed++;
          errors.push(`${partner.name} (${partner.email}): ${sendErr.message}`);
          console.error("Agreement send error:", partner.email, sendErr);
          await supabase.from("email_send_log").insert({
            recipient_email: partner.email,
            template_name: "partner_agreement",
            subject: emailSubject,
            status: "failed",
            error_message: sendErr.message,
            metadata: { partner_name: partner.name },
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: partnerList.length,
          errors: errors.length > 0 ? errors : undefined,
          message: `Partneravtal skickat till ${sent} av ${partnerList.length} partners.${failed > 0 ? ` ${failed} misslyckades.` : ''}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Send sales pitch email to prospective partners
    // Admin: Send prospect agreement email (non-published partners with invitations)
    if (action === "send-prospect-agreement" && req.method === "POST") {
      const body = await req.json();
      const { partners: partnerList, subject: customSubject, email_body: customBody, cc } = body;

      if (!partnerList || !Array.isArray(partnerList) || partnerList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Partnerlista krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      const baseUrl = "https://www.d365.se";
      const pdfUrl = `${supabaseUrl}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;
      const emailSubject = customSubject || "Bli synlig på d365.se – Sveriges oberoende guide till Dynamics 365";
      const emailBody = customBody || "Hej,\n\nVi vill gärna ha med er som partner på d365.se.\n\n{{INVITATION_LINK}}\n\n{{PDF_LINK}}\n\nVänliga hälsningar\nThomas Laine & Michael Uhman";
      const ccList: string[] = Array.isArray(cc) ? cc : (cc ? [cc] : []);

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const partner of partnerList) {
        try {
          const email = partner.email;
          if (!email) {
            errors.push(`${partner.name}: Ingen e-postadress`);
            failed++;
            continue;
          }

          // Find or create invitation for this partner
          let invitationLink = baseUrl;
          
          // Check for existing invitation
          let query = supabase.from("partner_invitations").select("token").eq("email", email).order("created_at", { ascending: false }).limit(1);
          if (partner.id) {
            query = supabase.from("partner_invitations").select("token").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(1);
          }
          const { data: existingInv } = await query;
          
          if (existingInv && existingInv.length > 0) {
            invitationLink = `${baseUrl}/partner-update/${existingInv[0].token}`;
          } else {
            // Create new invitation
            const { data: newInv } = await supabase
              .from("partner_invitations")
              .insert({
                email,
                partner_name: partner.name,
                partner_id: partner.id || null,
              })
              .select()
              .single();
            if (newInv) {
              invitationLink = `${baseUrl}/partner-update/${newInv.token}`;
            }
          }

          // Build invitation link button
          const invitationButton = `<div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Skapa/uppdatera er partnerprofil</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk:</p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>`;

          // Build PDF link button
          const pdfButton = `<div style="text-align: center; margin: 20px 0;">
            <a href="${pdfUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">📄 Ladda ner partneravtal (PDF)</a>
          </div>`;

          // Convert plain text to HTML, handle both placeholders
          let bodyText = emailBody;
          
          const htmlBody = bodyText
            .split("{{INVITATION_LINK}}")
            .map((segment: string) => {
              return segment
                .split("{{PDF_LINK}}")
                .map((part: string) => {
                  return part
                    .split("\n\n")
                    .map((paragraph: string) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return "";
                      const withBr = trimmed.replace(/\n/g, "<br>");
                      const withLinks = withBr.replace(/(https?:\/\/[^\s<,]+)/g, '<a href="$1" style="color: #2563eb;">$1</a>');
                      const withEmails = withLinks.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #2563eb;">$1</a>');
                      const withBold = withEmails.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                      return `<p>${withBold}</p>`;
                    })
                    .filter(Boolean)
                    .join("\n");
                })
                .join(pdfButton);
            })
            .join(invitationButton);

          const fullHtml = `<!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
                <p style="color: #6b7280; margin: 5px 0 0 0;">Partnerprofilering</p>
              </div>
              ${htmlBody}
            </body>
            </html>`;

          const emailOptions: any = {
            from: "D365 Guiden <info@d365.se>",
            to: parseRecipients(email),
            subject: emailSubject,
            html: fullHtml,
          };
          if (ccList.length > 0) {
            emailOptions.cc = ccList;
          }

          await resend.emails.send(emailOptions);

          sent++;
          console.log("Prospect agreement email sent to:", email, partner.name);
          await supabase.from("email_send_log").insert({
            recipient_email: email,
            template_name: "partner_prospect_agreement",
            subject: emailSubject,
            status: "sent",
            metadata: { partner_name: partner.name, cc: ccList },
          });
        } catch (sendErr: any) {
          failed++;
          errors.push(`${partner.name} (${partner.email}): ${sendErr.message}`);
          console.error("Prospect agreement send error:", partner.email, sendErr);
          await supabase.from("email_send_log").insert({
            recipient_email: partner.email,
            template_name: "partner_prospect_agreement",
            subject: emailSubject,
            status: "failed",
            error_message: sendErr.message,
            metadata: { partner_name: partner.name },
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: partnerList.length,
          errors: errors.length > 0 ? errors : undefined,
          message: `Prospektmail skickat till ${sent} av ${partnerList.length} partners.${failed > 0 ? ` ${failed} misslyckades.` : ''}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Send cold pitch email to a single free-form recipient (no partner record needed)
    if (action === "send-cold-pitch" && req.method === "POST") {
      const body = await req.json();
      const { email, company_name, subject: customSubject, email_body: customBody, cc } = body;

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(
          JSON.stringify({ error: "Giltig e-postadress krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      const pdfUrl = `${supabaseUrl}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;
      const emailSubject = customSubject || "d365.se växer – vill ni också finnas med?";
      const emailBody = customBody || "";
      const ccList: string[] = Array.isArray(cc) ? cc : (cc ? [cc] : []);

      try {
        const pdfButton = `<div style="text-align: center; margin: 20px 0;">
          <a href="${pdfUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">📄 Ladda ner partneravtal (PDF)</a>
        </div>`;

        const htmlBody = emailBody
          .split("{{PDF_LINK}}")
          .map((part: string) => {
            return part
              .split("\n\n")
              .map((paragraph: string) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return "";
                const withBr = trimmed.replace(/\n/g, "<br>");
                const withLinks = withBr.replace(/(https?:\/\/[^\s<,]+)/g, '<a href="$1" style="color: #2563eb;">$1</a>');
                const withEmails = withLinks.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #2563eb;">$1</a>');
                const withBold = withEmails.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                return `<p>${withBold}</p>`;
              })
              .filter(Boolean)
              .join("\n");
          })
          .join(pdfButton);

        const fullHtml = `<!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Partnerprofilering</p>
            </div>
            ${htmlBody}
          </body>
          </html>`;

        const emailOptions: any = {
          from: "D365 Guiden <info@d365.se>",
          to: parseRecipients(email),
          subject: emailSubject,
          html: fullHtml,
        };
        if (ccList.length > 0) emailOptions.cc = ccList;

        await resend.emails.send(emailOptions);

        await supabase.from("email_send_log").insert({
          recipient_email: email,
          template_name: "partner_cold_pitch",
          subject: emailSubject,
          status: "sent",
          metadata: { company_name: company_name || null, cc: ccList },
        });

        return new Response(
          JSON.stringify({ success: true, message: `Införsäljningsmail skickat till ${email}.` }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (sendErr: any) {
        console.error("Cold pitch send error:", email, sendErr);
        await supabase.from("email_send_log").insert({
          recipient_email: email,
          template_name: "partner_cold_pitch",
          subject: emailSubject,
          status: "failed",
          error_message: sendErr.message,
          metadata: { company_name: company_name || null },
        });
        return new Response(
          JSON.stringify({ error: sendErr.message || "Kunde inte skicka mail" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Admin: Send "profile refresh" email — creates a fresh 90-day invitation per
    // partner and sends an editable email with subject/body overrides.
    if (action === "send-profile-refresh" && req.method === "POST") {
      const body = await req.json();
      const { partners: partnerList, subject: overrideSubject, body: overrideBody } = body;

      if (!partnerList || !Array.isArray(partnerList) || partnerList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Partnerlista krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      const baseUrl = "https://www.d365.se";

      // Resolve template body (override > saved > default)
      let emailBody = "";
      if (typeof overrideBody === "string" && overrideBody.trim().length > 0) {
        emailBody = overrideBody;
      } else {
        const { data: bodySetting } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "profile_refresh_email_body")
          .single();
        emailBody = bodySetting?.value || "";
      }

      // Resolve subject (override > saved > default)
      let emailSubject = "";
      if (typeof overrideSubject === "string" && overrideSubject.trim().length > 0) {
        emailSubject = overrideSubject;
      } else {
        const { data: subjectSetting } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "profile_refresh_email_subject")
          .single();
        emailSubject = subjectSetting?.value || "VIKTIGT! Uppdatera er partnerprofil på d365.se";
      }

      const ninetyDays = new Date(Date.now() + 90 * 86400000).toISOString();

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const partner of partnerList) {
        try {
          const email = partner.email;
          if (!email) {
            errors.push(`${partner.name}: Ingen e-postadress`);
            failed++;
            continue;
          }

          // Create a fresh invitation valid for 90 days
          const { data: invitation, error: invErr } = await supabase
            .from("partner_invitations")
            .insert({
              email,
              partner_name: partner.name,
              partner_id: partner.id || null,
              status: "approved",
              expires_at: ninetyDays,
            })
            .select()
            .single();

          if (invErr || !invitation) {
            throw new Error(invErr?.message || "Kunde inte skapa profileringslänk");
          }

          const invitationLink = `${baseUrl}/partner-update/${invitation.token}`;
          const contactName = partner.contact_name || partner.name || "";

          const personalizedBody = emailBody
            .replace(/\{\{NAME\}\}/g, contactName)
            .replace(/\[PROFILERINGSLÄNK\]/g, "{{INVITATION_LINK}}");
          const personalizedSubject = emailSubject.replace(/\{\{NAME\}\}/g, contactName);

          const invitationButton = `<div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Uppdatera er partnerprofil</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 8px;">Länken är giltig i 90 dagar.</p>`;

          const htmlBody = personalizedBody
            .split("{{INVITATION_LINK}}")
            .map((part: string) => {
              return part
                .split("\n\n")
                .map((paragraph: string) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return "";
                  const withBr = trimmed.replace(/\n/g, "<br>");
                  const withLinks = withBr.replace(/(https?:\/\/[^\s<,]+)/g, '<a href="$1" style="color: #2563eb;">$1</a>');
                  const withEmails = withLinks.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #2563eb;">$1</a>');
                  return `<p>${withEmails}</p>`;
                })
                .filter(Boolean)
                .join("\n");
            })
            .join(invitationButton);

          const fullHtml = `<!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
              </div>
              ${htmlBody}
            </body>
            </html>`;

          await resend.emails.send({
            from: "Thomas Laine <info@d365.se>",
            to: parseRecipients(email),
            replyTo: "thomas.laine@dynamicfactory.se",
            bcc: ["thomas.laine@dynamicfactory.se"],
            subject: personalizedSubject,
            html: fullHtml,
          });

          sent++;
          console.log("Profile refresh email sent to:", email, partner.name);
          await supabase.from("email_send_log").insert({
            recipient_email: email,
            template_name: "partner_profile_refresh",
            subject: personalizedSubject,
            status: "sent",
            metadata: { partner_name: partner.name, invitation_token: invitation.token, expires_at: ninetyDays },
          });
        } catch (sendErr: any) {
          failed++;
          errors.push(`${partner.name} (${partner.email}): ${sendErr.message}`);
          console.error("Profile refresh send error:", partner.email, sendErr);
          await supabase.from("email_send_log").insert({
            recipient_email: partner.email,
            template_name: "partner_profile_refresh",
            subject: emailSubject,
            status: "failed",
            error_message: sendErr.message,
            metadata: { partner_name: partner.name },
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: partnerList.length,
          errors: errors.length > 0 ? errors : undefined,
          message: `Profileringslänkmail skickat till ${sent} av ${partnerList.length} partners.${failed > 0 ? ` ${failed} misslyckades.` : ''}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "send-sales-pitch" && req.method === "POST") {
      const body = await req.json();
      const { partners: partnerList } = body;

      if (!partnerList || !Array.isArray(partnerList) || partnerList.length === 0) {
        return new Response(
          JSON.stringify({ error: "Partnerlista krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
      const baseUrl = "https://www.d365.se";

      // Fetch email template body
      let emailBody = "";
      const { data: bodySetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "sales_pitch_email_body")
        .single();

      emailBody = bodySetting?.value || `Hej {{NAME}},

Jag vill presentera d365.se – en oberoende köpguide för företag som utvärderar Microsoft Dynamics 365.

{{INVITATION_LINK}}

Med vänlig hälsning,

Thomas Laine & Michael Uhman
d365.se`;

      // Fetch subject
      let emailSubject = "";
      const { data: subjectSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "sales_pitch_email_subject")
        .single();

      emailSubject = subjectSetting?.value || "Prova d365.se kostnadsfritt – kvalificerade D365-leads direkt till er";

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const partner of partnerList) {
        try {
          const email = partner.email;
          if (!email) {
            errors.push(`${partner.name}: Ingen e-postadress`);
            failed++;
            continue;
          }

          // Create invitation for this partner
          if (partner.id) {
            await supabase
              .from("partner_invitations")
              .delete()
              .eq("partner_id", partner.id)
              .eq("status", "pending");
          }

          const { data: invitation } = await supabase
            .from("partner_invitations")
            .insert({
              email,
              partner_name: partner.name,
              partner_id: partner.id || null,
            })
            .select()
            .single();

          const invitationLink = invitation 
            ? `${baseUrl}/partner-update/${invitation.token}`
            : `${baseUrl}`;

          const contactName = partner.contact_name || partner.name;

          const personalizedBody = emailBody.replace(/\{\{NAME\}\}/g, contactName);
          const personalizedSubject = emailSubject.replace(/\{\{NAME\}\}/g, contactName);

          const invitationButton = `<div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Skapa er partnerprofil</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${invitationLink}</p>`;

          const htmlBody = personalizedBody
            .split("{{INVITATION_LINK}}")
            .map((part: string) => {
              return part
                .split("\n\n")
                .map((paragraph: string) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return "";
                  const withBr = trimmed.replace(/\n/g, "<br>");
                  const withLinks = withBr.replace(/(https?:\/\/[^\s<,]+)/g, '<a href="$1" style="color: #2563eb;">$1</a>');
                  const withEmails = withLinks.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #2563eb;">$1</a>');
                  return `<p>${withEmails}</p>`;
                })
                .filter(Boolean)
                .join("\n");
            })
            .join(invitationButton);

          const fullHtml = `<!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0;">D365.se</h1>
              </div>
              ${htmlBody}
            </body>
            </html>`;

          await resend.emails.send({
            from: "D365 Guiden <info@d365.se>",
            to: parseRecipients(email),
            bcc: ["thomas.laine@dynamicfactory.se"],
            subject: personalizedSubject,
            html: fullHtml,
          });

          sent++;
          console.log("Sales pitch email sent to:", email, partner.name);
          await supabase.from("email_send_log").insert({
            recipient_email: email,
            template_name: "partner_sales_pitch",
            subject: personalizedSubject,
            status: "sent",
            metadata: { partner_name: partner.name },
          });
        } catch (sendErr: any) {
          failed++;
          errors.push(`${partner.name} (${partner.email}): ${sendErr.message}`);
          console.error("Sales pitch send error:", partner.email, sendErr);
          await supabase.from("email_send_log").insert({
            recipient_email: partner.email,
            template_name: "partner_sales_pitch",
            subject: emailSubject,
            status: "failed",
            error_message: sendErr.message,
            metadata: { partner_name: partner.name },
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          sent,
          failed,
          total: partnerList.length,
          errors: errors.length > 0 ? errors : undefined,
          message: `Införsäljningsmail skickat till ${sent} av ${partnerList.length} partners.${failed > 0 ? ` ${failed} misslyckades.` : ''}`,
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
