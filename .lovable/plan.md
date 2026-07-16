# Plan: Tydligare partnernyheter på startsidan + artikelsida i Partnernytt

## Mål
Göra sektionen "Aktuellt från Dynamics 365-partners" på startsidan mer överskådlig genom att visa bara rubriker, och skapa en klickbar väg till en egen artikelsida där hela innehållet visas.

## Bakgrund
- Idag visas 6 partnernyheter i ett kortgrid med bild, rubrik, hela sammanfattningen, flera badges, partnerlänk och originalkällelänk. Det blir visuellt tätt och svårläst.
- Det finns ingen publik detaljsida för enskilda partnernyheter; varje artikel länkar direkt till extern originalkälla.

## Förslag på lösning

### 1. Förenklad startsidessektion
Uppdatera `src/components/HomePartnerNewsSection.tsx`:
- Ersätt kortgridet med en vertikal lista (max 5–6 artiklar).
- Varje rad visar endast:
  - nyhetstyp (badge)
  - publiceringsdatum
  - rubrik (klickbar)
  - partnernamn (litet, diskret)
- Ta bort sammanfattningstext, bilder, "Läs på originalkällan" och "Läs mer om partner"-länkar från startsidan.
- Lägg till tydliga avdelare mellan raderna (border eller bakgrundsfält) så de inte flyter ihop.
- Behåll knappen "Visa allt partnernytt" längst ner.

### 2. Ny artikelsida i Partnernytt
Skapa `src/pages/PartnerNewsDetail.tsx` och lägg till en route i `src/App.tsx`, t.ex. `/partnernytt/artikel/:id`:
- Hämtar en enskild partnernyhet med `id` från URL:en via `supabase.from("partner_news").select("*, partners:partner_id(...)")`.
- Visar:
  - rubrik
  - bild (om det finns)
  - datum, typ, produktområde, bransch, källa (badges)
  - sammanfattning (full text)
  - partnerinfo med länk till partnerprofilen
  - tydlig CTA: "Läs originalartikeln" som öppnar `source_url` externt
- SEOHead med artikelns titel och en canonical på `/partnernytt/artikel/:id`.
- Tillbaka-länk till `/partnernytt/`.

### 3. Klickbarhet från startsidan
- Varje rad i den nya startsidelistan länkar till `/partnernytt/artikel/:id`.
- På `/partnernytt/` (listningssidan) kan rubrikerna i befintliga `PartnerNewsCard` också länka till den nya detaljsidan, medan källknappen fortsätter gå till originalkällan.

### 4. Designprinciper
- Använd samma färger, badges och typografi som övriga Kunskapscenter/Partnernytt för konsistens.
- Primär CTA på detaljsidan använder `--cta-orange`.
- Teal (`--accent`) används för sekundära länkar enligt projektets färgstrategi.

## Filer som ändras
- `src/components/HomePartnerNewsSection.tsx` — ny förenklad list-layout
- `src/pages/PartnerNewsDetail.tsx` — ny artikelsida
- `src/App.tsx` — ny route för artikelsidan
- `src/pages/Partnernytt.tsx` och/eller `src/components/PartnerNewsCard.tsx` — uppdatera rubriklänkar till detaljsidan
- `src/hooks/usePartnerNews.ts` — lägg till en `usePartnerNewsItem(id)` hook för detaljsidan

## Notering
- Partnernyheter har idag ingen slug-kolumn; artikelsidan använder därför radens `id` i URL:en. Om du senare vill ha SEO-vänliga slugs kan vi lägga till en `slug`-kolumn i databasen.