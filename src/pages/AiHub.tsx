import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, Brain, Calculator, Newspaper, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, WebPageSchema } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import { AGENTS_ARTICLES } from "@/data/agentsArticles";

/** Samlande ingång till befintligt AI-innehåll. Inga egna artiklar, bara länkar till publicerat innehåll. */
const AI_RE = /\b(ai|copilot|agent|agenter|ignite|build)\b/i;
const FEATURED_RE = /ignite|flyttar in i copilot/i;

type Item = { title: string; summary: string; to: string; date: string };

const staticArticles: Item[] = BLOG_ARTICLES
  .filter((a) => AI_RE.test(`${a.slug.replace(/-/g, " ")} ${a.title} ${(a.tags || []).join(" ")}`))
  .map((a) => ({ title: a.title, summary: a.summary, to: `/artiklar/${a.slug}/`, date: a.publishedAt }));

function useEditorAiArticles() {
  return useQuery({
    queryKey: ["ai-hub-editor-articles"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Item[]> => {
      const { data, error } = await supabase
        .from("knowledge_articles")
        .select("slug,title,description,tags,published_at")
        .eq("is_published", true)
        .eq("content_type", "artikel")
        .not("body_html", "is", null)
        .order("published_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || [])
        .filter((r) => AI_RE.test(`${r.slug?.replace(/-/g, " ")} ${r.title} ${(r.tags || []).join(" ")}`))
        .map((r) => ({ title: r.title, summary: r.description || "", to: `/artiklar/${r.slug}/`, date: r.published_at || "" }));
    },
  });
}

const SECTIONS = [
  { id: "forsta", icon: Brain, title: "Förstå AI och agenter", text: "Vad Copilot och agenter är, och hur de skiljer sig åt.", links: [
    { to: "/aioversikt/", label: "AI-översikt per roll" }, { to: "/copilot/", label: "Copilot i Dynamics\u00A0365" }, { to: "/agents/", label: "Agenter i Dynamics\u00A0365" } ] },
  { id: "omraden", icon: Sparkles, title: "AI inom olika verksamhetsområden", text: "Så används AI i ekonomi, sälj, service och supply chain.", links: [
    { to: "/finance-supply-chain/", label: "Finance & Supply Chain" }, { to: "/businesscentral/", label: "Business Central" }, { to: "/d365sales/", label: "Sales" }, { to: "/d365customerservice/", label: "Customer Service" } ] },
  { id: "kostnad", icon: Calculator, title: "Kostnader och affärsnytta", text: "Räkna på nyttan innan ni investerar.", links: [
    { to: "/verksamhetsvardering/", label: "Affärsnytta & ROI" }, { to: "/ai-readiness/", label: "AI-mognadsanalys" }, { to: "/kostnad/", label: "Vad kostar Dynamics\u00A0365?" } ] },
  { id: "exempel", icon: Bot, title: "Konkreta agentexempel", text: "Verifierade exempel med källa från Microsoft.", links: [
    { to: "/ai/exempel/", label: "AI-exempelbiblioteket" }, ...AGENTS_ARTICLES.slice(0, 3).map((a) => ({ to: `/kunskapscenter/${a.productSlug}/${a.slug}/`, label: a.title })) ] },
  { id: "kompetens", icon: Users, title: "Hitta rätt AI-kompetens", text: "Filtrera partners på bedömd Copilot- och agentkompetens.", links: [
    { to: "/valjdynamics365partner/#hitta-partners", label: "Partnerväljaren" }, { to: "/kompetens/", label: "Dynamics\u00A0365-kompetens" } ] },
];

const AiHub = () => {
  const { data: editorItems = [] } = useEditorAiArticles();
  const seen = new Set<string>();
  const all = [...editorItems, ...staticArticles].filter((i) => (seen.has(i.to) ? false : (seen.add(i.to), true)))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  // Ignite-analysen när den är publicerad, annars senaste befintliga AI-artikel.
  const featured = all.find((i) => FEATURED_RE.test(`${i.title} ${i.to}`)) ?? all[0] ?? null;
  const rest = all.filter((i) => i !== featured).slice(0, 6);

  return (
    <>
      <SEOHead title="AI och agenter i Dynamics 365 – guide och artiklar" description="Samlad ingång till AI, Copilot och agenter i Microsoft Dynamics 365: aktuella analyser, exempel, kostnader och partners med AI-kompetens." canonicalPath="/ai/" />
      <WebPageSchema name="AI och agenter i Dynamics 365" description="Samlad ingång till AI och agenter i Dynamics 365." url="https://d365.se/ai/" />
      <BreadcrumbSchema items={[{ name: "Hem", url: "https://d365.se" }, { name: "AI & Agenter", url: "https://d365.se/ai/" }]} />
      <Navbar />
      <main className="pt-28 lg:pt-36 pb-12">
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 mb-12">
          <p className="text-sm font-semibold text-accent mb-2">AI & Agenter</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Vad betyder AI och agenter i Dynamics&nbsp;365 för er?</h1>
          <p className="max-w-3xl text-muted-foreground">Här samlar vi våra svenska analyser av Microsofts AI-nyheter, förklaringar av Copilot och agenter, konkreta exempel och vägar vidare till kostnader och partners.</p>
        </section>

        <section id="aktuellt" className="container mx-auto max-w-6xl px-4 sm:px-6 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Newspaper className="h-6 w-6 text-accent" />Aktuellt och redaktionella artiklar</h2>
          {featured && (
            <Link to={featured.to} className="block mb-6 group">
              <Card className="border-primary/40 bg-card transition-transform group-hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Huvudnyhet</p>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{featured.title}</h3>
                  {featured.summary && <p className="text-muted-foreground mb-3">{featured.summary}</p>}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Läs vår analys<ArrowRight className="h-4 w-4" /></span>
                </CardContent>
              </Card>
            </Link>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((i) => (
              <Link key={i.to} to={i.to} className="group">
                <Card className="h-full transition-transform group-hover:-translate-y-1">
                  <CardContent className="p-5">
                    {i.date && <p className="text-xs text-muted-foreground mb-1">{i.date.slice(0, 10)}</p>}
                    <h3 className="font-semibold mb-2">{i.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{i.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 sm:px-6 grid gap-6 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <Card key={s.id} id={s.id}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><s.icon className="h-5 w-5 text-accent" />{s.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{s.text}</p>
                <ul className="space-y-2">
                  {s.links.map((l) => (
                    <li key={l.to}><Link to={l.to} className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"><ArrowRight className="h-3.5 w-3.5" />{l.label}</Link></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AiHub;
