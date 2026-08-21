import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { PRODUCT_ROI_PAGES } from "@/data/productRoiPages";
import type { ProductRoiKey } from "@/data/productRoiConfigs";

interface Props {
  productKey: ProductRoiKey;
  /** Anchor-id så hero-knappens scroll fortfarande hittar hit om någon länkar med #roi-tco. */
  id?: string;
}

/**
 * CTA-sektion som ersätter den inbäddade ROI/TCO-kalkylatorn på produktsidorna.
 * Visuellt speglar Matchningstest-CTA:n: mörk bakgrund, eyebrow, rubrik, ingress
 * och en orange knapp som länkar till huvudkalkylen i Kunskapscentret.
 */
export default function ProductRoiCta({ productKey, id = "roi-tco" }: Props) {
  const meta = PRODUCT_ROI_PAGES[productKey];

  return (
    <section
      id={id}
      className="py-10 sm:py-12 bg-[hsl(var(--hero-dark))] border-y border-primary/20"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-2 flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5" /> TCO/ROI-kalkyl
            </p>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-white leading-snug mb-2">
              Hur ser totalkostnad och payback ut för {meta.productShort}?
            </h2>
            <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">
              Räkna fram en indikativ TCO över 5 år, årlig nytta och payback utifrån dina
              egna förutsättningar – användare, omsättning, bransch och komplexitet.
              Resultatet är ett beslutsstöd, inte en offert.
            </p>
          </div>
          <Link
            to={meta.path}
            className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))] transition-colors whitespace-nowrap"
          >
            Gör en TCO/ROI-kalkyl →
          </Link>
        </div>
      </div>
    </section>
  );
}
