import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDateYYYYMMDD } from "@/lib/utils";

type Row = Record<string, any>;
interface PartnerInfo { slug: string; name: string; has_email: boolean; is_featured: boolean }
interface Props { token: string | null; onSessionExpired: () => void }

const STATUS_LABEL: Record<string, string> = { pending: "Väntar", approved: "Skickad", rejected: "Avböjd" };

/** Underlag som köpare vill skicka till partners. Inget skickas förrän det godkänns här. */
export default function AdminUnderlagForwardsTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [partners, setPartners] = useState<Record<string, PartnerInfo>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const call = async (action: string, payload: Record<string, unknown> = {}) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-underlag-forwards`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.status === 401) { onSessionExpired(); throw new Error("Sessionen har gått ut"); }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Något gick fel");
    return json;
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await call("list");
      setRows(data.requests || []);
      setPartners(Object.fromEntries((data.partners || []).map((p: PartnerInfo) => [p.slug, p])));
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const decide = async (row: Row, action: "approve" | "reject") => {
    setBusy(row.id);
    try {
      const r = await call(action, { id: row.id, note: notes[row.id] || undefined, partner_slugs: chosen[row.id] ?? row.partner_slugs });
      toast({ title: action === "approve" ? `Skickat till ${r.delivered} av ${r.total} partners` : "Förfrågan avböjd" });
      await load();
    } catch (e: any) {
      toast({ title: "Kunde inte genomföra", description: e.message, variant: "destructive" });
    }
    setBusy(null);
  };

  const visible = rows.filter((r) => filter === "all" || r.status === "pending");
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  if (loading && rows.length === 0) {
    return <div className="flex items-center gap-2 p-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Laddar underlag…</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Underlag att godkänna</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Köpare som vill skicka sitt underlag till partners. Partnerna och köparen får mejl först när ni godkänner.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>Väntar ({pendingCount})</Button>
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>Alla</Button>
          <Button variant="outline" size="sm" onClick={load} aria-label="Uppdatera"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visible.length === 0 && <p className="text-sm text-muted-foreground">Inga underlag att visa.</p>}
        {visible.map((row) => {
          const isOpen = open === row.id;
          const selected = chosen[row.id] ?? row.partner_slugs ?? [];
          return (
            <div key={row.id} className="rounded-md border border-border">
              <button type="button" className="flex w-full items-center justify-between gap-3 p-3 text-left" onClick={() => setOpen(isOpen ? null : row.id)}>
                <div className="flex items-center gap-2 min-w-0">
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  <span className="font-medium truncate">{row.company_name}</span>
                  <span className="text-sm text-muted-foreground truncate">{row.contact_name} · {row.email}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{formatDateYYYYMMDD(row.created_at)}</span>
                  <Badge variant={row.status === "pending" ? "default" : "secondary"}>{STATUS_LABEL[row.status] || row.status}</Badge>
                </div>
              </button>
              {isOpen && (
                <div className="space-y-4 border-t border-border p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><span className="text-muted-foreground">Underlag:</span> {row.assessment_type}</div>
                    <div><span className="text-muted-foreground">Telefon:</span> {row.phone || "–"}</div>
                    <div><span className="text-muted-foreground">Bransch:</span> {row.industry || "–"}</div>
                    <div><span className="text-muted-foreground">Storlek:</span> {row.company_size || "–"}</div>
                    <div><span className="text-muted-foreground">PDF-bilaga:</span> {row.pdf_path ? "Ja" : "Nej"}</div>
                    <div><span className="text-muted-foreground">Källsida:</span> {row.source_page || "–"}</div>
                  </div>
                  {row.message && (
                    <div>
                      <p className="font-medium mb-1">Meddelande från köparen</p>
                      <p className="whitespace-pre-wrap rounded bg-muted p-3">{row.message}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium mb-1">Sammanfattning</p>
                    <p className="whitespace-pre-wrap rounded bg-muted p-3 max-h-80 overflow-auto">{row.underlag_summary}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Partners</p>
                    <div className="space-y-2">
                      {(row.partner_slugs || []).map((slug: string) => {
                        const p = partners[slug];
                        const id = `uf-${row.id}-${slug}`;
                        return (
                          <div key={slug} className="flex items-center gap-2">
                            <Checkbox
                              id={id}
                              disabled={row.status !== "pending" || !p?.has_email}
                              checked={selected.includes(slug)}
                              onCheckedChange={(v) => setChosen((c) => ({
                                ...c,
                                [row.id]: v ? Array.from(new Set([...selected, slug])) : selected.filter((s: string) => s !== slug),
                              }))}
                            />
                            <label htmlFor={id}>{p?.name || slug}</label>
                            {!p?.has_email && <Badge variant="outline">Saknar e-post</Badge>}
                            {p && !p.is_featured && <Badge variant="outline">Grundprofil</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {row.status === "pending" ? (
                    <>
                      <Textarea
                        placeholder="Intern anteckning (valfri)"
                        value={notes[row.id] || ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                        maxLength={1000}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button disabled={busy === row.id || selected.length === 0} onClick={() => decide(row, "approve")}>
                          {busy === row.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Godkänn och skicka
                        </Button>
                        <Button variant="outline" disabled={busy === row.id} onClick={() => decide(row, "reject")}>Avböj</Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      {STATUS_LABEL[row.status]} {row.reviewed_at ? formatDateYYYYMMDD(row.reviewed_at) : ""}
                      {row.status === "approved" && row.total != null ? ` · levererat till ${row.delivered ?? 0} av ${row.total}` : ""}
                      {row.review_note ? ` · ${row.review_note}` : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
