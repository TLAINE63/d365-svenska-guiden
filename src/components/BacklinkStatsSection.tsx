import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, Globe, Gauge } from "lucide-react";

export interface BacklinkSnapshot {
  domain: string;
  captured_at: string;
  referring_domains: number | null;
  backlinks: number | null;
  authority_score: number | null;
  follows: number | null;
  nofollows: number | null;
  top_domains: { domain: string; authority: number | null; backlinks: number | null }[];
}

const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? "–" : new Intl.NumberFormat("sv-SE").format(Math.round(n));

const asDate = (iso: string) => iso.slice(0, 10);

export function useBacklinkSnapshot() {
  const [snapshot, setSnapshot] = useState<BacklinkSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-backlink-stats?action=public`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } },
        );
        const data = (await res.json()) as { snapshot: BacklinkSnapshot | null };
        if (active) setSnapshot(data?.snapshot ?? null);
      } catch {
        if (active) setSnapshot(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { snapshot, loading };
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          {icon}
          {label}
        </div>
        <div className="text-3xl font-bold text-foreground tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

interface Props {
  variant?: "full" | "compact";
}

export default function BacklinkStatsSection({ variant = "full" }: Props) {
  const { snapshot, loading } = useBacklinkSnapshot();

  if (loading || !snapshot) return null;

  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground mb-2">Länkar till d365.se</p>
        <p className="text-foreground">
          <span className="font-semibold">{fmt(snapshot.referring_domains)}</span> webbplatser länkar hit, med totalt{" "}
          <span className="font-semibold">{fmt(snapshot.backlinks)}</span> länkar.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Källa: Semrush, uppdaterat {asDate(snapshot.captured_at)}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<Globe className="h-4 w-4" />} label="Webbplatser som länkar hit" value={fmt(snapshot.referring_domains)} />
        <Kpi icon={<Link2 className="h-4 w-4" />} label="Länkar totalt" value={fmt(snapshot.backlinks)} />
        <Kpi
          icon={<Gauge className="h-4 w-4" />}
          label="Auktoritetspoäng"
          value={snapshot.authority_score === null ? "–" : String(Math.round(snapshot.authority_score))}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Källa: Semrush. Senast uppdaterat {asDate(snapshot.captured_at)}.
      </p>

      {snapshot.top_domains?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">Webbplatser som länkar till d365.se</h2>
          <div className="rounded-lg border border-border/60 divide-y divide-border/60">
            {snapshot.top_domains.slice(0, 20).map((d) => (
              <div key={d.domain} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                <span className="text-foreground truncate">{d.domain}</span>
                <span className="text-muted-foreground tabular-nums shrink-0">
                  {fmt(d.backlinks)} {d.backlinks === 1 ? "länk" : "länkar"}
                  {d.authority !== null && d.authority !== undefined ? `, auktoritet ${Math.round(d.authority)}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
