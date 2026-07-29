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
  /** First line of H1 – rendered in white. */
  title: string;
  /** Second line of H1 – rendered in italic signature accent. Forced linebreak between. */
  titleAccent?: string;
  /** d365.se-voice subhead – independent perspective, not Microsoft blurb. */
  subhead: string;
  /** Primary CTA (orange). */
  primary: CTA;
  /** Secondary CTA (ghost outline). Optional. */
  secondary?: CTA;
  /** Tertiary CTA (ghost outline). Optional. */
  tertiary?: CTA;
  /** Optional right-side decorative photo (not full-bleed bg). */
  photo?: string;
  photoAlt?: string;
}

const renderCTA = (cta: CTA, variant: "primary" | "secondary") => {
  const Icon = cta.icon;
  const baseClasses =
    variant === "primary"
      ? "bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))]     hover:-translate-y-0.5"
      : "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50";

  const content = (
    <>
      {Icon && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
      <span className="text-center leading-tight whitespace-normal break-words">{cta.label}</span>
      {variant === "primary" && !Icon && <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />}
    </>
  );

  const className = `${baseClasses} text-sm sm:text-[15px] min-h-14 sm:min-h-16 h-auto py-3 px-4 sm:px-5 rounded font-bold w-full justify-center items-center transition-all whitespace-normal`;


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
  tertiary,
  photo,
  photoAlt,
}: ProductHeroProps) => {
  return (
    <section
      className="bg-[hsl(var(--hero-dark))] relative overflow-hidden"
      style={{ borderBottom: "1px solid hsl(var(--line-dark))" }}
    >

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 relative">
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

            <h1 className="text-[26px] sm:text-4xl md:text-[44px] font-semibold leading-[1.2] sm:leading-[1.25] tracking-tight text-white mb-6 sm:mb-12 max-w-3xl">
              <span className="block mb-2 sm:mb-6">{title}</span>
              {titleAccent && (
                <span className="block text-[hsl(var(--muted-dark))] font-normal italic">
                  {titleAccent}
                </span>
              )}
            </h1>

            <p className="text-[15px] sm:text-lg text-white/70 font-light leading-[1.65] sm:leading-[1.9] mt-4 mb-8 sm:mt-10 sm:mb-14 max-w-2xl">
              {subhead}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
              {renderCTA(primary, "primary")}
              {secondary && renderCTA(secondary, "secondary")}
              {tertiary && renderCTA(tertiary, "secondary")}
            </div>
          </div>

          {photo && (
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent rounded z-10" />
              <img
                src={photo}
                alt={photoAlt ?? ""}
                className="w-[320px] h-[320px] object-cover rounded border border-white/10 "
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
