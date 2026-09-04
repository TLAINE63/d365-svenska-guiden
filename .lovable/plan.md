# Plan: Bygg ut aggregeringsvyer för partnerhändelser per månad

## Bakgrund
Vyerna `partner_card_event_monthly` och `partner_card_form_conversion_monthly` finns redan (skapade i Steg 1 av händelsemätningen). De täcker i dag händelser i `partner_engagement_events` per partner/månad/korttyp/produktområde, samt kvoten `formular_paborjat → formular_skickat`. `partner_events` är webbinarie-/eventtabellen och ingår inte i händelseaggregeringen.

## Vad som byggs

1. **Utvidga månadsaggregeringen** med en ny samlad vy `partner_card_metrics_monthly` byggd ovanpå `partner_card_event_monthly`, med per partner + månad + korttyp:
   - `profile_views` (partner_profile_view)
   - `forms_started` / `forms_submitted` + `form_conversion_pct` (befintlig kvotlogik återanvänds)
   - `shortlist_saves` (spara_shortlist)
   - `outbound_clicks` (klick_utgaende_partnersajt)
   - `ai_insight_reads` / övriga nivå-2/nivå-3-händelser som redan loggas (t.ex. jämförelse, case-klick)
   - Alla kolumner summeras med `FILTER (WHERE event_name = ...)` så att nya händelsetyper enkelt kan läggas till.

2. **Behåll de två befintliga vyerna orörda** (de används redan av rapportlogik) — den nya vyn blir den samlade rapportytan.

3. **Aktuell datastatus**: de nya händelsetyperna (spara_shortlist, formular_paborjat/skickat, klick_utgaende_partnersajt) har ännu inga rader i tabellen, så vyerna verifieras strukturellt och med testdata via SELECT.

## Tekniska detaljer
- En enda migration: `CREATE OR REPLACE VIEW public.partner_card_metrics_monthly` som läser från `partner_card_event_monthly`.
- Ingen ny tabell, inga GRANT/RLS-ändringar (vyer ärver basobjektets säkerhet; åtkomst sker via service_role i edge-funktioner som i dag).
- Efter godkänd migration: verifiera med SELECT att vyerna returnerar korrekta kolumner.
- Inga frontendändringar i detta steg — vyerna matar senare månadsrapporten (instruktion 2).

## Not
`partner_events` (webbinarier) aggregeras inte här eftersom den tabellen innehåller publicerade event, inte besökshändelser. Säg till om du även vill ha en månadsvy över publicerade partner-event.
