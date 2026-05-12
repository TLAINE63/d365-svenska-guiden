## Plan: Ersätt "Så här arbetar vi" med köpresa-självskattning

### Vad som ska ändras

Ersätt sektionen på `src/pages/Index.tsx` rad 412–478 (rubriken "Så här arbetar vi" + 4-stegs grid + CTA-rad) med en ny sektion `<BuyerJourneyStages />`.

`FeaturedArticleBanner` (rad 415) flyttas ut ur sektionen och behålls precis ovanför den nya komponenten så att inget innehåll försvinner. Resten av sidan (Direction picker dialog och övriga sektioner) lämnas orörda.

### Ny komponent

Skapas i `src/components/BuyerJourneyStages.tsx` — fristående, ingen routing, ingen backend, all state via `useState`. Tailwind + `lucide-react` (redan i projektet).

### Komponentens uppbyggnad

1. **Sektionshuvud**
   - H2: "Var i köpresan står ni?"
   - Underrad: "Två korta frågor leder er till det avsnitt som passar bäst. Inga uppgifter samlas in."
   - Inline-länk: "Eller hoppa direkt till översikten över de sju stadierna →" (smooth scroll till overview-griden via `ref` + `scrollIntoView`).

2. **Quiz (state: `step` 1|2, `result` 1–7|null)**
   - Progresslabel "Fråga X av 2".
   - Steg 1: 4 svarskort. Alternativ 1–3 sätter result direkt (stadie 1/2/3); alternativ 4 går till steg 2.
   - Steg 2: 4 svarskort → result 4/5/6/7. "← Tillbaka"-länk till steg 1.
   - Kort: stora klickbara knappar, hover ger ljus rosa bakgrund (`#FFF0F6`) och rosa border (`#E5006D`). Stack på mobil, 2 kolumner på desktop.
   - Övergångar: `transition-opacity duration-200` när steg byts.

3. **Resultatvy** (ersätter quizen i samma position när `result !== null`)
   - Fas-tag uppe: TIDIGA SIGNALER / BEHOVET AKTIVERAS / PARTNERVAL.
   - "Stadie X av 7" i accent-rosa.
   - H3 med stadietitel + två stycken situationstext (verbatim).
   - Divider + "Användbart hos oss" som diskret textlänk med `→` (placeholder `#`-anchors).
   - Footerlänkar: "Visa alla stadier" (scroll till overview) och "Gör om självskattningen" (resettar state).

4. **Overview av alla 7 stadier** (alltid synlig under quiz/resultat, samma sektion)
   - H3 "De sju stadierna i en ERP-köpresa" + underrad.
   - Tre kluster grupperade med små versala fas-labels:
     - TIDIGA SIGNALER → 1, 2
     - BEHOVET AKTIVERAS → 3, 4, 5
     - PARTNERVAL → 6, 7
   - Responsive grid: 3 kol desktop / 2 tablet / 1 mobil.
   - Varje kort: "Stadie X" label, H4 titel, första stycket av situationstexten, "Läs mer →" som expanderar inline (accordion via `useState<Record<number, boolean>>`) med fullt innehåll + "Användbart hos oss"-länk. Toggle-text: "Visa mindre".

### Innehåll

Alla 7 stadier (titel, situationstext, "Användbart hos oss"-mening) läggs in **verbatim** enligt prompten i en konstant `STAGES` array i komponenten. Inga emojis, inga utropstecken.

### Design / tokens

Komponenten använder tailwind-klasser med arbiträra värden för det specificerade färgschemat (`bg-[#FFF0F6]`, `border-[#E5006D]`, `text-[#E5006D]`, `text-[#0B0B0F]`, `text-[#5A5A66]`, `border-[#E5E5E8]`) eftersom prompten kräver exakta hex-värden som avviker från projektets befintliga semantiska tokens. Sektionsbakgrund `#FAFAFA` (mjuk separation från ovanstående hero), `py-12 md:py-20`, kort `rounded-xl border p-6 md:p-8`, hover-skugga.

Små `lucide-react`-ikoner (Lightbulb, Search, Zap, ClipboardList, GitBranch, Users, CheckCircle) i neutral grå (16–20px) bredvid stadietitlar.

### Tillgänglighet

- Semantiska `<section>`, `<h2>`, `<h3>`, `<h4>`, `<button>`-element.
- `aria-current` / `aria-expanded` på accordion.
- Synliga `focus-visible:ring-2 ring-[#E5006D]` på alla interaktiva element.
- Tab-bar keyboard-navigation.

### Filer som ändras

- **Ny**: `src/components/BuyerJourneyStages.tsx`
- **Ändrad**: `src/pages/Index.tsx` — ersätt rad 412–478 med `<FeaturedArticleBanner />` + `<BuyerJourneyStages />`. Ta bort `buyerSteps`-data om den inte används någon annanstans (verifieras innan radering).

### Avgränsningar

- Inga ändringar i routing, backend, edge functions, analytics eller tracking.
- "Användbart hos oss"-länkar lämnas som `#`-placeholders enligt prompten — kan ersättas senare.
- Ingen påverkan på Direction picker-dialogen eller efterföljande sektioner.