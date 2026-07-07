
UPDATE public.partners SET
  observed_products = '{"bc":false,"fsc":false,"sales":true,"service":true}'::jsonb,
  observed_industries = '{"sales":["Telekom & IT-tjänster","Tillverkningsindustri","Finans & Försäkring"],"service":["Telekom & IT-tjänster","Tillverkningsindustri","Finans & Försäkring"]}'::jsonb,
  observed_company_sizes = '{"sales":["50-999"],"service":["50-999"]}'::jsonb,
  observed_delivery_geo = '{"sales":["Sverige"],"service":["Sverige"]}'::jsonb,
  observed_updated_at = now(),
  extended_content = $ext$Sandbox Republic (Sandbox Republic AB) är ett ungt Stockholmsbaserat Microsoft Dynamics 365-konsultbolag grundat sommaren 2024 av ett erfaret team som tidigare arbetat tillsammans. Trots kort historik som bolag har grundarna lång samlad erfarenhet av Microsoft-stacken – från Dynamics 365 CRM/CE och Power Platform till Azure och Microsoft 365. Bolaget har 11–50 anställda enligt LinkedIn och positionerar sig som en helhetsleverantör med fokus på lösningar som "håller, används och gör skillnad".

Aktiva produktområden: Dynamics 365 Customer Engagement (Sales, Customer Service, Contact Center), Power Platform (Power BI, Power Apps, Power Automate, Copilot/AI), Azure för integrationer och data, samt Dataverse som dataplattform. Bolaget lyfter specifikt fram teamstelefoni och Contact Center som referenscase – "Först i Sverige med teamstelefoni och Contact Center" – vilket indikerar stark kompetens inom Dynamics 365 Customer Service och Contact Center. Business Central, Finance & Supply Chain och andra ERP-produkter är inte verifierade som erbjudanden.

Tydliga styrkor: Seniora konsulter med lång samlad erfarenhet trots ungt bolag, agilt arbetssätt med fokus på innovation och kreativitet, bred Microsoft-kompetens från CRM till AI/automation, samt tydlig ambition att vara långsiktig förvaltningspartner snarare än engångsleverantör. Referenskunder inkluderar större organisationer med behov av teamstelefoni och Contact Center-integration.

Räckvidd och segment: Huvudkontor i Stockholm. Bolaget är relativt litet men med ambition att växa. Passar medelstora företag (50–999 anställda) som söker en agil, innovativ partner för CRM, kundservice och Contact Center-lösningar. Branschfokus: bred profil men med dokumenterad erfarenhet av telekom/IT-tjänster och organisationer med avancerade Contact Center-behov.

Passar bäst: Organisationer som vill ha en smidig, innovativ partner för Dynamics 365 CE/CRM och Contact Center, företag som värderar långsiktigt partnerskap och kontinuerlig vidareutveckling, samt verksamheter som vill kombinera CRM med Power Platform och AI-automation. Mindre lämplig för stora globala utrullningar som kräver etablerad internationell närvaro, företag som söker ERP-lösningar (Business Central, F&SCM), eller organisationer som prioriterar stor organisationsstorlek och lång track record framför innovation och flexibilitet.

Jämförelsegrupp: Andra CRM-/CE-specialister i Sverige som Sundet CRM, Point Taken och Sirocco Group, samt större generalister med CE-kompetens som Fellowmind och NAB Solutions.$ext$
WHERE slug = 'sandbox-republic';

UPDATE public.partners SET
  observed_updated_at = now(),
  extended_content = $ext$Sirocco Group är en internationell Microsoft Dynamics 365 CRM-specialist grundad 2008 i Sverige, med huvudkontor i Stockholm och närvaro i Mellanöstern, Iberiska halvön, Italien och USA. Bolaget har cirka 100 medarbetare globalt varav hälften är Microsoft-certifierade, med över 100 certifieringar i mer än 20 kategorier. Sirocco har genomfört över 300 kundprojekt och mer än 150 Microsoft-projekt sedan starten, vilket ger en solid erfarenhetsbas.

