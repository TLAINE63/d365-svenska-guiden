# Paket 2: kontroll av paket 1, 2026-11-18

## Resultat: steg 0 verifierat, 2026-11-18

Uppföljningen använde den riktiga lösenordsinloggningen på `/admin/`. `admin-login` svarade HTTP 200 och Rådgivning öppnades utan runtimefel. Inga autentiseringsregler behövde ändras. Den tidigare blockeringen var en skillnad mellan kontosession och adminsession, inte ett verifierat inloggningsfel.

Två tillfälliga, tydligt märkta specialistärenden skapades direkt i befintliga tabeller för visningskontrollen utan mejlutskick. Båda hämtades via `manage-advisory` och öppnades i den inloggade ärendevyn:

- Slutkund: beställare Slutkund, roll Resurs i kundens egen projektorganisation, Sales och Testledare.
- Partner: beställare Dynamics-partner, roll Leveransresurs i implementations- eller vidareutvecklingsprojekt, Business Central och Solution Architect.
- Båda visade Dynamics-specialister med grunden Enligt kundens val, Power BI, Senior, start 2027-01 och respektive omfattning (6 månader respektive 50 % i 6 månader). Status var Ny och bokning Förfrågan.
- Befintligt äldre ärende öppnades utan ändring: Ej fastställd köpresa och inga påhittade specialistuppgifter. Det delade underlagets Customer Insights och Sales stod kvar.
- Listan gick att hämta om. Inga runtimefel noterades. Den befintliga adminlayouten har sidöverbredd vid 390 px; detta har inte ändrats inom åtkomst- och uppgiftskontrollen.
- Testärendena och förfrågningarna togs bort efter kontrollen. Ingen partnerintroduktion skapades. 24 befintliga tester godkända och aktuell byggkontroll OK.

Steg 0:s visningshinder är därmed undanröjt. Paket 2:s produktarbete påbörjas inte inom detta felsökningsuppdrag.

## Ursprunglig kontroll och tidigare hinder

Båda verkliga specialistförfrågningarna skickades från `/kompetens/` via det befintliga formuläret. Testerna märktes TESTDATA och använde Thomas registrerade företagsadress för bekräftelse. Inga partners valdes eller kontaktades. Befintligt utskick till d365.se och bekräftelsemejl kunde utlösas; inkorgsleverans har inte verifierats.

| Kontroll | Faktiskt resultat |
| --- | --- |
| Slutkund | HTTP 200 och registrerad förfrågan |
| Dynamics-partner | HTTP 200 och registrerad förfrågan |
| Beställare och uppdragsroll | `end_customer`/`customer_org` respektive `partner`/`delivery` sparade i `advisory_cases.journey_selection` |
| Övrigt delat underlag | Power BI, Senior, start 2027-01 och omfattning sparade i `journey_context` |
| Samtycke | Inskick utan godkännande blockerades i båda formulären; `privacy_ack=true` på sparade förfrågningar |
| Automatisk kvalificering | Båda ärendena hade status `ny`, bokning `forfragan` och noll partnerkopplingar |
| Adminvisning av Köpresa | Verifierad i uppföljningen med riktig admininloggning, båda specialistärendena |
| Äldre ärenden | Verifierad i uppföljningen genom öppnat befintligt ärende utan nya specialistuppgifter |
| Testdata | De två förfrågningarna och tillhörande ärendena rensade |

## Hinder och nästa steg

Admin använder en egen administratörssession via `admin-login`, inte den vanliga kontosession som går att återställa automatiskt. Försöket att öppna admin med kontosessionen gav nekad åtkomst. Detta fastställer inte ett fel i den vanliga admininloggningen. Inga autentiseringsregler ändrades och ingen säkerhet kringgicks.

Detta hinder löstes i uppföljningen ovan genom den befintliga lösenordsinloggningen. Testärenden skapades, öppnades och rensades. Adminvisning och äldre ärenden är nu verifierade.

## Tester och ändringar

24 av 24 befintliga tester godkända i `buyerJourneys.test.ts`, `helpRequests.test.ts`, `expertRequirement.test.ts` och `advisory.test.ts`.

Endast arbetslistan och denna kontrollrapport ändrades. Inga produktsidor, specialistflöden, metadata, URL:er, tabeller eller kvalificeringsregler ändrades. Ingen publicering gjordes. Paket 2:s produktinventering och kompletteringar är inte påbörjade enligt stoppregeln.