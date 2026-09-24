# Plan: Sista punkterna från GEO-rapporten

Två åtgärder återstår på startsidan innan rapporten kan köras igen efter publicering.

## 1. Läsbarhet i hero och situationskort (hög prioritet)
- Dela meningar på mer än cirka 20 ord i hero-rubrik, hero-ingress och de fyra situationskorten.
- Budskap, siffror och sökord ändras inte.
- Textreglerna gäller: inga långa tankestreck, och "Dynamics 365" hålls alltid ihop på samma rad.

## 2. Beskrivande alt-texter (innehållsrikedom)
- Alla bilder och app-ikoner på startsidan får alt-texter som beskriver vad de visar, till exempel "Business Central-ikon" i stället för tom eller generisk text.
- Dekorativa bakgrundsbilder lämnas tomma, enligt standard.

## Utanför planen
- Innehållsdjup (61 %) och Auktoritet och förtroende (73 %) kan inte åtgärdas i koden. De kräver mer egen text respektive omnämnanden och länkar från andra sajter. Jag tar dem i en senare runda om du vill.
- Kategorierna Teknisk SEO och Konversationellt ligger redan på 100 %.

## Tekniskt
- Filer: src/pages/Index.tsx samt de komponenter som ritar hero och situationskort.
- Kontroll: sidan hämtas lokalt. Jag kontrollerar att inga meningar överstiger 25 ord och att alla alt-texter finns. Typkontroll körs.
- GEO-kontrollen ser ändringarna först efter publicering.
