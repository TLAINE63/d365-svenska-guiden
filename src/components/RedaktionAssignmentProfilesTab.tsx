import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  COMPETENCE_GUIDES,
  DELIVERY_MODES,
  PRODUCT_OPTIONS,
  REGION_OPTIONS,
  deliveryModeLabel,
} from "@/data/competenceGuides";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

interface PartnerRow {
  id: string;
  name: string;
  slug: string;
  is_featured: boolean;
}

interface ProfileRow {
  id: string;
  partner_id: string;
  guide_slug: string;
  heading: string;
  experience_summary: string;
  typical_assignments: string[];
  products: string[];
  industries: string[];
  regions: string[];
  delivery_modes: string[];
  last_reviewed_at: string | null;
  status: string;
  internal_notes: string | null;
  partners?: { name: string; slug: string; is_featured: boolean } | null;
}

interface EvidenceRow {
  id?: string;
  profile_id?: string;
  evidence_type: string;
  title: string;
  url: string | null;
  is_public: boolean;
}

const EVIDENCE_TYPES = [
  { value: "customer_case", label: "Publicerat kundcase" },
  { value: "customer_reference", label: "Kundreferens med publiceringstillstånd" },
  { value: "microsoft_certification", label: "Microsoft-certifiering" },
  { value: "internal_reference", label: "Intern referens (visas aldrig publikt)" },
];

const emptyProfile = (): ProfileRow & { evidence: EvidenceRow[] } => ({
  id: "",
  partner_id: "",
  guide_slug: COMPETENCE_GUIDES[0].slug,
  heading: "",
  experience_summary: "",
  typical_assignments: [],
  products: [],
  industries: [],
  regions: [],
  delivery_modes: [],
  last_reviewed_at: null,
  status: "draft",
  internal_notes: "",
  evidence: [],
});

interface Props {
  token: string | null;
  partners: PartnerRow[];
  onSessionExpired: () => void;
}

