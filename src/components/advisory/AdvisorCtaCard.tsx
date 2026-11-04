import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdvisorContactButtons from "@/components/advisory/AdvisorContactButtons";
import advisorPhoto from "@/assets/thomas-laine-radgivning.jpg.asset.json";

interface Props {
  id: string;
  heading: string;
  text: ReactNode;
  bookingLabel?: string;
  /** Valfri internlänk under knapparna. */
  link?: { to: string; label: string };
}

/** Thomas 20-minuters rådgivningsruta med Bookings + mejl (spåras via AdvisorContactButtons). */
export default function AdvisorCtaCard({ id, heading, text, bookingLabel, link }: Props) {
  return (
    <section className="py-10" aria-labelledby={id}>
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
          <img src={advisorPhoto.url} alt="Thomas Laine, rådgivare på d365.se" loading="lazy" width={96} height={96} className="h-20 w-20 rounded-full object-cover object-[50%_0%] ring-2 ring-border shrink-0" />
          <div className="flex-1">
            <h2 id={id} className="text-lg md:text-xl font-bold text-foreground mb-2">{heading}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-2xl leading-relaxed">{text}</p>
            <AdvisorContactButtons bookingLabel={bookingLabel} />
            {link && (
              <Link to={link.to} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                {link.label}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
