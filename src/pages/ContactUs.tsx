import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import VideoCard from "@/components/VideoCard";
import { Mail, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";
import linkedinLogo from "@/assets/linkedin-logo.jfif";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
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
                Kontakta Oss
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95">
                Vi hjälper dig genom transformationen av din verksamhet med Microsoft Dynamics 365
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Information */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Contact Person Section */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                  Din Kontaktperson
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground px-2">
                  Har du frågor om Microsoft Dynamics 365? Kontakta oss!
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-8 md:p-12 border border-border shadow-[var(--shadow-card)]">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <img 
                      src={thomasLainePhoto} 
                      alt="Thomas Laine - Dynamics 365 Konsult" 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                  
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">Thomas Laine</h3>
                    <p className="text-lg text-muted-foreground mb-4">Senior Rådgivare inom Microsoft Business Applications</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="mailto:thomas.laine@dynamicfactory.se" className="text-primary hover:underline">
                          thomas.laine@dynamicfactory.se
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <a href="tel:+46722324060" className="text-primary hover:underline">
                          +46 72 232 40 60
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5" />
                        <a href="https://linkedin.com/in/thomaslaine" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          linkedin.com/in/thomaslaine
                        </a>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Med över 25 års erfarenhet av Microsoft Dynamics 365 hjälper Thomas företag att välja rätt lösning och lyckas med sina ERP- och CRM-projekt.
                      </p>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => window.location.href = 'mailto:thomas.laine@dynamicfactory.se'}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Skicka e-post till mig
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
                        onClick={() => window.open('https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ep=mlink', '_blank')}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Boka möte med mig
                      </Button>
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

              {/* Services Introduction Video */}
              <div className="mb-12 max-w-4xl mx-auto">
                <VideoCard
                  title="Thomas berättar om våra tjänster"
                  description="En personlig genomgång av hur vi hjälper företag med Microsoft Dynamics 365 – från första kontakt till långsiktigt samarbete."
                  videoId=""
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Process Steps */}
                <Card className="p-6 border-border bg-card">
                  <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Första kontakten
                  </h3>
                  <p className="text-muted-foreground">
                    Vi svarar inom 24 timmar och bokar ett första samtal där vi lyssnar på dina behov och utmaningar.
                  </p>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Behovsanalys
                  </h3>
                  <p className="text-muted-foreground">
                    Vi går igenom din nuvarande situation och diskuterar vilka lösningar som passar bäst för just er verksamhet.
                  </p>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Skräddarsytt förslag
                  </h3>
                  <p className="text-muted-foreground">
                    Du får ett tydligt förslag med rekommenderade lösningar, tidplan och transparent prissättning.
                  </p>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Implementering
                  </h3>
                  <p className="text-muted-foreground">
                    Vi guidar er genom hela processen - från upphandling till implementation och support.
                  </p>
                </Card>
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
                      <p className="text-sm text-muted-foreground">Första konsultationen är alltid gratis</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Lösningsval</h4>
                      <p className="text-sm text-muted-foreground">Hjälp att välja rätt Dynamics 365-lösning</p>
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
                      <p className="text-sm text-muted-foreground">Guidning genom hela upphandlingsprocessen</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Partnervärdering</h4>
                      <p className="text-sm text-muted-foreground">Hjälp att välja rätt implementeringspartner</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Projektledning</h4>
                      <p className="text-sm text-muted-foreground">Support genom hela implementationen</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Långsiktigt stöd</h4>
                      <p className="text-sm text-muted-foreground">Vi finns kvar även efter go-live</p>
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Boka Gratis Konsultation
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
