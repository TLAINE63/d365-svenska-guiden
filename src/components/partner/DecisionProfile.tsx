import { Target, Table2, Users, Building2, Briefcase, Info } from "lucide-react";
import { DatabasePartner } from "@/hooks/usePartners";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TEAM_SIZE_HELP =
  "Många partners förstärker leveransteamet med kollegor från nordiska/europeiska kontor. Fråga partnern hur många som faktiskt arbetar med er valda applikation och bransch — det är mer relevant än totalsiffran i Sverige.";

type DeliveryProfile = {
  typical_length?: string;
  methodology?: string;
  bc_project_weeks_min?: number | null;
  bc_project_weeks_max?: number | null;
  bc_project_cost_band?: string | null;
};

const COST_BAND_LABELS: Record<string, string> = {
  "<250k": "< 250 000 kr",
  "250k–500k": "250 000 – 500 000 kr",
  "500k–1M": "500 000 kr – 1 MSEK",
  "1M–2.5M": "1 – 2,5 MSEK",
  "2.5M–5M": "2,5 – 5 MSEK",
  "5M–10M": "5 – 10 MSEK",
  ">10M": "> 10 MSEK",
};

const formatBcCost = (dp?: DeliveryProfile | null): string | null => {
  const band = dp?.bc_project_cost_band;
  if (!band) return null;
  return COST_BAND_LABELS[band] || band;
};

const formatBcLength = (dp?: DeliveryProfile | null): string | null => {
  if (!dp) return null;
  const min = typeof dp.bc_project_weeks_min === "number" ? dp.bc_project_weeks_min : null;
  const max = typeof dp.bc_project_weeks_max === "number" ? dp.bc_project_weeks_max : null;
  if (min != null && max != null) return `${min}–${max} veckor`;
  if (min != null) return `Från ${min} veckor`;
  if (max != null) return `Upp till ${max} veckor`;
  return null;
};

interface Props {
  partner: DatabasePartner;
}

const EMPTY = <span className="text-slate-600 italic">Partner har inte fyllt i</span>;


const DecisionProfile = ({ partner }: Props) => {
  const p = partner as DatabasePartner & {
    positioning_statement?: string | null;
    delivery_profile?: DeliveryProfile | null;
    team_size_sweden?: string | null;
    implementations_done?: string | null;
    implementations_per_app?: Record<string, string> | null;
    not_a_fit?: string[] | null;
  };

  const positioning = (p.positioning_statement || "").trim();
  const implPerApp = Object.entries(p.implementations_per_app || {})
    .filter(([, v]) => typeof v === "string" && v.trim())
    .map(([app, count]) => ({ app, count: count.trim() }));

  // Derive headline tags
  const primaryApp = (partner.applications || [])[0];
  const primaryIndustry = (partner.industries || [])[0];
  const offices = (partner.office_cities || []).length;

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-background to-slate-50/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Beslutsprofil
            </p>
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
                  <Users className="w-3 h-3" /> Lokalt team (Sverige): {p.team_size_sweden}
                </span>
              )}
            </div>
          </article>


          {/* 3. Jämförbar faktatabell */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Table2 className="w-4 h-4 text-[hsl(var(--cta-orange))]" />
              Snabbfakta
              <span className="ml-2 normal-case tracking-normal text-[11px] font-normal text-slate-600">
                samma rader för alla partners — jämför enkelt
              </span>
            </div>
            <dl className="divide-y divide-slate-100 text-sm">
              {[
              { label: "Lokal teamstorlek (Sverige)", value: p.team_size_sweden, help: TEAM_SIZE_HELP },
              {
                label: "Genomförda implementationer",
                value:
                  implPerApp.length > 0 ? (
                    <div className="flex flex-col items-end gap-0.5">
                      {implPerApp.map(({ app, count }) => (
                        <div key={app} className="text-slate-900">
                          <span className="text-slate-500 font-normal">{app}:</span>{" "}
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    p.implementations_done || null
                  ),
                help:
                  "Antal genomförda D365-implementationer per applikation. Säger något om volym, inte om kvalitet eller branschpassning — be alltid om referenser i den bransch ni befinner er i.",
              },
              { label: "Branschfokus", value: (partner.industries || []).slice(0, 3).join(", ") || null },
              {
                label: "Typisk BC-projektlängd",
                value: formatBcLength(p.delivery_profile),
                help: "Partnerns egna spann för typisk implementationstid av Business Central, mätt i veckor från projektstart till driftsättning. Verklig längd beror på scope, datakvalitet och organisationens beslutskraft.",
              },
              {
                label: "Typisk total projektkostnad (BC)",
                value: formatBcCost(p.delivery_profile),
                help: "Partnerns egna kostnadsband för typisk Business Central-implementation (exkl. licenser). Använd som indikation — slutpriset beror på scope, integrationer, datamigrering och förändringsledning.",
              },
              
              
              ].map(({ label, value, help }) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-2.5">
                  <dt className="text-slate-500 flex items-center gap-1.5">
                    {label}
                    {help && (
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" aria-label={`Vad betyder ${label}?`} className="text-slate-600 hover:text-slate-900">
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                            {help}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </dt>
                  <dd className="text-slate-900 font-medium text-right">{value || EMPTY}</dd>
                </div>
              ))}
            </dl>
          </article>

        </div>
      </div>
    </section>
  );
};

export default DecisionProfile;
