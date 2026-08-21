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

import { Badge } from "@/components/ui/badge";
import ProductQASection from "@/components/ProductQASection";
import { PRODUCT_QA_DATA } from "@/data/productQA";
import { ALL_DEEP_DIVE_ARTICLES } from "@/data/bcArticles";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import PriceListSection from "@/components/PriceListSection";
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
} from "lucide-react";

// ── Types ──────────────────────────────────────────────

type CategoryFilter = "alla" | "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video" | "fordjupning" | "branscher";

type FormatValue = "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video" | "branscher";

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
 description: "Kartlägg dina behov för ett nytt affärssystem och få en AI-driven analys med rekommendationer.",
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
 description: "Utvärdera dina servicebehov och få matchning mot rätt Dynamics 365-lösning.",
 type: "behovsanalys",
 url: "/kundservice-behovsanalys",
 image_url: behovsKundserviceImage,
 icon: Wrench,
 products: ["Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "tool-ai-readiness",
 title: "AI Readiness Assessment",
 description: "Testa din organisations mognad för AI och Copilot – få konkreta rekommendationer.",
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
 title: "Branschjämförelse: BC vs Finance & SCM",
 description: "Jämför Business Central och Finance & Supply Chain Management utifrån bransch, storlek och geografi.",
 type: "guide",
 url: "/erp/#branschjamforelse",
 image_url: branschjamforelseImage,
 icon: Wrench,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "tool-kravspec-erp",
 title: "Kravspecifikation ERP",
 description: "Skapa en skräddarsydd kravspecifikation för ditt ERP-projekt.",
 type: "kravspecifikation",
 url: "/kravspecifikation",
 image_url: kravspecErpImage,
 icon: FileText,
 products: ["Business Central", "Finance & SCM"],
 },
 {
 id: "tool-kravspec-sales",
 title: "Kravspecifikation Sälj",
 description: "Generera en kravspecifikation anpassad för din säljavdelning.",
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
 description: "Generera en detaljerad kravspecifikation för kundserviceavdelningen.",
 type: "kravspecifikation",
 url: "/kravspecifikation-kundservice",
 image_url: kravspecKundserviceImage,
 icon: FileText,
 products: ["Customer Service", "Field Service", "Contact Center"],
 },
 {
 id: "tool-guide-valj-partner",
 title: "Så väljer du rätt Dynamics 365-partner",
 description: "En komplett guide med checklistor och tips för att utvärdera och välja rätt implementeringspartner.",
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
 id: "tool-upphandlingsresan",
 title: "Den typiska upphandlingsresan – 7 stadier",
 description: "Var i systemlivscykeln står du? Upptäck de sju stadierna i en typisk upphandlingsresa för ERP och CRM.",
 type: "guide",
 url: "/kunskapscenter/upphandlingsresan",
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
 description: "Kort film om vikten av att förstå att alla Dynamics 365-partners skiljer sig åt – och varför rätt val av partner är avgörande.",
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
];

