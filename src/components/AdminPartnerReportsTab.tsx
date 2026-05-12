import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Send, Eye, Trash2, Sparkles } from "lucide-react";

interface Draft {
  id: string;
  partner_slug: string;
  partner_name: string;
  recipient_email: string | null;
  period_start: string;
  period_end: string;
  subject: string;
  intro_text: string | null;
  companies: any[];
  excluded_organisation_uuids: string[];
  status: string;
  sent_at: string | null;
  error_message: string | null;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_review: "secondary",
  approved: "default",
  sent: "outline",
  failed: "destructive",
  skipped: "secondary",
};

export default function AdminPartnerReportsTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewing, setViewing] = useState<Draft | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  // Explore (besök per partner) – default: senaste 90 dagarna t.o.m. idag
  const today = new Date();
  const defaultStart = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const defaultEnd = today.toISOString().slice(0, 10);
  const [exploreStart, setExploreStart] = useState(defaultStart);
  const [exploreEnd, setExploreEnd] = useState(defaultEnd);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [explorePartners, setExplorePartners] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "list", token },
    });
    setLoading(false);
    if (error || data?.error) {
      toast({ title: "Kunde inte hämta", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    setDrafts(data.drafts || []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const callAction = async (action: string, body: any = {}, label = "Klart") => {
    setBusy(action);
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action, token, ...body },
    });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Fel", description: data?.error || error?.message, variant: "destructive" });
      return null;
    }
    toast({ title: label });
    await load();
    return data;
  };

  const syncSnitcher = async () => {
    setBusy("sync");
    const { data, error } = await supabase.functions.invoke("sync-snitcher-visits", { body: { daysBack: 35 } });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Snitcher-synk misslyckades", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Snitcher synkad", description: `${data.sessionsUpserted} sessioner från ${data.orgsScanned} företag.` });
    }
  };

  const loadExplore = async () => {
    if (!token) return;
    setExploreLoading(true);
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "explore", token, period_start: exploreStart, period_end: exploreEnd },
    });
    setExploreLoading(false);
    if (error || data?.error) {
      toast({ title: "Kunde inte hämta besök", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    setExplorePartners(data.partners || []);
  };

  useEffect(() => { loadExplore(); /* eslint-disable-next-line */ }, [token]);

  const toggleExpanded = (slug: string) => {
    const next = new Set(expanded);
    next.has(slug) ? next.delete(slug) : next.add(slug);
    setExpanded(next);
  };

  const openPreview = async (d: Draft) => {
    setViewing(d);
    setPreviewHtml("");
    const { data } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "preview-html", token, id: d.id },
    });
    if (data?.html) setPreviewHtml(data.html);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const sendSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Skicka ${selected.size} mejl?`)) return;
    await callAction("send", { ids: Array.from(selected) }, "Utskick startat");
    setSelected(new Set());
  };

  const updateDraft = async (patch: Partial<Draft>) => {
    if (!viewing) return;
    await callAction("update", { id: viewing.id, ...patch }, "Sparat");
    setViewing({ ...viewing, ...patch } as Draft);
  };

  const toggleExclude = async (orgUuid: string) => {
    if (!viewing) return;
    const set = new Set(viewing.excluded_organisation_uuids || []);
    set.has(orgUuid) ? set.delete(orgUuid) : set.add(orgUuid);
    await updateDraft({ excluded_organisation_uuids: Array.from(set) });
    await openPreview({ ...viewing, excluded_organisation_uuids: Array.from(set) });
  };

  const filteredExplore = showFeaturedOnly ? explorePartners.filter(p => p.is_featured) : explorePartners;
  const totalCompanies = filteredExplore.reduce((s, p) => s + p.companies.length, 0);

  return (
    <div className="space-y-6">
    <MonthlyStatsReportCard />
    <Card>
      <CardHeader>
        <CardTitle>Företag som besökt partnerprofiler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Från</label>
            <Input type="date" value={exploreStart} onChange={e => setExploreStart(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Till</label>
            <Input type="date" value={exploreEnd} onChange={e => setExploreEnd(e.target.value)} className="w-40" />
          </div>
          <Button onClick={loadExplore} disabled={exploreLoading} size="sm">
            {exploreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Uppdatera</span>
          </Button>
          <label className="flex items-center gap-2 text-sm ml-2">
            <Checkbox checked={showFeaturedOnly} onCheckedChange={(v) => setShowFeaturedOnly(!!v)} />
            Endast publicerade partners
          </label>
          <div className="ml-auto text-sm text-muted-foreground">
            {filteredExplore.length} partners • {totalCompanies} företag totalt
          </div>
        </div>

        {exploreLoading ? (
          <div className="py-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Laddar…</div>
        ) : filteredExplore.length === 0 ? (
          <div className="py-8 px-4 text-center text-muted-foreground text-sm space-y-2 border border-dashed rounded-lg">
            <p className="font-medium text-foreground">Inga Snitcher-data hittades för perioden {exploreStart} → {exploreEnd}.</p>
            <p>Möjliga orsaker:</p>
            <ul className="text-left max-w-md mx-auto list-disc pl-5 space-y-1">
              <li>Inga identifierade företagsbesök på partnerprofiler under perioden.</li>
              <li>Snitcher-synken har inte körts ännu — klicka <strong>Synka Snitcher</strong> i sektionen nedan.</li>
              <li>Slutdatumet ligger före senaste synkade session.</li>
            </ul>
            <p className="pt-2">Tips: prova en <strong>längre period</strong> (t.ex. senaste 6 månaderna) eller flytta fram slutdatumet till idag.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                const t = new Date();
                setExploreStart(new Date(t.getFullYear(), t.getMonth() - 6, 1).toISOString().slice(0, 10));
                setExploreEnd(t.toISOString().slice(0, 10));
              }}
            >
              Sätt period till senaste 6 månaderna
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExplore.map(p => {
              const isOpen = expanded.has(p.partner_slug);
              return (
                <div key={p.partner_slug} className="border rounded-lg">
                  <button
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/30 text-left"
                    onClick={() => toggleExpanded(p.partner_slug)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{p.partner_name}</span>
                      {!p.is_featured && <Badge variant="outline" className="text-xs">ej publicerad</Badge>}
                      <span className="text-xs text-muted-foreground">/partner/{p.partner_slug}</span>
                    </div>
                    <Badge>{p.companies.length} företag</Badge>
                  </button>
                  {isOpen && (
                    <div className="border-t divide-y">
                      {p.companies.map((c: any) => (
                        <div key={c.organisation_uuid} className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="font-medium text-sm">{c.company_name || "Okänt"}</div>
                              <div className="text-xs text-muted-foreground">
                                {[c.company_domain, c.company_industry, c.company_size, c.company_country].filter(Boolean).join(" • ")}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                              {c.last_seen && <div>Senast: {new Date(c.last_seen).toLocaleDateString("sv-SE")}</div>}
                              <div>{c.profile_urls.length} profilbesök • {c.other_urls.length} andra</div>
                            </div>
                          </div>
                          {c.profile_urls.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Profil-URL:er</div>
                              <ul className="text-xs space-y-0.5">
                                {c.profile_urls.map((u: string) => (
                                  <li key={u}><a href={u} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{u}</a></li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {c.other_urls.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Andra sidor i samma session</div>
                              <ul className="text-xs space-y-0.5 max-h-48 overflow-y-auto">
                                {c.other_urls.map((u: string) => (
                                  <li key={u}><a href={u} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary hover:underline break-all">{u}</a></li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <CardTitle>Månadsrapporter till partners</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={syncSnitcher} disabled={busy === "sync"}>
            {busy === "sync" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Synka Snitcher</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => callAction("generate", {}, "Utkast genererade")} disabled={busy === "generate"}>
            {busy === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span className="ml-2">Generera utkast (förra månaden)</span>
          </Button>
          <Button size="sm" onClick={sendSelected} disabled={selected.size === 0 || busy === "send"}>
            {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="ml-2">Skicka markerade ({selected.size})</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" />Laddar…</div>
        ) : drafts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground space-y-2">
            <p>Inga utkast än.</p>
            <p className="text-sm">Klicka <strong>Synka Snitcher</strong> först, sedan <strong>Generera utkast</strong>.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {drafts.map(d => (
              <div key={d.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30">
                <Checkbox
                  checked={selected.has(d.id)}
                  onCheckedChange={() => toggleSelect(d.id)}
                  disabled={d.status === "sent"}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{d.partner_name}</span>
                    <Badge variant={statusVariant[d.status] || "default"}>{d.status}</Badge>
                    <span className="text-xs text-muted-foreground">{d.period_start} → {d.period_end}</span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {d.recipient_email || <em>saknar mottagare</em>} • {d.companies?.length || 0} företag
                    {d.error_message && <span className="text-destructive ml-2">⚠ {d.error_message}</span>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openPreview(d)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={async () => {
                  if (confirm(`Radera utkast för ${d.partner_name}?`)) await callAction("delete", { id: d.id }, "Raderat");
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.partner_name} — {viewing?.period_start}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mottagare</label>
                  <Input
                    defaultValue={viewing.recipient_email || ""}
                    onBlur={(e) => e.target.value !== viewing.recipient_email && updateDraft({ recipient_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ämne</label>
                  <Input
                    defaultValue={viewing.subject}
                    onBlur={(e) => e.target.value !== viewing.subject && updateDraft({ subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Intro-text</label>
                  <Textarea
                    rows={5}
                    defaultValue={viewing.intro_text || ""}
                    onBlur={(e) => e.target.value !== viewing.intro_text && updateDraft({ intro_text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Företag i rapporten ({viewing.companies?.length || 0})</label>
                  <div className="space-y-1 max-h-72 overflow-y-auto border rounded p-2">
                    {(viewing.companies || []).map((c: any) => {
                      const excluded = viewing.excluded_organisation_uuids?.includes(c.organisation_uuid);
                      return (
                        <label key={c.organisation_uuid} className={`flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer ${excluded ? "opacity-50 line-through" : ""}`}>
                          <Checkbox checked={!excluded} onCheckedChange={() => toggleExclude(c.organisation_uuid)} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{c.company_name || "Okänt"}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {[c.company_domain, c.company_industry, c.company_size].filter(Boolean).join(" • ")} • {c.visit_count} besök
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-slate-900">
                <iframe
                  title="Förhandsvisning"
                  srcDoc={previewHtml}
                  className="w-full h-[70vh] bg-white"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
    </div>
  );
}
