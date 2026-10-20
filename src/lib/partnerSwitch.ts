/**
 * Partnerbytesanalys: deterministisk, utan poäng. Resultatet listar endast
 * utredningsområden som följer av besökarens svar.
 */
export type PsProduct = "bc" | "fscm" | "crm" | "other";
export type PsScope = "all" | "support" | "development" | "specialist";
export type PsControl = "yes" | "partly" | "no" | "unknown";

export interface PsAnswers {
  product?: PsProduct;
  reasons: string[];
  scope?: PsScope;
  licenses?: "partner" | "other" | "unknown";
  partnerApps?: "yes" | "no" | "unknown";
  code?: PsControl;
  docs?: PsControl;
  admin?: PsControl;
  timing?: "now" | "6m" | "later";
}

export interface PsArea { id: string; title: string; why: string; check: string[] }

export const PRODUCT_LABEL: Record<PsProduct, string> = {
  bc: "Business Central",
  fscm: "Finance & Supply Chain Management",
  crm: "Sales / Customer Service",
  other: "Annan Dynamics\u00A0365-applikation",
};

const CODE_CHECK: Record<PsProduct, string[]> = {
  bc: ["Vilka extensions (AL) är kundunika och var ligger källkoden?", "Vilka bransch- och ISV-appar används, och vem har licensavtalet?"],
  fscm: ["Var ligger modeller, utvecklingsgrenar och byggpipeline?", "Vilka anpassningar påverkar kommande uppdateringar?"],
  crm: ["Vilka lösningar i Dataverse är managed respektive unmanaged?", "Vilka Power Automate-flöden och appar är kundunika?"],
  other: ["Vilka anpassningar finns och var ligger källkoden?"],
};

const weak = (v?: PsControl) => v === "partly" || v === "no" || v === "unknown";

/** Frågan om partnerägda appar är mest relevant för BC och F&SCM. */
export const asksPartnerApps = (a: PsAnswers) => a.product === "bc" || a.product === "fscm";

export function analyse(a: PsAnswers): PsArea[] {
  const p = a.product ?? "other";
  const out: PsArea[] = [];
  const reasonsEval = a.reasons.includes("unclear") || a.reasons.includes("cost");
  if (reasonsEval) out.push({ id: "evaluate", title: "Nuvarande samarbete", why: "Ni anger otydlighet eller kostnad som skäl. Det kan ibland lösas utan byte.", check: ["Vad säger avtalet om supportnivå och svarstider?", "Har problemen tagits upp med partnern på ledningsnivå?"] });
  if (a.licenses === "partner" || a.licenses === "unknown") out.push({ id: "licenses", title: "Licenser och CSP", why: a.licenses === "unknown" ? "Ni vet inte vem som hanterar licenserna i dag." : "Nuvarande partner hanterar licenserna.", check: ["Vilka abonnemang, antal och bindningstider finns?", "Ska licensansvaret flyttas eller stanna kvar? Följ Microsofts aktuella regler för överföring."] });
  if (asksPartnerApps(a) && (a.partnerApps === "yes" || a.partnerApps === "unknown")) out.push({ id: "partnerApps", title: "Partnerägda appar och lösningar", why: "Lösningen kan innehålla appar som nuvarande partner äger.", check: ["Vad säger avtalet om fortsatt nyttjande efter avslutat samarbete?", "Kan appen supporteras av någon annan?"] });
  if (weak(a.code) && a.scope !== "specialist") out.push({ id: "code", title: "Anpassningar och källkod", why: "Ni har inte full tillgång till källkod eller repositories.", check: [...CODE_CHECK[p], "Vad säger avtalet om äganderätt och nyttjanderätt till koden?"] });
  if (weak(a.docs)) out.push({ id: "docs", title: "Dokumentation", why: "Teknisk dokumentation saknas eller är ofullständig.", check: ["Finns beskrivning av integrationer, anpassningar och miljöer?", "Ingår dokumentation i överlämningen enligt avtalet?"] });
  if (weak(a.admin)) out.push({ id: "admin", title: "Administrativa behörigheter", why: "Ni har inte säkerställt egna adminkonton.", check: ["Har ni egna globala admin- och miljöadministratörskonton?", "Vilka partnerkonton och delegerade behörigheter finns?"] });
  if (a.scope === "all" || a.timing === "now") out.push({ id: "handover", title: "Överlämning och ansvar", why: a.timing === "now" ? "Ni vill gå vidare snart." : "Ni överväger att flytta hela relationen.", check: ["Vem ansvarar för support under övergången?", "Vilka öppna ärenden och pågående utveckling finns?", "Vilken uppsägningstid gäller?"] });
  return out;
}

export function partnerSearch(a: PsAnswers): string {
  if (a.product === "bc") return "/valjdynamics365partner/?product=bc";
  if (a.product === "fscm") return "/finance-supply-chain-partners-sverige/";
  return "/valjdynamics365partner/";
}
