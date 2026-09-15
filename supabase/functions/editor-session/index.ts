import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".lovableproject.com") ||
    origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createHmacToken(
  payload: Record<string, unknown>,
  secret: string,
  expiresInMs: number,
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + Math.floor(expiresInMs / 1000) };
  const data = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(fullPayload))}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${base64UrlEncode(String.fromCharCode(...new Uint8Array(sig)))}`;
}

const EXPIRES_IN_MS = 8 * 60 * 60 * 1000;

Deno.serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!accessToken) {
      return json({ error: "Inte inloggad" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
    if (userError || !userData?.user) {
      return json({ error: "Ogiltig session" }, 401);
    }

    const userId = userData.user.id;
    const { data: roles, error: rolesError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (rolesError) {
      console.error("editor-session: role lookup failed", rolesError.message);
      return json({ error: "Kunde inte kontrollera behörighet" }, 500);
    }

    const roleNames = (roles ?? []).map((r: { role: string }) => r.role);
    if (!roleNames.includes("editor") && !roleNames.includes("admin")) {
      console.log(`editor-session: access denied for user ${userId}`);
      return json({ error: "Kontot saknar redaktörsbehörighet" }, 403);
    }

    const token = await createHmacToken(
      { role: "admin", scope: "editor", sub: userId },
      SERVICE_ROLE_KEY,
      EXPIRES_IN_MS,
    );

    return json(
      {
        success: true,
        token,
        expiresIn: EXPIRES_IN_MS,
        email: userData.user.email ?? null,
        roles: roleNames,
      },
      200,
    );
  } catch (error: unknown) {
    console.error("editor-session error:", error);
    return json({ error: "Ett fel uppstod" }, 500);
  }
});
