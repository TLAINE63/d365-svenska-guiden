import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

// ── Types ──
interface Side {
  p: { t: string; d: string }[];
  c: { t: string; d: string }[];
}
interface Entry {
  rec: "bc" | "fscm" | "both";
  h: string;
  s: string;
  bc: Side;
  fscm: Side;
  pills: string[];
  apps: string[];
}

// ── Data ──
const D: Record<string, Record<string, Record<string, Entry>>> = {
dis:{smb:{loc:{rec:'bc',h:'Business Central – rätt start för diskreta tillverkare upp till 300 anst.',s:'Diskret tillverkning med standardiserade produkter och volymer under 300 anst. passar BC väl. MRP, produktionsorder, lager och grundläggande kapacitetsplanering täcks utan den kostnad och komplexitet som F&SCM medför.',bc:{p:[{t:'Produktionsorder & MRP',d:'Enkel till mellankomplex diskret tillverkning med materialbehovsplanering och routing.'},{t:'Lager & serienummer',d:'Multi-lager, FEFO/FIFO, serienummer och partispårning nativt.'}],c:[{t:'Avancerad APS saknas',d:'Finite scheduling och constraint-baserad kapacitetsplanering kräver ISV.'},{t:'Ingen IoT-motor',d:'Maskinkoppling och MES-integration kräver tredjepartslösning.'}]},fscm:{p:[{t:'Komplett produktionssvit',d:'Diskret och lean manufacturing, avancerad APS och produktkonfigurator inbyggt.'}],c:[{t:'Överdimensionerat',d:'ROI-tröskeln är svår att nå under 300 anst. med standardiserade flöden.'},{t:'Lång implementation',d:'12–18 månader och dedikerat ERP-team krävs.'}]},pills:['MRP/MPS','Produktionsorder','Routing','Serienummer','Batch','Kapacitetsplanering'],apps:['Insight Works Manufacturing','To-Increase Mfg Suite','Tasklet Factory','Siemens Opcenter Lite']},
int:{rec:'both',h:'BC håller för de flesta – F&SCM vid komplex global produktion',s:'Med export och intercompany-flöden klarar BC multi-currency och grundläggande tullhantering. Är produkterna komplexa eller kräver ni avancerat APS i flera länder – är F&SCM värt att utvärdera.',bc:{p:[{t:'Multi-currency & intercompany',d:'Transaktioner i olika valutor och intercompany-handel nativt.'},{t:'Exportdokumentation',d:'Grundläggande exportdokument och leveransvillkor stöds.'}],c:[{t:'Global supply chain',d:'Komplex global inköpsstyrning kräver ISV.'},{t:'Avancerad APS',d:'Multi-site kapacitetsoptimering kräver tillägg.'}]},fscm:{p:[{t:'Global supply chain',d:'End-to-end synlighet i multi-site produktion och inköp.'},{t:'Avancerad APS',d:'Constraint-baserad planering med scenarioanalys i realtid.'}],c:[{t:'Kostnad vs nytta',d:'Svårt att motivera för SMB med begränsad internationell volym.'}]},pills:['Multi-currency','Intercompany','Global MRP','Exportkontroll','Multi-site','APS'],apps:['Avalara AvaTax','CTC Global Trade','Multi Entity Mgmt','Siemens Opcenter APS']}},
ent:{loc:{rec:'fscm',h:'Finance & SCM – naturligt val för enterprise-tillverkaren',s:'300+ anst. med komplexa BOM-strukturer, höga volymer och spårbarhetskrav når snabbt taket för vad BC kan hantera. F&SCM med APS, lean och IoT är byggt för detta segment.',bc:{p:[{t:'Fungerar för homogena flöden',d:'Standardiserad diskret produktion med hanterbara volymer kan funka i BC.'}],c:[{t:'Kapacitetsgränser',d:'Hög transaktionsvolym och många BOM-nivåer belastar BC.'},{t:'Saknar lean-verktyg',d:'Kanban och värdeflödeskartläggning saknas i standard BC.'}]},fscm:{p:[{t:'Avancerad APS & lean',d:'Finite scheduling, Kanban och kapacitetsoptimering inbyggt.'},{t:'IoT & MES',d:'Azure IoT Hub kopplar maskiner direkt till produktionsmotorn.'},{t:'ESG-spårning',d:'CO₂ per artikel och order. CSRD-stöd inbyggt.'}],c:[{t:'Implementationstid',d:'12–24 månader. Kräver dedikerat team och erfaren partner.'}]},pills:['APS','Lean manufacturing','IoT','Produktkonfigurator','ESG','Multi-site'],apps:['Siemens Opcenter APS','To-Increase Lean','Azure IoT Central','Acterys Analytics']},
int:{rec:'fscm',h:'Finance & SCM – självklart för internationell enterprise-tillverkare',s:'Multi-site produktion, globala supply chains och branschcompliance (FDA, REACH) kräver F&SCMs fulla bredd. BC är inte ett realistiskt alternativ i detta segment.',bc:{p:[{t:'Satellite-system',d:'BC kan användas lokalt i ett land om F&SCM är den globala kärnan.'}],c:[{t:'Skalbarhet',d:'Klarar inte multi-country, multi-site produktion i enterprise-skala.'},{t:'Bransch-compliance',d:'FDA, REACH och EHS-moduler saknas i standard BC.'}]},fscm:{p:[{t:'Multi-site & global SCM',d:'Styr produktion, inköp och distribution i alla länder i en plattform.'},{t:'Bransch-compliance',d:'Inbyggda moduler för Life Sciences, kemikalier och exportkontroll.'},{t:'Demand forecasting AI',d:'Azure ML-driven prognos integrerad med MRP och produktion.'}],c:[{t:'Komplex utrullning',d:'18–30 månader. Kräver stark programstyrning och erfaren systemintegratör.'}]},pills:['Multi-site','FDA/REACH','Global SCM','AI-prognos','Exportkontroll','Koncernkonsolidering'],apps:['Avalara','Sovos','Siemens Opcenter','Aptean Life Sciences']}}},
pro:{smb:{loc:{rec:'bc',h:'BC täcker de flesta processindustribolag upp till 300 anst.',s:'Livsmedels-, kemi- och pappersbolag med standardiserade batcher och lokala flöden hittar grundläggande batchhantering i BC. Mer komplex formelhantering förstärks med ISV-appar.',bc:{p:[{t:'Batchhantering & FEFO',d:'Partistyrning, FEFO och spårbarhet bakåt/framåt hanteras nativt.'},{t:'Inköp & lager',d:'Inköpsorder, leverantörsstyrning och lagerhållning utan tillägg.'}],c:[{t:'Formelhantering saknas',d:'Receptstyrning, formeloptimering och co-/by-products kräver ISV.'},{t:'Begränsad batchbalansering',d:'Avancerad satsoptimering och yield-hantering saknas i standard.'}]},fscm:{p:[{t:'Komplett processsvit',d:'Formelhantering, receptstyrning, co-/by-products och batchbalansering inbyggt.'}],c:[{t:'Kostnad',d:'Implementation och licens svår att motivera för SMB.'},{t:'Komplexitet',d:'Kräver dedikerade super-users och löpande konsultstöd.'}]},pills:['Batchhantering','FEFO','Recept','Formelhantering','Spårbarhet','Yield'],apps:['Aptean Process Mfg','To-Increase Process','COSMO Consult Batch','QualityKiosk']},
int:{rec:'both',h:'BC + ISV räcker ofta – F&SCM vid komplex global processproduktion',s:'Internationell processindustri med export och multi-currency klarar BC med rätt tillägg. Producerar ni i flera länder med bransch-compliance krav är F&SCM motiverat.',bc:{p:[{t:'Multi-currency',d:'Inköp och försäljning i olika valutor med automatisk kurs.'},{t:'ISV för formelhantering',d:'Certifierade appar täcker recept och batchoptimering.'}],c:[{t:'Global compliance',d:'REACH, FDA och EHS-krav i flera länder kräver dedikerade tillägg.'}]},fscm:{p:[{t:'Global compliance inbyggt',d:'REACH, FDA 21 CFR och kemikaliehantering utan ISV.'},{t:'Multi-site batchproduktion',d:'Styr processproduktion i flera länder i en plattform.'}],c:[{t:'Overkill för SMB',d:'Kostnad och komplexitet svår att motivera under 300 anst.'}]},pills:['Multi-currency','REACH','Formelhantering','Batchoptimering','Exportkontroll','Global compliance'],apps:['Aptean Process Mfg','Avalara AvaTax','To-Increase REACH','CTC Global Trade']}},
ent:{loc:{rec:'fscm',h:'F&SCM rekommenderas för enterprise-processindustri',s:'Stora livsmedels-, kemi- och pappersbolag med komplexa batchflöden och certifieringsbehov passar F&SCMs processtillverkningsmodul.',bc:{p:[{t:'Möjligt vid enkla batcher',d:'Standardiserade batcher med ISV-tillägg kan funka i BC upp till viss komplexitet.'}],c:[{t:'Avancerad batchkontroll',d:'Komplex yield och co-/by-products kräver mer än BC.'},{t:'QMS-djup saknas',d:'CAPA, avvikelsehantering och inspektionsmoduler saknas.'}]},fscm:{p:[{t:'Inbyggt QMS',d:'Inspektionsjournal, avvikelsehantering, CAPA och kvalitetskostnader nativt.'},{t:'Full batchkontroll',d:'Yield-spårning och branschcertifieringar inbyggt.'},{t:'ESG & hållbarhet',d:'CO₂-spårning per batch. CSRD-rapportering inbyggt.'}],c:[{t:'Lång implementation',d:'12–24 månader. Kräver dedikerat projektteam.'}]},pills:['QMS','CAPA','Batchkontroll','Yield','ESG','Branschcertifiering'],apps:['Aptean Life Sciences','To-Increase REACH','Insight Works QC','Acterys Analytics']},
int:{rec:'fscm',h:'F&SCM – rätt val för internationell enterprise-processindustri',s:'Global processindustri med FDA/REACH-compliance och komplex koncernkonsolidering är F&SCMs kärndomän.',bc:{p:[{t:'Satellite-system',d:'BC kan hantera ett lokalt land om F&SCM är den globala kärnan.'}],c:[{t:'Global compliance',d:'FDA, REACH och EHS-hantering saknas i BC.'},{t:'Multi-site batch',d:'Global batchproduktion överstiger BC:s kapacitet.'}]},fscm:{p:[{t:'Bransch-compliance',d:'FDA 21 CFR, REACH och EHS inbyggt utan ISV.'},{t:'Global batchproduktion',d:'Multi-site, multi-batch och global spårbarhet i en plattform.'},{t:'Demand AI',d:'ML-driven prognosstyrning kopplad till recept och inköp.'}],c:[{t:'Komplex utrullning',d:'18–30 månader och stark programstyrning krävs.'}]},pills:['FDA/REACH','EHS','Global batch','Multi-site','AI-prognos','Branschcertifiering'],apps:['Aptean Life Sciences','Avalara','To-Increase REACH','Siemens Opcenter']}}},
ret:{smb:{loc:{rec:'bc',h:'Business Central – rätt för de flesta lokala detaljhandlare',s:'Lokala detaljhandelskedjor med 25–300 anst. hittar allt de behöver i BC: inköp, lagerstyrning, prissättning och kassalösning via certifierade appar.',bc:{p:[{t:'Inköp & prissättning',d:'Inköpsorder, kampanjpriser och volymrabatter nativt.'},{t:'POS via certifierad app',d:'Kassalösning och butiksintegration via Microsofts certifierade appar.'}],c:[{t:'Avancerad e-handel',d:'Djup e-handelsintegration kräver ISV-lösning.'},{t:'Demand planning',d:'Säsongsbaserade prognosmodeller kräver tillägg.'}]},fscm:{p:[{t:'Avancerat WMS',d:'Wave picking och lagerautomation inbyggt.'}],c:[{t:'Överdimensionerat',d:'Enterprise-komplexitet motiveras inte av lokal SMB-detaljhandel.'},{t:'Kostnad',d:'Licens och implementation svår att räkna hem.'}]},pills:['Inköp','Lagerstyrning','POS','Prissättning','Kampanjer','E-handel'],apps:['LS Central (POS)','Sana Commerce','Tasklet Factory WMS','Netstock']},
int:{rec:'both',h:'BC med ISV räcker för de flesta – F&SCM vid hög global komplexitet',s:'Detaljhandelskedjor med butiker i flera länder klarar multi-currency och intercompany i BC. Stora kedjor med globala distributionscenter bör utvärdera F&SCM.',bc:{p:[{t:'Multi-currency & moms',d:'Försäljning i olika valutor och lokal momshantering via certifierade appar.'},{t:'Intercompany',d:'Inköp från eget lagerbolag till butiksbolag hanteras nativt.'}],c:[{t:'Lokalisering',d:'Djup lokalisering fler än 5–6 länder kräver ISV-lösningar.'},{t:'Global WMS',d:'Centralt distributionscenter med avancerat WMS kräver ISV eller F&SCM.'}]},fscm:{p:[{t:'Global handel',d:'Inbyggd lokalisering i 40+ länder.'},{t:'Centralt WMS',d:'Wave picking och lagerautomation för globala distributionscenter.'}],c:[{t:'Kostnad vs skala',d:'Svårt att motivera för SMB-kedjor med begränsad internationell volym.'}]},pills:['Multi-currency','Intercompany','Global moms','POS','Lokalisering','WMS'],apps:['LS Central (POS)','Avalara AvaTax','Sana Commerce','Tasklet Factory WMS']}},
ent:{loc:{rec:'both',h:'Beror på kanalstrategi och logistikkomplexitet',s:'Stor lokal detaljhandelskedja med egna distributionscenter börjar se BC:s gränser. F&SCM är motiverat om WMS-djupet och demand planning är affärskritiskt.',bc:{p:[{t:'Lägre TCO',d:'Enklare att förvalta om butiks- och lagerflödena är väldefinierade.'},{t:'POS & e-handel',d:'Certifierade appar täcker kassalösning och e-handel i enterprise-skala.'}],c:[{t:'WMS-djup',d:'Avancerade lagerflöden med wave picking kräver ISV eller F&SCM.'},{t:'Demand planning',d:'Avancerad prognos kräver tillägg.'}]},fscm:{p:[{t:'Avancerat WMS & demand',d:'Inbyggt WMS med wave picking och AI-driven prognos.'},{t:'Omnikanalstyrning',d:'Butik, e-handel, click & collect och returns i ett system.'}],c:[{t:'Implementationstid',d:'12–24 månader. Kräver dedikerade resurser.'}]},pills:['WMS','Demand AI','Omnikanalhandel','POS','Prissättning','Returhantering'],apps:['LS Central (POS)','Sana Commerce','Netstock','Tasklet Factory WMS']},
int:{rec:'fscm',h:'F&SCM rekommenderas för internationella enterprise-detaljhandlare',s:'Internationella kedjor med butiker i många länder och centrala distributionscenter behöver F&SCMs fulla bredd.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera som lokalt kassasystem om F&SCM är den globala kärnan.'}],c:[{t:'Global supply chain',d:'Global inköpsstyrning och distributionscenter överstiger BC.'},{t:'Mångländer-lokalisering',d:'Djup compliance i fler än 6 länder kräver F&SCM.'}]},fscm:{p:[{t:'Global lokalisering',d:'Lokal moms och compliance i 40+ länder inbyggt.'},{t:'Inköp & leverantörsstyrning',d:'Global spend-analys och kontrakt i en plattform.'},{t:'Inbyggt WMS',d:'Wave picking och lagerautomation för distributionscenter.'}],c:[{t:'Komplex utrullning',d:'18–30 månader.'}]},pills:['Global WMS','Mångländer-moms','Supply chain','Omnikanalhandel','Demand AI','Leverantörsstyrning'],apps:['LS Central','Avalara','Sana Commerce','Netstock']}}},
gro:{smb:{loc:{rec:'bc',h:'Business Central – naturligt val för lokala grossister',s:'Lokala grossister med 25–300 anst. hittar prissättning, lagerstyrning, EDI och fakturering i BC utan den kostnad F&SCM medför.',bc:{p:[{t:'Orderstyrning & prissättning',d:'Inköpsorder, försäljningsorder, volymrabatter och kampanjpriser nativt.'},{t:'EDI via certifierad app',d:'Elektronisk orderväxling (EDIFACT/ANSI X12) via certifierade appar.'}],c:[{t:'Demand planning',d:'Avancerade prognosmodeller kräver ISV.'},{t:'TMS saknas',d:'Transportoptimering kräver tillägg.'}]},fscm:{p:[{t:'Avancerat WMS',d:'Wave picking och lagerautomation inbyggt.'}],c:[{t:'Överdimensionerat',d:'Enterprise-komplexitet motiveras inte av lokal SMB-grossist.'},{t:'Kostnad',d:'Svår att räkna hem under 300 anst.'}]},pills:['Inköpsorder','Prissättning','EDI','Lagerstyrning','Returhantering','Fakturering'],apps:['TrueCommerce EDI','Lanham EDI','Tasklet Factory WMS','Netstock']},
int:{rec:'both',h:'BC + tillägg räcker – F&SCM vid hög supply chain-komplexitet',s:'Internationell SMB-grossist med export och multi-currency klarar BC med rätt appar. Hög supply chain-komplexitet pekar mot F&SCM.',bc:{p:[{t:'Multi-currency & intercompany',d:'Inköp och försäljning i olika valutor nativt.'},{t:'Global EDI',d:'EDIFACT och ANSI X12 via certifierade tillägg.'}],c:[{t:'Global spend-analys',d:'Leverantörsportföljanalys kräver ISV.'},{t:'Avancerat TMS',d:'Flerländers fraktoptimering kräver specialiserade appar.'}]},fscm:{p:[{t:'Global inköpsstyrning',d:'Spend-analys, kontrakt och leverantörsrisk globalt.'},{t:'WMS + TMS inbyggt',d:'Ruttoptimering och wave picking utan ISV.'}],c:[{t:'Kostnad vs nytta',d:'Svårt att motivera för SMB med begränsad global volym.'}]},pills:['Multi-currency','Global EDI','Intercompany','Tullhantering','Spend-analys','TMS'],apps:['TrueCommerce EDI','Avalara AvaTax','CTC Global Trade','Lanham EDI']}},
ent:{loc:{rec:'both',h:'Beror på lager- och flödeskomplexitet',s:'Enterprise-grossist med 300+ anst. börjar se BC:s gränser i WMS och demand planning. F&SCM är motiverat om lagerautomation är affärskritiskt.',bc:{p:[{t:'Lägre TCO',d:'Lättare att förvalta om processerna är väldefinierade.'},{t:'EDI & integration',d:'Certifierade appar täcker EDI och lagerintegration.'}],c:[{t:'WMS-djup',d:'Wave picking och lagerautomation i stora DC kräver ISV eller F&SCM.'},{t:'Demand planning',d:'Avancerad prognosmodellering kräver tillägg.'}]},fscm:{p:[{t:'Avancerat WMS & demand',d:'Inbyggt WMS med wave picking och AI-driven prognos.'},{t:'Spend & leverantörsstyrning',d:'Fullständig leverantörsportfölj med kontrakt och riskhantering.'}],c:[{t:'Implementationstid',d:'12–24 månader.'}]},pills:['Wave picking','Demand AI','Leverantörsstyrning','Spend-analys','EDI','WMS-automation'],apps:['Körber WMS','Netstock','TrueCommerce','Acterys Planning']},
int:{rec:'fscm',h:'F&SCM rekommenderas för internationella enterprise-grossister',s:'Internationell grossist med multi-country lager och globala leverantörskedjor behöver F&SCMs fulla bredd.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera lokalt om F&SCM är den globala kärnan.'}],c:[{t:'Global WMS & TMS',d:'Multi-country lagerstyrning och fraktoptimering kräver F&SCM.'},{t:'Exportkontroll',d:'Dual-use och exportklassificering saknas i BC.'}]},fscm:{p:[{t:'Global supply chain',d:'End-to-end synlighet i inköp, lager och distribution globalt.'},{t:'Avancerat WMS & TMS',d:'Inbyggt TMS och wave picking för globala DC.'},{t:'AI-prognos',d:'Demand forecasting integrerat med inköp.'}],c:[{t:'Komplex utrullning',d:'18–30 månader.'}]},pills:['Global WMS','TMS','Exportkontroll','Demand AI','Leverantörsstyrning','Multi-country'],apps:['Körber WMS','Avalara','Netstock','TrueCommerce']}}},
ftj:{smb:{loc:{rec:'bc',h:'Business Central – rätt för lokala konsult- och tjänstebolag',s:'Konsultbolag, byråer och revisionsbolag med 25–300 anst. hittar projektredovisning, tidrapportering och resursplanering i BC.',bc:{p:[{t:'Projektredovisning (WIP)',d:'Löpande räkning, fastpris och milstolpsprojekt med korrekt WIP-redovisning.'},{t:'Tidrapportering & fakturering',d:'Inbyggt tidkort kopplat till projekt, resurs och kund.'}],c:[{t:'Avancerad resursoptimering',d:'Skill-baserad allokering och beläggningsprognos kräver ISV.'},{t:'Pipeline-analys',d:'Djup projektpipeline kräver Power BI eller CRM-tillägg.'}]},fscm:{p:[{t:'Project Operations',d:'Avancerad PSA med kompetensmatching och global resursallokering.'}],c:[{t:'Överdimensionerat',d:'PSA-djupet motiveras sällan under 300 anst.'},{t:'Kostnad',d:'Svår att räkna hem vid begränsad projektvolym.'}]},pills:['WIP','Tidrapportering','Resursplanering','Milstolpsfaktura','Projektbudget','Kundlönsamhet'],apps:['ProjectPro','ExpandIT Projects','TimeLog','Dynamics 365 Sales']},
int:{rec:'both',h:'BC räcker för homogena tjänster – Project Operations vid global komplexitet',s:'Konsultbolag med internationell närvaro och standardiserade tjänster klarar multi-currency i BC. Komplex global staffing och IFRS 15 pekar mot Project Operations.',bc:{p:[{t:'Multi-currency fakturering',d:'Fakturera kunder i lokal valuta med korrekt valutaomräkning.'},{t:'Intercompany-projekt',d:'Kostnadsallokering cross-border hanteras nativt.'}],c:[{t:'Global resursoptimering',d:'Cross-border staffing med kompetensmatching kräver ISV.'},{t:'Transfer pricing',d:'OECD-modeller för internprissättning kräver specialiserade tillägg.'}]},fscm:{p:[{t:'Project Operations',d:'Global resurspool med kompetensmatching och realtidsprognos.'},{t:'IFRS 15',d:'Inbyggd intäktsredovisning per prestandaskyldighet.'}],c:[{t:'Kostnad',d:'Svårt att motivera för SMB vid låg internationell projektvolym.'}]},pills:['Multi-currency','Intercompany','Project Operations','IFRS 15','Kompetensmatching','Beläggning'],apps:['ProjectPro','Dynamics 365 Project Ops','Acterys IFRS','Vertex Transfer Pricing']}},
ent:{loc:{rec:'both',h:'Beror på projektportföljens komplexitet och compliance-krav',s:'Enterprise-tjänstebolag med komplexa portföljer lutar mot F&SCM/Project Operations. Standardiserade flöden kan funka i BC med rätt appar.',bc:{p:[{t:'Lägre TCO',d:'Enklare att förvalta. Kortare time-to-value.'},{t:'Certifierade PSA-appar',d:'ProjectPro och ExpandIT ger PSA-djup i BC-miljön.'}],c:[{t:'Skalbarhet',d:'Kan nå gränser vid stora projektvolymer och många juridiska enheter.'},{t:'Internredovisning',d:'Djup internprissättning saknas i BC.'}]},fscm:{p:[{t:'Project Operations',d:'Komplett PSA med pipeline, bemanning, leverans och fakturering.'},{t:'Inbyggd BI',d:'Utilization och realization rate i realtid.'},{t:'SOX & compliance',d:'Audit trails och rollseparering.'}],c:[{t:'Lång implementation',d:'12–18 månader.'}]},pills:['PSA','Utilization','Realization','Internredovisning','SOX','Pipeline'],apps:['Dynamics 365 Project Ops','ProjectPro','Acterys Planning','DocuSign']},
int:{rec:'fscm',h:'Finance & SCM / Project Operations rekommenderas',s:'Internationellt enterprise-tjänstebolag med global resursallokering, transfer pricing och IFRS 15/SOX behöver F&SCM-plattformen.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera lokalt om F&SCM är den globala kärnan.'}],c:[{t:'Global staffing',d:'Cross-border resursoptimering överstiger BC.'},{t:'Regulatory',d:'IFRS 15, SOX och landspecifik compliance kräver F&SCMs ramverk.'}]},fscm:{p:[{t:'Global Project Operations',d:'Hela projektcykeln globalt i en plattform.'},{t:'Transfer pricing & IFRS 15',d:'OECD-modeller och intäktsredovisning inbyggt.'},{t:'Global compliance',d:'SOX, IFRS och landspecifik rapportering nativt.'}],c:[{t:'Investering',d:'18–30 månader.'}]},pills:['Project Operations','Transfer pricing','IFRS 15','Global staffing','SOX','Kundlönsamhet'],apps:['Dynamics 365 Project Ops','Vertex TP','Acterys IFRS','Sovos']}}},
it:{smb:{loc:{rec:'bc',h:'Business Central – naturligt val för IT-bolag upp till 300 anst.',s:'IT-konsultbolag och techbolag passar BC väl. Projektredovisning, abonnemangsfakturering och resursplanering täcks utan F&SCMs kostnad.',bc:{p:[{t:'Projektredovisning & abonnemang',d:'WIP-redovisning och licensfakturering nativt eller via certifierad app.'},{t:'Resursplanering',d:'Beläggning per konsult kopplat direkt till projekt.'}],c:[{t:'IFRS 15 revenue recognition',d:'Komplex intäktsuppskjutning för SaaS-modeller kräver ISV.'},{t:'Pipeline-integration',d:'Djup CRM-integration kräver Dynamics 365 Sales.'}]},fscm:{p:[{t:'Project Operations',d:'Avancerad PSA med kompetensmatching och inbyggd revenue recognition.'}],c:[{t:'Overkill för SMB',d:'PSA-djupet motiveras sällan under 300 anst.'},{t:'Implementationstid',d:'12–18 månader.'}]},pills:['WIP','Abonnemangsfaktura','Resursplanering','Tidrapportering','IFRS 15','Pipeline'],apps:['Subscription Mgmt','ProjectPro','Dynamics 365 Sales','TimeLog']},
int:{rec:'both',h:'BC räcker för standardiserade tjänster – F&SCM vid global komplexitet',s:'IT-bolag med internationell närvaro klarar multi-currency i BC. Komplex global staffing och IFRS 15 pekar mot Project Operations.',bc:{p:[{t:'Multi-currency & intercompany',d:'Fakturering i lokal valuta och cross-border kostnadsallokering nativt.'},{t:'SaaS-fakturering',d:'Abonnemang och licens via certifierade appar.'}],c:[{t:'Global staffing',d:'Kompetensbaserad allokering cross-border kräver Project Operations.'},{t:'Transfer pricing',d:'Internprissättning för IT-tjänster kräver specialiserade tillägg.'}]},fscm:{p:[{t:'Project Operations',d:'Global resurspool med kompetensmatching.'},{t:'IFRS 15 inbyggt',d:'Revenue recognition för SaaS nativt.'}],c:[{t:'Kostnad',d:'Svårt att motivera för IT-SMB.'}]},pills:['Multi-currency','SaaS-faktura','Project Operations','IFRS 15','Global staffing','Intercompany'],apps:['Subscription Mgmt','Dynamics 365 Project Ops','Acterys IFRS','Vertex TP']}},
ent:{loc:{rec:'both',h:'Beror på tjänsteportföljens komplexitet',s:'Stora IT-bolag med komplexa projektportföljer och SaaS-intäkter lutar mot F&SCM/Project Operations. Standardiserade konsultflöden kan funka i BC.',bc:{p:[{t:'Certifierade PSA-appar',d:'ProjectPro och Subscription Mgmt ger PSA och SaaS-fakturering.'},{t:'Lägre TCO',d:'Enklare att förvalta och kortare time-to-value.'}],c:[{t:'SaaS revenue recognition',d:'Komplex IFRS 15 för SaaS kräver dedikerade tillägg.'},{t:'Skalbarhet',d:'Stora kontraktsvolymer kan belasta BC.'}]},fscm:{p:[{t:'Project Operations & IFRS 15',d:'PSA och revenue recognition för SaaS inbyggt.'},{t:'Inbyggd BI',d:'Utilization, realization och SaaS-metrics i realtid.'}],c:[{t:'Implementation',d:'12–18 månader.'}]},pills:['PSA','SaaS revenue','IFRS 15','Utilization','Realization','SOX'],apps:['Dynamics 365 Project Ops','Subscription Mgmt','Acterys Analytics','DocuSign']},
int:{rec:'fscm',h:'Finance & SCM / Project Operations rekommenderas',s:'Internationell enterprise-techkoncern med global staffing, SaaS-intäkter och IFRS 15/SOX behöver F&SCM-plattformen.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera lokalt om F&SCM är den globala kärnan.'}],c:[{t:'Global SaaS revenue',d:'IFRS 15 per land i enterprise-skala överstiger BC.'},{t:'Global staffing',d:'Cross-border resursoptimering kräver Project Operations.'}]},fscm:{p:[{t:'Global Project Operations',d:'PSA och IFRS 15 för SaaS globalt.'},{t:'Transfer pricing',d:'Internprissättning för IT-tjänster cross-border inbyggt.'},{t:'SOX & audit',d:'Rollseparering och audit trails per land.'}],c:[{t:'Investering',d:'18–30 månader.'}]},pills:['Project Operations','IFRS 15','SaaS revenue','Global staffing','Transfer pricing','SOX'],apps:['Dynamics 365 Project Ops','Vertex TP','Acterys IFRS','Sovos']}}},
fin:{smb:{loc:{rec:'bc',h:'Business Central räcker för de flesta finansiella SMB-bolag',s:'Finansiella rådgivare och kapitalförvaltare med 25–300 anst. hittar ekonomistyrning och rapportering i BC.',bc:{p:[{t:'Ekonomistyrning',d:'Kontoplan, budgetering och resultatredovisning per kostnadsställe nativt.'},{t:'Grundläggande rapportering',d:'Standardrapporter och Power BI-integration.'}],c:[{t:'Regulatorisk rapportering',d:'Solvens II och fondrapportering kräver specialiserade ISV-lösningar.'},{t:'Riskhantering',d:'ALM och stresstestning saknas i BC.'}]},fscm:{p:[{t:'Avancerad ekonomistyrning',d:'Djup budgetering och koncernkonsolidering.'}],c:[{t:'Inte branschspecifikt',d:'Finansspecifika moduler ingår inte i F&SCM standard.'},{t:'Kostnad',d:'Svår att motivera för SMB-finansbolag.'}]},pills:['Kontoplan','Budgetering','Rapportering','Internredovisning','Power BI','Momshantering'],apps:['Jet Reports','Acterys Planning','Solver BI360','DocuSign']},
int:{rec:'bc',h:'BC räcker för internationella SMB-finansbolag med enkel struktur',s:'Finansbolag med internationell närvaro och standardiserade flöden klarar multi-currency i BC. Regulatoriska krav kräver ISV-specialisering.',bc:{p:[{t:'Multi-currency',d:'Transaktioner i olika valutor nativt.'},{t:'Intercompany',d:'Internfakturering och konsolidering för medelstora finanskoncerner.'}],c:[{t:'Regulatorisk rapportering',d:'Landspecifik finansiell rapportering kräver ISV.'},{t:'IFRS',d:'Komplex IFRS 9/17 kräver specialiserade tillägg.'}]},fscm:{p:[{t:'Global ekonomistyrning',d:'Avancerad konsolidering och internredovisning i fler länder.'}],c:[{t:'Finansspecifikt',d:'F&SCM saknar bank-, fond- och försäkringsspecifika processer.'},{t:'Kostnad vs nytta',d:'Finansbolag behöver ofta branschspecifika lösningar snarare än generellt ERP.'}]},pills:['Multi-currency','Intercompany','IFRS','Regulatorisk rapport','Konsolidering','Internredovisning'],apps:['Acterys IFRS','Jet Reports','Solver BI360','Multi Entity Mgmt']}},
ent:{loc:{rec:'fscm',h:'F&SCM rekommenderas för enterprise-finansbolag',s:'Banker och stora försäkringsbolag med 300+ anst. behöver avancerad ekonomistyrning och komplex koncernkonsolidering.',bc:{p:[{t:'Möjligt vid enkla strukturer',d:'Standardiserade finansflöden kan funka i BC.'}],c:[{t:'Koncernkomplexitet',d:'Komplexa elimineringar överstiger BC:s kapacitet.'},{t:'Internredovisning',d:'Djup kostnadsanalys saknas i standard BC.'}]},fscm:{p:[{t:'Avancerad ekonomistyrning',d:'Driver-baserad budgetering, prognos och scenarioanalys.'},{t:'Koncernkonsolidering',d:'Komplexa elimineringar och transfer pricing.'},{t:'Inbyggd BI',d:'Djup analys per legal enhet och instrument.'}],c:[{t:'Inte branschspecifikt',d:'ALM och Solvens II kräver kompletterande system.'},{t:'Implementationstid',d:'12–18 månader.'}]},pills:['Budgetering','Prognos','Koncernkonsolidering','Transfer pricing','BI','Internredovisning'],apps:['Acterys Planning','Jet Reports','Solver BI360','Acterys Consolidation']},
int:{rec:'fscm',h:'Finance & SCM rekommenderas för internationella finanskoncerner',s:'Internationell finanskoncern med IFRS-rapportering och komplex internprissättning behöver F&SCMs ekonomistyrning.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera lokalt om F&SCM är den globala kärnan.'}],c:[{t:'Global konsolidering',d:'Multinationell konsolidering och IFRS överstiger BC.'},{t:'Transfer pricing',d:'OECD-modeller cross-border kräver specialisering.'}]},fscm:{p:[{t:'Global ekonomistyrning',d:'Budgetering och konsolidering i alla länder i ett system.'},{t:'IFRS & compliance',d:'IFRS 9/17, landspecifik rapportering och SOX nativt.'},{t:'Transfer pricing',d:'Internprissättning och OECD-compliance.'}],c:[{t:'Komplex utrullning',d:'18–30 månader.'}]},pills:['Global konsolidering','IFRS','Transfer pricing','SOX','Budgetering','BI'],apps:['Acterys IFRS','Jet Reports','Solver BI360','Vertex TP']}}},
hot:{smb:{loc:{rec:'bc',h:'Business Central passar lokala hotell- och restaurangbolag',s:'Hotell och restauranger med 25–300 anst. väljer BC med certifierade PMS/POS-appar. F&SCM saknar branschspecifika kärnprocesser.',bc:{p:[{t:'Ekonomi & kostnadskontroll',d:'Resultat per enhet, leverantörsstyrning och kostnadskontroll nativt.'},{t:'POS & PMS via certifierad app',d:'Kassalösning och hotellsystem via certifierade appar.'}],c:[{t:'Revenue management',d:'Dynamisk prissättning och channel management kräver specialsystem.'},{t:'F&B-lager',d:'Recepthållning och svinnanalys kräver ISV.'}]},fscm:{p:[{t:'Inget tydligt mervärde',d:'F&SCM är inte anpassat för hotell- och restaurangspecifika processer.'}],c:[{t:'Fel plattform',d:'Saknar PMS, revenue management och F&B-lager.'},{t:'Kostnad',d:'Enterprise-licens ger minimalt mervärde för hotell/restaurang.'}]},pills:['Ekonomistyrning','POS','PMS','Kostnadskontroll','Leverantörer','Rapportering'],apps:['LS Central Hospitality','Mews Connector','Agilysys PMS','Revel POS']},
int:{rec:'bc',h:'BC med certifierade appar räcker för internationella hotell-SMB',s:'Internationella hotell- och restaurangkedjor väljer BC med PMS/POS-integration. F&SCM tillför begränsat mervärde.',bc:{p:[{t:'Multi-currency & moms',d:'Bokningar och fakturering i lokal valuta.'},{t:'Intercompany',d:'Ekonomiflöden mellan hotellbolag nativt.'}],c:[{t:'Lokalisering',d:'Djup local compliance fler än 5–6 länder kräver ISV.'},{t:'Revenue management',d:'Dynamisk prissättning kräver specialsystem.'}]},fscm:{p:[{t:'Inget tydligt mervärde',d:'F&SCM tillför begränsat mervärde i hotell/restaurang.'}],c:[{t:'Fel plattform',d:'Saknar PMS, revenue management och F&B.'},{t:'Överkostnad',d:'Enterprise-licens svår att motivera.'}]},pills:['Multi-currency','PMS','POS','Momshantering','Intercompany','Rapportering'],apps:['LS Central Hospitality','Mews Connector','Avalara AvaTax','Multi Entity Mgmt']}},
ent:{loc:{rec:'bc',h:'BC + certifierade appar är rätt ekosystem för hotell- och restaurangkedjor',s:'Enterprise-hotellkedjor väljer BC med branschspecifika PMS/POS-tillägg. F&SCM ger ekonomistyrningsdjup men saknar hotellspecifika kärnfunktioner.',bc:{p:[{t:'Ekonomistyrning per enhet',d:'Resultat per hotell och restaurang nativt.'},{t:'Certifierade branschappar',d:'LS Central Hospitality ger PMS, POS och F&B.'}],c:[{t:'Revenue management',d:'Avancerad channel management kräver specialsystem.'},{t:'Koncernkonsolidering',d:'Komplex konsolidering av många enheter kräver ISV.'}]},fscm:{p:[{t:'Ekonomistyrning',d:'Avancerad koncernkonsolidering för stora kedjor.'}],c:[{t:'Fel plattform',d:'Saknar hotellspecifika kärnprocesser.'},{t:'Överkostnad',d:'Enterprise-licens ger minimalt mervärde vs BC + ISV.'}]},pills:['PMS','POS','F&B-lager','Revenue management','Ekonomistyrning','Konsolidering'],apps:['LS Central Hospitality','Mews Connector','Agilysys PMS','Acterys Consolidation']},
int:{rec:'bc',h:'BC rekommenderas även för internationella enterprise-hotellkedjor',s:'Internationell hotellkoncern väljer BC med branschspecifika ISV-appar. F&SCM tillför inte tillräckligt mervärde.',bc:{p:[{t:'Global ekonomistyrning',d:'Multi-currency, intercompany och konsolidering för internationella kedjor.'},{t:'Branschappar globalt',d:'Certifierade PMS/POS-appar finns för de flesta marknader.'}],c:[{t:'Lokalisering',d:'Djup lokal compliance i fler än 6 länder kräver ISV.'},{t:'Revenue management',d:'Avancerade prissättningsmodeller kräver specialsystem.'}]},fscm:{p:[{t:'Global konsolidering',d:'Avancerad multinationell konsolidering för mycket stora kedjor.'}],c:[{t:'Saknar kärnan',d:'PMS och POS saknas – kräver samma ISV ändå.'},{t:'Dubbel kostnad',d:'F&SCM-licens ovanpå ISV ger dålig ROI.'}]},pills:['Multi-currency','PMS global','POS','Konsolidering','Revenue mgmt','Lokalisering'],apps:['LS Central Hospitality','Mews Connector','Avalara AvaTax','Acterys Consolidation']}}},
byg:{smb:{loc:{rec:'bc',h:'Business Central passar de flesta byggbolag upp till 300 anst.',s:'Byggbolag med lokala projekt hittar projektredovisning, inköp och resursstyrning i BC. Entreprenadjuridik förstärks med ISV.',bc:{p:[{t:'Projektredovisning & WIP',d:'Projektbudget, inköp mot projekt och WIP-redovisning nativt.'},{t:'Inköp & underleverantörer',d:'Inköpsorder och underleverantörsavtal i BC.'}],c:[{t:'Kalkylering',d:'Avancerad anbuds- och produktionskalkyl kräver branschspecifik ISV.'},{t:'Entreprenadjuridik',d:'ÄTA-hantering och AB 04-koppling kräver certifierade appar.'}]},fscm:{p:[{t:'Inget tydligt mervärde',d:'F&SCM är inte optimerat för byggbranschens entreprenadjuridik.'}],c:[{t:'Fel plattform',d:'Saknar entreprenadjuridik, ÄTA och anbudskalkylering.'},{t:'Kostnad',d:'Svår att motivera för SMB-byggbolag.'}]},pills:['Projektredovisning','WIP','Inköp','Underleverantörer','ÄTA','Kalkyl'],apps:['Byggtid','LetsBuild','Apteryx Projects','Insight Works BC']},
int:{rec:'bc',h:'BC täcker internationella SMB-byggbolag',s:'Internationella byggbolag med projekt i flera länder klarar multi-currency i BC. Branschspecifika delar kräver ISV oavsett ERP-val.',bc:{p:[{t:'Multi-currency & intercompany',d:'Projektfakturering i lokal valuta nativt.'},{t:'Projektredovisning',d:'WIP och projektresultat per land.'}],c:[{t:'Lokala entreprenadrättskrav',d:'Lokala kontraktsmodeller kräver ISV per land.'},{t:'Tull & import',d:'Import av byggmaterial med tullhantering kräver tillägg.'}]},fscm:{p:[{t:'Global ekonomistyrning',d:'Avancerad konsolidering för internationella byggkoncerner.'}],c:[{t:'Saknar byggspecifikt',d:'Entreprenadjuridik och ÄTA saknas – kräver samma ISV ändå.'},{t:'Överkostnad',d:'Minimalt mervärde jämfört med BC + ISV.'}]},pills:['Multi-currency','WIP','Projektresultat','Intercompany','Import','Kalkyl'],apps:['Byggtid','Avalara AvaTax','Multi Entity Mgmt','LetsBuild']}},
ent:{loc:{rec:'bc',h:'BC + branschappar är rätt ekosystem för enterprise-byggbolag',s:'Stora byggbolag väljer BC med certifierade branschappar för kalkyl, entreprenadjuridik och projektstyrning.',bc:{p:[{t:'Projektredovisning & WIP',d:'Detaljerad kostnadskontroll per projekt och etapp.'},{t:'Certifierade branschappar',d:'Kalkyl, ÄTA och entreprenadjuridik via certifierade appar.'}],c:[{t:'Koncernkonsolidering',d:'Komplexa projektbolagsstrukturer kräver ISV.'},{t:'Resursstyrning',d:'Maskin- och personaldisponering kräver branschspecifika appar.'}]},fscm:{p:[{t:'Ekonomistyrning & konsolidering',d:'Avancerad konsolidering för stora byggkoncerner.'}],c:[{t:'Saknar kärnan',d:'Entreprenadjuridik saknas – kräver samma ISV ändå.'},{t:'Överkostnad',d:'Dålig ROI för byggbolag vs BC + ISV.'}]},pills:['Projektredovisning','WIP','Kalkyl','ÄTA','Resursstyrning','Konsolidering'],apps:['Byggtid','LetsBuild','Acterys Consolidation','Insight Works BC']},
int:{rec:'bc',h:'BC rekommenderas även för internationella enterprise-byggkoncerner',s:'Internationella byggkoncerner väljer BC med branschspecifika appar. F&SCM ger ekonomistyrningsdjup men saknar entreprenadjuridiska kärnfunktioner.',bc:{p:[{t:'Global ekonomistyrning',d:'Multi-currency, intercompany och konsolidering för internationella projekt.'},{t:'Branschappar globalt',d:'Certifierade appar för kalkyl finns för de flesta marknader.'}],c:[{t:'Lokala entreprenadrättskrav',d:'Lokala kontraktsmodeller per land kräver ISV.'},{t:'Konsolidering',d:'Komplex projektbolagskonsolidering kräver tillägg.'}]},fscm:{p:[{t:'Global konsolidering',d:'Avancerad konsolidering för mycket stora byggkoncerner.'}],c:[{t:'Saknar kärnan',d:'Byggspecifika processer saknas – kräver samma ISV ändå.'},{t:'Dubbel kostnad',d:'Sämre ROI än BC + ISV.'}]},pills:['Multi-currency','Global WIP','Kalkyl','ÄTA','Konsolidering','Projektstyrning'],apps:['Byggtid','Avalara AvaTax','Acterys Consolidation','LetsBuild']}}},
tra:{smb:{loc:{rec:'bc',h:'Business Central passar lokala transport- och logistikbolag',s:'Åkerier och speditörer med 25–300 anst. hittar ekonomi, inköp och fakturering i BC. TMS och fraktoptimering tillkommer via ISV.',bc:{p:[{t:'Ekonomi & fakturering',d:'Resultatredovisning per fordon eller kund nativt.'},{t:'Inköp & leverantörer',d:'Drivmedelsinköp, leasing och underhållskostnader i BC.'}],c:[{t:'TMS saknas',d:'Ruttoptimering och körorderhantering kräver ISV.'},{t:'Branschcompliance',d:'Kör- och vilotider kräver specialiserade system.'}]},fscm:{p:[{t:'Inbyggt TMS',d:'Ruttoptimering och transportplanering nativt.'}],c:[{t:'Överkostnad för SMB',d:'F&SCM:s TMS-bredd motiveras sällan under 300 anst.'},{t:'Komplexitet',d:'Kräver dedikerade resurser.'}]},pills:['Ekonomistyrning','Fakturering','Inköp','TMS via ISV','Fordonsanalys','Rapportering'],apps:['Boltrics TMS','3PL Dynamics','Freightos Connect','Insight Works BC']},
int:{rec:'both',h:'BC + TMS-ISV räcker ofta – F&SCM vid komplex global logistik',s:'Internationella transportbolag klarar multi-currency i BC med TMS-tillägg. Komplex global fraktoptimering och tullhantering pekar mot F&SCM.',bc:{p:[{t:'Multi-currency & moms',d:'Fakturering i lokal valuta nativt.'},{t:'TMS via certifierad app',d:'Internationell fraktoptimering via certifierade TMS-appar.'}],c:[{t:'Global tullhantering',d:'Export och dual-use kräver specialiserade tillägg.'},{t:'Avancerad rutt-AI',d:'AI-driven ruttoptimering kräver specialiserat TMS.'}]},fscm:{p:[{t:'Inbyggt TMS & tull',d:'Ruttoptimering och tullhantering nativt.'},{t:'Global supply chain',d:'End-to-end synlighet i internationella transportflöden.'}],c:[{t:'Kostnad vs nytta',d:'F&SCM:s TMS motiveras av volym och komplexitet, inte SMB.'}]},pills:['Multi-currency','TMS','Tullhantering','Ruttoptimering','Intercompany','Compliance'],apps:['Boltrics TMS','Avalara AvaTax','3PL Dynamics','CTC Global Trade']}},
ent:{loc:{rec:'fscm',h:'F&SCM rekommenderas för enterprise-logistikbolag',s:'Stora logistikbolag med egna terminaler och komplexa fraktflöden behöver F&SCMs inbyggda TMS och WMS.',bc:{p:[{t:'Möjligt med TMS-ISV',d:'BC med certifierade TMS-appar täcker medelkomplexa transportflöden.'}],c:[{t:'Avancerad ruttoptimering',d:'AI-driven ruttoptimering kräver F&SCM eller specialiserat TMS.'},{t:'WMS-djup',d:'Terminal- och lagerhantering kräver F&SCM.'}]},fscm:{p:[{t:'Inbyggt TMS & WMS',d:'Ruttoptimering, containerstyrning och lagerhantering nativt.'},{t:'Realtidsspårning',d:'Fordon och gods i realtid via Azure IoT.'},{t:'Spend-analys',d:'Inköp av frakt och underhåll med leverantörsanalys.'}],c:[{t:'Implementationstid',d:'12–24 månader.'}]},pills:['TMS','WMS','Ruttoptimering','IoT-spårning','Spend-analys','Containerstyrning'],apps:['Boltrics TMS','Körber WMS','Azure IoT Central','Acterys Analytics']},
int:{rec:'fscm',h:'Finance & SCM rekommenderas för internationell enterprise-logistik',s:'Internationellt logistikbolag med multi-country terminaler, global fraktoptimering och exportkontrollkrav behöver F&SCMs TMS och WMS.',bc:{p:[{t:'Satellite-system',d:'BC kan fungera lokalt om F&SCM är den globala kärnan.'}],c:[{t:'Global TMS & WMS',d:'Flerländers fraktoptimering överstiger BC.'},{t:'Tull & exportkontroll',d:'Dual-use och tulldeklaration kräver F&SCM.'}]},fscm:{p:[{t:'Global TMS & WMS',d:'Ruttoptimering och lagerhantering i alla länder.'},{t:'Tull & exportkontroll',d:'Inbyggt stöd för dual-use och tullhantering.'},{t:'AI-prognos',d:'Kapacitetsprognos för internationella flöden.'}],c:[{t:'Komplex utrullning',d:'18–30 månader.'}]},pills:['Global TMS','WMS','Tullkontroll','Ruttoptimering','AI-prognos','Containerstyrning'],apps:['Boltrics TMS','Körber WMS','Avalara','CTC Global Trade']}}}
};

