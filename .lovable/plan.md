# ISV Presence 2.0

## Det finns redan
- Ett gemensamt leverantörs- och produktregister med stabila produktidentifierare, redaktionell redigering och leverantörernas profileringslänkar.
- Separat verifiering för leverantör och produkt. ISV Presence är redan ett eget abonnemangsval, inte ett verifieringsbevis.
- Katalogfilter för applikationer, branscher och behov, produktkopplade köpresor, partnerregister och rådgivning till d365.se.
- Produktfakta, demovideolänk och kundcase, samt profilkoll och jämförelse för leverantörer och produkter.
- Händelser för produktvisning, leverantörsvisning, vidareklick och rådgivning.

## Det saknas
- Egna indexerbara produktsidor. I dag öppnas produkten i katalogens dialogruta.
- En sammanhållen produktpresentation med bildgalleri och fördjupade funktioner.
- Tydligt dokumenterade integrationsbelägg och belägg för en specifik partners produktrelation. En registrerad applikation eller partnerslug är inte i sig ett verifierat belägg.
- En enkel produktvis statistikredovisning för ISV Presence.

## Beslut och avgränsning
**Dagens krav behålls enligt Thomas svar:** logotyp, webblänk och kontakt kräver både produktverifiering och aktiv ISV Presence. Det ersätter förslagets friare logotypregel för Standard och kontaktregel för overifierad Presence.

Verifiering, abonnemang och integrationsbelägg visas separat. Abonnemang får aldrig påverka relevans eller rekommendationer. Priserna är fortsatt **5 990 kr/år inklusive en produkt, 995 kr/år per extra produkt, exkl. moms**.

Inga nya register, matchningsmotorer, automatiska verifieringar eller avancerade statistikpaneler. Befintliga adresser och kopplingar bevaras. Reglerna för businesscentral.se ändras inte.

## Genomförande
### 1. Gemensam produktsida
- Ge varje publicerad katalogprodukt en egen adress, exempelvis `/isv/produkt/<befintligt-produkt-id>/`, med förgenererad text, sidtitel, beskrivning och sociala delningstaggar samt plats i sajtkartan.
- Länka från katalog, produktsektioner och ISV-profilkoll. Behåll katalogens befintliga direktlänkar så äldre länkar fortsätter fungera.
- Utgå från Bisqos partnerprofil för typografi, färger och kvalitet, men prioritera produktnamn, användning och produktmaterial.
- Lägg in en lokal direktmeny bara för de avsnitt som faktiskt visas.

### 2. Standard och utökad presentation
**Standard:** produktnamn, leverantör, beskrivning, kundproblem, användningsområden, applikationskopplingar, befintliga produktfakta, målgrupp, branscher, förutsättningar och belagda partnerrelationer. Rådgivning och relevant partnersökning finns kvar.

**ISV Presence:** innehållsstyrt bildgalleri, video, fördjupade funktioner, högst tre kundcase och grundläggande besöksstatistik. Märk med **”Utökad leverantörspresentation”**. Logotyp, webblänk och kontakt visas endast när dagens dubbla krav är uppfyllt.

Varje sektion kräver både rätt presentationsbehörighet och faktiskt innehåll. Ingen tom sektion och inga påhittade produktbilder. Att Presence är aktivt gör inte produkten verifierad.

### 3. Belägg och partners
- Visa **”Integrationsuppgift styrkt”** endast vid dokumentation för just den integrationsuppgiften och en uttrycklig redaktionell granskning. Befintlig allmän verifiering räcker inte.
- Visa **”Partners med dokumenterad erfarenhet av lösningen”** endast för relationer med belägg. Befintliga kopplingar bevaras men uppgraderas inte automatiskt till dokumenterad erfarenhet.
- Separat nästa steg: **”Hitta en Dynamics 365-partner inom produktområdet”**, med befintlig produktfiltrering och utan antydan om erfarenhet av ISV-produkten.
- Återanvänd befintlig rådgivning. Leverantörskontakt använder tillåtna befintliga kontaktuppgifter; inga obelagda demobokningslänkar skapas och inga uppgifter skickas automatiskt till leverantören.

### 4. Redigering och statistik
- Komplettera samma redigeringsvy i Admin/Redaktion med galleri, fördjupade funktioner och dokumentation för integrationer och partnerrelationer.
- Leverantörsinsändningar går fortsatt genom befintlig granskningskö. Endast redaktionen kan markera ett belägg granskat.
- Återanvänd befintliga produktvisnings- och klickhändelser, undvik dubbelräkning mellan dialog och produktsida och visa enkla produktvisa antal för ISV Presence i befintlig administrationsvy.

### 5. XMReality-pilot och kontroll
Det finns **två separata verifierade poster med aktiv Presence**: `xmreality-ad9180` (XMReality) och `xmreality-for-dynamics` (XMReality for Dynamics). Behåll båda och använd den förstnämnda som pilot, utan att blanda deras produktpåståenden.

De saknar registrerad logotyp, demofilm, kundcase och produktpartners. Piloten visar därför faktiska beskrivningar och användningsområden, inte fabricerat material. Den andra posten har en Marketplace-källa som inte automatiskt räknas som granskat integrationsbelägg.

- Testa Standard, Presence utan verifiering och verifierad Presence; material saknas respektive finns; högst tre kundcase; inga obelagda integrationer eller partnerrelationer; neutral relevans och oförändrade priser.
- Kontrollera katalog till produktsida, rådgivning och partnersökning på dator och mobil samt förgenerering och sajtkarta.
- Redovisa återanvändning, ändringar, datakompletteringar och vilka delar som fortfarande saknar verkligt produktmaterial.

## Tekniska detaljer
- Behåll `isv_solutions`, `isv_vendors`, `isv_submissions`, verifieringstrigger och de publika kontakt-/faktafunktionerna som källor. Inga ändringar i privata kontaktuppgifters åtkomst.
- Komplettera befintlig produktpost med strukturerade fält för galleri, fördjupade funktioner och produktvisa integrations-/relationsbelägg. Lagra inte leverantörsfakta på nytt. Migrera endast nödvändiga tillägg och låt befintliga poster starta utan belägg.
- Använd separata presentationsbehörigheter per innehållstyp och befintlig exponeringsregel för skyddad kontakt och logotyp.
- Utöka nuvarande Vite-förgenerering med en publik produktsnapshot som bevarar stabila identifierare och redaktionella ändringar; använd aldrig klienthämtning som enda källa för indexerbart innehåll.
- Säkerställ servervalidering för redaktionellt granskade belägg och återanvänd befintlig rollkontroll, granskningskö och statistikåtkomst.