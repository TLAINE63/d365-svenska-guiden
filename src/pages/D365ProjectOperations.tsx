import { ProductPageBody } from "@/components/product/ProductSectionNav";
import { PROJOPS_SECTIONS } from "@/components/product/productSectionNavItems";
import SystemvalHandoffNote from "@/components/SystemvalHandoffNote";
import ContinueEvaluation from "@/components/ContinueEvaluation";
import AiExamplesEntry from "@/components/ai-examples/AiExamplesEntry";
import ProductIsvSection from "@/components/ProductIsvSection";
import ProductHero from "@/components/ProductHero";
import StandardProductSections from "@/components/product/StandardProductSections";
import { PRODUCT_STANDARD_SECTIONS } from "@/data/productStandardSections";
import RelatedPages, { fscRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ApplicationPartners from "@/components/ApplicationPartners";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import { FileText } from "lucide-react";
import AdvisorCtaCard from "@/components/advisory/AdvisorCtaCard";
import { useEffect } from "react";
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import EditorialSource from "@/components/EditorialSource";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/affarssystem/" },
  { name: "Dynamics 365 Project Operations", url: "https://d365.se/d365projectoperations" },
];

const D365ProjectOperations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dynamics 365 Project Operations – guide & partners"
        description="Dynamics 365 Project Operations för konsult- och tjänsteföretag: resursplanering, tid och utlägg, projektekonomi och fakturering. Jämför svenska partners."
        canonicalPath="/d365projectoperations"
        keywords="Dynamics 365 Project Operations, projektstyrning Microsoft, PSA, resursplanering, projektekonomi, tid och utlägg, konsultbolag ERP"
        ogImage="https://d365.se/og-erp.png"
        ogImageAlt="Dynamics 365 Project Operations – köpguide på d365.se"
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
          label: "Hitta rätt Project Operations-partner",
          onClick: () => document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation/?produkt=fsc", icon: FileText }}
      />
      <ProductPageBody items={PROJOPS_SECTIONS}>

      <ShortAnswer title="Vad är Dynamics 365 Project Operations">
        <p>Dynamics 365 Project Operations är Microsofts samlade projektmodul för konsult-, ingenjörs- och tjänsteföretag – en plattform som binder ihop sälj, leverans och ekonomi i ett enda flöde från första offert till slutfaktura.</p>
        <p>Affären kvalificeras i Dynamics 365 Sales, planeras med resurskapacitet och kompetensmatchning, levereras genom uppgifter, tidrapporter och utlägg i Teams och mobilen, och faktureras via fast pris, löpande räkning eller milstolpar med full koppling till projektekonomi, work-in-progress och intäktsavräkning.</p>
        <p>Inbyggda funktioner för portföljstyrning, prognos, marginal­uppföljning per projekt och utilization av konsulter ger ledningen realtidsbild av lönsamheten – medan Copilot och AI-agenter hjälper projektledare att sammanfatta statusrapporter, identifiera risk och föreslå nästa åtgärd.</p>
        <p>Project Operations är fristående men blomstrar när det integreras djupt med Finance & Supply Chain Management eller Business Central för redovisning, Sales för CRM och Customer Service för support efter projektet. Precis som med övriga D365-appar avgör partnerns förmåga att modellera din specifika leveransmodell hur stor effekten faktiskt blir.</p>
      </ShortAnswer>

      <section aria-labelledby="bygg-hansvisning" className="py-6">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl mx-auto rounded-lg border border-border bg-muted/40 p-5">
            <h2 id="bygg-hansvisning" className="text-base md:text-lg font-bold text-foreground mb-2">
              Verksam inom bygg, anläggning eller entreprenad?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-3">
              Läs vår guide om affärssystem för bygg och entreprenad och branschlösningen 4PS Construct.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/branscher/bygg-entreprenad/" className="text-sm font-semibold text-primary hover:underline">Guide om affärssystem för bygg och entreprenad →</Link>
              <Link to="/partner/4ps-sweden/" className="text-sm font-semibold text-primary hover:underline">4PS Construct från 4PS Sweden →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-background">

      <StandardProductSections productName="Project Operations" data={PRODUCT_STANDARD_SECTIONS["project-operations"]} />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
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

      <section id="projektredovisning" className="py-8 sm:py-12 md:py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Projektredovisning och successiv vinstavräkning i <span className="whitespace-nowrap">Dynamics 365</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              För entreprenad- och konsultföretag är projektet den enhet som ska gå med vinst. Project Operations samlar budget, prognos, upparbetade kostnader och fakturerade intäkter per projekt, så att resultatet syns löpande och inte först när projektet stängs.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              <strong className="text-foreground">Successiv vinstavräkning</strong> innebär att intäkt och resultat redovisas i takt med projektets färdigställandegrad, i stället för vid slutfakturan. Project Operations beräknar pågående arbete (WIP) och intäktsavräkning utifrån upparbetad kostnad eller nedlagd tid i förhållande till budget, och bokför justeringen i ekonomin vid varje periodbokslut.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              <strong className="text-foreground">Budgetuppföljning och projektrapportering</strong> sker mot den godkända budgeten och den senaste prognosen. Projektledaren ser avvikelser per fas och kostnadstyp, och ledningen får marginal och beläggning för hela portföljen i Power BI. Hur avräkningen ska se ut i just er redovisning är ett beslut ni fattar tillsammans med partnern och revisorn.
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Project Operations eller Business Central för bygg och entreprenad?
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Project Operations passar tjänste- och konsultbaserade projekt, där tid, resurser och fakturering står i centrum, ofta tillsammans med Finance &amp; Supply Chain Management. Bygg-, anläggnings- och installationsföretag behöver dessutom kalkyl, ÄTA-hantering, underentreprenörer, maskiner och service. Där väljer många Business Central med ett branschsystem, till exempel 4PS Construct.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/branscher/bygg-entreprenad/" className="text-sm font-semibold text-primary hover:underline">Affärssystem för bygg och entreprenad →</Link>
              <Link to="/partner/4ps-sweden/" className="text-sm font-semibold text-primary hover:underline">4PS Construct från 4PS Sweden →</Link>
            </div>
          </div>
        </div>
      </section>

      <SystemvalHandoffNote page="po" />
      <BuyerManual product="project-operations" />
      <CostBreakdown product="project-operations" />


      <ApplicationPartners applicationFilter="Project Operations" pageSource="D365 Project Operations" filterMode="companySize" showUnprofiledList={false} />

      <AdvisorCtaCard
        id="po-radgivning"
        heading="Behöver ni rådgivning kring systemstöd för projekt och entreprenad?"
        text="Boka ett 20 minuters kostnadsfritt rådgivningssamtal med Thomas Laine för att diskutera era krav på projektredovisning och branschsystem. Ingen partner deltar i samtalet."
        bookingLabel="Boka 20 min rådgivning"
        link={{ to: "/valjdynamics365partner/", label: "Jämför partners för Project Operations" }}
      />

      <ContinueEvaluation template="product" />
      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <ProductIsvSection product="Project Operations" />

      </ProductPageBody>
      </main>
      <AiExamplesEntry apps={["projectops"]} label={"Se hur AI förändrar arbetet i Project Operations"} source="d365projectoperations" />
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
};

export default D365ProjectOperations;
