

## Frivillig storleksfiltrering vid partnermatchning

### Mål
Låt kunder valfritt ange sin storlek (anställda och/eller omsättning) i matchningsflöden så att partners vars uttalade målgrupp matchar lyfts fram – generellt och per Dynamics 365-applikation. Liten partner → mindre kunder, stor partner → större kunder.

### Status idag
- Datamodellen har redan `product_filters[product].companySize: string[]` per applikation (BC, F&SCM, Sales, Service). Admin kan kryssa i målstorlekar.
- `revenue` finns endast i en gammal legacy-typ, inte i `ProductFilterInput`. Saknas alltså för omsättning per produkt.
- Filtreringslogiken i `usePartnerFilters.ts` stödjer redan `selectedCompanySize` per produkt – men ingen publik UI-vy exponerar valet idag (`BusinessCentral`, `FinanceSupplyChain`, `CRM` skickar `null`).
- `ValjPartner` har state för `selectedCompanySize` men ingen filterknapp som sätter det.
- `KomIgang`-wizarden frågar inte efter storlek.

### Förslag till lösning (frivilligt, icke-blockerande)

**1. Utöka datamodellen med omsättning per produkt**
- Lägg till `revenue?: string[]` i `ProductFilterInput` (analogt med `companySize`).
- Standardalternativ (samma som befintliga `revenueOptions`): `1-24 / 25-99 / 100-499 / 500-999 / 1.000-4.999 / >5.000 MSEK`.
- Ingen DB-migration behövs – sparas i samma `product_filters` JSONB.

**2. Admin-UI: målgrupp per applikation**
- I produktsektionen för varje applikation i `AdminDashboard.tsx`: visa två kompakta multi-select-grupper "Målgrupp – antal anställda" och "Målgrupp – omsättning (MSEK)".
- Tom = ingen begränsning (partnern matchar alla storlekar för den produkten).
- Sanitization: tom array tas bort vid spar (befintlig logik).

**3. Filtrering – utökad logik**
- Utöka `matchesDatabaseProductFilter` i `src/hooks/usePartnerFilters.ts` med valfri `selectedRevenue`-parameter; samma "tom = matchar allt"-semantik som idag för `companySize`.
- "Mjuk" matchning: om varken anställda eller omsättning angetts av kund → ingen filtrering (allt visas). Om angetts och partnern saknar målgrupp → partnern visas (vi straffar inte tystnad).

**4. UI för kund – två integrationspunkter**

   **a) Produktsidor (`BusinessCentral`, `FinanceSupplyChain`, `CRM`, `D365Sales`, `D365CustomerService` m.fl.) + `ValjPartner`:**
   Lägg till två nya `FilterButtons`-rader under befintliga filter:
   - "Antal anställda" (icon: `employees`) – samma `companySizes`-lista som idag.
   - "Omsättning" (icon: `revenue`) – `revenueOptions`.
   Båda valfria, samma slate-stil som övriga filter, "Visa alla" rensar.

   **b) `KomIgang`-wizarden:**
   Lägg till ett nytt valfritt steg "Din storlek (frivilligt)" mellan nuvarande applikations- och bransch-stegen, med två SelectionCard-grupper (anställda + omsättning) och tydlig "Hoppa över"-knapp. Auto-advance kvar enligt befintlig wizard-pattern.

**5. Visuell återkoppling**
- När storleksfilter är aktivt: visa valda värden som chips i den befintliga "Aktiva filter"-raden (samma mönster som industri/geografi).
- I `PartnerCard`: när `highlightedCompanySize`/nya `highlightedRevenue` finns, visa dem som badges (komponenten har redan `highlightedCompanySize`-stöd; lägg till `highlightedRevenue`).

**6. AI-guiden / partnerguide PDF**
- Inkludera storleksval i scoringen som **bonus**, inte hård filter (vikt ~5 % vardera): partner vars målgrupp innehåller kundens storlek får +poäng. Saknad målgrupp → neutralt.
- Lägg till raden "Målgrupp" i partnerprofilens kompetensblock (anställda + omsättning som pills) när definierat.

### Tekniska detaljer
- Filer som ändras:
  - `src/hooks/usePartners.ts` – utöka `ProductFilterInput` med `revenue?: string[]`.
  - `src/hooks/usePartnerFilters.ts` – ny `selectedRevenue`-parameter i `matchesDatabaseProductFilter` och `filterAndSortPartners`.
  - `src/pages/AdminDashboard.tsx` – två nya multi-select-grupper per produkt; sanitization.
  - `src/pages/BusinessCentral.tsx`, `FinanceSupplyChain.tsx`, `CRM.tsx`, `D365Sales.tsx`, `D365CustomerService.tsx`, `D365Marketing.tsx`, `D365FieldService.tsx`, `D365ContactCenter.tsx`, `Branschlosningar.tsx`, `ValjPartner.tsx` – nya filterknappar + state.
  - `src/pages/KomIgang.tsx` – nytt valfritt storlekssteg.
  - `src/components/PartnerCard.tsx` – `highlightedRevenue`-prop.
  - `src/pages/PartnerProfile.tsx` – läs `companySize`/`revenue` ur URL-params + visa pill för "Målgrupp".
  - `src/utils/generatePartnerGuide.ts` (om AI-bonus läggs in) – lägg till poäng.
- Inga DB-migrationer behövs (allt i `product_filters` JSONB).
- Memory att uppdatera efteråt: `mem://features/partner-discovery-logic-v7-sv-final` (ny dimension i 4-stegs filter → 5-stegs), `mem://features/partner-guide-logic-v6-sv` (om vikten 5 % läggs till).

### Att bekräfta före implementation

