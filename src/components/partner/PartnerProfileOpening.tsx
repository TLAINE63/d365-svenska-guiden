import { Link } from "react-router-dom";
import InformationStatusBadge from "@/components/partner/InformationStatusBadge";
import ProtectedContact from "@/components/partner/ProtectedContact";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, ExternalLink, Globe, Mail, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DatabasePartner } from "@/hooks/usePartners";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useInquiry } from "@/contexts/InquiryContext";
import { track as trackEvent, partnerWebsiteUrl } from "@/lib/track";
import { trackPartnerEvent } from "@/utils/trackPartnerEvent";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { extractYouTubeId } from "@/lib/youtube";
import { PROFILE_EXPLAINER_VERIFIED_MORE, PROFILE_EXPLAINER_VERIFIED_SHORT } from "@/data/profileModel";
import { trackPartnerCardEvent } from "@/utils/trackPartnerEvent";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { trackPartnerFunnel } from "@/lib/partnerSearchFunnel";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { PARTNER_PROFILE_CTA } from "@/lib/conversionCtas";

interface Props {
  partner: DatabasePartner;
  product?: string | null;
  industry?: string;
  onIntro: () => void;
  onVideo: () => void;
}

export default function PartnerProfileOpening({ partner, product, industry, onIntro, onVideo }: Props) {
  const shortlist = useShortlist();
  const inquiry = useInquiry();
  const saved = shortlist.isSaved(partner.slug);
  const website = partnerWebsiteUrl((partner as { website?: string | null }).website);
  useEffect(() => { trackEvent("partner_profile_view", null, partner.slug); }, [partner.slug]);
  const value = (product || "").toLowerCase();
  const keys: Array<keyof DatabasePartner["product_filters"]> = value.includes("business central") ? ["bc"] : /finance|supply/.test(value) ? ["fsc"] : /crm|customer engagement/.test(value) ? ["sales", "service", "crm"] : /sales|marketing|insights/.test(value) ? ["sales", "crm"] : /service|contact center|field/.test(value) ? ["service", "crm"] : [];
  const contact = keys.map(key => partner.product_filters?.[key]).find(p => p?.contactName || p?.contactEmail || p?.contactPhone);
  const name = contact?.contactName || partner.contactPerson;
  const email = (contact?.contactEmail || (partner as { email?: string | null }).email || "").trim();
  const phone = (contact?.contactPhone || (partner as { phone?: string | null }).phone || "").trim();
  const photo = contact?.contactPhotoUrl || partner.contact_photo_url;
  const video = extractYouTubeId(contact?.youtubeVideoId || partner.youtube_video_id);
  const description = partner.description?.trim();
  const shortDescription = description && description.length > 340 ? `${description.slice(0, 337).replace(/\s+\S*$/, "")}…` : description;
  const track = (action: string) => trackFunnelEvent({ event_type: "cta_click", event_name: "partner_decision_action", metadata: { action, partner_slug: partner.slug, product, industry } });

  return <>
    <Helmet><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap" /></Helmet>
    <header className="partner-opening bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-8 sm:pt-12 pb-10 sm:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5 mb-8 sm:mb-12">
          <Button asChild variant="ghost" size="sm" className="px-0 text-muted-foreground"><Link to="/alla-d365-partners/"><ArrowLeft className="h-4 w-4" />Alla partners</Link></Button>
          {partner.is_featured === true && (
            <img
              src={`/badges/verifierad-partner-dark.svg`}
              alt="Verifierad Dynamics 365-partner på d365.se"
              width={240}
              height={72}
              className="h-[72px] w-[240px] max-w-full shrink-0 object-contain"
              loading="eager"
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-9">
          {partner.logo_url && <div className="partner-opening-logo flex h-32 w-44 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-5"><img src={optimizedLogo(partner.logo_url)} alt={`${partner.name} logotyp`} className="max-h-full max-w-full object-contain" loading="eager" /></div>}
          <div className="min-w-0">
            <p className="mb-3 text-sm text-muted-foreground">{nowrapBrand("Microsoft Dynamics 365-partner")}</p>
            <h1 className="partner-opening-name font-semibold leading-tight break-words">{partner.name}</h1>
            <div className="mt-3"><InformationStatusBadge partner={partner as { information_status?: string | null; information_verified_at?: string | null }} showDate explain /></div>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 max-w-3xl">
          {shortDescription && <><p className="text-xs font-semibold text-accent mb-3">Partnerns information</p><p className="text-lg sm:text-xl leading-relaxed">{nowrapBrand(shortDescription)}</p></>}
          {description && description !== shortDescription && <details className="mt-3 text-sm text-muted-foreground"><summary className="cursor-pointer">Läs hela presentationen</summary><p className="mt-3 whitespace-pre-line leading-relaxed">{nowrapBrand(description)}</p></details>}
        </div>
        {(name || photo || email || phone || website) && <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
          {photo && <img src={photo} alt={name ? `Foto av ${name}` : "Partnerns kontaktperson"} className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-lg object-cover border border-border" loading="eager" />}
          <div className="min-w-0">
            {name && <div className="mb-2"><p className="text-xs text-muted-foreground">{product ? nowrapBrand(`Kontakt för ${product}`) : "Partnerns kontaktperson"}</p><p className="text-base font-semibold break-words">{name}</p></div>}
            {(email || phone || website) && <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label={`Kontaktuppgifter till ${partner.name}`}>
          {email && <li className="flex items-center gap-2 min-w-0"><Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden /><ProtectedContact kind="email" value={email} icon={null} onClick={() => trackEvent("partner_contact_click", { type: "email" }, partner.slug)} /></li>}
          {phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden /><ProtectedContact kind="phone" value={phone} icon={null} onClick={() => trackEvent("partner_contact_click", { type: "phone" }, partner.slug)} /></li>}
          {website && <li className="flex items-center gap-2 min-w-0"><Globe className="h-4 w-4 shrink-0 text-accent" aria-hidden /><a href={website} target="_blank" rel="noopener" className="underline underline-offset-4 break-all" onClick={() => { trackPartnerFunnel("partner_selfservice_clicked", { partner_slug: partner.slug, via: "webbplats_kontaktrad" }); trackEvent("partner_outbound_click", { via: "kontaktrad" }, partner.slug); trackPartnerEvent({ event: "klick_utgaende_partnersajt", partnerSlug: partner.slug, metadata: { via: "kontaktrad" } }); }}>{new URL(website).hostname.replace(/^www\./, "")}</a></li>}
            </ul>}
          </div>
        </div>}
        <div className="partner-opening-actions mt-8 flex flex-wrap gap-3" aria-label={`Nästa steg för ${partner.name}`}>
          <Button onClick={() => { track("request_contact"); inquiry.open({ partners: [{ slug: partner.slug, name: partner.name }], type: "partner", productArea: product }); }} className="partner-opening-intro min-h-12 px-6 font-semibold">{PARTNER_PROFILE_CTA.primary}<ArrowRight className="h-4 w-4" /></Button>
          {saved ? (
            <span className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium"><BookmarkCheck className="h-4 w-4" />Tillagd i kortlistan<Link to="/kortlista/" className="underline underline-offset-4">Visa kortlistan</Link></span>
          ) : (
            <Button variant="outline" onClick={() => {
              shortlist.toggle({ slug: partner.slug, name: partner.name, url: `/partner/${partner.slug}/`, verified: true });
              trackPartnerCardEvent("spara_shortlist", partner, "verifierad", product);
              trackEvent("shortlist_add", null, partner.slug);
            }} className="min-h-12"><Bookmark className="h-4 w-4" />Lägg till i kortlista</Button>
          )}
          {website && <Button asChild variant="ghost" className="min-h-12"><a href={website} target="_blank" rel="noopener" onClick={() => { trackPartnerFunnel("partner_selfservice_clicked", { partner_slug: partner.slug, via: "webbplats_profil" }); trackEvent("partner_outbound_click", { via: "profil" }, partner.slug); trackPartnerEvent({ event: "klick_utgaende_partnersajt", partnerSlug: partner.slug, metadata: { via: "profilknapp" } }); }}><ExternalLink className="h-4 w-4" />Besök partnerns webbplats</a></Button>}
        </div>
        <p className="mt-3 max-w-2xl text-xs text-muted-foreground">Förfrågan går bara till {partner.name}, och bara om ni godkänner det i formuläret. Partnern kontaktar er sedan direkt.</p>
        <AdvisoryOffer
          className="mt-5 max-w-2xl"
          variant="compact"
          placement="partner_search"
          pageType="partner_profile"
          cta={PARTNER_PROFILE_CTA.secondary}
          text={`Osäker på om ${partner.name} passar er?`}
          dialogTitle={PARTNER_PROFILE_CTA.secondary}
          dialogDescription={`d365.se går igenom ert behov och om ${partner.name} är ett rimligt val. Inget skickas till ${partner.name} eller någon annan partner utan ert godkännande.`}
          messageLabel="Vad är ni osäkra på? (valfritt)"
          submitEvent="partner_selection_help_requested"
          sections={[{ key: "partnerprofil", label: "Partner ni tittar på", lines: [partner.name, ...(product ? [`Produkt: ${product}`] : []), ...(industry ? [`Bransch: ${industry}`] : [])] }]}
          metadata={{ partner_slug: partner.slug, product: product ?? null }}
        />
        <div className="mt-8 border-t border-border pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <details className="text-xs text-muted-foreground max-w-2xl"><summary className="cursor-pointer font-medium">Vad innebär partnerverifierad?</summary><p className="mt-2 leading-relaxed">{PROFILE_EXPLAINER_VERIFIED_SHORT} {PROFILE_EXPLAINER_VERIFIED_MORE}</p></details>
          {video && <Button variant="outline" size="sm" onClick={onVideo} aria-label={`Spela introduktionsvideo från ${partner.name}`}><Play className="h-4 w-4" />Introduktionsvideo</Button>}
        </div>
      </div>
    </header>
  </>;
}