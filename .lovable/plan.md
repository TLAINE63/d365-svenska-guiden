# Sprint 1: Från kortlista till förfrågan

Beslut: webbplatslänk tillåten (med utm), personuppgiftsansvarig Dynamic Factory, inget svarstidslöfte, endast sprint 1.

## Nuläge (inventering)
- Kortlista (`d365-shortlist`, obegränsad) och jämförelse (max 3) är två separata listor i webbläsaren.
- Förfrågan på profilen: befintligt formulär som sparar via `submit-lead` (tabellen leads) och mejlar partner + kopia.
- Min D365-plan finns lokalt (buyerProfile/buyerContext).
- Mätning finns redan i flera spår (funnel_events, partner_engagement_events, partner_profile_views, partner_clicks).
- Adminroll finns (user_roles admin/editor).
- Kom igång-metabeskrivningen säger "Fyra snabba frågor". Sitemap-lastmod sätts per grupp i generate-sitemap-skriptet.

## Vad som byggs
1. **Datamodell**: tabellerna inquiries, inquiry_partners, partner_events med source_site. Endast INSERT för anonyma, läsning via admin.
2. **Två funktioner**: `submit-inquiry` (validering, sparning, mejl till godkända partners med kopia till d365.se, bekräftelse till köparen) och `track-event`. CORS endast d365.se och businesscentral.se (+ förhandsvisning).
3. **Partnerprofilen**: tre knappar, i ordningen Be om kontakt, Lägg till i kortlista, Till partnerns webbplats. "Fråga d365.se" och jämförelse flyttas bort från profilen.
4. **Förfrågan**: ett gemensamt formulär med exakta texter från prompten, max tre partners, samtyckesruta per partner (ej förvald), projektunderlag från Min D365-plan, integritetstext med Dynamic Factory. Öppnas från profil, kortlista, jämförelse, Kom igång-resultat och partnerlistan. Tacksida /forfragan/tack.
5. **Kortlista**: jämförelseurvalet slås ihop med kortlistan; ordet "kortlista" överallt i synlig text. /kortlista/ blir huvudadress, /shortlist/ 301:as dit. Knapparna "Jämför" och "Kontakta valda partners"; /jamfor-partners/ får "Kontakta de här partnerna"; Kom igång sparar förslagen i kortlistan.
6. **Mätning**: gemensam `track()` med de åtta händelserna, en profilvisning per partner och session. Befintlig mätning lämnas kvar.
7. **Rättelser**: "sex snabba frågor", lastmod per sida där datum finns, startsidans hero med två knappar.
8. **Neutralitetskontroll**: endast redovisning, inga ändringar.

## Teknisk not
- Gamla `submit-lead`/PartnerRequestDialog lämnas orörda för övriga formulär; profilens förfrågan går via nya flödet.
- Verifiering med curl kräver publicering; testförfrågan körs med d365.se:s egen adress som mottagare och raderas efteråt.
