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
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sig = base64UrlDecode(s);
    const ok = await crypto.subtle.verify("HMAC", key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch (e) {
    console.error("JWT verify error", e);
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const token = (formData.get("token") as string) || "";
    const filenameHint = ((formData.get("filename") as string) || "").trim();

    if (!file || !token) {
      return new Response(JSON.stringify({ error: "Fil och token krävs" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const ok = await verifyAdminJWT(token, supabaseKey);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Ogiltig admin-token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    if (file.type !== "application/pdf") {
      return new Response(JSON.stringify({ error: "Endast PDF tillåten" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    if (file.size > 20 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Filen får max vara 20MB" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const buffer = await file.arrayBuffer();

    // Verify PDF magic bytes
    const head = new TextDecoder().decode(new Uint8Array(buffer.slice(0, 5)));
    if (!head.startsWith("%PDF-")) {
      return new Response(JSON.stringify({ error: "Filinnehållet är inte en giltig PDF" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    // Build a safe filename. Default: partneravtal-<timestamp>.pdf
    const safeBase = filenameHint
      .toLowerCase()
      .replace(/\.pdf$/, "")
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "partneravtal";
    const stamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const filename = `${safeBase}-${stamp}.pdf`;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: upErr } = await supabase.storage
      .from("partner-documents")
      .upload(filename, buffer, { contentType: "application/pdf", upsert: true });

    if (upErr) {
      console.error("Upload error:", upErr);
      return new Response(JSON.stringify({ error: "Kunde inte ladda upp filen" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const { data: urlData } = supabase.storage
      .from("partner-documents")
      .getPublicUrl(filename);

    return new Response(
      JSON.stringify({ success: true, url: urlData.publicUrl, filename }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } },
    );
  } catch (e) {
    console.error("upload-partner-document error", e);
    return new Response(JSON.stringify({ error: "Ett fel uppstod vid uppladdning" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
