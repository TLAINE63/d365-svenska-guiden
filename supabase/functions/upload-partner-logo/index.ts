import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow all Lovable preview domains
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
    "Access-Control-Allow-Credentials": "true",
  };
}

// JWT verification for admin tokens
async function verifyAdminJWT(token: string, secret: string): Promise<{ valid: boolean; error?: string }> {
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

// Verify invitation token from database
async function verifyInvitationToken(
  supabase: any,
  token: string
): Promise<{ valid: boolean; partnerId?: string; partnerName?: string; error?: string }> {
  try {
    const { data: invitation, error } = await supabase
      .from("partner_invitations")
      .select("id, partner_id, partner_name, status, expires_at")
      .eq("token", token)
      .single();

    if (error || !invitation) {
      return { valid: false, error: "Ogiltig inbjudan" };
    }

    const inv = invitation as { 
      id: string; 
      partner_id: string | null; 
      partner_name: string; 
      status: string; 
      expires_at: string 
    };

    // Check if expired
    if (new Date(inv.expires_at) < new Date()) {
      return { valid: false, error: "Inbjudan har gått ut" };
    }

    // Check status - allow 'pending' or 'submitted' (for updates)
    if (inv.status !== 'pending' && inv.status !== 'submitted') {
      return { valid: false, error: "Inbjudan är inte längre giltig" };
    }

    return { 
      valid: true, 
      partnerId: inv.partner_id || undefined,
      partnerName: inv.partner_name 
    };
  } catch (error) {
    console.error("Invitation verification error:", error);
    return { valid: false, error: "Kunde inte verifiera inbjudan" };
  }
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const token = formData.get("token") as string;
    const partnerSlug = formData.get("partnerSlug") as string;

    if (!file || !token || !partnerSlug) {
      return new Response(
        JSON.stringify({ error: "Fil, token och partner-slug krävs" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client first (needed for invitation verification)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to verify as admin JWT first, then as invitation token
    let isAuthorized = false;
    
    // Check if token looks like a JWT (has 3 parts separated by dots)
    if (token.split('.').length === 3) {
      const jwtVerification = await verifyAdminJWT(token, supabaseKey);
      if (jwtVerification.valid) {
        isAuthorized = true;
        console.log("Admin JWT verified for logo upload");
      }
    }
    
    // If not a valid admin JWT, try as invitation token
    if (!isAuthorized) {
      const invitationVerification = await verifyInvitationToken(supabase, token);
      if (invitationVerification.valid) {
        isAuthorized = true;
        console.log("Invitation token verified for partner:", invitationVerification.partnerName);
      } else {
        return new Response(
          JSON.stringify({ error: invitationVerification.error || "Ogiltig autentisering" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Endast JPEG, PNG, WebP och SVG tillåtna" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Filen får max vara 5MB" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate filename
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${partnerSlug}.${ext}`;

    // Upload to storage
    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("partner-logos")
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("partner-logos")
      .getPublicUrl(filename);

    console.log("Logo uploaded for partner:", partnerSlug);
    return new Response(
      JSON.stringify({ success: true, url: urlData.publicUrl }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    // Log full error server-side for debugging, return generic message to client
    console.error("Error in upload-partner-logo:", error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: "Ett fel uppstod vid uppladdning" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
