# Paket 2: kontroll av paket 1, 2026-11-18

## Resultat: stopp före implementation

Båda verkliga specialistförfrågningarna skickades från `/kompetens/` via det befintliga formuläret. Testerna märktes TESTDATA och använde Thomas registrerade företagsadress för bekräftelse. Inga partners valdes eller kontaktades. Befintligt utskick till d365.se och bekräftelsemejl kunde utlösas; inkorgsleverans har inte verifierats.

| Kontroll | Faktiskt resultat |
| --- | --- |
| Slutkund | HTTP 200 och registrerad förfrågan |
| Dynamics-partner | HTTP 200 och registrerad förfrågan |
| Beställare och uppdragsroll | `end_customer`/`customer_org` respektive `partner`/`delivery` sparade i `advisory_cases.journey_selection` |
| Övrigt delat underlag | Power BI, Senior, start 2027-01 och omfattning sparade i `journey_context` |
| Samtycke | Inskick utan godkännande blockerades i båda formulären; `privacy_ack=true` på sparade förfrågningar |
| Automatisk kvalificering | Båda ärendena hade status `ny`, bokning `forfragan` och noll partnerkopplingar |
| Adminvisning av Köpresa | Inte verifierad: tillgänglig kontosession gav inte åtkomst till admin |
| Äldre ärenden | Befintliga enhetstester godkända; verklig adminvisning inte verifierad |
| Testdata | De två förfrågningarna och tillhörande ärendena rensade |

## Hinder och nästa steg

Admin använder en egen administratörssession via `admin-login`, inte den vanliga kontosession som går att återställa automatiskt. Försöket att öppna admin med kontosessionen gav nekad åtkomst. Detta fastställer inte ett fel i den vanliga admininloggningen. Inga autentiseringsregler ändrades och ingen säkerhet kringgicks.

För att slutföra steg 0 behövs fungerande admininloggning i förhandsvisningen och möjlighet att använda den sessionen vid kontrollen. Därefter behöver testärendena åter skapas, öppnas i admin och rensas. Paket 2 får inte börja innan adminvisning och äldre ärenden har verifierats.

## Tester och ändringar

24 av 24 befintliga tester godkända i `buyerJourneys.test.ts`, `helpRequests.test.ts`, `expertRequirement.test.ts` och `advisory.test.ts`.

Endast arbetslistan och denna kontrollrapport ändrades. Inga produktsidor, specialistflöden, metadata, URL:er, tabeller eller kvalificeringsregler ändrades. Ingen publicering gjordes. Paket 2:s produktinventering och kompletteringar är inte påbörjade enligt stoppregeln.