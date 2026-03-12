# Internationalisering – d365.se / d365.no / d365.com

## Översikt

Bygga domänbaserat flerspråksstöd (sv/no/en) i en och samma kodbas. Ingen URL-prefix – språket bestäms av domänen:

| Domän | Språk | Marknad |
|-------|-------|---------|
| d365.se | Svenska (sv) | Sverige |
| d365.no | Norska (no) | Norge |
| d365.com | Engelska (en) | Global |

---

## Fas 1: i18n-infrastruktur (~50 credits)

### 1.1 Språkdetektering
- Skapa `src/i18n/LanguageContext.tsx` med React Context
- Detektera språk via `window.location.hostname` (.se → sv, .no → no, .com → en)
- Fallback till `sv` i utvecklingsläge (localhost)
- Exportera hook `useLanguage()` som returnerar aktuellt språk

### 1.2 Översättningssystem
- Skapa `src/i18n/translations/` med en JSON-fil per språk:
  - `sv.json` (extrahera befintliga svenska texter)
  - `no.json` (norska översättningar)
  - `en.json` (engelska översättningar)
- Skapa `useTranslation()` hook som hämtar rätt strängar baserat på språk
- Strukturera översättningar per sida/komponent, t.ex.:
  ```json
  {
    "nav": { "home": "Hem", "partners": "Välj partner", ... },
    "index": { "hero_title": "...", "hero_subtitle": "..." },
    "crm": { "title": "...", "description": "..." }
  }
  ```

### 1.3 Översättningshjälp (t-funktion)
- Skapa `t(key)` helper som slår upp nyckel i aktuellt språks JSON
- Stöd för interpolation: `t('greeting', { name: 'Anna' })` → "Hej Anna"

---

## Fas 2: SEO & metadata (~30 credits)

### 2.1 Flerspråkig SEOHead
- Uppdatera `SEOHead.tsx` med hreflang-taggar:
  ```html
  <link rel="alternate" hreflang="sv" href="https://d365.se/crm" />
  <link rel="alternate" hreflang="no" href="https://d365.no/crm" />
  <link rel="alternate" hreflang="en" href="https://d365.com/crm" />
  <link rel="alternate" hreflang="x-default" href="https://d365.com/crm" />
  ```
- Dynamisk canonical URL baserat på aktuell domän
- Översätt title och meta description per språk

### 2.2 Strukturerad data
- Uppdatera JSON-LD (Organization, WebSite, FAQ) med rätt språk
- `inLanguage` sätts dynamiskt

### 2.3 Sitemap & robots.txt
- Generera språkspecifika sitemaps vid build (eller en sitemap med hreflang)
- robots.txt pekar på rätt sitemap per domän

---

## Fas 3: Komponentöversättning (~80–120 credits)

### 3.1 Prioritetsordning för sidöversättning
1. **Navbar & Footer** (syns på alla sidor)
2. **Startsidan (Index)** (mest trafik)
3. **Produktsidor** (CRM, ERP, Business Central, etc.)
4. **Partnerkatalog** (ValjPartner)
5. **Behovsanalys-sidor**
6. **Övriga sidor** (QA, Kontakt, Events, etc.)

### 3.2 Strategi per komponent
- Ersätt hårdkodade svenska strängar med `t('nyckel')`
- Behåll all logik och layout oförändrad
- Testa att sidan renderas korrekt på alla tre språk

---

## Fas 4: Partnerdata per marknad (~20 credits)

### 4.1 Databasuppdatering
- Lägg till `markets` (text[]) kolumn på `partners`-tabellen
- Standardvärde: `{'sv'}` för befintliga partners
- Filtrera partnerlistan baserat på aktuellt språk/marknad

### 4.2 Eventhantering
- Events kan vara marknadsspecifika eller globala
- Lägg till `market` kolumn på `partner_events`

---

## Fas 5: Domänkonfiguration (~10 credits)

### 5.1 Custom domains i Lovable
- Koppla d365.se som primary domain (redan klart?)
- Koppla d365.no som extra custom domain
- Koppla d365.com som extra custom domain
- Alla tre pekar på samma deploy

### 5.2 Prerendering
- Uppdatera `vite-prerender-plugin.ts` för att generera HTML per språk
- Alternativt: Förlita sig på runtime-detektering (enklare, men sämre för SEO)

---

## Fas 6: Kvalitetssäkring (~20 credits)

- [ ] Verifiera att alla sidor renderas korrekt på sv/no/en
- [ ] Kontrollera hreflang-taggar i view-source
- [ ] Testa partnerfiltrering per marknad
- [ ] Validera structured data per språk
- [ ] Google Search Console: lägg till d365.no och d365.com som properties

---

## Estimat

| Fas | Credits | Tid |
|-----|---------|-----|
| 1. i18n-infrastruktur | ~50 | Steg 1 |
| 2. SEO & metadata | ~30 | Steg 2 |
| 3. Komponentöversättning | ~80–120 | Steg 3 (största jobbet) |
| 4. Partnerdata | ~20 | Steg 4 |
| 5. Domänkonfiguration | ~10 | Steg 5 |
| 6. QA | ~20 | Steg 6 |
| **Totalt** | **~210–250** | |

---

## Risker & beslut att ta

1. **Norska översättningar** – Bokmål eller nynorsk? (Rekommendation: Bokmål)
2. **Partnerdata** – Ska norska/globala partners matas in manuellt eller importeras?
3. **SEO-prerendering** – Runtime-detektering fungerar för crawlers med JS, men prerendering per språk ger bättre resultat
4. **Underhåll** – Nya texter måste läggas till i alla tre JSON-filer. Överväg att använda AI-översättning som hjälpmedel.

---

## Nästa steg

Börja med **Fas 1** (i18n-infrastruktur) – detta är grunden som allt annat bygger på.