Aktiva produktområden: Dynamics 365 Customer Engagement utgör kärnan – Sales, Customer Service, Customer Insights (Marketing), Field Service, Project Operations och Commerce. Power Platform (Power BI, Power Apps, Power Automate, Power Virtual Agents) är starkt integrerat i erbjudandet. Bolaget har även certifieringar inom Finance & Operations och Azure. Sirocco profilerar sig tydligt som CRM-specialist snarare än ERP-partner och arbetar köparsidigt – de hjälper kunder avgöra om Dynamics är rätt val.

Tydliga styrkor: Lång erfarenhet (sedan 2008) med bred internationell närvaro, stark certifieringsgrad (50% av personalen Microsoft-certifierad), agil implementeringsmetodik med SAFe-ramverk, AI-mognad klassad som "Etablerad" med fokus på Power Platform-automation, Azure AI och AI-readiness. Dokumenterad branschbredd: tillverkning, fastighet/bostäder, försvar, energi, retail, telekom, finans och logistik.

Räckvidd och segment: Levererar i Sverige och Norden med internationell kapacitet. Passar medelstora till större företag (100–4 999 anställda) inom framför allt livsmedels-/processindustri och tillverkningsindustri enligt d365.se-profilen. Kan stödja internationella utrullningar tack vare global närvaro.

Passar bäst: Tillverknings- och livsmedelsföretag som behöver Dynamics 365 Sales och Customer Insights, organisationer som vill ha en erfaren CRM-specialist med agil metodik, företag med internationella ambitioner där partnern kan följa med ut, samt verksamheter som prioriterar AI-mognad och automation i CRM-processerna. Mindre lämplig för företag som primärt söker ERP-lösning (Business Central/F&SCM), små företag under 100 anställda, eller organisationer som vill ha en lokal "enbart Sverige"-partner utan internationell komplexitet.

Jämförelsegrupp: Andra CRM-/CE-specialister som Point Taken, Sundet CRM och B3 Elevate, samt större generalister med stark CE-kompetens som Fellowmind, NAB Solutions och Nexer.$ext$
WHERE slug = 'sirocco-group';

UPDATE public.partners SET
  observed_updated_at = now(),
  extended_content = $ext$Sundet CRM (Sundet CRM AB) är ett konsultföretag specialiserat på Microsoft Dynamics 365 CRM/CE, grundat sommaren 2024 och baserat i Malmö med kontor även i Göteborg. Trots att bolaget är ungt har teamet samlat över 100 års gemensam erfarenhet av Microsoft Dynamics 365 – ett seniort team som tidigare arbetat tillsammans i andra organisationer. Bolaget är Microsoft AI Cloud Partner och indirekt återförsäljare av D365-licenser. Sundet CRM ingår i Zefyr-gruppen med syskonbolag inom marketing automation, IT-säkerhet, dataanalys och automation.

Aktiva produktområden: Dynamics 365 Customer Engagement – Sales, Customer Service, Field Service, Marketing och Customer Insights. Power Platform för automatiserade flöden, virtuella agenter, Power BI-dashboards och appar. Azure för molnbaserade integrationer och API:er. Copilot och generativ AI för automatisering och kundhantering. Stor erfarenhet av migreringar från on-premise Dynamics till molnbaserad D365. Business Central och Finance & Supply Chain är inte del av erbjudandet.

Tydliga styrkor: Seniort team med djup specialist­kompetens inom CRM/CE, fokus på hantverksskicklighet och kvalitet ("lösningar som står sig över tid"), stark teknisk kompetens inom arkitektur och utveckling, flexibilitet genom Zefyr-gruppens kompletterande kompetenser (marketing automation, IT-säkerhet, data). Referenskunder inkluderar Øresundsbron, E.ON Sverige och GTT Marine – större organisationer med höga kvalitetskrav.

Räckvidd och segment: Malmö och Göteborg med fokus på Öresundsregionen inklusive Köpenhamn samt västkusten upp till Göteborg och Oslo. Bolaget har 11–50 anställda och passar medelstora företag (50–999 anställda) inom finans & försäkring, retail & e-handel samt telekom & IT-tjänster. Geografiskt fokus på Sydsverige, Västsverige och Danmark.

