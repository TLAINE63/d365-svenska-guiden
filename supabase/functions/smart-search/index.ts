// Smart AI search: tolkar fri text och returnerar bästa rutt + förklaring
import { checkAndLogQuota } from '../_shared/ai-quota.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 30;

const ROUTES = [
  { path: '/', label: 'Startsida – översikt över Dynamics 365' },
  { path: '/crm', label: 'CRM översikt (Sales, Marketing, Customer Service, Field Service, Contact Center)' },
  { path: '/d365-sales', label: 'Dynamics 365 Sales – säljstöd, pipeline, offerter' },
  { path: '/d365-marketing', label: 'Customer Insights – marknadsföring, kundresor, segmentering' },
  { path: '/d365-customer-service', label: 'Customer Service – ärendehantering, kundtjänst' },
  { path: '/d365-field-service', label: 'Field Service – fälttekniker, serviceorder, schemaläggning' },
  { path: '/d365-contact-center', label: 'Contact Center – omnikanal kundtjänst, telefoni' },
  { path: '/business-central', label: 'Business Central – ERP för små och medelstora företag, ekonomi, lager' },
  { path: '/finance-supply-chain', label: 'Finance & Supply Chain Management – ERP för stora bolag, ekonomi, supply chain, produktion' },
  { path: '/erp', label: 'ERP-jämförelse: Business Central vs Finance & SCM' },
  { path: '/ai-oversikt', label: 'AI med Copilot och AI-agenter i Dynamics 365' },
  { path: '/ai-readiness', label: 'AI Readiness Assessment – mät AI-mognad' },
  { path: '/copilot', label: 'Microsoft Copilot i Dynamics 365' },
  { path: '/agents', label: 'AI-agenter och Copilot Studio' },
  { path: '/branscher', label: 'Branschöversikt – Dynamics 365 per bransch (tillverkning, handel, service m.fl.)' },
  { path: '/valj-partner', label: 'Välj rätt Dynamics 365-partner – partnerguide & matchning' },
  { path: '/kom-igang', label: 'Kom igång-wizard: hjälp att hitta rätt produkt och partner' },
  { path: '/behovsanalys', label: 'Behovsanalys – generell' },
  { path: '/salj-marknad-behovsanalys', label: 'Behovsanalys för Sälj & Marknad' },
  { path: '/kundservice-behovsanalys', label: 'Behovsanalys för Kundservice' },
  { path: '/kravspecifikation', label: 'Kravspecifikation – generera underlag' },
  { path: '/kravspecifikation-sales', label: 'Kravspecifikation Sales' },
  { path: '/kravspecifikation-marketing', label: 'Kravspecifikation Marketing' },
  { path: '/kravspecifikation-kundservice', label: 'Kravspecifikation Kundservice' },
  { path: '/kunskapscenter', label: 'Kunskapscenter – artiklar, fördjupningar, events' },
  { path: '/events', label: 'Events och webbinarier' },
  { path: '/qa', label: 'Frågor & svar (FAQ)' },
  { path: '/kontakt', label: 'Kontakta oss / rådgivare' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string' || query.length > 500) {
      return new Response(JSON.stringify({ error: 'Ogiltig fråga' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const quota = await checkAndLogQuota(req, 'smart-search', DAILY_LIMIT);
    if (!quota.allowed) {
      return new Response(
        JSON.stringify({ error: `Daglig gräns nådd (${quota.limit} sökningar/dag). Försök igen imorgon eller använd menyn.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hämta partners (slug + name + description) för att kunna föreslå direkta profiler
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const partnersRes = await fetch(`${supabaseUrl}/rest/v1/partners?select=slug,name,description,applications,industries&is_featured=eq.true`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const partners = await partnersRes.json();

    const partnerList = (partners || []).map((p: any) =>
      `- /partner/${p.slug} | ${p.name} | apps: ${(p.applications || []).join(', ')} | ${(p.description || '').substring(0, 120)}`
    ).join('\n');

    const routeList = ROUTES.map(r => `- ${r.path} | ${r.label}`).join('\n');

    const systemPrompt = `Du är en sökassistent för d365.se, en oberoende guide till Microsoft Dynamics 365 i Sverige.
Användaren ställer en fri fråga – din uppgift är att föreslå den BÄSTA sidan att skicka dem till, plus 2-3 alternativa förslag.
Svara ALLTID på svenska och ALLTID i giltig JSON.`;

    const userPrompt = `Användarens fråga: "${query}"

TILLGÄNGLIGA SIDOR:
${routeList}

PARTNERS (du kan länka direkt till en specifik partner om frågan tydligt nämner ett företagsnamn):
${partnerList}

Returnera JSON:
{
  "primary": { "path": "/...", "label": "...", "reason": "kort förklaring max 20 ord" },
  "alternatives": [
    { "path": "/...", "label": "..." }
  ],
  "answer": "Kort, hjälpsam svensk text (2-3 meningar) som direkt besvarar frågan eller förklarar vart användaren bör gå."
}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) return new Response(JSON.stringify({ error: 'För många förfrågningar, försök igen om en stund.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (aiRes.status === 402) return new Response(JSON.stringify({ error: 'AI-krediter slut.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const t = await aiRes.text();
      console.error('AI gateway error', aiRes.status, t);
      return new Response(JSON.stringify({ error: 'AI-fel' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await aiRes.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let parsed: any;
    try { parsed = JSON.parse(content); } catch {
      parsed = { primary: { path: '/', label: 'Startsida', reason: 'Kunde inte tolka frågan' }, alternatives: [], answer: content };
    }

    // Validera & korrigera paths så AI:n inte hittar på 404-länkar
    const validRoutes = new Set(ROUTES.map(r => r.path));
    const partnerSlugs = new Set((partners || []).map((p: any) => p.slug));
    const partnerNameToSlug = new Map((partners || []).map((p: any) => [String(p.name).toLowerCase(), p.slug]));

    const fixPath = (path: string, label?: string): string | null => {
      if (!path || typeof path !== 'string') return null;
      if (validRoutes.has(path)) return path;
      if (path.startsWith('/partner/')) {
        const slug = path.split('/')[2];
        if (partnerSlugs.has(slug)) return path;
      }
      // AI gav t.ex. "/norteam" – mappa mot partner-slug
      const maybeSlug = path.replace(/^\//, '').split('/')[0];
      if (partnerSlugs.has(maybeSlug)) return `/partner/${maybeSlug}`;
      // Eller mappa via label
      if (label) {
        const slug = partnerNameToSlug.get(label.toLowerCase());
        if (slug) return `/partner/${slug}`;
      }
      return null;
    };

    if (parsed.primary) {
      const fixed = fixPath(parsed.primary.path, parsed.primary.label);
      if (fixed) parsed.primary.path = fixed;
      else parsed.primary = { path: '/valj-partner', label: 'Hitta partner', reason: 'Vi kunde inte hitta exakt sida – börja här' };
    }
    if (Array.isArray(parsed.alternatives)) {
      parsed.alternatives = parsed.alternatives
        .map((a: any) => {
          const f = fixPath(a.path, a.label);
          return f ? { ...a, path: f } : null;
        })
        .filter(Boolean);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('smart-search error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Okänt fel' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
