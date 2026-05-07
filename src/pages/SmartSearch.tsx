import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, Search, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SearchResult {
  primary: { path: string; label: string; reason: string };
  alternatives: { path: string; label: string }[];
  answer: string;
}

const EXAMPLES = [
  "Vi är ett tillverkande bolag och behöver bättre koll på lager",
  "Vilken CRM passar för 30 säljare?",
  "Hur kommer jag igång med Copilot?",
  "Hitta partner inom fastighet",
  "Skillnad mellan Business Central och Finance & SCM",
];

export default function SmartSearch() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const runSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    setParams({ q });
    const { data, error } = await supabase.functions.invoke("smart-search", { body: { query: q } });
    setLoading(false);
    if (error || (data as any)?.error) {
      toast({ title: "Sökfel", description: (data as any)?.error || error?.message || "Försök igen", variant: "destructive" });
      return;
    }
    setResult(data as SearchResult);
  };

  useEffect(() => {
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI-sök – hitta rätt på d365.se</title>
        <meta name="description" content="Beskriv ditt behov i naturligt språk så hjälper vår AI dig att hitta rätt sida, produkt eller partner inom Microsoft Dynamics 365." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" /> AI-driven sökning
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Vad letar du efter?</h1>
          <p className="text-muted-foreground">Beskriv ditt behov i fri text – AI:n hittar rätt sida, produkt eller partner åt dig.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
          className="flex gap-2 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="T.ex. Vi behöver hjälp med vår kundservice..."
              className="pl-10 h-12"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={loading} className="h-12 px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sök"}
          </Button>
        </form>

        {!result && !loading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">Exempel:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); runSearch(ex); }}
                  className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-accent hover:border-primary/40 transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <Card className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">AI:n analyserar din fråga...</p>
          </Card>
        )}

        {result && (
          <div className="space-y-4">
            <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-foreground leading-relaxed">{result.answer}</p>
              </div>
              <Link
                to={result.primary.path}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
              >
                {result.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {result.primary.reason && (
                <p className="text-xs text-muted-foreground mt-2">{result.primary.reason}</p>
              )}
            </Card>

            {result.alternatives?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Andra relevanta sidor:</p>
                <div className="grid gap-2">
                  {result.alternatives.map((alt) => (
                    <Link
                      key={alt.path}
                      to={alt.path}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition"
                    >
                      <span className="text-sm">{alt.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
