import scene1 from "@/assets/journey/scene1-research.jpg";
import scene2 from "@/assets/journey/scene2-discussion.jpg";
import scene3 from "@/assets/journey/scene3-compare.jpg";
import scene4 from "@/assets/journey/scene4-advice.jpg";
import scene5 from "@/assets/journey/scene5-partner.jpg";
import scene7 from "@/assets/journey/scene7-project.jpg";

export const PREMIUM_REASONS = [
  { title: "Var synlig innan kunden har valt partner", image: scene1, body: "Många potentiella kunder börjar sin utvärdering utan att ha bestämt vilken lösning eller partner de ska välja. Med Premium kan ni presentera er kompetens och erfarenhet i de sammanhang där köparen söker vägledning och jämför alternativ." },
  { title: "Syns även utanför era egna marknadskanaler", image: scene2, body: "Den egna webbplatsen når framför allt företag som redan har hittat till er. d365.se ger er ytterligare en kontaktyta mot en relevant publik som aktivt söker information om Microsofts affärslösningar." },
  { title: "Förstå vad potentiella kunder efterfrågar", image: scene3, body: "Få insikter i vilka produktområden, branscher, köpguider och frågeställningar som engagerar besökarna. Använd informationen för att utveckla er marknadsföring, ert erbjudande och era försäljningsprioriteringar." },
  { title: "Gör er kompetens synlig och trovärdig", image: scene4, body: "Visa vad som särskiljer er genom kundcase, branschkompetens, experter, lösningar och videor. Hjälp köparen att förstå varför just ni kan vara rätt partner för deras verksamhet." },
  { title: "Få tillgång till nya affärsmöjligheter", image: scene5, body: "d365.se arbetar aktivt med att identifiera, kvalificera och matcha kundbehov med relevanta partners. Som Premiumpartner betalar ni ingen mötesavgift och får förmånliga villkor vid vunnen affär." },
  { title: "Dra nytta av d365.se:s växande räckvidd", image: scene7, body: "Era relevanta nyheter, kundberättelser och kompetenser kan uppmärksammas genom redaktionell bevakning, kunskapscenter, nyhetsbrev, LinkedIn och d365.se INSIDE." },
];

export const JOURNEY_PRESENCE = [
  { title: "Orientering", body: "Kunden försöker förstå möjligheterna med Microsofts affärslösningar.", where: "Artiklar, branschguider och kunskapscenter", href: "/kunskapscenter/" },
  { title: "Behovsanalys", body: "Kunden identifierar behov, utmaningar och krav.", where: "Behovsguider, rådgivning och kravspecifikationer", href: "/guider/kravspecifikation-affarssystem/" },
  { title: "Lösningsutvärdering", body: "Kunden jämför produkter, funktionalitet och investeringskostnader.", where: "Produktguider, kalkylatorer och produktdemonstrationer", href: "/kostnad/" },
  { title: "Partnerutvärdering", body: "Kunden undersöker vilka partners som har rätt kompetens.", where: "Partnerprofiler, jämförelser, kundcase och experter", href: "/valjdynamics365partner/" },
  { title: "Dialog och upphandling", body: "Kunden vill diskutera sitt behov med relevanta partners.", where: "Köparrådgivning och kvalificerad affärsförmedling", href: "#affarsmojligheter" },
  { title: "Förvaltning och vidareutveckling", body: "Kunden söker nya lösningar, kompetens eller en ny partner.", where: "Partnerbytesguide, tilläggskatalog och expertförmedling", href: "/guider/byta-dynamics-partner/" },
];

export const VISIBILITY_QUESTIONS = [
  "Hittar potentiella kunder er även när de inte redan känner till ert företagsnamn?",
  "Kan köparen enkelt förstå vad som särskiljer er från andra Microsoftpartners?",
  "Finns era kundcase och experter där köparen jämför sina alternativ?",
  "Vet ni vilka produktområden och affärsutmaningar som engagerar potentiella kunder just nu?",
  "Får ni kännedom om relevanta affärsmöjligheter som uppstår utanför era egna försäljningskanaler?",
];

export const INSIGHT_COLUMNS = {
  market: [
    { label: "Efterfrågade produktområden", detail: "Intresse och trender för Business\u00a0Central, Dynamics\u00a0365 Finance & Supply\u00a0Chain och CRM-apparna." },
    { label: "AI- och Copilotfokus", detail: "Vilka frågor om AI-agenter, styrning och automatisering som engagerar köparna." },
    { label: "Branscher i rörelse", detail: "Branscher med flest aktiva utvärderare och hur fokus förändras över tid." },
    { label: "Köparens utgångsläge", detail: "Nyköp, byte från mindre system, migrering från NAV/AX eller partnerbyte." },
    { label: "Företagsstorlek och investeringsramar", detail: "Typiska storlekar, användarantal och budgetramar från kalkylatorer och kravguider." },
    { label: "Efterfrågade kompetenser", detail: "Branschlösningar, roller och certifieringar som köpare oftast väljer i sök och jämförelser." },
  ],
  own: [
    { label: "Profil- och guidevisningar", detail: "Hur ofta er profil och era lösningar visas i köpguider och jämförelser." },
    { label: "Engagemang i kundcase och experter", detail: "Visningar av era kundcase, specialistprofiler och INSIDE-videor." },
    { label: "Klick till egen webbplats", detail: "Utgående klick via er direktlänk, med UTM-märkning för uppföljning i ert CRM." },
    { label: "Kontaktförfrågningar och möten", detail: "Påbörjade och inskickade förfrågningar samt förmedlade kunddialoger." },
    { label: "Jämförelse mot liknande partners", detail: "Er synlighet och ert engagemang mot medianen inom samma produktområde." },
  ],
};
