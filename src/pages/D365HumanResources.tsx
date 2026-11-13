import { ProductPageBody } from "@/components/product/ProductSectionNav";
import { HR_SECTIONS } from "@/components/product/productSectionNavItems";
import ProductIsvSection from "@/components/ProductIsvSection";
import ContinueEvaluation from "@/components/ContinueEvaluation";
import ProductHero from "@/components/ProductHero";
import RelatedPages, { fscRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ApplicationPartners from "@/components/ApplicationPartners";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import { FileText, ArrowRight } from "lucide-react";
import AdvisorContactButtons from "@/components/advisory/AdvisorContactButtons";
import advisorPhoto from "@/assets/thomas-laine-radgivning.jpg.asset.json";
import { useEffect } from "react";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg?url";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import EditorialSource from "@/components/EditorialSource";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/affarssystem/" },
  { name: "Dynamics 365 Human Resources", url: "https://d365.se/d365humanresources" },
];

const D365HumanResources = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dynamics 365 Human Resources – guide & partners"
        description="Dynamics 365 Human Resources för medarbetardata, organisation, frånvaro och kompetens, integrerat med Finance. Se funktioner och svenska partners."
        canonicalPath="/d365humanresources"
        keywords="Dynamics 365 Human Resources, HR-system Microsoft, personalsystem, talent management, kompensation, organisationsstruktur, HR-plattform Sverige"
        ogImage="https://d365.se/og-erp.png"
        ogImageAlt="Dynamics 365 Human Resources – köpguide på d365.se"
      />
      <ServiceSchema
        name="Microsoft Dynamics 365 Human Resources – HR-plattform"
        description="Modulär HR-plattform för medarbetardata, organisation, anställningsavtal, kompensation, frånvaro, prestation och kompetensutveckling. Numera en integrerad del av Dynamics 365 Finance & Supply Chain Management."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />
      <main>

      <ProductHero
        icon={HumanResourcesIcon}
        eyebrow="Dynamics 365 Human Resources"
        title="Human Resources."
        titleAccent="HR-data, organisation och kompensation som en del av affärssystemet."
        subhead="Microsofts HR-modul är inte ett självständigt HR-system i klass med Workday eller SuccessFactors – den är ett strategiskt nav för medarbetardata, organisations­struktur och kompensation som lever tätt ihop med ekonomi, planering och Microsoft 365. För organisationer som redan kör Finance & Supply Chain Management eller Business Central ger det en sammanhängande datamodell där personalkostnader, projektresurser och organisations­förändringar speglas i realtid. Partnervalet handlar om att hitta någon som förstår både HR-processer och ditt affärssystem."
        primary={{
          label: "Hitta rätt Human Resources-partner",
          onClick: () => document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation/?produkt=fsc&fokus=human-resources", icon: FileText }}
      />
      <ProductPageBody items={HR_SECTIONS}>

      <ShortAnswer title="Vad är Dynamics 365 Human Resources">
        <p>Dynamics 365 Human Resources är Microsofts HR-plattform för att hantera medarbetardata, organisations­struktur, anställningsavtal, kompensation, förmåner, frånvaro, prestations­utvärdering och kompetensutveckling i en samlad lösning.</p>
        <p>Funktionellt täcker den hela medarbetar­livscykeln – onboarding, befordringar, lönerevisioner, certifieringar, successions­planering och offboarding – och ger HR-avdelningen ett strukturerat sätt att förvalta organisations­hierarkier, befattningar och positions­budgetar över flera bolag och länder.</p>
        <p>Plattformen är nu integrerad som en del av Dynamics 365 Finance & Supply Chain Management, vilket gör att medarbetar­data flödar sömlöst till projektresursplanering (Project Operations), produktionsplanering, ekonomi och rapportering i Power BI.</p>
        <p>Självservice för chefer och medarbetare sker i Microsoft Teams och Outlook där Copilot kan hjälpa till med vanliga HR-frågor, sammanställningar och beslutsstöd – i stället för att tvinga in användarna i ett separat HR-portalgränssnitt.</p>
        <p>I svenska organisationer är Dynamics&nbsp;365 Human Resources navet för organisations­struktur, medarbetar­resan och kompetens, medan löneberäkning och AGI-rapportering sker i ett svenskt lönesystem som Hogia, Visma eller Agda. Systemen kopplas ihop via standard­integrationer och öppna API:er, så att anställningsdata, frånvaro och tid förs över till lönen utan dubbelregistrering. En partner som förstår både svensk arbetsrätt och Microsofts integrationer är avgörande för att helheten ska sitta.</p>
      </ShortAnswer>

      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Human Resources
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              HR i samma datamodell som ekonomi och drift
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              HR-modulen riktar sig till medelstora och stora organisationer som vill ha medarbetardata, organisations­hierarkier och kompensation i samma plattform som ekonomi, projekt och produktion – i stället för fristående HR-system som synkar via filer eller integrationer. Det blir särskilt värdefullt för bolag med flera juridiska enheter, internationell verksamhet eller komplexa befattnings­strukturer där positions­budgetar och kompensations­band behöver styras centralt.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Microsoft har de senaste åren konsoliderat den fristående HR-appen in i Finance & Supply Chain Management, vilket innebär att HR-funktionaliteten i praktiken är en modul i samma molntjänst snarare än en separat produkt. För svensk marknad kombineras den nästan alltid med ett externt lönesystem för faktisk lönekörning och AGI-rapportering – Dynamics 365 ansvarar för struktur, regelverk och rapportering, lönesystemet för utbetalning och myndighetsfiler.
            </p>
          </div>
        </div>
      </section>

      <section id="sjalvservice" className="py-8 sm:py-12 md:py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Självservice för medarbetare och chefer (ESS &amp; MSS)
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Ett HR-system med självservice låter medarbetare och chefer sköta vanliga HR-ärenden själva, utan att mejla HR. I <span className="whitespace-nowrap">Dynamics 365</span> Human Resources finns medarbetarsjälvservice (Employee Self-Service, ESS) och chefsstöd (Manager Self-Service, MSS) direkt i Microsoft Teams och Outlook, där användarna redan arbetar.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 my-6">
              {[
                ["Ledighetsansökan", "Medarbetaren ser sitt saldo och ansöker om semester eller annan ledighet i Teams. Chefen godkänner direkt i Teams eller Outlook."],
                ["Tidregistrering", "Arbetstid och frånvaro registreras i självservicen och kan föras vidare till lönesystemet för löneberäkning."],
                ["Kompetensprofiler", "Medarbetare håller kompetenser, certifieringar och utbildningar uppdaterade, och chefer får överblick vid bemanning och successionsplanering."],
                ["Copilot som HR-assistent", "Microsoft Copilot kan svara på vanliga HR-frågor, till exempel om policyer och saldon, och hjälpa chefer med sammanställningar. Vad som ingår beror på licens och konfiguration."],
              ].map(([h, t]) => (
                <div key={h} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-2">{h}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
            <p className="text-base text-muted-foreground">
              HR-självservice minskar administrationen för HR-avdelningen och gör uppgifterna mer korrekta, eftersom den som äger informationen också uppdaterar den.
            </p>
          </div>
        </div>
      </section>

      <BuyerManual product="human-resources" />
      <CostBreakdown product="human-resources" />


      <ApplicationPartners applicationFilter="Human Resources" pageSource="D365 Human Resources" filterMode="companySize" showUnprofiledList={false} />

      <section className="py-8 sm:py-12 md:py-16" aria-labelledby="hr-radgivning">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
            <img src={advisorPhoto.url} alt="Thomas Laine, rådgivare på d365.se" loading="lazy" width={96} height={96} className="h-20 w-20 rounded-full object-cover object-[50%_0%] ring-2 ring-border shrink-0" />
            <div className="flex-1">
              <h2 id="hr-radgivning" className="text-xl md:text-2xl font-bold text-foreground mb-2">Boka 20-minuters kostnadsfri rådgivning med Thomas</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-2xl leading-relaxed">
                Få en bedömning av om <span className="whitespace-nowrap">Dynamics 365</span> Human Resources passar era behov och hur ni bäst väljer partner. Ingen partner deltar i samtalet och ni förbinder er inte till något.
              </p>
              <AdvisorContactButtons />
              <Link to="/valjdynamics365partner/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                Hitta en implementeringspartner för HR
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContinueEvaluation template="product" />
      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <ProductIsvSection product="Human Resources" />

      </ProductPageBody>
      </main>
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
};

export default D365HumanResources;
