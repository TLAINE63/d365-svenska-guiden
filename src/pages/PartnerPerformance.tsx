import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Eye,
  GitCompare,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  Users,
  Search,
  MousePointerClick,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** Designsystem för partnerportalen */
const NAVY = "#18324A";
const CTA = "#D64A1F";
const BG = "#F3F6F8";
const TEXT = "#2B2B2B";

interface Kpi {
  key: string;
  label: string;
  value: number;
  change: number | null;
}
interface SeriesRow {
  month: string;
  list: number;
  filter: number;
  comparison: number;
  match: number;
  total: number;
  profileViews: number;
  leads: number;
}
interface Counts {
  exposures: number;
  listImpressions: number;
  filterImpressions: number;
  comparisonImpressions: number;
  matchImpressions: number;
  profileViews: number;
  profileReturns: number;
  caseClicks: number;
  competencyClicks: number;
  saved: number;
  addedToComparison: number;
  matchRecommended: number;
  matchSelected: number;
  leads: number;
  contactRequests: number;
  introRequests: number;
}
interface GscTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
interface SearchConsoleData {
  available: boolean;
  property: string;
  days: number;
  period: { start: string; end: string };
  current: GscTotals;
  previous: GscTotals;
  topQueries: { query: string; clicks: number; impressions: number; position: number }[];
  topPages: { page: string; clicks: number; impressions: number; position: number }[];
}
interface Data {
  partner: { name: string; slug: string; logo_url: string | null };
  kpis: Kpi[];
  current: Counts;
  visibilitySeries: SeriesRow[];
  buyingSignals: { profileVisitors: number; erp: number; crm: number; ai: number };
  benchmark: { label: string; value: number; average: number; percentile: number }[];
  searchConsole?: SearchConsoleData | null;
  recommendations: { title: string; body: string }[];
  cta: { level: "low" | "normal" | "high"; title: string; button: string };
  generatedAt: string;
}

