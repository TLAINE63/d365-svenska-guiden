
UPDATE partners SET
 ai_summary = '4PS är en specialiserad Dynamics 365 Business Central-partner för bygg-, installations-, service- och entreprenadverksamheter. Kärnan är 4PS Construct, en branschlösning som samlar bland annat projekt, ekonomi, kalkyl, inköp, resursplanering och fältservice i Business Central.',
 ai_summary_full = '4PS skiljer sig från en generell Business Central-partner genom ett tydligt vertikalt fokus. 4PS Construct är utvecklat specifikt för projektorienterade verksamheter inom bygg, installation, service och närliggande områden och täcker processer från kalkyl och upphandling till projektstyrning, resurser och service. Det gör partnern särskilt relevant när branschfunktionalitet väger tyngre än en generell ERP-implementation.
På d365.se anges företag med cirka 100–4 999 anställda som huvudsakligt segment och lösningen kan användas internationellt. AI-underlaget är främst kopplat till AI-readiness, Copilot och rådgivning snarare än avancerad kundspecifik AI-utveckling.',
 best_fit_for = ARRAY['Bygg-, entreprenad- och installationsföretag','Service- och underhållsverksamheter med projektorienterade processer','Organisationer som vill ha en färdig branschplattform ovanpå Business Central','Företag med krav på kalkyl, projektstyrning, resursplanering och fältservice i samma ERP-miljö'],
 not_a_fit = ARRAY['Företag utanför bygg, installation, service och närliggande projektorienterade branscher','Organisationer vars primära ERP-behov är Dynamics 365 Finance & Supply Chain Management','Företag som framför allt söker avancerad kundspecifik AI- eller agentutveckling'],
 ai_tags = ARRAY['Dynamics 365 Business Central','4PS Construct','Bygg','Entreprenad','Installation','Service','Projektstyrning','Kalkyl','Resursplanering','Fältservice','Branschlösning','ERP','Copilot','AI-readiness']
WHERE id = '87f98585-f1f6-48ed-bfab-34f8b7eb3bf8';

UPDATE partners SET
 ai_summary = 'adbriq är en Business Central-specialist med tydlig branschinriktning mot mode, sport, textil, retail och e-handel. Partnern arbetar bland annat med TRIMIT Fashion och lösningar för artikelvarianter, kollektioner, produktdata, lager och integrationer.',
 ai_summary_full = 'adbriqs profil är relativt smal men tydlig. Partnern riktar sig främst till mindre och medelstora företag där Business Central behöver kompletteras med funktionalitet för mode- och livsstilsbranschens särskilda krav, exempelvis storlek/färg-varianter, kollektioner, produktdata, säsongsflöden och distribution.
d365.se anger huvudsakligen företag med 1–249 anställda och visar ett stort antal referenser inom mode och sport. AI-kompetensen som framgår är i första hand kopplad till standardfunktionalitet och rådgivning inom Business Central, snarare än fristående AI-utveckling.',
 best_fit_for = ARRAY['Mode-, sport-, sko- och textilföretag','Retail- och e-handelsföretag med komplex artikel- och variantstruktur','Företag som behöver TRIMIT Fashion tillsammans med Business Central','Mindre och medelstora verksamheter med lager-, distributions- och integrationsbehov'],
 not_a_fit = ARRAY['Större verksamheter där Finance & Supply Chain Management är det naturliga ERP-valet','Företag i helt andra branscher utan motsvarande variant-, kollektions- eller retailbehov','Projekt där avancerad AI är en central del av lösningen'],
 ai_tags = ARRAY['Business Central','TRIMIT Fashion','Mode','Sport','Textil','Retail','E-handel','PDM','Kollektionshantering','Artikelvarianter','Lager','Distribution','Integrationer','ERP']
WHERE id = '67211d79-5e9e-4113-b6c2-ac77f54fc17b';

