import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Handshake, TrendingUp, ArrowRight } from "lucide-react";

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

      {/* Varför partner Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Varför samarbeta med oss?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder expertis, support och gemensamma affärsmöjligheter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Erfaren expertis</CardTitle>
                <CardDescription>
                  Tillgång till vårt team av certifierade Dynamics 365-konsulter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Teknisk support och rådgivning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Best practices och implementeringsstöd</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Kontinuerlig utbildning</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Samarbetsmöjligheter</CardTitle>
                <CardDescription>
                  Gemensamma projekt och affärsutveckling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Co-selling och lead-delning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Gemensamma kundprojekt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Branschspecifika lösningar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tillväxt & Utveckling</CardTitle>
                <CardDescription>
                  Väx era Dynamics 365-kompetenser och affärer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Certifieringsstöd</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Marknadsföringsmaterial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Partnernätverk och events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnertyper Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Partnertyper
              </h2>
              <p className="text-lg text-muted-foreground">
                Vi välkomnar olika typer av samarbetspartners
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Implementeringspartner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Konsultföretag som implementerar Dynamics 365-lösningar hos slutkunder.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Teknisk support under projekt</li>
                    <li>• Resursförstärkning vid behov</li>
                    <li>• Gemensam försäljning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ISV-partner (Independent Software Vendor)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Mjukvaruutvecklare som bygger tilläggslösningar för Dynamics 365.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Integration av era lösningar</li>
                    <li>• Co-marketing möjligheter</li>
                    <li>• AppSource-publicering</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Återförsäljare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Partner som säljer Dynamics 365-licenser och relaterade tjänster.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Konkurrenskraftiga villkor</li>
                    <li>• Säljstöd och utbildning</li>
                    <li>• Lead-generering</li>
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att bli partner?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för att diskutera hur vi kan samarbeta och skapa värde tillsammans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/kontakt">Kontakta oss</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="mailto:info@dynamicfactory.se">info@dynamicfactory.se</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;
