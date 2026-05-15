## Mål
Per-partner försäljningsunderlag i Admin, redo att klistras in i införsäljningsmail eller mailas till dig direkt. Endast synligt för admin.

## Vad som byggs

### 1. Ny tracking: Filtreringsvisningar
Idag loggar vi bara klick på partnerkort, profilbesök och hemsidesklick. Vi loggar INTE när en partner visas i filterresultat (på `/valj-partner`, `/branschlosningar/*`, produktsidor m.fl.). Det bygger jag nu.

- Ny tabell `partner_filter_exposures`: `partner_slug`, `partner_id`, `page_path`, `filter_context` (jsonb: vald produkt/bransch/storlek/geografi), `session_id`, `viewed_at`, `ip_anonymized`.
- Ny edge function `track-filter-exposure` (service role insert, IP-mask, samma cookie-consent-regel som visitor tracking).
- Hook `useTrackFilterExposure(visiblePartners, context)` som anropas från `ValjPartner.tsx` och andra ställen där partners listas. Debouncing: max 1 rad per session+partner+page per 24h (kollas client-side via sessionStorage först, server-side via unique constraint).
- Exkluderar admin-trafik och partner-trafik (samma logik som befintlig visitor tracking).

### 2. Ny edge function: `partner-sales-summary`
Tar `partnerSlug` + `adminToken`, returnerar JSON med:
- **Sajttotaler** (30d/90d): unika besökare, sidvisningar (från `visitor_analytics`).
- **Per-partner exponering** (30d/90d):
  - Filtreringsvisningar (antal + topp 10 page_paths + topp filter-kontext)
  - Klick på partnerkort (`partner_profile_views.view_type = 'card_click'`)
  - Profilbesök (`partner_profile_views.view_type = 'profile_visit'`)
  - Klick till partnerns hemsida (`partner_clicks`)
- **Identifierade företag** (Snitcher, 90d): företagsnamn, bransch, storlek, antal sessioner som rört partnerns profil ELLER relaterade produkt-/branschsidor (matchas mot partnerns `applications` + `industries`).
- **Färdig text-sammanställning** (rendrad server-side) som är klar att klistras in.

### 3. Admin UI – ny sektion på partnerredigering
I `AdminPartnerDashboardTab` (när admin klickar upp en partner), under befintliga statistik-kortet, ny utfällbar sektion **"Försäljningsunderlag"**:
- Visar all data ovan i läsbar layout (siffror + tabell över identifierade företag).
- Två knappar:
  - **Kopiera som text** (kopierar färdig formaterad text till urklipp)
  - **Maila till mig** (skickar HTML-version till thomas.laine@dynamicfactory.se)
- Synligt endast för admin – ingen ändring i partnerns publika profil.

### 4. Ny edge function: `send-sales-summary-email`
Skickar HTML-mail med alla siffror + företagslista. Använder befintlig SES/Resend-infra. Loggar i `email_send_log`.

## Tekniska detaljer

- **Tabeller**: 1 ny (`partner_filter_exposures`).
- **Edge functions**: 3 nya (`track-filter-exposure`, `partner-sales-summary`, `send-sales-summary-email`).
- **Kod**: Hook + 1 ny komponent `PartnerSalesSummaryCard` i admin.
- **Snitcher-koppling**: Använder befintlig `snitcher_visits.visited_urls` + `partner_slugs`. Joinar mot partnerns `applications`/`industries` för att hitta relaterade produkt-/branschsidor.
- **Säkerhet**: All data hämtas via admin-token-validerad edge function. Inget exponeras publikt.
- **Bygg-ordning**: (1) Tabell + tracking först → (2) summary-edge → (3) admin-UI → (4) mail-funktion.

## Datapunkter du får i mailet/texten (exempel)

```text
Försäljningsunderlag – Acme Consulting
Period: 30 dagar (90d inom parentes)

Sajten totalt:
- Unika besökare: 1 240 (3 850)
- Sidvisningar:   3 410 (10 200)

Acme Consultings exponering:
- Visad i filterresultat: 87 ggr (240) – topp: /valj-partner, /d365-sales
- Klick på partnerkort:   12 (38)
- Besök på profilsida:    8 (24)
- Klick till acme.se:     3 (9)

Identifierade företag (Snitcher, 90d):
- Volvo Group       (Tillverkning, 10 000+) – 4 sessioner, besökt /partner/acme + /d365-sales
- IKEA              (Retail, 10 000+)       – 2 sessioner, besökt /branschlosningar/retail
- ...
```

Säg till om du vill justera något, annars startar jag med tabell + tracking.