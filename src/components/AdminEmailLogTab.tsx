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
import { RefreshCw, CheckCircle2, XCircle, Mail, Clock } from "lucide-react";
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

  const filteredLogs = logs.filter((l) => {
    if (dateRange === 'all') return true;
    const ts = new Date(l.created_at).getTime();
    const now = Date.now();
    if (dateRange === 'today') {
      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
      return ts >= startOfDay.getTime();
    }
    if (dateRange === '7d') return ts >= now - 7 * 86400000;
    if (dateRange === '30d') return ts >= now - 30 * 86400000;
    return true;
  });

  const sentCount = filteredLogs.filter((l) => l.status === "sent").length;
  const failedCount = filteredLogs.filter((l) => l.status === "failed").length;
  const todayCount = logs.filter((l) => {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    return new Date(l.created_at).getTime() >= startOfDay.getTime();
  }).length;

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
        {/* Snabbfilterchips */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 mb-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2">Snabbfilter</span>
          {[
            { key: 'all',   label: 'Alla',   count: logs.length, tone: 'slate' },
            { key: 'today', label: 'Idag',   count: todayCount,  tone: 'blue' },
            { key: '7d',    label: '7 dgr',  tone: 'sky' },
            { key: '30d',   label: '30 dgr', tone: 'violet' },
          ].map(({ key, label, count, tone }) => {
            const active = dateRange === key;
            const toneMap: Record<string, string> = {
              slate:  active ? 'bg-slate-900 text-white border-slate-900'   : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400',
              blue:   active ? 'bg-blue-600 text-white border-blue-600'     : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400',
              sky:    active ? 'bg-sky-600 text-white border-sky-600'       : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400',
              violet: active ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-700 border-slate-200 hover:border-violet-400',
            };
            return (
              <button key={key} type="button" onClick={() => setDateRange(key as typeof dateRange)}
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-medium transition-all ${toneMap[tone]}`}>
                {key === 'today' && <Clock className="h-3 w-3" />}
                {label}
                {typeof count === 'number' && (
                  <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-semibold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{count}</span>
                )}
              </button>
            );
          })}
          <span className="w-px h-5 bg-slate-200 mx-1" />
          {[
            { key: 'all',    label: 'Alla statusar', tone: 'slate' as const },
            { key: 'sent',   label: 'Skickade',      tone: 'emerald' as const, count: sentCount },
            { key: 'failed', label: 'Misslyckade',   tone: 'rose' as const,    count: failedCount },
          ].map(({ key, label, tone, count }) => {
            const active = statusFilter === key;
            const toneMap: Record<string, string> = {
              slate:   active ? 'bg-slate-900 text-white border-slate-900'     : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400',
              emerald: active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400',
              rose:    active ? 'bg-rose-600 text-white border-rose-600'       : 'bg-white text-slate-700 border-slate-200 hover:border-rose-400',
            };
            return (
              <button key={key} type="button" onClick={() => { setStatusFilter(key); setPage(0); }}
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-medium transition-all ${toneMap[tone]}`}>
                {key === 'sent' && <CheckCircle2 className="h-3 w-3" />}
                {key === 'failed' && <XCircle className="h-3 w-3" />}
                {label}
                {typeof count === 'number' && (
                  <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-semibold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {loading ? "Laddar..." : "Inga e-postloggar matchar filtret."}
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
                {filteredLogs.map((log) => (
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
