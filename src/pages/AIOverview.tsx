import RelatedPages, { aiOverviewRelatedPages } from "@/components/RelatedPages";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import heroAiReadiness from "@/assets/hero-ai-readiness.jpg";
import { useState } from "react"; // kept for selectedGoal
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import SEOHead from "@/components/SEOHead";
import { WebPageSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, BarChart3, Headphones, Truck, Bot, Sparkles, TrendingUp, Brain, Users, Package, Cog, LineChart, ShieldAlert, Heart, DollarSign, Check, ArrowRight } from "lucide-react";

const roles = [
 {
 emoji: "💼",
 title: "CFO / Ekonomichef",
 focus: "Effektivare bokslut, kassaflöde, avvikelser, prognoser",
 icon: Briefcase,
 color: "from-blue-600/20 to-indigo-600/20 border-blue-500/30",
 link: "/copilot",
 },
 {
 emoji: "📈",
 title: "Försäljningschef",
 focus: "Bättre pipeline, träffsäkrare prioritering, snabbare avslut",
 icon: BarChart3,
 color: "from-emerald-600/20 to-emerald-700/20 border-emerald-500/30",
 link: "/d365sales",
 },
 {
 emoji: "🎧",
 title: "Kundservicechef",
 focus: "Kortare svarstid, automatiserade ärenden, högre kundnöjdhet",
 icon: Headphones,
 color: "from-purple-600/20 to-fuchsia-600/20 border-purple-500/30",
 link: "/d365customerservice",
 },
 {
 emoji: "🚚",
 title: "Supply Chain / Logistik",
 focus: "Lageroptimering, prognoser, avvikelser",
 icon: Truck,
 color: "from-amber-600/20 to-orange-600/20 border-amber-500/30",
 link: "/finance-supply-chain",
 },
 {
 emoji: "📣",
 title: "Marknadschef",
 focus: "Segmentering, kampanjoptimering, kundinsikter med AI",
 icon: Users,
 color: "from-pink-600/20 to-rose-600/20 border-pink-500/30",
 link: "/d365marketing",
 },
 {
 emoji: "🖥️",
 title: "IT-chef / CIO",
 focus: "AI-strategi, systemintegration, säkerhet och skalbarhet",
 icon: Cog,
 color: "from-slate-600/20 to-gray-600/20 border-slate-500/30",
 link: "/ai-readiness",
 },
];

const benefits = [
 { icon: Brain, text: "AI-effekten beror på datakvaliteten – inte på licensen" },
 { icon: Cog, text: "Copilot fungerar bäst när CRM/ERP-data är komplett och strukturerad" },
 { icon: Bot, text: "Agenter kräver tydliga processer och ett namngivet ägarskap" },
 { icon: ShieldAlert, text: "Automatisering utan processkontroll skapar nya problem, inte färre" },
 { icon: TrendingUp, text: "Bedöm er AI-mognad innan ni gör större investeringar" },
];

