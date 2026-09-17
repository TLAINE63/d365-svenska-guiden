import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin) ||
    /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function base64UrlToBase64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(s: string): Uint8Array {
  const bin = atob(base64UrlToBase64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyStaffJWT(token: string, secret: string): Promise<boolean> {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sig) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin" || payload.role === "editor";
  } catch {
    return false;
  }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

const SEMRUSH_GATEWAY = "https://connector-gateway.lovable.dev/semrush";
const DEFAULT_DOMAIN = "d365.se";

function parseSemrushCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(";");
  return lines.slice(1).map((line) => {
    const cells = line.split(";");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

/** Anropar Semrush via connector-gateway och normaliserar svaret till rader. */
async function semrush(path: string, params: Record<string, string>): Promise<Record<string, string>[]> {
  const LK = Deno.env.get("LOVABLE_API_KEY");
  const SK = Deno.env.get("SEMRUSH_API_KEY");
  if (!LK || !SK) throw new Error("SEMRUSH_NOT_CONNECTED");

  const res = await fetch(`${SEMRUSH_GATEWAY}${path}?${new URLSearchParams(params)}`, {
    headers: {
      Authorization: `Bearer ${LK}`,
      "X-Connection-Api-Key": SK,
      "Allow-Limit-Offset": "true",
    },
  });
  const text = await res.text();
  if (!res.ok || /TOTAL LIMIT EXCEEDED|ERROR 1\d\d/.test(text)) {
    console.error(`Semrush ${path} [${res.status}]: ${text.slice(0, 400)}`);
    if (/TOTAL LIMIT EXCEEDED|LIMIT EXCEEDED/i.test(text)) throw new Error("SEMRUSH_QUOTA");
    throw new Error(`SEMRUSH_ERROR: ${res.status} ${text.slice(0, 200)}`);
  }
  try {
    const j = JSON.parse(text);
    if (typeof j?.error === "string") {
      if (/LIMIT EXCEEDED/i.test(j.error)) throw new Error("SEMRUSH_QUOTA");
      throw new Error(`SEMRUSH_ERROR: ${j.error}`);
    }
    const cols: string[] = j?.data?.columnNames || [];
    const rows: unknown[][] = j?.data?.rows || [];
    return rows.map((r) => {
      const obj: Record<string, string> = {};
      cols.forEach((c, i) => {
        obj[c] = String(r[i] ?? "");
      });
      return obj;
    });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("SEMRUSH_")) throw e;
    return parseSemrushCsv(text);
  }
}

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const pick = (row: Record<string, string>, keys: string[]): string => {
  for (const k of keys) {
    const hit = Object.keys(row).find((c) => c.toLowerCase() === k.toLowerCase());
    if (hit && row[hit] !== "") return row[hit];
  }
  return "";
};

const SPAM_HOST_PATTERNS = [
  "blogspot.",
  "wordpress.com",
  "weebly.com",
  "wixsite.com",
  "tumblr.com",
  "medium.com/@",
  "over-blog",
  "livejournal.com",
  "webnode.",
  "jimdosite.com",
];
const SPAM_TLDS = [
  ".sbs",
  ".xyz",
  ".top",
  ".buzz",
  ".icu",
  ".cyou",
  ".click",
  ".rest",
  ".monster",
  ".quest",
  ".shop",
  ".bond",
  ".cfd",
  ".lol",
];

function isLikelySpam(domain: string, authority: number | null, backlinks: number | null): boolean {
  const d = String(domain || "").toLowerCase().trim();
  if (!d) return false;
  const a = typeof authority === "number" ? authority : null;
  const b = typeof backlinks === "number" ? backlinks : 0;
  if (SPAM_HOST_PATTERNS.some((p) => d.includes(p))) return true;
  if (SPAM_TLDS.some((t) => d.endsWith(t))) return true;
  if (a !== null && a < 5) return true;
  if (a !== null && a < 10 && b > 20) return true;
  return false;
}

serve(async (req: Request): Promise<Response> => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "public";
    const domain = (url.searchParams.get("domain") || DEFAULT_DOMAIN).toLowerCase().trim();

    // Publik: senaste sparade ögonblicksbilden, dolda domäner bortfiltrerade.
    if (action === "public") {
      const { data, error } = await supabase
        .from("site_backlink_snapshots")
        .select("*")
        .eq("domain", domain)
        .order("captured_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return json({ snapshot: null }, 200, cors);

      const hidden = new Set((data.hidden_domains || []).map((d: string) => d.toLowerCase()));
      const top = (Array.isArray(data.top_domains) ? data.top_domains : []).filter(
        (d: { domain?: string }) => !hidden.has(String(d?.domain || "").toLowerCase()),
      );
      return json(
        {
          snapshot: {
            domain: data.domain,
            captured_at: data.captured_at,
            referring_domains: data.referring_domains,
            backlinks: data.backlinks,
            authority_score: data.authority_score,
            follows: data.follows,
            nofollows: data.nofollows,
            top_domains: top.slice(0, 20),
          },
        },
        200,
        cors,
      );
    }

    // Allt annat kräver inloggad admin eller redaktör.
    const token = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyStaffJWT(token, secret))) {
      return json({ error: "Sessionen har gått ut. Logga in igen." }, 401, cors);
    }

    if (action === "list") {
      const { data, error } = await supabase
        .from("site_backlink_snapshots")
        .select("*")
        .eq("domain", domain)
        .order("captured_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return json({ snapshots: data || [] }, 200, cors);
    }

    if (action === "hide" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const hiddenDomains = Array.isArray(body.hidden_domains)
        ? body.hidden_domains.map((d: unknown) => String(d).toLowerCase().trim()).filter(Boolean).slice(0, 200)
        : [];
      const id = String(body.id || "");
      if (!id) return json({ error: "id krävs" }, 400, cors);
      const { error } = await supabase
        .from("site_backlink_snapshots")
        .update({ hidden_domains: hiddenDomains })
        .eq("id", id);
      if (error) throw error;
      return json({ ok: true }, 200, cors);
    }

    if (action === "fetch" && req.method === "POST") {
      const overview = await semrush("/backlinks/backlinks_overview", {
        target: domain,
        target_type: "root_domain",
        export_columns: "ascore,total,domains_num,urls_num,follows_num,nofollows_num",
      });
      const o = overview[0] || {};

      const refdomains = await semrush("/backlinks/backlinks_refdomains", {
        target: domain,
        target_type: "root_domain",
        export_columns: "domain_ascore,domain,backlinks_num",
        display_limit: "50",
      });

      const topDomains = refdomains
        .map((r) => ({
          domain: pick(r, ["domain"]),
          authority: num(pick(r, ["domain_ascore", "ascore"])),
          backlinks: num(pick(r, ["backlinks_num", "backlinks"])),
        }))
        .filter((d) => d.domain)
        .slice(0, 50);

      // Behåll dolda domäner från den föregående ögonblicksbilden.
      const { data: prev } = await supabase
        .from("site_backlink_snapshots")
        .select("hidden_domains")
        .eq("domain", domain)
        .order("captured_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const row = {
        domain,
        captured_at: new Date().toISOString(),
        referring_domains: num(pick(o, ["domains_num"])),
        backlinks: num(pick(o, ["total"])),
        authority_score: num(pick(o, ["ascore"])),
        follows: num(pick(o, ["follows_num"])),
        nofollows: num(pick(o, ["nofollows_num"])),
        top_domains: topDomains,
        hidden_domains: (() => {
          const keep = new Set(
            (prev?.hidden_domains || []).map((d: string) => String(d).toLowerCase().trim()).filter(Boolean),
          );
          for (const d of topDomains) {
            if (isLikelySpam(d.domain, d.authority, d.backlinks)) keep.add(String(d.domain).toLowerCase());
          }
          return Array.from(keep).slice(0, 200);
        })(),
      };

      const { data: inserted, error: insErr } = await supabase
        .from("site_backlink_snapshots")
        .insert(row)
        .select()
        .single();
      if (insErr) throw insErr;

      return json({ ok: true, snapshot: inserted }, 200, cors);
    }

    return json({ error: "Okänd åtgärd" }, 400, cors);
  } catch (e) {
    const raw =
      e instanceof Error
        ? e.message
        : e && typeof e === "object" && "message" in e
        ? String((e as { message: unknown }).message)
        : "Unknown error";
    console.error("manage-backlink-stats error:", raw);
    if (raw === "SEMRUSH_QUOTA") {
      return json(
        { error: "Semrush-kvoten är slut för tillfället. Vänta tills kvoten återställs eller uppgradera planen." },
        429,
        cors,
      );
    }
    if (raw === "SEMRUSH_NOT_CONNECTED") {
      return json({ error: "Semrush är inte kopplat till projektet." }, 400, cors);
    }
    return json({ error: raw }, 500, cors);
  }
});
