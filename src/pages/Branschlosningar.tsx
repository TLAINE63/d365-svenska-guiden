import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// Industry images
import tillverkningImg from "@/assets/industries/tillverkning.jpg";
import handelDistributionImg from "@/assets/industries/handel-distribution.jpg";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.jpg";
import transportLogistikImg from "@/assets/industries/transport-logistik.jpg";
import fastigheterImg from "@/assets/industries/fastigheter.jpg";
import livsmedel from "@/assets/industries/livsmedel.jpg";
import lakemedelLifeScienceImg from "@/assets/industries/lakemedel-life-science.jpg";
import energiImg from "@/assets/industries/energi.jpg";
import serviceUnderhallImg from "@/assets/industries/service-underhall.jpg";
import konsultforetagImg from "@/assets/industries/konsultforetag.jpg";
import itTechImg from "@/assets/industries/it-tech.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.jpg";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.jpg";
import miljoAtervinningImg from "@/assets/industries/miljo-atervinning.jpg";
import partiAgenturhandelImg from "@/assets/industries/parti-agenturhandel.jpg";

type ProductFilter = "all" | "bc" | "fsc" | "crm";

interface Industry {
  name: string;
  slug: string;
  image: string;
  description: string;
  products: ProductFilter[];
}

const industries: Industry[] = [
  { name: "Tillverkning", slug: "tillverkning", image: tillverkningImg, description: "Affärssystem för tillverkande företag", products: ["bc", "fsc"] },
  { name: "Handel & Distribution", slug: "handel-distribution", image: handelDistributionImg, description: "Lösningar för handels- och distributionsföretag", products: ["bc", "fsc", "crm"] },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", image: byggEntreprenadImg, description: "System för bygg- och entreprenadföretag", products: ["bc", "fsc", "crm"] },
  { name: "Transport & Logistik", slug: "transport-logistik", image: transportLogistikImg, description: "Affärssystem för transport och logistik", products: ["bc", "fsc"] },
  { name: "Fastigheter", slug: "fastigheter", image: fastigheterImg, description: "Lösningar för fastighetsbranschen", products: ["bc", "fsc", "crm"] },
  { name: "Livsmedel", slug: "livsmedel", image: livsmedel, description: "System för livsmedelsindustrin", products: ["bc", "fsc"] },
  { name: "Läkemedel & Life Science", slug: "lakemedel-life-science", image: lakemedelLifeScienceImg, description: "Lösningar för läkemedel och life science", products: ["bc", "fsc", "crm"] },
  { name: "Energi", slug: "energi", image: energiImg, description: "Affärssystem för energisektorn", products: ["fsc", "crm"] },
  { name: "Service & Underhåll", slug: "service-underhall", image: serviceUnderhallImg, description: "System för serviceföretag", products: ["bc", "fsc", "crm"] },
  { name: "Konsultföretag", slug: "konsultforetag", image: konsultforetagImg, description: "Lösningar för konsultbolag", products: ["bc", "crm"] },
  { name: "IT & Tech", slug: "it-tech", image: itTechImg, description: "Affärssystem för IT-branschen", products: ["bc", "crm"] },
  { name: "Detaljhandel", slug: "detaljhandel", image: detaljhandelImg, description: "System för detaljhandeln", products: ["bc", "fsc", "crm"] },
  { name: "Medlemsorganisationer", slug: "medlemsorganisationer", image: medlemsorganisationerImg, description: "Lösningar för medlemsorganisationer", products: ["bc", "crm"] },
  { name: "Miljö & Återvinning", slug: "miljo-atervinning", image: miljoAtervinningImg, description: "System för miljö- och återvinningsbranschen", products: ["bc", "fsc"] },
  { name: "Parti- & Agenturhandel", slug: "parti-agenturhandel", image: partiAgenturhandelImg, description: "Lösningar för parti- och agenturhandel", products: ["bc", "fsc"] },
];

const filterOptions: { value: ProductFilter; label: string; variant: "default" | "business-central" | "finance-supply" | "crm" }[] = [
  { value: "all", label: "Alla", variant: "default" },
  { value: "bc", label: "Business Central", variant: "business-central" },
  { value: "fsc", label: "Finance & Supply Chain", variant: "finance-supply" },
  { value: "crm", label: "CRM / Customer Engagement", variant: "crm" },
];

const Branschlosningar = () => {
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>("all");

  const filteredIndustries = selectedFilter === "all" 
    ? industries 
    : industries.filter((industry) => industry.products.includes(selectedFilter));

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
            Välj din bransch nedan för att se vilka Microsoftpartners som har god verksamhetskunskap inom din bransch.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? option.variant : "outline"}
                onClick={() => setSelectedFilter(option.value)}
                className={`text-sm sm:text-base ${
                  selectedFilter === option.value 
                    ? "" 
                    : "hover:bg-muted"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredIndustries.map((industry) => (
              <Link
                key={industry.slug}
                to={`/branschlosningar/${industry.slug}`}
                className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {industry.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredIndustries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Inga branscher hittades för det valda filtret.</p>
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
            Kontakta oss så hjälper vi dig att hitta rätt lösning och partner för just din verksamhet.
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
