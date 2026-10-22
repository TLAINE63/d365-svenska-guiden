// Shared daily per-IP quota for AI endpoints
// Logs each request to ai_usage_log and blocks above DAILY_LIMIT per IP per endpoint.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`d365-ai-quota:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Client IP for quota purposes. cf-connecting-ip is set by the edge network and
 * overwrites any caller-supplied value, so it is used exclusively when present.
 * The forwarded headers are only a fallback; because callers can spoof those,
 * checkAndLogQuota also enforces a server-side ceiling across all IPs.
 */
export function getClientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  return (
    req.headers.get('x-real-ip')?.trim() ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

export type QuotaResult = { allowed: true } | { allowed: false; used: number; limit: number };

/** Daily ceiling per endpoint across all callers, far above normal traffic. */
export function globalDailyLimit(perIpLimit: number): number {
  return Math.max(perIpLimit * 50, 500);
}

async function countUsage(filter: string): Promise<number> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log?select=id&${filter}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'count=exact',
      'Range-Unit': 'items',
      Range: '0-0',
    },
  });
  if (!res.ok) throw new Error(`ai_usage_log count failed: ${res.status}`);
  const contentRange = res.headers.get('content-range') || '*/0';
  return parseInt(contentRange.split('/')[1] || '0', 10) || 0;
}

/**
 * Checks daily quota and logs the request if allowed.
 * Blocks when the IP has hit the per-IP limit, or when the endpoint as a whole
 * has hit its global daily ceiling (protects AI costs even if IPs are spoofed).
 */
export async function checkAndLogQuota(
  req: Request,
  endpoint: string,
  dailyLimit: number,
): Promise<QuotaResult> {
  const ip = getClientIp(req);
  const ipHash = await hashIp(ip);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const safeEndpoint = encodeURIComponent(endpoint);
  const globalLimit = globalDailyLimit(dailyLimit);

  let usedIp = 0;
  let usedGlobal = 0;
  try {
    [usedIp, usedGlobal] = await Promise.all([
      countUsage(`ip_hash=eq.${ipHash}&endpoint=eq.${safeEndpoint}&usage_day=eq.${today}`),
      countUsage(`endpoint=eq.${safeEndpoint}&usage_day=eq.${today}`),
    ]);
  } catch (e) {
    // Fail-open on counting errors so real users are not blocked by a logging outage.
    console.error('checkAndLogQuota count error', e);
    return { allowed: true };
  }

  if (usedIp >= dailyLimit) {
    return { allowed: false, used: usedIp, limit: dailyLimit };
  }
  if (usedGlobal >= globalLimit) {
    console.warn(`AI global daily ceiling reached for ${endpoint}: ${usedGlobal}/${globalLimit}`);
    return { allowed: false, used: usedGlobal, limit: globalLimit };
  }

  try {
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ ip_hash: ipHash, endpoint, usage_day: today }),
    });
    if (!ins.ok) console.error('ai_usage_log insert failed', ins.status);
  } catch (e) {
    console.error('ai_usage_log insert failed', e);
  }

  return { allowed: true };
}
