// Gemensam källa för publika partnerantal. Samma värden används i förrenderad
// HTML och efter hydrering, så att startsida, partnerlista och marknadsrapport
// aldrig visar olika siffror. Grundprofiler och verifierade profiler överlappar
// inte (kontrolleras i test).
import partnerData from "@/data/partnerData.json";
import basicPartnerRoutes from "@/data/basicPartnerRoutes.json";

type Featured = { slug?: string; is_featured?: boolean | null };

export const VERIFIED_PARTNER_SLUGS: string[] = (partnerData as Featured[])
  .filter((p) => p.is_featured === true)
  .map((p) => p.slug ?? "");

export const VERIFIED_PARTNER_COUNT = VERIFIED_PARTNER_SLUGS.length;
export const BASIC_PARTNER_COUNT = (basicPartnerRoutes as { slug: string }[]).length;
export const IDENTIFIED_PARTNER_COUNT = VERIFIED_PARTNER_COUNT + BASIC_PARTNER_COUNT;
