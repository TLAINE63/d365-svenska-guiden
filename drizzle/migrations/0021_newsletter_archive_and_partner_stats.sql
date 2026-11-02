ALTER TABLE public.newsletter_content ADD COLUMN IF NOT EXISTS stats_month text;

-- Arkivera septemberbrevet (nuvarande sparade version) för senare jämförelse.
INSERT INTO public.newsletter_content (id, subject, summary, body, updated_at, stats_month)
SELECT 'arkiv-2026-09', subject, summary, body, updated_at, NULL
FROM public.newsletter_content WHERE id = 'current'
ON CONFLICT (id) DO NOTHING;

-- Partnerns egen månadsstatistik till månadsbrevet (aggregerat, anonymt).
CREATE OR REPLACE FUNCTION public.partner_month_stats(_slug text, _start timestamptz, _end timestamptz)
RETURNS TABLE(
  card_views bigint, filter_views bigint, comparisons bigint, match_recommended bigint,
  profile_visits bigint, saved bigint, onward_clicks bigint, unique_visitors bigint, site_card_views bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $fn$
  SELECT
    count(*) FILTER (WHERE e.event_level = 1),
    count(*) FILTER (WHERE e.event_name = 'partner_filter_impression'),
    count(*) FILTER (WHERE e.event_name IN ('partner_comparison_impression','partner_added_to_comparison','lagg_till_jamforelse')),
    count(*) FILTER (WHERE e.event_name = 'partner_match_recommended'),
    (SELECT count(*) FROM public.partner_profile_views v WHERE v.partner_slug = _slug AND v.viewed_at >= _start AND v.viewed_at < _end),
    count(*) FILTER (WHERE e.event_name = 'partner_saved'),
    count(*) FILTER (WHERE e.event_name IN ('klick_utgaende_partnersajt','klick_kundcase','partner_case_click','partner_competency_click','klick_boka_demo','partner_intro_request','klick_uppskattning_kostnad')),
    count(DISTINCT e.visitor_id),
    (SELECT count(*) FROM public.partner_engagement_events a WHERE a.event_level = 1 AND a.occurred_at >= _start AND a.occurred_at < _end)
  FROM public.partner_engagement_events e
  WHERE e.partner_slug = _slug AND e.occurred_at >= _start AND e.occurred_at < _end
$fn$;

REVOKE ALL ON FUNCTION public.partner_month_stats(text, timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.partner_month_stats(text, timestamptz, timestamptz) TO service_role;

-- Oktoberbrevet blir nytt aktuellt utkast (redigeras i /redaktion).
UPDATE public.newsletter_content SET
  stats_month = '2026-10',
  updated_at = now(),
  subject = 'd365.se i oktober: rekordmånad, er egen statistik och nya vägar till er profil',
  summary = $txt$**Sammanfattat: oktober gav flest unika besökare hittills.**
538 unika besökare (+32 %) och 1 093 besök (+37 %). **Nytt i detta brev: er egen statistik**, alltså hur ofta ert partnerkort visats, varit med i filtreringar och jämförelser och hur många som klickat vidare. **Det viktigaste du kan göra nu: håll profilen komplett, det är den köparna jämför.**$txt$,
  body = $txt$## Oktober 2026 på d365.se
- 538 unika besökare (+32 % mot september)
- 1 093 besök (+37 %)
- 2 080 sidvisningar (+19 %)
- 615 interaktioner med partnerkort och partnerprofiler (+42 %), till exempel profilbesök, sparade partners och jämförelser
- 28 olika partners fick besök på sina profiler (19 i september)
- Partnerkorten visades drygt 12 300 gånger i listor, filter, matchningar och jämförelser
- Sajten visades drygt 25 600 gånger i Googles sökresultat (+26 %)
- 11 nya analyser i Aktuellt om förändringar i Dynamics 365, två nya INSIDE-artiklar och 10 nya inlägg i Partnernytt (67 publicerade totalt)

[STATISTIK]

## AI-synlighet
- 202 besök från AI-crawlers i oktober (+13 %)
- ClaudeBot och GPTBot står för merparten. Nytt för månaden är ChatGPT-User och OAI-SearchBot, som hämtar sidor när någon ställer en fråga i ChatGPT.

## businesscentral.se och d365guide.com
Era Business Central-uppgifter visas automatiskt på businesscentral.se, och er profilering på d365.se slår igenom på nordiska d365guide.com. En uppdatering på ett ställe räcker.

## Nyheter i oktober
- **Ny startsida.** Fyra tydliga vägar in, bland annat "Vi söker partner eller expert", och en rullande rad med publicerade partners logotyper som leder direkt till er profil.
- **Grundprofiler på produktsidorna.** Sidorna för Business Central, Finance & Supply Chain och CRM listar nu även grundprofiler, alltid efter verifierade partners.
- **Tydligare kontaktvägar.** På profiler och jämförelser ser köparen direkt hur hen kontaktar er. Förfrågningar skickas bara med köparens samtycke per partner, till högst tre partners.
- **d365.se INSIDE.** Intervjuer med partners som artikel och video, kopplade till partnerns profil. Först ut är 4PS och Vivicta.
- **Tilläggslösningar har egen meny.** 219 lösningar, filtrerade på samma branscher som branschsidorna och med Microsofts officiella produktnamn.
- **Aktuellt och kostnadsguider.** Egna analyser av förändringar i Dynamics 365 och kostnadsguider med tydligt redovisade antaganden.
- **Rådgivning för köpare.** Köpare kan ställa en fråga eller prata med oss om sitt behov, kostnadsfritt och utan förpliktelser.
- **Remote Assist borttaget.** Microsoft har avvecklat Dynamics 365 Remote Assist, så vi har tagit bort det från jämförelser, kalkylatorer och kravmaterial.

## Det här kan du göra nu
- Titta på er statistik ovan: syns kortet ofta men få öppnar profilen, är det profiltexten och logotypen som behöver ses över
- Beskriv typiska kunder och projekt per produkt. Det väger tyngst vid matchning.
- Lägg in kundexempel, events och webbinarier
- Publicera nyheter och kundcase i Partnernytt
- Vill ni vara med i d365.se INSIDE? Svara på detta mejl.

[KNAPP]

Frågor? Svara gärna på detta mejl.

Vänliga hälsningar,
**Thomas Laine och Michael Uhman**
d365.se$txt$
WHERE id = 'current';