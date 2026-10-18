export function isvPartnerDestination(products: string[] = ["Business Central"]) {
  if (products.length === 1 && products[0] === "Finance & Supply Chain Management") {
    return { to: "/finance-supply-chain-partners-sverige/", label: "Hitta Finance & Supply Chain-partner" };
  }
  if (products.length === 1 && products[0] === "Business Central") {
    return { to: "/valjdynamics365partner/?product=bc", label: "Hitta Business Central-partner" };
  }
  return { to: "/valjdynamics365partner/", label: "Hitta partner för ert produktområde" };
}