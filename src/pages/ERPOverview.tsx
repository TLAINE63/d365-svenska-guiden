import ProductHero from "@/components/ProductHero";
import FunnelCTA from "@/components/FunnelCTA";
import PageOfferBanner from "@/components/PageOfferBanner";
import RelatedPages, { erpRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Coins,
  Clock,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import LeadCTA from "@/components/LeadCTA";
import IndustryComparisonWidget from "@/components/IndustryComparisonWidget";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";

// Breadcrumb items
const erpBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
];


const honestFacts = [
  { icon: Coins, title: "Licenspriset är inte totalkostnaden", body: "Räkna med 3–5x licenskostnaden för implementation första året, och 15–25 % av licensen i löpande förvaltning per år." },
  { icon: Clock, title: "Tiden går till data och processer", body: "60–70 % av projekttiden går till datatvätt, processdefinition och tester. Själva systemkonfigurationen är minoriteten." },
  { icon: Users, title: "Partnervalet slår produktvalet", body: "Samma Business Central kan upplevas helt olika beroende på partner. Branscherfarenhet och referenser är viktigare än timpris." },
  { icon: AlertTriangle, title: "Anpassningar kostar för evigt", body: "Varje specialanpassning måste underhållas vid varje uppgradering. Anpassa bara där det ger äkta konkurrensfördel." },
  { icon: Lightbulb, title: "Standard slår skräddarsytt", body: "Microsoft uppgraderar BC och F&SCM löpande. Den som följer standard får ny funktionalitet gratis. Den som anpassat får teknisk skuld." },
  { icon: CheckCircle2, title: "Börja med en köparsidig analys", body: "En behovsanalys utan säljincitament tar några timmar och sparar ofta hundratusentals kronor i felval senare." },
];


