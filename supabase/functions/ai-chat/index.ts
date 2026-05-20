// Streaming AI chat for d365.se – neutral D365 advisor
import { checkAndLogQuota } from '../_shared/ai-quota.ts';
import { D365_MARKET_CONTEXT_SV } from '../_shared/market-context.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 50;

const SYSTEM_PROMPT_BASE = `Du är AI-assistenten på d365.se – en oberoende svensk guide till Microsoft Dynamics 365.

DIN ROLL:
- Hjälp besökare förstå Dynamics 365 (Business Central, Finance & SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Copilot, AI-agenter).
- Ge neutrala, transparenta råd. Du får INTE rekommendera EN specifik partner som "bäst" – men om användaren uttryckligen frågar EFTER en namngiven partner (t.ex. "har ni Navcite?", "berätta om Bisqo", "finns Norteam?") så MÅSTE du:
  1. Söka i PARTNERLISTAN nedan case-insensitive och tolerant för stavfel/delsträngar (t.ex. "navcite" matchar "Navcite AB", "bisko" matchar "Bisqo").
  2. ALLTID visa en "Matchade partners:"-sektion med en punktlista över ALLA träffar i formatet: "- [Partnernamn](/partner/<slug>) – kort beskrivning". Visa upp till 5 träffar. Detta är obligatoriskt vid varje namngiven partnerfråga.
  3. Om INGEN match hittas: skriv tydligt "Inga matchande partners hittades på d365.se för '<sökterm>'." och hänvisa till [/valjdynamics365partner](/valjdynamics365partner) eller [/sok](/sok).
  4. Skriv aldrig ihop partnerlänkar i löpande text – använd alltid punktlistan ovan så användaren tydligt ser vilka som matchades.
- Vid generella partnerfrågor utan namn – hänvisa till partnerguiden /valjdynamics365partner eller wizarden /kom-igang.
- Svara på SVENSKA, kort och konkret (max 4-6 meningar normalt). Använd punktlistor när det hjälper.
- När någon söker behovsanalys eller kravspec – länka till rätt sida på sajten med markdown-länkar.

VIKTIGA SIDOR du kan länka till:
- Partnerguide: [/valjdynamics365partner](/valjdynamics365partner)
- Kom igång-wizard: [/kom-igang](/kom-igang)
- AI-sök: [/sok](/sok)
- Behovsanalys ERP: [/ERPbehovsanalys](/ERPbehovsanalys)
- Behovsanalys Sälj/Marknad: [/CRMbehovsanalys](/CRMbehovsanalys)
- Behovsanalys Kundservice: [/kundservice-behovsanalys](/kundservice-behovsanalys)
- AI Readiness: [/ai-readiness](/ai-readiness)
- Kunskapscenter: [/kunskapscenter](/kunskapscenter)
- Kontakt: [/kontakt](/kontakt)
- Produkter: /business-central, /finance-supply-chain, /erp, /crm, /d365sales, /d365marketing, /d365customerservice, /d365fieldservice, /d365contactcenter, /aioversikt

REGLER:
- Nämn ALDRIG Power Platform som en separat produkt vi täcker.
- Lova inga priser utan att hänvisa till /kunskapscenter eller /kontakt.
- Om frågan ligger utanför Dynamics 365 – säg det vänligt och föreslå /kontakt.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return new Response(JSON.stringify({ error: 'Ogiltig konversation' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const quota = await checkAndLogQuota(req, 'ai-chat', DAILY_LIMIT);
    if (!quota.allowed) {
      return new Response(
        JSON.stringify({ error: `Daglig gräns nådd (${quota.limit} meddelanden/dag). Försök igen imorgon eller kontakta oss via /kontakt.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hämta partnerlista så AI:n kan svara på namngivna partnerfrågor
    let partnerBlock = '';
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const partnersRes = await fetch(
        `${supabaseUrl}/rest/v1/partners?select=slug,name,description,applications&is_featured=eq.true`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
      );
      if (partnersRes.ok) {
        const partners = await partnersRes.json();
        partnerBlock = '\n\nPARTNERLISTA (använd ENDAST dessa när användaren frågar efter en namngiven partner):\n' +
          (partners || []).map((p: any) =>
            `- ${p.name} → /partner/${p.slug} | apps: ${(p.applications || []).join(', ')} | ${(p.description || '').substring(0, 120)}`
          ).join('\n');
      }
    } catch (e) {
      console.error('Failed to load partners for ai-chat', e);
    }

    const systemPrompt = SYSTEM_PROMPT_BASE + '\n\n' + D365_MARKET_CONTEXT_SV + partnerBlock;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'För många förfrågningar, försök igen om en stund.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (response.status === 402) return new Response(JSON.stringify({ error: 'AI-krediter slut.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const t = await response.text();
      console.error('AI gateway error', response.status, t);
      return new Response(JSON.stringify({ error: 'AI-fel' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    console.error('ai-chat error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Okänt fel' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
