/** Branschbilder som delas av /branscher/ och tilläggskatalogen. */
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import modeSportTextilImg from "@/assets/industries/mode-sport-textil.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import nonprofitImg from "@/assets/industries/nonprofit.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

export const INDUSTRY_IMAGES: Record<string, string> = {
 "tillverkning": tillverkningImg,
 "livsmedel-processindustri": livsmedelsImg,
 "grossist-distribution": handelDistributionImg,
 "retail-ehandel": detaljhandelImg,
 "mode-sport-textil": modeSportTextilImg,
 "konsulttjanster": konsultforetagImg,
 "bygg-entreprenad": byggEntreprenadImg,
 "fastighet-forvaltning": fastigheterImg,
 "energi-utilities": energiImg,
 "finans-forsakring": finansForsakringImg,
 "life-science-medtech": lakemedelImg,
 "telekom-it-tjanster": itTechImg,
 "logistik-transport": transportLogistikImg,
 "media-publishing": mediaPublishingImg,
 "jordbruk-skogsbruk": jordbrukImg,
 "halsa-sjukvard": halsaImg,
 "nonprofit-organisationer": nonprofitImg,
 "medlemsorganisationer": medlemsorganisationerImg,
 "utbildning": utbildningImg,
 "offentlig-sektor": offentligSektorImg,
 "uthyrning": uthyrningImg,
};
