import bcIcon from "@/assets/icons/BusinessCentral-new.webp";
import financeIcon from "@/assets/icons/Finance.svg";
import salesIcon from "@/assets/icons/Sales.svg";
import marketingIcon from "@/assets/icons/Marketing.svg";
import csIcon from "@/assets/icons/CustomerService.svg";
import fsIcon from "@/assets/icons/FieldService.svg";
import ccIcon from "@/assets/icons/ContactCenter.svg";
import poIcon from "@/assets/icons/ProjectOperations.svg";
import commerceIcon from "@/assets/icons/Commerce.svg";
import hrIcon from "@/assets/icons/HumanResources.svg";

/** Officiella visningsnamn och Microsoft-ikoner per lagrat produktvärde. */
export const D365_PRODUCT_BRANDING: Record<string, { label: string; icon: string }> = {
  "Business Central": { label: "Business Central", icon: bcIcon },
  "Finance & Supply Chain Management": { label: "Finance & Supply Chain Management (F&O)", icon: financeIcon },
  "Finance & SCM": { label: "Finance & Supply Chain Management (F&O)", icon: financeIcon },
  Sales: { label: "Sales", icon: salesIcon },
  "Customer Insights (Marketing)": { label: "Customer Insights (Marketing Automation)", icon: marketingIcon },
  "Customer Service": { label: "Customer Service", icon: csIcon },
  "Field Service": { label: "Field Service", icon: fsIcon },
  "Contact Center": { label: "Contact Center", icon: ccIcon },
  "Project Operations": { label: "Project Operations", icon: poIcon },
  Commerce: { label: "Commerce", icon: commerceIcon },
  "Human Resources": { label: "Human Resources", icon: hrIcon },
};