Passar bäst: Organisationer i Öresundsregionen eller längs västkusten som söker en senior CRM-specialist med hög leveranskvalitet, företag som värdesätter arkitektur- och utvecklings­kompetens framför volym, verksamheter som behöver migrera från on-premise Dynamics till molnet, samt kunder som vill ha tillgång till kompletterande kompetenser via Zefyr-gruppen. Mindre lämplig för företag i Norrland eller östra Sverige som vill ha lokal närvaro, stora globala utrullningar som kräver internationell kapacitet, eller organisationer som söker ERP-lösningar.

Jämförelsegrupp: Andra CRM-/CE-specialister som Sandbox Republic, Point Taken och Sirocco Group, samt CRM Konsulterna för medelstora CE-projekt i liknande segment.$ext$
WHERE slug = 'sundet-crm';

UPDATE public.partners SET
  observed_products = '{"bc":false,"fsc":true,"sales":false,"service":false}'::jsonb,
  observed_industries = '{"fsc":["Tillverkningsindustri","Grossist & Distribution","Livsmedel & Processindustri"]}'::jsonb,
  observed_company_sizes = '{"fsc":["100-4999"]}'::jsonb,
  observed_delivery_geo = '{"fsc":["Sverige"]}'::jsonb,
  observed_updated_at = now(),
  extended_content = $ext$Texus (Texus AB) är ett konsultbolag baserat i Malmö med specialisering på affärssystem för tillverkande industri. Bolaget arbetar med två huvudplattformar: Infor M3 och Microsoft Dynamics 365 Finance & Supply Chain Management. Med 350 års samlad erfarenhet i teamet och samarbete med över 30 industrikoncerner i mer än 10 länder har Texus byggt upp en stark position som branschspecialist för tillverkningsindustrin.

Aktiva produktområden: Microsoft Dynamics 365 Finance & Supply Chain Management för medelstora till större tillverkande företag. Infor M3 utgör det andra benet i erbjudandet. Bolaget söker aktivt konsulter inom D365 F&SCM vilket indikerar tillväxtambitioner inom Microsoft-spåret. Business Central, Customer Engagement (Sales, Customer Service, Field Service) och Power Platform är inte verifierade som erbjudanden – fokus ligger på ERP/affärssystem snarare än CRM.

Tydliga styrkor: Djup branschspecialisering inom tillverkande industri med förståelse för produktionsprocesser, logistik och supply chain, lång samlad erfarenhet (350 år i teamet), internationell leveranskapacitet (10+ länder), kombination av Infor M3 och Microsoft D365 ger flexibilitet vid plattformsval, samt stark kundrelation med över 30 industrikoncerner.

Räckvidd och segment: Huvudkontor i Malmö (Kalendegatan 26). Bolaget följer sina kunder ut i världen och verkar i mer än 10 länder, vilket ger internationell leveranskapacitet trots svensk bas. Passar medelstora till större tillverkande företag (100–4 999 anställda) inom tillverkningsindustri, grossist & distribution samt livsmedels- och processindustri. "Människan i mitten" är ett kärnvärde – fokus på mötet mellan människor snarare än enbart teknik.

Passar bäst: Tillverkande företag som behöver D365 Finance & Supply Chain Management med branschspecifik förståelse, industrikoncerner med internationell verksamhet som behöver en partner som kan följa med ut, organisationer som överväger både Infor M3 och Microsoft D365 och vill ha en partner som kan rådge om plattformsval, samt företag som värdesätter långsiktiga relationer och djup branschkunskap. Mindre lämplig för tjänsteföretag utan tillverknings­processer, organisationer som primärt söker CRM/CE-lösningar, små företag under 100 anställda, eller kunder som enbart vill ha Business Central.

Jämförelsegrupp: Andra F&SCM-partners med tillverkningsfokus som Sherpas Group, Fellowmind, Knowit och Implema, samt ERP-generalister med Manufacturing-kompetens som Columbus och COSMO CONSULT.$ext$
WHERE slug = 'texus';
