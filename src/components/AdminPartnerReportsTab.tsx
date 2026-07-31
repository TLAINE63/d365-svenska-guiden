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
import PartnerStatsMatrix from "@/components/PartnerStatsMatrix";
import { useAdminPartners } from "@/hooks/useAdminPartners";

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
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState<string>(() => localStorage.getItem("partner_report_test_email") || "");
  const [sendingTest, setSendingTest] = useState(false);

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
    if (!token) {
      toast({ title: "Saknar admin-session", variant: "destructive" });
      return;
    }
    setBusy("sync");
    const { data, error } = await supabase.functions.invoke("sync-snitcher-visits", { body: { token, maxPages: 50 } });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Snitcher-synk misslyckades", description: data?.error || error?.message, variant: "destructive" });
    } else {
      toast({ title: "Snitcher synkad", description: `${data.upserted} företag uppdaterade (${data.orgsWithPartnerVisit} med partnerbesök).` });
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

  const sendSelectedForApproval = async () => {
    if (selected.size === 0) return;
    const to = "thomas.laine@dynamicfactory.se";
    if (!confirm(`Skicka ${selected.size} rapport(er) till ${to} för godkännande?\n\nDrafts förblir orörda — du kan skicka skarpt efter granskning.`)) return;
    setBusy("approval");
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "send-test-batch", token, ids: Array.from(selected), test_email: to },
    });
    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Fel", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    const okCount = (data.results || []).filter((r: any) => r.ok).length;
    toast({ title: "Skickat för godkännande", description: `${okCount}/${selected.size} skickade till ${to}` });
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
    <PartnerStatsMatrix token={token} />
    <MonthlyStatsReportCard token={token} />
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
          <Button variant="outline" size="sm" onClick={sendSelectedForApproval} disabled={selected.size === 0 || busy === "approval"}>
            {busy === "approval" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            <span className="ml-2">Skicka markerade till mig för godkännande</span>
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
            <DialogTitle>{viewing?.partner_name} — {viewing?.period_start} → {viewing?.period_end}</DialogTitle>
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
              <div className="space-y-3">
                <div className="flex flex-wrap items-end gap-2 p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-medium block mb-1">Skicka testmejl till</label>
                    <Input
                      type="email"
                      placeholder="din@email.se"
                      value={testEmail}
                      onChange={(e) => {
                        setTestEmail(e.target.value);
                        localStorage.setItem("partner_report_test_email", e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={sendingTest || !testEmail || !viewing}
                    onClick={async () => {
                      if (!viewing || !testEmail) return;
                      setSendingTest(true);
                      const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
                        body: { action: "send-test", token, id: viewing.id, test_email: testEmail },
                      });
                      setSendingTest(false);
                      if (error || data?.error) {
                        toast({ title: "Kunde inte skicka test", description: data?.error || error?.message, variant: "destructive" });
                      } else {
                        toast({ title: "Testmejl skickat", description: `Skickat till ${testEmail}` });
                      }
                    }}
                  >
                    {sendingTest ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Skicka test
                  </Button>
                  <div className="flex gap-1 ml-auto">
                    <Button
                      size="sm"
                      variant={previewDevice === "desktop" ? "default" : "outline"}
                      onClick={() => setPreviewDevice("desktop")}
                    >Desktop</Button>
                    <Button
                      size="sm"
                      variant={previewDevice === "mobile" ? "default" : "outline"}
                      onClick={() => setPreviewDevice("mobile")}
                    >Mobil</Button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden bg-slate-900 flex justify-center">
                  <iframe
                    title="Förhandsvisning"
                    srcDoc={previewHtml}
                    className="bg-white h-[70vh]"
                    style={{ width: previewDevice === "mobile" ? 390 : "100%", maxWidth: "100%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tips: skicka ett testmejl till din egen adress för att se exakt hur det renderas i Gmail/Outlook innan du skickar till partnern.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
    </div>
  );
}

const THOMAS_EMAIL = "thomas.laine@dynamicfactory.se";
type SendMode = "partner" | "thomas" | "both";

function MonthlyStatsReportCard({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<"dry" | SendMode | null>(null);
  const [partnerSlug, setPartnerSlug] = useState("");
  const [days, setDays] = useState(30);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [lastSummary, setLastSummary] = useState<any>(null);
  const [lastResults, setLastResults] = useState<any[] | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Editorial content stored in site_settings
  const [changelog, setChangelog] = useState("");
  const [nextPeriod, setNextPeriod] = useState("");
  const [contact, setContact] = useState("");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data } = await supabase.functions.invoke("manage-partner-reports", {
        body: { action: "get_monthly_report_settings", token },
      });
      const map = (data?.settings || {}) as Record<string, string>;
      setChangelog(map["monthly_report_changelog"] || "");
      setNextPeriod(map["monthly_report_next_period"] || "");
      setContact(map["monthly_report_contact"] || "");
      setSettingsLoaded(true);
    })();
  }, [token]);

  const saveSetting = async (key: string, value: string) => {
    if (!token) return;
    setSavingKey(key);
    const { data, error } = await supabase.functions.invoke("manage-partner-reports", {
      body: { action: "save_monthly_report_setting", token, key, value },
    });
    setSavingKey(null);
    if (error || data?.error) toast({ title: "Kunde inte spara", description: data?.error || error?.message, variant: "destructive" });
    else toast({ title: "Sparat" });
  };


  const { data: partners = [] } = useAdminPartners(token);
  const sortedPartners = [...partners].sort((a: any, b: any) => (a.name || "").localeCompare(b.name || "", "sv"));
  const selectedPartner = sortedPartners.find((p: any) => p.slug === partnerSlug);


  const invoke = async (
    busyKey: "dry" | SendMode,
    dryRun: boolean,
    extras: { overrideRecipient?: string; extraRecipients?: string[] } = {},
  ) => {
    if (!token) {
      toast({ title: "Inloggning krävs", description: "Logga in som admin för att köra rapport.", variant: "destructive" });
      return;
    }
    setBusy(busyKey);
    setLastSummary(null);
    setLastResults(null);
    if (dryRun) setPreviewHtml(null);
    const { data, error } = await supabase.functions.invoke("send-partner-monthly-report", {
      body: {
        token,
        dryRun,
        days,
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
        partnerSlug: partnerSlug.trim() || undefined,
        ...extras,
      },
    });

    setBusy(null);
    if (error || data?.error) {
      toast({ title: "Fel", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    setLastSummary(data.summary);
    setLastResults(data.results || null);
    if (dryRun && data.results?.[0]?.html) {
      setPreviewHtml(data.results[0].html);
    }
    const recipientsLabel = !dryRun && data.results?.length
      ? data.results.map((r: any) => (r.recipients || [r.recipient]).filter(Boolean).join(", ")).filter(Boolean).join(" · ")
      : "";
    toast({
      title: dryRun ? "Förhandsgranskning klar" : "Rapport skickad",
      description: dryRun
        ? `${data.summary.preview} förhandsgranskning(ar) · ${data.summary.skipped} hoppades över`
        : `${data.summary.sent} skickade · ${data.summary.skipped} hoppades över · ${data.summary.failed} misslyckades${recipientsLabel ? ` → ${recipientsLabel}` : ""}`,
    });
  };

  const sendTo = (mode: SendMode) => {
    if (mode === "partner") return invoke("partner", false);
    if (mode === "thomas") return invoke("thomas", false, { overrideRecipient: THOMAS_EMAIL });
    return invoke("both", false, { extraRecipients: [THOMAS_EMAIL] });
  };

  const isBusy = busy !== null;
  const singlePartnerMode = !!partnerSlug;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Månadsrapport per partner (statistik)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Månadsrapport enligt ny mall: siffror med jämförelse mot föregående period, "Vilka tittade", "Var ni syntes" samt redaktionella sektioner "Nästa period" och "Nytt på sajten" (redigeras nedan).
          Lämna specifik period tom för att använda senaste {days} dagarna; föregående period beräknas alltid till lika lång bakåt.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs font-medium block mb-1">Period (dagar)</label>
            <Input type="number" min={1} max={365} value={days} onChange={e => setDays(parseInt(e.target.value) || 30)} className="w-28" disabled={!!(periodStart && periodEnd)} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Från (valfritt)</label>
            <Input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Till (valfritt)</label>
            <Input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-40" />
          </div>
          {(periodStart || periodEnd) && (
            <Button variant="ghost" size="sm" onClick={() => { setPeriodStart(""); setPeriodEnd(""); }}>Rensa datum</Button>
          )}

          <div className="flex-1 min-w-[280px]">
            <label className="text-xs font-medium block mb-1">Välj partner (valfritt)</label>
            <div className="flex gap-2">
              <select
                value={partnerSlug}
                onChange={e => setPartnerSlug(e.target.value)}
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— Alla publicerade partners —</option>
                {sortedPartners.map((p: any) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}{p.is_featured ? "" : " (ej publicerad)"}
                  </option>
                ))}
              </select>
              {partnerSlug && (
                <Button variant="ghost" size="sm" onClick={() => setPartnerSlug("")}>Rensa</Button>
              )}
            </div>
            {selectedPartner && (
              <p className="text-xs text-muted-foreground mt-1">
                Slug: <code>{selectedPartner.slug}</code>
                {selectedPartner.admin_contact_email && <> · admin: {selectedPartner.admin_contact_email}</>}
              </p>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
          <div>
            <h3 className="text-sm font-semibold">Redaktionellt innehåll i rapporten</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Punktlistor: skriv en rad per punkt, inled med <code>-</code>. Sparas globalt och används i alla rapporter tills du ändrar dem.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Nästa period (kommande publiceringar, uppmaningar)</label>
            <Textarea
              rows={5}
              placeholder={"- Kostnadsartikeln om ... publiceras i ...\n- Partneröversikten publiceras i november: verifierade profiler får utökad plats.\n- Möjlighet till profilintervju för D365 Talks: hör av er om ni vill boka en tid."}
              value={nextPeriod}
              onChange={(e) => setNextPeriod(e.target.value)}
              disabled={!settingsLoaded}
            />
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => saveSetting("monthly_report_next_period", nextPeriod)} disabled={savingKey === "monthly_report_next_period"}>
              {savingKey === "monthly_report_next_period" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
              Spara
            </Button>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Nytt på sajten (changelog för perioden)</label>
            <Textarea
              rows={6}
              placeholder={"- Nytt: Behovsanalys för Kundservice.\n- Förbättrad ranking av partners baserat på bransch.\n- Möjlighet att skicka underlag direkt till 2–3 matchande partners."}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              disabled={!settingsLoaded}
            />
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => saveSetting("monthly_report_changelog", changelog)} disabled={savingKey === "monthly_report_changelog"}>
              {savingKey === "monthly_report_changelog" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
              Spara
            </Button>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Kontaktperson i rapporten</label>
            <Input
              placeholder="Thomas Laine, thomas.laine@d365.se"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={!settingsLoaded}
            />
            <Button size="sm" variant="secondary" className="mt-2" onClick={() => saveSetting("monthly_report_contact", contact)} disabled={savingKey === "monthly_report_contact"}>
              {savingKey === "monthly_report_contact" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
              Spara
            </Button>
          </div>
        </div>


        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={() => invoke("dry", true)} disabled={isBusy} variant="outline" size="sm">
            {busy === "dry" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Förhandsgranska
          </Button>
          <div className="w-full h-0" />
          <Button onClick={() => sendTo("partner")} disabled={isBusy} size="sm">
            {busy === "partner" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Skicka till partner
          </Button>
          <Button onClick={() => sendTo("thomas")} disabled={isBusy} size="sm" variant="secondary">
            {busy === "thomas" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Skicka till Thomas
          </Button>
          <Button onClick={() => sendTo("both")} disabled={isBusy} size="sm" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
            {busy === "both" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Skicka till partner + Thomas
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          "Partner" = partnerns admin-kontaktmejl (fallback: profilmejl). "Thomas" = {THOMAS_EMAIL}. info@d365.se BCC:as alltid.
        </p>

        {lastSummary && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="default">Skickade: {lastSummary.sent}</Badge>
            <Badge variant="secondary">Hoppades över: {lastSummary.skipped}</Badge>
            {lastSummary.failed > 0 && <Badge variant="destructive">Misslyckades: {lastSummary.failed}</Badge>}
            {lastSummary.preview > 0 && <Badge variant="outline">Förhandsgranskningar: {lastSummary.preview}</Badge>}
          </div>
        )}
        {lastResults && lastResults.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            {lastResults.slice(0, 10).map((r, i) => (
              <div key={i}>
                <strong>{r.partner}</strong> — {r.status}
                {r.recipients?.length ? ` → ${r.recipients.join(", ")}` : r.recipient ? ` → ${r.recipient}` : ""}
                {r.reason ? ` (${r.reason})` : ""}
              </div>
            ))}
          </div>
        )}
        {previewHtml && (
          <div className="border rounded-md overflow-hidden">
            <div className="px-3 py-2 bg-muted text-xs font-medium">Förhandsgranskning</div>
            <iframe srcDoc={previewHtml} className="w-full h-[600px] bg-white" title="Förhandsgranskning rapport" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

