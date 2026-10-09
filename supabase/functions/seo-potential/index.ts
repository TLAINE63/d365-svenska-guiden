// Admin-only: analyserar inklistrade Search Console-rapporter med Lovable AI
// och returnerar sidor och sökfrågor med störst SEO-potential.
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText, Output, jsonSchema } from "npm:ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  getLovableAiGatewayResponseHeaders,
} from "../_shared/run-id.ts";

const ALLOWED = ["https://d365.se", "https://www.d365.se", "http://localhost:5173", "http://localhost:8080"];
function cors(req: Request): Record<string, string> {
  const o = req.headers.get("origin") || "";
  const ok = ALLOWED.includes(o) || o.endsWith(".lovableproject.com") || o.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": ok ? o : ALLOWED[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
function b64(s: string) { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; }
async function verifyAdmin(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigBytes = Uint8Array.from(atob(b64(sig)), (c) => c.charCodeAt(0));
    if (!(await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(`${h}.${p}`)))) return false;
    const pl = JSON.parse(atob(b64(p)));
    if (pl.exp && pl.exp < Date.now() / 1000) return false;
    return pl.role === "admin";
  } catch { return false; }
}

const item = {
  type: "object", additionalProperties: false,
  required: ["target", "metric", "why", "action", "priority"],
  properties: {
    target: { type: "string" }, metric: { type: "string" }, why: { type: "string" },
    action: { type: "string" }, priority: { type: "string", enum: ["hög", "medel", "låg"] },
  },
};
const schema = jsonSchema<{ summary: string; pages: any[]; queries: any[] }>({
  type: "object", additionalProperties: false, required: ["summary", "pages", "queries"],
  properties: { summary: { type: "string" }, pages: { type: "array", items: item }, queries: { type: "array", items: item } },
});

const INSTRUCTIONS = `Du är SEO-analytiker för d365.se, en svensk köparguide för Microsoft Dynamics 365.
Du får rådata från Google Search Console (sidor och/eller sökfrågor med klick, visningar, CTR, position).
Identifiera störst SEO-potential: t.ex. många visningar men låg CTR, position 4-20 (nära topp), frågor utan matchande sida.
Använd bara siffror som finns i underlaget, hitta aldrig på data. Svara på svenska. Använd aldrig långt tankstreck.
Ge högst 10 sidor och 10 sökfrågor, sorterade efter potential. "metric" = de relevanta siffrorna kort. "action" = konkret åtgärd.`;

Deno.serve(async (req) => {
  const ch = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: ch });
  const json = (b: unknown, s: number, extra?: HeadersInit) =>
    new Response(JSON.stringify(b), { status: s, headers: getLovableAiGatewayResponseHeaders(extra, { ...ch, "Content-Type": "application/json" }) });

  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token || !(await verifyAdmin(token, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""))) return json({ error: "Unauthorized" }, 401);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI-nyckel saknas" }, 500);

  let report = "";
  try { report = String((await req.json()).report || "").trim(); } catch { /* */ }
  if (report.length < 20) return json({ error: "Klistra in en rapport först." }, 400);
  if (report.length > 120_000) return json({ error: "Rapporten är för lång (max ca 120 000 tecken). Korta ned den." }, 400);

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system: INSTRUCTIONS,
      messages: [{ role: "user", content: `Search Console-rapport:\n\n${report}` }],
      output: Output.object({ schema }),
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          forceReasoning: true, reasoningEffort: "medium", reasoningSummary: "auto",
          store: false, include: ["reasoning.encrypted_content"],
        },
      },
    });
    let output: unknown;
    try { output = await result.output; }
    catch (e) {
      const text = (e as any)?.text ?? (await result.text.catch(() => ""));
      try { output = JSON.parse(text); } catch { throw e; }
    }
    const rid = runIdFetch.getRunId();
    return json({ result: output, generatedAt: new Date().toISOString() }, 200, rid ? { "X-Lovable-AIG-Run-ID": rid } : undefined);
  } catch (e: any) {
    if (req.signal.aborted) return json({ error: "Avbruten" }, 499);
    const status = e?.statusCode ?? e?.lastError?.statusCode ?? e?.cause?.statusCode;
    console.error("seo-potential error", status, e?.message);
    if (status === 429) return json({ error: "För många förfrågningar just nu. Försök igen om en stund." }, 429);
    if (status === 402) return json({ error: "AI-krediterna är slut. Fyll på under Settings → Plans & credits." }, 402);
    if (status === 403) return json({ error: "AI-anropet nekades (403)." }, 403);
    return json({ error: "Analysen misslyckades. Försök igen." }, 500);
  }
});
