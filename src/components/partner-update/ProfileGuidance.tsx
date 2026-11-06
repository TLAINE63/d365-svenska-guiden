import { Lightbulb, ChevronDown } from "lucide-react";

/** Överst på profileringssidan: kort inledning + expanderbara råd. */
export const ProfileGuideIntro = () => (
  <section
    aria-labelledby="profile-guide-title"
    className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6"
  >
    <h2 id="profile-guide-title" className="text-xl font-bold text-foreground mb-2">
      Visa när ni är rätt partner
    </h2>
    <p className="text-sm text-muted-foreground leading-relaxed">
      Kunder besöker d365.se i olika skeden av sin beslutsprocess. Vissa utvärderar ett nytt{" "}
      <span className="whitespace-nowrap">Dynamics 365</span>-projekt, medan andra redan har ett system i
      drift och söker förvaltning, en ny partner eller specialistkompetens. Er profil ska hjälpa dem att
      snabbt förstå vilka ni hjälper, vad ni gör bäst och vilken erfarenhet ni har.
    </p>
    <p className="text-sm text-foreground mt-3">
      <strong>Snabbstart:</strong> Välj upp till tre branscher per produktområde. Välj dem där ni har
      starkast erfarenhet och vill ta fler uppdrag.
    </p>
    <div className="mt-3 rounded-lg border border-accent/30 bg-background/60 p-3 text-sm text-foreground/90">
      <strong>Glöm inte längre ned på sidan:</strong>
      <ul className="mt-1 list-disc pl-5 space-y-0.5 text-muted-foreground">
        <li><strong className="text-foreground">Expertprofiler och roller</strong>, så att köpare som söker specialistkompetens hittar era konsulter.</li>
        <li><strong className="text-foreground">Nyheter till Partnernytt</strong>, till exempel kundcase, analyser eller lanseringar.</li>
        <li><strong className="text-foreground">Kommande events</strong>, som webinarier, demos och frukostseminarier.</li>
      </ul>
    </div>
    <details className="group mt-4">
      <summary className="cursor-pointer list-none inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        Tips för en starkare profil (6 råd som gör skillnad)
      </summary>
      <ol className="mt-4 space-y-3 text-sm text-muted-foreground list-decimal pl-5">
        <li>
          <strong className="text-foreground">Välj upp till tre branscher per produktområde.</strong> Välj de
          områden där ni har dokumenterad erfarenhet och konkreta referenser.
        </li>
        <li>
          <strong className="text-foreground">Beskriv era typiska kunder och uppdrag ärligt.</strong> Är ni
          starkast på nyimplementationer, migreringar från äldre versioner, förvaltning, partnerbyten eller
          avgränsade specialistinsatser? Ange gärna typisk företagsstorlek.
        </li>
        <li>
          <strong className="text-foreground">Ge konkreta exempel.</strong> Berätta kort om kundens
          utgångsläge, vad ni levererade och vilken skillnad det gjorde. Använd bara kunduppgifter ni får
          publicera.
        </li>
        <li>
          <strong className="text-foreground">Lyft det som skiljer er från andra.</strong> Det kan vara en
          branschlösning, beprövade integrationer (till exempel TA, EDI eller WMS) eller spetskompetens inom{" "}
          <span className="whitespace-nowrap">Power Platform</span> och Copilot-agenter.
        </li>
        <li>
          <strong className="text-foreground">Gör det enkelt att gå vidare.</strong> Ange en namngiven
          kontaktperson och länka gärna till en sida om ert erbjudande, inte bara er startsida.
        </li>
        <li>
          <strong className="text-foreground">Titta in en gång i månaden.</strong> d365.se och systersajterna
          utvecklas löpande med nya verktyg och guider. Se över profilen månatligen, lägg in aktuella event och
          kundcase och säkerställ att uppgifterna är färska.
        </li>
      </ol>
      <p className="mt-4 text-sm text-muted-foreground italic">
        Skriv för en köpare som inte känner er sedan tidigare. Undvik allmänna formuleringar som ”vi hjälper
        företag att digitalisera”. En tydlig och ärlig profil gör det lättare för rätt kunder att avgöra om ni
        passar deras behov.
      </p>
    </details>
  </section>
);

/** Kort kontextuell hjälpruta inne i en sektion. */
export const SectionTip = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 p-3 flex items-start gap-2">
    <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
    <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
  </div>
);
