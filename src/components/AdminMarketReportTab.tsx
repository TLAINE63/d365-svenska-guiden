import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, BarChart3 } from "lucide-react";

interface MarketStat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  note: string;
  group_key: string;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
}

const GROUPS: { id: string; label: string }[] = [
  { id: "overblick", label: "Överblick" },
  { id: "produkt", label: "Produktområde" },
  { id: "bransch", label: "Bransch" },
  { id: "storlek", label: "Storlek" },
];

const groupLabel = (id: string) => GROUPS.find((g) => g.id === id)?.label || id;

const emptyStat = (): Partial<MarketStat> => ({
  label: "",
  value: 0,
  suffix: "",
  note: "",
  group_key: "produkt",
  sort_order: 0,
  is_active: true,
});

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

export default function AdminMarketReportTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [stats, setStats] = useState<MarketStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<MarketStat> | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-market-report`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list`, { headers: authHeaders() });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta nyckeltal");
      setStats((data.stats || []).map((s: MarketStat) => ({ ...s, value: Number(s.value) })));
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message, variant: "destructive" });
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
        headers: authHeaders(),
        body: JSON.stringify(editing),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte spara");
      toast({ title: "Sparat", description: `${data.stat.label} uppdaterad.` });
      setEditing(null);
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Ta bort nyckeltalet "${label}"?`)) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte ta bort");
      toast({ title: "Borttagen", description: label });
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message, variant: "destructive" });
    }
  };

  const visible = stats.filter((s) => filter === "all" || s.group_key === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Marknadsrapport 2026
          </CardTitle>
          <CardDescription>
            Partnerantal och kategorisiffror för rapporten{" "}
            <em>Svenska Dynamics 365-partnermarknaden 2026</em>. Ändringar slår
            igenom direkt på rapportsidan, i PDF- och CSV-exporten – ingen
            kodändring behövs. Datumet “uppdaterad” sätts automatiskt till
            senaste ändring.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla kategorier</SelectItem>
              {GROUPS.map((g) => (
                <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setEditing(emptyStat())}>
            <Plus className="h-4 w-4 mr-1" /> Nytt nyckeltal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Laddar nyckeltal…</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nyckeltal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Värde</TableHead>
                  <TableHead className="text-right">Ordning</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[110px] text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground max-w-md">{s.note}</div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{groupLabel(s.group_key)}</Badge></TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {s.value}{s.suffix || ""}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{s.sort_order}</TableCell>
                    <TableCell>
                      {s.is_active
                        ? <Badge>Publicerad</Badge>
                        : <Badge variant="outline">Dold</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(s)} title="Redigera">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(s.id, s.label)} title="Ta bort">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                      Inga nyckeltal i denna kategori.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera nyckeltal" : "Nytt nyckeltal"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Etikett</Label>
                <Input
                  value={editing.label || ""}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                  placeholder="t.ex. Business Central"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Värde</Label>
                  <Input
                    type="number"
                    value={editing.value ?? 0}
                    onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Suffix</Label>
                  <Input
                    value={editing.suffix || ""}
                    onChange={(e) => setEditing({ ...editing, suffix: e.target.value })}
                    placeholder="t.ex. %"
                  />
                </div>
                <div>
                  <Label>Ordning</Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Kategori</Label>
                <Select
                  value={editing.group_key || "produkt"}
                  onValueChange={(v) => setEditing({ ...editing, group_key: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GROUPS.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Kommentar</Label>
                <Textarea
                  rows={3}
                  value={editing.note || ""}
                  onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                  placeholder="Kort förklaring som visas under siffran."
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.is_active !== false}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <span className="text-sm">Visa på rapportsidan</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