const SECTORS = [
  { group: "Industri", items: [{ v: "dis", l: "Diskret tillverkning" }, { v: "pro", l: "Processindustri" }] },
  { group: "Handel", items: [{ v: "ret", l: "Detaljhandel" }, { v: "gro", l: "Grossister / partihandel" }] },
  { group: "Tjänster", items: [{ v: "ftj", l: "Företagstjänster & konsult" }, { v: "it", l: "IT & telekommunikation" }, { v: "fin", l: "Finans & försäkring" }, { v: "hot", l: "Hotell & restaurang" }] },
  { group: "Bygg & transport", items: [{ v: "byg", l: "Bygg & anläggning" }, { v: "tra", l: "Transport & logistik" }] },
];

const SZ_OPTS = [
  { v: "smb", l: "Mindre/medelstora (25–300 anst.)" },
  { v: "ent", l: "Corporate / Enterprise (300+ anst.)" },
];

const GEO_OPTS = [
  { v: "loc", l: "Lokalt verksamma" },
  { v: "int", l: "Internationellt verksamma" },
];

const LE_OPTS = [
  { v: "1", l: "1 bolag" },
  { v: "2-5", l: "2–5 bolag" },
  { v: "6-15", l: "6–15 bolag" },
  { v: "16+", l: "16+ bolag" },
];

