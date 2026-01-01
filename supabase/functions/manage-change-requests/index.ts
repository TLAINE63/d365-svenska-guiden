import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Sanitize HTML to prevent XSS in emails
function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Get allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://d365-svenska-guiden.lovable.app",
  "https://vnvphfrrmoaskiwlspeo.lovableproject.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// JWT verification using HMAC-SHA256
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; payload?: Record<string, unknown>; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    // Verify signature
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

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    // Decode and validate payload
    const payload = JSON.parse(atob(base64UrlToBase64(encodedPayload)));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    // Check role
    if (payload.role !== "admin") {
      return { valid: false, error: "Insufficient permissions" };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

function base64UrlToBase64(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = base64UrlToBase64(str);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

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
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, id, token, adminNotes, partnerName, requesterEmail, requesterName } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // "notify-new" action doesn't require authentication (called from public form submission)
    if (action === "notify-new") {
      console.log(`Sending notification for new change request from ${requesterName} for ${partnerName}`);
      
      const safePartnerName = sanitizeHtml(partnerName);
      const safeRequesterName = sanitizeHtml(requesterName);
      const safeRequesterEmail = sanitizeHtml(requesterEmail);
      
      await sendEmail(
        ADMIN_EMAIL,
        `Ny ändringsförfrågan för ${safePartnerName}`,
        `
          <h2>Ny ändringsförfrågan</h2>
          <p>En ny ändringsförfrågan har skickats in för partnern <strong>${safePartnerName}</strong>.</p>
          <p><strong>Inskickad av:</strong> ${safeRequesterName} (${safeRequesterEmail})</p>
          <p>Logga in på admin-panelen för att granska och godkänna eller avvisa förfrågan.</p>
        `
      );

      return new Response(
        JSON.stringify({ success: true, message: "Notifiering skickad" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // All other actions require JWT authentication
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      console.error("JWT secret not available");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verification = await verifyJWT(token || "", JWT_SECRET);
    if (!verification.valid) {
      console.log(`Invalid token: ${verification.error}`);
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

        const changes = request.changes as Record<string, unknown>;
        const partnerData = request.partner as { name: string } | null;

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

        const safeRequesterName = sanitizeHtml(request.requester_name);
        const safePartnerName = sanitizeHtml(partnerData?.name || 'partnern');
        const safeAdminNotes = sanitizeHtml(adminNotes);

        await sendEmail(
          request.requester_email,
          `Din ändringsförfrågan för ${safePartnerName} har godkänts`,
          `
            <h2>Ändringsförfrågan godkänd</h2>
            <p>Hej ${safeRequesterName},</p>
            <p>Din ändringsförfrågan för <strong>${safePartnerName}</strong> har granskats och godkänts.</p>
            <p>Ändringarna är nu publicerade på webbplatsen.</p>
            ${safeAdminNotes ? `<p><strong>Kommentar från admin:</strong> ${safeAdminNotes}</p>` : ''}
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

        const safeRequesterName = sanitizeHtml(request.requester_name);
        const safePartnerName = sanitizeHtml(partnerData?.name || 'partnern');
        const safeAdminNotes = sanitizeHtml(adminNotes);

        await sendEmail(
          request.requester_email,
          `Din ändringsförfrågan för ${safePartnerName} har avvisats`,
          `
            <h2>Ändringsförfrågan avvisad</h2>
            <p>Hej ${safeRequesterName},</p>
            <p>Din ändringsförfrågan för <strong>${safePartnerName}</strong> har granskats och avvisats.</p>
            ${safeAdminNotes ? `<p><strong>Anledning:</strong> ${safeAdminNotes}</p>` : '<p>Kontakta oss om du har frågor.</p>'}
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
  } catch (error: unknown) {
    console.error("Error in manage-change-requests:", error);
    const corsHeaders = getCorsHeaders(req);
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
