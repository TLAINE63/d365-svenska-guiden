import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Copy, ExternalLink, FileText, Loader2, PenLine, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPublicBaseUrl } from "@/lib/publicUrl";

interface PartnerRow {
  id: string;
  name: string;
  slug: string;
  is_featured: boolean;
  public_profile_summary?: string | null;
  public_focus_tags?: string[];
  public_topics_12m?: string[];
  public_profile_updated_at?: string | null;
}

type Filter = "all" | "published" | "unpublished";

interface Props {
  token: string | null;
  partners: PartnerRow[];
  isLoading?: boolean;
  onSessionExpired: () => void;
}

export default function RedaktionPartnerLinksTab({
  token,
  partners,
  isLoading,
  onSessionExpired,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [bulk, setBulk] = useState<{ done: number; total: number; current: string } | null>(null);
  const cancelBulkRef = useRef(false);
  const queryClient = useQueryClient();

  // Redigering av det kompletterande lagret baserat på publika källor
  const [editing, setEditing] = useState<PartnerRow | null>(null);
  const [editSummary, setEditSummary] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editTopics, setEditTopics] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function openEdit(p: PartnerRow) {
    setEditing(p);
    setEditSummary(p.public_profile_summary || "");
    setEditTags((p.public_focus_tags || []).join(", "));
    setEditTopics((p.public_topics_12m || []).join(", "));
    setDirty(false);
  }

  // Synka formuläret med färsk data efter en ny källsökning, så länge användaren
  // inte själv hunnit redigera fälten.
  useEffect(() => {
    if (!editing || dirty) return;
    const fresh = partners.find((p) => p.id === editing.id);
    if (!fresh) return;
    setEditSummary(fresh.public_profile_summary || "");
    setEditTags((fresh.public_focus_tags || []).join(", "));
    setEditTopics((fresh.public_topics_12m || []).join(", "));
  }, [partners, editing, dirty]);

  async function handleSavePublicProfile() {
    if (!token || !editing) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("manage-partners", {
      body: {
        action: "update",
        id: editing.id,
        token,
        partner: {
          public_profile_summary: editSummary,
          public_focus_tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
          public_topics_12m: editTopics.split(",").map((t) => t.trim()).filter(Boolean),
        },
      },
    });
    setSaving(false);
    if (error || (data as { error?: string } | null)?.error) {
      const msg = (data as { error?: string } | null)?.error || error?.message || "";
      if (msg.toLowerCase().includes("session")) onSessionExpired();
      toast.error(msg || "Kunde inte spara");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
    toast.success("Kompletterande information sparad");
    setEditing(null);
  }

  async function handleClearPublicProfile() {
    if (!token || !editing) return;
    setSaving(true);
    const { error } = await supabase.functions.invoke("manage-partners", {
      body: {
        action: "update",
        id: editing.id,
        token,
        partner: { public_profile_summary: "", public_focus_tags: [], public_topics_12m: [] },
      },
    });
    setSaving(false);
    if (error) {
      toast.error("Kunde inte rensa");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
    toast.success("Kompletterande information rensad");
    setEditing(null);
  }

  async function scanPartner(partner: PartnerRow): Promise<boolean> {
    if (!token) return false;
    const { data, error } = await supabase.functions.invoke("generate-partner-public-profile", {
      body: { token, partnerId: partner.id },
    });
    const msg = (data as { error?: string } | null)?.error || error?.message || "";
    if (msg) {
      if (msg.toLowerCase().includes("session") || msg.toLowerCase().includes("401")) {
        onSessionExpired();
      }
      return false;
    }
    return true;
  }

  async function handleScanOne(partner: PartnerRow) {
    setScanId(partner.id);
    const ok = await scanPartner(partner);
    setScanId(null);
    if (ok) {
      await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      setDirty(false);
      toast.success(`Publika källor uppdaterade för ${partner.name}`);
    } else {
      toast.error(`Kunde inte söka publika källor för ${partner.name}`);
    }
  }

  async function handleScanAll() {
    const list = rows;
    cancelBulkRef.current = false;
    setBulk({ done: 0, total: list.length, current: "" });
    let failed = 0;
    for (let i = 0; i < list.length; i++) {
      if (cancelBulkRef.current) break;
      setBulk({ done: i, total: list.length, current: list[i].name });
      const ok = await scanPartner(list[i]);
      if (!ok) failed++;
    }
    setBulk(null);
    toast.success(
      failed ? `Klart, ${failed} partners kunde inte uppdateras` : "Publika källor uppdaterade",
    );
  }

  async function handleTogglePublished(partner: PartnerRow, next: boolean) {
    if (!token) return;
    setTogglingId(partner.id);
    const { data, error } = await supabase.functions.invoke("manage-partners", {
      body: { action: "update", id: partner.id, partner: { is_featured: next }, token },
    });
    setTogglingId(null);
    if (error || (data as { error?: string } | null)?.error) {
      const msg = (data as { error?: string } | null)?.error || error?.message || "";
      if (msg.toLowerCase().includes("session")) {
        toast.error("Sessionen har gått ut, logga in igen");
        onSessionExpired();
        return;
      }
      toast.error(msg || "Kunde inte ändra publiceringen");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
    toast.success(next ? `${partner.name} är publicerad` : `${partner.name} är avpublicerad`);
  }

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners
      .filter((p) => (filter === "published" ? p.is_featured : filter === "unpublished" ? !p.is_featured : true))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [partners, search, filter]);

  async function getLink(partnerId: string): Promise<string | null> {
    if (!token) return null;
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-permanent-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ partner_id: partnerId }),
      },
    );
    if (res.status === 401) {
      toast.error("Sessionen har gått ut, logga in igen");
      onSessionExpired();
      return null;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.token) {
      toast.error(data?.error || "Kunde inte hämta profileringslänken");
      return null;
    }
    return `${getPublicBaseUrl()}/partner-update/${data.token}`;
  }

  async function handleCopy(partnerId: string) {
    setBusyId(partnerId);
    const link = await getLink(partnerId);
    setBusyId(null);
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Profileringslänk kopierad");
    } catch {
      toast.message("Kopiera länken manuellt", { description: link });
    }
  }

  async function handleOpen(partnerId: string) {
    setBusyId(partnerId);
    const link = await getLink(partnerId);
    setBusyId(null);
    if (link) window.open(link, "_blank", "noopener");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partnerprofiler</CardTitle>
        <CardDescription>
          Kopiera profileringslänken för valfri partner, publicerad eller ej. Länken är unik per
          partner och kan skickas direkt till partnern, eller öppnas här för att redigera profilen.
          Du kan också publicera eller avpublicera en partner direkt i listan, samt söka publika
          källor och granska den kompletterande information som visas på partnerprofilen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök partner"
            className="max-w-xs"
          />
          {([
            ["all", "Alla"],
            ["published", "Publicerade"],
            ["unpublished", "Ej publicerade"],
          ] as const).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? "default" : "outline"}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground ml-auto">{rows.length} partners</span>
          {bulk ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Söker {bulk.done + 1} av {bulk.total}: {bulk.current}
              </span>
              <Button size="sm" variant="outline" onClick={() => (cancelBulkRef.current = true)}>
                Avbryt
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="secondary" onClick={handleScanAll} className="gap-1">
              <Search className="h-3.5 w-3.5" />
              Uppdatera publika källor för alla
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">Inga partners matchar sökningen.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Publicerad</TableHead>
                  <TableHead>Publika källor</TableHead>
                  <TableHead className="text-right">Profileringslänk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      {p.is_featured ? (
                        <Badge className="bg-emerald-600">Publicerad</Badge>
                      ) : (
                        <Badge variant="outline">Ej publicerad</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={p.is_featured}
                          disabled={togglingId === p.id}
                          onCheckedChange={(v) => handleTogglePublished(p, v)}
                          aria-label={`Publicera ${p.name}`}
                        />
                        {togglingId === p.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="flex items-center gap-1.5 text-sm hover:underline"
                      >
                        {p.public_profile_summary ? (
                          <>
                            <Badge variant="secondary" className="gap-1">
                              <FileText className="h-3 w-3" />
                              {p.public_profile_updated_at
                                ? p.public_profile_updated_at.slice(0, 10)
                                : "Finns"}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Saknas</span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === p.id}
                          onClick={() => handleCopy(p.id)}
                          className="gap-1"
                        >
                          {busyId === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Kopiera länk
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(p)}
                          className="gap-1"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Publika källor
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busyId === p.id}
                          onClick={() => handleOpen(p.id)}
                          className="gap-1"
                        >
                          <PenLine className="h-3.5 w-3.5" />
                          Redigera profil
                        </Button>
                        {p.is_featured && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                `${getPublicBaseUrl()}/partner/${p.slug}/?insyn=1`,
                                "_blank",
                                "noopener",
                              )
                            }
                            className="gap-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Visa
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publika källor, {editing?.name}</DialogTitle>
            <DialogDescription>
              Kompletterande information som d365.se sammanställt från publika källor. Den visas på
              partnerprofilen men skriver aldrig över partnerns egna uppgifter.
              {editing?.public_profile_updated_at && (
                <> Senast sammanställd {editing.public_profile_updated_at.slice(0, 10)}.</>
              )}
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="space-y-5">
              <Button
                variant="secondary"
                disabled={scanId === editing.id}
                onClick={() => handleScanOne(editing)}
                className="gap-2"
              >
                {scanId === editing.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Sök publika källor
              </Button>

              <div className="space-y-2">
                <Label htmlFor="pub-summary">Marknadsprofil (ett stycke per rad)</Label>
                <Textarea
                  id="pub-summary"
                  rows={6}
                  value={editSummary}
                  onChange={(e) => {
                    setEditSummary(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="Analys av publika källor visar att..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub-tags">Observerade fokusområden (kommaseparerade)</Label>
                <Input
                  id="pub-tags"
                  value={editTags}
                  onChange={(e) => {
                    setEditTags(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="Business Central, Copilot, Tillverkning"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pub-topics">Observerade ämnen senaste 12 månaderna (kommaseparerade)</Label>
                <Input
                  id="pub-topics"
                  value={editTopics}
                  onChange={(e) => {
                    setEditTopics(e.target.value);
                    setDirty(true);
                  }}
                  placeholder="AI Agents, Automation, Dataplattform"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button onClick={handleSavePublicProfile} disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Spara
                </Button>
                <Button variant="outline" onClick={handleClearPublicProfile} disabled={saving}>
                  Rensa
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  Stäng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
