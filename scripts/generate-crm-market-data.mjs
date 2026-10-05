// Räknar fram "Svenska Dynamics 365 CRM-marknaden" ur publicerade partners (partnerData.json).
// Körs i prebuild efter generate-partner-data. Skriver en datafil för sidan och en publik JSON.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const partners = JSON.parse(fs.readFileSync(path.join(root, "src/data/partnerData.json"), "utf8"))
  .filter((p) => p.is_featured !== false);

const APPS = [
  { key: "Sales", label: "Dynamics 365 Sales" },
  { key: "Customer Insights (Marketing)", label: "Dynamics 365 Customer Insights" },
  { key: "Customer Service", label: "Dynamics 365 Customer Service" },
  { key: "Field Service", label: "Dynamics 365 Field Service" },
  { key: "Contact Center", label: "Dynamics 365 Contact Center" },
];

const crm = partners.filter((p) => p.product_filters?.sales || p.product_filters?.service);
const filtersOf = (p) => [p.product_filters?.sales, p.product_filters?.service].filter(Boolean);
const count = (list) => {
  const m = new Map();
  for (const v of list) m.set(v, (m.get(v) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "sv")).map(([value, partners]) => ({ value, partners }));
};
const perPartner = (fn) => crm.flatMap((p) => [...new Set(filtersOf(p).flatMap(fn))]);

const supportLabels = { lifecycle_partner: "Implementation och förvaltning", implementation_only: "Främst implementation", support_only: "Främst förvaltning/support" };

const data = {
  generatedAt: new Date().toISOString().slice(0, 10),
  scope: "Publicerade partnerprofiler på d365.se med Dynamics 365 Sales eller Customer Service i profilen. Täcker inte hela den svenska marknaden.",
  totalPartners: crm.length,
  perApp: APPS.map((a) => ({ app: a.label, partners: crm.filter((p) => (p.applications || []).includes(a.key)).length })),
  topIndustries: count(perPartner((f) => f.industries || [])).slice(0, 8),
  companySize: count(perPartner((f) => f.companySize || [])),
  geography: count(perPartner((f) => (typeof f.geography === "string" ? [f.geography] : f.geography || []))),
  support: count(perPartner((f) => (f.deliveryProfile?.supportLevel ? [supportLabels[f.deliveryProfile.supportLevel] || f.deliveryProfile.supportLevel] : []))),
};

fs.writeFileSync(path.join(root, "src/data/crmMarket.json"), JSON.stringify(data, null, 2) + "\n");
fs.mkdirSync(path.join(root, "public/data"), { recursive: true });
fs.writeFileSync(path.join(root, "public/data/crm-marknaden.json"), JSON.stringify(data, null, 2) + "\n");
console.log(`✅ CRM-marknadsdata: ${data.totalPartners} partners`);
