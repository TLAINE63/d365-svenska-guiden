import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Product { name: string; status: string; verified: boolean; open: number; total: number }
interface Row {
  id: string; name: string; slug: string; is_featured: boolean;
  information_status: string | null; information_verified_at: string | null;
  products: Product[]; last_submission: string | null; pending_changes: number; open: number; stale: boolean;
}

/** Snabbverifiering: en rad per partner med allt som väntar, och ett klick som verifierar allt. */
export default function RedaktionQuickVerify({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(true);

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

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows((await call("verify-queue")).rows || []); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); }
  }, [call]);
  useEffect(() => { if (token) void load(); }, [token, load]);

  const verify = async (r: Row) => {
    if (!window.confirm(`Verifiera och publicera alla profiluppgifter för ${r.name}?`)) return;
    setBusy(r.id);
    try {
      const d = await call("verify-all", { partner_id: r.id });
      toast.success(`${r.name} verifierad ${d.verified_at}`);
      await load();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  const list = useMemo(() => rows
    .filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()))
    .filter((r) => !onlyOpen || r.open > 0 || r.stale)
    .sort((a, b) => (b.last_submission || "").localeCompare(a.last_submission || "")), [rows, q, onlyOpen]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-accent" />Snabbverifiering</CardTitle>
        <CardDescription>
          En rad per partner. Senast inskickade överst. Knappen verifierar på en gång företaget, alla produktprofiler,
          kompetenser och förmågor samt väntande ändringar, och sätter dagens datum.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input placeholder="Sök partner" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />Visa bara de som behöver verifieras</label>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2"><RefreshCw className="h-4 w-4" />Uppdatera</Button>
        </div>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {!loading && list.length === 0 && <p className="text-sm text-muted-foreground">Inget väntar på verifiering.</p>}
        <ul className="divide-y divide-border rounded-md border border-border">
          {list.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  {r.information_status === "verified"
                    ? <Badge variant="secondary">Verifierad {r.information_verified_at ?? ""}</Badge>
                    : <Badge variant="outline">Ej verifierad</Badge>}
                  {r.stale && <Badge variant="destructive">Nytt inskick efter senaste verifiering</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Senaste inskick: {r.last_submission ? r.last_submission.slice(0, 10) : "inget"}
                  {r.pending_changes > 0 && ` · ${r.pending_changes} väntande ändringar`}
                </p>
                {r.products.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.products.map((p, i) => (
                      <Badge key={i} variant={p.verified && p.open === 0 ? "secondary" : "outline"} className="font-normal">
                        {p.name}: {p.verified && p.open === 0 ? "klar" : `${p.open} av ${p.total} att verifiera`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={() => verify(r)} disabled={busy === r.id} className="gap-2 shrink-0">
                {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Verifiera allt
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
