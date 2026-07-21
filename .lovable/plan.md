# Plan: Internationell engelsk version av d365.se

## Dina förutsättningar
- **Målgrupp:** Global (inte bara Sverige/Norden)
- **Innehåll:** AI-översättning av allt
- **Väg:** Du vill se för- och nackdelar innan du väljer mellan separat sajt (Remix) eller tvåspråkig sajt (samma kodbas)

## Projektets nuvarande omfattning
- Kodbas: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Supabase (Lovable Cloud)
- 84 sidor (`src/pages`), 180 komponenter (`src/components`), 134 databasmigreringar
- Statiskt genererade routes, SEO-vänlig SSG, prerenderade partnerprofiler, sitemap, industrisidor
- Alla texter hårdkodade på svenska i komponenter och i databas (`partners`, `partner_news`, `knowledge_articles`, `industry_*`, `product_*`, `site_settings` m.m.)
- Ingen i18n-infrastruktur finns idag (inget `i18next`, inga språkfiler, ingen locale-routing)

## Alternativ 1: Separat engelsk sajt via Remix (Rekommenderas för "global")

### Beskrivning
Skapa en kopia/Remix av projektet till en egen .com-domän. Engelsk version är en fristående app med egen databas/kopia av databasen och egen SEO-identitet.

### Fördelar
- **Snabbast att komma igång:** Klona och översätta, ingen risk att bryta den svenska sajten.
- **SEO-isolering:** Separat domän, egen sitemap, egen hreflang, inga duplicerade canonical-problem på samma domän.
- **Global innehållsstrategi:** Du kan plocka bort Sverige-specifikt innehåll, bygga en global partnerkatalog och använda amerikanska/europeiska exempel.
- **Säker testbana:** Kan iterera utan att påverka d365.se:s rankings eller leads.
- **Mindre teknisk komplexitet:** Ingen runtime-språkväxlare, ingen locale-URL-hantering, ingen sammanflätad routing.
- **Bättre för "global":** En .com med fristående varumärke signalerar internationell sajt bättre än `/en/` under en .se.

### Nackdelar
- **Dubbla underhåll:** Två kodbanor, två databaser, två deployer. Ändringar i design/SEO måste göras på två ställen.
- **Innehållsfördubbling:** All partnerdata, nyheter, artiklar, industrisidor, produktsidor måste kopieras och översättas. Du kan inte återanvända den svenska databasen automatiskt.
- **Högre löpande kostnad:** Två hosting-instanser, två Supabase-projekt, två domäner, dubbel övervakning.
- **AI-översättning av dynamiskt innehåll:** Kräver antingen manuell export/översätt/import av databasen eller en ny edge-funktion som översätter vid migrering.

### Passar dig om
Du vill testa en internationell marknad utan att riskera den svenska verksamheten, och du kan acceptera att ha två parallella sajter att underhålla.

---

## Alternativ 2: Tvåspråkig sajt på samma kodbas (`/en/`)

### Beskrivning
Bygg in i18n i den befintliga Vite-appen. Svenska är default, `/en/` är engelsk version. Samma databas, samma partnerdata, samma deployment.

### Fördelar
- **Ett underhåll:** En kodbas, en databas, en deploy. Designändringar och nya funktioner gäller båda språken direkt.
- **Dela innehåll:** Samma partnerprofiler, nyheter, kunskapsartiklar — bara översätta presentationsskiktet (UI + sidtexter).
- **Enklare budget och hosting:** Lovar Cloud-kostnaden ligger kvar på ett projekt.
- **Hreflang och SEO:** Du kan markera svensk som `sv-SE` och engelsk som `en` (eller `en-US`/`en-GB`).