const KPI_ICONS: Record<string, typeof Eye> = {
  exposures: Eye,
  profileViews: Users,
  comparisons: GitCompare,
  leads: Target,
  gscImpressions: Search,
  gscClicks: MousePointerClick,
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(24,50,74,0.08)] ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title, sub }: { icon: typeof Eye; title: string; sub?: string }) => (
  <div className="mb-4 flex items-start gap-3">
    <span
      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${NAVY}12`, color: NAVY }}
    >
      <Icon className="h-4.5 w-4.5" />
    </span>
    <div>
      <h2 className="text-lg font-bold" style={{ color: NAVY }}>
        {title}
      </h2>
      {sub && <p className="text-sm" style={{ color: `${TEXT}b3` }}>{sub}</p>}
    </div>
  </div>
);

const StatRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
    <span className="text-sm" style={{ color: TEXT }}>{label}</span>
    <span className="text-sm font-bold" style={{ color: NAVY }}>{value.toLocaleString("sv-SE")}</span>
  </div>
);

export default function PartnerPerformance() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [gscDays, setGscDays] = useState<7 | 28 | 90>(28);
  const [gscLoading, setGscLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-performance`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, gscDays }),
          },
        );
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json?.error || "Kunde inte hämta rapporten");
        } else {
          setData(json as Data);
        }
      } catch {
        if (!cancelled) setError("Kunde inte hämta rapporten");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (token) void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Hämta bara om Search Console-delen när tidsintervallet ändras
  useEffect(() => {
    if (!token || !data) return;
    if (data.searchConsole?.days === gscDays) return;
    let cancelled = false;
    const loadGsc = async () => {
      setGscLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-performance`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, gscDays }),
          },
        );
        const json = await res.json();
        if (cancelled || !res.ok) return;
        setData((prev) => {
          if (!prev) return prev;
          const gscKpis = ((json as Data).kpis ?? []).filter((k) =>
            k.key.startsWith("gsc"),
          );
          return {
            ...prev,
            searchConsole: (json as Data).searchConsole ?? null,
            kpis: [
              ...prev.kpis.filter((k) => !k.key.startsWith("gsc")),
              ...gscKpis,
            ],
          };
        });
      } catch {
        /* behåll befintlig data vid fel */
      } finally {
        if (!cancelled) setGscLoading(false);
      }
    };
    void loadGsc();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gscDays, token]);

  const chartData = useMemo(
    () =>
      (data?.visibilitySeries ?? []).map((r) => ({
        ...r,
        label: r.month.slice(2).replace("-", "/"),
      })),
    [data],
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <SEOHead
        title="Partner Performance | d365.se"
        description="Din partnerrapport: exponering, utvärdering, köpsignaler och affärsmöjligheter på d365.se."
        noIndex
      />

      <header className="px-4 py-10 sm:px-6" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: CTA }}>
            Partner Performance
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {data?.partner?.name ?? "Din partnerrapport"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Så deltar ni i köparens ERP-, CRM- och AI-resa på d365.se – från exponering och
            utvärdering till köpsignaler och affärsmöjligheter.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="flex items-center gap-2 py-20 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Hämtar din rapport…
          </div>
        )}

        {!loading && error && (
          <Card>
            <p className="text-sm font-semibold" style={{ color: NAVY }}>{error}</p>
            <p className="mt-1 text-sm" style={{ color: `${TEXT}b3` }}>
              Kontrollera din länk eller kontakta oss på thomas.laine@dynamicfactory.se.
            </p>
          </Card>
        )}

        {!loading && data && (
          <div className="space-y-8">
            {/* KPI-kort */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.kpis.map((kpi) => {
                const Icon = KPI_ICONS[kpi.key] ?? Activity;
                const positive = (kpi.change ?? 0) >= 0;
                return (
                  <Card key={kpi.key}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: `${TEXT}b3` }}>
                        {kpi.label}
                      </span>
                      <Icon className="h-4 w-4" style={{ color: NAVY }} />
                    </div>
                    <div className="mt-3 text-3xl font-bold" style={{ color: NAVY }}>
                      {kpi.value.toLocaleString("sv-SE")}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
                      {kpi.change === null ? (
                        <span style={{ color: `${TEXT}80` }}>Ingen jämförelse ännu</span>
                      ) : (
                        <>
                          {positive ? (
                            <ArrowUpRight className="h-3.5 w-3.5" style={{ color: CTA }} />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span style={{ color: positive ? CTA : "#64748b" }}>
                            {positive ? "+" : ""}
                            {kpi.change}% mot föregående månad
                          </span>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Google Search Console */}
            {data.searchConsole?.available && (
              <Card>
                <SectionTitle
                  icon={Search}
                  title="Google-synlighet för din partnersida"
                  sub={`Search Console, ${data.searchConsole.period.start} – ${data.searchConsole.period.end} (28 dagar).`}
                />
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { label: "Visningar", value: data.searchConsole.current.impressions.toLocaleString("sv-SE") },
                    { label: "Klick", value: data.searchConsole.current.clicks.toLocaleString("sv-SE") },
                    { label: "CTR", value: `${data.searchConsole.current.ctr.toLocaleString("sv-SE")} %` },
                    {
                      label: "Snittposition",
                      value: data.searchConsole.current.position
                        ? data.searchConsole.current.position.toLocaleString("sv-SE")
                        : "–",
                    },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl p-4" style={{ backgroundColor: `${NAVY}08` }}>
                      <div className="text-xs font-medium" style={{ color: `${TEXT}b3` }}>{m.label}</div>
                      <div className="mt-1 text-2xl font-bold" style={{ color: NAVY }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                {data.searchConsole.topQueries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-bold" style={{ color: NAVY }}>
                      Sökfrågor som leder till din profil
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ color: `${TEXT}b3` }}>
                            <th className="py-2 text-left font-medium">Sökfråga</th>
                            <th className="py-2 text-right font-medium">Visningar</th>
                            <th className="py-2 text-right font-medium">Klick</th>
                            <th className="py-2 text-right font-medium">Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.searchConsole.topQueries.map((q) => (
                            <tr key={q.query} className="border-t border-slate-100">
                              <td className="py-2 pr-3" style={{ color: TEXT }}>{q.query}</td>
                              <td className="py-2 text-right" style={{ color: TEXT }}>{q.impressions.toLocaleString("sv-SE")}</td>
                              <td className="py-2 text-right" style={{ color: TEXT }}>{q.clicks.toLocaleString("sv-SE")}</td>
                              <td className="py-2 text-right" style={{ color: TEXT }}>{q.position.toLocaleString("sv-SE")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Sektion 1 – Synlighet */}
            <Card>
              <SectionTitle
                icon={BarChart3}
                title="1. Synlighet"
                sub="Exponeringar från partnerlistor, filtrerade sökningar, jämförelser och matchningar – 12 månader."
              />
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="list" stackId="a" name="Partnerlistor" fill={NAVY} />
                    <Bar dataKey="filter" stackId="a" name="Filtrerade sökningar" fill="#3F6D96" />
                    <Bar dataKey="comparison" stackId="a" name="Jämförelser" fill="#7FA6C4" />
                    <Bar dataKey="match" stackId="a" name="Matchningar" fill={CTA} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Sektion 2 – Utvärdering */}
            <Card>
              <SectionTitle
                icon={Users}
                title="2. Utvärdering"
                sub="När köparen aktivt interagerar med er profil (senaste 30 dagarna)."
              />
              <div className="grid gap-x-8 sm:grid-cols-2">
                <div>
                  <StatRow label="Profilvisningar" value={data.current.profileViews} />
                  <StatRow label="Återbesök" value={data.current.profileReturns} />
                  <StatRow label="Tillagd i jämförelse" value={data.current.addedToComparison} />
                </div>
                <div>
                  <StatRow label="Sparad i shortlist" value={data.current.saved} />
                  <StatRow label="Klick på kundcase" value={data.current.caseClicks} />
                  <StatRow label="Klick på kompetensområden" value={data.current.competencyClicks} />
                </div>
              </div>
            </Card>

            {/* Sektion 3 – Köpsignaler */}
            <Card>
              <SectionTitle
                icon={Sparkles}
                title="3. Köpsignaler"
                sub="Besökare som både sett er profil och visat tecken på en aktiv köpresa."
              />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "ERP Intent", value: data.buyingSignals.erp, hint: "ERP-guider, budgetkalkyl, Business Central" },
                  { label: "CRM Intent", value: data.buyingSignals.crm, hint: "CRM-guider, ROI-kalkyl, CRM-jämförelser" },
                  { label: "AI Intent", value: data.buyingSignals.ai, hint: "Copilot, agenter, Power Platform" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: `${NAVY}08` }}>
                    <div className="text-sm font-semibold" style={{ color: NAVY }}>{s.label}</div>
                    <div className="mt-1 text-2xl font-bold" style={{ color: CTA }}>
                      {s.value.toLocaleString("sv-SE")}
                    </div>
                    <p className="mt-1 text-xs" style={{ color: `${TEXT}99` }}>{s.hint}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs" style={{ color: `${TEXT}99` }}>
                Underlag: {data.buyingSignals.profileVisitors.toLocaleString("sv-SE")} unika besökare
                har sett er profil under perioden. All mätning är anonym.
              </p>
            </Card>

            {/* Sektion 4 – Resultat */}
            <Card>
              <SectionTitle
                icon={Target}
                title="4. Resultat"
                sub="Affärsmöjligheter som skapats via d365.se."
              />
              <div className="grid gap-x-8 sm:grid-cols-2">
                <div>
                  <StatRow label="Kontaktförfrågningar" value={data.current.contactRequests} />
                  <StatRow label="Introduktioner från d365.se" value={data.current.introRequests} />
                </div>
                <div>
                  <StatRow label="Rekommenderad i matchning" value={data.current.matchRecommended} />
                  <StatRow label="Vald i matchning" value={data.current.matchSelected} />
                </div>
              </div>
            </Card>

            {/* Benchmark */}
            <Card>
              <SectionTitle
                icon={GitCompare}
                title="Benchmark mot jämförbara verifierade partner"
                sub="Senaste 30 dagarna."
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left" style={{ color: `${TEXT}99` }}>
                      <th className="py-2 font-medium">Mätvärde</th>
                      <th className="py-2 font-medium">Ni</th>
                      <th className="py-2 font-medium">Snitt</th>
                      <th className="py-2 font-medium">Placering</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.benchmark.map((b) => (
                      <tr key={b.label} className="border-t border-slate-100">
                        <td className="py-2">{b.label}</td>
                        <td className="py-2 font-bold" style={{ color: NAVY }}>{b.value}</td>
                        <td className="py-2">{b.average}</td>
                        <td className="py-2 font-semibold" style={{ color: b.percentile >= 75 ? CTA : TEXT }}>
                          {b.percentile >= 80
                            ? "Topp 20 %"
                            : b.percentile >= 75
                              ? "Topp 25 %"
                              : b.percentile >= 50
                                ? "Övre halvan"
                                : "Under snittet"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Rekommendationer */}
            {data.recommendations.length > 0 && (
              <Card>
                <SectionTitle
                  icon={Lightbulb}
                  title="Rekommendationer"
                  sub="Konkreta förbättringar som ökar synlighet och matchningsprecision."
                />
                <ul className="space-y-3">
                  {data.recommendations.map((r) => (
                    <li key={r.title} className="rounded-xl border border-slate-100 p-4">
                      <div className="font-semibold" style={{ color: NAVY }}>{r.title}</div>
                      <p className="mt-1 text-sm" style={{ color: `${TEXT}cc` }}>{r.body}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Dynamisk CTA */}
            <div
              className="rounded-2xl p-8 text-center shadow-[0_2px_12px_rgba(24,50,74,0.08)]"
              style={{ backgroundColor: NAVY }}
            >
              <h2 className="text-xl font-bold text-white sm:text-2xl">{data.cta.title}</h2>
              <a
                href={`mailto:thomas.laine@dynamicfactory.se?subject=${encodeURIComponent(
                  `${data.cta.button} – ${data.partner.name}`,
                )}`}
                className="mt-5 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: CTA }}
              >
                {data.cta.button}
              </a>
            </div>

            <p className="pb-8 text-center text-xs" style={{ color: `${TEXT}80` }}>
              Rapporten uppdateras löpande och bygger på anonymiserad mätning. Ingen
              besöksidentitet delas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
