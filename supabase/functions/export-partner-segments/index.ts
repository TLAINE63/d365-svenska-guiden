import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { exportHeaders } from '../_shared/demandExport.ts';
import { segmentKeyOk } from '../_shared/partnerSegments.ts';
import { partnerSegmentResponse } from '../_shared/partnerSegmentResponse.ts';

Deno.serve(async req => {
  const headers = { ...corsHeaders, ...exportHeaders };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'GET') return new Response(null, { status: 405, headers });
  if (!segmentKeyOk(req.headers.get('x-export-key'), Deno.env.get('PARTNER_METRICS_EXPORT_KEY'))) {
    return new Response(null, { status: 401, headers });
  }
  return partnerSegmentResponse(req, corsHeaders);
});