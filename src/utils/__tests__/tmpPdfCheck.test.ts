import { it } from "vitest";
import { writeFileSync } from "node:fs";
import { generatePartnerAgreementPdf } from "@/utils/generatePartnerAgreementPdf";
import { termsSections, termsPriceRows } from "@/utils/programTerms";
import { PARTNER_FEE_NOTE } from "@/utils/partnerProfileTerms";

it("genererar förmedlingsvillkoren som PDF för visuell kontroll", async () => {
  const blob = await generatePartnerAgreementPdf({
    heading: "Avtalsvillkor: Förmedlingsavtal (Finder’s fee)",
    intro: "Sammanställning av publicerade kommersiella villkor, uppdaterad 2026-11-17.",
    sections: termsSections("commission"),
    priceRows: termsPriceRows("commission"),
    priceNote: PARTNER_FEE_NOTE,
    acceptance: "Bekräfta de individuella villkoren skriftligen innan samarbetet startar.",
  });
  const buf = await new Promise<ArrayBuffer>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as ArrayBuffer);
    r.onerror = rej;
    r.readAsArrayBuffer(blob);
  });
  writeFileSync("/tmp/browser/terms-commission.pdf", Buffer.from(buf));
});
