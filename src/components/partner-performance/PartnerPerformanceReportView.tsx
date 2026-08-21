import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Eye,
  Handshake,
  Lightbulb,
  MousePointerClick,
  Quote,
  Scale,
  TrendingDown,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export interface PerformanceMetrics {
  impressions: number;
  impressionSessions: number;
  profileViews: number;
  profileViewSessions: number;
  cardClicks: number;
  comparisons: number;
  compareAdds: number;
  contactClicks: number;
  websiteClicks: number;
  leads: number;
}

export interface BreakdownItem {
  label: string;
  count: number;
  share: number | null;
}

export interface PerformanceReportData {
  partner: { id: string; slug: string; name: string };
  month: string;
  current: {
    metrics: PerformanceMetrics;
    breakdowns: {
      product: BreakdownItem[];
      industry: BreakdownItem[];
      size: BreakdownItem[];
      geography: BreakdownItem[];
    };
    comparedWith: { name: string; count: number }[];
  };
  previous: PerformanceMetrics;
  previous_month: string;
  strength: { score: number; completed: string[]; missing: string[] };
  recommendations: { title: string; body: string }[];
  admin_comment: string;
  status: string;
  data_start: string | null;
}

const MONTHS = [
  "januari", "februari", "mars", "april", "maj", "juni",
  "juli", "augusti", "september", "oktober", "november", "december",
];