UPDATE partners SET
 ai_summary = 'B3 Elevate är en Dynamics 365 Customer Engagement-specialist med fokus på Sales, Customer Insights, Customer Service, Field Service och Contact Center. Partnern har ett särskilt dokumenterat fokus på medlemsorganisationer samt AI och automation inom sälj- och serviceprocesser.',
 ai_summary_full = 'B3 Elevate passar organisationer där CRM, kundresa och service är viktigare än ERP. Leveranserna sträcker sig från strategi och behovsanalys till implementation, utveckling och förvaltning. På d365.se finns medlemsorganisationer som tydligaste branschprofil.
AI-kompetensen är relativt väl dokumenterad: Copilot Studio, AI-agenter, Power Platform-automation och Azure AI ingår i profilen, och d365.se anger genomförda kundprojekt med AI-funktionalitet.',
 best_fit_for = ARRAY['Medlemsorganisationer','Medelstora och större organisationer med CRM- och kundservicebehov','Dynamics 365 Sales, Customer Service och Customer Insights','Organisationer som vill införa Copilot Studio-agenter eller AI-driven automation i CRM-processer'],
 not_a_fit = ARRAY['Företag vars huvudprojekt är Finance & Supply Chain Management eller Business Central','ERP-tunga tillverknings- eller logistikprojekt','Globala ERP-utrullningar där CRM är en mindre del av projektet'],
 ai_tags = ARRAY['Dynamics 365 Sales','Customer Insights','Customer Service','Field Service','Contact Center','Medlemsorganisationer','CRM','Customer Experience','Copilot Studio','AI-agenter','Power Platform','Azure AI','CRM-automation']
WHERE id = 'de93854a-6402-4f4a-8901-82bf355d0f0b';

UPDATE partners SET
 ai_summary = 'BE-terna har Dynamics 365 Finance & Supply Chain Management som kärnområde och riktar sig främst mot medelstora och större organisationer inom tillverkning, grossist/distribution och retail. Partnern kombinerar svensk och europeisk närvaro med kapacitet för internationella ERP-projekt.',
 ai_summary_full = 'BE-terna är framför allt relevant för mer komplexa ERP-miljöer där Finance, Supply Chain Management och i vissa fall Commerce behöver kombineras. Dokumenterade projekt omfattar internationella koncerner, tillverkning och globala finanslösningar.
Partnern arbetar med implementation, förvaltning och vidareutveckling och har branschspecifika tillägg för bland annat diskret tillverkning. AI-profilen på d365.se är omfattande och inkluderar Copilot, Copilot Studio, Power Platform, Azure AI och Microsoft Fabric.',
 best_fit_for = ARRAY['Medelstora och större tillverkningsföretag','Grossister, distributörer och retailorganisationer','Internationella Finance & SCM-implementationer','Företag som behöver Commerce tillsammans med ERP','Organisationer med krav på governance, förvaltning och internationell utrullning'],
 not_a_fit = ARRAY['Mindre företag där Business Central är en mer proportionerlig lösning','Små och avgränsade ERP-projekt där en lokal BC-specialist är tillräcklig','Organisationer som primärt söker en renodlad CRM-specialist'],
 ai_tags = ARRAY['Dynamics 365 Finance','Supply Chain Management','Commerce','F&SCM','Tillverkning','Grossist','Distribution','Retail','Internationella implementationer','ERP-förvaltning','Copilot','Copilot Studio','Azure AI','Microsoft Fabric','Power Platform']
WHERE id = 'e97862ae-7d14-44da-9ea3-7e2de1140a10';

UPDATE partners SET
 ai_summary = 'Bisqo fokuserar på Dynamics 365 Business Central tillsammans med CRM på Power Platform och Power BI. Partnern riktar sig främst mot medelstora grossist-, distributions- och tillverkningsföretag och arbetar med standardiserade och paketerade implementationer.',
 ai_summary_full = 'Bisqos profil passar företag som vill begränsa projektrisk genom ett relativt standardnära och tydligt definierat Business Central-projekt. d365.se anger cirka 50–999 anställda som huvudsakligt segment och lyfter grossist/distribution och tillverkning som huvudbranscher.
