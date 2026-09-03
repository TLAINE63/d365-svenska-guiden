import { useEffect, useMemo, useState } from "react";
import {
  BASIC_PROFILE_ALLOWED,
  BASIC_PROFILE_FORBIDDEN,
  checkBasicProfileText,
} from "@/lib/basicProfileEditorial";
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
import { Building2, Eye, Pencil, Plus, Trash2, Activity, ScrollText } from "lucide-react";
import { PRODUCT_LABEL, PRODUCT_ORDER, ProductKey } from "@/hooks/useBasicPartners";
import { useAdminPartners } from "@/hooks/useAdminPartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { companySizes, revenueOptions } from "@/data/partners";

const DELIVERY_GEO_OPTIONS = ["Sverige", "Norden", "Europa", "Internationellt"] as const;

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
  observed_company_sizes: Partial<Record<ProductKey, string[]>>;
  observed_revenue: Partial<Record<ProductKey, string[]>>;
  observed_delivery_geo: Partial<Record<ProductKey, string[]>>;
  observed_locations: string[];
  observed_updated_at: string | null;
  extended_content: string | null;
  extended_summary: string | null;
  hide_basic_card: boolean;
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
    observed_company_sizes: {},
    observed_revenue: {},
    observed_delivery_geo: {},
    observed_locations: [],
    extended_content: "",
    extended_summary: "",
    hide_basic_card: false,
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

