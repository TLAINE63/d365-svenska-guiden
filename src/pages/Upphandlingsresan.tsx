import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import BuyerJourneyStages from "@/components/BuyerJourneyStages";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const Upphandlingsresan = () => {
  return (
    <>
      <SEOHead
        title="Den typiska upphandlingsresan – 7 stadier för ERP & CRM"
        description="Två frågor visar var ni står i upphandlingsresan för Dynamics 365 (ERP och CRM). Köparsidig vägledning inför val av Dynamics 365 och partner."
        canonicalPath="/kunskapscenter/upphandlingsresan"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        <BuyerJourneyStages />

        {/* Steg 1: Kravspecifikation */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-[#F4F8F8]">
          <div className="container mx-auto max-w-6xl">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[hsl(40_30%_98%)] to-[hsl(180_25%_95%)] border border-border shadow-2xl p-7 sm:p-9 flex flex-col">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-[hsl(var(--cta-orange))] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, hsl(var(--foreground)) 0, hsl(var(--foreground)) 1px, transparent 1px, transparent 28px)' }} />

              <div className="relative flex flex-col h-full">
                <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary mb-5">
                  <Check className="w-3 h-3" />
                  Steg 1 · Vad behöver ni?
                </div>
                <h2 className="text-2xl sm:text-[26px] md:text-[30px] font-bold text-foreground mb-3 leading-[1.15] tracking-tight">
                  Kom igång med er <span className="text-primary">kravspecifikation</span>
                </h2>
                <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  Få ett strukturerat underlag som hjälper er att beskriva behov, processer och prioriteringar inför dialogen med Dynamics 365-partners. Välj område och börja direkt.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { label: "ERP / Affärssystem", link: "/kravspecifikation/" },
                    { label: "Försäljning", link: "/kravspecifikation-sales/" },
                    { label: "Marknadsföring", link: "/kravspecifikation-marketing/" },
                    { label: "Kundservice", link: "/kravspecifikation-kundservice/" },
                  ].map((spec) => (
                    <Link
                      key={spec.link}
                      to={spec.link}
                      className="group/item flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-card hover:bg-primary/5 border border-border hover:border-primary/40 text-[14px] font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span>{spec.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary" />
                  Gratis · Ange e-post för PDF · Dokument du kan dela internt
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Steg 2: Partner-matchning */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(195_45%_10%)] via-[hsl(190_40%_14%)] to-[hsl(20_55%_18%)] border border-[hsl(var(--cta-orange))]/30 shadow-2xl p-7 sm:p-9 flex flex-col">
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[hsl(var(--cta-orange))]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

              <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
                <div>
                  <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--cta-orange))] text-[10.5px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[hsl(var(--cta-orange))]/40 mb-5">
                    <Sparkles className="w-3 h-3" />
                    Steg 2 · Vem ska ni prata med?
                  </div>
                  <h2 className="text-2xl sm:text-[26px] md:text-[30px] font-bold text-white mb-3 leading-[1.15] tracking-tight">
                    Hitta rätt typ av <span className="text-[hsl(var(--cta-orange))]">Dynamics 365-partner</span>
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-white/75 leading-relaxed mb-6 max-w-2xl">
                    Svara på några frågor om er verksamhet, ert behov och er situation. På ett par minuter får ni en köparsidig rekommendation om vilken typ av partner som passar bäst.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-white/10 max-w-xl">
                    <div>
                      <div className="text-2xl font-bold text-[hsl(var(--cta-orange))] leading-none">2 min</div>
                      <div className="text-[11px] text-white/60 mt-1">Tar att fylla i</div>
                    </div>
                    <div className="border-l border-white/10 pl-3">
                      <div className="text-2xl font-bold text-white leading-none">100%</div>
                      <div className="text-[11px] text-white/60 mt-1">Köparsidig</div>
                    </div>
                    <div className="border-l border-white/10 pl-3">
                      <div className="text-2xl font-bold text-white leading-none">0 kr</div>
                      <div className="text-[11px] text-white/60 mt-1">Ingen registrering</div>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white text-[15px] font-semibold h-12 px-7 rounded-xl shadow-lg shadow-[hsl(var(--cta-orange))]/40 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/50 hover:-translate-y-0.5 transition-all group/btn"
                  >
                    <Link to="/valjdynamics365partner/">
                      Starta partnermatchning
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Upphandlingsresan;
