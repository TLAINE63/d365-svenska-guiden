# Teaser-månadsrapport till Basic-partners

Ett eget, kortare mejl till partners med `profile_level = 'basic'` som visar deras faktiska (blygsamma) siffror, sätter dem i relation till vad verifierade partners får, och leder till /partnerprogram.

## Utgångsläge (verklig data)

- 14 Basic-partners i databasen. 8 har admin-kontaktmejl, 4 har publik e-post.
- Exponeringsdata för Basic-korten är tunn: 16 loggade händelser i augusti fördelat på 13 partners.

Därför bygger teaserns trovärdighet på tre delar: partnerns egna siffror (även små), marknadssiffror för hela d365.se, och en tydlig "så här ser det ut för en verifierad partner"-jämförelse.

## Mejlets layout

Samma visuella ram som den verifierade månadsrapporten (header, typografi, färger), men kortare – ca en A4.

```text
┌──────────────────────────────────────────────┐
│  d365.se · Månadsöversikt · augusti 2026     │
├──────────────────────────────────────────────┤
│  Hej {Partnernamn},                          │
│  Så här syntes ni på d365.se i augusti.      │
├──────────────────────────────────────────────┤
│  ERA SIFFROR                                 │
│   Visningar av er profil-rad     12          │
│   Sökningar där ni matchade      34          │
│   Branschsidor ni listades på     3          │
├──────────────────────────────────────────────┤
│  SÅ SER MARKNADEN UT                         │
│   Besökare på d365.se            X XXX       │
│   Behovsanalyser/kravspec         XX         │
│   Partnerjämförelser              XX         │
│   Leads förmedlade till partners  XX         │
├──────────────────────────────────────────────┤
│  DETTA MISSAR NI IDAG                        │
│   ✓ Kontaktuppgifter och kontaktperson       │
│   ✓ Kundcase, kompetenser, AI-profil         │
│   ✓ Med i jämförelser och partnerväljaren    │
│   ✓ Mottagare av förmedlade underlag/leads   │
│   ✓ Egen månadsrapport med full statistik    │
│   Snitt för verifierad partner i augusti:    │
│   XXX exponeringar, XX profilbesök           │
├──────────────────────────────────────────────┤
│   [ Se partnerprogrammet och priser ]        │
│   → d365.se/partnerprogram                   │
├──────────────────────────────────────────────┤
│  Vill du se din profil som den ser ut idag?  │
│  Svara på mejlet så går vi igenom den.       │
│  Thomas Laine · thomas.laine@dynamicfactory.se│
└──────────────────────────────────────────────┘
```

Tonen är rådgivande och transparent: inga uppblåsta siffror, låga tal skrivs ut som de är och kompletteras med marknadskontexten. Om partnern har noll exponeringar visas raden som "–" med texten att Basic-profiler bara syns i begränsade ytor.

## Admin

Ny flik **Basic-teaser** bredvid befintliga partnerrapporter i admin (samma mönster som `AdminPartnerReportsTab`):

- Periodväljare (månad), knapp **Generera utkast** för alla Basic-partners.
- Tabell: partner, mottagarmejl (redigerbart fält – många saknar mejl), exponeringar, status, senast skickat.
- Kryssrutor + **Förhandsgranska** (desktop/mobil, samma iframe-preview som idag), **Skicka testmejl till mig**, **Godkänn & skicka valda**.
- Redigerbar intro-text och redigerbar "Detta missar ni"-punktlista, sparad i `site_settings` (`basic_teaser_intro`, `basic_teaser_benefits`).
- Ingen automatisk cron – utskick sker alltid manuellt efter granskning, som för den verifierade rapporten.

## Teknisk plan

1. `supabase/functions/manage-partner-reports/basicTeaser.ts` – ny modul med `buildBasicTeaserStats()` (partnerns exponeringar från `partner_engagement_events` + `partner_filter_exposures`, marknadssiffror från `visitor_analytics`/`funnel_events`/`leads`, snitt för verifierade partners) och `renderBasicTeaserHtml()`.
2. Nya actions i `manage-partner-reports/index.ts`: `basic_teaser_generate`, `basic_teaser_list`, `basic_teaser_update`, `basic_teaser_preview`, `basic_teaser_send`, `basic_teaser_send_test`. Samma admin-JWT-verifiering.
3. Utkast lagras i befintlig `partner_report_drafts` med `subject`-prefix och en `stats.kind = 'basic_teaser'`-markör, så ingen ny tabell behövs; listning filtrerar på den markören.
4. Ny komponent `src/components/AdminBasicTeaserTab.tsx` + registrering i admin-dashboardens flikar.
5. Länkar i mejlet: `https://d365.se/partnerprogram` med UTM-taggar (`?utm_source=basic-teaser&utm_medium=email`) så klicken kan följas upp.

## Utanför scope

Ingen automatisk schemaläggning, inga nya spårningspunkter på Basic-korten i detta steg (kan läggas till separat om exponeringssiffrorna behöver bli fylligare).
