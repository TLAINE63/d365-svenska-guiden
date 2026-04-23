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
    revenue?: string[];
    geography?: string | string[];
    ranking?: number;
    productDescription?: string;
    customerExamples?: string[];
    aiCapabilities?: string[];
    aiProjectCount?: string;
    aiCaseDescription?: string;
    aiBusinessImpact?: string;
  }>;
}

interface UserCriteria {
  application: string;
  productKey: string; // 'bc' | 'fsc' | 'sales' | 'service'
  industry: string;
  geography: string;
  companySize: string;
  revenue?: string;
  workload?: string; // CRM workload focus
  preferCrmOnly?: boolean;
  aiInterest?: 'high' | 'medium' | 'none';
  localPreference?: 'very' | 'somewhat' | 'not';
  platformNeeds?: string[];
  additionalApps?: string[];
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
      const allPfIndustries = productFilter?.industries || [];
      const pfIndustries = allPfIndustries.slice(0, 5).join(', ') || '';
      const industryFocusCount = allPfIndustries.length;
      const industryFocusLine = industryFocusCount > 0
        ? `\nBranschfokus-bredd för ${criteria.application}: ${industryFocusCount} bransch${industryFocusCount === 1 ? ' (extremt nischad — endast 1 bransch vald, max är 3)' : industryFocusCount === 2 ? 'er (fokuserad — 2 av max 3)' : 'er (bred profil — alla 3 möjliga branscher valda)'}`
        : '';
      
      // AI capability summary
      const aiCaps = productFilter?.aiCapabilities || [];
      const aiProjects = productFilter?.aiProjectCount || '';
      const aiCase = productFilter?.aiCaseDescription || '';
      const aiImpact = productFilter?.aiBusinessImpact || '';
      
      // Calculate AI level from capabilities
      let aiLevel = 'Ingen';
      if (aiCaps.length > 0) {
        const hasAdvanced = aiCaps.some((c: string) => c.includes('-adv-') || c === 'ai-advanced' || c === 'bc-azure');
        const hasPartner = aiCaps.some((c: string) => c.includes('-partner') || c === 'ai-partner' || c === 'bc-agent' || c.includes('ai-automation') || c.includes('ai-prediction') || c.includes('ai-agents'));
        if (hasAdvanced) aiLevel = 'Avancerad (Azure AI / ML)';
        else if (hasPartner) aiLevel = 'Integration (Copilot Studio / agenter)';
        else aiLevel = 'Enabled (Microsoft standard AI)';
      }
      
      const aiSummary = aiCaps.length > 0 
        ? `\nAI-nivå: ${aiLevel} (${aiCaps.length} kapabiliteter${aiProjects ? `, ${aiProjects} projekt` : ''})${aiCase ? `\nAI-case: ${aiCase}` : ''}${aiImpact ? `\nAI-affärseffekt: ${aiImpact}` : ''}`
        : '\nAI-nivå: Ingen registrerad AI-kompetens';

      // Office cities for local presence evaluation
      const officeCities = (p as any).office_cities || [];
      const platformCaps = (p as any).platform_capabilities || [];

      // Target audience (soft signal – missing = neutral)
      const targetSizes = productFilter?.companySize || [];
      const targetRevenues = productFilter?.revenue || [];
      const targetAudienceLine = (targetSizes.length > 0 || targetRevenues.length > 0)
        ? `\nMålgrupp (${criteria.application}): ${targetSizes.length > 0 ? `anställda ${targetSizes.join(', ')}` : 'anställda ej angivet'}; ${targetRevenues.length > 0 ? `omsättning MSEK ${targetRevenues.join(', ')}` : 'omsättning ej angiven'}`
        : `\nMålgrupp (${criteria.application}): ej angiven (neutral – varken bonus eller avdrag)`;

