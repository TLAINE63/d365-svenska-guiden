import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import eventsHeroImage from "@/assets/events-hero.jpg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, BreadcrumbSchema, EventSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
 Calendar, 
 Clock, 
 Video, 
 MapPin, 
 ExternalLink, 
 Play,
 Users,
 Building2,
 CalendarDays,
 Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Partner {
 id: string;
 name: string;
 slug: string;
 logo_url: string | null;
 logo_dark_bg: boolean;
}

interface PartnerEvent {
 id: string;
 title: string;
 description: string | null;
 event_date: string;
 event_time: string | null;
 end_time: string | null;
 is_online: boolean;
 location: string | null;
 event_link: string | null;
 registration_link: string | null;
 registration_deadline: string | null;
 image_url: string | null;
 recording_url: string | null;
 recording_available: boolean;
 partners: Partner | null; // Can be null for d365.se events
}

// Breadcrumb items
const eventsBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Events & Webinars", url: "https://d365.se/events" },
];

// FAQ items for schema (and rendered visibly at the bottom of the page)
const eventsFaqs = [
 {
 question: "Vilka Dynamics 365-event passar för företag som ska byta affärssystem?",
 answer: "Företag som står inför ett byte av affärssystem har störst nytta av webinars och seminarier som går igenom Business Central och Finance & Supply Chain Management – gärna kombinerade med branschspecifika exempel (tillverkning, grossist, fastighet, tjänstebolag). Titta också efter event som tar upp datamigrering, integration och förändringsledning, eftersom det är där de flesta ERP-projekt fastnar. På d365.se markerar vi vilka event som är relevanta för ERP-beslut, och du kan kombinera dem med vår ERP-behovsanalys för att förbereda valet av partner."
 },
 {
 question: "Finns det webinars om Business Central och Finance & Supply Chain?",
 answer: "Ja. Svenska Microsoft-partners arrangerar regelbundet webinars om både Business Central (för mindre och medelstora bolag) och Finance & Supply Chain Management (för stora, internationella organisationer). Innehållet varierar från produktdemos och Release Wave-genomgångar till djupare sessioner om finansiella konsolideringar, lager- och produktionsstyrning, AP/AR-automation och Copilot. De flesta webinars är kostnadsfria och hålls online – du anmäler dig direkt via arrangörens länk på respektive event."
 },
 {
 question: "Kan man få hjälp att välja rätt event eller partner?",
 answer: "Ja. Vi på d365.se hjälper köparsidigt och kostnadsfritt – beskriv kort vad ni utvärderar så tipsar vi om relevanta event och 2–3 partners som matchar er bransch och storlek. Använd kontaktformuläret eller starta med vår partnerguide så vägleder vi er vidare utan säljpåverkan."
 },
 {
 question: "Var hittar jag Microsoft Dynamics 365 events och webinars i Sverige?",
 answer: "På d365.se samlar vi kommande events, webinars och seminarier från Microsoft Dynamics 365-partners i Sverige. Eventen täcker Business Central, Finance & Supply Chain, Sales, Customer Service och AI/Copilot. De flesta events är kostnadsfria och hålls online – du anmäler dig direkt via arrangörens länk."
 },
 {
 question: "Är Dynamics 365 webinars gratis att delta i?",
 answer: "Ja, de flesta webinars och seminarier arrangerade av Dynamics 365-partners i Sverige är kostnadsfria. Events kan handla om produktdemos, branschlösningar, uppgraderingsguider eller best practices. Anmälan sker direkt hos respektive arrangör via länken på eventsidan."
 },
 {
 question: "Vilka typer av Dynamics 365 events anordnas i Sverige?",
 answer: "Svenska Dynamics 365-partners arrangerar: online webinars och demos (Business Central, Sales, Customer Service m.fl.), branschspecifika seminarier (tillverkning, grossist, fastighet), AI & Copilot-introduktioner, användarträffar och Microsoft-ledda evenemang. Events riktar sig till beslutsfattare, projektledare och slutanvändare som vill lära sig mer om Dynamics 365."
 },
 {
 question: "Hur anmäler jag mig till ett Dynamics 365 event?",
 answer: "Klicka på 'Läs mer & anmäl dig' på valfritt event i listan. Du skickas direkt till arrangörens anmälningssida. Varje event har sin egen anmälningsprocess hos respektive partner. Håll koll på sista anmälningsdag som visas under varje event."
 },
 {
 question: "Kan jag se inspelningar av genomförda Dynamics 365 webinars?",
 answer: "Ja, för genomförda events där inspelning finns tillgänglig visas knappen 'Se inspelning'. Klicka på eventet under fliken Genomförda events för att komma till inspelningen hos arrangören. Många partners publicerar sina webinar-inspelningar öppet på sin hemsida eller YouTube."
 },
];

