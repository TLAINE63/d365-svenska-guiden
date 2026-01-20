import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommonMistakesTeaser = () => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-amber-200 dark:border-amber-800/50 shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-3">
                    3 vanliga misstag vid val av Dynamics 365-partner
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <strong className="text-card-foreground">Fokusera bara på pris</strong> – den billigaste lösningen blir ofta den dyraste i längden
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <strong className="text-card-foreground">Ignorera branschexpertis</strong> – en generalist kan missa kritiska branschspecifika behov
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        <strong className="text-card-foreground">Inte kolla referenser</strong> – liknande projekt och kundreferenser är avgörande
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="group">
                    <Link to="/valj-partner">
                      Hitta rätt partner – undvik misstagen
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonMistakesTeaser;
