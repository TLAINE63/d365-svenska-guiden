import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { AlertTriangle, Check, RefreshCw, Trash2 } from "lucide-react";

interface NotFoundRow {
  path: string;
  hits: number;
  bot_hits: number;
  first_seen: string;
  last_seen: string;
  resolved: boolean;
  referrers: { referrer: string; count: number }[];
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });

const Admin404Tab = ({ token, onSessionExpired }: Props) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<NotFoundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<string>("30");
  const [includeBots, setIncludeBots] = useState(false);
  const [totalHits, setTotalHits] = useState(0);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data, error } = await invokeAdminEdgeWithRetry<{
      rows: NotFoundRow[];
      total_hits: number;
    }>("manage-404-log", {
      token,
      action: "list",
      days: days === "all" ? "all" : Number(days),
      include_bots: includeBots,
    });
    setLoading(false);

    if (error) {
      if (error.message?.includes("401")) onSessionExpired();
      toast({ title: "Kunde inte hämta 404-loggen", variant: "destructive" });
      return;
    }
    setRows(data?.rows || []);
    setTotalHits(data?.total_hits || 0);
  }, [token, days, includeBots, onSessionExpired, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (action: string, path: string, resolved?: boolean) => {
    if (!token) return;
    const { error } = await invokeAdminEdgeWithRetry("manage-404-log", {
      token,
      action,
      path,
      resolved,
    });
    if (error) {
      toast({ title: "Åtgärden misslyckades", variant: "destructive" });
      return;
    }
    toast({ title: action === "delete_path" ? "Raderad" : "Uppdaterad" });
    load();
  };

  const unresolved = rows.filter((r) => !r.resolved);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            404-sidor
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Adresser som besökare landat på men som inte finns. {rows.length} unika adresser,{" "}
            {totalHits} träffar. {unresolved.length} ohanterade.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch id="bots-404" checked={includeBots} onCheckedChange={setIncludeBots} />
            <Label htmlFor="bots-404" className="text-sm">
              Inkludera bottar
            </Label>
          </div>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Senaste 7 dagarna</SelectItem>
              <SelectItem value="30">Senaste 30 dagarna</SelectItem>
              <SelectItem value="90">Senaste 90 dagarna</SelectItem>
              <SelectItem value="all">Alla</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Uppdatera
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {loading ? "Hämtar…" : "Inga 404-träffar under perioden."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Adress</th>
                  <th className="py-2 pr-4 font-medium">Träffar</th>
                  <th className="py-2 pr-4 font-medium">Varifrån</th>
                  <th className="py-2 pr-4 font-medium">Senast</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium text-right">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.path} className="border-b last:border-0 align-top">
                    <td className="py-3 pr-4 font-mono text-xs break-all max-w-[280px]">{r.path}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {r.hits}
                      {r.bot_hits > 0 && (
                        <span className="text-muted-foreground"> ({r.bot_hits} bot)</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground max-w-[260px]">
                      {r.referrers.map((ref) => (
                        <div key={ref.referrer} className="break-all">
                          {ref.referrer} ({ref.count})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(r.last_seen)}
                    </td>
                    <td className="py-3 pr-4">
                      {r.resolved ? (
                        <Badge variant="secondary">Hanterad</Badge>
                      ) : (
                        <Badge variant="destructive">Ohanterad</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => act("mark_resolved", r.path, !r.resolved)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {r.resolved ? "Återöppna" : "Markera hanterad"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => act("delete_path", r.path)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Admin404Tab;
