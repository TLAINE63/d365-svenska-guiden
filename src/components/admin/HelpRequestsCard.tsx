import { Fragment, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDateYYYYMMDD } from "@/lib/utils";
import { BOOKING_STATUSES, CASE_STATUSES } from "@/lib/advisory";
import { helpPathLabel, selectedNeed, selectedProducts } from "@/lib/helpRequests";

type Row = Record<string, any>;
interface Props { token: string | null; onSessionExpired: () => void }

const sel = "h-9 rounded-md border border-input bg-background px-2 text-sm";
const label = (list: readonly (readonly [string, string])[], v: string | null | undefined) => list.find(([k]) => k === v)?.[1] ?? v ?? "–";

/**
 * Ärenden från alla hjälpvägar (rådgivningsinskick). Visar valt behov och Dynamics 365-produkt
 * och låter admin och redaktion uppdatera ärendets status. Delas av admin och /redaktion.
 * Partnerintroduktioner görs fortfarande bara i adminvyn Rådgivning.
 */
export default function HelpRequestsCard({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("alla");
  const [status, setStatus] = useState("aktiva");
  const [site, setSite] = useState("alla");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, { next_step: string; notes: string }>>({});

  const call = async (action: string, payload: Record<string, unknown> = {}) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-advisory`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.status === 401) { onSessionExpired(); throw new Error("Sessionen har gått ut"); }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Något gick fel");
    return json;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try { setRows((await call("help_requests")).requests || []); }
    catch (e: any) { toast({ title: "Kunde inte hämta ärenden", description: e.message, variant: "destructive" }); }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const update = async (r: Row, payload: Record<string, unknown>) => {
    try {
      await call("update_help_status", { id: r.id, ...payload });
      toast({ title: "Sparat" });
      await load();
    } catch (e: any) { toast({ title: "Kunde inte spara", description: e.message, variant: "destructive" }); }
  };

  const enriched = useMemo(() => rows.map((r): Row => ({
    ...r,
    _path: r.advisory_placement || "plan",
    _need: selectedNeed(r.selection),
    _products: selectedProducts(r.selection, r.project),
  })), [rows]);

  const paths = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of enriched) m.set(r._path, (m.get(r._path) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [enriched]);

  const term = q.trim().toLowerCase();
  const list = enriched.filter((r) => {
    if (path !== "alla" && r._path !== path) return false;
    if (status === "aktiva" && r.case_status === "avslutad") return false;
    if (status !== "aktiva" && status !== "alla" && r.case_status !== status) return false;
    if (site !== "alla" && (r.source_site || "d365.se") !== site) return false;
    if (term && !`${r.company} ${r.contact_name} ${r.email} ${r._need ?? ""} ${r._products.join(" ")} ${r.help_with ?? ""}`.toLowerCase().includes(term)) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle as="h2" className="text-lg">Ärenden från hjälpvägarna</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Alla förfrågningar där besökaren bett d365.se om hjälp. Interna uppgifter, visas aldrig publikt och skickas inte till någon partner.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Uppdatera
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="hr-path" className="text-xs">Hjälpväg</Label>
            <select id="hr-path" className={`${sel} block`} value={path} onChange={(e) => setPath(e.target.value)}>
              <option value="alla">Alla ({enriched.length})</option>
              {paths.map(([p, n]) => <option key={p} value={p}>{helpPathLabel(p)} ({n})</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="hr-status" className="text-xs">Status</Label>
            <select id="hr-status" className={`${sel} block`} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="aktiva">Alla utom avslutade</option>
              <option value="alla">Alla</option>
              {CASE_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="hr-site" className="text-xs">Sajt</Label>
            <select id="hr-site" className={`${sel} block`} value={site} onChange={(e) => setSite(e.target.value)}>
              <option value="alla">Alla</option>
              <option value="d365.se">d365.se</option>
              <option value="businesscentral.se">businesscentral.se</option>
            </select>
          </div>
          <div className="min-w-[12rem] flex-1">
            <Label htmlFor="hr-q" className="text-xs">Sök</Label>
            <Input id="hr-q" className="h-9" placeholder="Företag, behov eller produkt" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {!loading && list.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">Inga ärenden matchar urvalet.</p>
        )}

        {list.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="p-2 w-6"><span className="sr-only">Visa</span></th>
                  <th className="p-2">Inkom</th>
                  <th className="p-2">Hjälpväg</th>
                  <th className="p-2">Valt behov</th>
                  <th className="p-2">Dynamics 365-produkt</th>
                  <th className="p-2">Företag</th>
                  <th className="p-2">Ärendestatus</th>
                  <th className="p-2">Bokning</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => {
                  const isOpen = open === r.id;
                  const d = draft[r.id] ?? { next_step: r.next_step ?? "", notes: r.notes ?? "" };
                  return (
                    <Fragment key={r.id}>
                      <tr className="border-t align-top">
                        <td className="p-2">
                          <button type="button" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen} aria-label={isOpen ? "Dölj detaljer" : "Visa detaljer"}>
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="p-2 whitespace-nowrap">{formatDateYYYYMMDD(r.created_at)}</td>
                        <td className="p-2">
                          {helpPathLabel(r._path)}
                          {r.source_site === "businesscentral.se" && <Badge variant="outline" className="ml-1 text-[10px]">businesscentral.se</Badge>}
                        </td>
                        <td className="p-2">{r._need ?? <span className="text-muted-foreground">Inget valt</span>}</td>
                        <td className="p-2">{r._products.length ? r._products.join(", ") : <span className="text-muted-foreground">Ingen vald</span>}</td>
                        <td className="p-2">{r.company}<span className="block text-xs text-muted-foreground">{r.contact_name}</span></td>
                        <td className="p-2">
                          {r.advisory_case_id ? (
                            <select aria-label="Ärendestatus" className={sel} value={r.case_status ?? "ny"} onChange={(e) => update(r, { status: e.target.value })}>
                              {CASE_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                          ) : <span className="text-muted-foreground">Inget ärende</span>}
                        </td>
                        <td className="p-2">
                          <select aria-label="Bokningsstatus" className={sel} value={r.booking_status ?? "forfragan"} onChange={(e) => update(r, { booking_status: e.target.value })}>
                            {BOOKING_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-t bg-muted/20">
                          <td />
                          <td colSpan={7} className="p-3">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <p><span className="font-medium">Kontakt:</span> {r.contact_name}, {r.email}{r.phone ? `, ${r.phone}` : ""}</p>
                                <p><span className="font-medium">Ämne:</span> {r.help_with || r.advisory_cta || "–"}</p>
                                {r.landing_page && <p className="text-xs text-muted-foreground">Sida: {r.landing_page}</p>}
                                {r.message && <p className="whitespace-pre-line"><span className="font-medium">Meddelande:</span> {r.message}</p>}
                                {r.project && Object.keys(r.project).length > 0 && (
                                  <div>
                                    <p className="font-medium">Delat underlag</p>
                                    {Object.entries(r.project).map(([k, v]) => (
                                      <div key={k} className="mt-1">
                                        <p className="text-xs font-semibold text-muted-foreground">{k}</p>
                                        <ul className="list-disc pl-5 text-xs">
                                          {(Array.isArray(v) ? v : [String(v)]).map((l: string, i: number) => <li key={i}>{l}</li>)}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {r.selection && Object.keys(r.selection).length > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    Val: {Object.entries(r.selection).map(([k, v]) => `${k}: ${String(v)}`).join(" · ")}
                                  </p>
                                )}
                              </div>
                              {r.advisory_case_id && (
                                <div className="space-y-2">
                                  <div>
                                    <Label htmlFor={`ns-${r.id}`}>Nästa steg</Label>
                                    <Input id={`ns-${r.id}`} value={d.next_step} onChange={(e) => setDraft({ ...draft, [r.id]: { ...d, next_step: e.target.value } })} />
                                  </div>
                                  <div>
                                    <Label htmlFor={`no-${r.id}`}>Interna anteckningar</Label>
                                    <Textarea id={`no-${r.id}`} rows={4} value={d.notes} onChange={(e) => setDraft({ ...draft, [r.id]: { ...d, notes: e.target.value } })} />
                                  </div>
                                  <Button size="sm" onClick={() => update(r, d)}>Spara anteckningar</Button>
                                  <p className="text-xs text-muted-foreground">
                                    Nuvarande status: {label(CASE_STATUSES, r.case_status)}. Introduktion till partner görs i adminvyn Rådgivning och kräver köparens godkännande.
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
