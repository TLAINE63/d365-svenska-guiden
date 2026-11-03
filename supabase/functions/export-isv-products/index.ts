// Nulägesexport av ISV-bolag och deras produkter (CSV) för Demand Engine.
// En rad per aktiv produkt; bolag utan aktiva produkter får en rad med tomma produktfält.
// Inga kontaktuppgifter eller interna anteckningar. Påverkar aldrig katalogens visning eller ordning.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportAuthOk, exportCors } from "../_shared/demandExportAuth.ts";
import { exportHeaders as baseHeaders, toCsv } from "../_shared/demandExport.ts";
import { domainOf, dynamicsProducts, integrationType } from "./mapping.ts";

const COLUMNS = ["isv_slug", "isv_name", "isv_domain", "level", "paying", "gtm", "app_slug", "app_name", "category", "dynamics_products", "integration_type", "promoted", "app_url", "resellers"];
const APP_URL = "https://d365.se/kunskapscenter/dynamics-365-tillagg/?losning=";
const GTM = new Set(["direkt", "partner", "hybrid"]);

// deno-lint-ignore no-explicit-any
async function fetchAll(sb: any, table: string, cols: string, order: string) {
  const out: any[] = [];
  for (let off = 0; ; off += 1000) {
    const { data, error } = await sb.from(table).select(cols).order(order, { ascending: true }).range(off, off + 999);
    if (error) throw new Error(table);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

Deno.serve(async (req) => {
  const headers = { ...baseHeaders, ...exportCors(req) };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET") return new Response(null, { status: 405, headers });
  if (!(await exportAuthOk(req))) return new Response(null, { status: 401, headers });

  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const [vendors, products, overrides, partners] = await Promise.all([
      fetchAll(sb, "isv_vendors", "slug,name,website,information_status,premium_vendor,gtm_model,publication_status", "slug"),
      fetchAll(sb, "isv_solutions", "solution_id,name,vendor_slug,vendor_website,category,products,delivery_model,premium_product,partner_slugs,is_published,lifecycle_status", "solution_id"),
      fetchAll(sb, "isv_solution_overrides", "solution_id,products,partner_slugs,vendor_website", "solution_id"),
      fetchAll(sb, "partners", "slug", "slug"),
    ]);
    const ovr = new Map(overrides.map((o: any) => [o.solution_id, o]));
    const knownPartners = new Set<string>(partners.map((p: any) => p.slug).filter(Boolean));

    // Samma urval som katalogen: publicerade bolag och publicerade, aktiva produkter.
    const pubVendors = vendors.filter((v: any) => v.publication_status === "published");
    const active = products.filter((p: any) => p.is_published && (p.lifecycle_status ?? "active") === "active");
    const byVendor = new Map<string, any[]>();
    for (const p of active) {
      if (!p.vendor_slug) continue;
      const list = byVendor.get(p.vendor_slug) ?? [];
      list.push(p);
      byVendor.set(p.vendor_slug, list);
    }

    const rows: Record<string, string>[] = [];
    for (const v of pubVendors) {
      const list = (byVendor.get(v.slug) ?? []).sort((a, b) => String(a.name).localeCompare(String(b.name), "sv"));
      // Domän: bolagets webbplats, annars första produktens (katalogens leverantörsöverstyrning går först).
      const productSite = list.map((p) => ovr.get(p.solution_id)?.vendor_website || p.vendor_website).find((w) => domainOf(w));
      const vendorCols = {
        isv_slug: v.slug,
        isv_name: v.name ?? "",
        isv_domain: domainOf(v.website) || domainOf(productSite),
        level: v.information_status === "verified" ? "verified" : "basic",
        paying: v.premium_vendor === true ? "true" : "false",
        gtm: GTM.has(v.gtm_model) ? v.gtm_model : "",
      };
      if (!list.length) {
        rows.push({ ...vendorCols, app_slug: "", app_name: "", category: "", dynamics_products: "", integration_type: "", promoted: "", app_url: "", resellers: "" });
        continue;
      }
      for (const p of list) {
        const o = ovr.get(p.solution_id);
        const prods = o?.products?.length ? o.products : p.products;
        const partnerList: string[] = o?.partner_slugs?.length ? o.partner_slugs : (p.partner_slugs ?? []);
        const resellers = [...new Set(partnerList.filter((s) => knownPartners.has(s)))];
        rows.push({
          ...vendorCols,
          app_slug: p.solution_id,
          app_name: p.name ?? "",
          category: p.category ?? "",
          dynamics_products: dynamicsProducts(prods),
          integration_type: integrationType(p.delivery_model),
          promoted: p.premium_product === true ? "true" : "false",
          app_url: APP_URL + encodeURIComponent(p.solution_id),
          resellers: resellers.join(" | "),
        });
      }
    }
    rows.sort((a, b) => a.isv_slug.localeCompare(b.isv_slug) || a.app_name.localeCompare(b.app_name, "sv"));

    return new Response(toCsv(COLUMNS, rows), {
      status: 200,
      headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="d365se-isv-produkter.csv"` },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "export_failed" }), { status: 500, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
  }
});
