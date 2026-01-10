import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { timingSafeEqual } from "https://deno.land/std@0.190.0/crypto/timing_safe_equal.ts";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

// Rate limiting for brute-force protection
const loginRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const LOGIN_RATE_LIMIT = 5; // Max attempts per window
const LOGIN_RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginRateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    loginRateLimitMap.set(ip, { count: 1, resetTime: now + LOGIN_RATE_WINDOW_MS });
    return false;
  }
  
  if (record.count >= LOGIN_RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Constant-time password comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  try {
    const maxLen = Math.max(a.length, b.length, 64);
    const aBytes = new TextEncoder().encode(a.padEnd(maxLen, '\0'));
    const bBytes = new TextEncoder().encode(b.padEnd(maxLen, '\0'));
    return timingSafeEqual(aBytes, bBytes);
  } catch {
    return false;
  }
}

// Get allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
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

// JWT token generation using HMAC-SHA256
async function createJWT(payload: Record<string, unknown>, secret: string, expiresInMs: number): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + Math.floor(expiresInMs / 1000),
  };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(dataToSign));
  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${dataToSign}.${encodedSignature}`;
}

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// JWT expiration time: 2 hours
const JWT_EXPIRES_IN_MS = 2 * 60 * 60 * 1000;

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    
    if (isLoginRateLimited(clientIp)) {
      console.log(`Rate limited login attempt from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "För många inloggningsförsök. Försök igen om 5 minuter." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { password } = await req.json();

    // Validate admin password
    const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD) {
      console.error("PARTNER_ADMIN_PASSWORD environment variable is not configured");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get or generate JWT secret (using service role key as base)
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      console.error("JWT secret not available");
      return new Response(
        JSON.stringify({ error: "Serverfel: JWT-konfiguration saknas" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate password with constant-time comparison
    if (!constantTimeCompare(password || "", ADMIN_PASSWORD)) {
      console.log(`Invalid password attempt from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Ogiltigt lösenord" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate JWT token
    const token = await createJWT(
      { role: "admin", ip: clientIp },
      JWT_SECRET,
      JWT_EXPIRES_IN_MS
    );

    console.log(`Admin login successful from IP: ${clientIp}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        token,
        expiresIn: JWT_EXPIRES_IN_MS,
        message: "Inloggning lyckades"
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in admin-login:", error);
    const corsHeaders = getCorsHeaders(req);
    const message = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
