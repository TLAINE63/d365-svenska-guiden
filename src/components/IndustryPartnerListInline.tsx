import { Link } from "react-router-dom";
import { usePartners } from "@/hooks/usePartners";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

interface Props {
  industry: string;
}

/**
 * Renders all currently published (is_featured=true) partners for a given
 * industry as a compact card grid. Pulls live from the database so the list
 * always reflects current agreements – used as a backup at the bottom of each
 * branschguide article in Kunskapscentret.
 */
const IndustryPartnerListInline = ({ industry }: Props) => {
  const { data: partners, isLoading } = usePartners();

  if (isLoading) return null;

  const matching = (partners || [])
    .filter((p) => p.is_featured === true)
    .filter((p) => collectPartnerIndustries(p).has(industry))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));

  if (matching.length === 0) return null;

  return (
    <section className="not-prose my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">
        Publicerade partners för {industry} ({matching.length})
      </h3>
      <p className="mb-5 text-sm text-slate-600">
        Listan uppdateras automatiskt och visar samtliga partners med aktivt
        avtal som angett {industry.toLowerCase()} som bransch.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matching.map((p) => (
          <li key={p.id}>
            <Link
              to={`/partner/${p.slug}/`}
              className="flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-400 hover:shadow-sm"
            >
              {p.logo_url ? (
                <img
                  src={p.logo_url}
                  alt={`${p.name} logotyp`}
                  loading="lazy"
                  className="h-10 w-10 flex-shrink-0 rounded object-contain"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-500">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-slate-900">
                {p.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IndustryPartnerListInline;
