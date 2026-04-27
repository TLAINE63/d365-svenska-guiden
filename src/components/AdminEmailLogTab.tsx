import { useState, useEffect } from "react";
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
import { RefreshCw, CheckCircle2, XCircle, Mail } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";

interface EmailLog {
  id: string;
  recipient_email: string;
  template_name: string;
  subject: string | null;
  status: string;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface AdminEmailLogTabProps {
  token: string;
  onSessionExpired: () => void;
}

const TEMPLATE_LABELS: Record<string, string> = {
  partner_welcome: "Välkomstmail",
  partner_invitation: "Inbjudan",
  partner_reminder: "Påminnelse",
  partner_bulk_invitation: "Bulkinbjudan",
  partner_sales_pitch: "Införsäljning",
  partner_profile_refresh: "Profileringslänk",
  partner_agreement: "Partneravtal",
  lead_forward: "Lead-vidarebefordring",
  event_approved: "Event godkänt",
  event_rejected: "Event nekat",
  event_portal_link: "Event-portallänk",
  event_portal_bulk: "Event-portal bulk",
};

const AdminEmailLogTab = ({ token, onSessionExpired }: AdminEmailLogTabProps) => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const pageSize = 50;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", {
        action: "email-logs",
        token,
        limit: pageSize,
        offset: page * pageSize,
        statusFilter,
        templateFilter,
      });

      if (error) throw error;
      if (data?.error === "Sessionen har gått ut. Logga in igen." || data?.error === "Ogiltig session") {
        onSessionExpired();
        return;
      }
      if (data?.logs) {
        setLogs(data.logs);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch email logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter, templateFilter, page]);

  const sentCount = logs.filter((l) => l.status === "sent").length;
  const failedCount = logs.filter((l) => l.status === "failed").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-postlogg ({total} totalt)
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={templateFilter} onValueChange={(v) => { setTemplateFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mailtyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla mailtyper</SelectItem>
                {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[140px]">
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
            {loading ? "Laddar..." : "Inga e-postloggar ännu. Loggar sparas från och med nu."}
          </p>
        ) : (
          <>
            <div className="admin-table-wrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Mottagare</TableHead>
                  <TableHead>Ämne</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(log.created_at), "d MMM HH:mm", { locale: sv })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {TEMPLATE_LABELS[log.template_name] || log.template_name}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {log.recipient_email}
                    </TableCell>
                    <TableCell className="text-sm max-w-[250px] truncate">
                      {log.subject || "–"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {(log.metadata as any)?.partner_name || (log.metadata as any)?.company_name || "–"}
                    </TableCell>
                    <TableCell>
                      {log.status === "sent" ? (
                        <Badge variant="default" className="bg-green-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Skickat
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Misslyckat
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-destructive max-w-[200px] truncate">
                      {log.error_message || ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Visar {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} av {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Föregående
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * pageSize >= total}
                >
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

export default AdminEmailLogTab;