Erbjudandet kompletteras med Power Platform CRM och Power BI. Tillgänglig AI-information visar främst rådgivning och utnyttjande av Microsofts befintliga funktionalitet, snarare än specialiserad AI-utveckling.',
 best_fit_for = ARRAY['Medelstora grossister och distributörer','Tillverkande företag som utvärderar Business Central','Organisationer som efterfrågar standardnära, paketerade projekt','Företag som vill kombinera Business Central med Power Platform och Power BI'],
 not_a_fit = ARRAY['Stora F&SCM-projekt','Projekt som kräver omfattande specialutveckling utanför standard/paketering','Organisationer där avancerad AI är ett centralt projektområde'],
 ai_tags = ARRAY['Business Central','Grossist','Distribution','Tillverkning','Power Platform','CRM','Power BI','Paketerad implementation','Standardnära ERP','Fast scope','ERP-förvaltning']
WHERE id = 'd51765db-7ab6-4cb6-8c53-384f1ffee552';

UPDATE partners SET
 ai_summary = 'CRMK är specialiserat på Dynamics 365 Customer Engagement, Power Platform, AI och agenter. Erbjudandet omfattar bland annat Sales, Customer Insights, Customer Service, Contact Center och Field Service samt Power Apps, Power Automate och Copilot Studio.',
 ai_summary_full = 'CRMK är en tydlig CRM- och Customer Engagement-specialist snarare än ERP-partner. Partnern arbetar från analys och implementation till utveckling, utbildning och långsiktig vidareutveckling.
Dokumenterade kundcase omfattar bland annat Dynamics 365 Sales och Customer Service, och erbjudandet inom Customer Service och Contact Center inkluderar omnikanal, routing och Copilot. AI-kompetensen är tydligt dokumenterad genom Copilot Studio, kundanpassade AI-agenter, Power Platform och AI-readiness.',
 best_fit_for = ARRAY['Organisationer där CRM och kundrelationer är huvudområdet','Dynamics 365 Sales och Customer Insights','Customer Service och Contact Center','Power Platform-baserad verksamhetsutveckling','Organisationer som vill utveckla egna Copilot Studio-agenter och automation'],
 not_a_fit = ARRAY['Organisationer vars huvudbehov är Business Central','Finance & Supply Chain Management-projekt','ERP-tunga projekt inom produktion, lager och supply chain'],
 ai_tags = ARRAY['Dynamics 365 Sales','Customer Insights','Customer Service','Contact Center','Field Service','CRM','Power Platform','Power Apps','Power Automate','Copilot Studio','AI-agenter','AI-readiness','Customer Experience','Omnichannel']
WHERE id = 'f89e80b2-a124-4768-8eaf-2b185b5bf093';

UPDATE partners SET
 ai_summary = 'Fellowmind har ett brett Microsoft-erbjudande och arbetar med både Dynamics 365 Business Central, Finance & Supply Chain Management och Customer Engagement. Partnern passar främst medelstora och större organisationer som behöver kombinera ERP, CRM, data och Microsoft-plattformen över flera verksamhetsområden.',
 ai_summary_full = 'Fellowminds styrka i partnerjämförelsen är bredden. De arbetar med såväl Business Central som Finance & SCM och CRM-applikationer och kan därför vara relevanta där flera Microsoft Business Applications behöver samverka.
Dokumenterad branscherfarenhet finns bland annat inom grossist/distribution, tillverkning, retail/e-handel, konsulttjänster och life science/medtech. Den europeiska organisationen ger även stöd för kunder med verksamhet i flera länder. AI-arbetet är kopplat till Microsofts Copilot- och automationsplattform samt data/AI som del av det bredare Microsoft-erbjudandet.',
 best_fit_for = ARRAY['Medelstora och större företag','Organisationer som kombinerar ERP och CRM','Grossist, distribution, tillverkning och retail','Nordiska och internationella verksamheter','Företag som vill samla Dynamics 365, Microsoft Cloud, data och AI hos en bred Microsoft-partner'],
 not_a_fit = ARRAY['Mycket små och isolerade Business Central-projekt där bred Microsoft-kapacitet inte tillför värde','Organisationer som specifikt söker en mycket smal vertikal specialist','Företag som endast behöver en fristående punktlösning utan integration eller förvaltning'],
 ai_tags = ARRAY['Business Central','Dynamics 365 Finance','Supply Chain Management','Sales','Customer Insights','ERP','CRM','Grossist','Tillverkning','Retail','Life Science','Internationell verksamhet','Microsoft Cloud','Copilot','Data & AI']
