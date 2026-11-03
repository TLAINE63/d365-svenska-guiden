import D365InsideSection from "@/components/D365InsideSection";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { D365_INSIDE_EPISODES } from "@/data/d365Inside";
import {
  KNOWLEDGE_ENTRIES,
  TOPIC_LABEL,
  entriesFor,
  isKnowledgeEntryId,
  matchesSearch,
  recommendFor,
  topicsFor,
  type KnowledgeEntryId,
  type KnowledgeTopic,
} from "@/lib/knowledgeCenter";
import { applicationFilterLabel } from "@/lib/applicationLabels";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { KNOWLEDGE_VIDEOS, buildVideoObjectSchema } from "@/data/knowledgeVideos";
import kunskapscenterHero from "@/assets/kunskapscenter-hero.jpg";
import kravspecErpImage from "@/assets/kravspec-erp-card.jpg";
import ebookCoverImage from "@/assets/ebook-partnervalet-cover.webp";
import eventCardBg from "@/assets/articles/event-card-bg.svg";
import kravspecSalesImage from "@/assets/kravspec-sales-card.jpg";
import kravspecMarketingImage from "@/assets/kravspec-marketing-card.jpg";
import kravspecKundserviceImage from "@/assets/kravspec-kundservice-card.jpg";
import behovsErpImage from "@/assets/behovsanalys-erp-card.jpg";
import behovsSaljImage from "@/assets/behovsanalys-salj-card.jpg";
import behovsKundserviceImage from "@/assets/behovsanalys-kundservice-card.jpg";
import behovsAiImage from "@/assets/behovsanalys-ai-card.jpg";
import guideValjPartnerImage from "@/assets/guide-valj-partner-card.jpg";
import branschjamforelseImage from "@/assets/branschjamforelse-card.jpg";
import upphandlingsresanImage from "@/assets/upphandlingsresan-card.jpg";
import { formatDateYYYYMMDD } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import ProductQASection from "@/components/ProductQASection";
import { PRODUCT_QA_DATA } from "@/data/productQA";
import { ALL_DEEP_DIVE_ARTICLES } from "@/data/bcArticles";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import PriceListSection from "@/components/PriceListSection";
import MicrosoftNewsSection from "@/components/MicrosoftNewsSection";
import { usePartners } from "@/hooks/usePartners";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { Card, CardContent } from "@/components/ui/card";
import {
 Calendar,
 ExternalLink,
 FileText,
 Play,
 Wrench,
 CalendarDays,
 BookOpen,
 ArrowRight,
 ChevronDown,
 Check,
 Sparkles,
 Compass,
 Database,
 Users,
 ClipboardList,
 Handshake,
 X,
 Search,
 Mic,
 Lightbulb,
 Scale,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────

type CategoryFilter = "alla" | "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video" | "intervju" | "fordjupning" | "branscher";

type FormatValue = "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video" | "intervju" | "branscher";

type ProductValue = "Business Central" | "Finance & SCM" | "Sales" | "Customer Insights" | "Customer Service" | "Field Service" | "Contact Center" | "AI/Copilot/Agents";

interface KnowledgeArticle {
 id: string;
 title: string;
 description: string | null;
 category: string;
 content_type: string;
 format: string;
 url: string | null;
 image_url: string | null;
 published_at: string | null;
 target_roles: string[];
}

interface EventItem {
 id: string;
 title: string;
 description: string | null;
 event_date: string;
 event_link: string | null;
 is_online: boolean;
 location: string | null;
 image_url: string | null;
 partners: { name: string; slug: string; logo_url: string | null } | null;
}

interface UnifiedItem {
 id: string;
 type: FormatValue;
 title: string;
 description: string | null;
 url: string | null;
 image_url: string | null;
 isLogoImage: boolean;
 partnerLogoUrl: string | null;
 date: string | null;
 partner: string | null;
 isExternal: boolean;
 icon: typeof CalendarDays;
 products: string[];
 partnerCount?: number | null;
 category?: string | null;
 tags?: string[];
 /** Bransch enligt d365.se:s branschindelning, när innehållet har en. */
 industries?: string[];
}

// Map BLOG_ARTICLES slug → industry name (used to count listed partners per industry).
const BRANSCHGUIDE_INDUSTRY_BY_SLUG: Record<string, string> = {
 "dynamics-365-retail-ehandel": "Retail & E-handel",
 "dynamics-365-tillverkningsindustri": "Tillverkningsindustri",
 "dynamics-365-livsmedel-processindustri": "Livsmedel & Processindustri",
 "dynamics-365-grossist-distribution": "Grossist & Distribution",
 "dynamics-365-jordbruk-skogsbruk": "Jordbruk & Skogsbruk",
 "dynamics-365-bygg-entreprenad": "Bygg, Entreprenad & Installation",
 "dynamics-365-energi-utilities": "Energi & Utilities",
 "dynamics-365-konsultbolag-tjansteforetag": "Konsulttjänster",
 "dynamics-365-finans-forsakring": "Finans & Försäkring",
 "dynamics-365-offentlig-sektor": "Offentlig sektor",
 "dynamics-365-life-science-medtech": "Life Science / Medtech",
 "dynamics-365-telekom-it-tjanster": "Telekom & IT-tjänster",
 "dynamics-365-uthyrning": "Uthyrningsverksamhet",
 "dynamics-365-mode-sport-textil": "Mode, Sport & Textil",
 "dynamics-365-fastighet-forvaltning": "Fastighet & Förvaltning",
 "dynamics-365-transport-logistik": "Transport & Logistik",
 "dynamics-365-medlemsorganisationer": "Medlemsorganisationer",
};

// ── Static content ─────────────────────────────────────

const STATIC_TOOLS: Array<{
 id: string;
 title: string;
 description: string;
 type: FormatValue;
 url: string;
 image_url: string | null;
 icon: typeof Wrench;
 products: ProductValue[];
}> = [
 {
 id: "tool-behovsanalys-erp",
 title: "Behovsanalys ERP (Affärssystem)",
 description: "Besvara frågor om verksamheten och få ett underlag med möjliga lösningsinriktningar.",
 type: "behovsanalys",
 url: "/ERPbehovsanalys",
 image_url: behovsErpImage,
 icon: Wrench,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "tool-behovsanalys-salj",
 title: "Behovsanalys Sälj & Marknad (CRM)",
 description: "Analysera dina behov inom sälj och marknad för att hitta rätt CRM-lösning.",
 type: "behovsanalys",
 url: "/CRMbehovsanalys",
 image_url: behovsSaljImage,
 icon: Wrench,
 products: ["Sales", "Customer Insights"],
 },
 {
 id: "tool-behovsanalys-kundservice",
 title: "Behovsanalys Kundservice & Field Service",
 description: "Beskriv era servicebehov och se vilka Dynamics\u00a0365-lösningar som kan vara relevanta.",
 type: "behovsanalys",
 url: "/kundservice-behovsanalys",
 image_url: behovsKundserviceImage,
 icon: Wrench,
 products: ["Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "tool-ai-readiness",
 title: "AI Readiness Assessment",
 description: "Bedöm organisationens förutsättningar för AI och Copilot och se vilka områden som behöver mer arbete.",
 type: "behovsanalys",
 url: "/ai-readiness",
 image_url: behovsAiImage,
 icon: Wrench,
 products: ["AI/Copilot/Agents", "Business Central", "Sales", "Customer Service"],
 },
 {
 id: "tool-bc-matchningstest",
 title: "Business Central matchningstest",
 description: "Sex frågor med branschspecifik fördjupning. Få en bedömning om Business Central matchar dina behov – och var du eventuellt behöver ISV-tillägg eller annan plattform.",
 type: "behovsanalys",
 url: "/businesscentral/matchningstest",
 image_url: behovsErpImage,
 icon: Wrench,
 products: ["Business Central"],
 },
 {
 id: "tool-branschjamforelse",
 title: "Branschjämförelse: BC vs Finance & Supply Chain Management (F&O)",
 description: "Jämför Business Central och Finance & Supply Chain Management utifrån bransch, storlek och geografi.",
 type: "guide",
 url: "/affarssystem/#branschjamforelse",
 image_url: branschjamforelseImage,
 icon: Wrench,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "tool-kravspec-erp",
 title: "Kravspecifikation ERP",
 description: "Skapa ett första kravunderlag för ert ERP-projekt.",
 type: "kravspecifikation",
 url: "/kravspecifikation",
 image_url: kravspecErpImage,
 icon: FileText,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "tool-kravspec-sales",
 title: "Kravspecifikation Sälj",
 description: "Skapa ett första kravunderlag för säljavdelningen.",
 type: "kravspecifikation",
 url: "/kravspecifikation-sales",
 image_url: kravspecSalesImage,
 icon: FileText,
 products: ["Sales"],
 },
 {
 id: "tool-kravspec-marketing",
 title: "Kravspecifikation Marknad",
 description: "Skapa en kravspecifikation för din marknadsavdelning.",
 type: "kravspecifikation",
 url: "/kravspecifikation-marketing",
 image_url: kravspecMarketingImage,
 icon: FileText,
 products: ["Customer Insights"],
 },
 {
 id: "tool-kravspec-kundservice",
 title: "Kravspecifikation Kundservice",
 description: "Skapa ett första kravunderlag för kundservice.",
 type: "kravspecifikation",
 url: "/kravspecifikation-kundservice",
 image_url: kravspecKundserviceImage,
 icon: FileText,
 products: ["Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "tool-guide-valj-partner",
 title: "Så väljer du rätt Dynamics 365-partner",
 description: "Frågor och checklistor som hjälper er att jämföra implementeringspartner.",
 type: "guide",
 url: "/valjdynamics365partner/#guide",
 image_url: guideValjPartnerImage,
 icon: BookOpen,
 products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center", "AI/Copilot/Agents"],
 },
 {
 id: "tool-ebook-partnervalet",
 title: "E-bok: Det viktiga partnervalet",
 description: "20 sidor med statistik, insikter och en praktisk modell för att välja rätt Microsoftpartner.",
 type: "guide",
 url: "/ebooks/det-viktiga-partnervalet.pdf",
 image_url: ebookCoverImage,
 icon: BookOpen,
 products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center", "AI/Copilot/Agents"],
 },
 {
 id: "tool-faq-affarssystem-partnerval",
 title: "Vanliga frågor om affärssystem och partnerval",
 description: "Samlade svar på de vanligaste frågorna om ERP, CRM, partnerval, kostnader, tidplan och förvaltning.",
 type: "guide",
 url: "/qa/",
 image_url: guideValjPartnerImage,
 icon: BookOpen,
 products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "tool-upphandlingsresan",
 title: "Upphandlingsguiden – 7 stadier",
 description: "Var i upphandlingsresan står du? Följ de sju stadierna för ERP och CRM, med verktyg för varje steg.",
 type: "guide",
 url: "/upphandlingsguiden/",
 image_url: upphandlingsresanImage,
 icon: BookOpen,
 products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "video-byta-affarssystem",
 title: "Vad föranleder beslutet att byta affärssystem?",
 description: "Kort film där Thomas Laine resonerar kring de vanligaste drivkrafterna bakom ett byte av affärssystem (ERP).",
 type: "video",
 url: "/kunskapscenter/video/byta-affarssystem",
 image_url: "https://i.ytimg.com/vi/CjU7ner8888/hqdefault.jpg",
 icon: Play,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "video-crm-affarssystem-byte",
 title: "När vet man att CRM och/eller Affärssystemet behöver bytas ut?",
 description: "Kort film som hjälper dig identifiera signalerna på att det är dags att byta ut ditt CRM eller affärssystem.",
 type: "video",
 url: "/kunskapscenter/video/crm-affarssystem-byte",
 image_url: "https://i.ytimg.com/vi/-MnQUYiIOU0/hqdefault.jpg",
 icon: Play,
 products: ["Sales", "Customer Insights", "Business Central", "Finance & SCM"],
 },
 {
 id: "video-inspirerad-personal",
 title: "Håll personalen inspirerad med moderna affärssystem",
 description: "Kort film om hur moderna affärssystem kan engagera och inspirera medarbetarna genom bättre verktyg och arbetsflöden.",
 type: "video",
 url: "/kunskapscenter/video/inspirerad-personal",
 image_url: "https://i.ytimg.com/vi/bKN7_JXQlJs/hqdefault.jpg",
 icon: Play,
 products: ["Business Central", "Finance & SCM", "AI/Copilot/Agents"],
 },
 {
 id: "video-partners-skillnader",
 title: "Alla Dynamics 365-partners är inte likadana och skillnaderna är större än man tror",
 description: "Kort film om skillnader mellan Dynamics\u00a0365-partners och vad ni kan jämföra inför ett val.",
 type: "video",
 url: "/kunskapscenter/video/partners-skillnader",
 image_url: "https://i.ytimg.com/vi/71hzvTRWF_0/hqdefault.jpg",
 icon: Play,
 products: ["Business Central", "Finance & SCM", "Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center", "AI/Copilot/Agents"],
 },
];

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
 { label: "Alla", value: "alla" },
 { label: "Produktfördjupningar (Q&A)", value: "fordjupning" },
 { label: "Branscher & Partners", value: "branscher" },
 { label: "Events", value: "event" },
 { label: "Guider & Behovsanalyser", value: "behovsanalys" },
 { label: "Kravspecifikationer", value: "kravspecifikation" },
 { label: "Artiklar", value: "artikel" },
 { label: "Videor", value: "video" },
 { label: "Intervjuer (INSIDE)", value: "intervju" },
];

const FORMAT_OPTIONS: { label: string; value: FormatValue }[] = [
 { label: "Event", value: "event" },
 { label: "Branscher & Partners", value: "branscher" },
 { label: "Guide & Behovsanalys", value: "behovsanalys" },
 { label: "Kravspecifikation", value: "kravspecifikation" },
 { label: "Artikel", value: "artikel" },
 { label: "Video", value: "video" },
 { label: "Intervju", value: "intervju" },
];

const PRODUCT_OPTIONS: ProductValue[] = [
 "Business Central",
 "Finance & SCM",
 "Sales",
 "Customer Insights",
 "Customer Service",
 "Field Service",
 "Contact Center",
 "AI/Copilot/Agents",
];

const ENTRY_ICON: Record<KnowledgeEntryId, typeof Compass> = {
 behov: Lightbulb,
 jamfor: Scale,
 planera: ClipboardList,
 partner: Handshake,
};

const TOPIC_OPTIONS = (Object.keys(TOPIC_LABEL) as KnowledgeTopic[]).map((t) => ({ label: TOPIC_LABEL[t], value: t }));
const INDUSTRY_OPTIONS = [...new Set(Object.values(BRANSCHGUIDE_INDUSTRY_BY_SLUG))].sort((a, b) => a.localeCompare(b, "sv")).map((v) => ({ label: v, value: v }));

/** Befintliga verktyg med egna primära funktioner; Kunskapscentret länkar bara dit. */
const TOOL_SHORTCUTS: { label: string; to: string; icon: typeof Compass }[] = [
 { label: "Behovsguiden", to: "/kom-igang/", icon: Compass },
 { label: "Kostnadskalkyl", to: "/kostnad/", icon: Database },
 { label: "Kravspecifikation", to: "/kravspecifikation/", icon: FileText },
 { label: "Tilläggskatalog", to: "/kunskapscenter/dynamics-365-tillagg/", icon: Sparkles },
 { label: "Hitta partner", to: "/valjdynamics365partner/", icon: Users },
 { label: "Jämför partners", to: "/jamfor-partners/", icon: Scale },
];

/** INSIDE-avsnitt som har en artikel på d365.se: artikeln visas som intervju i biblioteket. */
const INSIDE_ARTICLE_PATHS = new Set(D365_INSIDE_EPISODES.map((e) => e.articlePath).filter(Boolean) as string[]);

// ── Dropdown component ─────────────────────────────────

function MultiSelectDropdown<T extends string>({
 label,
 options,
 selected,
 onChange,
}: {
 label: string;
 options: { label: string; value: T }[] | T[];
 selected: T[];
 onChange: (val: T[]) => void;
}) {
 const [open, setOpen] = useState(false);
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handler = (e: MouseEvent) => {
 if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
 };
 document.addEventListener("mousedown", handler);
 return () => document.removeEventListener("mousedown", handler);
 }, []);

 const normalized = (options as any[]).map((o: any) =>
 typeof o === "string" ? { label: o, value: o } : o
 ) as { label: string; value: T }[];

 const toggle = (val: T) => {
 onChange(
 selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
 );
 };

 return (
 <div className="relative" ref={ref}>
 <button
 onClick={() => setOpen(!open)}
 className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-200 border ${
 selected.length > 0
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:border-slate-500"
 }`}
 >
 {label}
 {selected.length > 0 && (
 <span className="bg-primary-foreground/20 text-primary-foreground rounded px-1.5 py-0.5 text-xs font-bold leading-none">
 {selected.length}
 </span>
 )}
 <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
 </button>
 {open && (
 <div className="absolute top-full mt-2 left-0 z-50 min-w-[200px] rounded border border-border bg-card overflow-hidden">
 <div className="p-1">
 {normalized.map((opt) => (
 <button
 key={opt.value}
 onClick={() => toggle(opt.value)}
 className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-muted/60 transition-colors"
 >
 <span
 className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
 selected.includes(opt.value)
 ? "bg-primary border-primary text-primary-foreground"
 : "border-border"
 }`}
 >
 {selected.includes(opt.value) && <Check className="w-3 h-3" />}
 </span>
 <span className="text-foreground">{opt.label}</span>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}

