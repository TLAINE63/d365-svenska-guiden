import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTA {
  label: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

interface ProductHeroProps {
  /** Small product icon (Microsoft logo). Kept intentionally minimal. */
  icon?: string;
  eyebrow?: string;
  /** First line of H1 — rendered in white. */
  title: string;
  /** Second line of H1 — rendered in italic accent teal. Forced linebreak between. */
  titleAccent?: string;
  /** d365.se-voice subhead — independent perspective, not Microsoft blurb. */
  subhead: string;
  /** Primary CTA (orange). */
  primary: CTA;
  /** Secondary CTA (ghost outline). Optional. Max 2 CTAs total. */
  secondary?: CTA;
  /** Optional right-side decorative photo (not full-bleed bg). */
  photo?: string;
  photoAlt?: string;
}

const renderCTA = (cta: CTA, variant: "primary" | "secondary") => {
  const Icon = cta.icon;
  const baseClasses =
    variant === "primary"
      ? "bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 shadow-lg shadow-[hsl(var(--cta-orange))]/30 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5"
      : "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50";

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {cta.label}
      {variant === "primary" && !Icon && <ArrowRight className="w-5 h-5 ml-2" />}
    </>
  );

  const className = `${baseClasses} text-base sm:text-lg h-14 sm:h-16 px-6 sm:px-8 rounded-xl font-bold w-full sm:w-auto justify-center transition-all`;

  if (cta.to) {
    return (
      <Button asChild size="lg" className={className}>
        <Link to={cta.to}>{content}</Link>
      </Button>
    );
  }
  if (cta.href) {
    return (
      <Button asChild size="lg" className={className}>
        <a href={cta.href}>{content}</a>
      </Button>
    );
  }
  return (
    <Button size="lg" className={className} onClick={cta.onClick}>
      {content}
    </Button>
  );
};

const ProductHero = ({
  icon,
  eyebrow,
  title,
  titleAccent,
  subhead,
  primary,
  secondary,
  photo,
  photoAlt,
}: ProductHeroProps) => {
  return (
    <section className="bg-gradient-to-br from-[hsl(192_48%_14%)] via-[hsl(192_46%_18%)] to-[hsl(197_42%_22%)] border-b border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 md:pb-16 relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
          <div>
            {(icon || eyebrow) && (
              <div className="flex items-center gap-2.5 mb-4">
                {icon && (
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6 opacity-90"
                  />
                )}
                {eyebrow && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                    {eyebrow}
                  </span>
                )}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.75] tracking-tight text-white mb-12 max-w-3xl">
              {title}
              {titleAccent && (
                <>
                  <br />
                  <span className="text-[hsl(180_75%_65%)] font-normal italic">
                    {titleAccent}
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-light leading-[1.9] mb-8 max-w-2xl">
              {subhead}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {renderCTA(primary, "primary")}
              {secondary && renderCTA(secondary, "secondary")}
            </div>
          </div>

          {photo && (
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent rounded-2xl z-10" />
              <img
                src={photo}
                alt={photoAlt ?? ""}
                className="w-[320px] h-[320px] object-cover rounded-2xl border border-white/10 shadow-2xl"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
