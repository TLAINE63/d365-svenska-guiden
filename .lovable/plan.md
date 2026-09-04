# Plan: Samma branschinsikt för Basic-partners överallt

## Mål
Den branschinriktning som visas på Basickorten (max 3 observerade branscher per produktområde, märkt "enligt d365.se:s marknadsanalys – ej bekräftad av partnern") ska vara samma data som används i all filtrering där Basic-partners ingår – inklusive produktsidorna.

## Nuvarande läge
- `PartnerBasicCard` visar upp till 3 observerade branscher via `normalizeObservedIndustries` med `BASIC_COPY.industriesLabel` som disclaimer.
- `filterBasicPartners` i `src/lib/basicPartnerMatch.ts` matchar bransch hårt mot hela (otrunkerade) `observed_industries` – en Basic-partner kan alltså matcha på en bransch som aldrig visas på kortet.
- Används av `ValjPartner.tsx`, `IndustryPage.tsx`, `Branscher.tsx`; produktsidorna använder `ProductBasicPartnersSection`.

## Ändringar

1. **Central hjälpfunktion** i `src/lib/basicPartnerMatch.ts` (eller `useBasicPartners.ts`):
   - `getBasicPartnerIndustries(partner, productKeys?)` – returnerar samma trunkerade (max 3 per produktområde), deduplicerade och sammanslagna branschlista som kortet visar.
   - Bygger på befintliga `normalizeObservedIndustries` så att visning och filtrering delar exakt samma datakälla.

2. **Filtrering**: `filterBasicPartners` matchar bransch mot den trunkerade listan (samma 3 som visas), inte mot råa `observed_industries`. Beteendet blir: det du ser på kortet är exakt det partnern kan matchas fram på.

3. **Produktsidor** (`ProductBasicPartnersSection` och ev. övriga ytor där Basic-listor filtreras per bransch): använd samma hjälpfunktion för både visning och filter, så att branschinsikten är identisk med Basickortets.

4. **Konsekvent märkning**: där Basic-partners branscher visas i listor/sektioner utanför själva kortet återanvänds `BASIC_COPY.industriesLabel`-disclaimern ("enligt d365.se:s marknadsanalys, ej bekräftad av partnern").

5. **Verifiering**: `tsgo`-typecheck + Playwright-genomgång av /valjdynamics365partner, en branschsida och en produktsida med Basic-partner – kontrollera att samma branscher visas på kort och används i filtret.

## Utanför scope
- Ingen ändring av matchningslogiken för verifierade partners.
- Ingen ändring av hur `observed_industries` samlas in eller lagras.