const Events = () => {
 const [upcomingEvents, setUpcomingEvents] = useState<PartnerEvent[]>([]);
 const [pastEvents, setPastEvents] = useState<PartnerEvent[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchEvents = async () => {
 try {
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=all-public-events`,
 {
 headers: {
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 },
 }
 );

 if (response.ok) {
 const data = await response.json();
 const allEvents = data.events || [];
 
 // Split events into upcoming and past based on date
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 
 const upcoming: PartnerEvent[] = [];
 const past: PartnerEvent[] = [];
 
 allEvents.forEach((event: PartnerEvent) => {
 const eventDate = new Date(event.event_date);
 if (eventDate >= today) {
 upcoming.push(event);
 } else {
 past.push(event);
 }
 });
 
 // Sort upcoming by date ascending (nearest first)
 upcoming.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
 
 // Sort past by date descending (most recent first)
 past.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
 
 setUpcomingEvents(upcoming);
 setPastEvents(past);
 }
 } catch (err) {
 console.error("Error fetching events:", err);
 } finally {
 setLoading(false);
 }
 };

 fetchEvents();
 }, []);

 const formatDate = (dateStr: string) => {
 const date = new Date(dateStr);
 return date.toLocaleDateString("sv-SE", { 
 weekday: "long",
 day: "numeric", 
 month: "long",
 year: "numeric"
 });
 };

 const formatTime = (timeStr: string | null) => {
 if (!timeStr) return null;
 return timeStr.slice(0, 5);
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-background">
 <SEOHead
 title="Dynamics 365 webinars &amp; seminarier – gratis | d365.se"
 description="Kostnadsfria webinars och seminarier om Dynamics 365 – Business Central, Sales, AI och Copilot. Kunskap som hjälper dig välja rätt lösning och partner."
 canonicalPath="/events"
 keywords="Dynamics 365 webinar, Dynamics 365 seminarium, Dynamics 365 event Sverige, Business Central webinar, Microsoft ERP webinar Sverige, Copilot webinar"
 ogImage="https://d365.se/og-events.png"
 />
 <Navbar />
 <div className="container mx-auto px-4 py-10 mt-16 flex items-center justify-center">
 <Loader2 className="w-8 h-8 animate-spin text-primary" />
 </div>
 <Footer />
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-background">
 <SEOHead
 title="Dynamics 365 webinars &amp; seminarier – gratis | d365.se"
 description="Kostnadsfria webinars och seminarier om Dynamics 365 – Business Central, Sales, AI och Copilot. Kunskap som hjälper dig välja rätt lösning och partner."
 canonicalPath="/events"
 keywords="Dynamics 365 webinar, Dynamics 365 seminarium, Dynamics 365 event Sverige, Business Central webinar, Microsoft ERP webinar Sverige, Copilot webinar"
 ogImage="https://d365.se/og-events.png"
 />
 <FAQSchema faqs={eventsFaqs} />
 <BreadcrumbSchema items={eventsBreadcrumbs} />
 <EventSchema
 events={[...upcomingEvents, ...pastEvents].map((e) => {
 const startDate = e.event_time
 ? `${e.event_date}T${e.event_time}`
 : e.event_date;
 const endDate = e.end_time ? `${e.event_date}T${e.end_time}` : undefined;
 const eventUrl = e.registration_link || e.event_link || e.recording_url || "https://d365.se/events";
 return {
 name: e.title,
 description: e.description || undefined,
 startDate,
 endDate,
 isOnline: e.is_online,
 locationName: e.location || undefined,
 url: eventUrl,
 image: e.image_url || undefined,
 organizerName: e.partners?.name || "d365.se",
 organizerUrl: e.partners?.slug ? `https://d365.se/partners/${e.partners.slug}` : "https://d365.se",
 };
 })}
 />

 <Navbar />

 {/* Hero Section */}
 <section className="relative overflow-hidden mt-16 py-12 md:py-24">
 {/* Background Image */}
 <div 
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage: `url(${eventsHeroImage})` }}
 />
 <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/80 to-violet-900/70" />
 
 <div className="relative container mx-auto px-4 text-center">
 <Badge className="mb-4 bg-white/20 text-white border-white/30">
 <CalendarDays className="w-3 h-3 mr-1" />
 Partner-events
 </Badge>
 <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
 Dynamics 365-event, webinars och seminarier
 </h1>
 <p className="text-lg text-white/85 max-w-3xl mx-auto">
 Här samlar vi kommande och tidigare webinars och event om Microsoft Dynamics 365 —
 Business Central, Finance &amp; Supply Chain, Sales, Customer Service, AI och Copilot.
 Arrangeras av svenska Microsoft-partners och av d365.se. De flesta är kostnadsfria
 och hålls online; du anmäler dig direkt via arrangörens länk.
 </p>
 </div>
 </section>

 {/* Events Content */}
 <section className="py-12">
 <div className="container mx-auto px-4">
 <Tabs defaultValue="upcoming" className="max-w-4xl mx-auto">
 <TabsList className="grid w-full grid-cols-2 mb-8">
 <TabsTrigger value="upcoming" className="gap-2">
 <Calendar className="w-4 h-4" />
 Kommande events ({upcomingEvents.length})
 </TabsTrigger>
 <TabsTrigger value="past" className="gap-2">
 <Play className="w-4 h-4" />
 Genomförda events ({pastEvents.length})
 </TabsTrigger>
 </TabsList>

 <TabsContent value="upcoming" className="space-y-6">
 {upcomingEvents.length === 0 ? (
 <Card>
 <CardContent className="py-12 text-center">
 <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
 <h3 className="text-xl font-semibold mb-2">Inga kommande events</h3>
 <p className="text-muted-foreground">
 Just nu finns inga planerade events. Kom tillbaka snart!
 </p>
 </CardContent>
 </Card>
 ) : (
 upcomingEvents.map((event) => (
 <a 
 key={event.id} 
 href={event.event_link || event.registration_link || "#"} 
 target="_blank" 
 rel="noopener noreferrer" 
 className="block"
 >
 <Card className="overflow-hidden transition-shadow relative">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
 <CardContent className="p-6">
 <div className="flex flex-col md:flex-row gap-6">
 {/* Partner/d365.se Logo */}
 <div className="shrink-0">
 <div className={`w-20 h-20 rounded flex items-center justify-center border ${
 event.partners?.logo_dark_bg ? 'bg-slate-700' : 'bg-white'
 }`}>
 {event.partners?.logo_url ? (
 <img 
 src={event.partners.logo_url} 
 alt={event.partners.name}
 className="max-w-16 max-h-16 object-contain"
 />
 ) : event.partners ? (
 <Building2 className="w-8 h-8 text-muted-foreground" />
 ) : (
 <span className="text-xl font-bold text-primary">d365</span>
 )}
 </div>
 </div>

 {/* Event Details */}
 <div className="flex-1 space-y-3">
 <div className="flex flex-wrap items-start justify-between gap-2">
 <div>
 <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
 <p className="text-sm text-muted-foreground">
 Arrangör: {event.partners?.name || "d365.se"}
 </p>
 </div>
 <Badge className="bg-violet-100 text-violet-800 border-violet-200">
 {event.is_online ? (
 <><Video className="w-3 h-3 mr-1" /> Online</>
 ) : (
 <><MapPin className="w-3 h-3 mr-1" /> På plats</>
 )}
 </Badge>
 </div>

 {event.description && (
 <p className="text-muted-foreground line-clamp-2">{event.description}</p>
 )}

 <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
 <span className="flex items-center gap-1.5 font-medium">
 <Calendar className="w-4 h-4 text-violet-600" />
 {formatDate(event.event_date)}
 </span>
 {event.event_time && (
 <span className="flex items-center gap-1.5 text-muted-foreground">
 <Clock className="w-4 h-4" />
 {formatTime(event.event_time)}
 {event.end_time && ` - ${formatTime(event.end_time)}`}
 </span>
 )}
 {!event.is_online && event.location && (
 <span className="flex items-center gap-1.5 text-muted-foreground">
 <MapPin className="w-4 h-4" />
 {event.location}
 </span>
 )}
 </div>

 <div className="flex flex-wrap items-center gap-2 pt-2">
 <Button className="gap-2 bg-violet-600 hover:bg-violet-700" size="sm">
 Läs mer & anmäl dig
 <ExternalLink className="w-3 h-3" />
 </Button>
 {event.registration_deadline && (
 <p className="text-xs text-muted-foreground">
 Sista anmälningsdag: {formatDate(event.registration_deadline)}
 </p>
 )}
 </div>
 </div>

 {/* Event Image */}
 {event.image_url && (
 <div className="shrink-0 hidden lg:block">
 <img 
 src={event.image_url} 
 alt={event.title}
 className="w-48 h-32 object-cover rounded-lg"
 />
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 </a>
 ))
 )}
 </TabsContent>

 <TabsContent value="past" className="space-y-4">
 {pastEvents.length === 0 ? (
 <Card>
 <CardContent className="py-12 text-center">
 <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
 <h3 className="text-xl font-semibold mb-2">Inga genomförda events ännu</h3>
 <p className="text-muted-foreground">
 Genomförda events kommer att visas här.
 </p>
 </CardContent>
 </Card>
 ) : (
 <div className="space-y-4">
 {pastEvents.map((event) => (
 <a 
 key={event.id} 
 href={event.event_link || event.recording_url || "#"} 
 target="_blank" 
 rel="noopener noreferrer" 
 className="block"
 >
 <Card className="overflow-hidden transition-shadow">
 <CardContent className="p-5">
 <div className="flex items-start gap-4">
 {/* Partner/d365.se Logo */}
 <div className={`w-14 h-14 rounded flex items-center justify-center border shrink-0 ${
 event.partners?.logo_dark_bg ? 'bg-slate-700' : 'bg-white'
 }`}>
 {event.partners?.logo_url ? (
 <img 
 src={event.partners.logo_url} 
 alt={event.partners.name}
 className="max-w-10 max-h-10 object-contain"
 />
 ) : event.partners ? (
 <Building2 className="w-6 h-6 text-muted-foreground" />
 ) : (
 <span className="text-sm font-bold text-primary">d365</span>
 )}
 </div>
 
 <div className="flex-1 min-w-0">
 <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
 {event.title}
 </h4>
 <p className="text-sm text-muted-foreground mt-1">
 {event.partners?.name || "d365.se"}
 </p>
 <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {formatDate(event.event_date)}
 </p>
 </div>
 
 <Badge variant="secondary" className="shrink-0">
 {event.recording_available ? "Se inspelning" : "Genomfört"}
 </Badge>
 </div>
 </CardContent>
 </Card>
 </a>
 ))}
 </div>
 )}
 </TabsContent>
 </Tabs>
 </div>
 </section>

 {/* Visible FAQ section (mirrors FAQSchema for AIO / search readiness) */}
 <section className="py-8 sm:py-12 bg-secondary/40 border-t border-border">
 <div className="container mx-auto px-4 max-w-4xl">
 <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
 Vanliga frågor om Dynamics 365-event
 </h2>
 <div className="space-y-4">
 {eventsFaqs.map((faq) => (
 <details
 key={faq.question}
 className="group bg-card border border-border rounded-lg p-5 open:"
 >
 <summary className="cursor-pointer list-none font-semibold text-foreground flex items-start justify-between gap-4">
 <h3 className="text-base sm:text-lg leading-snug">{faq.question}</h3>
 <span
 aria-hidden="true"
 className="shrink-0 text-muted-foreground group-open:rotate-45 transition-transform text-xl leading-none mt-0.5"
 >
 +
 </span>
 </summary>
 <p className="mt-3 text-sm sm:text-base text-muted-foreground whitespace-pre-line">
 {faq.answer}
 </p>
 </details>
 ))}
 </div>
 <div className="mt-8 text-center">
 <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
 <Link to="/kontakt/">
 Få hjälp att välja rätt event eller partner
 </Link>
 </Button>
 </div>
 </div>
 </section>

 <Footer />
 </div>
 );
};

export default Events;
