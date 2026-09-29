# d365.se BizApps Partner Master Model – MVP (leveransrapport, 2026-09-29)

## 1. Inventerad arkitektur
- `partners` (88 rader, 18 med avtal) är redan master för generell information: id, slug, namn, logotyp, webbplats, geografi, `office_cities`, `team_size_sweden`, branscher, `product_filters` (bc/fsc/crm med storlek, omsättning, branscher), `agreement_signed`/`is_featured`, `updated_at`.
- Produkter lagrades som fritextnamn i `partners.applications` (12 distinkta namn, bl.a. "F&SCM").
- Redigering: partnerns token-baserade profileringslänk (`partner-invitations`) och Admin (JWT-signerad admininloggning). Ingen inloggad partnerportal finns.

## 2. Återanvänt
`partners` (inga nya dubblettfält), admininloggning/JWT-kontroll, Admin → Leads & Partners, profileringslänken, standardbranscher.

## 3. Nya tabeller
| Tabell | Syfte |
|---|---|
| `product_catalog` | 20 produkter, `product_key`, namn, kategori (erp/crm/power-platform/data-ai/other), `legacy_names`, aktiv, sortering |
| `partner_product_profiles` | En per partner+produkt (unik). status, is_primary, is_published, verifiering, summary |
| `bc_attribute_options` | Tillåtna BC-värden (typ + nyckel + etikett) |
| `partner_bc_attributes` | Ett val per rad med egen verifiering och publicering |
| `partner_industry_solutions` | Branschlösningar per produktprofil |
| `partner_certifications` | Tom struktur |
| `export_bc_partner_v1` (vy) | Exportkontrakt |

Förra stegets fält `partners.structured_profile`, `data_verified_at`, `data_verified_by` och `partner_submissions.structured_profile` togs bort. De var tomma.

## 4. Migrationer
1. Skapar tabeller, begränsningar, triggers (aktiv produkt krävs, BC-attribut bara på BC-profil) och exportvy.
2. Backfill: 150 produktprofiler för 38 partners från `applications`, status `legacy_import`, opublicerade. Ingen fritext omvandlad.

## 5. Produktkatalog
`business-central, finance, supply-chain, project-operations, commerce, human-resources, sales, customer-service, field-service, customer-insights, contact-center, power-platform, power-bi, copilot, copilot-studio`. "F&SCM" mappas till finance och supply-chain. Power Apps, Power Automate, Power Pages och Dataverse ingår i den gemensamma förmågan Power Platform och väljs inte separat. `copilot-studio` visas som "Copilot Studio och AI-agenter"; det äldre separata valet `ai-agents` är inaktivt.

## 6. Partnerproduktprofil
`id, partner_id, product_id, status (draft/active/archived), is_primary, is_published, verification_status, verified_by, verified_at, source_url, summary`.

## 7. Business Central-modul
| attribute_type | nycklar |
|---|---|
| migration | nav, bc_onprem, bc_other_environment, visma, monitor, pyramid, jeeves, sap_business_one, fortnox, other_erp |
| competency | manufacturing, projects, service_management, retail_ecommerce, edi, integrations_api, multi_company, international |
| special_delivery | managed_services, rescue, international_rollout, system_consolidation, multi_company_implementation, quickstart_package, proof_of_concept (efterfrågas endast för BC och CRM, inte F&SCM) |

"Annat ERP" har ingen fritext i filtrering. Eventuell kommentar lagras i `editorial_note`.

## 8. Verifieringsmodell
`verification_status`: `partner_verified | editorial_verified | public_source | legacy_import | unverified`. `verified_by`: `partner | redaktion | publik_kalla | import`.
Regler i databasen:
- De tre verifierade statusarna kräver `verified_by`.
- `partner_verified` kräver `verified_at`.
- Dubbletter spärras med unik nyckel.
- Ogiltiga nycklar spärras med främmande nyckel.

AI finns inte som källa.

