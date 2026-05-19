import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowDown, ArrowUp, Minus } from "lucide-react";

interface SeoRanking {
  id: string;
  keyword: string;
  month: string; // YYYY-MM-DD (first of month)
  position: number | null;
  ctr: number | null;
  impressions: number | null;
  clicks: number | null;
  index_status: "indexed" | "not_indexed" | "partial";
  target_url: string | null;
  notes: string | null;
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const empty = (): Partial<SeoRanking> => ({
  keyword: "",
  month: new Date().toISOString().slice(0, 7), // YYYY-MM
  position: null,
  ctr: null,
  impressions: null,
  clicks: null,
  index_status: "indexed",
  target_url: "",
  notes: "",
});

const fmtMonth = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const statusLabel: Record<SeoRanking["index_status"], { text: string; cls: string }> = {
  indexed: { text: "Indexerad", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  partial: { text: "Delvis", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  not_indexed: { text: "Ej indexerad", cls: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30" },
};

export default function AdminSeoRankingsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<SeoRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<SeoRanking> | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-seo-rankings`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list`, { headers: headers() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      setRows(data.rankings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=save`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(editing),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte spara");
      toast({ title: "Sparat", description: "Mätningen har sparats." });
      setEditing(null);
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort denna mätning?")) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) throw new Error("Kunde inte ta bort");
      toast({ title: "Borttagen" });
      load();
    } catch (err: any) {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    }
  };

  // Group by keyword, sort each by month asc; pre-compute month-over-month delta.
  const grouped = useMemo(() => {
    const map = new Map<string, SeoRanking[]>();
    for (const r of rows) {
      if (!map.has(r.keyword)) map.set(r.keyword, []);
      map.get(r.keyword)!.push(r);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => a.month.localeCompare(b.month));
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rows]);

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold">Rankningspanel</h3>
            <p className="text-sm text-muted-foreground">
              Manuell uppföljning av prioriterade sökord — position, CTR och indexering månad för månad.
            </p>
          </div>
          <Button onClick={() => setEditing(empty())}>
            <Plus className="h-4 w-4 mr-2" /> Ny mätning
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Laddar…</p>
        ) : grouped.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Inga mätningar ännu. Lägg till första månadens position för ditt prioriterade sökord.
          </p>
        ) : (
          <div className="space-y-6">
            {grouped.map(([keyword, list]) => {
              const latest = list[list.length - 1];
              const prev = list.length > 1 ? list[list.length - 2] : null;
              const delta =
                latest?.position != null && prev?.position != null
                  ? prev.position - latest.position // positive => moved up (better)
                  : null;
              return (
                <div key={keyword} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 bg-muted/40 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold">{keyword}</span>
                      <Badge variant="outline" className={statusLabel[latest.index_status].cls}>
                        {statusLabel[latest.index_status].text}
                      </Badge>
                      {latest.position != null && (
                        <span className="text-sm text-muted-foreground">
                          Senaste position: <strong className="text-foreground">{latest.position}</strong>
                        </span>
                      )}
                      {delta != null && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"
                          }`}
                        >
                          {delta > 0 ? <ArrowUp className="h-3 w-3" /> : delta < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          {Math.abs(delta).toFixed(1)} pos vs föregående månad
                        </span>
                      )}
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Månad</TableHead>
                        <TableHead className="text-right">Position</TableHead>
                        <TableHead className="text-right">CTR (%)</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                        <TableHead className="text-right">Klick</TableHead>
                        <TableHead>Indexering</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Åtgärder</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...list].reverse().map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="whitespace-nowrap">{fmtMonth(r.month)}</TableCell>
                          <TableCell className="text-right tabular-nums">{r.position ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums">{r.ctr ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums">{r.impressions ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums">{r.clicks ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusLabel[r.index_status].cls}>
                              {statusLabel[r.index_status].text}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                            {r.target_url || "—"}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button variant="ghost" size="icon" onClick={() => setEditing({ ...r, month: r.month.slice(0, 7) })}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => remove(r.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Redigera mätning" : "Ny mätning"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Sökord *</Label>
                    <Input
                      value={editing.keyword || ""}
                      onChange={(e) => setEditing({ ...editing, keyword: e.target.value })}
                      placeholder="microsoft dynamics sales"
                    />
                  </div>
                  <div>
                    <Label>Månad *</Label>
                    <Input
                      type="month"
                      value={(editing.month || "").slice(0, 7)}
                      onChange={(e) => setEditing({ ...editing, month: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Indexering</Label>
                    <Select
                      value={editing.index_status || "indexed"}
                      onValueChange={(v) => setEditing({ ...editing, index_status: v as any })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indexed">Indexerad</SelectItem>
                        <SelectItem value="partial">Delvis</SelectItem>
                        <SelectItem value="not_indexed">Ej indexerad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      type="number" step="0.1"
                      value={editing.position ?? ""}
                      onChange={(e) => setEditing({ ...editing, position: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>CTR (%)</Label>
                    <Input
                      type="number" step="0.01"
                      value={editing.ctr ?? ""}
                      onChange={(e) => setEditing({ ...editing, ctr: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Impressions</Label>
                    <Input
                      type="number"
                      value={editing.impressions ?? ""}
                      onChange={(e) => setEditing({ ...editing, impressions: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Klick</Label>
                    <Input
                      type="number"
                      value={editing.clicks ?? ""}
                      onChange={(e) => setEditing({ ...editing, clicks: e.target.value === "" ? null : Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Mål-URL</Label>
                    <Input
                      value={editing.target_url || ""}
                      onChange={(e) => setEditing({ ...editing, target_url: e.target.value })}
                      placeholder="/d365sales/"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Anteckningar</Label>
                    <Textarea
                      rows={2}
                      value={editing.notes || ""}
                      onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
              <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
