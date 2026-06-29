## Mål
Göra om startsidan så att **partnervalet** är den primära användarresan. Innehåll/guider/AI/mognadsindex finns kvar men i en stödjande roll längre ned. Ren, professionell skandinavisk B2B-känsla.

## Det här bygger jag (i `src/pages/Index.tsx`)

Befintliga `<Navbar />`, `<Footer />`, SEO-komponenter och `LatestArticlesStrip`/`HomePartnersTeaser` behålls. Allt annat i `<main>` ersätts med följande 8 sektioner.

**1. Hero**
- H1: *Microsoft Dynamics 365 — Guider, jämförelser och partnerval på köparens villkor* (behålls)
- Ingress: *Dynamics 365 är inte ett systemval. Det är ett verksamhetsbeslut…*
- Subheadline: *"Välj rätt Dynamics 365-partner"* + *"Hitta partners baserat på bransch, lösning, företagsstorlek och geografi – på köparens villkor."*
- **Primär CTA (stor, orange):** "Starta partnermatchning" → `/valjdynamics365partner/`
- Sekundära CTA:er: "Starta behovsanalys" (öppnar direction picker), "Läs guider" → `/kunskapscenter/`
- Diskret 4-stegs-grafik: Bransch → Lösning → Storlek → Geografi

**2. Så hittar ni rätt partner** (4-stegs horisontellt flöde med ikoner) + tydlig CTA "Starta partnermatchning". Microcopy: *"Matchningen bygger på relevans – inte sponsring."*

**3. Var står ni i processen?** — 3 kort: Hitta partner / Förstå behov / Läs på. En CTA per kort.

**4. Från behov till rätt partner** — lätt 3-stegs visualisering: Behovsanalys → Kravspec → Partner.

**5. Fördjupa analysen** — grid med 4 verktyg: Behovsanalys, Kravspec, **"Hur redo är ni?"** (omdöpt Mognadsindex), AI-sök. Varje kort: 1 mening + "Starta".

**6. Så fungerar d365.se** — transparensbullets (säljer inte system, relevansbaserad matchning, ingen kan köpa placering). Använder befintlig `TrustBanner`-stil.

**7. Guider och insikter** — befintlig `LatestArticlesStrip` + "Se alla artiklar" → `/kunskapscenter/`.

**8. Slutlig CTA** — "Redo att hitta rätt partner?" + primär "Starta partnermatchning" / sekundär "Boka rådgivning" (`/kontakt/`).

Längst ned: nuvarande FAQ-accordion och `<TrustBanner />` behålls.

## Navigeringsändring (`src/components/Navbar.tsx`)
- Döp om desktop-länken **"Hitta bransch & partner"** → **"Hitta partner"** (länken pekar fortsatt mot `/valjdynamics365partner/` istället för `/branscher/` — för att matcha den primära CTA:n).
- Mobil-länken byts på motsvarande sätt.
- Övrig dropdown-struktur (Verktyg & guider, ERP, Marknad/Sälj/Service, Microsoft AI, AI-sök, Kunskapscenter) lämnas orörd — den följer redan önskad prioritetsordning.

## Det här tar jag bort/flyttar
- `situationCards`-griden (9 kort) plockas bort från startsidan — ersätts av 3-kortslayouten i sektion 3 och 4-stegsflödet i sektion 2.
- `popularGuides`-lista ersätts av `LatestArticlesStrip` i sektion 7 (redan importerad).
- Befintliga utkommenterade "Börja här"-block tas bort helt.
- "Hur redo är ni för Dynamics 365?"-blocket längst ned ersätts av den nya sektion 5-kompakta varianten.

## Designtokens / stil
- Använder befintliga tokens: `--hero-dark`, `--signature`, `--cta-orange`, `--line-dark`, `bg-card`, `text-foreground` osv. Inga hårdkodade färger.
- Sektioner alternerar `bg-[hsl(var(--hero-dark))]` (mörka: hero + final CTA + transparens) och ljus `bg-background` (steg, kort, verktyg, artiklar).
- Max 1 primär (orange) CTA per sektion. Sekundära som outline.
- Mobile-first: 4-stegsflödet blir vertikalt på mobil, 3-kortsgriden `grid-cols-1 md:grid-cols-3`, verktygsgriden `grid-cols-2 md:grid-cols-4`.

## Filer som ändras
- `src/pages/Index.tsx` (stor omskrivning av `<main>`-innehållet, behåller imports/SEO/Navbar/Footer).
- `src/components/Navbar.tsx` (en label-/path-ändring desktop + mobil).

Inga datamodeller, edge functions eller routes berörs. SEO-titel/description, FAQ-schema, `OrganizationSchema`, `WebSiteSchema`, `LocalBusinessSchema` lämnas oförändrade.

Säg till om något ska justeras — annars bygger jag enligt detta.