const goals = [
 {
 id: "automate",
 emoji: "⚙️",
 icon: Cog,
 title: "Automatisera manuellt arbete",
 color: "from-sky-600/20 to-blue-600/20 border-sky-500/30",
 scenario: {
 heading: "AI-automation i praktiken",
 description: "Copilot och agenter kan ta över repetitiva uppgifter som orderregistrering, datainmatning och ärendesortering – så att ditt team fokuserar på det som skapar värde.",
 examples: [
 "Automatisk kontering och orderregistrering i Business Central",
 "Agenter som kategoriserar och dirigerar supportärenden",
 "Copilot som skapar utkast till e-post och sammanfattningar",
 ],
 cta: { label: "Läs mer om Copilot", link: "/copilot" },
 },
 },
 {
 id: "forecast",
 emoji: "📊",
 icon: LineChart,
 title: "Få bättre prognoser",
 color: "from-indigo-600/20 to-violet-600/20 border-indigo-500/30",
 scenario: {
 heading: "Prediktiva insikter med AI",
 description: "Dynamics 365 analyserar historisk data och marknadstrender för att ge mer träffsäkra prognoser – från kassaflöde till försäljningspipeline.",
 examples: [
 "Kassaflödesprognoser i Finance",
 "Sales forecasting med Dynamics 365 Sales",
 "Lagerprognoser i Supply Chain Management",
 ],
 cta: { label: "Utforska Finance & Supply Chain", link: "/finance-supply-chain" },
 },
 },
 {
 id: "risk",
 emoji: "🛡️",
 icon: ShieldAlert,
 title: "Identifiera risker tidigare",
 color: "from-red-600/20 to-rose-600/20 border-red-500/30",
 scenario: {
 heading: "Proaktiv riskhantering",
 description: "AI flaggar avvikelser, sena betalningar och operativa risker innan de blir problem – ge ledningen ett försprång.",
 examples: [
 "Avvikelsedetektering i ekonomidata",
 "Kreditriskbedömning vid offerter",
 "Copilot som sammanfattar risker i projekt",
 ],
 cta: { label: "Läs om Business Central", link: "/businesscentral" },
 },
 },
 {
 id: "cx",
 emoji: "💚",
 icon: Heart,
 title: "Förbättra kundupplevelsen",
 color: "from-emerald-600/20 to-green-600/20 border-emerald-500/30",
 scenario: {
 heading: "AI-driven kundservice",
 description: "Snabbare svar, personligare bemötande och automatisk ärendehantering – utan att öka personalstyrkan.",
 examples: [
 "Copilot som föreslår svar baserat på kunskapsartiklar",
 "Sentimentanalys i realtid på kundsamtal",
 "Agenter som löser vanliga ärenden helt autonomt",
 ],
 cta: { label: "Utforska Customer Service", link: "/d365customerservice" },
 },
 },
 {
 id: "revenue",
 emoji: "💰",
 icon: DollarSign,
 title: "Öka försäljning per kund",
 color: "from-amber-600/20 to-yellow-600/20 border-amber-500/30",
 scenario: {
 heading: "Smartare sälj med AI",
 description: "Copilot hjälper säljare att identifiera rätt kunder, prioritera affärer och stänga snabbare med datadrivna rekommendationer.",
 examples: [
 "Lead scoring och prioritering med AI",
 "Copilot-förslag på nästa bästa åtgärd",
 "Merförsäljning baserat på kundbeteende",
 ],
 cta: { label: "Utforska Dynamics 365 Sales", link: "/d365sales" },
 },
 },
];

const crmScenarios = [
 { num: "1", title: "Smart lead-prioritering", desc: "Copilot analyserar historiska affärer, beteende och kommunikation → visar vilka affärer du bör fokusera på denna vecka." },
 { num: "2", title: "Automatiska mötessammanfattningar", desc: "Efter Teams-möten skapas automatiska sammanfattningar, uppgifter och nästa steg." },
 { num: "3", title: "Förslag på nästa bästa åtgärd", desc: "Systemet föreslår åtgärder baserat på kunddata, historik och sannolikhet." },
];

const customerServiceScenarios = [
 { num: "1", title: "AI-driven ärendesortering", desc: "Copilot kategoriserar och prioriterar inkommande ärenden automatiskt baserat på ämne, sentiment och SLA – rätt ärende hamnar hos rätt kundservicemedarbetare direkt." },
 { num: "2", title: "Svarsförslag från kunskapsdatabas", desc: "Copilot söker igenom kunskapsartiklar och tidigare lösningar och föreslår färdiga svar som kundservicemedarbetaren kan skicka med ett klick." },
 { num: "3", title: "Sentimentanalys i realtid", desc: "AI övervakar kundens tonläge under chatt och samtal. Vid negativt sentiment eskaleras ärendet automatiskt till en senior medarbetare." },
 { num: "4", title: "Autonoma serviceagenter", desc: "AI-agenter hanterar vanliga frågor (orderstatus, lösenordsåterställning, returärenden) helt utan mänsklig inblandning – dygnet runt." },
 { num: "5", title: "Ärendesammanfattning vid överföring", desc: "När ett ärende eskaleras eller överlämnas skapar Copilot en komplett sammanfattning så att nästa medarbetare slipper be kunden upprepa sig." },
];

