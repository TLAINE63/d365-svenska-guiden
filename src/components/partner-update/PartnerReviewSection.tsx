import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Plus, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import { useToast } from "@/hooks/use-toast";

interface Item {
  dimension: string; key: string; label: string; klass: "A" | "B";
  quality: "confirmed" | "partner" | "public"; source: string; excerpt: string | null;
}
interface Change { id: string; dimension_key: string; value_label: string; change_type: string; status: string; editor_note: string | null }
interface ReviewData {
  has_bc: boolean; items: Item[]; missing: string[];
  options: Record<string, { key: string; label: string }[]>; counts: { A: number; B: number; C: number }; changes: Change[]; auto_publish?: boolean;
}

const TITLES: Record<string, string> = {
  base: "Grunduppgifter", migration: "Migreringserfarenhet", competency: "Business Central-kompetens",
  project_type: "Typiska projekt", delivery_model: "Leveransmodell", capability: "Tvärgående förmågor",
  industry_solution: "Branschlösning",
};
const DIMS = ["migration", "competency", "capability", "project_type", "delivery_model"];
const HELP: Record<string, string> = {
  migration: "Vilka system har ni hjälpt kunder att flytta från till Business Central? Välj bara det ni faktiskt har gjort i kundprojekt.",
  competency: "Vilka områden i Business Central har ni egna konsulter för? Välj det ni kan leverera själva, inte via underleverantör.",
  capability: "Förmågor som används tillsammans med Business Central, till exempel Power BI, Power Platform, Copilot, Copilot Studio och AI-agenter.",
  project_type: "Vilka typer av projekt gör ni oftast? Det hjälper köpare att förstå om ni passar deras situation.",
  delivery_model: "Hur arbetar ni med kunderna: på plats, på distans eller en blandning?",
  industry_solution: "En egen lösning eller paketering för en viss bransch. Ange namn, bransch och en kort beskrivning.",
};
const QUALITY: Record<Item["quality"], string> = { confirmed: "Bekräftad", partner: "Partneruppgift", public: "Publik källa" };

