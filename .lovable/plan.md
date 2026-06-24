# Partnerprofil som beslutsstöd

Idag är profilen mest en presentation. Vi gör om den så att den hjälper köparen välja mellan ett redan filtrerat urval. Fyra block ovanför fold på varje profil, samma struktur för alla partners.

## Ny struktur (i ordning)

1. **Positioneringsrad** (direkt under namn/logo)
   - En mening: "Vi är valet när …" — partnerns spetsläge i klartext.
   - Tre nyckeltaggar: primär app, primär bransch, primär storlekssegment.
   - Källa: ny fält `positioning_statement` + härledda taggar från `product_filters`.

2. **Leveransbild** (vad du faktiskt får)
   - Typiska roller i teamet (t.ex. Lösningsarkitekt, Funktionskonsult, Utvecklare).
   - Typisk projektlängd och startmodell (workshop, fast pris, T&M).
   - Metod/ramverk i en mening (Sure Step, egen metodik, etc.).
   - Källa: ny strukturerad fält `delivery_profile` (JSONB).

3. **Jämförbar faktatabell** (samma rader för alla partners)
   - Storlek på D365-team i Sverige
   - Antal genomförda D365-implementationer (intervall)
   - Geografisk närvaro (kontor)
   - Branschfokus (max 3)
   - AI-nivå (befintlig score)
   - Avtalspartner ja/nej
   - Källa: dels befintliga fält, dels nya intervallfält.

4. **"När passar vi inte"** (obligatorisk)
   - 2–4 punkter där partnern själv pekar ut fel matchning (t.ex. "under 20 användare", "ren molnmigrering utan verksamhetsförändring", "publik sektor").
   - Visas alltid, även om kort. Tom = profilen flaggas som ofullständig i admin.
   - Källa: nytt fält `not_a_fit` (text[]).

Resten av profilen (kundcase, events, kontakt, video) ligger kvar nedanför men sekundärt.

## Datamodell

Nya kolumner på `partners`:

- `positioning_statement text`
- `delivery_profile jsonb` — `{ roles: string[], typical_length: string, engagement_model: string, methodology: string }`
- `team_size_sweden text` (intervall: "1–10", "11–25", "26–50", "50+")
- `implementations_done text` (intervall: "<10", "10–25", "25–100", "100+")
- `not_a_fit text[]`

Alla fält valfria i DB men obligatoriska i publicerings-flow (samma mönster som AI-fälten idag).

## Admin

Ny sektion "Beslutsprofil" i partner-editorn med fälten ovan. Validering vid publicering: positioning + minst 2 `not_a_fit`-punkter + delivery_profile ifyllt → annars varningsbadge på admin-listan (befintligt mönster).

## Frontend

- `src/pages/PartnerProfile.tsx`: byt ut nuvarande hero-block (rad 470+) mot fyra-block-strukturen. Behåll TrustBanner, SEO, kundcase, events.
- Ny komponent `src/components/partner/DecisionProfile.tsx` som renderar block 1–4 i identisk layout för alla partners.
- Faktatabell som CSS grid med fasta rader så två profiler i två flikar går att jämföra visuellt.
- AI-genererad fallback (Lovable AI) för `positioning_statement` om tomt, markerad med befintlig "AI-genererad"-badge — samma mönster som industry_pitches idag.

## Konsekvenser

- PartnerCard rör vi inte (kortet är discovery, profilen är beslut).
- Befintliga profiler utan nya fält visar tomma block med "Partner har inte fyllt i" tills admin uppdaterar — neutralt, ingen pitchig fyllnadstext.
- Migration är additiv, ingen risk för befintlig data.

## Tekniska detaljer

- Migration: `ALTER TABLE public.partners ADD COLUMN ...` + GRANT redan på plats (oförändrat).
- Types regenereras automatiskt av Lovable Cloud.
- Edge function `match-partners` ändras inte — detta är ren profilförbättring, inte rankning.

## Öppna frågor

- Ska `not_a_fit` även visas på PartnerCard i resultatlistan (snabb diskvalificering) eller bara på profilen? Förslag: bara profilen i v1.
- Vill du att jag AI-genererar förslag för befintliga partners på `positioning_statement` och `not_a_fit` baserat på deras nuvarande data, så admin bara godkänner?