## 9. Behörigheter och redigeringsflöde
- Alla nya tabeller har RLS utan policyer: ingen publik läsning eller skrivning. Enda åtkomst sker via adminfunktionen `manage-partner-master` (kräver admin-JWT) och via profileringslänken.
- **Admin → Leads & Partners → Partnerdata (master)**:
  - Välj partner och se generell info.
  - Skapa eller välj produktprofil, sätt status, primär, publicerad och verifiering.
  - BC-val med verifiering per val eller för alla val på en gång.
  - Branschlösningar.
- **Profileringslänken**: partnerns BC-val sparas som `partner_verified` med dagens datum och **opublicerade**. Partnern kan bara påverka sin egen partner, eftersom token är knuten till partnern. Avkryssning tar bara bort egna opublicerade förslag. Redaktionellt verifierade och publicerade val rörs inte.

## 10. Migreringsrapport
Fliken "Migreringsrapport" (plus CSV) visar partners med avtal. Varje rad innehåller BC-profil, senast verifierad, antal val per grupp, val som kräver partnerbekräftelse, vad som saknas och fritext som underlag (positionering, metodik, kundexempel, branschappar). Ingen automatisk förifyllnad.

## 11. Exportkontrakt `export_bc_partner_v1` (schemaVersion 1.0)
Endast profiler och val med `is_published = true`. Inga e-postadresser, telefonnummer eller kontaktpersoner. Tomma val exporteras som `[]` och saknade datum som `null`, aldrig som "Nej".

| Fält | Typ | Oblig. | Källa | Filtrering | BC-plan | Matchning |
|---|---|---|---|---|---|---|
| schema_version | text | ja | konstant | – | – | – |
| partner_id | uuid | ja | partners.id | – | ja | ja |
| partner_name, partner_slug | text | ja | partners | – | ja | ja |
| logo_url | text\|null | nej | partners | – | ja | – |
| profile_url | text | ja | härledd av slug | – | ja | ja |
| verification_status | enum | ja | profil | ja | ja | ja |
| last_verified_at | date\|null | nej | profil | – | ja | ja |
| geography | text[] | nej | partners | ja | ja | ja |
| office_cities (SwedishRegions) | text[] | nej | partners | ja | ja | ja |
| customer_size_ranges | json[] | nej | product_filters.bc | ja | ja | ja |
| revenue_ranges | json[] | nej | product_filters.bc | ja | ja | ja |
| industries | json[] | nej | product_filters.bc | ja | ja | ja |
| bc_competencies | [{key, sourceType, verifiedAt}] | nej | partner_bc_attributes | ja | ja | ja |
| migration_experience | samma | nej | samma | ja | ja | ja |
| project_types | särskilda projektformer från special_delivery | nej | samma | ja | ja | ja |
| delivery_models | särskilda leveransformer från special_delivery | nej | samma | ja | ja | ja |
| industry_solutions | [{name, description, industries, type, sourceUrl, partnerVerified, editorialVerified, verifiedAt}] | nej | partner_industry_solutions | ja | ja | ja |

EmployeeRanges finns inte strukturerat i dag (bara `team_size_sweden` som fritext) och ingår därför inte i v1.0. Läsning sker via adminfunktionen (`action=export-bc`). Ingen integration med businesscentral.se är byggd.

## 12. Tester (2026-09-29)
- Backfill: 150 profiler och 38 partners. 11 partners har både BC och CRM (flera profiler per partner fungerar).
- Dubblett av produktprofil spärras (unik nyckel).
- Dubblett av BC-val spärras.
- Ogiltig nyckel spärras (främmande nyckel).
- BC-val på en Sales-profil spärras (trigger).
- `partner_verified` utan källa eller datum spärras.
- Branschlösning utan namn spärras.
- Opublicerad profil och opublicerade val ger 0 rader i exporten.
- Publika sidor (`/`, partnerprofil, `/admin`) svarar 200.
- Partnerlistornas SSR-test: 7/8. Det fallerande H1-testet på `/alla-d365-partners` fanns före denna ändring.
- Adminfunktionen svarar 401 utan admininloggning.
- Adminflikens sparflöde kunde inte köras automatiskt eftersom admininloggningen kräver lösenord. Behöver kontrolleras manuellt.

