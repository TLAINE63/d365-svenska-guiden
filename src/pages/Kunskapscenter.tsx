import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import kunskapscenterHero from "@/assets/kunskapscenter-hero.jpg";
import kravspecErpImage from "@/assets/kravspec-erp-card.jpg";
import eventCardBg from "@/assets/event-card-bg.jpg";
import kravspecSalesImage from "@/assets/kravspec-sales-card.jpg";
import kravspecMarketingImage from "@/assets/kravspec-marketing-card.jpg";
import kravspecKundserviceImage from "@/assets/kravspec-kundservice-card.jpg";
import behovsErpImage from "@/assets/behovsanalys-erp-card.jpg";
import behovsSaljImage from "@/assets/behovsanalys-salj-card.jpg";
import behovsKundserviceImage from "@/assets/behovsanalys-kundservice-card.jpg";
import behovsAiImage from "@/assets/behovsanalys-ai-card.jpg";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

// ── Types ──────────────────────────────────────────────

type CategoryFilter = "alla" | "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video";

type FormatValue = "event" | "behovsanalys" | "kravspecifikation" | "artikel" | "guide" | "video";

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
}

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
    url: "/behovsanalys",
    image_url: behovsErpImage,
    icon: Wrench,
    products: ["Business Central", "Finance & SCM"],
  },
  {
    id: "tool-behovsanalys-salj",
    title: "Behovsanalys Sälj & Marknad (CRM)",
    description: "Analysera dina behov inom sälj och marknad för att hitta rätt CRM-lösning.",
    type: "behovsanalys",
    url: "/salj-marknad-behovsanalys",
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
];

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: "Alla", value: "alla" },
  { label: "Events", value: "event" },
  { label: "Guider & Behovsanalyser", value: "behovsanalys" },
  { label: "Kravspecifikationer", value: "kravspecifikation" },
  { label: "Artiklar", value: "artikel" },
  { label: "Videor", value: "video" },
];

const FORMAT_OPTIONS: { label: string; value: FormatValue }[] = [
  { label: "Event", value: "event" },
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
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          selected.length > 0
            ? "bg-primary text-primary-foreground border-primary shadow-md"
            : "bg-slate-700 text-white border-slate-600 hover:bg-slate-600 hover:border-slate-500"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-primary-foreground/20 text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-bold leading-none">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-[200px] rounded-xl border border-border bg-card shadow-xl overflow-hidden">
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
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("alla");
  const [selectedFormats, setSelectedFormats] = useState<FormatValue[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductValue[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          const upcoming = (result.events || [])
            .filter((e: EventItem) => new Date(e.event_date) >= now)
            .sort(
              (a: EventItem, b: EventItem) =>
                new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
            );
          setEvents(upcoming);
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
      year: "numeric",
    });

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
      isExternal: false,
      icon: t.icon,
      products: t.products as string[],
    })),
    ...articles.map((a) => ({
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
  const filteredItems = allItems.filter((item) => {
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

  const categoryBadgeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-primary text-primary-foreground border-primary";
      case "behovsanalys":
        return "bg-teal-600 text-white border-teal-600";
      case "kravspecifikation":
        return "bg-indigo-600 text-white border-indigo-600";
      case "artikel":
        return "bg-slate-600 text-white border-slate-600";
      case "guide":
        return "bg-teal-600 text-white border-teal-600";
      case "video":
        return "bg-rose-600 text-white border-rose-600";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const categoryLabel = (type: string) => {
    switch (type) {
      case "event": return "Event";
      case "behovsanalys": return "Guide & Behovsanalys";
      case "kravspecifikation": return "Kravspecifikation";
      
      case "artikel": return "Artikel";
      case "guide": return "Guide & Behovsanalys";
      case "video": return "Video";
      default: return type;
    }
  };

  const hasActiveFilters = selectedFormats.length > 0 || selectedProducts.length > 0;

  const clearAllFilters = () => {
    setActiveCategory("alla");
    setSelectedFormats([]);
    setSelectedProducts([]);
  };

  return (
    <>
      <SEOHead
        title="Kunskapscenter | d365.se – Guider, verktyg och events för Microsoft Dynamics 365"
        description="Utforska artiklar, videor, behovsanalyser, kravspecifikationer och kommande events – allt du behöver för att fatta rätt beslut om Microsoft Dynamics 365."
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Kunskapscenter", url: "https://d365.se/kunskapscenter" },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
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
              Kunskapscenter
            </h1>
            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
              Allt vi vet om Microsoft Dynamics 365 – behovsanalyser, kravspecifikationer,
              guider och kommande events. Samlat på ett ställe, utan formulär.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                      activeCategory === cat.value
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.02]"
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]"
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

        {/* Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? "resurs" : "resurser"}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16 text-muted-foreground animate-pulse">
                Laddar innehåll...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
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
                      <Card className="h-full overflow-hidden border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        {item.image_url ? (
                          <div className="aspect-[2/1] overflow-hidden bg-muted relative">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {item.type === "event" && (
                              <>
                                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase">
                                  Event
                                </span>
                                {item.partnerLogoUrl && (
                                  <div className="absolute bottom-2 right-2 bg-white rounded-md shadow-md p-1.5">
                                    <img
                                      src={item.partnerLogoUrl}
                                      alt={item.partner || "Partner"}
                                      className="h-6 w-auto max-w-[80px] object-contain"
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-[2/1] overflow-hidden bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                            <item.icon className="w-12 h-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <CardContent className="p-5 flex flex-col gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`text-xs ${categoryBadgeColor(item.type)}`}
                            >
                              {categoryLabel(item.type)}
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
                                  Läs mer <ArrowRight className="w-3 h-3" />
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
      </main>
      <Footer />
    </>
  );
};

export default Kunskapscenter;
