import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Eye, Link2, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  AKTUELLT_ACTIONS,
  AKTUELLT_AUDIENCES,
  AKTUELLT_AVAILABILITY,
  AKTUELLT_CTA_DESTINATIONS,
  AKTUELLT_CUSTOMER_STATUS,
  AKTUELLT_INDUSTRIES,
  AKTUELLT_NOT_PUBLISH_REASONS,
  AKTUELLT_PRODUCTS,
  AKTUELLT_TOPICS,
  aktuelltActionLabel,
  aktuelltNeedsFactConfirmation,
  aktuelltPlacementsFor,
  aktuelltPublishBlockers,
  aktuelltAvailabilityLabel,
  aktuelltCustomerStatusLabel,
  aktuelltPath,
  aktuelltProductLabel,
  aktuelltStatusLabel,
  aktuelltTopicLabel,
  relevanceBand,
  type AktuelltArticle,
} from "@/lib/aktuellt";

interface Assessment {
  relevance_score: number | null;
  relevance_reason: string | null;
  recommendation: "publish" | "consider" | "not_publish" | null;
  not_publish_reasons: string[];
  verification_notes: string | null;
  ingest_method: string;
  intake_source: string | null;
  discovered_at: string;
}
type Row = AktuelltArticle & { knowledge_article_assessments: Assessment | Assessment[] | null };

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const QUEUE = ["candidate", "draft", "review", "approved"];
const today = () => new Date().toISOString().slice(0, 10);
const d = (s: string | null | undefined) => (s || "").slice(0, 10);
const assessmentOf = (r: Row): Assessment | null =>
  Array.isArray(r.knowledge_article_assessments) ? r.knowledge_article_assessments[0] ?? null : r.knowledge_article_assessments;

const STATUS_STYLE: Record<string, string> = {
  candidate: "bg-secondary text-secondary-foreground",
  draft: "bg-secondary text-secondary-foreground",
  review: "bg-accent/15 text-accent",
  approved: "bg-primary/15 text-primary",
  published: "bg-primary text-primary-foreground",
  ignored: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
};
const BAND_LABEL = { priority: "Prioriterad", consider: "Bör bedömas", low: "Normalt ej publiceringsvärd", unknown: "Ej bedömd" } as const;
const REC_LABEL = { publish: "Publiceringsvärd", consider: "Bedöm redaktionellt", not_publish: "Ej publiceringsvärd" } as const;

