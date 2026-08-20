# Publicera artikeln "Fem sekunder till svaret, ett år till beslutet"

Lägg in den uppladdade artikeln som en egen fullständig artikel i Kunskapscentret på
`/artiklar/ai-sok-dynamics-365-partners/`.

## Innehåll

- Titel (H1): Fem sekunder till svaret, ett år till beslutet
- Underrubrik: Vad AI-driven sökning gör med synligheten för partners inom affärssystem, CRM och Copilot
- Författare: Thomas Laine, publiceringsdatum augusti 2026
- Hela brödtexten från dokumentet (sidorna 1–8) inklusive:
  - AI-sammanfattning överst
  - Vad som hänt i köpprocessen (G2-siffror)
  - Varför SEO-logiken inte överförs rakt av (Ahrefs-korrelationer)
  - Vad som är detsamma oavsett segment
  - Var CRM-sidan beter sig annorlunda + Copilot/agenter
  - Segmenten (mindre bolag, mellansegment, enterprise), branschdimensionen
  - Språket, Vad som faktiskt påverkar, skepsis mot statistik
  - Och för köparen, Slutsats, avslutande CTA till d365.se
  - Källförteckning och författarpresentation
- LinkedIn-inläggen och marknadsföringsplanen publiceras **inte** på sajten – det är internt material.

## SEO

- metaTitle: AI-sök förändrar hur köpare hittar Dynamics 365-partners
- metaDescription: enligt dokumentets förslag
- Ingress/summary till artikelkort: enligt dokumentets förslag
- Kategori: AI och partnerurval. Taggar: AI-sök, AIO, GEO, Dynamics 365-partner,
  Business Central, CRM, Customer Engagement, Power Platform, Copilot, agenter,
  partnerprofilering
- Interna länkar i texten: /partnerprogram, partneröversikt, Business Central,
  CRM/Customer Engagement, Copilot/AI-översikt

## Teknik

- Ny post i `src/data/blogArticles.tsx` (slug `ai-sok-dynamics-365-partners`),
  JSX-innehåll enligt befintlig struktur i filen.
- Ny hero-bild i `src/assets/articles/` genererad i sajtens visuella stil
  (motiv: AI som bearbetar underlag till sammanfattning/analys) – ingen bild från
  dokumentet återanvänds.
- Rutten prerenderas automatiskt via befintlig SSG-lista för artiklar; verifieras
  efter bygge.
- Artikeln sätts som `featured` så att den lyfts i Kunskapscentret/startsidan.

## Frågor jag antagit

- Artikeln publiceras med dagens datum i augusti 2026.
- Inga FAQ-block (bigFiveFaq) läggs till, då dokumentet inte innehåller sådana.