## 13. Risker och begränsningar
- Tabellerna har RLS utan policyer (avsiktligt). Säkerhetskontrollen visar detta som info.
- Partnerförslag via länken kräver att partnern har Business Central bland sina produkter.
- `office_cities` är orter, inte normaliserade regioner.
- Anställda och omsättning är inte normaliserade utanför `product_filters`.
- Självskattning kan överdriva. Publicering bör kräva redaktionell kontroll.
- 4PS och adbriq är inte flyttade till branschlösningar.

## 14. Rekommenderat nästa steg
Kontakta de verifierade partnerna. De fyller i BC-profilen via sin profileringslänk, och redaktionen granskar och publicerar i Admin. Påbörja inte Min BC-plan, matchning, ranking, lead-routing eller synkronisering.

---

# Fas 2.7 – Gemensam attributmodell och klassificerad katalog (2026-09-29)

## Inventering före migrering
| Tabell | Poster | Nycklar |
|---|---|---|
| product_catalog | 20 | PK id, UNIQUE product_key |
| partner_product_profiles | 150 (0 publicerade) | PK id, UNIQUE (partner_id, product_id), FK partners, product_catalog |
| bc_attribute_options | 41 | PK (attribute_type, value_key) |
| partner_bc_attributes | 0 | PK id, UNIQUE (profile_id, attribute_type, value_key) |
| partner_industry_solutions / partner_certifications | 0 / 0 | |
Läsare av BC-attribut: manage-partner-master (partner, save-bc-attributes, migration-report), partner-invitations (writePartnerBcProposals, readPartnerBc), vyn export_bc_partner_v1. RLS: påslaget utan policyer, endast service_role (adminfunktion + profileringslänk).

## Nya tabeller och fält
- `product_catalog`: `catalog_type` (app/platform/capability), `display_group` (erp/crm/platform/data_analytics/ai), `parent_product_id`. Ny post `fabric`.
- `product_groups` + `product_group_members`: gruppen `fscm` = finance + supply-chain. Vyn `partner_product_group_membership` ger distinkta partners per grupp (12 partners, 24 profiler, ingen dubbelräkning).
- `product_attribute_options` (product_id, dimension_key, attribute_key, label, description, sort_order, is_active), UNIQUE (product_id, dimension_key, attribute_key).
- `partner_product_attributes` (profil, alternativ, verification_status, source_type, source_url, verified_by, verified_at, is_published, editorial_note, legacy_bc_attribute_id), UNIQUE (profil, alternativ). Trigger stoppar alternativ från annan produkt och sätter source_type utifrån status.
- `partner_product_capabilities`: tvärgående förmåga (katalogpost av typ capability/platform) per produktprofil, samma verifieringsfält.

## Klassificering
| Typ | Grupp | Produkter |
|---|---|---|
| app | erp | business-central, finance, supply-chain, project-operations, commerce, human-resources |
| app | crm | sales, customer-service, field-service, customer-insights, contact-center |
| platform | platform | power-platform |
| capability | platform | Power Apps, Power Automate, Power Pages och Dataverse är inaktiva undernivåer; partnerprofilen använder endast power-platform |
| capability | data_analytics | power-bi, fabric |
| capability | ai | copilot, copilot-studio (Copilot Studio och AI-agenter) |
Befintlig `category` behålls oförändrad för bakåtkompatibilitet.

## Migrering
41 → 41 alternativ (nycklar och etiketter oförändrade, 0 avvikelser). 0 → 0 partnerval (tabellen var tom; skriptet mappar ändå alla fält och sparar `legacy_bc_attribute_id`). 150 profiler, alla fortfarande opublicerade.