WHERE id = '42f8b63b-a4c9-480d-81e5-a322652b3af4';

UPDATE partners SET
 ai_summary = 'Goodfellows är en svensk Business Central-specialist med erfarenhet från grossist/distribution, handel, e-handel, produktion och konsultverksamhet. Partnern betonar kontinuitet genom att samma konsulter kan följa kunden från förstudie till implementation, support och förvaltning.',
 ai_summary_full = 'Goodfellows passar framför allt mindre och medelstora företag som vill ha en relativt nära Business Central-partner och värdesätter kontinuitet i konsultteamet. d365.se anger 1–249 anställda och Sverige/Norden som huvudsaklig profil.
Partnerns arbetssätt är inriktat på standardfunktionalitet, processoptimering och långsiktig förvaltning snarare än mycket stora F&SCM-miljöer. AI-underlaget beskriver främst Microsofts standard-AI och Copilot Studio i anslutning till Business Central.',
 best_fit_for = ARRAY['Mindre och medelstora Business Central-kunder','Grossist och distribution','Retail och e-handel','Konsult- och tjänstebolag','Företag som värdesätter kontinuitet mellan projekt och förvaltning'],
 not_a_fit = ARRAY['Dynamics 365 Finance & Supply Chain Management','Mycket stora internationella ERP-program','Projekt där omfattande specialutveckling eller avancerad AI är huvudbehovet'],
 ai_tags = ARRAY['Business Central','Grossist','Distribution','Retail','E-handel','Konsulttjänster','ERP-implementation','ERP-förvaltning','Support','Processoptimering','Copilot Studio']
WHERE id = '731f9c05-c293-4842-ac40-19fb610eaeac';

UPDATE partners SET
 ai_summary = 'InBiz är en Business Central-specialist med erfarenhet inom tillverkning, grossist/distribution samt livsmedels- och processindustri. Partnern arbetar med implementation, löpande utveckling och förvaltning från sin svenska verksamhet.',
 ai_summary_full = 'InBiz passar framför allt mindre och medelstora svenska verksamheter där Business Central behöver stödja produktion, logistik, ekonomi och distribution. Partnern har arbetat med Business Central/NAV-miljöer sedan 2005 och har ett tydligt långsiktigt förvaltningsperspektiv.
Power Platform och Copilot ingår i det bredare erbjudandet. AI-informationen pekar främst mot rådgivning, AI-readiness och datakvalitet inför användning av Copilot snarare än avancerad AI-utveckling.',
 best_fit_for = ARRAY['Tillverkande företag','Grossister och distributörer','Livsmedels- och processindustri','Svenska företag som söker långsiktig Business Central-förvaltning','Organisationer som vill kombinera BC med Power Platform och Copilot'],
 not_a_fit = ARRAY['Stora internationella F&SCM-utrullningar','Företag som söker bred global leveransorganisation','Projekt där avancerad AI eller fristående ML är huvudområdet'],
 ai_tags = ARRAY['Business Central','Tillverkning','Grossist','Distribution','Livsmedel','Processindustri','ERP-implementation','ERP-förvaltning','Power Platform','Copilot','AI-readiness','Datakvalitet']
WHERE id = '47db240f-0e3c-4ef7-8532-ddd914a990de';

