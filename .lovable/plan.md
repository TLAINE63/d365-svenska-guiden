# Plan: Exponeringsvy – partners visade i filter och jämförelser (utan klick)

## Bakgrund
Det finns redan två datakällor som fångar "visad men inte klickad":
- `partner_filter_exposures` – varje gång en partner renderats i en filtrerad partnerväljare (2 381 rader, 36 partners, sedan 2026-05-17). Har `partner_slug`, `page_path`, `filter_context` (jsonb med valda filter), `session_id`, deduplicerad 24 h per session/partner/sida.
- `partner_engagement_events` – impressions: `partner_filter_impression` (458), `partner_list_impression` (1 076), `partner_match_impression` (188), `partner_comparison_impression` (12), `partner_added_to_comparison` (2).

## Vad som byggs

**Ny vy `partner_exposure_monthly`** – en rad per partner + månad som slår ihop båda källorna:

Från `partner_filter_exposures`:
- `filter_exposures` – totalt antal visningar i filtrerade listor
- `comparison_page_exposures` – visningar på jämförelsesidor (page_path innehåller jamfor/compare)
- `industry_page_exposures` – visningar på branschsidor (/branscher%)
- `other_page_exposures` – övriga sidor (produktfilter m.m.)
- `unique_sessions` – antal unika sessioner som sett partnern

Från `partner_engagement_events`:
- `match_impressions`, `list_impressions`, `comparison_impressions`, `added_to_comparison`

Samt räknat framåt:
- `click_through_pct` – andel exponeringar som ledde till profilvisning samma månad (kopplas mot `partner_card_metrics_monthly.profile_views`), NULL om noll exponeringar.

## Tekniska detaljer
- En enda migration: `CREATE VIEW public.partner_exposure_monthly WITH (security_invoker = true)`, byggd med CTE:er över de två källtabellerna, FULL JOIN på partner_slug + period_month.
- Ingen ny tabell, inga GRANT/RLS-ändringar; åtkomst via service_role i edge-funktioner som i dag.
- Verifieras efteråt med SELECT (data finns redan, så vi ser riktiga siffror direkt).
- Vyn blir underlag för månadsrapportens "visad i filtreringar/jämförelser"-block (instruktion 2 byggs separat).

## Utanför scope
- Inga frontendändringar.
- Eventuell kompletterande spårning (t.ex. dedup av impressions i `partner_engagement_events`) tas i ett senare steg om siffrorna visar sig dubbelräkna.
