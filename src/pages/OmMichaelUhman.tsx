import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import michaelUhmanPhoto from "@/assets/michael-uhman.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const PERSON_ID = "https://d365.se/om-michael-uhman#michael-uhman";
const LINKEDIN_URL = "https://www.linkedin.com/in/michael-uhman-60a69b17/";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kontakt", url: "https://d365.se/kontakt" },
  { name: "Om Michael Uhman", url: "https://d365.se/om-michael-uhman" },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Michael Uhman",
  jobTitle: "Medgrundare, d365.se",
  description:
    "Drygt 25 år i Microsoft Dynamics-ekosystemet. Bakgrund från affärssystem, verksamhetsutveckling och partnerlandskapet runt Dynamics 365. Medgrundare av d365.se tillsammans med Thomas Laine.",
  url: "https://d365.se/om-michael-uhman",
  image: "https://d365.se/og-kontakt.png",
  sameAs: [LINKEDIN_URL],
  worksFor: {
    "@type": "Organization",
    name: "d365.se",
    url: "https://d365.se",
  },
};

const OmMichaelUhman = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Om Michael Uhman – medgrundare av d365.se"
        description="Michael Uhman har arbetat med affärssystem och verksamhetsutveckling i drygt 25 år, främst i Microsoft Dynamics-ekosystemet. Medgrundare av d365.se."
        canonicalPath="/om-michael-uhman/"
        keywords="Michael Uhman, d365.se, Dynamics 365, ERP, CRM, Microsoft, verksamhetsutveckling"
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
                src={michaelUhmanPhoto}
                alt="Michael Uhman – medgrundare av d365.se"
                className="w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-primary/20 mx-auto lg:mx-0"
              />
              <div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Medgrundare, d365.se
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Om Michael Uhman
                </h1>
                <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                  Michael Uhman har arbetat med affärssystem och verksamhetsutveckling i drygt
                  25 år, främst i det ekosystem som idag är Microsoft Dynamics 365.
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
                Michaels bana har gått genom hela kedjan kring affärssystem — från upphandling
                och kravdialog till implementation, förvaltning och vidareutveckling. Det
                gemensamma har varit Microsofts ekosystem och de partners som levererar i det.
              </p>
              <p>
                Han har arbetat tätt med köpare i tillverkning, handel, tjänsteföretag och
                offentlig verksamhet, och har sett vad som skiljer ett lyckat ERP- eller
                CRM-projekt från ett som spårar ur — sällan tekniken, oftast styrning, scope
                och valet av partner.
              </p>
              <p>
                Sedan 2015 driver Michael rådgivning genom Moveahead AB tillsammans med Thomas
                Laine, med fokus på partnerstrategi, kravarbete och köparsidig vägledning i
                Dynamics 365-affären.
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
                Efter att ha följt hundratals upphandlingar och implementationer från nära håll
                blev mönstret tydligt: köparna saknade en plats där de kunde förstå Dynamics
                365, jämföra partners och ställa rätt frågor — utan att bli styrda av den som
                ville sälja något.
              </p>
              <p>
                d365.se grundades tillsammans med Thomas Laine för att vara den platsen. En
                plattform som inte säljer system, inte säljer implementation och inte tar betalt
                per lead — utan står på köparens sida hela vägen genom valet.
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
                på ett kvartssekel av erfarenhet av vad som faktiskt avgör om ett projekt
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
                  href="mailto:michael.uhman@dynamicfactory.se"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  <Mail className="w-4 h-4" /> michael.uhman@dynamicfactory.se
                </a>
                <a
                  href="tel:+46705748850"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary"
                >
                  <Phone className="w-4 h-4" /> +46 70 574 88 50
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-border bg-background text-sm font-medium hover:bg-secondary sm:col-span-2"
                >
                  <img src={linkedinLogo} alt="" className="w-4 h-4" /> Michael Uhman på LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OmMichaelUhman;
