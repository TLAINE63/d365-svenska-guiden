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
 title="Upphandlingsresan – 7 stadier för ERP & CRM"
 description="Två frågor visar var ni står i upphandlingsresan för Dynamics 365 (ERP och CRM). Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 canonicalPath="/kunskapscenter/upphandlingsresan"
 />
 <Navbar />
 <main className="min-h-screen bg-secondary/30">
 <BuyerJourneyStages />

 {/* Steg 1: Kravspecifikation */}
 <section className="bg-[hsl(var(--hero-dark))] py-10 sm:py-12 relative overflow-hidden border-b border-white/10">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.12),transparent_60%)] pointer-events-none" />
 <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />


 <div className="relative container mx-auto max-w-6xl px-4 sm:px-6">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6 ">
 <Check className="w-3 h-3" />
 Steg 1 · Vad behöver ni?
 </div>
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight tracking-tight max-w-3xl">
 Kom igång med er <span className="text-[hsl(var(--primary))]">kravspecifikation</span>
 </h2>
 <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-3xl">
 Få ett strukturerat underlag som hjälper er att beskriva behov, processer och prioriteringar inför dialogen med Dynamics 365-partners. Välj område och börja direkt.
 </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 {[
 { label: "ERP / Affärssystem", link: "/kravspecifikation/" },
 { label: "Försäljning", link: "/kravspecifikation-sales/" },
 { label: "Marknadsföring", link: "/kravspecifikation-marketing/" },
 { label: "Kundservice", link: "/kravspecifikation-kundservice/" },
 ].map((spec) => (
 <Link
 key={spec.link}
 to={spec.link}
 className="group/item flex items-center justify-between gap-2 px-4 py-3.5 rounded bg-white/5 border border-white/15 text-[14px] font-semibold text-white transition-all hover:bg-white/[0.10] hover:border-white/30 hover:-translate-y-0.5"
 >
 <span>{spec.label}</span>
 <ArrowRight className="w-4 h-4 text-white/60 group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
 </Link>
 ))}
 </div>
 <p className="text-[12px] text-white/60 mt-5 flex items-center gap-1.5">
 <Check className="w-3 h-3 text-[hsl(var(--cta-orange))]" />
 Gratis · Ange e-post för PDF · Dokument du kan dela internt
 </p>
 </div>
 </section>

 {/* Steg 2: Partner-matchning */}
 <section className="section-divider section-divider-dark bg-[hsl(var(--hero-dark))] py-10 sm:py-12 relative overflow-hidden border-b border-[hsl(var(--line-dark))]">
 <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded bg-[hsl(var(--cta-orange))]/25 pointer-events-none" />
 <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded bg-primary/25 pointer-events-none" />
 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
 <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

 <div className="relative container mx-auto max-w-6xl px-4 sm:px-6">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[hsl(var(--cta-orange))] text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6">
 <Sparkles className="w-3 h-3" />
 Steg 2 · Vem ska ni prata med?
 </div>
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight tracking-tight max-w-3xl">
 Hitta rätt typ av <span className="text-[hsl(var(--cta-orange))]">Dynamics 365-partner</span>
 </h2>
 <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-2xl">
 Svara på några frågor om er verksamhet, ert behov och er situation. På ett par minuter får ni en rekommendation från köparens sida om vilken typ av partner som passar bäst.
 </p>

 <div className="grid grid-cols-3 gap-4 mb-8 py-5 border-y border-white/10 max-w-xl">
 <div>
 <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--cta-orange))] leading-none">2 min</div>
 <div className="text-[11px] text-white/60 mt-1.5">Tar att fylla i</div>
 </div>
 <div className="border-l border-white/10 pl-4">
 <div className="text-2xl sm:text-3xl font-bold text-white leading-none">100%</div>
 <div className="text-[11px] text-white/60 mt-1.5">Köparens sida</div>
 </div>
 <div className="border-l border-white/10 pl-4">
 <div className="text-2xl sm:text-3xl font-bold text-white leading-none">0 kr</div>
 <div className="text-[11px] text-white/60 mt-1.5">Ingen registrering</div>
 </div>
 </div>

 <Button
 asChild
 className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-[15px] font-semibold h-12 px-7 rounded hover:-translate-y-0.5 transition-all group/btn"
 >
 <Link to="/valjdynamics365partner/">
 Hitta rätt partner
 <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
 </Link>
 </Button>
 </div>
 </section>
 </main>
 <Footer />
 </>
 );
};

export default Upphandlingsresan;
