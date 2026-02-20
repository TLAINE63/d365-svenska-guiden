const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PartnerInput {
  id: string;
  name: string;
  description: string | null;
  applications: string[];
  industries: string[];
  geography: string[];
  product_filters: Record<string, {
    industries?: string[];
    companySize?: string[];
    geography?: string | string[];
    ranking?: number;
    productDescription?: string;
    customerExamples?: string[];
  }>;
}

interface UserCriteria {
  application: string;
  productKey: string; // 'bc' | 'fsc' | 'sales' | 'service'
  industry: string;
  geography: string;
  companySize: string;
  workload?: string; // CRM workload focus
  preferCrmOnly?: boolean; // For CRM apps: prefer partners without ERP products
}

interface PartnerMatch {
  id: string;
  score: number; // 0-100
  matchReason: string; // Short Swedish explanation
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { partners, criteria }: { partners: PartnerInput[]; criteria: UserCriteria } = await req.json();

    if (!partners || !criteria) {
      return new Response(
        JSON.stringify({ error: 'Missing partners or criteria' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build a concise representation of each partner for the AI
    const partnerSummaries = partners.map(p => {
      const productFilter = p.product_filters?.[criteria.productKey];
      const productDesc = productFilter?.productDescription || '';
      const customerExamples = productFilter?.customerExamples?.slice(0, 3).join(', ') || '';
      const pfIndustries = productFilter?.industries?.slice(0, 5).join(', ') || '';

      return `ID: ${p.id}
Namn: ${p.name}
Beskrivning: ${(p.description || '').substring(0, 400)}
Produktbeskrivning (${criteria.application}): ${productDesc}
Branschfokus för ${criteria.application}: ${pfIndustries}
Kundexempel: ${customerExamples}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `Du är en expert på Microsoft Dynamics 365 och hjälper svenska företag att hitta rätt implementeringspartner. 
Du ska analysera partnerbeskrivningar och matcha dem mot kundens specifika behov.
Svara ALLTID med giltig JSON i exakt det format som anges. Inga extra kommentarer.`;

    const userPrompt = `Analysera dessa ${partners.length} Dynamics 365-partners och ranka dem efter hur väl de matchar kundens behov.

KUNDPROFIL:
- Applikation: ${criteria.application}
- Bransch: ${criteria.industry || 'Ej specificerat'}
- Geografi: ${criteria.geography || 'Ej specificerat'}
- Antal anställda: ${criteria.companySize || 'Ej specificerat'}${criteria.workload ? `\n- Workload-fokus: ${criteria.workload}` : ''}${criteria.preferCrmOnly ? '\n- OBS: Kunden implementerar CRM (inte ERP). En CRM-specialist utan ERP-bakgrund är oftast ett bättre val för ren CRM-implementation.' : ''}

PARTNERS ATT UTVÄRDERA:
${partnerSummaries}

INSTRUKTIONER:
1. Ge varje partner ett matchningspoäng 0-100 baserat på:
   - Hur väl deras beskrivning och erbjudande matchar den valda applikationen och workload (40%)
   - Branscherfarenhet (30%)
   - Geografi och storlek (20%)
   - Kundexempel och referensers relevans (10%)
${criteria.preferCrmOnly ? `
2. VIKTIGT för CRM-appar: Om en partner har bred ERP-kompetens (Business Central, Finance & SCM) men begränsad CRM-specialisering, sänk poängen med 10-15 enheter jämfört med en renodlad CRM-partner med liknande profil. En CRM-specialist som inte säljer ERP bör premieras.
` : ''}
${criteria.preferCrmOnly ? '3.' : '2.'} Skriv en kort motivering på svenska (max 15 ord) per partner som förklarar varför de matchar eller inte.

Svara med JSON i EXAKT detta format (inga andra fält):
{
  "matches": [
    { "id": "<partner-id>", "score": <0-100>, "matchReason": "<kort motivering på svenska>" }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2, // Low temp for consistent ranking
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errText = await response.text();
      console.error('AI gateway error:', response.status, errText);
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    // Parse AI response - strip markdown code blocks if present
    let parsed: { matches: PartnerMatch[] };
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', raw: content }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('match-partners error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
