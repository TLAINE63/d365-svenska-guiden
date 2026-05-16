import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { ArrowRight } from "lucide-react";
import { useCoveredIndustries } from "@/hooks/useCoveredIndustries";

const Branscher = () => {
  const { covered } = useCoveredIndustries();
  const visibleIndustries = STANDARD_INDUSTRIES.filter((i) => covered.has(i.name));
  return (
    <>
      <SEOHead
        title="Branscher – Microsoft Dynamics 365 i Sverige"
        description="Branschguider för Microsoft Dynamics 365: affärsprocesser, utmaningar, roller och vilka D365-applikationer som passar din bransch."
        canonicalPath="/branscher"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Branscher
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Hur Microsoft Dynamics 365 används i din bransch – affärsprocesser,
              utmaningar, roller och rätt partners.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  to={`/branscher/${ind.slug}`}
                  className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {ind.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Processer, utmaningar, roller och partners.
                  </span>
                  <span className="mt-auto pt-2 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Öppna <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Branscher;
