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

    // Public: Get approved events for public page
    if (action === "public-events") {
      const { data: events, error } = await supabase
        .from("partner_events")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            slug,
            logo_url,
            logo_dark_bg
          )
        `)
        .eq("status", "approved")
        .gte("event_date", new Date().toISOString().split('T')[0])
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error fetching public events:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta events" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ events: events || [] }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Public: Get single event by ID
    if (action === "get-event") {
      const eventId = url.searchParams.get("eventId");
      if (!eventId) {
        return new Response(
          JSON.stringify({ error: "eventId krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: event, error } = await supabase
        .from("partner_events")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            slug,
            logo_url,
            logo_dark_bg,
            description
          )
        `)
        .eq("id", eventId)
        .eq("status", "approved")
        .single();

      if (error || !event) {
        return new Response(
          JSON.stringify({ error: "Event hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ event }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Public: Get events with recordings
    if (action === "recordings") {
      const { data: events, error } = await supabase
        .from("partner_events")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            slug,
            logo_url,
            logo_dark_bg
          )
        `)
        .eq("status", "approved")
        .eq("recording_available", true)
        .not("recording_url", "is", null)
        .order("event_date", { ascending: false });

      if (error) {
        console.error("Error fetching recordings:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta inspelningar" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ events: events || [] }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Partner token-based access: Validate token and get partner events
    if (action === "get-partner-events") {
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify token
      const { data: tokenData, error: tokenError } = await supabase
        .from("partner_event_tokens")
        .select("*, partners:partner_id (*)")
        .eq("token", token)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: "Ogiltig länk" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if partner is featured
      if (!tokenData.partners?.is_featured) {
        return new Response(
          JSON.stringify({ error: "Endast utvalda partners har tillgång till event-portalen" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update last accessed
      await supabase
        .from("partner_event_tokens")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("id", tokenData.id);

      // Get partner's events
      const { data: events, error: eventsError } = await supabase
        .from("partner_events")
        .select("*")
        .eq("partner_id", tokenData.partner_id)
        .order("event_date", { ascending: false });

      if (eventsError) {
        console.error("Error fetching partner events:", eventsError);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta events" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          partner: tokenData.partners,
          events: events || [] 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Partner: Create or update event
    if (action === "save-event" && req.method === "POST") {
      const body = await req.json();
      const { token, event } = body;

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify token
      const { data: tokenData, error: tokenError } = await supabase
        .from("partner_event_tokens")
        .select("*, partners:partner_id (*)")
        .eq("token", token)
        .single();

      if (tokenError || !tokenData || !tokenData.partners?.is_featured) {
        return new Response(
          JSON.stringify({ error: "Ogiltig länk eller otillräckliga rättigheter" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const eventData = {
        partner_id: tokenData.partner_id,
        title: event.title,
        description: event.description || null,
        event_date: event.event_date,
        event_time: event.event_time || null,
        end_time: event.end_time || null,
        is_online: event.is_online ?? true,
        location: event.location || null,
        event_link: event.event_link || null,
        registration_link: event.registration_link || null,
        registration_deadline: event.registration_deadline || null,
        image_url: event.image_url || null,
        recording_url: event.recording_url || null,
        recording_available: event.recording_available ?? false,
        status: "pending", // Always require admin approval
      };

      let result;
      if (event.id) {
        // Update existing event
        const { data, error } = await supabase
          .from("partner_events")
          .update({ ...eventData, status: "pending", updated_at: new Date().toISOString() })
          .eq("id", event.id)
          .eq("partner_id", tokenData.partner_id) // Ensure partner owns this event
          .select()
          .single();

        if (error) {
          console.error("Error updating event:", error);
          return new Response(
            JSON.stringify({ error: "Kunde inte uppdatera event" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        result = data;
      } else {
        // Create new event
        const { data, error } = await supabase
          .from("partner_events")
          .insert(eventData)
          .select()
          .single();

        if (error) {
          console.error("Error creating event:", error);
          return new Response(
            JSON.stringify({ error: "Kunde inte skapa event" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        result = data;
      }

      // Send notification email to admin
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const adminUrl = "https://d365-svenska-guiden.lovable.app/admin";
          
          await resend.emails.send({
            from: "D365.se <info@d365.se>",
            to: ["info@d365.se", "thomas.laine@dynamicfactory.se"],
            subject: `Nytt event att granska: ${event.title} (${tokenData.partners.name})`,
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
                  <p style="color: #6b7280; margin: 5px 0 0 0;">Event-notifikation</p>
                </div>
                
                <h2 style="color: #7c3aed;">Nytt event väntar på godkännande</h2>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>Partner:</strong> ${tokenData.partners.name}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Eventtitel:</strong> ${event.title}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Datum:</strong> ${event.event_date}</p>
                  <p style="margin: 0;"><strong>Typ:</strong> ${event.is_online ? 'Online' : 'På plats'}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${adminUrl}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Granska i Admin</a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                  Detta är en automatisk notifikation från D365.se
                </p>
              </body>
              </html>
            `,
          });
          
          console.log("Admin notification sent for event:", event.title);
        } catch (emailError) {
          console.error("Failed to send admin notification:", emailError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, event: result }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Partner: Delete event
    if (action === "delete-event" && req.method === "DELETE") {
      const token = url.searchParams.get("token");
      const eventId = url.searchParams.get("eventId");

      if (!token || !eventId) {
        return new Response(
          JSON.stringify({ error: "Token och eventId krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Verify token
      const { data: tokenData, error: tokenError } = await supabase
        .from("partner_event_tokens")
        .select("partner_id")
        .eq("token", token)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: "Ogiltig länk" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("partner_events")
        .delete()
        .eq("id", eventId)
        .eq("partner_id", tokenData.partner_id);

      if (error) {
        console.error("Error deleting event:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte ta bort event" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin actions - require JWT verification
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

    // Admin: List all events (including pending)
    if (action === "list-all") {
      const { data: events, error } = await supabase
        .from("partner_events")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            slug,
            logo_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all events:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta events" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ events: events || [] }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Approve/Reject event
    if (action === "review" && req.method === "POST") {
      const body = await req.json();
      const { event_id, status, admin_notes } = body;

      if (!event_id || !["approved", "rejected"].includes(status)) {
        return new Response(
          JSON.stringify({ error: "event_id och giltig status krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Fetch event with partner info before updating
      const { data: eventData, error: eventFetchError } = await supabase
        .from("partner_events")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            email,
            contact_person
          )
        `)
        .eq("id", event_id)
        .single();

      if (eventFetchError || !eventData) {
        return new Response(
          JSON.stringify({ error: "Event hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { error } = await supabase
        .from("partner_events")
        .update({
          status,
          admin_notes: admin_notes || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: "admin",
        })
        .eq("id", event_id);

      if (error) {
        console.error("Error reviewing event:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte uppdatera event" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Send notification email to partner
      const partnerEmail = eventData.partners?.email;
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      
      if (partnerEmail && resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const isApproved = status === "approved";
          const eventUrl = isApproved 
            ? `https://d365-svenska-guiden.lovable.app/events/${event_id}`
            : null;
          
          await resend.emails.send({
            from: "D365.se <info@d365.se>",
            to: [partnerEmail],
            subject: isApproved 
              ? `Ditt event "${eventData.title}" har godkänts! 🎉`
              : `Ditt event "${eventData.title}" kunde inte godkännas`,
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
                  <p style="color: #6b7280; margin: 5px 0 0 0;">Event-notifikation</p>
                </div>
                
                <p>Hej${eventData.partners?.contact_person ? ` ${eventData.partners.contact_person}` : ''},</p>
                
                ${isApproved ? `
                  <p>Goda nyheter! Ditt event har godkänts och är nu publicerat på D365.se.</p>
                  
                  <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #166534; margin: 0 0 10px 0;">✅ Godkänt</h3>
                    <p style="margin: 0 0 10px 0;"><strong>Event:</strong> ${eventData.title}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Datum:</strong> ${eventData.event_date}</p>
                    <p style="margin: 0;"><strong>Typ:</strong> ${eventData.is_online ? 'Online' : 'På plats'}</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${eventUrl}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Se ditt event på D365.se</a>
                  </div>
                  
                  <p>Dela gärna länken med ditt nätverk för att maximera antalet anmälningar!</p>
                ` : `
                  <p>Tyvärr kunde vi inte godkänna ditt event i dess nuvarande form.</p>
                  
                  <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #991b1b; margin: 0 0 10px 0;">❌ Ej godkänt</h3>
                    <p style="margin: 0 0 10px 0;"><strong>Event:</strong> ${eventData.title}</p>
                    ${admin_notes ? `<p style="margin: 0;"><strong>Anledning:</strong> ${admin_notes}</p>` : ''}
                  </div>
                  
                  <p>Du är välkommen att uppdatera ditt event och skicka in det igen via din event-portal.</p>
                `}
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #6b7280; font-size: 14px;">
                  Med vänliga hälsningar,<br>
                  D365.se-teamet
                </p>
                
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
                  Detta är en automatisk notifikation från D365.se
                </p>
              </body>
              </html>
            `,
          });
          
          console.log("Partner notification sent for event:", eventData.title, "to:", partnerEmail);
        } catch (emailError) {
          console.error("Failed to send partner notification:", emailError);
          // Don't fail the request if email fails - the review was still successful
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: Create event token for a partner
    if (action === "create-token" && req.method === "POST") {
      const body = await req.json();
      const { partner_id } = body;

      if (!partner_id) {
        return new Response(
          JSON.stringify({ error: "partner_id krävs" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if partner is featured
      const { data: partner, error: partnerError } = await supabase
        .from("partners")
        .select("id, name, is_featured")
        .eq("id", partner_id)
        .single();

      if (partnerError || !partner) {
        return new Response(
          JSON.stringify({ error: "Partner hittades inte" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (!partner.is_featured) {
        return new Response(
          JSON.stringify({ error: "Endast utvalda partners kan få event-token" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Upsert token (create or return existing)
      const { data: token, error: tokenError } = await supabase
        .from("partner_event_tokens")
        .upsert({ partner_id }, { onConflict: "partner_id" })
        .select()
        .single();

      if (tokenError) {
        console.error("Error creating token:", tokenError);
        return new Response(
          JSON.stringify({ error: "Kunde inte skapa token" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: token.token,
          url: `https://d365-svenska-guiden.lovable.app/partner-events/${token.token}`
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Admin: List event tokens
    if (action === "list-tokens") {
      const { data: tokens, error } = await supabase
        .from("partner_event_tokens")
        .select(`
          *,
          partners:partner_id (
            id,
            name,
            is_featured
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tokens:", error);
        return new Response(
          JSON.stringify({ error: "Kunde inte hämta tokens" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ tokens: tokens || [] }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Ogiltig åtgärd" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in manage-events:", error);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod" }),
      { status: 500, headers: { "Content-Type": "application/json", ...getCorsHeaders(req) } }
    );
  }
});
