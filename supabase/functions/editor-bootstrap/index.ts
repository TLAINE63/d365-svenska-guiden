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

const rateLimit = new Map<string, { count: number; resetTime: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = rateLimit.get(ip);
  if (!rec || now > rec.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    return false;
  }
  if (rec.count >= 5) return true;
  rec.count++;
  return false;
}

Deno.serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return json({ error: "För många försök. Vänta 5 minuter." }, 429);
    }

    const body = await req.json().catch(() => ({}));
    const adminPassword = typeof body.adminPassword === "string" ? body.adminPassword : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email.includes("@") || password.length < 10) {
      return json({ error: "Ange en giltig e-post och ett lösenord på minst 10 tecken" }, 400);
    }

    const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      console.log(`editor-bootstrap: invalid admin password from ${ip}`);
      return json({ error: "Ogiltigt adminlösenord" }, 401);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    let userId: string | null = null;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);
      if (!existing) {
        console.error("editor-bootstrap: create failed", createError.message);
        return json({ error: "Kunde inte skapa kontot" }, 400);
      }
      userId = existing.id;
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    } else {
      userId = created.user?.id ?? null;
    }

    if (!userId) return json({ error: "Kunde inte skapa kontot" }, 500);

    const { error: roleError } = await admin
      .from("user_roles")
      .upsert({ user_id: userId, role: "editor" }, { onConflict: "user_id,role" });

    if (roleError) {
      console.error("editor-bootstrap: role insert failed", roleError.message);
      return json({ error: "Kontot skapades men behörigheten kunde inte sättas" }, 500);
    }

    console.log(`editor-bootstrap: editor account ready for ${userId}`);
    return json({ success: true }, 200);
  } catch (error) {
    console.error("editor-bootstrap error:", error);
    return json({ error: "Ett fel uppstod" }, 500);
  }
});
