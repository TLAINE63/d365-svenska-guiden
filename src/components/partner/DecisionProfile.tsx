import { Target, Package, Table2, AlertTriangle, Users, Building2, Calendar, Briefcase, Wrench } from "lucide-react";
import { DatabasePartner } from "@/hooks/usePartners";
import { calculateAiScore, getAiLevel } from "@/utils/aiScoring";

type DeliveryProfile = {
  roles?: string[];
  typical_length?: string;
  engagement_model?: string;
  methodology?: string;
};

interface Props {
  partner: DatabasePartner;
}

const EMPTY = <span className="text-slate-400 italic">Partner har inte fyllt i</span>;

const cleanList = (arr?: string[] | null): string[] =>
  (arr || []).map((s) => (s || "").trim()).filter(Boolean);

const DecisionProfile = ({ partner }: Props) => {
  const p = partner as DatabasePartner & {
    positioning_statement?: string | null;
    delivery_profile?: DeliveryProfile | null;
    team_size_sweden?: string | null;
    implementations_done?: string | null;
    not_a_fit?: string[] | null;
  };

  const positioning = (p.positioning_statement || "").trim();
  const delivery: DeliveryProfile = (p.delivery_profile || {}) as DeliveryProfile;
  const notAFit = cleanList(p.not_a_fit);
  const roles = cleanList(delivery.roles);

  // Derive headline tags
  const primaryApp = (partner.applications || [])[0];
  const primaryIndustry = (partner.industries || [])[0];
  const offices = (partner.office_cities || []).length;

  const score = calculateAiScore(partner.product_filters);
  const aiLevel = getAiLevel(score);

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-background to-slate-50/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Beslutsprofil
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Underlag för att välja — eller välja bort
            </h2>
          </div>

          {/* 1. Positionering */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Target className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
              Positionering
            </div>
            {positioning ? (
              <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
                {positioning}
              </p>
            ) : (
              <p className="text-base leading-relaxed">{EMPTY}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {primaryApp && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  <Briefcase className="w-3 h-3" /> {primaryApp}
                </span>
              )}
              {primaryIndustry && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  <Building2 className="w-3 h-3" /> {primaryIndustry}
                </span>
              )}
              {p.team_size_sweden && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  <Users className="w-3 h-3" /> {p.team_size_sweden} konsulter i Sverige
                </span>
              )}
            </div>
          </article>

          {/* 2. Leveransbild */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Package className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
              Leveransbild
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Typiska roller i teamet
                </div>
                {roles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {roles.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                        {r}
                      </span>
                    ))}
                  </div>
                ) : EMPTY}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Typisk projektlängd
                </div>
                <div className="text-slate-800">{delivery.typical_length?.trim() || EMPTY}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Uppdragsform
                </div>
                <div className="text-slate-800">{delivery.engagement_model?.trim() || EMPTY}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> Metod
                </div>
                <div className="text-slate-800">{delivery.methodology?.trim() || EMPTY}</div>
              </div>
            </div>
          </article>

          {/* 3. Jämförbar faktatabell */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Table2 className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
              Snabbfakta
              <span className="ml-2 normal-case tracking-normal text-[11px] font-normal text-slate-400">
                samma rader för alla partners — jämför enkelt
              </span>
            </div>
            <dl className="divide-y divide-slate-100 text-sm">
              {[
                ["Konsulter i Sverige (D365)", p.team_size_sweden],
                ["Genomförda D365-implementationer", p.implementations_done],
                ["Geografisk närvaro", offices > 0 ? `${offices} kontor` : null],
                ["Branschfokus", (partner.industries || []).slice(0, 3).join(", ") || null],
                ["AI-nivå", aiLevel.level !== "none" ? aiLevel.label : null],
                
              ].map(([label, value]) => (
                <div key={label as string} className="grid grid-cols-[1fr_auto] gap-4 py-2.5">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-slate-900 font-medium text-right">{value || EMPTY}</dd>
                </div>
              ))}
            </dl>
          </article>

          {/* 4. När passar vi inte */}
          <article className="rounded-xl border-2 border-amber-200 bg-amber-50/40 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              När passar vi inte
            </div>
            {notAFit.length > 0 ? (
              <ul className="space-y-2">
                {notAFit.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">
                {EMPTY}{" "}
                <span className="text-slate-500">
                  – partnern uppmuntras alltid ange situationer där de inte är rätt val.
                </span>
              </p>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Partnern definierar själv vilka situationer som inte är en god matchning. d365.se
              redigerar inte innehållet.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DecisionProfile;