UPDATE partners SET
 ai_summary = 'NAB Solutions har Business Central som kärnområde men arbetar även med Dynamics 365-applikationer för försäljning, marknad och service. Partnern har lång erfarenhet av Microsofts ERP-plattform och arbetar bland annat med grossist/distribution, tillverkning och uthyrningsverksamhet.',
 ai_summary_full = 'NAB Solutions passar främst små och medelstora organisationer som vill ha Business Central som grund men samtidigt kunna komplettera med CRM och Power Platform. Partnern erbjuder både snabbare paketerade starter och mer omfattande implementationer, exempelvis för lager och större transaktionsvolymer.
d365.se beskriver även kompetens inom Sales, Customer Insights, Customer Service, Field Service och Contact Center. AI-kompetensen är främst kopplad till Copilot, Power Platform-automation, AI-readiness och förbättrad datakvalitet.',
 best_fit_for = ARRAY['Business Central-kunder från mindre till medelstor storlek','Grossist och distribution','Uthyrningsverksamhet','Tillverkande företag','Organisationer som vill kombinera ERP och Dynamics 365 CRM-applikationer'],
 not_a_fit = ARRAY['Stora Finance & Supply Chain Management-program','Koncerner där F&SCM är kärnan i en global ERP-standardisering','Projekt som huvudsakligen handlar om avancerad Azure AI-utveckling'],
 ai_tags = ARRAY['Business Central','Dynamics 365 Sales','Customer Insights','Customer Service','Field Service','Grossist','Distribution','Uthyrning','Tillverkning','ERP','CRM','Power Platform','Copilot','AI-readiness']
WHERE id = '4097cfef-2af6-4aaf-8fbe-69c388c16d8d';

UPDATE partners SET
 ai_summary = 'Nexer är en bred Microsoft- och Dynamics 365-partner med svensk och internationell räckvidd. På d365.se omfattar profilen Business Central och flera Customer Engagement-applikationer, med erfarenhet bland annat inom tillverkning, grossist/distribution och retail.',
 ai_summary_full = 'Nexer passar organisationer som efterfrågar en större teknikpartner snarare än enbart en smal Dynamics-specialist. Inom Dynamics 365 arbetar de bland annat med Business Central, Sales, Customer Insights, Customer Service, Field Service, Contact Center och Project Operations, och analysen beskriver även bredd mot Finance & Supply Chain Management.
Partnern har många svenska kontor och internationell räckvidd. AI-profilen ligger främst på praktisk användning av Microsofts Copilot- och AI-funktioner inom affärsprocesserna.',
 best_fit_for = ARRAY['Medelstora och större organisationer','Tillverkning, grossist/distribution och retail','Företag med både ERP- och CRM-behov','Organisationer som behöver bred Microsoft-kompetens och geografisk täckning','Företag som vill integrera Dynamics 365 med andra delar av Microsoft-ekosystemet'],
 not_a_fit = ARRAY['Mycket små standardprojekt där en mindre BC-specialist är tillräcklig','Företag som prioriterar en mycket smal branschvertikal framför teknisk bredd','Organisationer som enbart söker en punktinsats utan bredare implementation eller vidareutveckling'],
 ai_tags = ARRAY['Business Central','Dynamics 365 Sales','Customer Insights','Customer Service','Field Service','Contact Center','Project Operations','Tillverkning','Grossist','Distribution','Retail','Microsoft-ekosystem','Copilot','AI-integration']
WHERE id = '674e19f3-b48c-4bf1-86ea-81c2170b178b';

UPDATE partners SET
 ai_summary = 'Point Taken är inriktat på Dynamics 365 Customer Engagement med tyngdpunkt på Sales och Customer Service samt kompetens inom Customer Insights, Field Service och Contact Center. d365.se visar konsulttjänsteföretag och medelstora organisationer som tydligaste målgrupp.',
 ai_summary_full = 'Point Taken är främst relevant för CRM- och kundserviceprojekt, inte ERP. Profilen omfattar Dynamics 365 Sales, Customer Service, Customer Insights, Field Service och Contact Center och d365.se anger 50–249 anställda som huvudsakligt segment.