// ── Main component ─────────────────────────────────────

const Kunskapscenter = () => {
 const [activeCategory, setActiveCategory] = useState<CategoryFilter>(() => {
   if (typeof window === "undefined") return "alla";
   const params = new URLSearchParams(window.location.search);
   return params.get("kategori") === "fordjupning" || params.get("produkt")
     ? "fordjupning"
     : "alla";
 });
 const [activeEntry, setActiveEntry] = useState<KnowledgeEntryId | null>(() => {
   if (typeof window === "undefined") return null;
   const v = new URLSearchParams(window.location.search).get("ingang");
   return isKnowledgeEntryId(v) ? v : null;
 });
 const [query, setQuery] = useState(() => {
   if (typeof window === "undefined") return "";
   return new URLSearchParams(window.location.search).get("q") ?? "";
 });
 const [selectedTopics, setSelectedTopics] = useState<KnowledgeTopic[]>([]);
 const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
 const [insideVideos, setInsideVideos] = useState<{ youtube_id: string; title: string; published_at: string | null; summary_sv: string | null }[]>([]);
 const recommendRef = useRef<HTMLDivElement>(null);
 const libraryRef = useRef<HTMLDivElement>(null);
 const [selectedFormats, setSelectedFormats] = useState<FormatValue[]>([]);
 const [selectedProducts, setSelectedProducts] = useState<ProductValue[]>([]);
 const [deepDiveProduct, setDeepDiveProduct] = useState<string | null>(() => {
   if (typeof window === "undefined") return null;
   return new URLSearchParams(window.location.search).get("produkt");
 });
 const [deepDiveView, setDeepDiveView] = useState<"articles" | "prices">("articles");
 const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
 const [events, setEvents] = useState<EventItem[]>([]);
 const [loading, setLoading] = useState(true);
 const { data: partnersForCounts } = usePartners();

 const partnerCountByIndustry = (() => {
 const counts: Record<string, number> = {};
 (partnersForCounts || [])
 .filter((p) => p.is_featured === true)
 .forEach((p) => {
 collectPartnerIndustries(p).forEach((name) => {
 counts[name] = (counts[name] || 0) + 1;
 });
 });
 return counts;
 })();

 useEffect(() => {
 const fetchData = async () => {
 setLoading(true);
 try {
 const [articlesRes, eventsRes, insideRes] = await Promise.all([
 supabase
 .from("knowledge_articles")
 .select("*")
 .eq("is_published", true)
 .neq("content_type", "aktuellt")
 .order("published_at", { ascending: false }),
 fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=public-events`,
 {
 headers: {
 apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 "Content-Type": "application/json",
  },
 }
 ),
 supabase
 .from("d365_videos")
 .select("youtube_id, title, published_at, summary_sv")
 .eq("status", "published")
 .ilike("channel_name", "%inside%")
 .order("published_at", { ascending: false, nullsFirst: false })
 .limit(24),
 ]);
 if (insideRes.data) setInsideVideos(insideRes.data);

 if (articlesRes.data) setArticles(articlesRes.data as any);

 if (eventsRes.ok) {
 const result = await eventsRes.json();
 const now = new Date();
 now.setHours(0, 0, 0, 0);
 const allEvents = (result.events || []).sort(
 (a: EventItem, b: EventItem) => {
 const aUp = new Date(a.event_date) >= now;
 const bUp = new Date(b.event_date) >= now;
 if (aUp && !bUp) return -1;
 if (!aUp && bUp) return 1;
 if (aUp) return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
 return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
 }
 );
 setEvents(allEvents);
 }
 } catch (err) {
 console.error("Error fetching knowledge center data:", err);
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 const formatDate = formatDateYYYYMMDD;

 // Build unified items list
 const allItems: UnifiedItem[] = [
 ...events.map((e) => ({
 id: e.id,
 type: "event" as const,
 title: e.title,
 description: e.description,
 url: e.event_link,
 image_url: e.image_url || eventCardBg,
 isLogoImage: false,
 partnerLogoUrl: e.partners?.logo_url || null,
 date: e.event_date,
 partner: e.partners?.name || null,
 isExternal: true,
 icon: CalendarDays,
 products: [] as string[],
 })),
 ...STATIC_TOOLS.map((t) => ({
 id: t.id,
 type: t.type,
 title: t.title,
 description: t.description,
 url: t.url,
 image_url: t.image_url,
 isLogoImage: false,
 partnerLogoUrl: null as string | null,
 date: null as string | null,
 partner: null as string | null,
 isExternal: t.url.startsWith("http") || t.url.endsWith(".pdf"),
 icon: t.icon,
 products: t.products as string[],
 })),
 ...BLOG_ARTICLES.map((b) => ({
 id: `blog-${b.slug}`,
 type: (INSIDE_ARTICLE_PATHS.has(`/artiklar/${b.slug}/`) ? "intervju" : b.category === "Branschguide" ? "branscher" : "artikel") as FormatValue,
 category: b.category,
 tags: b.tags,
 industries: BRANSCHGUIDE_INDUSTRY_BY_SLUG[b.slug] ? [BRANSCHGUIDE_INDUSTRY_BY_SLUG[b.slug]] : [],
 title: b.title,
 description: b.summary,
 url: `/artiklar/${b.slug}`,
 image_url: b.heroImage,
 isLogoImage: false,
 partnerLogoUrl: null as string | null,
 date: b.publishedAt,
 partner: null as string | null,
 isExternal: false,
 icon: BookOpen,
 products: b.products,
 partnerCount:
 b.category === "Branschguide" && BRANSCHGUIDE_INDUSTRY_BY_SLUG[b.slug]
 ? partnerCountByIndustry[BRANSCHGUIDE_INDUSTRY_BY_SLUG[b.slug]] ?? null
 : null,
 })),
 ...articles
 .filter((a) => a.title?.trim() && a.url?.trim())
 .map((a) => ({
 id: a.id,
 type: (INSIDE_ARTICLE_PATHS.has(`${(a.url || "").replace(/^https?:\/\/(www\.)?d365\.se/, "").replace(/\/?$/, "/")}`) ? "intervju" : a.format || a.category) as FormatValue,
 title: a.title,
 description: a.description,
 url: a.url,
 image_url: a.image_url,
 isLogoImage: false,
 partnerLogoUrl: null as string | null,
 date: a.published_at,
 partner: null as string | null,
 isExternal: a.url?.startsWith("http") ?? false,
 icon: a.content_type === "video" ? Play : BookOpen,
 products: a.target_roles || [],
 })),
 // INSIDE-avsnitt utan egen artikel: länkar till avsnittet på YouTube.
 ...[
  ...D365_INSIDE_EPISODES.filter((e) => !e.articlePath).map((e) => ({ youtube_id: e.youtubeId, title: e.title, published_at: e.publishedAt, summary_sv: e.summary })),
  ...insideVideos,
 ]
  .filter((v, i, arr) => arr.findIndex((x) => x.youtube_id === v.youtube_id) === i)
  .filter((v) => !D365_INSIDE_EPISODES.some((e) => e.youtubeId === v.youtube_id && e.articlePath))
  .map((v) => ({
   id: `inside-${v.youtube_id}`,
   type: "intervju" as const,
   title: v.title,
   description: v.summary_sv,
   url: `https://www.youtube.com/watch?v=${v.youtube_id}`,
   image_url: `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
   isLogoImage: false,
   partnerLogoUrl: null as string | null,
   date: v.published_at ? v.published_at.slice(0, 10) : null,
   partner: null as string | null,
   isExternal: true,
   icon: Mic,
   products: [] as string[],
  })),
 ];

  // Apply filters

  const getSortDate = (date: string | null): number => {
    if (!date) return Number.NEGATIVE_INFINITY;
    const t = new Date(date).getTime();
    return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
  };

  const filteredItems = allItems
   .filter((item) => {
    // Vald ingång (samma källa som rekommendationerna)
    if (activeEntry && !entriesFor(item).includes(activeEntry)) return false;
    if (!matchesSearch(item, query)) return false;
    if (selectedTopics.length > 0 && !topicsFor(item).some((t) => selectedTopics.includes(t))) return false;
    if (selectedIndustries.length > 0 && !(item.industries ?? []).some((i) => selectedIndustries.includes(i))) return false;
    // Category pill filter (guide items grouped under behovsanalys)
    if (activeCategory !== "alla") {
     const itemCategory = item.type === "guide" ? "behovsanalys" : item.type;
     if (itemCategory !== activeCategory) return false;
    }
    // Format multi-select (guide items grouped under behovsanalys)
    if (selectedFormats.length > 0) {
     const itemFormat = item.type === "guide" ? "behovsanalys" : item.type;
     if (!selectedFormats.includes(itemFormat as FormatValue)) return false;
    }
    // Product filter
    if (selectedProducts.length > 0 && item.products.length > 0) {
     if (!selectedProducts.some((p) => item.products.includes(p))) return false;
    }
    return true;
   })
   .sort((a, b) => getSortDate(b.date) - getSortDate(a.date));

  const entryCounts = KNOWLEDGE_ENTRIES.reduce(
   (acc, e) => {
    acc[e.id] = allItems.filter((i) => entriesFor(i).includes(e.id)).length;
    return acc;
   },
   {} as Record<KnowledgeEntryId, number>,
  );
  const activeEntryDef = activeEntry ? KNOWLEDGE_ENTRIES.find((e) => e.id === activeEntry) ?? null : null;
  const recommendations = activeEntry ? recommendFor(allItems, activeEntry) : [];

  const syncUrl = (entry: KnowledgeEntryId | null) => {
   if (typeof window === "undefined") return;
   const url = new URL(window.location.href);
   if (entry) url.searchParams.set("ingang", entry);
   else url.searchParams.delete("ingang");
   window.history.replaceState(window.history.state, "", url.toString());
  };

  const selectEntry = (value: KnowledgeEntryId) => {
   const next = activeEntry === value ? null : value;
   setActiveEntry(next);
   syncUrl(next);
   if (next) {
    setActiveCategory("alla");
    trackFunnelEvent({ event_type: "engagement", event_name: "knowledge_entry_selected", metadata: { entry: next } });
    setTimeout(() => recommendRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
   }
  };

  const showAll = () => {
   setActiveEntry(null);
   syncUrl(null);
   setTimeout(() => libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const trackClick = (eventName: string, metadata: Record<string, unknown>) =>
   trackFunnelEvent({ event_type: "cta_click", event_name: eventName, metadata: { entry: activeEntry, ...metadata } });

 const categoryBadgeColor = (type: string) => {
 switch (type) {
 case "event":
 return "bg-primary text-primary-foreground border-primary";
 case "behovsanalys":
  return "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]";
  case "kravspecifikation":
  return "bg-indigo-600 text-white border-indigo-600";
  case "artikel":
  return "bg-slate-600 text-white border-slate-600";
  case "guide":
  return "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]";
 case "video":
 return "bg-rose-600 text-white border-rose-600";
  case "branscher":
  return "bg-amber-700 text-white border-amber-700";
  case "intervju":
  return "bg-[hsl(var(--hero-dark))] text-white border-[hsl(var(--hero-dark))]";
 default:
 return "bg-muted text-muted-foreground border-border";
 }
 };

 const categoryLabel = (type: string, date?: string | null) => {
 switch (type) {
 case "event": {
 if (date) {
 const now = new Date();
 now.setHours(0, 0, 0, 0);
 if (new Date(date) < now) return "Event (datum passerat)";
 }
 return "Event";
 }
 case "behovsanalys": return "Guide & Behovsanalys";
 case "kravspecifikation": return "Kravspecifikation";
 case "artikel": return "Artikel";
 case "guide": return "Guide & Behovsanalys";
 case "video": return "Video";
 case "branscher": return "Branscher & Partners";
 case "intervju": return "Intervju · INSIDE";
 default: return type;
 }
 };

 const hasActiveFilters =
  selectedFormats.length > 0 || selectedProducts.length > 0 || selectedTopics.length > 0 || selectedIndustries.length > 0 || activeEntry !== null || query.trim() !== "";

 const clearAllFilters = () => {
  setActiveCategory("alla");
  setSelectedFormats([]);
  setSelectedProducts([]);
  setSelectedTopics([]);
  setSelectedIndustries([]);
  setQuery("");
  setActiveEntry(null);
  syncUrl(null);
 };

 const renderItemCard = (item: UnifiedItem, place: "library" | "recommended") => {
 const CardWrapper = item.isExternal ? "a" : Link;
 const linkProps = item.isExternal
 ? {
 href: item.url || "#",
 target: "_blank" as const,
 rel: "noopener noreferrer",
 }
 : { to: item.url || "#" };

 return (
 <CardWrapper
 key={item.id}
 {...(linkProps as any)}
 className="group block"
 onClick={() => trackClick(place === "recommended" ? "knowledge_recommendation_clicked" : "knowledge_library_clicked", { item_type: item.type, item: item.id })}
 >
 <Card className="h-full overflow-hidden border-border/50 hover:-translate-y-1 transition-all duration-300">
 {item.image_url ? (
              <div
                className={`${item.type === "video" ? "aspect-[20/7]" : "aspect-[2/1]"} overflow-hidden bg-muted relative`}
              >
 <img
 src={item.image_url}
 alt={item.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 loading="lazy"
 />
 {item.type === "event" && (
 <>
 <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded tracking-wide uppercase">
 Event
 </span>
 {item.partnerLogoUrl && (
 <div className="absolute bottom-2 right-2 bg-white rounded-md p-1.5">
 <img
 src={item.partnerLogoUrl}
 alt={item.partner || "Partner"}
 className="h-6 w-auto max-w-[80px] object-contain"
 />
 </div>
 )}
 </>
 )}
 {item.type === "branscher" && (
 <span
 title="AI-assisterat branschinnehåll"
 aria-label="AI-assisterat branschinnehåll"
 className="absolute top-2 right-2 inline-flex items-center gap-1 rounded bg-cyan-500/95 text-white text-[10px] font-semibold px-2 py-0.5 "
 >
 <Sparkles className="w-3 h-3" />
 AI
 </span>
 )}
 {item.type === "branscher" && typeof item.partnerCount === "number" && item.partnerCount > 0 && (
 <span className="absolute bottom-2 left-2 inline-flex items-center rounded bg-background/90 text-foreground text-[10px] font-semibold px-2 py-0.5 border border-border/40">
 {item.partnerCount} {item.partnerCount === 1 ? "partner" : "partners"} listade
 </span>
 )}
 </div>
              ) : (
                <div
                  className={`${item.type === "video" ? "aspect-[20/7]" : "aspect-[2/1]"} overflow-hidden bg-gradient-to-br from-secondary to-muted flex items-center justify-center`}
                >
 <item.icon className="w-12 h-12 text-muted-foreground/40" />
 </div>
 )}
 <CardContent className="p-5 flex flex-col gap-3">
 <div className="flex items-center gap-2 flex-wrap">
 <Badge
 variant="outline"
 className={`text-xs ${categoryBadgeColor(item.type)}`}
 >
 {categoryLabel(item.type, item.date)}
 </Badge>
 {item.partner && (
 <span className="text-xs text-muted-foreground">
 {item.partner}
 </span>
 )}
 </div>
 <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base leading-snug">
 {item.title}
 </h3>
 {item.description && (
 <p className="text-sm text-muted-foreground line-clamp-2">
 {item.description}
 </p>
 )}
 {item.products.length > 0 && (
 <div className="flex flex-wrap gap-1">
 {item.products.slice(0, 3).map((product) => (
 <span
 key={product}
  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
  >
  {applicationFilterLabel(product)}
  </span>
 ))}
 {item.products.length > 3 && (
 <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
 +{item.products.length - 3}
 </span>
 )}
 </div>
 )}
 <div className="flex items-center justify-between mt-auto pt-2">
 {item.date && (
 <span className="text-xs text-muted-foreground flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {formatDate(item.date)}
 </span>
 )}
  <span className="text-xs text-primary font-medium flex items-center gap-1 ml-auto">
  {item.isExternal ? (
  <>
  Öppna <ExternalLink className="w-3 h-3" />
  </>
  ) : (
  <>
  {item.title ? `Läs mer om ${item.title}` : "Läs artikeln"} <ArrowRight className="w-3 h-3" />
  </>
  )}
  </span>
 </div>
 </CardContent>
 </Card>
 </CardWrapper>
 );
 };

 return (
 <>
 <SEOHead
 title="Kunskapscenter – Microsoft Dynamics 365-guider"
 description="Artiklar, videor, behovsanalyser, kravspecar och events för beslut om Microsoft Dynamics 365. Läs på, jämför alternativ och bygg ert beslutsunderlag."
 canonicalPath="/kunskapscenter"
 />
 <BreadcrumbSchema
 items={[
 { name: "Hem", url: "https://d365.se/" },
 { name: "Kunskapscenter & Events", url: "https://d365.se/kunskapscenter" },
 ]}
 />
 <FAQSchema
 faqs={PRODUCT_QA_DATA.flatMap((cat) =>
 cat.items.slice(0, 4).map((item) => ({
 question: `${item.question} (${cat.product})`,
 answer:
 typeof item.answer === "string"
 ? item.answer.replace(/\s+/g, " ").trim().substring(0, 500)
 : "",
 }))
 ).filter((f) => f.answer.length > 0)}
 />
 <Helmet>
 {KNOWLEDGE_VIDEOS.map((v) => (
 <script key={v.slug} type="application/ld+json">
 {JSON.stringify(buildVideoObjectSchema(v))}
 </script>
 ))}
 </Helmet>
 <Navbar />
 <main className="min-h-screen bg-background pt-12 lg:pt-28">
 {/* Hero */}
 <section className="relative py-8 md:py-10 overflow-hidden">
 <div className="absolute inset-0">
 <img
 src={kunskapscenterHero}
 alt=""
 className="w-full h-full object-cover"
 loading="eager"
 fetchPriority="high"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
 </div>
 <div className="container mx-auto px-4 max-w-6xl relative z-10">
 <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight max-w-3xl">
 Kunskap och vägledning för bättre Dynamics&nbsp;365-beslut
 </h1>
 <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
 Guider, jämförelser, analyser och erfarenheter för er som ska välja, införa, utveckla eller ompröva en Dynamics&nbsp;365-lösning.
 </p>
 <form
  role="search"
  className="mt-5 max-w-xl"
  onSubmit={(e) => {
   e.preventDefault();
   trackFunnelEvent({ event_type: "engagement", event_name: "knowledge_search", metadata: { has_query: query.trim().length > 0 } });
   libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }}
 >
  <label htmlFor="kc-search" className="sr-only">Sök i Kunskapscentret</label>
  <div className="flex items-center gap-2 rounded-md bg-background p-1.5 shadow-lg">
   <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
   <input
    id="kc-search"
    type="search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Sök guider, artiklar, verktyg och intervjuer"
    className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
   />
   <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
    Sök
   </button>
  </div>
 </form>
 </div>
 </section>

 {/* Fyra ingångar – gemensam navigering och filtrering ovanpå biblioteket */}
 <section className="border-b border-border bg-[hsl(var(--bg-card))]" aria-labelledby="kc-entries-heading">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
   <h2 id="kc-entries-heading" className="text-xl md:text-2xl font-bold text-foreground">
    Var står ni i ert beslut?
   </h2>
   <p className="text-sm text-muted-foreground mt-1 mb-5 max-w-2xl">
    Välj det som bäst beskriver er fråga just nu. Det fungerar både om ni väljer nytt och om ni redan använder Dynamics&nbsp;365.
   </p>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {KNOWLEDGE_ENTRIES.map((entry) => {
     const Icon = ENTRY_ICON[entry.id];
     const isActive = activeEntry === entry.id;
     return (
      <button
       key={entry.id}
       type="button"
       onClick={() => selectEntry(entry.id)}
       aria-pressed={isActive}
       className={`flex h-full flex-col text-left p-5 rounded-lg border transition-all duration-200 ${
        isActive
         ? "bg-primary/10 border-primary ring-1 ring-primary"
         : "bg-card border-border hover:border-primary/50 hover:-translate-y-0.5"
       }`}
      >
       <span
        className={`inline-flex items-center justify-center w-10 h-10 rounded border mb-3 ${
         isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-[hsl(var(--signature))] border-border"
        }`}
       >
        <Icon className="w-5 h-5" aria-hidden="true" />
       </span>
       <h3 className="text-base font-semibold text-foreground">{entry.title}</h3>
       <p className="mt-1 text-sm font-medium text-foreground/80">{entry.question}</p>
       <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{entry.description}</p>
       <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {isActive ? "Vald" : entry.cta}
        {isActive ? <Check className="w-4 h-4" aria-hidden="true" /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}
        <span className="ml-1 text-[10px] font-normal text-muted-foreground">({entryCounts[entry.id] ?? 0})</span>
       </span>
      </button>
     );
    })}
   </div>
  </div>
 </section>

 {/* Rekommenderat innehåll för vald ingång */}
 <div ref={recommendRef} className="scroll-mt-32" />
 {activeEntryDef && (
  <section className="border-b border-border bg-background" aria-labelledby="kc-rec-heading">
   <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
     <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--signature))]">Rekommenderat för er</p>
      <h2 id="kc-rec-heading" className="text-xl md:text-2xl font-bold text-foreground">{activeEntryDef.title}</h2>
     </div>
     <button type="button" onClick={showAll} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 underline underline-offset-2">
      <X className="w-3.5 h-3.5" aria-hidden="true" /> Visa allt innehåll
     </button>
    </div>
    {recommendations.length === 0 ? (
     <p className="text-sm text-muted-foreground">
      Vi har ännu inte publicerat innehåll för den här frågan. Prova en annan ingång eller sök i hela biblioteket nedan.
     </p>
    ) : (
     <>
      {recommendations.some((r) => r.related) && (
       <p className="mb-4 text-sm text-muted-foreground">
        Det finns få resurser för just den här frågan. Vi visar även närliggande innehåll, markerat nedan.
       </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {recommendations.map((r) => (
        <div key={r.item.id} className="relative">
         {r.related && (
          <span className="absolute -top-2 left-3 z-10 rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border">
           Närliggande
          </span>
         )}
         {renderItemCard(r.item, "recommended")}
        </div>
       ))}
      </div>
     </>
    )}
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
     <span className="font-semibold text-foreground">Gå vidare:</span>
     {activeEntryDef.nextSteps.map((n) => (
      <Link key={n.to} to={n.to} onClick={() => trackClick("knowledge_next_step_clicked", { to: n.to })} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
       {n.label} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
     ))}
     {entryCounts[activeEntryDef.id] > recommendations.filter((r) => !r.related).length && (
      <button type="button" onClick={() => libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
       Se alla {entryCounts[activeEntryDef.id]} resurser <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
     )}
    </div>
   </div>
  </section>
 )}

 {/* Utvalda verktyg – kompakt, länkar till verktygens egna sidor */}
 <section className="border-b border-border bg-muted/30" aria-labelledby="kc-tools-heading">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6">
   <h2 id="kc-tools-heading" className="text-sm font-semibold text-[hsl(var(--signature))] uppercase tracking-wider mb-3">
    Utvalda verktyg
   </h2>
   <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
    {TOOL_SHORTCUTS.map((t) => {
     const Icon = t.icon;
     return (
      <li key={t.to}>
       <Link
        to={t.to}
        onClick={() => trackClick("knowledge_tool_clicked", { to: t.to })}
        className="flex h-full items-center gap-2 rounded border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
       >
        <Icon className="w-4 h-4 shrink-0 text-[hsl(var(--signature))]" aria-hidden="true" />
        {t.label}
       </Link>
      </li>
     );
    })}
   </ul>
  </div>
 </section>

 {/* Hela kunskapsbiblioteket */}
 <div ref={libraryRef} className="scroll-mt-32" />
 <section className="bg-background" aria-labelledby="kc-library-heading">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-4">
   <h2 id="kc-library-heading" className="text-xl md:text-2xl font-bold text-foreground">Hela kunskapsbiblioteket</h2>
   <p className="text-sm text-muted-foreground mt-1 mb-4">
    Filtrera på innehållstyp, produkt, ämne och bransch, eller utforska ett ämne på djupet.
   </p>
   <div className="flex flex-wrap gap-2">
    {[
     { slug: "business-central", label: "Business Central" },
     { slug: "dynamics-365-tillagg", label: "Dynamics 365-tillägg (ISV)" },
     { slug: "finance-supply-chain", label: "Finance & Supply Chain Management (F&O)" },
     { slug: "sales", label: "Sales & CRM" },
     { slug: "customer-service", label: "Kundservice & Field Service" },
     { slug: "copilot", label: "Copilot & AI" },
     { slug: "partners", label: "Partnerval" },
    ].map((hub) => (
     <Link
      key={hub.slug}
      to={`/kunskapscenter/${hub.slug}/`}
      className="px-3 py-1.5 rounded text-xs font-medium border border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
     >
      {hub.label}
     </Link>
    ))}
   </div>
  </div>
 </section>



 {/* Filters */}
 <section className="border-b border-border sticky top-16 z-40 bg-background/95 supports-[backdrop-filter]:bg-background/60 ">
 <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-3">
 <div className="flex flex-wrap items-center gap-3">
 {/* Category pills */}
 <div className="flex flex-wrap gap-2">
 {CATEGORIES.map((cat) => (
 <button
 key={cat.value}
 onClick={() => setActiveCategory(cat.value)}
 className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 border ${
 activeCategory === cat.value
 ? "bg-primary text-primary-foreground border-primary shadow-primary/25 scale-[1.02]"
 : "bg-card text-foreground border-border hover:border-primary/50 hover:scale-[1.01]"
 }`}
 >
 {cat.label}
 </button>
 ))}
 </div>

 {/* Spacer */}
 <div className="hidden lg:block w-px h-8 bg-border mx-1" />

 {/* Dropdown filters */}
 <div className="flex flex-wrap gap-2">
 <MultiSelectDropdown<FormatValue>
 label="Format"
 options={FORMAT_OPTIONS}
 selected={selectedFormats}
 onChange={setSelectedFormats}
 />
 <MultiSelectDropdown<ProductValue>
 label="Produkt"
 options={PRODUCT_OPTIONS.map(p => ({ label: applicationFilterLabel(p), value: p }))}
 selected={selectedProducts}
 onChange={setSelectedProducts}
 />
 <MultiSelectDropdown<KnowledgeTopic>
 label="Ämne"
 options={TOPIC_OPTIONS}
 selected={selectedTopics}
 onChange={setSelectedTopics}
 />
 <MultiSelectDropdown<string>
 label="Bransch"
 options={INDUSTRY_OPTIONS}
 selected={selectedIndustries}
 onChange={setSelectedIndustries}
 />
 </div>
 {activeEntryDef && (
  <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs">
   Ingång: <strong>{activeEntryDef.title}</strong>
   <button type="button" onClick={showAll} className="text-primary hover:underline">Visa allt</button>
  </span>
 )}

 {/* Clear */}
 {hasActiveFilters && (
 <button
 onClick={clearAllFilters}
 className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
 >
 Rensa filter
 </button>
 )}
 </div>
 </div>
 </section>

 {/* Product sub-nav for Produktfördjupningar */}
 {activeCategory === "fordjupning" && (() => {
 const products = [...new Set(ALL_DEEP_DIVE_ARTICLES.map((a) => a.product))];
 return (
 <section className="border-b border-border bg-muted/30">
 <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-2.5 space-y-2.5">
 {/* View toggle: Artiklar / Prislista */}
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-xs uppercase tracking-wider text-[hsl(var(--signature))] mr-1">
 Visa:
 </span>
 <button
 onClick={() => setDeepDiveView("articles")}
 className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 border ${
 deepDiveView === "articles"
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-card text-foreground border-border hover:border-primary/50"
 }`}
 >
 Artiklar
 </button>
 <button
 onClick={() => setDeepDiveView("prices")}
 className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 border ${
 deepDiveView === "prices"
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-card text-foreground border-border hover:border-primary/50"
 }`}
 >
 Prislista
 </button>
 </div>

 {/* Product filter */}
 <div className="flex flex-wrap items-center gap-2">
 <button
 onClick={() => setDeepDiveProduct(null)}
 className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 border ${
 deepDiveProduct === null
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-card text-foreground border-border hover:border-primary/50"
 }`}
 >
 Alla produkter
 </button>
 {products.map((product) => (
 <button
 key={product}
 onClick={() => setDeepDiveProduct(product)}
 className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 border ${
 deepDiveProduct === product
 ? "bg-primary text-primary-foreground border-primary "
 : "bg-card text-foreground border-border hover:border-primary/50"
  }`}
  >
  {applicationFilterLabel(product)}
  </button>
  ))}
 </div>
 </div>
 </section>
 );
 })()}

 {/* Deep-dive section (when Fördjupning tab is active) */}
 {activeCategory === "fordjupning" ? (
 <section className="py-12">
 <div className="container mx-auto max-w-6xl px-4 sm:px-6">
 {deepDiveView === "prices" ? (
 <PriceListSection product={deepDiveProduct} />
 ) : (() => {
 const productColor = (product: string) => {
 switch (product) {
 case "Business Central":
 return { bg: "bg-business-central/10", text: "text-business-central", border: "border-business-central/30", icon: "text-business-central" };
 case "Finance & Supply Chain":
 return { bg: "bg-finance-supply/10", text: "text-finance-supply", border: "border-finance-supply/30", icon: "text-finance-supply" };
 case "Sales":
 return { bg: "bg-sales/10", text: "text-sales", border: "border-sales/30", icon: "text-sales" };
 case "Customer Service":
 return { bg: "bg-customer-service/10", text: "text-customer-service", border: "border-customer-service/30", icon: "text-customer-service" };
 case "Field Service":
 return { bg: "bg-field-service/10", text: "text-field-service", border: "border-field-service/30", icon: "text-field-service" };
 case "Contact Center":
 return { bg: "bg-contact-center/10", text: "text-contact-center", border: "border-contact-center/30", icon: "text-contact-center" };
 case "Customer Insights":
 return { bg: "bg-marketing/10", text: "text-marketing", border: "border-marketing/30", icon: "text-marketing" };
 default:
 return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", icon: "text-primary" };
 }
 };
 const allProducts = [...new Set(ALL_DEEP_DIVE_ARTICLES.map((a) => a.product))];
 const productsToShow = deepDiveProduct ? [deepDiveProduct] : allProducts;
 return productsToShow.map((product) => {
 const articles = ALL_DEEP_DIVE_ARTICLES.filter((a) => a.product === product);
 return (
 <div key={product} className="mb-12">
 <div className="flex items-center gap-3 mb-6">
 <BookOpen className={`w-5 h-5 ${productColor(product).icon}`} />
 <h3 className="text-xl font-bold text-foreground">{product}</h3>
 <span className="text-sm text-muted-foreground">({articles.length} artiklar)</span>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
 {articles.map((article) => (
 <Link
 key={article.slug}
 to={`/kunskapscenter/${article.productSlug}/${article.slug}/`}
 className={`group block rounded border overflow-hidden hover:-translate-y-0.5 transition-all duration-200 ${productColor(product).border}`}
 >
 <div className={`px-4 py-3 ${productColor(product).bg}`}>
 <p className={`text-sm font-semibold leading-snug ${productColor(product).text}`}>
 {article.headerLabel || article.title}
 </p>
 </div>
 <div className="px-4 py-3 bg-card">
 <p className="text-xs text-muted-foreground line-clamp-2">
 {article.description}
 </p>
 </div>
 </Link>
 ))}
 </div>
 </div>
 );
 });
 })()}
 </div>
 </section>
 ) : (
 <>
 {/* Content Grid */}
 <section className="py-12">
 <div className="container mx-auto max-w-6xl px-4 sm:px-6">
 <div className="flex items-center justify-between mb-6">
 <p className="text-sm text-muted-foreground">
 {filteredItems.length} {filteredItems.length === 1 ? "resurs" : "resurser"}
 {loading && (
 <span className="ml-2 text-xs opacity-70 animate-pulse">
 (uppdaterar events &amp; artiklar…)
 </span>
 )}
 </p>
 </div>

 {filteredItems.length === 0 ? (
 <div className="text-center py-12">
 <p className="text-muted-foreground text-lg mb-4">
 Inga resurser matchade dina filter.
 </p>
 <button
 onClick={clearAllFilters}
 className="text-primary hover:text-primary/80 underline underline-offset-2 text-sm transition-colors"
 >
 Rensa alla filter
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredItems.map((item) => renderItemCard(item, "library"))}
 </div>
 )}
 </div>
 </section>
 </>
 )}
 {/* d365.se INSIDE – redaktionell sektion; avsnitten finns även i biblioteket som intervjuer */}
 <div className="border-t border-border bg-background">
  <div className="container mx-auto px-4 py-10 max-w-6xl">
   <D365InsideSection maxEarlier={3} />
  </div>
 </div>

 <MicrosoftNewsSection />

 {/* Nästa steg: fördjupning, partner/kompetens eller rådgivning */}
 <section className="border-t border-border bg-muted/30" aria-labelledby="kc-next-heading">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
   <h2 id="kc-next-heading" className="text-xl md:text-2xl font-bold text-foreground">Nästa steg</h2>
   <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-2xl">
    Fördjupa er i behovet, hitta rätt partner eller kompetens, eller ta hjälp när vägvalet är komplext.
   </p>
   <div className="grid gap-4 md:grid-cols-2">
    {[
     {
      title: "Fördjupa beslutsunderlaget",
      text: "Beskriv behovet, räkna på kostnaden och ta fram krav i de befintliga verktygen.",
      links: [
       { label: "Starta behovsguiden", to: "/kom-igang/" },
       { label: "Vad kostar det?", to: "/kostnad/" },
       { label: "Redan Dynamics-kund?", to: "/befintlig-kund/" },
      ],
     },
     {
      title: "Partner och kompetens",
      text: "Jämför partners utifrån bransch och produkt, eller hitta specialistkompetens för ett avgränsat behov.",
      links: [
       { label: "Hitta rätt partner", to: "/valjdynamics365partner/" },
       { label: "Hitta kompetens", to: "/kompetens/" },
       { label: "Utvärdera nuvarande partner", to: "/guider/byta-dynamics-partner/" },
      ],
     },
    ].map((card) => (
     <div key={card.title} className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{card.text}</p>
      <ul className="mt-3 space-y-1.5 text-sm">
       {card.links.map((l) => (
        <li key={l.to}>
         <Link to={l.to} onClick={() => trackClick("knowledge_next_step_clicked", { to: l.to })} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          {l.label} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
         </Link>
        </li>
       ))}
      </ul>
     </div>
    ))}
   </div>
   <AdvisoryOffer
    variant="compact"
    placement="next_step_help"
    cta="Prata med d365.se"
    pageType="kunskapscenter"
    text="Står ni inför ett komplext vägval mellan lösningar, partners eller nästa steg i ett befintligt projekt?"
    metadata={{ entry: activeEntry }}
    className="mt-6"
   />
  </div>
 </section>
</main>
 <Footer />
 </>
 );
};

export default Kunskapscenter;
