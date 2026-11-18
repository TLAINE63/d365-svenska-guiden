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

## Kompletterande kontroll av hela uppgiftskedjan

Regel: inskickade specialistuppgifter ska följa ärendet och visas i både admin och redaktionen. Befintliga avslutade/skickade uppgifter och behörigheter ändras inte.

| Plats | Kontroll och resultat |
| --- | --- |
| `/kompetens/`, val och sessionsutkast | Kodläst: beställare och uppdragsroll ingår i utkastet. |
| Specialistguider, inklusive tomresultatets formulär | Kodläst: bevarar utkastet och använder samma ExpertRequirementExit. |
| Primärt specialistformulär | Kodläst och tidigare adminavläsning: metadata och delat underlag finns med. |
| Alternativt specialistformulär | Avvikelse rättad: delade tidigare endast roll/produkt. Båda knapparna använder nu samma metadata och underlag. Verifierat i webbläsaren med avlyssnat inskick: beställare, uppdragsroll, start och omfattning finns med; inga mejl skickades. |
| PlanContactDialog | Kodläst: filtrerar markerat underlag och skickar strukturerade val i advisory_context. |
| submit-inquiry | Kodläst: sparar val i journey_selection och markerat underlag i journey_context/project. Samma underlag används i framtida mejl. Inkorgsleverans inte verifierad. |
| advisory_cases/inquiries och databasfunktioner | Schema och aktiva triggers lästa: valen lagras separat, statussäkring och händelser ändrar inte specialistmetadata. Inget jobb skapar specialistuppgifterna. |
| manage-advisory help_requests/list | Kodläst och tidigare inloggad kontroll: strukturerade val och underlag läses tillbaka. Uppdateringar rör status/anteckningar, inte valen. |
| Admin, Ärenden från hjälpvägarna | Inloggat verifierat för slutkund, partner och äldre ärende. |
| Admin, separat expanderat rådgivningsärende | Kodläst avvikelse rättad: visar nu också beställare och uppdragsroll från journey_selection, även utan delat underlag. Denna tillagda rad är kodkontrollerad, inte separat klickverifierad efter ändringen. |
| Redaktion, Hjälpärenden och Rådgivning | Kodläst: återanvänder exakt samma två ärendevyer. Ingen separat inloggad redaktionskontroll gjordes. |
| Funnelrapport och CRM-export | Kodlästa: räknar specialistärenden respektive exporterar kontaktförfrågan, inte specialistdetaljer. Dessa är inte ärendevyer och har inte utökats inom uppdraget. |

26 riktade tester godkända efter kompletteringarna. Byggkontroll OK. Befintlig mobilöverbredd vid 390 px kvarstår och ingen inkorgsleverans påstås. Produktarbete i paket 2 har inte påbörjats.

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