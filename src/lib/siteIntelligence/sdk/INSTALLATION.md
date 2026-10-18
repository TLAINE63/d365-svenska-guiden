INSTALLATION I SAJTPROJEKTET: d365.se

Detta paket är förberett, inte installerat. Lägg SDK-filerna i samma katalog och använd projektets Zod-beroende.
Skapa EN tjänst med createTrackingService({ endpoint: "https://sajt-analys.lovable.app/api/public/track-journey", siteId: "d365_se", registry, environment: "test", consent: () => analyticsConsentGranted }). Koppla consent till sajtens verkliga samtycke, aldrig konstant true.
Använd config från engagement om den finns; annars SDK:s dokumenterade standard.
Ersätt befintlig köpresesändare utan dubbelregistrering. page_view skickas en gång vid initial visning och verkligt sidbyte med faktisk page_type. Koppla produkt/pris/jämförelse/leverantör/wizard vid verkliga handlingar. lead_submit enbart efter bekräftad mottagning med submission_status=confirmed.
Registrera saknade content/comparison/provider-nycklar centralt före användning; hitta aldrig på nycklar. Mottagaren härleder multiple_* och journey_step_reached: skicka dem inte.
d365guide.com/no och underliggande sidor använder d365guide_no, övriga sidor d365guide_com; välj nyckel per sidbyte. Separata sajtidentiteter, inga kopplingar mellan domäner.
Verifiera utan samtycke: inga anrop eller lagrade identiteter. Med samtycke: använd TEST, kontrollera POST-svar ok och Diagnostics; återanvänd samma event_id vid replay och kontrollera tracked=0. Testa verkligt formulär och klick utan blockerad navigation.
Aktivera produktion först efter uttrycklig publicering av mottagaren och verifiering av sajtprojektet. Inga personuppgifter, fria formulärsvar eller URL-frågeparametrar. Thomas och partners inkluderas med samma samtyckesvillkor.
