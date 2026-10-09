import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

type Item = { target: string; metric: string; why: string; action: string; priority: "hög" | "medel" | "låg" };
type Result = { summary: string; pages: Item[]; queries: Item[] };
interface Props { token: string | null; onSessionExpired: () => void }

const prioVariant = (p: string) => (p === "hög" ? "default" : p === "medel" ? "secondary" : "outline") as const;

function List({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {items.length === 0 && <p className="text-sm text-muted-foreground">Inga förslag i underlaget.</p>}
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium break-all">{it.target}</p>
            <Badge variant={prioVariant(it.priority)}>{it.priority}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{it.metric}</p>
          <p className="text-sm">{it.why}</p>
          <p className="text-sm"><span className="font-medium">Åtgärd:</span> {it.action}</p>
        </div>
      ))}
    </section>
  );
}

export default function AdminSeoPotentialTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = async () => {
    if (!token || !report.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seo-potential`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report }),
      });
      if (res.status === 401) return onSessionExpired();
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysen misslyckades");
      setResult(json.result);
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">SEO-potential (AI)</h2>
        <p className="text-sm text-muted-foreground">
          Klistra in en export från Search Console (sidor och/eller sökfrågor med klick, visningar, CTR och position).
          AI-analysen pekar ut var små förbättringar kan ge mest trafik. Rapporten sparas inte.
        </p>
        <Textarea value={report} onChange={(e) => setReport(e.target.value)} rows={12}
          placeholder={"Sökfråga,Klick,Visningar,CTR,Position\ndynamics 365 partner,12,3400,0.35%,8.2"} className="font-mono text-xs" />
        <Button onClick={run} disabled={loading || !report.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? "Analyserar…" : "Analysera"}
        </Button>
      </div>
      {result && (
        <div className="space-y-6">
          <p className="rounded-lg border bg-muted/40 p-4 text-sm">{result.summary}</p>
          <div className="grid gap-6 lg:grid-cols-2">
            <List title="Sidor" items={result.pages || []} />
            <List title="Sökfrågor" items={result.queries || []} />
          </div>
        </div>
      )}
    </div>
  );
}
