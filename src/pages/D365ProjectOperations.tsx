import ProductIsvSection from "@/components/ProductIsvSection";
import ProductHero from "@/components/ProductHero";
import StandardProductSections from "@/components/product/StandardProductSections";
import { PRODUCT_STANDARD_SECTIONS } from "@/data/productStandardSections";
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
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
  { name: "Dynamics 365 Project Operations", url: "https://d365.se/d365projectoperations" },
];

const D365ProjectOperations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Project Operations – projektstyrning för tjänster"
        description="Microsofts projektmodul för konsult-, ingenjörs- och tjänsteföretag. Resursplanering, tid & utlägg, projektekonomi och fakturering – integrerat med Finance, BC, Sales och Teams."
        canonicalPath="/d365projectoperations"
        keywords="Dynamics 365 Project Operations, projektstyrning Microsoft, PSA, resursplanering, projektekonomi, tid och utlägg, konsultbolag ERP"
        ogImage="https://d365.se/og-finance-supply-chain.png"
      />
      <ServiceSchema
        name="Microsoft Dynamics 365 Project Operations – projektstyrning för tjänsteföretag"
        description="Sammanhållen projektmodul som täcker hela livscykeln: offert, resursplanering, tid & utlägg, projektekonomi och fakturering. Integrerar med Dynamics 365 Sales, Finance, Business Central och Microsoft 365."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />
      <main>

      <ProductHero
        icon={ProjectOperationsIcon}
        eyebrow="Dynamics 365 Project Operations"
        title="Project Operations."
        titleAccent="Projekt, resurser och ekonomi i ett sammanhang – när partnern kan din leveransmodell."
        subhead="Project Operations är inte ett verktyg du installerar och kör igång – det är en spegling av hur ditt tjänsteföretag säljer, bemannar och fakturerar projekt. Skillnaden mellan ett system som verkligen lyfter marginalen och ett som bara ersätter Excel ligger i partnervalet: en partner som förstår tid & utlägg, resursoptimering, work-in-progress, milstolps­fakturering och hur det hänger ihop med din ERP är guld värd."
        primary={{
          label: "Jämför Project Operations-partners",
          onClick: () => document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation/?produkt=fsc", icon: FileText }}
      />

      <ShortAnswer title="Vad är Dynamics 365 Project Operations">
        <p>Dynamics 365 Project Operations är Microsofts samlade projektmodul för konsult-, ingenjörs- och tjänsteföretag – en plattform som binder ihop sälj, leverans och ekonomi i ett enda flöde från första offert till slutfaktura.</p>
        <p>Affären kvalificeras i Dynamics 365 Sales, planeras med resurskapacitet och kompetensmatchning, levereras genom uppgifter, tidrapporter och utlägg i Teams och mobilen, och faktureras via fast pris, löpande räkning eller milstolpar med full koppling till projektekonomi, work-in-progress och intäktsavräkning.</p>
        <p>Inbyggda funktioner för portföljstyrning, prognos, marginal­uppföljning per projekt och utilization av konsulter ger ledningen realtidsbild av lönsamheten – medan Copilot och AI-agenter hjälper projektledare att sammanfatta statusrapporter, identifiera risk och föreslå nästa åtgärd.</p>
        <p>Project Operations är fristående men blomstrar när det integreras djupt med Finance & Supply Chain Management eller Business Central för redovisning, Sales för CRM och Customer Service för support efter projektet. Precis som med övriga D365-appar avgör partnerns förmåga att modellera din specifika leveransmodell hur stor effekten faktiskt blir.</p>
      </ShortAnswer>

      <section className="py-8 sm:py-12 md:py-16 bg-background">

      <StandardProductSections productName="Project Operations" data={PRODUCT_STANDARD_SECTIONS["project-operations"]} />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Project Operations
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              För tjänsteföretag som lever på fakturerbar tid
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Project Operations passar organisationer där projekten är produkten: managementkonsulter, IT-konsulter, byggprojektledning, ingenjörsbolag, arkitektkontor, marknads­byråer och professional services-divisioner inom större koncerner. Plattformen hanterar både interna projekt och externa kunduppdrag – med stöd för fasta priser, löpande räkning, abonnemang och milstolps­fakturering.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Den unika styrkan ligger i kopplingen mellan resursplanering och ekonomi: när en konsult bokas på ett uppdrag genereras automatiskt prognosintäkter och beläggning, när tid godkänns triggas fakturaunderlag och WIP-bokföring, och när projektet avslutas är marginalen klar. Resultatet är att projektkontoret slipper Excel-sammanställningar och ekonomi får realtidsdata i stället för månadsbokslut.
            </p>
          </div>
        </div>
      </section>

      <BuyerManual product="project-operations" />
      <CostBreakdown product="project-operations" />

      <ProductPartnerNewsSection productArea="finance-scm" productLabel="Project Operations" />

      <ApplicationPartners applicationFilter="Project Operations" pageSource="D365 Project Operations" filterMode="companySize" showUnprofiledList={false} />

      <section className="py-8 sm:py-12 md:py-16 bg-finance">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att professionalisera din projektleverans?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och en partner som verkligen kan Project Operations.
          </p>
          <Link to="/branscher/">
            <Button size="lg" className="bg-white text-finance hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded">
              Hitta din bransch och rätt partner
            </Button>
          </Link>
        </div>
      </section>

      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <ProductIsvSection product="Project Operations" />

      </main>
      <Footer />
    </div>
  );
};

export default D365ProjectOperations;