      return `ID: ${p.id}
Namn: ${p.name}
Beskrivning: ${(p.description || '').substring(0, 400)}
Produktbeskrivning (${criteria.application}): ${productDesc}
Branschfokus för ${criteria.application}: ${pfIndustries}
Kundexempel: ${customerExamples}
Kontorsorter: ${officeCities.length > 0 ? officeCities.join(', ') : 'Ej angivet'}
Plattformskompetens: ${platformCaps.length > 0 ? platformCaps.join(', ') : 'Ej angivet'}${industryFocusLine}${targetAudienceLine}${aiSummary}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `Du är en expert på Microsoft Dynamics 365 och hjälper svenska företag att hitta rätt implementeringspartner.
Du ska analysera partnerbeskrivningar och RANGORDNA dem mot kundens specifika behov.

VIKTIGT – HÅRDA FILTER REDAN APPLICERADE:
Alla partners som skickas till dig har REDAN passerat hårda filter på produkt och (om angiven) bransch och geografi. Du ska RANGORDNA samtliga partners som skickas – aldrig exkludera någon från resultatet och aldrig ge en partner score 0 enbart för att branschmatchen är svag. Alla partners i listan ska få ett ID i din "matches"-array.

Svara ALLTID med giltig JSON i exakt det format som anges. Inga extra kommentarer.`;

    const userPrompt = `Analysera dessa ${partners.length} Dynamics 365-partners och ranka dem efter hur väl de matchar kundens behov.

KUNDPROFIL:
- Applikation: ${criteria.application}
- Bransch: ${criteria.industry || 'Ej specificerat'}
- Geografi: ${criteria.geography || 'Ej specificerat'}
- Antal anställda: ${criteria.companySize || 'Ej specificerat'}${criteria.revenue ? `\n- Omsättning: ${criteria.revenue} MSEK` : ''}${criteria.workload ? `\n- Workload-fokus: ${criteria.workload}` : ''}${criteria.additionalApps && criteria.additionalApps.length > 0 ? `\n- Övriga applikationer av intresse: ${criteria.additionalApps.join(', ')} – kunden vill gärna att partnern även har kompetens inom dessa Dynamics 365-applikationer` : ''}${criteria.localPreference && criteria.localPreference !== 'not' ? `\n- Lokal närvaro: ${criteria.localPreference === 'very' ? 'Mycket viktigt – kunden vill ha en partner med kontor nära sin verksamhet' : 'Ganska viktigt – lokal närvaro är en fördel men inte avgörande'}` : ''}${criteria.platformNeeds && criteria.platformNeeds.length > 0 ? `\n- Önskad plattformskompetens: ${criteria.platformNeeds.join(', ')} – kunden vill att partnern har erfarenhet av dessa delar av Microsofts plattform` : ''}${criteria.aiInterest && criteria.aiInterest !== 'none' ? `\n- AI-intresse: ${criteria.aiInterest === 'high' ? 'Högt – kunden vill ha en partner med stark kompetens inom Microsoft Copilot, AI-agenter, Copilot Studio och/eller Azure AI Foundry' : 'Medelhögt – kunden är intresserad men det är inte avgörande'}` : ''}${criteria.preferCrmOnly ? '\n- OBS: Kunden implementerar CRM (inte ERP). En CRM-specialist utan ERP-bakgrund är oftast ett bättre val för ren CRM-implementation.' : ''}

PARTNERS ATT UTVÄRDERA:
${partnerSummaries}

INSTRUKTIONER:
1. RANGORDNINGSPRIORITET (viktigast först — denna ordning är ALLTID giltig):
   a) BRANSCH är ALLTID den viktigaste faktorn. En partner med dokumenterad erfarenhet i kundens bransch ("${criteria.industry || 'Ej specificerat'}") ska ALLTID rankas högre än en partner utan branschfokus, även om den senare har starkare övrig profil. Branschmatch baseras på partnerns "Branschfokus för ${criteria.application}" och kundexempel.
   b) PRODUKT är näst viktigast${criteria.application && criteria.application !== 'Alla' ? ` (kunden har valt ${criteria.application})` : ' när kunden valt en specifik applikation'}. En partner med tydlig specialisering på den valda applikationen ska rankas högre än en partner med svagare/bredare produktfokus. Använd produktbeskrivning, AI-kompetens för produkten och kundexempel som signaler.
   c) NISCHFOKUS-BONUS (max 3 branscher per produkt är möjligt): Om en partner har angett ENDAST 1 bransch för ${criteria.application} (se "Branschfokus-bredd") OCH den branschen matchar kundens bransch ("${criteria.industry || 'Ej specificerat'}"), ge +6-10 extra poäng — de är extremt fokuserade och därmed en mycket starkare match. Partners med 2 matchande branscher får +3-5. Partners med 3 branscher (max) som matchar får +1-2 (bredare profil).
   d) Övriga faktorer (geografi, storlek, AI-intresse, plattform, lokal närvaro etc.) är mindre viktiga och används endast för att finjustera rankingen MELLAN partners som är likvärdiga på bransch och produkt.

