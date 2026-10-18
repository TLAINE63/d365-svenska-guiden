# Site Intelligence v2, installation i testläge

## Genomfört

- Fem SDK- och instruk­tionsfiler är byte-för-byte identiska med anslutningspaketet.
- En gemensam SDK-adapter ersätter tidigare Site Intelligence-sändare. Befintlig backendstatistik, export, Google-mätning och innehåll lämnas kvar.
- `environment` är alltid `test`. Ingen publicering eller produktionsaktivering har gjorts.
- Statistikgodkännande och Do Not Track kontrolleras före SDK-identitet, lagring och anrop. Återkallande stoppar direkt.
- Partnernycklar hämtas från paketets register. 87 befintliga publika partneradresser kunde kopplas till registrerade nycklar. Okända leverantörer skickas inte.
- SDK-händelser skickar inte metadata från formulär eller äldre mätning. URL-frågor och fragment tas bort av SDK. Sökvägar med tydliga personuppgifter blockeras före SDK-anrop.
- Thomas och partners får samma samtyckesvillkor som andra. Äldre statistikundantag gäller inte den nya SDK-adaptern.

## Täckning

| Verklig handling | SDK-händelse |
| --- | --- |
| Sidvisning och sidbyte | page_view |
| Registrerad partnerprofil | provider_profile_view |
| Befintlig partnerkortsexponering | partner_list_view |
| Partnerjämförelse med minst två registrerade partnernycklar | comparison_view |
| Partnerns webbplats via befintlig klickfunktion | outbound_provider_click |
| Första inmatning i kontaktformulär, inte endast öppning | lead_start |
| Bekräftad partnerförfrågan, kontakt eller underlag | lead_submit |
| Befintliga nedladdnings- och verktygsstarter | download / tool_use |
| Engagemang enligt paketets trösklar | engaged_session |

Kontoinloggning och lösenordsformulär räknas inte som kontaktstart. Underlag klassificeras som guide_request, allmän kontakt som general_contact och partnerkontakt som provider_contact. Inga påhittade content- eller comparison-nycklar har skapats. Övriga händelser i paketets register aktiveras inte utan en motsvarande faktisk handling och registrerade dimensioner. Mottagarens härledda multiple_* och journey_step_reached skickas inte från sajten.

## Verifierat

- Nio riktade tester godkända: samtycke, testmiljö, site key, Do Not Track, återkallande, URL-minimering, felhantering, formulärstart och engagemang efter 30 synliga sekunder.
- Webbläsare: Implemas riktiga profil, statistikgodkännande via befintlig knapp, verkligt klick på webbplatslänken och återkallande. Korrekt testhändelse för vidareklick observerad; inga runtimefel och inga nya SDK-händelser efter återkallande.
- SDK-sändning i detta flöde verifierades först mot en lokal avlyssning som inte vidarebefordrade något. Inget formulär skickades och inga testleads skapades.
- Senaste automatiska byggkontroll: godkänd.

## Extern kontroll återstår

Ett verkligt anrop från localhost-förhandsvisningen till Site Intelligence gav HTTP 403 för testhändelser. Därför är mottagning, Diagnostics och replay med tracked=0 inte verifierade. Mottagaren behöver tillåta avsedd testorigin eller kontrolleras från sin tillåtna sajtorigin innan installationen kan slutgodkännas. Produktionsaktivering kräver fortfarande Thomas uttryckliga godkännande.