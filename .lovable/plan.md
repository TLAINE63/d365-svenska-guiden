## Bakgrund

Google visar i dag Microsofts YouTube-miniatyr ("Drive sales with AI-generated product descriptions", video-ID `ayXdXFyFEjY`) som bild vid sökträffen för `/businesscentral/`. Videon bäddas in via `src/data/knowledgeVideos.ts` och dess `img.youtube.com`-miniatyr är den enda stora, indexerbara bilden på sidan – sidans egen `og:image` (`/og-business-central.png`) är bara ett abstrakt turkost vågmönster utan motiv, vilket Google sällan väljer.

## Vad som byggs

1. **Ny primärbild för Business Central-sidan**
   - Generera en egen 1200×630-grafik i d365.se:s designspråk (mörk bakgrund, orange accent, "Dynamics 365 Business Central – pris, funktioner & partners i Sverige") och lägg den i `public/`.
   - Ersätt `public/og-business-central.png` med den nya bilden så att og:image och sidbilden är samma motiv (starkast signal till Google).

2. **Visa bilden högt upp i sidans innehåll**
   - Lägg in bilden som en synlig, redaktionell bild i hero-/introsektionen i `src/pages/BusinessCentral.tsx`, före videosektionen.
   - Sätt `width`/`height` (1200×630), beskrivande `alt`, `loading="eager"` och `fetchPriority="high"` så den inte skadar LCP.

3. **Strukturerad data som pekar ut rätt bild**
   - Lägg till/utöka JSON-LD på sidan med `primaryImageOfPage` (ImageObject med absolut URL, bredd, höjd, caption) samt `image`-fältet på sidans befintliga schema.
   - Behåll `og:image`/`twitter:image` pekande på samma absoluta URL.

4. **Nedprioritera videominiatyrerna som bildkandidat**
   - Flytta videosektionen längre ner på sidan (under fördjupningsartiklarna) så den egna bilden ligger tydligt högre i DOM:en. Videorna finns kvar, bara senare i flödet.

## Teknisk detalj

- Filer: `src/pages/BusinessCentral.tsx`, `public/og-business-central.png` (ersätts), ev. `src/components/StructuredData.tsx`.
- Miniatyren i sökresultatet uppdateras först när Google crawlar om sidan – ingen omedelbar effekt. Efter deploy kan vi begära omindexering via Search Console/IndexNow (`scripts/ping-indexnow.mjs` finns redan).
- Google garanterar aldrig vilken bild som väljs; detta maximerar sannolikheten men är inte en hård kontroll.
