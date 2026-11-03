import { assertEquals } from "jsr:@std/assert@1";
import { domainOf, dynamicsProducts, integrationType } from "./mapping.ts";

Deno.test("isv_domain drops protocol, www and path, lowercase", () => {
  assertEquals(domainOf("https://www.Exflow.com/sv/produkter?x=1"), "exflow.com");
  assertEquals(domainOf(""), "");
  assertEquals(domainOf(null), "");
});

Deno.test("F&SCM becomes Finance | Supply Chain Management", () => {
  assertEquals(dynamicsProducts(["Finance & Supply Chain Management"]), "Finance | Supply Chain Management");
  assertEquals(dynamicsProducts(["Sales", "Business Central", "Customer Insights (Marketing)"]), "Business Central | Sales | Customer Insights");
});

Deno.test("integration_type from delivery model", () => {
  assertEquals(integrationType("native_isv"), "inbyggd");
  assertEquals(integrationType("industry_solution"), "inbyggd");
  assertEquals(integrationType("integration_layer"), "ansluten");
  assertEquals(integrationType("external_saas"), "ansluten");
  assertEquals(integrationType(null), "");
});
