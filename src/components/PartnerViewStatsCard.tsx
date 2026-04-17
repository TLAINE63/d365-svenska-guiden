import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointerClick, Eye, ExternalLink, BarChart3 } from "lucide-react";
import { usePartnerViewStats } from "@/hooks/usePartnerViewStats";

interface Props {
  partnerSlug: string | undefined;
  partnerName: string | undefined;
  variant?: "admin" | "partner";
}

export default function PartnerViewStatsCard({ partnerSlug, partnerName, variant = "partner" }: Props) {
  const stats = usePartnerViewStats(partnerSlug, partnerName);

  if (stats.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5" />
            Statistik – senaste 30/90 dagar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Laddar statistik…</p>
        </CardContent>
      </Card>
    );
  }

  const metric = (label: string, icon: React.ReactNode, v30: number, v90: number) => (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
        {icon}
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{v30}</span>
        <span className="text-xs text-muted-foreground">/ {v90} (90d)</span>
      </div>
    </div>
  );

  const sources = (
    title: string,
    rows: { source: string; count: number }[]
  ) => (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">Inga registrerade ännu.</p>
      ) : (
        <div className="space-y-1">
          {rows.map((r) => (
            <div key={r.source} className="flex justify-between text-xs">
              <code className="text-muted-foreground truncate max-w-[70%]">{r.source}</code>
              <Badge variant="outline" className="text-[10px]">{r.count}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="w-5 h-5" />
          Exponering & trafik – senaste 30 dagar (90d inom parentes)
        </CardTitle>
        {variant === "partner" && (
          <p className="text-xs text-muted-foreground">
            Visar hur många som klickat på er partnerprofil i listor, besökt profilsidan direkt och klickat vidare till er hemsida. IP-adresser är anonymiserade.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metric("Klick på partnerkort", <MousePointerClick className="w-3.5 h-3.5" />, stats.cardClicks30d, stats.cardClicks90d)}
          {metric("Besök på profilsida", <Eye className="w-3.5 h-3.5" />, stats.profileVisits30d, stats.profileVisits90d)}
          {metric("Klick till hemsida", <ExternalLink className="w-3.5 h-3.5" />, stats.websiteClicks30d, stats.websiteClicks90d)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
          {sources("Källsidor – kortklick", stats.topSourcesCardClicks)}
          {sources("Källsidor – profilbesök", stats.topSourcesProfileVisits)}
          {sources("Källsidor – hemsidesklick", stats.topSourcesWebsiteClicks)}
        </div>
      </CardContent>
    </Card>
  );
}