// ERP FAQs for schema – priser hämtas från product_prices via resolvePriceTokens
const erpFaqsRaw = [
 {
 question: "Vad står ERP för?",
 answer: "ERP står för Enterprise Resource Planning, på svenska affärssystem eller verksamhetssystem. Begreppet betyder att företagets resurser – ekonomi, lager, inköp, försäljning, produktion och personal – planeras och följs upp i ett och samma system med en gemensam databas."
 },
 {
 question: "Vad är ett ERP-system?",
 answer: "Ett ERP-system är den programvara som håller ihop företagets kärnprocesser i en gemensam databas: kundorder, inköp, lagersaldon, tillverkning, projekt och redovisning uppdateras i samma flöde. Microsofts ERP-system heter Dynamics 365 Business Central (mindre och medelstora bolag) samt Dynamics 365 Finance & Supply Chain Management (större koncerner)."
 },
 {
 question: "Vad är skillnaden mellan ERP och affärssystem?",
 answer: "Ingen – det är samma sak. ERP är den engelska förkortningen (Enterprise Resource Planning) och affärssystem är den svenska termen. I svenska upphandlingar används orden omväxlande. Skillnaden du behöver bry dig om är i stället mellan ett ekonomisystem (bokföring och fakturering) och ett fullt affärssystem som även täcker lager, produktion, projekt och service."
 },
 {
 question: "Hur väljer man affärssystem?",
 answer: "I fyra steg: 1) Kartlägg dina processer och vilka av dem som verkligen skiljer dig från konkurrenterna. 2) Skriv en kravspecifikation där kraven är rangordnade – måste, bör, trevligt. 3) Utvärdera 2–3 system mot kraven med demo på din egen data, inte på leverantörens standardexempel. 4) Utvärdera partnern lika hårt som systemet: branscherfarenhet, teamstorlek, förvaltningsmodell och referenser du får ringa upp. På d365.se kan du göra en kostnadsfri behovsanalys och sedan jämföra partners utan att bli kontaktad av säljare i onödan."
 },
 {
 question: "Vilket affärssystem är bäst?",
 answer: "Det finns inget affärssystem som är bäst för alla – frågan är vilket som passar din processprofil, storlek och bransch. Villkoren avgör: har du 5–300 användare och behöver ekonomi, lager, projekt och enklare tillverkning är Business Central oftast rätt nivå. Har du flera juridiska enheter, global supply chain och avancerad tillverkning är Finance & Supply Chain Management rätt nivå. Har du huvudsakligen bokföring och fakturering räcker ofta ett ekonomisystem. Vi rankar inte leverantörer generellt, eftersom ett sådant påstående inte går att belägga."
 },
 {
 question: "Vad ska ett affärssystem innehålla?",
 answer: "Grundmodulerna är redovisning och reskontror, kund- och leverantörshantering, order och fakturering, lager och inköp samt rapportering. Beroende på verksamhet tillkommer produktion (MRP och kapacitetsplanering), projektredovisning, service och fältservice, e-handelsintegration, EDI och e-faktura samt behörighets- och attestflöden. Ta också med tekniska krav: integration mot befintliga system, dataexport, spårbarhet och stöd för svenska regelverk."
 },
 {
 question: "Vad kostar ett affärssystem?",
 answer: "Kostnaden består av tre delar: licens per användare och månad, ett engångspris för implementering och en löpande förvaltningskostnad. För Microsofts ERP är licensen {{price:bc-essentials:short}} för Business Central Essentials, {{price:bc-premium:short}} för Premium och ca {{price:finance:short}} för Dynamics 365 Finance. Implementeringen ligger typiskt på 100 000–250 000 kr för ett litet Business Central-projekt, 250 000–800 000 kr för ett normalstort och 1–5 MSEK för ett Finance & Supply Chain-projekt. Räkna dessutom med 10–20 % av projektkostnaden per år för förvaltning och vidareutveckling."
 },
 {
 question: "Vilket ERP-system passar för entreprenadföretag?",
 answer: "Entreprenad- och byggföretag behöver projektredovisning med successiv vinstavräkning, ÄTA-hantering, tidrapportering per projekt, maskin- och materialhantering samt uppföljning per arbetsorder. Business Central täcker detta med projektmodulen och ett branschtillägg – i Sverige används bland annat lösningar byggda på Business Central för bygg och installation. Större entreprenadkoncerner med många juridiska enheter hamnar oftare i Finance & Supply Chain Management. Vilket som passar dig avgörs av antal samtidiga projekt, hur mycket egen produktion du har och om du behöver konsolidera flera bolag."
 },
 {
 question: "Vilket ERP system passar bäst i Sverige – jämförelse Business Central vs Finance & SCM?",
 answer: "ERP system jämförelse Sverige: Business Central är bäst för företag med 5–300 användare och omsättning under 1–2 miljarder – det täcker ekonomi, lager, försäljning och produktion i ett kostnadseffektivt molnsystem. Dynamics 365 Finance & Supply Chain Management (F&SCM) passar stora internationella koncerner med komplexa regulatoriska krav, multinationell ekonomistyrning och avancerad supply chain. Huvudskillnad: BC kostar {{price:bc-essentials:short}} vs F&SCM ca {{price:finance:short}} per användare."
 },
 {
 question: "Vad kostar Microsoft ERP system i Sverige?",
 answer: "Microsoft ERP pris Sverige: Business Central Essentials {{price:bc-essentials:short}}, Business Central Premium {{price:bc-premium:short}}, Dynamics 365 Finance ca {{price:finance:short}} och Supply Chain Management ca {{price:supply-chain-management:short}}. Implementeringskostnaden varierar: Business Central startpaket från 150 000 kr, F&SCM Enterprise-projekt från 1–5 MSEK. Välj rätt licens utifrån antal användare och funktionsbehov."
 },
 {
 question: "Vad är skillnaden mellan Business Central och Finance & Supply Chain?",
 answer: "Business Central är designat för SMB (5–300 användare) och täcker ekonomi, lager, försäljning och produktion (Premium). Finance & Supply Chain Management riktar sig till enterprise med krav på global juridisk struktur, avancerat MRP/MPS, WMS och komplexa internprissättningsregler. Business Central är snabbare att implementera (3–6 mån vs 9–18 mån) och har lägre total ägandekostnad för de flesta medelstora företag."
 },
 {
 question: "Hur lång tid tar ERP implementation i Sverige med Dynamics 365?",
 answer: "ERP implementation Sverige: Business Central tar typiskt 3–6 månader. Dynamics 365 Finance & Supply Chain Management kräver normalt 9–18 månader. Tidsåtgången beror på komplexitet, antal anpassningar och hur väl förberedda processer och data är. Microsoft-certifierade partners arbetar enligt Success by Design-metodik för att säkra projektleveransen."
 },
 {
 question: "Vilket Microsoft ERP-system passar mitt företag?",
 answer: "Välj Business Central om: du har 5–300 användare, omsättning under 1–2 miljarder, behov av ett komplett men lätthanterligt system. Välj Finance & SCM om: du är en global koncern med flera juridiska entiteter, komplexa regulatoriska krav, avancerad tillverkning med MRP/MPS eller global supply chain. En köparsidig behovsanalys hjälper dig välja rätt – utan säljpåverkan."
 },
 {
 question: "Vad är ett affärssystem?",
 answer: "Ett affärssystem (ERP – Enterprise Resource Planning) är ett samlat verksamhetssystem som hanterar ekonomi, lager, inköp, försäljning, produktion och ofta även projekt och service i en gemensam databas. Syftet är att ersätta öar av Excel och fristående system med en enda källa till sanning så att hela företaget arbetar mot samma siffror i realtid."
 },
 {
 question: "Vilka är de vanligaste misstagen vid val av affärssystem?",
 answer: "1) Att låta licenspris styra mer än totalkostnad och processpassning. 2) Att hoppa över en köparsidig behovsanalys och köpa det partnern råkar sälja mest av. 3) Att underskatta tiden för datatvätt och integration. 4) Att inte involvera nyckelanvändare tidigt. 5) Att välja partner enbart på pris istället för branscherfarenhet och referenser."
 },
 {
 question: "Behöver vi en Microsoft-partner för att implementera Dynamics 365 ERP?",
 answer: "Ja, alla Dynamics 365 ERP-implementeringar görs via Microsoft-certifierade partners (Solutions Partner for Business Applications). Valet av rätt partner är lika viktigt som valet av system – en erfaren partner med branschkännedom kan halvera implementationstiden. På d365.se kan du jämföra och filtrera certifierade ERP-partners baserat på din bransch och geografi kostnadsfritt."
 },
 {
 question: "Kan Microsoft Dynamics 365 ERP integreras med befintliga system?",
 answer: "Ja, Dynamics 365 ERP integreras via REST API:er, Microsoft Power Platform (Power Automate) och ett rikt ekosystem av färdiga kopplings-appar mot vanliga system som Shopify, Magento, EDI-lösningar, lönesystem och branschspecifika applikationer. Business Central har inbyggd Shopify-integration. F&SCM har djupare enterprise-integrationsmöjligheter via Azure Integration Services."
 },
];
const erpFaqs = erpFaqsRaw.map((f) => ({ ...f, answer: resolvePriceTokens(f.answer) }));