function extractSummaryFromExtended(text: string | null | undefined): string | null {
  if (!text) return null;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (/^Sammanfattning[\s:]*/i.test(p)) {
      const contentAfter = p.replace(/^Sammanfattning[\s:]*/i, "").trim();
      if (contentAfter) return contentAfter;
      if (i + 1 < paragraphs.length) return paragraphs[i + 1];
    }
  }
  return null;
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

  // Basickort = alla opublicerade partners (is_featured=false). Data hämtas via
  // admin-endpointen som redan har alla observed_*-fält. Vi struntar i
  // profile_level-kolumnen som är kvar som reserv men inte längre gate:ar synligheten.
  const adminTokenForList = getAdminToken();
  const { data: allAdminPartners = [], isLoading, refetch } = useAdminPartners(adminTokenForList);
  const rows: BasicRow[] = useMemo(
    () =>
      (allAdminPartners || [])
        .filter((p: any) => !p.is_featured)
        .map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          website: p.website ?? null,
          profile_level: (p.profile_level as "basic" | "profilerad") ?? "profilerad",
          observed_products: p.observed_products || {},
          observed_industries: p.observed_industries || {},
          observed_company_sizes: p.observed_company_sizes || {},
          observed_revenue: p.observed_revenue || {},
          observed_delivery_geo: p.observed_delivery_geo || {},
          observed_locations: p.observed_locations || [],
          observed_updated_at: p.observed_updated_at ?? null,
          extended_content: p.extended_content ?? null,
          extended_summary: p.extended_summary ?? null,
          hide_basic_card: p.hide_basic_card === true,
          updated_at: p.updated_at,
        })),
    [allAdminPartners],
  );


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
  const openEdit = (row: BasicRow) => {
    const summary = row.extended_summary?.trim() ? row.extended_summary : extractSummaryFromExtended(row.extended_content);
    setEditing({ ...row, extended_summary: summary ?? "" });
  };

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
        observed_company_sizes: editing.observed_company_sizes || {},
        observed_revenue: editing.observed_revenue || {},
        observed_delivery_geo: editing.observed_delivery_geo || {},
        observed_locations: editing.observed_locations || [],
        observed_updated_at: new Date().toISOString(),
        extended_content: (editing.extended_content || "").trim() || null,
        extended_summary: (editing.extended_summary || "").trim() || null,
        hide_basic_card: editing.hide_basic_card === true,
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
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
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

  // Alla partners har ett Basickort som fallback (visas när is_featured=false).
  // Publicering/avpublicering hanteras i vanliga partner-editorn via is_featured.





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
                    <div className="font-medium flex items-center gap-2">
                      {r.name}
                      {r.hide_basic_card && (
                        <Badge variant="outline" className="text-[10px] border-amber-500/60 text-amber-600">
                          Dolt publikt
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{r.slug}</div>
                  </td>
                  <td className="p-2">{(r.observed_locations || []).join(", ")}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {PRODUCT_ORDER
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
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
            <DialogTitle>
              {editing?.id ? "Redigera Basickort" : "Nytt Basickort"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 overflow-y-auto px-6 py-4 flex-1 min-h-0">
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
                {PRODUCT_ORDER.map((k) => {
                  const active = !!editing.observed_products?.[k];
                  const inds = editing.observed_industries?.[k] || [];
                  const sizes = editing.observed_company_sizes?.[k] || [];
                  const revs = editing.observed_revenue?.[k] || [];
                  const geos = editing.observed_delivery_geo?.[k] || [];
                  const toggleIn = (
                    field: "observed_company_sizes" | "observed_revenue" | "observed_delivery_geo",
                    value: string,
                    current: string[],
                  ) => {
                    const next = current.includes(value)
                      ? current.filter((x) => x !== value)
                      : [...current, value];
                    setEditing({
                      ...editing,
                      [field]: { ...((editing as any)[field] || {}), [k]: next },
                    });
                  };
                  return (
                    <div key={k} className="rounded border border-border p-3 space-y-3">
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
                        <>
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

                          <div>
                            <Label className="text-xs">Målgrupp – antal anställda</Label>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {companySizes.map((v) => {
                                const on = sizes.includes(v);
                                return (
                                  <button
                                    type="button"
                                    key={v}
                                    onClick={() => toggleIn("observed_company_sizes", v, sizes)}
                                    className={`text-xs rounded-full border px-2.5 py-1 transition ${
                                      on
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {v}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Målgrupp – kundomsättning</Label>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {revenueOptions.map((v) => {
                                const on = revs.includes(v);
                                return (
                                  <button
                                    type="button"
                                    key={v}
                                    onClick={() => toggleIn("observed_revenue", v, revs)}
                                    className={`text-xs rounded-full border px-2.5 py-1 transition ${
                                      on
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {v}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Trolig leveransgeografi</Label>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {DELIVERY_GEO_OPTIONS.map((v) => {
                                const on = geos.includes(v);
                                return (
                                  <button
                                    type="button"
                                    key={v}
                                    onClick={() => toggleIn("observed_delivery_geo", v, geos)}
                                    className={`text-xs rounded-full border px-2.5 py-1 transition ${
                                      on
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    }`}
                                  >
                                    {v}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <Label>Fördjupningstext (visas på standalone-Basickortet)</Label>
                <Textarea
                  rows={6}
                  value={editing.extended_content || ""}
                  placeholder="Fri text sammanställd från publika källor. Visas för besökare på partnerns Basickort-sida."
                  onChange={(e) =>
                    setEditing({ ...editing, extended_content: e.target.value })
                  }
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Ej granskad av partnern. Håll neutralt, faktabaserat och kortfattat.
                </p>
              </div>

              <div>
                <Label>Sammanfattning (visas separat på standalone-Basickortet)</Label>
                <Textarea
                  rows={4}
                  value={editing.extended_summary || ""}
                  placeholder="Kort sammanfattning, helst ett stycke. Fylls automatiskt med första stycket under 'Sammanfattning' i fördjupningstexten om det finns."
                  onChange={(e) =>
                    setEditing({ ...editing, extended_summary: e.target.value })
                  }
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Redigerbart utdrag från fördjupningstexten. Visas som egen sektion ovanför fördjupningen.
                </p>

                {editorialWarnings.length > 0 && (
                  <div className="mt-2 rounded-md border border-amber-500/50 bg-amber-500/10 p-3">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      Kontrollera formuleringen
                    </p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-amber-700 dark:text-amber-300">
                      {editorialWarnings.map((w) => (
                        <li key={w.message}>{w.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 rounded-md border border-border bg-muted/30 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Redaktionell regel för grundprofiler
                  </p>
                  <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-foreground">Tillåtet</p>
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                        {BASIC_PROFILE_ALLOWED.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Ej tillåtet</p>
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                        {BASIC_PROFILE_FORBIDDEN.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {editing.extended_summary?.trim() && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Förhandsvisning – så visas sektionen på publika kortet
                    </p>
                    <section
                      className="relative rounded border border-border bg-muted/30 p-4"
                      aria-label="Förhandsvisning sammanfattning"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <ScrollText className="h-4 w-4 text-accent" aria-hidden />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                          Sammanfattning
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {editing.extended_summary.trim()}
                      </p>
                    </section>
                  </div>
                )}
              </div>
              <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={editing.hide_basic_card === true}
                    onCheckedChange={(v) =>
                      setEditing((prev) => (prev ? { ...prev, hide_basic_card: v === true } : prev))
                    }
                    className="mt-0.5"
                  />
                  <span className="text-sm">
                    <span className="font-medium">Dölj Basickort publikt</span>
                    <span className="block text-xs text-muted-foreground">
                      Partnern har bett att inte synas alls på d365.se. Ingen publik listning,
                      ingen standalone-sida, ingen matchning. Data bevaras för admin.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t bg-background shrink-0">
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
