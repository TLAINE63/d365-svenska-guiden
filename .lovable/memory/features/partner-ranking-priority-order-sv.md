---
name: Partner ranking priority order
description: Bransch ALLTID viktigaste rankingfaktorn (40%), Produkt näst viktigast (30% när vald). Övriga faktorer endast som tiebreakers. Produkt + bransch är dessutom HÅRDA filter över hela sajten – relaxas aldrig.
type: feature
---

## Hård filtrering (skåpsäker, gäller hela sajten)
- **Produkt**: Om kunden valt en produkt (BC, F&SCM, Sales, Service) får ENDAST partners med den produkten profilerad i `product_filters` visas. Relaxas ALDRIG.
- **Bransch**: Om kunden valt bransch får ENDAST partners med den branschen i `product_filters[product].industries` visas. Relaxas ALDRIG.
- **Geografi**: Hård filtrering i första steget, men FÅR relaxas som sista utväg om < 3 träffar (utom för "Övriga världen").
- **Storlek/omsättning**: ALDRIG hårda filter – endast mjuka rankingbonusar via `getSizeMatchBonus`.

Implementeras i:
- `src/hooks/usePartnerFilters.ts` (`matchesDatabaseProductFilter`, `filterAndSortPartners`)
- `src/pages/KomIgang.tsx` (`findPartners`)
- `src/components/PartnerGuideDialog.tsx` (`filterPartners` – endast geografi relaxas)
- `supabase/functions/match-partners/index.ts` (system-prompt klargör att alla skickade partners redan passerat hårda filter; AI får aldrig exkludera).

## Rangordning (mjuka vikter)
1. **Bransch (40%)** – ALLTID högst.
2. **Produkt (30% vald, 20% Alla)** – näst viktigast.
3. Övrigt (geografi, kundexempel, storleksbonus max 10%, AI-kompetens, lokal närvaro, plattform) – endast tiebreakers mellan partners likvärdiga på bransch + produkt.
