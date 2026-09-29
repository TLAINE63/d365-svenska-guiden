import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, RefreshCw, Wand2, Check, X, HelpCircle } from "lucide-react";

interface Props { token: string | null; onSessionExpired?: () => void }
const TITLES: Record<string, string> = {
  base: "Grunduppgifter", migration: "Migreringserfarenhet", competency: "Business Central-kompetens",
  project_type: "Typiska projekt", delivery_model: "Leveransmodell", capability: "Tvärgående förmågor", industry_solution: "Branschlösning",
};
const QUALITY: Record<string, string> = { confirmed: "Bekräftad", partner: "Partneruppgift", public: "Publik källa" };
const CHANGE: Record<string, string> = { confirm: "Bekräftelse", add: "Tillägg", remove: "Borttag" };

/** Partner Review Queue + Partner Review Approvals + statistik. Endast administration. */
export default function AdminPartnerReviewTab({ token, onSessionExpired }: Props) {
  const call = useCallback(async (action: string, body: unknown = {}) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-partner-master?action=${action}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 401) { onSessionExpired?.(); throw new Error("Sessionen har gått ut"); }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Något gick fel");
    return data;
  }, [token, onSessionExpired]);

  const [overview, setOverview] = useState<any>(null);
  const [changes, setChanges] = useState<any[]>([]);
  const [status, setStatus] = useState("pending");
  const [detail, setDetail] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const loadOverview = useCallback(async () => {
    try { setOverview(await call("review-overview")); } catch (e: any) { toast.error(e.message); }
  }, [call]);
  const loadChanges = useCallback(async () => {
    try { setChanges((await call("review-changes", { status })).changes || []); } catch (e: any) { toast.error(e.message); }
  }, [call, status]);
  useEffect(() => { if (token) loadOverview(); }, [token, loadOverview]);
  useEffect(() => { if (token) loadChanges(); }, [token, loadChanges]);

  const openPartner = async (id: string) => {
    try { setDetail(await call("review-partner", { partner_id: id })); } catch (e: any) { toast.error(e.message); }
  };
  const prefill = async (partner_id?: string) => {
    setBusy(true);
    try {
      const r = await call("review-prefill", partner_id ? { partner_id } : { all: true });
      toast.success(`${r.created || 0} förslag förifyllda`);
      await loadOverview();
      if (partner_id) await openPartner(partner_id);
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  const decide = async (id: string, decision: string) => {
    try {
      await call("review-decide", { id, decision, note: notes[id] || null });
      toast.success(decision === "approve" ? "Godkänd" : decision === "reject" ? "Avvisad" : "Förtydligande begärt");
      await Promise.all([loadChanges(), loadOverview()]);
    } catch (e: any) { toast.error(e.message); }
  };

  if (!token) return null;
  const s = overview?.stats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Verifierade partner", s?.verified_partners],
          ["Komplett BC-profil", s ? `${s.complete_bc_profiles} / ${s.bc_partners}` : undefined],
          ["Saknade kompetensområden", s?.missing_competences],
          ["Väntande granskningar", s?.pending_reviews],
        ].map(([label, v]) => (
          <Card key={String(label)}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{v ?? "–"}</p>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Partner Review Queue</TabsTrigger>
          <TabsTrigger value="approvals">Partner Review Approvals {s?.pending_reviews ? `(${s.pending_reviews})` : ""}</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Partner Review Queue</CardTitle>
                <CardDescription>Verifierade partner. A = bekräftat, B = förifyllt och kräver partnerbekräftelse, C = saknas.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={loadOverview}><RefreshCw className="w-4 h-4" /></Button>
                <Button size="sm" onClick={() => prefill()} disabled={busy}>
                  {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Wand2 className="w-4 h-4 mr-1" />}Förifyll alla
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!overview ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-muted-foreground border-b border-border">
                      <th className="py-2">Partner</th><th>Senast verifierad</th><th>Bekräftade (A)</th><th>Bekräftelse krävs (B)</th><th>Saknas (C)</th><th>Profilstatus</th><th></th>
                    </tr></thead>
                    <tbody>
                      {overview.rows.map((r: any) => (
                        <tr key={r.partner_id} className="border-b border-border/60">
                          <td className="py-2 font-medium">{r.name}{!r.has_bc && <span className="text-xs text-muted-foreground"> (ej BC)</span>}</td>
                          <td>{r.last_verified_at || "–"}</td>
                          <td>{r.counts.A}</td><td>{r.counts.B}</td><td>{r.counts.C}</td>
                          <td><Badge variant={r.profile_status === "Komplett" ? "secondary" : "outline"}>{r.profile_status}</Badge></td>
                          <td className="text-right"><Button size="sm" variant="ghost" onClick={() => openPartner(r.partner_id)}>Visa</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {detail && (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{detail.partner.name}</CardTitle>
                  <CardDescription>Status: {detail.profile_status} · A {detail.counts.A} · B {detail.counts.B} · C {detail.counts.C}</CardDescription>
                </div>
                <Button size="sm" variant="outline" disabled={busy || !detail.partner.has_bc} onClick={() => prefill(detail.partner.id)}>
                  <Wand2 className="w-4 h-4 mr-1" /> Kör förifyllning
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {detail.items.map((i: any) => (
                  <div key={`${i.dimension}:${i.key}`} className="flex flex-wrap items-baseline gap-2 border-b border-border/50 pb-1">
                    <Badge variant={i.klass === "A" ? "secondary" : "outline"}>{i.klass}</Badge>
                    <span className="text-muted-foreground">{TITLES[i.dimension]}:</span> <span>{i.label}</span>
                    <span className="text-xs text-muted-foreground">{QUALITY[i.quality]} · {i.source}{i.excerpt ? ` · ${i.excerpt}` : ""}</span>
                  </div>
                ))}
                {detail.missing.length > 0 && (
                  <p><Badge variant="outline">C</Badge> Saknas: {detail.missing.map((d: string) => TITLES[d]).join(", ")}</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Partner Review Approvals</CardTitle>
                <CardDescription>Allt partnern har bekräftat, lagt till eller tagit bort. Inget publiceras förrän det godkänts här.</CardDescription>
              </div>
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Väntar</option><option value="clarification">Förtydligande begärt</option>
                <option value="approved">Godkända</option><option value="rejected">Avvisade</option>
              </select>
            </CardHeader>
            <CardContent>
              {changes.length === 0 ? <p className="text-sm text-muted-foreground">Inga ändringar.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-muted-foreground border-b border-border">
                      <th className="py-2">Partner</th><th>Fält</th><th>Nytt värde</th><th>Tidigare värde</th><th>Källa</th><th>Datum</th><th></th>
                    </tr></thead>
                    <tbody>
                      {changes.map((c) => (
                        <tr key={c.id} className="border-b border-border/60 align-top">
                          <td className="py-2 font-medium">{c.partner?.name}</td>
                          <td>{TITLES[c.dimension_key] || c.dimension_key}<br /><span className="text-xs text-muted-foreground">{CHANGE[c.change_type]}: {c.value_label}</span></td>
                          <td>{c.new_value}</td>
                          <td className="text-muted-foreground">{c.previous_value}</td>
                          <td>{c.source}</td>
                          <td className="whitespace-nowrap">{c.created_at?.slice(0, 10)}</td>
                          <td className="min-w-[16rem]">
                            {["pending", "clarification"].includes(c.status) ? (
                              <div className="space-y-1">
                                <Input className="h-8" placeholder="Kommentar (krävs för förtydligande)" value={notes[c.id] || ""}
                                  onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })} />
                                <div className="flex gap-1">
                                  <Button size="sm" onClick={() => decide(c.id, "approve")}><Check className="w-3.5 h-3.5 mr-1" />Godkänn</Button>
                                  <Button size="sm" variant="outline" onClick={() => decide(c.id, "reject")}><X className="w-3.5 h-3.5 mr-1" />Avvisa</Button>
                                  <Button size="sm" variant="ghost" onClick={() => decide(c.id, "clarify")}><HelpCircle className="w-3.5 h-3.5 mr-1" />Förtydliga</Button>
                                </div>
                                {c.editor_note && <p className="text-xs text-muted-foreground">Notering: {c.editor_note}</p>}
                              </div>
                            ) : <span className="text-xs text-muted-foreground">{c.reviewed_at?.slice(0, 10)} {c.editor_note || ""}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
