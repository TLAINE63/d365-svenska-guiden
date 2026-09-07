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
 * Primärkälla: publicerade rader i isv_solutions (BC, F&SCM och Customer Engagement).
 * Faller alltid tillbaka på den statiska katalogen om DB-anropet misslyckas.
 */
export async function buildIsvContextBlock(): Promise<string> {
  let solutions: IsvEntry[] = (CATALOG as IsvEntry[]).map((s) => ({ ...s }));

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/isv_solutions?select=solution_id,name,vendor,category,subcategory,type,short_description,best_for,products,industries,tags,geo&is_published=eq.true&order=name.asc&limit=500`,
      { headers },
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const dbSolutions: IsvEntry[] = rows.map((r: any) => ({
          id: r.solution_id,
          name: r.name,
          vendor: r.vendor || '',
          category: [r.category, r.subcategory].filter(Boolean).join(' / '),
          type: r.type || '',
          shortDescription: (r.short_description || r.best_for || '').trim(),
          industries: r.industries || [],
          products: r.products || [],
          tags: r.tags || [],
          geo: r.geo || [],
        }));
        const dbIds = new Set(dbSolutions.map((s) => s.id));
        // DB är primärkälla; behåll statiska poster som ännu inte finns i DB.
        solutions = [...dbSolutions, ...solutions.filter((s) => !dbIds.has(s.id))];
      }

    }
  } catch (e) {
    console.error('buildIsvContextBlock: kunde inte hämta isv_solutions', e);
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/isv_solution_overrides_public?select=solution_id,short_description,products,industries,vendor_name,partner_slugs`,
      { headers },
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
      return `- id: ${s.id} | ${s.name} (leverantör: ${s.vendor}) | kategori: ${s.category} | typ: ${s.type}${prod}${ind} | ${s.shortDescription}`;
    })
    .join('\n');

  return `\n\nISV- OCH TILLÄGGSLÖSNINGAR (appar som kompletterar Dynamics 365 – Business Central, Finance & Supply Chain Management samt Customer Engagement (Sales, Customer Insights, Customer Service, Field Service, Contact Center). Exempel: fakturahantering, WMS, EDI, lokalisering, e-handel, CPQ, marketing automation, telefoni/CTI, e-signatur, CRM-datakvalitet). Använd ENDAST dessa när användaren frågar efter tillägg, appar, add-ons, ISV, integrationer eller specifik funktionalitet som saknas i standard. Matcha på produktområde (fältet produkter) så att t.ex. CRM-frågor får CE-lösningar. Länka till katalogen [${ISV_CATALOG_PATH}](${ISV_CATALOG_PATH}), eller direkt till en specifik lösning med ${ISV_CATALOG_PATH}?losning=<id> (id enligt listan). Hitta aldrig på lösningar utanför listan:\n${list}`;
}

