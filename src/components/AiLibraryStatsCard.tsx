import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { AI_APPLICATIONS, AI_CATEGORIES, AI_EXAMPLES, AI_ROLES, AI_TYPES, getReviewQueue } from "@/data/aiExamples";

/** Mätningen av biblioteket i egen lagring började här (Sprint 8). Ingen historik rekonstrueras. */
const MEASUREMENT_START = "2026-10-16";

interface Data {
  period: { start: string; end: string };
  total: number; sessions: number;
  events: Record<string, number>;
  byExample: Record<string, Record<string, number>>;
  filters: Record<string, Record<string, number>>;
  zero: Record<string, number>;
  entries: Record<string, number>;
  sources: Record<string, number>;
}

const titleOf = (id: string) => AI_EXAMPLES.find((e) => e.id === id)?.title ?? `${id} (ej publicerat)`;
const LABELS: Record<string, Record<string, string>> = {
  category: Object.fromEntries(AI_CATEGORIES.map((c) => [c.key, c.label])),
  application: Object.fromEntries(AI_APPLICATIONS.map((a) => [a.key, a.label])),
  role: AI_ROLES as Record<string, string>,
  ai_type: Object.fromEntries(Object.entries(AI_TYPES).map(([k, v]) => [k, v.label])),
};
const top = (m: Record<string, number> = {}, n = 8) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);

function List({ title, rows, label = (k: string) => k, empty = "Ingen data för perioden." }: { title: string; rows: [string, number][]; label?: (k: string) => string; empty?: string }) {
  return (
    <div className="min-w-0">
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      {rows.length === 0 ? <p className="text-xs text-muted-foreground">{empty}</p> : (
        <ul className="space-y-1 text-xs">{rows.map(([k, v]) => <li key={k} className="flex justify-between gap-3 border-t border-border pt-1"><span className="truncate">{label(k)}</span><span className="tabular-nums">{v}</span></li>)}</ul>
      )}
    </div>
  );
}

function months() {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < 12; i++) { const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)); const k = m.toISOString().slice(0, 7); if (k < MEASUREMENT_START.slice(0, 7)) break; out.push(k); }
  return out;
}

export default function AiLibraryStatsCard({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [month, setMonth] = useState(months()[0]);
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!token) return;
    setLoading(true); setFailed(false);
    supabase.functions.invoke("funnel-stats", { body: { token, action: "ai_library", month } })
      .then(({ data: d, error }) => {
        if (error || d?.error) { if (/Logga in|session/i.test(String(d?.error || ""))) onSessionExpired?.(); setFailed(true); return; }
        setData(d as Data);
      })
      .finally(() => setLoading(false));
  }, [token, month, onSessionExpired]);

  const per = (ev: string) => top(Object.fromEntries(Object.entries(data?.byExample ?? {}).map(([k, v]) => [k, v[ev] || 0]).filter(([, v]) => (v as number) > 0)));
  const unused = useMemo(() => data ? AI_EXAMPLES.filter((e) => !data.byExample[e.id]?.ai_example_open) : [], [data]);
  const queue = useMemo(() => getReviewQueue(), []);
  const e = data?.events ?? {};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-lg">AI-exempelbiblioteket</CardTitle>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{months().map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-xs text-muted-foreground">
          Mätningen startade {MEASUREMENT_START}. Klick visar navigation och intresse, inte leads, affärer eller köpbeslut. Inga personuppgifter eller prompttexter lagras.
        </p>
        {loading && <Loader2 className="h-5 w-5 animate-spin" aria-label="Laddar" />}
        {failed && <p className="text-sm text-destructive">Kunde inte hämta statistiken.</p>}
        {data && !loading && (
          <>
            {data.total === 0 && <p className="text-sm">Ingen data registrerad för {month} ännu.</p>}
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                ["Räckvidd", [["Visningar av biblioteket", e.ai_library_view], ["Unika sessioner", data.sessions], ["Ingångar från andra sidor", e.ai_library_entry_click]]],
                ["Engagemang", [["Öppnade exempel", e.ai_example_open], ["Filterval", (e.ai_category_filter || 0) + (e.ai_application_filter || 0) + (e.ai_role_filter || 0) + (e.ai_type_filter || 0)], ["Kopierade prompter", e.ai_prompt_copy], ["Klick till relaterade", e.ai_related_example_click]]],
                ["Fördjupning", [["Till AI-innehåll", e.ai_ai_hub_click], ["Till produkt/businesscentral.se", e.ai_product_content_click], ["Källklick", e.ai_source_click]]],
                ["Kommersiellt nästa steg", [["Klick till partnersök", e.ai_partner_cta_click]]],
              ].map(([h, rows]) => (
                <div key={h as string} className="rounded-lg border border-border p-3">
                  <h4 className="text-sm font-semibold">{h as string}</h4>
                  <dl className="mt-2 space-y-1 text-xs">{(rows as [string, number | undefined][]).map(([l, v]) => <div key={l} className="flex justify-between gap-2"><dt>{l}</dt><dd className="tabular-nums">{v ?? 0}</dd></div>)}</dl>
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <List title="Mest öppnade exempel" rows={per("ai_example_open")} label={titleOf} />
              <List title="Mest kopierade prompter" rows={per("ai_prompt_copy")} label={titleOf} />
              <List title="Leder till AI-innehåll" rows={per("ai_ai_hub_click")} label={titleOf} />
              <List title="Leder till produktinnehåll" rows={per("ai_product_content_click")} label={titleOf} />
              <List title="Leder till partnersök" rows={per("ai_partner_cta_click")} label={titleOf} />
              <List title="Ingångar per sida" rows={top(data.entries)} />
              <List title="Kategorier" rows={top(data.filters.category)} label={(k) => LABELS.category[k] ?? k} />
              <List title="Applikationer" rows={top(data.filters.application)} label={(k) => LABELS.application[k] ?? k} />
              <List title="Roller" rows={top(data.filters.role)} label={(k) => LABELS.role[k] ?? k} />
              <List title="AI-typer" rows={top(data.filters.ai_type)} label={(k) => LABELS.ai_type[k] ?? k} />
              <List title="Nollresultat (innehållsgap)" rows={top(data.zero, 10)} label={(k) => k || "(okänd kombination)"} empty="Inga nollresultat." />
              <List title="Trafikkälla till biblioteket" rows={top(data.sources)} />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Exempel som inte öppnats under perioden ({unused.length})</h4>
              <p className="text-xs text-muted-foreground">{unused.length ? unused.map((x) => x.title).join(" · ") : "Alla exempel har öppnats."}</p>
            </div>
          </>
        )}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Behöver granskas ({queue.length})</h4>
          {queue.length === 0 ? <p className="text-xs text-muted-foreground">Inga exempel har förfallen granskning eller saknad källa.</p> : (
            <ul className="space-y-1 text-xs">{queue.map((q) => <li key={q.slug} className="border-t border-border pt-1"><span className="font-medium">{q.title}</span> ({q.status}): {q.reasons.join(", ")}</li>)}</ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
