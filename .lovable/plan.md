# Riktig köparfunnel med stegvisa tapp

## Mål
Se exakt var besökare tappar, inte bara "låg CTA-konvertering":

```text
Landning → CTA sedd → CTA klick → Start → Steg 1 → Resultat → Shortlist → Jämförelse → Be om introduktion → Skickad förfrågan
```

Plus fyra delkonverteringar som egna nyckeltal:
- SEO/GEO-besök → verktygsstart
- Verktygsstart → resultat
- Resultat → shortlist
- Shortlist → partnerkontakt (skickad förfrågan)

Alla besök räknas (även Thomas och partners), enligt gällande beslut.

## Vad som byggs

1. **En gemensam besökskedja per session**
   Varje händelse får samma anonyma sessions-id, landningssida, trafikkälla (Google, Bing, ChatGPT/Perplexity/Copilot = GEO, direkt, LinkedIn, e-post) och verktyg (Kom igång, behovsanalyser, CRM-test m.fl.). Inga cookies, inget personligt.

2. **Tio fasta funnelsteg** som mäts på ett enhetligt sätt:
   `landing`, `cta_view`, `cta_click`, `tool_start`, `tool_step_1`, `tool_result`, `shortlist_add`, `compare_open`, `intro_open`, `intro_sent`.
   Kopplas in där det redan finns spårning: kontextuella CTA:er, Kom igång, behovsanalyserna, shortlist, jämförelse, partnerbeslutsknapparna och förfrågningsdialogen (skickas först när förfrågan faktiskt gått igenom).

3. **Ny funnelvy i Admin → Statistik → Funnel**
   - Staplar med antal och % kvar per steg, största tappet markerat.
   - De fyra delkonverteringarna som kort överst.
   - Filter: period (7/30/90 dagar), trafikkälla (SEO, GEO/AI, direkt, övrigt), landningssida, verktyg, mobil/desktop.
   - Tabell "Topp 20 landningssidor" med besök, CTA-klick, starter, resultat och skickade förfrågningar per sida.
   - Datum ÅÅÅÅ-MM-DD.

4. **Sessionsinspelningar (valfritt, separat steg)**
   Rekommendation: Microsoft Clarity (gratis) begränsat till de 10–20 viktigaste landningssidorna och Kom igång. Laddas bara efter att besökaren godkänt statistikcookies, med formulärfält maskade. Kräver att Thomas skapar ett Clarity-projekt och ger projekt-id. Integritetstexten uppdateras.

## Tekniska detaljer
- Utöka befintlig `track-funnel-event` och tabellen för funnelhändelser med kolumnerna `step`, `session_id`, `landing_path`, `traffic_source`, `tool`, `device`, `partner_slug`. Källan klassas vid första sidvisning i sessionen (referrer + utm) och sparas i sessionStorage.
- Ny hjälpare `trackFunnelStep(step, meta)` i `src/utils/trackFunnelEvent.ts`; befintliga anrop mappas om, gamla händelsetyper behålls för bakåtkompatibilitet.
- `intro_sent` loggas i förfrågningsdialogens lyckade svar, inte vid klick.
- `funnel-stats` får en ny action som räknar unika sessioner per steg (sessionen räknas i ett steg om den nått steget, oavsett ordning) och delkonverteringar; `AdminFunnelTab` byggs om till vyn ovan.
- Clarity: skript injiceras dynamiskt efter samtycke via CookieBanner, sidlista i en konfig-fil.

## Ordning
1. Datamodell + spårningshjälpare. 2. Koppla in alla tio steg. 3. Adminvy. 4. Verifiera med en testsession hela vägen till skickad förfrågan. 5. Clarity när projekt-id finns.
