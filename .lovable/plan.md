Ta bort rutan "Verifierade Dynamics 365-partners" (nuvarande 16 st) från hero-sektionen på startsidan.

### Ändringar

- **Fil:** `src/pages/Index.tsx`
- **Omfång:** Statistik-stripen på rad 338–362.

1. **Ta bort rutan** med `VERIFIED_PARTNER_COUNT` + texten "Verifierade Dynamics 365-partners" ur arrayen med statistikboxar.
2. **Anpassa grid-layout** från 5 till 4 boxar:
   - Ändra `grid-cols-2 md:grid-cols-5` till `grid-cols-2 md:grid-cols-4`.
   - Ta bort `col-span-2 md:col-span-1` på första boxen ("Identifierade partners") så alla fyra boxar får samma bredd och rytm.
3. **Städa upp** konstanten `VERIFIED_PARTNER_COUNT` om den inte används någon annanstans efter borttaget.

### Resultat

Hero-sektionen visar endast de fyra återstående informationsboxarna: identifierade partners, branscher, beslutsverktyg och "ingen betalar för placering".