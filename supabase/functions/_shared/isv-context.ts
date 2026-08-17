// Delad ISV-kontext för AI-sök och chatbot.
// Statisk katalog (genererad från src/data/bcIsvSolutions.ts) + ev. leverantörsredigerade texter.
import CATALOG from './isv-catalog.json' with { type: 'json' };

export const ISV_CATALOG_PATH = '/kunskapscenter/dynamics-365-tillagg';

interface IsvEntry {
  id: string;
  name: string;
  vendor: string;
  category: string;
  type: string;
  shortDescription: string;
  industries: string[];
  products: string[];
  tags: string[];
  geo: string[];
}

/**
 * Bygger ett textblock med ISV-/tilläggslösningar som kan läggas i systemprompten.
 * Faller alltid tillbaka på den statiska katalogen om DB-anropet misslyckas.
 */
export async function buildIsvContextBlock(): Promise<string> {
  const solutions: IsvEntry[] = (CATALOG as IsvEntry[]).map((s) => ({ ...s }));

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/isv_solution_overrides_public?select=solution_id,short_description,products,industries,vendor_name,partner_slugs`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    if (res.ok) {
      const rows = await res.json();
      const map = new Map<string, any>((rows || []).map((r: any) => [r.solution_id, r]));
      for (const s of solutions) {
        const o = map.get(s.id);
        if (!o) continue;
        if (o.short_description?.trim()) s.shortDescription = o.short_description.trim();
        if (o.products?.length) s.products = o.products;
        if (o.industries?.length) s.industries = o.industries;
        if (o.vendor_name?.trim()) s.vendor = o.vendor_name.trim();
      }
    }
  } catch (e) {
    console.error('buildIsvContextBlock: kunde inte hämta ISV-overrides', e);
  }

  const list = solutions
    .map((s) => {
      const prod = s.products?.length ? ` | produkter: ${s.products.join(', ')}` : '';
      const ind = s.industries?.length ? ` | branscher: ${s.industries.join(', ')}` : '';
      return `- ${s.name} (leverantör: ${s.vendor}) | kategori: ${s.category} | typ: ${s.type}${prod}${ind} | ${s.shortDescription}`;
    })
    .join('\n');

  return `\n\nISV- OCH TILLÄGGSLÖSNINGAR (appar som kompletterar Dynamics 365, t.ex. fakturahantering, WMS, EDI, lokalisering, e-handel, CPQ). Använd ENDAST dessa när användaren frågar efter tillägg, appar, add-ons, ISV, integrationer eller specifik funktionalitet som saknas i standard. Länka alltid till katalogen [${ISV_CATALOG_PATH}](${ISV_CATALOG_PATH}) – ISV-lösningar har inga egna sidor på d365.se. Hitta aldrig på lösningar utanför listan:\n${list}`;
}
