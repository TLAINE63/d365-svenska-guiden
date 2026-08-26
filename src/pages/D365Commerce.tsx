import ProductIsvSection from "@/components/ProductIsvSection";
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
import CommerceIcon from "@/assets/icons/Commerce.svg?url";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
  { name: "Dynamics 365 Commerce", url: "https://d365.se/d365commerce" },
];

const D365Commerce = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dynamics 365 Commerce – retail, POS och e-handel"
        description="Microsofts omnikanal-plattform för butik, e-handel, kundklubb och POS – samlad produktkatalog, prismotor och kunddata i realtid över alla kanaler. Integrerat med F&SCM."
        canonicalPath="/d365commerce"
        keywords="Dynamics 365 Commerce, omnikanal retail, POS-system Microsoft, e-handel Dynamics, kundklubb, prismotor, butikssystem, headless commerce"
        ogImage="https://d365.se/og-finance-supply-chain.png"
      />
      <ServiceSchema
        name="Microsoft Dynamics 365 Commerce – omnikanal handel"
        description="Omnikanal retail-plattform som samlar fysisk butik, e-handel, mobil och kundklubb i en lösning. Inkluderar Commerce POS (online/offline), prismotorn, kampanjer, lojalitet och Sites Builder för e-handel. Integrerad med Finance & Supply Chain Management."
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />
      <main>

      <ProductHero
        icon={CommerceIcon}
        eyebrow="Dynamics 365 Commerce"
        title="Commerce."
        titleAccent="Butik, e-handel och kundklubb i en plattform – när partnern kan retail."
        subhead="Commerce är Microsofts svar på det fragmenterade retail-landskapet där separata system för kassa, e-handel, lager och CRM skapar dubbla prislistor, fel saldon och en kundupplevelse som spricker mellan kanalerna. Plattformen är kraftfull – men exceptionellt komplex att implementera. Skillnaden mellan ett retail-projekt som lyfter omsättningen och ett som blir en mardröm ligger i partnerns retail-erfarenhet: kan de POS, lojalitet, kampanjlogik, BOPIS-flöden och integration mot dina logistikpartners?"
        primary={{
          label: "Jämför Commerce-partners",
          onClick: () => document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" }),
        }}
        secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation/?produkt=fsc", icon: FileText }}
      />

      <ShortAnswer title="Vad är Dynamics 365 Commerce">
        <p>Dynamics 365 Commerce är Microsofts omnikanal-plattform för retail och konsument­varor – en lösning som samlar fysisk butik, e-handel, mobil och kundklubb i en gemensam datamodell med en enda produktkatalog, prismotorn och kundprofil.</p>
        <p>Kärnan är <strong>Commerce Scale Unit</strong>, en central dataplattform som synkar produkter, priser, lagersaldon och kunddata i realtid över alla kanaler så att butikspersonal, e-handel och kundtjänst alltid ser samma bild.</p>
        <p>På topp ligger <strong>Commerce POS</strong>, en modern kassalösning som fungerar både online och offline med automatisk synkronisering. Pris- och kampanjmotorn hanterar miljontals prisuträkningar per dag med stöd för köp-N-betala-M, tröskelrabatter, mix-och-matcha, kundklubbs­priser och affinity-baserade kampanjer. <strong>Sites Builder</strong> ger drag-and-drop e-handel eller headless-arkitektur mot React/Next.js-frontends.</p>
        <p>Lojalitets­programmet hanterar poäng, nivåer och förmåner kopplade till en samlad kundprofil i Dataverse. Med Customer Insights kan retail-kedjor bygga personaliserade kampanjer och AI-prediktioner som driver återköp och ökar snittkvitto.</p>
        <p>Commerce är djupt integrerat med Finance & Supply Chain Management för redovisning, inköp, lager och varuförsörjning, vilket gör helhetslösningen särskilt stark för retail-kedjor som vill konsolidera bort separata kassa-, lager- och e-handelssystem – men implementationen är ett betydande åtagande och kräver en partner med dokumenterad retail-erfarenhet.</p>
      </ShortAnswer>

      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Commerce
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Omnikanal retail på en samlad plattform
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Commerce passar retail-kedjor, mode- och sportbolag, dagligvaror, detalj­handel och konsument­varumärken med flera butiker, e-handel och behov av kundklubb. Plattformen är särskilt stark för organisationer som vill bort från en lapptäckes­arkitektur med separata system för kassa (NCR, Sitoo), e-handel (Shopify, Magento), kundklubb (Voyado) och ERP – och samla det i en Microsoft-stack med Finance & Supply Chain Management för logistik och redovisning.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Värt att veta innan du går vidare: Commerce är en av de mest omfattande Dynamics 365-apparna och kräver oftast 9–18 månaders implementation för en fullskalig retail-kedja. Det är inte en plug-and-play e-handel utan en hel retail-platform – vilket gör partnervalet kritiskt. Leta efter partners med referenser från liknande retail-segment (mode, sport, dagligvaror, konsument­elektronik) snarare än generella Dynamics 365-konsulter.
            </p>
          </div>
        </div>
      </section>

      <BuyerManual product="commerce" />
      <CostBreakdown product="commerce" />

      <ProductPartnerNewsSection productArea="finance-scm" productLabel="Commerce" />

      <ApplicationPartners applicationFilter="Commerce" pageSource="D365 Commerce" filterMode="companySize" showUnprofiledList={false} />

      <section className="py-8 sm:py-12 md:py-16 bg-finance">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att samla butik, e-handel och kundklubb?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Hitta din bransch och en partner med dokumenterad retail-erfarenhet.
          </p>
          <Link to="/branscher/">
            <Button size="lg" className="bg-white text-finance hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded">
              Hitta din bransch och rätt partner
            </Button>
          </Link>
        </div>
      </section>

      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <ProductIsvSection product="Commerce" />

      </main>
      <Footer />
    </div>
  );
};

export default D365Commerce;
