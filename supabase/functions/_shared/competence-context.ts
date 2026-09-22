// Delad kompetenskontext ("Hitta rätt kompetens") för AI-sök och chatbot.
// Rollguiderna speglar src/data/competenceGuides.ts; uppdragsprofilerna hämtas
// från den publika vyn assignment_profiles_public (publicerad partner,
// publicerad profil, kontrollerad inom 12 månader).

export const COMPETENCE_OVERVIEW_PATH = '/kompetens';

export interface CompetenceGuideRef {
  slug: string;
  title: string;
  summary: string;
}

/** Rollguider (produkt väljs separat i filtret på guidesidan). */
export const COMPETENCE_GUIDE_REFS: CompetenceGuideRef[] = [
  {
    slug: 'dynamics-365-applikationskonsult',
    title: 'Applikationskonsult',
    summary: 'Konfigurerar och anpassar Dynamics 365 efter verksamhetens processer, stöttar kravställning, dokumentation, test och överlämning. Produktområde väljs i filtret.',
  },
  {
    slug: 'dynamics-365-projektledare',
    title: 'Dynamics 365-projektledare',
    summary: 'Driver införandeprojekt: plan, budget, resurser, risker och styrgruppsrapportering.',
  },
  {
    slug: 'dynamics-365-testledare',
    title: 'Dynamics 365-testledare',
    summary: 'Planerar och leder test: testfall, acceptanstest, regressionstest, felrapportering.',
  },
  {
    slug: 'dynamics-365-solution-architect',
    title: 'Dynamics 365 Solution Architect',
    summary: 'Ansvarar för lösningsdesign, integrationer, dataflöden och tekniska vägval.',
  },
  {
    slug: 'dynamics-365-forvaltningsledare',
    title: 'Dynamics 365-förvaltningsledare',
    summary: 'Leder förvaltning och vidareutveckling efter driftsättning, releaser och prioritering.',
  },
  {
    slug: 'dynamics-365-utvecklare',
    title: 'Dynamics 365 - Utvecklare/Developer',
    summary: 'Utvecklar anpassningar och integrationer. Språket skiljer sig per produktområde (AL, X++, JavaScript/TypeScript, C#-plugins).',
  },
  {
    slug: 'dynamics-365-support-och-servicedesk',
    title: 'Dynamics 365-support och servicedesk',
    summary: 'Användarsupport, incidenthantering, servicenivåer och löpande ärenden.',
  },
];

export const competenceGuidePath = (slug: string) => `/kompetens/${slug}/`;

/** Alla giltiga rutter i kompetensdelen (för länkvalidering). */
export const COMPETENCE_ROUTES: { path: string; label: string }[] = [
  { path: COMPETENCE_OVERVIEW_PATH, label: 'Hitta rätt Dynamics 365-kompetens – översikt över roller och expertkonsulter' },
  ...COMPETENCE_GUIDE_REFS.map((g) => ({
    path: competenceGuidePath(g.slug),
    label: `${g.title} – kompetensguide och profilerade partners`,
  })),
];

/**
 * Bygger ett textblock med kompetensroller och publicerade uppdragsprofiler
 * som kan läggas i systemprompten.
 */
export async function buildCompetenceContextBlock(): Promise<string> {
  const guideLines = COMPETENCE_GUIDE_REFS.map(
    (g) => `- ${g.title} → ${competenceGuidePath(g.slug)} | ${g.summary}`,
  ).join('\n');

  let profileLines = '';
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/assignment_profiles_public?select=guide_slug,partner_slug,partner_name,heading,experience_summary,products,industries,regions,delivery_modes&limit=300`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        profileLines = rows
          .map((r: any) => {
            const summary = String(r.experience_summary || '').replace(/\s+/g, ' ').trim().substring(0, 220);
            return `- ${r.partner_name} → /partner/${r.partner_slug} | roll: ${r.guide_slug} (${competenceGuidePath(r.guide_slug)}) | ${r.heading || ''} | produkter: ${(r.products || []).join(', ')} | branscher: ${(r.industries || []).join(', ')} | regioner: ${(r.regions || []).join(', ')} | leverans: ${(r.delivery_modes || []).join(', ')} | ${summary}`;
          })
          .join('\n');
      }
    }
  } catch (e) {
    console.error('buildCompetenceContextBlock: kunde inte hämta uppdragsprofiler', e);
  }

  return `\n\nKOMPETENS / EXPERTKONSULTER ("Hitta rätt Dynamics 365-kompetens", ${COMPETENCE_OVERVIEW_PATH}):
Om frågan gäller roller, expertkonsulter, konsultprofiler, resursförstärkning, interimsroller eller "hitta rätt kompetens" – hänvisa till kompetensguiderna nedan. Produktområde, bransch, region och leveransform väljs som filter på guidesidan.
ROLLGUIDER:
${guideLines}
${profileLines ? `PUBLICERADE UPPDRAGSPROFILER (partners som d365.se kontrollerat underlag för. Nämn aldrig namngivna personer – profilerna beskriver roller och funktioner):\n${profileLines}` : 'Inga publicerade uppdragsprofiler finns ännu – hänvisa då till rollguiden och partnerguiden (/valjdynamics365partner).'}
Hitta ALDRIG på roller, partners eller profiler som inte står ovan.`;
}
