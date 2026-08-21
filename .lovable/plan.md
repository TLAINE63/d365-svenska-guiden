# Videoindex för Dynamics 365 — automatisk gruppering per produkt och fråga

## Placeringsbeslut (svaret på din fråga)

Videoindexet ska ligga **inom Kunskapscentret** som en egen sida på `/kunskapscenter/videor/`, inte som en fristående top-rutt. Skälet:

- Den befintliga videoinfrastrukturen lever redan där — `src/data/kunskapVideos.ts` (4 kuraterade Shorts), `/kunskapscenter/video/:slug` (SSG-landningssida med VideoObject JSON-LD) och `src/lib/youtube.ts` (ID-/thumbnail-/embed-verktyg). Allt återanvänds.
- Kunskapscentret är sajtenens hem för utbildningsinnehåll; den nuvarande "Videor"-filtret blir naturlig ingång till ett bredare index.
- En fristående rutt skulle skapa en konkurrerande innehållssilo och bryta mot internal-linking-strategin (pelare → kunskapscenter → djuplänkar).

Därtill byggs en **återanvändbar sektionskomponent** `RelevantVideosSection` som varje produktsida (Business Central, F&SCM, Sales, Customer Service, Copilot etc.) kan bädda in för att visa auto-grupperade videor för sin produktgrupp, med rekommendationer baserade på vanliga frågor.

## Vad som byggs

1. **Databastabell `d365_videos`** — videometadata med auto-klassade fält:
   - `youtube_id`, `title`, `description`, `channel_title`, `published_at`, `duration`
   - `product_groups text[]` (BC, F&SCM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Commerce, HR, Project Operations, AI/Copilot)
   - `question_tags text[]` (t.ex. "byta system", "implementeringskostnad", "crm vs erp", "ai-readiness")
   - `status` (`pending` | `published` | `rejected`) — för manuell godkännandeflöde
   - `ai_summary text` — neutral sammanfattning genererad av Gemini
   - RLS: anon SELECT endast `status = 'published'`; authenticated/admin full CRUD via service role.

2. **Edge-funktion `ingest-youtube-videos`** — schemalagd inläsning från utvalda YouTube-kanaler (Microsoft Dynamics 365-kanalen + partnerkanaler) via YouTube Data API. Hämtar nya uppladdningar, lagrar som `pending`, anropar Gemini för att föreslå `product_groups` och `question_tags` utifrån titel + transkript. Spegelar mönstret från `ingest-partner-feeds`.

3. **Admin-gränssnitt** i AdminDashboard — ny flik "Videor" (`AdminVideosTab.tsx`):
   - Lista pending videor, godkänn/avvisa/redigera föreslagna produkt- och frågetaggar
   - Lägg till YouTube-URL manuellt (använder `extractYouTubeId` från `youtube.ts`)
   - Bulk-regenerera AI-taggar

4. **Sida `/kunskapscenter/videor/`** (`VideoIndex.tsx`):
   - Grid med videokort (thumbnail + titel + produktchips + frågechips)
   - Filter: produktgrupp (flerval), frågetyp, kanal
   - Rekommendationsrad: "Mest relevanta för [produkt]" + "Vanliga frågor"-gruppering
   - SEO: SSG-prerenderad, VideoObject JSON-LD per video, faq-länkar till Kunskapscenter-artiklar

5. **Sektionskomponent `RelevantVideosSection`** — visas på produktsidor:
   - Hämtar publicerade videor för sidans produktgrupp
   - Grupperat per frågetag, max 6 videor
   - Länkar vidare till `/kunskapscenter/videor/?produkt=<grupp>` för full index

6. **Koppling till befintliga landningssidor** — `/kunskapscenter/video/:slug` (`VideoLanding.tsx`) behålls och läser nu från databas om videon finns där, annars fallback till `knowledgeVideos.ts` (bakåtkompatibel).

## Tekniska detaljer

- **YouTube Data API:** kräver API-nyckel — läggs via `add_secret` som `YOUTUBE_API_KEY`. Inläsning schemaläggs via `pg_cron` (samma mönster som `email_queue_dispatch`).
- **AI-klassning:** Gemini via Lovable AI Gateway (`/chat/completions`) — prompten ber om JSON med `product_groups[]` och `question_tags[]` utifrån kanalens kända innehåll + videots titel/beskrivning. Samma mönster som `generate-partner-insights`.
- **SSG:** nya rutt läggs i `entry-server.tsx` prerender-listan; `/kunskapscenter/videor/` prerenderas statiskt med alla publicerade videor inbäddade som JSON (samma mönster som `partnerData.json`).
- **Databas-migration** följer GRANT-ordningen: CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY.
- **Färger/tokens:** videokort använder `--accent` (teal) för frågechips och `--primary` för produktchips, enligt designminne — aldrig lila (endast AI/Copilot) eller amber (endast insight).

## Berörda filer

- Ny: `src/pages/VideoIndex.tsx`, `src/components/RelevantVideosSection.tsx`, `src/components/AdminVideosTab.tsx`, `supabase/functions/ingest-youtube-videos/index.ts`, DB-migration
- Ändras: `src/App.tsx` (ny rutt), `src/entry-server.tsx` (SSG + prerender), `src/components/Navbar.tsx` (länk under Kunskapscenter), `src/pages/Kunskapscenter.tsx` ("Videor"-filter länkar till index), produktsidor (bäddar in `RelevantVideosSection`), `src/pages/VideoLanding.tsx` (läser från DB)
