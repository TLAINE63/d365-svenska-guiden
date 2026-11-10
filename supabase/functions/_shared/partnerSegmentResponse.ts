import { createClient } from 'npm:@supabase/supabase-js@2';
import { exportHeaders, todayStockholm } from './demandExport.ts';
import { segmentCsv, segmentOptions, segmentRows, type SegmentPartner } from './partnerSegments.ts';

export async function partnerSegmentResponse(req: Request, cors: Record<string, string>): Promise<Response> {
  const headers = { ...exportHeaders, ...cors };
  const options = segmentOptions(new URL(req.url));
  if (!options) return new Response(null, { status: 400, headers });
  try {
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const partners: SegmentPartner[] = [];
    for (let offset = 0; ; offset += 1000) {
      let query = sb.from('partners').select('slug,applications,product_filters,updated_at,is_featured').order('slug').range(offset, offset + 999);
      if (!options.includeUnpublished) query = query.eq('is_featured', true);
      const { data, error } = await query;
      if (error) throw new Error('export_failed');
      partners.push(...(data || []) as SegmentPartner[]);
      if (!data || data.length < 1000) break;
    }
    const rows = segmentRows(partners, options.includeUnpublished);
    return new Response(options.format === 'json' ? JSON.stringify(rows) : segmentCsv(rows), {
      headers: { ...headers,
        'Content-Type': options.format === 'json' ? 'application/json; charset=utf-8' : 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="partnersegment-${todayStockholm()}.${options.format}"`,
      },
    });
  } catch {
    return new Response(null, { status: 500, headers });
  }
}