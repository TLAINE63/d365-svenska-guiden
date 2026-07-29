import type { BcClassification } from "@/data/bcMatchningstest";

export const CLASS_ORDER_LABEL: Record<BcClassification, string> = {
  essentials: "Ingår i BC Essentials (standard)",
  premium: "Kräver BC Premium",
  config: "Kräver konfiguration",
  isv: "Kräver tilläggsapp (Microsoft Marketplace)",
  outside: "Ligger utanför BC – annan plattform",
};

export type { BcClassification };
