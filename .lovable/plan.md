
# Ny månadsrapport för partners

Ersätter dagens layout i `send-partner-monthly-report` med den struktur du föreslagit. Följer sajtens design (mörk navy header, orange accent `#ea580c`, ljus body – samma som befintlig rapport).

## Innehåll i den nya rapporten

Rapporten byggs i sex sektioner, alla renderas i samma 640px-container som idag:

1. **Header** – Navy band, "Månadsrapport" chip, partnernamn, period (YYYY/MM/DD – YYYY/MM/DD).

2. **Siffror (jämförelsetabell)** – Denna månad vs. föregående period. Rader:
   - Profilvisningar
   - Visningar i jämförelsevyn
   - Klick till er webbplats
   - Visningar av er i branschlistor
   - Delta i procent per rad (grön upp / röd ner, neutralt vid 0-bas)
   - Kort fotnot: *"Kontaktförfrågningar skickas till er i realtid via e-post."*

3. **Vilka tittade** – Kort inledning om att vi aldrig lämnar ut enskilda företagsnamn.
   - "*[N] identifierade företag besökte er profil, varav [n] inom [bransch 1] och [n] inom [bransch 2]*" (topp-2 branscher från `snitcher_visits.company_industry`).
   - "*[N] av dessa besökte även behovsanalysen / kravspecifikation / jämförelsevyn*" (härleds från `visited_urls`).
   - "*Vanligaste vägen in: [organiskt sök / branschguide / jämförelsevyn]*" (från referrer + första URL i sessionen).

4. **Var ni syntes** – Auto-genererad lista:
   - Branschguider partnern listas på med visningar under perioden (join `partner_filter_exposures` + `industry_pages`).
   - Partnernytt-publiceringar under perioden (från `partner_news` filtrerat på `partner_id` + `published_at`).
   - Redaktionellt fält (admin kan lägga till manuella rader per partner, t.ex. intervju).

5. **Nästa period** – Två delar:
   - **Plattformsuppdateringar** (globalt, redaktionellt) – hämtas från `site_settings.key = 'monthly_report_next_period'` (markdown-liknande punktlista).
   - **Vad ni kan göra** – standard-CTA (komplettera profil, events, boka D365 Talks-intervju).

6. **Nytt på sajten** – Redaktionell "changelog" per rapportmånad, hämtas från `site_settings.key = 'monthly_report_changelog'`. Första utskicket (maj–juli) fylls manuellt av dig i admin.

Avslutas med kontaktnamn/mejl (från `site_settings.key = 'monthly_report_contact'`) och samma orange CTA-knapp till partnerprofilen.

## Tekniska ändringar

**Edge function `supabase/functions/send-partner-monthly-report/index.ts`**
- Lägg till `buildStats` för både aktuell period (t.ex. senaste 30 dagarna) och föregående lika lång period. Returnera `current` + `previous` per mätpunkt.
- Ny mätpunkt "Visningar i jämförelsevyn": räknas från `partner_profile_views` där `page_source ILIKE '/jamforpartners%'` ELLER (om egen `view_type` saknas) via en ny `view_type = 'compare_view'` som skickas från jämförelsesidan.
- Ny mätpunkt "Visningar i branschlistor": count av `partner_filter_exposures` där `page_path ILIKE '/branscher/%'` eller `filter_context ? 'industry'`.
- Identifierade företag: aggregera `snitcher_visits.company_industry` för topp-2 branscher, och räkna hur många av dessa `visited_urls` innehåller `/behovsanalys`, `/kravspecifikation`, `/jamforpartners`.
- "Vanligaste vägen in": härleds från `referrer` + tidigaste URL i `visited_urls` per session (buckets: organiskt sök, branschguide, jämförelsevyn, direktlänk).
- Hämta partnerns `partner_news` under perioden och de branschguider partnern exponerats på.
- Läs `site_settings` för `monthly_report_next_period`, `monthly_report_changelog`, `monthly_report_contact` (namn + mejl) – ren text, escapas.
- Ny `buildHtml` med sex sektionerna ovan enligt befintlig färgpalett (navy `#0f1f3d`, orange `#ea580c`, off-white `#f8fafc`, slate-text `#334155`/`#64748b`).

**Frontend/spårning**
- I `src/pages/ComparePartners.tsx`: skicka `track-partner-view` med `view_type = 'compare_view'` för varje jämförd partner (idempotent per session).

**Admin**
- Utöka global inställningssida (befintlig admin-vy för `site_settings`) med tre textfält:
  - "Månadsrapport – Nytt på sajten" (changelog)
  - "Månadsrapport – Nästa period"
  - "Månadsrapport – Kontaktperson" (namn, mejl)
- Ingen ny tabell krävs.

**Bakåtkompatibilitet**
- Behåll query-parametrarna (`dryRun`, `partnerSlug`, `days`, `sinceBeginning`) så förhandsvisning/utskick från admin fortsätter fungera.
- Den gamla "Aktivitet i ekosystemet"-blocken utgår (ersätts av "Nytt på sajten" + "Nästa period"), men logik för `identifiedCompanies` återanvänds i sektion 3.

## Leveransordning
1. Edge function-uppdatering (stats + HTML).
2. `compare_view` tracking i `ComparePartners.tsx`.
3. Admin-fält för de tre `site_settings`-nycklarna.
4. Fyll changelogen för maj–juli och skicka test-dry-run till en partner innan riktigt utskick.