## Manuell granskning
BC-alternativen `reporting_power_bi`, `power_platform_bc` och `copilot_bc` är kvar som BC-kompetenser. De betyder "i Business Central-sammanhang", inte samma sak som förmågan i sig, så mappningen är inte entydig. Inga partnerval fanns att flytta. Redaktionen bör besluta om de ska ersättas av förmågorna power-bi, power-platform och copilot.

## Administration och export
- Admin läser tillåtna val från `product_attribute_options` för profilens produkt, grupperat per dimension, och har en ny sektion för tvärgående förmågor. Actions: `save-attributes` (alias `save-bc-attributes`), `save-capabilities`.
- Profileringslänken skriver till `partner_product_attributes` (opublicerat, partner_verified); partnern kan bara ta bort egna opublicerade förslag.
- `export_bc_partner_v1` läser den nya modellen med identiska kolumner, nycklar och semantik. schemaVersion 1.0 behålls.

## Tester (i återställd transaktion)
Flera kompetenser, migrering + projekttyp, Power BI som förmåga, partner med BC + Sales (11), Finance + SCM (12, ingen har bara den ena), profil utan attribut, opublicerad/publicerad profil, partner-, redaktions- och publik-källa-val, opublicerat val utesluts ur export, fel produkt stoppas, app som förmåga stoppas, partnerverifierat utan datum stoppas, skrivning till legacy stoppas. Adminfunktionen svarar 401 utan inloggning. Typecheck OK.

## Återställning
1. Ta bort triggern `legacy_bc_attributes_block_writes_trg`.
2. Återställ vyn `export_bc_partner_v1` till att läsa `partner_bc_attributes` (definitionen finns i Fas 2.6-migreringen).
3. Kopiera eventuella nya val tillbaka: `INSERT INTO partner_bc_attributes ... FROM partner_product_attributes JOIN product_attribute_options` (dimension_key → attribute_type, attribute_key → value_key).
4. Återställ de två edge-funktionerna från föregående version.
5. De nya tabellerna och katalogfälten kan ligga kvar eller tas bort; de påverkar inget publikt.
Legacy-tabellerna tas bort först när migreringen godkänts.

## Kända begränsningar
Inga attributuppsättningar för Finance, CRM eller Power Platform ännu. Katalogens `category` och `display_group` överlappar. F&SCM-vyn används inte i något gränssnitt än.

### Beslut 2026-09-29: BC-kompetenser ersatta av förmågor
`reporting_power_bi` → förmågan `power-bi`, `power_platform_bc` → `power-platform`, `copilot_bc` → `copilot`. Alternativen är inaktiverade (is_active=false, raderas inte). Inga partnerval behövde flyttas (0). Förmågor: power-bi, power-platform, copilot samt copilot-studio (visas som "Copilot Studio och AI-agenter"). Migrering flyttar ev. gamla val till partner_product_capabilities med bevarad metadata; inaktiva alternativ kan inte sparas. Profileringslänken har gruppen "Tvärgående förmågor" som sparas som opublicerade partnerförslag i partner_product_capabilities; Admin visar förmågor i egen sektion.

### Beslut 2026-09-29: Copilot Studio och AI-agenter sammanslagna
Det separata valet `ai-agents` är inaktivt och har slagits samman med `copilot-studio`, som visas som "Copilot Studio och AI-agenter". Befintliga val har flyttats utan dubbel lagring. När båda fanns bevarades den starkaste verifieringsstatusen, publiceringsstatusen, källan och verifieringsdatumet.

### Beslut 2026-09-29: gemensam ERP-basnivå och samlad Power Platform
Ekonomi och redovisning, Inköp, Försäljning och order, Lager och logistik samt Distribution och grossist betraktas som gemensam basnivå för partner som arbetar med Business Central eller F&SCM. Alternativen är inaktiverade för Business Central, Finance och Supply Chain Management, visas inte i profileringen och påverkar inte A/B/C-status. Befintliga uppgifter behålls som historik. Power Apps, Power Automate, Power Pages och Dataverse är inaktiverade som separata förmågor; befintliga val har slagits samman till Power Platform med bevarad verifieringsmetadata.