const endpoint = (a: string) => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=${a}`;
const post = async (a: string, body: unknown) => {
  const r = await fetch(endpoint(a), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Något gick fel");
  return j;
};

/** Granska och godkänn i stället för att fylla i allt igen. Ändringar granskas av redaktionen. */
export function PartnerReviewSection({ token }: { token: string }) {
  const { toast } = useToast();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<Record<string, "confirm" | "remove">>({});
  const [adds, setAdds] = useState<Record<string, string[]>>({});
  const [picker, setPicker] = useState<string | null>(null);
  const [solution, setSolution] = useState<{ name: string; industry: string; description: string } | null>(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [result, setResult] = useState<{ title: string; previous: string; next: string }[] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await post("get-review", { token })); } catch { setData(null); } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const k = (i: { dimension: string; key: string }) => `${i.dimension}:${i.key}`;
  const labelOf = (dim: string, key: string) => data?.options[dim]?.find((o) => o.key === key)?.label || key;

  const diff = useMemo(() => {
    if (!data) return [];
    const dims = [...DIMS, "industry_solution"];
    return dims.map((d) => {
      const cur = data.items.filter((i) => i.dimension === d);
      const prev = cur.map((i) => i.label);
      const next = [
        ...cur.filter((i) => decisions[k(i)] !== "remove").map((i) => i.label + (decisions[k(i)] === "confirm" ? " ✓" : "")),
        ...(adds[d] || []).map((key) => labelOf(d, key)),
        ...(d === "industry_solution" && solution?.name.trim() ? [solution.name.trim()] : []),
      ];
      const changed = cur.some((i) => decisions[k(i)]) || (adds[d] || []).length > 0 || (d === "industry_solution" && !!solution?.name.trim());
      return { d, title: TITLES[d], previous: prev.join(", ") || "Tomt", next: next.join(", ") || "Tomt", changed };
    }).filter((x) => x.changed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, decisions, adds, solution]);

  if (loading) return <Card><CardContent className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></CardContent></Card>;
  if (!data || !data.has_bc) return null;

  const A = data.items.filter((i) => i.klass === "A");
  const B = data.items.filter((i) => i.klass === "B");
  const pending = data.changes.filter((c) => c.status === "pending");
  const clarifications = data.changes.filter((c) => c.status === "clarification");
  const toggleAdd = (dim: string, key: string) =>
    setAdds((s) => ({ ...s, [dim]: (s[dim] || []).includes(key) ? s[dim].filter((x) => x !== key) : [...(s[dim] || []), key] }));
  const setDecision = (i: Item, d: "confirm" | "remove") =>
    setDecisions((s) => { const n = { ...s }; if (n[k(i)] === d) delete n[k(i)]; else n[k(i)] = d; return n; });

  const submit = async () => {
    setSaving(true);
    try {
      const ref = (key: string) => { const [dimension, ...rest] = key.split(":"); return { dimension, key: rest.join(":") }; };
      const res = await post("submit-review", {
        token,
        confirm: Object.entries(decisions).filter(([, v]) => v === "confirm").map(([key]) => ref(key)),
        remove: Object.entries(decisions).filter(([, v]) => v === "remove").map(([key]) => ref(key)),
        add: Object.entries(adds).flatMap(([dimension, keys]) => keys.map((key) => ({ dimension, key }))),
        add_solutions: solution?.name.trim() ? [solution] : [],
      });
      setResult(res.diff || []);
      setDecisions({}); setAdds({}); setSolution(null); setPreview(false); setPicker(null);
      toast({ title: "Tack!", description: res.published ? "Ändringarna är sparade och publicerade på er profil." : "Ändringarna har skickats till redaktionen för granskning." });
      setPublished(!!res.published);
      await load();
    } catch (e) {
      toast({ title: "Kunde inte spara", description: e instanceof Error ? e.message : "Försök igen", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const Picker = ({ dim }: { dim: string }) => {
    const existing = new Set(data.items.filter((i) => i.dimension === dim).map((i) => i.key));
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {(data.options[dim] || []).filter((o) => !existing.has(o.key)).map((o) => {
          const on = (adds[dim] || []).includes(o.key);
          return (
            <Button key={o.key} type="button" size="sm" variant={on ? "default" : "outline"} onClick={() => toggleAdd(dim, o.key)}>
              {on ? <Check className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}{o.label}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Granska er Business Central-profil</CardTitle>
        <CardDescription>
          Vi har samlat det vi redan vet om er Business Central-verksamhet. Gå igenom de tre delarna nedan:
          1) kontrollera det som redan är bekräftat, 2) bekräfta eller ta bort uppgifter vi hittat, 3) lägg till det som saknas.
          Klicka sedan på "Granska ändringar" längst ner och spara.{" "}
          {data.auto_publish ? "Era ändringar publiceras direkt på er partnerprofil." : "Allt ni ändrar granskas av d365.se innan det publiceras."}
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          <Badge variant="secondary">Bekräftade: {data.counts.A}</Badge>
          <Badge variant="outline">Behöver bekräftas: {data.counts.B}</Badge>
          <Badge variant="outline">Saknas: {data.counts.C}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {clarifications.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2">
            <p className="text-sm font-semibold flex items-center gap-2"><AlertCircle className="w-4 h-4 text-accent" /> Redaktionen ber om förtydligande</p>
            {clarifications.map((c) => (
              <p key={c.id} className="text-sm"><strong>{TITLES[c.dimension_key]}: {c.value_label}</strong> – {c.editor_note}</p>
            ))}
          </div>
        )}

        <section className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Bekräftade uppgifter</h4>
          <p className="text-xs text-muted-foreground">Ingen åtgärd krävs. Stämmer något inte längre kan ni ta bort det med krysset.</p>
          {A.length === 0 ? <p className="text-sm text-muted-foreground">Inga ännu.</p> : (
            <ul className="grid sm:grid-cols-2 gap-1.5">
              {A.map((i) => (
                <li key={k(i)} className={`text-sm flex items-center justify-between gap-2 rounded border border-border px-2 py-1 ${decisions[k(i)] === "remove" ? "line-through opacity-60" : ""}`}>
                  <span>{i.dimension !== "base" && <span className="text-muted-foreground">{TITLES[i.dimension]}: </span>}{i.label}
                    {i.quality === "partner" && !data.auto_publish && <Badge variant="outline" className="ml-2 text-[10px]">Väntar på redaktionen</Badge>}</span>
                  {i.dimension !== "base" && i.dimension !== "industry_solution" && (
                    <button type="button" aria-label={`Ta bort ${i.label}`} className="text-muted-foreground hover:text-destructive" onClick={() => setDecision(i, "remove")}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h4 className="font-semibold text-sm">Behöver bekräftas</h4>
          <p className="text-xs text-muted-foreground">Uppgifter vi hittat i er tidigare profil eller publika källor. Välj Bekräfta om det stämmer, Ta bort om det inte gör det, eller Ändra för att välja något annat.</p>
          {B.length === 0 ? <p className="text-sm text-muted-foreground">Inget att bekräfta just nu.</p> : B.map((i) => (
            <div key={k(i)} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm"><span className="text-muted-foreground">{TITLES[i.dimension]}:</span> <strong>{i.label}</strong></p>
                  <p className="text-xs text-muted-foreground">Källa: {i.source}{i.excerpt ? ` – ${i.excerpt}` : ""}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={decisions[k(i)] === "confirm" ? "default" : "outline"} onClick={() => setDecision(i, "confirm")}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Bekräfta
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setPicker(picker === i.dimension ? null : i.dimension)}>Ändra</Button>
                  <Button type="button" size="sm" variant={decisions[k(i)] === "remove" ? "destructive" : "outline"} onClick={() => setDecision(i, "remove")}>
                    <X className="w-3.5 h-3.5 mr-1" /> Ta bort
                  </Button>
                </div>
              </div>
              {picker === i.dimension && <Picker dim={i.dimension} />}
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h4 className="font-semibold text-sm">Saknas</h4>
          <p className="text-xs text-muted-foreground">Områden där vi inte har några uppgifter. Klicka på Lägg till och välj de alternativ som stämmer. Hoppa över det som inte är relevant.</p>
          {data.missing.length === 0 && <p className="text-sm text-muted-foreground">Inget saknas.</p>}
          {data.missing.map((d) => (
            <div key={d} className="rounded-lg border border-dashed border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div><p className="text-sm font-medium">{TITLES[d]} <span className="text-xs text-muted-foreground font-normal">Ej angiven</span></p>
                  {HELP[d] && <p className="text-xs text-muted-foreground mt-0.5">{HELP[d]}</p>}</div>
                {d === "industry_solution" ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => setSolution(solution ? null : { name: "", industry: "", description: "" })}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Lägg till
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={() => setPicker(picker === d ? null : d)}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Lägg till
                  </Button>
                )}
              </div>
              {picker === d && d !== "industry_solution" && <Picker dim={d} />}
              {d === "industry_solution" && solution && (
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  <Input placeholder="Lösningsnamn" maxLength={120} value={solution.name} onChange={(e) => setSolution({ ...solution, name: e.target.value })} />
                  <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={solution.industry}
                    onChange={(e) => setSolution({ ...solution, industry: e.target.value })}>
                    <option value="">Välj bransch</option>
                    {INDUSTRY_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <Textarea className="sm:col-span-2" rows={2} maxLength={800} placeholder="Kort beskrivning" value={solution.description}
                    onChange={(e) => setSolution({ ...solution, description: e.target.value })} />
                </div>
              )}
            </div>
          ))}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">Lägg till något annat</summary>
            <div className="space-y-3 mt-2">
              {DIMS.filter((d) => !data.missing.includes(d)).map((d) => (
                <div key={d}><p className="text-xs font-medium">{TITLES[d]}</p>{HELP[d] && <p className="text-xs text-muted-foreground">{HELP[d]}</p>}<Picker dim={d} /></div>
              ))}
            </div>
          </details>
        </section>

        {pending.length > 0 && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {pending.length} ändring(ar) väntar på redaktionens granskning.</p>
        )}

        {diff.length > 0 && (
          <div className="rounded-lg border border-border p-3 space-y-3">
            {preview ? (
              <>
                <p className="text-sm font-semibold">Era ändringar</p>
                {diff.map((x) => (
                  <div key={x.d} className="text-sm grid sm:grid-cols-[10rem_1fr] gap-1">
                    <span className="font-medium">{x.title}</span>
                    <span><span className="text-muted-foreground">Tidigare:</span> {x.previous}<br /><span className="text-muted-foreground">Ny:</span> {x.next}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button type="button" onClick={submit} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{data.auto_publish ? "Spara och publicera" : "Skicka till redaktionen"}</Button>
                  <Button type="button" variant="ghost" onClick={() => setPreview(false)}>Tillbaka</Button>
                </div>
              </>
            ) : (
              <Button type="button" onClick={() => setPreview(true)}>Granska ändringar ({diff.length})</Button>
            )}
          </div>
        )}

        {result && result.length > 0 && (
          <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
            <p className="font-semibold">{published ? "Sparat och publicerat" : "Skickat för granskning"}</p>
            {result.map((x, i) => <p key={i}><strong>{x.title}:</strong> {x.previous} → {x.next}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
