import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessSchema, BreadcrumbSchema, AdvisorsSchema } from "@/components/StructuredData";

// Breadcrumb items
const contactBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kontakt", url: "https://d365.se/kontakt" },
];

import { Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";
import thomasLaineHeader from "@/assets/thomas-laine-kokai.jpg.asset.json";
import michaelUhmanPhoto from "@/assets/michael-uhman.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Kontakt – köparsidig guide till Dynamics 365 | d365.se"
        description="Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner. Boka kostnadsfritt möte med Thomas Laine eller Michael Uhman för rådgivning utan säljpåverkan."
        canonicalPath="/kontakt"
        keywords="kontakt, Dynamics 365, rådgivning, konsult, Microsoft"
        ogImage="https://d365.se/og-kontakt.png"
      />
      <LocalBusinessSchema />
      <AdvisorsSchema />
      <BreadcrumbSchema items={contactBreadcrumbs} />
      <Navbar />
      <main>
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[340px] sm:h-[420px] md:h-[480px]">
        <div className="absolute inset-0 grid grid-cols-2">
          <img
            src={thomasLaineHeader.url}
            alt="Thomas Laine"
            className="w-full h-full object-cover object-top"
          />
          <img
            src={michaelUhmanPhoto}
            alt="Michael Uhman"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--background)/0.15),_hsl(var(--background)/0.85))]" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 drop-shadow-lg">
                Ett samtal innan partnerdialogen börjar
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow">
                Ställ frågor om Dynamics 365, hur en upphandling brukar se ut, eller bolla vilka partners som rimligen bör finnas på din kortlista – från köparens perspektiv.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Intro */}
            <div className="mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto text-center space-y-4">
              <p className="text-lg text-foreground font-medium">
                Ett Dynamics 365-val avgörs sällan av funktioner ensam.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                Det avgörs av rätt vägval, rätt omfattning och rätt partner – utifrån din verksamhet, din komplexitet och det ansvar du själv vill ta över tid.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                d365.se bygger på lång erfarenhet av Microsofts affärsapplikationer, partnerlandskapet och hur svenska företag faktiskt väljer, upphandlar och utvecklar ERP- och CRM-lösningar.
              </p>
            </div>

            {/* Contact Persons Section */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Thomas Laine */}
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border ">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                      <img 
                        src={thomasLainePhoto} 
                        alt="Thomas Laine - Dynamics 365 Konsult" 
                        className="w-28 h-28 md:w-32 md:h-32 rounded object-cover border-4 border-primary/20"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-card-foreground mb-1">Thomas Laine</h3>
                      <p className="text-sm text-muted-foreground mb-4">Medgrundare, d365.se<br />Köparsidig rådgivare med lång erfarenhet av Microsoft Dynamics 365, ERP, CRM och partnerlandskapet.</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href="mailto:thomas.laine@dynamicfactory.se" className="text-sm text-primary hover:underline">
                            thomas.laine@dynamicfactory.se
                          </a>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href="tel:+46722324060" className="text-sm text-primary hover:underline">
                            +46 72 232 40 60
                          </a>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <img src={linkedinLogo} alt="LinkedIn-profil" className="w-4 h-4" />
                          <a href="https://linkedin.com/in/thomaslaine" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Thomas Laine | LinkedIn
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <Button 
                          size="sm"
                          className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white w-full"
                          onClick={() => window.location.href = 'mailto:thomas.laine@dynamicfactory.se'}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Skicka e-post
                        </Button>
                        <a 
                          href="https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ismsaljsauthenabled&ep=mlink" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)]  text-white w-full"
                        >
                          <Calendar className="w-4 h-4" />
                          Boka möte
                        </a>
                        <Link
                          to="/om-thomas-laine/"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 border border-border bg-card hover:bg-secondary text-card-foreground w-full"
                        >
                          Om Thomas Laine
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Michael Uhman */}
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border ">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                      <img 
                        src={michaelUhmanPhoto} 
                        alt="Michael Uhman - Dynamics 365 Konsult" 
                        className="w-28 h-28 md:w-32 md:h-32 rounded object-cover border-4 border-primary/20"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-card-foreground mb-1">Michael Uhman</h3>
                      <p className="text-sm text-muted-foreground mb-4">Medgrundare, d365.se<br />Köparsidig rådgivare med lång erfarenhet av affärssystem, verksamhetsutveckling, partnerlandskapet och Dynamics 365-relaterade beslut.</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href="mailto:michael.uhman@dynamicfactory.se" className="text-sm text-primary hover:underline">
                            michael.uhman@dynamicfactory.se
                          </a>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href="tel:+46705748850" className="text-sm text-primary hover:underline">
                            +46 70 574 88 50
                          </a>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <img src={linkedinLogo} alt="LinkedIn-profil" className="w-4 h-4" />
                          <a href="https://www.linkedin.com/in/michael-uhman-60a69b17/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Michael Uhman | LinkedIn
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <Button 
                          size="sm"
                          className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white w-full"
                          onClick={() => window.location.href = 'mailto:michael.uhman@dynamicfactory.se'}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Skicka e-post
                        </Button>
                        <Link
                          to="/om-michael-uhman/"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 border border-border bg-card hover:bg-secondary text-card-foreground w-full"
                        >
                          Om Michael Uhman
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process and Services Section */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Vad händer när du kontaktar oss?
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Vi tror på transparens och tydlighet från första kontakten. Här är exakt vad du kan förvänta dig.
                </p>
              </div>

              {/* Services Offered */}
              <div className="bg-secondary/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Våra tjänster
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Kostnadsfri rådgivning</h4>
                      <p className="text-sm text-muted-foreground">Boka ett kostnadsfritt samtal med en senior rådgivare som hjälper dig förstå vilken lösning och Microsoftpartner som borde passa din verksamhet</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Upphandlingsstöd</h4>
                      <p className="text-sm text-muted-foreground">Vi står vid din sida genom hela processen för att undvika vanliga fallgropar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Partnerutvärdering</h4>
                      <p className="text-sm text-muted-foreground mb-2">Hjälp att välja rätt implementeringspartner</p>
                      <Link to="/valjdynamics365partner/" className="text-sm text-primary hover:underline font-medium">
                        Prova gärna vår Partnerväljare →
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-secondary/30 rounded-lg p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Redo att komma igång?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Boka ett kostnadsfritt samtal idag och ta första steget mot en mer effektiv verksamhet med Microsoft Dynamics 365.
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-14 sm:h-16 rounded"
                >
                  Boka in en kostnadsfri rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
