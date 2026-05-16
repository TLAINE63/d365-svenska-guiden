## Plan: Dölj branscher utan partnerkoppling

### Mål
På både `/branschlosningar` och `/branscher` ska endast branscher där minst en publicerad partner finns visas. Branscherna finns kvar i standardlistan (`STANDARD_INDUSTRIES`) så partners kan fortfarande välja dem i admin — de dyker upp automatiskt när första partnern profilerar sig mot dem.

### Definition av "partnerkoppling"
En bransch räknas som täckt om minst en `is_featured = true`-partner har branschnamnet i något av:
- `product_filters.{bc|fsc|sales|service}.industries`
- (Optional) `partners.industries` / `secondary_industries` — bekräfta om dessa fortfarande är källan, eller om enbart `product_filters` används publikt

Default: använd `product_filters` (samma källa som redan styr partner-matchningen på dessa sidor).

### Förändringar

**1. Ny delad hook: `src/hooks/useCoveredIndustries.ts`**
Returnerar `Set<string>` med branschnamn som har minst en featured partner. Baseras på `usePartners()` så datan delas via React Query-cachen.

```ts
// pseudo
const keys = ["bc","fsc","sales","service"] as const;
const covered = new Set<string>();
partners.forEach(p => keys.forEach(k => 
  p.product_filters?.[k]?.industries?.forEach(i => covered.add(i))
));
```

**2. `/branschlosningar` (`src/pages/Branschlosningar.tsx`)**
- `displayedIndustries` filtreras: `industries.filter(i => covered.has(i.partnerIndustries[0]))`
- Logiken med utgråade kort (`industriesWithPartners`) behålls för filterscenariot — den fungerar nu som "har partner för **valt produktområde**"-indikator inom det redan filtrerade urvalet

**3. `/branscher` (`src/pages/Branscher.tsx`)**
- `STANDARD_INDUSTRIES` filtreras likadant innan grid-renderingen
- Visa ett litet meddelande längst ned om antal dolda branscher (valfritt): "Fler branscher tillkommer när partners profilerar sig" — eller utelämnas helt. Default: utelämnas.

**4. Edge case: tom lista**
Om inga partners alls finns (laddning/fel) — visa skeleton/laddningsindikator istället för tom sida. `usePartners()` har redan `isLoading`.

### Vad som INTE ändras
- `STANDARD_INDUSTRIES` rörs inte — alla 20 finns kvar för admin/partner-val
- `IndustryPage` (`/branscher/[slug]`) rörs inte — om man når URL direkt visas sidan ändå (om publicerad)
- Partner-admin-formulär: inga ändringar, partners kan välja vilken bransch som helst
- SEO/sitemap för enskilda branschsidor: rörs inte (separat beslut om vi vill noindexa tomma)

### Fråga
Ska sitemap.xml / interna länkar till tomma branschsidor också rensas, eller räcker det att dölja dem från dessa två översiktssidor? Default: bara översiktssidorna, sitemap orörd.