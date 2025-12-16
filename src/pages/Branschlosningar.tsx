import { Link } from "react-router-dom";
import { Search, Factory, Building2, ShoppingCart, Truck, Stethoscope, HardHat, Leaf, Utensils, Monitor, Wrench, Users, Briefcase, Store, Zap, Package } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

interface Industry {
  name: string;
  slug: string;
  icon: React.ElementType;
  description: string;
}

const industries: Industry[] = [
  { name: "Tillverkning", slug: "tillverkning", icon: Factory, description: "Affärssystem för tillverkande företag" },
  { name: "Handel & Distribution", slug: "handel-distribution", icon: ShoppingCart, description: "Lösningar för handels- och distributionsföretag" },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", icon: HardHat, description: "System för bygg- och entreprenadföretag" },
  { name: "Transport & Logistik", slug: "transport-logistik", icon: Truck, description: "Affärssystem för transport och logistik" },
  { name: "Fastigheter", slug: "fastigheter", icon: Building2, description: "Lösningar för fastighetsbranschen" },
  { name: "Livsmedel", slug: "livsmedel", icon: Utensils, description: "System för livsmedelsindustrin" },
  { name: "Läkemedel & Life Science", slug: "lakemedel-life-science", icon: Stethoscope, description: "Lösningar för läkemedel och life science" },
  { name: "Energi", slug: "energi", icon: Zap, description: "Affärssystem för energisektorn" },
  { name: "Service & Underhåll", slug: "service-underhall", icon: Wrench, description: "System för serviceföretag" },
  { name: "Konsultföretag", slug: "konsultforetag", icon: Briefcase, description: "Lösningar för konsultbolag" },
  { name: "IT & Tech", slug: "it-tech", icon: Monitor, description: "Affärssystem för IT-branschen" },
  { name: "Detaljhandel", slug: "detaljhandel", icon: Store, description: "System för detaljhandeln" },
  { name: "Medlemsorganisationer", slug: "medlemsorganisationer", icon: Users, description: "Lösningar för medlemsorganisationer" },
  { name: "Miljö & Återvinning", slug: "miljo-atervinning", icon: Leaf, description: "System för miljö- och återvinningsbranschen" },
  { name: "Parti- & Agenturhandel", slug: "parti-agenturhandel", icon: Package, description: "Lösningar för parti- och agenturhandel" },
];

const Branschlosningar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIndustries = industries.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Branschlösningar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Hitta rätt Dynamics 365-lösning för din bransch. Välj din bransch nedan för att se vilka Microsoft-lösningar som passar bäst.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Sök bransch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredIndustries.map((industry) => (
              <Link
                key={industry.slug}
                to={`/branschlosningar/${industry.slug}`}
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <industry.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {industry.name}
                </span>
              </Link>
            ))}
          </div>

          {filteredIndustries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Inga branscher hittades för "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Hittar du inte din bransch?
          </h2>
          <p className="text-muted-foreground mb-6">
            Kontakta oss så hjälper vi dig att hitta rätt lösning för just din verksamhet.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Kontakta oss
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Branschlosningar;