const FORMAT_OPTIONS: { label: string; value: FormatValue }[] = [
 { label: "Event", value: "event" },
 { label: "Branscher & Partners", value: "branscher" },
 { label: "Guide & Behovsanalys", value: "behovsanalys" },
 { label: "Kravspecifikation", value: "kravspecifikation" },
 { label: "Artikel", value: "artikel" },
 { label: "Video", value: "video" },
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

// ── Innehållsspår (curated tracks) ─────────────────────
// Sex tydliga spår genom kunskapscentret. Varje spår plockar ut en kuraterad
// delmängd av allItems via ett predikat. Användaren klickar ett spårkort för
// att filtrera grid:en; klick igen avmarkerar.

type TrackValue =
 | "tidig-fas"
 | "erp-val"
 | "crm-val"
 | "ai"
 | "kravspec"
 | "partnerurval";

interface TrackDef {
 value: TrackValue;
 title: string;
 description: string;
 icon: typeof Compass;
 // Predikat appliceras mot UnifiedItem
 match: (item: UnifiedItem) => boolean;
}

const CRM_PRODUCTS = new Set<string>([
 "Sales",
 "Customer Insights",
 "Customer Service",
 "Field Service",
 "Contact Center",
]);

const TRACKS: TrackDef[] = [
 {
  value: "tidig-fas",
  title: "Tidig fas",
  description:
   "Var står du? Filmer, beslutsmognad, upphandlingsresan och branschorientering – innan du låser scopet.",
  icon: Compass,
  match: (i) =>
   i.type === "video" ||
   i.type === "branscher" ||
   i.id === "tool-upphandlingsresan" ||
   (i.url?.includes("/beslutsmognad") ?? false),
 },
 {
  value: "erp-val",
  title: "ERP-val",
  description:
   "Behovsanalys, kravspec och branschjämförelse för Business Central och Finance & Supply Chain Management.",
  icon: Database,
  match: (i) => {
   if (
    ["tool-behovsanalys-erp", "tool-kravspec-erp", "tool-branschjamforelse"].includes(i.id)
   )
    return true;
   if (
    i.products.length > 0 &&
    i.products.length <= 4 &&
    i.products.some((p) => p === "Business Central" || p === "Finance & SCM") &&
    !i.products.some((p) => CRM_PRODUCTS.has(p))
   )
    return true;
   return false;
  },
 },
 {
  value: "crm-val",
  title: "CRM-val (Sälj, Marknad, Service)",
  description:
   "Behovsanalyser och kravspec för Sales, Customer Insights, Customer Service, Field Service och Contact Center.",
  icon: Users,
  match: (i) => {
   if (
    [
     "tool-behovsanalys-salj",
     "tool-behovsanalys-kundservice",
     "tool-kravspec-sales",
     "tool-kravspec-marketing",
     "tool-kravspec-kundservice",
    ].includes(i.id)
   )
    return true;
   if (
    i.products.length > 0 &&
    i.products.length <= 5 &&
    i.products.some((p) => CRM_PRODUCTS.has(p)) &&
    !i.products.includes("Business Central") &&
    !i.products.includes("Finance & SCM")
   )
    return true;
   return false;
  },
 },
 {
  value: "ai",
  title: "AI, Copilot & Agenter",
  description:
   "AI Readiness, Copilot-fördjupningar och agenter – från första piloten till hela organisationen.",
  icon: Sparkles,
  match: (i) =>
   i.id === "tool-ai-readiness" ||
   i.products.includes("AI/Copilot/Agents") &&
    (i.products.length <= 3 ||
     (i.url?.includes("/copilot") ?? false) ||
     (i.url?.includes("/agents") ?? false) ||
     (i.url?.includes("/ai-") ?? false)),
 },
 {
  value: "kravspec",
  title: "Kravspecifikation",
  description:
   "Skräddarsydda kravspecar för ERP, sälj, marknad och kundservice – som PDF, redo att skicka till partners.",
  icon: ClipboardList,
  match: (i) => i.type === "kravspecifikation",
 },
 {
  value: "partnerurval",
  title: "Partnerurval",
  description:
   "Guider, e-bok och film om hur du utvärderar och väljer rätt Microsoft Dynamics 365-partner.",
  icon: Handshake,
  match: (i) =>
   ["tool-guide-valj-partner", "tool-ebook-partnervalet", "video-partners-skillnader"].includes(
    i.id,
   ) || (i.url?.includes("/valjdynamics365partner") ?? false),
 },
];

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
 const [activeTrack, setActiveTrack] = useState<TrackValue | null>(null);
 const tracksGridRef = useRef<HTMLDivElement>(null);
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
 const [articlesRes, eventsRes] = await Promise.all([
 supabase
 .from("knowledge_articles")
 .select("*")
 .eq("is_published", true)
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
 ]);

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

 const formatDate = (dateStr: string) => {
 const d = new Date(dateStr);
 const y = d.getFullYear();
 const m = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${y}/${m}/${day}`;
 };

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
 type: (b.category === "Branschguide" ? "branscher" : "artikel") as FormatValue,
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
 type: (a.format || a.category) as FormatValue,
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
 ];

 // Apply filters
 const activeTrackDef = activeTrack ? TRACKS.find((t) => t.value === activeTrack) ?? null : null;
 const filteredItems = allItems.filter((item) => {
  // Innehållsspår (kuraterad delmängd)
  if (activeTrackDef && !activeTrackDef.match(item)) return false;
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
 });

 const trackCounts: Record<TrackValue, number> = TRACKS.reduce(
  (acc, t) => {
   acc[t.value] = allItems.filter(t.match).length;
   return acc;
  },
  {} as Record<TrackValue, number>,
 );

 const selectTrack = (value: TrackValue) => {
  const next = activeTrack === value ? null : value;
  setActiveTrack(next);
  if (next) {
   setActiveCategory("alla");
   setSelectedFormats([]);
   setSelectedProducts([]);
   // Scroll to grid after state update
   setTimeout(() => {
    tracksGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
   }, 50);
  }
 };


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
 default: return type;
 }
 };

 const hasActiveFilters =
  selectedFormats.length > 0 || selectedProducts.length > 0 || activeTrack !== null;

 const clearAllFilters = () => {
  setActiveCategory("alla");
  setSelectedFormats([]);
  setSelectedProducts([]);
  setActiveTrack(null);
 };

 return (
 <>
 <SEOHead
 title="Kunskapscenter – Microsoft Dynamics 365-guider"
 description="Artiklar, videor, behovsanalyser, kravspecar och events för beslut om Microsoft Dynamics 365. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
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
 <div className="container mx-auto px-4 max-w-4xl relative z-10">
 <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">
 Förstå Dynamics 365 – innan partnerdialogen börjar
 </h1>
 <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
 Guider, analyser, behovsanalyser och kravspecifikationer för ledning, IT, ekonomi, sälj och verksamhetsansvariga som vill gå in i en partnerdialog med ett genomtänkt underlag.
 </p>
 </div>
 </section>

 {/* Innehållsspår – kuraterade tracks genom kunskapscentret */}
 <section className="border-b border-border bg-[hsl(var(--bg-card))]">
  <div className="container mx-auto px-4 py-8">
   <div className="flex items-baseline justify-between gap-4 mb-4">
    <div>
     <h2 className="text-sm font-semibold text-[hsl(var(--signature))] uppercase tracking-wider">
      Innehållsspår
     </h2>
     <p className="text-sm text-muted-foreground mt-1">
      Sex tydliga vägar genom materialet. Välj det spår som matchar var du står just nu.
     </p>
    </div>
    {activeTrack && (
     <button
      onClick={() => setActiveTrack(null)}
      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 underline underline-offset-2 shrink-0"
     >
      <X className="w-3.5 h-3.5" />
      Avmarkera spår
     </button>
    )}
   </div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {TRACKS.map((track) => {
     const Icon = track.icon;
     const isActive = activeTrack === track.value;
     const count = trackCounts[track.value] ?? 0;
     return (
      <button
       key={track.value}
       onClick={() => selectTrack(track.value)}
       aria-pressed={isActive}
       className={`text-left p-4 rounded border transition-all duration-200 ${
        isActive
         ? "bg-primary/10 border-primary ring-1 ring-primary"
         : "bg-card border-border hover:border-primary/50 hover:-translate-y-0.5"
       }`}
      >
       <div className="flex items-start gap-3">
        <span
         className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded border ${
          isActive
           ? "bg-primary text-primary-foreground border-primary"
           : "bg-muted/40 text-[hsl(var(--signature))] border-border"
         }`}
        >
         <Icon className="w-4.5 h-4.5" />
        </span>
        <div className="min-w-0">
         <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground">{track.title}</h3>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
           {count}
          </span>
         </div>
         <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {track.description}
         </p>
        </div>
       </div>
      </button>
     );
    })}
   </div>
  </div>
 </section>

 <div ref={tracksGridRef} />

 {/* Topical hubs – crawl-friendly internal links */}
 <section className="border-b border-border bg-muted/30">
  <div className="container mx-auto px-4 py-6">
   <h2 className="text-sm font-semibold text-[hsl(var(--signature))] uppercase tracking-wider mb-3">
    Utforska efter ämne
   </h2>
 <div className="flex flex-wrap gap-2">
 {[
  { slug: "business-central", label: "Business Central" },
  { slug: "dynamics-365-tillagg", label: "Dynamics 365-tillägg (ISV)" },
  { slug: "finance-supply-chain", label: "Finance & Supply Chain" },
  { slug: "sales", label: "Sales & CRM" },
  { slug: "customer-service", label: "Kundservice & Field Service" },
  { slug: "copilot", label: "Copilot & AI" },
  { slug: "upphandling", label: "Upphandling" },
  { slug: "partners", label: "Partnerval" },
 ].map((hub) => (
 <Link
 key={hub.slug}
 to={`/kunskapscenter/${hub.slug}/`}
 className="px-3 py-1.5 rounded text-sm font-medium border border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
 >
 {hub.label}
 </Link>
 ))}
 </div>
 </div>
 </section>


 {/* Filters */}
 <section className="border-b border-border sticky top-16 z-40 bg-background/95 supports-[backdrop-filter]:bg-background/60 ">
 <div className="container mx-auto px-4 py-3">
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
 <div className="flex gap-2">
 <MultiSelectDropdown<FormatValue>
 label="Format"
 options={FORMAT_OPTIONS}
 selected={selectedFormats}
 onChange={setSelectedFormats}
 />
 <MultiSelectDropdown<ProductValue>
 label="Produkt"
 options={PRODUCT_OPTIONS.map(p => ({ label: p, value: p }))}
 selected={selectedProducts}
 onChange={setSelectedProducts}
 />
 </div>

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
 <div className="container mx-auto px-4 py-2.5 space-y-2.5">
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
 {product}
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
 <div className="container mx-auto px-4">
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
 <h2 className="text-xl font-bold text-foreground">{product}</h2>
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
 <div className="container mx-auto px-4">
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
 {filteredItems.map((item) => {
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
 {product}
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
 })}
 </div>
 )}
 </div>
 </section>
 </>
 )}
 </main>
 <Footer />
 </>
 );
};

export default Kunskapscenter;
