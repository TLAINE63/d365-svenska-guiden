// Admin debug: visa hur en sökfras viktas mot en partners /fordjupning/-text.
// Returnerar sanering, tokens, matchande taggar, relevansnivå och snippet.
// Kräver giltig admin-JWT (HMAC-SHA256, samma som manage-partners).
import { getCorsHeaders } from '../_shared/cors.ts';
import { scoreExtendedRelevance, tokenize, cleanSnippet } from '../_shared/extended-relevance.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

function base64UrlToBase64(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}
function base64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function verifyAdminJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'],
    );
    const sig = base64UrlDecode(s);
    const ok = await crypto.subtle.verify('HMAC', key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { query = '', slug = 'bisqo', token = '' } = body ?? {};

    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Serverfel: autentisering ej konfigurerad' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const authHeader = req.headers.get('authorization') || '';
    const bearer = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : '';
    const jwt = typeof token === 'string' && token ? token : bearer;
    const isAdmin = await verifyAdminJWT(jwt, secret);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Ej behörig' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (typeof query !== 'string' || typeof slug !== 'string' || query.length > 500) {
      return new Response(JSON.stringify({ error: 'Ogiltig indata' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const admin = createClient(url, secret, { auth: { persistSession: false } });
    const { data, error } = await admin
      .from('partners')
      .select('id, name, slug, extended_content, extended_content_updated_at')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!data) {
      return new Response(JSON.stringify({ error: `Ingen partner med slug "${slug}"` }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const extended = (data.extended_content as string | null) || '';
    const rel = scoreExtendedRelevance(query, extended);
    const queryTokens = tokenize(query);
    const extendedTokens = tokenize(extended);
    const extendedUnique = Array.from(new Set(extendedTokens));

    const freq = new Map<string, number>();
    for (const t of extendedTokens) freq.set(t, (freq.get(t) || 0) + 1);
    const matchedWithFreq = rel.matchedTerms
      .map((t) => ({ term: t, hits: freq.get(t) || 0 }))
      .sort((a, b) => b.hits - a.hits);

    return new Response(JSON.stringify({
      partner: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        extendedContentUpdatedAt: data.extended_content_updated_at,
        extendedContentLength: extended.length,
        extendedContentHasText: extended.trim().length > 0,
      },
      query: {
        raw: query,
        tokens: queryTokens,
        uniqueTokens: Array.from(new Set(queryTokens)),
      },
      relevance: {
        score: rel.score,
        level: rel.level,
        weightHint: rel.weightHint,
        snippetChars: rel.snippetChars,
        matchedTerms: rel.matchedTerms,
        matchedTermsRanked: matchedWithFreq,
        coverage: queryTokens.length > 0
          ? rel.matchedTerms.length / new Set(queryTokens).size
          : 0,
      },
      extended: {
        tokenCount: extendedTokens.length,
        uniqueTokenCount: extendedUnique.length,
        snippet: cleanSnippet(extended, rel.snippetChars),
        previewFirst400: cleanSnippet(extended, 400),
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('debug-extended-relevance error', e);
    return new Response(JSON.stringify({ error: 'Internt fel' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
