## Mål

Dölj **uppenbart** branschfrämmande frågor och alternativ utifrån vald bransch i de tre behovsanalyserna och de tre kravspecarna. Ingen poäng-omvägning, ingen ny logik – bara visuell filtrering. Användaren ska aldrig tvingas svara på frågor som är meningslösa för deras bransch.

## Branschgrupper (centralt)

Lägg en ny `src/lib/industryFilters.ts` med tre helpers, så samma definition återanvänds i alla analyser:

```ts
isServicesIndustry(industry)  // Konsulttjänster, Finans & Försäkring, Telekom & IT-tjänster,
                              // Media & Publishing, Hälsa & sjukvård, Non-profit, Medlemsorganisationer,
                              // Utbildning, Offentlig sektor, Fastighet & Förvaltning
isB2COrientedIndustry(industry) // Retail & E-handel, Mode/Sport/Textil
isProductIndustry(industry)   // Tillverkning, Livsmedel/Process, Grossist, Retail/Mode,
                              // Life Science, Transport & Logistik, Jordbruk, Energi, Bygg, Uthyrning
```

Använder samma bransch-värden som `industryOptions` i resp. analys.

## 1. ERPbehovsanalys (`NeedsAnalysis.tsx`)

Dölj när `isServicesIndustry(data.industry)`:
- `moduleOptions`: "Lager & Logistik", "Produktion & Montering", "E-handel"
- `challengeOptions`: "Brister i lager- och leveransprecision …"
- `situationChallengeCategories`-item: "Mycket manuellt arbete i inköp, order, lager"

(Operativ komplexitet filtreras redan via `businessModel` – orörd.)

## 2. Sälj & Marknad (`SalesMarketingNeedsAnalysis.tsx`)

Dölj när `isServicesIndustry(data.industry)`:
- `integrationTypes`-alternativ: "E-handelsplattform", "Lager/WMS" (om finns)

Dölj när `isB2COrientedIndustry(data.industry)`:
- (inget – B2C-frågor är redan låsta bakom `commercialModel`)

Dölj när **inte** `isB2COrientedIndustry(data.industry)` **och** `commercialModel` inte är b2c/digital:
- (befintlig logik – orörd)

Dvs här räcker det att rensa integrations-listan för rena tjänsteindustrier.

## 3. Kundservice (`CustomerServiceNeedsAnalysis.tsx`)

Dölj när `isServicesIndustry(data.industry)`:
- `systemDependencies`-alternativ med id `lager` och `e_handel`
- `fieldServiceNeedOptions` som rör "Reservdelar"/"lager" om fältservice ändå är aktivt (behåll – kunden kan ha tekniker även i tjänsteföretag, bara dölj lager-specifika)

Field Service-steget styrs redan av `focusKey` – orörd.

## 4. Kravspecar (Sales / Marketing / CustomerService)

Korta filer (≈480 rader). Dölj uppenbart produkt-/lagerrelaterade rader i kravlistan när `isServicesIndustry(industry)`. Konkret efter genomläsning av varje fil:
- ta bort krav som nämner "lager", "produkt-katalog", "e-handelsintegration", "POS" i ren tjänstebransch.

Bransch hämtas från ev. fält i kravspec-state; om det saknas idag, lägg en enkel `<Select>` högst upp (samma `industryOptions` som behovsanalyserna) och spara i state. Inget annat ändras.

## Teknik

- Ny fil: `src/lib/industryFilters.ts`
- Edits: `NeedsAnalysis.tsx`, `SalesMarketingNeedsAnalysis.tsx`, `CustomerServiceNeedsAnalysis.tsx`, `RequirementsSpec*.tsx` (4 st)
- Filtrering sker vid rendering: `options.filter(o => !hiddenForIndustry(o, data.industry))`. Inga state-fält ändrar typ. Befintliga svar lämnas orörda (om någon byter bransch i efterhand spelar det ingen praktisk roll – dolda värden bidrar inte till poäng).

## Vad som INTE görs

- Ingen omviktning av scoring (samma som F&SCM-mönstret – dolda block får helt enkelt 0-bidrag).
- Inga nya frågor.
- Ingen ändring av PDF-export utöver att dolda fält naturligt blir tomma.

Säg till om du vill att jag även lägger till en branschväljare i kravspecarna om de saknar det, eller om jag ska köra precis enligt ovan.