Konsulttjänster är den tydligast dokumenterade branschen, där CRM kan kombineras med projekt- och resursrelaterade processer. AI nämns i profilen, men det publika underlaget är för tunt för en stark klassificering av avancerad AI-kompetens.',
 best_fit_for = ARRAY['Medelstora CRM-projekt','Konsult- och tjänsteföretag','Dynamics 365 Sales','Customer Service, Customer Insights och Field Service','Organisationer med svensk leverans som huvudbehov'],
 not_a_fit = ARRAY['Business Central och Finance & SCM som huvudprojekt','Tillverknings- och logistikprojekt där ERP-processerna är centrala','Globala utrullningar där egen internationell leveransorganisation är ett krav','AI-projekt där avancerad AI eller Fabric är huvuduppdraget'],
 ai_tags = ARRAY['Dynamics 365 Sales','Customer Service','Customer Insights','Field Service','Contact Center','CRM','Konsulttjänster','Customer Engagement','Projektorienterad verksamhet','CRM-automation']
WHERE id = '5faf2ae1-e0a4-4481-a209-6e75e82c7efa';

UPDATE partners SET
 ai_summary = 'Sherpas arbetar med både Dynamics 365 Business Central och Finance & Supply Chain Management och har särskild erfarenhet inom tillverkning, energi, logistik samt bygg och entreprenad. Partnern har flera svenska kontor och kan följa kunder från förstudie och implementation till integration, support och uppgradering.',
 ai_summary_full = 'Sherpas är intressant eftersom de täcker både Business Central-segmentet och större Finance & SCM-miljöer. Business Central-erbjudandet riktar sig främst mot mindre och medelstora verksamheter, medan Finance & SCM används för mer komplexa organisationer.
Branschprofilen är tydligast inom tillverkning, energi, logistik samt bygg och entreprenad. Partnern arbetar även med Power BI, Power Apps och Power Automate. AI-underlaget är framför allt kopplat till Microsofts standardfunktionalitet och Copilot snarare än egen avancerad AI-utveckling.',
 best_fit_for = ARRAY['Tillverkningsföretag','Energi och utilities','Bygg- och entreprenadföretag','Organisationer som behöver välja mellan eller kombinera kompetens inom BC och F&SCM','Svenska och nordiska företag som värdesätter lokal närvaro'],
 not_a_fit = ARRAY['Organisationer som primärt söker en global leveransorganisation','Renodlade CRM- och Customer Experience-program','Projekt som huvudsakligen kräver avancerad kundspecifik AI eller ML'],
 ai_tags = ARRAY['Business Central','Dynamics 365 Finance','Supply Chain Management','Tillverkning','Energi','Utilities','Logistik','Bygg','Entreprenad','ERP','AX-migrering','Power Platform','Copilot']
WHERE id = 'f1947f70-3320-43b0-af09-8387d7546fa3';

UPDATE partners SET
 ai_summary = 'Sirocco Group är en Dynamics 365 Customer Engagement-partner med fokus på Sales, Customer Insights, Customer Service, Field Service, Contact Center och Project Operations. Dokumenterad erfarenhet finns bland annat inom tillverkning och livsmedels-/processindustri.',
 ai_summary_full = 'Sirocco är främst relevant för medelstora och större organisationer som behöver utveckla sälj-, marknads-, service- och fältserviceprocesser i Dynamics 365. d365.se anger 100–4 999 anställda och Norden som huvudsaklig profil.
Partnerns egna källor visar även erfarenhet från bland annat fastighet, försvar, energi och retail. AI-kompetensen är kopplad till kundinsikter, automation, Power Platform och Azure AI samt AI-stöd i CRM- och serviceprocesser.',
 best_fit_for = ARRAY['Medelstora och större CRM-organisationer','Tillverknings- och processindustri','Sales och Customer Insights','Customer Service, Field Service och Contact Center','Organisationer som behöver kundanpassade CRM-integrationer och automation'],
 not_a_fit = ARRAY['Business Central-implementationer','Finance & Supply Chain Management som huvudprojekt','Företag som framför allt söker en bred ERP-integratör','Globala ERP-program där CRM endast är en mindre komponent'],
 ai_tags = ARRAY['Dynamics 365 Sales','Customer Insights','Customer Service','Field Service','Contact Center','Project Operations','Tillverkning','Processindustri','CRM','Power Platform','Azure AI','Prediktiv analys','CRM-automation']
