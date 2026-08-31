import { useEffect } from "react";
import { trackPartnerImpression } from "@/utils/trackPartnerEvent";

type ImpressionEvent = Parameters<typeof trackPartnerImpression>[0];

interface ImpressionPartner {
  slug?: string | null;
  id?: string | null;
}

/**
 * Nivå 1 – exponering. Loggar att en uppsättning partners visats på en yta.
 * Dedupas per session/kontext i trackPartnerImpression, så omrenderingar
 * blåser inte upp siffrorna. Använd på alla ytor där partners listas
 * (branschsidor, produktsidor, kunskapscenter, sökresultat m.m.).
 */
export function usePartnerImpressions(
  event: ImpressionEvent,
  partners: ImpressionPartner[] | undefined,
  metadata: Record<string, unknown> = {},
  enabled = true,
): void {
  const list = (partners || []).filter((p): p is { slug: string; id?: string | null } => Boolean(p?.slug));
  const key = list.map((p) => p.slug).join("|");
  const metaKey = JSON.stringify(metadata);

  useEffect(() => {
    if (!enabled || !key) return;
    trackPartnerImpression(
      event,
      key.split("|").map((slug) => {
        const match = list.find((p) => p.slug === slug);
        return { slug, id: match?.id ?? null };
      }),
      JSON.parse(metaKey) as Record<string, unknown>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key, metaKey, enabled]);
}

export default usePartnerImpressions;