function leNote(rec: string, le: string) {
  if (le === "1" || le === "2-5") return null;
  if (le === "6-15") {
    if (rec === "fscm") return { type: "green" as const, text: "Antal juridiska bolag bekräftar valet: 6–15 bolag innebär komplex intercompany och konsolidering. Finance & SCM är arkitektoniskt byggt för detta." };
    if (rec === "bc") return { type: "amber" as const, text: "Observera: 6–15 juridiska bolag ökar komplexiteten för intercompany och konsolidering markant. Business Central klarar detta med ISV-tillägg (ex. Acterys, Jet Reports), men utvärdera om koncernstrukturen kan växa ytterligare – i så fall motiveras Finance & SCM." };
    return { type: "amber" as const, text: "Viktigt faktum: 6–15 juridiska bolag är en tydlig signal att utvärdera Finance & SCM noggrant. Intercompany, elimineringar och transfer pricing i denna skala belastar Business Central." };
  }
  if (le === "16+") {
    if (rec === "fscm") return { type: "green" as const, text: "Antal juridiska bolag bekräftar starkt valet: 16+ bolag kräver avancerad koncernkonsolidering, transfer pricing och elimineringar – Finance & SCM är designat för precis detta." };
    return { type: "red" as const, text: "Starkt vägledande mot Finance & SCM: 16+ juridiska bolag innebär en komplexitetsnivå i koncernredovisning, transfer pricing och elimineringar som Finance & SCM är arkitektoniskt byggt för. Business Central med ISV-tillägg är tekniskt möjligt men sällan optimalt i denna skala." };
  }
  return null;
}

