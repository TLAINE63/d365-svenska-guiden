import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Mail, Phone, Calendar, ArrowLeft } from "lucide-react";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const PERSON_ID = "https://d365.se/om-thomas-laine#thomas-laine";
const LINKEDIN_URL = "https://www.linkedin.com/in/thomaslaine/";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kontakt", url: "https://d365.se/kontakt" },
  { name: "Om Thomas Laine", url: "https://d365.se/om-thomas-laine" },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Thomas Laine",
  jobTitle: "Grundare, d365.se",
  description:
    "Snart 40 år i ERP- och CRM-marknaden och nästan 30 år i Microsoft Dynamics-ekosystemet. Tidigare affärsområdeschef för Business Solutions och partneransvarig för Dynamics 365 på Microsoft Sverige. Idag rådgivare genom Cloud Ahead AB och medgrundare av d365.se.",
  url: "https://d365.se/om-thomas-laine",
  image: "https://d365.se/og-kontakt.png",
  sameAs: [LINKEDIN_URL],
  worksFor: {
    "@type": "Organization",
    name: "d365.se",
    url: "https://d365.se",
  },
};

const OmThomasLaine = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Om Thomas Laine – grundare av d365.se"
        description="Thomas Laine har arbetat i ERP- och CRM-marknaden i snart 40 år, varav nästan 30 år i det ekosystem som idag är Microsoft Dynamics 365. Grundare av d365.se."
        canonicalPath="/om-thomas-laine/"
        keywords="Thomas Laine, d365.se, Cloud Ahead, Dynamics 365, ERP, CRM, Microsoft"
        ogImage="https://d365.se/og-kontakt.png"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="mt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-secondary/40 to-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <Link
              to="/kontakt/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Tillbaka till Kontakt
            </Link>

            <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start max-w-5xl">
              <img
                src={thomasLainePhoto}
                alt="Thomas Laine – grundare av d365.se"
                className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-primary/20 mx-auto lg:mx-0"
              />
              <div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Grundare, d365.se
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Om Thomas Laine
                </h1>
                <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                  Thomas Laine har arbetat i ERP- och CRM-marknaden i snart 40 år, varav nästan
                  30 år i det ekosystem som idag är Microsoft Dynamics 365.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bakgrund */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Bakgrund</h2>
              <p>
                Resan började på Damgaard, med produkter som Concorde XAL och Axapta. Efter
                samgåendet mellan Damgaard och Navision följde 13 år på Microsoft Sverige, bland
                annat som affärsområdeschef för Business Solutions och som partneransvarig för
                Dynamics 365. Det innebär många år på insidan av det partnerlandskap som svenska
                företag idag ska navigera.
              </p>
              <p>
                Sedan 2015 driver Thomas eget genom Cloud Ahead AB, med fokus på
                go-to-market-strategi och partnerstrategi i Dynamics-ekosystemet.
              </p>
            </div>
          </div>
        </section>

        {/* Varför d365.se finns */}
        <section className="py-12 sm:py-16 bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Varför d365.se finns</h2>
              <p>
                Efter att ha sett hundratals ERP- och CRM-projekt från både leverantörens och
                partnerns sida blev mönstret tydligt: de projekt som misslyckas gör det sällan
                på grund av fel funktionalitet. De misslyckas på grund av fel partner.
              </p>
              <p>
                Samtidigt saknade svenska köpare en oberoende plats att utgå från. All
                information kom från dem som ville sälja något.
              </p>
              <p>
                d365.se grundades tillsammans med Michael Uhman för att vara motvikten: en
                plattform som inte säljer system, inte säljer implementation, och inte tar betalt
                per lead.
              </p>
            </div>
          </div>
        </section>

        {/* Vad det betyder för dig */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Vad det betyder för dig</h2>
              <p>
                När du läser en artikel, jämför partners eller använder våra verktyg gör du det
                med vetskapen att ingen har betalat för att hamna överst. Bedömningarna bygger
                på snart fyra decenniers erfarenhet av vad som faktiskt avgör om ett projekt
                lyckas.
              </p>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-12 sm:py-16 bg-secondary/20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-8 sm:p-10 shadow-[var(--shadow-card)]">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Kontakt</h2>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                Hör gärna av dig direkt om du har en fråga om Dynamics 365, partnerval eller
                vill bolla ett pågående projekt.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  href="mailto:thomas.laine@dynamicfactory.se"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  <Mail className="w-4 h-4" /> thomas.laine@dynamicfactory.se
                </a>
                <a
                  href="tel:+46722324060"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary"
                >
                  <Phone className="w-4 h-4" /> +46 72 232 40 60
                </a>
                <a
                  href="https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ismsaljsauthenabled&ep=mlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] text-white text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" /> Boka möte
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary"
                >
                  <img src={linkedinLogo} alt="" className="w-4 h-4" /> Thomas Laine på LinkedIn
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-border text-sm">
                <Link to="/om-michael-uhman/" className="text-primary hover:underline font-medium">
                  Läs även om medgrundaren Michael Uhman →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OmThomasLaine;
