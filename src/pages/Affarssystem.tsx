import ProductHero from "@/components/ProductHero";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, CheckCircle2, AlertTriangle, Lightbulb, Coins, Clock, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbSchema, FAQSchema, ServiceSchema } from "@/components/StructuredData";
import RelatedPages, { affarssystemRelatedPages } from "@/components/RelatedPages";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem", url: "https://d365.se/affarssystem" },
];

const faqs = [
  {
    question: "Vad är ett affärssystem?",
    answer:
      "Ett affärssystem (ERP – Enterprise Resource Planning) är ett samlat verksamhetssystem som hanterar ekonomi, lager, inköp, försäljning, produktion och ofta även projekt och service i en gemensam databas. Syftet är att ersätta öar av Excel och fristående system med en enda källa till sanning så att hela företaget arbetar mot samma siffror i realtid."
  },
  {
    question: "Vad kostar ett affärssystem i Sverige 2026?",
    answer:
      "Licenskostnaden för Microsofts affärssystem ligger på cirka 765 kr/användare/månad för Business Central Essentials, 1 051 kr för Business Central Premium och cirka 2 007 kr för Dynamics 365 Finance respektive Supply Chain Management. Implementationen kostar typiskt 150 000–800 000 kr för Business Central och från 1–5 MSEK för F&SCM. Räkna också med årlig förvaltning på 15–25 % av licenskostnaden."
  },
  {
    question: "Hur lång tid tar det att införa ett affärssystem?",
    answer:
      "Business Central införs vanligtvis på 3–6 månader för standardprocesser. Dynamics 365 Finance & Supply Chain Management tar 9–18 månader på grund av fler bolag, regulatoriska krav och integrationer. Den enskilt största tidsfaktorn är inte tekniken utan beslutsförmåga, datakvalitet och hur tydligt företaget definierat sina processer innan projektstart."
  },
  {
    question: "När räcker Business Central och när behövs Finance & SCM?",
    answer:
      "Business Central räcker för de flesta bolag med 5–300 användare och omsättning under cirka 1–2 miljarder. F&SCM behövs när du har flera juridiska entiteter i flera länder, avancerad tillverkning med MRP/MPS, omfattande WMS-behov eller komplexa konsolideringar. Är du osäker – välj BC. Det är enklare, billigare och du kan migrera senare om behoven växer."
  },
  {
    question: "Vilka är de vanligaste misstagen vid val av affärssystem?",
    answer:
      "1) Att låta licenspris styra mer än totalkostnad och processpassning. 2) Att hoppa över en oberoende behovsanalys och köpa det partnern råkar sälja mest av. 3) Att underskatta tiden för datatvätt och integration. 4) Att inte involvera nyckelanvändare tidigt. 5) Att välja partner enbart på pris istället för branscherfarenhet och referenser."
  },
  {
    question: "Behöver jag en Microsoft-partner?",
    answer:
      "Ja. Microsoft säljer inte affärssystem direkt till slutkund – allt går via certifierade partners (Solutions Partner for Business Applications). Partnervalet är ofta viktigare än produktvalet eftersom samma system kan upplevas helt olika beroende på vilket team som inför det. På d365.se kan du jämföra certifierade partners utifrån bransch och geografi utan kostnad."
  },
];

const youtubeVideos = [
  {
    id: "Business-Central-overview",
    embedId: "lLI3gtahMyE",
    title: "Business Central – översikt på 5 minuter",
    description:
      "En kort, neutral genomgång av vad Microsoft Dynamics 365 Business Central är och vilka delar (ekonomi, lager, försäljning, inköp, produktion) som ingår. Bra startpunkt om du aldrig sett systemet förut."
  },
  {
    id: "FSCM-overview",
    embedId: "1Nh8tT3GQEw",
    title: "Dynamics 365 Finance & Supply Chain Management – introduktion",
    description:
      "Översikt över Microsofts enterprise-affärssystem. Fokus på flerbolagsstöd, global ekonomistyrning, avancerad tillverkning och vad som faktiskt skiljer F&SCM från Business Central i praktiken."
  },
  {
    id: "ERP-implementation",
    embedId: "qyVmIQA1qHk",
    title: "Så genomförs ett ERP-projekt – Microsofts Success by Design",
    description:
      "Genomgång av den metodik certifierade Microsoft-partners använder vid införande. Tydliggör vilka faser som tar tid, var de flesta projekt fastnar och vad du som kund ansvarar för."
  },
];