2. Ge varje partner ett matchningspoäng 0-100 enligt följande viktning:
   - Branscherfarenhet (40%) — HÖGSTA PRIO. Stark match = +30-40, bred branschtäckning = +20-30, ingen branschmatch men relevant erfarenhet = +5-15, ingen matchning alls = 0-5.
   - Produktspecialisering / workload-matchning (${criteria.application && criteria.application !== 'Alla' ? '30%' : '20%'}) — Hur väl partnern är specialiserad på ${criteria.application}.
   - Kundexempel och referensers relevans (10%)
   - Geografi och storlek (${criteria.localPreference === 'very' ? '5%' : '10%'})${criteria.localPreference === 'very' ? `
   - Lokal närvaro (10%): Partners med fler kontorsorter och kontor nära kundens geografi ska premieras. Bred rikstäckning är en fördel. Partners utan angiven kontorsort får lägre poäng.` : criteria.localPreference === 'somewhat' ? `
   - Lokal närvaro (bonuspoäng, 5%): Partners med kontor i kundens region får bonus, men det är inte avgörande.` : ''}${criteria.aiInterest === 'high' ? `
     - AI-kompetens (15%): Använd den strukturerade AI-nivån och antalet kapabiliteter/projekt som anges för varje partner. Partners med nivån "Avancerad" ska premieras mest, följt av "Integration" och sedan "Enabled". Fler AI-projekt och tydliga AI-case-beskrivningar ger extra poäng.` : criteria.aiInterest === 'medium' ? `
     - AI-kompetens (bonuspoäng, ej obligatoriskt): Partners med registrerad AI-kompetens får upp till 10 bonus-poäng baserat på nivå och antal kapabiliteter.` : ''}${criteria.platformNeeds && criteria.platformNeeds.length > 0 ? `
   - Plattformskompetens (5-10%): Kunden efterfrågar kompetens inom ${criteria.platformNeeds.join(', ')}. Jämför mot partnerns listade plattformskompetens.` : ''}${criteria.additionalApps && criteria.additionalApps.length > 0 ? `
   - Bred Dynamics 365-kompetens (bonuspoäng, 5%): Kunden är även intresserad av ${criteria.additionalApps.join(', ')}.` : ''}${(criteria.companySize || criteria.revenue) ? `
   - Målgruppsmatch (bonuspoäng, upp till 10%): Varje partner har en "Målgrupp"-rad. Ge +5% bonus om partnerns målgrupp för anställda innehåller kundens "${criteria.companySize || ''}" och +5% bonus om målgruppen för omsättning innehåller kundens "${criteria.revenue || ''}". VIKTIGT: Om partnern angett FLER ÄN 3 värden i en dimension räknas det som "för generellt" – ge då bara 40% av bonusen för den dimensionen (≈2% istället för 5%). Saknar partnern angiven målgrupp eller matchar inte – 0 poäng (neutralt, inget avdrag). Detta är en mjuk signal, ALDRIG hård filtrering, och ALDRIG viktigare än bransch eller produkt.` : ''}
${criteria.preferCrmOnly ? `
3. VIKTIGT för CRM-appar: Om en partner har bred ERP-kompetens (Business Central, Finance & SCM) men begränsad CRM-specialisering, sänk poängen med 10-15 enheter jämfört med en renodlad CRM-partner med liknande profil. En CRM-specialist som inte säljer ERP bör premieras.
` : ''}
${criteria.preferCrmOnly ? '4.' : '3.'} Skriv en kort motivering på svenska (max 15 ord) per partner som förklarar varför de matchar eller inte.

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
