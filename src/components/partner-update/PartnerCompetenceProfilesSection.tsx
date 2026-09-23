import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2, UserCog, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PremiumCollapsibleSection } from "@/components/admin/PremiumCollapsibleSection";
import {
  COMPETENCE_GUIDES,
  DELIVERY_MODES,
  PRODUCT_OPTIONS,
  type DeliveryMode,
} from "@/data/competenceGuides";
import { CITIES_BY_REGION, regionsForCities } from "@/data/competenceGeography";
import { Checkbox } from "@/components/ui/checkbox";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-assignment-profiles`;

interface ProfileDraft {
  id?: string;
  guide_slug: string;
  heading: string;
  experience_summary: string;
  typical_assignments: string[];
  products: string[];
  industries: string[];
  regions: string[];
  onsite_cities: string[];
  remote_available: boolean;
  delivery_modes: DeliveryMode[];
  status?: string;
}

const emptyProfile = (): ProfileDraft => ({
  guide_slug: COMPETENCE_GUIDES[0]?.slug ?? "",
  heading: "",
  experience_summary: "",
  typical_assignments: [],
  products: [],
  industries: [],
  regions: [],
  onsite_cities: [],
  remote_available: false,
  delivery_modes: [],
});

const statusLabel = (status?: string) => {
  switch (status) {
    case "published":
      return { label: "Publicerad", variant: "default" as const };
    case "archived":
      return { label: "Arkiverad", variant: "secondary" as const };
    default:
      return { label: "Väntar på granskning", variant: "secondary" as const };
  }
};

const guideTitle = (slug: string) =>
  COMPETENCE_GUIDES.find((g) => g.slug === slug)?.title ?? slug;

interface Props {
  token: string;
  partnerId?: string | null;
}

export function PartnerCompetenceProfilesSection({ token, partnerId }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProfileDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(emptyProfile());
  const [assignmentInput, setAssignmentInput] = useState("");

  const call = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, inviteToken: token, ...payload }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const details = result?.details
          ? Object.entries(result.details as Record<string, string[]>)
              .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
              .join(" | ")
          : "";
        throw new Error([result?.error || "Något gick fel", details].filter(Boolean).join(" - "));
      }
      return result;
    },
    [token],
  );

  const fetchProfiles = useCallback(async () => {
    if (!token || !partnerId) return;
    setLoading(true);
    try {
      const result = await call("invitation-list-profiles");
      setItems(result.profiles || []);
    } catch (err) {
      console.error("Error fetching competence profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [call, token, partnerId]);

  useEffect(() => {
    if (open) void fetchProfiles();
  }, [open, fetchProfiles]);

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const save = async () => {
    if (draft.heading.trim().length < 3) {
      toast.error("Ange en rubrik för kompetensen");
      return;
    }
    if (draft.experience_summary.trim().length < 20) {
      toast.error("Beskriv erfarenheten med minst 20 tecken");
      return;
    }
    setSaving(true);
    try {
      await call("invitation-save-profile", { profile: draft });
      toast.success("Skickat för granskning. Publiceras efter kontroll av d365.se.");
      setShowForm(false);
      setDraft(emptyProfile());
      setAssignmentInput("");
      await fetchProfiles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id || !confirm("Vill du ta bort den här kompetensprofilen?")) return;
    try {
      await call("invitation-delete-profile", { id });
      toast.success("Borttagen");
      await fetchProfiles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunde inte ta bort");
    }
  };

  if (!partnerId) return null;

  return (
    <PremiumCollapsibleSection
      title="Kompetenser och roller"
      description="Vilka roller ni kan bemanna inom Dynamics 365, till exempel projektledare, utvecklare eller solution architect. Beskriv funktioner, inte namngivna personer."
      icon={UserCog}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Innehållet granskas av d365.se innan det publiceras. Ange inga personuppgifter, priser
          eller uppgifter om tillgänglig kapacitet.
        </p>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const badge = statusLabel(item.status);
              return (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{item.heading}</span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {guideTitle(item.guide_slug)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.experience_summary}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDraft({ ...item });
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && !showForm && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Inga kompetenser tillagda ännu.
              </p>
            )}
          </div>
        )}

        {showForm ? (
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div>
              <Label>Kompetensområde</Label>
              <Select
                value={draft.guide_slug}
                onValueChange={(v) => setDraft({ ...draft, guide_slug: v })}
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

            <div>
              <Label>Rubrik</Label>
              <Input
                value={draft.heading}
                maxLength={160}
                placeholder="Till exempel: Projektledning av Business Central-införanden"
                onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
              />
            </div>

            <div>
              <Label>Beskrivning av erfarenheten</Label>
              <Textarea
                rows={4}
                maxLength={1200}
                value={draft.experience_summary}
                placeholder="Beskriv vad rollen gör hos era kunder, vilken typ av uppdrag och vilken erfarenhet ni har inom området."
                onChange={(e) => setDraft({ ...draft, experience_summary: e.target.value })}
              />
            </div>

            <div>
              <Label>Typiska uppdrag</Label>
              <div className="flex gap-2">
                <Input
                  value={assignmentInput}
                  maxLength={200}
                  placeholder="Ett uppdrag i taget"
                  onChange={(e) => setAssignmentInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const v = assignmentInput.trim();
                    if (!v || draft.typical_assignments.length >= 10) return;
                    setDraft({
                      ...draft,
                      typical_assignments: [...draft.typical_assignments, v],
                    });
                    setAssignmentInput("");
                  }}
                >
                  Lägg till
                </Button>
              </div>
              {draft.typical_assignments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {draft.typical_assignments.map((a) => (
                    <Badge
                      key={a}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          typical_assignments: draft.typical_assignments.filter((x) => x !== a),
                        })
                      }
                    >
                      {a} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Produkter</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {PRODUCT_OPTIONS.map((p) => (
                  <Badge
                    key={p}
                    variant={draft.products.includes(p) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setDraft({ ...draft, products: toggleIn(draft.products, p) })}
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Branscher</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {INDUSTRY_NAMES.map((i) => (
                  <Badge
                    key={i}
                    variant={draft.industries.includes(i) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      setDraft({ ...draft, industries: toggleIn(draft.industries, i) })
                    }
                  >
                    {i}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Orter där konsulten kan vara på plats</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Ange leveransorter, alltså var konsulten kan arbeta hos kunden. Det är inte
                samma sak som var ni har kontor.
              </p>
              <div className="space-y-3">
                {Object.entries(CITIES_BY_REGION).map(([region, cities]) => (
                  <div key={region}>
                    <p className="text-xs text-muted-foreground mb-1">{region}</p>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((c) => (
                        <Badge
                          key={c}
                          variant={draft.onsite_cities.includes(c) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const next = toggleIn(draft.onsite_cities, c);
                            setDraft({
                              ...draft,
                              onsite_cities: next,
                              regions: regionsForCities(next),
                            });
                          }}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 mt-3 text-sm">
                <Checkbox
                  checked={draft.remote_available}
                  onCheckedChange={(v) => setDraft({ ...draft, remote_available: v === true })}
                />
                Kan arbeta på distans
              </label>
            </div>


            <div>
              <Label>Leveransform</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DELIVERY_MODES.map((d) => (
                  <Badge
                    key={d.value}
                    variant={draft.delivery_modes.includes(d.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        delivery_modes: toggleIn(draft.delivery_modes, d.value) as DeliveryMode[],
                      })
                    }
                  >
                    {d.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Skicka för granskning
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setDraft(emptyProfile());
                }}
              >
                Avbryt
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Lägg till kompetens
          </Button>
        )}
      </div>
    </PremiumCollapsibleSection>
  );
}
