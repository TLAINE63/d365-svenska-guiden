// Behörighet för Demand Engine-exporterna: x-export-key eller admininloggning.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportKeyOk } from "./demandExport.ts";

function b64urlBytes(s: string): Uint8Array {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** Admin-token från admin-login (HMAC, role "admin", ej utgången). Redaktörer godtas inte. */
async function adminTokenOk(token: string): Promise<boolean> {
  try {
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const [h, p, sig] = token.split(".");
    if (!secret || !h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    if (!(await crypto.subtle.verify("HMAC", key, b64urlBytes(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`)))) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlBytes(p)));
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Inloggad användare (Auth-JWT) med rollen admin i user_roles. */
async function adminUserOk(token: string): Promise<boolean> {
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data?.user) return false;
    const { data: role } = await sb.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    return !!role;
  } catch {
    return false;
  }
}

/** x-export-key ELLER admin-JWT. Allt annat ger 401. */
export async function exportAuthOk(req: Request): Promise<boolean> {
  if (exportKeyOk(req)) return true;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return false;
  return (await adminTokenOk(token)) || (await adminUserOk(token));
}

const EXPORT_ORIGINS = ["https://d365.se", "https://www.d365.se", "http://localhost:8080", "http://localhost:5173"];
export function exportCors(req: Request): Record<string, string> {
  const o = req.headers.get("origin") || "";
  const ok = EXPORT_ORIGINS.includes(o) || /^https:\/\/[a-z0-9-]+\.(lovable\.app|lovableproject\.com)$/.test(o);
  return {
    "Access-Control-Allow-Origin": ok ? o : EXPORT_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-export-key",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Expose-Headers": "Content-Disposition",
    Vary: "Origin",
  };
}
