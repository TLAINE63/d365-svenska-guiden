// Översättning från katalogens fält till exportens fasta värden.

/** Domän utan protokoll, www och sökväg, i gemener. Tom sträng om ingen giltig domän. */
export function domainOf(url: unknown): string {
  if (typeof url !== "string") return "";
  const t = url.trim().toLowerCase();
  if (!t) return "";
  const host = t.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0].split("@").pop()!.split(":")[0].replace(/^www\./, "");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : "";
}

const PRODUCT_MAP: Record<string, string[]> = {
  "business central": ["Business Central"],
  "finance & supply chain management": ["Finance", "Supply Chain Management"],
  "finance and supply chain management": ["Finance", "Supply Chain Management"],
  "f&scm": ["Finance", "Supply Chain Management"],
  "finance": ["Finance"],
  "supply chain management": ["Supply Chain Management"],
  "project operations": ["Project Operations"],
  "commerce": ["Commerce"],
  "human resources": ["Human Resources"],
  "sales": ["Sales"],
  "customer service": ["Customer Service"],
  "field service": ["Field Service"],
  "contact center": ["Contact Center"],
  "customer insights": ["Customer Insights"],
  "customer insights (marketing)": ["Customer Insights"],
  "power platform": ["Power Platform"],
  "copilot och agenter": ["Copilot och agenter"],
  "copilot": ["Copilot och agenter"],
};
const ORDER = ["Business Central", "Finance", "Supply Chain Management", "Project Operations", "Commerce", "Human Resources", "Sales", "Customer Service", "Field Service", "Contact Center", "Customer Insights", "Power Platform", "Copilot och agenter"];

/** Dynamics-produkter med exakta exportvärden, i fast ordning, separerade med " | ". Okända värden utelämnas. */
export function dynamicsProducts(list: unknown): string {
  if (!Array.isArray(list)) return "";
  const out = new Set<string>();
  for (const v of list) for (const m of PRODUCT_MAP[String(v ?? "").trim().toLowerCase()] ?? []) out.add(m);
  return ORDER.filter((p) => out.has(p)).join(" | ");
}

/** Inbyggd i Dynamics eller ansluten, härlett ur leveransmodellen. Tomt om okänt. */
export function integrationType(deliveryModel: unknown): string {
  if (deliveryModel === "native_isv" || deliveryModel === "industry_solution") return "inbyggd";
  if (deliveryModel === "integration_layer" || deliveryModel === "external_saas") return "ansluten";
  return "";
}
