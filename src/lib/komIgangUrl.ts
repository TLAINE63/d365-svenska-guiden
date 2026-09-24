export interface KomIgangContext {
  industry?: string | null;
  product?: string | null;
  goal?: string | null;
  source?: string | null;
  size?: string | null;
}

export const buildKomIgangUrl = ({ industry, product, goal, source, size }: KomIgangContext = {}) => {
  const params = new URLSearchParams();
  if (industry) params.set("industry", industry);
  if (product) params.set("product", product);
  if (goal) params.set("goal", goal);
  if (size) params.set("size", size);
  if (source) params.set("source", source);
  const query = params.toString();
  return query ? `/kom-igang/?${query}` : "/kom-igang/";
};