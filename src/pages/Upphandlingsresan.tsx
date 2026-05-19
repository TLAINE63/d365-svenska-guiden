import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BuyerJourneyStages from "@/components/BuyerJourneyStages";

const Upphandlingsresan = () => {
  return (
    <>
      <SEOHead
        title="Den typiska upphandlingsresan – 7 stadier för ERP & CRM"
        description="Var i systemlivscykeln står ni? Två korta frågor leder er till rätt stadie i upphandlingsresan för Microsoft Dynamics 365 (ERP och CRM). Oberoende vägledning inför val av Dynamics 365 och partner."
        canonicalPath="/kunskapscenter/upphandlingsresan"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <BuyerJourneyStages />
      </main>
      <Footer />
    </>
  );
};

export default Upphandlingsresan;
