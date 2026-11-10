import { exportAuthOk, exportCors } from '../_shared/demandExportAuth.ts';
import { exportHeaders } from '../_shared/demandExport.ts';

// Admin-only gateway; the shared export key never reaches the browser.
Deno.serve(async req => {
  const headers = { ...exportCors(req), ...exportHeaders };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'GET') return new Response(null, { status: 405, headers });
  const authHeaders = new Headers(req.headers);
  authHeaders.delete('x-export-key');
  if (!(await exportAuthOk(new Request(req.url, { headers: authHeaders })))) return new Response(null, { status: 401, headers });
  const key = Deno.env.get('PARTNER_METRICS_EXPORT_KEY');
  if (!key) return new Response(null, { status: 503, headers });
  try {
    const query = new URL(req.url).search;
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/export-partner-segments${query}`, { headers: { 'x-export-key': key } });
    const out = new Headers(headers);
    for (const name of ['Content-Type', 'Content-Disposition']) {
      const value = response.headers.get(name);
      if (value) out.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: out });
  } catch {
    return new Response(null, { status: 500, headers });
  }
});