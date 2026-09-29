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
`business-central, finance, supply-chain, project-operations, commerce, human-resources, sales, customer-service, field-service, customer-insights, contact-center, power-platform, power-apps, power-automate, power-pages, dataverse, power-bi, copilot, copilot-studio, ai-agents`. "F&SCM" mappas till finance och supply-chain.

## 6. Partnerproduktprofil
`id, partner_id, product_id, status (draft/active/archived), is_primary, is_published, verification_status, verified_by, verified_at, source_url, summary`.

## 7. Business Central-modul
| attribute_type | nycklar |
|---|---|
| migration | nav, bc_onprem, bc_other_environment, visma, monitor, pyramid, jeeves, sap_business_one, fortnox, other_erp |
| competency | finance_accounting, purchasing, sales_order, warehouse_logistics, distribution_wholesale, manufacturing, projects, service_management, retail_ecommerce, edi, integrations_api, reporting_power_bi, power_platform_bc, copilot_bc, multi_company, international |
| project_type | new_implementation, migration, upgrade, maintenance_support, rescue, system_consolidation, multi_company_implementation, international_rollout |
| delivery_model | fixed_price_start, quickstart_package, proof_of_concept, phased_implementation, traditional_project, maintenance_partner, managed_services |

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
| project_types | samma | nej | samma | ja | ja | ja |
| delivery_models | samma (inkl. maintenance_partner, managed_services = SupportAndManagedServices) | nej | samma | ja | ja | ja |
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
