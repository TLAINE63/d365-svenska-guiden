import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ContactFormDialog from "@/components/ContactFormDialog";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import thomasLainePhoto from "@/assets/thomas-laine-real.jpg";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[400px] md:h-[450px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2070" 
            alt="Contact and consultation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Kontakta Oss
              </h1>
              <p className="text-xl md:text-2xl text-white/95">
                Vi hjälper dig genom transformationen av din verksamhet med Microsoft Dynamics 365
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Contact Person Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Din Kontaktperson
                </h2>
                <p className="text-lg text-muted-foreground">
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
                    <p className="text-lg text-muted-foreground mb-4">Microsoft Business Applications Evangelist</p>
                    
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
                      
                      <p className="text-sm text-muted-foreground">
                        Med över 25 års erfarenhet av Microsoft Dynamics 365 hjälper Thomas företag att välja rätt lösning och lyckas med sina ERP- och CRM-projekt.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => window.location.href = 'mailto:thomas.laine@dynamicfactory.se'}
                      >
                        Skicka e-post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-secondary/30 rounded-lg p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Boka en gratis konsultation
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Låt oss hjälpa dig att hitta rätt Dynamics 365-lösning för din verksamhet. 
                Vi erbjuder kostnadsfri rådgivning och en skräddarsydd genomgång av dina behov.
              </p>
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/kontakt">Boka Gratis Konsultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              Varför välja oss?
            </h2>
            <div className="flex justify-center">
              <div className="text-center max-w-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">15+</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Års erfarenhet</h3>
                <p className="text-muted-foreground">
                  Expertis inom Microsoft Dynamics 365
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Dynamic Factory</p>
            <p className="text-sm mb-3">
              Microsoft Business Applications Evangelister
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link to="/dataskydd" className="hover:text-foreground transition-colors">
                Dataskyddspolicy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
