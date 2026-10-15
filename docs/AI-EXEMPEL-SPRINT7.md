# AI-exempelbiblioteket: Sprint 7-rapport (2026-10-15)

## Nya internlänkar
- Gemensam ingångsruta "Ett nytt sätt att arbeta" (AiExamplesEntry) på /businesscentral/, /d365sales/, /d365customerservice/, /finance-supply-chain/, /d365fieldservice/, /d365projectoperations/. Länken öppnar biblioteket filtrerat på applikationen.
- Startsidan: AI-frågan i FAQ länkar till "Se konkreta AI-exempel för Dynamics 365". Länken till AI-översikten pekar nu direkt till /aioversikt/ (tidigare via vidarekoppling).
- Exempelsidor: "Förstå tekniken" (max 2 länkar: /copilot/ eller /agents/ samt /aioversikt/).
- Listvyn: "Fortsätt utforska" efter sjätte kortet (AI-översikt, vald applikation, partners).
- BC-exempel: "Fördjupa dig i Business Central på businesscentral.se" och "Utvärderar du Business Central?" (matchningstestet).

## Ändrade CTA:er
- Exempelsidans CTA-block ersattes av "Nästa steg för dig": ett primärt (fler exempel i samma applikation) och ett sekundärt steg (produktsida eller businesscentral.se för BC).
- Partnerlänken flyttades längst ned: "Vill du använda detta i din verksamhet?" → "Hitta rätt partner", med produktfilter för Sales, Customer Service, Field Service och Finance/SCM.
- "Kort svar" direkt under rubriken, byggt endast av verifierade fält.
- Relaterade exempel följer nu nästa arbetsmoment i samma applikation, med samma roll först. Ingen slump.

## Mätning
- Ny händelse ai_library_entry_click (source_page: startsida eller produktsida). Övriga resor via Sprint 6-händelserna (ai_related_example_click, ai_ai_hub_click, ai_product_content_click, ai_partner_cta_click).

## Testade resor (Chromium, desktop och mobil)
- A Business Central: /businesscentral/ → filtrerat bibliotek → "Hitta den senaste fakturan" → relaterade BC-exempel → businesscentral.se / partner. PASS
- B Sales: /d365sales/ → filtrerat bibliotek → "Sammanfatta ett lead" → partner med produktfilter Sales. PASS
- C Roll: bibliotek → rollfilter → exempel → relaterat → produkt. PASS (testat i Sprint 6, oförändrad filterlogik)

## Återvändsgränder
- Upptäckta: produktsidorna saknade väg till biblioteket; exempelsidor hade partnerlänk utan produktkontext. Båda åtgärdade.

## MÅSTE ÅTGÄRDAS
- Inget blockerande.

## KAN OPTIMERAS SENARE
- Partnerlistan saknar produktfilter för Business Central och Project Operations, så de länkarna saknar produktkontext.
- Egen delningsbild för biblioteket (i dag sajtens standardbild).
- Finance och SCM delar produktsida; en egen SCM-sida skulle ge mer precisa länkar.
