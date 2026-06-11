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
    "IT-entreprenör med 40 år i branschen och fokus på att hjälpa Microsoft-partners och kunder att accelerera sin Dynamics 365-affär. Medgrundare av d365.se och delägare i Dynamic Factory, Moveahead AB och Kokai Consulting.",
  url: "https://d365.se/om-michael-uhman",
  image: "https://d365.se/og-kontakt.png",
  sameAs: [LINKEDIN_URL],
  worksFor: {
    "@type": "Organization",
    name: "d365.se",
    url: "https://d365.se",
  },
  alumniOf: [
    { "@type": "Organization", name: "Microsoft" },
    { "@type": "Organization", name: "1ClickFactory" },
  ],
};

const OmMichaelUhman = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Om Michael Uhman – medgrundare av d365.se"
        description="Michael Uhman har 40 år i IT-branschen med fokus på Microsoft-partners och Dynamics 365. Medgrundare av d365.se och delägare i Dynamic Factory, Moveahead AB och Kokai Consulting."
        canonicalPath="/om-michael-uhman/"
        keywords="Michael Uhman, d365.se, Dynamics 365, NAV, Navision, AX, Axapta, Business Central, Dynamic Factory, Moveahead, 1ClickFactory, Kokai Consulting"
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
                  IT-entreprenör med 40 år i branschen, varav drygt 30 i det som idag är
                  Microsoft Dynamics 365. Michaels uppdrag har hela tiden handlat om en sak:
                  att hjälpa Microsofts partners och deras kunder att lyckas bättre med
                  affärssystem och CRM.
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
                Michael har arbetat med CRM- och ERP-system i över 30 år. Större delen av
                tiden har handlat om det som ursprungligen var Microsoft NAV (Navision),
                AX (Axapta) och Microsoft CRM — och som idag samlas under Microsoft
                Dynamics 365.
              </p>
              <p>
                Han har en gedigen bakgrund från Microsoft och har under många år arbetat
                med och genom partnerkanalen. Som tidigare VD för 1ClickFactory drev han
                tjänster för Microsoft-partners internationellt, och har genom åren samarbetat
                med hundratals partners i Norden och Europa — bland annat genom strategiska
                samarbeten som det med NCG Group kring BizView.
              </p>
              <p>
                Sedan 2017 driver Michael <strong>Moveahead AB</strong> tillsammans med
                Thomas Laine — en sparringpartner för Microsoft-partners som vill växa
                snabbare och få ut mer av sitt partnerskap med Microsoft. Han är också
                medgrundare av <strong>Dynamic Factory</strong>, som hjälpt över 100
                partnerföretag på resan mot en framgångsrik Dynamics 365-affär, och sitter
                som Board Member och Managing Partner i <strong>Kokai Consulting</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Vad Michael gör */}
        <section className="py-12 sm:py-16 bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Vad Michael arbetar med</h2>
              <p>
                Genom sina bolag arbetar Michael nära både Microsoft, partners och kunder.
                Tjänsterna spänner över hela kedjan i Dynamics 365-affären:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Partner-to-Partner (P2P)</strong> — uppsättning och koordinering av samarbeten mellan komplementära partners.</li>
                <li><strong>Presales as a Service</strong> — stöd i komplexa säljprocesser och kunddemonstrationer.</li>
                <li><strong>Säljträning</strong> för konsultorganisationer som vill växa sin Dynamics 365-affär.</li>
                <li><strong>Go-to-market-coaching</strong> för partners som lanserar nya erbjudanden eller går in i nya segment.</li>
                <li><strong>Rådgivning till slutkunder</strong> som överväger att investera i Microsoft Business Applications.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Varför d365.se finns */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Varför d365.se finns</h2>
              <p>
                Efter att i decennier ha sett upphandlingar och partnerval från insidan — både
                från Microsoft, från partnerledet och som rådgivare — blev mönstret tydligt:
                köparen saknade en plats där man kan förstå Dynamics 365, jämföra partners och
                ställa rätt frågor utan att styras av den som vill sälja något.
              </p>
              <p>
                d365.se grundades tillsammans med Thomas Laine för att vara den platsen — en
                plattform som inte säljer system, inte säljer implementation och inte tar
                betalt per lead, utan står på köparens sida hela vägen genom valet.
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
