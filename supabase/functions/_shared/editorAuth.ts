function base64UrlToBase64(value: string): string {
  let out = value.replace(/-/g, "+").replace(/_/g, "/");
  while (out.length % 4) out += "=";
  return out;
}

function base64UrlDecode(value: string): Uint8Array {
  const binary = atob(base64UrlToBase64(value));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Verifies the custom HMAC token used by Admin and Redaktion. */
export async function verifyEditorToken(token: string, secret: string): Promise<boolean> {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature) as unknown as BufferSource,
      encoder.encode(`${header}.${payload}`),
    );
    if (!valid) return false;
    const parsed = JSON.parse(atob(base64UrlToBase64(payload)));
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return false;
    return parsed.role === "admin" || parsed.role === "editor";
  } catch {
    return false;
  }
}

export async function requestIsEditor(req: Request): Promise<boolean> {
  const authorization = req.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return Boolean(token) && verifyEditorToken(token, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
}
