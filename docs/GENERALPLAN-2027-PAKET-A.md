# Generalplan 2027 v2.0: paket A

Levererat 2026-11-27 för d365.se. Ingen publicering, inga pris- eller avtalsändringar och ingen ny CRM-integration.

## Återanvändning och ändringar
- ContinueEvaluation anpassar hjälp och föreslår nästa steg från befintlig verktygskontext och sparade kalkyler. Produktområden hålls åtskilda. Besökaren kan ändra sitt önskade steg, inklusive att gå tillbaka till utforskning. Val sparas under besöket per område, kalkylunderlag kan återanvändas från den befintliga lokala planen i högst 30 dagar.
- UNKNOWN är standard utan relevant underlag. Beräknat läge är en hypotes, ett uttryckligt val bekräftar bara vad besökaren vill göra härnäst. Ingen projektavsikt eller QBP skapas automatiskt. Flera projekt och CRM-återföring ingår inte i paket A.
- ToolResultNextStep öppnar befintligt PlanContactDialog med det aktuella resultatet. Egna sammanhang skickar inte hela den äldre planen, avmarkerade verktygsunderlag skickas inte på nytt i dold tool_context.
- AdvisoryOffer leder på beslutspunkter med den kontextuella frågan i stället för en generell bokningsknapp. Startsidan behåller sin befintliga rådgivningsingång.
- AI-exempel, AI-readiness och lösningsvägvalets agentberedskap erbjuder AI-case-rådgivning med relevant underlag och befintliga länkar till ISV-/specialistutvärdering. Case type ImprovementProject är sammanhang, inte bekräftad kvalificering eller påstående om befintlig installation.
- filterAndSortPartners hade kvar avtalsprioritering i äldre produktlistor. Den är nu borttagen i både slumpad och fast ordning. Samma produkt-/bransch-/storleksuppgifter ger samma resultat även med rikare marknadsföringstext eller Premium-status.

## Mätning
Befintlig trackFunnelEvent och journeyFunnels återanvänds. buyer_next_action_clicked mäter ett följt förslag. buyer_next_step_preference anger besökarens önskade steg, inte köpintention. tool_result_help_requested, next_step_help_requested och ai_case_requested mäter skickade hjälpärenden till d365.se, separat från partnerkontakt. Verktygsresultat och kontaktdata går bara via befintlig submit-inquiry. Befintlig CSV-import till Claude-CRM är oförändrad.

## Verifierat
- 48 riktade tester godkända, senaste automatiska byggkontroll godkänd.
- CRM-val, rekommenderad länk och dialog på dator samt 375 och 595 px, utan sidöverbredd eller observerade runtimefel.
- Sales-kalkyl med 12 användare, resultatet visas i delningsförhandsvisningen.
- Verkligt rådgivningsinskick med tydligt märkt testärende till Thomas: HTTP 200, resultat sparat i inquiries.project och tool_context, advisory case status ny, noll partnerrecipienter och noll introduktioner. Testärendet rensat, noll kvarvarande testärenden verifierade.
- Samtyckesspärr före inskick. Framgångsrubrik observerad vid verkligt svar; separat visuell screenshot av bekräftelsen gjord med simulerat svar för att undvika ytterligare testmejl.
- AI-exemplet bankavstämning öppnat och dess underlag visas i rådgivningen, mobil 595 px utan överbredd.
- Neutralitetstester över fast/slumpad ordning, med/utan storleksval och extra Premium-marknadsföringstext.

## Begränsningar och nästa aktivitet
- Admin har separat lösenordsinloggning. Thomas sajt-konto kunde inte öppna admin, så testärendet lästes tillbaka via databasen, inte admin-UI. Inga behörigheter ändrade.
- Slutförd AI-readiness och agentberedskap är regeltestade/kodkontrollerade, inte båda genomklickade från första frågan i denna leverans.
- AI-modellens probabilistiska partnermatchning är inte empiriskt jämförd i denna leverans. Neutralitet är verifierad för den gemensamma lokala produktlistan och den befintliga partnersökningens deterministiska ordning, inte garanterad för alla möjliga AI-svar.
- 25 pilotföretag föreslagna som internt Markdown-/CSV-underlag i Files. Bara d365.se-observationer, inga företag publiceras på sajten. Företagsidentifiering, bransch och storlek behöver kontrolleras. Inga utskick eller QBP-klassningar gjorda.
- Publicera efter granskning. Följ verktygsresultat → hjälpärende och nästa steg → klick, sedan verkliga rådgivningsdialoger i CRM. Paket B/C inte byggda.