export function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return null;
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return <span className="text-xs text-muted-foreground">oförändrat</span>;
  const up = change > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        up ? "text-accent" : "text-destructive"
      }`}
    >
      <Icon className="h-3 w-3" />
      {up ? "+" : ""}
      {change} %
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  current,
  previous,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  hint?: string;
  current: number;
  previous: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-bold leading-none">{value.toLocaleString("sv-SE")}</p>
      <div className="mt-2 flex items-center gap-2">
        <Delta current={current} previous={previous} />
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function BreakdownList({ title, items }: { title: string; items: BreakdownItem[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{i.label}</span>
              <span className="text-muted-foreground">{i.share !== null ? `${i.share} %` : i.count}</span>
            </div>
            <Progress value={i.share ?? 0} className="h-1.5" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FunnelStep({ label, value, isLast }: { label: string; value: number; isLast?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-lg border bg-muted/40 px-4 py-3 text-center">
        <p className="text-2xl font-bold leading-none">{value.toLocaleString("sv-SE")}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
      {!isLast && <ArrowDown className="h-4 w-4 text-muted-foreground my-1" />}
    </div>
  );
}

export default function PartnerPerformanceReportView({
  data,
}: {
  data: PerformanceReportData;
}) {
  const m = data.current.metrics;
  const prev = data.previous;
  const visitRate = m.impressions ? Math.round((m.profileViews / m.impressions) * 1000) / 10 : null;
  const shortlistRate = m.comparisons
    ? Math.round((m.compareAdds / m.comparisons) * 1000) / 10
    : null;
  const hasData = m.impressions + m.profileViews + m.websiteClicks + m.leads > 0;

  const dataStartLabel = data.data_start
    ? new Date(data.data_start).toLocaleDateString("sv-SE").replace(/-/g, "/")
    : null;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Partner Performance Report</p>
        <h2 className="text-2xl font-bold tracking-tight">
          {data.partner.name} på d365.se – {formatMonthLabel(data.month)}
        </h2>
      </header>

      {data.admin_comment && (
        <Card className="border-accent/40 bg-accent/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Quote className="h-4 w-4 text-accent" />
              Månadens kommentar från d365.se
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">{data.admin_comment}</CardContent>
        </Card>
      )}

      {/* Executive summary */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Din aktivitet i {formatMonthLabel(data.month)}</h3>
        {!hasData && (
          <p className="text-sm text-muted-foreground">
            {dataStartLabel
              ? `Data börjar samlas från ${dataStartLabel}. För den här perioden finns ännu inget underlag att visa.`
              : "Data börjar samlas in. För den här perioden finns ännu inget underlag att visa."}
          </p>
        )}
        {hasData && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <KpiCard icon={Eye} label="Exponeringar" value={m.impressions} current={m.impressions} previous={prev.impressions} hint={`${m.impressionSessions} unika sessioner`} />
              <KpiCard icon={UserCheck} label="Profilbesök" value={m.profileViews} current={m.profileViews} previous={prev.profileViews} hint={visitRate !== null ? `Profile visit rate ${visitRate} %` : undefined} />
              <KpiCard icon={Scale} label="Jämförelser" value={m.comparisons} current={m.comparisons} previous={prev.comparisons} />
              <KpiCard icon={CheckCircle2} label="Shortlist-val" value={m.compareAdds} current={m.compareAdds} previous={prev.compareAdds} />
              <KpiCard icon={MousePointerClick} label="Kontaktklick" value={m.contactClicks + m.websiteClicks} current={m.contactClicks + m.websiteClicks} previous={prev.contactClicks + prev.websiteClicks} />
              <KpiCard icon={Handshake} label="Förfrågningar" value={m.leads} current={m.leads} previous={prev.leads} />
            </div>
            <p className="text-xs text-muted-foreground">
              Jämförelse mot {formatMonthLabel(data.previous_month)}. Exponering = ditt kort har visats i
              filtrerade partnerresultat eller partnerlistor. Profilbesök = någon har aktivt öppnat din profil.
            </p>
          </>
        )}
      </section>

      {/* Buyer intent */}
      {hasData && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Köparintresse</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-0 max-w-xs">
              <FunnelStep label="profilbesök" value={m.profileViews} />
              <FunnelStep label="jämförelser" value={m.comparisons} />
              <FunnelStep label="shortlist-val" value={m.compareAdds} />
              <FunnelStep label="kontaktaktiviteter" value={m.contactClicks + m.websiteClicks} />
              <FunnelStep label="förfrågningar" value={m.leads} isLast />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b py-2"><span>Klick på partnerkort</span><span className="font-medium">{m.cardClicks}</span></div>
              <div className="flex justify-between border-b py-2"><span>Klick till din webbplats</span><span className="font-medium">{m.websiteClicks}</span></div>
              <div className="flex justify-between border-b py-2"><span>Kontaktaktiviteter (e-post, telefon, formulär)</span><span className="font-medium">{m.contactClicks}</span></div>
              <div className="flex justify-between border-b py-2"><span>Skickade förfrågningar</span><span className="font-medium">{m.leads}</span></div>
              <p className="text-xs text-muted-foreground pt-2">
                En kontaktaktivitet är inte samma sak som en förfrågan – begreppen redovisas separat.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* What buyers searched for */}
      {(data.current.breakdowns.product.length > 0 ||
        data.current.breakdowns.industry.length > 0 ||
        data.current.breakdowns.size.length > 0 ||
        data.current.breakdowns.geography.length > 0) && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Vad gjorde att köparna hittade din?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BreakdownList title="Produktområden" items={data.current.breakdowns.product} />
            <BreakdownList title="Branscher" items={data.current.breakdowns.industry} />
            <BreakdownList title="Företagsstorlek" items={data.current.breakdowns.size} />
            <BreakdownList title="Geografi" items={data.current.breakdowns.geography} />
          </div>
        </section>
      )}

      {/* Comparison */}
      {m.comparisons > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">När köpare jämför din</h3>
          <p className="text-sm">
            Du deltog i <strong>{m.comparisons}</strong> jämförelser den här månaden
            {shortlistRate !== null && m.compareAdds > 0 && (
              <> och valdes vidare till shortlist i <strong>{m.compareAdds}</strong> av dem ({shortlistRate} %)</>
            )}
            .
          </p>
          {data.current.comparedWith.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Partners du oftast jämfördes med</h4>
              <ul className="space-y-1 text-sm">
                {data.current.comparedWith.map((c) => (
                  <li key={c.name} className="flex items-center justify-between border-b py-1.5">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{c.count} jämförelser</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Profile strength */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Profilstyrka</h3>
        <div className="flex items-center gap-4">
          <p className="text-4xl font-bold">{data.strength.score} <span className="text-lg text-muted-foreground">/ 100</span></p>
          <Progress value={data.strength.score} className="h-2 flex-1" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <h4 className="text-sm font-semibold mb-2">På plats</h4>
            <ul className="space-y-1 text-sm">
              {data.strength.completed.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {c}
                </li>
              ))}
            </ul>
          </div>
          {data.strength.missing.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Kan kompletteras</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {data.strength.missing.map((c) => (
                  <li key={c}>⚠ {c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Vår rekommendation inför nästa månad</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {data.recommendations.map((r, i) => (
              <Card key={i} className="border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-start gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {r.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{r.body}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <footer className="flex items-center gap-2 pt-4 border-t">
        <Badge variant="outline">
          {data.status === "approved" ? "Godkänd" : data.status === "sent" ? "Skickad" : "Utkast"}
        </Badge>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          Underlaget bygger på anonymiserad mätning på d365.se
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </footer>
    </div>
  );
}
