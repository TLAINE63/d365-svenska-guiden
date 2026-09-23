import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CompetenceFilters from "./CompetenceFilters";
import AssignmentProfileCard from "./AssignmentProfileCard";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import { useAssignmentProfiles } from "@/hooks/useAssignmentProfiles";
import {
  filterAndSort,
  type AssignmentProfilePublic,
  type CompetenceFilterState,
} from "@/lib/competenceMatching";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";
import type { CompetenceGuide } from "@/data/competenceGuides";

interface Props {
  guide: CompetenceGuide;
  filters: CompetenceFilterState;
  onFiltersChange: (next: CompetenceFilterState) => void;
  onDescribeNeed: () => void;
}

const CompetencePartnerSection = ({ guide, filters, onFiltersChange, onDescribeNeed }: Props) => {
  const { data, isLoading } = useAssignmentProfiles(guide.slug);
  const [contactProfile, setContactProfile] = useState<AssignmentProfilePublic | null>(null);

  const all = data ?? [];
  const results = useMemo(() => filterAndSort(all, filters), [all, filters]);

  const noProfilesAtAll = !isLoading && all.length === 0;
  const noMatches = !isLoading && all.length > 0 && results.length === 0;

  useEffect(() => {
    if (isLoading) return;
    if (noProfilesAtAll) trackCompetenceEvent("kompetens_empty_state", { guide: guide.slug, case: "B" });
    else if (noMatches) trackCompetenceEvent("kompetens_empty_state", { guide: guide.slug, case: "A" });
    else if (results.length)
      trackCompetenceEvent("kompetens_partner_card_view", { guide: guide.slug, count: results.length });
  }, [isLoading, noProfilesAtAll, noMatches, results.length, guide.slug]);

  return (
    <section id="partners" className="scroll-mt-28">
      <h2 className="text-xl font-bold mb-3">Profilerade partners med relevant erfarenhet</h2>

      {noProfilesAtAll ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            d365.se har ännu inte publicerat några uppdragsprofiler för den här rollen. Beskriv
            behovet nedan så går vi igenom det och återkommer om vi ser ett relevant nästa steg.
          </p>
        </div>
      ) : (
        <>
          <CompetenceFilters
            className="mb-6"
            value={filters}
            onChange={onFiltersChange}
            lockedProduct={guide.type === "product" ? guide.productArea : undefined}
          />

          {isLoading && <p className="text-sm text-muted-foreground">Hämtar partners…</p>}

          {noMatches && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold mb-2">
                Vi hittade inga publicerade uppdragsprofiler som matchar alla val.
              </p>
              <p className="text-sm text-muted-foreground mb-4">Ni kan prova att:</p>
              <div className="flex flex-wrap gap-2">
                {filters.region && (
                  <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, region: undefined })}>
                    Ta bort geografifiltret
                  </Button>
                )}
                {filters.delivery !== "hybrid" && (
                  <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, delivery: "hybrid" })}>
                    Tillåt hybrid
                  </Button>
                )}
                {filters.delivery !== "remote" && (
                  <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, delivery: "remote" })}>
                    Tillåt distans
                  </Button>
                )}
                {(filters.industry || filters.region || filters.delivery) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onFiltersChange({
                        product: guide.type === "product" ? guide.productArea : filters.product,
                      })
                    }
                  >
                    Se partners som matchar roll och produkt
                  </Button>
                )}
                <Button size="sm" onClick={onDescribeNeed}>
                  Beskriv ert behov för d365.se
                </Button>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {results.map((p) => (
                <AssignmentProfileCard
                  key={p.id}
                  profile={p}
                  onProfileClick={(prof) =>
                    trackCompetenceEvent("kompetens_partner_profile_click", {
                      guide: guide.slug,
                      partner: prof.partner_slug,
                    })
                  }
                  onContact={(prof) => {
                    setContactProfile(prof);
                    trackCompetenceEvent("kompetens_partner_contact_click", {
                      guide: guide.slug,
                      partner: prof.partner_slug,
                    });
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {contactProfile && (
        <PartnerRequestDialog
          open={!!contactProfile}
          onOpenChange={(o) => !o && setContactProfile(null)}
          partnerSlug={contactProfile.partner_slug}
          partnerName={contactProfile.partner_name}
          selectedProduct={filters.product || contactProfile.products?.[0]}
          industry={filters.industry}
          geography={filters.region}
        />
      )}
    </section>
  );
};

export default CompetencePartnerSection;
