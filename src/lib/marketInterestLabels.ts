// Håller produktnamn ihop på en rad (typografiregel).
export const withNbsp = (s: string) =>
  s.replace("Business Central", "Business\u00A0Central").replace("Dynamics 365", "Dynamics\u00A0365").replace("Finance & Supply Chain", "Finance\u00A0&\u00A0Supply\u00A0Chain");
