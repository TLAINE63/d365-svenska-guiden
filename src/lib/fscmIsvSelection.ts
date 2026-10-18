import type { IsvSolution } from "@/data/bcIsvSolutions";

/** Reviewed existing catalog IDs, not an alternative catalog or vendor profile override. */
export const FSCM_ISV_EVIDENCE: Record<string, { sourceUrl: string; area: string }> = {
  "truvio-exflow-ap": { area: "Leverantörsfakturor och attest", sourceUrl: "https://www.signupsoftware.com/finance-operations/exflow-ap/" },
  "staedean-edi-studio": { area: "Orderflöden och EDI", sourceUrl: "https://docs.staedean.com/data-management/docs/edi-studio" },
  "dynaway-advanced-asset-management": { area: "Underhåll och anläggningar", sourceUrl: "https://help.dynaway.com/aam/" },
  "lasernet-lasernet-document-report-creation": { area: "Affärsdokument och distribution", sourceUrl: "https://marketplace.microsoft.com/en-us/product/dynamics-365-for-finance-and-operations/formpipe.lasernet?tab=overview" },
};

export function selectFscmIsvs(solutions: IsvSolution[]) {
  return Object.keys(FSCM_ISV_EVIDENCE).flatMap(id => {
    const solution = solutions.find(s => s.id === id && s.products?.includes("Finance & Supply Chain Management") && (!s.lifecycleStatus || s.lifecycleStatus === "active"));
    return solution ? [solution] : [];
  });
}