# Plan: Branscher är partnerns beslut – inte admin

## Bakgrund
I Datakvalitet-fliken (`src/components/AdminDataGapsTab.tsx`) föreslår och skriver "Godkänn förslag" idag även branscher (toppnivå + per produkt), dels härledda från produktfilter, dels bevarade. Användaren vill att branschval **aldrig** ändras eller läggs till av admin — det är 100 % partnerns beslut. Godkänn/Justera ska endast hantera geografi, kundstorlek och omsättning.

## Ändringar (endast `src/components/AdminDataGapsTab.tsx`)

### 1. `buildSuggestion` — föreslår inte branscher
- Toppnivå `industries`: behåll partnerns befintliga värde (`p.industries || []`); härled **inte** från produktfilter.
- Per produkt `industries`: behåll befintliga (`f.industries || []`); lägg inte till.
- (Värdena sparas ändå inte, se punkt 2 — de finns bara kvar i Draft för ev. skrivskyddad visning.)

### 2. `save` — skriver inte branscher
- Ta bort `industries: d.industries` ur per-produkt-merge av `product_filters`.
- Ta bort `industries: draft.industries` ur partner-objektet som skickas till `manage-partners`.
- Endast `geography`, `companySize`, `revenue` skrivs (toppnivå + per produkt). Partnerns branschval lämnas orörda.

### 3. `findGaps` — bransch-brister visas men är ej fixbara
- Dela upp i `fixableGaps` (geografi/storlek/omsättning) och `partnerGaps` (branschrelaterat: "Tomt branschfält på toppnivå", "X av 3 branscher").
- `partnerGaps` visas som dova/muterade badges märkta "Partnerns ansvar" (ej räknade i "X brister"-badgen, ej fixbara av Godkänn).
- "X brister"-badgen och Godkänn-knappens `disabled` baseras enbart på `fixableGaps`.

### 4. Justera-dialogen — inget branschredigering
- Ta bort toppnivå-bransch-ChipGroup och per-produkt-bransch-ChipGroup.
- Behåll ChipGroup för geografi, kundstorlek (i rad, max 3) och omsättning (i rad, max 3).
- Ev. visa partnerns nuvarande branscher som skrivskyddad text/info-rad så admin ser vad partnern valt, utan att kunna ändra.

## Resultat
- "Godkänn förslag" fyller endast geografi, kundstorlek och omsättning — berör aldrig branscher.
- "Justera"-dialogen låter admin justera samma tre fält, inte branscher.
- Branschbrister syns som information ("Partnerns ansvar") men kan inte åtgärdas av admin.
