import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RadialGlow } from "@/components/RadialGlow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
 ArrowRight,
 Check,
 Sparkles,
 ClipboardList,
 FileText,
 Search,
 Scale,
 Users,
 Rocket,
 ShieldCheck,
} from "lucide-react";

type Step = {
 num: number;
 icon: typeof ClipboardList;
 tag: string;
 title: string;
 highlight: string;
 description: string;
 links: { label: string; to: string }[];
 primary?: boolean;
};

const steps: Step[] = [
 {
 num: 1,
 icon: ClipboardList,
 tag: "Steg 1 · Vad behöver du?",
 title: "Behovsanalys",
 highlight: "förankrad i verksamheten",
 description:
 "Kartlägg processer, utmaningar och förbättringspotential innan du ställer krav eller väljer system. Resultatet är en prioriterad bild av vilka förmågor som är mest affärskritiska – ett stabilt beslutsunderlag som vässar kravbilden och styr upphandlingen mot rätt lösning från start.",
 links: [
 { label: "ERP-behovsanalys", to: "/ERPbehovsanalys/" },
 { label: "CRM-behovsanalys", to: "/CRMbehovsanalys/" },
 { label: "Kundservice & Field Service", to: "/kundservice-behovsanalys/" },
 ],
 },
 {
 num: 2,
 icon: FileText,
 tag: "Steg 2 · Sätt kravbilden",
 title: "Kravspecifikation",
 highlight: "som leverantörerna förstår",
 description:
 "En tydlig, prioriterad och verksamhetsförankrad kravspecifikation säkerställer att Dynamics 365-partnerna kan visa hur deras lösning faktiskt stödjer dina processer. Mindre risk för missförstånd – och betydligt enklare att utvärdera anbuden.",
 links: [
 { label: "Kravspec ERP", to: "/kravspecifikation/" },
 { label: "Kravspec Sales", to: "/kravspecifikation-sales/" },
 { label: "Kravspec Marketing", to: "/kravspecifikation-marketing/" },
 { label: "Kravspec Kundservice", to: "/kravspecifikation-kundservice/" },
 ],
 },
 {
 num: 3,
 icon: Search,
 tag: "Steg 3 · Marknads- & partneranalys",
 title: "Hitta rätt typ av Dynamics 365-partner",
 highlight: "med köparsidig vägledning",
 description:
 "Få en strukturerad överblick över vilka partners som matchar din bransch, dina produktområden, din geografi och din storlek. Vi står på köparens sida – inga direktlänkar till leverantörer, all kontakt går via plattformens mediarade matchning.",
    links: [
      { label: "Hitta Dynamics 365-partner", to: "/valjdynamics365partner/" },
      { label: "Hitta partner för din bransch", to: "/branscher/" },
      { label: "Utforska branscher", to: "/branscher/" },
    ],

 primary: true,
 },
 {
 num: 4,
 icon: Scale,
 tag: "Steg 4 · Utvärdering",
 title: "Utvärdering av lösning och partner",
 highlight: "transparent och faktabaserad",
 description:
 "Jämför partners och lösningar utifrån funktionalitet, branschdjup, AI-mognad, leveransförmåga och risk. Vår AI-guide ger en strukturerad rekommendation baserad på dina svar – och du ser tydligt varför varje partner föreslås.",
 links: [
 { label: "Starta AI-guiden", to: "/valjdynamics365partner/?ai=1" },
 { label: "AI Readiness Assessment", to: "/ai-readiness/" },
 ],
 },
 {
 num: 5,
 icon: Users,
 tag: "Steg 5 · Implementeringspartner",
 title: "Välj rätt implementeringspartner",
 highlight: "team, metodik och bemanning",
 description:
 "Rätt implementeringspartner är avgörande för ett lyckat införande. Granska kundexempel, certifieringar, AI-förmågor och referenser för Business Central, F&SCM, Sales, Customer Service, Field Service, Customer Insights och Contact Center.",
    links: [
      { label: "Jämför partners", to: "/jamfor-partners" },
      { label: "Så väljer du rätt partner", to: "/valjdynamics365partner/?ai=1" },
    ],

 },
 {
 num: 6,
 icon: Rocket,
 tag: "Fördjupning & resurser",
 title: "Fördjupa dig innan du bestämmer dig",
 highlight: "produktjämförelser, guider & insikter",
 description:
 "Innan du skriver på avtalet är det värt att ha koll på produktskillnaderna, vad marknaden faktiskt erbjuder och vad liknande verksamheter har lärt sig på vägen. Här hittar du produktjämförelser, guider, videos och ett kunskapscenter – utan säljfilter.",
 links: [
 { label: "Kunskapscenter", to: "/kunskapscenter" },
 ],
 },
];

