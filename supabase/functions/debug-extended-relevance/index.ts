// Admin debug: visa hur en sökfras viktas mot en partners /fordjupning/-text.
// Returnerar sanering, tokens, matchande taggar, relevansnivå och snippet.
import { getCorsHeaders } from '../_shared/cors.ts';
import { scoreExtendedRelevance, tokenize, cleanSnippet } from '../_shared/extended-relevance.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { query = '', slug = 'bisqo' } = await req.json().catch(() => ({}));
    if (typeof query !== 'string' || typeof slug !== 'string' || query.length > 500) {
      return new Response(JSON.stringify({ error: 'Ogiltig indata' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, key, { auth: { persistSession: false } });
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

    // Rank matched terms by frequency in fördjupningen
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