WHERE id = '14adea7a-3dcb-403e-8d8e-0d8481e0fec4';

UPDATE partners SET
 ai_summary = 'Vivicta har ett brett Dynamics 365-erbjudande som omfattar Finance, Supply Chain Management, Business Central och Customer Engagement. Partnern arbetar särskilt med industri, tillverkning, process- och skogsindustri, transport/logistik, energi och andra verksamheter med relativt komplexa processer.',
 ai_summary_full = 'Vivicta är en av de bredare partnerprofilerna på d365.se och kan hantera både ERP och CRM samt Power Platform och Azure-integrationer. Partnern arbetar från rådgivning och lösningsdesign till implementation, vidareutveckling och förvaltning.
Det finns både Business Central-lösningar och större Finance & SCM-projekt, inklusive branschlösningar för transport och andra industrisegment. Ett aktuellt exempel är Hesselbergs projekt där Finance & SCM och Customer Engagement kombineras med Annata A365. AI-profilen är relativt väl dokumenterad och omfattar Copilot Studio, Azure AI/Foundry och AI-driven Power Platform-automation.',
 best_fit_for = ARRAY['Industri och tillverkning','Transport och logistik','Process- och skogsindustri','Organisationer med kombinerade ERP- och CRM-behov','Nordiska organisationer med komplexa eller internationella processer','Företag som vill använda Copilot, AI-agenter och Azure AI i anslutning till Dynamics 365'],
 not_a_fit = ARRAY['Mycket små och enkla Business Central-projekt där en mindre lokal specialist är tillräcklig','Organisationer som endast söker en smal punktlösning utan behov av integrations- eller plattformskompetens','Projekt där det uttryckliga kravet är en lokal partner utan bredare leveransmodell'],
 ai_tags = ARRAY['Dynamics 365 Finance','Supply Chain Management','Business Central','Sales','Customer Service','Field Service','Transport','Logistik','Tillverkning','Processindustri','ERP','CRM','Power Platform','Azure AI','Copilot Studio','AI-agenter','Annata A365']
WHERE id = 'cfe135f8-b2bf-4740-9f26-389bca040715';

UPDATE partners SET
 ai_summary = 'Yellow Solution är en Business Central-specialist med tydlig inriktning mot tillverkning, grossist/distribution samt bygg och entreprenad. Partnern arbetar från förstudie och implementation till fortsatt utveckling och förvaltning.',
 ai_summary_full = 'Yellow Solution passar främst svenska och nordiska företag som vill ha Business Central och en relativt lokalt förankrad partner. Branscherfarenheten är koncentrerad till tillverkning, grossist/distribution och bygg/entreprenad, där Business Central används för bland annat ekonomi, lager, order, produktion och projektprocesser.
Leveransmodellen omfattar förstudie, implementation och fortsatt utveckling. AI-underlaget är begränsat och visar främst rådgivning och praktisk användning av Microsofts standardiserade AI-funktioner inom Business Central snarare än avancerad AI-utveckling.',
 best_fit_for = ARRAY['Tillverkande företag','Grossister och distributörer','Bygg- och entreprenadföretag','Organisationer som söker Business Central från förstudie till förvaltning','Svenska och nordiska verksamheter som prioriterar lokal partnerrelation'],
 not_a_fit = ARRAY['Dynamics 365 Finance & Supply Chain Management','Stora globala koncernimplementationer','CRM/Customer Engagement som huvudprojekt','Organisationer där avancerad AI- eller agentutveckling är ett huvudkrav'],
 ai_tags = ARRAY['Business Central','Tillverkning','Grossist','Distribution','Bygg','Entreprenad','ERP-implementation','ERP-förvaltning','Produktion','Lager','Projektstyrning','Copilot']
WHERE id = 'd863d43e-f5a7-461a-a289-ba285b905d9e';
