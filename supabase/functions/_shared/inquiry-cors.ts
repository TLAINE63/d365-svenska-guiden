// CORS for public cross-site functions shared by d365.se and businesscentral.se.
export function isInquiryOrigin(origin: string): boolean {
  if (!origin) return false;
  if (["https://d365.se", "https://www.d365.se", "https://businesscentral.se", "https://www.businesscentral.se"].includes(origin)) return true;
  if (origin.startsWith("http://localhost:")) return true;
  if (/^https:\/\/[a-z0-9-]+\.(lovable\.app|lovableproject\.com)$/.test(origin)) return true;
  return false;
}

export function inquiryCors(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const h: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  if (isInquiryOrigin(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export function siteFromOrigin(origin: string): string {
  return /businesscentral\.se$/.test(origin.replace(/^https?:\/\//, "")) ? "businesscentral.se" : "d365.se";
}
