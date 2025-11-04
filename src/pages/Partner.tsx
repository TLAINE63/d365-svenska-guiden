import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, Users, Handshake, TrendingUp } from "lucide-react";

const Partner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Bli vår partner
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Tillsammans skapar vi framgångsrika Dynamics 365-lösningar för era kunder
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
              <Link to="/kontakt">Kontakta oss</Link>
            </Button>
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
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att bli partner?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för att diskutera hur vi kan samarbeta och skapa värde tillsammans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
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
