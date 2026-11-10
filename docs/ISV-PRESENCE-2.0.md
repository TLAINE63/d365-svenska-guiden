# ISV Presence 2.0, 2026-11-10

## Levererat
- Gemensam produktmall på `/isv/produkt/<solution_id>/`, samma befintliga katalog och produktidentifierare. Katalogkort, produktköpresans exempel och profilkoll länkar dit; äldre `?losning=` fortsätter till samma produkt.
- Publik produkt-/leverantörssnapshot med redaktionella overrides och tillåtna fakta, inga privata kontakter. Förgenerering använder samma innehåll som besökaren. 221 publicerade databasprodukter hämtades; plattformsprodukter undantas som tidigare.
- Produktsektioner och lokal meny styrs av innehåll. Inga fabricerade bilder eller nya produktpåståenden.
- Standard visar köparinformation. Presence kan dessutom visa bilder, video, fördjupade funktioner och högst tre kundcase. Logotyp/webblänk/kontakt kräver fortfarande verifiering OCH Presence enligt Thomas beslut.
- Verifiering, presentationsabonnemang och produktvisa integrationsbelägg hålls åtskilda. Endast granskade källbelagda uppgifter får integrationsmärke; dokumenterade partners kräver granskad specifik relation. Produktområdets generella partnersökning håller isär relevans och ISV-erfarenhet.
- Fyra additiva JSON-fält på befintlig produktpost: product_gallery, product_features, integration_evidence, partner_evidence. Ingen ny produktmaster, ingen ändring av befintliga kontaktbehörigheter eller businesscentral.se-regler.
- Admin/Redaktion har en riktig redigeringsdialog i befintlig statuspanel. Leverantören kan skicka bilder/funktioner/relationsdokumentation genom samma granskningskö. Inskick får aldrig sätta reviewed; tidigare starkare belägg bevaras vid svagare leverantörsinsändning.
- Enkel produktstatistik för senaste 30 dagar i befintlig administrationsvy för Presence, från befintliga funnel-händelser. Ingen avancerad panel eller unikbesökaruppgift.

## Pilot
XMReality (`xmreality-ad9180`) är verifierad och har Presence. Befintliga beskrivningar, fem användningsområden och appkopplingar visas; bilder, filmer, kundcase och dokumenterade produktpartners saknas och deras sektioner döljs. `xmreality-for-dynamics` förblir en separat post, dess påståenden blandas inte med piloten.

## Verifierat
- 16 presentations-/validerings-/kontakt-/katalogtester och 7 kompletterande befintliga urvals-/relevanstester passerade.
- Pilotens SSR-rendering innehåller faktisk produkttext, sidtitel, Open Graph och Twitter-taggar; 38 501 tecken HTML. Ingen manuell produktionsbuild kördes. Befintlig React-varning om Navbar fetchPriority kvarstår, ingen renderkrasch.
- Sitemap-generatorn inkluderar produktadresser; pilotens adress kontrollerad.
- Webbläsare: dator 1280x1800, mobil 390x844, ingen överbredd eller runtimefel. Pilot, rådgivning öppnad med produktunderlag, partnersökning med Customer Service och Field Service samt gamla direktlänkar kontrollerade.
- Inloggad Redaktion: produktdialog öppnad, befintligt tomt material sparat utan nya påståenden, dialog stängd och produktens innehåll läst tillbaka publikt.
- Senaste automatiska kontroll: build OK.

## Begränsningar och senare arbete
- XMReality behöver verkligt bildmaterial, videolänk, kundcase och relationsdokumentation för att alla utökade sektioner ska synas. Inget genererat produktmaterial har lagts till.
- Statistik är händelseantal, inte unika människor, och följer befintlig mätning/samtycke. Inget avancerat leverantörsdashboard.
- Leverantörens nya materialväg är kod-/valideringstestad; inget verkligt nytt leverantörsinsändningsärende eller rådgivningsutskick skapades under kontrollen.
- Ingen publicering gjord; sökmotorindexering och full produktionsgenerering kontrolleras efter publicering.