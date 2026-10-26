import { Link } from "react-router-dom";
import partnerData from "@/data/partnerData.json";
import { cn } from "@/lib/utils";

type LogoPartner = {
  slug: string;
  name: string;
  logo_url?: string | null;
  logo_dark_bg?: boolean | null;
  is_featured?: boolean | null;
  agreement_signed?: boolean | null;
};

/**
 * Publicerade partners som rullar längst ned i startsidans hero.
 * Avtalspartners först, därefter i bokstavsordning. Byggs från den statiska
 * partnerdatan så att listan finns i den förrenderade sidan.
 */
export const HERO_LOGO_PARTNERS: LogoPartner[] = (partnerData as LogoPartner[])
  .filter((p) => p.is_featured && p.slug && p.name)
  .sort(
    (a, b) =>
      Number(!!b.agreement_signed) - Number(!!a.agreement_signed) || a.name.localeCompare(b.name, "sv"),
  );

function LogoItem({ partner, hidden }: { partner: LogoPartner; hidden?: boolean }) {
  return (
    <li className="shrink-0 pr-3" aria-hidden={hidden || undefined}>
      <Link
        to={`/partner/${partner.slug}/`}
        tabIndex={hidden ? -1 : undefined}
        title={`${partner.name} – partnerprofil`}
        className={cn(
          "group flex h-10 w-28 sm:h-11 sm:w-32 items-center justify-center rounded-md px-3 transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))]",
        )}
      >
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={hidden ? "" : partner.name}
            loading="lazy"
            decoding="async"
            className="max-h-7 sm:max-h-8 max-w-full rounded-sm object-contain transition group-hover:scale-105"
          />
        ) : (
          <span className="truncate text-[12px] font-semibold text-foreground/70 group-hover:text-foreground">
            {partner.name}
          </span>
        )}
      </Link>
    </li>
  );
}

export default function HeroPartnerLogoMarquee({ className }: { className?: string }) {
  if (HERO_LOGO_PARTNERS.length === 0) return null;
  return (
    <div className={cn("relative rounded-md border border-border bg-background py-2 shadow-sm", className)}>
      <nav
        aria-label="Verifierade partners på d365.se"
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:overflow-x-auto"
      >
        <ul
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ ["--marquee-duration" as string]: `${HERO_LOGO_PARTNERS.length * 3}s` }}
        >
          {HERO_LOGO_PARTNERS.map((p) => (
            <LogoItem key={p.slug} partner={p} />
          ))}
          {/* Andra uppsättningen gör rullningen sömlös; den döljs för skärmläsare och tangentbord. */}
          {HERO_LOGO_PARTNERS.map((p) => (
            <LogoItem key={`dup-${p.slug}`} partner={p} hidden />
          ))}
        </ul>
      </nav>
    </div>
  );
}
