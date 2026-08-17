import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Puzzle, RotateCcw } from "lucide-react";
import { BC_ISV_SOLUTIONS, type IsvSolution } from "@/data/bcIsvSolutions";
import { Checkbox } from "@/components/ui/checkbox";
import type { IsvOverride } from "@/hooks/useIsvSolutions";
import AdminIsvInvitationsTab from "@/components/AdminIsvInvitationsTab";
import { ISV_PRODUCTS, ISV_INDUSTRIES } from "@/data/isvProfileOptions";
import IsvPartnerPicker from "@/components/IsvPartnerPicker";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

interface EditState {
  solution_id: string;
  name: string;
  short_description: string;
  what: string;
  when_fits: string;
  use_cases: string;
  combos: string;
  products: string[];
  industries: string[];
  partner_slugs: string[];
  vendor_name: string;
  vendor_website: string;
  admin_contact_name: string;
  admin_contact_email: string;
  admin_contact_phone: string;
  sales_contact_name: string;
  sales_contact_email: string;
  sales_contact_phone: string;
}

const toEdit = (s: IsvSolution, o?: IsvOverride): EditState => ({
  solution_id: s.id,
  name: s.name,
  short_description: o?.short_description ?? s.shortDescription,
  what: o?.what ?? s.what,
  when_fits: o?.when_fits ?? s.whenFits,
  use_cases: (o?.use_cases ?? s.useCases).join("\n"),
  combos: (o?.combos ?? s.combos).join("\n"),
  products: o?.products ?? s.products ?? [],
  industries: o?.industries ?? s.industryFocus ?? [],
  partner_slugs: o?.partner_slugs ?? [],
  vendor_name: o?.vendor_name ?? s.vendor ?? "",
  vendor_website: o?.vendor_website ?? s.vendorWebsite ?? "",
  admin_contact_name: o?.admin_contact_name ?? "",
  admin_contact_email: o?.admin_contact_email ?? "",
  admin_contact_phone: o?.admin_contact_phone ?? "",
  sales_contact_name: o?.sales_contact_name ?? "",
  sales_contact_email: o?.sales_contact_email ?? "",
  sales_contact_phone: o?.sales_contact_phone ?? "",
});

