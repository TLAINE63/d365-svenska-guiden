import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ExternalLink,
  FileText,
  Play,
  Wrench,
  CalendarDays,
  BookOpen,
  ArrowRight,
} from "lucide-react";

type CategoryFilter = "alla" | "events" | "verktyg" | "artikel" | "video";

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content_type: string;
  url: string | null;
  image_url: string | null;
  published_at: string | null;
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
  partners: { name: string; slug: string } | null;
}

const STATIC_TOOLS = [
  {
    id: "tool-behovsanalys-erp",
    title: "Behovsanalys ERP (Affärssystem)",
    description: "Kartlägg dina behov för ett nytt affärssystem och få en AI-driven analys med rekommendationer.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/behovsanalys",
    image_url: null,
    icon: Wrench,
  },
  {
    id: "tool-behovsanalys-salj",
    title: "Behovsanalys Sälj & Marknad (CRM)",
    description: "Analysera dina behov inom sälj och marknad för att hitta rätt CRM-lösning.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/salj-marknad-behovsanalys",
    image_url: null,
    icon: Wrench,
  },
  {
    id: "tool-behovsanalys-kundservice",
    title: "Behovsanalys Kundservice & Field Service",
    description: "Utvärdera dina servicebehov och få matchning mot rätt Dynamics 365-lösning.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/kundservice-behovsanalys",
    image_url: null,
    icon: Wrench,
  },
  {
    id: "tool-ai-readiness",
    title: "AI Readiness Assessment",
    description: "Testa din organisations mognad för AI och Copilot – få konkreta rekommendationer.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/ai-readiness",
    image_url: null,
    icon: Wrench,
  },
  {
    id: "tool-kravspec-erp",
    title: "Kravspecifikation ERP",
    description: "Skapa en skräddarsydd kravspecifikation för ditt ERP-projekt.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/kravspecifikation",
    image_url: null,
    icon: FileText,
  },
  {
    id: "tool-kravspec-sales",
    title: "Kravspecifikation Sälj",
    description: "Generera en kravspecifikation anpassad för din säljavdelning.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/kravspecifikation-sales",
    image_url: null,
    icon: FileText,
  },
  {
    id: "tool-kravspec-marketing",
    title: "Kravspecifikation Marknad",
    description: "Skapa en kravspecifikation för din marknadsavdelning.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/kravspecifikation-marketing",
    image_url: null,
    icon: FileText,
  },
  {
    id: "tool-kravspec-kundservice",
    title: "Kravspecifikation Kundservice",
    description: "Generera en detaljerad kravspecifikation för kundserviceavdelningen.",
    category: "verktyg",
    content_type: "verktyg",
    url: "/kravspecifikation-kundservice",
    image_url: null,
    icon: FileText,
  },
];

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: "Alla", value: "alla" },
  { label: "Events", value: "events" },
  { label: "Verktyg & Analyser", value: "verktyg" },
  { label: "Artiklar & Guider", value: "artikel" },
  { label: "Videor", value: "video" },
];

const Kunskapscenter = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("alla");
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

        if (articlesRes.data) setArticles(articlesRes.data);

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Build unified items list
  const allItems = [
    ...events.map((e) => ({
      id: e.id,
      type: "events" as const,
      title: e.title,
      description: e.description,
      url: e.event_link,
      image_url: e.image_url,
      date: e.event_date,
      partner: e.partners?.name || null,
      isExternal: true,
      icon: CalendarDays,
    })),
    ...STATIC_TOOLS.map((t) => ({
      id: t.id,
      type: "verktyg" as const,
      title: t.title,
      description: t.description,
      url: t.url,
      image_url: t.image_url,
      date: null as string | null,
      partner: null as string | null,
      isExternal: false,
      icon: t.icon,
    })),
    ...articles.map((a) => ({
      id: a.id,
      type: a.category as "artikel" | "video",
      title: a.title,
      description: a.description,
      url: a.url,
      image_url: a.image_url,
      date: a.published_at,
      partner: null as string | null,
      isExternal: a.url?.startsWith("http") ?? false,
      icon: a.content_type === "video" ? Play : BookOpen,
    })),
  ];

  const filteredItems =
    activeCategory === "alla"
      ? allItems
      : allItems.filter((item) => item.type === activeCategory);

  const categoryBadgeColor = (type: string) => {
    switch (type) {
      case "events":
        return "bg-primary/10 text-primary border-primary/20";
      case "verktyg":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      case "artikel":
        return "bg-secondary text-secondary-foreground border-border";
      case "video":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const categoryLabel = (type: string) => {
    switch (type) {
      case "events": return "Event";
      case "verktyg": return "Verktyg";
      case "artikel": return "Artikel";
      case "video": return "Video";
      default: return type;
    }
  };

  return (
    <>
      <SEOHead
        title="Kunskapscenter | d365.se – Guider, verktyg och events för Microsoft Dynamics 365"
        description="Utforska artiklar, videor, behovsanalyser, kravspecifikationer och kommande events – allt du behöver för att fatta rätt beslut om Microsoft Dynamics 365."
        url="https://d365.se/kunskapscenter"
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
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Kunskapscenter
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Allt vi vet om Microsoft Dynamics 365 – behovsanalyser, kravspecifikationer,
              guider och kommande events. Samlat på ett ställe, utan formulär.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground animate-pulse">
                Laddar innehåll...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Inget innehåll hittades i denna kategori ännu.
                </p>
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
                        {item.image_url && (
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="p-5 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
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
