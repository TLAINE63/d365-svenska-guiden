# Fler leads: mät först, konvertera sedan

## Nuläge (verifierat i databasen)

- 74 leads totalt, varav bara **8 de senaste 90 dagarna** (41 av alla kom i januari).
- Fördelning per källa: lead_magnet 37, cta 11, kravspec 8, ebook 7, AI-readiness 4, ROI-PDF 1.
- **34 partnerklick** på 90 dagar.
- `funnel_events` innehåller **0 rader** – all CTA-mätning (visning → klick → PDF → lead) är död eftersom `trackFunnelEvent` kräver cookie-samtycke som nästan ingen ger. Samma orsak som besöksspårningen hade.

Slutsatsen: vi kan inte optimera det vi inte mäter, och de tre konverteringsvägarna (partnerklick, mejl till partner, PDF mot e-post) är idag utspridda och lågt exponerade.

## Steg 1 – Få igång mätningen (förutsättning)

- Ta bort samtyckeskravet i `trackFunnelEvent` och mät anonymt på samma sätt som besöksspårningen (maskerad IP, sessions-id i sessionStorage, ingen cookie).
- Lägg till `cta_view`/`cta_click` på de CTA:er som saknar det: `ScrollCTA`, `EbookBanner`, `RoiPdfDownload`, `SendUnderlagToPartners`, partnerkortens kontakt- och webbplatsknappar.
- Ny admin-vy "Konverteringsvägar" som visar per CTA: visningar, klick, konverteringsgrad och leads – så vi ser vilka som är värda att skala.

## Steg 2 – Sänk tröskeln i själva lead-momentet

- **Ett fält i taget.** ScrollCTA kräver idag namn + företag + e-post. Byt till enbart jobb-e-post i steg 1, resten efter att leadet är sparat.
- **Visa värdet före formuläret.** PDF-nedladdningarna får en liten förhandsvisning (miniatyr + innehållsförteckning) i stället för bara en knapp.
- **Bekräftelsesteget blir ett nytt erbjudande.** Efter varje nedladdning/analys: "Vill du att vi skickar underlaget till 2–3 matchande partners?" med ett klick – återanvänder befintlig `SendUnderlagToPartners`.
- **Exit-intent på höga sidor** (produktsidor, ROI-kalkylatorer, kostnadssidan): en enda, dämpad ruta med guiden – max en gång per session.

## Steg 3 – Fler och bättre kontaktytor mot partner

- **Sticky kontaktfält på partnerprofilen** som följer med vid scroll (kontakta + besök webbplats), i dag ligger knapparna bara högt upp.
- **Kontakta flera samtidigt** från jämförelsevyn och från partnerlistorna: kryssa i 2–3 partners, ett formulär, en förfrågan.
- **Kontextuell CTA i partnerkorten** i listor: i dag måste man in på profilen först.
- **Tydligare värdeord** vid partnerklick ("Se deras kundcase" i stället för "Besök webbplats") – testas mot mätningen från steg 1.

## Steg 4 – Rätt erbjudande på rätt sida

- Varje pelarsida får ett **sidspecifikt lead-erbjudande** i stället för samma generella partnerguide: BC-sidan → BC-kravspecmall, kostnadssidan → prischecklista, branschsidor → branschens upphandlingsfrågor.
- Kunskapscenterartiklar får ett inbäddat erbjudande mitt i texten (inte bara i botten).
- Nyhetsartiklar från partner avslutas med kontaktknapp till just den partnern.

## Steg 5 – Uppföljning som skapar fler klick

- Automatiskt uppföljningsmejl 2 dagar efter en nedladdning: "Här är 3 partners som matchar det du läste om" – med spårade länkar tillbaka till profiler.
- Alla lead-mejl får en tydlig nästa-åtgärd i stället för enbart bilagan.

## Tekniska noteringar

- `src/utils/trackFunnelEvent.ts` – ta bort `hasConsent()`-spärren, behåll exkluderingsflaggan för intern trafik.
- Ny hook för exit-intent + sessionStorage-spärr, återanvänds av alla sidor.
- Progressiv profilering kräver ett `lead_id` tillbaka från `submit-lead` så att steg 2 kan uppdatera samma rad.
- Fleravalskontakt bygger på befintlig `PartnerCompareContext` och `submit-lead`/`send-underlag-to-partners`.
- Ingen ny tabell behövs; `funnel_events` och `leads` räcker.

## Föreslagen ordning

Steg 1 först (utan mätning är resten gissningar), därefter steg 2 och 3 som ger snabbast effekt, sedan 4 och 5.
