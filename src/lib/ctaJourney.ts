export interface CtaJourney { label: string; to: string; area: "erp" | "crm" | "migration" | "partner" }
export function contextualJourney(source = "", goal?: string | null): CtaJourney | null {
  if (/migr|flytta.*moln|uppgradera|uppgradering/i.test(source) || goal === "erp-upgrade" || goal === "erp-new") return { label: "Bedöm vår migrationssituation", to: "/underlag/?area=migration", area: "migration" };
  if (source === "next-step:erp") return { label: "Se vilka lösningar som passar er", to: "/underlag/?area=erp", area: "erp" };
  if (source.startsWith("industry:") || source === "next-step:branscher") return { label: "Se vilka lösningar som passar er verksamhet", to: "/underlag/?area=erp", area: "erp" };
  if (source === "next-step:crm") return { label: "Bedöm vad vi behöver av ett CRM", to: "/underlag/?area=crm", area: "crm" };
  if (source.startsWith("comparison:")) return { label: "Gör en första produktbedömning", to: "/underlag/?area=erp", area: "erp" };
  if (/^(next-step:(alla-partners|valj-partner)|product-partners:|partner-guide:)/.test(source)) return { label: "Jämför partners för vårt behov", to: "", area: "partner" };
  return null;
}