const Upphandlingsguiden = () => {
 return (
 <>
 <SEOHead
        breadcrumbs={[{ name: "Hem", url: "/" }, { name: "Upphandlingsguiden", url: "/upphandlingsguiden/" }]}
 title="Upphandlingsguiden – Microsoft Dynamics 365"
 description="Köparsidig vägledning genom hela upphandlingen av Microsoft Dynamics 365 – från behovsanalys och kravspec till partnerval, införande och avtal."
 canonicalPath="/upphandlingsguiden"
 />
 <Navbar />
  <main className="min-h-screen bg-background">
  {/* Hero */}
  <section className="section-divider section-divider-dark bg-[hsl(var(--hero-dark))] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 relative overflow-hidden border-b border-[hsl(var(--line-dark))]">
  <RadialGlow />
  <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
  <div className="max-w-4xl">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6">
  <Sparkles className="w-3 h-3" />
  Upphandlingsguiden för Microsoft Dynamics 365
  </div>
  <h1 className="text-[26px] sm:text-[34px] md:text-[40px] font-bold text-white leading-[1.15] tracking-tight mb-5">
  Kvalitetssäkrad upphandling av{" "}
  <span className="whitespace-nowrap text-[hsl(var(--cta-orange))]">Dynamics&nbsp;365</span>
  <span className="block text-white/90 mt-1">– från behov till val av Microsoftpartner</span>
  </h1>
  <p className="text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
  På d365.se får din verksamhet vägledning genom hela upphandlingsresan – från behovsanalys och hjälp att skriva kravspecifikation, till jämförelser av Dynamics 365-partners och fördjupade insikter i Dynamics 365-applikationerna. Allt samlat på ett ställe, så att du kan fatta trygga beslut hela vägen fram till avtal och införande.
  </p>
  <div className="flex flex-col sm:flex-row gap-3">
  <Button
  asChild
  className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-[15px] font-semibold h-12 px-7 rounded hover:-translate-y-0.5 transition-all"
  >
  <Link to="/valjdynamics365partner/">
  Hitta rätt partner
  <ArrowRight className="w-4 h-4 ml-1.5" />
  </Link>
  </Button>
  <Button
  asChild
  variant="outline"
  className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white text-[15px] font-semibold h-12 px-7 rounded"
  >
  <Link to="/ERPbehovsanalys/">Skapa en behovsanalys</Link>
  </Button>
  </div>
  </div>
  </div>
  </section>

 {/* Köparsidigt löfte */}
 <section className="px-4 sm:px-6 py-10 bg-background border-b border-border">
 <div className="container mx-auto max-w-5xl grid sm:grid-cols-3 gap-4">
 {[
 { icon: ShieldCheck, title: "Köparens sida", text: "Vi vägleder utan att sälja in en specifik partner." },
 { icon: Check, title: "Strukturerad metodik", text: "Sex tydliga steg från behov till val av Microsoftpartner." },
 { icon: Sparkles, title: "AI-stödd matchning", text: "Datadriven rekommendation baserad på dina behov." },
 ].map(({ icon: Icon, title, text }) => (
 <div key={title} className="flex items-start gap-3 p-4 rounded bg-white border border-border ">
 <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
 <Icon className="w-4 h-4" />
 </div>
 <div>
 <div className="font-semibold text-foreground text-[14px]">{title}</div>
 <div className="text-[13px] text-muted-foreground leading-relaxed">{text}</div>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Steg */}
 <section className="px-4 sm:px-6 py-8 sm:py-12 bg-background">
 <div className="container mx-auto max-w-6xl">
 <div className="max-w-3xl mb-10 sm:mb-14">
 <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground leading-tight tracking-tight mb-3">
 Vår metodik – från krav till kontrakt
 </h2>
 <p className="text-[15px] text-muted-foreground leading-relaxed">
 Sex steg som tar din tryggt genom upphandlingen av Microsoft Dynamics 365. Varje steg länkar vidare till verktyg och guider på sajten så du kan komma igång direkt.
 </p>
 </div>

 <div className="grid gap-5 sm:gap-6">
 {steps.map((step) => {
 const Icon = step.icon;
 const isPrimary = step.primary;
 return (
 <article
 key={step.num}
 className={`group relative overflow-hidden rounded border p-6 sm:p-8 ${
 isPrimary
 ? "bg-[hsl(var(--hero-dark))] border-[hsl(var(--line-dark))]"
 : "bg-card border-border"
 }`}
 >
  {isPrimary ? (
  <RadialGlow />
  ) : (
  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-[hsl(var(--cta-orange))] pointer-events-none" />
  )}

 <div className="relative grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-8 items-start">
 <div
 className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded flex items-center justify-center ${
 isPrimary
 ? "bg-[hsl(var(--cta-orange))] text-white "
 : "bg-primary/10 text-primary"
 }`}
 >
 <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
 </div>

 <div className="min-w-0">
 <div
 className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10.5px] font-bold uppercase tracking-[0.12em] mb-4 ${
 isPrimary
 ? "bg-white/10 text-white border border-white/20"
 : "bg-primary/10 text-primary border border-primary/30"
 }`}
 >
 {step.tag}
 </div>
 <h3
 className={`text-xl sm:text-2xl md:text-[28px] font-bold leading-tight tracking-tight mb-3 ${
 isPrimary ? "text-white" : "text-foreground"
 }`}
 >
 {step.title}{" "}
 <span className={isPrimary ? "text-[hsl(var(--cta-orange))]" : "text-primary"}>
 – {step.highlight}
 </span>
 </h3>
 <p
 className={`text-[14px] sm:text-[15px] leading-relaxed mb-5 max-w-3xl ${
 isPrimary ? "text-white/80" : "text-muted-foreground"
 }`}
 >
 {step.description}
 </p>
 <div className="flex flex-wrap gap-2">
 {step.links.map((link) => (
 <Link
 key={link.to}
 to={link.to}
 className={`group/item inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 ${
 isPrimary
 ? "bg-white text-foreground hover:bg-white/90 "
 : "bg-card border border-border text-foreground hover:bg-primary/5 hover:border-primary/40 "
 }`}
 >
 {link.label}
 <ArrowRight className="w-3.5 h-3.5 group-hover/item:translate-x-0.5 transition-transform" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 </article>
 );
 })}
 </div>
 </div>
 </section>


 {/* Avslut CTA */}
 <section className="px-4 sm:px-6 py-8 sm:py-12 bg-background">
 <div className="container mx-auto max-w-5xl">
  <div className="relative overflow-hidden rounded bg-[hsl(var(--hero-dark))] border border-[hsl(var(--line-dark))] p-8 sm:p-12 text-center">
  <RadialGlow />
  <div className="relative">
 <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white leading-tight tracking-tight mb-4">
 Redo att starta din upphandling?
 </h2>
 <p className="text-[15px] sm:text-base text-white/80 leading-relaxed mb-7 max-w-2xl mx-auto">
 Börja med en behovsanalys eller hoppa direkt till partnermatchningen. Båda är gratis och tar bara några minuter.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <Button
 asChild
 className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-[15px] font-semibold h-12 px-7 rounded hover:-translate-y-0.5 transition-all"
 >
 <Link to="/valjdynamics365partner/">
 Hitta rätt partner
 <ArrowRight className="w-4 h-4 ml-1.5" />
 </Link>
 </Button>
 <Button
 asChild
 variant="outline"
 className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white text-[15px] font-semibold h-12 px-7 rounded"
 >
 <Link to="/kontakt/">Kontakta en rådgivare</Link>
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

export default Upphandlingsguiden;
