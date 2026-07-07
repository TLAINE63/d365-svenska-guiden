import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Building2, Eye, Pencil, Plus, Trash2, Activity, ArrowDownCircle } from "lucide-react";
import { PRODUCT_LABEL, ProductKey } from "@/hooks/useBasicPartners";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const t = window.sessionStorage.getItem("admin_token");
    const e = window.sessionStorage.getItem("admin_token_expiry");
    if (!t || !e) return null;
    if (Date.now() >= parseInt(e, 10)) return null;
    return t;
  } catch {
    return null;
  }
}

type BasicRow = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  profile_level: "basic" | "profilerad";
  observed_products: Partial<Record<ProductKey, boolean>>;
  observed_industries: Partial<Record<ProductKey, string[]>>;
  observed_locations: string[];
  observed_updated_at: string | null;
  updated_at: string;
};

type BlockedCount = { partner_id: string; count: number };

function emptyDraft(): Partial<BasicRow> {
  return {
    name: "",
    slug: "",
    website: "",
    observed_products: {},
    observed_industries: {},
    observed_locations: [],
  };
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function callAdmin(action: string, payload: Record<string, unknown>) {
  const token = getAdminToken();
  if (!token) throw new Error("Ej inloggad");
  const { data, error } = await supabase.functions.invoke("manage-partners", {
    body: { action, token, ...payload },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error((data as any).error);
  return data;
}

export default function AdminBasicPartnersTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<BasicRow> | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: rows = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-basic-partners"],
    queryFn: async (): Promise<BasicRow[]> => {
      // Use the whitelisted public view – it already scopes to profile_level='basic'.
      const { data, error } = await (supabase as any)
        .from("partners_basic_public")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data || []) as BasicRow[];
    },
  });

  // Blocked-contact counters – admin only. Aggregated per partner.
  const { data: blockedCounts = {} as Record<string, number> } = useQuery({
    queryKey: ["contact-blocked-counts"],
    queryFn: async () => {
      const token = getAdminToken();
      if (!token) return {};
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "list-contact-blocked-counts", token },
      });
      if (error || (data as any)?.error) return {};
      const arr = ((data as any)?.counts || []) as BlockedCount[];
      const map: Record<string, number> = {};
      arr.forEach((r) => (map[r.partner_id] = r.count));
      return map;
    },
    // Not critical – silent when function is not yet deployed.
    retry: false,
  });

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.name.localeCompare(b.name, "sv")),
    [rows],
  );

  const openNew = () => setEditing(emptyDraft());
  const openEdit = (row: BasicRow) => setEditing({ ...row });

  const save = async () => {
    if (!editing?.name?.trim()) {
      toast.error("Namn krävs");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        name: editing.name.trim(),
        slug: editing.slug?.trim() || slugify(editing.name),
        website: editing.website?.trim() || null,
        profile_level: "basic",
        observed_products: editing.observed_products || {},
        observed_industries: editing.observed_industries || {},
        observed_locations: editing.observed_locations || [],
        observed_updated_at: new Date().toISOString(),
        // Basic partners never enter the paid rotation. Enforce defensively:
        is_featured: false,
        agreement_signed: false,
      };
      if (editing.id) {
        await callAdmin("update", { id: editing.id, partner: payload });
        toast.success("Basickort uppdaterat");
      } else {
        // Basic partners still need a `website` column NOT NULL in the base table.
        payload.website = payload.website || `https://example.com/${payload.slug}`;
        await callAdmin("create", { partner: payload });
        toast.success("Basickort skapat");
      }
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-basic-partners"] });
      qc.invalidateQueries({ queryKey: ["basic-partners"] });
    } catch (e: any) {
      toast.error(e?.message || "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: BasicRow) => {
    if (!confirm(`Ta bort Basickort för ${row.name}?`)) return;
    try {
      await callAdmin("delete", { id: row.id });
      toast.success("Borttaget");
      refetch();
    } catch (e: any) {
      toast.error(e?.message || "Kunde inte ta bort");
    }
  };

  // ---- Degrade profiled → basic --------------------------------------------
  const adminToken = getAdminToken();
  const { data: allPartners = [] } = useAdminPartners(adminToken);
  const [degradeId, setDegradeId] = useState<string>("");
  const [degrading, setDegrading] = useState(false);

  const profiledPartners = useMemo(
    () =>
      (allPartners || [])
        .filter((p: any) => p.profile_level !== "basic")
        .slice()
        .sort((a: any, b: any) => a.name.localeCompare(b.name, "sv")),
    [allPartners],
  );

  const degrade = async () => {
    const p = profiledPartners.find((x: any) => x.id === degradeId);
    if (!p) return;
    if (
      !confirm(
        `Konvertera ${p.name} till Basickort?\n\n` +
          `• Partnern försvinner ur betalda listor, matchning och kontaktflöden.\n` +
          `• Publik data begränsas till observerad marknadsdata (namn, orter, produktområden, branschinriktning).\n` +
          `• Kontaktuppgifter, AI-profil och ekonomiska fält lämnas orörda i databasen men slutar exponeras.\n\n` +
          `Åtgärden är reversibel via partnerredigering.`,
      )
    )
      return;
    setDegrading(true);
    try {
      await callAdmin("update", {
        id: p.id,
        partner: {
          profile_level: "basic",
          is_featured: false,
          agreement_signed: false,
          cancellation_date: new Date().toISOString().slice(0, 10),
          observed_updated_at: new Date().toISOString(),
        },
      });
      toast.success(`${p.name} är nu ett Basickort`);
      setDegradeId("");
      qc.invalidateQueries({ queryKey: ["admin-basic-partners"] });
      qc.invalidateQueries({ queryKey: ["basic-partners"] });
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e: any) {
      toast.error(e?.message || "Kunde inte konvertera");
    } finally {
      setDegrading(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Basickort – observerade partners</h2>
          <p className="text-sm text-muted-foreground">
            Icke-publicerade partners med enbart observerad data (namn, orter,
            produktområden, branschinriktning). Ingen kontaktinfo, ingen ekonomi,
            aldrig i den betalda rotationen.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nytt Basickort
        </Button>
      </div>

      {/* Degrade profiled → basic */}
      <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <ArrowDownCircle className="mt-0.5 h-5 w-5 text-amber-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Konvertera profilerad partner → Basickort
              </h3>
              <p className="text-xs text-muted-foreground">
                När en partner avslutar avtalet: byt profile_level till "basic". Partnern
                behåller sin plats i marknadskartan men tappar kontaktbarhet, publik
                profil och plats i matchning/rotation. Reversibelt.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={degradeId || "__none__"} onValueChange={(v) => setDegradeId(v === "__none__" ? "" : v)}>
                <SelectTrigger className="min-w-[260px] bg-background">
                  <SelectValue placeholder="Välj profilerad partner…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">– Välj partner –</SelectItem>
                  {profiledPartners.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                      {p.is_featured ? "" : " (opublicerad)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={degrade}
                disabled={!degradeId || degrading}
                className="border-amber-500/60"
              >
                {degrading ? "Konverterar…" : "Konvertera till Basickort"}
              </Button>
            </div>
          </div>
        </div>
      </div>



      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laddar…</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Inga Basickort ännu.</p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2">Namn</th>
                <th className="p-2">Orter</th>
                <th className="p-2">Produkter</th>
                <th className="p-2" title="Blockerade kontaktförsök">
                  <Activity className="inline h-3.5 w-3.5" /> Försök
                </th>
                <th className="p-2 w-40">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.slug}</div>
                  </td>
                  <td className="p-2">{(r.observed_locations || []).join(", ")}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {(["bc", "fsc", "crm"] as ProductKey[])
                        .filter((k) => r.observed_products?.[k])
                        .map((k) => (
                          <Badge key={k} variant="secondary" className="text-[10px]">
                            {PRODUCT_LABEL[k]}
                          </Badge>
                        ))}
                    </div>
                  </td>
                  <td className="p-2 tabular-nums">
                    {blockedCounts[r.id] || 0}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        title="Visa Basickort"
                      >
                        <a href={`/basic/${r.slug}/`} target="_blank" rel="noreferrer">
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(r)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Redigera Basickort" : "Nytt Basickort"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Partnernamn *</Label>
                  <Input
                    value={editing.name || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        name: e.target.value,
                        slug: editing.id ? editing.slug : slugify(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={editing.slug || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Webbplats (endast för utlänk på standalone-kort)</Label>
                <Input
                  type="url"
                  value={editing.website || ""}
                  placeholder="https://…"
                  onChange={(e) =>
                    setEditing({ ...editing, website: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Observerade orter (komma-separerade)</Label>
                <Input
                  value={(editing.observed_locations || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      observed_locations: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>Observerade produktområden & branscher (max 3 per område)</Label>
                {(["bc", "fsc", "crm"] as ProductKey[]).map((k) => {
                  const active = !!editing.observed_products?.[k];
                  const inds = editing.observed_industries?.[k] || [];
                  return (
                    <div
                      key={k}
                      className="rounded border border-border p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={active}
                          onCheckedChange={(v) =>
                            setEditing({
                              ...editing,
                              observed_products: {
                                ...(editing.observed_products || {}),
                                [k]: !!v,
                              },
                            })
                          }
                        />
                        <span className="font-medium">{PRODUCT_LABEL[k]}</span>
                      </div>
                      {active && (
                        <div>
                          <Label className="text-xs">
                            Branschinriktning (max 3, komma-separerade)
                          </Label>
                          <Textarea
                            rows={2}
                            value={inds.join(", ")}
                            placeholder={STANDARD_INDUSTRIES.slice(0, 3).join(", ")}
                            onChange={(e) => {
                              const list = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .slice(0, 3);
                              setEditing({
                                ...editing,
                                observed_industries: {
                                  ...(editing.observed_industries || {}),
                                  [k]: list,
                                },
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Avbryt
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Sparar…" : "Spara"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
