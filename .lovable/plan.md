# Tekniskt sund hemsida för AI-sök

Bilden listar fyra tekniska krav. Nedan hur d365.se ligger till och vad som ska göras.

## 1. Tillgänglig server med snabb svarstid — delvis

Sajten är statiskt prerenderad, vilket ger snabb leverans. Men de senaste
prestandafixarna (navbarens CLS-fix och de komprimerade partnerbilderna) är
ännu inte publicerade, så produktionen mäter fortfarande CLS ca 0,35 och
mobil TBT ca 2 sekunder.

Åtgärd: publicera, mät om desktop och mobil, och dokumentera resultatet.

## 2. Effektiv kod och semantisk HTML — svagast punkten

Två konkreta problem:

- **CSS laddas asynkront.** Prerender-pluginet gör om `<link rel="stylesheet">`
  till `preload` + `onload`. Det ger en osminkad första rendering (FOUC) och är
  grundorsaken till layouthoppen. Byt till render-blockerande CSS för den
  kritiska stilmallen, eller behåll async men med tillräckligt inline-kritisk
  CSS för hela ovan-vikten-ytan, inte bara navbaren.
- **Semantiska landmärken saknas på ca en tredjedel av sidorna.** 62 av 90
  sidor har `<main>`. Enstaka sidor (t.ex. Events) har mer än en `<h1>`.

Åtgärd: rätta CSS-laddningen, lägg till `<main>` där det saknas, säkerställ
exakt en `<h1>` per sida och korrekt rubriknivåordning, samt rensa oanvänd CSS
(Lighthouse uppskattar ca 32 KiB).

## 3. Schema Mark-Up / entiteter — bra grund, luckor kvar

Organization, LocalBusiness, WebSite, FAQPage, Breadcrumb, Article, Event och
partnerscheman finns redan och används brett.

Åtgärd:
- `Dataset`-schema för det nya öppna partnerdatasetet.
- `Report`/`Article`-schema med utgivare, datum och metod på marknadsrapporten.
- Breadcrumb-täckning: inventera vilka publika sidor som saknar den och lägg till.
- Stärk Organization-entiteten med verifierade `sameAs`-profiler (LinkedIn m.fl.)
  – dessa URL:er behöver bekräftas, inget gissas.

## 4. Undvik client-side renderat innehåll — mestadels löst

Prerender bygger statiska HTML-sidor med verkligt innehåll för de definierade
rutterna plus partner- och branschsidor.

Åtgärd: inventera vilka publika rutter som inte finns i prerender-listan
(bl.a. videobibliotek, partnernytt-artiklar, ISV-sidor, rapportsidan) och
kontrollera i den byggda HTML-filen att innehållet faktiskt finns i källkoden
och inte bara laddas av JavaScript. Lägg till de som saknas.

## Ordning

1. Publicera + mät (punkt 1)
2. CSS-laddning och semantik (punkt 2)
3. Prerender-täckning (punkt 4)
4. Schema-kompletteringar (punkt 3)

## Tekniska detaljer

- `vite-prerender-plugin.ts` rad ~39: `transformIndexHtml` som gör om
  stylesheet-taggen till preload/onload.
- `index.html`: befintlig inline-kritisk CSS täcker idag bara navbaren.
- `scripts/check-prerender-seo.mjs` körs som postbuild och kan utökas med
  kontroll av `<main>`, antal `<h1>` och närvaro av brödtext i HTML.
- Inga ändringar av datainsamling eller analytics ingår; besöksstatistik
  fortsätter exkludera interna besök.