const ToggleButtons = ({ options, value, onChange, label }: { options: { v: string; l: string }[]; value: string; onChange: (v: string) => void; label?: string }) => (
  <div className="space-y-2">
    {label && <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>}
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`px-5 py-2.5 text-sm rounded-xl border-2 transition-all whitespace-nowrap font-medium shadow-sm ${
            value === o.v
              ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
              : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:bg-primary/5 hover:shadow"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  </div>
);

const CardItem = ({ title, desc, type }: { title: string; desc: string; type: "strength" | "limitation" }) => (
  <div className="bg-card border border-border rounded-lg p-3 mb-2">
    <div className="text-sm font-medium text-card-foreground mb-1">{title}</div>
    <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-2 font-medium ${
      type === "strength" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }`}>
      {type === "strength" ? "Styrka" : "Begränsning"}
    </span>
  </div>
);

const IndustryComparisonWidget = () => {
  const [sec, setSec] = useState("dis");
  const [sz, setSz] = useState("smb");
  const [geo, setGeo] = useState("loc");
  const [le, setLe] = useState("1");
  const [showApps, setShowApps] = useState(false);

  const entry = useMemo(() => {
    return D[sec]?.[sz]?.[geo] ?? null;
  }, [sec, sz, geo]);

  const note = useMemo(() => {
    if (!entry) return null;
    return leNote(entry.rec, le);
  }, [entry, le]);

  const recLabel = entry?.rec === "bc" ? "Rekommendation: Business Central" : entry?.rec === "fscm" ? "Rekommendation: Finance & SCM" : "Utvärdera båda";
  const recColor = entry?.rec === "bc" ? "bg-[hsl(210_60%_90%)] text-[hsl(210_60%_30%)]" : entry?.rec === "fscm" ? "bg-[hsl(250_50%_92%)] text-[hsl(250_50%_30%)]" : "bg-secondary text-foreground";

  return (
    <div className="space-y-6">
      {/* Sector select */}
      <div className="bg-secondary/30 rounded-xl p-5 border border-border space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Välj bransch</label>
        <select
          value={sec}
          onChange={e => setSec(e.target.value)}
          className="h-11 w-full px-4 text-sm border-2 border-border rounded-xl bg-card text-card-foreground cursor-pointer font-medium focus:border-primary focus:outline-none transition-colors"
        >
          {SECTORS.map(g => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map(i => <option key={i.v} value={i.v}>{i.l}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Size & Geo */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-secondary/30 rounded-xl p-5 border border-border">
          <ToggleButtons options={SZ_OPTS} value={sz} onChange={setSz} label="Företagsstorlek" />
        </div>
        <div className="bg-secondary/30 rounded-xl p-5 border border-border">
          <ToggleButtons options={GEO_OPTS} value={geo} onChange={setGeo} label="Geografisk räckvidd" />
        </div>
      </div>

      {/* Legal entities */}
      <div className="bg-secondary/30 rounded-xl p-5 border border-border space-y-3">
        <div>
          <div className="text-sm font-semibold text-card-foreground">Hur många juridiska bolag behöver systemet hantera?</div>
          <div className="text-xs text-muted-foreground mt-0.5">Inkluderar holdingbolag, dotterbolag och utländska enheter</div>
        </div>
        <ToggleButtons options={LE_OPTS} value={le} onChange={setLe} />
      </div>

      {/* BC apps toggle */}
      <div className="flex items-center gap-3 p-4 bg-[hsl(210_60%_97%)] dark:bg-[hsl(210_30%_15%)] border-2 border-[hsl(210_60%_85%)] dark:border-[hsl(210_30%_30%)] rounded-xl flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">BC-tillägg:</span>
        <button
          onClick={() => setShowApps(!showApps)}
          className={`px-4 py-2 text-xs rounded-xl border-2 font-semibold transition-all ${
            showApps
              ? "bg-[hsl(210_60%_50%)] text-white border-[hsl(210_60%_45%)] shadow-md"
              : "bg-card text-muted-foreground border-border hover:border-[hsl(210_60%_60%)]"
          }`}
        >
          {showApps ? "✓ " : ""}Visa certifierade appar för BC
        </button>
        <span className="text-[11px] text-muted-foreground/70">Appar godkända av Microsoft</span>
      </div>

      {/* Result */}
      {entry && (
        <div className="space-y-3">
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${recColor}`}>
            {recLabel}
          </span>

          <div className="grid md:grid-cols-2 gap-3">
            {/* BC column */}
            <div>
              <div className="p-3 rounded-lg mb-2 bg-[hsl(210_60%_95%)] text-[hsl(210_60%_30%)]">
                <div className="text-sm font-medium">Business Central</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(210 60% 40%)" }}>Dynamics 365 BC{showApps ? " + certifierade appar" : ""}</div>
              </div>
              {entry.bc.p.map((p, i) => <CardItem key={`bp${i}`} title={p.t} desc={p.d} type="strength" />)}
              {entry.bc.c.map((c, i) => <CardItem key={`bc${i}`} title={c.t} desc={c.d} type="limitation" />)}
              {showApps && entry.apps.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Certifierade BC-appar (Microsoft)</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.apps.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(210_60%_95%)] text-[hsl(210_60%_30%)] border border-[hsl(210_60%_85%)] font-medium">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* F&SCM column */}
            <div>
              <div className="p-3 rounded-lg mb-2 bg-[hsl(250_50%_95%)] text-[hsl(250_50%_30%)]">
                <div className="text-sm font-medium">Finance & SCM</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(250 50% 40%)" }}>Dynamics 365 F&SCM</div>
              </div>
              {entry.fscm.p.map((p, i) => <CardItem key={`fp${i}`} title={p.t} desc={p.d} type="strength" />)}
              {entry.fscm.c.map((c, i) => <CardItem key={`fc${i}`} title={c.t} desc={c.d} type="limitation" />)}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-card-foreground mb-1">{entry.h}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{entry.s}</div>
            <div className="flex flex-wrap gap-1 mt-3">
              {entry.pills.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">{p}</span>
              ))}
            </div>
          </div>

          {/* LE Note */}
          {note && (
            <div className={`rounded-lg p-4 text-xs leading-relaxed ${
              note.type === "green" ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" :
              note.type === "red" ? "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" :
              "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
            }`}>
              {note.text}
            </div>
          )}

          {/* CTA links */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <a href="/business-central/" className="px-4 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground hover:bg-secondary transition-colors">
              Mer om Business Central
            </a>
            <a href="/finance-supply-chain/" className="px-4 py-2 text-sm border border-border rounded-lg bg-card text-card-foreground hover:bg-secondary transition-colors">
              Mer om Finance & SCM
            </a>
            <a href="/kontakta-oss/" className="px-4 py-2 text-sm border border-primary rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Kontakta oss ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryComparisonWidget;
