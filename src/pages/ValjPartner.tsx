import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Building2, Award, Target, Shield } from "lucide-react";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";

const ValjPartner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Teamwork and partnership selection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Välj Partner
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8">
                Hitta rätt implementationspartner för din Dynamics 365-resa
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto text-lg sm:text-xl h-16 sm:h-20 px-8 sm:px-12 font-bold shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Link to="/kontakt">
                  <span>Få hjälp att välja rätt partner</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Varför är partnerval så viktigt?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Valet av implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
              En bra partner kan vara skillnaden mellan ett framgångsrikt projekt och ett som kostar mer tid och pengar än planerat.
            </p>
          </div>
        </div>
      </section>

      {/* Key Factors Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Viktiga faktorer vid partnerval
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Här är de viktigaste aspekterna att överväga när du väljer din Dynamics 365-partner
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Building2 className="h-6 w-6 text-primary" />
                    Branscherfarenhet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    En partner med erfarenhet inom din bransch förstår dina unika utmaningar och kan snabbare leverera värde.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Award className="h-6 w-6 text-primary" />
                    Microsoft-certifieringar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Kontrollera att partnern har rätt Microsoft-kompetenser och certifieringar för de produkter du behöver.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    Implementationsmetodik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    En beprövad projektmetodik säkerställer att projektet levereras i tid och inom budget.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Shield className="h-6 w-6 text-primary" />
                    Support & Förvaltning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Eftermarknadsstöd är avgörande för långsiktig framgång. Säkerställ att partnern erbjuder bra supportavtal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-shrink-0">
                <img 
                  src={thomasLainePhoto} 
                  alt="Thomas Laine" 
                  className="w-48 h-48 rounded-full object-cover object-[50%_15%] border-4 border-primary/20"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Behöver du vägledning?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Med vår breda erfarenhet av Dynamics 365-marknaden kan vi hjälpa dig att hitta rätt partner för just dina behov och förutsättningar.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Link to="/kontakt">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Kontakta oss
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => window.open('https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ep=mlink', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Boka möte
              </Button>
              <Button asChild size="lg" className="bg-muted hover:bg-muted/80 text-muted-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl border border-border">
                <a href="mailto:thomas.laine@dynamicfactory.se">
                  <Mail className="w-5 h-5 mr-2" />
                  Emaila mig
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ValjPartner;