const Affarssystem = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Affärssystem – vad det är, vad det kostar & hur du väljer | d365.se"
        description="Affärssystem 2026: vad det är, vad det kostar och hur du väljer rätt på den svenska marknaden. Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365."
        canonicalPath="/affarssystem"
        keywords="affärssystem, vad är ett affärssystem, affärssystem sverige, affärssystem jämförelse, affärssystem pris, välja affärssystem, affärssystem för småföretag, affärssystem för medelstora företag, molnbaserade affärssystem"
        ogImage="https://d365.se/og-erp.png"
      />
      <ServiceSchema
        name="Affärssystem – oberoende guide"
        description="Oberoende guide till affärssystem i Sverige. Förklarar vad ett affärssystem är, hur du väljer rätt och vilka alternativ som finns på marknaden. Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      <Navbar />

      {/* Hero */}
      <ProductHero
        eyebrow="Pelarsida · Oberoende guide"
        title="Affärssystem — vad det är."
        titleAccent="Och hur ni väljer rätt utan säljpåverkan."
        subhead="Vad är ett affärssystem, vad kostar det, hur lång tid tar det att införa och vilka alternativ finns på den svenska marknaden? Här får ni svaren — utan säljpåverkan."
        primary={{ label: "Gör en kostnadsfri behovsanalys", to: "/ERPbehovsanalys/", icon: ClipboardList }}
        secondary={{ label: "Jämför BC vs F&SCM", href: "#jamfor" }}
      />


      {/* TAYA: Vad är ett affärssystem */}
      <section className="py-12 sm:py-16 bg-background">
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
              I praktiken är ett affärssystem den ryggrad som styr hur ordrar, fakturor, lagersaldon, inköp och
              redovisning hänger ihop. När en säljare lägger en order ska den synas på lagret, i ekonomin och i
              rapporterna – utan dubbelregistrering. Det är där värdet uppstår, och det är också där de flesta
              ERP-projekt misslyckas: när processerna inte är genomtänkta innan systemet införs.
            </p>
            <p className="text-lg text-muted-foreground">
              Microsoft erbjuder två affärssystem inom Dynamics 365-familjen:&nbsp;
              <Link to="/businesscentral/" className="text-primary font-medium hover:underline">Business Central</Link> för små och medelstora bolag, och&nbsp;
              <Link to="/finance-supply-chain/" className="text-primary font-medium hover:underline">Finance &amp; Supply Chain Management</Link> för stora, internationella organisationer. Vill du se en teknisk sida-vid-sida-jämförelse av dem, läs vår&nbsp;
              <Link to="/erp/" className="text-primary font-medium hover:underline">jämförelse av Business Central och Finance &amp; SCM</Link>. Vilket som passar dig avgörs av storlek, komplexitet och ambitioner – inte av vilken licens partnern råkar sälja mest av.
            </p>
          </div>
        </div>
      </section>

      {/* TAYA: Ärliga fakta */}
      <section className="py-12 sm:py-16 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
              Det här säger ingen leverantör – men du behöver veta det
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Vi tror på radikal transparens. Här är de fem sakerna som avgör om ett ERP-projekt blir lyckat
              eller en mardröm.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Coins,
                  title: "Licenspriset är inte totalkostnaden",
                  body: "Räkna med 3–5x licenskostnaden för implementation första året, och 15–25 % av licensen i löpande förvaltning per år."
                },
                {
                  icon: Clock,
                  title: "Tiden går till data och processer",
                  body: "60–70 % av projekttiden går till datatvätt, processdefinition och tester. Själva systemkonfigurationen är minoriteten."
                },
                {
                  icon: Users,
                  title: "Partnervalet slår produktvalet",
                  body: "Samma Business Central kan upplevas helt olika beroende på partner. Branscherfarenhet och referenser är viktigare än timpris."
                },
                {
                  icon: AlertTriangle,
                  title: "Anpassningar kostar för evigt",
                  body: "Varje specialanpassning måste underhållas vid varje uppgradering. Anpassa bara där det ger äkta konkurrensfördel."
                },
                {
                  icon: Lightbulb,
                  title: "Standard slår skräddarsytt",
                  body: "Microsoft uppgraderar BC och F&SCM löpande. Den som följer standard får ny funktionalitet gratis. Den som anpassat får teknisk skuld."
                },
                {
                  icon: CheckCircle2,
                  title: "Börja med en oberoende analys",
                  body: "En behovsanalys utan säljincitament tar några timmar och sparar ofta hundratusentals kronor i felval senare."
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
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

      {/* Compare BC vs F&SCM */}
      <section id="jamfor" className="py-12 sm:py-16 md:py-20 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Två affärssystem från Microsoft – vilket passar dig?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Båda är moderna molnsystem från Microsoft och delar samma underliggande Power Platform och
                Microsoft 365-integration. Skillnaden ligger i skala, komplexitet och pris.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* BC */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={BusinessCentralIcon} alt="Business Central" className="h-10 w-10" />
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Business Central</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Microsofts affärssystem för små och medelstora företag. Komplett, snabbt att införa och med
                  ett ekosystem på över 7 000 tilläggsappar via AppSource.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> 5–300 användare, omsättning upp till ~1–2 miljarder</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Implementation 3–6 månader</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Från 765 kr/användare/månad</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Ekonomi, lager, inköp, försäljning, produktion, service</li>
                </ul>
                <Link to="/businesscentral/">
                  <Button variant="outline" className="w-full border-business-central text-business-central hover:bg-business-central hover:text-white">
                    Läs mer om Business Central
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* F&SCM */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={FinanceIcon} alt="Finance" className="h-10 w-10" />
                  <img src={SupplyChainIcon} alt="Supply Chain" className="h-10 w-10" />
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Finance &amp; Supply Chain</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Microsofts enterprise-affärssystem för stora, internationella organisationer med komplexa
                  krav på ekonomistyrning, tillverkning och global supply chain.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Flera bolag, valutor och länder med inbyggd lokalisering</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Implementation 9–18 månader</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Från ca 2 007 kr/användare/månad</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Avancerad MRP/MPS, WMS, konsolidering, internprissättning</li>
                </ul>
                <Link to="/finance-supply-chain/">
                  <Button variant="outline" className="w-full border-finance-supply text-finance-supply hover:bg-finance-supply hover:text-white">
                    Läs mer om Finance &amp; Supply Chain
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube videos */}
      <section className="py-12 sm:py-16 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                Se affärssystem i praktiken
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tre korta videor som ger dig en första känsla för Microsofts affärssystem och hur ett
                ERP-projekt faktiskt går till.
              </p>
            </div>

            <div className="space-y-10">
              {youtubeVideos.map((v) => (
                <div key={v.id} className="grid md:grid-cols-2 gap-6 items-center bg-card border border-border rounded-xl p-4 sm:p-6 shadow-[var(--shadow-card)]">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${v.embedId}`}
                      title={v.title}
                      width="1280"
                      height="720"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{v.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Vanliga frågor om affärssystem
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details key={f.question} className="group bg-card border border-border rounded-xl p-5">
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

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nästa steg: hitta rätt utan säljpress
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Gör en kostnadsfri behovsanalys eller jämför certifierade Microsoft-partners direkt. Vi tar inte
              betalt av dig som söker – och styr inte resultatet.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/ERPbehovsanalys/">
                <Button size="lg" className="bg-cta-orange hover:bg-cta-orange/90 text-white text-base sm:text-lg h-14 rounded-xl px-8">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Starta behovsanalysen
                </Button>
              </Link>
              <Link to="/valjdynamics365partner/?product=Business+Central">
                <Button size="lg" variant="outline" className="text-base sm:text-lg h-14 rounded-xl px-8">
                  Jämför affärssystem-partners
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedPages pages={affarssystemRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default Affarssystem;
