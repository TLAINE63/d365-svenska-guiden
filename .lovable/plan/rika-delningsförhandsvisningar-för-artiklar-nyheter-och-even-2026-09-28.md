# Rika delningsförhandsvisningar för artiklar, nyheter och events

## Mål
Varje delningsbar detaljsida ska leverera sin egen titel, beskrivning, kanoniska URL, innehållsbild och innehållstyp direkt i sidans HTML, så att LinkedIn, Facebook, Slack och andra tjänster kan skapa en relevant förhandsvisning.

## Genomförande
- Behåll och kvalitetssäkra befintliga Open Graph- och Twitter-taggar för kunskapsartiklar och bloggartiklar.
- Lägg publicerade Partnernytt-artiklar till den statiska sidgenereringen och förse den med artikelns titel, sammanfattning, datum, partner och sparade bild.
- Utöka eventens statiska underlag med eventbild, arrangör och datum, och använd `event` som delningstyp där det stöds.
- Använd endast absoluta `https://d365.se`-adresser och befintliga publicerade bilder; använd sajtens 1200×630-standardbild när innehållet saknar egen bild.
- Lägg regressionstester som kontrollerar titel, beskrivning, egen URL, bild, Twitter Card och artikel-/eventmetadata i den färdiggenererade HTML-filen.

## Avgränsning
- Ingen synlig sidtext eller design ändras.
- Ingen ny bild skapas och inga externa originalbilder ersätts.
- Ändringen blir synlig på d365.se efter nästa publicering. Delningstjänster kan därefter behöva hämta sidan på nytt.
