// Hämtar publika webbadresser utan att kunna nå interna/privata nätverk (SSRF-skydd).
function isPrivateIp(ip: string): boolean {
  const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (v.includes(":")) {
    if (v === "::" || v === "::1") return true;
    if (v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb")) return true;
    const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped ? isPrivateIp(mapped[1]) : false;
  }
  const p = v.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
}

async function assertPublicUrl(raw: string): Promise<URL> {
  const u = new URL(raw);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Otillåtet protokoll");
  if (u.username || u.password) throw new Error("Otillåten adress");
  if (u.port && u.port !== "80" && u.port !== "443") throw new Error("Otillåten port");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^[\d.]+$/.test(host) || host.includes(":")) {
    if (isPrivateIp(host)) throw new Error("Otillåten adress");
    return u;
  }
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) throw new Error("Otillåten adress");
  const ips: string[] = [];
  for (const t of ["A", "AAAA"] as const) {
    try { ips.push(...(await Deno.resolveDns(host, t))); } catch { /* ingen post */ }
  }
  if (ips.length === 0 || ips.some(isPrivateIp)) throw new Error("Otillåten adress");
  return u;
}

/** fetch() som bara når publika adresser och kontrollerar varje omdirigering. */
export async function safeFetch(raw: string, init: RequestInit = {}, maxRedirects = 5): Promise<Response> {
  let current = raw;
  for (let i = 0; i <= maxRedirects; i++) {
    const u = await assertPublicUrl(current);
    const res = await fetch(u.toString(), { ...init, redirect: "manual" });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location")!, u).toString();
      await res.body?.cancel();
      continue;
    }
    return res;
  }
  throw new Error("För många omdirigeringar");
}
