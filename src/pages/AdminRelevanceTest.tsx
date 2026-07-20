import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { ArrowLeft, Lock, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RelevanceResponse {
  partner: {
    name: string;
    slug: string;
    extendedContentUpdatedAt: string | null;
    extendedContentLength: number;
    extendedContentHasText: boolean;
  };
  query: { raw: string; tokens: string[]; uniqueTokens: string[] };
  relevance: {
    score: number;
    level: "HÖG" | "MEDEL" | "LÅG" | "INGEN";
    weightHint: number;
    snippetChars: number;
    matchedTerms: string[];
    matchedTermsRanked: { term: string; hits: number }[];
    coverage: number;
  };
  extended: {
    tokenCount: number;
    uniqueTokenCount: number;
    snippet: string;
    previewFirst400: string;
  };
}

const LEVEL_COLOR: Record<string, string> = {
  HÖG: "bg-emerald-600 text-white",
  MEDEL: "bg-amber-500 text-white",
  LÅG: "bg-slate-500 text-white",
  INGEN: "bg-slate-300 text-slate-800",
};

const EXAMPLES = [
  "Business Central för grossist med integrationer",
  "F&SCM för global tillverkning",
  "CRM på Power Platform och Sales i handel",
  "AI Copilot i Business Central för SMB",
  "Continia och Truvio till Business Central",
];

export default function AdminRelevanceTest() {
  const { isAuthenticated, login, logout, token } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [query, setQuery] = useState("Business Central för grossist med integrationer");
  const [slug, setSlug] = useState("bisqo");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RelevanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("debug-extended-relevance", {
        body: { query, slug, token },
      });
      if (fnErr) throw fnErr;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as RelevanceResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => {
      if (query.trim() && slug.trim()) run();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, query, slug]);


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await login(password);
    if (!res.success) setLoginError(res.error ?? "Inloggning misslyckades");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="Relevanstest – d365.se" description="Testa fördjupningsviktning." canonicalPath="/admin/relevans-test" noIndex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Relevanstest</CardTitle>
              <CardDescription>Adminlösenord krävs.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                </div>
                <Button type="submit" className="w-full">Logga in</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Relevanstest – d365.se" description="Testa fördjupningsviktning." canonicalPath="/admin/relevans-test" noIndex />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/admin" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Tillbaka till admin
              </Link>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6" /> Fördjupning – relevansviktning
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visar exakt vilka tokens i sökfrasen som matchar en partners <code className="font-mono">/fordjupning/</code>-text och vilken vikt AI-sök/matchning ger.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Logga ut</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Testfråga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="space-y-1.5">
                <Label htmlFor="query" className="flex items-center gap-2">
                  Sökfras / kriterier
                  {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <span className="text-xs font-normal text-muted-foreground ml-auto">Live-uppdatering</span>
                </Label>
                <Textarea id="query" rows={3} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Skriv en sökfras – resultatet uppdateras direkt…" />

              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Partner-slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setQuery(ex)}
                  className="text-xs px-2 py-1 rounded border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
            <Button onClick={run} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Beräkna relevans
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3 flex-wrap">
                  {result.partner.name}
                  <Badge className={LEVEL_COLOR[result.relevance.level]}>Relevans: {result.relevance.level}</Badge>
                </CardTitle>
                <CardDescription>
                  Fördjupning: {result.partner.extendedContentLength.toLocaleString("sv-SE")} tecken
                  {result.partner.extendedContentUpdatedAt && (
                    <> · uppdaterad {new Date(result.partner.extendedContentUpdatedAt).toLocaleString("sv-SE")}</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Stat label="Score" value={result.relevance.score.toFixed(3)} />
                <Stat label="Viktnings­hint" value={result.relevance.weightHint.toFixed(2)} />
                <Stat label="Snippetstorlek" value={`${result.relevance.snippetChars} tkn`} />
                <Stat label="Täckning" value={`${Math.round(result.relevance.coverage * 100)}%`} />
                <Stat label="Query-tokens" value={String(result.query.uniqueTokens.length)} />
                <Stat label="Matchande" value={String(result.relevance.matchedTerms.length)} />
                <Stat label="Fördjupn.-tokens" value={result.extended.tokenCount.toLocaleString("sv-SE")} />
                <Stat label="Unika i text" value={result.extended.uniqueTokenCount.toLocaleString("sv-SE")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Query-tokens</CardTitle>
                <CardDescription>Efter stoppord-filtrering. Gröna = träff i fördjupningen.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.query.uniqueTokens.length === 0 && (
                  <p className="text-sm text-muted-foreground">Inga token efter filtrering.</p>
                )}
                {result.query.uniqueTokens.map((t) => {
                  const isMatch = result.relevance.matchedTerms.includes(t);
                  return (
                    <span
                      key={t}
                      className={`text-xs px-2 py-1 rounded font-mono ${
                        isMatch
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-500 border border-slate-200 line-through"
                      }`}
                    >
                      {t}
                    </span>
                  );
                })}
              </CardContent>
            </Card>

            {result.relevance.matchedTermsRanked.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Matchande taggar (sorterade på förekomster i fördjupningen)</CardTitle>
                  <CardDescription>Ju fler träffar, desto tyngre påverkar termen viktningen.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.relevance.matchedTermsRanked.map((m) => (
                    <span
                      key={m.term}
                      className="text-xs px-2 py-1 rounded border border-primary/30 bg-primary/10 text-primary font-mono"
                    >
                      {m.term} <span className="opacity-70">×{m.hits}</span>
                    </span>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Snippet som skickas till AI-prompten</CardTitle>
                <CardDescription>
                  Max {result.relevance.snippetChars} tecken. Vid HÖG relevans injiceras ett längre stycke.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded max-h-96 overflow-auto">
{result.extended.snippet || "(fördjupning saknas)"}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
