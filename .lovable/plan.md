## Mål
Låt partners ha en kort, branschspecifik pitch (~280 ord max, valfri produkt-override) som visas både i listan på `/branscher/<slug>` och i expanderad vy. Texten kan AI-genereras som förslag och redigeras av partner eller admin.

## Datamodell

Ny kolumn på `partners`:

```
industry_pitches  jsonb  default '[]'
```

Struktur (array av objekt):
```json
[
  {
    "industry": "Livsmedel & processindustri",
    "product": null,
    "text": "Vi har levererat F&SCM till 12 svenska livsmedelsbolag…",
    "generated_at": "2026-05-17T10:00:00Z",
    "edited_by": "partner"
  },
  {
    "industry": "Livsmedel & processindustri",
    "product": "Business Central",
    "text": "För mindre livsmedelsbolag erbjuder vi BC med…",
    "generated_at": null,
    "edited_by": "partner"
  }
]
```

- `product: null` = bransch-default. Visas när inget produktfilter är valt, eller som fallback.
- `product: "Business Central"` etc. = override som visas när det produktfiltret är aktivt.
- Lookup-logik: matcha först `(industry, product)`, annars `(industry, null)`, annars visa inget extra (befintlig generell `description` används som fallback).

## UI – Partnerportal (`PartnerUpdate.tsx`)

Ny sektion **"Branschpitchar"** under befintlig branschsektion:
- Lista en rad per vald primär+sekundär bransch.
- Per bransch: textfält (max 280 ord, räknare), knapp **"Generera förslag med AI"**, knapp **"+ Lägg till produktvariant"** som öppnar dropdown med partnerns valda produkter.
- Produktvarianter visas indenterade under bransch-default.
- AI-knappen anropar edge function med kontext: partnernamn, branschnamn, valbar produkt, partner-description, kundexempel, industry_apps.

## UI – Admin (`AdminPartnerEditor` / motsv.)

Samma komponent återanvänds i adminvyn – admin kan generera och redigera å partnerns vägnar. Stämplas `edited_by: "admin"` i metadata.

## UI – Publik branschsida (`IndustryPage.tsx`)

På `PartnerCard` (i listan):
- Om matchande pitch finns: visa **kort utdrag** (~140 tecken med "…") under partnerns namn/beskrivning.
- "Läs mer"-länk eller expand → full text.
- I expanderad vy / partnerprofil: full pitch ovanför generell description.

Logik tar hänsyn till nuvarande aktivt produktfilter (`selected[]` i IndustryPage) – om en produkt valts och partnern har en produkt-override för den branschen+produkten, visa den, annars bransch-default.

## Edge function: `generate-partner-industry-pitch`

- Input: `{ partner_id, industry, product?: string }`
- Hämtar partnerdata + ev. industry_pages.intro för branschen som kontext.
- Anropar Lovable AI Gateway (`google/gemini-3-flash-preview`).
- Systemprompt: TAYA-ton, max 280 ord, konkret/neutral, ingen säljjargong, nämn relevant kompetens/erfarenhet, anpassa till produkt om angiven.
- Returnerar `{ text }`. Sparas inte automatiskt – partner/admin granskar och sparar.
- Auth: kräver giltig partner-token (för partnerportal) eller admin-lösenord (för admin).
- Rate limit via `ai_usage_log` (befintlig tabell, per partner_id + dag).

## Lagring & synk

- Sparas via befintliga update-mutationer (`useAdminPartners` / `partner-self-update` edge function).
- `partnerData.json` byggsteg (SSG) inkluderar `industry_pitches`-fältet så SSG-renderade branschsidor får pitcharna inbakade.

## SEO

Pitchen blir unik partner-content per branschsida → stark SEO-signal. Säkerställs via SSG-injektion.

## Out of scope (denna iteration)

- Versionshistorik/diff av pitchar
- Bulkgenerering för alla branscher i ett klick (kan läggas till senare)
- Översättning till engelska

## Teknisk översikt

```
DB:              ALTER TABLE partners ADD COLUMN industry_pitches jsonb DEFAULT '[]'
Edge function:   supabase/functions/generate-partner-industry-pitch/index.ts
Frontend:
  - src/components/PartnerIndustryPitchesEditor.tsx  (ny, delas mellan partner & admin)
  - src/pages/PartnerUpdate.tsx                       (mount editor)
  - src/components/AdminPartnerEditor.tsx (motsv.)    (mount editor)
  - src/components/PartnerCard.tsx                    (visa utdrag + expand)
  - src/pages/IndustryPage.tsx                        (skicka aktivt produktfilter till kort)
SSG:
  - scripts/build-partner-data.* inkluderar fältet
```

## Implementationsordning

1. Migration (ny jsonb-kolumn)
2. Edge function för AI-förslag
3. `PartnerIndustryPitchesEditor`-komponent
4. Mounta i PartnerUpdate + admin
5. Visning i PartnerCard på branschsidan (utdrag + expand) med produkt-override-logik
6. SSG-uppdatering för att inkludera fältet
