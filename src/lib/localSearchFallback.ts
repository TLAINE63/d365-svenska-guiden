import partnerData from "@/data/partnerData.json";
import { BC_ISV_SOLUTIONS } from "@/data/bcIsvSolutions";

export interface FallbackResult {
  primary: { path: string; label: string; reason: string };
  alternatives: { path: string; label: string }[];
  answer: string;
  questionType?: "partner" | "produkt" | "pris" | "komplex";
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const PRODUCTS: { keys: string[]; label: string; path: string }[] = [
  { keys: ["business central", "bc"], label: "Business\u00A0Central", path: "/businesscentral/" },
  { keys: ["finance", "supply chain", "f&scm", "fscm", "f&o"], label: "Finance & Supply Chain Management", path: "/affarssystem/" },
  { keys: ["sales", "crm", "forsaljning"], label: "Dynamics\u00A0365 Sales", path: "/crm/" },
  { keys: ["customer service", "kundservice"], label: "Customer Service", path: "/crm/" },
  { keys: ["field service"], label: "Field Service", path: "/d365fieldservice/" },
  { keys: ["contact center"], label: "Contact Center", path: "/d365contactcenter/" },
  { keys: ["pris", "kostnad", "licens"], label: "Kostnader och licenser", path: "/kostnad/" },
];

export function localSearch(query: string): FallbackResult | null {
  const q = norm(query.trim());
  if (q.length < 2) return null;
  const words = q.split(/\s+/).filter((w) => w.length >= 3);
  const hit = (name: string) => {
    const n = norm(name);
    return q.includes(n) || words.some((w) => n.includes(w));
  };

  const partners = (partnerData as any[])
    .filter((p) => p?.name && hit(p.name))
    .slice(0, 4)
    .map((p) => ({
      path: p.is_featured ? `/partner/${p.slug}/` : `/basic/${p.slug}/`,
      label: p.name as string,
    }));

  const isvs = BC_ISV_SOLUTIONS.filter((s) => hit(s.name) || hit(s.vendor)).slice(0, 4);
  const isvLinks = isvs.map((s) => ({
    path: `/kunskapscenter/dynamics-365-tillagg/?q=${encodeURIComponent(s.name)}`,
    label: `${s.name} (${s.vendor})`,
  }));

  const products = PRODUCTS.filter((p) => p.keys.some((k) => q.includes(k))).map((p) => ({ path: p.path, label: p.label }));

  const all = [...isvLinks, ...partners, ...products];
  if (!all.length) return null;

  const [first, ...rest] = all;
  const answerParts: string[] = [];
  if (isvs.length) answerParts.push(`${isvs[0].name} från ${isvs[0].vendor}: ${isvs[0].shortDescription}`);
  if (partners.length) answerParts.push(`Vi hittade ${partners.length === 1 ? "partnern" : "partnerna"} ${partners.map((p) => p.label).join(", ")} på d365.se.`);
  if (!answerParts.length) answerParts.push(`Här är sidorna på d365.se som bäst matchar er fråga.`);

  return {
    primary: { ...first, reason: "Direktträff i d365.se:s katalog" },
    alternatives: rest.slice(0, 5),
    answer: answerParts.join("\n\n"),
    questionType: partners.length ? "partner" : products.some((p) => p.path === "/kostnad/") ? "pris" : "produkt",
  };
}
