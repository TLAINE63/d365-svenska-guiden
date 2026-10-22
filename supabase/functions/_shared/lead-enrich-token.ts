// Short-lived proof that the caller is the browser that just created a lead.
// submit-lead returns this token; enrich-lead requires it before adding
// contact details, so a lead id + email alone cannot rewrite a lead.

const encoder = new TextEncoder();

async function hmacHex(message: string): Promise<string> {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!secret) throw new Error("missing signing secret");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`lead-enrich-v1:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function createLeadEnrichToken(leadId: string): Promise<string> {
  return hmacHex(`lead:${leadId}`);
}

export async function verifyLeadEnrichToken(leadId: string, token: unknown): Promise<boolean> {
  if (typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) return false;
  const expected = await createLeadEnrichToken(leadId);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
