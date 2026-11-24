# Partnerprogram: nytt perspektiv på Premium

Premium kommuniceras som närvaro i köparens beslutsprocess, marknadsinsikter och fler affärer, inte som en betald profil med funktioner. Befintliga flöden (beställning, profilkoll, prislista, villkor, FAQ) återanvänds; URL:er och ankare behålls.

## Sidans nya ordning (/partnerprogram/)

1. **Topp** – rubrik "När kunderna utvärderar sina alternativ – finns ni med?", underrubrik "Syns under köparnas beslutsprocess. Förstå marknadens efterfrågan. Skapa nya affärsmöjligheter.", knapparna "Utforska Premium" och "Priser och innehåll", raden "Från 8 000 kr/år · Ingen mötesavgift för Premium" och tre små värdeord (Synlighet, Marknadsinsikter, Affärsförmedling). Ny genererad bild i sajtens stil (inte bilden från ChatGPT).
2. **Sex anledningar att välja Premium** – de sex korten från underlaget, med bild, rubrik och text.
3. **Er närvaro genom köparens beslutsprocess** – sex steg (Orientering till Förvaltning), varje steg länkar till befintligt innehåll på sajten. Avslutas med "En partnerprofil är bara en del av erbjudandet…".
4. **Hur synliga är ni när nästa kund börjar sin utvärdering?** – de fem frågorna och avslutningen.
5. **En aktiv mötesplats** – riktiga siffror från sajtens egen statistik (befintlig Marknadspuls) med angiven period. Siffrorna i underlaget (2 923 med flera) används inte, eftersom de kommer från olika mätperioder.
6. **d365.se Marknadsinsikter** – två kolumner: Marknadsinsikter och Egen närvaro, enligt tabellen i underlaget. Inga företagsnamn lämnas ut.
7. **Att finnas med är inte samma sak som att vara synlig** – texten om skillnaden mellan Grundprofil och Premium.
8. **Priser** – årspris först med effektiv månadskostnad (667 / 875 / 1 000 kr/mån), månadspriset som alternativ. Den befintliga prislistan och beställningen behålls.
9. **Premium kan betala sig redan vid er första större affär** – jämförelsetabell (0 / 8 000 kr, 3 500 / 0 kr, 5 % / 2,5 %) och exemplet med 320 000 kr. Hamnar efter värdet, inte först.
10. Befintliga delar som ligger kvar: ISV-kortet, profilkoll, märke, expertinnehåll, kom igång, kommersiella principer, FAQ.

## Avtalsvillkor och PDF
- Premiumavtalets inledning beskriver vad Premium ger (synlighet, marknadsinsikter, förmånlig affärsförmedling) med samma ord som sidan.
- Prisbilagan visar årspris, effektiv månadskostnad och månadspris.
- Partner-PDF:en byggs om från samma texter, så att den matchar sidan.

## Gränser
- Inga löften om ett visst antal möten, ingen konstgjord exklusivitet, aldrig "oberoende".
- Betalning påverkar aldrig ordning eller verifiering; det står kvar.
- Sidans granskningsdatum sätts till dagens datum.

## Teknik
- Nya sektioner som egna komponenter under src/components/partner/, med texterna samlade i en datafil.
- Beräkning av månadskostnad och break-even (320 000 kr) från de delade prisvärdena, med tester.
- Statistik via befintlig public_market_pulse, med statisk reserv.
