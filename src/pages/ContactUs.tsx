import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessSchema } from "@/components/StructuredData";

import { Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";
import michaelUhmanPhoto from "@/assets/michael-uhman.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Kontakta oss | Dynamics 365 Rådgivning"
        description="Kontakta våra senior rådgivare för kostnadsfri rådgivning om Microsoft Dynamics 365. Boka möte med Thomas Laine eller Michael Uhman."
        canonicalPath="/kontakt"
        keywords="kontakt, Dynamics 365, rådgivning, konsult, Microsoft"
      />
      <LocalBusinessSchema />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[300px] sm:h-[400px] md:h-[450px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2070" 
            alt="Contact and consultation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Innan du bestämmer dig
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95">
                Låt oss guida dig i valet av Dynamics 365 lösning och implementationspartner
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Information */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Contact Persons Section */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Thomas Laine */}
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-card)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                      <img 
                        src={thomasLainePhoto} 
                        alt="Thomas Laine - Dynamics 365 Konsult" 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-card-foreground mb-1">Thomas Laine</h3>
                      <p className="text-sm text-muted-foreground mb-4">Senior Rådgivare inom Microsoft affärslösningar Dynamics 365, Power Platform och Copilot</p>
                      
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
                          <img src={linkedinLogo} alt="LinkedIn" className="w-4 h-4" />
                          <a href="https://linkedin.com/in/thomaslaine" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Thomas Laine | LinkedIn
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <Button 
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                          onClick={() => window.location.href = 'mailto:thomas.laine@dynamicfactory.se'}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Skicka e-post
                        </Button>
                        <a 
                          href="https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ismsaljsauthenabled&ep=mlink" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 py-2 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white w-full"
                        >
                          <Calendar className="w-4 h-4" />
                          Boka möte
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Michael Uhman */}
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-card)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                      <img 
                        src={michaelUhmanPhoto} 
                        alt="Michael Uhman - Dynamics 365 Konsult" 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-card-foreground mb-1">Michael Uhman</h3>
                      <p className="text-sm text-muted-foreground mb-4">Senior Rådgivare inom Microsoft affärslösningar Dynamics 365, Power Platform och Copilot</p>
                      
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
                          <img src={linkedinLogo} alt="LinkedIn" className="w-4 h-4" />
                          <a href="https://www.linkedin.com/in/michael-uhman-60a69b17/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Michael Uhman | LinkedIn
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <Button 
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                          onClick={() => window.location.href = 'mailto:michael.uhman@dynamicfactory.se'}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Skicka e-post
                        </Button>
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
                      <p className="text-sm text-muted-foreground">Boka ett kostnadsfritt samtal med en senior rådgivare som hjälper dig förstå vilken lösning och Microsoftpartner som borde passa er verksamhet</p>
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
                      <p className="text-sm text-muted-foreground">Vi står vid er sida genom hela processen för att undvika vanliga fallgropar</p>
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
                      <Link to="/valj-partner" className="text-sm text-primary hover:underline font-medium">
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 sm:h-16 rounded-xl"
                >
                  Boka in en kostnadsfri rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