export default function AdminIsvCatalogTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [overrides, setOverrides] = useState<Record<string, IsvOverride>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<EditState | null>(null);

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-isv-solutions`;
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
      if (!res.ok) throw new Error(data?.error || "Kunde inte hämta texter");
      const map: Record<string, IsvOverride> = {};
      for (const row of (data.overrides || []) as IsvOverride[]) map[row.solution_id] = row;
      setOverrides(map);
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BC_ISV_SOLUTIONS;
    return BC_ISV_SOLUTIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.vendor.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [search]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}?action=save`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          solution_id: editing.solution_id,
          short_description: editing.short_description,
          what: editing.what,
          when_fits: editing.when_fits,
          use_cases: editing.use_cases.split("\n").map((s) => s.trim()).filter(Boolean),
          combos: editing.combos.split("\n").map((s) => s.trim()).filter(Boolean),
          products: editing.products,
          industries: editing.industries,
          partner_slugs: editing.partner_slugs,
          vendor_name: editing.vendor_name,
          vendor_website: editing.vendor_website,
          admin_contact_name: editing.admin_contact_name,
          admin_contact_email: editing.admin_contact_email,
          admin_contact_phone: editing.admin_contact_phone,
          sales_contact_name: editing.sales_contact_name,
          sales_contact_email: editing.sales_contact_email,
          sales_contact_phone: editing.sales_contact_phone,
        }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte spara");
      toast({ title: "Sparat", description: `${editing.name} uppdaterad.` });
      setEditing(null);
      await load();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reset = async (id: string, name: string) => {
    if (!confirm(`Återställ "${name}" till originaltexten i katalogen?`)) return;
    try {
      const res = await fetch(`${baseUrl}?action=reset&solution_id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Kunde inte återställa");
      toast({ title: "Återställd", description: name });
      setEditing(null);
      await load();
    } catch (e) {
      toast({ title: "Fel", description: (e as Error).message, variant: "destructive" });
    }
  };

  const toggleEdit = (key: "products" | "industries", value: string) =>
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [key]: prev[key].includes(value)
              ? prev[key].filter((v) => v !== value)
              : [...prev[key], value],
          }
        : prev
    );

  return (
    <div className="space-y-6">
      <AdminIsvInvitationsTab
        token={token}
        onSessionExpired={onSessionExpired}
        onApproved={load}
        contacts={Object.fromEntries(
          Object.entries(overrides).map(([id, o]) => [
            id,
            { email: o.admin_contact_email || "", vendor: o.vendor_name || "" },
          ])
        )}
      />
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-[hsl(var(--cta-orange))]" />
            ISV-katalog (texter)
          </CardTitle>
          <CardDescription>
            Redigera beskrivningar och texter för lösningarna i BC-tilläggskatalogen. Sparade texter
            ersätter originaltexten publikt – återställ för att gå tillbaka till standardtexten.
          </CardDescription>
        </div>
        <Input
          placeholder="Sök lösning, leverantör eller kategori…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Laddar katalog…</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lösning</TableHead>
                  <TableHead>Leverantör</TableHead>
                  <TableHead>Kontaktperson (admin)</TableHead>
                  <TableHead>Säljkontakt</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Åtgärd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((s) => {
                  const o = overrides[s.id];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>{o?.vendor_name || s.vendor}</div>
                        {(o?.vendor_website || s.vendorWebsite) && (
                          <a
                            href={o?.vendor_website || s.vendorWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[hsl(var(--cta-orange))] hover:underline"
                          >
                            {(o?.vendor_website || s.vendorWebsite || "").replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {o?.admin_contact_name || o?.admin_contact_email ? (
                          <div>
                            <div>{o?.admin_contact_name || "–"}</div>
                            {o?.admin_contact_email && (
                              <a href={`mailto:${o.admin_contact_email}`} className="text-xs text-muted-foreground hover:underline">
                                {o.admin_contact_email}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Saknas</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {o?.sales_contact_name || o?.sales_contact_email ? (
                          <div>
                            <div>{o?.sales_contact_name || "–"}</div>
                            {o?.sales_contact_email && (
                              <a href={`mailto:${o.sales_contact_email}`} className="text-xs text-muted-foreground hover:underline">
                                {o.sales_contact_email}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Saknas</span>
                        )}
                      </TableCell>
                      <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                      <TableCell>
                        {o ? (
                          <Badge className="bg-[hsl(var(--cta-orange))]/10 text-[hsl(var(--cta-orange))] border-[hsl(var(--cta-orange))]/30" variant="outline">
                            Redigerad
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => setEditing(toEdit(s, o))}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {o && (
                            <Button size="sm" variant="ghost" onClick={() => reset(s.id, s.name)}>
                              <RotateCcw className="h-4 w-4" />
                            </Button>
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

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Redigera {editing?.name}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                <p className="text-sm font-semibold">Leverantör och kontakter</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Leverantör</Label>
                    <Input
                      value={editing.vendor_name}
                      onChange={(e) => setEditing({ ...editing, vendor_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Hemsida</Label>
                    <Input
                      placeholder="https://…"
                      value={editing.vendor_website}
                      onChange={(e) => setEditing({ ...editing, vendor_website: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kontaktpersonen (admin) är den vi skickar profileringslänken till och håller kontakten med.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label>Kontaktperson (admin)</Label>
                    <Input
                      value={editing.admin_contact_name}
                      onChange={(e) => setEditing({ ...editing, admin_contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>E-post (admin)</Label>
                    <Input
                      type="email"
                      value={editing.admin_contact_email}
                      onChange={(e) => setEditing({ ...editing, admin_contact_email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefon (admin)</Label>
                    <Input
                      value={editing.admin_contact_phone}
                      onChange={(e) => setEditing({ ...editing, admin_contact_phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <Label>Säljkontakt</Label>
                    <Input
                      value={editing.sales_contact_name}
                      onChange={(e) => setEditing({ ...editing, sales_contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>E-post (sälj)</Label>
                    <Input
                      type="email"
                      value={editing.sales_contact_email}
                      onChange={(e) => setEditing({ ...editing, sales_contact_email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Telefon (sälj)</Label>
                    <Input
                      value={editing.sales_contact_phone}
                      onChange={(e) => setEditing({ ...editing, sales_contact_phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Kort beskrivning (kortet)</Label>
                <Textarea
                  rows={2}
                  value={editing.short_description}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                />
              </div>
              <div>
                <Label>Vad lösningen är</Label>
                <Textarea
                  rows={4}
                  value={editing.what}
                  onChange={(e) => setEditing({ ...editing, what: e.target.value })}
                />
              </div>
              <div>
                <Label>När den passar</Label>
                <Textarea
                  rows={3}
                  value={editing.when_fits}
                  onChange={(e) => setEditing({ ...editing, when_fits: e.target.value })}
                />
              </div>
              <div>
                <Label>Används till (en rad per punkt)</Label>
                <Textarea
                  rows={5}
                  value={editing.use_cases}
                  onChange={(e) => setEditing({ ...editing, use_cases: e.target.value })}
                />
              </div>
              <div>
                <Label>Produktinriktning (Dynamics 365-appar)</Label>
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  {ISV_PRODUCTS.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={editing.products.includes(p)}
                        onCheckedChange={() => toggleEdit("products", p)}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Branschinriktning (lämna tomt om generell)</Label>
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  {ISV_INDUSTRIES.map((i) => (
                    <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={editing.industries.includes(i)}
                        onCheckedChange={() => toggleEdit("industries", i)}
                      />
                      {i}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Vanliga kombinationer (en rad per punkt)</Label>
                <Textarea
                  rows={3}
                  value={editing.combos}
                  onChange={(e) => setEditing({ ...editing, combos: e.target.value })}
                />
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
    </div>
  );
}
