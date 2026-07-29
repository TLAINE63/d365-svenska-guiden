import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";
import ContactFormDialog from "@/components/ContactFormDialog";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export interface FilteredListActionsPartner {
  slug: string;
  name: string;
}

interface FilteredListActionsProps {
  /** All currently visible partners (used as fallback when nothing is selected for compare). */
  visiblePartners: FilteredListActionsPartner[];
  /** Number of partners to send the multi-quote to when no compare selection exists. */
  topN?: number;
  /** Active filter context – surfaced in the dialog for clarity. */
  selectedProduct?: string;
  industry?: string;
  geography?: string;
  companySize?: string;
  revenue?: string;
  /** Hide entirely when list is small enough that selection is trivial. */
  minVisible?: number;
  /** Optional override for the page-source label sent to analytics. */
  analyticsSource?: string;
  /** Compact variant for tight surfaces (e.g. homepage teaser). */
  variant?: "default" | "compact";
}

const FilteredListActions = ({
  visiblePartners,
  topN = 3,
  selectedProduct,
  industry,
  geography,
  companySize,
  revenue,
  minVisible = 2,
  analyticsSource,
  variant = "default",
}: FilteredListActionsProps) => {
  const { selected } = usePartnerCompare();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const recipients = useMemo<FilteredListActionsPartner[]>(() => {
    if (selected.length > 0) return selected;
    return visiblePartners.slice(0, topN);
  }, [selected, visiblePartners, topN]);

  useEffect(() => {
    if (visiblePartners.length < minVisible) return;
    trackFunnelEvent({
      event_type: "cta_view",
      event_name: "filtered_list_actions_view",
      metadata: { count: visiblePartners.length, source: analyticsSource },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiblePartners.length, analyticsSource]);

  if (visiblePartners.length < minVisible) return null;
  if (recipients.length === 0) return null;

  const recipientLabel =
    selected.length > 0
      ? `dina ${selected.length} valda partners`
      : `de ${recipients.length} mest relevanta i listan`;

  const isCompact = variant === "compact";

  return (
    <div
      className={`not-prose ${
        isCompact
          ? "mb-5"
          : "mb-6 sm:mb-8 rounded-xl border border-border bg-gradient-to-br from-secondary/40 to-background p-4 sm:p-5 "
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {!isCompact && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Hittade flera intressanta partners?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Få vägledning köparsidigt – eller låt d365.se förmedla samma förfrågan
              till {recipientLabel} på en gång.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
          <ContactFormDialog>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-foreground/20 hover:border-foreground/40"
              onClick={() =>
                trackFunnelEvent({
                  event_type: "cta_click",
                  event_name: "filtered_list_get_matching",
                  metadata: { source: analyticsSource },
                })
              }
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Få matchning av oss
            </Button>
          </ContactFormDialog>

          <Button
            type="button"
            size="sm"
            className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
            onClick={() => {
              trackFunnelEvent({
                event_type: "cta_click",
                event_name: "filtered_list_multi_quote",
                metadata: {
                  source: analyticsSource,
                  recipients: recipients.length,
                  from_compare: selected.length > 0,
                },
              });
              setQuoteOpen(true);
            }}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            {selected.length > 0
              ? `Få en uppskattning av tid och kostnad från ${selected.length} valda`
              : `Få en uppskattning av tid och kostnad från ${recipients.length} matchande`}
          </Button>
        </div>
      </div>

      <PartnerRequestDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        partnerSlug={recipients.map((r) => r.slug).join(",")}
        partnerName={recipients.map((r) => r.name).join(", ")}
        recipients={recipients}
        selectedProduct={selectedProduct}
        industry={industry}
        geography={geography}
        companySize={companySize}
        revenue={revenue}
        mode="quote"
      />
    </div>
  );
};

export default FilteredListActions;
