import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Package,
  Table2,
  AlertTriangle,
  ArrowLeftRight,
  ExternalLink,
  X,
} from "lucide-react";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { calculateAiScore, getAiLevel } from "@/utils/aiScoring";

type DeliveryProfile = {
  roles?: string[];
  typical_length?: string;
  engagement_model?: string;
  methodology?: string;
};

const EMPTY = <span className="text-slate-400 italic">—</span>;

const cleanList = (arr?: string[] | null): string[] =>
  (arr || []).map((s) => (s || "").trim()).filter(Boolean);

interface ColProps {
  partner: DatabasePartner | undefined;
  partners: DatabasePartner[];
  slug: string;
  onChange: (slug: string) => void;
  onClear: () => void;
  label: string;
}

const PartnerColumnHeader = ({ partner, partners, slug, onChange, onClear, label }: ColProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
      {label}
    </div>
    <Select value={slug || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-10">
        <SelectValue placeholder="Välj partner…" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {partners.map((p) => (
          <SelectItem key={p.slug} value={p.slug}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {partner && (
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link
          to={`/partner/${partner.slug}`}
          className="text-sm font-semibold text-foreground hover:underline truncate flex items-center gap-1 min-w-0"
        >
          <span className="truncate">{partner.name}</span>
          <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
        </Link>
        <button
          onClick={onClear}
          className="text-slate-400 hover:text-slate-700 shrink-0"
          aria-label="Rensa val"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

const Cell = ({ children, mobileLabel }: { children: React.ReactNode; mobileLabel?: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4 text-sm text-slate-800 min-h-[56px] sm:min-h-[64px]">
    {mobileLabel && (
      <div className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
        {mobileLabel}
      </div>
    )}
    {children}
  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
  tone = "default",
}: {
  icon: any;
  title: string;
  tone?: "default" | "warn";
}) => (
  <div
    className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
      tone === "warn" ? "text-amber-700" : "text-slate-500"
    }`}
  >
    <Icon
      className={`w-4 h-4 ${
        tone === "warn" ? "" : "text-[hsl(var(--cta-orange))]"
      }`}
    />
    {title}
  </div>
);

const Row = ({
  label,
  a,
  b,
  warn = false,
  aName,
  bName,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  warn?: boolean;
  aName?: string;
  bName?: string;
}) => (
  <div className="md:grid md:grid-cols-[180px_1fr_1fr] md:gap-3 md:items-stretch">
    <div
      className={`text-xs font-semibold uppercase tracking-wider ${
        warn ? "text-amber-700" : "text-slate-500"
      } mb-2 md:mb-0 md:pt-4 md:normal-case md:font-medium md:tracking-normal`}
    >
      {label}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:contents">
      <Cell mobileLabel={aName || "Partner A"}>{a}</Cell>
      <Cell mobileLabel={bName || "Partner B"}>{b}</Cell>
    </div>
  </div>
);

const renderValue = (v: string | null | undefined) =>
  v && v.trim() ? <span>{v}</span> : EMPTY;

const renderList = (items: string[]) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r, i) => (
        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
          {r}
        </span>
      ))}
    </div>
  ) : (
    EMPTY
  );

const renderNotAFit = (items: string[]) =>
  items.length > 0 ? (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  ) : (
    EMPTY
  );

const ComparePartners = () => {
  const [params, setParams] = useSearchParams();
  const aSlug = params.get("a") || "";
  const bSlug = params.get("b") || "";

  const { data: partners = [], isLoading } = usePartners();

  const sortedPartners = useMemo(
    () => [...partners].sort((x, y) => x.name.localeCompare(y.name, "sv")),
    [partners]
  );

  const a = partners.find((p) => p.slug === aSlug);
  const b = partners.find((p) => p.slug === bSlug);

  const setSlot = (key: "a" | "b", slug: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set(key, slug);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const swap = () => {
    const next = new URLSearchParams(params);
    if (aSlug) next.set("b", aSlug);
    else next.delete("b");
    if (bSlug) next.set("a", bSlug);
    else next.delete("a");
    setParams(next, { replace: true });
  };

  const get = (p?: DatabasePartner) => {
    const dp = (p?.delivery_profile || {}) as DeliveryProfile;
    const offices = (p?.office_cities || []).length;
    const score = p ? calculateAiScore(p.product_filters) : 0;
    const aiLevel = getAiLevel(score);
    return {
      positioning: p?.positioning_statement?.trim() || "",
      primaryApp: (p?.applications || [])[0],
      primaryIndustry: (p?.industries || [])[0],
      roles: cleanList(dp.roles),
      length: dp.typical_length?.trim() || "",
      engagement: dp.engagement_model?.trim() || "",
      methodology: dp.methodology?.trim() || "",
      teamSize: p?.team_size_sweden?.trim() || "",
      implementations: p?.implementations_done?.trim() || "",
      offices: offices > 0 ? `${offices} kontor` : "",
      industries: (p?.industries || []).slice(0, 3),
      aiLevel: aiLevel.level !== "none" ? aiLevel.label : "",
      agreement: p ? (p.agreement_signed ? "Ja" : "Nej") : "",
      notAFit: cleanList(p?.not_a_fit),
    };
  };

  const A = get(a);
  const B = get(b);
  const hasBoth = !!a && !!b;
  const aName = a?.name;
  const bName = b?.name;
  const R = (props: { label: string; a: React.ReactNode; b: React.ReactNode; warn?: boolean }) => (
    <Row {...props} aName={aName} bName={bName} />
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Jämför Dynamics 365-partner sida vid sida | d365.se"
        description="Jämför två Microsoft Dynamics 365-partner mot samma beslutsprofil: positionering, leveransbild, fakta och 'när passar vi inte'."
        canonicalPath="/jamfor-partners"
        noIndex
      />
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Jämförelsevy
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Jämför två partner sida vid sida
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
                Samma rader för båda partner — positionering, leveransbild,
                snabbfakta och "när passar vi inte". Underlag för beslut, inte
                rangordning.
              </p>
            </header>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Laddar partner…</div>
            ) : (
              <>
                {/* Picker row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[180px_1fr_1fr] gap-3 mb-4">
                  <div className="order-last md:order-first flex md:items-end md:pb-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={swap}
                      disabled={!hasBoth}
                      className="h-9 w-full"
                    >
                      <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                      Byt plats
                    </Button>
                  </div>
                  <PartnerColumnHeader
                    label="Partner A"
                    partner={a}
                    partners={sortedPartners}
                    slug={aSlug}
                    onChange={(s) => setSlot("a", s)}
                    onClear={() => setSlot("a", "")}
                  />
                  <PartnerColumnHeader
                    label="Partner B"
                    partner={b}
                    partners={sortedPartners}
                    slug={bSlug}
                    onChange={(s) => setSlot("b", s)}
                    onClear={() => setSlot("b", "")}
                  />
                </div>

                {!hasBoth && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 mb-6">
                    Välj två partner ovan för att se jämförelsen.
                  </div>
                )}

                {hasBoth && (
                  <div className="space-y-8">
                    {/* Positionering */}
                    <section className="space-y-3">
                      <SectionTitle icon={Target} title="Positionering" />
                      <R
                        label="Vi är valet när…"
                        a={A.positioning ? <p className="font-medium leading-relaxed">{A.positioning}</p> : EMPTY}
                        b={B.positioning ? <p className="font-medium leading-relaxed">{B.positioning}</p> : EMPTY}
                      />
                      <R
                        label="Primär app"
                        a={renderValue(A.primaryApp)}
                        b={renderValue(B.primaryApp)}
                      />
                      <R
                        label="Primär bransch"
                        a={renderValue(A.primaryIndustry)}
                        b={renderValue(B.primaryIndustry)}
                      />
                    </section>

                    {/* Leveransbild */}
                    <section className="space-y-3">
                      <SectionTitle icon={Package} title="Leveransbild" />
                      <R label="Typiska roller" a={renderList(A.roles)} b={renderList(B.roles)} />
                      <R
                        label="Uppdragsform"
                        a={renderValue(A.engagement)}
                        b={renderValue(B.engagement)}
                      />
                      <R
                        label="Projektmetodik"
                        a={renderValue(A.methodology)}
                        b={renderValue(B.methodology)}
                      />
                      <p className="text-xs text-slate-500 leading-relaxed pt-1">
                        <Calendar className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5 text-slate-400" />
                        <span className="font-medium text-slate-600">Projektlängd:</span> varierar kraftigt med applikation, bolagsstorlek och scope — be respektive partner om exempel från liknande projekt.
                      </p>
                    </section>

                    {/* Snabbfakta */}
                    <section className="space-y-3">
                      <SectionTitle icon={Table2} title="Snabbfakta" />
                      <R
                        label="Konsulter i Sverige"
                        a={renderValue(A.teamSize)}
                        b={renderValue(B.teamSize)}
                      />
                      <R
                        label="Genomförda D365-impl."
                        a={renderValue(A.implementations)}
                        b={renderValue(B.implementations)}
                      />
                      <R
                        label="Geografisk närvaro"
                        a={renderValue(A.offices)}
                        b={renderValue(B.offices)}
                      />
                      <R
                        label="Branschfokus"
                        a={renderList(A.industries)}
                        b={renderList(B.industries)}
                      />
                      <R label="AI-nivå" a={renderValue(A.aiLevel)} b={renderValue(B.aiLevel)} />
                    </section>

                    {/* När passar vi inte */}
                    <section className="space-y-3">
                      <SectionTitle icon={AlertTriangle} title="När passar vi inte" tone="warn" />
                      <R
                        label="Partnern säger själv"
                        a={renderNotAFit(A.notAFit)}
                        b={renderNotAFit(B.notAFit)}
                        warn
                      />
                    </section>

                    <p className="text-xs text-slate-500 text-center pt-4">
                      Innehåll i beslutsprofilen är skrivet av partnern själv. d365.se redigerar inte.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComparePartners;
