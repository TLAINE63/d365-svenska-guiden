# Plan: Stärk AI-synligheten enligt de fem stegen

Fyra spår, i den ordning de ger effekt.

## 1. Publicera + prestanda (störst omedelbar effekt)

Navbar-CLS-fixen och de komprimerade partnerbilderna finns redan i koden/lagringen men är inte publicerade – produktionen ligger fortfarande på CLS ~0,35.

- Publicera nuvarande läge så CLS-fixen och bilderna slår igenom.
- Mät om desktop och mobil efter publicering (Lighthouse mot d365.se).
- Sänk mobilens TBT ytterligare: skjut upp tunga icke-kritiska komponenter på startsidan och verifiera att gtag/Snitcher faktiskt inte startar före första interaktion.

## 2. FAQ- och entitetsschema

Idag finns Organization/LocalBusiness/WebSite/Breadcrumb i `StructuredData.tsx`, men frågedriven markup används ojämnt.

- Inventera vilka sidor som redan har JSON-LD och vilka som saknar.
- Lägg en gemensam, återanvändbar FAQ-sektion (synlig text + matchande JSON-LD) på de sidor som redan svarar på konkreta frågor: produktsidor, `/kostnad`, `/erp`, `/crm`, branschsidor.
- Se till att varje partnerprofil har entitetsmarkup (Organization + adress/ort) så AI-motorer kan koppla partner till bransch och plats.
- Säkerställ att Breadcrumb finns konsekvent på alla djupa sidor.
- Frågor och svar hämtas ur befintligt innehåll – inga påhittade uppgifter.

## 3. AI-synlighetsmätning (KPI:er)

Idag mäts besök och leads, men inget om AI-källor. Besökslogg fångar redan `referrer`.

- Klassificera inkommande trafik på AI-källor (chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini m.fl.) utifrån referrer, samt bot-träffar från GPTBot/PerplexityBot/ClaudeBot i loggen.
- Ny adminvy: "AI-synlighet" med tre KPI:er per månad – besök från AI-assistenter, AI-crawlers som hämtat sajten, och vilka sidor de landar på.
- Manuell citeringslogg: en enkel tabell där ett antal fasta testfrågor (t.ex. "bästa Dynamics 365-partner i Sverige") registreras med om d365.se nämns – kan fyllas i månadsvis och trendas.
- All statistik exkluderar interna besök enligt gällande regel.

## 4. Auktoritet och citeringar

- Gör marknadsrapporten 2026 till en citerbar datakälla: stabil URL, tydligt publiceringsdatum, metodavsnitt och "så här citerar du".
- Publicera ett öppet, maskinläsbart utdrag av partnerdata (antal partners per bransch/region) som JSON/CSV med licensvillkor.
- Utöka `llms.txt` med de nya datakällorna och FAQ-sidorna.
- Lägg `sameAs` för LinkedIn och andra profiler i Organization-schemat så entiteten kan kopplas ihop.

## Teknisk sammanfattning

- Prestanda: publicering + ev. lazy-justeringar på startsidan, ingen arkitekturändring.
- Schema: ny delad FAQ-komponent + JSON-LD via befintlig `SEOHead`/`StructuredData`-struktur.
- Mätning: referrer-klassificering i befintlig besöksdata, ny adminflik, liten tabell för citeringslogg.
- Auktoritet: statisk datafil i `public/` + uppdaterad `llms.txt`.

## Ordning

1 → 3 → 2 → 4. Prestanda först (redan gjort arbete som bara behöver ut), sedan mätning så effekten av steg 2 och 4 går att följa.
