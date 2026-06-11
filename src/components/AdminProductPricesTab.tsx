import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";

interface ProductPrice {
  id: string;
  product_key: string;
  product_name: string;
  category: "ERP" | "CRM" | string;
  price_sek: number | null;
  price_unit: string;
  price_note: string | null;
  is_quote: boolean;
  sort_order: number;
  updated_at?: string;
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const emptyPrice = (): Partial<ProductPrice> => ({
  product_key: "",
  product_name: "",
  category: "ERP",
  price_sek: 0,
  price_unit: "per användare/månad",
  price_note: "",
  is_quote: false,
  sort_order: 0,
});

const formatSek = (n: number | null, unit: string, isQuote: boolean) => {
  if (isQuote || n == null) return "Offert";
  return `${new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)} kr ${unit}`.trim();
};

export default function AdminProductPricesTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<ProductPrice> | null>(null);
  const [filter, setFilter] = useState<"all" | "ERP" | "CRM">("all");

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-product-prices`;
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
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta priser");
      setPrices(data.prices || []);
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message || "Kunde inte ladda priser", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const visible = useMemo(
    () => prices.filter((p) => filter === "all" || p.category === filter),
    [prices, filter]
  );

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
      toast({ title: "Sparat", description: `${data.price.product_name} uppdaterad.` });
      setEditing(null);
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Ta bort "${name}"? Detta går inte att ångra.`)) return;
    try {
      const res = await fetch(`${baseUrl}?action=delete&id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte ta bort");
      toast({ title: "Borttagen", description: name });
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-emerald-600" />
            Produktpriser
          </CardTitle>
          <CardDescription>
            Centralt prisregister för Dynamics 365-produkter. Uppdatera priset här – det slår igenom överallt där hooken <code>useProductPrices</code> används.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla kategorier</SelectItem>
              <SelectItem value="ERP">ERP</SelectItem>
              <SelectItem value="CRM">CRM</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setEditing(emptyPrice())} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Ny produkt
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Laddar priser…</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Pris</TableHead>
                  <TableHead>Enhet</TableHead>
                  <TableHead>Anmärkning</TableHead>
                  <TableHead className="w-[120px] text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.product_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.product_key}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.category === "ERP" ? "default" : "secondary"}>{p.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {p.is_quote || p.price_sek == null ? (
                        <span className="italic text-muted-foreground">Offert</span>
                      ) : (
                        new Intl.NumberFormat("sv-SE", {
                          minimumFractionDigits: 2, maximumFractionDigits: 2,
                        }).format(p.price_sek) + " kr"
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.price_unit}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.price_note || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(p)} title="Redigera">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => remove(p.id, p.product_name)} title="Ta bort">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                      Inga priser hittades.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera pris" : "Ny produkt"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Produktnamn *</Label>
                <Input
                  value={editing.product_name || ""}
                  onChange={(e) => setEditing({ ...editing, product_name: e.target.value })}
                  placeholder="Business Central Essentials"
                />
              </div>
              <div>
                <Label>Produktnyckel (slug)</Label>
                <Input
                  value={editing.product_key || ""}
                  onChange={(e) => setEditing({ ...editing, product_key: e.target.value })}
                  placeholder="bc-essentials (autogenereras om tom)"
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <Select
                  value={editing.category || "ERP"}
                  onValueChange={(v) => setEditing({ ...editing, category: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERP">ERP</SelectItem>
                    <SelectItem value="CRM">CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex items-center gap-3 pt-2">
                <Switch
                  checked={!!editing.is_quote}
                  onCheckedChange={(v) => setEditing({ ...editing, is_quote: v })}
                />
                <Label className="!mt-0">Offertpris (inget fast pris)</Label>
              </div>
              <div>
                <Label>Pris (SEK)</Label>
                <Input
                  type="number"
                  step="0.01"
                  disabled={!!editing.is_quote}
                  value={editing.price_sek ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      price_sek: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  placeholder="764.70"
                />
              </div>
              <div>
                <Label>Prisenhet</Label>
                <Input
                  value={editing.price_unit || ""}
                  onChange={(e) => setEditing({ ...editing, price_unit: e.target.value })}
                  placeholder="per användare/månad"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Anmärkning</Label>
                <Input
                  value={editing.price_note || ""}
                  onChange={(e) => setEditing({ ...editing, price_note: e.target.value })}
                  placeholder='T.ex. "Självbetjäning: 38,20 kr" eller "Minst 10 licenser"'
                />
              </div>
              <div>
                <Label>Sorteringsordning</Label>
                <Input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="md:col-span-2 rounded-md border bg-muted/30 p-3 text-sm">
                <span className="text-muted-foreground">Förhandsvisning: </span>
                <span className="font-medium">
                  {formatSek(
                    editing.price_sek ?? null,
                    editing.price_unit || "",
                    !!editing.is_quote
                  )}
                </span>
                {editing.price_note ? (
                  <span className="text-muted-foreground italic"> — {editing.price_note}</span>
                ) : null}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)} disabled={saving}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Sparar…" : "Spara"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
