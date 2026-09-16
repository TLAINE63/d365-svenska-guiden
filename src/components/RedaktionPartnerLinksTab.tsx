import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Copy, ExternalLink, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPublicBaseUrl } from "@/lib/publicUrl";

interface PartnerRow {
  id: string;
  name: string;
  slug: string;
  is_featured: boolean;
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
    if (ok) toast.success(`Publika källor uppdaterade för ${partner.name}`);
    else toast.error(`Kunde inte söka publika källor för ${partner.name}`);
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
          Du kan också publicera eller avpublicera en partner direkt i listan.
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
                              window.open(`${getPublicBaseUrl()}/partner/${p.slug}/`, "_blank", "noopener")
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
    </Card>
  );
}
