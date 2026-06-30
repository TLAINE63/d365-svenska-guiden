## Mål
Lägg till tydliga CTA:er ovanför filtrerade partnerlistor, och städa per-kort-knapparna så de styr besökaren mot förmedlad kontakt istället för externa partnerwebbar.

## Ändringar

### 1. Ny komponent: `FilteredListActions.tsx`
Placeras överst i partnerlistor (efter filterrad, före korten). Visar två knappar:
- **"Få matchning av oss"** (sekundär) → öppnar `ContactFormDialog` med förifyllt ämne "Hjälp att välja partner" baserat på aktiva filter (produkt/bransch/storlek).
- **"Begär offert från utvalda"** (primär, `--cta-orange`) → öppnar `PartnerRequestDialog` i multi-mode med:
  - de partners som är markerade via `usePartnerCompare` om ≥1 valda, annars
  - top 3-5 från aktuell filtrerad lista (skickas in som prop).

Visas endast om listan har ≥2 träffar.

### 2. Integrera komponenten på listsidor
- `src/pages/AllD365Partners.tsx` (huvudkatalogen)
- `src/pages/PartnersPerBransch.tsx`
- `src/pages/ProductPartnersSverige.tsx`
- `src/components/HomePartnersTeaser.tsx` (kompakt variant — bara "Få matchning" inline med "Se alla")

### 3. Städa `PartnerCard.tsx`
- Behåll: **"Visa partnerprofil"** (primär) + **"Jämför"** (toggle via `usePartnerCompare`).
- Ta bort eventuella externa länkar till partnerwebb från kortet (förmedlad kontakt enligt memory).
- Logo förblir klickbar till intern profilsida (redan implementerat).

### 4. Utöka `PartnerRequestDialog.tsx`
Lägg till `multiMode` prop som accepterar en lista `{ slug, name }[]`. När aktiv:
- Visar mottagarlista överst ("Din förfrågan skickas till: X, Y, Z")
- Skickar en lead per partner via befintlig edge-funktion i en `Promise.all`.

## Tekniska noter
- Återanvänder `ContactFormDialog` och `PartnerRequestDialog` — ingen ny edge-funktion behövs.
- Respekterar memory: ingen direktlänk till partnerwebb, `--cta-orange` token för primär CTA, agreement_signed-partners prioriteras i top-N när "Begär offert" triggas utan jämförval.
- Spårning via befintlig `trackFunnelEvent` (`cta_view` när FilteredListActions mountas, `cta_click` per knapp).