### Nackdelar
- **Stort tekniskt arbete:** Alla 84 sidor + 180 komponenter + 134 migrationers texter måste antingen hårdkodas om till översättningsnycklar eller översättas statiskt vid bygge. Routing, canonical, sitemap, brödsmulor, metadata, PDF-mallar, e-postmallar — allt måste bli locale-aware.
- **Global innehållsbegränsning:** Databasen är Sverige-fokuserad (svenska partners, SEK-priser, svenska regionala data). Att rikta dig "globalt" med svenska partners är svårt. Du måste skapa nya fält för marknad/land/språk i nästan varje tabell.
- **SEO-risk:** Om samma innehåll visas på `/sv/` och `/en/` utan korrekt hreflang och canonical kan det skapa duplicate-content-problem.
- **Prestanda:** Alla översättningar laddas på klienten, eller så behöver du bygga en SSG-variant per språk.
- **Längre time-to-market:** Mer än dubbelt så mycket arbete som en Remix för att få en MVP.

### Passar dig om
Din engelska målgrupp fortfarande är svenska/nordiska företag som föredrar engelska, eller du är beredd att investera i en full i18n-refaktorering.

---

## Förslag för global målgrupp: **Alternativ 1 — Remix till separat .com-sajt**

Med "global" som målgrupp rekommenderar jag en separat sajt. Den svenska sajtens innehåll (partners, priser, geografiska data) passar inte automatiskt för global marknad, och du vill inte låsa in dig i en massiv i18n-refaktorering.

---

## Vad vi behöver bygga för Alternativ 1 (separat .com)

### 1. Skapa nytt projekt via Remix
- Remix:a detta projekt till ett nytt Lovable-projekt.
- Koppla en ny domän (t.ex. `d365guide.com` eller `d365partners.com`).
- Konfigurera Lovable Cloud för det nya projektet.

### 2. Innehållsmigrering och översättning
- Exportera relevant data från nuvarande databas:
  - `partners` (filtrera bort eller flagga för Sverige om inte globala)
  - `partner_news`, `knowledge_articles`, `industry_*`, `product_*`, `site_settings`
- Översätt med AI (se nedan) för att generera engelska versioner.
- Importera till den nya databasen.
- Justera innehåll för global publik: ändra valuta från SEK till USD/EUR, anpassa regionala referenser, ändra kontaktuppgifter (t.ex. `thomas.laine@dynamicfactory.se` kan behållas om du vill).

### 3. UI- och kodanpassningar i det remixade projektet
- Byt all svensk UI-text till engelska.
- Uppdatera SEO-titlar, meta descriptions, OG-bilder, canonical, sitemap.
- Uppdatera navigation, hero, footer, CTA-knappar, e-postmallar, PDF-mallar.
- Ta bort eller dölj Sverige-specifika sektioner (t.ex. "83 identifierade partners i Sverige").
- Uppdatera landnings-URL:er och interna länkar.

### 4. AI-översättningspipeline
- Alternativ A: **One-shot batch-översättning av allt via script**
  - Skriva script som exporterar svensk text, anropar Lovable AI Gateway, och importerar tillbaka engelska texter.
  - Används för UI-strings, artiklar, produktbeskrivningar, partner-summaries, nyheter.
  - Manuell granskning och justering efteråt.
- Alternativ B: **Edge-funktion för översättning i realtid**
  - Används om du vill kunna översätta nya inlägg automatiskt vid publicering.
  - Rekommenderas för `partner_news` och `knowledge_articles` så att engelska versionen hålls synkad.

---

## AI-översättningens omfattning och kostnad

### Uppskattad volym text
- **UI-komponenter:** ~300–500 korta texter/strängar (knappar, labels, placeholders, errors, toast).
- **Statiska sidor:** ~50–80 sidor med 2–5 textblock per sida (hero, produkt, bransch, om, kontakt, etc.).
- **Dynamiskt innehåll:**
  - ~84 partnerprofiler (summary, product description, customer examples, competencies, etc.)
  - ~100–200 partnernyheter
  - ~50–100 kunskapsartiklar
  - ~20 industrisidor
  - ~15 produktsidor
- **E-postmallar och PDF-mallar:** ~20–30 mallar.
- **SEO-meta:** ~140+ routes med title/description.

### Översättningskostnad (Lovable AI Gateway)
- AI-översättning är generellt billigt per token.
- En grov uppskattning: ~150 000–300 000 tokens för hela webbplatsens textinnehåll (beroende på hur mycket du väljer att översätta).
- Med gateway-priser motsvarar det ofta några dollar till ett tiotal dollar i credits för textöversättningen.
- **Bilder och OG-bilder:** Om du vill generera nya engelska OG-bilder kostar det mer (image generation är dyrare än text). Detta är valfritt — du kan återanvända designen med engelsk text överlagrat.