export default function RedaktionAktuelltTab({ token, onSessionExpired }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"queue" | "published" | "all" | "ignored">("queue");
  const [importUrl, setImportUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [preview, setPreview] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmFact, setConfirmFact] = useState(false);

  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-aktuellt`;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  });

  const call = async (action: string, body?: unknown) => {
    const res = await fetch(`${base}?action=${action}`, {
      method: body === undefined ? "GET" : "POST",
      headers: headers(),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 401) {
      onSessionExpired();
      throw new Error("Sessionen har gått ut");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Fel ${res.status}`);
    return data;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await call("list");
      setRows(data.articles || []);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const s = (r: Row) => r.editorial_status || "candidate";
    if (view === "queue") return rows.filter((r) => QUEUE.includes(s(r)));
    if (view === "published") return rows.filter((r) => s(r) === "published");
    if (view === "ignored") return rows.filter((r) => s(r) === "ignored" || s(r) === "archived");
    return rows;
  }, [rows, view]);
  const count = (pred: (s: string) => boolean) => rows.filter((r) => pred(r.editorial_status || "candidate")).length;

  const runImport = async () => {
    if (!importUrl.trim() && !pasteText.trim()) return toast.error("Klistra in en länk eller källans text.");
    setImporting(true);
    try {
      const data = await call("import", { url: importUrl.trim(), pasted_text: showPaste ? pasteText.trim() : "" });
      if (data.duplicate) {
        toast.info(data.message || "Källan är redan bedömd.");
      } else if (data.needs_paste) {
        setShowPaste(true);
        toast.info(data.message);
      } else {
        const rec = data.recommendation as keyof typeof REC_LABEL;
        toast.success(`Bedömd: ${REC_LABEL[rec] ?? "klar"}. Posten ligger i godkännandekön.`);
        setImportUrl("");
        setPasteText("");
        setShowPaste(false);
        setView("queue");
        await load();
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const setStatus = async (r: Row, status: string, okText: string) => {
    setBusyId(r.id);
    try {
      await call("set-status", { id: r.id, status });
      toast.success(okText);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const openPreview = (r: Row) => {
    setConfirmFact(false);
    setPreview(r);
  };

  /** Ett aktivt redaktionellt beslut: godkänner och publicerar i samma klick. */
  const publish = async (r: Row) => {
    setBusyId(r.id);
    try {
      await call("publish", { id: r.id, confirm_fact_check: confirmFact });
      toast.success("Publicerad. Den visas på /aktuellt/ och på matchande sidor.");
      setPreview(null);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const e = editing;
      await call("save", {
        id: e.id,
        fields: {
          title: e.title, description: e.description, slug: e.slug, image_url: e.image_url || null,
          analysis: e.analysis, source_name: e.source_name, source_url: e.source_url,
          source_published_at: e.source_published_at || "", extra_sources: e.extra_sources ?? [],
          fact_checked_at: e.fact_checked_at || "", product_keys: e.product_keys, topic: e.topic || null,
          industry: e.industry || null, target_roles: e.target_roles, customer_status: e.customer_status || null,
          availability_status: e.availability_status || null, recommended_action: e.recommended_action || null,
          needs_verification: e.needs_verification, cta_url: e.cta_url || null, cta_label: e.cta_label || null,
          editorial_priority: Number(e.editorial_priority) || 0, context_until: e.context_until || "",
        },
      });
      toast.success("Sparat");
      setEditing(null);
      await load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const patch = (p: Partial<Row>) => setEditing((cur) => (cur ? { ...cur, ...p } : cur));
  const patchAnalysis = (p: Record<string, unknown>) => setEditing((cur) => (cur ? { ...cur, analysis: { ...(cur.analysis ?? {}), ...p } } : cur));
  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aktuellt: importera från länk</CardTitle>
          <CardDescription>
            d365.se:s egen analys av förändringar i Dynamics&nbsp;365. Klistra in en källa, oftast från Microsoft. AI bedömer relevans och skriver ett utkast som hamnar i godkännandekön.
            Där granskar du, redigerar vid behov och väljer Publicera eller Ignorera. Publicerade analyser visas automatiskt på /aktuellt/ och på sidor med samma produkt, ämne eller bransch.
            Ingenting publiceras utan ditt beslut. Partners nyheter hör hemma i Partnernytt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="url"
              placeholder="https://learn.microsoft.com/…"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              aria-label="Käll-URL"
            />
            <Button onClick={runImport} disabled={importing} className="gap-2 sm:w-auto">
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {importing ? "Bedömer källan…" : "Importera och bedöm"}
            </Button>
          </div>
          <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => setShowPaste((v) => !v)}>
            {showPaste ? "Dölj fältet för inklistrad text" : "Sidan går inte att läsa? Klistra in källans text"}
          </button>
          {showPaste && (
            <Textarea rows={6} placeholder="Klistra in källans text här. Länken ovan sparas som primärkälla." value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
          )}
          {importing && <p className="text-xs text-muted-foreground">Bedömningen tar oftast under en minut.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList className="h-auto flex-wrap">
              <TabsTrigger value="queue">Godkännandekö ({count((s) => QUEUE.includes(s))})</TabsTrigger>
              <TabsTrigger value="published">Publicerade ({count((s) => s === "published")})</TabsTrigger>
              <TabsTrigger value="all">Alla ({rows.length})</TabsTrigger>
              <TabsTrigger value="ignored">Ignorerade och arkiverade ({count((s) => s === "ignored" || s === "archived")})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Laddar…</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga poster i den här vyn.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="min-w-[16rem]">Rubrik och källa</TableHead>
                    <TableHead>Produkt / ämne</TableHead>
                    <TableHead>Kundstatus</TableHead>
                    <TableHead>Tillgänglighet</TableHead>
                    <TableHead>Relevans</TableHead>
                    <TableHead>Faktakontroll</TableHead>
                    <TableHead className="min-w-[14rem]">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((r) => {
                    const st = r.editorial_status || "candidate";
                    const a = assessmentOf(r);
                    const band = relevanceBand(a?.relevance_score);
                    const busy = busyId === r.id;
                    return (
                      <TableRow key={r.id} className="align-top">
                        <TableCell>
                          <Badge className={`${STATUS_STYLE[st] ?? ""} hover:opacity-90`}>{aktuelltStatusLabel(st)}</Badge>
                          {r.needs_verification && <p className="mt-1 text-xs font-medium text-cta-orange">Behöver verifieras</p>}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{r.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {r.source_name || "Okänd källa"}
                            {r.source_published_at ? `, ${d(r.source_published_at)}` : ", källdatum saknas"}
                            {a?.ingest_method === "agent" ? " · från agent" : ""}
                          </p>
                        </TableCell>
                        <TableCell className="text-xs">
                          {(r.product_keys ?? []).map(aktuelltProductLabel).join(", ") || "–"}
                          {r.topic && <p className="text-muted-foreground">{aktuelltTopicLabel(r.topic)}</p>}
                        </TableCell>
                        <TableCell className="text-xs">{aktuelltCustomerStatusLabel(r.customer_status) || "–"}</TableCell>
                        <TableCell className="text-xs">{aktuelltAvailabilityLabel(r.availability_status) || "–"}</TableCell>
                        <TableCell className="text-xs">
                          <span className="font-semibold text-foreground">{a?.relevance_score ?? "–"}</span>
                          <p className="text-muted-foreground">{BAND_LABEL[band]}</p>
                          {a?.recommendation === "not_publish" && <p className="font-medium text-cta-orange">AI: ej publiceringsvärd</p>}
                        </TableCell>
                        <TableCell className="text-xs">{d(r.fact_checked_at) || "–"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={() => openPreview(r)}><Eye className="h-3.5 w-3.5" />Förhandsgranska</Button>
                            <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={() => setEditing({ ...r })}><Pencil className="h-3.5 w-3.5" />Redigera</Button>
                            {QUEUE.includes(st) && (
                              <>
                                <Button size="sm" className="h-7 px-2 text-xs" disabled={busy} onClick={() => openPreview(r)}>Publicera</Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" disabled={busy} onClick={() => setStatus(r, "ignored", "Ignorerad")}>Ignorera</Button>
                              </>
                            )}
                            {st === "published" && (
                              <>
                                <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" asChild>
                                  <a href={aktuelltPath(r.slug)} target="_blank" rel="noopener"><ExternalLink className="h-3.5 w-3.5" />Visa</a>
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs" disabled={busy} onClick={() => setStatus(r, "approved", "Avpublicerad, ligger kvar i godkännandekön")}>Avpublicera</Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" disabled={busy} onClick={() => setStatus(r, "archived", "Arkiverad")}>Arkivera</Button>
                              </>
                            )}
                            {(st === "ignored" || st === "archived") && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" disabled={busy} onClick={() => setStatus(r, "draft", "Återställd till godkännandekön")}>Återställ</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Förhandsgranskning */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>{preview.title}</DialogTitle>
              </DialogHeader>
              <AssessmentBox a={assessmentOf(preview)} />
              <div className="space-y-4 text-sm">
                {preview.description && <p className="text-base text-muted-foreground">{preview.description}</p>}
                <PreviewBlock title="Vad har hänt?" text={preview.analysis?.what_happened} />
                <PreviewBlock title="Vad innebär det för verksamheten?" text={preview.analysis?.business_impact} />
                {(preview.customer_status === "evaluating" || preview.customer_status === "both") && <PreviewBlock title="För er som utvärderar Dynamics 365" text={preview.analysis?.for_evaluators} />}
                {(preview.customer_status === "existing" || preview.customer_status === "both") && <PreviewBlock title="För er som redan använder Dynamics 365" text={preview.analysis?.for_customers} />}
                <PreviewBlock title="Behöver ni agera?" text={aktuelltActionLabel(preview.recommended_action)} />
                {(preview.analysis?.partner_questions?.length ?? 0) > 0 && (
                  <div>
                    <p className="font-semibold">Frågor att ta med till partnern</p>
                    <ul className="mt-1 list-disc pl-5">{preview.analysis!.partner_questions!.map((q, i) => <li key={i}>{q}</li>)}</ul>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Primärkälla: {preview.source_url ? <a href={preview.source_url} target="_blank" rel="noopener" className="text-primary hover:underline">{preview.source_name || preview.source_url}</a> : "saknas"} ·
                  Nästa steg: {preview.cta_label || "–"} ({preview.cta_url || "–"}) · Adress: {aktuelltPath(preview.slug)}
                </p>
              </div>

              {(() => {
                const st = preview.editorial_status || "candidate";
                const placements = aktuelltPlacementsFor(preview);
                const needsConfirm = aktuelltNeedsFactConfirmation(preview);
                const blockers = aktuelltPublishBlockers(preview, confirmFact);
                const inQueue = QUEUE.includes(st);
                return (
                  <div className="space-y-3 rounded-md border border-border bg-muted/30 p-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Visas automatiskt efter publicering</p>
                      <p className="mt-1 text-muted-foreground">
                        /aktuellt/{placements.length > 0 ? `, samt högst två artiklar per sida på: ${placements.join(", ")}` : ". Ingen produkt, inget ämne eller bransch matchar andra sidor, ändra under Redigera om den ska synas där."}
                      </p>
                    </div>
                    {inQueue && (
                      <>
                        {needsConfirm && (
                          <label className="flex items-start gap-3">
                            <Checkbox checked={confirmFact} onCheckedChange={(v) => setConfirmFact(v === true)} className="mt-0.5" />
                            <span>
                              Jag har kontrollerat uppgifterna mot primärkällan idag. Faktakontrollen sätts till {today()}
                              {preview.needs_verification ? " och markeringen Behöver verifieras tas bort" : ""}.
                            </span>
                          </label>
                        )}
                        {blockers.length > 0 && (
                          <p className="font-medium text-cta-orange">Innan publicering: {blockers.join(", ")}.</p>
                        )}
                        {assessmentOf(preview)?.recommendation === "not_publish" && (
                          <p className="text-muted-foreground">AI bedömer källan som ej publiceringsvärd. Du kan ändå publicera om du gör en annan bedömning.</p>
                        )}
                      </>
                    )}
                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                      <Button variant="outline" size="sm" onClick={() => { setEditing({ ...preview }); setPreview(null); }}><Pencil className="mr-1 h-3.5 w-3.5" />Redigera</Button>
                      {inQueue && (
                        <>
                          <Button variant="ghost" size="sm" disabled={busyId === preview.id} onClick={async () => { await setStatus(preview, "ignored", "Ignorerad"); setPreview(null); }}>Ignorera</Button>
                          <Button size="sm" disabled={busyId === preview.id || blockers.length > 0} onClick={() => publish(preview)}>
                            {busyId === preview.id ? "Publicerar…" : "Publicera"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Redigering */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>Redigera Aktuellt</DialogTitle>
              </DialogHeader>
              <AssessmentBox a={assessmentOf(editing)} />
              <div className="grid gap-4">
                <Field label="Rubrik (H1)"><Input value={editing.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
                <Field label="Ingress"><Textarea rows={2} value={editing.description ?? ""} onChange={(e) => patch({ description: e.target.value })} /></Field>
                <Field label="Adress (slug)" hint={`Blir ${aktuelltPath(editing.slug)}`}><Input value={editing.slug ?? ""} onChange={(e) => patch({ slug: e.target.value })} /></Field>
                <Field label="Vad har hänt?"><Textarea rows={3} value={editing.analysis?.what_happened ?? ""} onChange={(e) => patchAnalysis({ what_happened: e.target.value })} /></Field>
                <Field label="Vad innebär det för verksamheten?"><Textarea rows={3} value={editing.analysis?.business_impact ?? ""} onChange={(e) => patchAnalysis({ business_impact: e.target.value })} /></Field>
                <Field label="För er som utvärderar Dynamics 365 (tomt = visas inte)"><Textarea rows={2} value={editing.analysis?.for_evaluators ?? ""} onChange={(e) => patchAnalysis({ for_evaluators: e.target.value || null })} /></Field>
                <Field label="För er som redan använder Dynamics 365 (tomt = visas inte)"><Textarea rows={2} value={editing.analysis?.for_customers ?? ""} onChange={(e) => patchAnalysis({ for_customers: e.target.value || null })} /></Field>
                <Field label="Frågor att ta med till partnern (en per rad)">
                  <Textarea rows={3} value={(editing.analysis?.partner_questions ?? []).join("\n")} onChange={(e) => patchAnalysis({ partner_questions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Primärkälla, namn"><Input value={editing.source_name ?? ""} onChange={(e) => patch({ source_name: e.target.value })} /></Field>
                  <Field label="Primärkälla, URL"><Input value={editing.source_url ?? ""} onChange={(e) => patch({ source_url: e.target.value })} /></Field>
                  <Field label="Källans publiceringsdatum"><Input type="date" value={d(editing.source_published_at)} onChange={(e) => patch({ source_published_at: e.target.value })} /></Field>
                  <Field label="Senast faktakontrollerad">
                    <div className="flex gap-2">
                      <Input type="date" value={d(editing.fact_checked_at)} onChange={(e) => patch({ fact_checked_at: e.target.value })} />
                      <Button type="button" variant="outline" size="sm" onClick={() => patch({ fact_checked_at: today() })}>Idag</Button>
                    </div>
                  </Field>
                </div>
                <Field label="Kompletterande källor (en per rad: Namn | URL)">
                  <Textarea
                    rows={2}
                    value={(editing.extra_sources ?? []).map((s) => `${s.name ?? ""} | ${s.url}`).join("\n")}
                    onChange={(e) => patch({
                      extra_sources: e.target.value.split("\n").map((line) => {
                        const [name, url] = line.includes("|") ? line.split("|").map((x) => x.trim()) : ["", line.trim()];
                        return { name, url };
                      }).filter((s) => /^https?:\/\//.test(s.url)),
                    })}
                  />
                </Field>

                <Field label="Produkter">
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {AKTUELLT_PRODUCTS.map((p) => (
                      <label key={p.key} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={(editing.product_keys ?? []).includes(p.key)} onCheckedChange={() => patch({ product_keys: toggleIn(editing.product_keys ?? [], p.key) })} />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Målgrupp">
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {AKTUELLT_AUDIENCES.map((p) => (
                      <label key={p.key} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={(editing.target_roles ?? []).includes(p.key)} onCheckedChange={() => patch({ target_roles: toggleIn(editing.target_roles ?? [], p.key) })} />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PickOne label="Ämne" value={editing.topic} options={AKTUELLT_TOPICS} onChange={(v) => patch({ topic: v })} allowEmpty />
                  <PickOne label="Bransch (endast när relevant)" value={editing.industry} options={AKTUELLT_INDUSTRIES.map((i) => ({ key: i, label: i }))} onChange={(v) => patch({ industry: v })} allowEmpty />
                  <PickOne label="Kundstatus" value={editing.customer_status} options={AKTUELLT_CUSTOMER_STATUS} onChange={(v) => patch({ customer_status: v })} />
                  <PickOne label="Funktionens status" value={editing.availability_status} options={AKTUELLT_AVAILABILITY} onChange={(v) => patch({ availability_status: v })} />
                  <PickOne label="Rekommenderad åtgärd" value={editing.recommended_action} options={AKTUELLT_ACTIONS} onChange={(v) => patch({ recommended_action: v })} />
                  <PickOne
                    label="Nästa steg (befintlig sida)"
                    value={editing.cta_url}
                    options={AKTUELLT_CTA_DESTINATIONS.map((c) => ({ key: c.url, label: `${c.label} (${c.url})` }))}
                    onChange={(v) => patch({ cta_url: v, cta_label: AKTUELLT_CTA_DESTINATIONS.find((c) => c.url === v)?.label ?? editing.cta_label })}
                    allowEmpty
                  />
                  <Field label="Knapptext för nästa steg"><Input value={editing.cta_label ?? ""} onChange={(e) => patch({ cta_label: e.target.value })} /></Field>
                  <Field label="Bild-URL (valfri)"><Input value={editing.image_url ?? ""} onChange={(e) => patch({ image_url: e.target.value })} /></Field>
                  <Field label="Manuell prioritering (högre visas först)"><Input type="number" value={editing.editorial_priority ?? 0} onChange={(e) => patch({ editorial_priority: Number(e.target.value) })} /></Field>
                  <Field label="Visa på andra sidor till och med" hint="Tomt = 180 dagar efter faktakontroll"><Input type="date" value={d(editing.context_until)} onChange={(e) => patch({ context_until: e.target.value })} /></Field>
                </div>

                <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
                  <Switch checked={editing.needs_verification} onCheckedChange={(v) => patch({ needs_verification: v })} />
                  <span><strong>Behöver verifieras.</strong> Måste vara avbockad innan artikeln kan godkännas och publiceras.</span>
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
                <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PickOne({ label, value, options, onChange, allowEmpty }: {
  label: string;
  value: string | null;
  options: ReadonlyArray<{ key: string; label: string }>;
  onChange: (v: string | null) => void;
  allowEmpty?: boolean;
}) {
  return (
    <Field label={label}>
      <Select value={value ?? "__none"} onValueChange={(v) => onChange(v === "__none" ? null : v)}>
        <SelectTrigger><SelectValue placeholder="Välj" /></SelectTrigger>
        <SelectContent>
          {allowEmpty && <SelectItem value="__none">Ingen</SelectItem>}
          {!allowEmpty && !value && <SelectItem value="__none">Välj</SelectItem>}
          {options.map((o) => <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </Field>
  );
}

function PreviewBlock({ title, text }: { title: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 whitespace-pre-line text-foreground/90">{text}</p>
    </div>
  );
}

function AssessmentBox({ a }: { a: Assessment | null }) {
  if (!a) return null;
  const band = relevanceBand(a.relevance_score);
  return (
    <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
      <p className="font-semibold text-foreground">
        Intern AI-bedömning (visas aldrig publikt): {a.relevance_score ?? "–"} av 100, {BAND_LABEL[band]}
        {a.recommendation ? `, ${REC_LABEL[a.recommendation]}` : ""}
      </p>
      {a.relevance_reason && <p className="mt-1 text-muted-foreground">{a.relevance_reason}</p>}
      {a.not_publish_reasons?.length > 0 && (
        <p className="mt-1 text-muted-foreground">
          Skäl mot publicering: {a.not_publish_reasons.map((r) => AKTUELLT_NOT_PUBLISH_REASONS.find((x) => x.key === r)?.label ?? r).join(", ")}
        </p>
      )}
      {a.verification_notes && <p className="mt-1 font-medium text-cta-orange">Att verifiera: {a.verification_notes}</p>}
    </div>
  );
}
