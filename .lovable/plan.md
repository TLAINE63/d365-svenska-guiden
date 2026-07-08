## Problem
Publish misslyckades på grund av logotyp-kontrollen i `prebuild`:

```
✗ src/utils/generatePartnerGuide.ts: refererar äldre logotyp (d365guide-logo*)
Tillåten visuell logotyp: /d365-logo.svg
```

Filen importerar idag `@/assets/d365guide-logo-white-bg.png` för att rita logotypen i den genererade partner-guiden PDF:en.

## Åtgärd
Byt ut den gamla logotypimporten i `src/utils/generatePartnerGuide.ts` mot den godkända logotypen:

- Ersätt `import logoImage from "@/assets/d365guide-logo-white-bg.png";` med en referens till `/d365-logo.png` (finns i `public/` och är en PNG som jsPDF kan hantera direkt).
- Behåll befintlig logik för `getBase64FromUrl` och `doc.addImage(...)` – ändringen är bara källan till bilden.
- Justera eventuellt bredd/höjd på `doc.addImage` om den nya PNG:n har annan aspect ratio.

## Filer som ändras
- `src/utils/generatePartnerGuide.ts` (1 rad import + eventuell storleksjustering)

## Verifiering
Kör `node scripts/check-logo-usage.mjs` och sedan `npm run prebuild` för att bekräfta att felet är åtgärdat.