### Viktigt om AI-översättning
- AI är bra på att översätta generisk text, men branschspecifika termer ("verksamhetslösningar", "affärssystem", "behovsanalys", "kravspecifikation") behöver granskas.
- Viss svensk copy är marknadsspecifik och bör omarbetas, inte bara översättas (t.ex. TAYA-filosofin, "köparsidig vägledning").
- Rekommenderad process: AI-översätt → manuell QA på strategiska sidor → AI-översätt resten iterativt.

---

## Kostnader och credits

### Lovable-credits för själva bygget
- Bygga en remixad sajt med översättning av UI och migrering av innehåll är ett medelstort till stort projekt.
- Det går inte att ge ett exakt antal credits i förväg (Lovable debiterar per användning och iteration), men räkna med **många meddelandeturnar** för migrering, översättning, QA och justeringar.
- Jämförelse: tvåspråkig samma kodbas är tekniskt mer komplext och skulle troligen kräva ännu fler credits.

### Löpande kostnader
- **Nytt Lovable-projekt:** Lovar Cloud för nytt projekt (separat databas, hosting, edge functions).
- **Ny domän:** Egen .com-domän (kostar utanför Lovable).
- **AI-översättning:** En engångskostnad för batch-översättning, sedan låg löpande kostnad om du lägger till nytt innehåll.
- **Underhåll:** Dubbla sajter innebär dubbelt underhåll, men ändringar kan ske asynkront.

### Vad vi kan göra för att hålla nere kostnaden
- Översätt inte allt på en gång. Börja med UI + 20 strategiskt viktiga sidor + top 20 partnerprofiler.
- Återanvänd samma design, färger, fonter, komponenter — byt endast text och bilder med engelsk text.
- Använd batch-script för AI-översättning istället för manuella kopieringar.
- Skjut på nya engelska OG-bilder till senare fas.

---

## Rekommenderad fasindelning

### Fas 1: Remix och grundstruktur (1–2 veckor)
- Remix:a projektet.
- Sätt upp ny domän, Lovable Cloud, Supabase-projekt.
- Byt all svensk UI-text till engelska i komponenterna.
- Uppdatera index.html, metadata, favicon, logo, footer, nav.

### Fas 2: Innehållsmigrering och AI-översättning (2–3 veckor)
- Exportera svensk partnerdata, nyheter, artiklar, industrisidor, produktsidor.
- Bygg batch-script som översätter till engelska via Lovable AI Gateway.
- Importera till ny databas.
- Granska och justera strategiskt innehåll (hero, TAYA, produktbeskrivningar, partner-summaries).

### Fas 3: SEO, routing och lansering (1–2 veckor)
- Uppdatera sitemap, canonical, hreflang, OG-bilder.
- Anpassa routes för global publik (ta bort Sverige-specifika referenser).
- Testa alla flows (behovsanalys, kravspecifikation, lead-formulär, månadsrapport, admin).
- Lansera soft launch och övervaka.

### Fas 4: Löpande synkning (efter lansering)
- Edge-funktion eller admin-knapp för att översätta nya `partner_news` och `knowledge_articles` till engelska automatiskt.
- Möjlighet att flagga innehåll som "endast svenskt" eller "globalt".

---

## Nästa steg — välj riktning

Jag rekommenderar **Alternativ 1: separat .com-sajt via Remix** för en global målgrupp. Om du vill gå vidare behöver vi bestämma:

1. **Vilket domännamn** vill du använda? (t.ex. `d365guide.com`, `d365partners.com`, `d365global.com`)
2. **Ska vi börja med Fas 1** (Remix + grundstruktur) direkt, eller vill du först se en mer detaljerad kostnadsuppskattning och tidsplan?
3. **Vilka delar ska översättas i första fasen?** Allt, eller UI + strategiskt innehåll först?

Säg till så skapar jag en detaljerad byggplan eller startar Fas 1.