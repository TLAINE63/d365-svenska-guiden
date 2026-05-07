// Shared daily per-IP quota for AI endpoints
// Logs each request to ai_usage_log and blocks above DAILY_LIMIT per IP per endpoint.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`d365-ai-quota:${ip}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

export type QuotaResult = { allowed: true } | { allowed: false; used: number; limit: number };

/**
 * Checks daily quota and logs the request if allowed.
 * Returns { allowed: false } if the IP has hit the daily limit for this endpoint.
 */
export async function checkAndLogQuota(
  req: Request,
  endpoint: string,
  dailyLimit: number,
): Promise<QuotaResult> {
  try {
    const ip = getClientIp(req);
    const ipHash = await hashIp(ip);
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC

    // Count today's usage for this IP + endpoint
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_usage_log?select=id&ip_hash=eq.${ipHash}&endpoint=eq.${endpoint}&usage_day=eq.${today}`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          Prefer: 'count=exact',
          'Range-Unit': 'items',
          Range: '0-0',
        },
      },
    );
    const contentRange = countRes.headers.get('content-range') || '*/0';
    const used = parseInt(contentRange.split('/')[1] || '0', 10);

    if (used >= dailyLimit) {
      return { allowed: false, used, limit: dailyLimit };
    }

    // Log this request (fire-and-forget; don't await failure)
    fetch(`${SUPABASE_URL}/rest/v1/ai_usage_log`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ ip_hash: ipHash, endpoint, usage_day: today }),
    }).catch((e) => console.error('ai_usage_log insert failed', e));

    return { allowed: true };
  } catch (e) {
    // Fail-open: if logging breaks, do not block real users
    console.error('checkAndLogQuota error', e);
    return { allowed: true };
  }
}
