import { Link } from "react-router-dom";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { deliveryModeLabel } from "@/data/competenceGuides";
import { onsiteSummary } from "@/data/competenceGeography";
import {
  EVIDENCE_LABELS,
  reviewedLabel,
  type AssignmentProfilePublic,
} from "@/lib/competenceMatching";
import { nowrapBrand } from "@/lib/nowrapBrand";

interface Props {
  profile: AssignmentProfilePublic & { reasons: string[] };
  onContact: (profile: AssignmentProfilePublic) => void;
  onProfileClick: (profile: AssignmentProfilePublic) => void;
}

const AssignmentProfileCard = ({ profile, onContact, onProfileClick }: Props) => {
  const reviewed = reviewedLabel(profile.last_reviewed_at);
  const evidence = (profile.public_evidence_types || [])
    .map((t) => EVIDENCE_LABELS[t])
    .filter(Boolean);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4 mb-3">
        {profile.logo_url && (
          <img
            src={optimizedLogo(profile.logo_url)}
            alt={`${profile.partner_name} logotyp`}
            loading="lazy"
            className={`h-10 w-auto max-w-[120px] object-contain ${
              profile.logo_dark_bg ? "rounded bg-foreground/90 p-1" : ""
            }`}
          />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">{profile.partner_name}</p>
          <h3 className="text-base font-bold leading-snug">{nowrapBrand(profile.heading)}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {nowrapBrand(profile.experience_summary)}
      </p>

      {profile.reasons.length > 0 && (
        <ul className="mb-4 space-y-1">
          {profile.reasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
              <span>{nowrapBrand(r)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
        {profile.products?.length > 0 && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Produkter</dt>
            <dd>{profile.products.join(", ")}</dd>
          </div>
        )}
        {profile.industries?.length > 0 && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Branscher</dt>
            <dd>{profile.industries.slice(0, 3).join(", ")}</dd>
          </div>
        )}
        {(profile.onsite_cities?.length || profile.regions?.length) > 0 && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Kan vara på plats i</dt>
            <dd>
              {profile.onsite_cities?.length
                ? onsiteSummary(profile.onsite_cities)
                : profile.regions.join(", ")}
            </dd>
          </div>
        )}
        {profile.remote_available && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Distans</dt>
            <dd>Kan arbeta på distans</dd>
          </div>
        )}
        {profile.delivery_modes?.length > 0 && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Leveransform</dt>
            <dd>{profile.delivery_modes.map(deliveryModeLabel).join(", ")}</dd>
          </div>
        )}
      </dl>

      {(evidence.length > 0 || reviewed) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {evidence.map((e) => (
            <Badge key={e} variant="secondary" className="font-normal">
              {e}
            </Badge>
          ))}
          {reviewed && (
            <span className="text-xs text-muted-foreground">
              Senast redaktionellt kontrollerad: {reviewed}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link to={`/partner/${profile.partner_slug}/`} onClick={() => onProfileClick(profile)}>
            Läs partnerprofil
          </Link>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onContact(profile)}>
          Kontakta partnern
        </Button>
      </div>
    </article>
  );
};

export default AssignmentProfileCard;
