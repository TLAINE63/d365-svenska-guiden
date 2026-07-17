import ProductHero from "@/components/ProductHero";
import RelatedPages, { fscRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import ApplicationPartners from "@/components/ApplicationPartners";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg?url";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
  { name: "Dynamics 365 Human Resources", url: "https://d365.se/d365humanresources" },
];

const D365HumanResources = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dynamics 365 Human Resources – HR-system för bolag"
        description="Microsofts HR-plattform för medarbetardata, organisation, kompensation, frånvaro och kompetensutveckling – integrerad med Finance & Supply Chain Management och Microsoft 365."
        canonicalPath="/d365humanresources"
        keywords="Dynamics 365 Human Resources, HR-system Microsoft, personalsystem, talent management, kompensation, organisationsstruktur, HR-plattform Sverige"
        ogImage="https://d365.se/og-finance-supply-chain.png"
      />
      <ServiceSchema
        name="Microsoft Dynamics 365 Human Resources – HR-plattform"
        description="Modulär HR-plattform för medarbetardata, organisation, anställningsavtal, kompensation, frånvaro, prestation och kompetensutveckling. Numera en integrerad del av Dynamics 365 Finance & Supply Chain Management."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <ProductHero
        icon={HumanResourcesIcon}
        eyebrow="Dynamics 365 Human Resources"
        title="Human Resources."
        titleAccent="HR-data, organisation och kompensation som en del av affärssystemet."
        subhead="Microsofts HR-modul är inte ett självständigt HR-system i klass med Workday eller SuccessFactors — den är ett strategiskt nav för medarbetardata, organisations­struktur och kompensation som lever tätt ihop med ekonomi, planering och Microsoft 365. För organisationer som redan kör Finance & Supply Chain Management eller Business Central ger det en sammanhängande datamodell där personalkostnader, projektresurser och organisations­förändringar speglas i realtid. Partnervalet handlar om att hitta någon som förstår både HR-processer och ert affärssystem."
        primary={{
          label: "Jämför HR-partners",
          onClick: () => document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation/", icon: FileText }}
      />

      <ShortAnswer title="Vad är Dynamics 365 Human Resources">
        <p>Dynamics 365 Human Resources är Microsofts HR-plattform för att hantera medarbetardata, organisations­struktur, anställningsavtal, kompensation, förmåner, frånvaro, prestations­utvärdering och kompetensutveckling i en samlad lösning.</p>
        <p>Funktionellt täcker den hela medarbetar­livscykeln — onboarding, befordringar, lönerevisioner, certifieringar, successions­planering och offboarding — och ger HR-avdelningen ett strukturerat sätt att förvalta organisations­hierarkier, befattningar och positions­budgetar över flera bolag och länder.</p>
        <p>Plattformen är nu integrerad som en del av Dynamics 365 Finance & Supply Chain Management, vilket gör att medarbetar­data flödar sömlöst till projektresursplanering (Project Operations), produktionsplanering, ekonomi och rapportering i Power BI.</p>
        <p>Självservice för chefer och medarbetare sker i Microsoft Teams och Outlook där Copilot kan hjälpa till med vanliga HR-frågor, sammanställningar och beslutsstöd — i stället för att tvinga in användarna i ett separat HR-portalgränssnitt.</p>
        <p>För svenska organisationer kompletteras lösningen oftast med externa lönesystem (Hogia, Visma, Agda) och rekryteringsverktyg via öppna API:er — och en partner som förstår både svensk arbetsrätt och Microsofts integrationer är avgörande för att helheten ska sitta.</p>
      </ShortAnswer>

      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Human Resources
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              HR i samma datamodell som ekonomi och drift
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              HR-modulen riktar sig till medelstora och stora organisationer som vill ha medarbetardata, organisations­hierarkier och kompensation i samma plattform som ekonomi, projekt och produktion — i stället för fristående HR-system som synkar via filer eller integrationer. Det blir särskilt värdefullt för bolag med flera juridiska enheter, internationell verksamhet eller komplexa befattnings­strukturer där positions­budgetar och kompensations­band behöver styras centralt.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Microsoft har de senaste åren konsoliderat den fristående HR-appen in i Finance & Supply Chain Management, vilket innebär att HR-funktionaliteten i praktiken är en modul i samma molntjänst snarare än en separat produkt. För svensk marknad kombineras den nästan alltid med ett externt lönesystem för faktisk lönekörning och AGI-rapportering — Dynamics 365 ansvarar för struktur, regelverk och rapportering, lönesystemet för utbetalning och myndighetsfiler.
            </p>
          </div>
        </div>
      </section>

      <BuyerManual product="human-resources" />
      <CostBreakdown product="human-resources" />

      <ProductPartnerNewsSection productArea="finance-scm" productLabel="Human Resources" />

      <ApplicationPartners applicationFilter="Human Resources" pageSource="D365 Human Resources" filterMode="companySize" />

      <section className="py-8 sm:py-12 md:py-16 bg-finance">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att samla HR och affärssystem?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och en partner med erfarenhet av HR-implementationer.
          </p>
          <Link to="/branscher/">
            <Button size="lg" className="bg-white text-finance hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded">
              Hitta din bransch och rätt partner
            </Button>
          </Link>
        </div>
      </section>

      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default D365HumanResources;
