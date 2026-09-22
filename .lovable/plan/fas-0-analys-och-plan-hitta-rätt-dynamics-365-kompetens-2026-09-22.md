# FAS 0: Analys och plan – "Hitta rätt Dynamics 365-kompetens"

Inga kodändringar, migrationer eller publiceringar har gjorts. Detta är analys och förslag.

## 1. Svar på frågorna i FAS 0

**a. Rendering.** Sajten är en Vite/React-SPA som prerenderas vid build (`vite-prerender-plugin.ts` + `src/entry-server.tsx`). Varje rutt får en färdig `index.html` med SEO-taggar via Helmet, och dynamiska rutter (partnerprofiler, branschsidor) hämtas i buildsteget via `getDynamicRoutes()`. Slutsats: kravet på redaktionellt innehåll i rå HTML uppfylls om kompetensguiderna är **statisk data i repot** (en TS-datafil), inte data som hämtas från databasen vid körning. Guiderna läggs till i `routes`-listan i entry-server och i `scripts/generate-sitemap.mjs`. Partnerkorten laddas på klienten, vilket är tillåtet. Påverkan på befintliga sidor: ingen, bara nya rutter tillkommer.

**b. Geografi.** Idag finns tre nivåer: `partners.geography` (Sverige/Norden/Europa/Globalt), `office_cities` (orter) och per produktområde `swedenRegions` med sex fasta regioner (Storstockholm/Mälardalen, Syd/Sydväst, Väst, Sydost, Mellansverige, Norr) samt `swedenCities`. Förslag: filtret använder **de sex befintliga regionerna** plus valet "Hela Sverige". Kommun- och länsnivå finns inte i datan och ska inte införas nu.

**c. Formulärflöde.** Ja. `submit-lead` (edge function) har redan CORS-vitlista, hastighetsbegränsning (5 per 5 min per IP), honeypot, serverside-validering, spärr mot gratis e-postdomäner, notifiering via e-post och skrivning till `leads` där anonym insert är blockerad. Behovsformuläret återanvänder detta flöde med ny `source_type` och strukturerat innehåll i `message`, plus tillägg av minimilängd 30 tecken och dubblettspärr.

**d. Analys.** PostHog (`PostHogTracking.tsx`) laddas först efter statistik-samtycke i cookie-bannern (`cookie-consent-v2`), samt egen besöksmätning och `track-funnel-event`. Nya händelser skickas via PostHog och följer därmed befintligt samtycke automatiskt. Ingen fritext eller personuppgift skickas.

## 2. Konflikter i kravspecifikationen som behöver beslut

1. **Antal guider.** Texten säger "sex guider" men listar nio. Jag föreslår att vi bygger strukturen för alla nio och publicerar dem efter din granskning.
2. **URL-format.** Sex av URL:erna ligger under `/kompetens/...`, tre ligger i roten och har stora bokstäver (`/Dynamics-365-CRM-konsult`). Jag föreslår att alla nio ligger under `/kompetens/...` med små bokstäver, konsekvent med övrig sajt.
3. **Max tre profiler per partner i databasen** löses med en trigger, inte en CHECK-constraint (tidsberoende/aggregerad regel).
4. **Integritetspolicyn** nämner inte gallringstid för inskickade behov. Du behöver besluta antal månader och komplettera policytexten; jag ändrar inte policyn själv.
5. **Urvalstexten** (avsnitt 16) publiceras först efter din bekräftelse, inklusive meningen om kommersiell relation.

## 3. Datamodell (förslag, minsta möjliga tillägg)

Återanvänds oförändrat: `partners`, `partners_public`, `leads`, `user_roles`, befintlig geografi- och branschdata.

Nytt:
- `competence_guides` – slug, titel, typ (`role` | `product`), produktområde (null för roll), ingress, sektionstexter, seo-fält, status (draft/published/archived). Redaktionell master ligger i repot för rå-HTML; tabellen används av administrationen och som källa vid build.
- `partner_assignment_profiles` – partner_id, guide_slug, rubrik, erfarenhetssammanfattning, typiska uppdrag, produkter, branscher, regioner, leveransformer (på plats/hybrid/distans), `last_reviewed_at`, status, interna anteckningar. Trigger som blockerar fler än tre publicerade profiler per partner.
- `assignment_profile_evidence` – profil_id, typ (kundcase/kundreferens/certifiering/intern referens), rubrik, url, `is_public`.
- Publik vy `assignment_profiles_public` – endast publicerade profiler, endast publicerade partners, `last_reviewed_at` nyare än 12 månader, och endast godkända kolumner. Interna anteckningar och icke-publika underlag exponeras aldrig.

RLS: aktiv på alla tre tabellerna, ingen anonym läsning eller skrivning. GRANT endast till `service_role` samt läsning för admin/editor via befintlig serverfunktion. Den publika vyn får `SELECT` för `anon`.

## 4. Skydd mot regressioner

- Inga befintliga tabeller, kolumner eller vyer ändras; endast nya objekt skapas.
- `partners_public` lämnas orörd; kompetensfunktionen läser den som idag.
- Kontaktflödet återanvänds genom att skicka extra kontextfält, utan ändrad validering för befintliga formulär.
- Tre befintliga partnerprofiler väljs ut och deras H1, title och canonical sparas som referens och kontrolleras efter varje steg.

## 5. Implementation i verifierbara steg

1. **Datamodell och säkerhet.** Migration för de tre tabellerna, triggern, den publika vyn och RLS. Verifiering: 20.3 i sin helhet.
2. **Redaktionellt innehåll och sidmall.** Datafil med de nio guiderna (status draft), gemensam sidmall, översiktssida `/kompetens`, rutter i entry-server, sitemap och noindex för utkast och filtrerade URL:er. Verifiering: 20.1, 20.2, 20.5.
3. **Partnerkort och filtrering.** Hämtning från publika vyn, filterlogik enligt avsnitt 9, sortering, båda tomlägena, matchningsorsaker. Verifiering: 20.1, 20.3, 20.5.
4. **Kontakt och behovsformulär.** Partnerkontakt med förifylld kontext, nytt behovsformulär via `submit-lead` med minimilängd, integritetsbekräftelse, honeypot, dubblettspärr. Verifiering: 20.4, 20.5.
5. **Administration.** Ny flik i befintlig admin och i `/redaktion`: skapa/redigera profiler, underlag, kontrolldatum, varning inom 60 dagar, publicera/avpublicera/arkivera, samt lista över inkomna behov. Verifiering: 20.3, 20.5.
6. **Mätning.** PostHog-händelser enligt avsnitt 14, bakom befintligt samtycke. Verifiering: 20.5 samt manuell kontroll av att inga fritextfält skickas.

Efter varje steg redovisas den faktiska curl-utdatan.

## 6. Bygger inte

Allt under avsnitt 21 lämnas orört, och inga demodata skapas i produktionsdatabasen.

## Beslut jag behöver från dig

1. Nio guider under `/kompetens/...` med små bokstäver, eller enbart de sex första?
2. Gallringstid i månader för inskickade behov.
3. Ska urvalstexten innehålla meningen om kommersiell relation, och i så fall med vilken formulering?