import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

const ERPOverview = () => {
 useEffect(() => {
 if (window.location.hash) {
 setTimeout(() => {
 const el = document.querySelector(window.location.hash);
 if (el) el.scrollIntoView({ behavior: "smooth" });
 }, 100);
 } else {
 window.scrollTo(0, 0);
 }
 }, []);

 return (
 <div className="min-h-screen">
 <SEOHead 
 title="Affärssystem & ERP 2026 – guide & partners"
 description={resolvePriceTokens("Vad ett affärssystem är, vad det kostar och hur du väljer rätt – med fokus på Microsoft Dynamics 365 Business Central ({{price:bc-essentials:short}}) och Finance & Supply Chain ({{price:finance:short}}).")}
 canonicalPath="/erp"
 keywords="affärssystem, erp, erp system, erp system sverige, vad är ett affärssystem, affärssystem sverige, affärssystem jämförelse, affärssystem pris, välja affärssystem, microsoft erp, dynamics 365 erp, business central vs finance scm, dynamics 365 finance supply chain, microsoft affärssystem"
 ogImage="https://d365.se/og-erp.png"
 />
 <ServiceSchema 
 name="Affärssystem & Microsoft Dynamics 365 ERP – köparsidig guide"
 description="Köparsidig guide och jämförelse av affärssystem i Sverige med fokus på Microsoft Dynamics 365: Business Central för mindre och medelstora företag, Finance & Supply Chain Management för stora organisationer. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 />
 <FAQSchema faqs={erpFaqs} />
 <BreadcrumbSchema items={erpBreadcrumbs} />
 <Navbar />
 <main>
 
 {/* Header */}
 <ProductHero
 eyebrow="Pelarsida · Köparsidig guide"
 title="Affärssystem (ERP) – vad det är."
 titleAccent="Så väljer du rätt utan säljpåverkan."
 subhead="Vad är ett affärssystem, vad kostar det, hur lång tid tar det att införa och vilket av Microsofts två alternativ – Business Central eller Finance & Supply Chain Management – passar dig bäst? Här får du svaren utan säljpress."
 primary={{ label: "Gör en kostnadsfri behovsanalys", to: "/ERPbehovsanalys/", icon: ClipboardList }}
 secondary={{ label: "Jämför Business Central vs Finance & Supply Chain", href: "#comparison" }}
 />

 {/* TAYA: Vad är ett affärssystem */}
 <section className="py-8 sm:py-12 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
 Vad är ett affärssystem – egentligen?
 </h2>
 <p className="text-lg text-muted-foreground mb-4">
 Ett affärssystem (ERP – Enterprise Resource Planning) är ett samlat verksamhetssystem som hanterar
 ekonomi, lager, inköp, försäljning, produktion och ofta även projekt och service i en gemensam
 databas. Syftet är enkelt: en sanning för hela företaget i stället för Excel-ark som inte stämmer
 överens med varandra.
 </p>
 <p className="text-lg text-muted-foreground mb-4">
 I praktiken är affärssystemet den ryggrad som styr hur ordrar, fakturor, lagersaldon, inköp och
 redovisning hänger ihop. När en säljare lägger en order ska den synas på lagret, i ekonomin och i
 rapporterna – utan dubbelregistrering. Det är där värdet uppstår, och det är också där de flesta
 ERP-projekt misslyckas: när processerna inte är genomtänkta innan systemet införs.
 </p>
 <p className="text-lg text-muted-foreground">
 Microsoft erbjuder två affärssystem inom Dynamics 365-familjen:&nbsp;
 <Link to="/businesscentral/" className="text-primary font-medium hover:underline">Business Central</Link> för mindre och medelstora bolag, och&nbsp;
 <Link to="/finance-supply-chain/" className="text-primary font-medium hover:underline">Finance &amp; Supply Chain Management</Link> för stora, internationella organisationer. Jämförelsen längre ned visar var skillnaderna får praktisk betydelse – i ekonomi, supply chain, internationell drift och i hur mycket som kan konfigureras kontra utvecklas.
 </p>
 </div>
 </div>
 </section>

 {/* TAYA: Ärliga fakta */}
 <section className="py-8 sm:py-12 bg-secondary/40">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-5xl mx-auto">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
 Det här säger ingen leverantör – men du behöver veta det
 </h2>
 <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
 Vi tror på radikal transparens. Här är de sex sakerna som avgör om ett ERP-projekt blir lyckat
 eller en mardröm.
 </p>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {honestFacts.map((item) => (
 <div key={item.title} className="bg-card border border-border rounded p-6">
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
 <item.icon className="h-5 w-5 text-primary" />
 </div>
 <h3 className="font-semibold text-card-foreground">{item.title}</h3>
 </div>
 <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Introduction Section */}
 <section id="comparison-intro" className="py-8 sm:py-12 md:py-16 bg-background scroll-mt-24">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto text-center">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
 Vilket ERP passar er verksamhet?
 </h2>
 <p className="text-lg text-muted-foreground mb-8">
 Båda systemen tillhör Dynamics 365-familjen, men de är konstruerade för olika typer av komplexitet. Nedanstående jämförelse visar var skillnaderna faktiskt får praktisk betydelse – i ekonomihantering, supply chain, internationell drift och i hur stor del av lösningen som behöver konfigureras kontra utvecklas.
 </p>
 
 {/* Industry Comparison Widget */}
 <div id="branschjamforelse" className="bg-card rounded p-6 sm:p-8 border border-border mb-8 scroll-mt-24">
 <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Branschjämförelse: Business Central vs Finance & Supply Chain Management</h3>
 <p className="text-sm text-muted-foreground text-center mb-4">Välj din bransch, storlek och geografi för att få en skräddarsydd rekommendation</p>
 <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-3xl mx-auto">
 <strong className="text-foreground">En viktig reservation:</strong> Det är svårt att ge en helt rättvisande bild enbart utifrån dessa parametrar. Verkligheten är mer nyanserad – processernas komplexitet, befintliga systemlandskap, interna resurser och långsiktig tillväxtstrategi spelar alla in. Dessutom finns det ett brett ekosystem av tilläggsapplikationer till båda produkterna som tillför significant funktionalitet. Det gäller i synnerhet Business Central, där Microsofts Marketplace-marknadsplats innehåller hundratals etablerade tilläggsappar som täcker branschspecifika behov, avancerad WMS, APS, BI och mycket mer. Aktivera "Inkludera etablerade tilläggsappar till BC" nedan för att se hur BC:s ekosystem täpper igen gapen mot F&SCM i det valda segmentet – och få en mer rättvisande helhetsbild.
 </p>
 <IndustryComparisonWidget />
 </div>

 <div className="bg-primary/10 rounded p-6 sm:p-8 border border-primary/20">
 <div className="flex items-center justify-center gap-2 mb-4">
 <ClipboardList className="h-6 w-6 text-primary" />
 <h3 className="text-xl font-semibold text-foreground">Osäker på valet?</h3>
 </div>
 <p className="text-muted-foreground mb-4">
 Gör vår kostnadsfria ERP-behovsanalys för att få en personlig rekommendation 
 baserad på er verksamhet, storlek och specifika behov.
 </p>
 <Link to="/ERPbehovsanalys/">
 <Button className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
 Skapa en behovsanalys
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* Comparison Section */}
 <section id="comparison" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4">
 <div className="max-w-5xl mx-auto">
 <div className="text-center mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
 Business Central vs Finance & Supply Chain
 </h2>
 <p className="text-lg text-muted-foreground">
 Två kraftfulla ERP-system – men för olika behov
 </p>
 </div>
 
 <div className="grid md:grid-cols-2 gap-8">
 {/* Business Central */}
 <div className="bg-card rounded-lg p-6 sm:p-8 border border-border ">
 <div className="flex items-center gap-3 mb-4">
 <img src={BusinessCentralIcon} alt="Business Central" className="h-10 w-10" />
 <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Business Central</h3>
 </div>
 
 <p className="text-muted-foreground mb-6">
 Perfekt för mindre och medelstora företag som behöver ett komplett, 
 kraftfullt och användarvänligt affärssystem.
 </p>
 
 <ul className="space-y-3 text-muted-foreground mb-6">
 <li className="flex items-start gap-2">
 <span className="text-xl">🏪</span>
 <span>Anpassat för mindre och medelstora företag</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">⚡</span>
 <span>Snabb implementation (vanligt med 3-6 månader)</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">💰</span>
 <span>Jämförelsevis låga licenskostnader och ofta väldigt bra TCO</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🎯</span>
 <span>Enkel att använda och lära sig</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">📊</span>
 <span>Ekonomi, order, lager, inköp, tillverkning/montering, serviceorder och försäljning samlat i ett rollanpassat verksamhetssystem</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🔌</span>
 <span>Rikt ekosystem av tillägg via Microsoft Marketplace med fler än 7.000 tilläggsappar</span>
 </li>
 </ul>
 
 <Link to="/businesscentral/">
 <Button variant="outline" className="w-full border-business-central text-business-central hover:bg-business-central hover:text-white">
 Business Central – priser, funktioner och partners
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </div>

 {/* Finance & Supply Chain Management */}
 <div className="bg-card rounded-lg p-6 sm:p-8 border border-border ">
 <div className="flex items-center gap-3 mb-4">
 <img src={FinanceIcon} alt="Dynamics 365 Finance" className="h-10 w-10" />
 <img src={SupplyChainIcon} alt="Supply Chain" className="h-10 w-10" />
 <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Finance & Supply Chain</h3>
 </div>
 
 <p className="text-muted-foreground mb-6">
 Kraftfull lösning för större, internationella organisationer med 
 komplexa behov och höga krav.
 </p>
 
 <ul className="space-y-3 text-muted-foreground mb-6">
 <li className="flex items-start gap-2">
 <span className="text-xl">🏢</span>
 <span>Anpassat för större, internationella organisationer</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🌍</span>
 <span>Enterprise‑skala från start: Flerbolag, flervaluta och flerspråk med inbyggd lokalisering och regelefterlevnad för global drift</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">📊</span>
 <span>Avancerad finansiell styrning och konsolidering</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🔗</span>
 <span>Optimerad supply chain och AI-driven logistik</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🌐</span>
 <span>Global skalbarhet och efterlevnad</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🏭</span>
 <span>Flera branschspecifika applikationer inom bl.a. tillverkning och supply chain</span>
 </li>
 <li className="flex items-start gap-2">
 <span className="text-xl">🧩</span>
 <span>Djup integration med hela Microsoft-ekosystemet</span>
 </li>
 </ul>
 
 <Link to="/finance-supply-chain/">
 <Button variant="outline" className="w-full border-finance-supply text-finance-supply hover:bg-finance-supply hover:text-white">
 Läs mer om Finance & Supply Chain
 <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>


 {/* FAQ */}
 <section className="py-8 sm:py-12 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
 Vanliga frågor om affärssystem
 </h2>
 <div className="space-y-4">
 {erpFaqs.map((f) => (
 <details key={f.question} className="group bg-card border border-border rounded p-5">
 <summary className="cursor-pointer font-semibold text-card-foreground list-none flex justify-between items-center gap-4">
 {f.question}
 <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0" />
 </summary>
 <p className="mt-3 text-muted-foreground leading-relaxed">{f.answer}</p>
 </details>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-8 sm:py-12 md:py-16 bg-background">

 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-3xl mx-auto text-center mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
 Första hjälpen
 </h2>
 <p className="text-lg text-muted-foreground mb-8">
 Vår ERP-behovsanalys tar bara några minuter och ger dig en 
 vägledning baserad på ditt företags specifika förutsättningar.
 </p>
 <Link to="/ERPbehovsanalys/">
  <Button 
  size="lg"
  className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-lg h-14 sm:h-16 rounded px-8"
  >
 <ClipboardList className="mr-2 h-5 w-5" />
 Starta ERP Behovsanalysen
 </Button>
 </Link>
 </div>
 
 {/* Premium Contact CTA Card */}
 <div className="max-w-xl mx-auto">
 <article className="relative rounded overflow-hidden ">
 {/* Gradient background */}
 <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210_20%_12%)] via-[hsl(210_18%_16%)] to-[hsl(210_20%_12%)]" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
 
 {/* Animated orb */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded animate-pulse" />
 
 <div className="relative p-6 sm:p-8">
 <div className="flex items-start gap-4 mb-6">
 <div className="p-3 rounded bg-gradient-to-br from-primary to-accent shadow-primary/30">
 <span className="text-xl">✨</span>
 </div>
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
 Vill du prata med oss direkt?
 </h3>
 <p className="text-white/70 text-sm sm:text-base">
 Låt oss hjälpa dig hitta rätt ERP-lösning och partner – helt kostnadsfritt.
 </p>
 </div>
 </div>
 
 {/* Filter context with glass effect */}
 <div className="mb-6 p-4 bg-white/10 rounded border border-white/20">
 <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded bg-cta-orange animate-pulse" />
 Produktområde
 </p>
 <div className="flex flex-wrap gap-2">
 <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 ">
 ERP / Affärssystem
 </Badge>
 </div>
 </div>
 
 <LeadCTA 
 sourcePage="/erp"
 variant="inline" 
 selectedProduct="ERP"
 />
 </div>
 </article>
 </div>
 </div>
 </section>

 <RelatedPages pages={erpRelatedPages} heading="Utforska vidare" />
 <section className="py-8">
   <div className="container mx-auto px-4 max-w-6xl">
     <PageOfferBanner />
   </div>
 </section>
 
<FunnelCTA stage="early" guide="erp" source="/erpoverview/" />
</main>
 <Footer />
 </div>
 );
};

export default ERPOverview;
