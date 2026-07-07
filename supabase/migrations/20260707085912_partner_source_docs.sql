UPDATE public.partners SET source_document_text = $txt$4PS Construction Software AB
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
AI-metadata för maskinell tolkning
partner_id: 4ps_construction_software_ab
partner_name: 4PS Construction Software AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_only_for_sensitive_or_uncertain_fields: true
product_area_model:
  primary_product_group:
    business_central: very_high_active
  secondary_product_groups:
    power_platform: medium_adjacent
    data_analytics: medium_adjacent
    ai_readiness: medium_adjacent
  not_verified_as_active_product_groups:
    finance_supply_chain_management: do_not_show_as_active
    ce_crm_broad: do_not_show_as_active_without_partner_confirmation
    customer_service_field_service_contact_center: do_not_show_as_active_without_partner_confirmation
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
    project_operations: do_not_show_as_active
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_primary_vertical_isv
  show_under_finance_supply_chain_management: false
  show_under_ce_crm: false_unless_partner_confirms
  show_under_construction_vertical: true_primary
  show_under_isv_filters: true_for_4ps_construct_only
  show_under_ai: adjacent_signal_only
  show_under_data_analytics: adjacent_signal_only
delivery_profile:
  smb: low_medium
  midmarket: high
  upper_midmarket: high
  enterprise: medium_high_for_construction_vertical
market_arena:
  primary: vertical_bc_ip_isv
  secondary:
    - construction_erp
    - business_central_vertical_solution
    - hilti_software_ecosystem
isv_scope:
  own_isv_solution: 4ps_construct
  third_party_bc_addons: do_not_infer_without_verification
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Bygg-, entreprenad-, installations- och serviceföretag som behöver en branschspecifik ERP-lösning på Business Central. [✓/~ H, S1/S2/S4]
Kunder där projektlönsamhet, marginalkontroll, resursplanering och realtidsöversikt är centrala beslutsfrågor. [✓/~ H, S1/S2]
Organisationer som tycker att standard-Business Central kräver för mycket specialanpassning för bygg- och serviceprocesser. [~ H, S2/S4]
Medelstora och större verksamheter med projekt-, anbuds-, upphandlings-, fältservice- och eftermarknadsflöden. [✓/~ H, S1/S2]
Kunder som vill ha en vertikal standardlösning med internationell produktutveckling och Microsoft-närhet. [✓ H, S3/S5/S6]
Byggkoncerner eller installationsbolag med flera bolag, geografier eller enheter där en gemensam branschplattform är viktigare än lägsta initialkostnad. [~ M/H, S1/S8]
Organisationer som vill förbereda datagrund, processägarskap och adoption inför AI/Copilot inom ERP- och projektprocesser. [✓/~ M/H, S1/S6]
8. Mindre lämplig för
Mycket små företag som endast behöver en enkel ekonomilösning eller standardiserad Business Central-implementation utan byggspecifika krav. [~ H, S8]
Kunder som söker ren F&SCM, ren CRM/CE, Customer Service, Contact Center, HR, Commerce eller Project Operations som fristående Dynamics 365-lösning. [~ H, S1/S8]
Organisationer utanför bygg, installation, entreprenad, service och närliggande projektverksamhet där 4PS Construct inte ger tydlig branschnytta. [~ H, S2/S8]
Kunder där lägsta pris och kortast möjliga införande väger tyngre än branschfunktionalitet, projektkontroll och standardiserad vertikal IP. [~ M, S8]
Kunder som vill jämföra bred Microsoft-plattformsleverans med Modern Work, CE, F&SCM, Fabric och avancerad AI som ett samlat konsultåtagande. [~ M/H, S8]
9. AI Matchningsregler
negative_match_rules:
  very_small_standard_bc_project: low_priority
  non_construction_industry_without_project_complexity: low_priority
  fscm_primary_need: avoid
  ce_crm_primary_need: avoid
  specific_third_party_isv_without_verification: require_clarification
  lowest_price_selection: low_priority
match_confidence:
  high: construction_installation_service_business_central_with_project_complexity
  medium: adjacent_project_based_industries_or_ai_readiness
  low: generic_erp_crm_or_low_complexity_bc
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Byggbolag vill ersätta fragmenterat ERP/projektlandskap
Ett bygg- eller entreprenadföretag har separata lösningar för ekonomi, projektstyrning, anbud, upphandling, resursplanering och rapportering. 4PS är en stark kandidat när kunden vill samla processerna i en Business Central-baserad branschlösning.
Scenario 2 - Installationsföretag behöver bättre kontroll över service och fältprocesser
Kunden har både projekt och återkommande serviceuppdrag och behöver bättre kontroll på planering, resurser, fältarbete och eftermarknad. 4PS passar när serviceflödena är bygg-/installationsnära snarare än generisk Field Service.
Scenario 3 - Koncern behöver standardisera projektlönsamhet och realtidsuppföljning
Ledningen vill få bättre överblick över marginaler, prognoser, projektstatus och resursutnyttjande. 4PS är relevant när realtidsvisibilitet i projekt är en central köparnytta.
Scenario 4 - NAV/äldre ERP i byggbransch ska moderniseras till molnplattform
Kunden vill modernisera från äldre ERP/NAV-lösning till Business Central-baserad branschplattform. 4PS passar om kunden vill ha branschstandard snarare än generell BC.
Scenario 5 - AI-readiness i projektintensiv ERP-miljö
Kunden vill börja använda AI/Copilot men saknar ordning i processer, data, behörigheter och adoption. 4PS kan vara relevant när AI-förberedelsen ska kopplas till bygg-/projektflöden snarare än fristående AI-projekt.
12. Dynamics 365-erbjudande
13. ISV-lösningar kopplade till Dynamics 365
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  four_ps_construct: verified_primary_vertical_isv
  third_party_addons:
    continia: not_verified
    signup_exflow: not_verified
    golden_edi: not_verified
    other_bc_addons: not_verified
  do_not_infer_authorization_for_other_addons: true
14. Branschfokus
15. AI, Copilot och Agents
16. Data & Analytics
Data governance: relevant som del av standardiserade processer och behörigheter i Business Central/4PS Construct, men bred datagovernance-praktik är inte verifierad. [~ M]
Dataplattform: ingen verifierad Fabric-/Azure-dataplattform som kärnerbjudande; använd som kompletterande signal, inte huvudfilter. [~ M]
Power BI / rapportering: dashboards och realtidsöversikt är tydliga i 4PS-positioneringen. Exakt Power BI/Fabric-erbjudande bör verifieras. [✓/~ M/H]
Datakvalitet: viktig för projektlönsamhet, prognoser, resursplanering och AI-readiness. [~ M/H]
Analytics: relevant genom marginaler, prognosresultat, projektstatus och resurskontroll. [✓/~ H]
AI-grund: 4PS kan bidra genom strukturerade ERP-/projektdata snarare än som fristående AI-konsult. [~ M]
17. Integration
18. Ekonomi, storlek och marknadsposition
Svensk juridisk enhet: 4PS Construction Software AB, org.nr 559475-0878. [✓ H, S7]
Svenskt bokslut 2024: omsättning 4 618 KSEK och 16 anställda enligt Bolagsfakta. Detta bör tolkas försiktigt eftersom svensk etablering är ny och gruppens produkt-/leveranskapacitet ligger internationellt. [✓ H, S7]
4PS Group anger över 400 software engineers/application consultants och över 450 kunder globalt. [✓ H, S3]
Hilti slutförde förvärvet av 4PS Group 2023. Detta ger stark ägarsignal och koppling till bygg-/construction software-ekosystemet. [✓ H, S5]
Marknadsposition: stark vertikal BC/IP-aktör där strategiskt värde ligger i branschlösning och produkt-IP snarare än svensk konsultomsättning. [~ H, S6/S8]
19. Historik och utveckling
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt)
Differentiatorer
Mot generella Business Central-specialister: 4PS har färdig bransch-IP för bygg/installation/service, inte bara BC-konsultkapacitet.
Mot F&SCM-partners: 4PS är starkare när kunden vill ha Business Central-baserad construction ERP och inte enterprise-F&SCM-program.
Mot CRM-specialister: 4PS är inte rätt val för ren CE/CRM, men starkare när kund- och serviceprocesserna behöver ingå i bygg-ERP-flödet.
Mot globala systemintegratörer: 4PS har djupare vertikal produkt, medan globala SI:er kan vara starkare i multinationell programstyrning och bred transformation.
Mot traditionella ERP-konsulter: 4PS standardiserade branschlösning kan minska behovet av tung specialutveckling om kunden passar målbranschen.
23. Kundorienterad partnerbeskrivning
4PS Construction Software AB är relevant för företag inom bygg, entreprenad, installation och service som söker ett affärssystem där branschprocesserna redan är inbyggda. Till skillnad från en generell Business Central-partner utgår 4PS från den egna lösningen 4PS Construct, en vertikal ERP-lösning byggd på Microsoft Dynamics 365 Business Central. Det gör partnern särskilt intressant för organisationer där projektlönsamhet, anbudsprocesser, upphandling, resursplanering, fältservice, dashboards och realtidsöversikt är centrala krav.
För en Dynamics 365-kund innebär detta att 4PS framför allt bör bedömas som en branschlösningspartner, inte som en bred Microsoft-konsult inom alla Dynamics 365-områden. Om kunden har bygg- eller installationsnära processer kan 4PS vara ett mycket starkt alternativ eftersom mycket av verksamhetslogiken redan finns i produkten. Om kunden däremot söker Finance & Supply Chain Management, fristående CRM/CE, Commerce, HR eller en bred Microsoft-plattformsleverans bör andra partnerkategorier jämföras först.
4PS har också en stark internationell signal genom 4PS Group, Hilti-ägande och Microsoft Inner Circle 2025/2026. Den svenska enheten är mindre, vilket gör det viktigt att verifiera lokal leveranskapacitet, kontaktperson, referenser och ansvarsfördelning mellan Sverige och den internationella organisationen innan stark publik positionering eller större kundmatchning.
24. AI-sammanfattning
25. Varför denna partner
✓ Kunden söker Business Central med tydligt bygg-, installations- eller servicefokus.
✓ Kunden behöver en färdig branschlösning snarare än en generell BC-implementation.
✓ Projektkontroll, projektlönsamhet, resursplanering och realtidsdashboards är centrala krav.
✓ Kunden vill minska mängden kundunik anpassning genom vertikal standard-IP.
✓ Kunden vill ha Microsoft-plattformen men med branschfunktionalitet anpassad för construction ERP.
✓ Kunden värderar internationell produktutveckling, Hilti-ägande och Microsoft Inner Circle-signal.
✓ Kunden vill bygga datagrund och AI-readiness inom ERP-/projektprocesser.
26. Kontrollpunkter inför publicering
Bekräfta att Business Central / 4PS Construct är det enda aktiva huvudproduktområdet för d365.se.
Bekräfta om 4PS vill synas under CE/CRM, Field Service eller Customer Service endast som funktionalitet i 4PS Construct eller som separat erbjudande.
Bekräfta att F&SCM, Commerce, HR och Project Operations inte ska visas som aktiva filterområden.
Verifiera kontaktperson, e-post, telefon och vilka kontor som ska anges publikt.
Verifiera aktuella referenskunder i Sverige och vilka som får användas publikt.
Verifiera lokal svensk leveranskapacitet kontra internationell 4PS Group/Hilti-resurs.
Verifiera Microsoft-statusar, Inner Circle 2025/2026 och eventuella Solution Partner-designationer innan publik visning.
Verifiera AI-profil: erfarenhetsnivå, konkreta AI-/Copilot-use cases, antal projekt och om Copilot Studio/Agents faktiskt erbjuds.
Verifiera eventuell tredjeparts-ISV-relation, till exempel Continia, ExFlow eller Golden EDI, innan 4PS listas under sådana filter.
Bekräfta max tre prioriterade branscher per produktområde. Rekommendation: Business Central = Bygg & Entreprenad, Installation, Service & Underhåll.
26A. Kontrollworkflow och statusfält
27. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | 4PS Construction Software AB / 4PS | ✓ | H | S1, S2
Juridisk enhet | 4PS Construction Software AB, org.nr 559475-0878. Svensk etablering med säte/adress i Göteborg enligt bolagsdata. d365.se anger kontor i Norrköping och Göteborg. | ✓ | H | S1, S7
Partnertyp och egen beskrivning | Vertikal Business Central-/ISV-partner för bygg, installation, service och entreprenad. 4PS Construct är en branschspecifik ERP-lösning byggd på Microsoft Dynamics 365 Business Central. | ✓/~ | H | S1, S2, S4
Primära produktområden | Business Central som huvudplattform genom 4PS Construct. Huvudfokus är inte generell BC-implementation utan branschspecifik construction ERP ovanpå BC. | ✓/~ | H | S1, S2, S4
Sekundära produktområden | Power Platform, AI-readiness, dashboards, rapportering, mobil/field-processer och integrationsnära flöden som komplement. CRM och fältservice förekommer som funktionalitet i 4PS Construct men ska inte tolkas som fristående D365 CE/Field Service-erbjudande utan verifiering. | ~ | M/H | S1, S2
Områden som inte verifierats | F&SCM, CE/CRM som fristående Dynamics 365-erbjudande, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations som självständiga d365.se-filter. | ?/~ | H | S1, S8
Typisk kundstorlek | Främst medelstora till större bygg-, installations- och serviceföretag. d365.se anger 100-4 999 anställda som relevant kundstorlek. | ✓/~ | H | S1
Typisk projektstorlek | Medelstora till större ERP-/verksamhetsprojekt där branschprocesser, projektstyrning, resursplanering, upphandling, service och projektlönsamhet ska samlas i en integrerad lösning. | ~ | H | S1, S2, S4
Geografisk leveranskapacitet | Sverige, Norden, Europa och globalt enligt d365.se. 4PS Group har internationell närvaro och kunder globalt; svensk leveransmodell bör verifieras per projekt. | ✓/~ | H | S1, S3
Branschfokus | Bygg & entreprenad, installationsteknik och service/underhåll. Även civil engineering, housebuilding och equipment rental i internationell 4PS-positionering. | ✓ | H | S1, S2, S4
AI-mognad | Etablerad i d365.se-profilen med fokus på AI-readiness, datakvalitet, governance, säkerhet, behörigheter, utbildning och adoption. Offentligt 4PS-material kopplar Inner Circle till AI Business Applications och tillgång till Microsofts roadmap. | ✓/~ | M/H | S1, S6
Förvaltningskapacitet | Stark som branschprodukt-/plattformspartner. 4PS beskriver att de designar, bygger, implementerar och underhåller programvara för bygg-, installations- och servicebranschen. | ✓/~ | H | S3
Internationell leveransförmåga | Hög på gruppnivå. Hilti anger att 4PS hade närvaro i Nederländerna, Storbritannien, Belgien och Tyskland vid förvärvet; 4PS anger även kontor i Sverige och Germany/UK/Benelux-miljöer. | ✓ | H | S3, S5, S6
Transformationskapacitet | Hög inom bygg- och installationsnära ERP-transformation. Lägre verifiering för generell affärstransformation utanför 4PS Construct och bygg-/serviceprocesser. | ~ | M/H | S1, S2
Unika särskiljande egenskaper | Egen vertikal IP/ISV-lösning, 4PS Construct, byggd på Business Central; stark branschspecialisering; Hilti-ägande; Microsoft Inner Circle 2025/2026; fokus på end-to-end-processer från anbud till eftermarknad. | ✓/~ | H | S2, S4, S5, S6
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas när uppgiften bygger på d365.se-profil, 4PS egna källor, Microsoft Marketplace, bolagsdata eller partnerbekräftelse.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är d365.se-bedömning, men ska viktas efter konfidens.
Endast internt | Konkurrentbedömningar, relativ position och marknadsarena. | Får inte visas som direkt kundtext utan redaktionell omformulering.
Kräver extra kontroll | Kontaktpersoner, exakta produktområden, ISV-relationer, Microsoft-statusar och referenser. | Verifieras före stark publik exponering eller filterbeslut som påverkar lead routing.
Ej publik användning | Osäkra negativa jämförelser och investerings-/M&A-slutsatser. | Endast bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | 4PS Construct är byggd på Microsoft Dynamics 365 Business Central och är kärnan i erbjudandet.
Finance & SCM-fokus | 1/5 | H | Ingen verifierad aktiv F&SCM-position för Sverige i d365.se-profil eller 4PS svenska profil.
CE/CRM-fokus | 2/5 | M | CRM-funktionalitet ingår som del av 4PS Construct, men fristående Dynamics 365 Sales/CE-erbjudande är inte verifierat.
AI / Copilot / Agents | 3/5 | M | d365.se anger etablerad AI-mognad med AI-readiness och adoption. Offentligt 4PS-material nämner AI genom Inner Circle/roadmap, men konkreta agentprojekt bör verifieras.
Data & Analytics | 3/5 | M/H | Dashboards, realtidsvisibilitet och rapportering är centrala i 4PS Construct. Bred Fabric-/dataplattformsleverans är inte verifierad.
Integration | 4/5 | M/H | 4PS Construct samlar processer och integrerar bygg-/serviceflöden på Business Central-plattformen. Exakt API/middleware-kapacitet bör verifieras.
Managed Services / förvaltning | 4/5 | M/H | 4PS bygger, implementerar och underhåller lösningen; stark produktnära förvaltningslogik.
Branschspecialisering | 5/5 | H | Mycket tydlig vertikal nisch inom bygg, installation, service, civil engineering och närliggande verksamheter.
Internationell leverans | 4/5 | H | Gruppen har internationell kundbas och Hilti-ägande. Svensk kapacitet bör verifieras per projekt.
SMB-fokus | 2/5 | M | Inte optimal för mycket små/lågkomplexa BC-projekt. Passar bättre där branschlösningen motiverar scope och investering.
Enterprise-fokus | 4/5 | M/H | Relevant för större bygg-/installationsföretag och koncerner med projekt- och serviceintensiva processer.
Standardisering | 5/5 | H | Egen standardiserad branschlösning ovanpå Business Central är huvuddifferentieringen.
Innovation | 4/5 | H | Microsoft Inner Circle 2025/2026 och Hilti-koppling ger stark innovationssignal inom construction software.
Leveransbredd | 3/5 | M | Djup men smal vertikal bredd. Inte en bred Microsoft-partner för alla D365-områden.
Partner-DNA typ: Vertikal Business Central-/ISV-partner för bygg, installation och service. Tolkning: 4PS bör matchas när kundens behov handlar om branschspecifik ERP och projekt-/servicekontroll inom byggnära verksamheter, inte när kunden söker generell Business Central-partner eller bred Microsoft Business Applications-leverans.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Vertikal Business Central-/ISV-partner för bygg-, installations- och serviceföretag som behöver ett branschspecifikt ERP-system med projektkontroll, realtidsöversikt och integrerade processer. | ~ | H | S1, S2, S4
Tydlig köparnytta | Kunden får en Business Central-baserad branschlösning där anbud, projekt, upphandling, resursplanering, ekonomi, fältprocesser och service kopplas ihop i ett system. | ~ | H | S1, S2
Matchningslogik | Prioriteras när kunden söker Business Central men standard-BC kräver för mycket anpassning för bygg-/installationsprocesser. Extra stark matchning vid projektlönsamhet, service, resursplanering och realtidsuppföljning. | ~ | H | S1, S2, S4
Positioneringsgränser | Ska inte övermatchas vid generell BC-implementation, ren ekonomiimplementation, F&SCM, ren CRM/CE eller lågprisprojekt utan branschkrav. | ~ | H | S8
4PS ska hanteras annorlunda än en vanlig Business Central-partner: bolaget är både partner och vertikal ISV/produktägare genom 4PS Construct. Dagens publika ISV-/tilläggsfilter bör därför visa 4PS under 4PS Construct / Bygg & Entreprenad när lösningen är relevant, men inte automatiskt under andra Business Central-tillägg utan separat verifiering.
Filterområde | Beslut för 4PS | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär vertikal partner / ISV. | Mycket hög | ✓/~ | BC är plattformen för 4PS Construct. Matcha främst när branschkrav finns.
F&SCM | Visa inte som aktiv huvudpartner. | Ingen/låg | ~ | F&SCM är inte verifierat som svenskt 4PS-erbjudande.
CE/CRM | Visa inte som aktiv fristående CE/CRM-partner. | Låg | ~ | CRM-funktionalitet nämns i 4PS Construct, men inte som fristående D365 CE.
Customer Service / Field Service / Contact Center | Visa inte som fristående D365-servicefilter utan verifiering. | Låg/medel | ~ | Fältservice/service finns som branschprocess i 4PS Construct, inte verifierat som D365 Field Service-erbjudande.
Bygg & Entreprenad | Visa som primär branschpartner. | Mycket hög | ✓/~ | Starkaste matchningen i d365.se.
Installation / teknisk service | Visa som primär/sekundär branschmatchning. | Hög | ✓/~ | 4PS riktar sig mot installation och service/underhåll.
Data & AI | Visa som kompletterande signal. | Medel | ✓/~ | AI-readiness/adoption och realtidsdashboards finns, men inte bred AI-leverans som huvudposition.
ISV-lösningar | Visa under 4PS Construct. Visa inte under andra ISV:er utan verifiering. | Mycket hög för 4PS Construct | ✓ | 4PS Construct är egen bransch-ISV på Business Central.
Fält | Värde för 4PS | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Vertikal BC/IP/ISV för bygg och installation | Använd när kunden söker Business Central men med starka bygg-/projekt-/servicekrav som kräver branschlösning snarare än generisk BC. | H | S1, S2, S4, S8
Sekundära arenor | Construction ERP, projektstyrning, service/underhåll, mobil fältprocess, realtidsuppföljning | Använd som kompletterande matchning vid projektlönsamhet, resursplanering, anbud, upphandling och eftermarknad. | H | S1, S2
Partnerkategori | Vertikal produkt-/ISV-partner med svensk lokal närvaro och internationell grupp | Skiljer 4PS från generella BC-partners, breda Microsoft-konsulter och F&SCM-enterprisepartners. | H | S1, S3, S5
Primär jämförelsegrupp | Andra BC-vertikaler, bygg-/projektlösningar, branschpaket och partners med bygg-/entreprenadfokus | Använd vid jämförelser där kunden har byggnära processer och inte bara ett generellt affärssystembehov. | M/H | S8
Lägre relevans i jämförelse | Rena CRM-specialister, global SI utan bygg-ERP-fokus, generella BC-partners utan branschlösning | Använd endast som angränsande jämförelse när kundens behov är bredare än branschlösningen. | M | S8
Fakta | Värde | Verif. | Konf. | Källa
Partner | 4PS Construction Software AB / 4PS | ✓ | H | S1, S7
Juridisk enhet | 4PS Construction Software AB | ✓ | H | S7
Organisationsnummer | 559475-0878 | ✓ | H | S7
Grundat / etablering | 4PS grundades 2000 i Nederländerna. Svensk juridisk enhet är nyare och bör verifieras för exakt etableringsår i Sverige. | ✓/~ | H | S5, S7
Huvudkontor / svensk adress | Göteborg enligt bolagsdata. d365.se anger kontor i Norrköping och Göteborg. | ✓/~ | H | S1, S7
Ägarstruktur | 4PS Group är en del av Hilti sedan förvärvet slutfördes 2023. | ✓ | H | S5
Omsättning Sverige | 4 618 KSEK för 2024 enligt Bolagsfakta. Detta speglar svensk etablering och bör inte tolkas som koncernens totala storlek. | ✓ | H | S7
Antal anställda Sverige | 16 anställda 2024 enligt Bolagsfakta. | ✓ | H | S7
Gruppstorlek | 4PS Group anger över 400 software engineers/application consultants och över 450 kunder; Hilti angav cirka 350 medarbetare vid förvärvet. | ✓ | H | S3, S5
Geografisk närvaro | Sverige, Norden, Europa och globalt enligt d365.se; internationell 4PS-närvaro i flera europeiska länder. | ✓/~ | H | S1, S3, S5
Viktiga erbjudanden | 4PS Construct, Business Central-baserad construction ERP, projektkontroll, realtidsöversikt, CRM-liknande processer, estimering, dashboards, resursplanering, upphandling, fältservice, mobilitet och service/underhåll. | ✓ | H | S1, S2, S4
Kontaktperson | Anders Östby enligt d365.se. E-post och telefon bör verifieras innan publik eller operativ användning. | ✓/~ | M/H | S1
Storlekskategori | Vertikal specialist med stark internationell produktgrupp men relativt ny/mindre svensk juridisk enhet. | ~ | M/H | S3, S7, S8
Prioritera 4PS när | Signalstyrka | Konfidens
Kunden söker Business Central och tillhör bygg, entreprenad, installation, service eller närliggande projektintensiv verksamhet. | Mycket stark | H
Kundens krav innehåller projektlönsamhet, resursplanering, anbud, upphandling, fältprocesser, service/underhåll eller realtidsdashboards. | Mycket stark | H
Kunden vill ha en färdig branschlösning/ISV snarare än en generell BC-partner som bygger mycket kundunikt. | Mycket stark | H
Kunden efterfrågar svensk närvaro men även internationell produktutveckling och leveransförmåga. | Stark | M/H
Kunden behöver AI-readiness, datakvalitet, adoption och governance kopplat till ERP-/projektprocesser. | Medel | M
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, lågkomplext eller primärt budgetdrivet. | Stark nedviktning | H
Kunden söker F&SCM, CE/CRM, Contact Center, HR, Commerce eller Project Operations som huvudlösning. | Stark nedviktning | H
Kunden saknar bygg-/installation-/serviceprocesser där 4PS Construct ger tydlig branschnytta. | Stark nedviktning | H
Kunden kräver specifika tredjeparts-ISV-relationer som inte är verifierade för 4PS. | Medel nedviktning | M
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 5 | Kärnplattform för 4PS Construct och starkaste filterområde. | ✓/~ | H | S1,S2,S4
Finance & SCM | 1 | Inte verifierat som aktivt erbjudande för 4PS Sverige. | ~ | H | S1,S8
CE/CRM | 2 | CRM-processer finns som del av 4PS Construct, men fristående CE/CRM är ej verifierat. | ~ | M | S2
Customer Engagement | 2 | Fält-/serviceprocesser kan vara relevanta i branschlösningen, men inte som generellt CE-åtagande. | ~ | M | S1,S2
AI/Copilot | 3 | AI-readiness/adoption och Microsoft Inner Circle AI Business Applications ger signal, men konkreta AI-projekt bör verifieras. | ✓/~ | M | S1,S6
Data & Analytics | 3 | Dashboards och realtidsinsikter är centrala, men bred dataplattform/Fabric ej huvudposition. | ✓/~ | M/H | S1,S2
Power Platform | 2 | Relevant som Microsoft-komplement men inte tydligt fristående erbjudande. | ~ | M | S1
Integration | 4 | Integrerad end-to-end-lösning ovanpå Business Central. Exakt middleware/API-kompetens behöver verifieras. | ✓/~ | M/H | S2,S4
Business Transformation | 4 | Stark inom branschprocesser i bygg/installation/service. Inte bred rådgivning utanför nischen. | ~ | H | S1,S2
Strategisk rådgivning | 3 | Relevant för bransch-/ERP-val och AI-readiness men bör inte överpositioneras som management consulting. | ~ | M | S1
Förvaltning | 4 | 4PS bygger, implementerar och underhåller sin programvara. | ✓/~ | H | S3
Managed Services | 3 | Produktnära support/förvaltning stark; bred MSP-modell ej verifierad. | ~ | M | S3
Internationell leverans | 4 | Gruppens internationella räckvidd och Hilti-ägande ger stark signal. | ✓ | H | S3,S5
SMB | 2 | Mindre relevant för mycket små/lågkomplexa kunder. | ~ | M | S8
Enterprise | 4 | Relevant för större bygg-/installationsföretag och koncernstrukturer. | ~ | M/H | S1,S3
Produktområde | Roll i erbjudandet | Max 3 branscher | Kundnytta | Verifiering | Kommentar
Business Central | Kärnerbjudande via 4PS Construct. | Bygg & entreprenad; Installation; Service & underhåll | Branschspecifikt ERP med projektkontroll, resursplanering, upphandling, fältprocesser och realtidsuppföljning. | ✓/~ H | Primärt filterområde på d365.se.
F&SCM | Ej verifierat aktivt. | Ej aktivt; Ej aktivt; Ej aktivt | Ska inte användas för matchning om kunden efterfrågar F&SCM som huvudplattform. | ~ H | Andra partners passar bättre.
CE/CRM | Ej fristående verifierat. CRM-liknande funktionalitet finns i 4PS Construct. | Bygg; Installation; Service | Kan stödja sälj-/kund-/serviceflöden inom branschlösningen men ska inte tolkas som fristående D365 CE. | ~ M | Använd endast försiktigt som intern signal.
Customer Service / Field Service | Branschprocess i 4PS Construct, ej verifierad D365 Field Service. | Installation; Service & underhåll; Byggservice | Relevant där fält- och serviceprocesser ingår i 4PS-flödet. | ~ M | Ej aktivt D365-servicefilter utan partnerbekräftelse.
Commerce / HR / Project Operations | Ej verifierat. | Ej aktivt; Ej aktivt; Ej aktivt | Ingen matchningsnytta utan ny uppgift. | ? H | Visa inte som aktivt filter.
ISV/lösning | Kategori | D365-koppling | 4PS-status | Filterbeslut / not
4PS Construct | Vertikal construction ERP / egen IP | Business Central | Egen lösning / kärnerbjudande | Visa som primärt ISV-/branschfilter för Bygg & Entreprenad.
Microsoft AppSource: 4PS Construct | Marketplace-lösning | Business Central | Listad lösning | Kan användas som verifiering av lösnings-/plattformskoppling.
Continia | AP automation / dokument / banking | Business Central | Ej verifierad i detta underlag | Visa inte 4PS under Continia utan separat ISV- eller partnerkälla.
SignUp ExFlow | AP automation / fakturahantering | Business Central/F&SCM | Ej verifierad i detta underlag | Visa inte 4PS under ExFlow utan separat verifiering.
Golden EDI | EDI/e-faktura/integration | Business Central | Ej verifierad i detta underlag | Visa inte 4PS under Golden EDI utan separat verifiering.
Övriga BC-tillägg | Ekonomi, WMS, PIM, dokument, EDI, rapportering | Business Central | Ej verifierad per tillägg | Endast specifik matchning om auktorisation/kundcase finns.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Bygg & Entreprenad | Kärnbransch | Mycket hög | Primär marknad för 4PS Construct och d365.se-profilen. | d365.se + 4PS egna källor
Installation / teknisk installation | Kärnbransch | Hög | 4PS positionerar sig mot installationsteknik och mechanical/electrical internationellt. | 4PS egna källor
Service & Underhåll | Kärnbransch | Hög | 4PS lyfter service/underhåll och fältprocesser som del av branschlösningen. | 4PS egna källor
Civil engineering / anläggning | Sekundär bransch | Medel/hög | Tydligt i internationell positionering, svensk matchning bör verifieras. | 4PS Group/AppSource
Housebuilding | Sekundär bransch | Medel | Internationellt relevant, svensk tyngd bör verifieras. | AppSource/4PS Group
Equipment rental / plant | Sekundär bransch | Medel | Internationellt listat användningsområde; svensk kapacitet bör verifieras. | AppSource/broschyr
Övriga branscher | Ej verifierad | Låg | Använd inte 4PS som generell BC-partner utanför bygg-/projektintensiva scenarier. | d365.se-bedömning
Område | Bedömning | Verif. | Konf. | Källa
AI-mognad | Etablerad enligt d365.se, men bör tolkas som rådgivning/readiness snarare än dokumenterade stora AI-implementeringar. | ✓/~ | M/H | S1
AI-readiness | Relevant inom datakvalitet, behörigheter, processägarskap och användaradoption inför Copilot i ERP-/projektmiljöer. | ✓/~ | M/H | S1
Copilot | Relevant som Microsoft-standardförmåga i Business Central och Microsoft-plattformen; konkreta 4PS Copilot-case bör verifieras. | ~ | M | S1,S6
Copilot Studio / Agents | Ej verifierat som leveransområde. | ? | H | S8
Konkreta AI-användningsfall | AI-readiness inför Copilot, utbildning/adoption, datakvalitet och ansvarfull AI i projektintensiva ERP-processer. | ✓/~ | M | S1
ERP-nära AI | Potentiellt relevant kopplat till prognoser, projektuppföljning, resursplanering och insikter, men konkreta case bör verifieras. | ~ | M | S6
Dataförutsättningar | Starka i den mån 4PS Construct strukturerar bygg-/serviceprocesser och skapar en gemensam datagrund. | ~ | M/H | S1,S2
Område | Bedömning
Integrationsarkitektur | 4PS Construct är en integrerad branschlösning ovanpå Business Central. Interna processintegrationer är starka, men större integrationsarkitektur mot breda systemlandskap bör verifieras.
Middleware | Ej verifierat som fristående erbjudande. Använd inte som filter utan partnerbekräftelse.
API:er | Business Central-plattformen ger tekniska integrationsmöjligheter, men 4PS API-/utvecklingsmodell bör verifieras för kundspecifika landskap.
EDI | Ej verifierat som specifik 4PS-kompetens eller ISV-relation i detta underlag.
Dataintegration | Relevant vid migrering och samordning av projekt-/service-/ekonomidata inom 4PS Construct.
Drift och övervakning | Produktnära förvaltning/support kan vara relevant; exakt driftmodell bör verifieras.
Integrationskompetens | Stark inom den egna vertikala lösningen. Medel/hög som bred integrationspartner beroende på scope.
År / period | Milstolpe | Betydelse för d365.se
2000 | 4PS grundas i Nederländerna. | Ger lång historik inom construction ERP och branschprocesser.
2019 | 4PS börjar erbjuda 4PS Construct på Microsoft Dynamics 365 Business Central enligt 4PS-material. | Förklarar kopplingen till modern Business Central-plattform.
2023 | Hilti slutför förvärvet av 4PS Group. | Stark ägarsignal och strategisk förstärkning inom byggsoftware.
2024 | Svensk 4PS-enhet redovisar 4,6 MSEK omsättning och 16 anställda enligt Bolagsfakta. | Indikerar lokal etablering, men gruppstorlek behöver vägas in.
2025/2026 | 4PS utses till Microsoft AI Business Applications Inner Circle 2025/2026. | Stark Microsoft- och innovationssignal.
Tema | Bedömning | Matchningssignal
Branschspecifik ERP för bygg | Mycket tydlig och konsekvent kommunikation kring construction, installation, service och projektkontroll. | Mycket stark
Business Central-plattform | 4PS betonar att lösningen bygger på Microsoft Dynamics 365 Business Central. | Mycket stark
Projektlönsamhet och realtidsvisibilitet | Kommunikationen fokuserar på marginaler, prognoser, resurser, planering och kontroll. | Stark
Microsoft-närhet / Inner Circle | Inner Circle 2025/2026 kommuniceras som innovations- och kundframgångssignal. | Stark
AI-kommunikation | AI nämns genom Inner Circle/roadmap och d365.se AI-profil. Konkreta kundcase bör verifieras. | Medel
Events/webbinarier/insikter | 4PS har publika insikter, produktinfo, support och branschmaterial; svensk aktivitetstakt bör verifieras. | Medel
Kundcase/referenser | d365.se nämner Assemblin, Caverion, Remondis och Certego. Publika case bör verifieras innan stark publicering. | Stark men kontroll krävs
Taggkategori | Taggar
Huvudproduktområden | Business Central: very_high active; F&SCM: not active; CE/CRM: not active / embedded only; Customer Service/Field Service/Contact Center: not active unless partner confirms
Tillvalsprodukter och plattformar | 4PS Construct, Microsoft Marketplace, Power Platform adjacent, AI-readiness, dashboards, mobile field processes, reporting, managed services
ISV-lösningar | 4PS Construct, vertical_bc_isv, construction_erp, bc_addon_verified_own_ip, third_party_isv_not_verified
Branscher | Bygg & Entreprenad, Installation, Service & Underhåll, Civil Engineering, Housebuilding, Equipment Rental
Kompetenser | Business Central, Construction ERP, Project Control, Resource Planning, Procurement, Field Service Process, Real-time Dashboards, Service Management, ERP Transformation
Kundstorlek | Midmarket, Upper Midmarket, Enterprise Construction, 100-4999 employees
Projektstorlek | Vertical BC Project, Construction ERP Project, Project-heavy ERP, Service/Installation ERP, NAV/BC Modernization, Data/AI Readiness
Geografi | Sweden, Nordic, Europe, Global, local_presence_gothenburg_norrkoping, hilti_group
Negativa matchningstaggar | Very Small Standard BC Project, Non-construction Industry, F&SCM Primary Need, CE/CRM Primary Need, Lowest-price Project
Endast internt: Denna sektion är inte avsedd för publik publicering. Den används för AI-matchning, redaktionell jämförelse och intern förståelse av partnerpositionering.
Område | Intern bedömning
Primära konkurrenter | Andra vertikala Business Central-/ERP-lösningar för bygg, entreprenad, installation, service och projektintensiva verksamheter.
Angränsande konkurrenter | Generella Business Central-partners med bygg-/projektkompetens, samt breda Microsoft-partners som kan bygga kundunika lösningar.
Lägre relevans-konkurrenter | F&SCM-enterprisepartners, rena CRM-specialister och globala SI:er om kundens huvudbehov är 4PS-liknande construction ERP.
Konkurrensfördelar | Egen branschlösning på Business Central, internationell produktutveckling, Hilti-ägande, Microsoft Inner Circle och mycket tydligt vertikalt fokus.
Sårbarheter i jämförelse | Mindre relevant utanför bygg/installation/service; svensk juridisk enhet är mindre/ny; bred D365-portfölj och generell Microsoft-plattformsleverans är inte huvudposition.
4PS Construction Software AB bör på d365.se positioneras som en vertikal Business Central-/ISV-partner för bygg-, entreprenad-, installations- och serviceföretag. Kärnan i erbjudandet är 4PS Construct, en branschspecifik ERP-lösning byggd på Microsoft Dynamics 365 Business Central. Partnern passar bäst när kunden behöver projektkontroll, realtidsöversikt, marginaluppföljning, resursplanering, upphandling, fältprocesser och service/underhåll i en integrerad branschlösning. 4PS bör inte matchas som generell Business Central-partner utan branschkrav, och inte som huvudpartner för F&SCM, fristående CE/CRM, Commerce, HR eller Project Operations utan ny verifiering. Styrkan ligger i vertikal IP, Microsoft-närhet, internationell produktutveckling, Hilti-ägande och tydligt byggfokus. För AI-matchning bör 4PS prioriteras vid bygg-/installationsnära ERP-behov där standard-BC inte räcker och där en färdig branschlösning ger större värde än kundunik anpassning.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av publik partnerprofil.
Senast granskad | Ej angivet | Fylls i vid manuell genomgång.
Partnerbekräftad | Nej | Partner bör bekräfta produktområden, kontaktperson, referenser och AI-/ISV-uppgifter.
Publicerbar utan ändring | Delvis | Kundorienterad text kan användas efter kontroll av känsliga eller osäkra uppgifter.
Känsliga interna delar | Konkurrentsektion och relativ positionering | Får endast användas internt.
Kod | Källa | Användning
S1 | d365.se partnerprofil: 4PS Construction Software AB | Produktområde, kundstorlek, kontor, branschfokus, AI-profil, kontaktperson och d365.se-positionering.
S2 | 4PS Sverige, 4PS Construct / svensk webb | Officiell beskrivning av 4PS Construct, branschprocesser och Business Central-koppling.
S3 | 4PS Group, About 4PS | Gruppstorlek, internationell profil och design/build/implement/maintain-positionering.
S4 | Microsoft Marketplace / AppSource, 4PS Construct | Verifiering av 4PS Construct som Business Central-baserad branschlösning och stödda segment.
S5 | Hilti, slutfört förvärv av 4PS Group 2023 | Ägarstruktur, internationell närvaro och strategisk byggsoftware-position.
S6 | 4PS, Microsoft AI Business Applications Inner Circle 2025/2026 | Microsoft-närhet, innovation och AI-/roadmap-signal.
S7 | Bolagsfakta / bolagsdata för 4PS Construction Software AB | Juridisk enhet, org.nr, omsättning, anställda och adress.
S8 | Internt d365.se marknads- och partnerunderlag | Marknadsarena, jämförelsegrupp, konkurrentlogik och filtergränser.$txt$, source_document_filename = '4ps_ai_partnerunderlag_d365_v1-2.docx', source_document_updated_at = now() WHERE slug = '4ps-sweden';
UPDATE public.partners SET source_document_text = $txt$Fellowmind
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Informationen kan bygga på partnerinlämnad data, befintlig d365.se-profil, offentliga källor och redaktionell/AI-assisterad komplettering. Fellowminds partnerinlämnade uppgifter används som prioriterad källa för publik profil, produktområden, kontaktperson, kontorsstäder, branschpitchar och beslutsprofil.
AI-metadata för maskinell tolkning
partner_id: fellowmind
partner_name: Fellowmind
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_submitted_source: S7
  partner_confirmation_required_only_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_partner_submitted_product_groups:
    business_central: high_primary
    finance_supply_chain_management: high_primary
    sales_customer_insights: high_primary
  related_editorial_product_groups:
    ce_crm_broad: medium_secondary
    power_platform: high_adjacent
    data_ai: high_adjacent
    power_bi_fabric: high_adjacent
    integration: high_adjacent
    managed_services: medium_high_adjacent
    microsoft_365_modern_work: medium_adjacent
  not_active_in_partner_update:
    customer_service_field_service_contact_center: do_not_show_as_active_without_new_partner_update
    project_operations: do_not_show_as_active_without_new_partner_update
    commerce: do_not_show_as_active_without_new_partner_update
    human_resources: do_not_show_as_active_without_new_partner_update
  isv_scope:
    business_central_addons: verified_for_listed_addons_only
    fscm_ce_isv_relations: internal_knowledge_only
delivery_profile:
  growing_business: medium
  midmarket: high
  upper_midmarket: high
  enterprise: high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: true_primary
  show_under_sales_customer_insights: true_primary
  show_under_ce_crm_broad: true_secondary_editorial
  show_under_customer_service_field_service_contact_center: false_unless_new_partner_update
  show_under_project_operations: false_unless_new_partner_update
  show_under_commerce: false_unless_new_partner_update
  show_under_human_resources: false_unless_new_partner_update
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_power_bi_fabric: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_adjacent_signal
  show_under_isv_filters: only_if_isv_authorized_for_bc_addon
publication_layer:
  default_visibility: internal_only
  public_profile_text: partner_submitted_or_editorial
  partner_submitted_source: S7
  ai_matching: allowed_with_confidence_weighting
  competitor_analysis: internal_only
  isv_relationships: require_isv_or_partner_verification
  contact_persons: use_partner_submitted_contact_when_current
  microsoft_statuses: require_public_or_partner_source
normalized_taxonomy:
  product_fit:
    business_central: high_active_partner_submitted
    finance_supply_chain_management: high_active_partner_submitted
    sales_customer_insights: high_active_partner_submitted
    ce_crm_broad: medium_editorial_secondary
    customer_service_field_service_contact_center: not_active_in_partner_update
    project_operations: not_active_in_partner_update
    commerce: not_active_in_partner_update
    human_resources: not_active_in_partner_update
    power_platform: high_adjacent_signal
    data_ai: high_adjacent_signal
    power_bi_fabric: high_adjacent_signal
    integration: high_adjacent_signal
    managed_services: medium_high_adjacent_signal
  customer_size:
    - growing_business
    - midmarket
    - upper_midmarket
    - enterprise
  industry_focus_primary:
    - real_estate_property_management
    - distribution_wholesale
    - consulting_services
    - life_science_medtech
    - retail_ecommerce
    - manufacturing
  delivery_model:
    - microsoft_platform_partner
    - dynamics_365_partner
    - data_ai_partner
    - managed_services_partner
  ai_profile:
    status: editorial_assessment_pending_partner_completion
    basis: d365se_editorial_assessment_from_partner_update_public_sources_and_existing_profile
    ai_delivery_model: combination_of_product_teams_and_central_or_specialist_ai_capability_assumed
    ai_capabilities:
      - microsoft_standard_ai_builtin_copilot
      - copilot_studio_agents
      - power_platform_automation_with_ai
      - power_bi_fabric_ai_driven_analysis
      - ai_readiness_data_quality
      - ai_governance_security_permissions
      - ai_adoption_training
    relevant_microsoft_areas:
      - business_central
      - dynamics_365_finance
      - dynamics_365_supply_chain_management
      - dynamics_365_sales
      - dynamics_365_customer_insights
      - power_platform
      - microsoft_365_copilot
      - azure_fabric
      - erp_processes
      - crm_processes
      - supply_chain_processes
    typical_ai_use_cases:
      - ai_readiness_for_copilot
      - data_quality_permissions_for_copilot
      - copilot_studio_agent
      - sales_process_automation
      - ai_support_for_finance_reporting
      - ai_support_for_purchasing_inventory_supply_chain
      - power_bi_fabric_based_analysis
      - ai_governance_policy
    experience_level_editorial_estimate: pilot_poc_to_delivered_customer_projects
    ai_projects_last_24_months_editorial_estimate: not_publicly_quantified
    evidence_basis:
      - self_declared_partner_update_partial
      - packaged_offering_indicated_by_public_ai_communication
      - anonymized_examples_or_references_should_be_requested
      - public_sources_and_d365se_review
    public_ai_score_visibility: never_public
    requires_partner_completion: true
2. Partner-DNA
Partner-DNA typ: Bred europeisk Microsoft- och Dynamics 365-partner med stark svensk Business Central-närvaro, tydlig F&SCM- och CE/CRM-kapacitet samt stark Data & AI-profil. Tolkning: Fellowmind bör matchas när kunden vill kombinera affärssystem, kundprocesser, data, AI och Microsoft-plattformsbredd.
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
Viktig avgränsning: d365.se:s nuvarande ISV-/tilläggssida för listade tillägg och auktoriserade partners gäller i nuläget endast Business Central-tillägg. En partner ska därför endast visas under ett specifikt Business Central-tillägg om partnern är auktoriserad av den aktuella ISV:n eller om motsvarande verifiering finns dokumenterad.
Generell ERP-, F&SCM-, CE/CRM-, integrations- eller AI-kompetens ska inte användas som grund för visning i dessa ISV-filter. ISV-relationer inom F&SCM eller CE/CRM kan dokumenteras internt som kunskapsunderlag, men ska inte styra dagens publika ISV-/tilläggsfilter på d365.se.
5. Filterbeslut för d365.se
Denna sektion styr hur partnern bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut är inte samma sak som fullständig kompetensbedömning; de anger hur starkt partnern bör viktas i matchningslogiken.
ISV-avgränsning: Dagens publika ISV-/tilläggsfilter på d365.se avser Business Central-tillägg. Fellowmind kan listas för de BC-tillägg där partnern finns i katalogunderlaget, exempelvis Continia, SignUp ExFlow, Logtrade, Dynamicweb, Axtension, Aptean Food & Beverage och Perfion PIM. För övriga Business Central-tillägg ska Fellowmind endast visas om ISV-auktorisation, ISV-källa, partnerinlämnad uppgift eller dokumenterat kundcase finns.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  fscm_or_ce_isv_relations: internal_knowledge_only
  fellowmind_bc_addon_status: verified_for_listed_addons_only
  verified_bc_isv_partners:
    - continia
    - signup_exflow
    - logtrade
    - dynamicweb
    - axtension
    - aptean_food_beverage
    - perfion_pim
  do_not_infer_authorization_for_other_addons: true
  verification_required_for_other_addons_from:
    - isv_authorization
    - isv_partner_directory
    - partner_submitted_information
    - documented_customer_case
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika typer av Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Organisationer som söker Business Central med svensk närvaro och större leveranskapacitet. [✓/~ H, S1/S2]
Medelstora och större företag som söker Dynamics 365 Finance & Supply Chain Management. [✓/~ H, S1/S2]
Kunder som vill kombinera Dynamics 365 med CE/CRM, Sales, Customer Service, Field Service eller Customer Insights. [✓/~ H, S1/S2]
Organisationer som vill koppla ihop affärssystem, kundprocesser, Power Platform, data, BI/Fabric, AI och Microsoft 365. [✓/~ H, S1/S4]
Kunder där Copilot, Hive AI, AI-agenter, automation och datagrund är en del av målbilden. [✓/~ H, S3/S4]
Bolag som vill ha lokal svensk närvaro kombinerad med nordisk/europeisk leveransförmåga. [~ H, S1/S2]
Kunder som efter go-live behöver Managed Services, förvaltning och kontinuerlig vidareutveckling. [✓/~ M/H, S2]
8. Mindre lämplig för
Mycket små bolag som endast söker enklaste möjliga lågkostnadsimplementation utan behov av bred Microsoft-kapacitet. [~ M, S5]
Kunder som uttryckligen söker en mycket liten lokal boutique-partner med begränsad projektorganisation. [~ M, S5]
Projekt där en specifik Business Central-ISV-lösning är huvudkrav och Fellowmind inte är verifierad eller auktoriserad för just tillägget. [~ H, S5]
Projekt där lägsta pris är viktigare än leveranskapacitet, plattformsbredd, styrning och långsiktig utveckling. [~ M, S5]
9. AI Matchningsregler
negative_match_rules:
  very_small_low_complexity_project: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
  public_use_of_internal_competitor_analysis: prohibited
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Internationell ERP-modernisering
Ett svenskt eller nordiskt bolag vill modernisera affärssystemet och behöver en partner som kan kombinera Dynamics 365, data, integration, processutveckling och långsiktig förvaltning. Fellowmind är relevant när kunden vill ha både lokal närhet och bred Microsoft-kapacitet.
Scenario 2 - Tillverkning eller distribution med komplexa flöden
Kunden behöver Business Central eller Finance & Supply Chain Management och vill samtidigt utveckla rapportering, Power Platform, integrationer eller kundprocesser. Fellowmind passar när flera Microsoft-områden behöver samspela.
Scenario 3 - Data och AI-fundament
Ledningen vill använda Copilot, Hive AI, AI-agenter eller mer avancerad analys, men behöver först stärka datagrund, processer och systemintegration. Fellowmind är relevant när AI ska kopplas till verkliga affärsprocesser.
Scenario 4 - Befintlig Dynamics 365-kund vill ta nästa steg
Kunden har redan Dynamics 365 eller Business Central och vill vidareutveckla integrationer, rapportering, Power Platform, Microsoft 365, AI/Copilot och förvaltning efter go-live.
Scenario 5 - ISV-krävande Business Central/Dynamics-miljö
Kunden behöver ett specifikt Business Central-tillägg. Fellowmind ska då endast visas i ISV-/tilläggsfilter om Fellowmind är auktoriserad av aktuell ISV eller om motsvarande verifiering finns dokumenterad.
12. Dynamics 365-erbjudande
Huvudproduktområden i d365.se:s taxonomi är BC, F&SCM och CE/CRM. Tillvalsprodukter som Commerce, HR och Project Operations hanteras som separata filterfält. Max tre branscher per produktområde används för att undvika övermatchning.
13. ISV-lösningar kopplade till Dynamics 365
ISV-lösningar ska hanteras som egna filter- och kunskapsfält. En partner kan vara stark inom BC eller F&SCM men ändå sakna verifierad relation till en viss ISV. Matchning ska därför skilja mellan produktkompetens, återförsäljarstatus, implementationserfarenhet och kundcase.
14. Branschfokus
15. AI, Copilot och Agents
15A. Försiktig redaktionell AI-profil
16. Data & Analytics
17. Integration
18. Ekonomi, storlek och marknadsposition
19. Historik och utveckling
Ingen separat historik- eller förvärvsanalys ingår i denna version. Vid behov kan historik kompletteras senare, men ska inte påverka AI-matchning eller publik kortbeskrivning utan separat kontroll.
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt)
Endast internt: Denna sektion är inte avsedd för publik publicering. Den används för AI-matchning, redaktionell jämförelse och intern förståelse av partnerpositionering.
23. Kundorienterad partnerbeskrivning
Fellowmind är relevant för organisationer som vill ha en bred Microsoft-partner snarare än enbart en isolerad affärssystemsimplementatör. I ett Dynamics 365-sammanhang bör Fellowmind beskrivas som en partner med stark kapacitet inom Business Central, Finance & Supply Chain Management och Customer Engagement, kombinerat med Data & AI, Power Platform, Modern Work och europeisk leveransförmåga.
För en potentiell Dynamics 365-kund är Fellowminds styrka kombinationen av lokal närhet, stor Microsoft-kompetensbredd och kapacitet att koppla ihop affärssystem, kundprocesser, data, integrationer, AI och produktivitet i en sammanhållen plattform. Partnern bör prioriteras när kunden vill utveckla flera delar av Microsoft-ekosystemet samtidigt.
Fellowmind bör också utvärderas när kunden vill kombinera Dynamics 365 med AI, Copilot, agenter, Power BI/Fabric eller Azure-baserade lösningar. Hive AI och Fellowminds AI-kommunikation gör partnern särskilt relevant när AI ska kopplas till processer, system och data snarare än hanteras som fristående experiment.
Vid d365.se-matchning bör Fellowmind därför beskrivas som en bred Microsoft Dynamics 365-partner för Business Central, F&SCM, CE/CRM, Data & AI och Power Platform. För publika BC-tillägg och ISV-filter bör matchningen däremot alltid kräva verifierad ISV-auktorisation eller dokumenterat stöd per tillägg.
24. AI-sammanfattning
Fellowmind är en bred europeisk Microsoft- och Dynamics 365-partner med stark svensk närvaro inom Business Central, Finance & Supply Chain Management och Customer Engagement. Partnern bör matchas mot kunder som vill kombinera affärssystem, kundprocesser, Data & AI, Power Platform, integrationer, Modern Work och långsiktig utveckling av Microsoft-plattformen. Fellowmind passar särskilt väl när kunden söker en partner med lokal närhet men bred leveranskapacitet i Sverige, Norden och Europa. AI, Copilot, Hive AI, Power BI/Fabric och Azure-baserade lösningar är viktiga förstärkande signaler. ISV-/tilläggsfilter på d365.se ska däremot endast användas när Fellowmind är verifierad eller auktoriserad partner för det aktuella Business Central-tillägget.
24A. Publik kortbeskrivning
Status: Publik kortversion för d365.se. Texten är neutral och kundorienterad och kan baseras på partnerinlämnad information, befintlig d365.se-profil, offentliga källor och AI-assisterad redaktionell komplettering. Extra verifiering rekommenderas för kontaktpersoner, ISV-auktorisationer, Microsoft-statusar och konkreta kundcase.
Fellowmind är en europeisk Microsoft-partner som verkar i fem länder och stödjer över 2 500 kunder. Partnern kombinerar branschkunskap med molnbaserad teknologi, Data & AI och Microsoft-plattformen för att hjälpa organisationer utveckla affärssystem, kundprocesser, data, AI, integration och digital arbetsplats.
På d365.se kan Fellowmind presenteras för organisationer som vill modernisera affärssystem, effektivisera kundprocesser, koppla ihop flera Microsoft-lösningar och skapa bättre förutsättningar för analys, automation, Copilot, AI-agenter och långsiktig digital utveckling.
Föreslagen kort text för partnerkort
Partnerkort: Fellowmind hjälper kunder med Dynamics 365 Business Central, Finance & Supply Chain Management samt Sales & Customer Insights. Partnern kombinerar verksamhetsförståelse, Data & AI, integration och Microsoft-plattformsbredd för att skapa sammanhängande affärs- och kundprocesser i Sverige och internationellt.
Föreslagen publik profiltext
Fellowmind är en europeisk Microsoft-partner med svensk närvaro och kontor i Malmö, Göteborg, Stockholm, Växjö, Halmstad, Helsingborg och Jönköping. Partnern arbetar med Dynamics 365 Business Central, Finance & Supply Chain Management samt Sales & Customer Insights, och kombinerar detta med kompetens inom Data & AI, automation, integration och Microsofts molnplattform.
Fellowmind är relevant för organisationer inom bland annat grossist och distribution, retail och e-handel, tillverkning, fastighet och förvaltning, konsulttjänster samt Life Science/Medtech. Partnern beskriver särskild styrka i att optimera affärsprocesser, skapa datadriven verksamhetsstyrning, effektivisera säljprocesser och förbättra kundupplevelser genom Dynamics 365, CRM, kunddata, automation och AI.
Inför publicering bör d365.se särskilt kontrollera kontaktvägar, ISV-relationer, Microsoft-statusar, eventuella kundcase och AI-/Copilot-erfarenhet. AI-profilen kan tills vidare användas som försiktig redaktionell bedömning för matchning, men erfarenhetsnivå, antal AI-projekt och konkreta referenser bör kompletteras av Fellowmind innan de används som stark publik signal.
Föreslagen kontaktperson för publik profil
Kontaktperson för Fellowmind på d365.se: Katarina Pärsson anges som säljare/säljansvarig i partneruppdateringen. E-post: katarina.parsson@fellowmind.se. Telefon: 0103333399. Tidigare produktkontakter, exempelvis Caroline Rasmussen för Business Central, bör betraktas som historiska eller kompletterande tills de kontrollerats mot aktuell d365.se-profil.
Föreslagna publika filter och taggar
Aktiva produktområden: Business Central, Finance & Supply Chain Management samt Sales & Customer Insights
Kompletterande områden att kontrollera: Power Platform, Data & AI, integration, Power BI/Fabric, Copilot, automation och Microsoft 365
Kundstorlek att kontrollera: växande företag, midmarket, övre midmarket och enterprise
Typiska projekt att kontrollera: Business Central-implementation, ERP-modernisering, F&SCM-projekt, CRM/CE-projekt, integrationsprojekt, data- och AI-initiativ samt Managed Services
Branschfokus enligt partneruppdatering: Fastighet & Förvaltning, Grossist & Distribution, Konsulttjänster, Life Science/Medtech, Retail & E-handel och Tillverkningsindustri
Uppgifter att kontrollera inför publicering
Utgå från Fellowminds partnerinlämnade företagsbeskrivning och produkttexter som primär källa för publik profil.
Kontrollera att aktiva produktområden är Business Central, Finance & Supply Chain Management samt Sales & Customer Insights. Övriga produkter bör inte visas som aktiva utan ny uppgift.
Kontrollera vilka tre branscher som ska användas som primärt branschfokus per produktområde enligt d365.se:s publiceringsmodell.
Kontrollera aktuell kontaktperson: Katarina Pärsson är angiven som säljare/säljansvarig i partneruppdateringen.
Kontrollera eventuella Microsoft-statusar, specialiseringar, Inner Circle-statusar eller partnerutmärkelser innan de visas publikt.
Kontrollera om Fellowmind är auktoriserad partner för några Business Central-tillägg på d365.se:s ISV-/tilläggssida.
Komplettera AI-profilen med partnerinlämnade värden för erfarenhetsnivå, antal AI-projekt senaste 24 månaderna, valda AI-use cases och referensunderlag. Tills vidare används d365.se:s försiktiga redaktionella AI-bedömning.
25. Varför denna partner
✓ Kunden söker Business Central med lokal svensk närhet och större leveranskapacitet.
✓ Kunden söker Finance & Supply Chain Management för större eller mer komplexa ERP-behov.
✓ Kunden vill kombinera Dynamics 365 med CE/CRM, Sales, Customer Service, Field Service eller Customer Insights.
✓ Kunden vill utveckla Power Platform, Power BI/Fabric, Azure, Microsoft 365 eller Data & AI tillsammans med Dynamics 365.
✓ AI, Copilot, Hive AI eller agentbaserade processer är en del av målbilden.
✓ Kunden behöver europeisk räckvidd men svensk lokal förankring.
✓ Kunden vill ha långsiktig förvaltning, vidareutveckling och Managed Services.
26. Kontrollpunkter inför publicering
Kontrollera produktområden: Business Central, F&SCM, CE/CRM, Project Operations, Field Service, Commerce, HR och Contact Center.
Kontrollera Microsoft-statusar, Inner Circle-status, specialiseringar och eventuella solution partner-designationer innan de visas publikt.
Kontrollera kontaktpersoner per produktområde och om de ska visas publikt eller endast användas bakom kontaktformulär.
Kontrollera om Fellowmind är auktoriserad partner för specifika Business Central-tillägg på d365.se:s ISV-/tilläggssida.
Kontrollera max tre prioriterade branscher per produktområde för d365.se-filter.
Kontrollera referenskunder per produktområde och bransch innan de används publikt.
Kontrollera geografisk leveranskapacitet och ansvarsfördelning mellan Sverige, Norden, Europa och eventuell global leverans.
Kontrollera Managed Services-modell och support-/förvaltningsupplägg.
Kontrollera AI-erbjudande, Hive AI, Copilot Studio-kompetens, agentprojekt och konkreta AI-use cases. Redaktionell bedömning kan användas för intern matchning men bör inte ersätta partnerinlämnad erfarenhetsnivå eller projektvolym.
Kontrollera att den publika kortbeskrivningen är förenlig med partnerinlämnat material, befintlig d365.se-profil och d365.se:s redaktionella principer.
26A. Kontrollworkflow och statusfält
27. Källor
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Fellowmind | ✓ | H | S1, S2, S3
Partnertyp och egen beskrivning | Fellowmind beskriver sig som en ledande europeisk Microsoft-partner som verkar i fem länder och stödjer över 2 500 kunder. De kombinerar branschkunskap med molnbaserad teknologi, Data & AI och hela Microsoft-plattformen, med människor och långsiktiga partnerskap i centrum. | ✓/~ | H | S2, S7
Aktiva produktområden | Fellowmind anger Business Central, Finance & Supply Chain Management samt Sales & Customer Insights som aktiva Dynamics 365-produktområden. Customer Service / Field Service / Contact Center och övriga specialty-produkter är inte markerade som aktiva i partneruppdateringen. | ✓/~ | H | S1, S7
Primära styrkor | Business Central, F&SCM, Sales, Customer Insights, CRM, kunddata, automation, Data & AI, Power Platform, integration, molnbaserad Microsoft-plattform och långsiktiga partnerskap. AI-profilen är ännu inte komplett ifylld i partneruppdateringen. | ✓/~ | H | S2, S7
Kundstorlek | Fellowmind uppger att de verkar i fem länder och stödjer över 2 500 kunder. Relevanta segment är växande företag, midmarket, övre midmarket och enterprise beroende på produktområde och scope. | ~ | H | S1, S2, S4
Branschfokus | Fellowmind anger branschpitchar för Fastighet & Förvaltning, Grossist & Distribution, Konsulttjänster, Life Science/Medtech, Retail & E-handel och Tillverkningsindustri. Produktpositionering anger bland annat grossist, retail och tjänstebolag för Business Central samt tillverkning, grossist och life science för F&SCM. | ✓/~ | M/H | S1, S2
AI-mognad | Hög som redaktionell bedömning. Fellowmind kommunicerar AI Solutions, Hive AI, Microsoft Copilot, Azure OpenAI, Data & Analytics och agentbaserade arbetssätt. I partneruppdateringen är AI-profilen ännu inte komplett ifylld, därför bör nivå, antal projekt och referenser kontrolleras innan stark publik AI-positionering. | ✓/~ | H | S3, S4
Geografisk kapacitet | Fellowmind verkar i fem länder och anger svenska kontorsstäder: Malmö, Göteborg, Stockholm, Växjö, Halmstad, Helsingborg och Jönköping. Exakt leveransmodell bör kontrolleras per scope. | ✓/~ | H | S1, S2, S7
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil, offentlig källa eller redaktionellt/AI-assisterat tillägg med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, referenser och exakta produktområden. | Bör verifieras extra innan publicering eller stark matchningsvikt om uppgiften är ny, osäker, känslig eller påverkar kontaktväg, ISV-auktorisation, Microsoft-status eller referenser.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Fellowmind profilerar sig tydligt som Business Central-partner och beskrivs som en av Sveriges större BC-organisationer.
Finance & SCM-fokus | 4/5 | H | Fellowmind har ett tydligt erbjudande inom Dynamics 365 Finance & Supply Chain Management och Enterprise-team.
Sales & Customer Insights-fokus | 4/5 | H | Sales och Customer Insights är aktiva partnerinlämnade områden. Customer Service, Field Service och Contact Center bör inte räknas som aktiva produktområden utan ny uppdatering.
AI / Copilot / Agents | 5/5 | H | Fellowmind kommunicerar AI Solutions, Hive AI, Microsoft Copilot, Azure OpenAI och agentbaserade processer.
Data & Analytics | 5/5 | H | Power BI, Microsoft Fabric och Data & Analytics är tydliga erbjudanden.
Integration | 4/5 | H | Azure Integration Services, API:er, Power Platform och plattformsintegration är viktiga delar av erbjudandet.
Managed Services | 4/5 | M/H | Fellowmind beskriver fortsatt stöd efter go-live och Managed Services för Business Central och bredare Microsoft-miljöer.
Europeisk leverans | 5/5 | H | Fellowmind verkar i flera europeiska länder och stödjer många kunder, men projektansvar bör verifieras per scope.
Microsoft-plattformsbredd | 5/5 | H | Fellowmind täcker Dynamics 365, Power Platform, Azure, Microsoft 365, Data & AI och Modern Work.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Bred Microsoft Dynamics 365-partner med aktiva erbjudanden inom Business Central, Finance & Supply Chain Management samt Sales & Customer Insights, kompletterat av Data & AI, integration och Microsoft-plattformen. | ~ | H | S1, S2, S7
Tydlig köparnytta | Kunden får en partner som kan kombinera affärssystem, kundprocesser, data, AI, integration, Modern Work och europeisk leveranskapacitet. | ~ | H | S1, S2, S4
Matchningslogik | Prioriteras när kunden söker BC, F&SCM eller Sales/Customer Insights och vill kombinera detta med CRM, kunddata, automation, AI, integration och Microsoft-plattformsbredd. | ~ | H | S1, S2, S3
Positioneringsgränser | Ska inte övermatchas enbart på ISV-tillägg utan verifierad auktorisation, eller när kunden uttryckligen söker en mycket liten lokal nischpartner. | ~ | M | S5
Filterområde | Beslut för Fellowmind | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Fellowmind har tydlig BC-profil och d365.se har redan BC-kontaktperson och profilinformation.
F&SCM | Visa som primär partner. | Hög | ✓/~ | Tydlig Enterprise- och F&SCM-kapacitet samt referens-/kundcaseinformation på d365.se.
Sales & Customer Insights | Visa som primär partner för Sales & Customer Insights. | Hög | ✓/~ | Aktivt partnerinlämnat område. Bred CE/CRM kan användas som sekundär redaktionell matchning, men Customer Service, Field Service och Contact Center ska inte visas som aktiva utan ny partneruppdatering.
Data & AI | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | AI Solutions, Hive AI, Power BI, Fabric och Azure OpenAI är viktiga differentierare.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Relevant vid automation, appar, Dataverse, integration och processutveckling.
ISV-lösningar | Visa endast per verifierad ISV-auktorisation för BC-tillägg. | Endast verifierad matchning | ? | d365.se:s publika ISV-/tilläggsfilter gäller Business Central-tillägg och kräver ISV-auktorisation.
Fält | Värde för Fellowmind | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Bred Microsoft Dynamics 365- och Business Applications-partner | Använd som huvudkategori när kunden söker Business Central, F&SCM, CE/CRM, Power Platform, Data & AI eller helhet över Microsoft-plattformen. | H | S1, S2, S3
Sekundära arenor | Data & AI, Power Platform, Modern Work, integration och Managed Services | Använd som kompletterande matchningslogik när kunden vill utveckla flera Microsoft-områden samtidigt. | H | S1, S2, S3, S4
Partnerkategori | Europeisk Microsoft-partner med stark svensk Dynamics 365-närvaro | Hjälper AI att skilja Fellowmind från renodlade BC-nischpartners, rena CRM-specialister och globala SI:er. | H | S1, S2
Primär jämförelsegrupp | Columbus, Cepheo, Engage, CGI, Nexer, Avanade/Accenture, Capgemini/Sogeti | Använd vid jämförelser där kunden söker bred Microsoft-, Dynamics 365-, data- och transformationskapacitet. | M | S5
Lägre relevans i jämförelse | Mycket små lokala BC-specialister, rena Contact Center-specialister och redovisningsnära IT-kanaler | Använd som lägre jämförelse när kunden efterfrågar liten lokal leverans, låg komplexitet eller en mycket smal lösningskategori. | M | S5
Fakta | Värde | Verif. | Konf. | Källa
Partner | Fellowmind | ✓ | H | S1, S2
Partnertyp och självbeskrivning | Europeisk Microsoft-partner som verkar i fem länder och stödjer över 2 500 kunder, med fokus på molnbaserad teknologi, Data & AI och Microsoft-plattformen. | ✓/~ | H | S1, S2, S3
Geografisk närvaro | Fem länder. Svenska kontorsstäder: Malmö, Göteborg, Stockholm, Växjö, Halmstad, Helsingborg och Jönköping. Exakt lokal leveransmodell bör kontrolleras per kundscenario. | ✓/~ | H | S1, S2
Viktiga erbjudanden | Business Central, Finance & Supply Chain Management, Sales & Customer Insights, CRM, kunddata, automation, Data & AI, integration, molnbaserad Microsoft-plattform och långsiktiga partnerskap. | ✓/~ | H | S1, S2, S3, S4
Kontaktpersoner | Katarina Pärsson anges som säljare/säljansvarig i partneruppdateringen. E-post: katarina.parsson@fellowmind.se. Telefon: 0103333399. | ✓/~ | M/H | S7
Storlekskategori | Bred Microsoft- och Dynamics 365-partner för växande företag, midmarket, övre midmarket och enterprise. | ~ | H | S1, S2, S5
Prioritera Fellowmind när | Signalstyrka | Konfidens
Kunden söker Business Central, Dynamics 365 Finance & Supply Chain Management, Sales & Customer Insights eller bred ERP-/kundprocessmodernisering. | Mycket stark | H
Kunden vill kombinera Dynamics 365 Sales och Customer Insights med CRM, kunddata, automation, AI eller förbättrade kundupplevelser. Customer Service, Field Service och Contact Center ska endast användas som aktiv matchning om ny partneruppdatering stödjer det. | Stark | H
Projektet innehåller integrationer, API:er, EDI/B2B, datamigrering eller flera systemlandskap. | Mycket stark | H
Kunden vill kombinera affärssystem med Power Platform, Power BI/Fabric, Data & AI, Copilot, Hive AI eller agentbaserade arbetssätt. | Mycket stark | H
Kunden behöver långsiktig förvaltning, Managed Services, support, ALM eller kontinuerlig vidareutveckling efter go-live. | Stark | M/H
Kunden är midmarket, övre midmarket eller enterprise och behöver lokal svensk närvaro kombinerad med nordisk eller europeisk leveranskapacitet. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, enkelt och primärt budgetdrivet utan behov av bred Microsoft-kapacitet. | Stark nedviktning | M
Kunden söker en mycket liten lokal boutique-partner med begränsad projektorganisation. | Medel nedviktning | M
Kunden kräver verifierad auktorisation för ett specifikt Business Central-tillägg där Fellowmind inte är verifierad. | Stark nedviktning | H
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
Intern konkurrensanalys riskerar att visas publikt eller användas som kundtext. | Ej publik användning | H
Matchningskonfidens | Använd när
Hög | Kundbehovet innehåller Business Central, F&SCM, Sales & Customer Insights, Power Platform, Data & AI, integration, Managed Services eller bred Microsoft-plattformsutveckling.
Medel | Kunden har ett smalare Dynamics 365-behov där produktområde, bransch, kontaktväg eller leveransmodell behöver kontrolleras.
Låg | Kunden söker mycket liten lokal nischleverans eller ett specifikt ISV-tillägg där Fellowmind saknar verifierad auktorisation.
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 5 | Tydlig del av Fellowminds Dynamics 365-erbjudande och relevant i d365.se:s befintliga profil. | ✓/~ | H | S1, S2
Finance & SCM | 4 | Relevant erbjudande för större och mer komplexa affärssystemsmiljöer. | ✓/~ | H | S1, S2
Sales & Customer Insights | 4 | Sales och Customer Insights är aktiva partnerinlämnade områden, med fokus på CRM, kunddata, automation och AI för bättre kundupplevelser. | ✓/~ | H | S1, S2
Data & AI | 5 | Stark koppling till Data & AI, Hive AI, Copilot, Power BI/Fabric och Azure OpenAI. | ✓/~ | H | S3, S4
Power Platform | 4 | Viktig plattform för automation, appar, Dataverse och utökningar runt Dynamics 365. | ✓/~ | H | S1, S2
Integration | 4 | Relevant vid Microsoft-plattformsprojekt där Dynamics 365, Azure, data och affärsprocesser behöver samverka. | ✓/~ | H | S1, S2
Managed Services | 4 | Relevant för långsiktig förvaltning, vidareutveckling och support efter implementation. | ✓/~ | M/H | S2
Europeisk leverans | 5 | Fellowmind verkar i flera europeiska marknader och bör kunna matchas när kunden söker lokal närhet kombinerad med bredd. | ✓/~ | H | S1, S2
Produktområde | Roll | Max 3 branscher | Kundnytta | Verif. | Kommentar
Business Central | Kärnområde | Grossist/distribution; retail/e-handel; tjänstebolag | Affärssystem för växande och medelstora organisationer med behov av ekonomi, lager, inköp, order och rapportering. | ✓/~ | Stark signal.
Finance & Supply Chain Management | Kärnområde | Tillverkning; distribution/grossist; supply chain | Stöd för större och mer komplexa organisationer med krav på ekonomi, supply chain, lager, produktion och internationella processer. | ✓/~ | Stark ERP-matchning.
Sales & Customer Insights | Aktivt område | Fastighet; tillverkning; konsulttjänster | Stöd för säljprocesser, kunddata, automation, AI och förbättrade kundupplevelser genom Dynamics 365 Sales och Customer Insights. | ✓/~ | Aktivt partnerinlämnat område. Bredare CE/CRM-funktioner bör kontrolleras separat.
Power Platform | Stödjande plattform | Tillverkning; distribution; serviceorganisationer | Automation, appar, arbetsflöden och utökningar runt Dynamics 365. | ✓/~ | Viktig kompletterande signal.
Microsoft Fabric / Power BI | Starkt angränsande | Tillverkning; distribution/grossist; retail/e-handel | Rapportering, analys, datamodell och AI-förberedd beslutsplattform. | ✓/~ | Stark data-/AI-signal.
AI/Copilot/Hive AI | Starkt angränsande | Processintensiva verksamheter; kunskapsintensiva organisationer; större Microsoft-miljöer | AI, Copilot, agenter och automation kopplat till processer, data och Microsoft-plattformen. | ✓/~ | Differentierande signal.
ISV/lösning | Kategori | D365-koppling | Fellowmind-status | Filterbeslut / not
Continia | AP automation, fakturahantering och e-dokument | Business Central | Listad partner i BC-ISV-katalogen | Kan användas som BC-tilläggsmatchning för Fellowmind när kundbehovet gäller Continia-relaterade lösningar.
SignUp ExFlow | AP automation och fakturahantering | Business Central | Listad partner i BC-ISV-katalogen | Kan användas som specifik ISV-matchning för ExFlow. Ska inte generaliseras till alla fakturahanteringslösningar.
Logtrade | Frakt, TA och leveransintegration | Business Central | Listad partner i BC-ISV-katalogen | Kan användas vid kundbehov inom frakt, TA, transportbokning och leveransflöden kopplade till Business Central.
Dynamicweb | E-handel och digital commerce | Business Central | Listad partner i BC-ISV-katalogen | Kan användas som matchning när kunden söker Dynamicweb/Truvio-relaterad BC-e-handel.
Axtension | Projekt, bygg och tilläggslösningar | Business Central | Listad partner i BC-ISV-katalogen | Kan användas som specifik matchning för Axtension-lösningar. Kräver fortsatt att aktuellt tillägg stämmer med kundens behov.
Aptean Food & Beverage | Branschpaket för livsmedel och dryck | Business Central | Listad partner i BC-ISV-katalogen | Kan användas vid livsmedelsnära BC-scenarier där Aptean Food & Beverage är relevant.
Perfion PIM | PIM och produktinformation | Business Central | Listad partner i BC-ISV-katalogen | Kan användas vid PIM- och produktdatabehov kopplade till Business Central.
Övriga Business Central-tillägg | Ekonomi, dokument, EDI, WMS, e-handel, rapportering eller branschfunktioner | Business Central | Ej verifierad per detta underlag | Visa inte Fellowmind under övriga BC-tillägg utan separat ISV-auktorisation, ISV-källa, partneruppgift eller dokumenterat kundcase.
F&SCM-/CE-relaterade ISV:er | Branschlösningar, integration, e-handel, service, data eller automation | F&SCM eller CE/CRM | Internt kunskapsunderlag tills verifierat | Ska inte styra dagens publika BC-tilläggsfilter. Kan dokumenteras internt men inte visas som BC-tillägg utan verifiering.
Bransch | Klassificering | Relevans | Kommentar | Referenstyp | Källa
Tillverkning | Kärnbransch | Hög | Stark koppling till ERP, supply chain, produktion, integration och datakrav. | Kundcase/marknadsbudskap | S1, S3
Distribution/grossist | Kärnbransch | Hög | Relevant genom lager, inköp, försäljning, orderflöden, EDI och supply chain. | Kundcase/marknadsbudskap | S1, S3
Life Science | Kärnbransch | Hög | Relevant vid komplexa processer, kvalitet, spårbarhet och regulatoriska krav. | Kundcase/marknadsbudskap | S1, S3
Retail/e-handel | Sekundär bransch | Medel | Relevant när ERP kopplas till e-handel, orderflöden och integrationsbehov. | Marknadsbudskap | S1, S3
Projektintensiva verksamheter | Sekundär bransch | Medel | Project Operations nämns; verifiera referenser. | Produktbudskap | S1
Serviceorganisationer | Sekundär bransch | Medel | Field Service nämns; passar bäst som ERP-nära serviceflöde. | Produktbudskap | S1
Offentlig sektor | Ej verifierad | Låg | Ingen tydlig verifierad huvudposition i granskad information. | - | S7
Område | Bedömning | Verif. | Konf. | Källa
AI-mognad | Hög relativt traditionella ERP-partners. Synlig och konkret koppling mellan AI, affärssystem, data och processer. | ✓/~ | H | S1, S3
AI-readiness | Fellowmind kopplar AI-nytta till data, governance, processer och Microsoft-plattformens kvalitet. | ✓/~ | H | S2, S3, S4
Copilot | Copilot för Dynamics 365 och Power BI förekommer i kommunikation och eventteman. | ✓ | H | S1, S3
Copilot Studio | Nämns i agent-/AI-kontext men djup och antal projekt bör verifieras. | ✓/~ | M | S3
Agents | Tydlig agentkommunikation och ERP-/Supply Chain-nära användningsfall. | ✓/~ | H | S1, S3
Konkreta användningsfall | Supply chain, bankintegration/reconciliation, rapportering, beslutsstöd och processautomatisering. | ✓/~ | H | S3
ERP-nära AI | Stark matchningssignal när AI ska kopplas till ekonomiflöden, supply chain och datafundament. | ~ | H | S1, S3, S7
Dataförutsättningar | Data & Analytics, rapportering, datakvalitet och integration är viktiga delar av AI-mognaden. | ✓/~ | H | S2, S3
AI-fält | Försiktig redaktionell bedömning | Status
Organisering av AI-kompetens | Kombination av produktteam och central/tvärfunktionell AI-kompetens antas utifrån Fellowminds Data & AI-, Hive AI- och Microsoft-plattformsprofil. | d365.se-bedömning
AI-förmågor | Microsoft Standard AI/inbyggd Copilot, Copilot Studio/agenter, Power Platform-automation med AI, Power BI/Fabric och AI-driven analys, AI-readiness och datakvalitet, AI-governance/säkerhet/behörigheter samt AI-adoption och utbildning. | Behöver partnerkompletteras
Relevanta Microsoft-områden | Business Central, Dynamics 365 Finance, Dynamics 365 Supply Chain Management, Dynamics 365 Sales, Customer Insights, Power Platform, Microsoft 365 Copilot, Azure/Fabric, ERP-processer, CRM-processer och supply chain-processer. | d365.se-bedömning
Typiska AI-use cases | AI-readiness inför Copilot, datakvalitet och behörigheter inför Copilot, Copilot Studio-agent, automatisering av säljprocess, AI-stöd för ekonomi och rapportering, AI-stöd för inköp/lager/supply chain, Power BI/Fabric-baserad analys samt AI-governance och policy. | Försiktig matchningsprofil
Erfarenhetsnivå | Redaktionell bedömning: från rådgivning/workshops och pilot/PoC till levererade kundprojekt. Exakt nivå bör bekräftas av Fellowmind. | Ej partnerbekräftad
Antal AI-projekt senaste 24 månaderna | Ej publikt kvantifierat i underlaget. Ska inte anges numeriskt utan partnerkomplettering. | Saknas
Underlag för AI-erfarenhet | Delvis självdeklarerat i partneruppdateringen, kompletterat av offentlig AI-kommunikation, Hive AI-material, d365.se-redaktionell bedömning och behov av anonymiserade exempel eller referenser på förfrågan. | Blandat underlag
Kort AI-beskrivning | Fellowmind hjälper kunder att identifiera och införa AI-, Copilot- och automationslösningar i Dynamics 365- och Power Platform-miljöer, med fokus på datakvalitet, processautomation, analys, governance och adoption. Typiska områden är Copilot Studio-agenter, AI-stöd i sälj-, ekonomi- och supply chain-processer samt analys med Power BI/Fabric. | Redaktionellt utkast
Område | Bedömning | Verif. | Konf. | Källa
Data governance | Relevant i Data & Analytics-erbjudandet och AI-readiness. Detaljer bör kontrolleras per projekt. | ✓/~ | M | S2
Dataplattform | Fellowmind har ett relevant Data & Analytics-erbjudande; teknisk stack och referenser bör verifieras per projekt. | ✓/~ | H | S1, S2, S4
Power BI | Power BI och AI-ready datamodeller är tydliga relevanta områden. | ✓ | H | S3
Microsoft Fabric | Fabric är relevant i Microsoft-dataområdet. Antal projekt och referenser bör kontrolleras. | ✓/~ | M | S1, S2
Datakvalitet | Hög relevans i AI- och affärssystemssammanhang. | ✓/~ | H | S2, S3
Rapportering | Relevant vid ERP-projekt där ledningen behöver bättre styrning och beslutsunderlag. | ✓/~ | H | S1
Analytics | Starkt angränsande erbjudande med BI/analytics och AI-fundament. | ✓/~ | H | S2, S5
AI-grund | Data, integration och processkvalitet är centrala komponenter i AI-readiness. | ~ | H | S2, S3
Område | Bedömning | Verif. | Konf. | Källa
Integrationsarkitektur | Starkt område. Fellowmind bör matchas när kunden behöver lösningsarkitektur, integrationslandskap och samspel mellan Dynamics 365, Azure, data och verksamhetsprocesser. | ✓/~ | H | S1, S2
Middleware | Relevant område, men exakt middlewareprodukt, metodik och referenser bör kontrolleras per projekt innan det används som stark publik signal. | ? | M | S7
API:er | API-baserad integration är relevant vid Microsoft-plattformsprojekt och bör användas som matchningssignal när kunden har flera system, datakällor eller processflöden som behöver kopplas ihop. | ~ | M/H | S2, S7
EDI/B2B | EDI, B2B-flöden och automatisering är särskilt relevant vid distribution, grossist, retail, tillverkning och supply chain-nära projekt. | ✓/~ | H | S1, S3
Dataintegration | Stark matchningssignal när ERP, BI, Microsoft Fabric/Power BI, AI-readiness och datakvalitet behöver hänga ihop. | ✓/~ | H | S1, S2
Drift och övervakning | Relevant för kunder som behöver förvaltning, integrationsövervakning, support och kontinuerlig vidareutveckling efter go-live. Exakt modell bör kontrolleras. | ✓/~ | M | S2
Integrationskompetens | Mycket stark matchningssignal i större ERP- och Microsoft-plattformsprojekt där integrationsförmåga är avgörande för helheten. | ~ | H | S1, S2, S6
Område | Bedömning för Fellowmind | Verif. | Konf. | Källa
Organisation | Fellowmind är en europeisk Microsoft-partner med svensk närvaro och bred Business Applications-portfölj. | ✓/~ | H | S1, S2
Marknadsposition | Bred Microsoft- och Dynamics 365-partner för kunder som vill kombinera affärssystem, kundprocesser, data, AI och Modern Work. | ~ | H | S1, S2, S5
Storlekskategori | Relevant för växande företag, midmarket, övre midmarket och enterprise beroende på produktområde och scope. | ~ | H | S1, S2, S5
Finansiell information | Detaljerad finansiell analys ingår inte i detta underlag och bör inte användas i publik partnerprofil utan separat kontroll. | ? | L/M | S5
Område | Bedömning | Verif. | Konf. | Källa
Thought leadership | Relativt hög. Fellowmind publicerar insikter, nyheter och material kring Microsoft-plattformen, Dynamics 365, AI, data och verksamhetsutveckling. | ✓/~ | H | S1, S3, S4
Webbinarier/events | Hög aktivitet relativt många ERP-partners. Events och webbinarier stärker bedömningen av aktiv marknadsnärvaro. | ✓ | H | S1, S3
Kundcase | Många kundcase listas. De behöver klassas per produktområde före publik d365.se-profil. | ✓ | H | S1, S3
Bloggar/insikter | Aktiv kommunikation med praktiska tips och expertis. | ✓ | H | S1, S3
AI-kommunikation | Tydlig och relativt konkret kring AI-agenter, Copilot, supply chain och data. | ✓/~ | H | S1, S3
ERP-kommunikation | Mycket stark. ERP, Dynamics 365, implementation, förvaltning och integration är återkommande teman. | ✓/~ | H | S1, S3
Aktivitetstakt | Hög. Flera teman och format: nyheter, events, webbinarier, kundcase och insikter. | ✓/~ | H | S1, S3
Taggkategori | Taggar
Huvudproduktområden | Business Central: high active; Finance & Supply Chain Management: high active; Sales & Customer Insights: high active; CE/CRM broad: medium editorial; Customer Service/Field Service/Contact Center: not active in partner update
Tillvalsprodukter och plattformar | Power Platform, Microsoft Fabric, Power BI, Microsoft 365, Azure Integration Services, Copilot, Hive AI, AI Agents, Managed Services
ISV-lösningar | BC-addon-verification-required, isv-authorized-only, verify-per-addon
Branscher | Tillverkning, Distribution/Grossist, Retail/e-handel, Serviceorganisationer, Konsult-/tjänstebolag, Life Science/Medtech
Kompetenser | Business Central, Finance & Supply Chain, Sales, Customer Insights, CRM, Kunddata, Data & AI, Power Platform, Integration, Copilot, Hive AI, Managed Services
Kundstorlek | Growing Business, Midmarket, Upper Midmarket, Enterprise
Projektstorlek | Business Central Project, ERP Transformation, F&SCM Project, Sales/Customer Insights Project, Integration-heavy Project, Data/AI Foundation Project, Managed Services
Geografi | Sweden, Nordic, Europe, local_presence, european_delivery
Negativa matchningstaggar | Very Small Low Complexity Project, Lowest-price Project, Specific ISV Unverified, Public Competitor Analysis Prohibited
Område | Intern bedömning
Primära konkurrenter | Andra breda Microsoft- och Dynamics 365-partners med kapacitet inom Business Central, F&SCM, CE/CRM, Data & AI och Power Platform.
Konkurrensfördelar | Bred Microsoft-plattform, stark europeisk närvaro, svensk lokal förankring, Business Applications, Data & AI, Hive AI och Managed Services.
Där andra kan vara starkare | Mycket små lokala boutiqueprojekt, strikt prisdrivna minimiprojekt eller specifika BC-tillägg där annan partner har verifierad ISV-auktorisation.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av publika partnerkort.
Senast granskad | Ej angivet | Fylls i vid nästa manuell genomgång.
Granskad av | d365.se redaktion | Intern redaktionell kontroll.
Partnerkontakt | Ej verifierad | Fylls i när kontaktväg finns i befintlig d365.se-profil, partnerinlämnat material eller annan tillförlitlig källa.
Partnerbekräftad datum | Ej bekräftad | Används vid behov för uppgifter som är nya, osäkra eller särskilt viktiga, till exempel ISV-relationer, Microsoft-statusar, referenser och kontaktpersoner.
Nästa verifieringsdatum | Rekommenderas kvartalsvis eller inför profilpublicering | Särskilt viktigt när AI-, Copilot-, agent- och ISV-uppgifter förändras snabbt.
Publiceringsstatus | Ej klar för publik publicering | Publik kortbeskrivning finns som redaktionellt utkast och kan användas efter d365.se:s normala kontroll av källor, partnerinlämnat material och interna publiceringsprinciper.
Källa | Typ | Beskrivning | Användning
S1 | d365.se partnerprofil | Fellowminds befintliga partnerprofil på d365.se, inklusive Business Central, F&SCM, CE/CRM, kontaktpersoner, branscher och geografisk information. | Utgångspunkt för befintlig publik profil, kontaktpersoner, filter och tidigare d365.se-positionering.
S2 | Officiell Fellowmind-webb | Fellowminds egna sidor om Business Applications, Business Central, Finance & Supply Chain, Customer Engagement, Power Platform, Data & Analytics och Modern Work. | Verifiering av erbjudande, produktområden, plattformsbredd och kundnytta.
S3 | Fellowmind nyheter, karriär och lösningssidor | Publika nyheter, lösningar, karriärsidor och jobbinformation som visar aktiv kompetens inom BC, F&SCM, CE/CRM, Data & AI och integration. | Bedömning av kapacitet, kompetensområden, AI-mognad, events, kundcase och rekryteringsfokus.
S4 | AI/Hive AI och pressmaterial | Publikt material om Hive AI, AI Solutions, Azure OpenAI, Copilot, agenter och Connected Company. | Bedömning av AI-, Copilot- och agentprofil.
S5 | d365.se redaktionell bedömning | d365.se:s egen taxonomi, partnerkategorisering, matchningslogik och verifieringskrav. | Filterbeslut, negativa matchningssignaler, ISV-avgränsning och publiceringslager.
S6 | Partnerbekräftelse | Direkt återkoppling från Fellowmind. | Används vid behov för uppgifter som är nya, osäkra eller särskilt viktiga, exempelvis ISV-relationer, referenser, kontaktpersoner och Microsoft-statusar.
S7 | Fellowmind partneruppdatering | Partnerinlämnade uppgifter från d365.se:s partner-update-formulär: företagsbeskrivning, kontaktperson, kontorsstäder, aktiva produktområden, produkttexter, branschpitchar, events, beslutsprofil och mindre-lämplig-för. | Prioriterad källa för publik partnerprofil, partnerkort, kontaktväg, produktfilter, branscher och AI-/matchningslogik. Vissa AI-fält är ännu inte ifyllda och bör kompletteras.$txt$, source_document_filename = 'Fellowmind_ai_partnerunderlag_d365_v1_lovable-2.docx', source_document_updated_at = now() WHERE slug = 'fellowmind';
UPDATE public.partners SET source_document_text = $txt$Adbriq
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
AI-metadata för maskinell tolkning
partner_id: adbriq
partner_name: Adbriq
legal_entity: adbriq AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_only_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_primary_product_groups:
    business_central: very_high_primary
  active_vertical_solutions:
    trimit_fashion: very_high_primary
    bisting: very_high_primary_own_ip
  related_editorial_product_groups:
    integration: very_high_adjacent
    data_warehouse_reporting: medium_adjacent
    ecommerce_wms: high_adjacent
  not_verified_as_active_product_groups:
    finance_supply_chain_management: do_not_show_as_active
    ce_crm_broad: do_not_show_as_active_without_partner_confirmation
    customer_service_field_service_contact_center: do_not_show_as_active_without_partner_confirmation
    commerce: do_not_show_as_active_without_partner_confirmation
    human_resources: do_not_show_as_active
    project_operations: do_not_show_as_active
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: false
  show_under_ce_crm: false_unless_partner_confirms
  show_under_commerce: false_unless_partner_confirms
  show_under_ai: weak_adjacent_signal
  show_under_data_analytics: medium_adjacent_signal
  show_under_integration: true_strong_adjacent
  show_under_isv_filters: only_if_specific_isv_or_own_ip_verified
isv_scope:
  verified_or_strongly_supported:
    - trimit_fashion
    - bisting
    - ongoing_wms_integration_via_bisting
    - madden_analytics_integration
  possible_or_requires_verification:
    - logtrade
    - continia
    - signup_exflow
    - golden_edi
    - tasklet_factory
market_arena:
  primary: vertical_business_central_ip_integration
  secondary:
    - fashion_sport_textile
    - ecommerce_lager_wms
    - business_central_midmarket
comparison_group:
  primary:
    - BrightCom
    - Navcite
    - NAB Solutions
    - Goodfellows
    - Update
    - 4PS
    - TRIMIT-oriented BC partners
  adjacent:
    - Fellowmind
    - COSMO CONSULT
    - Evidi
    - InBiz
  lower_relevance:
    - enterprise_fscm_specialists
    - pure_crm_specialists
    - global_sis
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter ska endast visa Adbriq under specifika Business Central-tillägg där relationen är verifierad av ISV, partner, kundcase eller annan dokumenterad källa. Generell Business Central-kompetens räcker inte. För Adbriq är TRIMIT Fashion, bisting, Ongoing WMS-integration via bisting och Madden Analytics-integration starkast verifierade. Continia, SignUp ExFlow och Golden EDI ska inte visas som verifierade förrän relationen är bekräftad.
5. Filterbeslut för d365.se
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  adbriq_bc_addon_status:
    trimit_fashion: strong_verified
    bisting: own_ip_verified
    ongoing_wms_integration: verified_integration
    madden_analytics: verified_integration_partner
    logtrade: possible_requires_verification
    continia: not_verified
    signup_exflow: not_verified
    golden_edi: not_verified
  do_not_infer_authorization_for_other_addons: true
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Mode-, sport-, textil- och varumärkesbolag som behöver modernisera från NAV/Navision eller annan äldre ERP-miljö till Business Central. [✓/~ H, S2/S4]
Kunder med många varianter, kollektioner, storlekar, färger, säsonger, PDM-behov och produktdataflöden. [✓ H, S2]
Företag med e-handel, B2B/B2C, lager, WMS, orderflöden och behov av integration mellan Business Central och nischade spetssystem. [✓/~ H, S2/S7]
Kunder som vill ha en paketerad och branschspecifik BC-lösning snarare än ett helt skräddarsytt ERP-projekt. [✓ H, S2]
Bolag som vill kombinera BC med TRIMIT Fashion, bisting, integrationer, datalager/datawarehouse och framtida planering/prognos. [✓/~ H, S2/S6]
Kunder som värderar djup branschkunskap och långsiktig vidareutveckling högre än stor konsultvolym. [✓/~ H, S3/S4]
8. Mindre lämplig för
Större enterprise-kunder som söker Dynamics 365 Finance & Supply Chain Management som huvudplattform. [~ H, S1/S2]
Organisationer som primärt söker CRM/Customer Engagement, Contact Center, Field Service, HR eller Project Operations. [~ H, S2]
Kunder utan tydligt behov av fashion/sport/textil, e-handel/lager, varianthantering eller integrationsnära BC-lösning. [~ M/H, S2]
Mycket stora globala transformationsprogram där governance, global SI-kapacitet och många parallella team är viktigast. [~ M, S1]
Projekt där lägsta pris är viktigare än branschkunskap, standardpaketering och långsiktig vidareutveckling. [~ M, S1/S2]
Kunder som kräver verifierad auktorisation för specifika BC-tillägg där Adbriq inte är dokumenterat som partner. [~ H, S2/S7]
9. AI Matchningsregler
negative_match_rules:
  fscm_enterprise_project: low_priority
  pure_ce_crm_project: low_priority
  contact_center_or_field_service_as_core: avoid_without_partner_confirmation
  lowest_price_standard_bc_project: medium_low_priority
  specific_bc_addon_without_verification: avoid
  unclear_product_scope: require_clarification
match_confidence:
  high: bc_plus_fashion_sport_textile_plus_integration
  medium: bc_project_with_some_trade_or_lager_complexity
  low: generic_bc_or_non_bc_project_without_vertical_fit
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Fashionbolag som växer ur NAV/Navision
Ett mode- eller sportvarumärke har äldre ERP/NAV, många varianter och växande e-handel. Adbriq är stark kandidat när kunden vill till Business Central med TRIMIT Fashion och branschprocesser för PDM, inköp, order och logistik.
Scenario 2 - Lager- och e-handelsdrivet varumärkesbolag
Kunden behöver koppla Business Central till WMS, e-handel, orderflöden, prognoser och tredjepartssystem. Adbriq passar när integration och datarörelser är lika viktiga som själva ERP-systemet.
Scenario 3 - Flerbolag och datalager inom växande handelskoncern
Kunden har flera juridiska enheter och behöver konsolidera data, flöden och rapportering. bisting gör Adbriq relevant när integration, flerbolag och datawarehouse är centrala behov.
Scenario 4 - Datadriven inköps- och lagerplanering
Kunden vill stärka prognos, replenishment och inköpsplanering i en sortimentsintensiv verksamhet. Madden Analytics-kopplingen gör Adbriq relevant där BC-data ska användas för mer avancerad planering.
Scenario 5 - Befintlig BC/TRIMIT-kund som behöver vidareutveckling
Kunden har redan BC/TRIMIT eller närliggande miljö och behöver support, förädling, nya integrationer eller vidareutveckling. Adbriq passar när långsiktig branschnära förvaltning är viktig.
12. Dynamics 365-erbjudande
Huvudproduktområden i d365.se:s taxonomi är BC, F&SCM och CE/CRM. Tillvalsprodukter som Commerce, HR och Project Operations hanteras som separata filterfält. Max tre branscher per produktområde används för att undvika övermatchning.
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
16. Integration
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
19. Marknadskommunikation
20. Standardiserade taggar
21. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: tydligare fashion/sport/textil- och TRIMIT-position samt egen bisting-produkt.
Mot CRM-specialister: starkare ERP-, lager-, produktdata- och transaktionsflödesförankring.
Mot globala systemintegratörer: mer nischad, snabbare och närmare branschprocesserna, men med lägre global leveransskala.
Mot traditionella ERP-konsulter: mer paketerad BC/TRIMIT/bisting-modell och tydligare integrations-/branschlogik.
22. Kundorienterad partnerbeskrivning
Adbriq är en nischad svensk Microsoft Dynamics 365 Business Central-partner med särskild tyngd inom fashion, sport, textil, profilprodukter, e-handel och lagerintensiva varumärkesbolag. Partnern är mest relevant för kunder som inte bara söker ett generellt affärssystem, utan en branschspecifik lösning där produktdata, varianter, kollektioner, order, inköp, lager, logistik och e-handelsflöden behöver fungera tillsammans.
Erbjudandet bygger på kombinationen av Microsoft Dynamics 365 Business Central, TRIMIT Fashion och Adbriqs egen bisting-produkt. Det gör Adbriq särskilt intressant för företag som vill modernisera från Navision/NAV eller andra äldre system till en molnbaserad Business Central-miljö med branschprocesser och integrationer redan från start. Publika kundcase visar en stark koncentration mot svenska varumärkes- och handelsbolag, till exempel inom mode, sport och golfkläder.
För en Dynamics 365-kund är Adbriq framför allt ett bra val när branschkunskap, varianthantering, lagerflöden, WMS/e-handel, flerbolag och integrationsbehov är viktigare än stor konsultvolym. Adbriq bör däremot inte i första hand positioneras för breda F&SCM-projekt, fristående CRM-program eller globala enterprise-transformationer där en större Microsoft- eller systemintegrationspartner normalt passar bättre.
23. AI-sammanfattning
24. Varför denna partner
✓ Kunden söker Business Central som ERP-plattform.
✓ Kunden verkar inom fashion, sport, textil, profilprodukter, retail/e-handel eller lagerintensiv varumärkeshandel.
✓ Kunden behöver TRIMIT Fashion, PDM, varianthantering, kollektioner eller produktdataflöden.
✓ Kunden har integrationsbehov mot WMS, e-handel, forecasting/replenishment eller andra spetssystem.
✓ Kunden vill ha branschpaketering och beprövade processer snarare än ett helt generiskt BC-projekt.
✓ Kunden vill ha en mindre specialistpartner med djup nischkunskap och långsiktig vidareutveckling.
25. Verifiering före publicering
Bekräfta exakt publik partnerbeskrivning och kontaktperson för d365.se.
Bekräfta att Business Central är aktivt huvudområde och vilka branscher som ska vara max tre prioriterade filter.
Bekräfta om Adbriq vill listas under TRIMIT Fashion, bisting och specifika Business Central-tillägg på d365.se.
Verifiera ISV-relationer: TRIMIT, Ongoing WMS, Madden Analytics, Logtrade, Continia, ExFlow, Golden EDI, Tasklet Factory och andra eventuella tillägg.
Verifiera om Power BI, Power Platform, AI/Copilot, Copilot Studio eller Fabric ska anges som aktiva kompetensområden eller endast som angränsande signaler.
Bekräfta om Adbriq erbjuder någon form av CE/CRM, Commerce eller andra Dynamics 365-tillvalsprodukter. Visa inte publikt innan verifiering.
Bekräfta geografisk leveranskapacitet: Sverige, Norden, internationellt och vilka språk/leveransmodeller som stöds.
Verifiera Microsoft-statusar, partnerdesignationer och eventuella certifieringar innan publik användning.
Bekräfta vilka kundcase som får användas i d365.se-text och vilka som endast får användas internt.
Kontrollera om bolagsdata 2025 ska visas publikt eller endast användas internt som storlekskategori.
25A. Kontrollworkflow och statusfält
26. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Adbriq / adbriq AB | ✓ | H | S1, S5
Juridisk enhet | adbriq AB, org.nr 559163-1279. Registrerat 2018-06-21. Säte/adress i Borås. Ingår i koncern med adbriq Group AB som moderbolag enligt Allabolag. | ✓ | H | S5
Partnertyp och egen beskrivning | Vertikal Business Central-specialist med tydlig nisch inom fashion, sport, textil, e-handel/lager och integrationsflöden. Erbjudandet kombinerar Microsoft Dynamics 365 Business Central, TRIMIT Fashion och egen applikation/plattform bisting. | ✓/~ | H | S1, S2, S3
Primära produktområden | Business Central som kärnområde. TRIMIT Fashion och bisting är centrala komponenter i den vertikala lösningen. | ✓ | H | S2, S3
Sekundära produktområden | Integration, datalager/datawarehouse via bisting, PDM, försäljning, inköp, logistik, e-handel/lager och rapportering. Power BI/Data & Analytics är relevanta som angränsande matchningslogik men inte verifierade som fristående erbjudande. | ✓/~ | M/H | S2, S4, S7
Områden som inte verifierats | F&SCM, fristående CE/CRM, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations som aktiva Dynamics 365-filter. D365 Commerce ska inte antas bara för att kunderna verkar inom e-handel. | ?/~ | H | S1, S2
Typisk kundstorlek | Mindre till medelstora och växande varumärkes-/handelsbolag. Särskilt relevant när kundens komplexitet kommer från varianter, kollektioner, lager, kanaler och internationalisering snarare än stor koncernskala. | ~ | H | S2, S4, S7
Typisk projektstorlek | Små till medelstora BC-projekt med tydlig branschstandard, men kan bli medelstora vid många integrationer, flerbolag, PDM, WMS/e-handel och internationella handelsflöden. | ~ | M/H | S2, S4, S6, S7
Geografisk leveranskapacitet | Svensk/Borås-baserad nischpartner med kunder och case i Sverige och internationell försäljning hos kundbolag. Leverans utanför Sverige bör verifieras per projekt. | ✓/~ | M | S2, S4, S5
Branschfokus | Fashion, sport, textil/profilprodukter och e-handel/lager. Referenslistan omfattar bland annat Salming, Filippa K, Kids Brand Store, Oscar Jacobson, Holebrook, Båstadgruppen och Galvin Green. | ✓ | H | S1, S4
AI-mognad | Låg till medel som verifierad AI-profil. Ingen tydlig publik Copilot-/agentposition har identifierats. AI-matchning bör främst kopplas till Business Central/Copilot-standard, datakvalitet, rapportering, prognos/planering och integrationsdata. | ~ | M | S2, S6
Förvaltningskapacitet | Stark inom den egna BC/TRIMIT/bisting-miljön. Adbriq beskriver stöd från behovsanalys och rådgivning till genomförande, support, förädling och vidareutveckling. | ✓ | H | S3
Internationell leveransförmåga | Medel. Kunder kan ha internationella flöden och global försäljning, men Adbriqs egen organisatoriska leveransskala är mindre än större nordiska/europeiska partners. | ~ | M | S4, S5
Transformationskapacitet | Hög inom digitalisering av informationsflöden och affärsprocesser för fashion/sport/textil. Lägre verifiering för bred enterprise-transformation utanför nischen. | ✓/~ | H | S2, S3, S7
Unika särskiljande egenskaper | Tydlig vertikal BC-nisch, TRIMIT Fashion-kompetens, egen bisting-produkt, färdiga briq-paket, stark casebas inom mode/sport/textil och verifierade integrationskopplingar till Ongoing WMS och Madden Analytics. | ✓/~ | H | S2, S4, S6, S7
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas när uppgiften bygger på Adbriqs egen webb, bolagsdata, verifierade kundcase, d365.se-profil eller partnerbekräftelse.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, relativ position, marknadsarena och styrkeprofil. | Får inte visas som direkt kundtext utan redaktionell omformulering.
Kräver extra kontroll | Kontaktpersoner, Microsoft-statusar, ISV-auktorisationer, exakta produktområden och referenser. | Verifieras före publik exponering eller stark matchningsvikt.
Ej publik användning | Osäkra slutsatser, negativa jämförelser och investerings-/M&A-bedömningar. | Endast bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Adbriq profilerar sig tydligt kring Dynamics 365 Business Central och kombinerar BC med TRIMIT Fashion och bisting.
Finance & SCM-fokus | 1/5 | H | Ingen verifierad aktiv F&SCM-position i öppna källor. Ska inte visas som aktivt huvudfilter.
CE/CRM-fokus | 1/5 | M/H | Ingen verifierad fristående Dynamics 365 CE/CRM-position. Kund- och orderflöden förekommer som del av ERP/e-handel/lager.
AI / Copilot / Agents | 2/5 | M | AI bör matchas försiktigt. Inga tydliga publika Copilot Studio-/agentcase identifierade; AI-koppling via BC/Copilot, prognosdata och datakvalitet.
Data & Analytics | 3/5 | M/H | bisting möjliggör datalager/datawarehouse och integrationsflöden. Madden Analytics-kopplingen stärker prognos-/planeringssignalen.
Integration | 5/5 | H | bisting är uttryckligen ett tillägg för integrationer, flerbolagshantering och datalager. Ongoing WMS och Madden Analytics visar konkret integrationsposition.
Business Transformation | 3/5 | M/H | Stark inom verksamhetsdigitalisering för fashion/sport/textil. Inte verifierad som bred transformation utanför nischen.
Strategisk rådgivning | 3/5 | M/H | Adbriq beskriver stöd från behovsanalys och rådgivning till genomförande och vidareutveckling.
Förvaltning / Managed Services | 4/5 | H | Support, förädling och vidareutveckling är del av erbjudandet; särskilt starkt i egen lösningsmiljö.
Branschspecialisering | 5/5 | H | Mycket tydlig nisch inom fashion, sport, textil/profilprodukter och e-handel/lager.
Internationell leverans | 2/5 | M | Kundernas försäljning kan vara internationell men Adbriq är en mindre svensk aktör; leverans utanför Sverige bör verifieras.
SMB-fokus | 4/5 | M/H | Relevant för mindre och medelstora varumärkes-/handelsbolag med tydliga processbehov.
Enterprise-fokus | 2/5 | M | Kan passa större nischade fashion-/sportbolag men inte generell enterprise-/global ERP-transformation.
Standardisering | 5/5 | H | briq-paket, TRIMIT och standardiserade processer ger stark paketeringssignal.
Innovation | 4/5 | M/H | Egen IP och integrationspartnerskap visar innovationsförmåga inom nischade BC-flöden.
Leveransbredd | 3/5 | M | Djup nischbredd runt BC/fashion/integration, men låg bredd över hela D365-portföljen.
Partner-DNA typ: Vertikal Business Central-, fashion-/sport-/textil- och integrationspartner. Tolkning: Adbriq bör matchas när kunden söker branschnära Business Central med TRIMIT, lager/e-handel, varianthantering, PDM, integrationer och vidareutveckling - inte när kunden söker bred F&SCM, CE/CRM eller global SI-leverans.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Vertikal Business Central-partner för fashion, sport, textil, e-handel/lager och varumärkesbolag, med TRIMIT Fashion och bisting som särskiljande lösningskomponenter. | ~ | H | S1, S2, S4
Tydlig köparnytta | Kunden får en partner som kan kombinera Business Central med branschprocesser, PDM/varianter, order, inköp, logistik, integrationer, WMS/e-handel och datalager i en paketerad lösning. | ~ | H | S2, S3, S7
Matchningslogik | Prioriteras när kunden är ett växande mode-, sport-, textil- eller varumärkesbolag med behov av BC, TRIMIT, lager/logistik, e-handel, flerbolag, integrationer eller datadriven planering. | ~ | H | S2, S4, S6, S7
Positioneringsgränser | Ska inte matchas högt när kunden söker F&SCM, bred CE/CRM, Contact Center, HR, Project Operations, global SI, lägsta pris eller generell BC utan branschnära behov. | ~ | H | S1, S2
Filterområde | Beslut för Adbriq | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Kärnerbjudande och tydlig matchning mot SMB/midmarket med branschbehov.
F&SCM | Visa inte som aktiv partner. | Ingen/negativ | ? | Ingen verifierad F&SCM-position.
CE/CRM | Visa inte som aktiv CE/CRM-partner. | Låg | ? | Kund- och orderflöden kan finnas i BC-/e-handelslandskapet men inte fristående CE/CRM.
Commerce | Visa inte som D365 Commerce utan verifiering. | Låg | ? | E-handel är relevant bransch-/processsignal, men D365 Commerce är inte verifierat.
Data & Analytics | Visa som kompletterande signal. | Medel | ✓/~ | bisting datalager/datawarehouse och Madden Analytics stärker analys-/planeringssignalen.
Power Platform / AI | Visa som svag/kompletterande signal. | Låg/medel | ~ | AI bör främst vara kopplat till BC, datakvalitet, prognos och integration - inte stark Copilot Studio-/agentmatchning utan verifiering.
Integration | Visa som stark kompletterande signal. | Mycket hög | ✓ | bisting, Ongoing WMS och Madden Analytics är centrala i erbjudandet.
ISV-lösningar | Visa per verifierad lösning. | Endast verifierad | ✓/? | TRIMIT och bisting starka. Ongoing/Madden verifierade integrationsrelationer. Övriga ISV kräver kontroll.
Fält | Värde för Adbriq | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Vertikal Business Central/IP-/integrationspartner | Använd när kunden söker BC med branschlogik, egen IP, TRIMIT, lager/e-handel och integrationsflöden. | H | S1, S2
Sekundära arenor | Fashion/sport/textil, e-handel/lager, WMS, varianthantering, PDM, datalager och replenishment/prognos | Använd som kompletterande logik vid varumärkesbolag med komplexa sortiment, kanaler och lagerflöden. | H | S2, S4, S6, S7
Partnerkategori | Nischad svensk Business Central-specialist med egen IP och TRIMIT-kompetens | Skiljer Adbriq från generella BC-partners, F&SCM-specialister och breda Microsoft-konsulter. | H | S1, S2, S5
Primär jämförelsegrupp | BrightCom, Navcite, NAB Solutions, Goodfellows, Update, 4PS, TRIMIT-/fashionorienterade BC-partners | Använd vid jämförelser inom BC, vertikal IP, e-handel, lager och branschlösningar. | M/H | S1
Lägre relevans i jämförelse | Enterprise F&SCM-partners, globala SI:er, renodlade CRM-/CE-specialister, redovisningsnära IT-kanaler | Använd som lägre jämförelse när kundens behov ligger utanför Adbriqs nisch. | M | S1
Fakta | Värde | Verif. | Konf. | Källa
Partner | Adbriq / adbriq AB | ✓ | H | S5
Juridisk enhet | adbriq AB | ✓ | H | S5
Organisationsnummer | 559163-1279 | ✓ | H | S5
Registreringsdatum / grundat år | Registreringsdatum 2018-06-21; registreringsår 2018. | ✓ | H | S5
Huvudkontor / säte | Borås, Bryggaregatan 19 enligt Allabolag. | ✓ | H | S5
Ägarstruktur | Ingår i koncern. Moderbolag: adbriq Group AB enligt Allabolag. | ✓ | H | S5
Omsättning | 33 070 KSEK 2025 enligt Bolagsfakta/Allabolag. | ✓ | H | S5
Resultat | Rörelseresultat 7 141 KSEK 2025; årets resultat 5 611 KSEK enligt Bolagsfakta/Allabolag. | ✓ | H | S5
Antal anställda | 20 anställda 2025 enligt Bolagsfakta/Allabolag. | ✓ | H | S5
Geografisk närvaro | Säte i Borås. Kundcase med svenska varumärkesbolag med ofta internationella kanaler/försäljning. | ✓/~ | M/H | S4, S5
Viktiga erbjudanden | Business Central, TRIMIT Fashion, bisting, briq-paket, integrationer, flerbolag, datalager/datawarehouse, Ongoing WMS- och Madden Analytics-kopplingar. | ✓/~ | H | S2, S6, S7
Storlekskategori | Mindre specialistpartner/nischad BC- och integrationsaktör. | ~ | H | S1, S5
Prioritera Adbriq när | Signalstyrka | Konfidens
Kunden söker Business Central och är verksam inom fashion, sport, textil, profilprodukter, retail/e-handel eller varumärkeshandel. | Mycket stark | H
Behovet omfattar TRIMIT Fashion, PDM, varianthantering, kollektioner, lager, order, inköp och logistik. | Mycket stark | H
Projektet innehåller integrationer, flerbolag, datalager/datawarehouse, Ongoing WMS eller andra lager-/e-handelsnära system. | Mycket stark | H
Kunden vill ha en paketerad och branschspecifik lösning med beprövade processer snarare än generisk BC-konfiguration. | Stark | H
Kunden vill utveckla forecasting/replenishment eller dataunderlag ovanpå Business Central och passar Madden Analytics-kopplingen. | Stark | M/H
Kunden är mindre/mellanstor och vill ha hög branschnärhet och senior nischkompetens snarare än stor SI-organisation. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Kunden söker F&SCM, global ERP-rollout eller mycket stora transformationsprogram. | Stark nedviktning | H
Kunden söker fristående CE/CRM, Contact Center, Field Service, HR eller Project Operations. | Stark nedviktning | H
Kunden saknar bransch-/integrationsbehov och vill enbart ha standard-BC till lägsta pris. | Medel nedviktning | M
Kunden kräver specifik tredjeparts-ISV där Adbriq inte är verifierad. | Stark nedviktning | H
Produktområde, kontaktväg eller auktorisation är oklart. | Kräver förtydligande | H
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 4 | Stark ERP inom BC och vertikal fashion/sport/textil. Inte bred ERP över F&SCM. | ✓/~ | H | S2
Business Central | 5 | Kärnerbjudande och central plattform i Adbriqs lösning. | ✓ | H | S2, S3
Finance & SCM | 1 | Ingen verifierad aktiv F&SCM-position. | ?/~ | H | S1, S2
CRM | 1 | Ingen verifierad fristående D365 CRM-position. | ? | M/H | S2
Customer Engagement | 1 | CE/CRM bör inte aktiveras som huvudfilter. | ? | M/H | S2
AI/Copilot | 2 | AI främst indirekt via BC/Copilot-standard, data, prognos och integration; konkreta agentprojekt saknas offentligt. | ~ | M | S2, S6
Data & Analytics | 3 | bisting omfattar datalager/datawarehouse och Madden Analytics ger planeringssignal. | ✓/~ | M/H | S2, S6
Power Platform | 2 | Inte tydligt verifierat som fristående erbjudande. Kan vara angränsande i BC-flöden. | ?/~ | M | S2
Integration | 5 | bisting, Ongoing WMS och Madden Analytics ger stark integrationsprofil. | ✓ | H | S2, S6, S7
Business Transformation | 3 | Stark inom nischad digitalisering av mode/sport/textil, men inte bred enterprise-transformation. | ✓/~ | M/H | S3, S4
Strategisk rådgivning | 3 | Behovsanalys, rådgivning och metodiskt arbetssätt framgår i egen beskrivning. | ✓/~ | M/H | S2, S3
Förvaltning | 4 | Support, förädling och vidareutveckling är del av kedjan. | ✓ | H | S3
Managed Services | 3 | Förvaltningsnära kapacitet verifierad, men formell managed services-modell bör bekräftas. | ~ | M | S3
Internationell leverans | 2 | Kunder har ofta internationella kanaler, men Adbriqs egen leveransskala är mindre. | ~ | M | S4, S5
SMB | 4 | Relevant för mindre och medelstora varumärkes-/handelsbolag med tydlig processkomplexitet. | ~ | M/H | S2, S4
Enterprise | 2 | Inte optimal för bred enterprise utanför nischen. | ~ | M | S1, S5
Produktområde | Roll | Max 3 branscher | Kundnytta | Verif. | Kommentar
Business Central | Kärnområde | Fashion/sport/textil; retail/e-handel; grossist/distribution | Affärssystem för ekonomi, order, inköp, lager, logistik och rapportering i växande handels- och varumärkesbolag. | ✓ | Primärt filter.
TRIMIT Fashion | Vertikal ISV/solution | Fashion; sport; textil/profilprodukter | Stöd för varianter, PDM, kollektioner, produktdata och fashion-specifika processer ovanpå BC. | ✓ | Stark vertikal signal.
bisting | Egen IP / integration och data | Fashion/sport/textil; e-handel/lager; flerbolag | Integrationer, flerbolagshantering och datalager/datawarehouse i BC-nära landskap. | ✓ | Unik differentierare.
F&SCM | Ej aktivt område | Ej verifierad | Inte verifierad som erbjudande. | ? | Visa inte i filter.
CE/CRM | Ej aktivt område | Ej verifierad | Inte verifierad som fristående D365 CE/CRM-erbjudande. | ? | Visa inte i filter.
Commerce | Ej verifierat tillval | Retail/e-handel endast som processsignal | E-handel är relevant processområde men D365 Commerce är inte verifierat. | ? | Kräver partnerbekräftelse.
HR / Project Operations | Ej verifierat | Ej verifierad | Ingen matchningsgrund i nuvarande underlag. | ? | Visa inte i filter.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Fashion / mode | Kärnbransch | Mycket hög | Starkaste nisch. Case: Filippa K, Oscar Jacobson, Holebrook, House of SAKI m.fl. | Publika case
Sport / lifestyle | Kärnbransch | Mycket hög | Case och budskap mot sport-/lifestylebolag. Salming, Casall, Galvin Green och liknande referenser stärker nischen. | Publika case / externa källor
Textil / profilprodukter | Kärnbransch | Hög | Intern marknadskontext och egen positionering pekar mot textil/profilprodukter och varumärkesflöden. | Intern marknadskontext / web
Retail / e-handel | Sekundär bransch | Hög | Relevans när kundens e-handel, kanaler och lagerflöden är nära kopplade till BC/varianter. | Publika case
Grossist / distribution | Sekundär bransch | Medel/hög | Relevant när grossist-/lagerlogik kombineras med fashion/sport/textil. | d365.se-/marknadskontext
Tillverkning | Ej verifierad som huvudbransch | Låg/medel | Kan förekomma som enklare produktions-/inköpsflöde, men inte bekräftad som huvudposition. | Kräver verifiering
AI-fält | Bedömning | Status
AI-mognad | Försiktig redaktionell bedömning: låg till medel. AI ska inte vara primär matchningssignal utan partnerbekräftad AI-profil. | ~
AI-readiness | Relevant genom datakvalitet, strukturerade processer, Business Central-data och integrationsflöden. | ~
Copilot | Business Centrals inbyggda Copilot-funktionalitet kan vara relevant, men Adbriq har inte identifierats med tydliga publika Copilot-case. | ?/~
Copilot Studio / Agents | Ej verifierat. Ska inte visas som aktivt AI-agentfilter utan partnerbekräftelse. | ?
Konkreta AI-användningsfall | Prognos, replenishment, inköpsplanering och lageroptimering kan kopplas till Madden Analytics-integrationen. | ✓/~
ERP-nära AI | Medelrelevant när AI bygger på kvalitetssäkrad BC-data, artikel-/variantdata och lager-/försäljningshistorik. | ~
Dataförutsättningar | bisting och integrationsflöden ger starkare datafundament än genomsnittlig liten BC-partner. | ✓/~
Område | Bedömning | Verif. | Konf. | Källa
Data governance | Inte uttryckligt som eget erbjudande. Bör matchas försiktigt och verifieras. | ?/~ | M | S2
Dataplattform / datalager | bisting anges möjliggöra datalager/datawarehouse. | ✓ | H | S2
Power BI | Ej verifierat som tydligt offentligt erbjudande, men rapportering/BI är naturlig angränsning. | ?/~ | M | S2
Microsoft Fabric | Ej verifierat. | ? | H | S2
Datakvalitet | Relevant via standardiserade produkt-, lager- och orderprocesser samt integrationsflöden. | ~ | M/H | S2
Rapportering / analytics | Relevant i BC/bisting/madden-sammanhang, särskilt prognos och inköps-/lagerplanering. | ✓/~ | M/H | S2, S6
AI-grund | Dataflöden och BC-processer ger grund för AI/prognos men bör inte övermatchas som bred AI-plattform. | ~ | M | S6
Integrationsområde | Bedömning | Verif. | Konf. | Källa
Integrationsarkitektur | Stark nischprofil via bisting och BC-nära integrationer. | ✓/~ | H | S2
Middleware / integrationsplattform | bisting fungerar som egen integrations- och dataplattformsnära komponent. | ✓ | H | S2
API:er | Ongoing WMS-dokumentation beskriver adbriqs integration via bisting. Exakta API-mönster bör verifieras tekniskt. | ✓/~ | M/H | S7
EDI | Ej verifierat som kärnerbjudande. Golden EDI/andra EDI-relationer kräver kontroll. | ? | M | S2
Dataintegration | bisting + Madden Analytics/Ongoing ger stark dataintegrationssignal. | ✓/~ | H | S6, S7
Drift och övervakning | Ej tydligt publikt beskrivet. Bör verifieras i managed services-/supportdialog. | ? | M | S3
Integrationskompetens | Mycket stark inom BC, WMS, e-handel, lager och fashion/lifestyle-flöden. | ✓/~ | H | S2, S6, S7
Område | Bedömning | Källa
Omsättning | 33,070 MSEK 2025 enligt Bolagsfakta/Allabolag. | S5
Medarbetare | 20 anställda 2025 enligt Bolagsfakta/Allabolag. | S5
Tillväxt | Omsättningstillväxt 2,3 % mot föregående år enligt Bolagsfakta. Krafman visar 33,057 MSEK 2025, 32,337 MSEK 2024 och 26,110 MSEK 2023. | S5
Lönsamhet | Rörelseresultat 7,141 MSEK och vinstmarginal cirka 21,6/21,7 % i 2025-data. Detta indikerar lönsam nischaktör, men ingen full finansiell due diligence. | S5
Förvärv / ägare | Ingår i koncern med adbriq Group AB som moderbolag. Inga förvärvssignaler inkluderade i detta underlag. | S5
Marknadsposition | Liten men tydligt positionerad vertikal BC-/TRIMIT-/bisting-specialist. Intern marknadsanalys lyfter Adbriq som strategiskt intressant BC/IP- och integrationsnisch. | S1
Storlekskategori | Mindre specialistpartner med hög vertikal spets, inte en bred storskalig Microsoft-partner. | S1, S5
Finansiell stabilitet | Bolagsdata visar lönsamhet och positivt resultat 2025, men bedömningen ska vara neutral och verifieras vid skarpa affärsbeslut. | S5
Milstolpe | Beskrivning | Källa
2018 | adbriq AB registreras 2018-06-21. | S5
NAV/BC-modernisering | Adbriq har flera case där kunder uppgraderar från Navision/NAV till Business Central, ofta med TRIMIT Fashion och bisting. | S4
Vertikal paketering | Företaget bygger lösning kring BC + TRIMIT Fashion + bisting och paketerar erbjudandet i briq-paket. | S2
Casebas inom fashion/sport | Publika case omfattar bland annat Salming, Filippa K, Kids Brand Store, Oscar Jacobson, Holebrook, Båstadgruppen och Galvin Green. | S4
Integrationspartnerskap | Madden Analytics lanserar adbriq som integrationspartner för Business Central; Ongoing WMS beskriver adbriq som teknikpartner/integrationsbyggare. | S6, S7
2025 | Bolaget redovisar cirka 33 MSEK i omsättning och 20 anställda. | S5
Tema | Bedömning | Kommentar
Thought leadership | Medel | Kommunikationen är mer lösnings- och caseorienterad än bred thought leadership.
Webbinarier/events | Ej tydligt verifierat | Ingen stark publik event-/webinarprofil identifierad i aktuellt underlag.
Kundcase | Hög | Adbriq har en tydlig casebank med många relevanta varumärkesbolag.
Bloggar/kunskap | Medel | Webben förklarar lösning, briq-paket och branschprocesser snarare än att driva bred Microsoft-agenda.
AI-kommunikation | Låg | AI/Copilot/agenter verkar inte vara huvudtema i marknadskommunikationen.
ERP-kommunikation | Mycket hög | Business Central, TRIMIT Fashion och bisting är tydlig kärna.
Aktivitetstakt | Medel | Case och partnernyheter finns, men inte lika bred innehållsmotor som större partners.
Taggkategori | Taggar
Produktområden | Business Central; TRIMIT Fashion; bisting; Integration; Datawarehouse; WMS-integration; Madden Analytics; Ongoing WMS
Branscher | Fashion; Sport; Textil; Profilprodukter; Retail/e-handel; Grossist/distribution; Varumärkesbolag
Kompetenser | NAV-till-BC-modernisering; PDM; varianthantering; kollektionshantering; lager; inköp; order; integration; flerbolag; dataflöden; forecasting/replenishment
Kundstorlek | SMB; midmarket; växande varumärkesbolag; mindre handelskoncern
Projektstorlek | small_to_medium_bc; medium_integrated_bc; vertical_bc_project; not_enterprise_fscm
Geografi | Sverige; Borås; Norden_verifiera; internationella_kundfloden_verifiera
Filterstatus | BC_primary; F&SCM_inactive; CE_CRM_inactive; Commerce_process_signal_only; ISV_verified_per_solution_only
Ej avsedd för extern publicering. Avsnittet används för AI-rankning, jämförelsegrupper och redaktionell bedömning.
Konkurrentkategori | Exempel | Adbriqs relativa position
BC-specialister med handel/lager | BrightCom, Goodfellows, Update, InBiz, NAB, Navcite | Adbriq särskiljer sig genom tydligare fashion/sport/textil-nisch, TRIMIT och bisting.
Vertikala ISV-/branschpartners | 4PS, TRIMIT-orienterade partners, branschlösningsaktörer | Adbriq är stark i egen nisch men inte en bred vertikal plattform för alla branscher.
Större Business Applications-partners | Fellowmind, COSMO CONSULT, Evidi, Cepheo | Större partners kan vinna på kapacitet och bredd; Adbriq på nischspets och branschnära standardisering.
F&SCM-/enterprise-specialister | Columbus, BE-terna, Implema, Knowit, CGI | Låg direkt överlapp utom vid handels-/fashionbolag där kunden kan välja mellan BC-nisch och större ERP-program.
CRM-/CE-specialister | CRM-Konsulterna, Releye, Sirocco, B3 Elevate | Endast indirekt konkurrens om kunden söker kunddata/e-handel men inte ERP som kärna.
Adbriq är en nischad Business Central-partner med stark position inom fashion, sport, textil och e-handels-/lagerintensiva varumärkesbolag. Partnern kombinerar Microsoft Dynamics 365 Business Central med TRIMIT Fashion och den egna bisting-produkten för integrationer, flerbolag och datalager/datawarehouse. Adbriq passar bäst för mindre och medelstora företag som behöver modernisera från NAV/Navision eller annat affärssystem till en mer standardiserad och branschspecifik BC-lösning med stöd för produktdata, varianter, kollektioner, inköp, order, lager och WMS/e-handel. Adbriq har starka publika case inom mode och sport, bland annat Salming, Filippa K, Kids Brand Store, Oscar Jacobson, Holebrook, Båstadgruppen och Galvin Green. Partnern bör matchas högt vid BC + fashion/sport/textil + integration. Den bör matchas lägre vid F&SCM, bred CE/CRM, Contact Center, HR, Project Operations eller globala enterpriseprogram där större D365-partners passar bättre.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av partnerkort.
Senast granskad | 2026-07-06 | Automatiskt framtaget underlag; behöver manuell d365.se-granskning.
Partnerbekräftelse | Ej genomförd | Särskilt viktig för ISV, kontaktpersoner, AI, geografisk leverans och Microsoft-statusar.
Publik text redo | Delvis | AI-sammanfattning och kundorienterad text kan användas som utkast efter redaktionell granskning.
Intern konkurrensanalys | Endast intern | Får inte visas i partnerprofil.
Kod | Källa | Användning
S1 | Internt marknads-/partnerunderlag för Dynamics 365 i Sverige, inklusive Adbriq-positionering och jämförelsegrupper. | Marknadsarena, konkurrentgrupp, BC/IP- och integrationsnisch.
S2 | Adbriq: Lösningar - Business Central, TRIMIT Fashion, bisting och briq-paket. | Produktområden, branschlösning, standardprocesser, PDM, försäljning, inköp, logistik, integrationer.
S3 | Adbriq: Om oss. | Rådgivning, genomförande, support, förädling, vidareutveckling, BC/TRIMIT/bisting-kompetens.
S4 | Adbriq: Casearkiv. | Referenser och branschfokus: Holebrook, Filippa K, Kids Brand Store, Oscar Jacobson, House of SAKI, Båstadgruppen, Salming, Galvin Green.
S5 | Bolagsfakta/Allabolag: adbriq AB. | Juridisk enhet, org.nr, registreringsdatum, säte, omsättning, resultat, anställda, koncernrelation.
S6 | Madden Analytics: Adbriq som official integration partner for Business Central. | Prognos/replenishment, Business Central-integration och fashion/lifestyle-position.
S7 | Ongoing WMS: Adbriq som teknikpartner och Business Central/Ongoing-integration via bisting. | WMS-/lagerintegration, integrationskompetens och branschfokus.
S8 | Logtrade: Business Central-integration och partner-/installationskontext. | Möjlig ISV-/tilläggskontroll; ej listad som verifierad Adbriq-relation utan separat bekräftelse.$txt$, source_document_filename = 'adbriq_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'adbriq';
UPDATE public.partners SET source_document_text = $txt$B3 Elevate
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. B3 Elevate bör i nuläget förstås som en CE/CRM-, Power Platform- och AI-orienterad Microsoft Business Applications-partner, inte som en Business Central- eller F&SCM-partner.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter gäller i nuläget främst Business Central-tillägg. B3 Elevate ska därför inte visas under specifika BC-tillägg om inte ISV-auktorisation, partnerinlämnad uppgift eller dokumenterat kundcase finns. Partnerns generella Power Platform-, CRM- eller integrationskompetens räcker inte för att aktivera ett BC-ISV-filter.
5. Filterbeslut för d365.se
Denna sektion styr hur partnern bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut är inte samma sak som fullständig kompetensbedömning; de anger hur starkt partnern bör viktas i matchningslogiken.
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika typer av Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Medelstora och större organisationer som vill modernisera CRM, kunddialog, säljprocesser eller kundservice med Dynamics 365. [✓/~ H, S1/S2]
Medlemsorganisationer som behöver effektivisera relationer, kommunikation, service, marknadsföring eller medlemsdialog. [✓/~ H, S1]
Kunder som vill införa Dynamics 365 Sales, Customer Insights eller Customer Service med AI, Copilot Studio och Power Platform som del av målbilden. [✓/~ H, S1/S2]
Organisationer som vill bygga AI-agenter och automationer direkt i affärs- och kundprocesser snarare än som fristående experiment. [✓/~ H, S1/S2/S5]
Projekt där förändringsledning, kravledning, program-/projektledning, utbildning, migrering och driftsättning är lika viktiga som tekniken. [✓/~ H, S2/S5]
Kunder som behöver Power BI/Fabric/Azure-baserad analysplattform och affärsnära rapportering, särskilt tillsammans med CRM/kunddata. [✓/~ H, S2/S4]
Organisationer som vill ha en svensk specialistpartner men samtidigt kunna nyttja B3-gruppens bredare kompetens inom cybersäkerhet, utveckling och verksamhetsutveckling. [✓/~ M/H, S2]
8. Mindre lämplig för
Kunder som primärt söker Business Central-implementation, NAV-till-BC-migrering eller BC-ISV-tillägg utan CE/CRM-behov. [~ H, S1/S6]
Kunder som primärt söker Dynamics 365 Finance & Supply Chain Management, produktion, logistik eller global ERP-rollout. [~ H, S1/S6]
Mycket små bolag som söker enklast möjliga CRM-konfiguration till lägsta pris utan behov av AI, förändring eller bred Microsoft-plattform. [~ M, S1/S2]
Projekt där kravet är verifierad auktorisation för ett specifikt Business Central-tillägg eller annan ISV-relation som inte finns dokumenterad. [~ H, S6]
Kunder som behöver internationell D365-leverans med lokal närvaro i flera länder och global roll-out-modell. [~ M, S2/S3]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Medlemsorganisation moderniserar medlemsdialog
En medlemsorganisation vill modernisera CRM, kampanjer, serviceärenden och medlemskommunikation. B3 Elevate är relevant när kunddialogen ska kopplas till Dynamics 365 Sales, Customer Insights, Customer Service, Power Platform och AI. Hög matchningskonfidens.
Scenario 2 - Kundserviceorganisation inför AI-agenter
En organisation vill effektivisera ärendehantering och förbättra kundservice genom Copilot Studio-agenter, automatisering och Dynamics 365 Customer Service. B3 Elevate är relevant när AI ska landa i praktiska arbetsflöden och förvaltning.
Scenario 3 - Säljorganisation behöver bättre pipeline och datadrivna insikter
En säljorganisation har låg datakvalitet, otydliga processer och bristande uppföljning. B3 Elevate kan stödja från behovsanalys till Dynamics 365 Sales, Power BI och Copilot-/automationsstöd.
Scenario 4 - Stort kunddialogprogram med migration, utbildning och driftsättning
Kunden behöver projektledning, kravledning, migrering, utbildning, förändringsledning och go-live-stöd för en ny CRM-/kunddialogplattform. B3 Elevate är relevant när verksamhetsförändring och teknisk leverans måste samordnas.
Scenario 5 - Analysplattform som stödjer kund- och verksamhetsbeslut
Organisationen behöver Power BI, Fabric och Azure för prognos, rapportering eller kund-/verksamhetsinsikter. B3 Elevate/B3 är relevant när analysplattformen ska förvaltas och vidareutvecklas över tid.
12. Dynamics 365-erbjudande
12A. Max 3 branscher per produktområde
13. Branschfokus
14. AI, Copilot och Agents
14A. Försiktig redaktionell AI-profil
15. Data & Analytics
16. Integration
17. ISV-lösningar och tillägg
ISV-avsnittet är avsett för AI-filtrering och intern research. För B3 Elevate finns ingen verifierad publik relation till Business Central-tillägg i underlaget. Partnern ska därför inte aktiveras i BC-ISV-filter utan extern/partnerbekräftad källa.
18. Ekonomi, storlek och marknadsposition
19. Historik och utveckling
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: vinner när kundbehovet är CRM, kunddialog, AI och Power Platform - inte när huvudfrågan är ERP/BC.
Mot CRM-specialister: starkare när kunden vill kombinera CRM med AI-agenter, Power Platform, Power BI/Fabric, testautomatisering och B3-gruppens bredare kapacitet.
Mot globala systemintegratörer: kan vara mer fokuserad och snabbfotad i svenska CRM/CE-program, men bör inte positioneras som global SI.
Mot traditionella ERP-konsulter: tydligare kundupplevelse-, service-, sälj- och AI-orientering än ERP-processfokus.
23. Kundorienterad partnerbeskrivning
B3 Elevate är relevant för organisationer som vill utveckla sina kundprocesser med Microsoft Dynamics 365, Power Platform och AI. Partnern är inte främst ett affärssystemshus för Business Central eller Finance & Supply Chain, utan bör förstås som en specialist inom Customer Engagement: försäljning, marknadsföring, kundservice, kunddialog och närliggande AI- och automationslösningar.
För en Dynamics 365-kund blir B3 Elevate särskilt intressant när projektet inte bara handlar om att konfigurera ett CRM-system, utan om att skapa bättre arbetssätt. Partnern beskriver ett erbjudande som sträcker sig från strategi, behovsanalys och kravarbete till utveckling, test, förändringsledning, utbildning, driftsättning och förvaltning. Det gör dem relevanta i projekt där införandet ska få effekt i vardagen och där kunden behöver stöd efter go-live.
AI-profilen är en viktig del av positioneringen. B3 Elevate kommunicerar arbete med Copilot Studio, AI-agenter, Power Platform-automation, Power BI/Fabric och AI-stöd för kundservice och säljprocesser. Detta gör partnern intressant för organisationer som vill börja använda AI i verkliga kund- och verksamhetsprocesser, snarare än som fristående experiment.
B3 Elevate bör matchas högt för medelstora och större svenska organisationer med behov inom CRM, medlems-/kunddialog, sälj, marknadsföring, service, datadriven uppföljning och AI-agenter. Däremot bör partnern matchas lägre när kunden primärt söker Business Central, Finance & Supply Chain Management, global ERP-rollout eller specifika Business Central-tillägg.
24. AI-sammanfattning
25. Varför denna partner
✓ Kunden söker CRM/Customer Engagement snarare än ERP.
✓ Kunden behöver Dynamics 365 Sales, Customer Insights eller Customer Service.
✓ Kunden vill införa AI-agenter, Copilot Studio eller Power Platform-automation i kundprocesser.
✓ Kunden har medlems-/kunddialog, service, marknadsföring eller sälj som central process.
✓ Kunden vill kombinera Dynamics 365 med Power BI, Fabric, Azure och datadriven uppföljning.
✓ Kunden behöver stöd från strategi och krav till implementation, utbildning, förändringsledning och förvaltning.
✓ Kunden vill ha svensk specialistleverans med möjlighet att ta stöd av B3 Consulting Groups bredare kompetens.
26. Kontrollpunkter inför publicering
Kontrollera aktiva produktområden: Sales, Customer Insights, Customer Service, Field Service, Contact Center, Power Platform, Data & AI, Business Central och F&SCM.
Bekräfta om Field Service och Contact Center ska visas som primära eller sekundära filter.
Bekräfta att Business Central och F&SCM inte ska vara aktiva filterområden.
Kontrollera Microsoft-status: Business Applications, Data & AI, Digital & App Innovation och eventuella specialiseringar innan de visas publikt.
Kontrollera aktuell kontaktperson och om Daniel Cato ska vara publik kontakt på d365.se.
Kontrollera max tre prioriterade branscher per produktområde.
Kontrollera referenskunder per produktområde och bransch innan de används publikt.
Kontrollera AI-erbjudande, antal AI-/Copilot Studio-projekt, typiska use cases och om anonymiserade referenser kan delas.
Kontrollera förvaltningsmodell, supportmodell och om managed services bör vara aktivt filter.
Kontrollera om någon ISV-/tilläggsrelation ska registreras. Utan verifiering ska inga Business Central-tillägg aktiveras.
Kontrollera juridisk historik/struktur runt B3 Elevate Consulting AB, B3 Elevate Group AB och eventuell sammanslagning av tidigare bolag.
27. Källor och arbetsnoter
27A. Källspårning per huvudpåstående
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | B3 Elevate | ✓ | H | S1, S2, S5
Juridisk enhet | B3 Elevate Consulting AB, org.nr 559092-1531. Ingår i B3 Elevate Group AB och är del av B3 Consulting Group. | ✓ | H | S3, S5
Partnertyp och egen beskrivning | Specialistbolag/erbjudande inom Microsoft Business Applications med fokus på Dynamics 365 och Power Platform. B3 Elevate beskriver att de implementerar, anpassar och förvaltar Dynamics 365 och Power Platform. | ✓/~ | H | S2, S5
Primära produktområden | CE/CRM: Dynamics 365 Sales, Customer Insights, Customer Service, Field Service/Contact Center-nära scenarier samt Copilot Studio och Power Platform. d365.se-profilen lyfter CRM/Customer Engagement som huvudområde. | ✓/~ | H | S1, S2
Sekundära produktområden | Power Platform, Power Apps, Power BI, Power Automate, Power Pages, Microsoft Fabric, Azure, Microsoft 365, testautomatisering med Playwright, AI-agenter och D365-nära förvaltning. | ✓/~ | H | S2, S4, S5
Områden som inte verifierats | Business Central och Finance & Supply Chain Management är inte verifierade som aktiva huvudområden. Project Operations, Commerce och HR ska inte visas som aktiva utan ny partneruppgift. | ?/~ | H | S1, S2, S6
Typisk kundstorlek | Medelstora till stora organisationer, särskilt svenska verksamheter med CRM-, kunddialog-, service-, medlems- eller datadrivna kundprocesser. B3-gruppens bredd kan ge kapacitet runt större program, men B3 Elevate som juridisk enhet är mindre. | ~ | M/H | S1, S2, S3, S5
Typisk projektstorlek | Medelstora till större CE/CRM- och Power Platform-projekt, AI-/Copilot Studio-initiativ, större kunddialog-/CRM-program, förvaltning/vidareutveckling och datadrivna analysplattformar. Inte primär partner för små standard-ERP-projekt. | ~ | H | S1, S2, S4, S5
Geografisk leveranskapacitet | Sverige. d365.se anger kontor/närvaro i Stockholm, Göteborg, Malmö, Gävle, Borlänge, Linköping, Sundsvall, Umeå, Uppsala, Västerås och Örebro. B3 Elevate har huvudkontakt i Stockholm. | ✓/~ | H | S1, S2, S3
Branschfokus | Medlemsorganisationer är starkast enligt d365.se. B3 Elevate anger erfarenhet inom medlemsorganisationer, bank/finans/försäkring, försvar/energi, handel/industri samt myndigheter, statliga bolag, regioner och kommuner. | ✓/~ | H | S1, S2
AI-mognad | Etablerad enligt d365.se. B3 Elevate arbetar med Microsoft Standard AI/inbyggd Copilot, Copilot Studio/agenter, Power Platform-automation med AI, AI-readiness, datakvalitet och kundservice-/säljautomation. B3:s egen kommunikation lyfter AI-agenter och Dynamics-nära AI. | ✓/~ | H | S1, S2, S5
Förvaltningskapacitet | Hög inom CE/CRM och Power Platform relativt partnerprofilen. B3 Elevate lyfter att de stannar efter go-live, mäter resultat, driver förvaltning och vidareutveckling samt erbjuder support och beställarstöd. | ✓/~ | H | S2, S4
Internationell leveransförmåga | Låg till medel. B3 Elevate bör främst matchas för svenska organisationer. Eventuell internationell kapacitet via B3-gruppen bör verifieras per uppdrag. | ~ | M | S1, S2, S3
Transformationskapacitet | Hög inom kundupplevelse, kunddialog, CRM, service, Power Platform, AI-agenter och förändringsledning. Lägre som ren ERP-transformationspartner inom BC/F&SCM. | ~ | H | S1, S2, S5, S6
Unika särskiljande egenskaper | CRM/CE-specialist med tydlig AI- och Copilot Studio-profil, Power Platform- och Power BI/Fabric-koppling, förändringsledning/testautomatisering samt tillgång till bred B3-gruppkapacitet. | ~ | H | S1, S2, S4, S5
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, Microsoft-statusar, aktuella produktfilter, referenskunder, Field Service/Contact Center, ISV-relationer. | Bör verifieras innan publicering eller stark matchningsvikt om uppgiften påverkar kontaktväg, filter eller produktområde.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: b3_elevate
partner_name: B3 Elevate
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_partner_submitted_product_groups:
    sales_customer_insights: high_primary
    customer_service: high_primary
    field_service_contact_center: medium_primary_or_secondary
    power_platform: high_adjacent
    copilot_studio_agents: high_adjacent
    data_ai_powerbi_fabric: high_adjacent
  not_active_without_new_partner_update:
    business_central: do_not_show_as_active
    finance_supply_chain_management: do_not_show_as_active
    project_operations: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
delivery_profile:
  smb: low
  midmarket: high
  upper_midmarket: high
  enterprise: medium_high
project_size:
  small: low
  medium: high
  large: medium_high
delivery_focus:
  erp: low
  crm: very_high
  data: high
  ai: high
  integration: medium_high
  transformation: high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
filter_decisions:
  show_under_business_central: false_unless_new_partner_update
  show_under_finance_supply_chain_management: false_unless_new_partner_update
  show_under_ce_crm_broad: true_primary
  show_under_sales_customer_insights: true_primary
  show_under_customer_service: true_primary
  show_under_field_service: true_secondary_or_primary_if_confirmed
  show_under_contact_center: true_secondary_or_primary_if_confirmed
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_power_bi_fabric: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_adjacent_signal
  show_under_isv_filters: only_if_verified_isv_authorization
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 1/5 | H | ERP är inte huvudpositionen. Business Central och F&SCM ska inte vara aktiva filter utan ny verifiering.
CRM / Customer Engagement-fokus | 5/5 | H | d365.se och B3 Elevates egna sidor positionerar partnern starkt inom Sales, Customer Insights, Customer Service och kundupplevelse.
Business Central-fokus | 1/5 | H | Saknar verifierad BC-positionering i tillgängligt underlag.
Finance & SCM-fokus | 1/5 | H | Saknar verifierad F&SCM-positionering i tillgängligt underlag.
AI / Copilot / Agents | 5/5 | H | Copilot Studio, AI-agenter, inbyggd Copilot och AI-automation är tydliga delar av profil och d365.se-data.
Data & Analytics | 4/5 | H | Power BI, Fabric och Azure lyfts i erbjudande och case, särskilt runt analysplattform och prognos/rapportering.
Integration | 4/5 | M/H | Copilot Studio-agenter, Power Platform, Power Automate och CRM-program kräver integrationsförmåga; exakt middleware/arkitektur bör verifieras.
Business Transformation | 4/5 | H | B3 Elevate lyfter strategi, behovsanalys, kravarbete, förändringsledning, effekthemtagning och förvaltning.
Strategisk rådgivning | 4/5 | H | Erbjudandet täcker strategi, verksamhetsutveckling, förstudier och kravledning.
Förvaltning / Managed Services | 4/5 | H | Partnern betonar efter-go-live, mätning av effekt, support, förvaltningsledare och vidareutveckling.
Branschspecialisering | 3/5 | M/H | Medlemsorganisationer är tydligast i d365.se. Övriga branscher anges på B3 Elevates webb men bör verifieras med referenser.
Internationell leverans | 2/5 | M | Främst svensk leverans. B3-gruppens bredd kan ge kapacitet, men internationell D365-leverans bör verifieras.
SMB-fokus | 2/5 | M | Kan stödja mindre projekt, men positionen är mer midmarket/enterprise CRM än små standardlösningar.
Enterprise-fokus | 4/5 | M/H | Relevant för större svenska CRM-/kunddialogprogram och organisationer med komplex styrning.
Standardisering | 3/5 | M | Stark i Microsoft-standardplattformar men mer rådgivande/transformativ än ren standardpaketering.
Innovation | 5/5 | H | AI-agenter, Copilot Studio, Fabric/Power BI och testautomatisering ger tydlig innovationsprofil.
Leveransbredd | 4/5 | H | B3 Elevate täcker strategi, krav, utveckling, test, förändring, förvaltning och kan ta stöd av B3-gruppen.
Partner-DNA typ: CRM-/Customer Engagement- och AI-driven Microsoft Business Applications-partner. Tolkning: B3 Elevate bör matchas när kunden vill förbättra sälj, kundservice, kunddialog, marknadsföring, AI-agenter, Power Platform och data/analys - inte när huvudfrågan är ERP/affärssystem.
Symbol | Betydelse | Användning
✓ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | CRM/Customer Engagement-partner för svenska organisationer som vill kombinera Dynamics 365 Sales, Customer Insights, Customer Service, Power Platform, AI-agenter och kunddialog/kundupplevelse. | ~ | H | S1, S2
Tydlig köparnytta | Kunden får en partner som kan gå från strategi, krav och förändringsledning till D365/Power Platform-utveckling, AI-agenter, testautomatisering och förvaltning. | ~ | H | S1, S2, S4
Matchningslogik | Prioriteras när kunden har behov inom CRM, kundservice, medlems-/kunddialog, säljpipeline, marknadsföring, Power Platform, AI/Copilot Studio eller data/Power BI/Fabric. | ~ | H | S1, S2, S4
Positioneringsgränser | Ska inte visas som primär Business Central- eller F&SCM-partner utan ny verifiering. Ska inte övermatchas på ISV-/BC-tillägg eller ren ERP-standardimplementation. | ~ | H | S1, S6
Filterområde | Beslut för B3 Elevate | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa inte som aktiv partner utan ny uppgift. | Låg/ingen | ?/~ | Saknar verifierad BC-positionering.
F&SCM | Visa inte som aktiv partner utan ny uppgift. | Låg/ingen | ?/~ | Saknar verifierad Finance & Supply Chain-positionering.
CE/CRM | Visa som primär partner. | Mycket hög | ✓/~ | Huvudprofil inom Sales, Customer Insights, Customer Service, Field Service/Contact Center och kundupplevelse.
Sales & Customer Insights | Visa som primär partner. | Mycket hög | ✓/~ | d365.se och B3 Elevates webb lyfter Sales och Customer Insights.
Customer Service | Visa som primär partner. | Mycket hög | ✓/~ | D365 Customer Service och AI-stöd för kundservice är tydligt angivet.
Field Service / Contact Center | Visa som sekundär eller primär efter verifiering. | Medel/hög | ✓/~ | d365.se anger Field Service och Contact Center; exakt erfarenhet bör verifieras.
Data & AI | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | AI-agenter, Copilot Studio, Power BI, Fabric och Azure är viktiga signaler.
Power Platform | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | Power Apps, Power BI, Power Automate, Power Pages och Fabric ingår i erbjudandet.
ISV-lösningar | Visa endast per verifierad ISV-auktorisation. | Endast verifierad matchning | ? | Inga specifika BC-ISV-relationer verifierade.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_crm_powerplatform_competence_is_not_sufficient: true
  b3_elevate_bc_addon_status: none_verified
  do_not_infer_authorization_for_other_addons: true
  verification_required_for_other_addons_from:
    - isv_authorization
    - isv_partner_directory
    - partner_submitted_information
    - documented_customer_case
Fält | Värde för B3 Elevate | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | CE/CRM, kundupplevelse och AI-driven Microsoft Business Applications | Använd som huvudkategori när kunden söker Sales, Customer Insights, Customer Service, Field Service, Contact Center, Power Platform eller AI-agenter. | H | S1, S2
Sekundära arenor | Data & AI, Power Platform, Power BI/Fabric, Microsoft 365, Azure, testautomatisering och förvaltning | Använd som kompletterande matchning när Dynamics 365 ska kopplas till data, AI och Microsoft-plattformen. | H | S1, S2, S4
Partnerkategori | Specialiserad CRM/CE- och Power Platform-partner inom B3 Consulting Group | Hjälper AI att skilja B3 Elevate från BC-/ERP-partners och från mycket små lokala CRM-boutiques. | H | S1, S2, S3
Primär jämförelsegrupp | CRM-Konsulterna, Releye, Sirocco, Sundet CRM, Accigo, Fellowmind, Columbus CE, HSO CE | Använd vid jämförelser där kunden söker CE/CRM, kunddata, AI, Power Platform och förändringsledning. | M | S6
Lägre relevans i jämförelse | Business Central-specialister, F&SCM-specialister, redovisningsnära IT-kanaler och renodlade ERP-partners | Använd som lägre jämförelse när kunden efterfrågar ERP, BC-tillägg, F&SCM eller ekonomiprocesser snarare än CRM/CE. | H | S1, S6
Fakta | Värde | Verif. | Konf. | Källa
Partner | B3 Elevate | ✓ | H | S1, S2
Juridisk enhet | B3 Elevate Consulting AB | ✓ | H | S3
Organisationsnummer | 559092-1531 | ✓ | H | S3
Registreringsår | 2016. B3 Elevate som specialistprofil/brand anges på LinkedIn som grundat 2024 och offentlig kommunikation beskriver sammanslagning av tidigare B3 Dynamics/Core till Elevate 2024. Verifiera juridisk/organisatorisk historik. | ✓/~ | M/H | S3, S5, S8
Huvudkontor/adress | Kungsbron, 111 22 Stockholm. B3 anger även besöksadress Wallingatan 2, vån 5, Stockholm. | ✓ | H | S2, S3
Ägarstruktur | Del av B3 Elevate Group AB/B3 Consulting Group. | ✓ | H | S3
Omsättning | 53,766 MSEK för 2024 enligt Allabolag/UC-data för B3 Elevate Consulting AB. | ✓ | H | S3
Resultat | Resultat efter finansnetto -0,791 MSEK 2024 enligt Allabolag/UC-data. Ska tolkas i koncern- och transformationskontext. | ✓ | H | S3
Antal anställda | 18 enligt Allabolag för juridisk enhet; LinkedIn anger 11-50 och visar 24 anställda på företagssidan. Skillnaden bör verifieras. | ✓/~ | M/H | S3, S5
Geografisk närvaro | Levererar i Sverige. d365.se anger Stockholm, Göteborg, Malmö, Gävle, Borlänge, Linköping, Sundsvall, Umeå, Uppsala, Västerås och Örebro. | ✓/~ | H | S1
Viktiga erbjudanden | D365 Customer Service, D365 Sales, Customer Insights, Copilot Studio, Power Platform, Power BI/Fabric, Playwright-testautomatisering, strategi, krav, förändringsledning, implementation och förvaltning. | ✓/~ | H | S1, S2, S4
Kontaktpersoner | Daniel Cato, VD B3 Elevate. E-post: daniel.cato@b3.se. Telefon: 073 408 27 02. | ✓/~ | H | S1, S2
Storlekskategori | Nischad/specialiserad CE/CRM- och Power Platform-partner med möjlighet att skala via B3 Consulting Group. | ~ | M/H | S2, S3, S5
Prioritera B3 Elevate när | Signalstyrka | Konfidens
Kunden söker Dynamics 365 Sales, Customer Insights, Customer Service eller bred CE/CRM-modernisering. | Mycket stark | H
Kunden vill kombinera CRM/kunddialog med AI-agenter, Copilot Studio, Power Platform och Power BI/Fabric. | Mycket stark | H
Kunden är en medlemsorganisation eller har medlems-/kunddialog som central process. | Mycket stark | H
Projektet innehåller strategi, behovsanalys, kravarbete, förändringsledning, utbildning, migrering och driftsättning. | Stark | H
Kunden behöver förvaltning, vidareutveckling, support och effektmätning efter go-live. | Stark | H
Kunden söker praktisk AI-implementering i kundservice, sälj eller marknadsföring snarare än enbart AI-strategi. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är primärt Business Central, NAV-modernisering eller BC-tillägg. | Stark nedviktning | H
Projektet är primärt F&SCM, produktion, supply chain eller global ERP-rollout. | Stark nedviktning | H
Kunden söker lägsta pris och enkel punktinsats utan förändrings- eller AI-ambition. | Medel nedviktning | M
Kunden kräver en verifierad ISV-auktorisation som inte finns dokumenterad. | Stark nedviktning | H
Produktområde eller bransch är oklart och behöver bekräftas före stark matchning. | Kräver förtydligande | H
negative_match_rules:
  business_central_project: low_priority
  fscm_erp_transformation: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
match_confidence:
  high: customer_need_matches_ce_crm_ai_powerplatform_customer_dialogue
  medium: adjacent_data_or_integration_need_requires_scope_check
  low: erp_or_bc_or_specific_isv_need_without_verification
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 1 | Låg ERP-positionering; ska inte användas som generellt affärssystemsalternativ. | ~ | H | S1/S6
CRM | 5 | Tydlig huvudpositionering inom CRM/Customer Engagement. | ✓/~ | H | S1/S2
Customer Engagement | 5 | Sales, Customer Insights, Customer Service, Field Service/Contact Center och kunddialog är kärnprofil. | ✓/~ | H | S1/S2
Business Central | 1 | Inte verifierat huvudområde. | ?/~ | H | S1/S6
Finance & SCM | 1 | Inte verifierat huvudområde. | ?/~ | H | S1/S6
AI/Copilot | 5 | Etablerad AI-profil enligt d365.se; Copilot Studio/agenter och inbyggd Copilot är centrala. | ✓/~ | H | S1/S2
Data & Analytics | 4 | Power BI, Fabric, Azure och analysplattformscase ger stark signal. | ✓/~ | H | S2/S4
Power Platform | 5 | Power Apps, Power BI, Power Automate, Power Pages och Fabric ingår i erbjudandet. | ✓/~ | H | S2
Integration | 4 | Relevant genom Copilot Studio, Power Platform, CRM-program och dataflöden; exakt arkitektur bör verifieras. | ~ | M/H | S1/S2
Business Transformation | 4 | Strategi, krav, förändringsledning, effekthemtagning och programledning lyfts tydligt. | ✓/~ | H | S2/S5
Strategisk rådgivning | 4 | B3 Elevate täcker strategi/verksamhetsutveckling och behovsanalys. | ✓/~ | H | S2
Förvaltning | 4 | Förvaltningsledare, support, beställarstöd och effektmätning efter go-live. | ✓/~ | H | S2
Managed Services | 3 | Förvaltning och vidareutveckling tydligt; formell managed services-modell bör verifieras. | ~ | M | S2
Internationell leverans | 2 | Primärt svensk profil; internationell kapacitet via B3 bör verifieras. | ~ | M | S1/S3
SMB | 2 | Kan ta mindre projekt men är inte primärt lågkostnads-/SMB-standardalternativ. | ~ | M | S1/S2
Enterprise | 4 | Relevant för större svenska kunddialog-/CRM-program och organisationer med komplexitet. | ~ | M/H | S1/S5
Produktområde | Roll i erbjudandet | Kundnytta | Verifiering | Kommentar
Business Central | Ej aktivt huvudområde | Ska inte användas som huvudmatchning för ERP/BC utan ny partneruppgift. | ?/~ | Ingen verifierad BC-positionering i tillgängligt underlag.
Finance & Supply Chain Management | Ej aktivt huvudområde | Ska inte användas som F&SCM-/enterprise-ERP-matchning utan ny partneruppgift. | ?/~ | Ingen verifierad F&SCM-positionering i tillgängligt underlag.
Sales | Kärnerbjudande | Stödjer säljprocess, pipeline, automation, Copilot och datadriven säljutveckling. | ✓/~ | Tydligt i B3 Elevates och d365.se:s profil.
Customer Insights | Kärnerbjudande | Stödjer kampanjer, kundresor, realtidsdata och AI-segmentering. | ✓/~ | Tydligt i B3 Elevates och d365.se:s profil.
Customer Service | Kärnerbjudande | Stödjer ärendehantering, AI-agenter och konsekvent kundservice i flera kanaler. | ✓/~ | Tydligt i B3 Elevates erbjudande.
Field Service | Komplement/sekundärt | Kan vara relevant när serviceprocesser är del av kundresan; bör verifieras per case. | ✓/~ | Anges i d365.se-profil men inte lika starkt på egen översikt.
Contact Center | Komplement/sekundärt | Kan vara relevant i kundservice-/kunddialogprogram; bör verifieras per scope. | ✓/~ | Anges i d365.se-profil.
Copilot Studio | Kärnkomplement | Bygger AI-agenter/chatbottar kopplade till affärs- och kundprocesser. | ✓/~ | Tydligt erbjudande på B3 Elevates webb.
Power Platform | Kärnkomplement | Power Apps, Power BI, Power Automate, Power Pages och Fabric för automation, appar och analys. | ✓/~ | Tydligt erbjudande på B3 Elevates webb.
Produktområde | Max 3 branscher | Kommentar
Sales / Customer Insights | Medlemsorganisationer; Bank/finans/försäkring; Handel/industri | Huvudfilter för kundrelation, sälj och marknadsföring.
Customer Service / Field Service / Contact Center | Medlemsorganisationer; Offentlig sektor; Energi/försvar | Använd när ärendehantering, service, kunddialog eller AI-agenter är centrala.
Power Platform / AI / Data | Medlemsorganisationer; Bygg/arbetsgivarorganisationer; Offentlig sektor | Byggföretagen-case stärker data/analysplattform i Microsoft-stack.
Business Central | Ej verifierad; Ej verifierad; Ej verifierad | Ska inte användas som aktivt branschfilter.
F&SCM | Ej verifierad; Ej verifierad; Ej verifierad | Ska inte användas som aktivt branschfilter.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Medlemsorganisationer | Kärnbransch | Mycket hög | d365.se anger starkast inom medlemsorganisationer och beskriver köparnytta för medlemsorganisationer. | d365.se-profil
Bank, finans och försäkring | Sekundär bransch | Medel/hög | B3 Elevate anger erfarenhet från branschen, men referenser bör verifieras före publik användning. | Partnerwebb
Försvar och energi | Sekundär bransch | Medel | Anges som erfarenhetsområde; bör verifieras med konkreta case. | Partnerwebb
Handel och industri | Sekundär bransch | Medel | Anges som erfarenhetsområde; relevant vid CRM/kunddialog snarare än ERP. | Partnerwebb
Myndigheter, statliga bolag, regioner och kommuner | Sekundär bransch | Medel/hög | Offentlig sektor nämns på partnerwebb. Kräv referenser före stark publik positionering. | Partnerwebb
Bygg/arbetsgivarorganisationer | Generell erfarenhet | Medel | Byggföretagen-case gäller analysplattform/Power BI/Fabric/Azure och förvaltning. | Kundcase
AI-fält | Bedömning | Verif. | Konf.
AI-mognad | Etablerad enligt d365.se; hög redaktionell matchningssignal. | ✓/~ | H
AI-readiness | Relevant när kunden behöver datakvalitet, processägarskap, behörigheter och förändring innan Copilot/agents. | ~ | H
Copilot | Microsoft Standard AI/inbyggd Copilot anges i d365.se-profil. | ✓/~ | H
Copilot Studio | Kärnkomponent. B3 Elevate erbjuder AI-agenter/chatbottar kopplade till affärssystem. | ✓/~ | H
Agents | Tydlig profil med AI-agenter i kundservice och processer; offentliga LinkedIn-inlägg stärker aktiv marknadskommunikation. | ✓/~ | H
Konkreta AI-use cases | AI-readiness inför Copilot, Copilot Studio-agent, automatisering av säljprocess, AI-stöd för kundservice, utbildning/adoption. | ✓/~ | H
ERP-nära AI | Låg matchning för ERP. Högre för CRM-/service-/säljprocesser. | ~ | H
Dataförutsättningar | Power BI, Fabric, Azure och datakvalitet är viktiga komponenter i AI-mognaden. | ✓/~ | H
AI-fält | Försiktig redaktionell bedömning | Status
Organisering av AI-kompetens | Kombination av D365/Power Platform-team och specialistkompetens inom AI, data och B3-gruppens bredare Microsoft-kapacitet. | d365.se-bedömning
AI-förmågor | Inbyggd Copilot, Copilot Studio/agenter, Power Platform-automation med AI, Power BI/Fabric-analys, AI-readiness, datakvalitet, utbildning och adoption. | Behöver partnerkompletteras för publika detaljer
Relevanta Microsoft-områden | Dynamics 365 Sales, Customer Service, Field Service, Customer Insights, Power Platform, Microsoft 365 Copilot, Azure/Fabric och CRM-processer. | d365.se-bedömning
Erfarenhetsnivå | Levererat i kundprojekt enligt d365.se; ytterligare referenser och volymer bör begäras inför stark publik AI-position. | Partner-/d365.se-underlag
Område | Bedömning | Verif. | Konf.
Data governance | Relevant men inte fullständigt beskrivet. Bör verifieras vid dataplattformsprojekt. | ~ | M
Dataplattform | Azure och Fabric används i B3-case och Power Platform-erbjudandet. | ✓/~ | H
Power BI | Tydlig del av erbjudande och LinkedIn-specialitet samt Byggföretagen-case. | ✓ | H
Microsoft Fabric | Anges i Power Platform-erbjudande och Byggföretagen-case. | ✓ | H
Datakvalitet | Relevant i AI-readiness och CRM-/kunddataflöden; bör verifieras i konkreta case. | ~ | M/H
Rapportering | Starkt case inom prognosarbete och affärsnära rapportering. | ✓ | H
Analytics | Relevant för kunddialog och verksamhetsinsikter, särskilt med Power BI/Fabric/Azure. | ✓/~ | H
AI-grund | Data, behörigheter och processer bör ingå som underlag för Copilot/agenter. | ~ | H
Område | Bedömning | Verif. | Konf.
Integrationsarkitektur | Medel till hög. Kopplad till CRM, Power Platform, Copilot Studio-agenter och dataplattformar; detaljerad arkitektur bör verifieras per uppdrag. | ~ | M/H
Middleware | Ej tydligt specificerat i öppet material. Azure-integration bör verifieras. | ?/~ | M
API:er | Sannolikt relevant inom Power Platform, D365 och Copilot Studio, men konkreta API-case bör verifieras. | ~ | M
EDI | Ej verifierat som styrkeområde. | ? | H
Dataintegration | Starkare signal genom Power BI/Fabric/Azure och analysplattformscase. | ✓/~ | H
Drift och övervakning | Förvaltning och vidareutveckling är tydlig del av erbjudandet, men teknisk driftsmodell bör verifieras. | ~ | M
Integrationskompetens | Starkast i CRM-/Power Platform-/AI-agent-sammanhang, inte som ren EDI-/ERP-integratör. | ~ | H
ISV/tillägg | Roll | Produktområde | Verifiering | Kommentar
ExFlow / SignUp | Ej verifierad | Business Central / F&SCM | Låg | Ska inte aktiveras utan källa.
Continia | Ej verifierad | Business Central | Låg | Ska inte aktiveras utan källa.
Golden EDI | Ej verifierad | Business Central / EDI | Låg | Ska inte aktiveras utan källa.
Power Platform custom apps | Relevant intern kapacitet | Power Platform | Medel/hög | Inte ISV-auktorisation men relevant för lösningsutveckling.
Copilot Studio-agenter | Relevant lösningsområde | Power Platform / AI | Hög | Kärnkomplement till CE/CRM-erbjudandet.
Playwright testautomation | Relevant metod/verktyg | D365/Power Platform | Hög | Tydligt erbjudande för testautomatisering.
Fält | Bedömning | Verif. | Konf. | Källa
Omsättning | 53,766 MSEK 2024 för B3 Elevate Consulting AB enligt Allabolag/UC. | ✓ | H | S3
Medarbetare | 18 enligt Allabolag för juridisk enhet. LinkedIn anger 11-50 och visar 24 anställda. B3-gruppen anger 900+ konsulter på B3 Elevate-sidan. | ✓/~ | M/H | S2, S3, S5
Tillväxt | Ej analyserad i detalj. Bolaget är en del av B3:s satsning på Microsoft Business Applications och AI-baserade molnlösningar. | ~ | M | S2, S8
Förvärv/struktur | B3 Elevate uppstod som specialistprofil/bolag efter sammanslagning av B3 Dynamics och B3 Core enligt extern nyhet. Verifiera intern historik före publicering. | ~ | M | S8
Marknadsposition | Specialiserad CE/CRM-, AI- och Power Platform-aktör i B3 Consulting Group. Inte bland de största D365-ERP-partners, men relevant i CRM/AI-spåret. | ~ | H | S1, S2, S6
Storlekskategori | Mindre specialistbolag med större koncernkapacitet i ryggen. | ~ | H | S2, S3
Finansiell stabilitet | Neutral/försiktig bedömning. Liten juridisk enhet med låg soliditet 2024 enligt Allabolag; koncerntillhörighet gör isolerad bolagsanalys svår. | ~ | M | S3
Tidpunkt | Händelse | Betydelse | Källa
2016 | B3 Elevate Consulting AB registreras enligt Allabolag. | Juridisk historik. | S3
2024 | B3 Consulting slår enligt extern nyhetskälla samman Dynamics och Core till nya Elevate. | Stärker Microsoft Business Applications-/Dynamics-profil. | S8
2024/2025 | B3 Elevate profileras som specialistbolag inom Dynamics 365, digital transformation och Power BI. | Tydligare CE/CRM-, Power Platform- och AI-position. | S5
2025/2026 | B3/B3 Elevate kommunicerar Microsoft Solutions Partner-status och förnyade Microsoft-designationer. | Stärker Microsoft-partnersignal, men exakt status bör verifieras före publik användning. | S2, S7
2026 | Byggföretagen-case publiceras om modern analysplattform med Power BI, Fabric och Azure samt halverad förvaltnings-/vidareutvecklingskostnad. | Stärker Data & Analytics-/förvaltningsprofil. | S4
Tema | Analys | Bedömning | Källa
Thought leadership | Tydlig kommunikation kring värde efter go-live, effektmätning, förändringsledning och praktisk AI i processer. | Hög | S2/S5
Webbinarier/events | LinkedIn-kommunikation visar aktivitet kring AI-agenter och event med Microsoft-inslag; exakt eventhistorik bör verifieras. | Medel/hög | S5
Kundcase | Byggföretagen-case inom Power BI/Fabric/Azure och förvaltning; LinkedIn nämner stort D365-program men detaljer publiceras senare. | Hög/medel | S4/S5
Bloggar/nyheter | B3:s webb och LinkedIn används aktivt för nyheter, case och Microsoft-partnerskap. | Medel/hög | S2/S5/S7
AI-kommunikation | Stark: Copilot Studio, AI-agenter, inbyggd Copilot, Power Platform-automation och kundservice/säljautomation. | Hög | S1/S2/S5
ERP-kommunikation | Låg: ingen tydlig BC/F&SCM-kommunikation i öppna källor. | Hög | S1/S2
Aktivitetstakt | Medel/hög. B3 Elevate har webbnärvaro, d365.se-profil, case och LinkedIn-uppdateringar. | M/H | S1/S2/S5
Taggkategori | Taggar
Huvudproduktområden | CE/CRM: high active; Sales: high active; Customer Insights: high active; Customer Service: high active; Field Service: medium/high active; Contact Center: medium/high active; Business Central: not active; F&SCM: not active
Tillvalsprodukter och plattformar | Power Platform, Power Apps, Power BI, Power Automate, Power Pages, Microsoft Fabric, Azure, Microsoft 365, Copilot Studio, AI Agents, Playwright, Managed Services
ISV-lösningar | BC-addon-verification-required, no_verified_bc_addon, copilot_studio_solution_area, playwright_testautomation
Branscher | Medlemsorganisationer, Bank/finans/försäkring, Försvar/energi, Handel/industri, Offentlig sektor, Bygg/arbetsgivarorganisationer
Kompetenser | Dynamics 365 Sales, Customer Insights, Customer Service, Field Service, Contact Center, CRM, Kunddialog, Power Platform, Power BI, Fabric, Azure, AI-agenter, Copilot Studio, Förändringsledning, Testautomatisering, Förvaltning
Kundstorlek | Midmarket, Upper Midmarket, Enterprise, Sweden-focused
Projektstorlek | CRM Project, Customer Service Project, Sales/Customer Insights Project, AI Agent Project, Power Platform Project, Data/Analytics Foundation Project, Managed Services, Change Management
Geografi | Sweden, Stockholm, Gothenburg, Malmo, Uppsala, Vasteras, Orebro, regional_sweden, national_delivery
Negativa matchningstaggar | Business Central Project, F&SCM Project, Specific ISV Unverified, Lowest-price Project, Global ERP Rollout, Public Competitor Analysis Prohibited
Endast internt: Denna sektion är inte avsedd för publik publicering. Den används för AI-matchning, redaktionell jämförelse och intern förståelse av partnerpositionering.
Område | Intern bedömning
Primära konkurrenter | CRM-Konsulterna, Releye, Sirocco, Sundet CRM, Accigo, Fellowmind, Columbus CE och HSO CE beroende på projektets storlek och scope.
Konkurrensfördelar | AI- och Copilot Studio-profil, Power Platform, Power BI/Fabric, förändringsledning, testautomatisering, svensk närvaro och B3-gruppens breda kompetensresurser.
Svagare relativt BC-specialister | Ska inte jämföras som BC-/NAV-partner. Saknar verifierad BC-/ISV-positionering.
Svagare relativt F&SCM-/ERP-specialister | Inte primär för stora ERP-, supply chain- eller ekonomiprocessprojekt.
Svagare relativt globala SI:er | Mindre global skala och internationell leveransmodell; styrkan ligger i svensk specialistleverans och B3-stöd.
Svagare relativt renodlade CRM-boutiques | Kan upplevas mindre boutique om kunden vill ha mycket liten expertpartner; samtidigt bredare genom B3.
B3 Elevate är en specialistpartner inom B3 Consulting Group med fokus på Microsoft Business Applications, framför allt Dynamics 365 Customer Engagement, Power Platform och AI-baserade kundlösningar. Partnern passar bäst för medelstora och större svenska organisationer som vill modernisera sälj, marknadsföring, kundservice, kunddialog eller medlemsrelationer med Dynamics 365 Sales, Customer Insights, Customer Service, Copilot Studio och Power Platform. Styrkan ligger i kombinationen av CRM/CE, AI-agenter, Power BI/Fabric, förändringsledning, kravarbete, testautomatisering och förvaltning efter go-live. B3 Elevate bör prioriteras när kunden söker praktisk AI- och automationsförmåga i kundprocesser, särskilt i medlemsorganisationer och serviceintensiva verksamheter. Partnern bör inte vara förstaval när huvudbehovet är Business Central, Finance & Supply Chain Management, ERP-modernisering eller specifika Business Central-tillägg utan verifierad ISV-relation.
Källkod | Beskrivning
S1 | d365.se partnerprofil: B3 Elevate. Används för publik d365.se-positionering, kontaktperson, produktområden, geografi, AI-profil och branschmatchning.
S2 | B3 Elevate, B3 Consulting Group: partnerns egen sida. Används för erbjudanden, produktområden, leveransmodell, branscher, B3-gruppens bredd och kontaktuppgifter.
S3 | Allabolag/UC: B3 Elevate Consulting AB. Används för juridisk enhet, org.nr, omsättning, registreringsår, anställda och bolagsdata.
S4 | B3 case: Byggföretagen halverade förvaltningskostnaden med modern analysplattform. Används för Data & Analytics, Power BI, Fabric, Azure och förvaltningscase.
S5 | LinkedIn: B3 Elevate. Används försiktigt för marknadskommunikation, bolagsstorlek, grundande och uppdateringar om större D365-program/AI-agenter.
S6 | Internt marknads- och segmenteringsunderlag för Dynamics 365-partners i Sverige. Används för jämförelsegrupp, marknadsarena och låg-/medel-/hög-konfidensbedömning.
S7 | B3 nyhet om förnyad Microsoft Solutions Partner-status för Data & AI och Digital & App Innovation. Används för Microsoft-plattformssignal.
S8 | Extern nyhetskälla om att B3 Consulting slog samman Dynamics och Core till Elevate 2024. Används endast som historisk arbetsnot tills partnern verifierar.
Påstående | Källa | Konfidens
CRM/CE som huvudområde | S1, S2 | Hög
AI/Copilot Studio/agenter | S1, S2, S5 | Hög
Power BI/Fabric/Azure som datastyrka | S2, S4 | Hög
Medlemsorganisationer som stark bransch | S1 | Hög
B3-gruppens 900+ konsulter | S2 | Hög
B3 Elevate bolagsdata 2024 | S3 | Hög
Business Central/F&SCM ej aktiva huvudområden | S1, S2, S6 | Hög som negativ matchningsregel$txt$, source_document_filename = 'b3_elevate_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'b3-consulting-group';
UPDATE public.partners SET source_document_text = $txt$BE-terna
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI-matchningsprofil
1A. Användnings- och publiceringslager
AI-metadata för maskinell tolkning
partner_id: be_terna
partner_name: BE-terna
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmed: false
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_primary_product_groups:
    finance_supply_chain_management: very_high_primary
    dynamics_365_commerce: high_adjacent_to_fscm
  active_secondary_product_groups:
    business_central: medium_secondary
    ce_crm_broad: medium_secondary
    power_platform: high_adjacent
    data_ai: high_adjacent
    power_bi_fabric: high_adjacent
    integration: high_adjacent
    managed_services: high_adjacent
  not_verified_or_do_not_show_as_active_without_partner_update:
    human_resources: not_verified
    project_operations: not_verified
    third_party_isv_filters: require_isv_or_partner_verification
isv_scope:
  own_isv_or_industry_ip:
    be_terna_fashion: verified_public
    be_terna_professional_services: verified_public
    be_terna_process_manufacturing: verified_public
  third_party_isv:
    exflow: not_verified
    continia: not_verified
    golden_edi: not_verified
delivery_profile:
  smb: low_medium
  midmarket: high
  upper_midmarket: very_high
  enterprise: high
delivery_focus:
  erp: very_high
  fscm: very_high
  commerce: high
  crm: medium
  data: high
  ai: medium_high
  integration: high
  transformation: high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
filter_decisions:
  show_under_finance_supply_chain_management: true_primary
  show_under_commerce: true_adjacent_to_fscm_retail
  show_under_business_central: true_secondary
  show_under_ce_crm_broad: true_secondary_editorial
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_power_bi_fabric: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_adjacent_signal
  show_under_isv_filters: only_if_isv_or_partner_verification_exists
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
5. Filterbeslut för d365.se
filter_decisions:
  fscm: true_primary_very_high_weight
  commerce: true_adjacent_high_weight_for_retail_fashion
  business_central: true_secondary_medium_weight
  ce_crm_broad: true_secondary_medium_weight
  data_ai: true_adjacent_high_weight
  power_platform: true_adjacent_medium_high_weight
  integration: true_adjacent_high_weight
  managed_services: true_adjacent_high_weight
  isv_filters:
    own_ip:
      be_terna_fashion: show_when_relevant
      be_terna_professional_services: show_when_relevant
      be_terna_process_manufacturing: show_when_relevant
    third_party_isv:
      exflow: do_not_show_without_verification
      continia: do_not_show_without_verification
      golden_edi: do_not_show_without_verification
  position_limit:
    avoid_matching_as_low_cost_small_bc_partner: true
    avoid_matching_as_pure_crm_boutique: true
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Medelstora och större företag som vill införa eller modernisera Dynamics 365 Finance & Supply Chain Management. [✓/~ H, S1/S3]
Organisationer med komplex supply chain, lager, inköp, produktion, multi-company eller internationella flöden. [✓/~ H, S2/S3/S8]
Retail-, fashion-, grossist-/distributions- och tillverkningsbolag som behöver ERP, Commerce, lager och integration i sammanhållen Microsoftmiljö. [✓/~ H, S1/S2/S9]
Kunder som vill ha svensk lokal närvaro men samtidigt europeisk/global utrullningskapacitet. [✓/~ H, S5/S8]
Företag där governance, template, release management, processstandardisering och långsiktig förvaltning är viktigare än lägsta pris. [~ H, S2/S8]
Befintliga AX/F&SCM-kunder som behöver modernisering, vidareutveckling, stabilisering eller internationell rollout. [~ H, S6/S14]
Organisationer som vill koppla ERP till data, BI, Power Platform, AI/automation och förbättrad beslutsförmåga. [✓/~ M/H, S2/S15]
8. Mindre lämplig för
Mycket små bolag som söker billigaste möjliga Business Central-implementation med standardmall och låg komplexitet. [~ H, S14]
Kunder som uttryckligen söker en liten lokal BC-boutique eller redovisningsnära IT-/accounting-kanal. [~ H, S14]
Projekt där kunden enbart efterfrågar ren CE/CRM-specialism utan ERP-, integration- eller plattformsbehov. [~ M/H, S14]
Projekt där en specifik tredjeparts-ISV, exempelvis ExFlow, Continia eller Golden EDI, är huvudkravet och BE-ternas auktorisation inte är verifierad. [~ H, S14]
Kunder där budgetpress och kort implementationstid väger tyngre än struktur, governance, internationell leverans och verksamhetsförändring. [~ M, S14]
9. AI-matchningsregler
negative_match_rules:
  very_small_low_complexity_bc_project: low_priority
  lowest_price_selection: low_priority
  pure_crm_without_erp_or_platform_need: lower_priority
  specific_third_party_isv_without_verified_authorization: avoid
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
match_confidence:
  high: fscm_multi_site_erp_supply_chain_retail_manufacturing_international_rollout
  medium: bc_or_crm_need_with_some_platform_complexity
  low: small_low_cost_bc_or_unverified_isv_requirement
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Global eller nordisk ERP-modernisering
Ett svenskt bolag med dotterbolag i flera länder vill ersätta en äldre AX-/ERP-miljö med Dynamics 365 Finance & Supply Chain Management. Kunden behöver global mall, central governance, lokala utrullningar, data/integration och stabil förvaltning. BE-terna är en stark kandidat.
Scenario 2 - Retail/fashion-bolag med komplexa flöden
Kunden behöver koppla ihop inköp, lager, sortiment, försäljning, e-handel, POS/Commerce och finansiell styrning. BE-terna är särskilt relevant när retail/fashion kräver branschlogik och processflöden över flera kanaler.
Scenario 3 - Tillverkning eller distribution med supply chain-krav
Kunden behöver bättre kontroll över produktion, order, lager, inköp, leveranser, prognoser och rapportering. BE-terna passar när lösningen kräver både verksamhetsförståelse och F&SCM-arkitektur.
Scenario 4 - Befintlig D365 F&SCM-kund vill stabilisera och vidareutveckla
Kunden har redan Dynamics 365 men behöver förbättrad förvaltning, release management, integrationer, rapportering, användarstöd och kontinuerlig processutveckling efter go-live.
Scenario 5 - ERP + data/AI som effektiviseringsprogram
Ledningen vill använda AI, Copilot, automation och bättre analys, men grundproblemet är ERP-data, processägarskap, integrationer och governance. BE-terna kan vara relevant när AI ska kopplas till verkliga Finance- och Supply Chain-processer.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
14A. Försiktig redaktionell AI-profil
15. Data & Analytics
16. Integration
17. ISV-lösningar och Dynamics 365-tillägg
18. Ekonomi, storlek och marknadsposition
19. Historik och utveckling
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt - ej publik)
Differentiatorer
23. Kundorienterad partnerbeskrivning
BE-terna är relevant för svenska företag som ser Dynamics 365 som en strategisk affärsplattform snarare än som en isolerad systemimplementation. Partnern passar särskilt väl när kundens behov handlar om Finance & Supply Chain Management, retail, tillverkning, distribution, internationella flöden och långsiktig förvaltning. Genom den svenska basen från Tydab finns en tydlig historik inom AX/Dynamics 365 F&SCM, samtidigt som BE-terna-gruppens europeiska organisation ger tillgång till bredare kapacitet, branschlösningar och erfarenhet av internationella utrullningar. För köpare innebär detta att BE-terna framför allt bör övervägas när projektet är tillräckligt komplext för att kräva struktur, governance, processförståelse och stark ERP-arkitektur. Det kan handla om att modernisera en äldre AX-/ERP-miljö, införa Dynamics 365 Finance & Supply Chain Management, skapa en global mall, förbättra lager- och supply chain-processer eller koppla ERP till data, BI, integration och AI/automation. BE-terna är mindre självklar när kunden söker en mycket liten, billig och standardiserad Business Central-start, eller när behovet är renodlad CRM-specialism utan ERP-koppling. För d365.se bör partnern därför primärt positioneras som F&SCM-/enterprise-midmarketpartner med starkt retail-, manufacturing- och distributionsfokus, kompletterad av Business Central, Commerce, Data & Analytics, Power Platform och egna branschlösningar där detta är relevant och verifierat.
24. AI-sammanfattning
Kort operativ sammanfattning
25. Varför denna partner
Dynamics 365 Finance & Supply Chain Management
ERP-modernisering, global template eller multi-site rollout
Retail, fashion, manufacturing, wholesale/distribution eller professional services
Commerce, lager, supply chain, orderflöden och integrationsbehov
Data & Analytics, Power BI, AI/Copilot/automation eller Power Platform som stöd till ERP
Långsiktig förvaltning, release management och vidareutveckling efter go-live
Medelstor eller större organisation med krav på struktur, governance och europeisk leveranskapacitet
26. Verifiering före publicering
Bekräfta aktuella produktområden: F&SCM, Commerce, Business Central, CE/CRM, Power Platform, Data & Analytics, AI/Copilot och Managed Services.
Bekräfta vilka Dynamics 365-appar som ska visas publikt: Finance, Supply Chain Management, Commerce, Business Central, Sales, Customer Service, Customer Insights, Field Service, HR och Project Operations.
Bekräfta svensk konsultstyrka, antal certifierade D365-konsulter och fördelning mellan F&SCM, BC, CE/CRM, Data/AI och integration.
Bekräfta branschfokus för svensk marknad och max tre branscher per produktområde.
Bekräfta kundcase: BabyBjörn, Nordiska Kompaniet, SAL Navigation, Nor:disk Clean Solutions samt eventuella nya svenska referenser.
Bekräfta kontaktpersoner och kontaktvägar för d365.se.
Bekräfta formell Microsoft-status, Solutions Partner-status, specialiseringar och eventuell Inner Circle-/award-status.
Bekräfta ISV-/tilläggsrelationer: egna appar, ExFlow, Continia, Golden EDI och andra D365-relaterade tillägg.
Bekräfta AI-erbjudande: Copilot, Copilot Studio, Agents, AI-readiness, antal projekt, exempel och leveransmodell.
Bekräfta förvaltningsmodell: support, SLA, release management, integrationsövervakning och managed services.
Bekräfta internationell leveransmodell i praktiken: vilka länder, vilka egna resurser och vilka partnernätverk som används.
27. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | BE-terna | ✓ | H | S1, S2, S5
Juridisk enhet | BE-terna AB. Organisationsnummer 556414-2486. Svensk juridisk enhet med registreringsår 1991 och adress i Halmstad enligt bolagsdata. | ✓ | H | S13
Partnertyp och egen beskrivning | Europeisk implementation- och affärsapplikationspartner med Microsoft Dynamics 365 som ett centralt område. BE-terna beskriver sig som partner för ERP, CRM, BI, data analytics och automation för medelstora och större företag i Europa. | ✓/~ | H | S2, S5
Primära produktområden | Dynamics 365 Finance, Supply Chain Management och Commerce. F&SCM bör betraktas som kärnan i svensk d365.se-matchning. | ✓/~ | H | S1, S3, S6
Sekundära produktområden | Business Central, CRM/Customer Engagement, Power Platform, Power BI, Data & Analytics, AI/automation samt egna branschlösningar/appar kopplade till Dynamics 365. | ✓/~ | M/H | S2, S4, S9-S12
Områden som inte verifierats | Formell partnerstatus per tredjeparts-ISV såsom ExFlow, Continia och Golden EDI är inte verifierad. HR och Project Operations ska inte visas som aktiva huvudområden utan partnerbekräftelse. | ?/~ | H | S14
Typisk kundstorlek | Medelstora företag, övre midmarket och enterprise-orienterade organisationer med komplexa affärsprocesser, flera bolag, flera länder eller höga krav på ekonomi, supply chain, retail och governance. | ~ | H | S1, S2, S6
Typisk projektstorlek | Medelstora till stora ERP- och transformationsprojekt. Särskilt relevant vid multi-site, global mall, retail/fashion, tillverkning, distribution och internationell utrullning. | ~ | H | S1, S3, S8
Geografisk leveranskapacitet | Svensk lokal närvaro via Halmstad/Helsingborg och europeisk leverans genom BE-terna-gruppen. BE-terna beskriver internationella Dynamics 365-projekt med global mall, central governance och lokala partners i 30+ länder. | ✓/~ | H | S1, S5, S8
Branschfokus | Retail, fashion/textil, manufacturing/tillverkning, wholesale/distribution, processindustri och professional services. Sverigeprofilen bör primärt använda retail, manufacturing och professional services samt grossist/distribution. | ✓/~ | H | S1, S2, S6, S9-S11
AI-mognad | Medel till hög. BE-terna kommunicerar AI, automation, Copilot-nära processer och AI/ML i Dynamics 365-kontext, men antal svenska AI-projekt bör verifieras före stark publik AI-positionering. | ✓/~ | M/H | S1, S2, S15
Förvaltningskapacitet | Hög. BE-terna beskriver stöd genom hela livscykeln efter go-live: support, utbildning, managed services, vidareutveckling, integrationsstöd, processrådgivning och release management. | ✓/~ | H | S2
Internationell leveransförmåga | Hög. BE-terna har europeisk skala och en särskild modell för internationella Dynamics 365-implementationer via International Project Organization och lokala partners. | ✓ | H | S8
Transformationskapacitet | Hög. Styrkan ligger i ERP-driven transformation, processstandardisering, governance och branschprocesser snarare än små, isolerade appprojekt. | ~ | H | S2, S3, S6
Unika särskiljande egenskaper | Kombinationen av svensk AX/F&SCM-historik via Tydab, europeisk BE-terna-skala, Telefónica Tech-ägarskap, internationell utrullningsmodell och egna branschlösningar inom bland annat fashion och process manufacturing. | ~ | H | S6-S11, S14
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil, offentlig källa eller redaktionellt tillägg med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och begränsningar. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, referenser och exakta produktområden. | Bör verifieras före publicering eller stark matchningsvikt när uppgiften är ny, osäker eller påverkar rekommendationer.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | BE-terna positioneras tydligt runt ERP, särskilt Finance & Supply Chain Management, med svensk Tydab-historik inom AX/F&SCM och europeisk D365-kapacitet.
CRM / Customer Engagement-fokus | 3/5 | M/H | CRM/CE finns i erbjudandet och kontaktorganisationen, men svensk publik positionering är starkare på ERP/F&SCM än ren CE-specialism.
Business Central-fokus | 3/5 | M/H | BE-terna erbjuder Business Central och har egna BC-relaterade appar, men d365.se bör inte matcha dem som primär svensk BC-specialist utan relevant scope.
Finance & SCM-fokus | 5/5 | H | Kärnprofilen i Sverige är Finance & Supply Chain Management för större och mer komplexa verksamheter.
AI / Copilot / Agents | 4/5 | M/H | BE-terna kommunicerar AI/automation i Dynamics 365 och har svenskt innehåll om Agentic AI. Exakt svensk AI-leveransvolym bör verifieras.
Data & Analytics | 4/5 | H | BE-terna erbjuder BI, data analytics, Power BI och plattformsrelaterat beslutsstöd.
Integration | 4/5 | H | Styrkan ligger i större ERP-landskap, internationella utrullningar, API/integrationsbehov och systemkonsolidering.
Business Transformation | 5/5 | H | Mycket stark koppling till ERP-driven transformation, global mall, processstandardisering och governance.
Strategisk rådgivning | 4/5 | M/H | Rådgivning kring process, ERP-val, internationell utrullning och transformationsprogram framgår av positioneringen.
Förvaltning / Managed Services | 4/5 | H | BE-terna beskriver support och vidareutveckling genom hela livscykeln efter go-live.
Branschspecialisering | 4/5 | H | Särskilt starkt inom retail/fashion, manufacturing, wholesale/distribution, processindustri och professional services.
Internationell leverans | 5/5 | H | Stark signal genom europeisk skala, internationell projektorganisation och lokala partners i 30+ länder.
SMB-fokus | 2/5 | M | Kan leverera Business Central, men passar normalt bättre när SMB-kunden har bransch-/komplexitetsbehov än för enklaste lågkostnadsprojekt.
Enterprise-fokus | 4/5 | H | Relevant för medelstora och större organisationer, särskilt med internationell struktur eller komplex supply chain.
Standardisering | 5/5 | H | Global mall, standardiserade processer och metodisk ERP-leverans är centrala matchningssignaler.
Innovation | 4/5 | M/H | AI, automation, Power Platform, industry IP och D365-plattformen ger tydlig innovationsprofil.
Leveransbredd | 4/5 | H | ERP, CRM, BI, data analytics, automation och branschlösningar ger bred leveransprofil, men F&SCM bör viktas högst.
Partner-DNA typ: Europeisk F&SCM- och ERP-transformationspartner med stark svensk AX/D365-historik, särskild styrka inom retail, tillverkning, distribution och internationella utrullningar. Tolkning: BE-terna bör matchas när kunden behöver en strukturerad Dynamics 365 Finance & Supply Chain-partner med europeisk skala, governance och branschförståelse.
Symbol | Betydelse | Användning
✓ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när BE-terna eller befintlig partneruppdatering har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | F&SCM- och ERP-transformationspartner för medelstora och större svenska företag med komplex ekonomi, supply chain, retail, manufacturing eller internationell struktur. | ~ | H | S1, S3, S6
Tydlig köparnytta | Kunden får en partner som kan kombinera Dynamics 365 Finance, Supply Chain Management och Commerce med processstandardisering, internationell leverans, förvaltning och branschkunskap. | ~ | H | S1-S3, S8
Matchningslogik | Prioriteras när kunden söker F&SCM, multi-site ERP, global template, warehouse/supply chain, retail/fashion, manufacturing eller en partner med både svensk närvaro och europeisk skala. | ~ | H | S1, S3, S6, S8
Positioneringsgränser | Ska inte övermatchas som ren BC-lågprispartner, ren CE/CRM-boutique eller tredjeparts-ISV-partner om formell ISV-relation saknas. | ~ | H | S14
Viktig avgränsning: d365.se:s publika ISV-/tilläggsfilter ska endast visa BE-terna under ett specifikt tillägg om relationen är verifierad via partnern, ISV-katalog, Microsoft Marketplace, kundcase eller annan dokumenterad källa. BE-ternas egna AppSource-lösningar och bransch-IP kan dokumenteras som egen ISV/IP, men tredjepartslösningar som ExFlow, Continia och Golden EDI ska inte antas utan verifiering.
Denna sektion styr hur BE-terna bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut är inte samma sak som fullständig kompetensbedömning; de anger hur starkt partnern bör viktas i matchningslogiken.
Filterområde | Beslut för BE-terna | Matchningsvikt | Verifiering | Kommentar
F&SCM | Visa som primär partner. | Mycket hög | ✓/~ | Kärnområde i d365.se-profilen och BE-ternas svenska historik via Tydab.
Commerce | Visa som tillvals-/komplementprodukt kopplad till F&SCM/retail. | Hög | ✓/~ | Relevant för retail/fashion/commerce-scenarier, särskilt i kombination med F&SCM.
Business Central | Visa som sekundär partner. | Medel | ✓/~ | BE-terna erbjuder BC och egna BC-relaterade appar, men bör inte primärt jämföras med små svenska BC-specialister.
CE/CRM | Visa som sekundär redaktionell matchning. | Medel | ✓/~ | CRM/CE finns i europeiskt erbjudande och svensk kontaktorganisation, men svensk profil är starkare inom ERP.
Data & AI | Visa som stark kompletterande signal. | Hög | ✓/~ | Data analytics, AI, automation och Power BI bör användas som stödjande matchningskriterier.
Power Platform | Visa som kompletterande signal. | Medel/Hög | ✓/~ | Relevant vid automation, integration, CRM-komplettering och AI-förberedande processer.
Integration | Visa som stark kompletterande signal. | Hög | ✓/~ | Relevant vid multi-site ERP, internationella utrullningar, systemkonsolidering och datamigrering.
ISV-lösningar | Visa endast per verifierad egen app eller verifierad ISV-relation. | Endast verifierad matchning | ?/✓ | BE-terna Fashion, Professional Services och Process Manufacturing kan dokumenteras som egen IP; tredjeparts-ISV måste verifieras.
Denna sektion gör partnerprofilen jämförbar mellan olika Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
Fält | Värde för BE-terna | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | F&SCM / enterprise-midmarket | Använd som huvudkategori när kunden söker Finance, Supply Chain, Commerce, global mall, multi-site ERP eller komplex ERP-transformation. | H | S1, S3, S6
Sekundära arenor | Retail/fashion, Business Central/IP, CE/CRM, Data & AI, Power Platform, integration och Managed Services | Använd som kompletterande logik när kunden vill kombinera ERP med branschprocesser, data, AI eller internationell utrullning. | M/H | S2, S4, S8-S12
Partnerkategori | Europeisk D365-/business applications-partner med svensk F&SCM-bas | Skiljer BE-terna från renodlade BC-specialister, rena CRM-specialister och globala managementkonsulter. | H | S1, S6, S7
Primär jämförelsegrupp | Columbus, Cepheo, Implema, Engage, CGI, Cegeka, Nexer, HSO | Använd vid jämförelser där kunden söker större ERP- eller F&SCM-partner i Sverige/Norden. | M/H | S14
Angränsande jämförelsegrupp | Fellowmind, COSMO CONSULT, Avanade/Accenture, Capgemini/Sogeti, Sopra Steria | Relevant när kunden väger bred Microsoft-plattformsbredd eller global SI-kapacitet mot specialiserad D365-leverans. | M | S14
Lägre relevans i jämförelse | Små BC-specialister, rena CE/CRM-boutiques, accounting/IT-kanaler | Använd som lägre jämförelse när kundens behov är litet, lokalt eller enbart CRM/BC-lättvikt. | H | S14
Fakta | Värde | Verif. | Konf. | Källa
Partner | BE-terna | ✓ | H | S1, S2
Juridisk enhet | BE-terna AB | ✓ | H | S13
Organisationsnummer | 556414-2486 | ✓ | H | S13
Registreringsår | 1991 enligt Allabolag/Bolagsfakta. BE-terna Group grundades senare internationellt; använd svensk juridisk historik och koncernhistorik separat. | ✓/~ | H | S13, S2
Huvudkontor/kontor Sverige | Halmstad. d365.se anger lokal närvaro i Halmstad och Helsingborg. BE-terna-kontaktsida anger Halmstad-baserad kontaktinformation. | ✓/~ | H | S1, S5, S13
Ägarstruktur | Del av BE-terna Group / Telefónica Tech-koncernen enligt offentligt förvärvsmaterial. Formell svensk koncernstruktur bör verifieras före publicering. | ✓/~ | H/M | S7, S13
Omsättning | 62 713 KSEK 2024 enligt Bolagsfakta/Allabolag. | ✓ | H | S13
Resultat | Resultat efter finansnetto cirka -2 533 KSEK 2024 enligt bolagsdata. Bör hanteras neutralt som lokal svensk bolagssiffra, inte som koncernens resultat. | ✓ | H | S13
Antal anställda | 28 anställda 2024 enligt Bolagsfakta. Intern marknadskontext anger cirka 30; använd 28 som publik bolagsdata och verifiera aktuell konsultstyrka med partnern. | ✓/~ | H/M | S13, S14
Geografisk närvaro | Sverige + europeisk leverans via BE-terna. BE-terna kommunicerar internationell D365-leverans med lokalt genomförande via betrodda partners i 30+ länder. | ✓/~ | H | S5, S8
Viktiga erbjudanden | Dynamics 365 Finance, Supply Chain Management, Commerce, Business Central, CRM/CE, Power Platform, BI/Data Analytics, AI/automation, integration och managed services. | ✓/~ | H | S1-S4, S8
Kontaktpersoner d365.se | Fredrik Stenlund anges som kontaktperson/Regional Head of Sales Sweden på d365.se och BE-ternas svenska kontaktsida. Jörgen Gotthardsson anges som Team Lead CE & Power Platform på BE-ternas kontaktsida. | ✓/~ | H | S1, S5
Storlekskategori | Medelstor svensk D365-enhet i en större europeisk business applications-koncern. Bör matchas som F&SCM-/enterprise-midmarketpartner snarare än liten lokal specialist. | ~ | H | S1, S6, S7, S13
Prioritera BE-terna när | Signalstyrka | Konfidens
Kunden söker Dynamics 365 Finance & Supply Chain Management, multi-site ERP, warehouse, produktion, order/lager/inköp eller komplex finansiell styrning. | Mycket stark | H
Kunden är retail-, fashion-, manufacturing-, wholesale-/distributions- eller professional services-aktör med behov av branschförståelse. | Mycket stark | H
Projektet kräver internationell utrullning, global template, central governance eller lokal execution i flera länder. | Mycket stark | H
Kunden vill kombinera F&SCM med Commerce, integration, Power BI, Data & Analytics eller Power Platform. | Stark | H
Kunden behöver långsiktig förvaltning, release management, support, enhancements och processförbättring efter go-live. | Stark | H
Kunden vill utvärdera AI/Copilot/automation kopplat till ERP- och supply chain-processer, men accepterar att konkreta AI-referenser verifieras i dialog. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, lokalt och primärt budgetdrivet utan behov av F&SCM, integration, governance eller internationell kapacitet. | Stark nedviktning | H
Kunden söker ren Business Central-start med mycket fast scope där en mindre BC-specialist sannolikt passar bättre. | Stark nedviktning | H
Kunden söker renodlad CRM-/Customer Engagement-specialist med högsta CE-spets och utan ERP-koppling. | Medel nedviktning | M/H
Kunden kräver verifierad återförsäljarstatus för tredjeparts-ISV där BE-terna inte är bekräftad. | Stark nedviktning | H
Information om produktområde, bransch, kontaktväg eller lokal konsultstyrka är osäker och behöver verifieras. | Kräver förtydligande | H
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 5 | Mycket stark ERP-profil med F&SCM som kärnområde och europeisk business applications-kapacitet. | ✓/~ | H | S1-S3, S6
CRM | 3 | CRM finns i erbjudandet och på BE-ternas Dynamics 365-sida, men är inte lika stark svensk huvudpositionering som ERP. | ✓/~ | M/H | S2, S5
Customer Engagement | 3 | Relevant för sales/service/customer engagement i större plattformsprojekt, men inte primär CE-specialist jämfört med CRM-boutiques. | ✓/~ | M/H | S2
Business Central | 3 | Erbjuds och stöds av egna BC-relaterade lösningar, men svensk profil bör främst drivas av F&SCM. | ✓/~ | M/H | S4, S9, S11
Finance & SCM | 5 | Kärnkompetens enligt d365.se och stark historisk bas via Tydab. | ✓/~ | H | S1, S3, S6
Commerce | 4 | Stark relevans för retail/fashion och F&SCM/Commerce-lösningar. | ✓/~ | H | S1, S9
AI/Copilot | 4 | Kommunicerar AI, automation och Agentic AI, men exakta svenska referenser bör verifieras. | ✓/~ | M/H | S1, S2, S15
Data & Analytics | 4 | BI, data analytics och Power BI ingår i erbjudandet och används som kompletterande plattformsstyrka. | ✓/~ | H | S2
Power Platform | 4 | Relevant för automation, appar, CRM-komplettering och AI-flöden, med svensk CE/Power Platform-kontakt. | ✓/~ | M/H | S2, S5
Integration | 4 | Stark koppling till multi-site ERP, internationella landskap och systemkonsolidering. | ~ | H | S2, S8
Business Transformation | 5 | ERP-driven transformation, processstandardisering, governance och internationell rollout är centrala styrkor. | ~ | H | S2, S3, S8
Strategisk rådgivning | 4 | Relevant i ERP-transformation och global template-arbete; bör verifieras i konkreta erbjudanden per kundcase. | ~ | M/H | S2, S8
Förvaltning | 4 | Livscykelstöd efter implementation är tydligt beskrivet. | ✓/~ | H | S2
Managed Services | 4 | Efter-go-live support, enhancements, integration support och release management finns i beskrivningen. | ✓/~ | H | S2
Internationell leverans | 5 | Tydlig internationell D365-modell med global template och lokala partners i 30+ länder. | ✓ | H | S8
SMB | 2 | Passar endast utvalda SMB-case med BC/industry-IP eller komplexitet; inte bäst som enkel lågkostnads-BC. | ~ | H | S4, S14
Enterprise | 4 | Starkt relevant för större midmarket/enterprise, särskilt inom F&SCM, supply chain och internationella krav. | ~ | H | S1, S3, S8
Huvudproduktområden i d365.se-modellen är Business Central, Finance & Supply Chain Management och CE/CRM. Commerce, HR, Project Operations och andra Dynamics 365-appar hanteras som tillvalsprodukter. Max tre branscher per produktområde används för filtrering.
Produktområde | Roll i erbjudandet | Kundnytta | Max 3 branscher för filter | Verifiering | Kommentar
F&SCM | Kärnerbjudande | Samlar finance, supply chain, lager, inköp, produktion och styrning i en skalbar enterprise-/midmarket-ERP-plattform. | Retail, Manufacturing, Wholesale/Distribution | ✓/~ H | Ska vara huvudfilter för BE-terna på d365.se.
Business Central | Sekundärt/kompletterande erbjudande | Ger ett mer SMB-/midmarket-orienterat ERP-alternativ och kan kopplas till BE-ternas egna branschappar. | Fashion, Professional Services, Retail/Wholesale | ✓/~ M/H | Visa inte som ren liten BC-specialist utan relevant scope.
CE/CRM | Sekundärt erbjudande | Stöd för sales, service, kunddata och kundprocesser i sammanhang där ERP och plattform hänger ihop. | Retail, Manufacturing, Services | ✓/~ M/H | Bra som kompletterande signal, inte primär CE-boutique-position.
Commerce | Tillvalsprodukt nära F&SCM | Relevant för retail/fashion där order, sortiment, lager, kanalflöden och kundupplevelse hänger ihop. | Retail, Fashion, Wholesale | ✓/~ H | Bör kopplas till retail/fashion-scenarier.
Power Platform | Komplement | Automatisering, appar och dataflöden runt Dynamics 365. | Manufacturing, Retail, Services | ✓/~ M/H | Stärker integrations- och automationsprofil.
Data & Analytics / Power BI | Komplement | Ger rapportering, insikter, dashboards och beslutsstöd för ERP- och supply chain-processer. | Manufacturing, Retail, Distribution | ✓/~ H | Använd som stark stödjande matchningssignal.
HR | Ej verifierat tillval | Kan finnas i koncernens breda D365-portfölj men ska inte matchas utan verifiering. | Ej filter | ? H | Kräver partnerbekräftelse.
Project Operations | Ej verifierat tillval | Ska inte visas som aktivt område utan partnerbekräftelse. | Ej filter | ? H | Professional Services-app ska inte automatiskt tolkas som D365 Project Operations.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp | Källa
Retail | Kärnbransch | Mycket hög | Tydlig koppling till F&SCM, Commerce, butik/e-handel, lager och branschflöden. BabyBjörn och d365.se-kundexempel stärker svensk relevans. | Kundcase/marknadsbudskap | S1, S7, S9
Fashion / Apparel | Kärnbransch | Hög | BE-terna har egen Fashion-lösning på Dynamics 365/Business Central/F&SCM/Commerce. | Egen IP/AppSource | S9
Manufacturing / Tillverkning | Kärnbransch | Hög | Tydligt i Tydab-historik, F&SCM och process-/supply-chain-scenarier. | Marknadsbudskap/historik | S2, S3, S6, S11
Wholesale / Distribution | Kärnbransch | Hög | Relevant för order, lager, inköp, logistik, supply chain och finansiell styrning. | d365.se/marknadsbudskap | S1, S2
Professional Services | Sekundär/kärna beroende scope | Medel/Hög | BE-terna har Professional Services-app för Business Central och d365.se nämner professional services. | Egen IP/AppSource | S1, S12
Processindustri | Sekundär/kärna beroende land | Medel/Hög | Process Manufacturing-add-on och svenskt innehåll kring processindustri gör området relevant, men lokal svensk referens bör verifieras. | Egen IP/AppSource/insikter | S11, S15
Financial Services | Generell erfarenhet | Medel | BE-terna nämner financial services i bred branschkommunikation, men svensk D365-referens behöver verifieras. | Marknadsbudskap | S2
Construction / Services & Rental | Sekundär | Medel | Förekommer i BE-ternas bransch-/services-kommunikation, men bör inte övermatchas i Sverige utan case. | Marknadsbudskap | S2
AI-fält | Bedömning | Status | Källa
AI-mognad | Medel till hög. BE-terna kommunicerar AI/automation och Agentic AI, men konkret svensk projektnivå bör verifieras. | ~ | S1, S2, S15
AI-readiness | Relevant genom datakvalitet, processstandardisering, integration, governance och Dynamics 365-plattformen. | ~ | S2, S3
Copilot | Copilot beskrivs i BE-ternas Dynamics 365-material som del av Microsoft-ekosystemet. Använd som försiktig matchningssignal. | ✓/~ | S2
Copilot Studio | Ej verifierat som tydligt erbjudande i svenskt material. Matcha endast som Power Platform/AI-komplement om kundbehov kräver det. | ?/~ | S14
Agents | Svensk BE-terna-sida innehåller material om Agentic AI och minskat manuellt arbete i säljorganisationer. | ✓/~ | S15
Konkreta AI-användningsfall | ERP/supply chain-analys, prognoser, automatisering, kundserviceflöden, säljstöd, rapportering och beslutsstöd. | ~ | S2, S15
ERP-nära AI | Stark matchningssignal när AI ska kopplas till finance, supply chain, lager, demand planning och processdata. | ~ | S2, S3
Dataförutsättningar | Power BI, data analytics, integration och ERP-datagrund bör ses som centrala för AI-mognaden. | ✓/~ | S2
AI-fält | Försiktig redaktionell bedömning | Status
Organisering av AI-kompetens | Sannolikt kombination av produkt-/ERP-team, Power Platform/BI-kompetens och koncerngemensam AI-/automationserfarenhet. Exakt modell bör verifieras. | d365.se-bedömning
AI-förmågor | Microsoft Standard AI/inbyggd Copilot, AI-readiness, Power Platform-automation, Power BI/Data Analytics, supply chain-analys och agentic AI-kommunikation. | Behöver partnerkompletteras
Relevanta Microsoft-områden | Dynamics 365 Finance, Supply Chain Management, Commerce, Business Central, Power Platform, Power BI/Fabric, Microsoft 365/Copilot och Azure-/integrationsnära områden. | d365.se-bedömning
Typiska AI-use cases | AI-readiness inför Copilot, automatisering av manuella backoffice-flöden, prognos/planering, rapportering, kundservice/säljstöd och datakvalitet. | Försiktig matchningsprofil
Erfarenhetsnivå | Redaktionell bedömning: från rådgivning/workshops och pilot/PoC till levererade kundprojekt; exakt nivå bör bekräftas av BE-terna. | Ej partnerbekräftad
Antal AI-projekt senaste 24 månaderna | Ej publikt kvantifierat i underlaget. Ska inte anges numeriskt utan partnerkomplettering. | Saknas
Område | Bedömning | Verif./Konf. | Kommentar
Data governance | Relevant men inte detaljerat verifierat i svensk profil. Bör kopplas till ERP-template, behörigheter, datakvalitet och AI-readiness. | ~ M/H | Starkt i större F&SCM-projekt.
Dataplattform | BE-terna erbjuder BI, data analytics och Dynamics 365-/Power Platform-nära dataflöden. Microsoft Fabric bör verifieras specifikt. | ✓/~ M/H | Bra som kompletterande signal.
Power BI | Power BI ingår i BE-ternas breda plattforms- och analytics-kommunikation. | ✓/~ H | Relevant vid rapportering och beslutsstöd.
Microsoft Fabric | Ej tydligt verifierat i svenska källor; använd som närliggande Microsoft Data & AI-filter endast om BE-terna bekräftar. | ? M | Verifiera före stark matchning.
Datakvalitet | Viktigt i F&SCM, migration, masterdata och AI-readiness. | ~ H | Stark logisk koppling till större ERP.
Rapportering | Relevant genom BI, dashboards och Dynamics 365-rapportering. | ✓/~ H | Bra i kundscenarier med ledningsuppföljning.
Analytics | Data analytics finns i BE-ternas breda erbjudande. | ✓ H | Använd som stödjande matchningssignal.
AI-grund | Data, integration och processstandardisering är centrala för att Copilot/AI ska fungera i affärsprocesser. | ~ H | Koppla till AI-readiness.
Område | Bedömning | Verif./Konf. | Matchningsanvändning
Integrationsarkitektur | Stark matchningssignal i F&SCM, multi-site och internationella ERP-projekt. | ~ H | Prioritera när kunden har flera system och global template.
Middleware | Specifik middleware-stack ej verifierad. Microsoft/Azure-integrationsnära kapacitet kan antas men bör kontrolleras per projekt. | ?/~ M | Fråga vid integrationsintensiva projekt.
API:er | Dynamics 365 och Microsoft-plattformen innebär API-/connector-behov; exakt erfarenhet bör verifieras vid komplexa landskap. | ~ M/H | Viktig i discovery.
EDI | Relevant för retail, distribution och supply chain. Tredjeparts-EDI-partnerskap ska verifieras. | ~ M/H | Matcha på behov men verifiera ISV.
Dataintegration | Stark koppling till migration, masterdata och reporting/analytics. | ~ H | Prioritera vid ERP-modernisering.
Drift och övervakning | Support, managed services och integration support anges i livscykelstöd, men exakt övervakningsmodell bör verifieras. | ✓/~ M/H | Fråga vid förvaltning.
Integrationskompetens | Hög relativt F&SCM-/enterprise-midmarketprofilen. | ~ H | Styr mot större integrationslandskap.
ISV-relationer ska inte automatiskt tolkas som auktoriserad återförsäljarstatus. För d365.se:s filter gäller: visa partnern under ett tillägg endast när auktorisation, partnerkatalog, partneruppgift, Microsoft Marketplace-post eller kundcase finns.
ISV / lösning | Roll i BE-terna-underlaget | Produktområde | Verifiering | Kommentar
BE-terna Fashion | Egen branschlösning / IP | Business Central samt F&SCM/Commerce beroende version | ✓ H | Stark egen ISV/IP-signal för fashion, apparel, retail, wholesale och manufacturing.
BE-terna Professional Services | Egen AppSource-lösning | Business Central | ✓ H | Stöd för kontrakt och återkommande fakturering i Business Central.
BE-terna Process Manufacturing | Egen lösning / AppSource-post | Dynamics 365-standard / processindustri | ✓ M/H | Relevant för processindustri, men exakt D365-produktkoppling och svensk användning bör verifieras.
BE-terna POS/Fashion Connector | Egen kompletterande lösning | Business Central / POS / Fashion | ✓ M/H | Relevant för fashion/retail-flöden och POS-koppling.
ExFlow / SignUp | Ej verifierad tredjepartsrelation | AP Automation / BC/F&SCM | ? H | Ska inte visas för BE-terna utan partnerbekräftelse, ISV-katalog eller kundcase.
Continia | Ej verifierad tredjepartsrelation | Business Central / dokument, expense, banking | ? H | Ska inte visas för BE-terna utan verifiering.
Golden EDI | Ej verifierad tredjepartsrelation | EDI / e-faktura / BC | ? H | Ska inte visas för BE-terna utan verifiering.
Qlik / UiPath / Infor | Teknik-/plattformspartnerskap i BE-ternas bredare erbjudande | BI, automation, ERP utanför D365 | ✓/~ H | Kan dokumenteras internt men ska inte användas som D365 ISV-filter utan tydlig koppling.
Område | Bedömning | Källa/konf.
Omsättning | 62 713 KSEK under 2024 enligt Bolagsfakta/Allabolag. Detta är lokal svensk bolagsdata och bör inte tolkas som BE-terna Groups totala storlek. | S13 / H
Medarbetare | 28 anställda 2024 enligt bolagsdata. Intern marknadskontext och historiska uppgifter pekar på cirka 30 i Sverige; aktuell konsultstyrka bör bekräftas. | S13, S14 / H/M
Tillväxt | Bolagsfakta anger -3,7% omsättningstillväxt 2024 mot föregående år. Tolkning ska göras försiktigt på grund av koncernstruktur och internationell leverans. | S13 / H
Förvärv | Svenska Tydab förvärvades/mergeades 2021. Telefónica Tech förvärvade BE-terna 2022. | S6, S7 / H
Marknadsposition | En tydlig F&SCM-/enterprise-midmarketaktör i Sverige, särskilt genom svensk AX/F&SCM-historik och europeisk koncernkapacitet. | S1, S6, S14 / H
Storlekskategori | Medelstor svensk enhet i större europeisk koncern. Ska jämföras med större F&SCM-specialister och europeiska D365-partners snarare än små BC-boutiques. | S13, S14 / H
Finansiell stabilitet | Lokal svensk resultaträkning visar negativt resultat 2024, men ägar- och koncernkontexten ger annan stabilitetsbild. Ska beskrivas neutralt och verifieras vid fördjupad analys. | S7, S13 / M/H
År/händelse | Beskrivning | Relevans
1991 | Den svenska juridiska enheten registrerades 1991 enligt bolagsdata. | Ger lokal historik och kontinuitet.
2021 | BE-terna förvärvade/gick samman med svenska Tydab, en tidig svensk D365 Finance & Supply Chain-/AX-partner med 100+ projekt. | Förklarar den svenska F&SCM-tyngden.
2021 | BE-terna förvärvade även SolutionHouse i Danmark/Nederländerna och hade tidigare investerat i Pipol. | Stärker nordisk/internationell Dynamics-kapacitet.
2022 | Telefónica Tech förvärvade BE-terna för att bygga en skalad europeisk position inom tech services och business applications. | Stärker koncernskala och strategisk stabilitet.
2024 | Publikt svenskt kundcase med BabyBjörn och Dynamics 365 Finance & Supply Chain Management. | Stark svensk referenssignal.
2025/2026 | BE-terna kommunicerar AI, supply chain-trender, Agentic AI, branschspecifika lösningar och events inom manufacturing/fashion. | Visar aktiv marknadskommunikation och fortsatt satsning.
Tema | Analys | Käll-/konfidensnot
Thought leadership | BE-terna kommunicerar kring supply chain-trender, AI/automation, digital transformation, branschprocesser och Dynamics 365-plattformen. | S2, S15 / H
Webbinarier/events | BE-terna har aktiv news/event-kommunikation, bland annat Hannover Messe och Texprocess 2026 inom manufacturing/fashion. | S15 / H
Kundcase | BabyBjörn är ett starkt svenskt D365 F&SCM-case. d365.se nämner även Nordiska Kompaniet, SAL Navigation och Nor:disk Clean Solutions som kundexempel; dessa bör verifieras med partnern före tung publik användning. | S1, S7 / H/M
Bloggar/insikter | Aktiv internationell och svensk insiktskommunikation inom ERP, AI, supply chain och branschlösningar. | S2, S15 / H
AI-kommunikation | Svenskt innehåll om Agentic AI och internationellt material om AI/ML i Dynamics 365/supply chain. | S15, S2 / M/H
ERP-kommunikation | Mycket tydlig. Dynamics 365 Finance & Supply Chain Management och Business Central har egna erbjudandesidor. | S3, S4 / H
Aktivitetstakt | Högre än många mindre svenska D365-partners genom europeisk innehållsmotor och återkommande bransch-/eventmaterial. | S15 / M/H
Taggkategori | Taggar
Produktområden | fscm; finance; supply_chain_management; commerce; business_central_secondary; ce_crm_secondary; power_platform; data_analytics; power_bi; ai_copilot; managed_services; integration
Branscher | retail; fashion_apparel; manufacturing; wholesale_distribution; professional_services; process_industry; services_rental
Kompetenser | erp_transformation; global_template; multi_site_rollout; supply_chain; warehouse; commerce; process_standardization; governance; data_migration; release_management; business_process_consulting
Kundstorlek | midmarket; upper_midmarket; enterprise; international_group; multi_company
Projektstorlek | medium_project; large_project; transformation_program; multi_country_rollout; managed_services_after_go_live
Geografi | sweden; nordics; europe; international_delivery; local_sweden_halmstad_helsingborg; partner_network_30_plus_countries
ISV/IP | be_terna_fashion; be_terna_professional_services; be_terna_process_manufacturing; be_terna_pos_connector; third_party_isv_unverified
Ej avsedd för extern publicering. Används för AI-rankning, redaktionell jämförelse och intern förståelse av när BE-terna bör respektive inte bör prioriteras.
Del | Bedömning
Primära konkurrenter | Columbus, Cepheo, Implema, Engage, CGI, Cegeka, Nexer och HSO i större F&SCM-/ERP-affärer.
Angränsande konkurrenter | Fellowmind, COSMO CONSULT, Avanade/Accenture, Capgemini/Sogeti och Sopra Steria beroende på projektets skala och Microsoft-plattformsbredd.
Konkurrensfördelar | Svensk F&SCM-historik via Tydab, europeisk leveranskapacitet, internationell rollout-modell, retail/fashion-IP och stark ERP-/processprofil.
När andra partnerkategorier kan vara starkare | Små BC-specialister vid enklare SMB-projekt; CRM-specialister vid ren CE/CRM-spets; globala SI:er vid extrem global transformation med management consulting-tyngd; ISV-specialister när en specifik tilläggsprodukt är huvudkriteriet.
Jämförelse | BE-ternas relativa position
Mot Business Central-specialister | Starkare i F&SCM, supply chain, enterprise-midmarket och internationell rollout. Svagare som enkel, snabb och lågkostnads-BC-partner.
Mot CRM-specialister | Starkare där CRM behöver kopplas till ERP, data och processer. Svagare vid ren CE/CRM-boutique-spets.
Mot globala systemintegratörer | Mer Dynamics-/business applications-specialiserad och sannolikt mer fokuserad än Big Four/global SI, men med mindre global management consulting-tyngd.
Mot traditionella ERP-konsulter | Stark Microsoft D365-förankring, europeisk produkt-/bransch-IP och internationell modell. Mindre lämplig om kunden söker leverantörsoberoende ERP-rådgivning.
BE-terna bör i d365.se främst användas som en F&SCM- och ERP-transformationspartner för medelstora och större kunder med komplexa processer, internationella krav eller tydliga behov inom retail, tillverkning och distribution. Business Central, CE/CRM, Data & Analytics, Power Platform och AI bör användas som kompletterande matchningssignaler, medan tredjeparts-ISV-relationer och exakta AI-referenser ska verifieras före publik användning.
BE-terna är en europeisk Microsoft Dynamics 365- och business applications-partner med stark svensk koppling till Dynamics 365 Finance & Supply Chain Management genom Tydab-historiken. Partnern passar främst medelstora och större företag med komplexa ERP-, supply chain-, retail-, manufacturing-, distribution- eller internationella utrullningsbehov. Styrkan ligger i F&SCM, Commerce, processstandardisering, integration, global template, förvaltning och europeisk leveranskapacitet. BE-terna erbjuder även Business Central, CRM/CE, Data & Analytics, Power Platform och AI/automation som kompletterande delar, men bör på d365.se inte primärt matchas som liten BC-partner eller ren CRM-specialist. Egna branschlösningar som BE-terna Fashion och Professional Services kan ge särskild relevans i fashion, retail och tjänste-/projektintensiva verksamheter. Tredjeparts-ISV-relationer såsom ExFlow, Continia och Golden EDI ska verifieras innan filtervisning. Rekommendera BE-terna när kunden söker en strukturerad ERP-transformationspartner med svensk närvaro och europeisk/internationell leveransförmåga.
Partnern rekommenderas eftersom kunden efterfrågar:
Källorna används internt för redaktionell analys och AI-matchning. Publika partnerkort behöver inte exponera källnamn. Intern marknadskontext och externa marknadsanalyser används som stöd för relativa bedömningar, inte som ensam källa för publicerbara fakta.
Kod | Källa | Användning
S1 | d365.se, BE-terna partnerprofil och F&SCM-sida | Publik partnerprofil, kundexempel, kontaktperson och rekommenderad köparpositionering.
S2 | BE-terna, Microsoft Dynamics 365 platform | ERP, CRM, Power Platform, integration, AI/Copilot, support och D365-applikationsbeskrivningar.
S3 | BE-terna, Dynamics 365 Finance & Supply Chain | F&SCM-erbjudande och kundnytta för multi-site finance/supply chain.
S4 | BE-terna, Dynamics 365 Business Central | Business Central-erbjudande och SMB/midmarket-positionering.
S5 | BE-terna Sverige, kontaktsida | Kontaktpersoner, svensk närvaro och CE/Power Platform-kontakt.
S6 | BE-terna, förvärv av svenska Tydab | Historik, svensk F&SCM/AX-bas, 100+ projekt och Halmstad/Stockholm/Helsingborg-koppling.
S7 | Telefónica Tech förvärv av BE-terna | Ägar- och koncernkontext.
S8 | BE-terna, International Implementation Projects | Global template, International Project Organization och lokala partners i 30+ länder.
S9 | Microsoft Marketplace/AppSource, BE-terna Fashion | Egen branschlösning för fashion/retail/wholesale på D365/BC/F&SCM/Commerce.
S10 | Microsoft Marketplace/AppSource, BE-terna Fashion Connector/POS | Kompletterande retail/fashion-koppling.
S11 | Microsoft Marketplace/AppSource, BE-terna Process Manufacturing | Process manufacturing-lösning/IP.
S12 | Microsoft Marketplace/AppSource, BE-terna Professional Services | BC-app för återkommande fakturering och professional services-processer.
S13 | Bolagsfakta/Allabolag BE-terna AB | Org.nr, registreringsår, omsättning, resultat och antal anställda.
S14 | Intern marknadskontext och d365.se-redaktionell analys | Konkurrentgrupper, marknadsarena, matchningslogik och relativa styrkor.
S15 | BE-terna Sverige, nyheter/insikter och AI-/branschkommunikation | Agentic AI, supply chain, manufacturing/fashion och marknadsaktivitet.$txt$, source_document_filename = 'be_terna_ai_partnerunderlag_d365_v1-2.docx', source_document_updated_at = now() WHERE slug = 'be-terna';
UPDATE public.partners SET source_document_text = $txt$Bisqo
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI-matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Informationen kan bygga på partnerinlämnad data, befintlig d365.se-profil, offentliga källor och redaktionell eller AI-assisterad komplettering.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s ISV-/tilläggsfilter bör endast visa Bisqo under ett specifikt Business Central-tillägg när auktorisation, partnerkatalog, partnerinlämnad uppgift eller dokumenterat kundcase styrker relationen. Att Bisqo generellt kan Business Central eller integration är inte tillräckligt för att visa partnern under ett specifikt tillägg.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Små och medelstora företag som vill införa Dynamics 365 Business Central med tydligt scope, standardförst och snabb start. [✓/~ H, S1/S2]
Bolag som sitter i äldre affärssystem, exempelvis C5, Visma, NAV eller Business Central On-Premise, och vill till Business Central Online. [✓/~ H, S2/S4]
Grossist-, distributions-, handels-, retail-/e-handels- och tillverkningsnära verksamheter med behov av order, lager, ekonomi och integrationer. [✓/~ H, S4/S5]
Kunder som vill kombinera Business Central med CRM på Power Platform, Dynamics 365 Sales eller kundserviceflöden. [✓/~ M/H, S3]
Kunder som föredrar fast pris, fast scope, tydlig implementeringsmodell och låg risk framför mycket omfattande skräddarsydda projekt. [✓/~ H, S1/S2]
Befintliga BC-/CRM-kunder som behöver löpande support, uppdateringar, tilläggshantering, utbildningsmaterial och proaktiv rådgivning. [✓ H, S4]
Organisationer som vill använda Power BI, Power Platform, automatisering och enklare AI-/Copilot-förmågor nära affärsprocesserna. [✓/~ M, S3/S5]
8. Mindre lämplig för
Stora enterpriseprogram där Dynamics 365 Finance & SCM, global template rollout, tung programstyrning och komplex koncernarkitektur är huvudkrav. [~ H, S1-S6]
Kunder som primärt söker en global SI, Big Four/advisory-partner eller mycket stor leveransorganisation. [~ H, S9]
Projekt där särskilt avancerad tillverkning, supply chain planning eller global lager-/produktionsstyrning kräver F&SCM snarare än Business Central. [~ H, S5/S9]
Kunder som enbart söker lägsta möjliga pris och inte värderar metodik, rådgivning, support eller standardiserad förändringsledning. [~ M, S1/S2]
Projekt där en specifik ISV-lösning är huvudkrav och Bisqos auktorisation eller erfarenhet för just den lösningen inte är verifierad. [~ H, S6]
Stora CRM/CE-program med avancerad marketing automation, contact center, field service eller multi-country kunddataplattform som kräver dedikerad CE-specialist. [~ M/H, S3/S9]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Snabb väg från äldre affärssystem till Business Central Online
Ett mindre eller medelstort företag sitter i ett äldre ERP-system och vill komma till molnet utan ett tungt, flerårigt projekt. Bisqo är relevant när kunden vill ha tydligt scope, snabb start, standardfunktionalitet och verksamhetsnära rådgivning.
Scenario 2 - NAV/Business Central On-Premise till molnet
Kunden kör NAV eller Business Central On-Premise och vill genomföra ett kontrollerat molnlyft med datamigrering, konfigurering, användarstöd och utbildning. Elevate passar som tydlig metodik.
Scenario 3 - Grossist, handel eller e-handel med order, lager och integrationer
Ett handels- eller distributionsbolag behöver bättre kontroll över order, lager, ekonomi, e-handel och integrationer. Bisqo är relevant när Business Central ska bli navet och tillägg/integrationer behöver kopplas på.
Scenario 4 - Växande B2B-säljorganisation behöver CRM och 360-kundvy
Kunden har kunddata i Excel, e-post eller spridda system och vill skapa pipeline, struktur, dashboards och kundinsikt i Dynamics 365 Sales eller CRM på Power Platform.
Scenario 5 - Befintlig BC-/CRM-kund behöver stöd efter go-live
Kunden har BC eller CRM i drift och behöver löpande support, uppdateringar, tilläggshantering, utbildningsmaterial och proaktiv rådgivning för att fortsätta utveckla lösningen.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
16. Integration
17. ISV-lösningar och Dynamics 365-tillägg
18. Ekonomi, storlek och marknadsposition
19. Historik och utveckling
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: stark paketering och tydlig standardförst-/fast scope-logik; dessutom CRM på Power Platform som komplement.
Mot CRM-specialister: starkare ERP-/Business Central-kärna och möjlighet att koppla CRM till affärssystem och order-/lagerflöden.
Mot globala systemintegratörer: snabbare, mer kundnära och mer kostnadseffektivt för SMB/midmarket där stor SI-kapacitet blir överdimensionerad.
Mot traditionella ERP-konsulter: modern moln-, standard- och Land and Expand-position med tydligt stöd efter go-live.
23. Kundorienterad partnerbeskrivning
Bisqo är en svensk Microsoft-partner med tydlig tyngdpunkt på Dynamics 365 Business Central och CRM på Power Platform. Partnern passar särskilt väl för mindre och medelstora företag som vill modernisera sitt affärssystem utan att driva ett onödigt tungt projekt. Bisqos profil är standardiserad, paketerad och praktiskt affärsnära: fokus ligger på att komma igång snabbt, använda beprövad funktionalitet och därefter bygga vidare när verksamheten växer.
För en Dynamics 365-kund är Bisqo mest relevant när Business Central ska bli navet för ekonomi, order, lager, försäljning och verksamhetsstyrning. Paketeringarna FastTrack och Elevate gör partnern särskilt intressant för företag som sitter i äldre system eller NAV/Business Central On-Premise och vill ta steget till Business Central Online. Kundcase visar exempel på snabba projekt där kunden samtidigt behövt förändra arbetssätt, migrera data och skapa en mer skalbar plattform.
Bisqo ska däremot inte främst förstås som en Finance & Supply Chain Management-partner eller global systemintegratör. I stora enterpriseprogram, koncernövergripande ERP-transformationer eller mycket komplexa F&SCM-projekt är andra partnerkategorier normalt mer relevanta. Bisqos styrka ligger i tydliga BC-/CRM-scenarier där kunden vill ha ett nära team, strukturerad metodik, fast scope och långsiktig support efter go-live.
För d365.se bör Bisqo därför positioneras som en specialist för Business Central i SMB/midmarket, kompletterad med CRM på Power Platform, Power BI, integrationer, ISV-/tilläggsekosystem och löpande Service & Support. Den mest träffsäkra matchningen uppstår när kunden söker praktisk affärsnytta, standardisering, molnresa och utveckling i kontrollerade steg snarare än ett stort och komplext transformationsprogram.
24. AI-sammanfattning
25. Varför denna partner?
✓ Kunden söker Business Central för SMB/midmarket.
✓ Kunden vill ha standardiserad implementation med fast scope och låg projektrisk.
✓ Kunden vill flytta från äldre ERP, NAV eller Business Central On-Premise till Business Central Online.
✓ Kunden behöver koppla ihop ekonomi, order, lager, försäljning och kunddata.
✓ Kunden vill komplettera Business Central med CRM på Power Platform eller Dynamics 365 Sales.
✓ Kunden vill ha löpande support, uppdateringar, tilläggshantering och proaktiv rådgivning.
✓ Kunden är handels-, distributions-, retail/e-handels- eller produkt-/tillverkningsnära verksamhet.
✓ Kunden vill ha en mindre/nära partner snarare än global SI eller stor enterprise-partner.
26. Kontrollpunkter inför publicering
Kontrollera aktiva produktområden: Business Central, CE/CRM, Sales, Customer Service, Customer Insights, Power Platform, Power BI och integration.
Bekräfta att F&SCM, Project Operations, Commerce, Human Resources, Field Service och Contact Center inte ska visas som aktiva områden.
Bekräfta om Bisqo är auktoriserad partner för specifika Business Central-tillägg: Continia, Golden EDI, AGR, SmartApps, Truvio och eventuella övriga.
Kontrollera om ExFlow, Logtrade, Dynamicweb eller andra vanligt förekommande ISV-lösningar ska kopplas till Bisqo eller markeras som ej verifierade.
Bekräfta vilka tre branscher som ska användas per produktområde i d365.se:s filter.
Bekräfta aktuell konsultstyrka, omsättning, ägarstruktur och om bolagsdata eller grupp-/verksamhetsdata ska användas.
Bekräfta kontaktperson och kontaktväg på d365.se: Daniel Vesterberg eller annan ansvarig per produktområde.
Kontrollera geografisk leverans: Sverige, Norden, Europa och globalt ska inte visas starkt utan tydlig leveransmodell.
Kontrollera AI-erbjudande, Copilot-/agentkompetens, antal AI-projekt senaste 24 månaderna och eventuella kundcase.
Kontrollera Service & Support-modell, SLA, supportnivåer, uppdateringshantering och tilläggshantering.
Kontrollera Microsoft-status: Solutions Partner for Business Applications, certifieringar och eventuella Microsoft-utmärkelser innan publik visning.
26A. Kontrollworkflow och statusfält
27. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Bisqo | ✓ | H | S1, S5
Juridisk enhet | Bisqo AB. Organisationsnummer 556265-0795. Juridisk person registrerad 1987-12-15; den nuvarande Bisqo-verksamheten kommunicerar egen start den 1 oktober 2023. Skillnaden bör behållas som separat datapunkt. | ✓/~ | H | S7, S1
Partnertyp och egen beskrivning | Svensk nischad Microsoft-partner med tyngdpunkt på Dynamics 365 Business Central och CRM på Power Platform. Kommunicerar standardiserade lösningar, paketerad implementation, fast scope/fasta prisupplägg och långsiktigt stöd. | ✓/~ | H | S1, S2, S4
Primära produktområden | Business Central (BC), CRM på Power Platform, Dynamics 365 Sales, Service/Support kopplat till BC och CRM, Power Platform, Power BI och integrationer. | ✓/~ | H | S1, S2, S3, S5
Sekundära produktområden | Dynamics 365 Customer Service, Customer Insights - Journeys, RapidStart CRM, ClickDimensions, Business Central-tillägg/ISV-ekosystem samt enklare AI-, Copilot- och automationsnära rådgivning. | ✓/~ | M/H | S3, S6
Områden som inte verifierats | Finance & SCM, Project Operations, Commerce, Human Resources, Field Service som leveransområde, Contact Center samt större enterprise-CRM-program. Dessa ska endast visas efter ny verifiering. | ? | H | S1-S6
Typisk kundstorlek | Primärt små och medelstora företag samt nedre och mellersta midmarket. d365.se-profilen anger främst 50-999 anställda, medan Bisqos egen kommunikation betonar små och medelstora företag. | ✓/~ | H | S1, S5, S10
Typisk projektstorlek | Små till medelstora BC-/CRM-projekt med tydligt scope, standard först, fast pris och snabb implementation. Inte primärt mycket stora F&SCM-program eller globala rollout-program. | ~ | H | S2, S4, S5
Geografisk leveranskapacitet | Svensk leverans med kontor i Helsingborg och Malmö. d365.se-profilen anger Sverige, Norden, Europa och globalt, men faktisk leveransmodell bör verifieras per projekt. | ✓/~ | M/H | S1, S5
Branschfokus | Grossist/distribution, retail/e-handel/handel, tillverkning/produktion samt handelsnära företag med integrationsbehov. Referenser visar bland annat fordonsbelysning, hjälpmedel och belysningsbolag. | ✓/~ | H | S4, S5
AI-mognad | Grundläggande till medel. Bisqo kommunicerar AI, automation, BC release wave och AI-insikter i D365 Sales, men d365.se anger AI-mognad som grundläggande och antal AI-projekt är inte publikt verifierat. | ✓/~ | M | S3, S5, S9
Förvaltningskapacitet | Tydligt erbjudande för Service & Support med fast månadspris, fri support, löpande uppdateringar, hantering av tilläggsappar, utbildningsmaterial och proaktiv rådgivning. | ✓ | H | S4
Internationell leveransförmåga | Begränsat verifierad. D365.se anger bredare geografisk leverans, och kundexempel kan ha internationella marknader, men Bisqos egen kontorsnärvaro är lokal i södra Sverige. | ~ | M | S1, S4, S5
Transformationskapacitet | Hög inom standardiserad SMB-/midmarket-transformation till Business Central Online och CRM på Power Platform. Mer begränsad relevans för komplex enterprise-transformation, F&SCM och stora globala program. | ~ | H | S1-S5
Unika särskiljande egenskaper | Land and Expand, FastTrack, Elevate, standard först, tydligt scope, fast pris, månadsabonnemang och kombinationen BC + CRM på Power Platform för mindre och medelstora kunder. | ✓/~ | H | S1, S2, S4
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på Bisqos egen webb, d365.se-profil, bolagsdata eller redaktionellt tillägg med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas som direkt kundtext i publik partnerprofil.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, referenser och exakta produktområden. | Bör verifieras extra innan publicering eller stark matchningsvikt.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: bisqo
partner_name: Bisqo
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_submitted_source: not_available_in_this_run
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  main_product_areas:
    business_central: high_primary
    finance_supply_chain_management: not_active
    ce_crm: medium_secondary
  optional_dynamics_products:
    sales: medium_high_active
    customer_service: medium_secondary
    customer_insights_journeys: medium_secondary
    field_service: not_verified
    commerce: not_verified
    human_resources: not_verified
    project_operations: not_verified
  platform_adjacent:
    power_platform: high
    power_bi: medium_high
    data_ai: medium
    integration: high
    managed_services: high
  isv_scope:
    business_central_addons: verified_per_partner_or_isv_source_only
    listed_by_bisqo_partners_page:
      - continia
      - golden_edi
      - smartapps
      - agr
      - clickdimensions
      - truvio
      - rapidstart_crm
    exflow: not_verified
    do_not_infer_authorization_for_other_addons: true
delivery_profile:
  micro: medium
  smb: very_high
  midmarket: high
  upper_midmarket: medium
  enterprise: low
project_size:
  small: high
  medium: high
  large: low
delivery_focus:
  bc: very_high
  fscm: very_low
  ce_crm: medium_high
  data: medium
  ai: medium
  integration: high
  transformation: medium_high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: false
  show_under_ce_crm: true_secondary
  show_under_sales: true_secondary
  show_under_customer_service: true_secondary_if_scope_matches
  show_under_customer_insights: true_secondary_if_scope_matches
  show_under_field_service: false_unless_new_partner_update
  show_under_project_operations: false
  show_under_commerce: false
  show_under_human_resources: false
  show_under_power_platform: true_adjacent_signal
  show_under_power_bi: true_adjacent_signal
  show_under_data_ai: true_adjacent_basic
  show_under_integration: true_strong_signal
  show_under_managed_services: true_strong_signal
  show_under_isv_filters: only_if_isv_authorized_or_verified
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | Business Central är tydligt kärnområde och förstahandspositionering.
CRM / Customer Engagement-fokus | 3/5 | M/H | CRM på Power Platform, Dynamics 365 Sales, Customer Service och Customer Insights kommuniceras, men främst som SMB-/midmarket-komplement till BC snarare än enterprise-CE-specialism.
Business Central-fokus | 5/5 | H | Bisqo positionerar sig som specialist på Business Central och har paketerade erbjudanden för nyimplementation och molnlyft.
Finance & SCM-fokus | 1/5 | H | Inget verifierat F&SCM-erbjudande. Ska inte matchas mot F&SCM utan ny verifiering.
AI / Copilot / Agents | 3/5 | M | AI nämns i content, release-kommunikation och rekrytering/kompetens, men projektvolym och kundcase är inte verifierade.
Data & Analytics | 3/5 | M | Power BI och datadriven försäljning/360-kundvy är relevanta, men Microsoft Fabric/dataplattform är inte verifierat som kärnerbjudande.
Integration | 4/5 | H | Integration är central i BC-/CRM-nära scenarier, ISV-ekosystemet, e-handel/handel och kundcase.
Business Transformation | 4/5 | H | Stark i praktisk affärsförändring för SMB/midmarket: standardisering, molnresa, datamigrering och processförbättring.
Strategisk rådgivning | 3/5 | M | Tydlig rådgivning i förstudie/30-minutersgenomgångar, men inte positionerad som management/advisory-partner.
Förvaltning / Managed Services | 4/5 | H | Service & Support med fast månadspris, uppdateringar, tilläggshantering och proaktiv rådgivning.
Branschspecialisering | 3/5 | M/H | Kundcase och d365.se visar handel/distribution/tillverkning, men branscher bör begränsas till max tre per produktområde.
Internationell leverans | 2/5 | M | Lokal svensk organisation; d365.se anger bredare geografi, men konkret modell bör verifieras.
SMB-fokus | 5/5 | H | Bisqo är tydligt fokuserat på små och medelstora företag.
Enterprise-fokus | 1/5 | H | Mindre relevant för stora enterpriseprogram, global governance eller F&SCM.
Standardisering | 5/5 | H | Standard först, FastTrack, Elevate, fast scope och fasta prisupplägg är centrala i erbjudandet.
Innovation | 3/5 | M | AI, automation, Power Platform och aktiva nyheter visar utvecklingsvilja, men AI-leveransnivå kräver verifiering.
Leveransbredd | 3/5 | M/H | Bred inom BC + CRM + Power Platform + support, men inte bred över hela Dynamics 365-portföljen.
Partner-DNA typ: Business Central- och CRM på Power Platform-specialist för SMB/midmarket. Tolkning: Bisqo bör matchas när kunden vill ha ett standardiserat, snabbt och förutsägbart BC- eller CRM-projekt med tydlig affärsnytta, snarare än ett stort F&SCM- eller globalt enterpriseprogram.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medelhög säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Nischad svensk Business Central-partner med CRM på Power Platform, paketerad implementation, stark standardiseringslogik och tydligt SMB-/midmarket-fokus. | ~ | H | S1-S5
Tydlig köparnytta | Kunden får en partner som kan ta ett mindre eller medelstort företag från äldre ERP/NAV/Visma/C5 eller enklare system till Business Central Online, kompletterat med CRM, Power Platform, Power BI, integration och löpande support. | ~ | H | S2-S5
Matchningslogik | Prioriteras när kunden söker Business Central, standardiserat scope, snabb implementation, NAV/BC On-Premise till moln, CRM för sälj/kundservice eller BC-nära integrationsbehov. | ~ | H | S2-S5
Positioneringsgränser | Ska inte positioneras som F&SCM-partner, global SI, djup enterprise-CE-partner eller primär AI-/Fabric-partner utan ytterligare verifiering. | ~ | H | S1-S6
Denna sektion styr hur Bisqo bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut är inte samma sak som fullständig kompetensbedömning; de anger hur starkt partnern bör viktas i matchningslogiken.
Filterområde | Beslut för Bisqo | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Kärnerbjudande med FastTrack, Elevate, kundcase och d365.se-profil.
F&SCM | Visa inte som aktiv partner. | Ingen/låg | ? | Inget verifierat Finance & SCM-erbjudande.
CE/CRM | Visa som sekundär/stark kompletterande partner. | Hög vid SMB/midmarket | ✓/~ | CRM på Power Platform, Dynamics 365 Sales, Customer Service och Customer Insights kommuniceras.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | CRM, lågkod, automation och anpassningar runt BC/CRM.
Data & AI | Visa som kompletterande signal, ej AI-specialist. | Medel | ~ | AI och datadriven försäljning kommuniceras, men AI-mognad bör hållas försiktig tills projektvolym verifierats.
Power BI / Analytics | Visa som kompletterande signal. | Medel/hög | ✓/~ | Power BI nämns i d365.se-profil och CRM-/rapporteringsteman.
Integration | Visa som stark kompletterande signal. | Hög | ✓/~ | Handel, e-handel, CRM och ISV-ekosystem gör integration relevant.
Managed Services / Support | Visa som aktivt förvaltnings-/supporterbjudande. | Hög | ✓ | Service & Support med fast månadspris, uppdateringar och tilläggshantering.
ISV-lösningar | Visa endast per verifierad ISV-/partnerrelation. | Endast verifierad matchning | ?/✓ | Bisqo listar flera partners, men d365.se bör inte inferera auktorisation utan källa.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  bisqo_listed_partner_ecosystem:
    - continia
    - golden_edi
    - agr
    - smartapps
    - clickdimensions
    - truvio
    - rapidstart_crm
  exflow: not_verified
  verification_required_for_addons_from:
    - isv_authorization
    - isv_partner_directory
    - partner_submitted_information
    - documented_customer_case
  do_not_infer_authorization_for_other_addons: true
Denna sektion gör partnerprofilen jämförbar mellan olika Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
Fält | Värde för Bisqo | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Business Central / SMB-midmarket | Använd som huvudkategori när kunden söker Business Central, standardiserad implementation, NAV/BC-molnlyft eller SMB/midmarket-ERP. | H | S1, S2, S5, S9
Sekundära arenor | CE/CRM på Power Platform, integration, Managed Services och BC-tillägg/ISV-ekosystem | Använd när kunden vill komplettera ERP med säljprocess, kundservice, 360-kundvy, Power Platform eller tillägg. | M/H | S3, S4, S6
Partnerkategori | Svensk BC-specialist med CRM/Power Platform-komplement | Skiljer Bisqo från breda Microsoft-partners, F&SCM-specialister och rena CRM-boutiques. | H | S1-S6
Primär jämförelsegrupp | NAB Solutions, BrightCom, Adbriq, Navcite, Goodfellows, Update, InBiz, Compago och andra BC-specialister | Använd vid jämförelser där kunden söker BC-partner för SMB/midmarket, handel, distribution eller standardiserad implementation. | M | S5, S9
Angränsande jämförelsegrupp | Fellowmind, Accigo, Evidi, COSMO CONSULT, Cepheo | Relevant när kunden vill jämföra Bisqo mot större/bredare Microsoft-partners med mer leveranskapacitet. | M | S5, S9
Lägre relevans i jämförelse | Implema, BE-terna, Engage, CGI, Avanade/Accenture, HSO och renodlade F&SCM/global SI-aktörer | Använd som lägre jämförelse när kundens behov är SMB/midmarket BC snarare än enterprise F&SCM. | M | S9
Fakta | Värde | Verif. | Konf. | Källa
Partner | Bisqo | ✓ | H | S1, S5
Juridisk enhet | Bisqo AB | ✓ | H | S7
Organisationsnummer | 556265-0795 | ✓ | H | S7
Registreringsdatum juridisk enhet | 1987-12-15 | ✓ | H | S7
Grundande av nuvarande Bisqo-verksamhet | Bisqo anger att den nuvarande verksamheten grundades den 1 oktober 2023. Extern intern källa anger annat etableringsår; detta bör verifieras vid partnerdialog. | ✓/~ | M/H | S1, S9
Huvudkontor/kontor | Helsingborg och Malmö. Adresser: Redaregatan 48, Helsingborg; Gustav Adolfs Torg 10B, Malmö. | ✓ | H | S1
Ägarstruktur | Privatägt enligt intern marknadskontext. Exakt ägarbild bör kontrolleras före publicering om den ska visas. | ~ | M | S9
Omsättning | 29 423 KSEK 2025 enligt Bolagsfakta. Intern marknadskontext anger högre nivå; använd bolagsdata som publik bas och markera jämförelser som osäkra. | ✓/~ | H/M | S7, S9
Antal anställda | 16 anställda 2025 enligt Bolagsfakta. Intern marknadskontext anger cirka 30; verifiera aktuell konsultstyrka med partnern. | ✓/~ | H/M | S7, S9
Geografisk närvaro | Sverige med stark lokal närvaro i Skåne/södra Sverige. d365.se anger Sverige, Norden, Europa och globalt; verifiera faktisk modell per uppdrag. | ✓/~ | M/H | S1, S5
Viktiga erbjudanden | Business Central, FastTrack, Elevate, CRM på Power Platform, Dynamics 365 Sales, Customer Service, Customer Insights, RapidStart CRM, Service & Support, Power BI och integrationer. | ✓/~ | H | S1-S6
Kontaktperson d365.se | Daniel Vesterberg anges på d365.se-profilen med e-post daniel.vesterberg@bisqo.se. | ✓/~ | M/H | S5
Storlekskategori | Liten/medelstor nischad BC-/CRM-partner med tydligt SMB-/midmarket-fokus. | ~ | H | S1, S5, S7
Prioritera Bisqo när | Signalstyrka | Konfidens
Kunden söker Business Central för SMB/midmarket och vill ha standardiserad, snabb och förutsägbar implementation. | Mycket stark | H
Kunden använder äldre ERP/NAV/BC On-Premise/C5/Visma och vill till Business Central Online. | Mycket stark | H
Kunden har handels-, distributions-, e-handels-, lager- eller produkt-/orderflöden med integrationsbehov. | Stark | H
Kunden vill kombinera BC med CRM på Power Platform, Dynamics 365 Sales eller en 360-graders kundvy. | Stark | M/H
Kunden behöver löpande support, uppdateringar, tilläggsappar, utbildningsmaterial och proaktiv rådgivning efter go-live. | Stark | H
Kunden efterfrågar fast scope, fast pris, månadsabonnemang eller ett Land and Expand-upplägg. | Mycket stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Kunden söker F&SCM, global SI, stort enterpriseprogram eller tung programstyrning. | Stark nedviktning | H
Kunden kräver dokumenterad auktorisation för ett specifikt BC-tillägg där Bisqo inte är verifierad. | Stark nedviktning | H
Kunden vill ha avancerad CE/CRM-specialist för större marketing automation, Contact Center eller Field Service-program. | Medel nedviktning | M/H
Projektet är så litet att kunden endast söker enklaste möjliga lågkostnadsupplägg utan rådgivning eller supportbehov. | Medel nedviktning | M
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras. | Kräver förtydligande | H
negative_match_rules:
  finance_supply_chain_management_project: avoid
  global_enterprise_template_rollout: avoid
  lowest_price_selection: reduce_priority
  specific_bc_addon_without_isv_authorization: avoid
  advanced_enterprise_ce_without_partner_confirmation: reduce_priority
  unclear_product_scope: require_clarification
  public_use_of_internal_competitor_analysis: prohibited
matching_confidence:
  high: bc_smb_midmarket_standardized_scope_or_cloud_migration
  medium: crm_power_platform_or_ai_adjacent_need_with_clear_scope
  low: fscm_enterprise_global_si_or_unverified_isv_requirement
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 4 | Starkt ERP-fokus via Business Central, men inte F&SCM. | ✓/~ | H | S1/S2
CRM | 3 | CRM på Power Platform, Sales, Customer Service och Customer Insights kommuniceras. | ✓/~ | M/H | S3
Customer Engagement | 3 | CE-förmåga finns, men främst SMB/midmarket och inte full enterprise-CE-specialism. | ✓/~ | M | S3/S9
Business Central | 5 | Kärnerbjudande, paketering, kundcase och d365.se-positionering. | ✓/~ | H | S1/S2/S5
Finance & SCM | 1 | Inget verifierat erbjudande. | ? | H | S1-S6
AI/Copilot | 3 | AI nämns i nyheter, CRM/BC och kompetenskommunikation, men projektvolym är inte verifierad. | ✓/~ | M | S3/S5
Data & Analytics | 3 | Power BI och datadriven sälj-/kundvy finns, men Fabric/dataplattform ej verifierad. | ✓/~ | M | S3/S5
Power Platform | 4 | Central för CRM, lågkod, automation och anpassning. | ✓/~ | H | S1/S3
Integration | 4 | Viktig vid e-handel/handel, ISV, BC och kundcase. | ✓/~ | H | S4/S6
Business Transformation | 4 | Stark i standardiserad förändring från gamla system till BC Online. | ✓/~ | H | S2/S4
Strategisk rådgivning | 3 | Rådgivning finns, men partnern är inte positionerad som management/advisory. | ~ | M | S1/S2
Förvaltning | 4 | Service & Support är tydligt beskrivet. | ✓ | H | S4
Managed Services | 3 | Fast månadspris/support/uppdateringar; inte verifierat som fullskalig managed services-organisation. | ✓/~ | M/H | S4
Internationell leverans | 2 | Svensk lokal partner; bredare geografi bör verifieras. | ~ | M | S1/S5
SMB | 5 | Tydlig kärnmålgrupp. | ✓/~ | H | S1/S10
Enterprise | 1 | Inte optimal för enterprise-F&SCM eller global SI-program. | ~ | H | S9
Huvudproduktområden på d365.se: BC, F&SCM och CE/CRM. Tillvalsprodukter från Microsoft Dynamics 365 hanteras separat. Varje huvudområde bör ha max tre branscher för filterlogik.
Produktområde | Roll i erbjudandet | Kundnytta | Max 3 branscher för filter | Verifiering | Kommentar
Business Central (BC) | Kärnerbjudande | Samlar ekonomi, order, lager och verksamhetsstyrning i molnet, med fokus på snabb implementation och standardprocesser. | Grossist & Distribution; Retail/e-handel; Tillverkning/produktion | ✓/~ H | FastTrack och Elevate är centrala paketeringar.
Finance & SCM | Ej aktivt / ej verifierat | Ingen kundnytta bör beskrivas publikt som aktiv Bisqo-förmåga utan verifiering. | Ej filter | ? H | Ska inte visas som F&SCM-partner.
CE/CRM | Sekundärt/starkt komplement | Ger struktur för sälj, kundservice och kundresor genom CRM på Power Platform och Dynamics 365-appar. | B2B-sälj; Service/kundsupport; SMB/midmarket med kunddata-behov | ✓/~ M/H | Sales, Customer Service och Customer Insights kommuniceras.
Dynamics 365 Sales | Tillvalsprodukt inom CE/CRM | Pipeline, leads, affärer, aktivitetsstyrning, dashboards och datadriven säljprocess. | B2B-sälj; Grossist/handel; Tjänstebolag | ✓ H | Tydlig webbkommunikation och webinar.
Dynamics 365 Customer Service | Tillvalsprodukt inom CE/CRM | Ärendehantering, självbetjäning, AI-insikter och bättre kundsupport. | Kundservice; Handel; B2B-support | ✓ M/H | Kommuniceras på webb, men kundcase bör verifieras.
Dynamics 365 Customer Insights - Journeys | Tillvalsprodukt inom CE/CRM | Kundresor, personalisering, kampanjer och datadrivna interaktioner. | B2B-marknad; Retail/e-handel; Kunddata | ✓ M | Kommuniceras på webb; leveranser bör verifieras.
Power Platform | Plattformsnära komplement | Low-code, automation och CRM-lösningar som kan anpassas efter kundens processer. | Processautomation; CRM; Integration | ✓/~ H | Central för CRM på Power Platform.
Power BI / Analytics | Komplement | Rapportering, dashboards och beslutsstöd nära BC/CRM. | Ledningsrapportering; Sälj; Lager/order | ✓/~ M | Power BI nämns i d365.se-profil; Fabric ej verifierat.
Project Operations / Commerce / HR | Ej verifierade tillvalsprodukter | Ska inte användas som aktiv matchning. | Ej filter | ? H | Behöver partnerbekräftelse.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Grossist & Distribution | Kärnbransch | Hög | d365.se lyfter grossist/distribution och flera scenarier handlar om order, lager och flöden. | d365.se-profil / kundcase
Retail & E-handel / Handel | Kärnbransch | Hög | Relevant genom Business Central, integrationsbehov, e-handel och ISV-/tilläggslogik. | d365.se-profil / partnerwebb
Tillverkning / Produktion | Kärn-/sekundärbransch | Medel/hög | d365.se anger tillverkningsindustri. Rekommenderas främst för BC-nära produktions-/orderflöden, inte komplex enterpriseproduktion. | d365.se-profil
Fordonstillbehör / belysning | Sekundär / kundcase | Medel | Strands Group och DC-Light/Unic-Light ger handels-/produktbolagsreferenser med lager/order/processbehov. | Kundcase
Hjälpmedel / produktbolag | Sekundär / kundcase | Medel | Svancare visar tillväxtbolag med lager, inköp, försäljning och skalbarhet. | Kundcase
Konsult-/tjänstebolag | Generell erfarenhet | Låg/medel | Nämns i d365.se-profil som relevant men behöver mer referensstöd. | d365.se-profil
Offentlig sektor | Ej verifierad | Låg | Inget tydligt publikt underlag. | Ej verifierad
Life Science/Medtech | Ej verifierad | Låg | Ej tillräckligt underlag för Bisqo som branschfilter. | Ej verifierad
Område | Bedömning | Konf. | Källor
AI-mognad | Grundläggande till medel. Bisqo kommunicerar AI i BC-release-kommunikation och CRM/D365 Sales, men d365.se anger AI-mognad som grundläggande. | M | S3, S5
AI-readiness | Relevant i rådgivning kring datakvalitet, processer, systemstöd och standardisering, men ej paketerat som tydlig AI-readiness-tjänst. | M | S1-S3
Copilot | Nämns genom Business Central 2026 release-kommunikation och Microsoft-plattformen. Konkreta Copilot-projekt bör verifieras. | M | S9
Copilot Studio / Agents | Ej verifierat som eget erbjudande. AI-agenter nämns i BC-release-artikel men inte som leveranscase. | L/M | S9
Konkreta AI-användningsfall | AI-drivna säljinsikter, automatisering, BC-funktioner och kunddata/360-kundvy. Kundcase saknas för AI. | M | S3
ERP-nära AI | Möjlig koppling till Business Central och release wave; bör användas som intern matchning, inte stark publik AI-positionering. | M | S9
Dataförutsättningar | Standardisering, Power BI, CRM-data, dashboards och processkontroll ger praktisk grund för AI/Copilot, men avancerad data governance/Fabric är ej verifierat. | M | S3/S5
Område | Bedömning | Verifiering | Kommentar
Data governance | Ej tydligt paketerat. Relevant endast indirekt genom standardisering, kunddata och CRM/ERP-struktur. | ~ M | Verifiera innan stark matchning.
Dataplattform | Ingen tydlig dataplattform/Fabric-positionering verifierad. | ? L/M | Ej Fabric-specialist i nuvarande underlag.
Power BI | Kompletterande erbjudande enligt d365.se-profil och rapport-/dashboardteman. | ✓/~ M/H | Använd som stödjande filter.
Microsoft Fabric | Ej verifierat som Bisqo-erbjudande. | ? H | Visa inte som aktiv Fabric-partner utan bekräftelse.
Datakvalitet | Viktig vid migrering från gamla system och CRM/360-kundvy, men ej formellt erbjudande. | ~ M | Stark relevans vid implementation.
Rapportering | Realtidsöversikt, dashboards och beslutsstöd förekommer i BC/CRM-kommunikation. | ✓/~ M/H | Bra komplement till BC/CRM.
Analytics | Grundläggande/operativ analys snarare än avancerad analytics. | ~ M | Matcha med måttlig vikt.
AI-grund | Standardiserade processer, bättre data och molnplattform ger grund för AI, men AI-projekt måste verifieras. | ~ M | Intern AI-matchning med försiktighet.
Område | Bedömning | Verifiering | Kommentar
Integrationsarkitektur | Relevant i BC-/CRM-projekt, särskilt e-handel, lager, order och kunddata. Ej verifierat som större middlewarearkitektur för enterprise. | ✓/~ M/H | Stark för SMB/midmarket.
Middleware | Ej tydligt verifierat. ISV-/tillägg och Power Platform kan vara vanligare än tung middleware. | ? M | Verifiera per projekt.
API:er | Indirekt relevant via BC, CRM, Power Platform och kundcase. | ~ M/H | Använd som komplementfilter.
EDI | Golden EDI finns på Bisqos partnersida; auktorisation och projekt bör verifieras. | ✓/~ M | Visa inte i ISV-filter utan bekräftelse.
Dataintegration | Datamigrering är tydlig i kundcase och molnlyft. Integration med Microsoft 365, Power Platform, Dataverse och Shopify nämns i BC-release-kommunikation. | ✓/~ H | Relevant vid BC-projekt.
Drift och övervakning | Service & Support inkluderar uppdateringar och hantering av tilläggsappar, men övervakningsmodell bör verifieras. | ✓/~ M/H | Bra för förvaltning.
Integrationskompetens | Hög relativt Bisqos målsegment. Ska inte övermatchas mot stora enterprise-landskap. | ~ H | Styr mot SMB/midmarket.
ISV-relationer ska inte automatiskt tolkas som auktoriserad återförsäljarstatus. För d365.se:s filter gäller: visa partnern under ett tillägg endast när auktorisation, partnerkatalog, partneruppgift eller kundcase finns.
ISV / lösning | Roll i Bisqo-underlaget | Produktområde | Verifiering | Kommentar
Continia | Listad på Bisqos partnersida | Business Central | ✓ M/H | Stark kandidat för ISV-filter efter kontroll mot partnerkatalog/auktorisation.
Golden EDI | Listad på Bisqos partnersida | Business Central / EDI | ✓ M/H | Relevant för EDI/e-faktura/integration. Kontrollera formell partnerstatus.
AGR | Listad på Bisqos partnersida | Lageroptimering / ERP-tillägg | ✓ M | Relevant vid lager/planering. Kontrollera BC-koppling och kundcase.
SmartApps | Listad på Bisqos partnersida och partnerdirectory beskriver Bisqo som BC/CRM-partner | Business Central-tillägg | ✓ M/H | Relevant för roller, analyser, automation och integrationer.
ClickDimensions | Listad på Bisqos partnersida | CRM / Marketing Automation | ✓ M | Relevant för CRM/marknad. Inte BC-filter om ej kopplat till d365.se-tilläggssida.
Truvio | Listad på Bisqos partnersida | ERP-lösningar på D365/BC | ✓ M | Verifiera exakt relation och användning.
RapidStart CRM | Bisqo anger sig som Regional Partner | CRM på Power Platform | ✓ H | Relevant för snabb CRM-start för små/medelstora företag.
ExFlow | Ej verifierad | AP Automation / BC/F&SCM | ? H | Ska inte visas för Bisqo utan ny källa.
Logtrade | Ej verifierad | Logistik/transport | ? H | Ska inte visas för Bisqo utan ny källa.
Dynamicweb | Ej verifierad | E-handel/PIM | ? H | Ska inte visas för Bisqo utan ny källa.
Område | Bedömning | Källa/konf.
Omsättning | 29 423 KSEK under 2025 enligt Bolagsfakta. Det visar en mindre men växande specialist snarare än stor systemintegratör. | S7 / H
Medarbetare | 16 anställda 2025 enligt Bolagsfakta. Intern marknadskontext anger högre nivå; bekräfta aktuell konsultstyrka med partnern. | S7, S9 / M/H
Tillväxt | Bolagsfakta anger +61,5% omsättningstillväxt mot föregående år, vilket stödjer bilden av snabb tillväxt från låg bas. | S7 / H
Förvärv | Inga större förvärv verifierade i det offentliga underlaget. | S1-S7 / M
Marknadsposition | Nischad, växande svensk BC-/CRM-partner för SMB/midmarket med tydlig paketerings- och standardiseringsprofil. | S1-S9 / H
Storlekskategori | Mindre/medelstor specialistpartner. Relevant för kunder som vill ha nära partnerrelation men ändå tydlig metodik. | S1-S9 / H
Finansiell stabilitet | Positiv omsättningstillväxt och positivt rörelseresultat 2025; använd som neutral indikator, inte som finansiell due diligence. | S7 / H
Milstolpe | Bedömning | Konf. | Källa
1987 | Juridisk enhet Bisqo AB registrerad enligt bolagsdata. Detta avser juridisk historik och ska inte förväxlas med nuvarande Bisqo-verksamhet. | H | S7
2023 | Bisqo anger att verksamheten grundades 1 oktober 2023 med vision att förändra marknaden för ERP och CRM för små och medelstora företag. | H | S1
2023-2026 | Utveckling av paketeringar: FastTrack, Elevate, Service & Support och CRM på Power Platform. | H | S2-S4
2025-2026 | Publika kundcase med Business Central, bland annat Svancare, Strands Group och DC-Light/Unic-Light. | H | S4
2026 | Aktiv marknadskommunikation kring Business Central 2026 Release Wave 1, AI, 360-kundvy och rekrytering. | M/H | S3/S9
Tema | Bedömning | Konf. | Källor
Thought leadership | Praktiskt och köparnära: Business Central, molnresa, 360-kundvy, AI-fällor och release-kommunikation. | M/H | S1-S3/S9
Webbinarier | Aktivitet kring FastTrack/Business Central och D365 Sales/360-kundvy. Formatet är korta, praktiska online-webbinarier. | H | S9
Events | Kommande och genomförda events/webbinarier finns på webbplatsen. | H | S9
Kundcase | Tre publika Business Central-case: Svancare, DC-Light/Unic-Light och Strands Group. | H | S4
Bloggar/nyheter | Nyheter om AI, Business Central release, rekrytering och Dynamics 365/Power Platform. | H | S9
AI-kommunikation | AI nämns i nyheter och releasevågor, men inte som verifierad tung AI-portfölj. | M | S3/S9
ERP-kommunikation | Mycket stark och konsekvent runt Business Central, molnresa, standard, FastTrack och Elevate. | H | S1/S2
Aktivitetstakt | Relativt hög för en mindre partner: återkommande nyheter, events och kundcase. | M/H | S4/S9
Taggkategori | Taggar
Huvudproduktområden | Business Central: high active; F&SCM: not active; CE/CRM: medium-high secondary; Sales: active secondary; Customer Service: active secondary; Customer Insights: active secondary; Field Service: not verified
Tillvalsprodukter och plattformar | Power Platform, Power BI, Dynamics 365 Sales, Dynamics 365 Customer Service, Customer Insights Journeys, RapidStart CRM, ClickDimensions, Service & Support, integration
ISV-lösningar | Continia listed by partner; Golden EDI listed by partner; AGR listed by partner; SmartApps listed by partner; ClickDimensions listed by partner; Truvio listed by partner; ExFlow not verified; verify-per-addon
Branscher | Grossist & Distribution, Retail/e-handel, Handel, Tillverkning/produktion, Fordonstillbehör, Produktbolag, B2B-sälj, Kundservice
Kompetenser | Business Central, NAV migration, BC Online, CRM on Power Platform, Dynamics 365 Sales, Customer Service, Customer Insights, Power Platform, Power BI, Datamigrering, Integration, Support, Standardisering
Kundstorlek | Micro, Small Business, SMB, Midmarket, 50-99, 100-249, 250-999, Sweden, Nordic
Projektstorlek | Small BC Project, Medium BC Project, NAV-to-BC Cloud Migration, Fixed Scope Project, Fixed Price Project, CRM Starter Project, Integration-heavy SMB Project, Support & Service
Geografi | Sweden, Skåne, Malmö, Helsingborg, Southern Sweden, Nordic-to-verify, Europe-to-verify, Global-to-verify
Negativa matchningstaggar | F&SCM Project, Global Enterprise Rollout, Lowest-price-only Project, Specific ISV Unverified, Advanced CE Enterprise, Public Competitor Analysis Prohibited
Endast internt: Denna sektion är inte avsedd för publik publicering. Den används för AI-matchning, redaktionell jämförelse och intern förståelse av partnerpositionering.
Område | Intern bedömning
Primära konkurrenter | NAB Solutions, BrightCom, Adbriq, Goodfellows, Update, Navcite, InBiz, Compago och andra Business Central-specialister för SMB/midmarket.
Konkurrensfördelar | Tydlig standardförst-modell, FastTrack, Elevate, fast scope/fasta prisupplägg, CRM på Power Platform, Service & Support och publika kundcase med snabba BC-projekt.
När större partnerkategori kan vara starkare | När kunden behöver större leveranskapacitet, fler branschspecialister, internationell rollout, F&SCM eller bred Microsoft-plattform över flera länder.
När ren CRM-specialist kan vara starkare | När kunden har djupt CE/CRM-behov inom avancerad marketing automation, contact center, field service eller komplex datamodell.
När global SI kan vara starkare | När projektet är koncernövergripande, riskkänsligt, governance-tungt och nära ledningsagenda.
Bisqo är en nischad svensk Microsoft-partner med primärt fokus på Dynamics 365 Business Central för små och medelstora företag, kompletterat med CRM på Power Platform, Dynamics 365 Sales, Customer Service, Customer Insights, Power BI, integrationer och löpande Service & Support. Partnern passar särskilt väl för kunder som vill modernisera äldre affärssystem, migrera från NAV/Business Central On-Premise till Business Central Online eller införa ett standardiserat BC-upplägg med tydligt scope, fast pris och snabb start. Styrkan ligger i paketeringarna FastTrack och Elevate, praktisk affärsnära rådgivning, kundcase inom handel/distribution/tillverkning och förvaltning efter go-live. Bisqo bör inte primärt matchas mot stora F&SCM-program, global enterprise-rollout eller avancerad CE/CRM-transformation utan verifierat scope. I d365.se:s matchning bör Bisqo prioriteras för SMB/midmarket-BC, handels- och distributionsnära processer, CRM-start, Power Platform-komplement och BC-relaterade integrations-/ISV-behov där relationen är verifierad.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av publika partnerkort.
Senast granskad | Ej angivet | Fylls i vid nästa manuell genomgång.
Partnerbekräftad | Nej | Skicka valda delar till Bisqo för verifiering innan stark publik användning.
Publiceringsbar korttext | Ja, efter redaktionell granskning | Undvik intern konkurrentanalys och osäkra ISV-/AI-påståenden i publik text.
AI-matchningsklar | Ja, med konfidensviktning | Starka matchningar: BC, SMB/midmarket, standardiserad implementation, CRM på Power Platform, support.
Källnamn kan användas i intern analys men behöver inte exponeras publikt. Källor som avser intern marknadskontext eller extern analys ska användas som stöd för jämförelser, inte som publik källa i partnerkort.
Källkod | Beskrivning
S1 | Bisqo.se - startsida, Om oss och huvudpositionering: Business Central, CRM på Power Platform, Solutions Partner for Business Applications, standardförst, fast scope och kontor.
S2 | Bisqo.se - Business Central, FastTrack och Elevate: BC Online, molnresa, NAV/BC On-Premise, fast pris, standardfunktionalitet och datamigrering.
S3 | Bisqo.se - CRM på Power Platform, Dynamics 365 Sales, Customer Service, Customer Insights Journeys och RapidStart CRM.
S4 | Bisqo.se - Service & Support samt kundreferenser: Svancare, Strands Group, DC-Light & Unic-Light.
S5 | d365.se - Bisqo AB partnerprofil: positionering, branscher, kontaktperson, geografi, AI-profil och relevant för-fält.
S6 | Bisqo.se - Våra partners: AGR, ClickDimensions, Companial, Continia, Golden EDI, Microsoft, Truvio och SmartApps.
S7 | Bolagsfakta / Allabolag - Bisqo AB: organisationsnummer, registreringsdatum, antal anställda, omsättning och finansiella nyckeltal.
S8 | SmartApps partner directory och publik partnerinformation: Bisqo som svensk expert inom Business Central och CRM på Power Platform för SMB.
S9 | Intern marknads- och partneranalys för svenska Dynamics 365-partners. Används enbart som marknadskontext, jämförelsegrupp och intern konfidensbedömning.
S10 | Bisqo LinkedIn / publik bolagsprofil: företagspresentation, grundande och kontorsuppgifter. Använd endast som kompletterande källa.
Användning: Dokumentet är avsett som AI knowledge base, partnerprofil, matchningsmotor, partnerjämförelse, redaktionellt underlag, konkurrentanalys och investerar-/marknadskontext. Interna bedömningar får inte återges publikt utan redaktionell granskning.$txt$, source_document_filename = 'bisqo_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'bisqo';
UPDATE public.partners SET source_document_text = $txt$Goodfellows
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Goodfellows ska i första hand förstås som en Business Central-partner för SMB/midmarket, inte som en bred D365-enterprise- eller CE/CRM-partner.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter bör endast visa Goodfellows under ett specifikt Business Central-tillägg när partnern är auktoriserad av ISV:n, finns i partner-/katalogunderlag eller har verifierad partneruppgift/kundcase. Generell BC-kompetens räcker inte för att listas under varje tillägg.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Företag som söker Dynamics 365 Business Central som primärt affärssystem. [✓/~ H, S1/S2]
SMB och nedre/mellersta midmarket med behov av tydlig förstudie, realistiskt scope och trygg implementation. [~ H, S2/S6]
Handels-, retail/e-handels- och distributionsbolag som behöver koppla ihop order, lager, frakt, e-handel och rapportering. [✓/~ H, S1/S3/S5/S6]
Tillverkande eller lagerintensiva bolag med behov av Mobile WMS, frakt/TA, LogTrade eller liknande BC-nära tillägg. [✓/~ H, S3/S5]
Kunder som vill ha samma partner och konsulter genom förstudie, projekt, support och förvaltning. [✓/~ H, S1/S2]
Organisationer som vill börja använda Microsofts standard-AI/Copilot i BC eller enklare Copilot Studio-/agentstöd, men inte söker avancerad enterprise-AI. [✓/~ M/H, S1/S2]
Kunder som värderar lokal/regional närhet, långsiktigt samarbete och förutsägbar projektmodell högre än stor global leveranskapacitet. [~ H, S1/S6]
8. Mindre lämplig för
Kunder som söker Dynamics 365 Finance & Supply Chain Management som huvudplattform. [~ H, S10/S12]
Stora koncernövergripande ERP-program med internationell roll-out, komplex governance och behov av stor riskbärande leveranskapacitet. [~ H, S10]
Kunder som söker fullskalig CE/CRM, Customer Service, Field Service, Contact Center eller Customer Insights som huvudprojekt. [~ H, S1/S10]
Projekt där en specifik BC-ISV-lösning är huvudkrav men Goodfellows saknar verifierad auktorisation eller kundcase för just tillägget. [~ H, S3/S11]
Kunder som primärt vill ha lägsta möjliga timpris och inte värderar förstudie, förvaltning eller kontinuerlig utveckling. [~ M, S2/S6]
Organisationer som kräver bred Microsoft-plattformsleverans över Azure, Fabric, M365, CE, F&SCM och global managed services. [~ H, S10]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Business Central för växande handelsbolag
Ett växande handels- eller retailbolag har passerat gränsen för enklare system och Excel-baserad uppföljning. Behovet är att samla ekonomi, order, lager, e-handel och rapportering i en mer sammanhängande BC-miljö.
Scenario 2 - Lager- och logistikmodernisering
Kunden behöver bättre kontroll på lagerplats, plock, fraktbokning och utleverans. Goodfellows är relevant när Business Central ska kombineras med Mobile WMS, LogTrade eller liknande tillägg och när lösningen ska förvaltas långsiktigt.
Scenario 3 - E-handel och datakvalitet
Ett e-handelsnära bolag behöver koppla affärssystemet till befintliga webshop- eller lagersystem och få mer tillförlitliga nyckeltal i Power BI. Goodfellows passar när integration och rapportering är viktiga men projektet inte kräver stor enterprise-arkitektur.
Scenario 4 - Befintlig NAV/BC-kund vill modernisera
Kunden har en befintlig NAV/BC-lösning och vill förbättra processer, gå mot moln/modern BC, skapa mer stabil förvaltning och gradvis införa AI/Copilot där det ger praktisk nytta.
Scenario 5 - Konsult- eller tjänsteföretag med projekt-/avtalsflöden
Kunden vill få bättre struktur på projekt, avtal, fakturering, rapportering och resursnära processer. Goodfellows kan vara relevant när behovet ligger nära Business Central och Progressus/PSA-liknande lösningslogik.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
16. Integration
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
2018: Juridisk enhet 559171-2087 registreras enligt bolagsdata. [S8]
2021: Goodfellows Business AB anges i extern bolagskälla ha fått nuvarande firmanamn 2021-05-31. [S8]
2024: Bolaget redovisar 12,843 MSEK omsättning och 9 anställda. [S8]
2025/2026: Goodfellows kommunicerar att Goodfellows Infra gått samman med Upheads och att affärssystemsdelen fortsätter med fokus på affärssystem under namnbytet Modia. [S4]
2025: DynamicWeb meddelar att Goodfellows Business blir Alliance Partner i Sverige. [S7]
2026: d365.se har Goodfellows som publicerad partner med Business Central och branschfokus grossist/distribution, konsulttjänster samt retail/e-handel. [S1/S9]
19. Marknadskommunikation
20. Standardiserade taggar
21. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: tydlig kundnära förstudie-/förvaltningsmodell och synlig partnerlista för praktiska BC-tillägg.
Mot CRM-specialister: starkare ERP-/Business Central-kärna och bättre matchning när kundens primära problem ligger i order, lager, ekonomi och logistik.
Mot globala systemintegratörer: snabbare, mer lokal och mer kostnadseffektiv för SMB/midmarket där stor SI-kapacitet blir överdimensionerad.
Mot traditionella ERP-konsulter: modern BC-/Copilot-/Power BI-vinkel och tydligt stöd för tillägg/integration runt standardplattformen.
22. Kundorienterad partnerbeskrivning
Goodfellows är en svensk Business Central-partner med tydlig tyngdpunkt på små och medelstora företag som vill få bättre kontroll över sina affärsflöden. Partnern passar särskilt väl när kunden söker ett affärssystem som knyter ihop ekonomi, order, lager, logistik, e-handel och rapportering, men där projektet inte ska bli större eller tyngre än nödvändigt.
En central del av Goodfellows position är den nära projektmodellen. d365.se-profilen lyfter att samma konsulter följer kunden från start till löpande förvaltning, och Goodfellows egen webb beskriver en process med analys, genomförande och framtidssäkring. För kunder som vill ha en tydlig förstudie, ett realistiskt projektupplägg och en partner som tar ansvar efter go-live är detta en viktig matchningssignal.
Goodfellows är också relevant när Business Central behöver kompletteras med praktiska lösningar för lager, frakt, WMS, EDI, leverantörsreskontra, e-handel eller projekt-/resurshantering. Partnerns egna partnersida nämner flera BC-nära lösningar som Golden EDI, ExFlow, LogTrade, Tasklet Factory, EazyStock och Progressus, och kundcase visar hur Business Central kombineras med WMS, transportadministration och e-handels-/lagersystem.
Partnern bör däremot inte övermatchas i situationer där kunden söker stor internationell leveranskapacitet, Dynamics 365 Finance & Supply Chain Management, avancerad CE/CRM, Contact Center eller ett brett Microsoft-transformationsprogram. I sådana lägen är andra partnerkategorier normalt mer relevanta. Goodfellows starkaste roll på d365.se är därför som en kundnära Business Central-partner för SMB/midmarket, med tydlig förvaltnings- och integrationsprofil.
23. AI-sammanfattning
24. Why This Partner
Partnern rekommenderas eftersom kunden efterfrågar:
✓ Business Central som huvudplattform
✓ SMB/midmarket snarare än enterprise/global roll-out
✓ Förstudie, tydlig scope och trygg projektmodell
✓ Lager, order, frakt, WMS, EDI eller e-handelsintegration
✓ Power BI och praktiskt beslutsstöd
✓ Standard-AI/Copilot eller enklare AI-readiness i Business Central
✓ Långsiktig support, förvaltning och vidareutveckling
✓ Lokal/regional närhet i Sverige/Göteborg/Västsverige
Partnern bör inte rekommenderas som förstaval när kunden söker:
✗ Dynamics 365 Finance & Supply Chain Management som huvudlösning
✗ Avancerad CE/CRM, Customer Service, Field Service eller Contact Center
✗ Global SI-leverans, tung governance eller internationell enterprise-rollout
✗ Specifik ISV-auktorisation som inte är verifierad
25. Verifiering före publicering
Bekräfta om publik partnerprofil ska använda namnet Goodfellows, Goodfellows Business eller Modia.
Bekräfta juridisk enhet, organisationsnummer, adress och aktuell kontaktperson.
Bekräfta exakt Microsoft Partner-status och eventuella Solution Partner-designations.
Bekräfta aktiva produktområden: Business Central, Power BI, AI/Copilot, Power Platform och eventuella övriga Dynamics 365-produkter.
Bekräfta om partnern vill visas i Norden-filter eller endast Sverige/Göteborg/Västsverige.
Bekräfta om F&SCM, CE/CRM, Commerce, HR, Project Operations, Customer Service, Field Service eller Contact Center ska vara aktiva eller ej.
Bekräfta aktuella ISV-relationer och auktorisationer för Golden EDI, ExFlow, LogTrade, Tasklet Factory, EazyStock, Progressus, DynamicWeb och övriga tillägg.
Bekräfta kundcase som får nämnas publikt: Ebeco, MM Sports, Humphree eller andra.
Verifiera AI-erbjudande: standard-Copilot, Copilot Studio/agents, egna AI-funktioner, AI-readiness och antal genomförda AI-projekt.
Bekräfta förvaltningsmodell, supportupplägg, målpris-/fast pris-modell och typiska projektstorlekar.
Bekräfta max 3 branscher för Business Central-filter på d365.se.
26. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Goodfellows | ✓ | H | S1, S2, S9
Juridisk enhet | Modia Business AB, org.nr 559171-2087. Bolaget förekommer även som Goodfellows Business AB i äldre/offentliga profiler. Namnbytet från Goodfellows Business till Modia bör verifieras med partnern före publik uppdatering. | ✓/~ | H | S4, S8
Partnertyp och egen beskrivning | Lokal/regional Business Central-partner med fokus på affärssystem, förstudie, implementation, support och förvaltning. Goodfellows beskriver Business Central som huvudlösning och kommunicerar även Power BI, AI/Copilot och affärsprocessutveckling. | ✓/~ | H | S1, S2, S3
Primära produktområden | Dynamics 365 Business Central, Business Central-implementation, NAV/BC-modernisering, förvaltning/support, Power BI och BC-nära integrationer. | ✓/~ | H | S1, S2, S9
Sekundära produktområden | AI/Copilot i Business Central, Copilot Studio/agents enligt d365.se-profil, Power Platform-liknande automation, e-handel, lager/WMS, frakt/TA, EDI, leverantörsreskontra och projekt-/resurshantering via ISV/tillägg. | ✓/~ | M/H | S1, S2, S3, S5, S6
Områden som inte verifierats | F&SCM, fullskalig CE/CRM, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations är inte verifierade som aktiva huvudområden. D365 Sales/Customer Insights ska inte användas som huvudfilter utan ny partneruppgift. | ?/~ | H | S1, S9, S10
Typisk kundstorlek | SMB och nedre/mellersta midmarket. d365.se anger 1-49, 50-99 och 100-249 anställda. Externa källor beskriver Goodfellows Business som specialist för SMB och cirka 100 kunder. | ✓/~ | H | S1, S7, S9
Typisk projektstorlek | Små till medelstora BC-projekt, förstudier, målpris-/fast pris-orienterade implementationer, integrationer, förvaltningsuppdrag och vidareutveckling. Stora koncernövergripande ERP-transformationer bör prioriteras till större F&SCM-/SI-partners. | ~ | H | S2, S6, S9, S10
Geografisk leveranskapacitet | Göteborg/Västsverige som tydlig bas, med leverans i Sverige och enligt d365.se även Norden. Ska inte matchas som global leveranspartner utan verifiering. | ✓/~ | H | S1, S3, S9
Branschfokus | Grossist & Distribution, Retail & E-handel samt Konsulttjänster enligt d365.se. Egen och extern kommunikation stärker handel, tillverkning, e-handel, lager/logistik och distributionsflöden. | ✓/~ | H | S1, S3, S5, S6, S7, S9
AI-mognad | Grundläggande till medel inom BC-nära AI. d365.se anger grundläggande AI-mognad med Microsoft Standard AI/inbyggd Copilot samt Copilot Studio/agents. Egen webb kommunicerar AI från systemstöd till affärsstöd, men antal konkreta AI-kundprojekt bör verifieras. | ✓/~ | M/H | S1, S2
Förvaltningskapacitet | Stark relativt partnerstorlek inom BC. Goodfellows betonar att samma konsulter följer kunden från förstudie/projekt till support och förvaltning, och erbjuder övergripande förvaltningslösning för BC-miljö. | ✓/~ | H | S1, S2
Internationell leveransförmåga | Låg till medel. Norden nämns i d365.se-profil, men huvudsaklig position är svensk/regional BC-partner. Internationella roll-outs bör viktas lågt utan verifiering. | ~ | M | S1, S10
Transformationskapacitet | Medel för SMB/midmarket: särskilt när kunden vill modernisera affärssystem, strukturera lager/logistik, integrera e-handel/frakt/WMS och få förvaltning. Ej primär för stora enterpriseprogram. | ~ | H | S1, S2, S5, S6
Unika särskiljande egenskaper | Kundnära BC-partner med tydlig förstudie-/målprislogik, nära långsiktigt team, starkt BC-tilläggsekosystem och kombination av affärssystem, Power BI, lager/logistik, e-handel och praktisk förvaltning. | ~ | H | S1, S2, S3, S5, S6
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, exakta produktområden, namnbyte Goodfellows Business/Modia. | Bör verifieras extra innan publicering eller stark matchningsvikt om uppgiften påverkar kontaktväg, ISV-auktorisation, juridisk enhet eller produktfilter.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: goodfellows
partner_name: Goodfellows
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_submitted_source: S9
  legal_name_requires_partner_verification: true
product_area_model:
  active_partner_submitted_product_groups:
    business_central: high_primary
  related_editorial_product_groups:
    power_bi: medium_secondary
    ai_copilot_bc: medium_secondary
    integration: high_adjacent
    managed_services: high_adjacent
    bc_addons_isv: high_adjacent_if_verified
  not_active_or_not_verified:
    finance_supply_chain_management: do_not_show_as_active
    ce_crm_broad: do_not_show_as_active
    sales_customer_insights: do_not_show_as_active
    customer_service_field_service_contact_center: do_not_show_as_active
    project_operations: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
isv_scope:
  business_central_addons: verified_for_listed_partners_or_goodfellows_partner_page
  fscm_ce_isv_relations: not_applicable
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: false
  show_under_ce_crm_broad: false
  show_under_power_bi: true_secondary
  show_under_power_platform: true_secondary_low_medium
  show_under_data_ai: true_secondary_ai_readiness_only
  show_under_integration: true_strong_adjacent
  show_under_managed_services: true_bc_related
  show_under_isv_filters: only_if_isv_authorized_or_verified
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Goodfellows är tydligt positionerad runt Dynamics 365 Business Central och BC-förvaltning.
Finance & SCM-fokus | 1/5 | H | Ej verifierat som aktivt produktområde. Ska inte matchas mot F&SCM-projekt.
CRM / Customer Engagement-fokus | 1/5 | M/H | Ej verifierat som aktivt CE/CRM-område; använd endast om kunden söker enklare BC-nära kund-/säljflöden.
AI / Copilot / Agents | 3/5 | M | Egen webb och d365.se lyfter AI/Copilot/agents, men konkreta referenser och omfattning bör verifieras.
Data & Analytics | 3/5 | M/H | Power BI är tydligt nämnt som del av erbjudandet och kundcase visar dashboards/rapportering.
Integration | 4/5 | H | Kundcase och partnerlista visar e-handel, WMS, TA/frakt, EDI och BC-tillägg.
Business Transformation | 3/5 | M/H | Starkast vid praktisk SMB/midmarket-transformation och processmodernisering snarare än stora program.
Strategisk rådgivning | 3/5 | M | Förstudie och analys är tydliga moment, men bred management/advisory-position ej verifierad.
Förvaltning / Managed Services | 4/5 | H | Förvaltning, support och kontinuerlig utveckling är centrala i erbjudandet.
Branschspecialisering | 3/5 | M/H | Branscherna handel/retail/e-handel, distribution och konsulttjänster är tydliga, men djup vertikal IP bör verifieras.
Internationell leverans | 2/5 | M | Norden kan användas som sekundär signal; global/internationell rollout ej verifierad.
SMB-fokus | 5/5 | H | Profil och marknadsmaterial pekar tydligt mot små och medelstora företag.
Enterprise-fokus | 1/5 | H | Ej primär partner för enterprise-D365 eller stor global transformation.
Standardisering | 4/5 | M/H | Kundcase lyfter standard, målpris och realistisk scopehantering.
Innovation | 3/5 | M | AI/Copilot och Modia-namnbytet visar förnyelse, men ej lika tung AI/Data-position som större partners.
Leveransbredd | 3/5 | M/H | Bredd inom BC, Power BI, integrationer och ISV-tillägg; begränsad över övriga D365-huvudområden.
Partner-DNA typ: Lokal/regional Business Central- och förvaltningspartner för SMB/midmarket. Tolkning: Goodfellows bör matchas när kunden söker ett kundnära BC-projekt med tydlig processanalys, lager/logistik/e-handel/integration och långsiktig förvaltning. Partnern ska inte viktas tungt i F&SCM-, CE/CRM- eller enterpriseprogram utan ny verifiering.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Business Central-partner för små och medelstora företag som vill ha trygg implementation, förstudie, lager-/logistiknära flöden, Power BI, integrationer och långsiktig förvaltning. | ~ | H | S1, S2, S5, S6, S9
Tydlig köparnytta | Kunden får en nära partner med tydlig process för analys, genomförande och förvaltning, samt praktisk kompetens kring BC-tillägg, lager, frakt, e-handel och rapportering. | ~ | H | S1, S2, S3, S5, S6
Matchningslogik | Prioriteras när kunden söker Business Central i SMB/midmarket, särskilt inom handel, distribution, retail/e-handel eller konsulttjänster, och vill ha samma team genom projekt och förvaltning. | ~ | H | S1, S9
Positioneringsgränser | Ska inte visas som primär partner för F&SCM, global roll-out, avancerad CE/CRM, Contact Center, HR, Commerce eller Project Operations. Ska inte listas för specifik ISV utan verifierad relation. | ~ | H | S3, S10, S11
Filterområde | Beslut för Goodfellows | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Tydlig BC-profil och aktiv d365.se-profil.
F&SCM | Visa inte som aktiv partner. | Ingen/låg | ?/~ | Ej verifierat som produktområde.
CE/CRM | Visa inte som aktiv partner. | Ingen/låg | ?/~ | Ej verifierat; endast eventuell BC-nära sälj-/kundprocess vid redaktionell matchning.
Power BI / rapportering | Visa som sekundär signal. | Medel | ✓/~ | Power BI nämns som huvuderbjudande/komplement och MM Sports-case visar dashboards.
AI/Copilot | Visa som kompletterande AI-readiness/Copilot-signal. | Medel | ✓/~ | Egen webb och d365.se-profil nämner AI/Copilot/agents; konkret projektnivå bör verifieras.
Integration | Visa som stark kompletterande signal. | Hög | ✓/~ | E-handel, lager/WMS, TA/frakt och BC-tillägg är återkommande i partner- och kundcase.
Managed Services / förvaltning | Visa som BC-relaterad förvaltningspartner. | Hög | ✓/~ | Support/förvaltning och kontinuerlig utveckling är tydligt positionerat.
ISV-lösningar | Visa endast per verifierad ISV-relation. | Endast verifierad matchning | ✓/? | Goodfellows partnerlista nämner flera BC-tillägg; auktorisationsgrad bör verifieras per ISV.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_competence_is_not_sufficient: true
  visible_or_verified_partner_signals:
    - golden_edi
    - exflow_signup
    - logtrade
    - tasklet_factory_mobile_wms
    - eazystock
    - progressus_psa
    - dynamicweb_partner_signal
  do_not_infer_authorization_for_other_addons: true
Fält | Värde för Goodfellows | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Business Central / SMB-midmarket | Använd som huvudkategori när kunden söker Business Central, NAV/BC-modernisering, lager/order/flöden, e-handel, rapportering eller förvaltning i mindre/mellanstora bolag. | H | S1, S2, S9, S10
Sekundära arenor | Integration, Power BI, BC-tillägg/ISV, AI-readiness, förvaltning | Använd som kompletterande logik vid praktiska förbättringar runt BC och befintliga affärsflöden. | M/H | S2, S3, S5, S6
Partnerkategori | Lokal/regional Business Central-specialist med förvaltnings- och tilläggsekosystem | Skiljer Goodfellows från breda Microsoftpartners, F&SCM-specialister och globala SI:er. | H | S1, S2, S10
Primär jämförelsegrupp | NAB Solutions, BrightCom, Navcite, InBiz, Update, Bisqo, Enqore, Yellow Solution och andra BC-specialister | Använd vid jämförelser där kunden söker BC-partner för SMB/midmarket, handel, distribution eller standardiserad implementation. | M/H | S10, S12
Angränsande konkurrenter | Fellowmind, Evidi, Cepheo, COSMO CONSULT, Adbriq beroende på bransch och projektstorlek | Relevant när kunden också vill jämföra större leveranskapacitet eller bransch-/ISV-specialisering. | M | S10, S12
Lägre relevans i jämförelse | Implema, BE-terna, Engage, CGI, Avanade/Accenture, HSO och F&SCM/global SI-aktörer | Använd som lågprioriterad jämförelse när kundens behov är BC/SMB snarare än enterprise ERP eller global transformation. | H | S10
Fakta | Värde | Verif. | Konf. | Källa
Partner | Goodfellows | ✓ | H | S1, S9
Juridisk enhet | Modia Business AB / Goodfellows Business AB, org.nr 559171-2087. Namn och publiceringsnamn bör verifieras. | ✓/~ | H | S4, S8
Registreringsdatum | 2018-09-12 enligt Allabolag/Bolagsfakta. Goodfellows Business-firmanamn anges historiskt från 2021-05-31 i extern bolagskälla. | ✓ | H | S8
Huvudkontor/kontor | Gamla Almedalsvägen 6, Göteborg. | ✓ | H | S3, S8
Ägarstruktur | Ingår i Goodfellows Group AB, som enligt Allabolag ingår i koncern med Goodbros Holding AB som moderbolag. | ✓ | H | S8
Omsättning | 12 843 KSEK 2024 för Modia/Goodfellows Business AB enligt Bolagsfakta/Allabolag. | ✓ | H | S8
Antal anställda | 9 anställda 2024 enligt Bolagsfakta/Allabolag. | ✓ | H | S8
Geografisk närvaro | Göteborg som tydlig bas. d365.se anger Sverige och Norden som leveransområde. | ✓/~ | H | S1, S3
Viktiga erbjudanden | Business Central, Power BI, förstudie, implementation, support/förvaltning, integrationer, AI/Copilot, BC-tillägg/ISV-ekosystem. | ✓/~ | H | S1, S2, S3
Kontaktpersoner | Sebastian Birgersson anges i d365.se-intern partnerdata som utskick/admin/profilkontakt. E-post: sebastian.birgersson@goodfellows.se. Publicering bör verifieras. | ✅/~ | M/H | S9
Storlekskategori | Mindre/lokal BC-specialist inom SMB/midmarket. Inte enterprise-/global SI-storlek. | ~ | H | S8, S10, S12
Prioritera Goodfellows när | Signalstyrka | Konfidens
Kunden söker Business Central som huvudplattform. | Mycket stark | H
Kunden är SMB/midmarket och vill ha förstudie, målpris-/fast pris-liknande trygghet och nära samarbete. | Stark | M/H
Projektet innehåller e-handel, lager, frakt/TA, WMS, EDI eller andra BC-nära integrationer. | Mycket stark | H
Kunden vill ha långsiktig support/förvaltning och samma partnerteam efter go-live. | Stark | H
Kunden vill använda Power BI, standard-AI/Copilot eller enklare AI-readiness i Business Central. | Medel/stark | M
Branschen är grossist/distribution, retail/e-handel, konsult/tjänst eller produkt-/lagerintensiv SMB. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är F&SCM, enterprise ERP eller global roll-out. | Stark nedviktning | H
Kunden söker bred CE/CRM, Contact Center, Field Service eller Customer Insights som huvudprojekt. | Stark nedviktning | H
Kunden kräver verifierad auktorisation för ett specifikt BC-tillägg där Goodfellows inte är verifierad. | Stark nedviktning | H
Kunden vill ha stor internationell leveranskapacitet, tung governance och global SI-modell. | Stark nedviktning | H
Produktområde, juridiskt namn eller ISV-relation är oklart. | Kräver förtydligande | M/H
negative_match_rules:
  fscm_project: avoid
  enterprise_global_rollout: low_priority
  advanced_ce_crm_project: low_priority
  specific_bc_addon_without_verification: avoid
  lowest_price_only_selection: reduce_priority
  unclear_legal_or_brand_name: require_partner_verification
matching_confidence:
  high: business_central_smb_midmarket_with_integration_or_support
  medium: bc_adjacent_ai_power_bi_or_isv_use_case
  low: fscm_ce_enterprise_global_or_unverified_isv_use_case
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 5 | Tydlig kärna i erbjudandet och d365.se-profilen. | ✓/~ | H | S1, S2
Finance & SCM | 1 | Ej verifierat som aktivt område. | ?/~ | H | S10
CE/CRM | 1 | Ej verifierat som huvudområde. | ?/~ | H | S1
Customer Engagement | 1 | Ej verifierat som aktivt område för Customer Service/Field Service/Contact Center. | ?/~ | H | S1
AI/Copilot | 3 | Egen webb och d365.se anger AI/Copilot/agents, men kundcase/projektvolym bör verifieras. | ✓/~ | M | S1, S2
Data & Analytics | 3 | Power BI är nämnt och kundcase visar dashboard/rapportering. | ✓/~ | M/H | S3, S6
Power Platform | 2 | Möjligt BC-nära automationsområde men inte lika tydligt som hos bredare Microsoftpartners. | ~ | M | S1
Integration | 4 | Starka signaler genom BC-tillägg, e-handel, WMS, LogTrade och lager-/fraktflöden. | ✓/~ | H | S3, S5, S6
Business Transformation | 3 | Relevant för praktisk SMB/midmarket-modernisering och processförbättring. | ~ | M/H | S2, S5, S6
Strategisk rådgivning | 3 | Förstudie/analys är starkt, men inte bred managementkonsultposition. | ✓/~ | M | S2
Förvaltning | 4 | Förvaltning/support och kontinuerlig utveckling är tydligt positionerat. | ✓/~ | H | S1, S2
Managed Services | 3 | BC-förvaltning stark; bred managed services inom IT har delvis flyttats till Upheads. | ✓/~ | M/H | S2, S4
Internationell leverans | 2 | Norden nämns, men global leverans ej verifierad. | ~ | M | S1
SMB | 5 | Typisk målgrupp och starkaste matchning. | ✓/~ | H | S1, S7, S9
Enterprise | 1 | Ej primär enterprise-aktör. | ~ | H | S10, S12
Produktområde | Roll i erbjudandet | Kundnytta | Verifiering | Kommentar
Business Central | Kärnerbjudande | Ekonomi, inköp, försäljning, lager, logistik, projekt/produktion och rapportering i en sammanhållen SMB/midmarket-ERP-plattform. | ✓/~ H | Max 3 branscher: grossist/distribution; retail/e-handel; konsult-/tjänsteföretag.
F&SCM | Ej verifierat | Ska inte användas som matchningsgrund. | ? H | Hänvisa till större F&SCM-partners vid sådana behov.
CE/CRM | Ej verifierat huvudområde | Möjligt BC-nära kund-/säljprocessstöd men ej verifierad CE-specialistposition. | ? M/H | Ska inte visas i CE/CRM-filter utan ny partneruppgift.
Power BI | Komplement | Rapportering och beslutsstöd kopplat till BC och affärsdata. | ✓/~ M/H | Kundcase visar dashboard-nytta.
AI/Copilot/Agents | Komplement | Standard-AI, Copilot och eventuellt Copilot Studio/agents för att automatisera och förenkla BC-nära arbetssätt. | ✓/~ M | Projektvolym, egna agenter och referenser bör verifieras.
ISV/tillägg | Komplement | ExFlow, Golden EDI, LogTrade, Tasklet Factory, EazyStock, Progressus och DynamicWeb-liknande e-handel/BC-tillägg kan vara relevanta. | ✓/? M/H | Auktorisation och aktuella partnerrelationer ska verifieras per ISV.
Bransch | Klassning | Relevans i matchning | Kommentar | Referenstyp
Grossist & Distribution | Kärnbransch | Hög | Lager, order, frakt, WMS, TA, EDI och rapportering är tydligt relevanta. | d365.se-profil, partner-/case-material
Retail & E-handel | Kärnbransch | Hög | MM Sports-case och DynamicWeb/e-handelsnärhet stödjer retail/e-handel som relevant matchning. | Kundcase, DynamicWeb partner-signal
Konsulttjänster / tjänsteföretag | Kärnbransch/sekundär | Medel/hög | d365.se anger konsulttjänster; Progressus/PSA och projekt-/resurshantering kan vara relevant men bör verifieras per case. | d365.se-profil, partnerlista
Tillverkning/produktion | Sekundär bransch | Medel | Extern och egen kommunikation nämner tillverkning, men d365.se prioriterar främst grossist, konsult och retail/e-handel. | d365.se/extern partnerprofil/kundcase
Lager/logistikintensiva bolag | Sekundär bransch | Hög | Ebeco-case visar lager/logistikförbättring med BC, Mobile WMS och LogTrade. | Kundcase
Område | Bedömning | Verif. | Konf.
AI-mognad | Grundläggande/medel. Goodfellows kommunicerar AI i affärssystem och d365.se anger grundläggande AI-mognad. | ✓/~ | M/H
AI-readiness | Relevant kopplat till datakvalitet, processer och Business Central-miljö före Copilot/agents. | ~ | M
Copilot | Business Central Copilot och Microsofts standard-AI bör ses som huvudspår. | ✓/~ | M/H
Copilot Studio / Agents | d365.se anger agents/Copilot Studio som styrka men verifiering av projekt och referenser krävs. | ✓/~ | M
Konkreta användningsfall | Automatiserade arbetsflöden, enklare beslutsstöd, rapportering, lager/order/processförbättringar. | ~ | M
ERP-nära AI | Starkast inom BC-nära AI snarare än fristående enterprise-AI-program. | ~ | M/H
Dataförutsättningar | Kopplas till Power BI, integrerade system och tillförlitlig affärsdata. | ✓/~ | M/H
Område | Bedömning | Verif. | Konf.
Data governance | Ej tydligt profilerat som separat erbjudande; relevant inom BC-projekt och rapporteringsgrund. | ~ | M
Dataplattform | Ingen tydlig Fabric/Azure data-plattformposition verifierad. | ?/~ | M
Power BI | Tydligt nämnt som huvuderbjudande/komplement och kundcase visar dashboards. | ✓/~ | M/H
Microsoft Fabric | Ej verifierat. | ? | H
Datakvalitet | Relevant vid BC-modernisering och AI-readiness; inte tydligt paketerat som separat erbjudande. | ~ | M
Rapportering | Starkast inom BC/Power BI-rapportering för SMB/midmarket. | ✓/~ | M/H
Analytics | Praktisk SMB-analytics snarare än avancerad enterprise analytics. | ~ | M
AI-grund | BC-data, processer och integrationer kan utgöra grund för Copilot/AI, men bör inte överpositioneras. | ~ | M
Område | Bedömning | Verif. | Konf.
Integrationsarkitektur | Stark på praktiska BC-nära integrationer; ej verifierad som tung enterprise integrationsarkitekt. | ✓/~ | M/H
Middleware | Ej tydligt verifierat; använd låg vikt om kunden specifikt söker middlewarestrategi. | ? | M
API:er | Möjligt inom BC-/e-handels-/lagerflöden; verifieras per projekt. | ~ | M
EDI | Golden EDI nämns som partner/tillägg för Business Central/NAV. | ✓/~ | M/H
Dataintegration | Kundcase visar integration till lagerhanteringssystem/e-handelsplattform och dataöverföring. | ✓/~ | H
Drift och övervakning | BC-förvaltning verifierad; bred drift/IT har flyttats till Upheads enligt Goodfellows egen webb. | ✓/~ | M/H
Integrationskompetens | Hög i SMB/BC-kontext: LogTrade, Tasklet Factory, e-handel, WMS, frakt, Power BI och EDI. | ✓/~ | H
Område | Bedömning | Verif. | Konf. | Källa
Omsättning | 12,843 MSEK 2024 för Modia/Goodfellows Business AB. | ✓ | H | S8
Medarbetare | 9 anställda 2024. | ✓ | H | S8
Tillväxt | Omsättningen ökade 2,1 % enligt Bolagsfakta; bolaget är litet men etablerat i BC-segmentet. | ✓ | H | S8
Förvärv/struktur | Goodfellows Infra har gått samman med Upheads; affärssystemsdelen fortsätter med fokus på business systems och byter namn till Modia. | ✓/~ | H | S4
Marknadsposition | Mindre/lokal Business Central-aktör i Göteborg/Västsverige med SMB/midmarket-position. | ~ | H | S1, S7, S9, S10
Storlekskategori | Small BC specialist. Lägre leveransskala än NAB, Fellowmind, Cepheo, Evidi och andra större BC-/Microsoftpartners. | ~ | H | S8, S10
Finansiell stabilitet | Neutral. Litet bolag med positivt resultat 2024; storlek och koncernstruktur bör beaktas vid större projekt. | ~ | M/H | S8
Område | Bedömning | Verif. | Konf.
Thought leadership | Måttlig. Mer praktisk och kundnära än tungt analytisk. | ~ | M
Webbinarier/events | Ej tydligt verifierat i källmaterialet. | ? | M
Kundcase | Ebeco, MM Sports och Humphree syns på egna sidor som BC-/moderniseringscase. | ✓ | H
Bloggar/guider | Egen webb har lösnings- och caseinnehåll; inte lika stor contentmaskin som större partners. | ✓/~ | M
AI-kommunikation | Egen sida kopplar AI till affärssystemets roll och d365.se lyfter Copilot/agents. | ✓/~ | M/H
ERP-kommunikation | Stark och konsekvent runt Business Central, processanalys, implementation och förvaltning. | ✓ | H
Aktivitetstakt | Måttlig. Namnbyte till Modia och DynamicWeb-partnerskap är viktiga aktuella signaler. | ~ | M/H
Taggkategori | Taggar
Produktområden | business_central; nav_bc_modernization; power_bi; ai_copilot_bc; integration; managed_services_bc; fscm_not_active; ce_crm_not_active
Branscher | distribution_wholesale; retail_ecommerce; consulting_services; manufacturing_secondary; warehouse_logistics; trade
Kompetenser | bc_implementation; bc_support; bc_governance; pre_study; fixed_target_price; warehouse_wms; freight_ta; edi; ecommerce_integration; power_bi_reporting; copilot_readiness
Kundstorlek | micro; smb; small_business; lower_midmarket; midmarket; not_enterprise_primary
Projektstorlek | small_bc_project; medium_bc_project; bc_modernization; bc_support; integration_heavy_smb; not_global_rollout
Geografi | gothenburg; west_sweden; sweden; nordic_secondary_to_verify; global_not_primary
ISV/tillägg | golden_edi_check; exflow_signup_check; logtrade_check; tasklet_factory_check; eazystock_check; progressus_check; dynamicweb_partner_signal; companial_partner_channel
Negativa matchningstaggar | fscm_project; enterprise_global_rollout; advanced_ce_crm; contact_center; specific_isv_unverified; lowest_price_only_project; public_competitor_analysis_prohibited
Ej avsedd för extern publicering. Används endast som bakgrund för AI-rankning, matchningsvikt och redaktionell analys.
Område | Intern bedömning
Primära konkurrenter | NAB Solutions, BrightCom, Navcite, InBiz, Update, Bisqo, Enqore, Yellow Solution och andra Business Central-/NAV-specialister för SMB/midmarket.
Konkurrensfördelar | Kundnära BC-profil, tydlig förstudie och förvaltning, praktiska ISV-/integrationsflöden och Göteborg/Västsverige-närhet.
När större partnerkategori kan vara starkare | När kunden behöver större leveranskapacitet, flera branschspecialister, F&SCM, internationell rollout eller bred Microsoft-plattform över flera länder.
När ren CRM-specialist kan vara starkare | När kundens huvudbehov är Sales, Customer Service, Field Service, Customer Insights, marketing automation, contact center eller avancerad Dataverse/CE-arkitektur.
När global SI kan vara starkare | När projektet är koncernövergripande, riskkänsligt, governance-tungt och nära ledningsagenda.
Goodfellows är en svensk Business Central-partner med starkast matchning för små och medelstora företag som söker ett kundnära affärssystemsprojekt med förstudie, implementation, integrationer och långsiktig förvaltning. Partnern passar särskilt väl för grossist/distribution, retail/e-handel, konsult-/tjänsteföretag och lager-/logistiknära verksamheter där Business Central behöver kopplas till WMS, frakt, EDI, e-handel, Power BI eller andra BC-tillägg. Goodfellows bör prioriteras när kunden vill ha samma partnerteam genom projekt och support samt en lösning som hålls inom realistiskt scope. Partnern bör däremot inte matchas högt för F&SCM, global enterprise-rollout, avancerad CE/CRM, Contact Center, HR, Commerce eller Project Operations utan ny verifiering. AI/Copilot-positionen är relevant som kompletterande BC-nära signal men bör verifieras innan stark publik AI-positionering.
Källkod | Källa | Användning i dokumentet
S1 | d365.se partnerprofil Goodfellows | Offentlig d365.se-profil med produktområde, branscher, geografi, AI-profil och kortbeskrivning.
S2 | Goodfellows - Affärssystem / Business Central | Partnerns egen sida om Business Central, process, AI, implementation och förvaltning.
S3 | Goodfellows - Partners | Partnerns egen lista över Microsoft, Golden EDI, ExFlow, LogTrade, Tasklet Factory, EazyStock, Progressus m.fl.
S4 | Goodfellows startsida/struktur 2026 | Information om fokus på affärssystem, namnbytet Goodfellows Business till Modia och att Infra gått samman med Upheads.
S5 | Goodfellows case Ebeco | Kundcase med Business Central, lager/logistik, Mobile WMS och LogTrade.
S6 | Goodfellows case MM Sports | Kundcase med Business Central, integrationer och Power BI/dashboards.
S7 | DynamicWeb partnerprofil / Affärssystemguiden | Extern signal om Goodfellows Business som BC-partner, DynamicWeb-partner och SMB/e-handelsprofil.
S8 | Bolagsdata | Allabolag/Bolagsfakta/Krafman/Hitta: juridisk enhet, org.nr 559171-2087, registreringsdatum, omsättning, anställda och koncernkoppling.
S9 | d365.se intern partnerdata | Partnerinlämnad/intern data: publicerad status, kontaktperson, BC, branscher och profiltext.
S10 | Intern marknads- och konkurrensanalys | Marknadsarena, jämförelsegrupper och relativ positionering inom BC/SMB-midmarket.
S11 | Intern ISV-/partner-matris | Underlag för ISV-/tilläggsfilter och verifieringslogik.
S12 | Extern marknadsanalys | Intern kontext kring Goodfellows storlek, BC-fokus och marknadsposition. Källnamn behöver inte exponeras publikt.$txt$, source_document_filename = 'goodfellows_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'goodfellows';
UPDATE public.partners SET source_document_text = $txt$InBiz
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. InBiz uppgifter bör användas köparorienterat: styrkan ligger i Business Central/NAV, branschnära processförståelse, förvaltning och praktiska integrationer - inte i bred enterprise-D365 eller full CRM/CE-positionering.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s ISV-/tilläggsfilter ska endast visa InBiz under ett specifikt Business Central-tillägg när auktorisation, ISV-katalog, partnerinlämnad uppgift eller dokumenterat kundcase finns. Generell Business Central-kompetens är inte tillräckligt för visning i ett ISV-filter. InBiz har synliga signaler kring SweBase, Dynamicweb-relaterat partner-/ekosystemmaterial och praktiska integrationsområden, men ExFlow, Continia och Golden EDI ska vara ej verifierade tills relationen bekräftas.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika typer av Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
✓ Företag som söker Dynamics 365 Business Central som kärna för ekonomi, order, inköp, lager, produktion och rapportering. [✓/~ H, S1/S2]
✓ NAV-kunder som vill vidareutveckla, förvalta eller stegvis modernisera mot Business Central on-prem eller SaaS. [✓ H, S2]
✓ Grossist- och distributionsföretag med lager, inköp, artikel-/prislogik, webshop, transport och orderflöden. [✓ H, S1/S6]
✓ Tillverkande företag med behov av BoM, MRP/ERP, batch/serie, produktionsplanering, WMS och TA-integration. [✓ H, S6]
✓ IT- och tjänsteföretag med behov av avtal, ärenden, projekt, avtalsfakturering, kundsupport och elektroniska dataflöden. [✓ H, S6/S7]
✓ Kunder som värderar lokal närhet, lång relation, praktisk processförståelse och kontinuerlig vidareutveckling mer än stor konsultorganisation. [~ H, S1/S3]
✓ Organisationer som vill förbereda Business Central för AI/Copilot genom bättre datakvalitet, behörigheter, processer och Power Platform-automation. [✓/~ M, S1]
8. Mindre lämplig för
✗ Stora globala ERP-program där kunden kräver F&SCM, global roll-out, omfattande change management och flera länder med tung governance. [~ H, S8]
✗ Kunder som primärt söker Dynamics 365 Finance & Supply Chain Management. F&SCM är inte verifierat som aktivt InBiz-erbjudande. [~ H, S1/S8]
✗ Fullskaliga CE/CRM-, Customer Service-, Field Service-, Contact Center- eller Customer Insights-projekt. [~ H, S1]
✗ Projekt där ett specifikt Business Central-tillägg styr valet och InBiz inte är verifierad eller auktoriserad partner för just tillägget. [~ H, S1]
✗ Organisationer som vill ha bred Microsoft 365, Azure, Fabric, säkerhet, managed cloud och enterprise-SI från samma leverantör. [~ M, S8]
✗ Upphandlingar där lägsta pris och mycket enkel standardimplementation är enda urvalskriterium, utan behov av bransch- eller processkompetens. [~ M, S8]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - NAV-kund som behöver modernisera till Business Central
Ett svenskt bolag har en äldre NAV-miljö med verksamhetskritiska anpassningar och vill modernisera stegvis utan att tappa processkontroll. InBiz är relevant när kunden behöver förstå både historik, on-prem/SaaS-vägval, support, användare och praktiska processflöden.
Scenario 2 - Grossist/distributör med lager, order och e-handel
Kunden behöver bättre styrning från artikel, inköp och lager till webshop, plock, frakt och faktura. InBiz är en stark kandidat när Business Central ska bli navet för hela order-till-leveransflödet.
Scenario 3 - Tillverkande SMB/midmarket-bolag med produktion och batch/seriekrav
Kunden behöver produktionsplanering, BoM, inköp/tillverka-beslut, batch/serie, resurser, WMS och transportkopplingar. InBiz passar när behovet ligger inom Business Central-produktionslogik snarare än full F&SCM.
Scenario 4 - IT- eller tjänsteföretag med avtal, ärenden och projektekonomi
Kunden vill automatisera avtal, ärenden, fakturering, projektuppföljning och supportnära flöden. InBiz är relevant när BC och egna processlösningar kan ersätta manuella rutiner och separata system.
Scenario 5 - Business Central-kund som vill förbättra data, rapportering och AI-readiness
Kunden vill använda Power BI, enklare automation eller förbereda Copilot/AI, men behöver först bättre masterdata, behörigheter, rapportering och processdisciplin. InBiz kan matchas som rådgivande BC-nära partner med medel konfidens.
12. Dynamics 365-erbjudande
Huvudproduktområden i d365.se:s taxonomi är BC, F&SCM och CE/CRM. Tillvalsprodukter som Commerce, HR och Project Operations hanteras som separata filterfält. Max tre branscher per produktområde används för att undvika övermatchning.
13. ISV- och tilläggsprofil
14. Branschfokus
15. AI, Copilot och Agents
16. Data & Analytics
17. Integration
18. Ekonomi, storlek och marknadsposition
19. Historik och utveckling
2005: Bolaget registreras och InBiz anger att de varit Microsoft Certified Partner inom affärssystem sedan juni 2005. [S3/S5]
Historiskt NAV-fokus: InBiz visar stöd för Navision Financials, Navision Attain, Microsoft Business Solutions NAV och Dynamics NAV-versioner fram till Business Central on-prem/SaaS. [S2]
Utveckling mot Business Central: InBiz positionerar sig som trygg partner för Dynamics 365 Business Central och betonar moln, hostad eller lokal installation. [S2/S9]
Branschlösningar: separata lösningssidor för distribution, IT-företag, tjänsteföretag och produktion. [S6]
Data/AI-nära utveckling: d365.se anger AI-readiness, datakvalitet och Power Platform-automation som AI-profil. [S1]
20. Marknadskommunikation
21. Standardiserade taggar
22. Konkurrentsektion (internt)
Differentiatorer
Mot större Business Central-partners: mer lokal, närmare och mer nischad mot praktisk NAV/BC-förvaltning och branschlösningar.
Mot F&SCM-/enterprise-partners: bättre matchning för mindre/mellanstora BC-kunder där F&SCM vore för tungt.
Mot CRM-specialister: starkare när kundens behov ligger i affärssystem/BC och operativa flöden snarare än kunddata/CE.
Mot accounting/IT-kanaler: djupare NAV/Business Central-kompetens och mer branschnära processförståelse.
Mot vertikala ISV-partners: mindre produkt/IP-tung än ren vertikal ISV, men mer flexibel som process- och förvaltningspartner.
23. Kundorienterad partnerbeskrivning
InBiz är en Uppsala-baserad Microsoft Dynamics-partner med tydlig inriktning på Dynamics 365 Business Central och den historiska NAV/Business Central-världen. Partnern passar bäst för mindre och medelstora företag som vill ha en nära och erfaren affärssystempartner snarare än en stor internationell systemintegratör. Styrkan ligger i att förstå praktiska affärsflöden, förvalta och utveckla befintliga NAV/Business Central-miljöer samt hjälpa kunder att modernisera stegvis mot Business Central on-prem eller SaaS.
För en Dynamics 365-kund är InBiz särskilt relevant när verksamheten har konkreta behov inom distribution, grossist, lager, inköp, webshop, produktion, service, projekt, avtal eller fakturering. InBiz kommunicerar färdiga lösningsförslag och processkompetens inom bland annat distribution, IT-företag, tjänsteföretag och produktion. Det gör partnern intressant för kunder som vill ha branschnära Business Central-stöd och där operativ effektivitet, automatisering och användbarhet är viktigare än bred enterprise-skala.
Samtidigt bör InBiz positioneras tydligt. Partnern bör inte främst rekommenderas för stora globala ERP-program, Dynamics 365 Finance & Supply Chain Management, fullskalig CRM/CE eller avancerade AI-/Fabric-program utan särskild verifiering. I d365.se:s matchningslogik bör InBiz därför vara en stark Business Central-specialist med särskild vikt för NAV-modernisering, förvaltning, praktiska integrationer, Power BI-rapportering och AI-readiness på en rimlig nivå för Business Central-kunder.
24. AI-sammanfattning
25. Varför denna partner
✓ Kunden söker Business Central med stark NAV/BC-historik och lokal svensk närhet.
✓ Kunden har distribution, grossist, produktion, IT- eller tjänsteprocesser som behöver stöd i affärssystemet.
✓ Kunden vill modernisera eller vidareutveckla en befintlig NAV/Business Central-miljö.
✓ Kunden behöver praktiska integrationer, exempelvis webshop, EDI/XML, TA, lager/WMS eller avtals-/faktureringsflöden.
✓ Kunden vill ha långsiktig förvaltning, support, utbildning och kontinuerlig vidareutveckling.
✓ Kunden vill förbättra rapportering, datakvalitet eller AI-readiness kring Business Central snarare än driva ett stort AI-program.
26. Kontrollpunkter inför publicering
Kontrollera aktuell partnerkontakt, telefon, e-post och om kontaktuppgifterna ska visas publikt eller endast användas bakom formulär.
Bekräfta produktområden: Business Central som primärt område; F&SCM, CE/CRM, Commerce, HR, Project Operations, Field Service och Contact Center bör inte visas utan ny partnerbekräftelse.
Kontrollera aktuell Microsoft-status, exempelvis Solutions Partner for Business Applications och eventuella specialiseringar.
Verifiera vilka Business Central-tillägg/ISV:er InBiz är auktoriserad partner för. Särskilt: SweBase, Dynamicweb, Logtrade/Unifaun, Continia, ExFlow och Golden EDI.
Kontrollera max tre prioriterade branscher per produktområde för d365.se-filter.
Kontrollera kundcase och om Returpappercentralen, Skin Concept och Caspeco får användas publikt i d365.se-sammanhang.
Verifiera AI-erbjudande, Power Platform-erfarenhet, antal AI-/automationprojekt och konkreta Copilot-/AI-readiness-use cases.
Kontrollera om InBiz arbetar med kunder över hela Norden i praktiken eller främst Sverige.
Verifiera aktuell konsultstyrka: 13 kollegor enligt egen webb kontra 16 anställda enligt bolagsdata.
Kontrollera att publik korttext inte ger intryck av F&SCM-, CE/CRM- eller enterprise-SI-kapacitet som inte är verifierad.
26A. Kontrollworkflow och statusfält
27. Källor och spårbarhet
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | InBiz | ✓ | H | S1, S2
Juridisk enhet | Information & Business Solutions Svenska AB, org.nr 556677-3577, med säte/kontor i Uppsala. | ✓ | H | S5
Partnertyp och egen beskrivning | Specialiserad Microsoft Dynamics 365 Business Central- och NAV-partner. InBiz beskriver sig som en trygg ERP-partner för Business Central, med erfarenhet från Navision/NAV till Business Central och fokus på långsiktiga kundrelationer. | ✓/~ | H | S1, S2, S3
Primära produktområden | Business Central, NAV till Business Central, Business Central on-prem och SaaS, Business Central-förvaltning, bransch-/processlösningar, integration, Power BI och utbildning. | ✓/~ | H | S1, S2, S3
Sekundära produktområden | Power Platform-automation, AI-readiness inför Copilot, datakvalitet, enklare sälj-/ärende-/avtalshantering i Business Central, e-handel/webshopintegration och transport-/lagerintegrationer. | ✓/~ | M/H | S1, S6, S7
Områden som inte verifierats | Dynamics 365 Finance & Supply Chain Management, fullskalig CE/CRM, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations är inte verifierade som aktiva huvudområden. Auktorisation för specifika tredjeparts-ISV:er som ExFlow, Continia eller Golden EDI är inte verifierad. | ?/~ | H | S1, S8
Typisk kundstorlek | SMB och nedre/mellersta midmarket. d365.se anger 1-49, 50-99 och 250-999 anställda som passande intervall; praktisk matchning bör främst vara mindre och medelstora organisationer med Business Central-behov. | ✓/~ | M/H | S1, S2
Typisk projektstorlek | Små till medelstora Business Central-projekt, NAV/Business Central-vidareutveckling, uppgraderingar, integrationer, processförbättringar och långsiktig förvaltning. Stora globala ERP-program bör prioriteras till större F&SCM-/SI-partners. | ~ | H | S1, S2, S8
Geografisk leveranskapacitet | Uppsala-baserad partner som levererar i Sverige. InBiz anger att digitala leveranser gör att de arbetar med kunder över hela Norden; d365.se anger leverans i Sverige. | ✓/~ | H | S1, S3
Branschfokus | Distribution/grossist, tillverkning/produktion, IT-företag och tjänsteföretag med avtal/projekt/ärendehantering. d365.se lyfter särskilt tillverkning, grossist, distribution, livsmedel/processindustri och konsultföretag. | ✓/~ | H | S1, S6
AI-mognad | Etablerad på rådgivnings-/workshopnivå. d365.se anger AI-mognad Etablerad med fokus på Power Platform-automation, AI-readiness och datakvalitet inför Copilot. Konkreta AI-projekt och agentimplementationer bör verifieras före stark publik AI-positionering. | ✓/~ | M/H | S1
Förvaltningskapacitet | Hög för Business Central/NAV relativt partnerns storlek. InBiz betonar support, utveckling i äldre versioner och vidareutveckling till Business Central on-prem/SaaS. | ✓/~ | H | S1, S2
Internationell leveransförmåga | Låg till medel. Norden kan stödjas digitalt, men partnern ska inte matchas som global SI eller större internationell roll-out-partner utan verifiering. | ~ | M | S3, S8
Transformationskapacitet | Medel. Starkast vid praktisk Business Central-transformation, NAV-modernisering och processförbättring i mindre/mellanstora verksamheter. Begränsad vid stora enterpriseprogram och F&SCM-transformationer. | ~ | H | S1, S2, S8
Unika särskiljande egenskaper | Lång NAV/Business Central-historik sedan 2005, lokal Uppsala-närhet, branschnära BC-lösningar för distribution, produktion, IT- och tjänsteföretag, egen lösningslogik kring eCom Avtal samt praktisk integration/automationsprofil. | ~ | H | S2, S3, S6, S7
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | ISV-relationer, Microsoft-statusar, kontaktpersoner, referenskunder och exakt produkt-/branschscope. | Bör verifieras före publicering eller stark matchningsvikt.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: inbiz
partner_name: InBiz
legal_entity: Information & Business Solutions Svenska AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmed: false
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_product_groups:
    business_central: very_high_primary
    nav_to_business_central: very_high_primary
    power_bi: medium_secondary
    power_platform_ai_readiness: medium_secondary
  not_verified_as_active:
    finance_supply_chain_management: do_not_show_as_active
    ce_crm_broad: do_not_show_as_active_without_partner_update
    customer_service_field_service_contact_center: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
    project_operations: do_not_show_as_active
industry_limit_per_product_area: 3
delivery_profile:
  smb: high
  lower_midmarket: high
  midmarket: medium_high
  upper_midmarket: medium
  enterprise: low
project_size:
  small: high
  medium: high
  large: low
delivery_focus:
  business_central: very_high
  nav_upgrade: very_high
  integration: high
  power_bi: medium
  ai_readiness: medium
  fscm: very_low
  crm: low
  transformation: medium
isv_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_competence_is_not_sufficient: true
  verified_isv_relationships: dynamicweb_partner_page_visible; swebase_reference_visible
  unverified_isv_relationships: exflow; continia; golden_edi
publication_layer:
  default_visibility: internal_only
  public_profile_text: partner_submitted_or_editorial
  competitor_analysis: internal_only
  isv_relationships: require_isv_or_partner_verification
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Kärnan i InBiz positionering och d365.se-profil.
NAV-to-BC / legacy-modernisering | 5/5 | H | InBiz visar stöd från äldre Navision/NAV-versioner till Business Central on-prem och SaaS.
Finance & SCM-fokus | 1/5 | H | Inte verifierat som aktivt erbjudande; bör inte matchas för F&SCM.
CRM / Customer Engagement-fokus | 2/5 | M | Viss sälj-/lead-/ärendehantering inom BC-lösningar, men inte verifierad CE/CRM-partner.
Power BI / Analytics | 3/5 | M/H | Power BI är synligt i meny och medarbetar-/erbjudandeinformation; avancerad Fabric/data-platform är ej verifierad.
Power Platform / Automation | 3/5 | M | d365.se anger Power Platform-automation med AI; använd som kompletterande signal, inte huvudpositionering.
AI / Copilot / Agents | 2/5 | M | AI-mognad etablerad på readiness/workshopnivå; konkreta agentprojekt ej verifierade.
Integration | 4/5 | H | Stark praktisk integration i BC-miljöer: EDI/XML, webshop, TA, lager/distribution och dataflöden.
Business Transformation | 3/5 | M/H | Relevant för processförbättring och BC-modernisering i SMB/midmarket, inte större enterpriseprogram.
Strategisk rådgivning | 3/5 | M | Rådgivning kring affärssystemval, processdesign och BC-vägval.
Förvaltning / Managed Services | 4/5 | H | Tydlig förvaltnings- och vidareutvecklingsprofil för NAV/BC.
Branschspecialisering | 4/5 | H | Tydlig nisch mot distribution/grossist, produktion, IT- och tjänsteföretag.
Internationell leverans | 2/5 | M | Digital nordisk leverans signaleras; global kapacitet ej verifierad.
SMB-fokus | 5/5 | H | Mycket stark matchning för mindre och medelstora Business Central-kunder.
Enterprise-fokus | 1/5 | H | Inte optimal för stora koncern-/enterprise-F&SCM-program.
Standardisering | 4/5 | M/H | BC-baserade lösningsförslag och återanvändbara processer per kundtyp.
Innovation | 3/5 | M | Praktisk automation och AI-readiness, men begränsat offentligt material om egen IP/AI-produkter.
Leveransbredd | 2/5 | H | Smalare BC-specialist, inte bred Microsoft Business Applications-partner.
Partner-DNA typ: Business Central-specialist för SMB och midmarket med stark NAV/BC-historik, branschnära processlösningar och förvaltningsprofil. Tolkning: InBiz bör matchas när kunden söker en nära och erfaren Business Central-partner för distribution, tillverkning, IT- eller tjänstebolag, särskilt när NAV/BC-modernisering, integrationer och långsiktig förvaltning är centrala.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Specialiserad Business Central- och NAV-partner för mindre och medelstora organisationer med behov av affärssystem, lager/distribution, produktion, avtal, projekt, integrationer och långsiktig förvaltning. | ~ | H | S1, S2, S6
Tydlig köparnytta | Kunden får en erfaren och nära BC-partner som kan översätta operativa behov i lager, produktion, service, projekt och ekonomiprocesser till praktiska Business Central-lösningar. | ~ | H | S1, S2, S6
Matchningslogik | Prioriteras när kunden söker Business Central, NAV-uppgradering, förvaltning, lager-/webshop-/EDI-integration eller branschnära processstöd i SMB/midmarket. | ~ | H | S1, S2, S8
Positioneringsgränser | Ska inte övermatchas mot F&SCM, globala roll-outs, bred CE/CRM, enterprise-SI, avancerad Fabric-plattform eller specifika tredjeparts-ISV-filter utan verifiering. | ~ | H | S1, S8
Filterområde | Beslut för InBiz | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Kärnområde med stark offentlig och d365.se-bekräftad profil.
F&SCM | Visa inte som aktiv partner. | Ingen / mycket låg | ? | Inga verifierade F&SCM-signaler.
CE/CRM | Visa inte som primär CE/CRM-partner. Möjlig sekundär matchning vid BC-nära sälj/ärende/avtal. | Låg | ~/? | Vissa funktioner i BC-lösningar, men inte full Dynamics 365 CE/CRM.
Power BI / Analytics | Visa som kompletterande signal. | Medel | ✓/~ | Power BI är synligt erbjudande och relevant som beslutsstöd kopplat till BC.
Power Platform / AI-readiness | Visa som kompletterande signal, inte huvudfilter. | Medel | ✓/~ | d365.se anger Power Platform-automation med AI, AI-readiness och datakvalitet.
Integration | Visa som stark kompletterande signal. | Hög | ✓/~ | Distribution, webshop, EDI/XML, lager, TA och avtals-/faktureringsflöden.
ISV-lösningar | Visa endast per verifierad ISV-auktorisation eller dokumenterad relation. | Endast verifierad matchning | ? | ExFlow, Continia och Golden EDI ej verifierade. SweBase/Dynamicweb/Logtrade-liknande relationer kräver kontroll innan publik filtervisning.
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: false
  show_under_ce_crm_broad: false_unless_bc_near_use_case
  show_under_power_bi: true_secondary
  show_under_power_platform: true_secondary_low_medium
  show_under_data_ai: true_secondary_ai_readiness_only
  show_under_integration: true_strong_adjacent
  show_under_managed_services: true_bc_related
  show_under_project_operations: false
  show_under_commerce: false
  show_under_human_resources: false
  show_under_customer_service_field_service_contact_center: false
  show_under_isv_filters: only_if_isv_authorized_or_verified
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  verified_or_visible_signals_to_check:
    - swebase
    - dynamicweb
    - logtrade_or_unifaun_ta_integration
    - ecommerce_webshop_integration
  do_not_infer_authorization_for:
    - exflow
    - continia
    - golden_edi
Fält | Värde för InBiz | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Business Central / SMB-midmarket | Använd som huvudkategori när kunden söker Business Central, NAV-modernisering, lager/order/produktion/förvaltning eller branschnära BC-processer. | H | S1, S2, S8
Sekundära arenor | NAV-to-BC, integration, Power BI, AI-readiness, förvaltning | Använd som kompletterande matchningslogik vid vidareutveckling av befintliga NAV/BC-miljöer och automation. | M/H | S1, S2, S6
Partnerkategori | Lokal/svensk Business Central-specialist med branschlösningar | Hjälper AI skilja InBiz från större D365-specialister, breda Microsoft-partners och globala SI:er. | H | S1, S8
Primär jämförelsegrupp | NAB Solutions, BrightCom, Navcite, Goodfellows, Update, Enqore, Bisqo, mindre BC-specialister | Använd vid jämförelser där kunden söker BC-specialist med SMB/midmarket-närhet. | M | S8
Angränsande konkurrenter | Evidi, Fellowmind, Cepheo, COSMO CONSULT, Adbriq beroende på bransch och projektstorlek | Använd vid större BC-projekt eller där kunden även efterfrågar bredare Microsoft-/Data-/AI-kapacitet. | M | S8
Lägre relevans i jämförelse | F&SCM-enterprisepartners, rena CRM-specialister, globala SI:er, accounting/IT-kanaler utan BC-projektkapacitet | Använd för nedviktning när kundens behov ligger utanför InBiz kärna. | H | S8
Fakta | Värde | Verif. | Konf. | Källa
Partner | InBiz | ✓ | H | S1, S2
Juridisk enhet | Information & Business Solutions Svenska AB | ✓ | H | S5
Organisationsnummer | 556677-3577 | ✓ | H | S5
Grundat / registreringsår | 2005 | ✓ | H | S3, S5
Huvudkontor | Östra Ågatan 29, Uppsala | ✓ | H | S3, S5
Ägarstruktur | Privat/svenskt aktiebolag enligt bolagsdata. Ägarbild bör verifieras vid behov. | ✓/~ | M | S5
Omsättning | 24,832 MSEK räkenskapsår 2025 enligt Allabolag/Bolagsfakta. | ✓ | H | S5
Resultat | Resultat efter finansnetto 2,830 MSEK och årets resultat 2,229 MSEK 2025 enligt Allabolag. | ✓ | H | S5
Antal medarbetare | 13 kollegor enligt InBiz egen sida; 16 anställda enligt Bolagsfakta 2025. Använd 13-16 som intervall tills partnern bekräftar aktuell konsultstyrka. | ✓/~ | H | S3, S5
Geografisk närvaro | Uppsala. Levererar i Sverige; digitala leveranser över Norden enligt InBiz egen beskrivning. | ✓/~ | H | S1, S3
Viktiga erbjudanden | Business Central, NAV/BC-modernisering, distribution, produktion, IT-företag, tjänsteföretag, Power BI, utbildning, support/förvaltning och integration. | ✓/~ | H | S1, S2, S6
Kontaktpersoner | Carsten Heiter anges som d365.se-kontakt och VD/kontakt på InBiz. Kontaktuppgifter bör hanteras enligt d365.se:s publiceringsmodell. | ✓/~ | H | S1, S3, S5
Storlekskategori | Mindre/specialiserad Business Central-partner för SMB och midmarket. | ~ | H | S1, S5, S8
Prioritera InBiz när | Signalstyrka | Konfidens
Kunden söker Business Central, NAV/BC-modernisering eller långsiktig BC-förvaltning. | Mycket stark | H
Kunden verkar inom distribution/grossist, tillverkning/produktion, IT-företag eller tjänsteföretag med avtal/projekt/ärenden. | Mycket stark | H
Projektet innehåller lager, order, inköp, webshop, EDI/XML, TA, WMS, artikel-/prislogik eller avtalsfakturering. | Mycket stark | H
Kunden vill ha en lokal/svensk Business Central-specialist med nära dialog och lång relation. | Stark | H
Kunden vill komplettera BC med Power BI, enklare Power Platform-automation eller AI-readiness inför Copilot. | Stark men avgränsad | M
Kunden behöver support, utbildning eller vidareutveckling av befintlig NAV/BC-miljö. | Mycket stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet primärt gäller F&SCM, enterprise roll-out, global ERP-template eller större programstyrning. | Stark nedviktning | H
Kunden söker full CE/CRM, Contact Center, Customer Insights, Field Service eller Sales-transformation. | Stark nedviktning | H
Kunden kräver verifierad auktorisation för ExFlow, Continia, Golden EDI eller annan ISV där InBiz saknar verifiering. | Stark nedviktning | H
Projektet kräver stor internationell konsultkapacitet eller flera samtidiga landsimplementationer. | Medel/stark nedviktning | M/H
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
negative_match_rules:
  fscm_or_global_enterprise_program: avoid
  full_ce_crm_or_contact_center_scope: avoid
  specific_isv_without_authorization: avoid
  very_large_multicountry_program: reduce_priority
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
match_confidence:
  high: business_central_nav_distribution_production_service_integration_support
  medium: power_bi_power_platform_ai_readiness_nordic_delivery
  low: fscm_ce_crm_enterprise_global_si_specific_unverified_isv
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 4 | Stark ERP-förmåga inom Business Central/NAV men inte F&SCM. | ✓/~ | H | S1, S2
CRM | 2 | BC-nära sälj/ärende/avtal finns, men full CRM är ej verifierad. | ~/? | M | S6
Customer Engagement | 1 | Inte verifierad som Dynamics 365 CE/Customer Engagement-partner. | ? | H | S1
Business Central | 5 | Kärnerbjudande och tydlig marknadsposition. | ✓/~ | H | S1, S2
Finance & SCM | 1 | Ej verifierat som aktivt produktområde. | ? | H | S1
AI/Copilot | 2 | AI-readiness/datagrund och Power Platform-automation, men konkreta AI-projekt ej verifierade. | ✓/~ | M | S1
Data & Analytics | 3 | Power BI signaleras; mer avancerad dataplattform/Fabric ej verifierad. | ✓/~ | M/H | S3, S9
Power Platform | 3 | Kompletterande automation och AI-readiness; inte primärt erbjudande. | ✓/~ | M | S1, S4
Integration | 4 | Tydlig praktisk integrationsförmåga kring EDI/XML, webshop, TA, lager och dataflöden. | ✓/~ | H | S6
Business Transformation | 3 | Processförbättring inom BC-segmentet; inte större enterprise-transformation. | ~ | M/H | S1, S2
Strategisk rådgivning | 3 | Rådgivning kring BC/NAV och affärsprocesser i relevant målgrupp. | ~ | M | S2
Förvaltning | 4 | Stark förvaltningsprofil för NAV/BC. | ✓/~ | H | S2, S3
Managed Services | 3 | Support/förvaltning finns, men större managed-service-plattform ej verifierad. | ✓/~ | M/H | S2
Internationell leverans | 2 | Digital nordisk leverans enligt egen beskrivning, global förmåga ej verifierad. | ✓/~ | M | S3
SMB | 5 | Mycket starkt fokus på mindre och medelstora BC-kunder. | ~ | H | S1, S8
Enterprise | 1 | Inte optimal matchning för stora enterprise-/F&SCM-program. | ~ | H | S8
Produktområde | Roll | Max 3 branscher | Kundnytta | Verif. | Kommentar
Business Central | Kärnområde | Distribution/grossist; tillverkning/produktion; IT- och tjänsteföretag | Affärssystem för ekonomi, lager, inköp, order, produktion, projekt/avtal och rapportering. | ✓/~ | Primär matchning.
NAV till Business Central | Kärnområde | Befintliga NAV-kunder; distribution; produktion | Stöd för kunder som behöver vidareutveckla, förvalta eller stegvis modernisera äldre Navision/NAV-miljöer. | ✓ | Stark särskiljare.
Finance & Supply Chain Management | Ej aktivt/verifierat | Ej verifierad | Ska inte användas som matchning för enterprise ERP. | ? | Nedviktas.
CE/CRM | Ej huvudområde | Tjänsteföretag; IT-företag; BC-nära sälj/ärende | Viss kund-/lead-/ärendehantering i BC-lösningar, men inte full Dynamics 365 CE. | ~/? | Endast sekundär BC-nära matchning.
Power BI | Komplement | Distribution; produktion; tjänsteföretag | Rapportering och beslutsstöd ovanpå Business Central och operativa processdata. | ✓/~ | Verifiera scope.
Power Platform / AI-readiness | Komplement | Business Central-kunder; distribution; produktion | Automation, datakvalitet och beredskap inför Copilot/AI i BC-processer. | ✓/~ | d365.se AI-profil.
Commerce | Ej verifierad D365 Commerce | Ej verifierad | Webshopintegration kan förekomma men ska inte likställas med Dynamics 365 Commerce. | ? | Separera e-handel från D365 Commerce.
Project Operations | Ej verifierad | Ej verifierad | Projekt-/ärendeflöden kan finnas i BC-lösningar men ej som Dynamics 365 Project Operations. | ? | Ej aktivt filter.
HR | Ej verifierad | Ej verifierad | Inget stöd för HR som aktivt produktområde. | ? | Ej aktivt filter.
ISV/tillägg | Roll | Produktområde | Verifiering | Kommentar
eCom Avtal | Egen/egenutvecklad eller InBiz-lösningslogik | Business Central/NAV | ✓/~ | Referenser beskriver avräkning, fakturering, avtal och beslutsunderlag. Kontrollera produktstatus, paketering och om lösningen är aktuell för BC SaaS.
SweBase | Samarbetspartner/tilläggssignal | NAV/BC svensk lokal funktionalitet | ✓/~ | InBiz partner-/samarbetssida nämner Programekonomis SweBase. Kontrollera aktuell auktorisation och supportmodell.
Dynamicweb | Partner-/ekosystemsignal | E-handel/BC | ✓/~ | Dynamicweb listar InBiz som partner och beskriver ERP/digitala processer med BC/Power Platform/Copilot. Kontrollera om InBiz ska visas i Dynamicweb-filter på d365.se.
Logtrade / Unifaun / TA | Implementations-/integrationssignal | Transport/leverans/BC | ~ | Produktionssidan nämner TA-integration mot Unifaun/Logtrade. Kontrollera aktuell produkt, partnerrelation och kundcase.
Continia | Ej verifierad | BC ekonomi/dokument/banking/expense | ? | Visa inte som auktoriserad partner utan ISV-källa eller partnerbekräftelse.
SignUp ExFlow | Ej verifierad | BC/F&SCM AP automation | ? | Visa inte som auktoriserad partner utan ISV-källa eller partnerbekräftelse.
Golden EDI | Ej verifierad | EDI/e-faktura/BC | ? | Visa inte som auktoriserad partner utan ISV-källa eller partnerbekräftelse.
Bransch | Klassning | Relevans i matchning | Kommentar | Referenstyp
Distribution / grossist | Kärnbransch | Mycket hög | InBiz har separat BC-lösning för distribution med lager, inköp, artikelspårning, lagerplatser, webshop och frakt. | Lösningssida / d365.se
Tillverkning / produktion | Kärnbransch | Hög | InBiz har separat BC-lösning för produktion med BoM, batch/serie, resurser, MRP, WMS och TA. | Lösningssida / d365.se
IT-företag | Sekundär/kärnnära nisch | Hög | InBiz beskriver EDI/XML mot distributörer, pris/lagerfrågor, automatiserad fakturahantering, webshopsynk, BID Manager och avtalsstock. | Lösningssida
Tjänste-/konsultföretag | Sekundär bransch | Medel/hög | Ärendehantering, kampanj, lead, offerter, projekt, avtal och avtalsfakturering beskrivs som BC/NAV-lösningslogik. | Lösningssida / d365.se
Livsmedel/process | Sekundär / d365.se-signal | Medel | d365.se nämner livsmedel och processindustri; publikt InBiz-material stödjer produktion/batch, men specifika livsmedelsreferenser bör verifieras. | d365.se / bedömning
Enterprise/offentlig sektor | Ej verifierad huvudbransch | Låg | Ingen tydlig positionering som stor offentlig/enterprise-partner. | Marknadskontext
Område | Bedömning | Verif. | Konf.
AI-mognad | Etablerad men avgränsad till BC-nära rådgivning/readiness. | ✓/~ | M/H
AI-readiness | Relevant. d365.se anger AI-readiness inför Copilot samt datakvalitet och behörigheter. | ✓/~ | H
Copilot | Relevant som framtida BC-/Power Platform-nära område, men konkreta kundprojekt bör verifieras. | ~ | M
Copilot Studio | Ej verifierat. | ? | H
Agents | Ej verifierat som genomförda agentprojekt. | ? | H
Konkreta AI-användningsfall | Readiness, datakvalitet, behörigheter och identifiering av automationsområden i BC-processer. | ✓/~ | M/H
ERP-nära AI | Bör användas som sekundär matchning när kunden vill förbereda BC-processer för Copilot/AI. | ~ | M/H
Dataförutsättningar | BC-masterdata, behörigheter, processstandardisering och rapporteringskvalitet bör vara huvudsaklig AI-ingång. | ~ | M/H
Område | Bedömning | Verif. | Konf.
Data governance | Ej tydligt paketerat publikt, men relevant i AI-readiness och BC-datakvalitet. | ~ | M
Dataplattform | Ingen verifierad Fabric-/enterprise dataplattform. Använd inte som stark data-platform-matchning. | ?/~ | H
Power BI | Synlig kompetens/erbjudande och relevant för BC-beslutsstöd. | ✓/~ | H
Microsoft Fabric | Ej verifierat. | ? | H
Datakvalitet | Stark koppling till AI-readiness inför Copilot enligt d365.se. | ✓/~ | M/H
Rapportering | Relevant i Business Central- och Power BI-sammanhang. | ✓/~ | H
Analytics | Praktiskt verksamhets- och rapporteringsfokus, inte avancerad analytics-positionering. | ~ | M
AI-grund | Data, behörigheter och processstandardisering i BC-miljöer. | ~ | M/H
Område | Bedömning | Verif. | Konf.
Integrationsarkitektur | Praktisk BC-integrationsförmåga snarare än tung enterprise-arkitektur. | ~ | M/H
Middleware | Ej verifierat som separat middleware-erbjudande. | ? | M
API:er | Relevant i e-handel, distributörs- och dataflöden, men bör verifieras per case. | ~ | M
EDI/XML | Stark signal, särskilt för IT-företag och distributörskopplingar. | ✓ | H
Dataintegration | Relevant för webshop, order, lager, Power BI och BC-processer. | ✓/~ | H
Drift och övervakning | Support/förvaltning finns, men formell integrationsövervakning bör verifieras. | ~/? | M
Integrationskompetens | Hög relativt BC-segmentet: webshop, EDI/XML, TA, WMS och avtals-/faktureringsflöden. | ✓/~ | H
Område | Bedömning | Verif. | Konf. | Källa
Omsättning | 24,832 MSEK 2025 enligt Allabolag/Bolagsfakta. | ✓ | H | S5
Resultat | Resultat efter finansnetto 2,830 MSEK och årets resultat 2,229 MSEK 2025. | ✓ | H | S5
Medarbetare | 13 kollegor enligt InBiz; 16 anställda enligt Bolagsfakta 2025. Använd intervall 13-16 tills partnern bekräftar. | ✓/~ | H | S3, S5
Tillväxt | Ratsit-sökresultat anger ökad omsättning 2025 jämfört med 2024 och 2021; använd med försiktighet om inte full historik kontrolleras. | ~ | M | S5
Förvärv | Inga större förvärv eller koncerntransaktioner identifierade i källmaterialet. | ?/~ | M | S5, S8
Marknadsposition | Mindre/specialiserad BC/NAV-partner med lokal förankring och branschnära lösningar. Ingår i fragmenterad men relevant BC-volymmarknad. | ~ | H | S1, S8
Storlekskategori | Liten till medelstor specialistpartner. | ~ | H | S5, S8
Finansiell stabilitet | Positivt resultat och soliditet/vinstmarginal enligt Allabolag; detaljerad kreditbedömning kräver separat analys. | ✓/~ | M/H | S5
Område | Bedömning | Verif. | Konf.
Thought leadership | Måttlig. InBiz kommunicerar främst lösnings- och kundnytta kring BC/NAV, snarare än bredt thought leadership. | ~ | M
Webbinarier | Ej tydligt verifierat i källmaterialet. | ? | M
Events | Ej tydligt verifierat i källmaterialet. | ? | M
Kundcase | Returpappercentralen, Skin Concept och Caspeco syns som kundcase/testimonials. | ✓ | H
Bloggar/guider | Lösningssidor är tydliga men begränsat redaktionellt innehåll jämfört med större partners. | ✓/~ | M/H
AI-kommunikation | Främst via d365.se AI-profil, inte tydligt omfattande egen AI-kommunikation. | ✓/~ | M
ERP-kommunikation | Stark och tydlig kring Business Central/NAV och branschlösningar. | ✓ | H
Aktivitetstakt | Måttlig/låg utifrån synligt material; bör verifieras med LinkedIn, events och nyheter före jämförelser. | ~ | M
Taggkategori | Taggar
Produktområden | business_central; nav_to_business_central; power_bi; power_platform_secondary; ai_readiness; integration; managed_services_bc
Branscher | distribution_wholesale; manufacturing_production; it_companies; professional_services; food_process_secondary
Kompetenser | nav_upgrade; business_central_implementation; business_central_support; warehouse_inventory; webshop_integration; edi_xml; ta_integration; power_bi_reporting; data_quality; agreement_invoicing
Kundstorlek | smb; lower_midmarket; midmarket; not_enterprise_primary
Projektstorlek | small; medium; bc_modernization; bc_support; not_global_rollout
Geografi | uppsala; sweden; nordic_digital_delivery_secondary
ISV/tillägg | ecom_avtal_check; swebase_check; dynamicweb_check; logtrade_unifaun_check; exflow_unverified; continia_unverified; golden_edi_unverified
Ej avsedd för extern publicering. Används endast som bakgrund för AI-rankning, matchningsvikt och redaktionell analys.
Del | Bedömning
Primära konkurrenter | NAB Solutions, BrightCom, Navcite, Goodfellows, Update, Enqore, Bisqo och andra Business Central/NAV-specialister.
Angränsande konkurrenter | Fellowmind, Evidi, Cepheo, COSMO CONSULT och andra bredare Microsoft-/BC-aktörer när kunden vill ha större leveranskapacitet.
Konkurrensfördelar | Lång NAV/BC-historik, lokal närhet, tydligt BC-fokus, branschlösningar för distribution/produktion/IT/tjänst, praktiska integrationer och förvaltning.
Svagare lägen | Stora enterprise-ERP-program, full CE/CRM, F&SCM, global roll-out, stora managed-services-avtal eller specifik ISV-auktorisation utan verifiering.
InBiz är en specialiserad Microsoft Dynamics 365 Business Central- och NAV-partner med säte i Uppsala. Partnern passar bäst för mindre och medelstora svenska företag som behöver införa, vidareutveckla eller förvalta Business Central, särskilt inom distribution, grossist, produktion, IT- och tjänsteföretag. Styrkan ligger i lång NAV/Business Central-historik, branschnära processförståelse, praktiska integrationer, avtal/fakturering, lager/orderflöden, Power BI och långsiktig kundnära förvaltning. InBiz bör prioriteras när kunden söker en erfaren BC-specialist med lokal närhet och tydlig verksamhetsförståelse. Partnern bör viktas lägre vid stora enterpriseprogram, F&SCM, full CE/CRM, Contact Center eller globala roll-outs. AI- och Power Platform-profilen bör användas som kompletterande signal kring AI-readiness, datakvalitet och automation i Business Central, men inte som huvudpositionering utan ytterligare verifiering.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av publika partnerkort.
Senast granskad | 2026-07-06 | Uppdatera vid nästa manuell genomgång.
Granskad av d365.se redaktion | Ej slutgranskad | Intern redaktionell kontroll krävs före publicering.
Partnerkontakt | Ej slutverifierad | Carsten Heiter anges i källor; kontrollera aktuell kontaktväg.
Partnerbekräftad datum | Ej bekräftad | Används för nya/osäkra uppgifter.
Nästa verifieringsdatum | Rekommenderas kvartalsvis eller inför profilpublicering | Särskilt viktigt för ISV-, AI- och Microsoft-statusar.
Publiceringsstatus | Ej klar för publik publicering | Publik kortbeskrivning finns som redaktionellt utkast.
Kod | Källa | Användning i dokumentet
S1 | d365.se partnerprofil för InBiz | Produktområden, branschfokus, geografi, kontaktperson, AI-profil och matchningssignal.
S2 | InBiz startsida / Business Central-erbjudande | BC/NAV-positionering, kundtyper, NAV-versioner, Business Central on-prem/SaaS, kundcitat.
S3 | InBiz Om InBiz / kontakt / medarbetare | Microsoft Certified Partner sedan 2005, Uppsala, antal kollegor, digital nordisk leverans, kontaktpersoner.
S4 | Dynamicweb partnerprofil för InBiz | Extern partner-/ekosystemsignal: ERP/digitala processer, Business Central, Power Platform och Copilot.
S5 | Allabolag/Bolagsfakta/Ratsit/Hitta bolagsdata | Juridisk enhet, organisationsnummer, adress, registreringsår, omsättning, resultat, anställda.
S6 | InBiz lösningssidor för distribution, IT-företag, tjänsteföretag och produktion | Branschlösningar, nyckelfunktioner, integration, lager, WMS, TA, avtal, projekt, ärenden och produktion.
S7 | InBiz kundcase-/testimonial-sidor | Returpappercentralen, Skin Concept och Caspeco samt eCom Avtal och praktiska kundnyttor.
S8 | Intern d365.se marknadskontext och partnersegmentering | Marknadsarena, jämförelsegrupp, BC-specialistkategori och nedviktning mot enterprise/F&SCM/CE.
S9 | Microsoft Business Central / Power BI-relaterade offentliga källor | Generell produktförståelse och kompletterande produktkontext.$txt$, source_document_filename = 'inbiz_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'inbiz';
UPDATE public.partners SET source_document_text = $txt$Knowit
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Knowit bör i nuläget förstås som en F&SCM-/ERP-transformationspartner i Sverige med stark kompletterande kapacitet inom Data & AI, Power Platform, integration, förändringsledning och Microsoft Cloud, snarare än som en ren Business Central- eller CRM-specialist.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s ISV-/tilläggsfilter bör endast visa Knowit under specifika ISV-lösningar när relationen är verifierad genom ISV-katalog, partnerinlämnad information, Microsoft/AppSource-källa eller dokumenterat kundcase. Generell ERP-, F&SCM-, data- eller integrationskompetens räcker inte för att aktivera ett specifikt ISV-filter.
5. Filterbeslut för d365.se
Denna sektion styr hur Knowit bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut anger inte allt Knowit kan göra, utan hur partnern bör viktas i matchningslogiken.
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och breda nordiska konsultgrupper som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Medelstora och större organisationer som vill modernisera affärssystem med Dynamics 365 Finance & Supply Chain Management. [✓/~ H, S1/S2]
Tillverkande företag och grossist-/distributionsverksamheter där ekonomi, supply chain, styrning och integration är centrala. [✓/~ H, S1]
Kunder som ser ERP som verksamhets- och ledningsfråga snarare än enbart systemimplementation. [~ H, S2/S9]
Organisationer som vill kombinera ERP med Data & AI, Power BI/Fabric, Copilot, automation och förbättrat beslutsstöd. [✓/~ H, S3/S4]
Befintliga D365 F&SCM-kunder som behöver förvaltning, optimering, releasehantering och kontinuerlig förbättring. [✓/~ H, S1/S10]
Nordiska kunder som behöver lokal svensk närvaro men vill ha bredare Knowit-kapacitet inom cloud, säkerhet, management consulting och förändringsledning. [~ H, S5/S6]
8. Mindre lämplig för
Mycket små bolag som endast söker enklaste möjliga lågkostnadsimplementation av Business Central. [~ H, S1/S8]
Kunder där specifik Business Central-ISV-auktorisation är det viktigaste urvalskriteriet och Knowit saknar verifierad ISV-relation. [~ H, S1]
Rena CRM-/Customer Engagement-projekt där kunden uttryckligen söker en specialist med enbart CE/CRM som kärnfokus. [~ M, S3/S8]
Projekt där lägsta pris och lokal närhet väger tyngre än transformationskapacitet, data/AI, governance och långsiktig förvaltning. [~ M, S6/S8]
Projekt inom Commerce, HR, Project Operations eller Contact Center där Knowits aktiva produktkompetens inte är verifierad. [~ H, S1/S3]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - ERP-modernisering för tillverkande eller distribuerande verksamhet
En svensk eller nordisk organisation har vuxit ur äldre ERP- eller AX/F&O-miljöer och behöver D365 Finance & Supply Chain för bättre finansiell styrning, supply chain-kontroll och beslutsstöd. Knowit är relevant när kunden vill kombinera ERP med processförståelse, data, AI och långsiktig förvaltning.
Scenario 2 - Befintlig D365 F&SCM-kund vill öka värdeuttaget
Kunden har redan Dynamics 365 Finance & Supply Chain men saknar strukturerad releasehantering, förbättringsprogram, SLA:er och prioriterad roadmap. Knowit passar när kunden vill vidareutveckla systemet snarare än bara förvalta det tekniskt.
Scenario 3 - Data och AI-fundament runt ERP
Ledningen vill använda Copilot, Fabric, Power BI och AI-drivna beslutsstöd, men datakvalitet, processägarskap och integrationslandskap behöver först säkras. Knowit är relevant när AI ska kopplas till verkliga ERP-processer.
Scenario 4 - ERP som lednings- och transformationsfråga
Kunden behöver hjälp med nuläge, målbild, systemval, business case, upphandling, programstyrning och förändringsledning. Knowit är relevant där ERP-beslutet är nära strategi, governance och organisatorisk förändring.
Scenario 5 - Nordisk verksamhet med flera Microsoft-områden
Kunden behöver kombinera ERP, integration, Power Platform, säkerhet, cloud och data/AI. Knowit passar när flera Microsoft- och konsultdiscipliner ska samverka och kunden vill ha en större nordisk partner.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
Knowit bör ges hög vikt i Data & Analytics när kunden vill koppla ERP till beslutsstöd, dataplattform, AI och styrning. Knowits ERP-sida beskriver Power BI, Microsoft Fabric, AI-lösningar, maskininlärning, Copilot, Agentic AI samt rådgivning kring datastrategi, governance och AI-readiness.
16. Integration
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
19. Marknadskommunikation
20. Standardiserade taggar
21. ISV-lösningar och tillägg
ISV-sektionen ska inte tolkas som att Knowit är återförsäljare eller auktoriserad partner för en viss lösning. Syftet är att styra d365.se:s filterlogik: visa endast verifierade relationer.
22. Konkurrentsektion (internt)
23. Kundorienterad partnerbeskrivning
Knowit är relevant för organisationer som ser affärssystemet som mer än ett administrativt stöd. För kunder som står inför modernisering av ekonomi, supply chain, styrning och beslutsstöd kan Knowit vara ett starkt alternativ när projektet kräver både Dynamics 365-kompetens och bredare förändringsförmåga. Den tydligaste matchningen på d365.se är Dynamics 365 Finance & Supply Chain Management för medelstora och större verksamheter, särskilt inom tillverkning och distribution.
Knowits styrka ligger i kombinationen av ERP, verksamhetsutveckling, data, AI, automation, cloud och cybersäkerhet. Det gör partnern särskilt intressant när kunden behöver bygga en långsiktig plattform snarare än genomföra ett isolerat systembyte. Knowit passar också när organisationen vill arbeta strukturerat med nuläge, målbild, systemval, implementation, förändringsledning och värderealisering.
För d365.se bör Knowit däremot inte övermatchas i alla Dynamics 365-kategorier. Business Central och Customer Engagement finns i Knowits bredare erbjudande, men aktuell svensk partnerprofil är starkast inom F&SCM. Därför bör AI-matchningen prioritera Knowit i större ERP-, data- och AI-nära transformationsscenarier, men låta renodlade BC- eller CRM-specialister väga högre när kunden söker ett mindre eller mer nischat projekt.
24. AI-sammanfattning
25. Why This Partner
Partnern rekommenderas eftersom kunden efterfrågar:
✓ ERP-modernisering och Dynamics 365 Finance & Supply Chain Management
✓ Tillverkning, distribution, industri eller komplex ekonomi/supply chain
✓ Data & Analytics, Power BI, Microsoft Fabric och AI-ready datagrund
✓ AI/Copilot, Agentic AI eller automation kopplad till affärsprocesser
✓ Integration mellan ERP, data, kundprocesser och Microsoft Cloud
✓ Långsiktig förvaltning, releasehantering och kontinuerlig förbättring
✓ Förändringsledning, strategisk rådgivning och verksamhetsnära implementation
✓ Medelstor eller stor organisation med nordisk/svensk leveranskontext
26. Verifiering före publicering
Bekräfta vilken juridisk enhet som ansvarar för D365-leverans och avtal i Sverige.
Bekräfta aktiva produktområden på d365.se: F&SCM, BC, CE/CRM, Power Platform, Data & AI, Commerce, HR, Project Operations och Contact Center.
Bekräfta antal svenska/nordiska D365 F&SCM-konsulter, lösningsarkitekter och förvaltningsresurser.
Bekräfta branschfokus och max 3 branscher per produktområde.
Bekräfta aktuella referenskunder och vilka som får visas publikt.
Bekräfta Microsoft-statusar, awards och eventuella specialiseringar som ska visas publikt.
Bekräfta AI-erbjudande: Copilot, Copilot Studio, Agents, Fabric, AI-readiness och antal genomförda projekt.
Bekräfta förvaltningsmodell, SLA, release governance och managed services.
Bekräfta ISV-relationer: ExFlow, Continia, Golden EDI, LogTrade och övriga D365-tillägg.
Bekräfta kontaktperson och aktuella kontaktuppgifter för d365.se.
27. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Knowit | ✓ | H | S1, S2, S6
Juridisk enhet | Knowit Aktiebolag (publ), org.nr 556391-0354. Börsnoterat moderbolag med flera svenska och nordiska dotterbolag. För Dynamics 365-leverans bör ansvarig juridisk enhet och avtalspart verifieras per affär. | ✓/~ | H | S6, S7
Partnertyp och egen beskrivning | Nordisk digitaliserings- och konsultgrupp med dedikerat ERP-erbjudande i Sverige baserat på Microsoft Dynamics 365. Positionen kombinerar ERP-strategi, implementation, förvaltning, data, AI, automation, cybersäkerhet, förändringsledning och verksamhetsutveckling. | ✓/~ | H | S1, S2, S9
Primära produktområden | F&SCM: Dynamics 365 Finance och Supply Chain Management. d365.se lyfter Finance & Supply Chain som aktivt huvudområde, med fokus på tillverkning, grossist/distribution och medelstora/stora verksamheter. | ✓/~ | H | S1, S2
Sekundära produktområden | Business Central, CE/CRM, Power Platform, Power BI/Fabric, Data & AI, Copilot/Agentic AI, integration, automation, management consulting, cloud, cybersäkerhet och hållbarhets-/ESG-data. Dessa bör viktas som kompletterande signaler om inte partnern bekräftar dem som huvudfilter för Sverige. | ✓/~ | M/H | S2, S3, S4, S5
Områden som inte verifierats | Commerce, HR, Project Operations, Contact Center och specifika tredjeparts-ISV-relationer ska inte visas som aktiva produkt- eller ISV-filter utan ny verifiering. CE/CRM finns som erbjudande på Knowits ERP-sida men är inte huvudområde i aktuell d365.se-profil. | ?/~ | H | S1, S3
Typisk kundstorlek | Medelstora och större organisationer. d365.se anger 100-249, 250-999 och 1.000-4.999 anställda som relevant kundstorlek. Knowits koncernstorlek och nordiska kapacitet gör partnern särskilt relevant för midmarket, övre midmarket och enterprise. | ✓/~ | H | S1, S6
Typisk projektstorlek | Medelstora till större ERP-program, D365 F&SCM-implementationer, förvaltning och vidareutveckling av befintliga D365-miljöer, ERP-strategi/förstudie, datagrund, AI/Copilot och integration. Inte primärt matchad för mycket små standard-BC-projekt. | ~ | H | S1, S2, S3
Geografisk leveranskapacitet | Sverige och Norden enligt d365.se. Knowit verkar i sju länder enligt årsredovisningen: Sverige, Norge, Danmark, Finland, Polen, Serbien och Tyskland. Svensk profil anger Stockholm, Göteborg och Malmö. | ✓/~ | H | S1, S6
Branschfokus | Tillverkning och grossist/distribution är primära enligt d365.se. Knowits case och Microsoft-erkännande ger även starka signaler kring maritim/energi, industri och globala verksamheter, men branschfilter bör begränsas till max 3 per produktområde. | ✓/~ | H | S1, S4, S10
AI-mognad | Hög på koncern-/Microsoftnivå men i d365.se-profilen anges grundläggande AI-mognad för D365 Finance. Knowit har Microsoft Partner of the Year 2025 inom AI Business Solutions - Process och kommunicerar AI-drivna ERP-lösningar, Copilot, Agentic AI, Fabric och AI-readiness. | ✓/~ | H | S1, S3, S4
Förvaltningskapacitet | Hög. d365.se och Knowits egna sidor beskriver stöd genom hela ERP-livscykeln: analys, design, implementation, förvaltning, kontinuerlig förbättring och långsiktig vidareutveckling. G2 Ocean-caset är en tydlig förvaltningssignal. | ✓/~ | H | S1, S2, S10
Internationell leveransförmåga | Medel till hög. Knowit är nordiskt/europeiskt och har internationella case, men d365.se-profilen bör främst visa Sverige/Norden tills specifik global leveranskapacitet och ansvarsfördelning verifieras. | ~ | M/H | S1, S6, S10
Transformationskapacitet | Hög. Knowit kombinerar ERP, verksamhetsutveckling, förändringsledning, data/AI, cybersäkerhet, cloud och governance. Matchas särskilt när kunden ser ERP som verksamhets- och ledningsfråga snarare än enbart systembyte. | ~ | H | S2, S3, S9
Unika särskiljande egenskaper | Bred nordisk konsultgrupp med dedikerad D365 F&SCM-satsning i Sverige, stark Microsoft Cloud Partner-status, AI Business Solutions-utmärkelse och möjlighet att kombinera ERP med Data & AI, cybersäkerhet, management consulting och förändringsledning. | ~ | H | S4, S5, S6, S9
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, juridisk avtalspart, Microsoft-statusar, svenska D365-konsultstyrkan, ISV-relationer och exakta produktfilter. | Bör verifieras innan publicering eller stark matchningsvikt när uppgiften påverkar kontaktväg, filter, produktområde eller ISV-auktorisation.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: knowit
partner_name: Knowit
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_d365se_product_groups:
    finance_supply_chain_management: high_primary
  related_editorial_product_groups:
    business_central: medium_secondary
    ce_crm_broad: medium_secondary
    power_platform: high_adjacent
    data_ai: very_high_adjacent
    power_bi_fabric: high_adjacent
    integration: high_adjacent
    managed_services: high_adjacent
    cyber_security: medium_adjacent
    management_consulting: high_adjacent
  not_active_without_new_partner_update:
    project_operations: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
    contact_center: do_not_show_as_active
delivery_profile:
  smb: low
  midmarket: high
  upper_midmarket: high
  enterprise: high
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_secondary_editorial
  show_under_finance_supply_chain_management: true_primary
  show_under_ce_crm_broad: true_secondary_editorial
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_power_bi_fabric: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_adjacent_signal
  show_under_isv_filters: only_if_isv_authorized_or_verified
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | d365.se och Knowits egna sidor positionerar Knowit tydligt kring ERP och Dynamics 365, särskilt Finance & Supply Chain Management.
CRM / Customer Engagement-fokus | 3/5 | M/H | Knowit beskriver CE-processer och koppling mellan ERP, kundprocesser och Power Platform, men aktuell d365.se-profil lyfter inte CE/CRM som huvudområde.
Business Central-fokus | 3/5 | M | Knowits internationella ERP-sida inkluderar Business Central, men svensk d365.se-profil bör inte övermatcha BC utan partnerbekräftelse.
Finance & SCM-fokus | 5/5 | H | F&SCM är tydlig huvudposition i d365.se-profilen och Knowits svenska ERP-erbjudande.
AI / Copilot / Agents | 4/5 | H | Microsoft Partner of the Year 2025 AI Business Solutions - Process samt publicerad kommunikation om Copilot, Agentic AI och AI-drivna ERP-lösningar.
Data & Analytics | 5/5 | H | Knowit har stark Data & AI-profil och Microsoft Data & AI-status; ERP-erbjudandet kopplas till Power BI, Microsoft Fabric och data governance.
Integration | 4/5 | H | ERP-sidan betonar ERP som del av process-, data-, AI- och automationslandskap. Integration är central i Knowits helhetsposition.
Business Transformation | 5/5 | H | ERP Strategy & Transformation, management consulting och förändringsledning är centrala i positioneringen.
Strategisk rådgivning | 5/5 | H | Knowit erbjuder rådgivning från nulägesanalys och systemval till implementation och värderealisering.
Förvaltning / Managed Services | 4/5 | H | d365.se och G2 Ocean-caset stödjer bilden av långsiktig förvaltning och vidareutveckling.
Branschspecialisering | 3/5 | M | Tillverkning/distribution är tydliga i svensk profil; maritim/energi är starka signaler från case och Microsoft-erkännande men bör verifieras för Sverige.
Internationell leverans | 4/5 | M/H | Knowit verkar i flera länder och har nordiska/internationella case, men d365.se-profilen bör främst använda Sverige/Norden.
SMB-fokus | 2/5 | M | Inte primär matchning för små kunder eller enkla lågkostnadsimplementationer.
Enterprise-fokus | 4/5 | H | F&SCM, transformationskapacitet och koncernstorlek ger stark enterprise-/övre midmarket-profil.
Standardisering | 4/5 | M/H | D365-standard, governance, processdesign och plattformstänk är centrala. Exakt metodik bör verifieras.
Innovation | 5/5 | H | Stark AI-, data- och Microsoft Cloud-position.
Leveransbredd | 5/5 | H | Koncernen täcker ERP, Data & AI, cloud, säkerhet, management consulting, experience och software engineering.
Partner-DNA typ: F&SCM-/ERP-transformationspartner med bred Microsoft Cloud-, Data & AI- och rådgivningskapacitet. Tolkning: Knowit bör matchas när kunden vill kombinera Dynamics 365 Finance & Supply Chain med verksamhetsutveckling, data, AI, integration och långsiktig förvaltning. Inte primär matchning för mycket små BC-projekt eller rena CE/CRM-specialistcase utan verifiering.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Knowit bör positioneras som en F&SCM-/ERP-transformationspartner för medelstora och större organisationer som vill modernisera ekonomi-, supply chain- och verksamhetsstyrning på Microsoft Dynamics 365. | ~ | H | S1, S2, S9
Tydlig köparnytta | Kunden får en partner som kan kombinera ERP-implementation med verksamhetsförståelse, data, AI, automation, cybersäkerhet, förändringsledning och långsiktig förvaltning. | ~ | H | S2, S3, S5
Matchningslogik | Prioriteras när kunden söker D365 Finance & SCM, ERP-modernisering, tillverkning/distribution, datadrivet beslutsstöd, AI/Copilot, integration och förvaltning i Sverige/Norden. | ~ | H | S1, S2, S3
Positioneringsgränser | Bör inte visas som primär Business Central-, CE/CRM-, Commerce-, HR-, Project Operations- eller ISV-partner utan verifiering. För mindre standard-BC-projekt bör nischade BC-partners prioriteras högre. | ~ | H | S1, S3
Filterområde | Beslut för Knowit | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som sekundär/kompletterande partner, ej primär utan ny svensk partnerbekräftelse. | Medel | ✓/~ | Knowits ERP-sida inkluderar Business Central, men d365.se-profilen är F&SCM-fokuserad.
F&SCM | Visa som primär partner. | Mycket hög | ✓/~ | Aktivt huvudområde enligt d365.se och Knowits svenska ERP-satsning.
CE/CRM | Visa som sekundär redaktionell matchning. | Medel | ✓/~ | Knowit beskriver Customer Engagement, men d365.se-profilen är inte CE/CRM-huvudprofil.
Customer Service / Field Service / Contact Center | Visa ej som aktivt huvudfilter utan ny verifiering. | Låg/ej aktiv | ? | CE-erbjudande finns brett, men specifika service-/field-/contact center-filter kräver mer underlag.
Data & AI | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | Data & AI, Fabric, AI-readiness och AI Business Solutions-utmärkelse är starka signaler.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Knowit lyfter Power Apps, Power Automate, Copilot Studio och governance.
Integration | Visa som stark kompletterande signal. | Hög | ✓/~ | Relevant i ERP-, CE-, data- och automationslandskap.
Managed Services / Förvaltning | Visa som stark kompletterande signal. | Hög | ✓/~ | Knowit lyfter förvaltning och långsiktig vidareutveckling; G2 Ocean stärker signalen.
ISV-lösningar | Visa endast per verifierad ISV-auktorisation eller dokumenterad implementation. | Endast verifierad | ? | ExFlow, Continia, Golden EDI m.fl. ska inte aktiveras utan verifiering.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_erp_or_fscm_competence_is_not_sufficient: true
  fscm_or_ce_isv_relations: internal_knowledge_only
knowit_isv_status:
  exflow: not_verified
  continia: not_verified
  golden_edi: not_verified
  logtrade: not_verified
  signup_exflow: not_verified
  other_isv_relations: require_partner_or_isv_confirmation
  do_not_infer_authorization_for_other_addons: true
Fält | Värde för Knowit | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | F&SCM / enterprise-midmarket och ERP-transformation | Använd som huvudkategori när kunden söker Dynamics 365 Finance & Supply Chain, ERP-modernisering, governance, data/AI och förvaltning. | H | S1, S2, S8
Sekundära arenor | Data & AI, Power Platform, Business Central, CE/CRM, Cloud, Cybersecurity, Management Consulting | Använd som kompletterande matchningslogik när kunden vill utveckla flera Microsoft-områden samtidigt. | M/H | S3, S5, S6
Partnerkategori | Bred nordisk konsult- och Microsoft Cloud-partner med dedikerad D365 ERP-satsning | Hjälper AI skilja Knowit från renodlade BC-nischpartners och rena CRM-specialister. | H | S5, S6, S9
Primär jämförelsegrupp | Columbus, CGI, Cepheo, BE-terna, Fellowmind, Nexer, Implema, Engage, Avanade/Accenture | Använd vid jämförelser där kunden söker större ERP-/F&SCM-kapacitet, transformationsförmåga och Microsoft-bredd. | M | S8
Lägre relevans i jämförelse | Mycket små BC-specialister, renodlade CRM-specialister och lokala redovisnings-/IT-kanaler | Använd som lägre jämförelse när kunden efterfrågar liten lokal leverans, låg komplexitet eller en mycket smal lösningskategori. | M | S8
Fakta | Värde | Verif. | Konf. | Källa
Partner | Knowit | ✓ | H | S1, S6
Juridisk enhet | Knowit Aktiebolag (publ), org.nr 556391-0354. Svensk börsnoterad koncern. Avtalspart för D365-projekt bör verifieras. | ✓/~ | H | S6, S7
Grundat år | 1990. Noterat på Nasdaq Stockholm sedan 1997 enligt årsredovisningen. | ✓ | H | S6
Huvudkontor | Sveavägen 20, Stockholm enligt bolagsdata/Knowit. | ✓ | H | S7
Ägarstruktur | Publikt börsnoterat bolag. Ingen enskild verklig huvudman enligt svensk bolagsinformation för publika bolag. | ✓/~ | H | S7
Omsättning / storlek | Koncernen hade cirka 5,8 miljarder SEK i nettoomsättning 2025 och omkring 3 700 medarbetare enligt årsredovisningen. Moderbolagets bokslut ska inte tolkas som operativ D365-storlek. | ✓ | H | S6, S7
Geografisk närvaro | Sju länder enligt årsredovisningen; d365.se-profilen anger leverans i Sverige och Norden samt kontor i Stockholm, Göteborg och Malmö. | ✓/~ | H | S1, S6
Viktiga erbjudanden | Dynamics 365 Finance & Supply Chain, ERP Strategy & Transformation, Data & AI, Power Platform, Business Central, CE/CRM, Microsoft Cloud, cybersäkerhet, management consulting och förvaltning. | ✓/~ | H | S1, S2, S3
Kontaktperson | Johan Svenungsson anges som kontaktperson i d365.se-profilen. Kontaktuppgift bör verifieras före utskick/publicering. | ✓/~ | M/H | S1
Storlekskategori | Stor nordisk konsultgrupp; D365-satsningen i Sverige bör beskrivas som växande/dedikerad ERP-förmåga och verifieras separat i konsultantal. | ~ | H | S6, S9
Prioritera Knowit när | Signalstyrka | Konfidens
Kunden söker Dynamics 365 Finance & Supply Chain eller större ERP-modernisering. | Mycket stark | H
Kunden är medelstor/stor verksamhet inom tillverkning, distribution, industri, maritim/energi eller komplex ekonomi/supply chain. | Stark | M/H
Projektet kräver integration, datamigrering, rapportering, Power BI/Fabric, datakvalitet eller AI-readiness. | Mycket stark | H
Kunden vill kombinera ERP med management consulting, förändringsledning, cybersäkerhet, cloud eller styrning. | Mycket stark | H
Kunden söker långsiktig förvaltning och kontinuerlig vidareutveckling efter go-live. | Stark | H
Kunden är svensk/nordisk och behöver en större konsultpartner snarare än en liten nischpartner. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, enkelt och primärt budgetdrivet. | Stark nedviktning | H
Kunden söker ren Business Central-specialist med låg komplexitet. | Medel/stark nedviktning | M/H
Kunden kräver verifierad ISV-auktorisation där Knowit inte är verifierad. | Stark nedviktning | H
Kunden söker renodlad CE/CRM-, Contact Center- eller Field Service-specialist. | Medel nedviktning | M
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
negative_match_rules:
  very_small_low_complexity_project: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  pure_ce_crm_without_verified_ce_focus: medium_priority
  unclear_product_scope: require_clarification
match_confidence:
  high: fscm_or_erp_transformation_with_data_ai_integration_and_managed_services
  medium: business_central_or_ce_crm_with_need_for_verification
  low: small_local_bc_or_isv_specific_without_authorization
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 5 | Tydlig huvudposition genom ERP-erbjudande och D365 F&SCM-profil. | ✓/~ | H | S1, S2
CRM | 3 | Knowit beskriver CE/CRM, men svensk d365.se-profil är inte CRM-huvudprofil. | ✓/~ | M | S3
Customer Engagement | 3 | Kundprocesser, sälj/service/marketing finns i erbjudandet, men bör verifieras för svensk leverans. | ✓/~ | M | S3
Business Central | 3 | Finns i Knowits ERP-erbjudande men bör inte visas som primärt svenskt filter utan ny verifiering. | ✓/~ | M | S3
Finance & SCM | 5 | Aktivt huvudområde på d365.se och centralt i svenska ERP-satsningen. | ✓/~ | H | S1, S2
AI/Copilot | 4 | Starka AI-signaler, inklusive Microsoft AI Business Solutions-utmärkelse. d365.se-profilen anger dock grundläggande D365 Finance AI-mognad. | ✓/~ | H | S1, S4
Data & Analytics | 5 | Stark koncern- och erbjudandeprofil kring Data & AI, Power BI och Fabric. | ✓/~ | H | S3, S5
Power Platform | 4 | Power Platform, Copilot Studio och governance lyfts i ERP-erbjudandet. | ✓/~ | H | S3
Integration | 4 | Viktig del i ERP-, data- och automationslandskap, men specifika middleware-/EDI-case bör verifieras. | ✓/~ | M/H | S3
Business Transformation | 5 | ERP Strategy & Transformation och management consulting är centrala. | ✓/~ | H | S2, S9
Strategisk rådgivning | 5 | Från nulägesanalys/systemval till implementation och värderealisering. | ✓/~ | H | S2
Förvaltning | 4 | Knowit lyfter långsiktigt stöd, och G2 Ocean-caset visar D365-förvaltning. | ✓/~ | H | S1, S10
Managed Services | 4 | Tydlig förvaltnings- och vidareutvecklingslogik, men exakt SLA-/MS-modell bör verifieras. | ✓/~ | M/H | S2, S10
Internationell leverans | 4 | Sju länder och nordiska/internationella case, men d365.se bör visa Sverige/Norden som säkrast. | ✓/~ | M/H | S1, S6
SMB | 2 | Inte primär matchning för små lågkomplexa projekt. | ~ | M | S1, S8
Enterprise | 4 | F&SCM, D365, koncernstorlek och transformationskapacitet ger stark övre midmarket/enterprise-profil. | ~ | H | S1, S6
Produktområde | Roll i erbjudandet | Kundnytta | Verifiering | Kommentar
Finance & Supply Chain Management | Kärnerbjudande | Stödjer ekonomi, supply chain, produktion/distribution, styrning och beslutsstöd i medelstora/stora organisationer. | ✓/~ H | Max 3 branscher: Tillverkning, Grossist/Distribution, Industri/Maritim/Energi.
Business Central | Komplement / sekundärt filter | Kan vara relevant för mindre/mellanstora ERP-scenarier eller dotterbolag, men d365.se bör inte visa Knowit som primär BC-partner utan verifiering. | ✓/~ M | Max 3 branscher: SMB/midmarket, Tjänstebolag, Distribution. Verifiera svensk BC-kapacitet.
CE/CRM | Komplement / sekundärt filter | Kan stödja sälj, service, marketing och kundprocesser kopplade till ERP, data och Power Platform. | ✓/~ M | Max 3 branscher: Industri, Distribution, Tjänsteorganisationer. Verifiera aktiva CE-appar i Sverige.
Power Platform | Starkt angränsande erbjudande | Utökar Dynamics 365 med appar, automation, Copilot Studio, workflow och governance. | ✓/~ H | Bör användas som kompletterande signal, inte som huvudproduktområde.
Data & AI / Fabric / Power BI | Starkt angränsande erbjudande | Ger rapportering, dataplattform, AI-ready data, analys och AI-/Copilot-förmåga runt ERP och CRM. | ✓/~ H | Stark differentierare.
Commerce / HR / Project Operations | Ej verifierat som aktivt filter | Kan finnas inom bred Microsoft-/ERP-portfölj, men ska inte visas som aktivt produktfilter utan ny verifiering. | ? H | Verifiera per affär/partneruppgift.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Tillverkningsindustri | Kärnbransch | Mycket hög | d365.se lyfter tillverkande verksamheter och Knowit positionerar F&SCM för komplexa ERP-processer. | d365.se + erbjudande
Grossist & Distribution | Kärnbransch | Mycket hög | d365.se lyfter grossist/distribution som relevant bransch för Knowit. | d365.se
Industri / Maritim / Energi | Sekundär/kärna beroende på land | Hög | ClampON och G2 Ocean ger starka nordiska case; Microsoft-erkännandet nämner maritim sektor. | Kundcase / Microsoft-signal
Retail/e-handel | Sekundär | Medel | Knowit beskriver integrated commerce som angränsande för ERP, men svensk d365.se-profil fokuserar inte retail/e-handel. | Erbjudandesida
Offentlig sektor | Generell erfarenhet | Låg/medel | Knowit-koncernen har offentlig erfarenhet, men D365 F&SCM-position ska verifieras för detta segment. | Koncernkunskap
Life Science/Medtech | Ej verifierad för Knowit D365 | Låg | Inte tillräckligt verifierat i aktuell Knowit-profil. | Verifiera
Område | Bedömning | Kommentar | Källor
AI-mognad | Hög på koncernnivå; grundläggande i aktuell d365.se D365 Finance-profil. | Knowit har stark Microsoft AI Business Solutions-signal, men publik d365.se-matchning bör skilja mellan koncernens AI-position och verifierade D365 Finance AI-case i Sverige. | S1, S4
AI-readiness | Starkt erbjudande | Knowit beskriver data strategy, governance, AI readiness och datakvalitet som del av Data & AI-erbjudandet. | S3
Copilot | Starkt angränsande | d365.se anger Microsoft Standard AI/inbyggd Copilot för D365 Finance. Knowit kommunicerar Copilot i ERP-/Power Platform-sammanhang. | S1, S3
Copilot Studio / Agents | Starkt angränsande | Knowit anger Copilot Studio och Agentic AI inom Power Platform/Data & AI. | S3
Konkreta AI-användningsfall | ERP-nära AI, beslutsstöd, automatisering, dataanalys, processförbättring, kundservice/säljstöd. | Exakta svenska D365 AI-referenser bör begäras före stark publik AI-claim. | S1, S3, S4
Dataförutsättningar | Stark | Data governance, Fabric, Power BI, datakvalitet och AI-readiness bör användas som viktiga matchningssignaler. | S3, S5
Delområde | Bedömning | Kommentar
Data governance | Hög | Central för ERP, AI-readiness och informationsstyrning.
Dataplattform | Hög | Microsoft Fabric och moderna dataplattformar nämns uttryckligen.
Power BI | Hög | Analys, visualisering och rapportering med Power BI.
Microsoft Fabric | Hög | Tydlig signal i Knowits Data & AI-erbjudande.
Datakvalitet | Hög | Viktig för AI/Copilot och ERP-beslutsstöd.
Rapportering/Analytics | Hög | Relevant för Finance, Supply Chain och ledningsrapportering.
AI-grund | Hög | Data & AI är stark differentierare i Knowits ERP-position.
Område | Bedömning | Kommentar
Integrationsarkitektur | Hög | Knowits ERP-position bygger på att koppla samman processer, data, AI, automation, ERP och CE.
Middleware/API:er | Medel/hög | Sannolik stark förmåga via Microsoft Cloud/Azure, men specifika tekniska integrationsplattformar bör verifieras.
EDI | Ej verifierad | Inga tydliga verifierade EDI-/ISV-relationer i aktuell research.
Dataintegration | Hög | Stark koppling till Data & AI, Fabric och Power BI.
Datamigrering | Hög | Relevant i ERP-implementationer och modernisering. Specifika verktyg/metodik bör verifieras.
Drift och övervakning | Medel/hög | Långsiktig förvaltning och cloud-kapacitet tyder på relevant förmåga; SLA-modell bör verifieras.
Integrationskompetens | Hög | Bör vara stark matchningssignal i F&SCM- och ERP-transformationsscenarier.
Dimension | Bedömning | Källa
Omsättning | Cirka 5,8 miljarder SEK i koncernens nettoomsättning 2025 enligt årsredovisningen. | S6
Medarbetare | Cirka 3 700 medarbetare enligt årsredovisningen. Q1 2026 rapporterade 3 652 medarbetare vid periodens slut. | S6
Tillväxt | 2025 präglades av svag marknad och minskad försäljning jämfört med 2024, men Knowit rapporterar förbättrad effektivitet och starkare position. Använd som koncernstorlekssignal, inte D365-satsningens storlek. | S6
Förvärv/struktur | Knowit har historiskt vuxit organiskt och via förvärv; D365 ERP-satsningen i Sverige lanserades/kommunicerades som nytt erbjudande 2026. | S6, S9
Marknadsposition | Bred nordisk konsultgrupp och Microsoft Cloud Partner. Inom d365.se bör Knowit placeras som F&SCM-/ERP-transformationspartner med data/AI-bredd. | S1, S5, S8
Finansiell stabilitet | Bör betraktas som högre än små nischpartners tack vare börsnoterad koncern och bred verksamhet, men detaljerad kredit-/lönsamhetsanalys kräver separat kontroll. | S6, S7
Tidpunkt | Händelse | Källa
1990 | Knowit etablerades enligt årsredovisningen. | S6
1997 | Knowit noterades på Nasdaq Stockholm enligt årsredovisningen. | S6
2024 | Knowit uppnådde Microsoft Solutions Partner-status i alla sex Microsoft-designationsområden och Microsoft Cloud Partner-status. | S5
2025 | Knowit hade omkring 3 700 medarbetare och cirka 5,8 miljarder SEK i nettoomsättning. AI och dataanalys pekas ut som viktiga efterfrågeområden. | S6
2026 | Knowit etablerade nytt svenskt ERP-erbjudande baserat på Microsoft Dynamics 365 och kommunicerade en dedikerad satsning på affärstransformation genom AI-drivna ERP-plattformar. | S9
2026 | Knowit utsågs av Microsoft till Partner of the Year 2025 för AI Business Solutions - Process. | S4
Aktivitet | Bedömning | Kommentar
Thought leadership | Hög | Knowit kommunicerar ERP som strategisk plattform, AI-driven ERP och affärssystem som digital kärna.
Webbinarier/events | Medel/hög | Knowits svenska ERP-sida länkar till webinar om när ERP-systemet inte längre räcker till. Aktivitet bör verifieras löpande.
Kundcase | Hög | Fred. Olsen & Co, G2 Ocean, Alfa Sko, ClampON och BRAV lyfts på Knowits ERP-/case-sidor.
Bloggar/artiklar | Hög | Knowit publicerar ERP-, AI- och Microsoft-relaterat material.
AI-kommunikation | Hög | Stark AI-kommunikation, inklusive AI Business Solutions-utmärkelse och AI-driven ERP.
ERP-kommunikation | Hög | Tydlig satsning på D365 ERP i Sverige 2026.
Aktivitetstakt | Medel/hög | Tillräckligt hög för att stödja d365.se-partnerprofil; följ upp med aktuella webinarier, artiklar och case.
Taggkategori | Taggar
Produktområden | F&SCM, Dynamics 365 Finance, Dynamics 365 Supply Chain Management, Business Central, CE/CRM, Power Platform, Power BI, Microsoft Fabric, Data & AI, Copilot, Agentic AI, Managed Services
Branscher | Tillverkning, Grossist & Distribution, Industri, Maritim, Energi, Tjänsteföretag, Retail/e-handel (sekundär)
Kompetenser | ERP Strategy, ERP Transformation, F&SCM Implementation, ERP Governance, Data Governance, AI Readiness, Integration, Change Management, Cybersecurity, Cloud, Förvaltning
Kundstorlek | Midmarket, Upper Midmarket, Enterprise, Nordic Enterprise
Projektstorlek | Medelstora projekt, Stora projekt, ERP-program, Transformationsprogram, Förvaltningsprogram
Geografi | Sverige, Norden, Nordics, Europeisk koncernkapacitet
ISV | ISV ej verifierad, ExFlow ej verifierad, Continia ej verifierad, Golden EDI ej verifierad
ISV/lösning | Typ | Status | Filterbeslut
ExFlow / SignUp | AP automation / F&SCM/BC | Ej verifierad | Visa inte i ISV-filter utan ISV-katalog, partnerbekräftelse eller kundcase.
Continia | BC-tillägg: dokument, expense, banking | Ej verifierad | Visa inte i BC-tilläggsfilter utan auktorisation/verifiering.
Golden EDI | EDI/e-faktura/integration | Ej verifierad | Relevans möjlig i integrationsscenarier men ej verifierad för Knowit.
LogTrade | Transport/logistik | Ej verifierad | Visa inte utan verifiering.
Annat F&SCM-/CE-IP | Intern kunskap | Ej verifierad | Dokumentera internt om Knowit bekräftar egna acceleratorer, templates eller IP.
Ej avsedd för extern publicering. Används endast för AI-rankning, jämförelse, redaktionell analys och intern förståelse av marknadsposition.
Dimension | Intern analys
Primära konkurrenter | Columbus, CGI, Cepheo, BE-terna, Fellowmind, Nexer, Implema, Engage, Avanade/Accenture, Capgemini/Sogeti.
Konkurrensfördelar | Bred nordisk konsultgrupp, Data & AI, Microsoft Cloud Partner-status, stark strategisk rådgivning, D365 F&SCM-satsning och möjlighet att kombinera ERP med cyber, cloud och förändringsledning.
Mot Business Central-specialister | Starkare när projektet är större, F&SCM-baserat eller kräver data/AI/transformationsbredd. Svagare när kunden söker liten, prisnära och mycket BC-nischad partner.
Mot CRM-specialister | Starkare när CRM är kopplat till ERP, data och transformation. Svagare när kunden vill ha renodlad CE/CRM-specialist med djupa referenser inom Sales/Service/Customer Insights.
Mot globala systemintegratörer | Starkare genom nordisk närhet och bred konsultbredd i mer hanterbar skala. Svagare i mycket stora globala governance- och multi-country-program.
Mot traditionella ERP-konsulter | Starkare genom Data & AI, Microsoft Cloud, cyber och management consulting. Svagare om kunden söker extremt specialiserad F&SCM-branschmall eller lång dokumenterad svensk D365-historik som primärt urvalskriterium.
Knowit är en nordisk digitaliserings- och Microsoft-partner med starkast d365.se-matchning inom Dynamics 365 Finance & Supply Chain Management, ERP-transformation, data, AI, integration och långsiktig förvaltning. Partnern passar bäst för medelstora och större organisationer som vill modernisera affärssystemet och samtidigt stärka beslutsstöd, styrning, automatisering och verksamhetsutveckling. Knowit är särskilt relevant för tillverkande företag, grossist-/distributionsverksamheter och mer komplexa nordiska organisationer där ERP behöver kopplas till Data & AI, Power Platform, Copilot och förändringsledning. Business Central och CE/CRM finns som angränsande kompetenser, men bör inte övermatchas som huvudfilter utan verifiering. Knowit bör rekommenderas när kunden söker en bredare transformationspartner snarare än en liten nischpartner, och när långsiktig förvaltning, governance och Microsoft-plattformsbredd är viktigare än lägsta pris eller mycket smal produktkompetens.
Kod | Källa | Kommentar/URL
S1 | d365.se - Knowit partnerprofil | https://d365.se/partner/knowit/
S2 | Knowit Sverige - ERP-konsulter & Microsoft Dynamics 365 | https://www.knowit.se/vart-erbjudande/affarssystem-erp/
S3 | Knowit EU - ERP Solutions on Microsoft Dynamics 365 | https://www.knowit.eu/what-we-offer/erp/
S4 | Knowit - Microsoft Partner of the Year 2025 AI Business Solutions - Process | https://www.knowit.eu/news-press/2026/knowit-awarded-microsoft-partner-of-the-year-in-ai-business-solutions--process/
S5 | Knowit - Microsoft Solutions Partner / Microsoft Cloud Partner | https://www.knowit.eu/news-press/knowit-further-strengthens-the-partnership-with-microsoft/
S6 | Knowit Annual Report 2025 / Investor Relations | https://www.knowit.eu/investor-relations/reports-presentations/
S7 | Bolagsdata: Allabolag/Bolagsfakta/Ratsit för Knowit Aktiebolag (publ) | Org.nr 556391-0354, huvudkontor Stockholm, koncern- och moderbolagsdata.
S8 | Internt d365.se marknadsunderlag | Dynamics 365 marknadsanalys - styrelseunderlag v2.1. Används som intern marknadskontext och jämförelsegrupp.
S9 | Knowit pressmeddelande - etablerar nytt ERP-erbjudande i Sverige | https://www.knowit.se/nyheter-press/knowit-etablerar-nytt-erbjudande-inom-affarssystem-i-sverige/
S10 | Knowit kundcase | ClampON, G2 Ocean, Fred. Olsen & Co, Alfa Sko och BRAV från Knowits ERP-/case-sidor.
Källhantering: Dokumentet kan användas som intern AI knowledge base, partnerprofil, matchningsmotor, partnerjämförelse, redaktionellt underlag, konkurrentanalys och investerarunderlag. Publik användning bör baseras på verifierade och icke-känsliga fält.$txt$, source_document_filename = 'knowit_ai_partnerunderlag_d365_v1-2.docx', source_document_updated_at = now() WHERE slug = 'knowit';
UPDATE public.partners SET source_document_text = $txt$NAB Solutions
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
AI-metadata för maskinell tolkning
partner_id: nab_solutions
partner_name: NAB Solutions
legal_entity: NAB Solutions AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_only_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_primary_product_groups:
    business_central: very_high_primary
  active_or_indicated_secondary_product_groups:
    sales_customer_insights: medium_secondary
    customer_service: medium_secondary
    field_service: medium_secondary
    power_platform: high_adjacent
    data_ai: high_adjacent
    power_bi: high_adjacent
    microsoft_365_modern_work: medium_adjacent
    integration: high_adjacent
    managed_services: high_adjacent
  not_active_without_new_partner_update:
    finance_supply_chain_management: do_not_show_as_active
    project_operations: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
    contact_center: verify_before_active_filter
isv_scope:
  business_central_addons: verified_for_listed_partners_only
  publicly_indicated_partner_ecosystem:
    - abakion
    - aimplan
    - armada_dynamics_eqm365_rental
    - continia
    - eazystock
    - experlogix
    - golden_edi
    - logtrade
    - printvis
    - qsys_qpick
    - signup_exflow
    - tasklet_factory
    - yaveon
  do_not_infer_authorization_for_other_addons: true
delivery_profile:
  smb: very_high
  midmarket: high
  upper_midmarket: medium
  enterprise: medium_low
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter bör endast visa NAB under ett specifikt Business Central-tillägg om auktorisation, partnerkatalog, partnerinlämnad uppgift eller dokumenterat kundcase finns. NABs egen partnerlista är stark signal för ett brett BC-tilläggsekosystem, men varje specifikt filter bör ändå hanteras per ISV och inte infereras generellt från Business Central-kompetens.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
SMB- och midmarketbolag som söker Dynamics 365 Business Central som primärt affärssystem. [✓/~ H, S1/S2]
NAV/Navision-kunder som vill flytta till Business Central i molnet med en kontrollerad metod och erfaren partner. [✓ H, S3]
Företag som vill börja med fastprislösning/snabbstart och bygga ut systemet successivt med lager, fler bolag, integrationer och ISV-tillägg. [✓/~ H, S1/S2/S7]
Grossist-, distributions- och lagerintensiva bolag som behöver Business Central, WMS-/transport-/EDI-/e-handelskopplingar och skalbar orderhantering. [✓/~ H, S1/S4]
Uthyrningsverksamheter, tryck/grafiska bolag och processindustri där NABs partner- och branschlösningar kan vara relevanta. [✓/~ M/H, S4]
Koncerner eller växande bolag med flera bolag, valutor och behov av gemensam rapportering/konsolidering i Business Central. [✓/~ H, S2]
Kunder som vill kombinera Business Central med Power BI, Power Platform, AI/Copilot och AI-readiness. [✓/~ H, S1/S9]
Kunder som vill ha långsiktig förvaltning, licenser, support och vidareutveckling efter implementation. [✓/~ H, S10]
8. Mindre lämplig för
Stora enterpriseprogram där Dynamics 365 Finance & Supply Chain Management är huvudplattform och global SI-/programstyrning är avgörande. [~ H]
Kunder som söker en renodlad CRM-/CE-specialist där Sales, Customer Service, Field Service eller Contact Center är huvudscope och Business Central inte är relevant. [~ M/H]
Projekt där en specifik ISV-lösning är huvudkrav och NAB inte finns verifierad hos aktuell ISV eller i dokumenterat kundcase. [~ H]
Mycket små organisationer som endast söker billigaste möjliga standardinstallation utan behov av metodik, integration, förvaltning eller framtida skalning. [~ M]
Kunder som kräver verifierad Commerce, HR eller Project Operations-kompetens som huvudområde. [~ H]
9. AI Matchningsregler
negative_match_rules:
  fscm_enterprise_primary_scope: low_priority
  pure_ce_crm_without_bc_context: medium_low_priority
  commerce_hr_project_operations_primary_scope: avoid_without_verification
  specific_bc_addon_without_isv_authorization: verify_before_match
  lowest_price_selection: low_priority
match_confidence:
  high: business_central_nav_migration_bc_modernization_bc_addons_power_platform_bi_ai
  medium: crm_or_field_service_adjacent_to_bc
  low: fscm_global_si_or_unverified_specialty_products
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - NAV/Navision till Business Central: Ett företag med äldre NAV/Navision vill flytta till Business Central i molnet. NAB är stark kandidat när kunden söker trygg metodik, NAV-historik, standardisering och möjlighet att bygga vidare med Power Platform, BI och BC-tillägg.
Scenario 2 - Grossist/distribution med lager och integration: Kunden behöver koppla affärssystemet till lager, transport, EDI, e-handel eller WMS. NAB blir relevant genom Business Central, Logtrade/Golden EDI/Tasklet/Qsys-liknande lösningar och integrationsnära BC-erbjudande.
Scenario 3 - Växande koncern eller SaaS-bolag: Kunden har flera bolag, återkommande intäkter, valutor, rapportering eller uppföljningskrav. NAB passar när Business Central ska ge struktur, kontroll och skalbarhet utan att kunden behöver byta affärssystem igen.
Scenario 4 - BC-kund vill ta nästa steg med data och AI: Kunden har Business Central men behöver Power BI, datakvalitet, AI-readiness, Copilot, Power Platform-automation eller sälj-/kundserviceautomatisering. NAB är relevant när AI ska byggas på stabila ERP-/CRM-data.
Scenario 5 - Branschspecifikt Business Central-projekt: Kunden finns inom uthyrning, print/grafiskt, processindustri eller finans-/redovisningsnära flöden där NABs partner- och branschlösningar kan ge snabbare implementation än generisk BC-konfiguration.
12. Dynamics 365-erbjudande
13. Produktområde × bransch - max 3 branscher per produktområde
14. ISV- och tilläggsprofil
15. Branschfokus
16. AI, Copilot och Agents
17. Data & Analytics
NAB bör matchas som stark Business Central-nära Power BI/Business Intelligence-partner. NABs webb har tydligt Power BI-innehåll och beskriver värdet av gemensam datamodell, rapportering, AI/Copilot i analys och bättre beslutsstöd. Data & Analytics ska användas som kompletterande matchningssignal snarare än som fristående data warehouse-/Fabric-specialist utan ytterligare verifiering.
18. Integration
NABs integrationsprofil är stark inom Business Central-ekosystemet: EDI, e-faktura, transport/TA, WMS, e-handel, CPQ, lageroptimering, process-/print-/uthyrningslösningar och Power Platform. Detta gör NAB relevant när integrationsbehovet är BC-nära. För stora integrationslandskap med enterprise middleware, global API-governance eller komplexa F&SCM-flöden bör annan partnerkategori jämföras.
19. Ekonomi, storlek och marknadsposition
20. Historik och utveckling
2001: NAB Solutions grundas enligt Microsofts beskrivning av bolaget och NAB Group anger svenska rötter 2001. Bolagsregistrering 2001-03-08. [✓ H, S6/S8]
Tidiga år: brett IT-erbjudande inklusive nätverk, drift, Lotus Notes, Navision och IP-telefoni enligt Microsofts historiktext. [✓ H, S7]
Strategisk förflyttning: fokus på Microsoft Dynamics NAV och senare Dynamics 365 Business Central blir bolagets definierande strategiska riktning. [✓ H, S8]
2020: Microsoft utser NAB Solutions till Dynamics 365 Business Central Partner of the Year. Motivering lyfter stark kundtillväxt, teknisk BC-kompetens och repeatable offerings. [✓ H, S7]
2026: NAB kommunicerar NAV/BC-migrering, AI/Copilot, Power Platform och Business Central för SaaS, koncerner och branschflöden. [✓/~ H, S2/S3/S9]
21. Marknadskommunikation
22. Standardiserade taggar
23. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: stark Microsoft-signal, 2020 Partner of the Year, större storlek och väldokumenterad metodik.
Mot CRM-specialister: NAB bör vinna när CRM ligger nära Business Central och Power Platform, men inte när CE/CRM är fristående huvudscope.
Mot globala systemintegratörer: snabbare, mer BC-nära och mer SMB/midmarket-relevant; svagare vid globala F&SCM-program.
Mot traditionella ERP-konsulter: tydligare Microsoft cloud-, Power Platform-, AI/Copilot- och BC-tilläggsprofil.
24. Kundorienterad partnerbeskrivning
NAB Solutions är en etablerad svensk Microsoft-partner med tydlig tyngdpunkt i Dynamics 365 Business Central. För en köpare innebär det främst att NAB bör ses som en partner för verksamheter som vill modernisera sitt affärssystem, flytta från NAV/Navision till Business Central eller bygga en skalbar Microsoft-baserad affärsplattform för ekonomi, lager, order, försäljning, rapportering och integrationer.
Partnern passar särskilt väl för små och medelstora företag samt växande midmarketbolag som vill kombinera en standardiserad implementation med möjlighet att anpassa systemet över tid. NABs kommunikation kring fastprislösning/snabbstart, Business Central för koncerner, SaaS-bolag, grossist/distribution och uthyrningsverksamheter gör partnern relevant när kunden vill komma igång kontrollerat men ändå ha utrymme för mer avancerade flöden.
En särskild styrka är bredden i Business Central-ekosystemet. NABs partnerlista pekar på många relevanta tillägg inom ekonomi, EDI, transport, WMS, lageroptimering, uthyrning, print, processindustri, e-handel och Power BI-planering. Det gör partnern särskilt intressant när kundens behov inte bara är ett affärssystem utan en praktiskt fungerande helhetslösning runt Business Central.
NAB bör däremot inte främst positioneras som en tung F&SCM-enterprise partner eller global systemintegratör. Om kunden ska genomföra ett stort globalt ERP-program på Dynamics 365 Finance & Supply Chain Management, eller söker en renodlad CRM-/Contact Center-specialist, bör andra partnerkategorier jämföras parallellt. NABs starkaste matchning är när Business Central är kärnan och kunden vill bygga vidare med data, AI, Power Platform, integration och förvaltning.
25. AI-sammanfattning
26. Why This Partner
✓ Kunden efterfrågar Dynamics 365 Business Central som huvudplattform.
✓ Kunden har NAV/Navision och vill migrera till Business Central i molnet.
✓ Kunden söker snabbstart/fastpris eller standardiserad BC-implementation med möjlighet att växa.
✓ Kunden behöver BC-tillägg, EDI, WMS, transport, e-handel, uthyrning, print eller processindustri-lösningar.
✓ Kunden vill kombinera affärssystem med Power BI, Power Platform och AI/Copilot.
✓ Kunden behöver långsiktig support, förvaltning och vidareutveckling efter go-live.
✓ Kunden är SMB, växande företag eller midmarket snarare än stort globalt F&SCM-enterpriseprogram.
27. Verifiering före publicering
Bekräfta aktuella produktområden: Business Central, Sales, Customer Insights, Customer Service, Field Service och Contact Center.
Bekräfta om Contact Center faktiskt ska vara aktivt filterområde eller endast sekundär/relaterad kompetens.
Bekräfta att F&SCM, Commerce, HR och Project Operations inte ska visas som aktiva filter.
Bekräfta aktuell kontaktperson, e-post och telefon för d365.se-förfrågningar.
Bekräfta kontor, geografisk leveransmodell och vad “globalt” betyder i praktiken.
Bekräfta branschfokus och välj max 3 primära branscher per produktområde för publik filtrering.
Verifiera ISV-relationer per tillägg: Continia, ExFlow, Golden EDI, Logtrade, Tasklet, EazyStock, PrintVis, Qsys, Armada Dynamics, Aimplan, Abakion och Yaveon.
Bekräfta Microsoft-statusar, specializations, awards och eventuella aktuella partnerbeteckningar.
Begär 3-5 referenskunder eller anonymiserade case per prioriterad bransch/produktområde.
Verifiera AI-erbjudandet: AI-readiness, Copilot, Power Platform-automation, eventuella Copilot Studio-/agentcase och antal genomförda projekt.
Bekräfta förvaltningsmodell, SLA/support, licenshantering och kundserviceprocess.
28. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | NAB Solutions | ✓ | H | S1, S2, S6
Juridisk enhet | NAB Solutions AB, org.nr 556608-0106. Registrerad 2001-03-08. Bolaget är aktivt och redovisar 78 anställda och cirka 169,5 MSEK omsättning 2025 enligt öppna bolagsdata. | ✓ | H | S5, S6
Partnertyp och egen beskrivning | Specialiserad Microsoft Dynamics 365 Business Central-partner med rötter i Navision/NAV och fokus på Business Central, Power Platform, AI/Copilot, Microsoft 365, Power BI och BC-nära bransch-/tilläggslösningar. | ✓/~ | H | S1, S2, S3, S8
Primära produktområden | Business Central är kärnområdet. NAB bör visas som primär Business Central-partner på d365.se. | ✓ | H | S1, S2, S3
Sekundära produktområden | CRM/Customer Engagement enligt d365.se-profil och NABs egna navigations-/lösningsområden: Sales, Customer Insights, Customer Service, Field Service, Power Platform, Power BI, AI/Copilot, Microsoft 365 och integrationer. Använd som sekundär eller verifierad per scenario. | ✓/~ | M/H | S1, S2, S4, S8
Områden som inte verifierats | F&SCM som huvudområde, Project Operations, Commerce och Human Resources. Contact Center anges på d365.se men bör verifieras som faktiskt aktivt leveransområde före stark publik matchning. | ?/~ | M/H | S1, S2
Typisk kundstorlek | SMB, växande bolag och midmarket. d365.se anger att NAB passar företag med 1-999 anställda. Starkast för mindre till medelstora och mellanstora organisationer med Business Central som plattform. | ✓/~ | H | S1, S2, S5
Typisk projektstorlek | Små till medelstora Business Central-projekt, inklusive fastprislösning/snabbstart samt mer avancerade BC-projekt med flera bolag, lager, transaktionsvolymer, integrationsflöden, ISV-tillägg eller branschanpassningar. | ✓/~ | H | S1, S2, S3, S4
Geografisk leveranskapacitet | d365.se anger Sverige, Norden, Europa och globalt samt kontor i Växjö, Stockholm, Göteborg, Malmö och Umeå. NAB Group beskriver även närvaro i Sverige och USA. Leveransmodell bör verifieras per större internationellt scope. | ✓/~ | H | S1, S8
Branschfokus | Grossist & distribution, finans/försäkring, uthyrningsverksamhet, SaaS-bolag, koncerner, processindustri, tryck/grafiska bolag och redovisningsbyråer. För publik matchning bör max 3 branscher per produktområde användas. | ✓/~ | H | S1, S2, S4
AI-mognad | Etablerad enligt d365.se:s AI-profil. Fokus på AI-readiness, datakvalitet, behörigheter, Power Platform-automation med AI, Copilot och AI-stöd i ERP/CRM-processer. NABs egen webb kommunicerar AI/Copilot och AI i Power BI. | ✓/~ | H | S1, S4, S9
Förvaltningskapacitet | Relevant och tydlig. NAB kommunicerar kundservice/förvaltningsavtal och supportprocesser. Matchas starkt när kunden behöver långsiktig BC-förvaltning, vidareutveckling, licenser och support. | ✓/~ | H | S10
Internationell leveransförmåga | Medel till hög. Stöd för nordisk/europeisk/global leverans anges på d365.se och NAB Group beskriver lokal närvaro med internationell räckvidd. Stora globala rollouts bör verifieras separat. | ✓/~ | M/H | S1, S8
Transformationskapacitet | Hög inom Business Central-modernisering, NAV/BC-migrering, molnflytt och BC-nära processförbättring. Lägre verifiering för stora F&SCM-/enterpriseprogram. | ~ | H | S2, S3, S11
Unika särskiljande egenskaper | Tydlig BC-specialisering med lång historik, Microsoft Dynamics 365 Business Central Partner of the Year 2020, fastpriserbjudanden, hög metodikgrad, bred BC-tilläggsportfölj och växande AI/Copilot-position. Stärks av NAV-till-BC-migreringskompetens och partner-ekosystem. | ✓/~ | H | S2, S4, S7, S11
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas när uppgiften bygger på d365.se-profil, NABs egen webb, Microsoft-källa, bolagsdata, ISV-/partnerkällor eller partnerbekräftelse.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, relativ position, marknadsarena och styrkeprofil. | Får inte visas i publik partnerprofil utan redaktionell omformulering.
Kräver extra kontroll | Kontaktpersoner, exakta ISV-auktorisationer, Microsoft-statusar, Contact Center och internationell leveransmodell. | Verifieras före stark publik exponering eller hög matchningsvikt.
Ej publik användning | Osäkra slutsatser, negativa jämförelser och känsliga konkurrensbedömningar. | Endast bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Business Central är NABs kärna enligt d365.se, egen webb och Microsofts tidigare Partner of the Year-utmärkelse.
Finance & SCM-fokus | 1/5 | H | F&SCM framstår inte som aktivt huvudområde i offentlig positionering. Ska inte visas som aktivt filter utan ny verifiering.
CRM / Customer Engagement-fokus | 3/5 | M | d365.se anger Sales, Customer Insights, Customer Service, Field Service och Contact Center, och NABs webb har CRM-/sälj-/kundserviceinnehåll. Bör matchas som sekundärt tills leveransdjup verifieras.
Power Platform | 4/5 | H | Power Platform och Power Apps/Power Automate lyfts som del av erbjudandet och AI-profilen.
AI / Copilot / Agents | 4/5 | H | d365.se anger etablerad AI-mognad. NAB kommunicerar AI/Copilot och Copilot i Power BI/Business Central-processer.
Data & Analytics | 4/5 | H | Power BI och Business Intelligence är tydliga erbjudanden. Aimplan finns även i partner-ekosystemet för planering i Power BI.
Integration | 4/5 | H | NABs partnerportfölj och branschkommunikation visar flera integrationsnära lösningar: Golden EDI, Logtrade, Shopify, Tasklet, Qsys, e-handel, WMS och externa system.
Förvaltning / Managed Services | 4/5 | H | Kontakt-/kundserviceinformation, förvaltningsavtal och lång BC-historik talar för tydlig förvaltningskapacitet.
Branschspecialisering | 4/5 | H | NAB kommunicerar flera branschspår: grossist, finans/försäkring, SaaS, processindustri, koncerner, print/grafiskt och uthyrning.
Internationell leverans | 3/5 | M/H | d365.se anger global/EU/Norden och NAB Group anger Sverige/USA, men stora globala rollouts bör verifieras per scope.
SMB-fokus | 5/5 | H | Fastpris, snabbstart, BC Start och Microsofts pris motiverade hög SMB-/midmarket-relevans.
Enterprise-fokus | 2/5 | M | Kan stödja koncerner och större BC-miljöer men bör inte jämföras med F&SCM-/global SI-aktörer i första hand.
Standardisering | 5/5 | H | Microsofts motivering lyfter repeatable offerings med fast scope, fast pris och fast tidsplan.
Innovation | 4/5 | M/H | AI/Copilot, Power Platform, Power BI och omfattande partner-ekosystem talar för god innovationsförmåga inom BC-plattformen.
Leveransbredd | 4/5 | H | Brett inom BC-ekosystemet: ERP, CRM-nära appar, Power Platform, BI, M365, AI och ISV-tillägg.
Partner-DNA typ: Business Central-specialist för SMB/midmarket med stark BC-standardisering, tilläggsekosystem, AI/Power Platform-komplettering och förvaltningskapacitet. Tolkning: NAB bör matchas när kunden söker en trygg BC-partner med skalbar metodik, snabb start eller BC-modernisering från NAV/Navision, särskilt i grossist, uthyrning, koncern-/finansprocesser eller andra BC-nära branschflöden.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Stark Business Central-specialist för SMB/midmarket och växande organisationer, med tydlig BC-metodik, NAV/BC-historik, snabbstart/fastpris, branschlösningar, ISV-ekosystem och kompletterande CRM-, Power Platform-, BI- och AI-förmåga. | ~ | H | S1, S2, S3, S7
Tydlig köparnytta | Kunden får en partner som kan starta enkelt i Business Central och bygga vidare med lager, koncern, integrationer, Power BI, Power Platform, AI/Copilot och BC-tillägg när verksamheten växer. | ~ | H | S1, S2, S4
Matchningslogik | Prioriteras när kunden söker Business Central, NAV/BC-migrering, BC-snabbstart, lager/grossist/uthyrning, BC-tillägg, BI/Power Platform eller AI-readiness i ERP-/CRM-nära processer. | ~ | H | S1, S2, S3, S4
Positioneringsgränser | Ska inte övermatchas som F&SCM-enterprisepartner, global SI eller renodlad CE/CRM-specialist utan verifiering. Contact Center bör verifieras separat trots d365.se-listning. | ~ | M/H | S1, S2
Filterområde | Beslut för NAB Solutions | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Kärnområde enligt d365.se, NABs webb och Microsoft-utmärkelse.
F&SCM | Visa inte som aktivt huvudfilter. | Låg | ? | F&SCM saknar tydlig verifierad huvudpositionering för NAB.
CE/CRM | Visa som sekundär/kompletterande partner, ej som renodlad CRM-specialist. | Medel | ✓/~ | d365.se anger Sales, Customer Insights, Customer Service, Field Service och Contact Center, men leveransdjup bör verifieras.
Sales & Customer Insights | Visa som sekundär partner. | Medel | ✓/~ | Relevant när CRM-behovet är kopplat till Business Central, kunddata, säljflöden och Power Platform.
Customer Service / Field Service | Visa försiktigt som sekundär partner. | Medel | ✓/~ | Finns i d365.se-profil och NABs CRM-navigering. För stark matchning krävs partnerbekräftelse/kundcase.
Contact Center | Verifiera före aktivt filter. | Låg/Medel | ? | Listat på d365.se men behöver verifieras för omfattning och produktdjup.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Power Platform, Power Apps och automation är tydliga angränsande områden.
Data & AI / Power BI | Visa som stark kompletterande signal. | Hög | ✓/~ | Power BI, BI, Copilot, AI-readiness och datakvalitet är viktiga matchningssignaler.
ISV-lösningar | Visa endast per verifierad BC-tilläggsrelation. | Endast verifierad matchning | ✓/? | NABs publika partnerlista indikerar flera relevanta BC-tillägg.
Managed Services / Förvaltning | Visa som aktivt kompletterande filter. | Hög | ✓/~ | Kundservice, förvaltningsavtal och lång BC-historik stödjer förvaltningsmatchning.
Fält | Värde för NAB Solutions | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Business Central / SMB-midmarket | Använd som huvudkategori när kunden söker Business Central, NAV-migrering, BC-snabbstart, BC-tillägg, grossist, uthyrning, finans-/koncernprocesser eller BC-förvaltning. | H | S1, S2, S3
Sekundära arenor | Power Platform, Data/BI, AI/Copilot, CRM-nära processer, ISV/BC-addons | Använd som kompletterande matchning när kunden vill utveckla BC med data, automation, AI, CRM-flöden eller ISV-lösningar. | H | S1, S4, S9
Partnerkategori | Stark svensk/nordisk Business Central-specialist | Skiljer NAB från F&SCM-enterprisepartners, globala SI:er och renodlade CRM-specialister. | H | S1, S2, S7
Primär jämförelsegrupp | NAB, Fellowmind, Cepheo, BrightCom/Exsitec, Navcite, Goodfellows, InBiz, Yellow Solution, Adbriq, Update, COSMO CONSULT | Använd när kunden jämför svenska BC-partners för SMB/midmarket eller BC-baserade branschflöden. | M/H | S12
Lägre relevans i jämförelse | F&SCM-enterprisepartners, globala SI:er och renodlade CE/CRM-specialister | Använd lägre jämförelse när kundbehovet är global F&SCM, tung enterprise-governance eller ren CRM/Contact Center-specialism. | M/H | S12
Fakta | Värde | Verif. | Konf. | Källa
Partner | NAB Solutions | ✓ | H | S1, S2
Juridisk enhet | NAB Solutions AB, org.nr 556608-0106. | ✓ | H | S5, S6
Grundat/registrerat | Grundat enligt Microsoft/NAB Group-kontext 2001. Registrerat hos bolagsdata 2001-03-08. | ✓ | H | S5, S6, S8
Huvudkontor/kontor | d365.se anger kontor i Växjö, Stockholm, Göteborg, Malmö och Umeå. Bolagsdata anger Växjö-koppling. | ✓/~ | H | S1, S5
Ägarstruktur | NAB Group-koppling. Exakt ägarstruktur och koncernbolag bör verifieras före publicering om det ska användas publikt. | ~ | M | S8
Omsättning | 169 452 KSEK enligt Bolagsfakta 2025. Krafman anger nettoomsättning 167 517 TSEK 2025; skillnaden beror sannolikt på redovisningsdefinition/källpresentation. | ✓ | H | S5, S6
Antal anställda | 78 anställda enligt Bolagsfakta/Krafman 2025. | ✓ | H | S5, S6
Geografisk närvaro | Sverige, Norden, Europa och globalt enligt d365.se. NAB Group anger Sverige och USA. | ✓/~ | M/H | S1, S8
Viktiga erbjudanden | Business Central, NAV/BC-migrering, BC Start, CRM-nära Dynamics 365-appar, Power Platform, Power BI, AI/Copilot, Microsoft 365, ISV-tillägg och förvaltning. | ✓/~ | H | S1, S2, S3, S4
Kontaktperson | d365.se anger Gustav Stigenius som kontaktperson med e-post och telefon. Bör verifieras före återpublicering. | ✓/~ | M/H | S1
Storlekskategori | Större svensk BC-specialist för SMB/midmarket, med kapacitet över mindre lokala BC-boutiquer men utan att vara global SI. | ~ | H | S1, S5, S12
Prioritera NAB Solutions när | Signalstyrka | Konfidens
Kunden söker Business Central, NAV/BC-migrering eller BC-modernisering. | Mycket stark | H
Kunden är SMB/midmarket och vill ha snabbstart/fastpris eller beprövad metodik för Business Central. | Mycket stark | H
Kunden behöver grossist-, distribution-, lager-, uthyrnings-, finans-/koncern- eller SaaS-nära BC-flöden. | Stark | H
Projektet innehåller BC-tillägg som Continia, ExFlow, Golden EDI, Logtrade, Tasklet, PrintVis, EazyStock, Qsys, Armada eller liknande, och relationen är verifierad. | Stark | M/H
Kunden vill kombinera Business Central med Power BI, Power Platform, Microsoft 365, AI/Copilot eller AI-readiness. | Stark | H
Kunden behöver förvaltning, support, licenser och vidareutveckling efter go-live. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Kundens huvudbehov är F&SCM-enterprise, global ERP-rollout eller tung SI/programstyrning. | Stark nedviktning | H
Kunden söker renodlad CE/CRM-/Contact Center-specialist utan BC-koppling. | Medel nedviktning | M/H
Kunden kräver Commerce, HR eller Project Operations som huvudområde. | Stark nedviktning | H
ISV-auktorisation saknas för ett tillägg som är affärskritiskt för kunden. | Kräver verifiering | H
Kunden efterfrågar lägsta pris och enkel installation utan behov av förvaltning eller utveckling. | Medel nedviktning | M
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 5 | Kärnerbjudande och stark marknadsposition, inklusive Microsoft Dynamics 365 Business Central Partner of the Year 2020. | ✓ | H | S1, S2, S7
Finance & SCM | 1 | Ej verifierat som aktivt huvudområde. | ?/~ | H | S1, S2
CRM / Customer Engagement | 3 | d365.se och NABs webb pekar på CRM, Sales, Customer Insights, Customer Service och Field Service, men huvudpositionen är BC. | ✓/~ | M/H | S1, S9
Sales & Customer Insights | 3 | Relevant sekundärt område, särskilt kopplat till BC, kunddata och sälj-/marknadsflöden. | ✓/~ | M | S1, S9
Customer Service / Field Service | 3 | Finns i d365.se-profil och NABs navigering, men verifieras före stark matchning. | ✓/~ | M | S1, S9
Power Platform | 4 | Power Platform och automation anges som fokus i NABs BC-/AI-nära positionering. | ✓/~ | H | S3, S9
AI/Copilot | 4 | Etablerad AI-profil på d365.se samt NABs egna AI/Copilot-resurser. | ✓/~ | H | S1, S9
Data & Analytics | 4 | Power BI och BI är tydliga erbjudanden; Power BI med Copilot kommuniceras. | ✓ | H | S9
Integration | 4 | Starkt BC-ekosystem med Golden EDI, Logtrade, Shopify, Tasklet, Qsys och andra integrations-/lager-/e-handelslösningar. | ✓/~ | H | S4
Business Transformation | 3 | Starkt inom BC-molnmodernisering och processförbättring, lägre inom stora enterpriseprogram. | ~ | H | S2, S3
Strategisk rådgivning | 3 | Rådgivning och workshops anges kring AI-readiness och ERP-val, men bör verifieras för större transformationsprogram. | ✓/~ | M | S1, S3
Förvaltning | 4 | Kundservice/förvaltningsavtal och långvarigt BC-fokus ger stark förvaltningsmatchning. | ✓/~ | H | S10
Managed Services | 3 | Relevant inom BC-förvaltning/support, men managed services-bredd bör verifieras. | ~ | M | S10
Internationell leverans | 3 | Norden/EU/globalt anges på d365.se och NAB Group anger Sverige/USA; scope verifieras. | ✓/~ | M/H | S1, S8
SMB | 5 | Starkast matchning: SMB/midmarket, BC-snabbstart och standardiserade erbjudanden. | ✓/~ | H | S1, S7
Enterprise | 2 | Kan stödja större BC-kunder och koncerner, men inte primärt enterprise-F&SCM/global SI. | ~ | M | S2, S12
Produktområde | Roll i erbjudandet | Kundnytta | Verifieringsgrad | Kommentar
Business Central | Kärnerbjudande | Ekonomi, lager, order, inköp, försäljning, projekt/service och verksamhetsprocesser i en skalbar molnbaserad ERP-plattform. | ✓ H | Primärt filterområde.
Dynamics 365 Sales | Sekundärt/komplement | Stöd för säljprocesser, kunddata och CRM-flöden kopplade till BC och Power Platform. | ✓/~ M | Aktivt i d365.se-profil, men verifiera projekt-/referensdjup.
Customer Insights | Sekundärt/komplement | Marknadsföring, kundinsikter och kunddata som kan kombineras med affärssystem och automation. | ✓/~ M | Aktivt i d365.se-profil.
Customer Service | Sekundärt/komplement | Kundserviceflöden, ärenden och AI-stöd för serviceprocesser. | ✓/~ M | Verifiera som fristående CE-område före stark matchning.
Field Service | Sekundärt/komplement | Kan vara relevant i service-/uthyrnings-/utrustningsnära flöden. | ✓/~ M | Listat på d365.se, men verifiera leveransdjup.
Contact Center | Ej aktivt utan verifiering | Kan vara relevant i kundservicekontext, men offentligt stöd räcker inte för stark huvudmatchning. | ? M | Verifiera före aktivt filter.
Finance & SCM | Ej aktivt huvudområde | Inte primär marknad för NAB enligt offentligt material. | ? H | Använd ej som huvudfilter.
Commerce | Ej verifierat | E-handel stöds via partners/integrationer, men Dynamics 365 Commerce som produkt är inte verifierad. | ? H | Använd ej som produktfilter utan verifiering.
HR / Project Operations | Ej verifierat | Saknar tillräckligt stöd som aktiva D365-produktområden. | ? H | Använd ej som filter.
Produktområde | Max 3 branscher för filter | Relevans | Kommentar
Business Central | Grossist & Distribution; Finans & Försäkring / koncern-/ekonomiprocesser; Uthyrningsverksamhet | Mycket hög | Samma tre branscher som starkast framgår av d365.se-profilen. Processindustri, SaaS, tryck/grafiskt och redovisningsbyråer kan användas som sekundära men inte överbelasta huvudfilter.
CE/CRM | Säljintensiva SMB/midmarket; kundserviceorganisationer; fältservice-/serviceflöden | Medel | Använd endast som sekundär matchning och gärna ihop med BC/Power Platform.
Power BI / Data & AI | Ekonomistyrning; grossist/lageruppföljning; koncern-/rapportering | Hög | Matchas när beslutsstöd, datakvalitet och Copilot-readiness är centralt.
ISV/BC-tillägg | Lager/logistik; uthyrning; print/processindustri | Hög om verifierad | Bygger på partner-/ISV-ekosystem. Kräver verifiering per tillägg.
Princip: NAB ska endast visas i d365.se:s publika ISV-filter när relationen är verifierad per tillägg. NABs egen partnerlista ger stark indikation på ekosystem, men auktorisation/partnerkatalog bör kontrolleras före stark filtermatchning.
ISV / lösning | Roll | Produktområde | Verifiering | Kommentar
Continia | Publikt partner-ekosystem | Business Central | ✓/~ H | NABs partnerlista beskriver Continia som BC-tillägg för finansiella processer.
SignUp ExFlow | Publikt partner-ekosystem | BC / F&O AP automation | ✓/~ H | NABs partnerlista beskriver SignUp/ExFlow för automatisering av ekonomiska arbetsflöden.
Golden EDI | Publikt partner-ekosystem | EDI/e-faktura/integration | ✓/~ H | NABs partnerlista beskriver Golden EDI för e-faktura och avancerade lagerintegrationer.
Logtrade | Publikt partner-ekosystem | Transport/TA/integration | ✓/~ H | NABs partnerlista beskriver Logtrade som TA-system kopplat till ERP/WMS/TMS.
Tasklet Factory | Publikt partner-ekosystem | Mobile WMS | ✓/~ H | NABs partnerlista beskriver Tasklet Mobile WMS för streckkodsskanning och lagerprocesser.
EazyStock | Publikt partner-ekosystem | Lageroptimering | ✓/~ H | Relevant för lageroptimering, inköpsförslag och prognostisering.
PrintVis | Publikt partner-ekosystem | Print/grafisk bransch | ✓/~ H | Branschlösning på Business Central för tryckeribranschen.
Armada Dynamics EQM 365 Rental | Publikt partner-ekosystem | Uthyrning/service/tillgångar | ✓/~ H | Relevant för uthyrningsverksamheter och utrustningsprocesser.
Qsys / Qpick | Publikt partner-ekosystem | WMS/logistik | ✓/~ H | NABs partnerlista beskriver Qsys/Qpick för lagerhantering.
Aimplan | Publikt partner-ekosystem | Power BI / planering | ✓/~ M/H | Relevant för budget, prognos och planering i Power BI.
Abakion | Publikt partner-ekosystem | Business Central-appar | ✓/~ M/H | Relevant för snabbare BC-migrering och appbaserad standardisering.
Yaveon | Publikt partner-ekosystem | Processindustri/quality | ✓/~ M/H | Relevant för processproduktion, kvalitet, livsmedel, läkemedel/medtech på BC.
Shopify | Publikt partner-ekosystem | E-handel | ✓/~ M | E-handelspartner; Dynamics 365 Commerce ska inte infereras av detta.
Bransch | Klassning | Relevans i matchning | Kommentar | Referenstyp
Grossist & Distribution | Kärnbransch | Mycket hög | Tydlig i d365.se-profil och passar BC + lager/logistik/integration. | d365.se/partnerpositionering
Finans & Försäkring / ekonomiintensiva flöden | Kärnbransch | Hög | d365.se lyfter finans/försäkring; Power BI, rapportering och ekonomiprocesser stärker relevansen. | d365.se/partnerpositionering
Uthyrningsverksamhet | Kärnbransch | Hög | d365.se lyfter uthyrning och NABs partnerlista inkluderar Armada Dynamics EQM 365 Rental. | d365.se + ISV/partner
SaaS-bolag | Sekundär bransch | Medel/Hög | NAB har aktuell kommunikation om Business Central för SaaS-bolag. | Egen artikel
Koncerner / flerbolag | Sekundär bransch | Hög | NAB kommunicerar BC för koncerner med flera bolag, valutor och regelverk. | Egen webb
Processindustri | Sekundär bransch | Medel | NABs partner-/branschkommunikation och Yaveon-koppling stödjer relevans. | Egen webb/partnerlista
Tryck & grafiska bolag | Sekundär bransch | Medel | PrintVis finns i partner-ekosystemet och branschspår nämns. | Partnerlista
Redovisningsbyråer | Sekundär bransch | Medel | Nämns i NABs branschstruktur. | Egen webb
Delområde | Bedömning | Konf. | Kommentar
AI-mognad | Etablerad | H | d365.se anger etablerad AI-mognad och typiska AI-initiativ.
AI-readiness | Stark | H | Fokus på datakvalitet, behörigheter inför Copilot och workshop/rådgivning.
Copilot | Stark | H | NAB kommunicerar AI/Copilot och Copilot i Power BI/Business Central-nära arbetsflöden.
Copilot Studio / Agents | Medel | M | NABs navigering innehåller Copilot/agenter, men konkreta agentcase bör verifieras.
ERP-nära AI | Stark | H | AI kopplas till BC, processautomation, analys och ERP-/CRM-data.
Dataförutsättningar | Stark | H | AI-readiness, datakvalitet och Power BI är centrala matchningssignaler.
Publik AI-score | Intern användning | H | AI-poäng bör inte publiceras rakt av utan redaktionell text och partnerbekräftelse.
Område | Bedömning | Kommentar
Power BI | Hög | Tydlig produktivitets-/BI-positionering.
Microsoft Fabric | Ej verifierad / låg | Ska inte användas som starkt filter utan partnerbekräftelse.
Datakvalitet | Hög | Del av AI-readiness och Copilot-förberedelser.
Rapportering | Hög | Relevant inom ekonomi, lager, koncern och BC-beslutsstöd.
Aimplan | Medel/Hög | Partner-ekosystemet inkluderar Aimplan för budget/prognos i Power BI.
Integrationsområde | Bedömning | Kommentar
EDI / e-faktura | Hög | Golden EDI i partner-ekosystemet.
Transport / TA | Hög | Logtrade i partner-ekosystemet.
WMS / lager | Hög | Tasklet, Qsys/Qpick och EazyStock ger stark BC-lagerprofil.
E-handel | Medel/Hög | Shopify och BC-integrationer relevanta, men D365 Commerce ej verifierat.
Power Platform | Hög | Relevant för lågkod, automation och integrationsnära appar.
Datamigrering | Hög | NAV/BC-migrering är tydlig offentlig positionering.
Middleware/API-governance enterprise | Medel/Låg | Verifiera före matchning mot stora enterprise-integrationsprogram.
Aspekt | Bedömning | Källa/konf.
Omsättning | Bolagsfakta anger 169 452 KSEK omsättning 2025. Krafman anger 167 517 TSEK nettoomsättning 2025. Skillnaden bör hanteras som käll-/definitionseffekt. | S5/S6, H
Medarbetare | 78 anställda 2025 enligt öppna bolagsdata. | S5/S6, H
Tillväxt | Bolagsfakta anger +8,2 % omsättningsförändring och +52,0 % rörelseresultat 2025. | S5, H
Marknadsposition | En av de tydligare svenska BC-specialisterna. Viktig benchmark för lönsam svensk BC-specialist med tillräcklig storlek men fortfarande nischad profil. | S12, M/H
Finansiell stabilitet | Positivt resultat och flera års historik. Det är inte en finansiell due diligence utan storleks-/stabilitetssignal för partnerbedömning. | S5/S6, M/H
Tema | Aktivitet / signal | Tolkning
Business Central | Många artiklar, guider, prissidor och BC-snabbstart. | BC är tydlig kärna och bör dominera partnerprofilen.
NAV till BC | Aktuella guider om Navision/NAV och vägen till Business Central. | Stark signal för migrations- och moderniseringscase.
AI / Copilot | Synliga sidor om AI/Copilot, AI-readiness, Copilot i Power BI och automatisering. | AI är aktivt kommunikationsområde, inte bara passiv Copilot-nämning.
Branschkommunikation | SaaS, grossist, finans/försäkring, koncern, processindustri, print, uthyrning. | Bra underlag för branschfilter men bör begränsas till max 3 per produktområde.
ISV-ekosystem | Offentlig partnerlista med många BC-tillägg. | Stark signal för BC-tilläggsbredd; kräver verifiering per ISV-filter.
Events/webinar | NAB kommunicerar webinars/events och artiklar. | Aktiv thought leadership/utbildande marknadskommunikation.
Taggkategori | Taggar
Produktområden | business_central, sales_customer_insights_secondary, customer_service_secondary, field_service_secondary, power_platform, power_bi, ai_copilot, microsoft_365, managed_services
Ej aktiva produktområden | finance_supply_chain_management_not_active, commerce_not_verified, hr_not_verified, project_operations_not_verified, contact_center_verify
Branscher | grossist_distribution, finans_forsakring, uthyrning, saas, koncern_flerbolag, processindustri, print_grafiskt, redovisningsbyra
Kompetenser | nav_to_bc_migration, business_central_start, bc_addons, edi, wms, ta_transport, power_platform_automation, power_bi_reporting, ai_readiness, copilot_readiness, bc_managed_services
Kundstorlek | smb, growing_business, midmarket
Projektstorlek | small_bc_project, medium_bc_project, addon_heavy_bc_project, nav_bc_migration
Geografi | sweden, nordics, europe, global_verify_scope, offices_vaxjo_stockholm_goteborg_malmo_umea
Ej avsedd för extern publicering. Används för AI-rankning, jämförelsegrupper och redaktionell analys.
Jämförelse | NABs styrka | När annan kategori kan vara starkare
Mot små lokala BC-partners | Större storlek, etablerad BC-metodik, starkare Microsoft-signal och bredare BC-tilläggsekosystem. | Om kunden prioriterar lokal mikronärhet, mycket låg budget eller väldigt liten förändring.
Mot breda Microsoft-partners | Tydligare BC-fokus, snabbstart, NAV-historik och BC-tilläggsdjup. | Om kunden vill ha stor bredd inom M365, Azure, Cyber, Data/Fabric eller enterprise transformation.
Mot F&SCM-/enterprise-ERP-partners | Bättre matchning för BC, SMB/midmarket, snabbare implementation och BC-tillägg. | Om kunden ska välja F&SCM som huvudplattform eller har global rollout/gov-program.
Mot CRM-specialister | Kan vara bättre om CRM-behovet är nära BC, säljflöden och Power Platform. | Om kundens huvudbehov är avancerad CE/CRM, contact center, kunddataarkitektur eller marketing automation i stor skala.
Mot vertikala ISV-partners | Bredare BC-partner som kan kombinera flera tillägg och processer. | Om kunden behöver en specifik vertikal produkt som huvudplattform, t.ex. bygg, fashion, print eller rental med egen IP-specialist.
NAB Solutions är en stark svensk Business Central-specialist för SMB och midmarket, med lång historik från Navision/NAV och tydlig position inom Dynamics 365 Business Central. Partnern passar bäst för kunder som vill modernisera sitt affärssystem, migrera till Business Central i molnet eller kombinera BC med lager, EDI, transport, Power BI, Power Platform, AI/Copilot och BC-nära ISV-lösningar. NAB har särskild relevans för grossist/distribution, uthyrning, finans-/koncernprocesser och växande bolag som vill börja standardiserat men kunna bygga vidare. Partnern bör inte övermatchas på F&SCM-enterprise, global SI-leverans eller renodlad CE/CRM-specialism utan verifiering. För d365.se bör NAB visas som primär BC-partner, med starka kompletterande filter för AI-readiness, Power Platform, Power BI, integration, förvaltning och verifierade BC-tillägg.
Källkod | Källa | Användning i dokumentet
S1 | d365.se - NAB Solutions partnerprofil, https://d365.se/partner/nab-solutions/ | Produktområden, branscher, geografi, kontaktperson, AI-profil och publik d365-positionering.
S2 | NAB Solutions svensk webb, https://nabsolutions.com/se/ | Egen positionering, Business Central, CRM, AI/Copilot, Power BI, branscher och kontakt/support.
S3 | NAB artikel: Navision/NAV till Business Central, https://nabsolutions.com/se/erp/navision-microsoft-dynamics-nav-och-vagen-vidare-till-business-central/ | NAV/BC-migrering, BC-fokus, Power Platform och AI-lösningar.
S4 | NAB partnerlista, https://nabsolutions.com/se/om-nab-solutions/vara-partners/ | ISV-/tilläggsekosystem: Abakion, Aimplan, Armada, Continia, EazyStock, Experlogix, Golden EDI, Logtrade, PrintVis, Qsys, Shopify, SignUp/ExFlow, Tasklet, Yaveon.
S5 | Bolagsfakta - NAB Solutions AB, https://www.bolagsfakta.se/5566080106-NAB_Solutions_AB | Bolagsdata, anställda, omsättning, resultat och registreringsinformation.
S6 | Allabolag/Krafman/Ratsit öppna bolagsdata för NAB Solutions AB | Kompletterande ekonomiska nyckeltal och registreringsdata.
S7 | Microsoft Sverige - Partner of the Year 2020, https://news.microsoft.com/sv-se/2020/07/14/sigma-dugga-och-nab-utsedda-till-arets-microsoft-partners/ | Microsoft-utmärkelse, historik, metodik och repeatable offerings.
S8 | NAB Solutions Group - About NAB Group, https://nabsolutionsgroup.com/about-nab-group/ | Historik, strategisk ERP-inriktning, Microsoft Dynamics 365, AI, Power Platform och internationell närvaro.
S9 | NAB Power BI / AI / Copilot-sidor, bl.a. https://nabsolutions.com/se/produktivitet/microsoft-power-bi/ | Data & Analytics, Power BI, Copilot i analys och AI-readiness.
S10 | NAB kontakt-/supportinformation, https://nabsolutions.com/se/kontakt/ | Kundservice, förvaltningsavtal och supportprocess.
S11 | NAB Business Central-start / priser / ERP-artiklar | Fastpris, snabbstart, BC-implementering och go-live-logik.
S12 | Internt d365.se marknads- och konkurrentunderlag | Marknadsarena, jämförelsegrupper, relativ partnerkategori och intern kontext.$txt$, source_document_filename = 'nab_solutions_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'nab-solutions';
UPDATE public.partners SET source_document_text = $txt$Nexer
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Nexer bör förstås som en bred Microsoft Business Applications-/Enterprise Applications-partner med starkast matchning när kundbehovet omfattar F&SCM, ERP/CRM, förvaltning, integration, Data/AI och större Microsoft-miljöer.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter bör endast visa Nexer under ett specifikt Business Central-tillägg om auktorisation, ISV-katalog, partnerinlämnad uppgift eller dokumenterat kundcase finns. Generell ERP-, F&SCM-, CRM-, integrations- eller AI-kompetens ska inte automatiskt ge visning i BC-tilläggsfilter. Annata/A365 kan dokumenteras som intern F&SCM-/bransch-ISV-signal, men bör inte blandas ihop med d365.se:s BC-tilläggsfilter.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Medelstora och större organisationer som söker Dynamics 365 Finance & Supply Chain Management eller modernisering från Dynamics AX. [✓/~ H, S4]
Kunder som vill kombinera ERP och CRM/CE inom Microsoft-plattformen snarare än köpa en isolerad applikation. [✓ H, S2]
Organisationer med komplexa integrationslandskap, flera affärssystem, datamigrering, BI/Fabric eller Power Platform-behov. [✓/~ H, S6, S8]
Bolag som behöver långsiktig förvaltning, support och release-/vidareutvecklingskapacitet efter go-live. [✓ H, S5, S13]
Tillverkande industri, grossist/distribution, retail/e-handel, transport/logistik och automotive/equipment där bransch- och operationsflöden är viktiga. [✓/~ M/H, S1, S11]
Kunder som vill ha svensk/nordisk förankring kombinerad med global Nexer-kapacitet. [✓/~ H, S7]
8. Mindre lämplig för
Mycket små bolag som bara söker billigaste möjliga Business Central-standardimplementation utan integrations- eller förvaltningsbehov. [~ M]
Kunder som söker en mycket liten lokal boutique-partner med låg overhead och nära ägarledd leverans. [~ M]
Projekt där en specifik Business Central-ISV-lösning är huvudkrav och Nexer saknar verifierad auktorisation för just tillägget. [~ H]
Renodlade CRM-boutique-case där kunden prioriterar maximal CE-spets över bred Microsoft-/ERP-/förvaltningskapacitet. [~ M]
Projekt där Commerce, HR eller Project Operations är huvudbehov och Nexer inte har verifierat aktivt erbjudande inom området. [? H]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - AX till Dynamics 365 Finance & Supply Chain
Ett svenskt industribolag sitter på äldre Dynamics AX och behöver modernisera ERP-plattformen till D365 F&SCM med bibehållen processkontroll, data, integrationer och förvaltningsmodell.
Scenario 2 - ERP/CRM som gemensam Microsoft-plattform
En koncern vill koppla ihop ekonomi, supply chain, sälj, service och kunddata i Dynamics 365 och behöver en partner som kan hantera både affärsprocesser och teknisk plattformsarkitektur.
Scenario 3 - Managed services och vidareutveckling efter go-live
En D365-kund behöver löpande support, releasehantering, regressionstest, användarstöd och roadmap-arbete efter implementation. Nexer är starkt när långsiktigt ansvar och förbättring är centralt.
Scenario 4 - Data, BI och AI-grund för Dynamics 365
Ledningen vill använda Power BI/Fabric, AI och Copilot men behöver först säkra datakvalitet, governance, semantiska modeller, behörigheter och integrationer från ERP/CRM.
Scenario 5 - Automotive/equipment med branschlösning
Ett bolag inom automotive, trucks, buses eller equipment vill kombinera D365 med Annata A365. Nexer bör vara relevant, men lokal leverans och ISV-roll bör verifieras.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
Power BI governance och Microsoft Fabric bör vara starka matchningssignaler. [✓ H, S8]
Nexer beskriver data products, semantic models, sensitivity labels, data protection, quality, lineage och lifecycle. [✓ H, S8]
Använd som kompletterande filter när kunden behöver D365 + datagrund + rapportering + AI-readiness. [~ H]
Verifiera svenska referenscase och exakt teamansvar före stark publik AI/Fabric-positionering. [? M]
16. Integration
Hög relevans vid D365 ERP/CRM där flera system, dataflöden och processer ska kopplas ihop. [~ H]
Starkare matchning när kunden har integrationsintensiva miljöer, datamigrering, API:er, EDI/B2B eller legacy-ERP. [~ H]
För BC-tillägg/ISV ska partnerrelation inte antas. Verifiera per lösning och källa. [? H]
Annata/A365 är verifierad bransch-/ISV-signal för automotive/equipment, men ska hanteras separat från BC-tilläggsfilter. [✓ H, S11, S12]
17. Ekonomi, storlek och marknadsposition
Nexer ska behandlas som en större svensk/nordisk konsult- och systemintegrationsaktör med en dedikerad Enterprise Applications-enhet. För d365.se är Nexer Enterprise Applications AB den mest relevanta juridiska enheten i aktuellt underlag, medan Nexer AB/Nexer Group ger koncernmässig storlekskontext.
18. Historik och utveckling
Nexer Enterprise Applications Holding AB registrerades 2018 och Nexer Enterprise Applications AB 2023. Juridisk struktur bör verifieras vid avtal. [✓ H, S9, S10]
Nexer Enterprise Applications beskriver sig internationellt som en långsiktig partner och rådgivare inom ERP/CRM på Microsoft-plattformen. [✓ H, S2]
Affärsområdet har äldre Dynamics-/ERP/CRM-historik än den svenska juridiska enhetens registreringsdatum antyder. [✓/~ M/H, S15]
2025 utökade Nexer och Annata sitt partnerskap globalt inom automotive, trucks, buses och equipment på Microsoft Dynamics 365 och A365-plattformen. [✓ H, S11, S12]
19. Marknadskommunikation
20. Standardiserade taggar
21. Konkurrentsektion (internt)
Ej avsedd för extern publicering. Används endast för intern AI-rankning, jämförelsegrupper och redaktionell bedömning.
Differentiatorer
Mot Business Central-specialister: bredare D365 ERP/CRM-, förvaltnings-, data- och integrationskapacitet, men sannolikt högre overhead i små projekt.
Mot CRM-specialister: bredare Microsoft Business Applications- och ERP/SCM-koppling, men mindre boutique-/MVP-specialistprofil än rena CE-aktörer.
Mot globala systemintegratörer: mer nordisk/svensk närhet och tydligare D365 EA-specialism, men lägre global management consulting-skala än Accenture/Avanade.
Mot traditionella ERP-konsulter: starkare Microsoft-plattformsbredd, Data/AI och managed services-logik.
22. Kundorienterad partnerbeskrivning
Nexer är relevant för organisationer som ser Dynamics 365 som en del av en större Microsoft-plattform snarare än som ett isolerat systembyte. Partnern har sin tydligaste position när kunden behöver kombinera ERP, CRM, integration, data, AI och långsiktig förvaltning. För en kund som ska modernisera Dynamics AX till Dynamics 365 Finance & Supply Chain Management, eller som vill bygga vidare på en befintlig D365-miljö med support, releasehantering och kontinuerlig förbättring, är Nexer en stark kandidat.
Nexer bör också vara intressant för bolag som har flera system, flera länder eller komplexa processflöden där affärssystem, kunddata, rapportering och integration måste hänga ihop. Deras Care 365-positionering gör dem särskilt relevanta när kunden inte bara behöver ett projektteam, utan även en förvaltningspartner efter go-live. Däremot bör Nexer inte automatiskt prioriteras högst för mycket små, prisstyrda Business Central-projekt eller när kunden söker en mycket smal ISV-/branschlösning utan verifierad Nexer-koppling.
23. AI-sammanfattning
24. Why This Partner
Partnern rekommenderas eftersom kunden efterfrågar Dynamics 365 Finance & Supply Chain Management eller AX-modernisering.
Partnern rekommenderas eftersom kunden vill kombinera ERP och CRM/CE inom Microsoft-plattformen.
Partnern rekommenderas eftersom projektet innehåller integrationer, data, BI/Fabric, Power Platform eller AI-readiness.
Partnern rekommenderas eftersom kunden behöver långsiktig support, application management och managed services.
Partnern rekommenderas eftersom kunden är midmarket/enterprise och behöver svensk/nordisk leverans med global koncernkapacitet.
Partnern rekommenderas lägre om kunden söker en liten lokal BC-partner, lägsta pris eller ett specifikt BC-tillägg där Nexer inte är verifierad.
25. Verifiering före publicering
Bekräfta aktuell kontaktperson, e-post och telefon för d365.se.
Bekräfta juridisk avtalspart och om Nexer Enterprise Applications AB är korrekt publiceringsenhet.
Bekräfta vilka produktområden som ska visas som aktiva huvudfilter: BC, F&SCM, Sales & Customer Insights, Customer Service/Field Service/Contact Center.
Verifiera om Commerce, HR och Project Operations ska vara aktiva eller ej.
Verifiera Microsoft-partnerstatusar, Solutions Partner-beteckningar, eventuella specializations och co-sell-status.
Verifiera svenska kundcase/referenser per produktområde och max tre branscher per produktområde.
Verifiera D365-konsultstyrka i Sverige/Norden samt leveransmodell för global rollout.
Verifiera ISV-relationer: Annata/A365, Continia, ExFlow, Golden EDI och övriga relevanta tillägg.
Verifiera AI-/Copilot-/agentprojekt och om dessa kan användas i publik profil eller endast internt.
26. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Nexer | ✓ | H | S1, S2, S3
Juridisk enhet | Nexer Enterprise Applications AB, org.nr 559428-5826, är den mest relevanta juridiska enheten för d365.se-profilen enligt partnerunderlag och bolagsdata. Koncernen ingår i Nexer Group. Avtalspart och fakturamottagare bör verifieras vid publicering. | ✓/~ | H | S1, S9, S10
Partnertyp och egen beskrivning | Nordisk/global Microsoft Business Applications- och enterprise applications-partner. Nexer Enterprise Applications beskriver sig som partner och rådgivare inom digitalisering, affärslösningar och implementation av ERP/CRM inom Microsoft-plattformen. | ✓ | H | S2, S3
Primära produktområden | F&SCM, Dynamics 365 ERP, Dynamics 365 CRM/CE och Business Central. d365.se anger Business Central, Finance & Supply Chain, Sales & Customer Insights samt Customer Service / Field Service / Contact Center som aktiva områden. | ✓/~ | H | S1, S2, S3
Sekundära produktområden | Power Platform, Data & BI, Microsoft Fabric, integration, Microsoft 365, Azure, AI/Copilot, Dynamics Care 365, managed services och application management. | ✓/~ | H | S4, S5, S6, S8
Områden som inte verifierats | Commerce, Human Resources och Project Operations bör inte aktiveras som huvudfilter utan ny partnerbekräftelse. D365 Commerce förekommer i internationell Dynamics 365-positionering men inte som tydligt svenskt huvudområde i d365.se-underlaget. | ?/~ | M/H | S1, S6
Typisk kundstorlek | Midmarket, övre midmarket och enterprise. Nexer kan även hantera mindre BC-/CRM-scenarier, men bör i d365.se främst viktas när kunden behöver bredare Microsoft-, ERP/CRM-, integrations- eller förvaltningskapacitet. | ~ | H | S1, S2, S7
Typisk projektstorlek | Medelstora till stora projekt: D365 F&SCM, AX-till-cloud-modernisering, ERP/CRM-implementationer, global/nordisk rollout, integrationsintensiva miljöer, förvaltning och vidareutveckling. | ~ | H | S2, S4, S5
Geografisk leveranskapacitet | Sverige/Norden med global Nexer-närvaro. Nexer Group anger global närvaro i 16 länder och cirka 2 500 anställda. d365.se bör ändå verifiera exakt svensk D365-leveransmodell per produktområde. | ✓/~ | H | S7, S1
Branschfokus | Tillverkning, retail/e-handel, grossist/distribution, transport/logistik, automotive/equipment samt energy enligt d365.se, Nexer-sidor och intern marknadskontext. Max tre branscher per produktområde bör användas i filter. | ✓/~ | H | S1, S2, S11, S12
AI-mognad | Medel till hög. Nexer kommunicerar Microsoft Business Applications tillsammans med Power Platform, AI, data och säkerhet. Data, BI & Governance-sidan lyfter Power BI governance och Microsoft Fabric. Konkreta svenska D365 Copilot-/agentcase bör verifieras. | ✓/~ | M/H | S6, S8
Förvaltningskapacitet | Hög. Nexer erbjuder Dynamics Care 365 / application management och support för Dynamics 365, inklusive lokal och global support samt managed service-erbjudanden via Microsoft Marketplace. | ✓ | H | S5, S13
Internationell leveransförmåga | Hög som koncern- och affärsområdesbedömning, men produktområde och bemanning i Sverige bör verifieras. Annata-partnerskapet visar global bransch-/D365-position inom automotive, trucks, buses och equipment. | ✓/~ | M/H | S7, S11, S12
Transformationskapacitet | Hög inom Microsoft Business Applications, ERP/CRM-modernisering, AX-till-D365, integration, data och förvaltning. Starkare som bred systemintegratör än som ren nisch-/ISV-partner. | ~ | H | S2, S4, S5
Unika särskiljande egenskaper | Kombinationen nordisk/global Nexer-skala, Microsoft Business Applications, D365 ERP/CRM, Care 365, Power Platform/Data/AI och Annata-partnerskap ger Nexer en bred enterprise/midmarket-position med tydlig förvaltnings- och vidareutvecklingslogik. | ~ | H | S2, S5, S11, S12
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, Microsoft-statusar, lokala D365-konsultstyrkan, ISV-relationer, kundcase och exakta produktfilter. | Bör verifieras innan publicering eller stark matchningsvikt när uppgiften påverkar kontaktväg, filter, produktområde eller partnerauktorisation.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: nexer
partner_name: Nexer
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_submitted_source: S1
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_d365se_product_groups:
    business_central: medium_high_primary
    finance_supply_chain_management: high_primary
    sales_customer_insights: high_primary
    customer_service_field_service_contact_center: high_primary
  related_editorial_product_groups:
    ce_crm_broad: high_primary
    power_platform: high_adjacent
    data_ai: high_adjacent
    power_bi_fabric: high_adjacent
    integration: high_adjacent
    managed_services: high_adjacent
  not_verified_as_active:
    commerce: verify_before_active_filter
    project_operations: do_not_show_without_partner_update
    human_resources: do_not_show_without_partner_update
isv_scope:
  business_central_addons: require_verification_per_addon
  fscm_ce_isv_relations: internal_knowledge_only
  annata_a365: verified_public_signal
  other_isvs: do_not_infer_authorization
delivery_profile:
  smb: medium
  midmarket: high
  upper_midmarket: high
  enterprise: high
project_size:
  small: medium_low
  medium: high
  large: high
delivery_focus:
  erp: very_high
  crm: high
  data: high
  ai: medium_high
  integration: high
  transformation: high
  managed_services: very_high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | Tydligt ERP-/F&SCM-fokus inom Enterprise Applications, D365 implementation och AX-till-D365-modernisering.
CRM / Customer Engagement-fokus | 4/5 | H | ERP/CRM inom Microsoft-plattformen samt d365.se-områden Sales, Customer Insights och Customer Service/Field Service/Contact Center.
Business Central-fokus | 3/5 | M/H | Aktivt i d365.se-profil och internationellt erbjudande, men bör viktas lägre än F&SCM/enterprise applications vid större jämförelser.
Finance & SCM-fokus | 5/5 | H | D365 F&SCM, Supply Chain Management, Dynamics AX-upgrade och SCM-rekryteringssignaler stärker profilen.
AI / Copilot / Agents | 4/5 | M | AI och data kommuniceras brett, men konkreta svenska D365 Copilot-/agentcase bör verifieras.
Data & Analytics | 4/5 | H | Power BI governance, Microsoft Fabric och Data/BI/Governance-erbjudande är publikt belagda.
Integration | 4/5 | H | Relevant vid D365-landskap, ERP/CRM, Data/BI och flera systemmiljöer.
Business Transformation | 4/5 | M/H | Bred systemintegratör och enterprise applications-rådgivare.
Strategisk rådgivning | 4/5 | M/H | Partner/rådgivare inom digitalisering och Microsoft Business Applications.
Förvaltning / Managed Services | 5/5 | H | Dynamics Care 365 och Marketplace-erbjudanden ger stark förvaltningssignal.
Branschspecialisering | 3/5 | M | Branschfokus finns inom manufacturing, retail, energy och automotive/equipment via Annata, men bör verifieras per land och team.
Internationell leverans | 4/5 | M/H | Global Nexer-närvaro och Annata-samarbete; exakt svensk/global ansvarsfördelning bör verifieras.
SMB-fokus | 2/5 | M | Kan hantera mindre lösningar, men d365.se bör inte övermatcha Nexer som lågkostnads-/lokal SMB-BC-partner.
Enterprise-fokus | 4/5 | H | Starkare matchning i midmarket, övre midmarket och enterprise.
Standardisering | 4/5 | M/H | D365 implementation methodology, cloud upgrade och Care 365 indikerar strukturerade leveransmodeller.
Innovation | 4/5 | M/H | AI/data, Annata A365, SCM och governance-innehåll ger innovationssignal.
Leveransbredd | 5/5 | H | D365 ERP/CRM, Power Platform, Data/BI, AI, integration, M365 och förvaltning.
Partner-DNA typ: Nordisk/global Microsoft Business Applications- och Enterprise Applications-partner. Tolkning: Nexer bör matchas när kunden vill kombinera Dynamics 365 ERP/CRM med integration, Data/AI, förvaltning och större Microsoft-plattformsförmåga. Mindre stark när kunden söker en renodlad lokal BC-nischpartner eller ett mycket smalt ISV-filter.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Bred Microsoft Business Applications- och Enterprise Applications-partner för F&SCM, ERP/CRM, BC, CE/CRM, förvaltning, integration och Data/AI. | ~ | H | S1, S2, S3
Tydlig köparnytta | Kunden får en partner som kan kombinera Dynamics 365-implementation med långsiktig förvaltning, global/lokal leverans, integrationer, datagrund och vidareutveckling. | ~ | H | S2, S4, S5
Matchningslogik | Prioriteras när kunden har större ERP/CRM-målbild, AX-till-D365-modernisering, SCM-/lager-/logistikbehov, integrationer, managed services eller vill kombinera D365 med Power Platform/Data/AI. | ~ | H | S2, S4, S5, S8
Positioneringsgränser | Bör inte prioriteras högst för mycket små lågkostnadsprojekt, renodlade BC-tillägg utan verifierad ISV-relation eller smala CRM-boutique-case där specialistnärhet väger mer än bred leverans. | ~ | M/H | S1, S14
Filterområde | Beslut för Nexer | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som aktiv partner, men inte högst viktad BC-nischpartner. | Medel/Hög | ✓/~ | d365.se anger Business Central. Använd särskilt när kunden också behöver större Microsoft-/ERP/CRM-/förvaltningsbredd.
F&SCM | Visa som primär/stark partner. | Mycket hög | ✓/~ | Stark F&SCM-, AX-upgrade-, Supply Chain- och enterprise applications-signal.
CE/CRM | Visa som primär/stark partner för Sales, Customer Insights och Customer Service/Field Service/Contact Center. | Hög | ✓/~ | d365.se och Nexer beskriver ERP/CRM inom Microsoft-plattformen.
Data & AI | Visa som stark kompletterande signal. | Hög | ✓/~ | Power Platform, AI, data, BI, Microsoft Fabric och governance är publikt belagda.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Relevant runt CRM, workflow, automation, appar och integration.
Managed Services | Visa som stark kompletterande signal. | Mycket hög | ✓ | Dynamics Care 365 och application management/support är tydliga erbjudanden.
ISV-lösningar | Visa endast per verifierad ISV-relation eller dokumenterad lösning. | Endast verifierad matchning | ?/✓ | Annata/A365 är belagd som partner-/branschsignal; ExFlow, Continia, Golden EDI m.fl. ska inte antas utan verifiering.
filter_decisions:
  show_under_business_central: true_secondary_or_medium_high
  show_under_finance_supply_chain_management: true_primary
  show_under_sales_customer_insights: true_primary
  show_under_customer_service_field_service_contact_center: true_primary
  show_under_ce_crm_broad: true_primary
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_power_bi_fabric: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_primary_signal
  show_under_commerce: verify_before_active_filter
  show_under_project_operations: false_unless_partner_update
  show_under_human_resources: false_unless_partner_update
  show_under_isv_filters: only_if_isv_authorized_or_verified
Fält | Värde för Nexer | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Nordisk/global Microsoft Business Applications- och Enterprise Applications-partner | Använd när kunden söker D365 ERP/CRM, F&SCM, större Microsoft-plattform, förvaltning eller kombinerad transformering. | H | S2, S14
Sekundära arenor | Managed Services, Data & AI, Power Platform, Business Central, CE/CRM, integration och branschlösningar via Annata/A365. | Använd som kompletterande matchningslogik när kunden behöver vidareutveckling över flera Microsoft-områden. | M/H | S5, S6, S8, S11
Partnerkategori | Bred nordisk systemintegratör / D365-specialist i Enterprise Applications-segmentet | Skilj från renodlade BC-specialister, CRM-boutiques och globala SI:er. | H | S14
Primär jämförelsegrupp | Columbus, BE-terna, Cepheo, Fellowmind, Implema, CGI, Knowit, Engage och Capgemini/Sogeti | Använd vid jämförelser i större ERP/CRM-, F&SCM-, förvaltnings- och integrationsaffärer. | M/H | S14
Lägre relevans i jämförelse | Små lokala BC-specialister, renodlade CRM-boutiques och rena ISV-aktörer | Använd som lägre jämförelse när kunden söker smal lokal leverans, lägsta pris eller ett specifikt tillägg. | M | S14
Fakta | Värde | Verif. | Konf. | Källa
Partner | Nexer | ✓ | H | S1, S2
Juridisk enhet | Nexer Enterprise Applications AB | ✓/~ | H | S1, S9
Organisationsnummer | 559428-5826 | ✓ | H | S1, S9
Grundat/registrerat | Nexer Enterprise Applications AB registrerades 2023-03-31. Affärsområdet/EA-historik är äldre och bör beskrivas som Nexer EA-kontext separat. | ✓/~ | H | S9, S15
Huvudkontor/adress | Lindholmspiren 9, Göteborg enligt bolagsdata. | ✓ | H | S9
Ägarstruktur | Del av Nexer Enterprise Applications Holding AB / Nexer Group. Koncernstrukturen bör verifieras vid avtal och publik bolagstext. | ✓/~ | M/H | S9, S10
Omsättning | Nexer Enterprise Applications AB: 208,4 MSEK omsättning 2024 enligt Bolagsfakta/Allabolag. Nexer AB: 1 580,1 MSEK omsättning 2024, men detta avser bredare juridisk enhet och bör inte förväxlas med D365-affären. | ✓ | H | S9, S16
Antal anställda | Nexer Enterprise Applications AB: 115 anställda 2024. Nexer Group kommunicerar global koncernstorlek, men D365-konsultstyrka i Sverige bör verifieras. | ✓/~ | H | S9, S7
Geografisk närvaro | Sverige/Norden med global koncernnärvaro. d365.se-kontakt och svensk leverans bör verifieras per område. | ✓/~ | H | S1, S7
Viktiga erbjudanden | D365 F&SCM, D365 CRM/CE, Business Central, D365 implementation, AX-upgrade, Care 365, Power Platform, Data/BI, Microsoft Fabric, integration, AI och managed services. | ✓/~ | H | S2, S3, S4, S5, S8
Kontaktpersoner | d365.se-underlag anger Mikael Carle som profilkontakt och Anna Falconer som admin/utskick. Ska verifieras före publicering. | ✅/~ | M/H | S1
Storlekskategori | Stor svensk/nordisk konsult- och systemintegrationsaktör med dedikerad Enterprise Applications-enhet. | ~ | H | S7, S9, S14
Prioritera Nexer när | Signalstyrka | Konfidens
Kunden söker F&SCM, AX-till-D365-modernisering, SCM/lager/produktion eller större ERP/operations-projekt. | Mycket stark | H
Kunden söker kombinerad ERP/CRM-plattform inom Microsoft, inklusive Sales, Customer Insights, Customer Service eller Field Service. | Stark | H
Projektet kräver support/förvaltning, application management, releasehantering eller kontinuerlig vidareutveckling. | Mycket stark | H
Kunden behöver Data/BI, Power BI governance, Fabric, integration eller Power Platform som del av D365-målbilden. | Stark | H
Kunden har automotive/trucks/buses/equipment-behov där Annata/A365 kan vara relevant. | Stark men verifiera | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, enkelt och primärt budgetdrivet. | Stark nedviktning | M
Kunden söker en renodlad BC-specialist med verifierad bransch-/ISV-paketering och låg overhead. | Medel nedviktning | M
Kunden kräver auktorisation för ett specifikt BC-tillägg där Nexer inte är verifierad. | Stark nedviktning | H
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
positive_match_rules:
  d365_fscm_or_ax_upgrade: very_strong
  erp_crm_combined_scope: strong
  managed_services_or_care365: very_strong
  integrations_data_bi_fabric_power_platform: strong
  annata_a365_automotive_equipment: strong_but_verify
negative_match_rules:
  very_small_low_complexity_project: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  commerce_hr_project_operations_without_verification: reduce_confidence
  pure_crm_boutique_requirement: compare_against_ce_specialists
match_confidence:
  high: fscm_erp_crm_managed_services_integration_data_ai
  medium: bc_only_or_specific_industry_without_reference
  low: small_budget_or_unverified_isv_filter
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 5 | D365 implementation, F&SCM, ERP/CRM inom Microsoft-plattformen och AX-upgrade ger mycket stark ERP-signal. | ✓/~ | H | S2, S3, S4
CRM / Customer Engagement | 4 | d365.se och Nexer beskriver CRM/CE, Sales, Customer Insights och Customer Service/Field Service/Contact Center. | ✓/~ | H | S1, S2
Business Central | 3 | Aktivt men inte lika differentierande som F&SCM/enterprise applications i d365.se-matchning. | ✓/~ | M/H | S1, S3
Finance & SCM | 5 | Kärnområde med D365 F&SCM, SCM, warehouse/operations och AX-modernisering. | ✓ | H | S4, S12
AI/Copilot | 4 | AI/data kommuniceras; konkreta D365 Copilot-/agentreferenser bör verifieras. | ✓/~ | M | S6, S8
Data & Analytics | 4 | Power BI governance, Microsoft Fabric, data products och semantic models. | ✓ | H | S8
Power Platform | 4 | Ingår i Microsoft Business Applications- och CRM/CE-logiken. | ✓/~ | H | S6
Integration | 4 | Bred systemintegratörsprofil och D365-/data-/Power Platform-landskap. | ~ | H | S2, S6, S8
Business Transformation | 4 | Enterprise applications-rådgivare och digitaliseringspartner. | ~ | M/H | S2
Strategisk rådgivning | 4 | Partner/advisor-positionering och Microsoft Business Applications-bredd. | ✓/~ | M/H | S2, S6
Förvaltning | 5 | Care 365/application management och lokal/global support. | ✓ | H | S5, S13
Managed Services | 5 | Marketplace-erbjudande och Care 365 som kontinuerligt värdemotor. | ✓ | H | S5, S13
Internationell leverans | 4 | Global Nexer-närvaro och Annata-partnerskap; verifiera team per scope. | ✓/~ | M/H | S7, S11
SMB | 2 | Inte primär position, trots Business Central-erbjudande. | ~ | M | S1, S14
Enterprise | 4 | Starkare i midmarket/enterprise med komplexitet, governance och förvaltning. | ~ | H | S2, S7
Produktområde | Roll i erbjudandet | Kundnytta | Verifiering | Kommentar
Business Central | Komplement/aktivt d365.se-område | Samlad affärssystemsplattform för mindre och medelstora verksamheter när kunden också behöver bred Microsoft-/förvaltningskapacitet. | ✓/~ | Visa som aktivt men inte högst viktad BC-nischpartner. Max tre branscher: grossist/distribution, retail/e-handel, tillverkning.
Finance & Supply Chain Management | Kärnerbjudande | Modernisering av större ERP-, finans-, supply chain-, lager-, logistik- och produktionsflöden. | ✓ | Visa som primärt huvudfilter. Max tre branscher: tillverkning, distribution/logistik, automotive/equipment.
CE/CRM | Kärnerbjudande | Modernisering av sälj, kunddata, service, marketing/customer insights och kundnära processer på Microsoft-plattformen. | ✓/~ | Visa som primärt CE/CRM-filter. Max tre branscher: retail/e-handel, service/transport, manufacturing.
Customer Service / Field Service / Contact Center | Aktivt d365.se-område | Kundservice, fältservice och contact-center-nära flöden där CRM, data, integration och support krävs. | ✓/~ | Verifiera exakta moduler och svenska referenser före stark publik positionering.
Commerce | Ej verifierat huvudområde | Kan vara relevant i bred Microsoft-/retail-kontext, men ska inte visas som aktivt filter utan partnerbekräftelse. | ? | Verifiera innan filteraktivering.
Project Operations | Ej verifierat huvudområde | Ingen tydlig primär signal i aktuellt d365.se-underlag. | ? | Verifiera innan filteraktivering.
Human Resources | Ej verifierat huvudområde | Ingen verifierad aktiv D365 HR-position i underlaget. | ? | Visa inte utan ny partneruppdatering.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Tillverkning | Kärnbransch | Mycket hög | F&SCM/SCM, AX-upgrade, production/operations och intern marknadskontext pekar tydligt hit. | Offentliga sidor, intern marknadskontext
Grossist & Distribution / Transport & Logistik | Kärnbransch | Hög | d365.se anger grossist/distribution och transport/logistik; SCM/warehouse-sidor stödjer matchning. | d365.se + Nexer SCM
Retail & E-handel | Sekundär/kärnberoende på scope | Hög | d365.se anger retail/e-handel; Nexer internationellt lyfter retail i Enterprise Applications. | d365.se + Nexer EA
Automotive / Trucks / Equipment | Sekundär/kärna vid Annata | Hög vid Annata-matchning | Annata/A365-partnerskapet är stark branschsignal men lokal leverans och d365.se-filter bör verifieras. | Nexer/Annata
Energi | Sekundär | Medel | Intern marknadskontext anger energy. Kräver tydligare svenska D365-referenser för stark publik profil. | Intern marknadskontext
Område | Bedömning | Konfidens | Kommentar
AI-mognad | Medel/hög | M/H | AI nämns i Microsoft Business Applications- och Data/BI-kontext; konkreta svenska D365 Copilot-/agentreferenser bör verifieras.
AI-readiness | Stark | H | Data governance, Power BI, Fabric och migrationstjänster ger bra grund för AI-readiness.
Copilot | Relevant men verifiera case | M | Nexer talar om AI/generativ AI i D365/ERP-modernisering; verifiera aktiva Copilot-projekt.
Copilot Studio / Agents | Ej tydligt verifierat | L/M | Aktivera inte som starkt filter utan partnerbekräftelse.
ERP-nära AI | Relevant | M/H | D365 Finance/SCM och AI-baserade insikter kommuniceras internationellt.
Enhet | Omsättning | Anställda | År | Kommentar | Källa
Nexer Enterprise Applications AB | 208,4 MSEK | 115 | 2024 | Dedikerad EA-enhet. Omsättningstillväxt stark enligt bolagskällor, men bolaget är nyregistrerat och historiken bör tolkas försiktigt. | S9, S10
Nexer AB | 1 580,1 MSEK | 767 | 2024 | Bredare juridisk enhet och koncernkontext. Ska inte användas som ren D365-omsättning. | S16
Nexer Group | Ej jämförbart via enskilt svenskt bokslut | ca 2 500 globalt | 2026 källa | Kommunicerad global närvaro i 16 länder. Använd som leverans- och varumärkeskapacitet, inte som isolerad D365-siffra. | S7
Aktivitet | Bedömning | Kommentar
Thought leadership | Medel/hög | Nexer publicerar rapporter, insikter och D365-/Business Applications-innehåll.
Webbinarier/events | Medel | Bör verifieras specifikt för Sverige och D365, men Nexer har bred event-/rapportkommunikation.
Kundcase | Medel | Customer stories finns internationellt inom D365/Business Applications. Svenska D365-referenser bör kompletteras.
ERP-kommunikation | Hög | D365 implementation, AX-upgrade, F&SCM och SCM-innehåll är tydligt.
CRM/CE-kommunikation | Medel/hög | ERP/CRM inom Microsoft-plattformen och D365 CRM-sidor finns; exakt svensk tyngd bör verifieras.
AI/Data-kommunikation | Hög | Data/BI governance, Microsoft Fabric och AI i Business Applications används aktivt.
Aktivitetstakt | Medel/hög | Bred Nexer-kommunikation och aktuella partner-/branschnyheter, inklusive Annata 2025.
Taggkategori | Taggar
Produktområden | business_central; finance_supply_chain_management; ce_crm; sales_customer_insights; customer_service; field_service; contact_center; power_platform; data_ai; power_bi; fabric; integration; managed_services; care365
Ej verifierade/ej primära produktområden | commerce; human_resources; project_operations; specific_bc_isv_addons_without_verification
Branscher | manufacturing; distribution_wholesale; retail_ecommerce; transport_logistics; automotive; equipment; energy_secondary
Kompetenser | d365_implementation; ax_to_d365_upgrade; fscm; crm; erp_crm_platform; application_management; managed_services; support; data_governance; power_bi; fabric; integration; ai_readiness; annata_a365
ISV/lösningar | annata_a365_verified_signal; exflow_unverified; continia_unverified; golden_edi_unverified; other_bc_addons_require_verification
Kundstorlek | midmarket; upper_midmarket; enterprise; selected_smb_when_scope_complex
Projektstorlek | medium; large; transformation; ax_upgrade; erp_modernization; crm_modernization; managed_services; integration_landscape
Geografi | sweden; nordic; global_nexer_context; local_delivery_verify
Kategori | Bedömning
Primära konkurrenter inom F&SCM/enterprise ERP | Columbus, BE-terna, Cepheo, Implema, CGI, Knowit, Engage, Fellowmind, Capgemini/Sogeti.
Primära konkurrenter inom bred Microsoft Business Applications | Fellowmind, Accigo, Knowit, Columbus, CGI, Sopra Steria, Capgemini/Sogeti, Avanade/Accenture.
Primära konkurrenter inom CE/CRM | Sirocco, CRM-Konsulterna, Releye, Sundet CRM, B3 Elevate, Accigo, HSO, Avanade.
Konkurrensfördelar | Bred Nexer-skala, EA-enhet, D365 ERP/CRM, Care 365, Data/BI, integration och global/nordisk leveranskapacitet.
När andra kan vara starkare | BC-specialister vid små BC-projekt; CRM-boutiques vid renodlad CE-spets; globala SI vid mycket stora multinationella program; vertikala ISV-partners vid specifik bransch-IP.
Nexer är en bred Microsoft Business Applications- och Enterprise Applications-partner med starkast matchning inom Dynamics 365 Finance & Supply Chain Management, ERP/CRM, Business Central, Customer Engagement, integration, Data & AI och långsiktig förvaltning. Partnern passar främst medelstora och större organisationer som behöver modernisera ERP/CRM, flytta från Dynamics AX till molnbaserad D365, koppla ihop flera system eller säkra support och vidareutveckling efter go-live. Nexer bör viktas högt när kunden efterfrågar F&SCM, managed services, Power Platform, BI/Fabric, integrationer eller global/nordisk leveranskapacitet. De bör viktas lägre i mycket små lågkostnadsprojekt, renodlade BC-tilläggsval utan verifierad ISV-auktorisation eller smala CRM-boutique-case. Viktiga verifieringspunkter före publicering är exakt svensk D365-konsultstyrka, Microsoft-statusar, kontaktpersoner, ISV-relationer och aktuella kundreferenser.
Källa | Beskrivning
S1 | d365.se partnerprofil och partnerinlämnad information för Nexer, inklusive produktområden, branscher, kontaktperson och org.nr.
S2 | Nexer Enterprise Applications - affärsområdessida: ERP/CRM inom Microsoft-plattformen.
S3 | Nexer Dynamics 365 implementation / Business Central / CRM-sidor.
S4 | Nexer Dynamics 365 uppgradering / AX till Dynamics 365 Finance & SCM.
S5 | Nexer Dynamics Care 365 / application management and support.
S6 | Nexer Microsoft Business Applications: Dynamics 365, Power Platform, AI, data och security.
S7 | Nexer Group: global närvaro, länder och anställda.
S8 | Nexer Data, BI & Governance: Power BI governance, Microsoft Fabric, semantic models, lifecycle och datakvalitet.
S9 | Allabolag/Bolagsfakta: Nexer Enterprise Applications AB, org.nr 559428-5826, omsättning, anställda och registrering.
S10 | Allabolag: Nexer Enterprise Applications Holding AB och koncernstruktur.
S11 | Nexer och Annata utökar partnerskap globalt, 2025.
S12 | Nexer + Annata / A365, branschlösning för automotive, trucks, buses och equipment.
S13 | Microsoft Marketplace: Nexer Care 365 managed service for Dynamics 365.
S14 | Internt marknadsunderlag: Dynamics 365 marknadsanalys - Nexer som nordisk enterprise applications-aktör med D365 ERP/CRM/Power Platform.
S15 | Nexer EA internationell historik / bolags- och affärsområdeskontext.
S16 | Bolagsfakta/Allabolag: Nexer AB bredare koncern-/bolagsdata, endast som storlekskontext.$txt$, source_document_filename = 'nexer_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'nexer';
UPDATE public.partners SET source_document_text = $txt$Point Taken
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Point Taken bör behandlas som en CE/CRM-, Power Platform-, AI/Copilot- och modern-work-orienterad Microsoft-partner snarare än som ERP-/Business Central-partner.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
Point Taken bör inte visas i d365.se:s publika Business Central-tilläggsfilter utan verifierad ISV-auktorisation eller partnerinlämnad uppgift. Generell Microsoft-, Power Platform- eller Dynamics 365 CRM-kompetens är inte tillräcklig för att listas under BC-tillägg som ExFlow, Continia eller Golden EDI. Nintex är en tydlig partner-/teknologisignal men bör hanteras separat från Dynamics 365 ISV-filter.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Organisationer som söker Dynamics 365 Sales, Customer Insights, Customer Service eller Field Service med stark Microsoft 365- och Power Platform-koppling. [✓/~ H, S2-S9]
Kunder som vill börja med CRM i hanterbara steg, men med möjlighet att växa mot fler CE-processer, automation och AI. [✓/~ H, S3-S8]
Organisationer där Copilot, AI-agenter, dataåtkomst, behörigheter och governance är viktiga före eller parallellt med CRM-/Power Platform-implementation. [✓/~ H, S10]
Kunder som har Microsoft 365 som central arbetsplattform och vill koppla kundprocesser, dokument, Teams/SharePoint och automation. [✓/~ H, S3, S11]
Offentliga eller större organisationer som behöver långsiktig förvaltning, säkerhet, molnstyrning och Power Platform-governance. [✓/~ M/H, S11]
Nordiska kunder som vill ha en Microsoft-specialist med närvaro i Norge och Sverige. [✓/~ M/H, S13]
8. Mindre lämplig för
Kunder där huvudbehovet är Business Central, NAV-modernisering, ekonomi/lager/produktion eller ett BC-nära ISV-tillägg. [~ H, S2/S15]
Större ERP-transformationer inom Dynamics 365 Finance & Supply Chain Management. [~ H, S2/S15]
Projekt där kunden söker en renodlad branschvertikal eller egen IP ovanpå Business Central. [~ H, S15]
Kunder där lägsta pris och enkel licens-/supportaffär är viktigare än förändring, adoption, governance och plattformsbredd. [~ M, S15]
Projekt där en specifik ISV-auktorisation krävs och Point Taken saknar verifierad relation. [? H, S15]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - CRM-modernisering i Microsoft-miljö
En svensk eller nordisk organisation vill införa eller vidareutveckla Dynamics 365 Sales, Customer Insights eller Customer Service och samtidigt dra nytta av Microsoft 365, Teams/SharePoint och Power Platform. Point Taken är relevant när CRM inte ska bli ett isolerat system utan en del av användarnas dagliga Microsoft-miljö.
Scenario 2 - AI- och Copilot-readiness före bred utrullning
Ledningen vill införa Microsoft 365 Copilot eller AI-agenter, men behöver kontroll på data, behörigheter, säkerhet och governance. Point Taken passar när AI-agendan kräver både teknik, adoption och styrning.
Scenario 3 - Service- eller fältorganisation vill digitalisera kundprocesser
Kunden behöver bättre ärendehantering, fältserviceplanering, kundkommunikation och automatisering. Point Taken är relevant om Dynamics 365 CE, Power Platform och Microsoft 365 ska samverka.
Scenario 4 - Befintlig Microsoft 365-kund vill automatisera processer
Kunden använder redan Teams, SharePoint och Microsoft 365 men har manuella processer i Excel, e-post och listor. Point Taken kan vara stark kandidat för Power Apps, Power Automate, Power BI och governance.
Scenario 5 - Svensk expansion eller nordisk Microsoft-plattform
Kunden vill ha en nordisk partner med norsk erfarenhet och svensk närvaro efter Infunnel/Point Taken-sammanslagningen. Matchningen bör verifiera språk, lokal leveransmodell och kontaktväg.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
AI-mognad: hög redaktionell bedömning, men publika kundcase för AI-agenter bör begäras före mycket stark extern AI-positionering.
Copilot: Copilot Readiness Kit och Copilot-relaterade erbjudanden är tydligt kommunicerade.
Agents: Point Taken kommunicerar AI-agenter, Team Agentic och M Agent Governance Platform för att få kontroll på agenter och åtkomst.
ERP-nära AI: svag relevans eftersom partnern inte är ERP-positionerad. AI bör kopplas till CRM, Microsoft 365, Power Platform, dokument/processer och governance.
Dataförutsättningar: fokus på data, behörigheter, säkerhet, Microsoft 365-information och governance snarare än tung dataplattform som primärprofil.
15. Data & Analytics
Point Taken har tydliga Power Platform- och Power BI/Fabric-signaler, men data & analytics bör ses som kompletterande kapacitet till Microsoft 365, CRM, Power Platform och AI snarare än som fristående analytics-/dataplattformsposition. För d365.se bör Data & AI viktas starkt när kundens behov är Copilot-readiness, processautomation, kundinsikt eller Microsoft 365-data, men inte automatiskt vid tung enterprise data platform/Fabric-transformation utan ytterligare verifiering.
16. Integration
Integrationsförmågan bör bedömas som hög i Microsoft-plattformsnära scenarier: Dynamics 365 CRM, Power Platform, Power Automate, Microsoft 365, SharePoint, Teams, Azure och externa datakällor. För stora integrationslandskap med middleware, EDI, ERP-core eller komplex supply chain bör Point Taken viktas lägre än ERP-/integrationstunga partnerkategorier om inte särskild erfarenhet verifieras.
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
2013: Point Taken AS stiftas/registreras i Norge enligt bolagsdata. [✓ H, S12]
Point Taken etablerar position som Microsoft-specialist inom samhandling, Microsoft 365, Power Platform och Dynamics 365 CRM. [✓/~ H, S3]
2025: Talan meddelar förvärv av NOVA Consulting Group, vilket påverkar koncernkontexten runt Point Taken/NOVA. [✓/~ M, S13]
2026: Point Taken och svenska Infunnel går samman under Point Taken-varumärket för att accelerera svensk expansion. [✓ H, S13]
2026: Kommunicerad satsning på Dynamics 365, Power Platform, Modern Workplace, Azure, data, AI/Copilot, integration och säkerhet. [✓ H, S13]
19. Marknadskommunikation
Teman: Microsoft 365, Teams/SharePoint, Dynamics 365 CRM, Power Platform, AI-agenter, Copilot, säkerhet, Azure och skydrift.
Aktivitetsnivå: hög; webbinarier, workshops, bloggar och aktuella event kring Copilot, Agent 365 och Microsoft Build/Ignite.
Kundcase: Statsbygg, OBOS, Vipps, Norec och Leger uten Grenser visar bredd inom M365, Power Platform, säkerhet och Dynamics CRM.
Thought leadership: starkare inom modern work, AI/Copilot, agentgovernance och Power Platform än inom ERP.
Redaktionell slutsats: kommunikationen är relevant för d365.se:s CRM/CE-, AI- och Power Platform-spår, men bör inte blandas ihop med affärssystem/ERP-positionering.
20. Standardiserade taggar
21. Konkurrentsektion (internt)
22. Kundorienterad partnerbeskrivning
Point Taken är en nordisk Microsoft-partner som passar särskilt bra för organisationer som vill utveckla kundprocesser, samarbete och automatisering inom Microsofts molnplattform. För en Dynamics 365-kund är Point Taken mest relevant när behovet gäller CRM och Customer Engagement – till exempel säljstyrning, kundinsikter, marknadsautomation, kundservice, fältservice eller kontaktcenter – snarare än traditionella ERP-projekt.
En viktig styrka är att Point Taken inte enbart positionerar Dynamics 365 som ett fristående system, utan som en del av en större Microsoft-miljö med Teams, SharePoint, Microsoft 365, Power Platform, Azure, säkerhet och Copilot. Det gör partnern särskilt intressant för kunder som redan använder Microsoft 365 och vill skapa bättre informationsflöden, automatisera manuella processer och göra CRM mer naturligt integrerat i användarnas vardag.
Point Taken bör även övervägas när AI och Copilot är en del av målbilden. Partnern kommunicerar tydligt kring Copilot-readiness, AI-agenter och styrning av AI-agenter i Microsoft-miljön. För kunder innebär detta att Point Taken kan vara relevant både före, under och efter ett CRM-/Power Platform-projekt – särskilt när datakvalitet, behörigheter, adoption och governance är avgörande för att AI ska ge verklig affärsnytta.
Partnern är däremot inte det naturliga förstavalet för kunder som i första hand söker Business Central, Finance & Supply Chain Management, produktion, lager eller tunga ERP-flöden. Där bör d365.se normalt prioritera andra partnerkategorier. Point Taken bör i stället lyftas fram som en specialist nära kunddata, samarbete, automation, AI och Microsoft-plattformsutveckling.
23. AI-sammanfattning
24. Why This Partner
Partnern rekommenderas eftersom kunden efterfrågar:
✓ Dynamics 365 Sales, Customer Insights, Customer Service, Field Service eller Contact Center
✓ CRM/Customer Engagement snarare än ERP
✓ Power Platform, Power Apps, Power Automate eller Power BI
✓ Microsoft 365, Teams/SharePoint och användaradoption
✓ Copilot-readiness, AI-agenter eller agentgovernance
✓ Säkerhet, dataåtkomst, behörigheter och governance
✓ Nordisk Microsoft-partner med svensk och norsk närvaro
25. Verifiering före publicering
Bekräfta med Point Taken vilka Dynamics 365 CE-appar som ska vara aktiva på d365.se: Sales, Customer Insights, Customer Service, Field Service och Contact Center.
Bekräfta om Contact Center avser Microsoft Digital Contact Center Platform, Customer Service omnichannel eller annan relaterad lösning.
Bekräfta svensk juridisk enhet, kontaktpersoner, kontaktväg och leveransmodell efter Infunnel-sammanslagningen.
Bekräfta om Point Taken vill visas under Power Platform, AI/Copilot/Agents och Microsoft 365 som kompletterande filter/signaler.
Bekräfta Microsoft-statusar, awards och eventuella partnerutmärkelser, inklusive “Microsoft Partner of the Year”-formuleringar.
Begär anonymiserade eller publika referenser för Dynamics 365 CRM, AI-agenter och Copilot-projekt.
Bekräfta om det finns verifierade ISV-relationer som ska användas i d365.se-filter. Särskilt viktigt för BC-tillägg där Point Taken normalt inte bör listas.
Kontrollera aktuell ekonomisk data och koncernstruktur om dokumentet ska användas som investerar- eller styrelseunderlag.
26. Källor
Källkommentar: dokumentet är avsett som internt AI- och redaktionellt underlag. Source codes kan mappas till URL:er, partnerinlämnat material, d365.se-data och intern marknadskontext i separat källdatabas.
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Point Taken | ✓ | H | S1, S3, S13
Juridisk enhet | Point Taken AS, org.nr 912 721 825, Oslo. Svensk närvaro via Point Taken AB efter sammanslagning med Infunnel bör verifieras för svensk publicering. | ✓/~ | H | S12, S13
Partnertyp och egen beskrivning | Nordisk Microsoft-partner med tyngd inom Dynamics 365 CRM/Customer Engagement, Power Platform, Microsoft 365, Copilot/AI, Azure, säkerhet och skydrift. Inte en ERP/BC-partner i första hand. | ✓/~ | H | S2, S3, S4, S13
Aktiva produktområden | Sales, Customer Insights, Customer Service, Field Service och Contact Center enligt d365.se. Power Platform, Microsoft 365, Copilot/AI och Azure är starka kompletterande områden. | ✓/~ | H | S1, S2, S3, S9, S10
Primära styrkor | CE/CRM, kunddata, säljprocess, marknadsautomation, serviceprocesser, Power Platform, Microsoft 365-adoption, AI-agenter, Copilot-readiness, säkerhet/governance och löpande förvaltning. | ✓/~ | H | S3-S11
Kundstorlek | SMB, midmarket och större organisationer där Microsoft 365, Power Platform och CRM/CE är centrala. Efter Infunnel-sammanslagningen kommuniceras cirka 90 medarbetare över Sverige och Norge. | ✓/~ | M/H | S12, S13
Branschfokus | Ingen smal branschvertikal som kärna. Starkast offentlig signal inom offentlig sektor/fastighet/organisationer, bostad/bygg/fastighetsutveckling samt ideell/internationell organisation via kundcase och referenser. | ~ | M | S11
AI-mognad | Hög redaktionell bedömning. Point Taken kommunicerar AI-agenter, Microsoft 365 Copilot, Copilot Readiness Kit, M Agent Governance Platform och event kring Agent 365. | ✓/~ | H | S10, S13
Geografisk kapacitet | Norge som bas med svensk expansion efter Infunnel. Publikt: Oslo, Kristiansand, Sarpsborg samt svensk närvaro i Stockholm/Malmö enligt svensk webb. | ✓/~ | H | S3, S13
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas när uppgiften bygger på d365.se, partnerwebb, offentlig källa eller redaktionellt tillägg med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även vid d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, referenser och exakta produktområden. | Bör verifieras innan publicering eller stark matchningsvikt.
partner_id: point_taken
partner_name: Point Taken
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmed: false
product_area_model:
  active_product_groups:
    business_central: not_active
    finance_supply_chain_management: not_active
    ce_crm_broad: high_primary
    sales: high_primary
    customer_insights: high_primary
    customer_service: high_primary
    field_service: medium_high_primary
    contact_center: medium_primary_verify_scope
    power_platform: high_adjacent
    data_ai: high_adjacent
    microsoft_365_modern_work: high_adjacent
    azure_security_cloud_operations: medium_high_adjacent
  optional_d365_products:
    commerce: not_verified
    human_resources: not_verified
    project_operations: not_verified
isv_scope:
  business_central_addons: not_relevant_unless_verified
  ce_crm_extensions: document_internal_only
  nintex: public_partner_signal_non_d365
industry_limit_per_product_area: 3
filter_decisions:
  show_under_sales: true_primary
  show_under_customer_insights: true_primary
  show_under_customer_service: true_primary
  show_under_field_service: true_primary
  show_under_contact_center: true_verify_scope
  show_under_business_central: false
  show_under_finance_supply_chain_management: false
  show_under_power_platform: true_adjacent_signal
  show_under_ai_copilot_agents: true_adjacent_signal
  show_under_isv_filters: false_unless_verified
publication_layer:
  public_profile_text: editorial_or_partner_submitted
  competitor_analysis: internal_only
  ai_matching: allowed_with_confidence_weighting
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 1/5 | H | Inget tydligt BC-erbjudande i d365.se-filter eller på partnerwebben. Ska inte användas som BC-partner utan ny verifiering.
Finance & SCM-fokus | 1/5 | H | Inget verifierat F&SCM-erbjudande.
CRM / Customer Engagement | 5/5 | H | d365.se markerar Sales, Customer Insights, Customer Service, Field Service och Contact Center. Partnerwebben har flera dedikerade Dynamics 365 CRM-sidor.
AI / Copilot / Agents | 5/5 | H | Kommunicerar AI-agenter, M Agent Governance Platform, Copilot Readiness Kit och Agent 365-event.
Power Platform | 5/5 | H | Power Platform är ett tydligt kärnområde med workshop, Power Apps/Automate/BI och referensleveranser.
Data & Analytics | 3/5 | M | Power BI/Fabric förekommer i blogg och Power Platform-kontext, men data/analytics är inte lika tydligt kärnerbjudande som CRM, M365 och AI.
Integration | 4/5 | M/H | Relevans via Power Platform, Dynamics 365 CRM, Microsoft 365, Azure och systemintegration.
Modern Work / Microsoft 365 | 5/5 | H | Mycket stark profil inom Teams, SharePoint, Microsoft 365, skydrift och samhandling.
Managed Services / förvaltning | 4/5 | H | Statsbygg-referensen visar förvaltning och vidareutveckling av Microsoft 365, Power Platform och infrastruktur.
Nordisk leverans | 4/5 | M/H | Norge som bas, Sverige via Infunnel/Point Taken AB och NOVA/Talan-kontext.
Partner-DNA typ: CE/CRM-, Power Platform-, AI/Copilot- och Modern Work-partner. Tolkning: Point Taken bör matchas när kunden söker Dynamics 365 Customer Engagement, kundprocesser, CRM, Power Platform, Microsoft 365-adoption, Copilot-readiness, AI-agenter och governance – inte när behovet primärt är ERP, Business Central eller F&SCM.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Nordisk Microsoft-partner för Dynamics 365 Customer Engagement, Power Platform, AI/Copilot och modern arbetsplats. | ~ | H | S1-S10
Tydlig köparnytta | Kunden får en partner som kan koppla ihop CRM, kundservice, fältservice, marketing/customer insights, Power Platform, Microsoft 365, säkerhet och AI-agenter. | ~ | H | S3-S10
Matchningslogik | Prioriteras när kunden söker CRM/CE snarare än ERP och när Microsoft 365-adoption, Copilot-readiness, processautomation eller agentgovernance är viktiga. | ~ | H | S2-S10
Positioneringsgränser | Ska inte matchas som Business Central- eller F&SCM-partner utan ny verifiering. Ska inte listas i BC-ISV-filter utan specifik auktorisation. | ~ | H | S2, S15
Filterområde | Beslut för Point Taken | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa inte som aktiv partner. | Ingen/låg | ✓/~ | Ej aktivt produktområde i d365.se-filter.
F&SCM | Visa inte som aktiv partner. | Ingen/låg | ✓/~ | Ej verifierat F&SCM-erbjudande.
Sales | Visa som primär CE/CRM-partner. | Hög | ✓/~ | Dedikerad Dynamics 365 Sales-sida och d365.se-filter.
Customer Insights | Visa som primär CE/CRM-partner. | Hög | ✓/~ | Customer Insights/Journeys kommuniceras med AI, segmentering och kundresor.
Customer Service | Visa som primär CE/CRM-partner. | Hög | ✓/~ | Dedikerad Customer Service-sida med AI och automatisering.
Field Service | Visa som aktivt område, verifiera scope. | Medel/hög | ✓/~ | Dedikerad Field Service-sida; verifiera erfarenhet och referenser.
Contact Center | Visa som aktivt d365.se-filter, verifiera scope. | Medel | ~ | Markerat i d365.se men bör verifieras mot Microsoft Digital Contact Center/Customer Service-kanal.
Power Platform | Visa som stark kompletterande signal. | Mycket hög | ✓ | Tydligt kärnområde.
AI/Copilot/Agents | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | AI-agenter, Copilot Readiness Kit och Agent Governance är tydligt kommunicerade.
ISV-lösningar | Visa endast per verifierad relation. | Endast verifierad | ? | Nintex kan dokumenteras separat; BC-ISV-filter kräver specifik auktorisation.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  point_taken_bc_addon_status: none_verified
  nintex_partner_signal: non_d365_bc_addon_signal
  do_not_infer_authorization_for_exflow_continia_golden_edi: true
Fält | Värde för Point Taken | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | CE/CRM + Power Platform + Modern Work + AI/Copilot | Använd när kunden söker kundprocesser, sälj, marknad, service, fältservice, Power Platform, Microsoft 365 och AI-agenter. | H | S2-S10
Sekundära arenor | Säkerhet, Azure, skydrift, governance, adoption och processautomation | Använd när kunden vill kombinera CRM/CE med Microsoft 365, Copilot-readiness och säkra molnprocesser. | M/H | S3, S10, S11
Partnerkategori | Nordisk Microsoft cloud- och Business Applications-specialist | Skiljer Point Taken från ERP-partners, BC-specialister och rena CRM-boutiques. | H | S3, S13
Primär jämförelsegrupp | B3 Elevate, CRM-Konsulterna, Releye, Sirocco, Sundet CRM, Accigo | Använd vid jämförelser kring CE/CRM, Power Platform, kunddata, AI och Microsoft 365-koppling. | M | S15
Lägre relevans i jämförelse | BC-specialister, F&SCM-enterprisepartners och ERP-transformationspartners | Använd lägre när kunden primärt söker ERP, lager, produktion, finance eller global F&SCM. | H | S15
Fakta | Värde | Verif. | Konf. | Källa
Partner | Point Taken | ✓ | H | S1, S3
Juridisk enhet | Point Taken AS, org.nr 912 721 825. Svensk enhet Point Taken AB bör verifieras separat för svensk profil. | ✓/~ | H | S12, S13
Grundat/registrerat | Stiftat/registrerat 2013 enligt bolagsdata. | ✓ | H | S12
Huvudkontor | Karl Johans gate 16, 0154 Oslo. Svensk webbinformation anger Point Taken AB i Stockholm. | ✓/~ | H | S3, S12
Ägarstruktur | Ingår i NOVA Consulting Group; Talan/NOVA-ägarkontext bör verifieras för exakt aktuell koncernstruktur i publik text. | ✓/~ | M/H | S12, S13
Omsättning | Point Taken AS: 146,5 MNOK driftsintäkter 2025 enligt Proff; 130,7 MNOK 2024 före sammanslagningen enligt Proff-sökresultat. | ✓ | H | S12
Antal anställda | 81 anställda enligt bolagsdata; efter Point Taken/Infunnel kommuniceras cirka 90 medarbetare i Sverige och Norge. | ✓/~ | H | S12, S13
Viktiga erbjudanden | Dynamics 365 CRM/CE, Power Platform, Microsoft 365, Copilot, AI-agenter, Azure, säkerhet, skydrift, Nintex och rådgivning. | ✓/~ | H | S3-S10
Kontaktpersoner | Tomas Holseth anges på Dynamics 365 Sales-sidan som salgsansvarlig Dynamics 365/Power Platform. Svensk kontaktväg bör verifieras. | ✓/~ | M/H | S5, S13
Storlekskategori | Nordisk specialist i medelstorlekssegmentet; starkare än liten boutique men inte global SI. | ~ | M/H | S12, S13, S15
Prioritera Point Taken när | Signalstyrka | Konfidens
Kunden söker Dynamics 365 Sales, Customer Insights, Customer Service, Field Service eller Contact Center. | Mycket stark | H
Kunden vill kombinera CRM/CE med Power Platform, Microsoft 365, Teams/SharePoint, Azure eller säkerhet. | Mycket stark | H
Kunden vill genomföra Copilot-readiness, skapa AI-agenter eller styra agenter och dataåtkomst i Microsoft-miljön. | Mycket stark | H
Projektet innehåller processautomation, appar, Power Automate, Power Apps eller Power BI i anslutning till kundprocesser. | Stark | H
Kunden behöver förvaltning, governance och vidareutveckling efter införande. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet primärt gäller Business Central, F&SCM, lager, produktion, finance eller ERP-core. | Stark nedviktning | H
Kunden söker BC-ISV-relationer som ExFlow, Continia eller Golden EDI utan verifierad Point Taken-relation. | Stark nedviktning | H
Kunden kräver tung global SI-kapacitet och multinationell programstyrning. | Medel nedviktning | M
Kunden söker ett mycket smalt lokalt CRM-boutique-team utan Microsoft 365-/AI-bredd. | Medel nedviktning | M
negative_match_rules:
  business_central_core_project: avoid
  finance_supply_chain_core_project: avoid
  specific_bc_addon_without_authorization: avoid
  pure_low_cost_license_support: low_priority
  unclear_contact_center_scope: require_verification
match_confidence:
  high: ce_crm_power_platform_copilot_m365_combined_need
  medium: narrow_crm_need_or_unverified_contact_center_scope
  low: erp_bc_fscm_or_unverified_isv_requirement
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 1 | Ej aktivt område i d365.se-filter eller partnerpositionering. | ✓/~ | H | S2
Finance & SCM | 1 | Ej verifierat kärnerbjudande. | ✓/~ | H | S2
Sales | 5 | Dedikerad Dynamics 365 Sales-sida och aktivt d365.se-filter. | ✓/~ | H | S2, S5
Customer Insights | 5 | Customer Insights/Journeys kommuniceras tydligt med AI, segmentering och personalisering. | ✓/~ | H | S2, S8
Customer Service | 5 | Dedikerad sida med fokus på kundservice, AI och automatisering. | ✓/~ | H | S2, S6
Field Service | 4 | Dedikerad sida, men referenser/scope bör verifieras innan maximal matchning. | ✓/~ | M/H | S2, S7
Contact Center | 3 | Aktivt på d365.se men kräver verifiering av exakt Microsoft Contact Center-/omnikanal-scope. | ~ | M | S2
Power Platform | 5 | Starkt kärnområde med egen sida, workshop och kundreferenser. | ✓ | H | S9, S11
AI/Copilot/Agents | 5 | AI-agenter, Copilot Readiness Kit, Agent Governance och event. | ✓/~ | H | S10, S13
Data & Analytics | 3 | Power BI/Fabric finns som signal, men är inte lika huvudprofilerat som CRM/M365/AI. | ~ | M | S9, S14
Integration | 4 | Relevant via Power Platform, Dynamics 365 CRM, M365 och Azure. | ~ | M/H | S3, S9
Managed Services | 4 | Statsbygg-case visar förvaltning och vidareutveckling av M365/Power Platform. | ✓ | H | S11
Internationell/Nordisk leverans | 4 | Norge + Sverige, och del av NOVA/Talan-kontext. | ✓/~ | M/H | S13
SMB | 3 | Kan vara relevant för snabb CRM/Power Platform-start, men inte lågkostnads-BC. | ~ | M | S3, S15
Enterprise | 3 | Relevant i Microsoft 365/Power Platform/CRM inom större organisationer; ej global SI-skala. | ~ | M | S11, S13
Produktområde | Roll i erbjudandet | Max 3 branscher/situationer | Kundnytta | Verifieringsgrad | Kommentar
Business Central | Ej verifierat / ej aktivt | Ej relevant | Ska inte användas som BC-matchning utan ny partneruppgift. | ✓/~ H | Undvik BC-filter.
Finance & SCM | Ej verifierat / ej aktivt | Ej relevant | Ska inte användas för större ERP-matchning. | ✓/~ H | Undvik F&SCM-filter.
Sales | Kärnerbjudande CE/CRM | B2B-sälj, medlems-/relationsintensiva organisationer, tjänstebolag | Struktur i pipeline, leads, uppföljning, Copilot och integration till Outlook/Excel/LinkedIn. | ✓ H | Dedikerad Sales-sida.
Customer Insights | Kärnerbjudande CE/CRM | Marknad, medlemsorganisationer, kunddataintensiva verksamheter | 360-graders kundbild, segmentering, prediktiv analys och personaliserade kundresor. | ✓ H | Customer Insights/Journeys-sidor.
Customer Service | Kärnerbjudande CE/CRM | Serviceorganisationer, support, offentlig/tjänsteintensiv verksamhet | Bättre ärendehantering, kunskapsdelning, självbetjäning, AI och automatisering. | ✓ H | Dedikerad Customer Service-sida.
Field Service | Aktivt område med verifieringsbehov | Fältservice, teknikerplanering, serviceflöden | Resursstyrning, schemaläggning, rutter, sanntidsdata och förebyggande service. | ✓/~ M/H | Verifiera referenser och scope.
Contact Center | Aktivt d365.se-filter, kräver verifiering | Kundservice, omnikanal, support | Kan vara relevant via Dynamics 365 Customer Service/omnikanal, men exakt erbjudande behöver verifieras. | ~ M | Verifiera före tung vikt.
Bransch | Klassning | Relevans i matchning | Kommentar | Referenstyp
Offentlig sektor / offentligägda organisationer | Sekundär/kundcasebaserad | Medel/hög | Statsbygg och Norec visar M365, SharePoint, Teams och Power Platform i offentligt sammanhang. | Kundcase
Fastighet, bostad och byggnära organisationer | Sekundär/kundcasebaserad | Medel | OBOS och Statsbygg visar fastighets-/bostadsrelaterade referensmiljöer. | Kundcase
Ideell/internationell organisation | Sekundär/kundcasebaserad | Medel | Leger uten Grenser/MSF visar Dynamics 365 CRM + Power Platform-referens. | Kundcase
Finansiella/digitala tjänster | Generell erfarenhet | Låg/medel | Vipps-case avser främst säkerhet/M365, inte Dynamics 365. | Kundcase
Tillverkning/lager/produktion | Ej verifierad som kärnbransch | Låg | Ingen tydlig ERP-/BC-/F&SCM-vertikal. | Ej verifierad
Område | Bedömning | Verif. | Konf. | Källa
Storlek | Point Taken AS redovisar 81 anställda enligt bolagsdata. Efter sammanslagningen med Infunnel kommuniceras cirka 90 medarbetare i Sverige/Norge. | ✓/~ | H | S12, S13
Omsättning | 146,5 MNOK driftsintäkter 2025 och 130,7 MNOK 2024 enligt Proff-sökresultat. | ✓ | H | S12
Lönsamhet | 2025 EBIT 14,0 MNOK och resultat före skatt 14,4 MNOK enligt Proff-sökresultat; 2024 resultat före skatt cirka 11,9 MNOK enligt Finansavisen/Proff. | ✓ | M/H | S12
Marknadsposition | Nordisk Microsoft cloud-/business applications-specialist med tydlig CE/CRM-, Power Platform-, M365- och AI-profil. | ~ | H | S3, S13, S15
Finansiell stabilitet | Medel/hög som redaktionell bedömning: positiv omsättning, positivt resultat och koncernkoppling via NOVA/Talan, men exakt koncernstruktur bör verifieras vid extern användning. | ~ | M | S12, S13
Taggkategori | Taggar
Produktområden | Dynamics 365 Sales; Customer Insights; Customer Service; Field Service; Contact Center; Power Platform; Microsoft 365; Copilot; AI Agents; Azure; Security; Cloud Operations
Ej aktiva huvudområden | Business Central; Finance & Supply Chain Management; Commerce; Human Resources; Project Operations; BC-ISV-tillägg
Branscher | Offentlig sektor; Fastighet/Bostad; Ideell/NGO; Tjänsteorganisationer; Kundserviceintensiva verksamheter
Kompetenser | CRM; Customer Engagement; Power Apps; Power Automate; Power BI; Microsoft 365; SharePoint; Teams; Copilot Readiness; AI Agent Governance; Security; Adoption
Kundstorlek | SMB; Midmarket; större organisationer; offentlig sektor; nordiska organisationer
Projektstorlek | Små CRM-startprojekt; medelstora Power Platform-/CRM-projekt; större M365-/governance-/AI-adoptionsprogram
Geografi | Norge; Sverige; Norden; Oslo; Stockholm; Malmö; Kristiansand; Sarpsborg
Kategori | Konkurrenter / jämförelse | Kommentar
CRM/CE-specialister | CRM-Konsulterna, Releye, Sirocco, Sundet CRM, B3 Elevate | Jämför vid Sales, Customer Insights, Customer Service, Field Service, Contact Center och Power Platform.
Breda Microsoft-partners | Accigo, Fellowmind, Nexer, Columbus, Capgemini/Sogeti | Jämför när kunden söker både CE/CRM, data/AI och bredare Microsoft-plattform.
Modern Work / M365-specialister | Lokala Microsoft 365-/Power Platform-aktörer | Point Taken är stark när CRM och M365/Power Platform behöver knytas ihop.
ERP-/BC-partners | NAB, Goodfellows, InBiz, BrightCom, Adbriq, Yellow Solution | Låg direkt konkurrens om kunden primärt söker ERP/BC.
Global SI | Accenture/Avanade, CGI, Capgemini, Sopra Steria | Global SI kan vara starkare i mycket stora transformationer och governance på global nivå.
Differentiatorer: Mot BC-specialister: starkare på CRM/CE, Microsoft 365, Power Platform, Copilot och AI-agenter. Mot CRM-boutiques: bredare Microsoft 365-, säkerhets- och governance-kapacitet. Mot globala SI:er: mer fokuserad nordisk specialist med kortare väg till implementation. Mot traditionella ERP-konsulter: betydligt starkare i kundprocesser, samhandling och AI/Copilot-adoption men svagare inom ERP-core.
Point Taken är en nordisk Microsoft-partner med stark profil inom Dynamics 365 Customer Engagement, Power Platform, Microsoft 365, Copilot/AI, säkerhet och skydrift. Partnern bör främst matchas när kunden söker Sales, Customer Insights, Customer Service, Field Service eller Contact Center i kombination med Power Platform, Teams/SharePoint, Microsoft 365-adoption, processautomation och AI-agenter. Point Taken är särskilt relevant för organisationer som vill få CRM och kundprocesser att fungera som en integrerad del av Microsoft-miljön, snarare än som ett isolerat system. Partnern har tydliga offentliga signaler kring Copilot-readiness, AI-agenter, agentgovernance och Power Platform, samt kundreferenser inom offentlig sektor, fastighet/bostad, ideell organisation och säkerhet. Point Taken bör inte prioriteras när kundens huvudbehov är Business Central, Finance & Supply Chain Management eller BC-nära ISV-lösningar. För d365.se är den bästa positioneringen: CE/CRM-, Power Platform-, AI/Copilot- och Modern Work-partner med nordisk leveransförmåga.
Kod | Källa / användning i dokumentet
S1 | d365.se – Point Taken partnerprofil och produktfilter.
S2 | d365.se – Dynamics 365 partnerlista/filtrering, Point Taken markerad för Sales, Customer Insights, Customer Service, Field Service och Contact Center.
S3 | Point Taken – svensk/norsk webb: Microsoft 365, Power Platform, Dynamics 365 CRM, AI-tjänster, Azure, säkerhet och skydrift.
S4 | Point Taken – Dynamics 365 CRM-sida och CRM-ekosystem.
S5 | Point Taken – Dynamics 365 Sales-sida och kontaktpunkt för Dynamics 365/Power Platform.
S6 | Point Taken – Dynamics 365 Customer Service-sida.
S7 | Point Taken – Dynamics 365 Field Service-sida.
S8 | Point Taken – Dynamics 365 Customer Insights / Journeys-sidor.
S9 | Point Taken – Power Platform-sida och Power Platform-workshop.
S10 | Point Taken – AI-tjänster, AI-agenter, Microsoft 365 Copilot och Copilot Readiness Kit.
S11 | Point Taken – kundreferenser, bland annat Statsbygg, OBOS, Vipps och Leger uten Grenser/MSF.
S12 | Proff/Finansavisen – bolagsinformation för Point Taken AS, org.nr, anställda, omsättning och resultat.
S13 | Nova Consulting Group – Point Taken och Infunnel går samman, svensk expansion, 90 anställda i Sverige/Norge samt Microsoft-/Copilot-signaler.
S14 | Point Taken – Om oss/team-sidor med Dynamics 365- och Power Platform-kompetens.
S15 | Internt d365.se marknads- och segmenteringsunderlag för Dynamics 365-partners.$txt$, source_document_filename = 'point_taken_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'point-taken';
UPDATE public.partners SET source_document_text = $txt$Sherpas Group AB
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
Dagens publika ISV-/tilläggsfilter på d365.se bör endast visa Sherpas under ett specifikt Business Central-tillägg när relationen är verifierad via ISV-källa, partnerkatalog, partnerinlämnad uppgift eller dokumenterat kundcase. Generell BC-/ERP-kompetens är inte tillräckligt för visning under en specifik ISV-lösning.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
Kunder som vill utvärdera eller implementera Dynamics 365 Business Central och samtidigt behöver integration mot Microsoft 365, Power BI, Teams, SharePoint eller externa system. [✓/~ H, S2/S4]
Medelstora och större organisationer som överväger eller använder Dynamics 365 Finance & Supply Chain Management, särskilt där underhåll, asset management, logistik eller tillverkning är viktigt. [✓/~ H, S3/S7]
Verksamheter inom logistik, tillverkning, energi, gruv-/anläggningsnära processer eller andra miljöer där ERP, processer och informationsflöden måste hänga ihop. [✓/~ M/H, S2/S3/S9]
Kunder som vill kombinera ERP-modernisering med SharePoint-/Teams-baserade processkartor, dokumentstyrning, intranät, projektportaler eller governance. [✓ H, S8]
Organisationer som använder Pyramid och vill kunna röra sig mellan Pyramid, Business Central och F&SCM inom en bredare ERP-resa i Serpentin-kontext. [✓/~ M/H, S5]
Kunder som behöver en svensk partner med helpdesk, support och kontinuerlig vidareutveckling snarare än enbart projektimplementation. [✓/~ M/H, S4/S8]
8. Mindre lämplig för
Kunder som primärt söker en renodlad CRM/Customer Engagement-specialist för Sales, Customer Insights, Customer Service, Field Service eller Contact Center utan ERP-koppling. [~ M, S1-S3]
Mycket små, prisdrivna BC-projekt där kunden vill ha minimal implementation och ingen bredare Microsoft- eller integrationsförmåga. [~ M, S10]
Globala enterpriseprogram där global roll-out, multi-country governance och stor SI-kapacitet är det tyngsta urvalskriteriet. [~ M, S10]
Projekt där Commerce, HR, Project Operations eller specifika BC-ISV:er som Continia, ExFlow eller Golden EDI är absoluta krav och Sherpas saknar verifierad relation. [~/? H, S1-S3]
Kunder som vill ha ett renodlat BI-/Fabric-/AI-specialistbolag utan ERP- eller Microsoft 365-behov. [~ M, S4/S8]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - BC-modernisering med Microsoft 365-koppling
Ett svenskt SMB-/midmarketbolag vill modernisera från äldre ERP/NAV/Pyramid-liknande miljö till Business Central och samtidigt få Power BI, Teams, SharePoint och automatiserade arbetsflöden att samspela.
Scenario 2 - F&SCM för asset-intensive verksamhet
Ett medelstort eller större industri-, energi- eller gruvnära bolag behöver bättre ERP-stöd för drift, underhåll, logistik och produktion. Sherpas är relevant när F&SCM kombineras med Dynaway/maintenance och svensk verksamhetsnära leverans.
Scenario 3 - Process- och dokumentstyrning runt ERP
Kunden har inte bara ett affärssystemproblem utan behöver tydligare processkartor, styrande dokument, projektportaler och informationsflöden i Teams/SharePoint. Sherpas egna lösningar gör matchningen starkare.
Scenario 4 - ERP-vägval i Serpentin-kontext
Ett bolag använder Pyramid eller står mellan Pyramid, BC och F&SCM. Serpentin-kontexten kan ge bredare vägvalsstöd över flera ERP-plattformar, men exakt ansvar och leveransmodell bör verifieras.
Scenario 5 - Efter go-live behöver kunden stabil support och vidareutveckling
Kunden har redan Microsoft 365, SharePoint eller Dynamics och behöver helpdesk, support, förbättringar, integrationer och kontinuerlig förvaltning snarare än ett isolerat projekt.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
Power BI är tydligt kopplat till både Business Central/F&SCM och Microsoft 365-miljön. [✓/~ H, S2/S3/S4]
Analytics & Data Warehousing finns som tjänsteområde på Sherpas webb. [✓ H, S4]
Datakvalitet och rapportering bör positioneras som kompletterande ERP- och beslutsstöd snarare än renodlad Fabric-/AI-specialism. [~ M]
Microsoft Fabric bör inte lyftas starkt utan partnerbekräftelse. [?/M]
16. Integration
Dynamics 365 och Business Central beskrivs kunna integreras med Microsoft 365-appar som CRM, Power BI, Teams och Outlook. [✓ H, S2/S3]
Power Platform, Azure Logic Apps och Azure Durable Functions nämns i Microsoft 365-/SharePoint-kontexten. [✓ H, S4/S8]
Dynaway-partnerskapet ger verifierad integrations-/ISV-signal för maintenance/asset management inom Dynamics 365 F&SCM/AX. [✓ H, S7]
Inexchange E-Document Connector och Boardeaser-integration är starka BC-/Pyramid-nära integrationssignaler. [✓ H, S9]
EDI/middleware-kapacitet bör verifieras om kunden efterfrågar större integrationslandskap eller specifika ISV-relationer. [~ M]
17. Ekonomi, storlek och marknadsposition
Sherpas Group AB är en mid-size svensk ERP- och Microsoft-plattformspartner. Bolaget hade enligt öppna bolagskällor 53 anställda och ca 89,5 MSEK i omsättning 2024, med positivt resultat. Bolaget är därmed större än flera små lokala BC-specialister, men betydligt mindre än de stora nordiska/globala Dynamics 365-aktörerna. Serpentin-satsningen kan förändra marknadspositionen genom att Sherpas kombineras med andra specialister inom Pyramid, Business Central och Dynamics 365 Finance & Operations.
18. Historik och utveckling
2007: Sherpas Group AB registreras enligt bolagsdata. [✓ H, S6]
Sherpas bygger en kombination av Dynamics 365/Business Central, Pyramid, SharePoint, Microsoft 365, Power BI och egna lösningar. [✓/~ H, S2-S4/S8]
Dynaway-partnerskapet stärker positionen inom maintenance/asset management för Dynamics 365 F&SCM/AX. [✓ H, S7]
2026: Sherpas blir en del av Serpentin tillsammans med Devisum, KR System och Netropolis, med ambition att skapa en ledande nordisk end-to-end-leverantör inom ERP, affärssystem och affärsdriven AI. [✓ H, S5]
19. Marknadskommunikation
20. Standardiserade taggar
21. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: bredare plattform runt F&SCM, Pyramid, M365/SharePoint och egna lösningar.
Mot F&SCM-specialister: starkare SMB/midmarket- och Microsoft 365-närhet, men mindre enterprise-skala än större aktörer.
Mot CRM-specialister: svagare CE-spets men starkare ERP-/M365-koppling.
Mot globala SI:er: närmare svensk midmarket, lokal förankring och bredare verksamhetsnära Microsoft-praktik, men lägre global leveransskala.
22. Kundorienterad partnerbeskrivning
Sherpas Group AB är en svensk partner för företag som vill kombinera affärssystem, Microsoft-plattformen och verksamhetsnära digitalisering. Partnern är särskilt relevant när valet inte enbart handlar om att införa ett ERP-system, utan också om att få processer, dokument, samarbetsytor, rapportering och integrationer att fungera i vardagen.
Inom Dynamics 365 är Sherpas tydligast kopplad till Business Central och Finance & Supply Chain Management. Business Central passar de små och medelstora organisationer som behöver samla ekonomi, lager, inköp, försäljning, projekt och produktion i ett modernt molnbaserat affärssystem. Finance & SCM är mer relevant när verksamheten är större eller mer komplex, exempelvis inom tillverkning, logistik, energi eller asset-intensive miljöer. Sherpas partnerskap med Dynaway ger dessutom en särskild signal kring underhåll och asset management i F&SCM- och AX-nära miljöer.
Det som särskiljer Sherpas från många renodlade ERP-partners är kombinationen med Microsoft 365, SharePoint, Teams, Power Platform och egna lösningar som Sherpas VLS, Project Portal och Provisioning Tool. För kunder som vill bygga en fungerande digital arbetsmiljö runt affärssystemet kan detta vara en viktig fördel. Sherpas passar därför bäst när ERP-projektet behöver kopplas till processkartor, styrande dokument, projektadministration, automatiserade arbetsflöden, Power BI-rapportering och långsiktig support.
Sherpas bör däremot inte i första hand positioneras som renodlad CRM-/Customer Engagement-specialist eller som global enterprise-SI. Rollen på d365.se bör vara ERP- och Microsoft-plattformspartner för svenska SMB-, midmarket- och utvalda större verksamheter där Business Central, F&SCM, integrationer, Microsoft 365 och verksamhetsnära förvaltning är centrala urvalskriterier.
23. AI-sammanfattning
24. Why This Partner
Partnern rekommenderas när kunden efterfrågar:
✓ Dynamics 365 Business Central eller F&SCM
✓ ERP-modernisering med Microsoft 365- och SharePoint-koppling
✓ Integrationer, Power BI, Power Apps eller Power Automate runt affärssystemet
✓ Logistik, tillverkning, energi eller asset-intensive processer
✓ Processkartor, dokumentstyrning, Teams-governance eller projektportaler
✓ Svensk partner med support/förvaltning och lokal verksamhetsförståelse
25. Verifiering före publicering
Bekräfta vilka Dynamics 365-produktområden Sherpas vill visas under på d365.se: BC, F&SCM, CE/CRM och eventuella tillvalsprodukter.
Bekräfta om Sherpas ska visas under CE/CRM, Sales, Customer Service, Field Service, Contact Center, Commerce, HR eller Project Operations – i nuläget bör dessa inte vara aktiva filter utan verifiering.
Bekräfta aktuell ägar-/gruppstruktur efter Serpentin-sammanslagningen och hur Sherpas juridiska enhet används i kunddialoger.
Bekräfta kontorsorter och geografisk leveranskapacitet, särskilt om d365.se ska visa fler orter än Skellefteå och Stockholm.
Bekräfta referenskunder och branschfokus som får användas publikt.
Bekräfta ISV-relationer: Dynaway, Inexchange, Boardeaser, samt eventuell relation till Continia, SignUp ExFlow, Golden EDI eller andra BC-tillägg.
Bekräfta AI/Copilot/Agent-erbjudande, eventuella kundcase och hur starkt detta ska viktas i AI-matchning.
Bekräfta förvaltningsmodell, helpdesk, SLA, supportorganisation och ansvarig kontaktperson för d365.se.
26. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort bör baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering med verifiering där uppgiften påverkar filter, kontaktväg eller ISV-status.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Sherpas Group AB | ✓ | H | S1, S2
Juridisk enhet | Sherpas Group AB, org.nr 556719-3015. Huvudkontor Skellefteå. Bolaget ingår från 2026 i Serpentin-satsningen tillsammans med Devisum, KR System och Netropolis, med Valedo Partners som ny majoritetsägare. | ✓/~ | H | S5, S6
Partnertyp | ERP- och Microsoft-plattformspartner med tyngd inom Business Central, Dynamics 365 Finance & SCM, Pyramid Business Studio, Microsoft 365/SharePoint, Power Platform och egna Microsoft 365-baserade lösningar. | ✓/~ | H | S2, S3, S4
Primära produktområden | Business Central och Finance & Supply Chain Management. Båda bör ses som aktiva ERP-områden, men BC passar främst SMB/midmarket medan F&SCM passar medelstora/större organisationer och mer komplexa flöden. | ✓/~ | H | S1, S2, S3
Sekundära produktområden | Power BI, Power Apps, Power Automate, Microsoft 365, SharePoint, Teams, Azure/Logic Apps, information management, analytics/data warehousing, systemutveckling och support/förvaltning. | ✓/~ | H | S2, S3, S4, S8
Områden som inte verifierats | Fristående CE/CRM, Sales, Customer Insights, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations bör inte vara aktiva huvudfilter utan ny partnerbekräftelse. | ~/? | M | S1, S2, S3
Typisk kundstorlek | SMB, midmarket och övre midmarket. F&SCM och asset-intensive scenarier kan vara relevanta för större organisationer, men global enterprise-leverans bör verifieras per scope. | ~ | M/H | S2, S3, S5
Typisk projektstorlek | Medelstora ERP-, integrations- och moderniseringsprojekt. Kan hantera större transformation inom Serpentin-kontext, men projektets leveransmodell bör verifieras. | ~ | M | S5
Geografisk kapacitet | Sverige med stark lokal förankring i Skellefteå och Stockholm. d365.se och andra källor indikerar bredare svensk närvaro som bör verifieras före publicering. | ✓/~ | M/H | S1, S4
Branschfokus | Logistik, tillverkning, energi/asset-intensive, gruv-/anläggningsnära processer samt SMB/midmarket med ekonomi, lager, projekt och produktion. | ✓/~ | M/H | S2, S3, S7, S9
AI-mognad | Medel. Sherpas har tydliga Microsoft 365-, automation-, Power Platform- och dataplattformsförmågor, men publika konkreta Copilot/Agent-case är begränsade och bör verifieras. | ~ | M | S4, S8
Förvaltningskapacitet | Hög för Microsoft 365/SharePoint och rimligt stark för ERP genom helpdesk, support och långsiktig förvaltning. Exakt D365-förvaltningsmodell bör bekräftas. | ✓/~ | M/H | S4, S8
Unika särskiljande egenskaper | Kombination av BC, F&SCM, Pyramid, SharePoint/M365-lösningar, egna IP-lösningar som Sherpas VLS, Provisioning Tool, Project Portal och TnT samt Dynaway-partnerskap för asset management. | ✓/~ | H | S3, S4, S7, S8, S9
partner_id: sherpas_group_ab
partner_name: Sherpas Group AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmed: false
  partner_confirmation_required_for_filtering: true
ownership_signal:
  current_group_context: serpentin
  majority_owner: valedo_partners
  confirmation_required: true
product_area_model:
  active_product_groups:
    business_central: high_primary
    finance_supply_chain_management: high_primary
  secondary_product_groups:
    power_platform: medium_high_adjacent
    power_bi: medium_high_adjacent
    microsoft_365_sharepoint: high_adjacent
    azure_integration: medium_adjacent
    pyramid_business: high_adjacent_non_d365
  not_verified_as_active:
    ce_crm_broad: verify_before_showing
    sales_customer_insights: do_not_show_without_partner_update
    customer_service_field_service_contact_center: do_not_show_without_partner_update
    project_operations: do_not_show_without_partner_update
    commerce: do_not_show_without_partner_update
    human_resources: do_not_show_without_partner_update
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: true_primary
  show_under_ce_crm: false_until_verified
  show_under_data_ai: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_microsoft_365_sharepoint: true_adjacent_signal
  show_under_isv_filters: only_if_isv_authorized_or_verified
isv_profile:
  dynaway: verified_partner_signal_for_fscm_asset_management
  inexchange_connector: verified_own_bc_integration
  boardeaser_connector: verified_own_bc_pyramid_integration
  continia: not_verified
  signup_exflow: not_verified
  golden_edi: not_verified
delivery_profile:
  smb: medium
  midmarket: high
  upper_midmarket: medium_high
  enterprise: medium
market_arena:
  primary: BC_and_FSCM_ERP_specialist_with_M365_Pyramid_width
  secondary:
    - microsoft_365_sharepoint_solution_partner
    - integration_and_information_management
    - asset_intensive_maintenance_via_dynaway
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | Sherpas kommunicerar både Business Central och D365 F&SCM, samt Pyramid Business Studio som närliggande ERP-plattform.
Business Central-fokus | 4/5 | H | BC är tydligt kommunicerat som cloudbaserat affärssystem för små och medelstora företag.
Finance & SCM-fokus | 4/5 | H | F&SCM är tydligt kommunicerat för medelstora och större företag, och Dynaway-partnerskapet stärker asset-intensive scenarier.
CRM / Customer Engagement | 2/5 | M | CRM nämns som integrations-/plattformskoppling, men fristående CE/CRM-erbjudande är inte tillräckligt verifierat.
Power Platform | 3/5 | H | Power BI, Power Apps och Power Automate lyfts som komplement till BC/F&SCM och Microsoft 365.
Data & Analytics | 3/5 | M/H | Analytics & Data Warehousing finns i tjänsteportföljen; Power BI används som viktig kompletterande förmåga.
Integration | 4/5 | H | Flera integrationer och plattformskopplingar, inklusive ERP till Microsoft 365, Inexchange, Boardeaser och Dynaway.
AI / Copilot / Agents | 2/5 | M | Automation och datagrund finns, men publika konkreta Copilot-/agentcase är begränsade.
Förvaltning / Managed Services | 4/5 | M/H | Helpdesk, support och M365/SharePoint-förvaltning är tydliga; ERP-förvaltningsmodell bör verifieras.
Branschspecialisering | 4/5 | M/H | Logistik, tillverkning, energi och asset-intensive processer återkommer i material och partnerrelationer.
Internationell leverans | 2/5 | M | Sverige/Norden mer relevant än global leverans; Serpentin kan förstärka men bör verifieras.
SMB-fokus | 4/5 | H | Business Central och Pyramid gör Sherpas relevant för SMB/midmarket.
Enterprise-fokus | 3/5 | M | F&SCM och större referenser/industriprocesser ger enterprise-relevans, men inte som global SI.
Standardisering | 4/5 | H | Egna paketerade lösningar och M365-governance visar standardiseringsförmåga.
Innovation | 3/5 | M/H | Egna lösningar som VLS, Project Portal, Provisioning Tool och TnT visar IP-orienterad utveckling.
Leveransbredd | 4/5 | H | ERP, Pyramid, Microsoft 365, SharePoint, Power Platform, data och systemutveckling ger bred leverans.
Partner-DNA typ: Svensk ERP- och Microsoft-plattformspartner med BC/F&SCM-tyngd, Pyramid-bredd, stark SharePoint/M365-förmåga och egen IP runt processer, samverkan och informationsstyrning. Tolkning: Sherpas bör matchas när kunden vill kombinera affärssystem, integration, Microsoft 365, processkontroll och förvaltning – särskilt i svenska SMB-/midmarket- och industri-/logistiknära miljöer.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | ERP- och Microsoft-plattformspartner för Business Central och F&SCM, med särskild styrka i att kombinera affärssystem med Microsoft 365, SharePoint, Power Platform, integration och egna lösningar för process-/informationsstyrning. | ~ | H | S1-S4, S8
Tydlig köparnytta | Kunden får en partner som kan hjälpa till med ERP-val och implementation, men även med arbetsflöden, dokument, Teams/SharePoint, Power BI, automation och långsiktig användning efter go-live. | ~ | H | S2, S3, S4, S8
Matchningslogik | Prioriteras när kunden söker BC eller F&SCM och samtidigt behöver integration, M365/SharePoint, processkartor, dokumenthantering, asset management eller förvaltning. | ~ | H | S2, S3, S7, S8, S9
Positioneringsgränser | Ska inte övermatchas som renodlad CRM/CE-specialist, global SI, Commerce-/HR-/Project Operations-partner eller auktoriserad partner för BC-ISV:er som inte är verifierade. | ~ | M/H | S1-S3
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  verified_bc_related_integrations:
    - inexchange_e_document_connector
    - boardeaser_integration
  verified_fscm_related_isv_signal:
    - dynaway_asset_management
  not_verified_for_public_bc_addon_filter:
    - continia
    - signup_exflow
    - golden_edi
  do_not_infer_authorization_for_other_addons: true
Filterområde | Beslut för Sherpas | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Hög | ✓/~ | BC är tydligt kommunicerat och passar små/medelstora företag, NAV-modernisering och moln-ERP.
F&SCM | Visa som primär partner, men med scope-kontroll. | Hög | ✓/~ | F&SCM är aktivt produktområde och stärks av Dynaway/asset management-signalen.
CE/CRM | Visa inte som aktivt huvudfilter utan verifiering. | Låg | ~/? | CRM nämns som integrerad plattformskoppling, men renodlat CE-erbjudande saknar tillräcklig verifiering.
Data & Analytics | Visa som kompletterande signal. | Medel | ✓/~ | Analytics & Data Warehousing samt Power BI finns i portföljen.
Power Platform | Visa som kompletterande signal. | Medel/hög | ✓/~ | Power Apps, Power Automate och Power BI kopplas till D365 och Microsoft 365.
Microsoft 365 / SharePoint | Visa som stark kompletterande signal. | Mycket hög | ✓ | Sherpas har tydliga M365-/SharePoint-erbjudanden och egna lösningar.
ISV-lösningar | Visa endast per verifierad ISV/integration. | Endast verifierad | ✓/? | Dynaway, Inexchange och Boardeaser är starkast belagda; Continia/ExFlow/Golden EDI ej verifierade.
Fält | Värde för Sherpas | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | BC + F&SCM ERP-specialist med Microsoft 365-/SharePoint- och Pyramid-bredd. | Använd som huvudkategori när kunden söker svensk ERP-partner med plattformsbredd och integrations-/förvaltningsbehov. | H | S2-S5
Sekundära arenor | Microsoft 365/SharePoint, information management, Power Platform, Power BI, asset-intensive maintenance, egna M365-lösningar. | Använd när kunden behöver mer än affärssystem, t.ex. processkartor, dokumentstyrning, Teams/SharePoint-governance eller automatisering. | H | S4, S7, S8
Partnerkategori | Svensk ERP-/Microsoft-plattformspartner i Serpentin-kontext. | Skilj från renodlade BC-boutiques, globala SI:er och rena CRM-specialister. | M/H | S5
Primär jämförelsegrupp | InBiz, Goodfellows, Yellow Solution, Bisqo, Navcite, NAB Solutions, Knowit, BE-terna, Cepheo. | Använd vid jämförelser inom BC/midmarket, F&SCM och svensk ERP-modernisering. | M | S10
Lägre relevans i jämförelse | Rena CRM/CE-specialister, globala SI:er, renodlade ISV:er och accounting/IT-kanaler utan ERP-projektkapacitet. | Använd som lägre jämförelse när kundens behov primärt är CRM, global transformation eller en specifik ISV-produkt. | M | S10
Fakta | Värde | Verif. | Konf. | Källa
Partner | Sherpas Group AB | ✓ | H | S1, S6
Juridisk enhet | Sherpas Group AB, org.nr 556719-3015. | ✓ | H | S6
Registreringsår | 2007 enligt bolagsdata. | ✓ | H | S6
Huvudkontor | Skeppargatan 23, Skellefteå. Kontor även i Stockholm enligt egen webb. Bredare ortsdata från d365.se bör verifieras. | ✓/~ | M/H | S1, S4, S6
Ägarstruktur | Sherpas ingår i Serpentin-satsningen tillsammans med Devisum, KR System och Netropolis, med Valedo Partners som ny majoritetsägare. | ✓/~ | H | S5
Omsättning | Ca 89,5 MSEK 2024 enligt bolagsdata; vissa källor indikerar preliminär 2025-omsättning ca 93,0 MSEK. | ✓ | H | S6
Antal anställda | 53 anställda 2024 enligt Bolagsfakta/Allabolag/Hitta. | ✓ | H | S6
Viktiga erbjudanden | Business Central, D365 F&SCM, Pyramid, Microsoft 365, SharePoint, Teams, Power BI, Power Platform, Azure/Logic Apps, information management, systemutveckling och förvaltning. | ✓/~ | H | S2-S4, S8
Kontaktvägar | info@sherpas.se, +46 910 508 00; helpdesk@sherpas.se / +46 910 508 25 enligt egen webb. | ✓ | H | S4
Storlekskategori | Svensk mid-size ERP-/Microsoft-plattformspartner; större än många lokala BC-specialister men inte global SI. | ~ | M/H | S6, S10
Prioritera Sherpas när | Signalstyrka | Konfidens
Kunden efterfrågar Business Central, NAV-modernisering, lager, ekonomi, produktion, projekt eller integrerad Microsoft-plattform. | Mycket stark | H
Kunden efterfrågar F&SCM, asset management, underhåll, tillverkning, logistik eller energi-/gruvnära processer. | Stark | H
Kunden vill kombinera ERP med Microsoft 365, SharePoint, Teams, Power BI, Power Apps eller Power Automate. | Mycket stark | H
Kunden behöver processkartor, dokumentstyrning, intranät, projektportaler eller governance i Teams/SharePoint. | Stark | H
Kunden använder Pyramid eller behöver förstå framtida ERP-väg mellan Pyramid, BC och F&SCM. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är rent CRM/CE utan ERP-, integration- eller Microsoft 365-koppling. | Stark nedviktning | M
Kunden kräver global SI-skala eller mycket stor internationell leveransorganisation. | Medel/stark nedviktning | M
Kunden kräver verifierad auktorisation för ett specifikt ISV-tillägg där Sherpas inte är verifierad. | Stark nedviktning | H
Kunden söker endast lägsta pris och enklaste möjliga moln-BC utan integrations- eller förvaltningsbehov. | Medel nedviktning | M
negative_match_rules:
  pure_crm_without_erp_or_m365: low_priority
  global_si_requirement: low_priority
  unverified_isv_addon_requirement: avoid
  very_small_low_complexity_price_driven_project: reduce_priority
match_confidence:
  high: BC_or_FSCM_plus_integration_or_M365_or_industry_fit
  medium: ERP_need_but_product_scope_or_industry_unclear
  low: pure_CE_CRM_or_specific_unverified_ISV_or_global_SI_need
Område | Poäng | Motivering | Verif. | Konf.
ERP | 5 | Kärnan i profilen är affärssystem: BC, F&SCM och Pyramid. | ✓/~ | H
Business Central | 4 | Tydligt erbjudande för små och medelstora företag; NAV/BC-modernisering och moln-ERP. | ✓/~ | H
Finance & SCM | 4 | Tydligt erbjudande för medelstora/större bolag och asset-intensive scenarier via Dynaway. | ✓/~ | H
CRM / Customer Engagement | 2 | CRM nämns som integrerad D365-komponent men inte som verifierat huvudområde. | ~/? | M
Power Platform | 3 | Power BI, Power Apps och Power Automate används som kompletterande plattform. | ✓/~ | H
Data & Analytics | 3 | Analytics & Data Warehousing och Power BI finns i portföljen. | ✓/~ | M/H
AI/Copilot | 2 | AI/Copilot-signaler är svagare än automation/datagrund; bör verifieras med partnern. | ~/? | M
Integration | 4 | ERP, Microsoft 365, SharePoint, Inexchange, Boardeaser och Dynaway visar integrationsförmåga. | ✓/~ | H
Business Transformation | 3 | Affärs- och verksamhetsutveckling finns men bör inte positioneras som stor management consulting. | ✓/~ | M/H
Förvaltning / Managed Services | 4 | Helpdesk, support och SharePoint/M365-förvaltning är tydliga. | ✓/~ | M/H
Internationell leverans | 2 | Primärt svensk/nordisk relevans. Serpentin kan ändra bilden men bör verifieras. | ~ | M
SMB | 4 | BC och Pyramid gör Sherpas relevant i SMB/midmarket. | ~ | H
Enterprise | 3 | F&SCM och industri-/asset-intensive kompetens ger viss enterprise-relevans, men inte global SI-profil. | ~ | M
Produktområde | Roll i erbjudandet | Kundnytta | Verifiering | Kommentar
Business Central | Kärnerbjudande | Molnbaserat ERP för ekonomi, försäljning, inköp, lager, projekt, produktion och rapportering. Kundnytta: snabbare beslut, bättre kontroll och integrerad Microsoft-miljö. | ✓/~ H | Max 3 branscher: logistik/distribution, tillverkning, restaurang/retail/SMB.
Finance & SCM | Kärnerbjudande | ERP för medelstora och större organisationer med mer komplexa processer, molnbaserad plattform, integration mot CRM/Power BI/Power Apps och asset management via Dynaway. | ✓/~ H | Max 3 branscher: tillverkning, energi/asset-intensive, logistik/gruvnära processer.
CE/CRM | Komplement/ej aktivt huvudfilter | Kan vara relevant som integrerad D365-komponent i ERP-projekt, men fristående CE/CRM-erbjudande bör verifieras innan publik matchning. | ~/? M | Max 3 branscher: ej aktivt branschfilter utan verifiering.
Power Platform | Komplement | Power BI, Power Apps och Power Automate används för analys, appar, automation och utökning runt ERP och Microsoft 365. | ✓/~ H | Stark kompletterande matchningssignal, inte D365-huvudprodukt.
Commerce / HR / Project Operations | Ej verifierat | Ska inte visas som aktiva filter utan partnerbekräftelse eller tydlig offentlig källa. | ? H | Endast verifieringspunkt.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Logistik / distribution | Kärnbransch | Hög | Återkommer i BC/F&SCM- och integrationsprofil. | Offentlig beskrivning/marknadsbedömning
Tillverkning / produktion | Kärnbransch | Hög | BC, F&SCM, Power BI och integrationsbehov passar profilen. | Offentlig beskrivning/marknadsbedömning
Energi / asset-intensive | Kärn-/sekundär bransch | Hög | Dynaway-partnerskap och asset management-signal gör området särskilt relevant. | Partner-/ISV-signal
Gruv-/anläggningsnära processer | Sekundär bransch | Medel/hög | Sherpas TnT och Boliden-koppling indikerar branschförståelse, men bredare D365-case bör verifieras. | Lösnings-/case-signal
Restaurang / kedjedrift / retail | Sekundär bransch | Medel | Pinchos Business Central-case indikerar relevant BC-scenario. | Nyhets-/kundcase-signal
Offentlig sektor / reglerad dokumenthantering | Generell erfarenhet | Medel | M365/SharePoint, VLS, whistleblower och dokumentlösningar kan vara relevanta, men D365-koppling bör verifieras. | Lösningssignal
Område | Bedömning | Kommentar | Verifiering
AI-mognad | Medel | Starkare inom automation, Power Platform, Microsoft 365-governance och datagrund än inom publikt verifierade Copilot-/agentprojekt. | ~ M
AI-readiness | Relevant | Data, processer, integration, SharePoint-informationsmodell och Power BI kan stödja AI-förberedelser. | ✓/~ M
Copilot | Ej starkt verifierat | Kan sannolikt hanteras i Microsoft 365/D365-kontext, men konkreta publika erbjudanden/case bör verifieras. | ? M
Copilot Studio / Agents | Ej verifierat | Ska inte användas som aktivt filter utan ny källa. | ? H
ERP-nära AI | Potentiellt | Starkast om kopplat till datakvalitet, rapportering, processautomation och D365-standard-Copilot. | ~ M
Nyckeltal | Värde | År | Källa
Omsättning | ca 89,5 MSEK | 2024 | S6
Antal anställda | 53 | 2024 | S6
Rörelseresultat/resultat | positivt; ca 9,1 MSEK rörelseresultat enligt Bolagsfakta/Allabolag-indikatorer | 2024 | S6
Ägar-/gruppsignal | Del av Serpentin med Valedo Partners som majoritetsägare | 2026 | S5
Område | Bedömning | Kommentar
Thought leadership | Medel | Kommunikationen är mer lösnings- och erbjudandeorienterad än ren thought leadership. Fokus ligger på teknikområden, lösningar och kundnära nyheter.
Webbinarier/events | Ej tydligt verifierat | Eventaktivitet bör verifieras. Webbplatsen visar främst lösningssidor och nyheter.
Kundcase/nyheter | Medel | Pinchos väljer Sherpas för Business Central, Pricer väljer Sherpas VLS och Serpentin-nyheten är tydliga signaler.
ERP-kommunikation | Hög | BC och F&SCM har egna tekniksidor och kopplas till digital transformation.
M365/SharePoint-kommunikation | Mycket hög | SharePoint, Teams, Microsoft 365 och egna lösningar har omfattande beskrivningar.
AI-kommunikation | Låg/medel | AI nämns i Serpentin/affärsdriven AI-kontext men Sherpas egna konkreta AI-/Copilot-case är begränsade.
Aktivitetstakt | Medel | Flera nyheter och lösningssidor, men inte lika stark offentlig marknadsaktivitet som större partners.
Taggkategori | Taggar
Produktområden | business_central; finance_supply_chain_management; power_platform; power_bi; microsoft_365; sharepoint; pyramid_business; azure_logic_apps
Branscher | logistics_distribution; manufacturing; energy; asset_intensive; mining_industrial; restaurant_retail_secondary
Kompetenser | erp_modernization; nav_to_bc; fscm; integrations; sharepoint_governance; teams_governance; power_bi; process_management; document_management; managed_services; support
ISV/lösningar | dynaway; inexchange_connector; boardeaser_connector; sherpas_vls; sherpas_project_portal; sherpas_provisioning_tool; sherpas_tnt; sherpas_basecamp
Kundstorlek | smb; midmarket; upper_midmarket; selected_enterprise
Projektstorlek | medium; large_when_erp_or_integration_scope_verified
Geografi | sweden; northern_sweden; stockholm; skelleftea; nordic_potential_verify
Ej avsedd för extern publicering. Används endast för intern AI-rankning, jämförelsegrupper och redaktionell bedömning.
Kategori | Bedömning
Primära konkurrenter inom BC/midmarket | InBiz, Goodfellows, Yellow Solution, Bisqo, Navcite, NAB Solutions, BrightCom/Exsitec.
Primära konkurrenter inom F&SCM | BE-terna, Knowit, Implema, Columbus, Cepheo, CGI, Nexer.
Angränsande konkurrenter inom M365/SharePoint | Fellowmind, Accigo, Knowit, Nexer, Innofactor och bredare Microsoft-konsulter.
Konkurrensfördelar | Kombinationen BC + F&SCM + Pyramid + SharePoint/M365 + egna lösningar + Dynaway/asset management. Stark lokal svensk profil.
När andra kan vara starkare | Renodlad BC-ISV-specialist, ren CRM-specialist, global SI eller partner med verifierad kompetens inom Commerce/HR/Project Operations.
Sherpas Group AB är en svensk ERP- och Microsoft-plattformspartner med tydlig koppling till Dynamics 365 Business Central och Finance & Supply Chain Management. Partnern passar bäst för SMB-, midmarket- och utvalda större organisationer som vill kombinera affärssystem med Microsoft 365, SharePoint, Teams, Power BI, Power Platform, integration och långsiktig support. Sherpas har särskild relevans i verksamheter med logistik, tillverkning, energi, asset-intensive processer och informations-/processstyrning. Egna lösningar som Sherpas VLS, Project Portal och Provisioning Tool stärker profilen runt processer, dokument och samarbete. Dynaway-partnerskapet ger en tydlig signal kring underhåll och asset management i F&SCM/AX-nära miljöer. Sherpas bör inte matchas som renodlad CRM/CE-specialist, global SI eller som auktoriserad partner för specifika BC-tillägg utan verifiering. Rollen på d365.se bör vara ERP- och Microsoft-plattformspartner med BC/F&SCM-tyngd och stark M365-/SharePoint-bredd.
Källkod | Källa / användning
S1 | d365.se partner-/filterinformation om Sherpas Group AB och D365-produktområden.
S2 | Sherpas egen sida om Microsoft Dynamics 365 Business Central.
S3 | Sherpas egen sida om Dynamics 365 Finance & Supply Chain Management.
S4 | Sherpas egen webbplats: startsida, kontakt, Microsoft 365, SharePoint, Teams, Power Platform-relaterade sidor.
S5 | Sherpas/Valedo/Serpentin-nyhet om att Sherpas, Devisum, KR System och Netropolis går samman i Serpentin med Valedo Partners som ny majoritetsägare.
S6 | Öppna bolagskällor: Allabolag, Bolagsfakta, Hitta/Krafman/Ratsit för org.nr, registreringsår, omsättning och antal anställda.
S7 | Dynaway partnerinformation om Sherpas som partner för Dynamics 365 / maintenance / asset management.
S8 | Sherpas lösningssidor: VLS, Project Portal, Provisioning Tool, Basecamp, Whistleblower, CoDOCS, SharePoint och Teams.
S9 | Sherpas integrations-/lösningssidor: Inexchange E-Document Connector, Boardeaser för Business Central/Pyramid och Sherpas TnT.
S10 | Intern d365.se marknadsstruktur och jämförelselogik för svenska Dynamics 365-partners.$txt$, source_document_filename = 'sherpas_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'sherpas-group-ab';
UPDATE public.partners SET source_document_text = $txt$Sirocco Group
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Sirocco bör i nuläget förstås som en CE/CRM-, CPQ-, Power Platform-, Data & AI- och integrationsspecialist, snarare än som en ERP- eller Business Central-partner.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s nuvarande publika ISV-/tilläggsfilter gäller i huvudsak Business Central-tillägg. Sirocco ska därför inte visas under BC-tillägg som Continia, ExFlow, Golden EDI, Logtrade eller liknande utan verifierad ISV-auktorisation. Däremot bör Siroccos CPQ-relationer till Tacton och Experlogix dokumenteras internt och kan bli relevanta för framtida CE/CRM-/CPQ-filter.
5. Filterbeslut för d365.se
Denna sektion styr hur Sirocco bör visas i filter, partnerkort, jämförelser och AI-rekommendationer. Filterbeslut är inte samma sak som fullständig kompetensbedömning; de anger hur starkt partnern bör viktas i matchningslogiken.
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika typer av Dynamics 365-aktörer. Syftet är att AI inte ska jämföra BC-specialister, F&SCM-enterprisepartners, CRM-specialister, globala SI:er och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Organisationer som söker Dynamics 365 CE/CRM med fokus på Sales, Customer Insights, Customer Service, Field Service eller Contact Center. [✓/~ H, S1/S2]
Kunder som vill effektivisera säljprocess, lead-to-quote, kunddata, marketing automation och kundservice i samma kundplattform. [✓/~ H, S1/S4]
Tillverkande, teknik-, energi- eller engineeringbolag där CPQ, komplexa offerter eller konfiguratorer är viktiga. [✓/~ H, S7/S8]
Kunder som har flera system runt CRM och behöver API-, datamigrerings-, Azure- eller MuleSoft-integration. [✓/~ H, S5/S9]
Organisationer som vill kombinera Dynamics 365 CE med Power Platform, Power BI och Data & AI. [✓/~ M/H, S4/S5]
Kunder som söker en mer specialiserad CRM-/CPQ-partner snarare än bred ERP-/SI-leverans. [~ H, S2/S4]
8. Mindre lämplig för
Kunder vars huvudbehov är Business Central, NAV-modernisering eller redovisningsnära ERP. [~ H]
Kunder vars huvudbehov är Dynamics 365 Finance & Supply Chain Management, produktion, lager eller enterprise-ERP. [~ H]
Mycket små bolag som endast söker enklaste möjliga lågkostnadsimplementation utan behov av CRM-specialisering, CPQ eller integration. [~ M]
Kunder som kräver verifierad auktorisation för ett specifikt Business Central-tillägg där Sirocco inte är verifierad. [~ H]
Projekt där kunden vill ha en global SI med stor governance-, outsourcing- eller ERP-programkapacitet som huvudkrav. [~ M]
9. AI Matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - CRM-modernisering för sälj och kunddata
Ett medelstort eller större bolag vill modernisera säljprocessen, strukturera pipeline, få bättre kunddata och koppla ihop CRM med marketing automation. Sirocco är relevant när Dynamics 365 Sales, Customer Insights, Dataverse, Power Platform och integration ska fungera som en helhet.
Scenario 2 - Kundservice, Field Service eller Contact Center
En serviceorganisation behöver förbättra ärendehantering, fältservice, kontaktcenterflöden och kundupplevelse. Sirocco passar när projektet är kundprocessnära och kräver Dynamics 365 CE-specialisering snarare än ERP-projektledning.
Scenario 3 - CPQ och komplex försäljning
Ett tillverkande eller teknikintensivt bolag har komplexa produkter, konfigurationer, prissättning och offertflöden. Sirocco är stark kandidat när CPQ ska kopplas till CRM och kundprocesser, särskilt med Tacton eller Experlogix som lösningskomponenter.
Scenario 4 - Integrationsintensivt CRM-landskap
Kunden har flera system runt kund, offert, service, ERP och dataplattform. Sirocco är relevant när CRM/CE behöver integreras med API:er, Azure-komponenter, MuleSoft, datamigrering eller Power Platform.
Scenario 5 - Data & AI ovanpå kundprocesser
Ledningen vill använda kunddata mer intelligent för segmentering, analys, prioritering, personalisering eller AI-assisterad service/sälj. Sirocco kan vara relevant när datagrund, CRM-processer och integration behöver stärkas före mer avancerad AI.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
16. Integration
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
2008: Sirocco anger att Microsoft-partnerskapet går tillbaka till bolagets grundande och att konsulterna varit involverade i över 150 Microsoft-projekt. [✓ H, S2]
2024: Sirocco kommunicerar fördjupad Microsoft Dynamics 365-/Power Platform- och CPQ-positionering, inklusive Tacton-reselleravtal. [✓ H, S2/S7]
2025: Sirocco Group förvärvar Florence Next för att stärka data- och integrationsförmåga, särskilt MuleSoft och CRM-/integrationserbjudandet. [✓ H, S9]
Löpande: Sirocco positionerar sig som oberoende CRM-, CPQ-, Data & AI- och integrationspartner med flera SaaS-plattformar, inklusive Microsoft, Salesforce, HubSpot, Tacton och Experlogix. [✓/~ H, S4/S8]
19. Marknadskommunikation
20. ISV- och tilläggsprofil
Siroccos ISV-relevans ligger främst i CE/CRM- och CPQ-nära lösningar, inte i Business Central-tillägg. d365.se:s befintliga BC-tilläggsfilter ska inte visa Sirocco utan verifiering per ISV.
21. Standardiserade taggar
22. Konkurrentsektion - internt
Ej avsedd för extern publicering. Används endast för AI-rankning, redaktionell bedömning och jämförelselogik.
23. Kundorienterad partnerbeskrivning
Sirocco Group är relevant för organisationer som ser CRM och kundprocesser som en strategisk del av affären. Partnern passar särskilt när behovet handlar om att utveckla sälj, marketing, kundservice, field service eller contact center i Microsoft Dynamics 365, och där lösningen behöver kopplas till kunddata, CPQ, Power Platform och integrationslandskapet runt kunden.
Till skillnad från en traditionell ERP-partner bör Sirocco främst utvärderas i projekt där kundrelation, offertflöde, kundservice, datakvalitet och säljproduktivitet är centrala. Kombinationen av Dynamics 365 CE, CPQ-partnerskap, Data & AI och integrationsförmåga gör partnern intressant för bolag med komplexa kundresor eller produkt-/offertprocesser, särskilt inom tillverkning, engineering, energi och andra branscher där kunddialogen ofta kräver mer än ett standardiserat CRM-system.
För kunder som söker Business Central, F&SCM eller bred ERP-transformation är andra partnerkategorier sannolikt mer relevanta. För kunder som däremot vill koppla ihop CRM, CPQ, kunddata, serviceprocesser och flera systemmiljöer kan Sirocco vara en stark kandidat.
24. AI-sammanfattning
25. Why This Partner
26. Verifiering före publicering
Bekräfta korrekt juridisk enhet och avtalspart för d365.se: Sirocco AB eller Sirocco Group AB.
Bekräfta aktuell kontaktperson, e-post och telefon.
Bekräfta exakt lista över aktiva Dynamics 365-produktområden: Sales, Customer Insights, Customer Service, Field Service, Contact Center och eventuellt Project Operations.
Bekräfta att Business Central och F&SCM inte ska visas som aktiva huvudområden, alternativt begär tydliga referenser om Sirocco vill visas där.
Bekräfta antal Dynamics 365 CE-/Power Platform-konsulter i Sverige/Norden.
Bekräfta Microsoft-statusar, certifieringar, Solution Partner-status och eventuella awards.
Bekräfta Tacton-, Experlogix-, HubSpot-, Salesforce- och MuleSoft-relationer och hur de får beskrivas i d365.se.
Bekräfta kundcase/referenser per bransch: tillverkning, livsmedel/process, energi, retail/e-handel, housing/fastighet och telecom.
Bekräfta konkreta AI/Copilot/Copilot Studio-/agentprojekt innan stark AI-positionering publiceras.
Bekräfta managed services-/supportmodell för Dynamics 365 CE och Power Platform.
27. Källor
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Sirocco Group | ✓ | H | S1, S2, S4
Juridisk enhet | Sirocco AB, org.nr 556755-5999, är den tydligaste rörelsedrivande svenska juridiska enheten i bolagsdata. Sirocco Group AB, org.nr 559009-4776, förekommer som koncern-/holdingrelaterad enhet. Avtalspart för d365.se bör verifieras med partnern. | ✓/~ | M/H | S10, S11
Partnertyp och egen beskrivning | Sirocco beskriver sig som en oberoende CRM-, CPQ-, Data & AI- och integrationspartner. För Dynamics 365 är partnern främst relevant som CE/CRM-specialist med Power Platform, CPQ och integrationsförmåga, inte som ERP-partner. | ✓/~ | H | S2, S4, S5
Primära produktområden | CE/CRM: Dynamics 365 Sales, Customer Insights, Customer Service, Field Service och Contact Center enligt d365.se och Siroccos egna Microsoft/Dynamics-sidor. Power Platform och Dataverse bör hanteras som starka kompletterande signaler. | ✓/~ | H | S1, S2, S3
Sekundära produktområden | Power Platform, Power Apps, Power Automate, Power BI, Data & AI, CPQ, integration, Azure Functions, Service Bus, API:er, CRM-arkitektur, datamigrering, test/SAFe/agil leverans och managed support kring kundnära plattformar. | ✓/~ | H | S2, S5, S9
Områden som inte verifierats | Business Central, Finance & Supply Chain Management, Commerce, HR och fristående Project Operations som huvudområden är inte verifierade för Sirocco i d365.se-matchning. Project Operations nämns i d365.se-profilen men bör verifieras separat innan aktivt filter. | ?/~ | H | S1
Typisk kundstorlek | SMB-midmarket till enterprise beroende på scope. Styrkan ligger i CRM-/CE-, CPQ- och kundprocessprojekt snarare än små standardiserade ERP-projekt. LinkedIn anger 51-200 anställda som företagsstorlek, medan svensk bolagsdata visar mindre juridisk enhet. | ✓/~ | M/H | S4, S10
Typisk projektstorlek | Medelstora till större CRM-/CE-program, Sales/Service/Marketing/Customer Insights-implementationer, CPQ-projekt, integrationsintensiva CRM-landskap och vidareutveckling av befintliga Dynamics 365 CE-miljöer. | ~ | H | S1, S2, S5, S7
Geografisk leveranskapacitet | Stockholm/Sverige som primär lokal närvaro. Sirocco kommunicerar internationell CPQ- och SaaS-partnerprofil, och Tacton beskriver Sirocco som global business and IT consulting firm/reseller. Global leverans bör dock verifieras per projekt. | ✓/~ | M/H | S1, S7, S8
Branschfokus | d365.se anger livsmedel/processindustri och tillverkningsindustri. Siroccos egna material lyfter dessutom manufacturing, engineering, energy, retail, housing och telecoms. För d365.se bör max tre branscher per produktområde användas. | ✓/~ | H | S1, S8, S9
AI-mognad | Medel till hög. Sirocco positionerar sig publikt kring Data & AI och kommunicerar AI-lösningar i samband med CRM, CPQ och integration. Däremot bör konkreta Dynamics 365 Copilot-/Copilot Studio-referenser verifieras innan stark publik AI-positionering. | ✓/~ | M/H | S4, S8, S9
Förvaltningskapacitet | Medel till hög. Microsoft Marketplace och CPQ-erbjudanden beskriver implementation, agil metodik, training/support och vidare stöd. Exakt managed services-modell för Dynamics 365 CE bör verifieras med partnern. | ✓/~ | M/H | S5, S7
Internationell leveransförmåga | Medel. Sirocco har internationellt språk, CPQ-partnerskap och Tacton-resellerstatus, men d365.se bör främst visa Stockholm/Sverige tills partnern bekräftar nordisk/global leveransmodell. | ~ | M | S1, S7, S8
Transformationskapacitet | Hög inom kundprocesser, CRM, CPQ, säljeffektivisering, customer engagement, data, AI och integration. Lägre inom ERP-transformation där andra partnerkategorier bör prioriteras. | ~ | H | S2, S4, S5, S9
Unika särskiljande egenskaper | Kombinationen Dynamics 365 CE/CRM, CPQ, Data & AI, integration och SaaS-partnerskap med Tacton/Experlogix/HubSpot gör Sirocco särskilt relevant när sälj-, service- och kunddataflöden behöver kopplas ihop med konfigurering/prissättning/offert. | ~ | H | S4, S7, S8
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, juridisk avtalspart, Microsoft-statusar, svenska D365-konsultstyrkan, ISV/CPQ-relationer och exakta produktfilter. | Bör verifieras innan publicering eller stark matchningsvikt när uppgiften påverkar kontaktväg, filter, produktområde eller partnerauktorisation.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: sirocco_group
partner_name: Sirocco Group
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_d365se_product_groups:
    ce_crm: high_primary
    sales_customer_insights: high_primary
    customer_service_field_service_contact_center: high_primary
  related_editorial_product_groups:
    power_platform: high_adjacent
    data_ai: medium_high_adjacent
    power_bi: medium_adjacent
    cpq: high_adjacent
    integration: high_adjacent
    managed_services: medium_adjacent
  not_verified_as_active:
    business_central: do_not_show_without_partner_update
    finance_supply_chain_management: do_not_show_without_partner_update
    commerce: do_not_show_without_partner_update
    human_resources: do_not_show_without_partner_update
    project_operations: verify_before_active_filter
isv_scope:
  business_central_addons: not_verified
  ce_crm_extensions: internal_knowledge_only
  cpq_partners:
    tacton_cpq: verified_public_signal
    experlogix_cpq: verified_public_signal
    hubspot: verified_public_signal
delivery_profile:
  smb: medium
  midmarket: high
  upper_midmarket: high
  enterprise: medium_high
industry_limit_per_product_area: 3
recommended_publication_status:
  publish_as_profile: true
  editorial_review_required: true
filter_decisions:
  show_under_business_central: false
  show_under_finance_supply_chain_management: false
  show_under_ce_crm_broad: true_primary
  show_under_sales_customer_insights: true_primary
  show_under_customer_service_field_service_contact_center: true_primary
  show_under_project_operations: verify_before_showing
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_cpq: true_internal_or_future_filter
  show_under_isv_filters: only_if_verified_for_specific_solution
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 1/5 | H | Inte verifierat som aktivt område i d365.se-profilen eller Siroccos centrala Microsoft-positionering. Ska inte visas som BC-partner utan ny verifiering.
Finance & SCM-fokus | 1/5 | H | F&SCM nämns endast i integrations-/data-migreringssammanhang i Marketplace-erbjudande, inte som eget ERP-implementationserbjudande.
CE/CRM-fokus | 5/5 | H | Sirocco positionerar sig tydligt kring CRM, Customer Experience, Dynamics 365 CE, Sales, Customer Insights, Customer Service och Field Service.
Sales & Customer Insights-fokus | 5/5 | H | d365.se och Siroccos egna sidor lyfter Sales, Customer Insights och kunddata/marketing automation.
Customer Service / Field Service / Contact Center | 5/5 | H | d365.se lyfter dessa som aktiva områden och Sirocco har egen Dynamics 365 Customer Service-positionering.
AI / Copilot / Agents | 3/5 | M/H | Data & AI kommuniceras starkt, men konkreta Dynamics 365 Copilot Studio/agent-case bör verifieras.
Data & Analytics | 4/5 | M/H | Sirocco kommunicerar Data & AI och har förvärvat Florence Next för att stärka data- och integrationsförmåga.
Integration | 5/5 | H | Marketplace och rekryterings-/kompetenssignaler lyfter Azure Functions, Service Bus, API:er, datamigrering och integration med D365 CE/F&O/Power Platform.
CPQ | 5/5 | H | Sirocco är publikt kopplad till Tacton och Experlogix och positionerar CPQ som ett centralt erbjudande.
Managed Services / support | 3/5 | M | Support och ongoing training nämns i CPQ/implementationserbjudanden, men full managed services-modell behöver verifieras.
Internationell leverans | 3/5 | M | Global profil och CPQ-partnerskap finns, men d365.se bör främst vikta Sverige/Stockholm tills leveransmodell verifieras.
SMB-fokus | 3/5 | M | Kan vara relevant för mindre och medelstora CRM-/CPQ-projekt, men inte för mycket små lågkostnadsprojekt.
Enterprise-fokus | 4/5 | M/H | CRM, CPQ, integration och SAFe/agil metodik passar större kundmiljöer, särskilt manufacturing/engineering/energy.
Innovation | 4/5 | M/H | Tydlig kommunikation kring AI, CPQ, customer data och modern SaaS-arkitektur.
Partner-DNA typ: CRM/CE-, CPQ- och integrationsspecialist med stark Microsoft Dynamics 365 Customer Engagement-position. Tolkning: Sirocco bör matchas när kunden söker kundprocesser, sälj/service/marketing, Customer Insights, CPQ, Power Platform och komplexa integrationer - inte när huvudbehovet är ERP/BC/F&SCM.
Symbol | Betydelse | Användning
Partnerbekräftad | Information verifierad direkt av partnern. | Används först när Sirocco har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft Marketplace, bolagsdata, d365.se eller annan offentlig källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | CE/CRM-specialist med stark koppling till Dynamics 365 Sales, Customer Insights, Customer Service, Field Service, Contact Center, Power Platform, CPQ, Data & AI och integration. | ~ | H | S1, S2, S4
Tydlig köparnytta | Kunden får en partner som kan förbättra sälj-, service-, marketing- och kunddataflöden, ofta med CPQ och integration till övriga affärssystem. | ~ | H | S1, S4, S5
Matchningslogik | Prioriteras när kunden söker CRM/CE, säljautomation, kundservice, Customer Insights, CPQ, komplexa kunddataflöden, Power Platform eller integration runt kundresan. | ~ | H | S1, S2, S5
Positioneringsgränser | Ska inte övermatchas för Business Central, F&SCM eller traditionella ERP-program. Project Operations bör inte visas som aktivt filter förrän Sirocco bekräftat produktområde och referenser. | ~ | H | S1
Filterområde | Beslut för Sirocco | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa inte som aktivt huvudfilter. | Låg/ingen | ?/~ | Ingen verifierad BC-position i aktuella källor.
F&SCM | Visa inte som aktivt huvudfilter. | Låg/ingen | ?/~ | F&SCM kan förekomma i integrationssammanhang men inte som ERP-erbjudande.
CE/CRM | Visa som primär partner. | Mycket hög | ✓/~ | Sirocco är tydligt CRM/Customer Engagement-positionerad.
Sales & Customer Insights | Visa som primär partner. | Mycket hög | ✓/~ | d365.se och Sirocco lyfter Sales, Customer Insights och kunddata.
Customer Service / Field Service / Contact Center | Visa som primär partner. | Hög | ✓/~ | Aktivt i d365.se-profilen och Siroccos Customer Service-positionering.
Project Operations | Visa inte utan verifiering. | Låg tills verifierad | ? | Nämns på d365.se men behöver partnerbekräftelse och referens innan aktivt filter.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Marketplace och rekryteringssignaler lyfter Power Apps/Automate och Dynamics 365 CE-utveckling.
Data & AI | Visa som kompletterande signal. | Medel/hög | ✓/~ | Sirocco kommunicerar Data & AI och Florence Next-förvärvet stärker området.
Integration | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | API, Service Bus, Azure Functions, MuleSoft och datamigrering är tydliga signaler.
CPQ | Visa internt/för framtida filter. | Mycket hög | ✓/~ | Tacton och Experlogix är starka CPQ-relationer; relevant för manufacturing/complex sales.
ISV-lösningar | Visa endast per verifierad lösning. | Endast verifierad matchning | ?/~ | BC-ISV: ej verifierat. CPQ-lösningar kan dokumenteras internt.
filter_decisions:
  show_under_bc: false
  show_under_fscm: false
  show_under_ce_crm: true_primary
  show_under_sales: true_primary
  show_under_customer_insights: true_primary
  show_under_customer_service: true_primary
  show_under_field_service: true_primary
  show_under_contact_center: true_primary
  show_under_project_operations: false_until_partner_verified
  show_under_power_platform: true_adjacent
  show_under_data_ai: true_adjacent
  show_under_integration: true_adjacent
  show_under_cpq_future_filter: true_if_available
  show_under_bc_isv_filters: false_unless_verified
Fält | Värde för Sirocco | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | CE/CRM / Customer Engagement-specialist | Använd som huvudkategori när kunden söker sälj, marketing, kundservice, field service, contact center, kunddata, Dataverse eller Power Platform kring kundprocesser. | H | S1, S2
Sekundära arenor | CPQ, Data & AI, integration och Power Platform | Använd som kompletterande logik när kunden har komplexa sälj-/offertflöden, kunddatafragmentering eller flera system som ska integreras. | H | S4, S5, S7
Partnerkategori | CRM/CE-boutique med CPQ- och integrationsspecialisering | Skiljer Sirocco från breda Microsoft-partners, ERP-specialister och BC-nischpartners. | H | S2, S4
Primär jämförelsegrupp | CRM-Konsulterna, Releye, B3 Elevate, Accigo, Columbus CE-team, HSO CE-team, Avanade/Accenture CE-team | Använd vid jämförelser där kundens huvudfråga är CRM/CE, kunddata och sälj/service/marketing. | M | S12
Lägre relevans i jämförelse | Business Central-specialister, F&SCM-/ERP-transformationspartners, redovisningsnära IT-kanaler | Använd som lägre jämförelse när kundens huvudbehov är ERP, ekonomiprocesser eller lågkomplex BC-implementation. | H | S12
Fakta | Värde | Verif. | Konf. | Källa
Partner | Sirocco Group | ✓ | H | S1, S2
Juridisk enhet | Sirocco AB, org.nr 556755-5999; Sirocco Group AB, org.nr 559009-4776. Avtalspart behöver verifieras. | ✓/~ | M/H | S10, S11
Grundat år | Sirocco uppger Microsoft-partnerskap sedan 2008. LinkedIn anger grundat 2006. Juridisk historik bör verifieras vid publicering. | ✓/~ | M | S2, S4
Huvudkontor | Stockholm. | ✓ | H | S1, S4
Ägarstruktur | Privat svenskt bolag/koncernstruktur enligt bolagsdata. Exakt ägarbild och koncernstruktur bör verifieras om den ska användas publikt. | ~ | M | S10, S11
Omsättning och anställda | Sirocco AB: Bolagsfakta visar 77,3 MSEK omsättning och 36 anställda för 2024. Sirocco Group AB har separat bolagsdata som inte nödvändigtvis avspeglar konsultverksamhetens fulla storlek. | ✓/~ | M/H | S10, S11
Geografisk närvaro | Stockholm/Sverige som primär d365.se-närvaro. Internationell CPQ-/SaaS-profil finns men bör verifieras per projekt. | ✓/~ | M/H | S1, S7
Viktiga erbjudanden | Dynamics 365 Sales, Customer Insights, Customer Service, Field Service, Contact Center, Power Platform, CPQ, Data & AI, integration, datamigrering och CRM-rådgivning. | ✓/~ | H | S1, S2, S4, S5
Kontaktperson | Laith Al-Hashimi anges på d365.se-profilen. E-post och telefon finns i d365.se-profilen men bör hållas uppdaterade via partnern. | ✓/~ | M/H | S1
Storlekskategori | Nischad CRM/CE- och CPQ-specialist med tillräcklig storlek för medelstora och mer komplexa kundprojekt, men inte en global SI eller ERP-koncern. | ~ | H | S4, S10
Prioritera Sirocco när | Signalstyrka | Konfidens
Kunden söker Dynamics 365 CE/CRM, Sales, Customer Insights, Customer Service, Field Service eller Contact Center. | Mycket stark | H
Kunden har komplexa sälj-, offert-, prissättnings- eller konfiguratorbehov där CPQ är centralt. | Mycket stark | H
Projektet innehåller CRM-integrationer, API:er, Azure Functions, Service Bus, MuleSoft, datamigrering eller flera systemlandskap. | Mycket stark | H
Kunden vill kombinera CRM/CE med Power Platform, Power BI, Data & AI eller kunddataanalys. | Stark | M/H
Kunden är tillverkande/engineering/energi/retail/housing/telecom och behöver CRM-/CPQ-/serviceflöden. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Kunden söker Business Central/NAV eller ekonominära ERP som huvudprojekt. | Stark nedviktning | H
Kunden söker F&SCM-/enterprise-ERP-implementation där ekonomi, supply chain och lager/produktion är huvudscope. | Stark nedviktning | H
Projektet är mycket litet, enkelt och primärt budgetdrivet. | Medel nedviktning | M
Kunden kräver verifierad BC-ISV-auktorisation där Sirocco inte är listad. | Stark nedviktning | H
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
negative_match_rules:
  business_central_primary_need: low_priority
  fscm_erp_primary_need: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
match_confidence:
  high: ce_crm_sales_service_customer_insights_cpq_integration
  medium: broader_microsoft_power_platform_data_ai_without_clear_d365_scope
  low: erp_bc_fscm_or_specific_bc_isv_scope
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 1 | Ej verifierat som aktivt erbjudande. | ?/~ | H | S1
Finance & SCM | 1 | Ej verifierat som ERP-erbjudande, även om F&O kan ingå i integrationslandskap. | ?/~ | H | S5
CE/CRM | 5 | Kärnområde. CRM, Sales, Customer Insights, Customer Service, Field Service och Contact Center är centrala. | ✓/~ | H | S1, S2
Customer Engagement | 5 | Stark kundprocess- och engagement-positionering. | ✓/~ | H | S1, S4
Sales & Customer Insights | 5 | Tydligt i d365.se-profilen och egna sidor. | ✓/~ | H | S1, S6
Customer Service / Field Service | 5 | Aktivt i d365.se-profilen och Siroccos Dynamics 365 Customer Service-erbjudande. | ✓/~ | H | S1, S3
Power Platform | 4 | Marketplace och kompetenssignaler lyfter Power Apps, Power Automate och Dynamics 365 CE-utveckling. | ✓/~ | H | S5
AI/Copilot | 3 | Data & AI-position finns, men Dynamics 365 Copilot/agent-case bör verifieras. | ✓/~ | M | S4, S9
Data & Analytics | 4 | Data & AI och Florence Next-förvärvet stärker data-/integrationsprofilen. | ✓/~ | M/H | S4, S9
Integration | 5 | API, Azure, Service Bus, MuleSoft och datamigrering är tydliga styrkor. | ✓/~ | H | S5, S9
CPQ | 5 | Tacton/Experlogix och CPQ är central differentierare. | ✓/~ | H | S7, S8
Business Transformation | 4 | Stark inom kundnära transformation, men inte ERP-programtransformation. | ~ | M/H | S4
Strategisk rådgivning | 4 | Oberoende CRM/CPQ-rådgivning och business case-stöd kommuniceras. | ✓/~ | M/H | S4
Förvaltning / Support | 3 | Ongoing support och training nämns, men full managed services-modell bör verifieras. | ✓/~ | M | S7
SMB | 3 | Relevans finns vid CRM/CPQ, men inte som lågkostnads-BC/ERP-partner. | ~ | M
Enterprise | 4 | Relevant för komplexa CRM-, CPQ- och integrationsmiljöer. | ~ | M/H | S5, S7
Huvudområde | Produkt | Roll | Kundnytta | Verif. | Kommentar
BC | Business Central | Ej aktivt huvudområde | Ej primär matchning. Ska inte visas i BC-filter utan ny partnerbekräftelse. | ?/~ | Ingen offentlig/verifierad BC-position i aktuellt material.
BC | Max 3 branscher | Ej tillämpligt | Inga BC-branscher bör sättas utan verifiering. | ? | N/A
F&SCM | Finance & Supply Chain Management | Ej aktivt huvudområde | Kan förekomma som integrationslandskap men inte som ERP-leverans. | ?/~ | Marketplace nämner integrations-/migreringserfarenhet med F&O, men inte ERP-erbjudande.
F&SCM | Max 3 branscher | Ej tillämpligt | Inga F&SCM-branscher bör sättas utan verifiering. | ? | N/A
CE/CRM | Sales | Kärnerbjudande | Säljprocess, pipeline, automation, CRM-adoption och kunddata. | ✓/~ | Branscher: tillverkning, livsmedel/process, engineering/industrial.
CE/CRM | Customer Insights | Kärnerbjudande | Kunddata, segmentering, marketing journeys och personaliserad kommunikation. | ✓/~ | Branscher: tillverkning, retail/e-handel, telecom/energi.
CE/CRM | Customer Service / Field Service / Contact Center | Kärnerbjudande | Ärendehantering, serviceprocesser, fältservice och kontaktcenterlogik. | ✓/~ | Branscher: tillverkning, energi, housing/fastighet.
Tillval | Project Operations | Ej verifierat aktivt filter | Nämns på d365.se men kräver bekräftelse om faktisk leveranskapacitet. | ? | Verifiera med partner.
Tillval | Commerce / HR | Ej verifierat | Ska inte visas som aktivt filter. | ? | Ej stöd i aktuella källor.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Tillverkningsindustri | Kärnbransch för CE/CRM/CPQ | Hög | Sirocco och d365.se lyfter manufacturing/tillverkning. CPQ gör branschen extra relevant. | d365.se, Sirocco, Tacton/CPQ
Livsmedel & processindustri | Kärnbransch i d365.se-profil | Hög | Anges i d365.se för Sales/Customer Insights och kundservice/field service. | d365.se
Engineering / industriella produkter | Sekundär/stark CPQ-bransch | Medel/hög | Siroccos CPQ- och Tacton-position passar komplexa produkter och konfigurering. | Sirocco/Tacton
Energi | Sekundär bransch | Medel | Nämns i Siroccos beskrivning av kundindustrier vid Florence Next-förvärvet. | Sirocco press
Retail/e-handel | Sekundär bransch | Medel | Nämns som kundindustri och kan vara relevant för Customer Insights/marketing automation. | Sirocco press
Fastighet/housing | Sekundär bransch | Medel | Nämns som kundindustri i Siroccos material; relevans särskilt för service/kunddialog. | Sirocco press
Telecom | Sekundär bransch | Medel | Nämns i Siroccos material; kräver verifierade case för stark publik vikt. | Sirocco press
Område | Bedömning | Verif. | Konf.
AI-mognad | Medel till hög. Data & AI är del av Siroccos positionering, men konkret Dynamics 365 Copilot-/agentportfölj bör verifieras. | ✓/~ | M/H
AI-readiness | Relevant genom kunddata, CRM-processer, integration och datakvalitet. Bör matchas när kunden behöver förbereda CRM/CE för AI. | ~ | M/H
Copilot / Copilot Studio | Ej tillräckligt verifierat som specifikt erbjudande. Bör inte ges stark publik vikt utan partnerbekräftelse. | ? | M
Agents | Ej tydligt verifierat. Kan vara framtida matchningssignal inom CRM/Service, men kräver referenser. | ? | M
Konkreta AI-användningsfall | Kunddataanalys, sales productivity, service automation, marketing personalization, CPQ intelligence och datadrivna kundprocesser. | ~ | M/H
Dataförutsättningar | Stärkt av Data & AI-position och Florence Next-förvärv med MuleSoft/integration. | ✓/~ | M/H
Område | Bedömning | Verif. | Konf.
Data governance | Relevant men inte tillräckligt detaljerat verifierat. Bör undersökas om kunden söker data governance som huvudbehov. | ~ | M
Dataplattform | Data & AI och Florence Next stärker integrations-/dataplattformsprofilen. Exakt Microsoft Fabric-position bör verifieras. | ✓/~ | M
Power BI | Nämns i intern marknadskontext och Dynamics/Power Platform-koppling. Bör verifieras som leveranspaket. | ~ | M
Microsoft Fabric | Ej verifierat som Sirocco-erbjudande. | ? | L/M
Datakvalitet | Starkt relevant i Customer Insights, CRM och AI-readiness men bör beskrivas som d365.se-bedömning. | ~ | M/H
Analytics | Relevant för kunddata, service, marketing och CPQ-analys. | ~ | M/H
AI-grund | Kunddata, integration, datamigrering och CRM-processer är tydlig grund för AI-användning. | ~ | M/H
Område | Bedömning | Verif. | Konf.
Integrationsarkitektur | Stark. Sirocco lyfter integration som del av D365/Power Platform och Florence Next-förvärvet stärker området. | ✓/~ | H
Middleware | MuleSoft-signal via Florence Next. Azure Service Bus och Azure Functions nämns i Dynamics Developer-kompetenssignaler. | ✓/~ | H
API:er | REST/SOAP/API-baserad integration förekommer i offentliga kompetens-/jobbsignaler. | ✓/~ | H
EDI | Ej verifierat som särskilt erbjudande. Ska inte matchas starkt utan case. | ? | L/M
Dataintegration | Stark vid CRM/CE, Customer Insights, F&O-integration och datamigrering. | ✓/~ | H
Drift och övervakning | Bör verifieras. Support nämns, men inte detaljerad driftmodell. | ?/~ | M
Integrationskompetens | En av Siroccos viktigaste differentierare i relation till rena CRM-konfigurationspartners. | ~ | H
Område | Bedömning | Verif. | Konf. | Källa
Omsättning | Sirocco AB: 77,3 MSEK 2024 enligt Bolagsfakta. Sirocco Group AB visar annan holding-/koncernrelaterad omsättning i Allabolag. Rätt publiceringssiffra bör verifieras. | ✓/~ | M/H | S10, S11
Medarbetare | Sirocco AB: 36 anställda 2024 enligt Bolagsfakta. LinkedIn anger 51-200 anställda för Sirocco Group. Skillnaden bör hanteras som koncern-/profilfråga. | ✓/~ | M | S4, S10
Tillväxt | Bolagsfakta visar minskad omsättning 2024 för Sirocco AB, medan strategiska aktiviteter som Florence Next-förvärvet och Tacton-partnerskap signalerar satsning. | ✓/~ | M | S9, S10
Förvärv | Sirocco Group förvärvade Florence Next 2025 för att stärka data- och integrationsförmåga. | ✓ | H | S9
Marknadsposition | Specialiserad CRM/CE-, CPQ- och integrationsaktör snarare än bred ERP- eller BC-partner. | ~ | H | S2, S4, S12
Storlekskategori | Mindre/mellanstor specialist jämfört med stora SI:er och breda Microsoft-partners, men med tydlig spets. | ~ | M/H | S10, S12
Finansiell stabilitet | Sirocco AB visar positivt resultat 2024 enligt Bolagsfakta. För detaljerad finansiell bedömning krävs uppdaterad årsredovisning och koncernanalys. | ✓/~ | M | S10, S11
Område | Analys | Konf.
Thought leadership | Aktiv kring CRM-adoption, Customer Insights, CPQ, manufacturing trends och Microsoft Dynamics 365. Kommunikationen är mer specialist-/lösningsorienterad än bred ERP-marknadsföring. | H
Webbinarier/events | Sirocco och Tacton kommunicerar webinar-/demoaktiviteter kring CPQ och CRM/CPQ-integrationer. Exakt aktivitetstakt bör verifieras. | M
Kundcase | Publika kundcase är inte lika tydliga i de källor som granskats. Kundreferenser bör efterfrågas före stark publik branschpositionering. | M
Bloggar/insikter | Relativt aktivt material inom Customer Insights, CPQ, adoption och manufacturing. Bra signal för expertpositionering. | H
AI-kommunikation | Data & AI nämns tydligt, men konkreta Dynamics 365 Copilot-/agent-case bör verifieras. | M
ERP-kommunikation | Låg. Sirocco bör inte beskrivas som ERP-partner. | H
Aktivitetstakt | Medel till hög inom CRM/CPQ/Customer Insights; bör verifieras löpande inför publicering. | M/H
ISV/lösning | Kategori | Roll | Verif. | Konf. | Kommentar
Tacton CPQ | CPQ / komplex försäljning | Reseller/partner | ✓ | H | Stark signal för tillverkning, engineering och komplex konfigurering.
Experlogix CPQ | CPQ / document automation | Partner-/lösningsrelation | ✓ | H | Experlogix CPQ och Document Automation integrerar med Dynamics 365 och Power Platform enligt Sirocco.
HubSpot | Marketing/CRM | Partnerrelation | ✓/~ | M/H | Relevant som SaaS-komplement men inte Dynamics 365-filter i d365.se.
Salesforce | CRM/CPQ | Plattformsrelation/kompetens | ✓/~ | M/H | Relevant för jämförelser men inte Dynamics 365-filter.
MuleSoft | Integration | Kompetens via Florence Next | ✓/~ | M/H | Stärker integrationsprofilen; verifiera exakt leveranskapacitet i Sverige.
Continia | BC-tillägg | Ej verifierad | ? | H | Ska inte visas som BC-ISV-filter.
ExFlow | BC/F&SCM AP automation | Ej verifierad | ? | H | Ska inte visas som ISV-filter utan källa.
Golden EDI | BC/EDI | Ej verifierad | ? | H | Ska inte visas som ISV-filter utan källa.
Taggkategori | Taggar
Produktområden | CE/CRM; Dynamics 365 Sales; Customer Insights; Customer Service; Field Service; Contact Center; Power Platform; Power BI; Data & AI; CPQ; Integration
Ej aktiva produktområden | Business Central; F&SCM; Commerce; HR; Project Operations utan verifiering
Branscher | Tillverkningsindustri; Livsmedel & process; Engineering; Energi; Retail/e-handel; Housing/fastighet; Telecom
Kompetenser | CRM; Customer Engagement; CPQ; Customer Insights; Marketing automation; Service management; Field Service; Contact Center; Power Platform; API; Azure Functions; Service Bus; MuleSoft; Datamigrering; Data & AI
Kundstorlek | SMB; Midmarket; Upper midmarket; Enterprise
Projektstorlek | Medel; Stor; Integrationsintensiv; Specialistprojekt; CRM-transformation; CPQ-program
Geografi | Stockholm; Sverige; Norden/internationellt kräver verifiering
Dimension | Bedömning
Primära konkurrenter | CRM-Konsulterna, Releye, B3 Elevate, Sirocco-liknande CRM/CE-specialister, Accigo inom bredare CE/Data/AI, samt CE-team hos Columbus, HSO, Avanade/Accenture.
Konkurrensfördelar | CRM/CE-fokus, CPQ-specialisering, integration, Tacton/Experlogix-relationer, Data & AI-position och kundprocessnära arbetssätt.
Svagare mot BC-specialister | Ska inte konkurrera i rena Business Central-/NAV- eller ekonominära ERP-case.
Svagare mot F&SCM-/ERP-partners | Mindre relevant när huvudfrågan är finance, supply chain, produktion, lager, global ERP-rollout eller ERP-governance.
Svagare mot globala SI:er | Vid mycket stora globala transformationer där governance, outsourcing, change management och tusentals användare är huvudrisk.
Starkare mot traditionella CRM-konfigurationspartners | När CPQ, integration, data/AI och komplex sälj-/serviceprocess är avgörande.
Sirocco Group är en CRM/Customer Engagement-specialist med stark relevans inom Dynamics 365 Sales, Customer Insights, Customer Service, Field Service, Contact Center, Power Platform, CPQ, Data & AI och integration. Partnern bör prioriteras när kunden söker förbättrade kundprocesser, säljautomation, servicehantering, kunddata, marketing automation eller CPQ-lösningar som behöver integreras med övriga system. Sirocco är särskilt intressant för verksamheter med komplex försäljning, offert-/konfigurationsbehov eller integrationsintensiva CRM-landskap, exempelvis inom tillverkning, engineering, energi, retail och processnära verksamheter. Partnern bör däremot inte matchas högt i rena Business Central-, F&SCM- eller ERP-moderniseringsprojekt utan separat verifiering. Siroccos styrka ligger i kundnära affärsprocesser, CRM-specialisering, CPQ och integration - inte i traditionell ERP-leverans.
Partnern rekommenderas eftersom kunden efterfrågar: Dynamics 365 CE/CRM; Sales; Customer Insights; Customer Service; Field Service; Contact Center; CPQ; Power Platform; kunddata; Data & AI; integrationer; datamigrering; sälj- och serviceprocesser; medelstor eller komplex organisation; tillverkning/engineering/energi/livsmedel-process med kundnära processbehov.
Källa | Beskrivning
S1 | d365.se partnerprofil för Sirocco Group: produktområden, branschfokus, kontaktperson och AI-genererad partnertext.
S2 | Sirocco Group partnerprofil för Microsoft Dynamics 365: Microsoft-partnerskap sedan 2008, 150+ Microsoft-projekt och D365/BizApps/Power Platform-positionering.
S3 | Sirocco Group Dynamics 365 Customer Service-sida: Customer Service-positionering och kundservicevärde.
S4 | Sirocco Group webbplats/solutions: CRM, CPQ, Data & AI, integrations- och transformationsteman.
S5 | Microsoft Marketplace: Dynamics 365 & Power Platform Implementation med Sales, Customer Service, Power Apps, datamigrering och integration.
S6 | Sirocco Group Customer Insights-artikel/sida: kunddata, marketing journeys och personalisering.
S7 | Sirocco/Tacton-partner- och pressmaterial: Tacton CPQ-resellerstatus och CPQ-position.
S8 | Sirocco/Experlogix partnerprofil och CPQ-material: Experlogix CPQ och document automation med Dynamics 365/Power Platform-koppling.
S9 | Sirocco pressmeddelande om förvärv av Florence Next: förstärkt data-, MuleSoft- och integrationsförmåga.
S10 | Bolagsfakta för Sirocco AB: org.nr, omsättning, resultat och antal anställda.
S11 | Allabolag/Ratsit/Krafman för Sirocco Group AB: koncern-/holdingrelaterad bolagsdata, bör verifieras innan publik användning.
S12 | Internt d365.se marknadsunderlag/analytisk marknadskontext för jämförelsegrupp och positionering.$txt$, source_document_filename = 'sirocco_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'sirocco-group';
UPDATE public.partners SET source_document_text = $txt$Vivicta
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI-matchningsprofil
1A. Användnings- och publiceringslager
Detta dokument är primärt ett internt kunskapsunderlag för d365.se:s filtrering, AI-sök, partnerjämförelser och rekommendationslogik. Uppgifter om produktområden, kontaktpersoner, ISV-relationer, Microsoft-statusar och referenskunder ska verifieras extra innan de ges stark publik vikt.
AI-metadata för maskinell tolkning
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
Viktig avgränsning: d365.se:s publika ISV-/tilläggsfilter bör endast visa Vivicta under ett specifikt Business Central-tillägg om partnern är auktoriserad av den aktuella ISV:n eller om motsvarande verifiering finns dokumenterad. Generell ERP-, F&SCM-, CE/CRM-, integrations- eller AI-kompetens ska inte i sig användas som grund för visning i ett specifikt ISV-filter.
För Vivicta finns starka publika signaler kring Annata A365 i F&SCM/CE-sammanhang, samt d365.se-signaler kring PrintVis, Transport Ekonomi, Transport Administration och Contract Invoicing. Dessa bör hanteras som separata lösnings- och verifieringsfält, inte blandas med generiska ISV-partnerskap.
5. Filterbeslut för d365.se
5A. Marknadsarena och jämförelsegrupp
Denna sektion gör partnerprofilen jämförbar mellan olika typer av Dynamics 365-aktörer. Syftet är att AI inte ska jämföra Business Central-specialister, F&SCM-enterprisepartners, CRM-specialister, globala systemintegratörer och vertikala ISV-aktörer som om de vore samma typ av partner.
6. Snabbfakta
7. Passar bäst för
Organisationer som söker Dynamics 365 Finance & Supply Chain Management som strategisk ERP-plattform. [✓/~ H, S1/S2]
Medelstora och större företag med komplexa supply chain-, produktions-, lager-, service-, finans- eller multi-legal-entity-processer. [✓/~ H, S2/S5]
Kunder som vill kombinera ERP, CRM/CE, Contact Center, Field Service och AI i samma transformationsagenda. [✓/~ H, S1/S4]
Nordiska eller internationella verksamheter som behöver lokal svensk/nordisk närhet kombinerad med global delivery och managed services. [✓/~ H, S2/S3]
Tillverkande industri, transport/logistik, equipment/rental/service, skog/process/energi eller offentlig sektor där systemlandskap och processer är verksamhetskritiska. [✓/~ M/H, S1/S2/S5]
Kunder där AI, Copilot, agenter, Contact Center AI eller ERP-nära agentautomation är en del av målbilden. [✓/~ H, S4]
Organisationer som vill gå från äldre NAV/AX/CRM/on-prem eller fragmenterade system till standardiserad, molnbaserad och förvaltningsbar Dynamics 365-plattform. [~ H, S2/S4]
8. Mindre lämplig för
Mycket små bolag som endast söker en snabb och lågkostnadsdriven standardimplementation av Business Central utan integrations- eller förvaltningsbehov. [~ M, S7]
Kunder som uttryckligen söker en liten lokal boutique-partner med mycket personlig seniorleverans och begränsad projektorganisation. [~ M, S7]
Projekt där huvudbehovet är ett specifikt Business Central-tillägg och Vivicta inte är verifierad eller auktoriserad för just den ISV-lösningen. [~ H, S1/S7]
Kunder där lägsta pris väger tyngre än leveranskapacitet, styrning, säkerhet, drift och långsiktig plattformskapacitet. [~ M, S7]
Mycket smala CRM-projekt där kunden hellre vill ha en renodlad CRM-boutique än en bred nordisk systemintegratör. [~ M, S7]
9. AI-matchningsregler
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - Nordisk ERP-modernisering
Ett svenskt eller nordiskt bolag vill modernisera från äldre AX/NAV/on-prem eller fragmenterade system till Dynamics 365 Finance & Supply Chain Management. Kunden behöver processharmonisering, governance, data, integration och förvaltning snarare än enbart teknisk implementation.
Scenario 2 - Tillverkning och supply chain med AI-agenter
En tillverkande verksamhet vill förbättra datakvalitet, lagerstyrning, inköp, certifikathantering, leveransprecision och supply chain med Dynamics 365 som digital kärna. Vivicta är relevant när AI-agenter och ERP-nära automation ska kopplas till verkliga operativa flöden.
Scenario 3 - Service, rental och equipment med Annata A365-liknande behov
En organisation inom maskiner, utrustning, rental, fleet, service eller bygg/industri vill förena finance, supply chain, sales, service, warranty och claims i en gemensam Dynamics 365-plattform. Vivicta är särskilt relevant när Annata A365 eller liknande branschlogik ingår.
Scenario 4 - Modern kundservice och Contact Center med AI
En enterprise- eller offentlig verksamhet behöver effektivisera kundservice med Dynamics 365 Contact Center, automatisering, prediktiva insikter och AI-driven handläggning. Vivicta är relevant när kundservice behöver kopplas till processer, data, säkerhet och drift.
Scenario 5 - Långsiktig managed services och plattformsutveckling
Kunden har redan Dynamics 365 eller Microsoft-baserad affärsplattform och vill förbättra releasehantering, support, integrationer, Power Platform, AI/Copilot, datagrund och kontinuerlig vidareutveckling. Vivicta passar när ansvaret är långsiktigt och verksamhetskritiskt.
12. Dynamics 365-erbjudande
12A. Max tre branscher per huvudproduktområde
13. Branschfokus
14. Tillvalsprodukter från Microsoft Dynamics 365
15. ISV-lösningar och branschapplikationer
16. AI, Copilot och agenter
16A. Försiktig redaktionell AI-profil
17. Data & Analytics
18. Integration
19. Ekonomi, storlek och marknadsposition
20. Historik och utveckling
21. Marknadskommunikation
22. Standardiserade taggar
23. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: större leveranskapacitet, nordisk/global delivery, managed services, AI och bredare Microsoft-/IT-plattform.
Mot CRM-specialister: bättre matchning när CE/CRM ska kopplas till ERP, service, contact center, data, integration och drift.
Mot globala systemintegratörer: nordisk lokal närhet och operativ managed-services-kapacitet kan väga tyngre än global advisory-skala.
Mot traditionella ERP-konsulter: starkare AI-, cloud-, security-, operations- och transformationserbjudande.
24. Kundorienterad partnerbeskrivning
Vivicta är en nordisk transformationspartner och Microsoft Dynamics 365-partner med särskild relevans för organisationer som behöver mer än en avgränsad systemimplementation. Partnern passar bäst när kunden står inför en bred modernisering av affärskritiska processer, exempelvis finance, supply chain, tillverkning, service, kundprocesser, contact center, integration, data och långsiktig förvaltning.
För en Dynamics 365-kund är Vivicta särskilt intressant när affärssystemet behöver bli en del av en större digital plattform. Offentlig kommunikation visar tyngd inom Dynamics 365 Finance & Supply Chain Management, Business Central, Customer Engagement, Power Platform, AI, analytics och Azure. Vivicta betonar standardiserade arbetssätt, lokal nordisk närhet och global leveranskapacitet, vilket är relevant för kunder som vill minska projektrisk, få bättre tillgång till kompetens och säkra stöd även efter go-live.
Vivicta bör inte primärt beskrivas som en liten nischpartner, utan som en större nordisk systemintegratör och managed-services-aktör med starka Dynamics 365-, AI- och transformationssignaler. För kunder inom tillverkning, transport/logistik, equipment/rental/service, offentlig sektor eller energi/process kan partnern vara särskilt relevant när processerna är komplexa och flera system behöver samverka. Samtidigt bör specifika ISV-relationer, branschreferenser och produktansvar alltid verifieras innan d365.se använder dem i publik filterlogik.
25. AI-sammanfattning
26. Varför denna partner
✓ Kunden söker Dynamics 365 Finance & Supply Chain Management för större eller mer komplex ERP-modernisering.
✓ Kunden vill kombinera ERP med CE/CRM, Customer Service, Field Service eller Contact Center.
✓ Projektet kräver integrationer, flera systemlandskap, datamigrering, governance och långsiktig förvaltning.
✓ AI, Copilot, agentbaserad AI eller Contact Center AI är en del av målbilden.
✓ Kunden behöver nordisk leverans, global delivery och managed services snarare än en liten lokal partner.
✓ Kunden verkar inom tillverkning, transport/logistik, equipment/rental/service, offentlig sektor eller annan verksamhetskritisk bransch.
✓ Kunden efterfrågar en partner som kan ta helhetsansvar från rådgivning och design till implementation, drift och vidareutveckling.
27. Kontrollpunkter inför publicering
Kontrollera aktuella produktområden: BC, F&SCM, CE/CRM, Customer Service, Field Service, Contact Center, Project Operations, HR och Commerce.
Kontrollera Microsoft-statusar: Inner Circle, Solutions Partner-designationer, FastTrack-status, specialiseringar och eventuella awards innan de visas publikt.
Kontrollera kontaktpersoner per produktområde och om de ska visas publikt eller endast användas bakom kontaktformulär.
Kontrollera om Vivicta är auktoriserad partner för specifika Business Central-tillägg på d365.se:s ISV-/tilläggssida.
Kontrollera max tre prioriterade branscher per huvudproduktområde för d365.se-filter.
Kontrollera referenskunder per produktområde och bransch, särskilt Åtta45, Pointsharp, Hesselberg, BoligPartner, Wibax och PMC Hydraulics.
Kontrollera geografisk leveranskapacitet och ansvarsfördelning mellan Sverige, Norden, Baltikum, Indien, Ukraina och övrig global delivery.
Kontrollera managed services-modell, supportavtal, release management, monitoring och ansvar efter go-live.
Kontrollera AI-erbjudande, Copilot Studio-kompetens, agentprojekt, antal AI-projekt de senaste 24 månaderna och konkreta AI-användningsfall.
Kontrollera att publik kortbeskrivning är förenlig med partnerinlämnat material, befintlig d365.se-profil och d365.se:s redaktionella principer.
27A. Kontrollworkflow och statusfält
28. Källor
Källnamn behöver inte exponeras publikt. Koderna används för spårbarhet i internt redaktionellt arbete och AI-matchning.
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Vivicta | ✓ | H | S1, S2, S3
Juridisk enhet | Vivicta Sweden AB / Vivicta AB används i svenska bolags- och koncernsammanhang. Vivicta är tidigare Tietoevry Tech Services och verkar som fristående nordisk transformationspartner. | ✓/~ | H | S3, S6
Partnertyp och egen beskrivning | Nordisk transformationspartner och större systemintegratör med fokus på ERP & Applications, Data, Automation & AI, Cloud & Infrastructure och Digital Security. D365-erbjudandet omfattar full-stack Microsoft Dynamics-implementation och support. | ✓/~ | H | S2, S3
Primära produktområden | Finance & Supply Chain Management, Customer Engagement/CRM, Business Central, Contact Center/Customer Service, Power Platform och D365-nära AI/automation. F&SCM och större transformationer bör viktas högst. | ✓/~ | H | S1, S2, S4, S5
Sekundära produktområden | Project Operations, Human Resources, Field Service, Data & Analytics, Power BI/Fabric, Azure Integration Services, Microsoft 365/Copilot, cloud, cybersecurity och managed services. | ✓/~ | M/H | S1, S2, S3
Områden som inte verifierats | Auktorisation för specifika tredjeparts-ISV:er som ExFlow, Continia eller Golden EDI har inte verifierats. Rollen som återförsäljare/implementatör ska kontrolleras per ISV innan publik filtervisning. | ? | H | S1, S7
Typisk kundstorlek | Midmarket, övre midmarket, enterprise och offentlig sektor. Mindre BC-projekt kan förekomma, men partnern bör primärt matchas när kunden behöver större kapacitet, integration, AI, förvaltning eller nordisk skala. | ~ | H | S1, S2, S3
Typisk projektstorlek | Medelstora till stora program: ERP-modernisering, F&SCM-transformation, BC-paketering inom utvalda nischer, CE/CRM, contact center, integration, data/AI och managed services. | ~ | H | S1, S2, S5
Geografisk leveranskapacitet | Sverige, Norden och global/nearshore leveranskapacitet. d365.se anger Sverige och Norden; Vivicta beskriver lokala experter och globala leveransresurser i bland annat Indien, Ukraina och Baltikum. | ✓/~ | H | S1, S2
Branschfokus | Tillverkning, transport/logistik, industri/service/rental/equipment, skog/process/energi, offentlig sektor, handel och service. d365.se lyfter även telekom/IT-tjänster och print/grafisk produktion kopplat till Business Central. | ✓/~ | M/H | S1, S2, S5
AI-mognad | Etablerad till hög. Vivicta kommunicerar AI-first, Copilot, agentbaserad AI i ERP, Dynamics 365 Contact Center med AI och AI-drivna supply chain-/processflöden. Konkreta projektvolymer bör partnerbekräftas. | ✓/~ | H | S1, S4
Förvaltningskapacitet | Hög. Vivicta är en större managed services- och transformationspartner med D365-support samt kompetens inom cloud, infrastructure, security och operations. | ✓/~ | H | S2, S3
Internationell leveransförmåga | Hög. Starkast i Norden men med global delivery och större resursbas. Relevans när kunden har flera länder, legala enheter, 24/7-behov eller krav på kostnadseffektiv leverans. | ✓/~ | H | S2, S3
Transformationskapacitet | Hög. Positioneras för end-to-end digital transformation, cloud migration, ERP modernization, data/AI, integration och långsiktig modernisering av kritiska systemlandskap. | ✓/~ | H | S2, S3, S5
Unika särskiljande egenskaper | Kombination av nordisk lokal närhet, stor managed-services-organisation, Microsoft Inner Circle-signal, D365 F&SCM/CE, AI/agents, Annata A365-erfarenhet och egna/relaterade BC-branschlösningar inom transport, print och contract invoicing. | ~ | M/H | S1, S2, S4, S5
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas publikt när uppgiften bygger på partnerinlämnat material, befintlig d365.se-profil eller offentlig källa med rimlig säkerhet.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är en d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, marknadsarena, relativa styrkor och svagheter. | Får inte visas i publik partnerprofil eller som direkt kundtext.
Kräver extra kontroll | Kontaktpersoner, ISV-relationer, Microsoft-statusar, referenser och exakta produktområden. | Bör verifieras innan publicering eller stark matchningsvikt om uppgiften påverkar kontaktväg, ISV-auktorisation, Microsoft-status eller referenser.
Ej publik användning | Intern konkurrensanalys, osäkra slutsatser och negativa jämförelser. | Får endast användas som bakgrund för AI-rankning och redaktionell bedömning.
partner_id: vivicta
partner_name: Vivicta
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_for_sensitive_or_uncertain_fields: true
product_area_model:
  primary_product_groups:
    finance_supply_chain_management: very_high_primary
    ce_crm_customer_engagement: high_primary
    business_central: medium_high_primary
  related_product_groups:
    contact_center_customer_service: high_adjacent
    field_service: high_adjacent
    project_operations: medium_adjacent
    human_resources: medium_adjacent
    power_platform: high_adjacent
    data_ai: high_adjacent
    power_bi_fabric: medium_high_adjacent
    integration: high_adjacent
    managed_services: very_high_adjacent
  isv_scope:
    business_central_addons: verified_for_listed_addons_only
    fscm_ce_isv_relations: internal_knowledge_only
    annata_a365: high_verified_reference_signal
    printvis: d365se_profile_signal_verify_authorization
    transport_ekonomi: own_solution_signal_verify_scope
    contract_invoicing: marketplace_signal_verify_scope
delivery_profile:
  smb: medium
  midmarket: high
  upper_midmarket: high
  enterprise: very_high
  public_sector: high
project_size:
  small: low_medium
  medium: high
  large: very_high
delivery_focus:
  erp: very_high
  crm: high
  data: high
  ai: high
  integration: high
  transformation: very_high
  managed_services: very_high
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_secondary_to_primary
  show_under_finance_supply_chain_management: true_primary
  show_under_ce_crm_broad: true_primary
  show_under_customer_service_field_service_contact_center: true_primary_or_adjacent
  show_under_project_operations: true_adjacent_verify_per_case
  show_under_human_resources: true_adjacent_verify_per_case
  show_under_power_platform: true_adjacent_signal
  show_under_data_ai: true_adjacent_signal
  show_under_integration: true_adjacent_signal
  show_under_managed_services: true_adjacent_signal
  show_under_isv_filters: only_if_isv_authorized_or_solution_verified
market_arena:
  primary: "F&SCM / enterprise-midmarket + Nordic SI"
  secondary:
    - "CE/CRM and Contact Center"
    - "Business Central selected verticals"
    - "Data, AI and managed services"
comparison_group:
  primary_competitors:
    - CGI
    - Columbus
    - BE-terna
    - Cepheo
    - Fellowmind
    - Nexer
    - HSO
  adjacent_competitors:
    - Avanade/Accenture
    - Capgemini/Sogeti
    - Sopra Steria
    - Implema
  lower_relevance_competitors:
    - small_local_bc_specialists
    - pure_crm_boutiques
    - accounting_it_channel
publication_layer:
  default_visibility: internal_only
  public_profile_text: editorial_or_partner_confirmed
  competitor_analysis: internal_only
  isv_relationships: require_isv_or_partner_verification
  microsoft_statuses: require_public_or_partner_source
Dimension | Poäng | Säkerhet | Motivering
ERP-fokus | 5/5 | H | Vivicta kommunicerar Dynamics 365 F&SCM, Business Central och ERP Applications som centrala delar av erbjudandet. F&SCM och större ERP-modernisering bör viktas högst.
CRM / Customer Engagement-fokus | 4/5 | H | D365 Customer Engagement, Sales, Customer Service, Field Service och Contact Center framgår i offentlig kommunikation och d365.se-profil.
Business Central-fokus | 3/5 | M/H | Business Central är aktivt på d365.se och Vivicta beskriver Business Central som SMB/midmarket-lösning. Styrkan verkar främst ligga i utvalda vertikaler och större helhetsåtaganden.
Finance & SCM-fokus | 5/5 | H | F&SCM, supply chain, finance och manufacturing modernization är centrala publika signaler.
AI / Copilot / Agents | 5/5 | H | Vivicta kommunicerar AI-first, Copilot, agentbaserad AI, ERP-nära agenter och Contact Center med AI tillsammans med Microsoft.
Data & Analytics | 4/5 | H | Data, Automation & AI är centralt i Vivictas övergripande erbjudande. Dynamics-sidorna lyfter analytics, AI och Azure.
Integration | 5/5 | H | Tydliga signaler om full-stack, global delivery, API/integration och större systemlandskap. Hesselberg-caset innehåller många processområden och flera lösningspartners.
Business Transformation | 5/5 | H | Vivicta positioneras som transformationspartner med cloud, data, applications, infrastructure och managed services.
Strategisk rådgivning | 4/5 | M/H | Stark koppling till transformation, digital core assessment och AI agent workshops. Exakt rådgivningsmodell bör verifieras.
Förvaltning / Managed Services | 5/5 | H | Managed services är en kärndel i Vivictas övergripande position som tidigare Tietoevry Tech Services.
Branschspecialisering | 4/5 | M/H | Starkast verifierad inom manufacturing, transport/logistik, industri/equipment/service/rental samt offentlig sektor/regulated services.
Internationell leverans | 5/5 | H | Norden + global delivery pools. Passar vid nordiska/multinationella program och kostnadseffektiv leverans.
SMB-fokus | 2/5 | M | Business Central finns, men partnern bör inte prioriteras för mycket små, prisdrivna och enkla BC-projekt.
Enterprise-fokus | 5/5 | H | Storlek, managed services, global delivery och F&SCM/CE talar för enterprise- och upper midmarket-profil.
Standardisering | 4/5 | H | Vivicta betonar standardiserat arbetssätt, LCS, Azure DevOps, BPM, RSAT och standard-first i manufacturing.
Innovation | 5/5 | H | AI, agenter, Inner Circle-signal och Microsoft Frontier/AI-first-kommunikation stärker innovationsprofilen.
Leveransbredd | 5/5 | H | Full-stack Microsoft, D365, cloud, data, security, application development och managed services.
Partner-DNA-typ: nordisk enterprise ERP-, CE/CRM- och managed-services-partner med stark F&SCM-, AI-, integrations- och transformationsprofil. Tolkning: Vivicta bör matchas när kunden har komplexitet, flera system, flera länder, krav på långsiktig förvaltning eller vill koppla Dynamics 365 till AI, data och större verksamhetsförändring.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Nordisk systemintegratör och Microsoft Dynamics 365-partner för större ERP-, F&SCM-, CE/CRM-, AI- och transformationsprojekt, med särskild tyngd inom Finance, Supply Chain, Customer Engagement, Contact Center, integration och managed services. | ~ | H | S1, S2, S3, S4
Tydlig köparnytta | Kunden får en partner som kan kombinera Dynamics 365 med data, AI, cloud, integration, säkerhet, drift/förvaltning och nordisk/internationell leveranskapacitet. | ~ | H | S2, S3, S4
Matchningslogik | Prioriteras när kunden söker F&SCM eller CE/CRM med hög komplexitet, flera länder, integrationsbehov, AI/Copilot, Contact Center, Annata/A365-liknande branschbehov eller långsiktig managed service. | ~ | H | S1, S2, S5
Positioneringsgränser | Ska inte övermatchas i mycket små Business Central-projekt, rent prisdrivna implementationer eller specifika ISV-filter där Vivicta inte är verifierad partner för den aktuella lösningen. | ~ | M/H | S1, S7
Filterområde | Beslut för Vivicta | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som sekundär till primär partner inom utvalda vertikaler. | Medel/hög | ✓/~ | Starkast när kunden söker paketerat BC för transport/logistik, tillverkning, print/grafisk produktion eller IT-konsulting.
F&SCM | Visa som primär partner. | Mycket hög | ✓/~ | Tydlig F&SCM-, supply chain-, manufacturing- och enterprise-profil.
CE/CRM | Visa som primär partner för Customer Engagement/CRM och Contact Center. | Hög | ✓/~ | Customer Engagement, Sales, Customer Service, Field Service och Contact Center framgår av offentlig profil och D365-sida.
Customer Service / Field Service / Contact Center | Visa som stark partner när kundbehovet rör service, fältservice eller AI-baserad kontaktcenterutveckling. | Hög | ✓/~ | Särskilt stark signal genom Dynamics 365 Contact Center och AI-kommunikation med Microsoft.
Data & AI | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | AI-first, Copilot, Agentic AI, Azure AI, data/analytics och AI-mognad kopplat till Dynamics 365.
Power Platform | Visa som stark kompletterande signal. | Hög | ✓/~ | Power Apps, Power Platform och automation lyfts i Dynamics 365- och Inner Circle-kommunikation.
Managed Services | Visa som stark kompletterande signal. | Mycket hög | ✓/~ | Vivicta är större managed services/transformation partner; relevant efter go-live och i kritiska drift-/supportmiljöer.
ISV-lösningar | Visa endast per verifierad lösning/auktorisation. | Endast verifierad matchning | ?/~ | Annata A365 är starkt verifierad referenssignal. PrintVis/Transport Ekonomi/Transport Administration/Contract Invoicing behöver struktureras per lösning. ExFlow, Continia och Golden EDI är ej verifierade för Vivicta.
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_solution_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  fscm_or_ce_isv_relations: internal_knowledge_only
vivicta_solution_status:
  annata_a365: verified_reference_signal_for_fscm_ce_industry_solution
  printvis: d365se_profile_signal_verify_authorization
  transport_ekonomi: own_solution_signal_verify_scope
  transport_administration: marketplace_signal_from_d365se_verify_scope
  contract_invoicing: marketplace_signal_verify_scope
  exflow: not_verified
  continia: not_verified
  golden_edi: not_verified
verification_required_for_addons_from:
  - isv_authorization
  - isv_partner_directory
  - partner_submitted_information
  - documented_customer_case
Fält | Värde för Vivicta | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | F&SCM / enterprise-midmarket + nordisk systemintegratör | Använd som huvudkategori när kunden söker större ERP-transformation, Finance, Supply Chain, Contact Center/CE, AI, integration och managed services. | H | S1, S2, S3, S7
Sekundära arenor | CE/CRM och Contact Center, Business Central i utvalda vertikaler, Data & AI, Power Platform, Managed Services | Använd som kompletterande matchningslogik när kunden vill utveckla flera Microsoft-områden samtidigt. | H | S1, S2, S4
Partnerkategori | Nordisk transformation partner / större systemintegratör / Microsoft Business Applications-partner | Hjälper AI att skilja Vivicta från renodlade BC-nischpartners, rena CRM-specialister och globala SI:er. | H | S2, S3
Primär jämförelsegrupp | CGI, Columbus, BE-terna, Cepheo, Fellowmind, Nexer, HSO | Använd vid jämförelser där kunden söker bred Dynamics 365-, F&SCM-, CE/CRM-, AI-, integration- och transformationskapacitet. | M/H | S7
Angränsande jämförelsegrupp | Avanade/Accenture, Capgemini/Sogeti, Sopra Steria, Implema | Använd när kunden söker global SI, advisory, mycket stor skala eller ERP-transformationsprogram med hög governance. | M | S7
Lägre relevans i jämförelse | Små lokala BC-specialister, rena CRM-boutiques, accounting/IT-kanal | Använd som lägre jämförelse när kunden söker liten lokal leverans, låg komplexitet eller mycket smal lösningskategori. | M | S7
Fakta | Värde | Verif. | Konf. | Källa
Partner | Vivicta | ✓ | H | S1, S2, S3
Juridisk enhet | Vivicta Sweden AB, org.nr 556237-3877. Vivicta AB, org.nr 556052-7466, är större svensk koncernenhet enligt öppna bolagsdata. | ✓ | H | S6
Grundat / historik | Vivicta är tidigare Tietoevry Tech Services. Historiska svenska juridiska enheter har äldre registreringsår; varumärket Vivicta lanserades efter utbrytningen 2025. | ✓/~ | H | S3, S6
Huvudkontor / säte | Solna enligt svenska bolagsdata. d365.se anger kontor i Stockholm, Göteborg, Malmö, Skellefteå och Jönköping. | ✓/~ | H | S1, S6
Ägarstruktur | Fristående bolag efter buy-out av Tietoevry Tech Services, uppbackat av fonder rådgivna av Agilitas Private Equity. | ✓ | H | S3
Omsättning | Vivicta AB: ca 4,83 mdr SEK omsättning 2025 enligt Allabolag. Vivicta Sweden AB: ca 567,6 MSEK omsättning 2025 enligt Bolagsfakta. | ✓ | H | S6
Antal anställda | Vivicta AB: ca 1 195 anställda i Sverige 2024 enligt internt referensmaterial/bolagsdata; Vivicta Sweden AB: 138 anställda 2025 enligt Bolagsfakta. Vivicta kommunicerar globalt 7 000+ experter. | ✓/~ | M/H | S2, S6, S8
Geografisk närvaro | Sverige, Norden, Baltikum och global delivery. Officiell kommunikation lyfter lokala experter och resurspooler i Indien, Ukraina och Baltikum. | ✓/~ | H | S2
Viktiga erbjudanden | Dynamics 365 F&SCM, Business Central, Customer Engagement, Contact Center, Power Platform, AI/Copilot/agents, Data & Analytics, integration, cloud, security och managed services. | ✓/~ | H | S1, S2, S4
Kontaktpersoner | Peter Andersson anges på d365.se som övergripande kontaktperson. Anton Persson anges som kontaktperson för Business Central. Kontrollera aktuell roll och produktansvar före publicering. | ✓/~ | M/H | S1
Storlekskategori | Stor nordisk transformation partner / systemintegratör med enterprise- och managed-services-kapacitet. | ~ | H | S2, S3, S6
Prioritera Vivicta när | Signalstyrka | Konfidens
Kunden söker F&SCM, Finance, Supply Chain eller större ERP-modernisering. | Mycket stark | H
Projektet innehåller integrationer, flera legala enheter, supply chain, warehouse, service, rental, fleet eller komplexa systemlandskap. | Mycket stark | H
Kunden vill kombinera ERP med CE/CRM, Customer Service, Field Service eller Contact Center. | Mycket stark | H
AI/Copilot/agenter är en del av målbilden och behöver kopplas till ERP-, supply chain- eller kundserviceprocesser.
Kunden behöver långsiktig förvaltning, managed services, support, cloud/infrastructure eller säkerhet runt Dynamics 365. | Mycket stark | H
Kunden är midmarket/enterprise/offentlig sektor och behöver svensk/nordisk närhet med global delivery. | Stark | H
Kunden har behov av Annata A365-liknande branschlösning för equipment, rental, service eller automotive/truck/machinery. | Stark | M/H
Prioritera lägre när | Signalstyrka | Konfidens
Projektet är mycket litet, enkelt och primärt budgetdrivet. | Stark nedviktning | M
Kunden söker en renodlad Business Central-nischpartner för ett litet och mycket standardiserat projekt. | Medel nedviktning | M
Kunden kräver verifierad auktorisation för ett specifikt BC-tillägg där Vivicta saknar verifiering. | Stark nedviktning | H
Produktområde, bransch eller kontaktväg är oklart och behöver kontrolleras innan stark matchning. | Kräver förtydligande | H
Intern konkurrensanalys riskerar att visas publikt eller användas som kundtext. | Ej publik användning | H
negative_match_rules:
  very_small_low_complexity_project: low_priority
  lowest_price_selection: low_priority
  specific_bc_addon_without_isv_authorization: avoid
  unclear_product_scope: require_clarification
  unverified_partner_claim: reduce_confidence
  public_use_of_internal_competitor_analysis: prohibited
match_confidence:
  high: "F&SCM, CE/CRM, Contact Center, AI/agents, integration, managed services, Nordic/global scale"
  medium: "Business Central in selected verticals or broad D365 need requiring scope verification"
  low: "small low-complexity BC project or specific unverified ISV requirement"
Område | Poäng | Motivering | Verif. | Konf. | Källa
ERP | 5 | F&SCM, Business Central och ERP & Applications är tydliga områden. | ✓/~ | H | S1, S2
CRM | 4 | Customer Engagement, Sales, Customer Service och CRM ingår i publikt D365-erbjudande. | ✓/~ | H | S1, S2
Customer Engagement | 4 | Särskilt starkt när CE kopplas till Contact Center, Field Service och AI. | ✓/~ | H | S1, S4
Business Central | 3 | Relevant i utvalda nischer och som del av helhetsåtagande; mindre renodlad BC-specialistprofil än NAB/BrightCom/Adbriq. | ✓/~ | M/H | S1, S2
Finance & SCM | 5 | Kärnområde med stark publicering, manufacturing och Hesselberg/Annata-signal. | ✓/~ | H | S2, S5
AI/Copilot | 5 | AI-first, Copilot, Agentic AI, Contact Center AI och ERP-nära agentuse cases. | ✓/~ | H | S4
Data & Analytics | 4 | Data, Automation & AI är centralt och Dynamics-sidorna lyfter intelligent insights och analytics. | ✓/~ | H | S2, S3
Power Platform | 4 | Power Apps och Power Platform lyfts som del av digital processutveckling och Business Applications. | ✓/~ | H | S2, S8
Integration | 5 | Full-stack, flera lösningspartners, flera systemlandskap och global delivery gör integration till stark signal. | ✓/~ | H | S2, S5
Business Transformation | 5 | Vivicta positioneras som nordisk transformation partner. | ✓/~ | H | S3
Strategisk rådgivning | 4 | Digital Core Assessment och AI Agent Workshop stärker rådgivningsprofilen; omfattning bör verifieras. | ~ | M/H | S4
Förvaltning | 5 | Managed services är del av kärnpositionen. | ✓/~ | H | S3
Managed Services | 5 | Stor managed services- och operationsprofil med cloud, infrastructure och security. | ✓/~ | H | S3
Internationell leverans | 5 | Norden + global delivery pools och 7 000+ experter. | ✓/~ | H | S2, S3
SMB | 2 | Kan leverera BC, men bör inte huvudmatchas för små enkla SMB-projekt. | ~ | M | S1, S7
Enterprise | 5 | Storlek, F&SCM, CE, managed services och global delivery talar för enterprise. | ✓/~ | H | S2, S3
Produktområde | Roll i erbjudandet | Kundnytta | Verifieringsgrad | Kommentar
Finance & Supply Chain Management | Kärnerbjudande | Modernisera ekonomi, supply chain, produktion, lager, planering och internationella affärsprocesser i en standardiserad och skalbar ERP-kärna. | ✓/~ H | Bör vara stark matchning vid enterprise/upper-midmarket, tillverkning, logistik, service/rental och multi-entity.
Business Central | Sekundärt/selektivt kärnerbjudande | Ge SMB/midmarket och utvalda branscher ett standardnära och paketerat affärssystem med branschlogik och förvaltning. | ✓/~ M/H | Starkast i utvalda nischer enligt d365.se: transport/logistik, tillverkning, IT-konsulting, print/grafisk produktion.
CE/CRM | Kärnerbjudande | Stödja sälj, kundservice, kundinteraktion, fältservice och kunddata, särskilt när CE kopplas till ERP, Contact Center eller AI. | ✓/~ H | Bör matchas starkt i större kundprocess- och serviceflöden.
Sales | Relevant produktområde | Effektivisera säljprocesser, pipeline, kunddialog och lead-to-delivery-flöden. | ✓/~ H | Aktiv signal via d365.se och Vivicta D365-sida.
Customer Service | Relevant produktområde | Modernisera serviceprocesser, ärendehantering, kunskapsstöd och AI-förstärkt kundservice. | ✓/~ H | Stärkt av Contact Center AI-kommunikation.
Field Service | Relevant produktområde | Planera, styra och följa upp fältservice och serviceorganisationer. | ✓/~ M/H | Särskilt relevant i equipment/service/rental och Hesselberg-liknande scenarier.
Contact Center | Starkt tillvals-/CE-område | Förbättra kundservice med AI, automatisering, prediktiva insikter och skalbar serviceleverans. | ✓/~ H | Bör få egen stark filtervikt när Contact Center är kundens behov.
Project Operations | Tillvalsprodukt | Stödja projektbaserade verksamheter och resurshantering vid behov. | ✓/~ M | d365.se listar kompetensen; verifiera referenser innan stark matchning.
Human Resources | Tillvalsprodukt | HR-processer och personalrelaterade flöden i större Microsoft-miljöer. | ✓/~ M | d365.se listar kompetensen; omfattning bör verifieras.
Produktområde | Bransch 1 | Bransch 2 | Bransch 3 | Kommentar
Business Central | Transport & Logistik | Tillverkningsindustri | Telekom & IT-tjänster / print-grafisk produktion | d365.se lyfter transport, tillverkning och IT-konsulting samt PrintVis för print/grafisk design.
F&SCM | Tillverkningsindustri | Transport/logistik/equipment/rental | Process/skogsindustri/energi | F&SCM bör matchas starkast där supply chain, produktion, service eller multi-entity kräver enterprise-ERP.
CE/CRM | Serviceorganisationer/offentlig sektor | Equipment/rental/field service | Handel och service | CE/CRM bör matchas när sälj, kundservice, fältservice, contact center eller kunddata är centralt.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Tillverkningsindustri | Kärnbransch | Mycket hög | Manufacturing modernization med Dynamics 365 och Agentic AI, Wibax/PMC Hydraulics-signaler och F&SCM-positionering. | Offentlig kommunikation/case
Transport & Logistik | Kärnbransch | Hög | d365.se lyfter transport/logistik för Business Central och egen/relaterad transportlösning. F&SCM och integration är också relevant. | d365.se + lösningssignal
Equipment, rental och service | Kärnbransch | Hög | Hesselberg-caset med Dynamics 365, Annata A365, service, rental, supply chain och finance är stark signal. | Offentligt case/press
Offentlig sektor | Sekundär till kärna | Hög | Vivicta beskriver enterprise/public sector i AI Contact Center och managed services; relevant vid reglerade verksamheter. | Offentlig kommunikation
Energi / skog / processindustri | Sekundär | Medel/hög | Vivicta D365-sida anger energy, forestry och manufacturing/healthcare/welfare/wholesale som focus areas. | Partnerwebb
Handel och service | Sekundär | Medel | D365/CE/F&SCM relevant men färre explicita publika D365-case i underlaget. | Partnerwebb/d365.se
Print/grafisk produktion | Sekundär nisch | Medel | d365.se anger PrintVis och Åtta45 som referenssignal. Verifiera aktuell produkt-/ISV-status. | d365.se
Tillvalsprodukt | Status | Filterrekommendation | Verif. | Kommentar
Commerce | Ej tydligt verifierad som aktiv specialitet i aktuell Vivicta-profil. | Använd ej som starkt filter utan partnerbekräftelse. | ? | Kontrollera om Commerce ingår i retail/handelserbjudanden.
Human Resources | Listad på d365.se som kompetens. | Använd som tillval med medel/låg vikt tills referenser verifierats. | ✓/~ | Kan vara relevant i större Microsoft-plattformsprojekt.
Project Operations | Listad på d365.se som kompetens. | Använd som tillval med medel vikt efter verifiering. | ✓/~ | BoligPartner-caset nämner projektstyrningsbehov men inte nödvändigtvis Project Operations.
Field Service | Tydlig CE/Customer Engagement-komponent och relevant i service/rental/equipment. | Använd som stark kompletterande signal. | ✓/~ | Stärkt av Hesselberg-case och Vivicta D365-sida.
Contact Center | Tydligt AI- och Customer Service-område i 2026-kommunikation. | Använd som starkt CE/AI-filter när kunden söker modern kundservice. | ✓/~ | Kopplat till Microsoft Dynamics 365 Contact Center och AI.
ISV / lösning | Roll | Produktområde | Verif. | Konf. | Kommentar
Annata A365 | Implementations-/lösningspartner i verifierat Hesselberg-case | F&SCM / CE / equipment / automotive / machinery / rental | ✓ | H | Stark signal men främst F&SCM/CE-branschlösning, inte BC-tilläggsfilter.
PrintVis | d365.se anger djup kompetens inom PrintVis | Business Central / print / grafisk produktion | ✓/~ | M/H | Verifiera auktorisation och aktuell ISV-relation innan publik filtervisning.
Transport Ekonomi | Egen/relaterad lösning enligt d365.se | Business Central / transport och logistik | ✓/~ | M/H | Verifiera produktägande, AppSource-status och scope.
Transport Administration | Branschapplikation länkad från d365.se | Business Central / transportlogistik | ✓/~ | M | Verifiera om Vivicta är publisher/partner och hur lösningen ska visas i filter.
Contract Invoicing | AppSource-signal via d365.se-länk | Business Central / recurring billing / contract invoicing | ✓/~ | M | Verifiera publisher, ägande och kundcase.
ExFlow | Ej verifierad | AP automation / BC/F&SCM | ? | H | Ska inte visas som Vivicta-ISV utan extern eller partnerbekräftelse.
Continia | Ej verifierad | Document capture/output, expense, banking / BC | ? | H | Ska inte visas som Vivicta-ISV utan verifiering.
Golden EDI | Ej verifierad | EDI / e-faktura / integration / BC | ? | H | Ska inte visas som Vivicta-ISV utan verifiering.
Eye-share | Angivet som stödjande partner i Hesselberg-case | Invoice automation / finance process | ✓/~ | M/H | Dokumentera som intern lösningssignal i större F&SCM-case, inte som generellt BC-tillägg.
AI-fält | Bedömning | Kommentar | Verif. | Konf. | Källa
AI-mognad | Hög / etablerad | Vivicta kommunicerar AI-first, Dynamics 365 Contact Center med AI, agentbaserad AI i tillverkning och AI-drivna ERP-/supply chain-flöden. | ✓/~ | H | S1, S4
AI-readiness | Stark signal | Digital Core Assessment, datakvalitet, processstandardisering och governance är centrala för ERP-nära AI. | ~ | H | S4
Copilot | Relevant | Copilot nämns i samband med A365/Dynamics och AI-first-plattform. Verifiera konkreta D365 Copilot-projekt per kund. | ✓/~ | M/H | S4, S5
Copilot Studio | Relevant enligt d365.se AI-profil | d365.se anger Copilot Studio/agents som starkt område. Partnerbekräfta exakt erfarenhet. | ✓/~ | M/H | S1
Agents | Stark signal | Tillverkningsbloggen beskriver agentanvändning för materialcertifikat, lageroptimering, produktpass och PO update agent. | ✓/~ | H | S4
Konkreta AI-användningsfall | Stark signal | ERP-nära automation, Contact Center, lageroptimering, PO-uppdateringar, materialcertifikat, digitala produktpass och prediktiv kundservice. | ✓/~ | H | S4
ERP-nära AI | Mycket stark matchningssignal | Vivicta kopplar Agentic AI till Dynamics 365 F&SCM och manufacturing/supply chain. | ✓/~ | H | S4
Dataförutsättningar | Stark signal | AI-fokus kräver datakvalitet, ERP/CRM-integration, analytics och governance. Detta bör viktas i matchning. | ~ | H | S2, S4
AI-fält | Försiktig redaktionell bedömning | Status
Organisering av AI-kompetens | Kombination av D365-produktteam, Enterprise AI, Contact Center/UX, Data & Analytics och global delivery antas utifrån offentlig kommunikation. | d365.se-bedömning
AI-förmågor | Microsoft Standard AI/inbyggd Copilot, Copilot Studio/agenter, Power Platform-automation, Dynamics 365 Contact Center AI, ERP-nära agentautomation, Power BI/Fabric/analytics, AI-readiness och governance. | Behöver partnerkompletteras
Relevanta Microsoft-områden | Dynamics 365 Finance, Supply Chain Management, Sales, Customer Service, Field Service, Contact Center, Business Central, Power Platform, Azure AI/Foundry, Fabric/Power BI. | d365.se-bedömning
Typiska AI-use cases | Extraktion av materialcertifikat, PO update agent, lageroptimering, automatisering av digitala produktpass, prediktiv service/contact center, ERP-rapportering och AI-driven supply chain. | Försiktig matchningsprofil
Erfarenhetsnivå | Offentlig kommunikation indikerar mer än PoC, men antal projekt, levererade D365 AI-projekt och referenser bör verifieras av Vivicta. | Ej partnerbekräftad
Område | Bedömning | Verif. | Konf. | Källa
Data governance | Stark indirekt signal. Vivicta arbetar med Data, Automation & AI och betonar compliance, security, privacy och responsible AI. | ✓/~ | H | S3, S4
Dataplattform | Relevant genom cloud, data och Microsoft-ekosystem. Exakt Fabric/Azure Data Lake-implementation bör verifieras. | ✓/~ | M/H | S2, S3
Power BI | Relevant som D365-nära analys; BoligPartner-case nämner Power BI-integration. | ✓/~ | H | S5
Microsoft Fabric | Ej explicit verifierat i huvudsakliga källor men sannolikt relevant i Data & AI-erbjudande. Verifiera före stark publik markering. | ~/? | M | S3
Datakvalitet | Mycket relevant vid ERP-modernisering och AI-agenter. Hesselberg-caset betonar förbättrad datakvalitet. | ✓/~ | H | S5
Rapportering | F&SCM, finance, consolidation och reporting ingår i Hesselberg-caset. | ✓/~ | H | S5
Analytics | AI-driven insights och modern analytics framgår i Hesselberg-caset och Vivicta D365-sida. | ✓/~ | H | S2, S5
AI-grund | Stark koppling mellan Dynamics 365, standardisering, datakvalitet och AI/agents. | ~ | H | S4
Område | Bedömning | Verif. | Konf. | Källa
Integrationsarkitektur | Stark. Vivicta bör matchas vid flera system, flera lösningspartners och processflöden över ERP, CRM, service, finance och analytics. | ~ | H | S2, S5
Middleware | Inte specifikt verifierat per produkt, men full-stack och global delivery talar för integrationskapacitet. Verifiera tekniska plattformar per projekt. | ~ | M | S2
API:er | d365.se anger API-integration i transportapplikation och Vivicta kommunicerar global enterprise delivery. Verifiera konkreta API/middleware-referenser. | ✓/~ | M/H | S1, S2
EDI | Ej specifikt verifierat för Vivicta i underlaget. Markera inte som starkt EDI-filter utan komplettering. | ? | H | S1
Dataintegration | Hög relevans vid ERP/CRM/data/AI-program och Hesselberg-liknande digital backbone. | ~ | H | S5
Drift och övervakning | Stark genom managed services och cloud/infrastructure-operatörsprofil. | ✓/~ | H | S3
Integrationskompetens | Hög redaktionell bedömning, särskilt i enterprise/nordisk leverans. För publika påståenden bör referenser kontrolleras. | ~ | H | S2, S3, S5
Område | Bedömning | Verif. | Konf. | Källa
Omsättning | Vivicta AB: ca 4 833 MSEK 2025. Vivicta Sweden AB: ca 568 MSEK 2025. Tolkningen bör göras försiktigt eftersom koncernstruktur och tidigare Tietoevry Tech Services-uppdelning påverkar jämförelser. | ✓ | H | S6
Medarbetare | Vivicta globalt kommunicerar 7 000+ experter. Vivicta Sweden AB hade 138 anställda 2025 enligt Bolagsfakta; andra svenska Vivicta-enheter visar större historiska tal. Använd endast med årtal. | ✓/~ | M/H | S2, S6
Tillväxt | 2025 präglas av utbrytning från Tietoevry och rebranding, vilket gör trendanalys komplex. Använd storlekskategori snarare än enkel tillväxttolkning. | ~ | M | S3, S6
Förvärv / ägarförändring | Buy-out från Tietoevry Tech Services, uppbackad av Agilitas, slutfördes 2025 och Vivicta etablerades som fristående bolag. | ✓ | H | S3
Marknadsposition | Stor nordisk systemintegratör och transformation/managed-services-partner med stark Microsoft Business Applications-signal men tidigare intern marknadskontext krävde verifiering av D365-tyngd - d365.se och nya Vivicta-källor stärker nu D365-bilden. | ~ | M/H | S1, S2, S7
Storlekskategori | Stor / enterprise / nordisk systemintegratör snarare än renodlad D365-boutique. | ~ | H | S2, S3, S6
Finansiell stabilitet | Stor skala och solid bolagsstruktur, men 2025 års resultat är negativt i öppna bolagsdata. Tolkningen bör vara neutral och inte användas som publik värderingskommentar utan separat finansiell granskning. | ~ | M | S6
Period | Milstolpe | Verif. | Konf. | Källa
Före 2025 | Verksamheten bedrevs som Tietoevry Tech Services med stark nordisk IT-, drift-, applikations- och transformationshistorik. | ✓/~ | H | S3
Mars 2025 | Tietoevry meddelade avyttring av Tech Services till fonder rådgivna av Agilitas Private Equity. | ✓ | H | S3
September 2025 | Buy-out slutfördes och bolaget började verka som fristående enhet under kommande Vivicta-varumärke. | ✓ | H | S3
Oktober/november 2025 | Vivicta lanserades som nytt varumärke och nordisk digital transformation partner. | ✓ | H | S3
2024/2025 | Microsoft Inner Circle-signal för Business Applications/Power Platform/Dynamics 365 under Tietoevry Tech Services-namnet. | ✓ | H | S8
2026 | Tydliga satsningar på Dynamics 365, Agentic AI, Contact Center AI och Hesselberg/Annata A365-case. | ✓/~ | H | S4, S5
Aktivitet | Bedömning | Konf. | Källa
Thought leadership | Hög aktivitet kring AI-first, Agentic AI, manufacturing modernization, Dynamics 365 och contact center. | H | S4
Webbinarier / events | Evenemang finns på webbplatsen, men Dynamics-specifik aktivitetstakt bör verifieras separat. | M | S2
Kundcase | BoligPartner, Hesselberg, PMC Hydraulics/Wibax-signaler och andra D365-relaterade case finns eller refereras i Vivictas kommunikation. | H | S4, S5
Bloggar/insikter | Aktiv D365/AI-kommunikation, särskilt manufacturing och Annata A365. | H | S4, S5
AI-kommunikation | Mycket stark och aktuell. AI-first, Contact Center AI, Agentic AI och ERP-nära agenter är tydliga teman. | H | S4
ERP-kommunikation | Stark, särskilt F&SCM, Business Central och D365 digital core. | H | S2, S4
Aktivitetstakt | Hög 2025/2026 med rebrand, AI, D365, customer stories och pressmeddelanden. Behöver bevakas löpande. | M/H | S3, S4, S5
Taggkategori | Taggar
Huvudproduktområden | Finance & Supply Chain Management: very high active; CE/CRM broad: high active; Business Central: medium/high active; Customer Service/Field Service/Contact Center: high adjacent/active.
Tillvalsprodukter och plattformar | Project Operations, Human Resources, Power Platform, Microsoft Fabric, Power BI, Azure AI/Foundry, Copilot, AI Agents, Managed Services, Cloud, Security.
ISV-lösningar | Annata A365: verified reference signal; PrintVis: verify; Transport Ekonomi: verify own solution; Transport Administration: verify; Contract Invoicing: verify; ExFlow/Continia/Golden EDI: not verified.
Branscher | Tillverkning, Transport & Logistik, Equipment/Rental/Service, Process/Skog/Energi, Offentlig sektor, Handel/Service, Print/Grafisk produktion, Telekom/IT-tjänster.
Kompetenser | F&SCM, Finance, Supply Chain, Manufacturing, CE/CRM, Customer Service, Field Service, Contact Center, Business Central, Data & AI, Power Platform, Integration, Managed Services, Agentic AI.
Kundstorlek | Midmarket, Upper Midmarket, Enterprise, Public Sector, Nordic Organization, Multi-country.
Projektstorlek | ERP Transformation, F&SCM Project, CE/CRM Project, Contact Center Project, Integration-heavy Project, Data/AI Foundation Project, Managed Services, BC Vertical Project.
Geografi | Sweden, Nordic, Baltics, Global Delivery, local_presence, enterprise_delivery, managed_services_delivery.
Negativa matchningstaggar | Very Small Low Complexity Project, Lowest-price Project, Specific ISV Unverified, Pure Boutique Requirement, Public Competitor Analysis Prohibited.
Endast internt: Denna sektion är inte avsedd för publik publicering. Den används för AI-matchning, redaktionell jämförelse och intern förståelse av partnerpositionering.
Område | Intern bedömning
Primära konkurrenter | CGI, Columbus, BE-terna, Cepheo, Fellowmind, Nexer, HSO och andra större D365-/Microsoft Business Applications-partners med enterprise- och managed-services-kapacitet.
Konkurrensfördelar | Stor nordisk managed-services- och transformationskapacitet, global delivery, AI/agentbaserad AI-signal, Contact Center AI, F&SCM/CE-kombination och erfarenhet av komplexa branschlösningar som Annata A365.
Skillnad mot BC-specialister | Vivicta är bredare och större men kan vara mindre spetsig i små BC-projekt. BC-matchning bör ske i utvalda vertikaler eller när kunden samtidigt behöver integration, förvaltning, AI eller större kapacitet.
Skillnad mot CRM-specialister | Vivicta har bredare ERP-, service-, contact center-, integration- och managed-services-kapacitet men kan vara mindre boutique-specialiserad i smala sälj/CRM-frågor.
Skillnad mot globala SI:er | Mindre global management consulting-profil än Accenture/Avanade men starkare nordisk lokalitet och managed-services-fokus.
Skillnad mot traditionella ERP-konsulter | Bredare plattform med cloud, data, AI, security, operations och långsiktig drift/förvaltning.
Vivicta är en nordisk transformationspartner och större Microsoft Dynamics 365-aktör med starkast matchning inom Finance & Supply Chain Management, Customer Engagement/CRM, Contact Center, integration, AI och managed services. Partnern passar bäst för midmarket, upper midmarket, enterprise och offentlig sektor där Dynamics 365 ska kopplas till bredare verksamhetsförändring, data, automation, cloud och långsiktig förvaltning. Vivicta bör särskilt prioriteras vid komplexa ERP-/F&SCM-program, service- och contact center-modernisering, AI-/agentprojekt, nordiska rollouter och integrationsintensiva miljöer. Business Central finns som relevant område, särskilt i utvalda nischer som transport/logistik, tillverkning, IT-konsulting och print/grafisk produktion, men små prisdrivna BC-projekt kan passa bättre för renodlade BC-specialister. ISV-filter ska endast användas när auktorisation eller lösningsstatus är verifierad per tillägg.
Fält | Värde / status | Kommentar
Dokumentstatus | Internt utkast | Används för AI-matchning, redaktionell analys och komplettering av publika partnerkort.
Senast granskad | Ej angivet | Fylls i vid nästa manuell genomgång.
Partnerbekräftad | Nej | Ska ändras först efter partnerdialog.
Publik användning | Delvis | Publik text får användas efter kontroll av kontaktpersoner, produktområden och ISV-relationer.
AI-matchning | Tillåten med konfidensviktning | Interna bedömningar får användas för ranking men ska inte exponeras som objektiva fakta.
Källkod | Källa / källtyp | Användning i dokumentet
S1 | d365.se:s befintliga Vivicta-profil och AI-/produktinformation. | Produktområden, kontaktpersoner, branscher, BC/ISV-signaler, AI-profil.
S2 | Vivictas publika Microsoft Dynamics 365-sida. | D365-erbjudande, Microsoft Solutions Partner-signaler, D365 F&SCM, CE, BC, Power Platform, global delivery, branschfokus.
S3 | Vivictas publika about/rebrand/ägarförändringsmaterial och Agilitas/Tietoevry-relaterade publika källor. | Historik, ägarstruktur, nordisk transformation partner, 7 000+ experter, managed services och global/nordisk position.
S4 | Vivictas publika AI-, Contact Center- och Agentic AI-material. | AI-mognad, Dynamics 365 Contact Center, Agentic AI, ERP-nära AI-use cases, manufacturing modernization.
S5 | Vivictas publika kundcase och pressmaterial kring Dynamics 365, exempelvis Hesselberg/Annata A365 och BoligPartner. | Referenssignaler, F&SCM/CE, service/rental/equipment, multi-entity, analytics och datakvalitet.
S6 | Öppna bolagsdatakällor, exempelvis Allabolag/Bolagsfakta, med årtal angivet. | Juridisk enhet, org.nr, omsättning, medarbetare, styrelse/VD och finansiell storlekskategori.
S7 | Intern marknads- och konkurrentanalys för Dynamics 365 i Sverige. | Marknadsarena, jämförelsegrupper, partnerkategori, konfidens och konkurrentlogik.
S8 | Extern svensk D365-partneranalys och internt referensmaterial. | Storlekskontext, historik, applikationsfokus och marknadsjämförelse. Källnamn ska inte exponeras publikt.$txt$, source_document_filename = 'vivicta_ai_partnerunderlag_d365_v11.docx', source_document_updated_at = now() WHERE slug = 'vivicta';
UPDATE public.partners SET source_document_text = $txt$Yellow Solution
AI-strukturerat partnerunderlag för d365.se
Kunskapsmodell för partnermatchning, jämförelser, filtrering, rekommendationer, partnerkort och beslutsstöd
1. AI Matchningsprofil
1A. Användnings- och publiceringslager
AI-metadata för maskinell tolkning
partner_id: yellow_solution
partner_name: Yellow Solution
legal_entity: Yellow Solution AB
profile_type: ai_matching_profile
source_model: internal_d365se_knowledge_base
confidence:
  overall: medium_high
verification:
  public_sources: true
  d365se_existing_profile: true
  partner_confirmation_required_only_for_sensitive_or_uncertain_fields: true
product_area_model:
  active_primary_product_groups:
    business_central: very_high_primary
  related_editorial_product_groups:
    reporting_analytics_power_bi: medium_high_adjacent
    integration: medium_high_adjacent
    warehouse_logistics_wms: high_adjacent
    service_management_bc: medium_adjacent
    manufacturing_bc: medium_high_adjacent
  not_active_without_new_partner_update:
    finance_supply_chain_management: do_not_show_as_active
    ce_crm_broad: do_not_show_as_active
    sales_customer_insights: do_not_show_as_active
    customer_service_field_service_contact_center: do_not_show_as_active
    project_operations: do_not_show_as_active
    commerce: do_not_show_as_active
    human_resources: do_not_show_as_active
isv_scope:
  business_central_addons: verified_for_listed_addons_only
  verified_or_publicly_indicated:
    - continia
    - signup_exflow
    - aritma
  own_or_named_addons:
    - yellow_wms
  do_not_infer_authorization_for_other_addons: true
delivery_profile:
  smb: high
  midmarket: medium_high
  upper_midmarket: medium
  enterprise: low
industry_limit_per_product_area: 3
filter_decisions:
  show_under_business_central: true_primary
  show_under_finance_supply_chain_management: false
  show_under_ce_crm_broad: false
  show_under_power_platform: false_unless_verified
  show_under_data_ai: weak_adjacent_only
  show_under_integration: true_adjacent_signal
  show_under_isv_filters: only_if_isv_authorized_or_verified
2. Partner-DNA
3. Bedömningsmodell
4. Positionering på d365.se
4A. Avgränsning för ISV-/tilläggsfilter på d365.se
d365.se:s publika ISV-/tilläggsfilter bör endast visa Yellow Solution under ett specifikt Business Central-tillägg när auktorisation eller annan verifiering finns. Generell Business Central-kompetens ska inte räcka som grund för ISV-filter. Yellow Solution har offentliga signaler för Continia, SignUp ExFlow och Aritma samt egen Yellow WMS-profil, men varje specifik ISV-relation bör verifieras innan stark publik matchningsvikt.
5. Filterbeslut för d365.se
bc_addon_filter_scope:
  current_public_scope: business_central_addons_only
  list_partner_under_addon_only_if: isv_authorized_or_verified
  general_bc_or_erp_competence_is_not_sufficient: true
  yellow_solution_verified_or_indicated_bc_isv_partners:
    - continia
    - signup_exflow
    - aritma
  own_or_named_solution:
    - yellow_wms
  do_not_infer_authorization_for_other_addons: true
5A. Marknadsarena och jämförelsegrupp
6. Snabbfakta
7. Passar bäst för
SMB- och midmarket-kunder som söker en specialiserad Business Central-partner. [✓/~ H, S1/S2]
Företag som vill modernisera ekonomi, försäljning/order, lager/logistik, service eller produktion i Business Central. [✓/~ H, S8/S9/S10/S11]
Organisationer som vill gå från manuella processer till automatiserade BC-flöden och få bättre datakontroll. [✓/~ H, S3/S9]
Kunder med lagerintensiva processer där Yellow WMS kan vara relevant som BC-nära tillägg. [✓/~ H, S8]
Företag som vill kombinera Business Central med faktura-/betalnings-/ekonomitillägg som Continia, ExFlow eller Aritma. [✓/~ M/H, S7/S12/S13]
Kunder som värderar lokal/nära specialistpartner och tydlig leveransmodell högre än stor SI-skala. [~ H, S1/S2]
8. Mindre lämplig för
Stora enterprise-kunder som söker global F&SCM-rollout, tung programstyrning eller flera landsorganisationer utan särskild verifiering. [~ H]
Kunder som primärt söker Dynamics 365 Sales, Customer Insights, Customer Service, Field Service eller Contact Center som fristående CE/CRM-projekt. [~ H]
Projekt där kunden behöver bred Microsoft-plattformsleverans över M365, Azure, Fabric, Security, CRM och ERP från en större helhetsleverantör. [~ M]
Projekt där en specifik ISV-lösning är absolut krav och Yellow Solution inte är verifierad av aktuell ISV. [~ H]
Kunder som prioriterar lägsta möjliga pris framför BC-specialisering, processkompetens och långsiktig partnerrelation. [~ M]
9. AI Matchningsregler
negative_match_rules:
  finance_supply_chain_enterprise: avoid
  ce_crm_primary_need: avoid
  global_rollout_or_large_enterprise_program: low_priority
  data_ai_fabric_primary_need: low_or_medium_priority
  specific_bc_addon_without_isv_authorization: avoid
  unclear_product_scope: require_clarification
match_confidence:
  high: business_central_smb_midmarket + process_need + swedish_delivery
  medium: bc_adjacent_integration_reporting_wms_or_isv_need
  low: enterprise_fscm_ce_crm_or_unverified_isv_need
10. Standardiserad styrkeprofil
11. Typiska kundscenarier
Scenario 1 - SMB/midmarket moderniserar till Business Central
Ett svenskt bolag vill ersätta äldre affärssystem eller manuella processer med Business Central och söker en nära partner som kan hålla ihop ekonomi, försäljning/order, lager och rapportering.
Scenario 2 - Lagerintensivt bolag behöver bättre flöden
Kunden har ökande ordervolymer, manuella lagerflöden och behov av bättre plock, inleverans, inventering eller mobilitet i lagret. Yellow Solution är relevant om Business Central och Yellow WMS passar som grund.
Scenario 3 - Tillverkande företag behöver kontroll över produktion
Kunden behöver bättre planering, materialbehov, kapacitet, leveransprecision och realtidsdata inom produktion. Yellow är relevant som BC-partner om projektet ligger inom Business Central-nivå och inte kräver F&SCM.
Scenario 4 - Ekonomiavdelning vill automatisera flöden
Kunden vill digitalisera faktura-, betalnings-, avstämnings- eller rapporteringsprocesser med Business Central och relevanta ekonomi-ISV:er som Continia, ExFlow eller Aritma.
Scenario 5 - Service-/underhållsflöden i BC
Kunden säljer produkter med service-, reservdels- eller underhållsbehov och vill hantera förfrågningar, arbetsorder, avtal och delar i Business Central.
12. Dynamics 365-erbjudande
13. Branschfokus
14. AI, Copilot och Agents
15. Data & Analytics
Yellow Solution bör främst matchas på rapportering och analys i Business Central, inte på bred enterprise-data, Microsoft Fabric eller avancerad dataplattform utan ny verifiering. Rapportering/analys är relevant som kompletterande kundnytta när kunden vill få bättre beslutsunderlag från BC-data, lager, försäljning och ekonomi.
16. Integration
Integrationsförmågan bör bedömas som relevant inom Business Central-landskapet: ekonomi-ISV:er, betalningar, fakturaflöden, lager/WMS och eventuella e-handels-/orderflöden. Större enterprise integrationsarkitektur, middleware eller komplexa API-landskap bör verifieras separat.
17. Ekonomi, storlek och marknadsposition
18. Historik och utveckling
2015: Yellow Solution AB registreras. [✓ H, S5]
2015: Yellow anger samarbete med HangOn sedan starten 2015. [✓/~ H, S4]
2016: Yellow anger samarbete med Gnosjö Laserstans/GLS Industries sedan 2016. [✓/~ H, S4]
2024: Yellow kommunicerar Microsoft Solutions Partner - Business Applications och specialisering inom SMB Management. [✓/~ H, S15]
2025: Yellow kommunicerar Gasellföretag 2025 och fortsatt tillväxt. [✓/~ M/H, S17]
2025-2026: Aktiv blogg/releasekommunikation kring Business Central, Directions EMEA och rekrytering inom BC. [✓/~ M/H, S14, S16]
19. Marknadskommunikation
20. Standardiserade taggar
21. Konkurrentsektion (internt)
Differentiatorer
Mot Business Central-specialister: Stark lokal specialistprofil, Yellow WMS och verifierade ISV-signaler inom ekonomi/betalning kan särskilja, men storlek och branschdjup måste jämföras per case.
Mot CRM-specialister: Yellow bör inte konkurrera direkt; styrkan är BC och affärsprocesser, inte CE/CRM.
Mot globala systemintegratörer: Yellow vinner på närhet, enkelhet och BC-specialisering men saknar enterprise/global skala.
Mot traditionella ERP-konsulter: Yellow är mer Business Central-fokuserad och relevant när kunden vill ha modern molnbaserad BC-standard snarare än tung anpassad ERP.
22. Kundorienterad partnerbeskrivning
Yellow Solution är en svensk Business Central-partner med bas i Jönköping och tydligt fokus på att hjälpa mindre och medelstora företag att digitalisera och effektivisera sina affärsprocesser. Partnern är mest relevant när Business Central är det naturliga ERP-valet och kunden behöver stöd i praktiska processer som ekonomi, försäljning/order, lager/logistik, produktion, service och rapportering.
För en Dynamics 365-kund är Yellow Solution framför allt intressant när behovet handlar om ett genomförbart och väl avgränsat Business Central-projekt snarare än en stor enterprise-transformation. Erbjudandet passar bolag som vill få ordning på arbetsflöden, minska manuell hantering och samla verksamhetsdata i ett modernt molnbaserat affärssystem. Yellow WMS och verifierade kopplingar till ekonomi-/betalnings-/fakturatillägg gör partnern särskilt relevant för kunder med lager- och ekonomiflöden som behöver fungera effektivt i vardagen.
Yellow Solution bör däremot inte primärt positioneras mot stora F&SCM-projekt, fullskalig CE/CRM eller internationella koncernprogram utan särskild verifiering. För rätt kundtyp är värdet snarare en nära specialistpartner med Business Central som huvudplattform, tydliga processområden och fokus på långsiktiga kundrelationer.
23. AI-sammanfattning
24. Why This Partner
Partnern rekommenderas eftersom kunden efterfrågar:
✓ Business Central som huvudplattform
✓ SMB/midmarket och svensk leverans
✓ Ekonomi, order, lager, produktion, service eller rapportering
✓ Lager/WMS-nära behov och BC-processautomation
✓ BC-nära ISV-lösningar som Continia, ExFlow eller Aritma där relation verifieras
✓ En nära specialistpartner snarare än bred enterprise-SI
25. Verifiering före publicering
Bekräfta aktuella produktområden för d365.se: Business Central som primärt område; kontrollera om Power Platform, Data & Analytics eller integration ska vara publika filter.
Bekräfta att F&SCM, CE/CRM, Customer Service, Field Service, Contact Center, Commerce, HR och Project Operations inte ska visas som aktiva områden.
Verifiera Microsoft-status: Solutions Partner Business Applications och SMB Management-specialisering.
Verifiera ISV-relationer per tillägg: Continia, SignUp ExFlow, Aritma, Yellow WMS samt eventuella andra tillägg.
Bekräfta kundreferenser och vilka som får användas publikt: Sekelskifte, HangOn, GLS Industries/Gnosjö Laserstans.
Bekräfta typisk kundstorlek, projektstorlek, geografisk leverans och konsultkapacitet.
Bekräfta förvaltningsmodell, supportorganisation och ansvarig kontaktperson.
Begär konkreta exempel på AI/Copilot/automation om Yellow ska viktas högre i AI-filter.
26. Källor
Käll-URL:er för intern spårbarhet
S1: https://d365.se/partner/yellow-solution/
S2: https://yellowsolution.se/
S3: https://yellowsolution.se/dynamics-365-business-central/
S4: https://yellowsolution.se/referenser/
S5: https://www.allabolag.se/foretag/yellow-solution-ab/j%C3%B6nk%C3%B6ping/konsulter/2KG7X7XI5YF3I
S6: https://www.merinfo.se/foretag/Yellow-Solution-AB-5590131693/2kg7x7x-1g1vl
S7: https://www.continia.com/es/partners/details/?id=582
S8: https://yellowsolution.se/dynamics-365-business-central/lager-logistik/
S9: https://yellowsolution.se/dynamics-365-business-central/produktion/
S10: https://yellowsolution.se/dynamics-365-business-central/service/
S11: https://yellowsolution.se/dynamics-365-business-central/forsaljning/
S12: https://yellowsolution.se/dynamics-365-business-central/rapportering-analys/
S13: https://www.aritma.com/partners/yellow-solution
S14: https://yellowsolution.se/blogg/dynamics-365-business-central-2025-release-wave-1/
S15: https://yellowsolution.se/blogg/microsoft-solutions-partner-business-applications/
S16: https://yellowsolution.se/blogg/applikationsspecialist-ekonomi-dynamics-365-business-central/
S17: LinkedIn/Yellow Solution AB – Gasellföretag 2025
S18: Internt d365.se marknadsunderlag
S19: https://www.signupsoftware.com/find-partner/
Internt arbetsdokument. Källor kan användas i redaktionell analys och AI-matchning, men källnamn behöver inte exponeras publikt. Publika partnerkort kan baseras på partnerinlämnad information, befintlig d365.se-information, offentliga källor och AI-assisterad redaktionell komplettering.
Fält | Bedömning | Verif. | Konf. | Källor
Partnernamn | Yellow Solution | ✓ | H | S1, S2
Juridisk enhet | Yellow Solution AB, org.nr 559013-1693. Registrerat 2015-05-07. Adress/säte: Borgmästargränd 5, Jönköping enligt bolagsdata. | ✓ | H | S5, S6
Partnertyp och egen beskrivning | Nischad Microsoft Dynamics 365 Business Central-partner med fokus på verksamhetsprocesser, molnbaserade ERP-lösningar, ekonomi, lager/logistik, produktion, försäljning/order, service samt rapportering/analys. | ✓/~ | H | S1, S2, S3, S8
Primära produktområden | Business Central är kärnområdet. Yellow Solution bör inte positioneras som bred Dynamics 365-partner utan som BC-specialist. | ✓ | H | S1, S2, S3
Sekundära produktområden | Power BI/rapportering, integrationer, WMS/lagerlösning, ekonomiprocesser, servicehantering och BC-nära ISV-lösningar som Continia, SignUp ExFlow och Aritma där partner-/ISV-källor finns. | ✓/~ | M/H | S4, S7, S8, S11, S12, S13
Områden som inte verifierats | F&SCM, full CE/CRM, Dynamics 365 Sales, Customer Service som fristående CE-lösning, Field Service, Contact Center, Commerce, HR och Project Operations som aktiva huvudfilter. | ?/~ | H | S1, S2
Typisk kundstorlek | SMB och mindre/mellanstora företag med behov av Business Central, särskilt där kunden vill ha en nära, specialiserad partner snarare än stor SI-organisation. | ~ | H | S1, S2, S5
Typisk projektstorlek | Små till medelstora Business Central-projekt, ofta med tydligt processfokus. Projekt kan bli medelstora när lager/WMS, produktion, rapportering, integrationer eller flera ISV-tillägg ingår. | ~ | M/H | S3, S8, S9, S10, S11
Geografisk leveranskapacitet | Svensk/Jönköpingsbaserad leverans. Bör matchas främst på Sverige och lokal/nationell leverans. Norden/internationellt bör verifieras per projekt. | ✓/~ | M/H | S1, S5
Branschfokus | Tillverkning/produktion, grossist/distribution/lager/logistik samt service-/underhållsflöden. Referenser omfattar Sekelskifte, HangOn och GLS Industries/Gnosjö Laserstans. | ✓/~ | H | S4, S8, S10, S11
AI-mognad | Medel som redaktionell bedömning. Yellow kommunicerar Business Central-nyheter, AI/Copilot-relaterad utveckling i release waves och deltagande i Directions EMEA, men saknar tydlig publik profil som AI-/agent-specialist. | ~ | M | S14, S15
Förvaltningskapacitet | Relevant inom Business Central-förvaltning, support, vidareutveckling och förbättring av kunders ekonomi- och affärsprocesser. Rekryteringskommunikation indikerar fokus på support/rådgivning och förbättring av ekonomiprocesser. | ✓/~ | M/H | S16
Internationell leveransförmåga | Låg till medel. Business Central stöder internationella flöden, men Yellow Solution bör inte övermatchas på global rollout utan verifiering. | ~ | M | S2, S5
Transformationskapacitet | Hög inom BC-nära processmodernisering för SMB/midmarket. Lägre verifiering för stora enterprise-transformationsprogram. | ~ | M/H | S1, S2, S3
Unika särskiljande egenskaper | Kombinerar tydlig Business Central-specialisering, egen lager-/WMS-profil genom Yellow WMS, verifierade BC-ISV-relationer och lokal specialistprofil. Har även kommunicerat Microsoft Solutions Partner Business Applications / SMB Management-specialisering och Gasellföretag 2025. | ✓/~ | H | S7, S8, S12, S15, S17
Informationslager | Användning | Regel
Publicerbar profilinformation | Partnerkort, profilsida och publik kortbeskrivning. | Får användas när uppgiften bygger på Yellow Solutions egen webb, d365.se-profil, bolagsdata, Microsoft-/ISV-källor eller partnerbekräftelse.
AI-matchning | Intern söklogik, filtrering, ranking och rekommendationer. | Får användas internt även när uppgiften är d365.se-bedömning, men bör viktas efter konfidens.
Endast internt | Konkurrentbedömningar, relativ position, marknadsarena och styrkeprofil. | Får inte visas i publik partnerprofil utan redaktionell omformulering.
Kräver extra kontroll | Kontaktpersoner, Microsoft-statusar, exakta ISV-auktorisationer och kundreferenser. | Verifieras före publik exponering eller stark matchningsvikt.
Ej publik användning | Osäkra slutsatser, negativa jämförelser och känsliga konkurrensbedömningar. | Endast bakgrund för AI-rankning och redaktionell bedömning.
Dimension | Poäng | Säkerhet | Motivering
Business Central-fokus | 5/5 | H | Yellow Solution profilerar sig tydligt som Dynamics 365 Business Central-specialist och d365.se-profilen anger Business Central som kärnan i erbjudandet.
Finance & SCM-fokus | 1/5 | H | Ingen publik verifiering för F&SCM som aktivt erbjudande. Ska inte visas som F&SCM-partner utan ny bekräftelse.
CE/CRM-fokus | 1/5 | M/H | Ingen tydlig publik position som CRM/Customer Engagement-partner. Eventuella kundprocesser bör tolkas som BC-nära order/serviceflöden.
AI / Copilot / Agents | 2/5 | M | Kommunicerar Business Central-release och AI-nyheter, men har inte en tydligt paketerad AI-/Copilot Studio-/agentaffär i offentligt material.
Data & Analytics | 3/5 | M | Rapportering och analys är ett BC-nära erbjudande. Data/Fabric/AI-plattform är inte verifierat som fristående erbjudande.
Integration | 3/5 | M/H | Relevant genom BC-projekt, ISV-kopplingar, Aritma, ExFlow, Continia och lager-/WMS-flöden. Större integrationsarkitektur bör verifieras.
Förvaltning / Managed Services | 3/5 | M | BC-support, vidareutveckling och processförbättring är relevanta, men full managed-services-modell bör verifieras.
Branschspecialisering | 3/5 | M/H | Tydliga sidor för lager/logistik, produktion, service och referenser. Inte lika vertikal som 4PS eller TRIMIT-specialister.
Internationell leverans | 2/5 | M | BC stödjer många länder, men Yellow Solution är organisatoriskt en mindre svensk partner.
SMB-fokus | 5/5 | H | Microsoft SMB Management-specialisering och Business Central-fokus gör partnern mycket relevant för SMB/midmarket.
Enterprise-fokus | 1/5 | M/H | Ska inte matchas mot stora enterprise-/global-rollout-case utan särskild verifiering.
Standardisering | 4/5 | M/H | Paketerad BC-lösning och tydliga processområden talar för standardiserad leverans.
Innovation | 3/5 | M | Aktiv blogg och BC-release-kommunikation visar modernitet. Egen Yellow WMS ger viss produkt-/paketeringssignal.
Leveransbredd | 2/5 | H | Bredd inom BC-processer, men inte full Microsoft Business Applications-bredd.
Partner-DNA typ: Nischad Business Central-specialist för SMB/midmarket med stark BC-processprofil inom ekonomi, lager/logistik, produktion, service och rapportering. Tolkning: Yellow Solution bör matchas när kunden söker en nära, specialiserad BC-partner snarare än en bred F&SCM-, CRM- eller enterprise-transformationspartner.
Symbol | Betydelse | Användning
✅ Partnerbekräftad | Information verifierad direkt av partnern. | Används först när partnern har bekräftat uppgiften.
✓ Offentligt verifierad | Bekräftad via partnerwebb, Microsoft, bolagsdata, ISV-katalog eller annan officiell källa. | Används för fakta som går att spåra.
~ d365.se-bedömning | Analytisk bedömning baserad på offentligt material och intern marknadskontext. | Används för positionering, lämplighet och relativa styrkor.
? Ej verifierad | Saknar tillräckligt stöd. | Ska verifieras före publicering eller användas med låg matchningsvikt.
Konfidens | Betydelse
H | Hög säkerhet
M | Medel säkerhet
L | Låg säkerhet
Del | Beskrivning | Verif. | Konf. | Källa
Rekommenderad huvudpositionering | Specialiserad Business Central-partner för svenska SMB- och midmarket-kunder med behov av ekonomi, lager/logistik, produktion, service, försäljning/order, rapportering och BC-nära tillägg. | ~ | H | S1, S2, S3
Tydlig köparnytta | Kunden får en nära BC-partner med tydligt processfokus, paketerad molnresa och möjlighet att kombinera Business Central med lager/WMS, ekonomi-ISV:er och rapportering. | ~ | H | S1, S3, S8, S11
Matchningslogik | Prioriteras när kunden söker Business Central, vill effektivisera processer och föredrar en svensk specialistpartner med lokal/nationell närhet. | ~ | H | S1, S2
Positioneringsgränser | Ska inte övermatchas på F&SCM, CE/CRM, Contact Center, Commerce, HR, Project Operations eller större enterprise-transformationer utan ny verifiering. | ~ | H | S1, S2
Filterområde | Beslut för Yellow Solution | Matchningsvikt | Verifiering | Kommentar
Business Central | Visa som primär partner. | Mycket hög | ✓/~ | Kärnområde i både d365.se-profil och egen webb.
F&SCM | Visa inte som aktiv partner. | Ingen / låg | ? | Ingen verifierad F&SCM-position.
CE/CRM | Visa inte som aktiv partner. | Ingen / låg | ? | Order, försäljning och service bör tolkas som BC-nära flöden, inte fristående CE/CRM.
Data & Analytics | Visa som kompletterande BC-nära signal. | Medel | ✓/~ | Rapportering och analys är en lösningssida; Fabric/data warehouse bör inte antas.
Integration | Visa som kompletterande signal. | Medel/hög | ✓/~ | Relevant via BC-tillägg, ekonomi/lagerflöden, Aritma, ExFlow och Continia.
ISV-lösningar | Visa endast per verifierad ISV-relation. | Endast verifierad | ✓/? | Continia, ExFlow och Aritma har offentliga signaler; övriga kräver verifiering.
Fält | Värde för Yellow Solution | Matchningsanvändning | Konf. | Källor
Primär marknadsarena | Business Central / SMB-midmarket | Använd som huvudkategori när kunden söker svensk BC-specialist med nära leverans och processfokus. | H | S1, S2
Sekundära arenor | BC-nära lager/WMS, ekonomi, rapportering, integration och ISV-tillägg | Använd som kompletterande logik när kundens behov ligger runt BC-processer snarare än ny ERP-plattform i enterprise. | M/H | S7, S8, S11, S12, S13
Partnerkategori | Nischad svensk Business Central-partner | Skiljer Yellow Solution från breda Microsoft-partners, F&SCM-specialister och CRM-specialister. | H | S1, S2
Primär jämförelsegrupp | InBiz, Goodfellows, Bisqo, Navcite, NAB Solutions, BrightCom, Update, Compago, Aperit | Använd vid jämförelser där kunden söker Business Central, SMB/midmarket, lager/produktion/ekonomi och nära partnerrelation. | M | S18
Lägre relevans i jämförelse | Columbus, BE-terna, Implema, Engage, CGI, Avanade/Accenture, CRM-Konsulterna, Sirocco | Använd endast som angränsande jämförelse när kunden går mot enterprise F&SCM eller ren CE/CRM. | M | S18
Fakta | Värde | Verif. | Konf. | Källa
Partner | Yellow Solution | ✓ | H | S1, S2
Juridisk enhet | Yellow Solution AB | ✓ | H | S5
Organisationsnummer | 559013-1693 | ✓ | H | S5
Grundat/registrerat | Registrerat 2015-05-07. Yellow beskriver samarbete med HangOn sedan starten 2015. | ✓ | H | S4, S5
Huvudkontor/adress | Borgmästargränd 5, 553 20 Jönköping. | ✓ | H | S5
Ägarstruktur | Ej fullständigt analyserad i detta underlag. Styrelse/befattningshavare ska verifieras vid behov. | ? | M | S5
Omsättning | 2024: 21 404 tkr enligt bolagsdata/merinfo. | ✓ | H | S6
Resultat | 2024: resultat efter finansiella poster 4 150 tkr och årets resultat 3 261 tkr enligt merinfo. | ✓ | H | S6
Antal anställda | 10 enligt Allabolag-sökresultat. | ✓ | H | S5
Geografisk närvaro | Jönköping/Sverige. Nationell BC-leverans bör verifieras per kundscenario. | ✓/~ | M/H | S1, S5
Viktiga erbjudanden | Business Central, ekonomi, produktion, lager/logistik, Yellow WMS, försäljning/order, service, rapportering/analys och BC-nära ISV-lösningar. | ✓/~ | H | S2, S8, S9, S10, S11
Kontaktperson | Jonas Grunditz anges på d365.se och Yellow Solutions lösningssidor som kontaktperson. | ✓ | H | S1, S12
Storlekskategori | Liten/nischad svensk BC-specialist. | ~ | H | S1, S5, S6
Prioritera Yellow Solution när | Signalstyrka | Konfidens
Kunden söker Business Central för SMB/midmarket och vill ha en specialiserad svensk partner. | Mycket stark | H
Kunden har behov inom ekonomi, lager/logistik, försäljning/order, produktion, service eller rapportering i Business Central. | Mycket stark | H
Kunden efterfrågar Yellow WMS, BC-nära lagerprocesser eller enklare WMS-/mobil lagerhantering. | Stark | M/H
Kunden behöver faktura-/betalnings-/ekonomitillägg där Continia, ExFlow eller Aritma är relevant och relationen verifieras. | Stark | M/H
Kunden vill ha lokal/nära partnerrelation och inte en stor konsultorganisation. | Stark | H
Prioritera lägre när | Signalstyrka | Konfidens
Kunden söker F&SCM, global enterprise ERP, tung supply chain eller stora internationella rolloutprogram. | Stark nedviktning | H
Kunden söker ren CE/CRM-specialist, Contact Center, Customer Insights eller Field Service som huvudbehov. | Stark nedviktning | H
Kunden kräver bred Data & AI/Fabric/Copilot Studio-agentförmåga som huvudleverans. | Medel nedviktning | M
Kunden kräver specifik ISV-auktorisation som saknar verifiering. | Stark nedviktning | H
Område | Poäng | Motivering | Verif. | Konf. | Källa
Business Central | 5 | Kärnerbjudande och tydlig profil i både d365.se och egen webb. | ✓/~ | H | S1, S2
Finance & SCM | 1 | Ingen verifierad F&SCM-position. | ? | H | S1, S2
CE/CRM | 1 | Ingen verifierad fristående CE/CRM-position. | ? | M/H | S1, S2
Data & Analytics | 3 | Rapportering och analys finns som BC-nära erbjudande. | ✓/~ | M | S12
Power Platform | 2 | Inte tydligt paketerat som huvudområde; kan förekomma i BC-nära automation. | ~ | L/M | S2
Integration | 3 | Relevans via BC, ISV-lösningar och ekonomiflöden. | ✓/~ | M/H | S7, S12, S13
AI/Copilot | 2 | AI nämns i BC-release-/Directions-kommunikation men inte som tydlig separat leveransprofil. | ~ | M | S14, S15
Business Transformation | 3 | Stark inom BC-nära processmodernisering, svagare för enterpriseprogram. | ~ | M | S1, S3
Strategisk rådgivning | 3 | Rådgivning kring BC och verksamhetsprocesser är relevant. | ✓/~ | M | S5, S16
Förvaltning | 3 | Support, vidareutveckling och ekonomiprocesser indikeras i egen kommunikation/rekrytering. | ✓/~ | M | S16
Managed Services | 2 | Förvaltning relevant men full managed-services-modell inte verifierad. | ~ | M | S16
Internationell leverans | 2 | Svensk mindre partner; internationell kapacitet bör verifieras. | ~ | M | S5
SMB | 5 | Tydlig BC-/SMB-position och Microsoft SMB Management-specialisering. | ✓/~ | H | S15
Enterprise | 1 | Ej primärt matchningsområde. | ~ | H | S1, S5
Produktområde | Roll i erbjudandet | Max 3 branscher | Kundnytta | Verifiering | Kommentar
Business Central | Kärnerbjudande | Tillverkning/produktion; Grossist/distribution/lager; Service/underhåll | Samlar ekonomi, order, lager, produktion, service och rapportering i ett modernt molnbaserat affärssystem. | ✓ H | Primärt filterområde.
F&SCM | Ej verifierat | Ej aktivt | Ska inte användas som matchning utan ny partnerbekräftelse. | ? H | Ej aktivt filter.
CE/CRM | Ej verifierat som huvudområde | Ej aktivt | BC-nära order/försäljning/service kan finnas, men inte fristående CE/CRM-position. | ? M/H | Ej aktivt filter.
Power BI / rapportering | Komplement | BC-kunder med behov av analys | Bättre insikt i ekonomi, lager, försäljning och produktion. | ✓/~ M | Kompletterande matchning.
Yellow WMS | Egen/nämnd BC-nära lagerlösning | Lager/logistik; distribution; varuhanterande företag | Mobil lagerhantering och bättre produktivitet/kapacitet i lagerflöden. | ✓ H | ISV-/tilläggsprofil, bör verifieras tekniskt.
Bransch | Klassificering | Relevans i matchning | Kommentar | Referenstyp
Tillverkning/produktion | Kärnbransch / stark BC-process | Hög | Egen sida för produktion/tillverkning i Business Central och referens mot GLS Industries/Gnosjö Laserstans. | Publik referens + lösningssida
Grossist/distribution/lager/logistik | Kärnbransch / stark BC-process | Hög | Yellow WMS och Business Central-lagerflöden gör detta till ett viktigt matchningsområde. | Lösningssida
Service/underhåll | Sekundär bransch/process | Medel | Business Central-serviceflöden beskrivs för produkter med service- och underhållsbehov. | Lösningssida
Retail/e-handel | Sekundär/generell erfarenhet | Medel | Sekelskifte är ett relevant kundcase, men retail/e-handel är inte lika tydligt paketerad som branschnisch. | Publik referens
Delområde | Bedömning | Verifiering | Kommentar
AI-mognad | Medel/låg till medel | ~ M | Relevant som BC/Copilot-standard och releasekunskap, inte som stark AI-specialistprofil.
AI-readiness | Medel | ~ M | Kan kopplas till datakvalitet, rapportering och processstandardisering i BC.
Copilot | Grundläggande/BC-nära | ~ M | BC-release-kommunikation nämner intelligentare och automatiserade funktioner.
Copilot Studio / Agents | Ej verifierat | ? H | Ska inte användas som aktiv matchning utan ny källa.
Konkreta AI-användningsfall | Ej publikt kvantifierade | ? M | Be om exempel på kundprojekt, use cases och adoption.
ERP-nära AI | Möjlig kompletterande signal | ~ M | Bör kopplas till BC-standard, rapportering, prognos/planering och automation.
Område | Status | Kommentar
Power BI / rapportering | Kompletterande BC-nära signal | Relevant utifrån Yellow Solutions sida för rapportering och analys.
Microsoft Fabric | Ej verifierat | Ska inte användas som filter utan ny källa.
Datakvalitet | Implicit relevant | Viktig för BC-projekt, rapportering och framtida Copilot/AI-nytta.
AI-grund | Svag/medel | Bör kopplas till process- och dataordning i Business Central.
Område | Bedömning | Kommentar
API / BC-integration | Medel | Relevant i BC-projekt och via Aritma/ekonomiflöden.
EDI | Ej verifierat | Golden EDI eller andra EDI-lösningar ska inte antas utan verifiering.
Datamigrering | Medel | Relevant vid BC-implementation, men projektvolym bör verifieras.
Drift/övervakning | Ej verifierat | Saknar tydlig publik managed integration operations-profil.
WMS/lagerintegration | Medel/hög | Yellow WMS och lager/logistik-flöden är starka BC-nära signaler.
Dimension | Bedömning | Källa
Omsättning | 2024: 21 404 tkr. | S6
Resultat | 2024: resultat efter finansiella poster 4 150 tkr, årets resultat 3 261 tkr. | S6
Medarbetare | 10 anställda enligt Allabolag-sökresultat. | S5
Tillväxtsignal | Gasellföretag 2025 enligt Yellow Solutions LinkedIn/bloggkommunikation; bör verifieras vid publik användning. | S17
Marknadsposition | Liten men tydlig svensk Business Central-specialist. Relevant i BC-/SMB-segmentet, inte som enterprise D365-plattform. | S1, S2, S18
Finansiell stabilitet | Lönsam mindre aktör enligt 2024-resultat; full finansiell analys kräver bokslutsgranskning över flera år. | S6
Tema | Aktivitet/Signal | Bedömning
Business Central | Egen huvudpositionering, flera lösningssidor och d365.se-profil. | Mycket stark marknadsprofil.
Release waves / Microsoft-nyheter | Blogg om Business Central 2025 Release Wave 1 och Directions EMEA. | Aktiv men nischad thought leadership.
AI/Copilot | AI nämns i relation till Business Central-nyheter och Directions, men inte som fristående erbjudande. | Kompletterande signal.
Kundcase/referenser | Sekelskifte, HangOn och GLS Industries/Gnosjö Laserstans finns på referenssidan. | Bra köparsignal för mindre BC-specialist.
Rekrytering | Roller inom Business Central-utveckling och ekonomi/applikation. | Indikerar tillväxt och BC-fokus.
Awards/status | Microsoft Solutions Partner / SMB Management och Gasellkommunikation. | Stärker förtroende, men bör verifieras inför publik poängsättning.
Taggkategori | Taggar
Produktområden | business_central; bc_warehouse_logistics; bc_manufacturing; bc_service; bc_reporting; bc_isv_addons
Branscher | manufacturing; distribution_wholesale; warehouse_logistics; service_maintenance; retail_ecommerce_secondary
Kompetenser | business_central_implementation; bc_upgrade; process_automation; finance_processes; warehouse_wms; reporting_analytics; bc_support
ISV / tillägg | continia_verified_signal; signup_exflow_verified_signal; aritma_verified_signal; yellow_wms; other_isv_requires_verification
Kundstorlek | smb; lower_midmarket; midmarket
Projektstorlek | small; medium; bc_standardized_project; bc_isv_extension_project
Geografi | sweden; jonkoping; local_national_delivery
Ej avsedd för extern publicering. Används endast för AI-rankning, jämförelser och redaktionell förståelse.
Kategori | Primära jämförelsepartners | Kommentar
BC-specialister SMB/midmarket | InBiz, Goodfellows, Bisqo, Navcite, Update, Compago, Aperit | Mest relevant jämförelsegrupp vid BC-val för svenska SMB-/midmarketkunder.
Större BC/Microsoft-partners | NAB Solutions, Fellowmind, Cepheo, Columbus | Starkare när kund kräver större leveranskapacitet, bredare Microsoft-stack eller mer geografisk bredd.
Vertikala BC/IP-partners | 4PS, Adbriq, BrightCom | Starkare om kundens krav är bygg/entreprenad, fashion/textil, retail/e-handel eller specifik vertikal IP.
F&SCM/enterprise | BE-terna, Implema, Engage, CGI, Columbus | Mer relevanta när kunden behöver enterprise ERP, global rollout eller komplex supply chain.
CRM/CE-specialister | CRM-Konsulterna, Releye, Sirocco, B3 Elevate | Mer relevanta när kundens huvudbehov är CE/CRM, sälj, marknad, service eller customer data.
Yellow Solution är en svensk, Jönköpingsbaserad Business Central-specialist för SMB och midmarket. Partnern bör främst matchas när kunden söker Dynamics 365 Business Central och har behov inom ekonomi, försäljning/order, lager/logistik, produktion, service, rapportering eller BC-nära tillägg. Yellow Solution har tydlig BC-positionering, egen Yellow WMS-profil och offentliga ISV-signaler för bland annat Continia, SignUp ExFlow och Aritma. Partnern passar bäst för kunder som vill ha en nära, specialiserad svensk BC-partner snarare än en stor systemintegratör. Den bör viktas lägre vid F&SCM, full CE/CRM, Contact Center, Commerce, HR, Project Operations, global rollout eller stora enterpriseprogram. AI-profilen bedöms som medel/låg till medel och bör främst kopplas till Business Central-standard, datakvalitet, rapportering och processautomation tills mer konkret AI-/Copilot-erfarenhet verifieras.
Källkod | Källa | Användning
S1 | d365.se – Yellow Solution AB partnerprofil | Produktområde, kontaktperson, publik d365.se-positionering.
S2 | Yellow Solution – startsida/egen webb | Egen positionering som Business Central-expert och referenssignaler.
S3 | Yellow Solution – Dynamics 365 Business Central | BC-erbjudande, paketerad lösning, molnförflyttning.
S4 | Yellow Solution – Referenser | Sekelskifte, HangOn, GLS/Gnosjö Laserstans.
S5 | Allabolag – Yellow Solution AB | Juridisk enhet, org.nr, registreringsdatum, adress, anställda och verksamhetsbeskrivning.
S6 | Merinfo/bolagsdata – Yellow Solution AB | Omsättning, resultat och finansiella nyckeltal 2024.
S7 | Continia partnerkatalog – Yellow Solution AB | Continia-relation och BC-partnerbeskrivning.
S8 | Yellow Solution – Lager/logistik / Yellow WMS | Lager-/WMS-kapacitet och BC-tillägg.
S9 | Yellow Solution – Tillverkning | Produktionsflöden i Business Central.
S10 | Yellow Solution – Service | Service-/underhållsflöden i Business Central.
S11 | Yellow Solution – Försäljning och order | Försäljnings-/orderprocesser i Business Central.
S12 | Yellow Solution – Rapportering och analys | Rapportering och analys som BC-nära erbjudande.
S13 | Aritma – Yellow Solution partner | Aritma/BC-partner och ekonomi-/betalnings-/avstämningsprodukter.
S14 | Yellow Solution – Business Central 2025 Release Wave 1 | Release- och AI/Copilot-nära kommunikation.
S15 | Yellow Solution – Microsoft Solutions Partner Business Applications | Microsoft Solutions Partner och SMB Management-specialisering.
S16 | Yellow Solution – Applikationsspecialist Ekonomi / rekrytering | Ekonomiprocesser, support, rådgivning och vidareutveckling.
S17 | Yellow Solution LinkedIn – Gasellföretag 2025 | Tillväxt-/marknadskommunikation, bör verifieras före publik användning.
S18 | Internt d365.se marknadsunderlag | Marknadsarena, jämförelsegrupper och intern konkurrenslogik.
S19 | SignUp Software – Find partner / Yellow Solution | ExFlow-partnerindikation, ska verifieras per produkt/scope.$txt$, source_document_filename = 'yellow_solution_ai_partnerunderlag_d365_v1.docx', source_document_updated_at = now() WHERE slug = 'yellow-solution';