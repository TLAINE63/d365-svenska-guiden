export function roiProjectCosts(estimated: number, override: number | null, year1Rate: number, annualPercent: number) {
  const implementation = Math.max(0, override ?? estimated);
  return {
    implementation,
    supportYear1: implementation * year1Rate,
    supportYearly: implementation * Math.max(0, annualPercent) / 100,
  };
}