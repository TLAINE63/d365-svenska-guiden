import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RefreshCw, Mail, CheckCircle2, XCircle, ChevronDown, Inbox } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface RequestLog {
  id: string;
  created_at: string;
  template_name: string;
  subject: string | null;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: Record<string, any> | null;
}

interface Facets {
  sourceTypes: string[];
  partners: { slug: string; name: string }[];
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  partner_contact_request: "Kontakt",
  partner_demo_request: "Demo / genomgång",
  partner_quote_request: "Prisindikation",
  partner_multi_quote_request: "Prisindikation (multi)",
  compare_partners_intro: "Jämförelse-intro",
};

const labelFor = (st: string) => SOURCE_TYPE_LABELS[st] || st;

interface Props {
  token: string;
  onSessionExpired: () => void;
}

const AdminPartnerRequestsTab = ({ token, onSessionExpired }: Props) => {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<Facets>({ sourceTypes: [], partners: [] });
  const [loading, setLoading] = useState(false);
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>("all");
  const [partnerSlugFilter, setPartnerSlugFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", {
        action: "partner-request-emails",
        token,
        limit: pageSize,
        offset: page * pageSize,
        sourceTypeFilter,
        partnerSlugFilter,
        statusFilter,
      });
      if (error) throw error;
      if (data?.error === "Sessionen har gått ut. Logga in igen." || data?.error === "Ogiltig session") {
        onSessionExpired();
        return;
      }
      setLogs(data?.logs || []);
      setTotal(data?.total || 0);
      if (data?.facets) setFacets(data.facets);
    } catch (err) {
      console.error("Failed to fetch partner request emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTypeFilter, partnerSlugFilter, statusFilter, page]);

  const sentCount = useMemo(() => logs.filter((l) => l.status === "sent").length, [logs]);
  const failedCount = useMemo(
    () => logs.filter((l) => l.status !== "sent").length,
    [logs],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Partnerförfrågningar ({total} totalt)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Utskick som gick från d365.se-CTA:er direkt till partner. Visar {sentCount} skickade / {failedCount} övriga på aktuell sida.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={sourceTypeFilter}
              onValueChange={(v) => {
                setSourceTypeFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[210px] min-w-max">
                <SelectValue placeholder="Typ av förfrågan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla typer av förfrågan</SelectItem>
                {facets.sourceTypes.map((st) => (
                  <SelectItem key={st} value={st}>
                    {labelFor(st)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={partnerSlugFilter}
              onValueChange={(v) => {
                setPartnerSlugFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[220px] min-w-max">
                <SelectValue placeholder="Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla partners</SelectItem>
                {facets.partners.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla statusar</SelectItem>
                <SelectItem value="sent">Skickade</SelectItem>
                <SelectItem value="failed">Misslyckade</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Uppdatera
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {loading ? "Laddar..." : "Inga partnerförfrågningar matchar filtret."}
          </p>
        ) : (
          <>
            <div className="admin-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Kund</TableHead>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Mottagare (to)</TableHead>
                    <TableHead>Reply-to</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const meta = log.metadata || {};
                    const sourceType = (log.template_name || "").replace(/^partner_request:/, "");
                    const fields = meta.email_fields || {};
                    return (
                      <Collapsible key={log.id} asChild>
                        <>
                          <TableRow>
                            <TableCell className="whitespace-nowrap text-sm">
                              {format(new Date(log.created_at), "d MMM HH:mm", { locale: sv })}
                            </TableCell>
                            <TableCell className="text-sm">
                              <Badge variant="secondary">{labelFor(sourceType)}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {meta.partner_name || meta.partner_slug || "–"}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="font-medium">{meta.visitor_company || "–"}</div>
                              <div className="text-xs text-muted-foreground">{meta.visitor_email || ""}</div>
                            </TableCell>
                            <TableCell className="text-sm">{meta.selected_product || "–"}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate">
                              {log.recipient_email}
                            </TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate">
                              {fields.reply_to || meta.visitor_email || "–"}
                            </TableCell>
                            <TableCell>
                              {log.status === "sent" ? (
                                <Badge className="bg-green-600 text-white">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Skickat
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {log.status}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={9} className="bg-muted/40">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 text-xs">
                                  <div>
                                    <div className="font-semibold mb-1 flex items-center gap-1">
                                      <Mail className="h-3 w-3" /> E-postfält
                                    </div>
                                    <div><span className="text-muted-foreground">From:</span> {fields.from || "–"}</div>
                                    <div><span className="text-muted-foreground">To:</span> {(fields.to || []).join(", ") || log.recipient_email}</div>
                                    <div><span className="text-muted-foreground">CC:</span> {(fields.cc || []).join(", ") || "–"}</div>
                                    <div><span className="text-muted-foreground">Reply-to:</span> {fields.reply_to || "–"}</div>
                                    <div className="mt-1"><span className="text-muted-foreground">Ämne:</span> {log.subject || "–"}</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold mb-1">Kontext</div>
                                    <div><span className="text-muted-foreground">Source type:</span> {meta.source_type || sourceType}</div>
                                    <div><span className="text-muted-foreground">Partner:</span> {meta.partner_name} ({meta.partner_slug})</div>
                                    <div><span className="text-muted-foreground">Bransch:</span> {meta.industry || "–"}</div>
                                    <div><span className="text-muted-foreground">Sida:</span> {meta.source_page || "–"}</div>
                                    {log.error_message && (
                                      <div className="text-destructive mt-2">{log.error_message}</div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Visar {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} av {total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                  Föregående
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * pageSize >= total}>
                  Nästa
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPartnerRequestsTab;
