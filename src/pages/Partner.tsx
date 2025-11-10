import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Handshake, TrendingUp, ArrowRight, Calendar } from "lucide-react";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";

const Partner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2070" 
            alt="Business partnership and collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <Handshake className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Implementationspartner
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-8">
                Säkerställ verklig affärsnytta tillsammans med rätt partner
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/kontakt">
                  <span>Kontakta oss</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Viktiga frågor Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Fem viktiga frågor vid val av implementationspartner
              </h2>
              <p className="text-lg text-muted-foreground">
                Här är fem viktiga frågor du (eller din organisation) bör ställa er själva inför valet av implementationspartner för Dynamics 365
              </p>
            </div>

            <div className="space-y-8">
              {/* Fråga 1 */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <span className="text-2xl">✅</span>
                    Har partnern erfarenhet av vår bransch och våra processer?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Har de genomfört liknande projekt tidigare?</li>
                    <li>• Förstår de våra specifika krav inom t.ex. tillverkning, tjänster, handel eller offentlig sektor?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 2 */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <span className="text-2xl">✅</span>
                    Hur ser deras implementationsmetodik ut?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Arbetar de enligt en beprövad metod (t.ex. Microsoft's Success by Design)?</li>
                    <li>• Hur hanterar de projektledning, förändringsledning och utbildning?</li>
                    <li>• Erbjuder de en snabbstart eller paketerad lösning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 3 */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <span className="text-2xl">✅</span>
                    Vilken typ av support och förvaltning erbjuder de efter implementationen?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Finns det en tydlig plan för support, uppgraderingar och vidareutveckling?</li>
                    <li>• Har de en dedikerad supportorganisation?</li>
                    <li>• Erbjuder de SLA:er och proaktiv förvaltning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 4 */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <span className="text-2xl">✅</span>
                    Hur transparenta är de med kostnader och tidsplan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Får vi en tydlig offert med alla kostnader specificerade?</li>
                    <li>• Hur hanterar de förändringar i omfattning?</li>
                    <li>• Har de referensprojekt med liknande budget och tidsram?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 5 */}
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-xl">
                    <span className="text-2xl">✅</span>
                    Hur väl passar de vår organisationskultur och arbetssätt?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Är de lyhörda, pedagogiska och samarbetsvilliga?</li>
                    <li>• Känns de som en långsiktig partner snarare än bara en leverantör?</li>
                    <li>• Har vi god personkemi med deras team?</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
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
                  Vill du ha hjälp att välja rätt partner?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Vi har lång erfarenhet och goda insikter i marknaden och vilka partners som typiskt passar för olika typer av verksamheter och applikationsområden
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/kontakt">Kontakta oss</Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
                onClick={() => window.open('https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ep=mlink', '_blank')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Boka möte med mig
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="mailto:thomas.laine@dynamicfactory.se">thomas.laine@dynamicfactory.se</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;
