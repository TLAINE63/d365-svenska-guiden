import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Subscriber, type NewsletterList, type NewsletterStatus } from "../../supabase/functions/_shared/newsletterModel";
import AdminNewsletterCard from "@/components/AdminNewsletterCard";

const labels: Record<NewsletterList, string> = { kopare: "Köpare", partner: "Partners", isv: "ISV" };
const statuses: Record<NewsletterStatus, string> = { vantar: "Väntar på bekräftelse", aktiv: "Aktiv", avregistrerad: "Avregistrerad" };
type Stats = { list: NewsletterList; active: number; new: number; unsubscribed: number };
export default function RedaktionNewsletterTab({ token, onSessionExpired }: { token: string | null; onSessionExpired: () => void }) {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats[]>([]);
  const [search, setSearch] = useState("");
  const [list, setList] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscription`;
  const load = useCallback(async () => {
    if (!token) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch(`${base}?action=list`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 401) { onSessionExpired(); return; }
      if (!response.ok) throw new Error();
      const data = await response.json(); setRows(data.rows || []); setStats(data.stats || []);
    } catch { setError("Listorna kunde inte hämtas. Försök igen."); }
    finally { setBusy(false); }
  }, [token, base, onSessionExpired]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [search, list, status]);
  const filtered = useMemo(() => rows.filter(r => (list === "all" || r.list === list) && (status === "all" || r.status === status) && [r.email, r.first_name, r.last_name, r.company, r.title, r.partner_slug, r.isv_slug].some(v => v?.toLocaleLowerCase("sv").includes(search.toLocaleLowerCase("sv")))), [rows, list, status, search]);
  const download = async () => {
    setError(null);
    try {
      const response = await fetch(`${base}?action=csv`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 401) { onSessionExpired(); return; }
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob()); const a = document.createElement("a"); a.href = url; a.download = "prenumeranter.csv"; a.click(); URL.revokeObjectURL(url);
    } catch { setError("Exporten kunde inte hämtas."); }
  };
  return (
    <section className="space-y-6 min-w-0">
      <div className="flex justify-between gap-3 flex-wrap"><h2 className="text-2xl font-semibold">Nyhetsbrev</h2><div className="flex gap-2"><Button variant="outline" size="icon" onClick={load} disabled={busy} aria-label="Uppdatera listorna" title="Uppdatera listorna"><RefreshCw className="h-4 w-4" /></Button><Button variant="outline" onClick={download}><Download className="h-4 w-4 mr-2" />Prenumeranter CSV</Button></div></div>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-4">{stats.map(s => <div key={s.list} className="border border-border bg-card rounded-lg p-5"><h3 className="font-semibold">{labels[s.list]}</h3><p className="text-3xl font-bold my-2">{s.active}<span className="text-sm font-normal text-muted-foreground ml-2">aktiva</span></p><p className="text-sm text-muted-foreground">Senaste 30 dagarna: {s.new} nya, {s.unsubscribed} avregistrerade</p></div>)}</div>
      <div className="grid gap-3 sm:grid-cols-3"><Input aria-label="Sök prenumeranter" placeholder="Sök e-post, namn eller företag" value={search} onChange={e => setSearch(e.target.value)} /><Select value={list} onValueChange={setList}><SelectTrigger aria-label="Lista"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alla listor</SelectItem>{Object.entries(labels).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alla statusar</SelectItem>{Object.entries(statuses).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
      <div className="overflow-x-auto border-y border-border"><table className="w-full text-sm text-left"><thead><tr className="bg-muted"><th className="p-3">E-post / namn</th><th className="p-3">Företag</th><th className="p-3">Lista</th><th className="p-3">Status</th><th className="p-3">Anmäld</th><th className="p-3">Avregistrerad</th></tr></thead><tbody>{filtered.slice(page * 50, page * 50 + 50).map(r => <tr key={r.id} className="border-t border-border"><td className="p-3 break-all">{r.email}<span className="block text-muted-foreground">{[r.first_name, r.last_name].filter(Boolean).join(" ")}</span></td><td className="p-3">{r.company || ""}</td><td className="p-3">{labels[r.list]}</td><td className="p-3">{statuses[r.status]}</td><td className="p-3 whitespace-nowrap">{r.subscribed_at.slice(0,10)}</td><td className="p-3 whitespace-nowrap">{r.unsubscribed_at?.slice(0,10) || ""}</td></tr>)}</tbody></table></div>
      {!busy && !filtered.length && <p className="text-muted-foreground">Inga prenumeranter matchar urvalet.</p>}
      <div className="flex gap-3 items-center flex-wrap"><span className="text-sm text-muted-foreground">{filtered.length} prenumerationer</span><Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Föregående</Button><Button variant="outline" disabled={(page + 1) * 50 >= filtered.length} onClick={() => setPage(page + 1)}>Nästa</Button></div>
      <details className="border-t border-border pt-5"><summary className="font-semibold cursor-pointer">Partnerbrev</summary><div className="pt-4"><AdminNewsletterCard token={token} /></div></details>
    </section>
  );
}
