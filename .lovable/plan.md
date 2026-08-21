# Automatiserat videoindex – Dynamics 365 på YouTube

Samla in videor automatiskt från utvalda YouTube-kanaler, låt AI klassificera dem per produktgrupp och frågeställning, och publicera dem i Kunskapscentret med filter och rekommendationer på produktsidorna.

## Vad som byggs

**1. Videobibliotek i databasen**
Ny tabell `d365_videos` som lagrar video-id, titel, beskrivning, kanal, publiceringsdatum, längd, thumbnail, språk samt AI-genererade fält: produktgrupper (BC, F&SCM, Sales, Customer Service, Customer Insights, HR, Project Operations, Commerce, Power Platform, Copilot/AI), frågetyp (t.ex. "Vad är X", "Pris & licens", "Implementering", "Demo", "Nyheter", "Integration"), svensk sammanfattning, relevanspoäng och status (ny/publicerad/dold).
Publikt läsbara är bara publicerade videor; skrivning sker via edge-funktion.

**2. Kanalregister**
Tabell `d365_video_sources` för de kanaler som ska bevakas (Microsoft Dynamics 365, Microsoft Mechanics, utvalda partner-/community-kanaler). Aktiv/inaktiv, senaste hämtning, antal importerade.

**3. Automatisk inläsning (edge-funktion `ingest-d365-videos`)**
Hämtar nya videor per kanal via YouTube Data API, hoppar över redan importerade (unikt video-id), begränsad batch per körning, låsrad så två körningar inte krockar, och pausas automatiskt vid kvot-/kreditfel. Nya videor klassificeras av Gemini via Lovable AI: produktgrupper, frågetyp, svensk sammanfattning och relevanspoäng. Irrelevanta videor markeras som dolda istället för att raderas. Schemaläggs dagligen och kan köras manuellt från admin.

**4. Admin – fliken "Videor"**
Lista med filter på status/produkt/kanal, möjlighet att publicera, dölja, redigera taggar och sammanfattning, samt "Hämta nu"-knapp och hantering av bevakade kanaler.

**5. Publikt videoindex `/kunskapscenter/videor/`**
Filter på produktgrupp och frågetyp, sökfält, kort med thumbnail, svensk sammanfattning, kanal och längd. Klick öppnar videon i modal/på YouTube. Sidan är prerenderad med SEO-titel, beskrivning och `ItemList` + `VideoObject` JSON-LD.

**6. Rekommenderade videor på produktsidor**
Återanvändbar sektion `RelevantVideosSection` som visar 3–4 mest relevanta videor per produktgrupp, placerad på BC-, F&SCM-, CRM- och AI-sidorna samt i befintliga kunskapshubbar. Befintliga manuella Shorts i `src/data/knowledgeVideos.ts` behålls och visas tillsammans med de automatiskt inlästa.

## Tekniska detaljer

- Databas: två nya tabeller med RLS (publik SELECT endast på `status = 'published'`), GRANTs och `updated_at`-trigger.
- Edge-funktion: `supabase/functions/ingest-d365-videos/`, batchstorlek ~25 videor/körning, idempotent via unikt `youtube_id`, kretsbrytare vid 402/403 från AI-gatewayen och vid YouTube-kvotfel.
- Nyckel: kräver en `YOUTUBE_API_KEY` (YouTube Data API v3) – begärs som secret innan implementation.
- AI-klassificering via Lovable AI (Gemini) med kompakt JSON-schema utan hårda längdgränser; fallback vid ogiltigt svar sätter status "ny" för manuell granskning.
- Frontend: ny route i router + prerender-listan, hook `useD365Videos`, komponenter `VideoIndex`-sida, `VideoFilterBar`, `VideoCard`, `RelevantVideosSection`.
- Design följer befintliga tokens och Kunskapscentrets kortstil.

## Ordning

1. Migration (tabeller, RLS, grants)
2. Secret för YouTube API
3. Edge-funktion för inläsning + AI-taggning, testkörning
4. Admin-flik
5. Publik indexsida + SEO
6. Rekommendationssektion på produktsidor
