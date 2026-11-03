// Gemensamt för export-demand-leads och export-demand-events: nyckelskydd, datum och CSV.
// Loggar aldrig innehåll; felmeddelanden innehåller aldrig data ur databasen.

export function exportKeyOk(req: Request): boolean {
  const expected = Deno.env.get("DEMAND_EXPORT_KEY") || "";
  const got = req.headers.get("x-export-key") || "";
  if (expected.length < 32 || got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function validDate(s: string): boolean {
  const m = DATE.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

/** Förskjutning (minuter) för Europe/Stockholm vid ett givet UTC-ögonblick. */
function stockholmOffsetMin(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Stockholm", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(at);
  const g = (t: string) => +(parts.find((p) => p.type === t)?.value || 0);
  const local = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"));
  return Math.round((local - at.getTime()) / 60000);
}

/** Midnatt i Stockholm för datumet, som UTC-ISO. */
function stockholmMidnight(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  const off = stockholmOffsetMin(guess);
  return new Date(guess.getTime() - off * 60000).toISOString();
}

export function todayStockholm(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
}

/** from (inklusive) till to (inklusive) i Stockholmstid, som [start, slut) i UTC. */
export function parseRange(url: URL): { start: string; end: string } | null {
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || todayStockholm();
  if (!validDate(from) || !validDate(to) || from > to) return null;
  const [y, m, d] = to.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  return { start: stockholmMidnight(from), end: stockholmMidnight(next) };
}

/** ISO 8601 med Stockholms tidszon, t.ex. 2026-11-03T12:40:00+01:00. */
export function isoStockholm(ts: string | null | undefined): string {
  if (!ts) return "";
  const at = new Date(ts);
  if (isNaN(at.getTime())) return "";
  const off = stockholmOffsetMin(at);
  const local = new Date(at.getTime() + off * 60000).toISOString().slice(0, 19);
  const sign = off >= 0 ? "+" : "-";
  const a = Math.abs(off);
  return `${local}${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

export function toCsv(columns: string[], rows: Record<string, string>[]): string {
  const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c] ?? "")).join(","))].join("\r\n") + "\r\n";
}

/** Inga null/undefined: allt blir strängar. */
export function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export const exportHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

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
    const { createClient } = await import("npm:@supabase/supabase-js@2");
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
