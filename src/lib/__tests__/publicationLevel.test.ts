import { describe, expect, it } from 'vitest';
import { partnerLevel, partnerLevelFields, hasDatedVerification, isvLevel, isvLevelFields, premiumProductAllowance } from '../publicationLevel';
describe('Publicering är skild från verifiering', () => {
  it('Ej publicerad får inte bli Grundprofil', () => {
    expect(partnerLevelFields('hidden')).toEqual({ is_featured: false, hide_basic_card: true });
    expect(partnerLevel(partnerLevelFields('hidden'))).toBe('hidden');
  });
  it('Grundprofil visas utan Premium', () => {
    expect(partnerLevelFields('basic')).toEqual({ is_featured: false, hide_basic_card: false });
  });
  it('Premium ger inte verifiering', () => {
    expect(hasDatedVerification({ information_status: 'compiled' })).toBe(false);
    expect(partnerLevel(partnerLevelFields('premium'))).toBe('premium');
  });
  it('Verifierad kräver datum', () => {
    expect(hasDatedVerification({ information_status: 'verified' })).toBe(false);
    expect(hasDatedVerification({ information_status: 'verified', information_verified_at: '2026-11-26' })).toBe(true);
  });
  it('Dold ISV styr d365.se utan att radera produktval', () => {
    expect(isvLevelFields('hidden', 'vendor')).toEqual({ publish_d365: false });
    expect(isvLevel({ publish_d365: false, publication_status: 'published', premium_vendor: true }, 'vendor')).toBe('hidden');
  });
  it('En produkt kan döljas separat', () => {
    expect(isvLevelFields('hidden', 'product')).toEqual({ publish_d365: false });
  });
  it('Tre produkter ingår och fler kan köpas', () => {
    expect(premiumProductAllowance(0)).toBe(3);
    expect(premiumProductAllowance(2)).toBe(5);
  });
});