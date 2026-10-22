import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { nowrapBrand } from "@/lib/nowrapBrand";
import {
  aktuelltAvailabilityLabel,
  aktuelltPath,
  aktuelltProductLabel,
  aktuelltTopicLabel,
  showsAvailability,
  type AktuelltArticle,
} from "@/lib/aktuellt";
import { trackAktuelltOpen, type AktuelltClickSource } from "@/utils/trackAktuelltEvent";

interface Props {
  item: AktuelltArticle;
  clickSource: AktuelltClickSource;
}

/** Kort för en Aktuellt-analys. Samma kortmönster som Partnernytt, utan partneruppgifter. */
export default function AktuelltCard({ item, clickSource }: Props) {
  const { pathname } = useLocation();
  const kind = item.product_keys?.[0] ? aktuelltProductLabel(item.product_keys[0]) : aktuelltTopicLabel(item.topic);
  const date = (item.fact_checked_at || item.published_at || "").slice(0, 10);
  const dateLabel = item.fact_checked_at ? "Faktakontrollerad" : "Publicerad";

  return (
    <Link
      to={aktuelltPath(item.slug)}
      onClick={() => trackAktuelltOpen(item, clickSource, pathname)}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {kind && <span className="font-semibold uppercase tracking-wider text-accent">{nowrapBrand(kind)}</span>}
        {showsAvailability(item.availability_status) && (
          <span className="rounded-full border border-border bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
            {aktuelltAvailabilityLabel(item.availability_status)}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary">{nowrapBrand(item.title)}</h3>
      {item.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{nowrapBrand(item.description)}</p>}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
        {date ? <span>{dateLabel} {date}</span> : <span />}
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          Läs analysen <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