const erpScenarios = [
 { num: "1", title: "Automatisk avvikelseanalys", desc: "AI identifierar transaktioner som avviker från normala mönster." },
 { num: "2", title: "Prognoser för kassaflöde", desc: "Prediktiv analys baserad på historik och aktuella data." },
 { num: "3", title: "Lageroptimering", desc: "AI förutser efterfrågan och minskar överlager." },
 { num: "4", title: "Bokslutsagenter", desc: "Automatiserade moment i periodavslut och rapportering." },
];

const practicalEffects = [
 "Datakvalitet i CRM/ERP är på plats – annars hallucinerar Copilot",
 "Processerna är dokumenterade innan en agent automatiserar dem",
 "Ett namngivet ägarskap finns för varje AI-funktion som aktiveras",
 "Governance och behörigheter är genomgångna före utrullning",
 "AI-mognaden är bedömd och prioriterad mot affärsvärde",
];

const AIOverview = () => {
 const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

 const activeScenario = goals.find((g) => g.id === selectedGoal)?.scenario;

 return (
 <div className="min-h-screen bg-background">
 <SEOHead webPageSchema={false}
 title="AI i Dynamics 365 – data, process, ansvar"
 description="Copilot och agenter i Dynamics 365 kräver mer än licenser. Vad som krävs av data, processer och ägarskap innan AI-effekten infinner sig."
 canonicalPath="/aioversikt"
 />
 <WebPageSchema
 name="AI i Dynamics 365 – Copilot & Agenter"
 description="Copilot och agenter i Dynamics 365 kräver mer än licenser. Vad som krävs av data, processer och ägarskap innan AI-effekten infinner sig."
 url="https://d365.se/aioversikt/"
 breadcrumb={[
 { name: "Hem", url: "https://d365.se/" },
 { name: "AI-översikt", url: "https://d365.se/aioversikt/" },
 ]}
 />
  <Navbar />
  <main className="pb-12 bg-background">
  {/* Hero */}
  <section className="section-divider section-divider-dark bg-[hsl(var(--hero-dark))] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 relative overflow-hidden border-b border-[hsl(var(--line-dark))]">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_50%)]" />
  <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
  <div className="max-w-4xl">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6">
  <Sparkles className="w-3 h-3" />
  AI med Copilot & Agenter
  </div>
  <h1 className="text-[26px] sm:text-[34px] md:text-[40px] font-bold text-white leading-[1.15] tracking-tight mb-5">
  AI i Dynamics 365 kräver mer än Copilot-licenser
  </h1>
  <p className="text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
  Copilot och agenter kräver data, process och ansvar. Utan den grunden uteblir effekten – oavsett hur många licenser ni köper. Den här sidan reder ut vad Copilot och agenter faktiskt kräver – och var partnervalet börjar spela roll.
  </p>
  <div className="flex flex-col sm:flex-row gap-3">
  <Link
  to="/ai-readiness/"
  className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-[15px] font-semibold h-12 px-7 rounded hover:-translate-y-0.5 transition-all"
  >
  Gör AI Readiness Assessment
  <ArrowRight className="w-4 h-4" />
  </Link>
  <Link
  to="/copilot/"
  className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/30 text-white hover:bg-white/15 hover:text-white text-[15px] font-semibold h-12 px-7 rounded transition-all"
  >
  Läs mer om Copilot
  </Link>
  </div>
  </div>
  </div>
  </section>

  {/* Förutsättningar för AI */}
  <section className="px-4 sm:px-6 py-10 bg-background border-b border-border">
  <div className="container mx-auto max-w-5xl">
  <div className="max-w-3xl mb-8">
  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-2">
  Det här behöver vara på plats innan ni skalar AI
  </h2>
  <p className="text-[15px] text-muted-foreground leading-relaxed">
  AI-effekten kommer inte automatiskt med licensen. Här är de fem vanligaste förutsättningarna vi ser hos svenska Dynamics 365-köpare.
  </p>
  </div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {benefits.map((b, i) => (
  <div key={i} className="flex items-start gap-3 p-4 rounded bg-white border border-border">
  <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
  <b.icon className="w-4 h-4" />
  </div>
  <div className="text-[14px] text-foreground leading-snug pt-2">{b.text}</div>
  </div>
  ))}
  </div>
  </div>
  </section>

 <div className="container mx-auto px-4">

 {/* Copilot vs Agenter */}
 <section className="max-w-4xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">📌</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Copilot vs Agenter – vad är skillnaden?
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Många blandar ihop begreppen. Här är den viktiga skillnaden.
 </p>

 <div className="grid md:grid-cols-2 gap-6">
 {/* Copilot */}
 <Card className="border bg-gradient-to-br from-sky-600/10 to-blue-600/10 border-sky-500/20">
 <CardContent className="p-6 sm:p-8">
 <div className="flex items-center gap-3 mb-4">
 <Sparkles className="h-7 w-7 text-sky-500" />
 <h3 className="text-xl font-bold text-foreground">Copilot</h3>
 </div>
 <p className="text-lg font-semibold text-foreground/90 mb-4">
 Assisterar användare
 </p>
 <ul className="space-y-3 text-muted-foreground">
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
 <span>Föreslår svar, sammanfattar och ger rekommendationer</span>
 </li>
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
 <span>Användaren fattar beslut och bekräftar</span>
 </li>
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
 <span>Inbyggd i gränssnittet – alltid till hands</span>
 </li>
 </ul>
 <div className="mt-6 rounded-lg bg-sky-500/10 px-4 py-3">
 <p className="text-sm font-medium text-foreground/80 italic">
 "Din AI-assistent som gör dig snabbare och smartare."
 </p>
 </div>
 </CardContent>
 </Card>

 {/* Agenter */}
 <Card className="border bg-gradient-to-br from-purple-600/10 to-fuchsia-600/10 border-purple-500/20">
 <CardContent className="p-6 sm:p-8">
 <div className="flex items-center gap-3 mb-4">
 <Bot className="h-7 w-7 text-purple-500" />
 <h3 className="text-xl font-bold text-foreground">Agenter</h3>
 </div>
 <p className="text-lg font-semibold text-foreground/90 mb-4">
 Automatiserar processer självständigt
 </p>
 <ul className="space-y-3 text-muted-foreground">
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
 <span>Utför uppgifter utan manuell inblandning</span>
 </li>
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
 <span>Övervakar, agerar och eskalerar vid behov</span>
 </li>
 <li className="flex items-start gap-2">
 <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
 <span>Arbetar dygnet runt i bakgrunden</span>
 </li>
 </ul>
 <div className="mt-6 rounded-lg bg-purple-500/10 px-4 py-3">
 <p className="text-sm font-medium text-foreground/80 italic">
 "Din digitala medarbetare som jobbar även när du inte gör det."
 </p>
 </div>
 </CardContent>
 </Card>
 </div>
 </section>

 {/* Common myths */}
 <section className="max-w-4xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">💡</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Vanliga missförstånd om AI
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Låt oss avdramatisera de vanligaste myterna.
 </p>

 <div className="grid gap-5 max-w-3xl mx-auto">
 {[
 {
 myth: '"AI ersätter personal"',
 reality: "AI frigör tid från rutinuppgifter så att medarbetare kan fokusera på det som kräver mänskligt omdöme – kundrelationer, strategi och kreativitet.",
 },
 {
 myth: '"Vi måste byta system"',
 reality: "Copilot och agenter byggs in direkt i Dynamics 365. Ni behöver inte byta – ni aktiverar AI i det system ni redan använder.",
 },
 {
 myth: '"Det kräver enorma datamängder"',
 reality: "AI i Dynamics 365 arbetar med den data ni redan har. Ju mer strukturerad den är, desto bättre – men ni behöver inte vara perfekta för att börja.",
 },
 ].map((item, i) => (
 <Card key={i} className="border bg-card">
 <CardContent className="p-6">
 <div className="flex items-start gap-4">
 <span className="shrink-0 text-2xl">❌</span>
 <div>
 <p className="font-bold text-foreground mb-2">{item.myth}</p>
 <div className="flex items-start gap-2">
 <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
 <p className="text-muted-foreground">{item.reality}</p>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </section>

 {/* Industry-specific AI examples */}
 <section className="max-w-5xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">🏭</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 AI-exempel per bransch
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Så kan AI i Dynamics 365 skapa värde i just din bransch.
 </p>

 <div className="grid sm:grid-cols-2 gap-6">
 {[
 {
 emoji: "🏭",
 title: "Tillverkning",
 examples: [
 "Prediktivt underhåll som minskar oplanerade stopp",
 "AI-optimerad produktionsplanering",
 "Automatisk kvalitetskontroll med avvikelseanalys",
 ],
 link: "/branscher/tillverkning/",
 },
 {
 emoji: "🛒",
 title: "Handel & Distribution",
 examples: [
 "Lageroptimering baserad på efterfrågeprognoser",
 "Personaliserade produktrekommendationer",
 "Automatisk prissättning utifrån marknadstrender",
 ],
 link: "/branscher/grossist-distribution/",
 },
 {
 emoji: "💼",
 title: "Professional Services",
 examples: [
 "Copilot som sammanfattar projekt och kundmöten",
 "Resursplanering med AI-baserad beläggningsprognos",
 "Automatisk tidrapportering och fakturering",
 ],
 link: "/branscher/konsulttjanster/",
 },
 {
 emoji: "🏛️",
 title: "Offentlig sektor",
 examples: [
 "Ärendehantering med AI-kategorisering",
 "Copilot som stöd i medborgarservice",
 "Budgetprognoser och avvikelsedetektering",
 ],
 link: "/branscher/offentlig-sektor/",
 },
 ].map((industry) => (
 <Link key={industry.title} to={industry.link}>
 <Card className="group border bg-card hover:bg-muted/50 hover:scale-[1.01] transition-all duration-300 h-full">
 <CardContent className="p-6">
 <div className="flex items-center gap-3 mb-4">
 <span className="text-2xl">{industry.emoji}</span>
 <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
 {industry.title}
 </h3>
 </div>
 <ul className="space-y-2">
 {industry.examples.map((ex, i) => (
 <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
 <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
 <span>{ex}</span>
 </li>
 ))}
 </ul>
 </CardContent>
 </Card>
 </Link>
 ))}
 </div>
 </section>

 {/* Risk, governance & security */}
 <section className="max-w-4xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <ShieldAlert className="h-7 w-7 text-primary" />
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Styrning, säkerhet &amp; dataskydd
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Beslutsfattare behöver trygga svar. Här är vad som gäller för AI i Dynamics 365.
 </p>

 <div className="grid sm:grid-cols-2 gap-6">
 {[
 {
 icon: "🔒",
 title: "Dataskydd & GDPR",
 desc: "All data stannar inom er Microsoft-tenant. Copilot använder inte kunddata för att träna AI-modeller. Microsoft följer GDPR och har EU Data Boundary.",
 },
 {
 icon: "🛡️",
 title: "Säkerhet i Copilot",
 desc: "Copilot respekterar befintliga behörigheter – en användare ser bara det de redan har tillgång till. Inget data läcker mellan användare eller organisationer.",
 },
 {
 icon: "⚙️",
 title: "Governance & kontroll",
 desc: "Administratörer styr vilka Copilot-funktioner och agenter som aktiveras, vem som har tillgång och vilka datakällor som används.",
 },
 {
 icon: "📋",
 title: "Ansvarsfull AI",
 desc: "Microsoft följer principerna för ansvarsfull AI: transparens, rättvisa, tillförlitlighet och integritet. AI-beslut kan alltid granskas och förklaras.",
 },
 ].map((item, i) => (
 <Card key={i} className="border bg-card">
 <CardContent className="p-6">
 <div className="flex items-center gap-3 mb-3">
 <span className="text-2xl">{item.icon}</span>
 <h3 className="font-bold text-foreground">{item.title}</h3>
 </div>
 <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
 </CardContent>
 </Card>
 ))}
 </div>
 </section>

 {/* Role-based entry points */}
 <section className="max-w-5xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">👤</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Hitta din AI-ingång
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Vilken roll har du? Utforska AI-möjligheter som är relevanta för just dig.
 </p>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {roles.map((role) => (
  <Card key={role.title} className="relative overflow-hidden bg-[hsl(var(--card-dark))] border border-[hsl(var(--line-dark))] h-full">
  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
  <div className="text-3xl mb-3">{role.emoji}</div>
  <h3 className="text-lg font-bold text-white mb-1">
  {role.title}
  </h3>
  <p className="text-sm text-white/70 mb-4 flex-1">
  {role.focus}
  </p>
  <Link
  to={role.link}
  className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--signature))] hover:underline mt-auto"
  >
  Utforska <ArrowRight className="h-3.5 w-3.5" />
  </Link>
  </CardContent>
  </Card>
  ))}
  </div>
 </section>

 {/* AI use-case explorer */}
 <section className="max-w-5xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">🧠</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Vad vill du uppnå med AI?
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Klicka på ett mål för att se hur Dynamics 365 kan hjälpa.
 </p>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
 {goals.map((goal) => {
 const isActive = selectedGoal === goal.id;
 return (
 <button
 key={goal.id}
 onClick={() => setSelectedGoal(isActive ? null : goal.id)}
 className="text-left w-full"
 >
  <Card className={`group relative overflow-hidden transition-all duration-300 h-full bg-[hsl(var(--card-dark))] border border-[hsl(var(--line-dark))] ${
  isActive
  ? "ring-2 ring-[hsl(var(--signature))] scale-[1.02]"
  : "hover:scale-[1.01]"
  }`}>
  <CardContent className="p-5 sm:p-6">
  <div className="flex items-start gap-3">
  <span className="text-2xl shrink-0">{goal.emoji}</span>
  <div>
  <h3 className={`font-bold mb-0.5 transition-colors ${isActive ? "text-[hsl(var(--signature))]" : "text-white group-hover:text-[hsl(var(--signature))]"}`}>
  {goal.title}
  </h3>
  </div>
  {isActive && (
  <Check className="h-5 w-5 text-[hsl(var(--signature))] ml-auto shrink-0" />
  )}
  </div>
  </CardContent>
  </Card>
  </button>
 );
 })}
 </div>

 {activeScenario && (
 <div className="max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
 <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
 <CardContent className="p-6 sm:p-8">
 <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
 {activeScenario.heading}
 </h3>
 <p className="text-muted-foreground mb-6">
 {activeScenario.description}
 </p>
 <ul className="space-y-3 mb-6">
 {activeScenario.examples.map((ex, i) => (
 <li key={i} className="flex items-start gap-3">
 <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
 <span className="text-foreground">{ex}</span>
 </li>
 ))}
 </ul>
 <Link
 to={activeScenario.cta.link}
 className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
 >
 {activeScenario.cta.label} →
 </Link>
 </CardContent>
 </Card>
 </div>
 )}
 </section>

 {/* Concrete AI Scenarios */}
 <section className="max-w-5xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">🎯</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Konkreta AI-scenarier i Dynamics 365
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-12">
 Så används Copilot och agenter i verkliga affärsprocesser.
 </p>

 <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
 {/* CRM column */}
 <div>
 <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
 <BarChart3 className="h-5 w-5 text-primary" />
 AI i Sälj
 </h3>
 <div className="space-y-5">
 {crmScenarios.map((s) => (
 <div key={s.num} className="flex gap-4">
 <span className="shrink-0 w-8 h-8 rounded bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
 {s.num}
 </span>
 <div>
 <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
 <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Customer Service column */}
 <div>
 <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
 <Headphones className="h-5 w-5 text-primary" />
 AI i Kundservice
 </h3>
 <div className="space-y-5">
 {customerServiceScenarios.map((s) => (
 <div key={s.num} className="flex gap-4">
 <span className="shrink-0 w-8 h-8 rounded bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
 {s.num}
 </span>
 <div>
 <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
 <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* ERP column */}
 <div>
 <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
 <Package className="h-5 w-5 text-primary" />
 AI i ERP (Finance &amp; Supply Chain)
 </h3>
 <div className="space-y-5">
 {erpScenarios.map((s) => (
 <div key={s.num} className="flex gap-4">
 <span className="shrink-0 w-8 h-8 rounded bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
 {s.num}
 </span>
 <div>
 <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
 <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Practical prerequisites */}
 <section className="max-w-3xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">📊</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Vad krävs för att AI ska ge effekt?
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-8">
 Innan ni mäter effekt behöver grunden vara på plats. Det här är förutsättningarna vi ser i de projekt som faktiskt levererar:
 </p>
 <div className="grid gap-3">
 {practicalEffects.map((effect, i) => (
 <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg px-5 py-3.5">
 <Check className="h-5 w-5 text-emerald-500 shrink-0" />
 <span className="text-foreground font-medium">{effect}</span>
 </div>
 ))}
 </div>
 <p className="text-xs text-muted-foreground text-center mt-6 italic">
 Effektsiffror som "20–40% tidsbesparing" varierar kraftigt mellan organisationer och bör behandlas som exempel – inte som löften. Bedöm potentialen i er egen kontext via AI-mognadstestet.
 </p>
 </section>

 {/* Getting started steps */}
 <section className="max-w-4xl mx-auto mb-20">
 <div className="flex items-center justify-center gap-3 mb-3">
 <span className="text-3xl">🛠</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
 Så kommer ni igång
 </h2>
 </div>
 <p className="text-center text-muted-foreground mb-10">
 Tre steg från idé till verklig AI-effekt.
 </p>

 <div className="grid md:grid-cols-3 gap-6 mb-10">
 {[
 { step: "1", title: "Identifiera process", desc: "Vi definierar var AI ger störst affärseffekt." },
 { step: "2", title: "Proof of Value", desc: "Testa i liten skala." },
 { step: "3", title: "Skala", desc: "Rulla ut brett med rätt partner." },
 ].map((s) => (
 <Card key={s.step} className="border bg-card text-center">
 <CardContent className="p-6 sm:p-8">
 <span className="inline-flex items-center justify-center w-10 h-10 rounded bg-primary text-primary-foreground font-bold text-lg mb-4">
 {s.step}
 </span>
 <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
 <p className="text-muted-foreground text-sm">{s.desc}</p>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="text-center">
 <Link
 to="/valjdynamics365partner/"
 className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
 >
 👉 Hitta rätt Dynamics 365-partner för AI <ArrowRight className="h-5 w-5" />
 </Link>
 </div>
 </section>

 {/* AI Readiness CTA */}
 <section className="max-w-3xl mx-auto">
 <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
 <CardContent className="p-6 sm:p-10 text-center">
 <span className="text-4xl mb-4 block">🧠</span>
 <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
 Innan ni investerar – bedöm er AI-mognad
 </h2>
 <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
 Större AI-investeringar bör baseras på faktisk mognad i data, processer och ägarskap – inte på licenstillgänglighet. Testa er mognad eller börja med en strukturerad behovsanalys.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <Link
 to="/ai-readiness/"
 className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--cta-orange))] text-white px-6 py-3 rounded font-medium text-lg hover:opacity-90 transition-opacity"
 >
 Testa er AI-mognad <ArrowRight className="h-5 w-5" />
 </Link>
 <Link
 to="/behovsanalys/"
 className="inline-flex items-center justify-center gap-2 border border-primary/30 text-foreground px-6 py-3 rounded font-medium text-lg hover:bg-primary/5 transition-colors"
 >
 Gör en behovsanalys för Dynamics 365
 </Link>
 </div>
 </CardContent>
 </Card>
 </section>
 </div>
 </main>
 <ProductPartnerNewsSection productArea="microsoft-ai" productLabel="Microsoft AI" />

 <ProductDeepDiveLink product="Microsoft Copilot – Dynamics 365" label="Copilot" />

 <ProductDeepDiveLink product="Microsoft Agents – Dynamics 365" label="AI-agenter" />

 <RelatedPages pages={aiOverviewRelatedPages} heading="Utforska vidare" />
 <Footer />

 </div>
 );
};

export default AIOverview;
