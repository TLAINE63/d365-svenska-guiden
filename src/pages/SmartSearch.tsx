import PartnerCtaBlock from "@/components/PartnerCtaBlock";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, MessageCircleQuestion, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type SourceType = "redaktionellt" | "bedomning" | "partner" | "publikt";

interface AnswerSource {
  path: string;
  label: string;
  type: SourceType;
}

interface SearchResult {
  primary: { path: string; label: string; reason: string };
  alternatives: { path: string; label: string }[];
  answer: string;
  sources?: AnswerSource[];
  questionType?: "partner" | "produkt" | "pris" | "komplex";
}

const SOURCE_LABEL: Record<SourceType, string> = {
  redaktionellt: "d365.se:s redaktionella innehåll",
  bedomning: "d365.se:s bedömning (AI-assisterad)",
  partner: "Uppgift från partnern själv",
  publikt: "Publikt identifierad information",
};

const NEXT_STEP: Record<
  NonNullable<SearchResult["questionType"]>,
  { title: string; label: string; to: string }
> = {
  partner: {
    title: "Nästa steg",
    label: "Jämför föreslagna partners",
    to: "/jamfor-partners/",
  },
  produkt: {
    title: "Nästa steg",
    label: "Gör behovsanalysen",
    to: "/ERPbehovsanalys/",
  },
  pris: {
    title: "Nästa steg",
    label: "Skapa en kostnadsuppskattning",
    to: "/kostnad/",
  },
  komplex: {
    title: "Nästa steg",
    label: "Boka köparsidig rådgivning",
    to: "/kontakt/",
  },
};

const EXAMPLES = [
  "Vilka Finance & Supply Chain-partners passar ett svenskt tillverkningsföretag?",
  "Vad kostar en Business Central-implementation?",
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
      toast({ title: "Kunde inte svara", description: (data as any)?.error || error?.message || "Försök igen", variant: "destructive" });
      return;
    }
    setResult(data as SearchResult);
  };

  useEffect(() => {
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextStep = NEXT_STEP[result?.questionType || "komplex"];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Fråga d365.se – få svar om Dynamics 365</title>
        <meta name="description" content="Ställ frågor om Dynamics 365-lösningar, kostnader, partnerval och implementering. Du får ett köparsidigt svar baserat på innehållet och partnerinformationen på d365.se." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://d365.se/fraga/" />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" /> Fråga d365.se
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">Få svar om Dynamics 365</h1>
          <p className="text-muted-foreground">
            Ställ frågor om lösningar, kostnader, partnerval och implementering. Du får ett köparsidigt svar
            baserat på innehållet och partnerinformationen på d365.se.
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
          className="flex gap-2 mb-6"
        >
          <div className="relative flex-1">
            <MessageCircleQuestion className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Exempel: Vilka Finance & Supply Chain-partners passar ett svenskt tillverkningsföretag?"
              className="pl-10 h-12"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={loading} className="h-12 px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Få svar"}
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
                  className="text-sm px-3 py-1.5 rounded border border-border hover:bg-accent hover:border-primary/40 transition text-left"
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
            <p className="text-sm text-muted-foreground">Vi tar fram ett svar...</p>
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
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                AI-assisterat svar baserat på d365.se:s innehåll. Kontrollera alltid affärskritiska uppgifter inför beslut.
              </p>
            </Card>

            {result.sources && result.sources.length > 0 && (
              <Card className="p-5">
                <p className="text-sm font-semibold text-foreground mb-3">Svaret bygger på</p>
                <ul className="space-y-2">
                  {result.sources.map((s) => (
                    <li key={`${s.path}-${s.label}`} className="flex flex-wrap items-center gap-2 text-sm">
                      <Link to={s.path} className="font-medium text-primary hover:underline">
                        {s.label}
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {SOURCE_LABEL[s.type] || SOURCE_LABEL.redaktionellt}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{nextStep.title}</p>
              <Button asChild>
                <Link to={nextStep.to} className="inline-flex items-center gap-2">
                  {nextStep.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
      <PartnerCtaBlock variant="tool" source="/fraga/" />
      <Footer />
    </div>
  );
}
