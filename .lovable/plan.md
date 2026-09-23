# Bilder från LinkedIn sparas automatiskt i Partnernytt (/redaktion)

## Hur det blir för dig
I /redaktion → Partnernytt:
1. **Klistra in LinkedIn-länken** i "Importera från länk" som i dag. Om inlägget har en bild hämtas den och **sparas direkt i sajtens egen bildlagring**. Den försvinner alltså inte efter några veckor.
2. **Om det inte kommer med någon bild** (låsta inlägg): klicka på bilden i LinkedIn, välj "Kopiera bild" och tryck **Ctrl+V** i bildrutan i formuläret. Bilden laddas upp direkt och du behöver inte spara någon fil.
3. Du kan också klistra in en **bildadress** ("Kopiera bildadress") i bildfältet. Den hämtas och sparas också automatiskt.
4. Som i dag visas en förhandsvisning av bilden, och du kan ta bort den.

Inget publiceras automatiskt. Nyheten granskas som vanligt innan den publiceras.

## Tekniska detaljer
- `manage-partner-news`: ny admin-åtgärd `import-image-url`. Den hämtar en extern bild på serversidan (bara https, image/jpeg/png/webp/gif, max 5 MB, timeout 10 s, blockerar interna adresser), laddar upp den till bucketen `partner-news-images` med samma nyckel- och signeringslogik som dagens uppladdning och returnerar `image_url`.
- `AdminPartnerNewsTab.tsx`:
  - Efter en lyckad länkimport anropas `import-image-url` om `image_url` är en extern adress, och formuläret får den sparade adressen. Om det misslyckas behålls originallänken och en varning visas.
  - Om bildfältet förlorar fokus med en extern adress anropas samma åtgärd.
  - En paste-hanterare på bildrutan tar emot bildfiler från urklipp och skickar dem till den befintliga uppladdningen (base64).
- Befintliga nyheter påverkas inte. RSS-flöden ingår inte i det här steget.
- Verifiering: curl mot funktionen utan admin-token ska ge 401. Ett Playwright-test i /redaktion kontrollerar klistra in och import.
