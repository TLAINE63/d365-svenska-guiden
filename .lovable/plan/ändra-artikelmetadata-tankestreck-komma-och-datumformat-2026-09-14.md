# Ändra artikelmetadata: tankestreck → komma och datumformat

## Ändringar
1. I `src/pages/BlogArticle.tsx` rad 224: byt ut `— {article.author.role}` mot `, {article.author.role}` så författarraden blir "Av Thomas Laine, Grundare, d365.se".
2. I samma fils lokala `formatDateSv` (rad 22–28): byt returseparatorn från `/` till `-` så publicerings- och uppdateringsdatum visas som `2026-09-10`.

## Varför dessa ändringar
- Bilden visar artikelns metadata med ett långt tankestreck och datumet `2026/09/10`.
- Användaren vill ha komma istället för tankestreck och ISO-liknande datum med bindestreck.
- `formatDateSv` är lokal för `BlogArticle.tsx`, så ändringen påverkar bara artikelsidor, inte övriga delar av sajten.

## Kontroll
- Kör TypeScript-kontroll (`npx tsgo --noEmit`).
- Verifiera artikelsidan `/artiklar/valja-affarssystem-och-partner/` med Playwright: författarrad och publiceringsdatum ska matcha önskemålet.