const MultiCheck = ({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onChange: (v: string[]) => void;
}) => (
  <div>
    <Label className="text-xs font-semibold mb-1.5 block">{label}</Label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(active ? values.filter((v) => v !== o) : [...values, o])}
            className={`rounded-full border px-3 py-1 text-xs ${
              active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

export default function RedaktionAssignmentProfilesTab({ token, partners, onSessionExpired }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
  const [editing, setEditing] = useState<(ProfileRow & { evidence: EvidenceRow[] }) | null>(null);

  const call = async (payload: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-assignment-profiles", {
      body: { ...payload, token },
    });
    if (error) {
      let msg = (data as any)?.error || error.message;
      const res = (error as any)?.context;
      if (res && typeof res.json === "function") {
        try {
          const body = await res.clone().json();
          if (body?.error) {
            msg = body.error;
            if (body.details) {
              const fields = Object.entries(body.details as Record<string, string[]>)
                .map(([k, v]) => `${k}: ${(v || []).join(", ")}`)
                .join(" | ");
              if (fields) msg = `${msg} (${fields})`;
            }
          }
        } catch {
          /* behåll ursprungligt felmeddelande */
        }
      }
      if (String(msg).includes("Behörighet") || String(msg).includes("401")) onSessionExpired();
      throw new Error(msg);
    }
    if ((data as any)?.error) throw new Error((data as any).error);
    return data as any;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await call({ action: "list" });
      setProfiles(res.profiles || []);
      setEvidence(res.evidence || []);
    } catch (e: any) {
      toast.error(e.message || "Kunde inte hämta uppdragsprofiler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const publishedPerPartner = useMemo(() => {
    const map: Record<string, number> = {};
    profiles.filter((p) => p.status === "published").forEach((p) => {
      map[p.partner_id] = (map[p.partner_id] || 0) + 1;
    });
    return map;
  }, [profiles]);

  const openEdit = (p?: ProfileRow) => {
    if (!p) return setEditing(emptyProfile());
    setEditing({
      ...p,
      internal_notes: p.internal_notes || "",
      evidence: evidence.filter((e) => e.profile_id === p.id),
    });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.partner_id) return toast.error("Välj partner");
    setSaving(true);
    try {
      await call({
        action: "save",
        profile: {
          ...(editing.id ? { id: editing.id } : {}),
          partner_id: editing.partner_id,
          guide_slug: editing.guide_slug,
          heading: editing.heading,
          experience_summary: editing.experience_summary,
          typical_assignments: editing.typical_assignments.filter(Boolean),
          products: editing.products,
          industries: editing.industries,
          regions: editing.regions,
          delivery_modes: editing.delivery_modes,
          last_reviewed_at: editing.last_reviewed_at || null,
          status: editing.status,
          internal_notes: editing.internal_notes || null,
          evidence: editing.evidence.map((e) => ({
            evidence_type: e.evidence_type,
            title: e.title,
            url: e.url || undefined,
            is_public: e.is_public,
          })),
        },
      });
      toast.success("Uppdragsprofilen är sparad");
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort uppdragsprofilen?")) return;
    try {
      await call({ action: "delete", id });
      toast.success("Borttagen");
      load();
    } catch (e: any) {
      toast.error(e.message || "Kunde inte ta bort");
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Uppdragsprofiler</CardTitle>
          <CardDescription>
            Partnerns erfarenhet per kompetensguide. Högst tre publicerade profiler per partner.
            Publicering kräver datum för redaktionell kontroll och visas publikt i tolv månader.
          </CardDescription>
        </div>
        <Button onClick={() => openEdit()} size="sm">
          <Plus className="mr-1.5 h-4 w-4" /> Ny profil
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!loading && profiles.length === 0 && (
          <p className="text-sm text-muted-foreground">Inga uppdragsprofiler ännu.</p>
        )}
        {profiles.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
            <div className="min-w-[220px] flex-1">
              <p className="text-sm font-semibold">{p.partners?.name || "Okänd partner"}</p>
              <p className="text-xs text-muted-foreground">
                {COMPETENCE_GUIDES.find((g) => g.slug === p.guide_slug)?.title || p.guide_slug}
              </p>
            </div>
            <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
            <span className="text-xs text-muted-foreground">
              Kontrollerad: {p.last_reviewed_at || "saknas"}
            </span>
            {p.status === "published" && (publishedPerPartner[p.partner_id] || 0) >= 3 && (
              <span className="text-xs text-muted-foreground">3 av 3 publicerade</span>
            )}
            <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
              Redigera
            </Button>
            <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Redigera uppdragsprofil" : "Ny uppdragsprofil"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Partner *</Label>
                  <Select
                    value={editing.partner_id}
                    onValueChange={(v) => setEditing({ ...editing, partner_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                          {p.is_featured ? "" : " (ej publicerad)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Kompetensguide *</Label>
                  <Select
                    value={editing.guide_slug}
                    onValueChange={(v) => setEditing({ ...editing, guide_slug: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPETENCE_GUIDES.map((g) => (
                        <SelectItem key={g.slug} value={g.slug}>
                          {g.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Rubrik *</Label>
                <Input
                  value={editing.heading}
                  onChange={(e) => setEditing({ ...editing, heading: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  Sammanfattning av erfarenhet *
                </Label>
                <Textarea
                  rows={4}
                  value={editing.experience_summary}
                  onChange={(e) => setEditing({ ...editing, experience_summary: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  Typiska uppdrag (en per rad)
                </Label>
                <Textarea
                  rows={3}
                  value={editing.typical_assignments.join("\n")}
                  onChange={(e) =>
                    setEditing({ ...editing, typical_assignments: e.target.value.split("\n") })
                  }
                />
              </div>

              <MultiCheck
                label="Produkter"
                options={PRODUCT_OPTIONS}
                values={editing.products}
                onChange={(v) => setEditing({ ...editing, products: v })}
              />
              <MultiCheck
                label="Branscher"
                options={STANDARD_INDUSTRIES.map((i) => i.name)}
                values={editing.industries}
                onChange={(v) => setEditing({ ...editing, industries: v })}
              />
              <MultiCheck
                label="Geografiska områden"
                options={REGION_OPTIONS}
                values={editing.regions}
                onChange={(v) => setEditing({ ...editing, regions: v })}
              />
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Leveransform</Label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERY_MODES.map((d) => {
                    const active = editing.delivery_modes.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            delivery_modes: active
                              ? editing.delivery_modes.filter((v) => v !== d.value)
                              : [...editing.delivery_modes, d.value],
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {deliveryModeLabel(d.value)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">
                    Senast redaktionellt kontrollerad
                  </Label>
                  <Input
                    type="date"
                    value={editing.last_reviewed_at || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, last_reviewed_at: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Status</Label>
                  <Select
                    value={editing.status}
                    onValueChange={(v) => setEditing({ ...editing, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Utkast</SelectItem>
                      <SelectItem value="published">Publicerad</SelectItem>
                      <SelectItem value="archived">Arkiverad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs font-semibold">Underlag</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        evidence: [
                          ...editing.evidence,
                          { evidence_type: "customer_case", title: "", url: "", is_public: false },
                        ],
                      })
                    }
                  >
                    Lägg till underlag
                  </Button>
                </div>
                <div className="space-y-2">
                  {editing.evidence.map((ev, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                      <Select
                        value={ev.evidence_type}
                        onValueChange={(v) => {
                          const next = [...editing.evidence];
                          next[i] = {
                            ...ev,
                            evidence_type: v,
                            is_public: v === "internal_reference" ? false : ev.is_public,
                          };
                          setEditing({ ...editing, evidence: next });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EVIDENCE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Rubrik"
                        value={ev.title}
                        onChange={(e) => {
                          const next = [...editing.evidence];
                          next[i] = { ...ev, title: e.target.value };
                          setEditing({ ...editing, evidence: next });
                        }}
                      />
                      <Input
                        placeholder="Länk (valfri)"
                        value={ev.url || ""}
                        onChange={(e) => {
                          const next = [...editing.evidence];
                          next[i] = { ...ev, url: e.target.value };
                          setEditing({ ...editing, evidence: next });
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs">
                          <Checkbox
                            checked={ev.is_public}
                            disabled={ev.evidence_type === "internal_reference"}
                            onCheckedChange={(v) => {
                              const next = [...editing.evidence];
                              next[i] = { ...ev, is_public: v === true };
                              setEditing({ ...editing, evidence: next });
                            }}
                          />
                          Får visas publikt
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              evidence: editing.evidence.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block">
                  Interna anteckningar (visas aldrig publikt)
                </Label>
                <Textarea
                  rows={3}
                  value={editing.internal_notes || ""}
                  onChange={(e) => setEditing({ ...editing, internal_notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={save} disabled={saving}>
                  {saving ? "Sparar…" : "Spara"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Avbryt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
