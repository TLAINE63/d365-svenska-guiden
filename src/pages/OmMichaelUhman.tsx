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
    "Över 35 år i affärssystemsmarknaden. Tidigare VD för Damgaard Sverige och Navision Sverige, samt försäljningsdirektör på Microsoft Sverige med ansvar för SMB-marknaden och hela det svenska Dynamics-partnerledet. Medgrundare av d365.se.",
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
    { "@type": "Organization", name: "Navision" },
    { "@type": "Organization", name: "Damgaard" },
    { "@type": "Organization", name: "1ClickFactory" },
  ],
};

const OmMichaelUhman = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Om Michael Uhman – medgrundare av d365.se"
        description="Michael Uhman har arbetat med affärssystem och partnerkanaler i över 35 år. Tidigare VD för Damgaard Sverige och Navision Sverige, försäljningsdirektör på Microsoft Sverige, grundare av 1ClickFactory."
        canonicalPath="/om-michael-uhman/"
        keywords="Michael Uhman, d365.se, Dynamics 365, Damgaard, Navision, Microsoft, 1ClickFactory, partnerkanal"
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
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
                className="w-48 h-48 lg:w-64 lg:h-64 rounded object-cover border-4 border-primary/20 mx-auto lg:mx-0"
              />


              <div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Medgrundare, d365.se
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Om Michael Uhman
                </h1>
                <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                  Michael Uhman har arbetat med affärssystem och partnerkanaler i över 35 år,
                  och har sett Dynamics-marknaden från varje tänkbar position: som leverantör,
                  som Microsoft-chef och som tjänsteleverantör åt partnerledet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bakgrund */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Bakgrund</h2>
              <p>
                Michael grundade och ledde Damgaard Sverige, och blev senare VD för Navision
                Sverige efter samgåendet mellan de två bolagen. När Microsoft förvärvade
                Navision följde flera år som försäljningsdirektör på Microsoft Sverige, med
                ansvar för SMB-marknaden, hela det svenska partnerledet och Dynamics-affären.
              </p>
              <p>
                2012 startade han 1ClickFactory i Sverige och Norge, ett bolag som under tio
                år hjälpte Dynamics-partners med uppgraderingar, utveckling och modernisering
                av kundlösningar. Det innebär en ovanlig erfarenhet: att ha arbetat åt
                partners, inte bara med dem. Få vet lika väl hur svenska Dynamics-partners
                faktiskt arbetar, var de är starka och var de brister.
              </p>
            </div>
          </div>
        </section>

        {/* Varför d365.se finns */}
        <section className="py-8 sm:py-12 bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Varför d365.se finns</h2>
              <p>
                Efter decennier på leverantörs- och partnersidan var mönstret tydligt för både
                Michael och medgrundaren Thomas Laine: köparen är den enda parten i en ERP-
                eller CRM-upphandling som saknar en köparsidig röst vid bordet.
              </p>
              <p>
                d365.se byggdes för att vara den rösten. Plattformen säljer inga system och
                ingen implementation. Partners betalar en fast listningsavgift, oavsett
                storlek. Det är grunden för vår köparsidiga position.
              </p>
            </div>
          </div>
        </section>

        {/* Vad det betyder för dig */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-5 text-foreground/90 text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Vad det betyder för dig</h2>
              <p>
                När Michael bedömer en partners metodik, kapacitet eller branschvana gör han
                det med erfarenheten från att ha byggt, lett och servat partnerkanalen i över
                tre decennier. Det är skillnaden mellan att läsa en partnerpresentation och
                att veta vad som står mellan raderna.
              </p>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-8 sm:py-12 bg-secondary/20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-8 sm:p-10 ">
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
              <div className="mt-6 pt-6 border-t border-border text-sm">
                <Link to="/om-thomas-laine/" className="text-primary hover:underline font-medium">
                  Läs även om medgrundaren Thomas Laine →
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

export default OmMichaelUhman;
