import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Building2, Upload, X, ImageIcon, Plus, Trash2, ExternalLink, CalendarDays, Clock, MapPin, Globe, Link, Layers, Package, MessageSquare, Sparkles, Target, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Eye, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { PremiumCollapsibleSection } from "@/components/admin/PremiumCollapsibleSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerViewStatsCard from "@/components/PartnerViewStatsCard";
import PartnerIndustryPitchesEditor, { type IndustryPitch } from "@/components/PartnerIndustryPitchesEditor";
import AiProfileSection from "@/components/partner/AiProfileSection";
import DeliveryProfileEditor from "@/components/partner/DeliveryProfileEditor";
import type { DeliveryProfileValue } from "@/data/deliveryProfileFields";

// Import product icons
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import CommerceIcon from "@/assets/icons/Commerce.svg?url";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg?url";
import { getAiOptionsForProduct } from "@/utils/aiScoring";
import { companySizes, revenueOptions } from "@/data/partners";
import { assertPitchLabelsConsistency } from "@/data/pitchProductMapping";

import { toggleContiguousRange } from "@/lib/segmentRange";


// Product sections matching admin structure
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

interface ProductSection {
 key: ProductKey;
 label: string;
 apps: string[];
 colorClass: string;
 icon: string;
}

const productSections: ProductSection[] = [
  { key: 'bc', label: 'Business Central', apps: ['Business Central'], colorClass: 'bg-business-central', icon: BusinessCentralIcon },
  { key: 'fsc', label: 'Finance & Supply Chain Management', apps: ['F&SCM'], colorClass: 'bg-finance-supply', icon: FinanceIcon },
  { key: 'sales', label: 'Sales & Customer Insights', apps: ['Sales', 'Customer Insights (Marketing)'], colorClass: 'bg-crm', icon: SalesIcon },
  { key: 'service', label: 'Customer Service / Field Service / Contact Center', apps: ['Customer Service', 'Field Service', 'Contact Center'], colorClass: 'bg-customer-service', icon: CustomerServiceIcon },
];
// Dev-time guard: keep editor labels in sync with PartnerCard's pitch resolver.
assertPitchLabelsConsistency(productSections, "PartnerUpdate productSections");

// Specialty products (no industry selection needed)
const specialtyProducts = ['Project Operations', 'Commerce', 'Human Resources'] as const;
type SpecialtyProduct = typeof specialtyProducts[number];

const specialtyProductIcons: Record<string, string> = {
 "Project Operations": ProjectOperationsIcon,
 "Commerce": CommerceIcon,
 "Human Resources": HumanResourcesIcon,
};

const INDUSTRY_OPTIONS = [
 "Tillverkningsindustri",
 "Livsmedel & Processindustri",
 "Grossist & Distribution",
 "Retail & E-handel",
 "Mode, Sport & Textil",
 "Konsulttjänster",
 "Bygg, Entreprenad & Installation",
 "Fastighet & Förvaltning",
 "Energi & Utilities",
 "Finans & Försäkring",
 "Life Science / Medtech",
 "Telekom & IT-tjänster",
 "Transport & Logistik",
 "Media & Publishing",
 "Jordbruk & Skogsbruk",
 "Hälsa- & sjukvård",
 "Non-profit / Organisationer",
 "Medlemsorganisationer",
 "Utbildning",
 "Offentlig sektor",
 "Uthyrningsverksamhet",
];

const GEOGRAPHY_OPTIONS = [
 "Sverige",
 "Norden",
 "Europa",
 "Globalt",
];


interface ProductFilter {
 industries: string[];
 geography: string[];
 swedenRegions: string[];
 swedenCities: string[];
 companySize?: string[];
 revenue?: string[];
 ranking: number;
 customerExamples: string[];
  customerCaseLinks: string[];
  productDescription: string;
  whyChoose: string;
  keyPoints: string;
  /** Leveransprofil per produktområde – hur partnern engageras under och efter go-live. */
  deliveryProfile?: DeliveryProfileValue;
  // AI capability fields
 aiCapabilities: string[];
 aiProjectCount: string;
 hasBuiltAgents: boolean | null;
 aiCaseDescription: string;
 aiBusinessImpact: string;
 aiSegmentationDetails: string[];
 aiPredictiveDetails: string[];
 aiOtherPartner: string;
 aiOtherAdvanced: string;
 // Per-product sales contact
 contactName: string;
 contactEmail: string;
 contactPhone: string;
 contactPhotoUrl: string;
 landingPageUrl: string;
}

interface ProductFilters {
 bc?: ProductFilter;
 fsc?: ProductFilter;
 sales?: ProductFilter;
 service?: ProductFilter;
}

interface Invitation {
 id: string;
 partner_name: string;
 email: string;
 partner_id: string | null;
 status: string;
 expires_at: string;
}

interface ExistingData {
 name: string;
 description: string;
 website: string;
 logo_url: string;
 contact_person: string;
 contact_photo_url: string;
 email: string;
 phone: string;
 address: string;
 applications: string[];
 industries: string[];
 secondary_industries: string[];
 geography: string[];
 product_filters: ProductFilters;
}

const emptyProductFilter: ProductFilter = {
 industries: [],
 geography: [],
 swedenRegions: [],
 swedenCities: [],
 ranking: 999,
 customerExamples: [],
 customerCaseLinks: [],
  productDescription: "",
  whyChoose: "",
  keyPoints: "",
  aiCapabilities: [],
 aiProjectCount: "",
 hasBuiltAgents: null,
 aiCaseDescription: "",
 aiBusinessImpact: "",
 aiSegmentationDetails: [],
 aiPredictiveDetails: [],
 aiOtherPartner: "",
 aiOtherAdvanced: "",
 contactName: "",
 contactEmail: "",
 contactPhone: "",
 contactPhotoUrl: "",
 landingPageUrl: "",
};

const PartnerUpdate = () => {
 const { token } = useParams<{ token: string }>();
 const navigate = useNavigate();
 
 const [loading, setLoading] = useState(true);
 const [submitting, setSubmitting] = useState(false);
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [existingSlug, setExistingSlug] = useState<string | null>(null);
 
 // Logo upload state
 const [uploadingLogo, setUploadingLogo] = useState(false);
 const [logoPreview, setLogoPreview] = useState<string | null>(null);
 const [dragActive, setDragActive] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);
 
 // Form state
 const [formData, setFormData] = useState({
 name: "",
 description: "",
 website: "",
 logo_url: "",
 contact_person: "",
 contact_photo_url: "",
 email: "",
 phone: "",
 address: "",
 notes: "",
 office_cities_input: "",
 invoice_email: "",
 invoice_contact: "",
 });
 const [uploadingMainContactPhoto, setUploadingMainContactPhoto] = useState(false);

 // Industry apps state
 interface IndustryApp {
 name: string;
 url: string;
 application: string;
 industry: string;
 description: string;
 }
 const [industryApps, setIndustryApps] = useState<IndustryApp[]>([]);

 // Events state
 interface PartnerEvent {
 id?: string;
 title: string;
 description: string;
 event_date: string;
 event_time: string;
 end_time: string;
 is_online: boolean;
 location: string;
 event_link: string;
 registration_link: string;
 status?: string;
 }
 const [partnerEvents, setPartnerEvents] = useState<PartnerEvent[]>([]);
 const [loadingEvents, setLoadingEvents] = useState(false);
 const [savingEvent, setSavingEvent] = useState<string | null>(null);
 const [showAddEvent, setShowAddEvent] = useState(false);
 const emptyEvent: PartnerEvent = {
 title: "", description: "", event_date: "", event_time: "", end_time: "",
 is_online: true, location: "", event_link: "", registration_link: "",
 };
 const [newEvent, setNewEvent] = useState<PartnerEvent>({ ...emptyEvent });

 // Product filters state - separated for easier management
 const [productFilters, setProductFilters] = useState<ProductFilters>({});
 const [activeProducts, setActiveProducts] = useState<ProductKey[]>([]);
 const [selectedSpecialtyProducts, setSelectedSpecialtyProducts] = useState<SpecialtyProduct[]>([]);
  const [industryPitches, setIndustryPitches] = useState<IndustryPitch[]>([]);

  // Decision profile state (legacy partner-level fields kept for backward compat / fallback)
  const [positioningStatement, setPositioningStatement] = useState("");
  const [deliveryProfile, setDeliveryProfile] = useState<{
    typical_length: string;
    methodology: string;
    bc_project_weeks_min: string;
    bc_project_weeks_max: string;
    bc_project_cost_band: string;
  }>({ typical_length: "", methodology: "", bc_project_weeks_min: "", bc_project_weeks_max: "", bc_project_cost_band: "" });
  
  const [teamSizeSweden, setTeamSizeSweden] = useState("");
  const [implementationsDone, setImplementationsDone] = useState("");
  const [implementationsPerApp, setImplementationsPerApp] = useState<Record<string, string>>({});
  const [notAFitInput, setNotAFitInput] = useState("");
  const [aiProfile, setAiProfile] = useState<import("@/lib/aiProfile").AiProfile>({});

  // Per-produkt beslutsprofil (positionering + leveransbild) – en post per aktiv D365-applikation
  type ProductProfile = {
    positioning: string;
    methodology: string;
    weeks_min: string;
    weeks_max: string;
    cost_band: string;
  };
  const EMPTY_PRODUCT_PROFILE: ProductProfile = {
    positioning: "",
    methodology: "",
    weeks_min: "",
    weeks_max: "",
    cost_band: "",
  };
  const [productProfiles, setProductProfiles] = useState<Record<string, ProductProfile>>({});
  const updateProductProfile = (app: string, patch: Partial<ProductProfile>) => {
    setProductProfiles((prev) => ({
      ...prev,
      [app]: { ...EMPTY_PRODUCT_PROFILE, ...(prev[app] || {}), ...patch },
    }));
  };

  type SectionKey = "basic" | "decision" | "products" | "ai" | "specialty" | "pitches" | "industryApps" | "events" | "notes";
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
  products: true,
  ai: false,
  basic: false,
  decision: false,
  specialty: false,
  pitches: false,
  industryApps: false,
  events: false,
  notes: false,
  });

  const [autoExpandApplied, setAutoExpandApplied] = useState(false);

  // Sub-step wizard per product (1..4)
  const [productStep, setProductStep] = useState<Record<string, number>>({});
  const getProductStep = (key: string) => productStep[key] ?? 1;
  const setStepFor = (key: string, n: number) =>
    setProductStep((prev) => ({ ...prev, [key]: Math.max(1, Math.min(4, n)) }));
  const PRODUCT_STEP_LABELS = [
    "Om erbjudandet",
    "Målgrupp",
    "Bevis",
    "Kontakt",
  ] as const;

  // Profile completion progress
  const profileProgress = useMemo(() => {
    let score = 0;
    const basicFields = [
      formData.name?.trim(),
      formData.website?.trim(),
      formData.description?.trim(),
      formData.contact_person?.trim(),
      formData.email?.trim(),
    ].filter(Boolean).length;
    score += (basicFields / 5) * 25;

    if (formData.logo_url?.trim()) score += 5;
    if (formData.contact_photo_url?.trim()) score += 5;

    const decisionFields = [
      positioningStatement?.trim(),
      notAFitInput?.trim(),
      deliveryProfile.methodology?.trim(),
      deliveryProfile.typical_length?.trim(),
      deliveryProfile.bc_project_cost_band?.trim(),
    ].filter(Boolean).length;
    score += (decisionFields / 5) * 20;

    if (activeProducts.length > 0 || selectedSpecialtyProducts.length > 0) score += 5;

    const productScore = activeProducts.reduce((sum, key) => {
      const pf = (productFilters?.[key] ?? {}) as Partial<ProductFilter>;
      const geo = Array.isArray(pf.geography) ? pf.geography : (pf.geography ? [pf.geography] : []);
      const productFields = [
        pf.productDescription?.trim(),
        pf.whyChoose?.trim(),
        pf.keyPoints?.trim(),
        geo.length > 0,
        (pf.industries?.length ?? 0) > 0,
      ].filter(Boolean).length;
      return sum + (productFields / 5) * 10;
    }, 0);
    score += Math.min(productScore, 40);

    return Math.round(Math.min(score, 100));
  }, [formData, positioningStatement, notAFitInput, deliveryProfile, activeProducts, selectedSpecialtyProducts, productFilters]);

  const toggleSection = (key: SectionKey) =>
 setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const SECTION_KEYS: SectionKey[] = ["basic", "products", "ai", "specialty", "pitches", "industryApps", "events", "decision", "notes"];
  const allExpanded = SECTION_KEYS.every((k) => openSections[k]);
  const setAllSections = (open: boolean) =>
    setOpenSections(SECTION_KEYS.reduce((acc, k) => ({ ...acc, [k]: open }), {} as Record<SectionKey, boolean>));

 // Smart auto-expand: open empty/incomplete sections after data loads (runs once).
 useEffect(() => {
 if (loading || autoExpandApplied || !invitation) return;
 const basicComplete = !!(formData.name?.trim() && formData.website?.trim() && formData.description?.trim() && formData.contact_person?.trim() && formData.email?.trim());
 const productsComplete = activeProducts.length > 0;
 const specialtyComplete = selectedSpecialtyProducts.length > 0;
 const industryAppsComplete = industryApps.some((a) => a.name?.trim() && a.url?.trim());
 const eventsComplete = partnerEvents.length > 0;
 const pitchesComplete = industryPitches.some((p) => p.text?.trim());
  const decisionComplete = !!(positioningStatement.trim() && notAFitInput.trim());
  setOpenSections({
  basic: !basicComplete,
  decision: !decisionComplete && productsComplete,
  products: !productsComplete,
  ai: false,

  specialty: !specialtyComplete && productsComplete,
  pitches: !pitchesComplete && productsComplete,
  industryApps: !industryAppsComplete && productsComplete,
  events: !eventsComplete && !!invitation?.partner_id,
  notes: false,
  });
 setAutoExpandApplied(true);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [loading, invitation]);

 useEffect(() => {
 const fetchInvitation = async () => {
 if (!token) {
 setError("Ogiltig länk");
 setLoading(false);
 return;
 }

 try {
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-invitation&token=${encodeURIComponent(token)}&_=${Date.now()}`,
 {
 method: "GET",
 cache: "no-store",
 headers: {
 "Content-Type": "application/json",
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 },
 }

 );

 const result = await response.json();

 if (!response.ok) {
 if (response.status === 410) {
 setError("Denna inbjudan har gått ut. Kontakta administratören för en ny länk.");
 } else {
 setError(result.error || "Kunde inte hämta inbjudan");
 }
 setLoading(false);
 return;
 }

 setInvitation(result.invitation);
 
  // Pre-fill form with existing data if available
  if (result.existingData) {
  if (result.existingData.slug) setExistingSlug(result.existingData.slug);
 setFormData({
 name: result.existingData.name || result.invitation.partner_name,
 description: result.existingData.description || "",
 website: result.existingData.website || "",
 logo_url: result.existingData.logo_url || "",
 contact_person: result.existingData.contact_person || "",
 contact_photo_url: result.existingData.contact_photo_url || "",
 email: result.existingData.email || result.invitation.email,
 phone: result.existingData.phone || "",
 address: result.existingData.address || "",
 notes: "",
 office_cities_input: (result.existingData.office_cities || []).join(", "),
 invoice_email: result.existingData.invoice_email || "",
 invoice_contact: result.existingData.invoice_contact || "",
 });
 
 // Set logo preview if exists
 if (result.existingData.logo_url) {
 setLogoPreview(result.existingData.logo_url);
 }
 
 // Pre-fill product filters if available
 if (result.existingData.product_filters) {
 setProductFilters(result.existingData.product_filters);
 // Determine which products are active based on existing data
 const active: ProductKey[] = [];
 productSections.forEach(section => {
 const filter = result.existingData.product_filters[section.key];
 if (filter && (filter.industries?.length > 0 || filter.productDescription)) {
 active.push(section.key);
 }
 });
 setActiveProducts(active);
 }
 
 // Pre-fill specialty products from applications
 if (result.existingData.applications) {
 const existingSpecialty = result.existingData.applications.filter(
 (app: string) => specialtyProducts.includes(app as SpecialtyProduct)
 ) as SpecialtyProduct[];
 setSelectedSpecialtyProducts(existingSpecialty);
 }
 
 // Pre-fill industry apps if available
 if (result.existingData.industry_apps && Array.isArray(result.existingData.industry_apps)) {
 setIndustryApps(result.existingData.industry_apps);
 }

  // Pre-fill industry pitches if available
  if (result.existingData.industry_pitches && Array.isArray(result.existingData.industry_pitches)) {
  setIndustryPitches(result.existingData.industry_pitches);
  }

  // Pre-fill decision profile fields
  const ed: any = result.existingData;
  if (typeof ed.positioning_statement === "string") setPositioningStatement(ed.positioning_statement);
  if (ed.delivery_profile && typeof ed.delivery_profile === "object") {
    const dp = ed.delivery_profile;
    setDeliveryProfile({
      typical_length: dp.typical_length || "",
      methodology: dp.methodology || "",
      bc_project_weeks_min: dp.bc_project_weeks_min != null ? String(dp.bc_project_weeks_min) : "",
      bc_project_weeks_max: dp.bc_project_weeks_max != null ? String(dp.bc_project_weeks_max) : "",
      bc_project_cost_band: typeof dp.bc_project_cost_band === "string" ? dp.bc_project_cost_band : "",
    });
  }
  if (typeof ed.team_size_sweden === "string") setTeamSizeSweden(ed.team_size_sweden);
  if (typeof ed.implementations_done === "string") setImplementationsDone(ed.implementations_done);
  if (ed.implementations_per_app && typeof ed.implementations_per_app === "object") {
    setImplementationsPerApp(ed.implementations_per_app as Record<string, string>);
  }
  if (Array.isArray(ed.not_a_fit)) setNotAFitInput(ed.not_a_fit.join("\n"));
  if (ed.ai_profile && typeof ed.ai_profile === "object") setAiProfile(ed.ai_profile);

  // Per-produkt beslutsprofil – hydrera från product_profiles, fall tillbaka på legacy positioning/delivery_profile
  if (ed.product_profiles && typeof ed.product_profiles === "object" && !Array.isArray(ed.product_profiles)) {
    const normalized: Record<string, ProductProfile> = {};
    for (const [app, raw] of Object.entries(ed.product_profiles as Record<string, any>)) {
      if (!raw || typeof raw !== "object") continue;
      normalized[app] = {
        positioning: typeof raw.positioning === "string" ? raw.positioning : "",
        methodology: typeof raw.methodology === "string" ? raw.methodology : "",
        weeks_min: raw.weeks_min != null ? String(raw.weeks_min) : "",
        weeks_max: raw.weeks_max != null ? String(raw.weeks_max) : "",
        cost_band: typeof raw.cost_band === "string" ? raw.cost_band : "",
      };
    }
    setProductProfiles(normalized);
  }
 } else {
 setFormData(prev => ({
 ...prev,
 name: result.invitation.partner_name,
 email: result.invitation.email,
 }));
 }
 } catch (err) {
 console.error("Error fetching invitation:", err);
 setError("Ett fel uppstod. Försök igen senare.");
 } finally {
 setLoading(false);
 }
 };

 fetchInvitation();
 }, [token]);

 // Fetch partner events if partner exists
 const fetchPartnerEvents = async () => {
 if (!token) return;
 setLoadingEvents(true);
 try {
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=invitation-get-events&token=${token}`,
 {
 headers: {
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 "Content-Type": "application/json",
 },
 }
 );
 const result = await response.json();
 if (result.events) {
 setPartnerEvents(result.events);
 }
 } catch (err) {
 console.error("Error fetching events:", err);
 } finally {
 setLoadingEvents(false);
 }
 };

 useEffect(() => {
 if (invitation?.partner_id) {
 fetchPartnerEvents();
 }
 }, [invitation?.partner_id]);

 const handleSaveEvent = async (event: PartnerEvent) => {
 if (!token || !event.title.trim() || !event.event_date) {
 toast.error("Titel och datum krävs");
 return;
 }
 setSavingEvent(event.id || "new");
 try {
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=invitation-save-event`,
 {
 method: "POST",
 headers: {
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ token, event }),
 }
 );
 const result = await response.json();
 if (!response.ok) throw new Error(result.error);
 toast.success(event.id ? "Event uppdaterat!" : "Event skapat! Det granskas av admin.");
 setShowAddEvent(false);
 setNewEvent({ ...emptyEvent });
 fetchPartnerEvents();
 } catch (err: any) {
 toast.error(err.message || "Kunde inte spara event");
 } finally {
 setSavingEvent(null);
 }
 };

 const handleDeleteEvent = async (eventId: string) => {
 if (!token || !confirm("Vill du ta bort detta event?")) return;
 try {
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=invitation-delete-event&token=${token}&eventId=${eventId}`,
 {
 method: "DELETE",
 headers: {
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 },
 }
 );
 if (!response.ok) throw new Error("Kunde inte ta bort event");
 toast.success("Event borttaget");
 fetchPartnerEvents();
 } catch (err: any) {
 toast.error(err.message);
 }
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 // Logo upload handlers
 const generateSlug = (name: string) => {
 return name
 .toLowerCase()
 .replace(/[åä]/g, 'a')
 .replace(/ö/g, 'o')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '');
 };

 const handleLogoUpload = async (file: File) => {
 if (!invitation) return;
 
 // Validate file type
 const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
 if (!allowedTypes.includes(file.type)) {
 toast.error("Endast JPEG, PNG, WebP och SVG är tillåtna");
 return;
 }
 
 // Validate file size (5MB max)
 if (file.size > 5 * 1024 * 1024) {
 toast.error("Filen får max vara 5MB");
 return;
 }
 
 setUploadingLogo(true);
 
 try {
 // Generate partner slug from name
 const partnerSlug = generateSlug(formData.name || invitation.partner_name);
 
 // Create form data for upload
 const uploadFormData = new FormData();
 uploadFormData.append("file", file);
 uploadFormData.append("token", token || "");
 uploadFormData.append("partnerSlug", partnerSlug);
 
 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-partner-logo`,
 {
 method: "POST",
 headers: {
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 },
 body: uploadFormData,
 }
 );
 
 const result = await response.json();
 
 if (!response.ok) {
 throw new Error(result.error || "Kunde inte ladda upp logotypen");
 }
 
 // Update form data with new logo URL
 setFormData(prev => ({ ...prev, logo_url: result.url }));
 setLogoPreview(result.url);
 toast.success("Logotypen har laddats upp!");
 } catch (err: any) {
 console.error("Logo upload error:", err);
 toast.error(err.message || "Ett fel uppstod vid uppladdning");
 } finally {
 setUploadingLogo(false);
 }
 };

 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 handleLogoUpload(file);
 }
 // Reset input so same file can be selected again
 e.target.value = "";
 };

 const handleDrag = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (e.type === "dragenter" || e.type === "dragover") {
 setDragActive(true);
 } else if (e.type === "dragleave") {
 setDragActive(false);
 }
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 setDragActive(false);
 
 const file = e.dataTransfer.files?.[0];
 if (file) {
 handleLogoUpload(file);
 }
 };

 const removeLogo = () => {
 setFormData(prev => ({ ...prev, logo_url: "" }));
 setLogoPreview(null);
 };

 const handleMainContactPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file || !invitation || !token) return;

 if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
 toast.error("Endast JPEG, PNG eller WebP tillåtna");
 e.target.value = "";
 return;
 }
 if (file.size > 5 * 1024 * 1024) {
 toast.error("Filen får max vara 5MB");
 e.target.value = "";
 return;
 }

 setUploadingMainContactPhoto(true);
 try {
 const slug = generateSlug(formData.name || invitation.partner_name || "partner");
 const uploadFormData = new FormData();
 uploadFormData.append("file", file);
 uploadFormData.append("token", token);
 uploadFormData.append("partnerSlug", slug);
 uploadFormData.append("kind", "contact-main");

 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-partner-logo`,
 { method: "POST", body: uploadFormData }
 );
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || "Uppladdning misslyckades");

 const bustedUrl = `${data.url}?t=${Date.now()}`;
 setFormData(prev => ({ ...prev, contact_photo_url: bustedUrl }));
 toast.success("Foto uppladdat");
 } catch (err: any) {
 toast.error(err.message || "Kunde inte ladda upp foto");
 } finally {
 setUploadingMainContactPhoto(false);
 e.target.value = "";
 }
 };

 const toggleProduct = (key: ProductKey) => {
 setActiveProducts(prev => {
 if (prev.includes(key)) {
 // Remove from active products and clear its filter
 setProductFilters(current => {
 const updated = { ...current };
 delete updated[key];
 return updated;
 });
 return prev.filter(k => k !== key);
 } else {
 // Add to active products with default filter
 setProductFilters(current => ({
 ...current,
 [key]: { ...emptyProductFilter }
 }));
 return [...prev, key];
 }
 });
 };

 const getProductFilter = (key: ProductKey): ProductFilter => {
 const existing = productFilters[key];
 if (!existing) return { ...emptyProductFilter };
 
 // Handle legacy single-string geography by converting to array
 const existingGeo = existing.geography;
 const normalizedGeography = Array.isArray(existingGeo) 
 ? existingGeo 
 : (existingGeo ? [existingGeo] : []);
 
 return {
 ...emptyProductFilter,
 ...existing,
 geography: normalizedGeography,
 swedenRegions: existing.swedenRegions || [],
 swedenCities: existing.swedenCities || [],
 customerExamples: existing.customerExamples || [],
 customerCaseLinks: existing.customerCaseLinks || [],
 aiCapabilities: existing.aiCapabilities || [],
 aiProjectCount: existing.aiProjectCount || "",
 hasBuiltAgents: existing.hasBuiltAgents ?? null,
 aiCaseDescription: existing.aiCaseDescription || "",
 aiBusinessImpact: existing.aiBusinessImpact || "",
 aiSegmentationDetails: existing.aiSegmentationDetails || [],
 aiPredictiveDetails: existing.aiPredictiveDetails || [],
 aiOtherPartner: existing.aiOtherPartner || "",
 aiOtherAdvanced: existing.aiOtherAdvanced || "",
 };
 };

 const updateProductFilter = (key: ProductKey, updates: Partial<ProductFilter>) => {
 setProductFilters(current => ({
 ...current,
 [key]: { ...getProductFilter(key), ...updates }
 }));
 };

 // Per-product sales contact photo upload (uses kind="contact-<productKey>")
 const [uploadingProductPhoto, setUploadingProductPhoto] = useState<ProductKey | null>(null);
 const handleProductContactPhotoUpload = async (
 productKey: ProductKey,
 e: React.ChangeEvent<HTMLInputElement>
 ) => {
 const file = e.target.files?.[0];
 if (!file || !token) return;

 const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
 if (!allowedTypes.includes(file.type)) {
 toast.error("Endast JPEG, PNG eller WebP tillåtna");
 e.target.value = "";
 return;
 }
 if (file.size > 5 * 1024 * 1024) {
 toast.error("Filen får max vara 5MB");
 e.target.value = "";
 return;
 }

 setUploadingProductPhoto(productKey);
 try {
 const slug = generateSlug(formData.name || invitation?.partner_name || "partner");
 const uploadFormData = new FormData();
 uploadFormData.append("file", file);
 uploadFormData.append("token", token);
 uploadFormData.append("partnerSlug", slug);
 uploadFormData.append("kind", `contact-${productKey}`);

 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-partner-logo`,
 { method: "POST", body: uploadFormData }
 );
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || "Uppladdning misslyckades");

 const bustedUrl = `${data.url}?t=${Date.now()}`;
 updateProductFilter(productKey, { contactPhotoUrl: bustedUrl });
 toast.success("Foto uppladdat");
 } catch (err: any) {
 toast.error(err.message || "Kunde inte ladda upp foto");
 } finally {
 setUploadingProductPhoto(null);
 e.target.value = "";
 }
 };

 const toggleProductIndustry = (productKey: ProductKey, industry: string) => {
 const filter = getProductFilter(productKey);
 const maxIndustries = 3;
 
 if (filter.industries.includes(industry)) {
 updateProductFilter(productKey, {
 industries: filter.industries.filter(i => i !== industry)
 });
 } else if (filter.industries.length < maxIndustries) {
 updateProductFilter(productKey, {
 industries: [...filter.industries, industry]
 });
 } else {
 toast.error(`Max ${maxIndustries} branscher per produkt`);
 }
 };

 // Helper function for cascading geography selection
 // When selecting a higher level, automatically include all lower levels
 const getCascadingGeography = (selectedGeo: string, currentSelection: string[]): string[] => {
 const hierarchy = ['Sverige', 'Norden', 'Europa', 'Globalt'];
 const selectedIndex = hierarchy.indexOf(selectedGeo);
 
 if (selectedIndex === -1) return [...currentSelection, selectedGeo];
 
 // Include all geographies at and below the selected level
 const toInclude = hierarchy.slice(0, selectedIndex + 1);
 const newSelection = new Set([...currentSelection, ...toInclude]);
 return Array.from(newSelection);
 };

 // Helper to remove geography
 const getFilteredGeography = (geoToRemove: string, currentSelection: string[]): string[] => {
 return currentSelection.filter(g => g !== geoToRemove);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 
 if (!token || !invitation) return;

 // Validation
 if (!formData.name.trim()) {
 toast.error("Företagsnamn krävs");
 return;
 }
 if (!formData.website.trim()) {
 toast.error("Webbplats krävs");
 return;
 }
 if (activeProducts.length === 0 && selectedSpecialtyProducts.length === 0) {
 toast.error("Välj minst en produkt ni arbetar med");
 return;
 }

 setSubmitting(true);

 try {
 // Build applications array from active products + specialty products
 const applications: string[] = [];
 activeProducts.forEach(key => {
 const section = productSections.find(s => s.key === key);
 if (section) {
 applications.push(...section.apps);
 }
 });
 // Add specialty products
 applications.push(...selectedSpecialtyProducts);

 // Parse office cities from comma-separated input
 const officeCities = formData.office_cities_input
 .split(",")
 .map(c => c.trim())
 .filter(Boolean);

 // Per-produkt beslutsprofil – sanera och behåll endast aktiva applikationer
 const sanitizedProductProfiles: Record<string, any> = {};
 for (const app of applications) {
   const pp = productProfiles[app];
   if (!pp) continue;
    const entry: any = {
      positioning: pp.positioning.trim() || null,
      methodology: pp.methodology.trim() || null,
      weeks_min: pp.weeks_min.trim() ? Math.max(0, parseInt(pp.weeks_min, 10) || 0) : null,
      weeks_max: pp.weeks_max.trim() ? Math.max(0, parseInt(pp.weeks_max, 10) || 0) : null,
      cost_band: pp.cost_band || null,
    };
    const hasAny =
      entry.positioning || entry.methodology ||
      entry.weeks_min != null || entry.weeks_max != null || entry.cost_band;
    if (hasAny) sanitizedProductProfiles[app] = entry;
 }
 // Härled legacy partner-fält från första app:s profil (för bakåtkompatibilitet)
 const firstAppWithProfile = applications.find((a) => sanitizedProductProfiles[a]);
 const legacyProfile = firstAppWithProfile ? sanitizedProductProfiles[firstAppWithProfile] : null;
 const legacyPositioning = legacyProfile?.positioning || positioningStatement.trim() || null;
  const legacyDelivery = legacyProfile
    ? {
        typical_length: "",
        methodology: legacyProfile.methodology || "",
        bc_project_weeks_min: legacyProfile.weeks_min,
        bc_project_weeks_max: legacyProfile.weeks_max,
        bc_project_cost_band: legacyProfile.cost_band,
      }
    : {
        typical_length: deliveryProfile.typical_length.trim(),
        methodology: deliveryProfile.methodology.trim(),
        bc_project_weeks_min: deliveryProfile.bc_project_weeks_min.trim() ? Math.max(0, parseInt(deliveryProfile.bc_project_weeks_min, 10) || 0) : null,
        bc_project_weeks_max: deliveryProfile.bc_project_weeks_max.trim() ? Math.max(0, parseInt(deliveryProfile.bc_project_weeks_max, 10) || 0) : null,
        bc_project_cost_band: deliveryProfile.bc_project_cost_band || null,
      };

 // Build submission data
 const submissionData = {
 ...formData,
 applications,
 industries: [],
 secondary_industries: [],
 geography: [],
 product_filters: productFilters,
 industry_apps: industryApps.filter(app => app.name.trim() && app.url.trim()),
 industry_pitches: industryPitches.filter(p => p.text?.trim()),
 office_cities: officeCities,
 product_profiles: sanitizedProductProfiles,
 positioning_statement: legacyPositioning,
 delivery_profile: legacyDelivery,
 team_size_sweden: teamSizeSweden || null,
 implementations_done: implementationsDone || null,
 implementations_per_app: Object.fromEntries(
   Object.entries(implementationsPerApp).filter(([app, v]) => applications.includes(app) && (v || "").trim())
 ),
  not_a_fit: notAFitInput.split("\n").map(s => s.trim()).filter(Boolean),
  ai_profile: aiProfile,
  };

 const response = await fetch(
 `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=submit`,
 {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
 },
 body: JSON.stringify({
 token,
 submissionData,
 }),
 }
 );

 const result = await response.json();

 if (!response.ok) {
 throw new Error(result.error || "Kunde inte skicka formuläret");
 }

 setSubmitted(true);
 toast.success("Tack! Dina uppgifter har skickats in.");
 } catch (err: any) {
 console.error("Submit error:", err);
 toast.error(err.message || "Ett fel uppstod");
 } finally {
 setSubmitting(false);
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-background">
 <div className="text-center">
 <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
 <p className="text-muted-foreground">Laddar formulär...</p>
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen bg-background">
 <Navbar />
 <div className="container mx-auto px-4 py-16">
 <Card className="max-w-lg mx-auto">
 <CardContent className="pt-6">
 <div className="text-center">
 <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
 <h1 className="text-xl font-semibold mb-2">Ett problem uppstod</h1>
 <p className="text-muted-foreground">{error}</p>
 </div>
 </CardContent>
 </Card>
 </div>
 <Footer />
 </div>
 );
 }

 if (submitted) {
 return (
 <div className="min-h-screen bg-background">
 <Navbar />
 <div className="container mx-auto px-4 py-16">
 <Card className="max-w-lg mx-auto">
 <CardContent className="pt-6">
 <div className="text-center">
 <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
 <h1 className="text-xl font-semibold mb-2">Tack för dina uppgifter!</h1>
 <p className="text-muted-foreground mb-4">
 Vi har mottagit dina uppgifter och kommer att granska dem. 
 Du får ett bekräftelsemail när din profil har uppdaterats.
 </p>
 <Button onClick={() => navigate("/")} variant="outline">
 Gå till startsidan
 </Button>
 </div>
 </CardContent>
 </Card>
 </div>
 <Footer />
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-background">
 <Helmet>
 <title>Uppdatera partnerprofil | d365.se</title>
 <meta name="robots" content="noindex, nofollow" />
 </Helmet>
 
 <Navbar />

 {/* Sticky live-preview button (desktop) */}
 {(formData.name || invitation?.partner_name) && (
   <a
     href={`/partner/${existingSlug || generateSlug(formData.name || invitation?.partner_name || "partner")}/`}
     target="_blank"
     rel="noopener noreferrer"
     className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1 px-3 py-4 rounded-l-xl border border-r-0 border-cta-orange/40 bg-cta-orange text-white shadow-lg hover:bg-cta-orange/90 transition-all"
     style={{ writingMode: 'vertical-rl' }}
      title="Så här visas ni för kunder – öppna er live partnerprofil i ny flik"
    >
      <Eye className="h-4 w-4 mb-1" style={{ writingMode: 'horizontal-tb' }} />
      <span className="text-[10px] font-medium opacity-80 tracking-wide">Så här visas ni för kunder</span>
      <span className="text-xs font-semibold tracking-wide">Förhandsvisa live</span>
    </a>
 )}

 <div className="container mx-auto px-4 py-8">
 <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Uppdatera partnerprofil</h1>
          <p className="text-muted-foreground">
            Fyll i eller uppdatera era uppgifter för {invitation?.partner_name}
          </p>
        </div>

        {/* Progress & Value */}
        <Card className="mb-8 border-cta-orange/20 bg-cta-orange/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Progress & Value</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Informationen ni fyller i publiceras direkt på ert partnerkort och er partnerprofil på d365.se – och används för att matcha er med rätt kunder.
                  Ju tydligare och mer komplett profilen är, desto starkare framträder ni för besökarna.
                </p>
              </div>
              <div className="text-right md:text-right">
                <span className="text-2xl font-bold text-cta-orange">{profileProgress}%</span>
                <p className="text-xs text-muted-foreground">komplett</p>
              </div>
            </div>
            <Progress value={profileProgress} indicatorClassName="bg-cta-orange" />
            <p className="text-xs text-muted-foreground mt-2">
              Fyll i grundinfo, positionering, produkter och branschpitchar för att öka träffsäkerheten.
            </p>
          </CardContent>
        </Card>

        {/* View statistics for this partner – temporarily hidden from partners */}

  <form onSubmit={handleSubmit} className="space-y-8">
  <div className="flex justify-end">
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setAllSections(!allExpanded)}
      className="gap-2"
    >
      {allExpanded ? (
        <>
          <ChevronsDownUp className="w-4 h-4" />
          Fäll ihop alla avdelningar
        </>
      ) : (
        <>
          <ChevronsUpDown className="w-4 h-4" />
          Expandera alla avdelningar
        </>
      )}
    </Button>
  </div>
  {/* Basic Information */}
  <PremiumCollapsibleSection
  title="Grundläggande information"
  description="Företagets kontaktuppgifter, logotyp och beskrivning"
  icon={Building2}
  accent="primary"
  status={
  formData.name?.trim() && formData.website?.trim() && formData.description?.trim() && formData.contact_person?.trim() && formData.email?.trim()
  ? "complete"
  : (formData.name?.trim() || formData.website?.trim() ? "partial" : "empty")
  }
  open={openSections.basic}
  onOpenChange={() => toggleSection("basic")}
  >
  <div className="space-y-4">
  <div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
  <Label htmlFor="name">Företagsnamn *</Label>
  <Input
  id="name"
  name="name"
  value={formData.name}
  onChange={handleInputChange}
  required
  />
  </div>
<div className="space-y-2">
  <Label htmlFor="website">Länk till er huvudsida för Dynamics 365 eller er företagswebb *</Label>
  <p className="text-sm text-muted-foreground">
    Använd en sida som hjälper kunden förstå ert erbjudande.
  </p>
  <Input
    id="website"
    name="website"
    type="url"
    placeholder="https://"
    value={formData.website}
    onChange={handleInputChange}
    required
  />
</div>
  </div>

<div className="space-y-2">
  <Label htmlFor="description">Beskrivning av företaget</Label>
  <p className="text-sm text-muted-foreground">
    Beskriv ert företag kort (max 2–3 meningar).
  </p>
  <Textarea
    id="description"
    name="description"
    rows={6}
    placeholder="Vi hjälper tillverkande företag med Business Central – särskilt produktionsplanering och lagerstyrning. Våra kunder är ofta 50–250 anställda i Sverige och Norden."
    value={formData.description}
    onChange={handleInputChange}
  />
  <p className="text-xs text-muted-foreground">
    • Vad ni gör (inte hela historien)<br />
    • Er spets inom Dynamics 365<br />
    • Typ av kunder ni arbetar med<br /><br />
    Undvik: “ledande partner”, “vi erbjuder”, marknadsföringsspråk.
  </p>
</div>

  <div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
  <Label htmlFor="contact_person">Säljare/Säljansvarig</Label>
  <Input
  id="contact_person"
  name="contact_person"
  value={formData.contact_person}
  onChange={handleInputChange}
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="email">E-post</Label>
  <Input
  id="email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleInputChange}
  />
  </div>
  </div>

  {/* Main Sales Contact Photo Upload */}
  <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
  <div>
  <Label className="text-sm font-semibold">Foto på huvudsäljkontakten</Label>
  <p className="text-xs text-muted-foreground mt-1">
  Visas på er partnerprofil bredvid säljkontaktens namn. Rekommenderat: porträtt 400×400px (JPG/PNG/WebP, max 5MB).
  </p>
  </div>
  <div className="flex items-center gap-4">
  {formData.contact_photo_url ? (
  <img
  src={formData.contact_photo_url}
  alt="Säljkontakt foto"
  className="h-20 w-20 object-cover rounded border-2 border-border "
  />
  ) : (
  <div className="h-20 w-20 rounded border-2 border-dashed border-border bg-background flex items-center justify-center">
  <ImageIcon className="h-7 w-7 text-muted-foreground" />
  </div>
  )}
  <div className="flex gap-2">
  <input
  type="file"
  accept="image/jpeg,image/png,image/webp"
  id="main-contact-photo"
  className="hidden"
  onChange={handleMainContactPhotoUpload}
  />
  <Button
  type="button"
  variant="outline"
  size="sm"
  disabled={uploadingMainContactPhoto}
  onClick={() => document.getElementById("main-contact-photo")?.click()}
  >
  {uploadingMainContactPhoto ? (
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  ) : (
  <Upload className="mr-2 h-4 w-4" />
  )}
  {uploadingMainContactPhoto
  ? "Laddar upp..."
  : (formData.contact_photo_url ? "Byt foto" : "Ladda upp foto")}
  </Button>
  {formData.contact_photo_url && (
  <Button
  type="button"
  variant="ghost"
  size="sm"
  onClick={() => setFormData(prev => ({ ...prev, contact_photo_url: "" }))}
  className="text-destructive hover:text-destructive"
  >
  <X className="h-4 w-4 mr-1" />
  Ta bort
  </Button>
  )}
  </div>
  </div>
  </div>

  <div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
  <Label htmlFor="phone">Telefon</Label>
  <Input
  id="phone"
  name="phone"
  value={formData.phone}
  onChange={handleInputChange}
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="address">Adress</Label>
  <Input
  id="address"
  name="address"
  value={formData.address}
  onChange={handleInputChange}
  />
  </div>
  </div>

  {/* Invoice fields */}
  <div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
  <Label htmlFor="invoice_contact">Fakturakontakt (namn)</Label>
  <Input
  id="invoice_contact"
  name="invoice_contact"
  value={formData.invoice_contact}
  onChange={handleInputChange}
  placeholder="Namn på fakturamottagare"
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="invoice_email">Faktura e-post</Label>
  <Input
  id="invoice_email"
  name="invoice_email"
  type="email"
  value={formData.invoice_email}
  onChange={handleInputChange}
  placeholder="faktura@example.com"
  />
  </div>
  </div>
  <div className="space-y-2">
  <Label htmlFor="office_cities_input">Kontorsstäder</Label>
  <Input
  id="office_cities_input"
  name="office_cities_input"
  placeholder="t.ex. Stockholm, Göteborg, Malmö"
  value={formData.office_cities_input}
  onChange={handleInputChange}
  />
  <p className="text-xs text-muted-foreground">Separera med kommatecken</p>
  </div>

  {/* Logo Upload Section */}
  <div className="space-y-3">
  <Label>Logotyp</Label>
  
  {logoPreview ? (
  <div className="flex items-start gap-4">
  <div className="relative w-32 h-32 rounded-lg border-2 border-border bg-muted overflow-hidden flex items-center justify-center">
  <img 
  src={logoPreview} 
  alt="Partner logotyp" 
  className="max-w-full max-h-full object-contain p-2"
  />
  </div>
  <div className="space-y-2">
  <p className="text-sm text-muted-foreground">
  Logotypen har laddats upp
  </p>
  <div className="flex gap-2">
  <Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => fileInputRef.current?.click()}
  disabled={uploadingLogo}
  >
  {uploadingLogo ? (
  <Loader2 className="h-4 w-4 animate-spin mr-2" />
  ) : (
  <Upload className="h-4 w-4 mr-2" />
  )}
  Byt logotyp
  </Button>
  <Button
  type="button"
  variant="ghost"
  size="sm"
  onClick={removeLogo}
  className="text-destructive hover:text-destructive"
  >
  <X className="h-4 w-4 mr-1" />
  Ta bort
  </Button>
  </div>
  </div>
  </div>
  ) : (
  <div
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
  onClick={() => fileInputRef.current?.click()}
  className={`
  relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
  transition-colors duration-200
  ${dragActive 
  ? 'border-primary bg-primary/5' 
  : 'border-border hover:border-primary/50 hover:bg-muted/50'
  }
  ${uploadingLogo ? 'pointer-events-none opacity-60' : ''}
  `}
  >
  {uploadingLogo ? (
  <div className="flex flex-col items-center gap-2">
  <Loader2 className="h-10 w-10 animate-spin text-primary" />
  <p className="text-sm text-muted-foreground">Laddar upp...</p>
  </div>
  ) : (
  <div className="flex flex-col items-center gap-3">
  <div className="rounded bg-muted p-3">
  <ImageIcon className="h-8 w-8 text-muted-foreground" />
  </div>
  <div>
  <p className="font-medium text-foreground">
  Dra och släpp er logotyp här
  </p>
  <p className="text-sm text-muted-foreground mt-1">
  eller klicka för att välja fil
  </p>
  </div>
  <p className="text-xs text-muted-foreground">
  JPEG, PNG, WebP eller SVG (max 5MB)
  </p>
  </div>
  )}
  </div>
  )}
  
  <input
  ref={fileInputRef}
  type="file"
  accept="image/jpeg,image/png,image/webp,image/svg+xml"
  onChange={handleFileSelect}
  className="hidden"
  />
  
  <p className="text-xs text-muted-foreground">
  Rekommenderat: SVG eller PNG med transparent bakgrund för bästa resultat
  </p>
  </div>
  </div>
  </PremiumCollapsibleSection>
 {/* Products - main flow */}
 <PremiumCollapsibleSection
 title="Dynamics 365-produkter"
 description="Välj produkter ni arbetar med och fyll i detaljer per produkt."
 icon={Layers}
 accent="crm"
 status={activeProducts.length === 0 ? "empty" : (activeProducts.length >= 2 ? "complete" : "partial")}
 open={openSections.products}
 onOpenChange={() => toggleSection("products")}
 badge={activeProducts.length > 0 ? <Badge variant="outline">{activeProducts.length} valda</Badge> : undefined}
 >
  <div className="space-y-6">
    <div className="rounded-lg border border-cta-orange/30 bg-cta-orange/5 p-3 flex items-start gap-2">
      <ArrowRight className="h-4 w-4 text-cta-orange mt-0.5 shrink-0" />
      <div className="text-sm text-foreground">
        <p className="font-medium">Det ni skriver här publiceras på ert partnerkort och er partnerprofil, och är underlag för matchningen mot kundernas sökningar.</p>
        <p>Ju tydligare ni beskriver er spets, desto bättre träffsäkerhet och framtoning.</p>
        <p className="text-xs text-muted-foreground mt-2">
          Aktivera enbart de lösningar ni faktiskt levererar. Lämna övriga avmarkerade – det räknas som <em>"Vi erbjuder inte denna lösning"</em>.
        </p>
      </div>
    </div>

    {/* Top partners gör så här */}
    <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">🔥</span>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Top partners gör så här</span>
      </div>
      <ul className="text-xs text-foreground/80 space-y-0.5 pl-1">
        <li>✔ 3 tydliga branscher per produkt</li>
        <li>✔ 3–4 punkter i "Varför välja er"</li>
        <li>✔ Minst 2 kundcase med kända namn</li>
      </ul>
    </div>

    <div className="flex flex-wrap gap-2">
 {productSections.map((section) => (
 <button
 key={section.key}
 type="button"
 onClick={() => toggleProduct(section.key)}
 className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
 activeProducts.includes(section.key)
 ? 'bg-primary text-primary-foreground border-primary '
 : 'bg-card border-border hover:border-primary/50'
 }`}
 >
 <img 
 src={section.icon} 
 alt={section.label} 
 className={`h-5 w-5 object-contain ${activeProducts.includes(section.key) ? 'brightness-0 invert' : ''}`} 
 />
 {section.label}
 </button>
 ))}
 </div>

 {activeProducts.length === 0 && (
 <p className="text-sm text-muted-foreground text-center py-4">
 Välj minst en produkt ovan för att fortsätta
 </p>
 )}

 {/* Product-specific sections */}
 {activeProducts.map((productKey) => {
 const section = productSections.find(s => s.key === productKey)!;
 const filter = getProductFilter(productKey);
 
   // Product-specific placeholder for description
   const descriptionPlaceholder = 
   productKey === 'bc' 
   ? "Ex: Business Central-implementationer i medelstora bolag inom distribution"
   : productKey === 'fsc'
   ? "Ex: Finance & Supply Chain för tillverkande koncerner med komplexa flöden"
   : productKey === 'sales'
   ? "Ex: Sales-implementeringar för B2B-företag med långa säljcykler"
   : "Ex: Customer Service-lösningar för supportteam med höga volymer";

   // Product-specific placeholder for "Varför välja er"
   const whyChoosePlaceholder =
   productKey === 'bc'
   ? "Ex: Vi har levererat 40+ Business Central-projekt i distributions- och grossistbolag (50–500 anställda). Vårt team kombinerar BC-konsulter med branschspecialister, och vi har en färdig accelerator för lager, inköp och e-handelsintegration som kortar implementationstiden med ca 30%."
   : productKey === 'fsc'
   ? "Ex: Vi är specialiserade på Finance & SCM i tillverkande koncerner med flera bolag och länder. Eget metodverk för konsolidering, IFRS och avancerad produktionsplanering. Senior projektledning som kunden möter från dag ett till go-live."
   : productKey === 'sales'
   ? "Ex: Vi bygger Sales-lösningar för B2B-bolag med långa säljcykler och komplex pipeline. Tight Copilot-integration, LinkedIn Sales Navigator och egna mallar för forecast och account-planering. Inga generiska CRM-utrullningar."
   : "Ex: Vi designar Customer Service för supportorganisationer med höga volymer och SLA-krav. Erfarenhet av omnikanal, kunskapsbas och Copilot-agents. Vi mäter alltid på lösningsgrad och first-response, inte bara på antalet ärenden.";

   // Product-specific placeholder for key points
   const keyPointsPlaceholder =
   productKey === 'bc'
   ? "Erfarna BC-konsulter med snitt 8+ år i rollen\nAccelerator för distribution, lager och e-handel\nFastpris och fast tidplan för standardimplementation\nLokal support i Sverige – inga offshore-team"
   : productKey === 'fsc'
   ? "Erfarenhet av Finance & SCM i tillverkningsbolag\nProjekt i internationella miljöer och flera bolag\nFokus på komplex produktion, planering och konsolidering\nSenior projektledning genom hela leveransen"
   : productKey === 'sales'
   ? "Specialister på B2B med långa säljcykler\nCopilot for Sales och LinkedIn Sales Navigator i grunden\nMallar för pipeline, forecast och account-planer\nAdoption-program så CRM faktiskt används"
   : "Omnikanal: telefon, mejl, chatt, självservice\nCopilot-agents för förstaledssupport\nKunskapsbas och ärendeflöden från dag ett\nMätbara mål på lösningsgrad, AHT och CSAT";
 
 return (
 <Card key={productKey} className="ring-2 ring-offset-2" style={{ borderColor: `hsl(var(--${section.key === 'bc' ? 'business-central' : section.key === 'fsc' ? 'finance-supply' : section.key === 'sales' ? 'crm' : 'customer-service'}))` }}>
 <CardHeader className={`pb-4 ${section.colorClass} text-white rounded-t-lg`}>
 <CardTitle className="text-xl font-bold flex items-center justify-between">
 <span className="flex items-center gap-3">
 <img src={section.icon} alt={section.label} className="h-8 w-8 object-contain" />
 {section.label}
 </span>
 <Badge variant="secondary" className="text-xs">Aktiv</Badge>
 </CardTitle>
 <div className="flex flex-wrap gap-2 mt-2">
 {section.apps.map((app) => (
 <Badge key={app} variant="secondary" className="text-xs font-normal bg-white/20 text-white border-white/30">
 Dynamics 365 {app}
 </Badge>
 ))}
 </div>
 </CardHeader>
 <CardContent className="space-y-4 pt-4">
 {(() => {
   const checks = [
     { ok: !!filter.productDescription?.trim(), label: 'Kort beskrivning' },
     { ok: !!filter.whyChoose?.trim(), label: 'Varför välja er' },
     { ok: !!filter.keyPoints?.trim(), label: 'Konkreta punkter' },
     { ok: (filter.industries?.length || 0) > 0, label: 'Bransch' },
     { ok: (filter.geography?.length || 0) > 0, label: 'Geografi' },
     { ok: (filter.customerExamples?.length || 0) > 0, label: 'Case / kundexempel' },
     { ok: !!filter.contactName?.trim() && !!filter.contactEmail?.trim(), label: 'Kontaktperson' },
   ];
   const done = checks.filter(c => c.ok).length;
   const pct = Math.round((done / checks.length) * 100);
   const missing = checks.filter(c => !c.ok);
   const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
   return (
     <div className="rounded-lg border border-border bg-muted/30 p-3">
       <div className="flex items-center justify-between mb-2">
         <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kvalitetspoäng – {section.label}</span>
         <span className="text-sm font-bold">{pct}% komplett</span>
       </div>
       <div className="h-1.5 rounded-full bg-border overflow-hidden mb-2">
         <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
       </div>
       <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
         {checks.map(c => (
           <span key={c.label} className={c.ok ? 'text-emerald-700' : 'text-amber-700'}>
             {c.ok ? '✔' : '⚠'} {c.label}
           </span>
         ))}
       </div>
       {missing.length > 0 && (
         <p className="text-[11px] text-muted-foreground mt-2">
           Komplettera {missing.length} fält för att stärka hur ni publiceras på sajten och öka matchningen.
         </p>
       )}
     </div>
   );
 })()}
 {(() => {
   const currentStep = getProductStep(productKey);
   return (
     <>
       {/* Sub-steg per produkt */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
         {PRODUCT_STEP_LABELS.map((lbl, i) => {
           const n = i + 1;
           const active = currentStep === n;
           return (
             <button
               key={lbl}
               type="button"
               onClick={() => setStepFor(productKey, n)}
               className={`text-left px-3 py-2 rounded-lg border-2 transition-all ${
                 active
                   ? 'border-cta-orange bg-cta-orange/10'
                   : 'border-border hover:border-cta-orange/40 bg-card'
               }`}
             >
               <div className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-cta-orange' : 'text-muted-foreground'}`}>
                 Steg {n} av 4
               </div>
               <div className="text-xs font-medium mt-0.5 leading-tight">{lbl}</div>
             </button>
           );
         })}
       </div>

       {/* Steg 1 – Kort beskrivning */}
       {currentStep === 1 && (
         <div className="space-y-4">
           {/* Product Description */}
           <div>
             <Label className="text-sm">Vad gör ni inom denna lösning?</Label>
             <Input
               placeholder={descriptionPlaceholder}
               value={filter.productDescription || ''}
               onChange={(e) => updateProductFilter(productKey, { productDescription: e.target.value })}
               className="mt-2"
             />
             <p className="text-xs text-muted-foreground mt-1">
               Max 100 tecken. Fokusera på: typ av projekt, typ av kund och vad ni faktiskt levererar.
             </p>
           </div>

           {/* Landing page URL */}
           <div>
             <Label className="text-sm">Länk till sida om just denna lösning (valfritt)</Label>
             <Input
               type="url"
               placeholder="https://erforetag.se/business-central"
               value={filter.landingPageUrl || ''}
               onChange={(e) => updateProductFilter(productKey, { landingPageUrl: e.target.value })}
               className="mt-2"
             />
             <p className="text-xs text-muted-foreground mt-1">
               Används som "Läs mer"-länk på er partnerprofil. Exempel: en Business Central-sida, F&SCM-sida eller CRM-sida.
             </p>
           </div>
         </div>
       )}

        {/* Steg 1 fortsättning – Varför välja er + AI (samma steg som Om erbjudandet) */}
        {currentStep === 1 && (
         <div className="space-y-4">
           {/* Why choose us */}
           <div>
             <Label className="text-sm">
               Varför välja er för {section.label}? <span className="text-destructive">*</span>
             </Label>
             <Textarea
               placeholder={whyChoosePlaceholder}
               value={filter.whyChoose || ''}
               onChange={(e) => updateProductFilter(productKey, { whyChoose: e.target.value })}
               className="mt-2 min-h-[100px]"
               required
             />
             <p className="text-xs text-muted-foreground mt-1">Obligatoriskt. Visas högst upp på er produktflik på partnerprofilen.</p>
           </div>

           {/* Key differentiators */}
           <div>
             <Label className="text-sm">
               3–4 konkreta punkter om {section.label} <span className="text-destructive">*</span>
             </Label>
             <p className="text-xs text-muted-foreground mt-1 mb-2">
               En punkt per rad. Fokusera på er styrka, typ av projekt ni gör bäst, bransch/kundsegment och vad som skiljer er från andra partners.
             </p>
             <Textarea
               placeholder={keyPointsPlaceholder}
               value={filter.keyPoints || ''}
               onChange={(e) => updateProductFilter(productKey, { keyPoints: e.target.value })}
               className="mt-2 min-h-[100px]"
               required
             />
             <p className="text-xs text-muted-foreground mt-1">
               Undvik "vi erbjuder" och generell företagsbeskrivning. Visas som punktlista på er produktflik.
             </p>
            </div>

            {/* Leveransprofil per produktområde */}
            <div className="pt-4 border-t border-border">
              <DeliveryProfileEditor
                productLabel={section.label}
                value={filter.deliveryProfile}
                onChange={(next) => updateProductFilter(productKey, { deliveryProfile: next })}
              />
              <p className="text-xs text-muted-foreground mt-3">
                d365.se genererar därefter en neutral sammanfattning av er profil som visas på partnerprofilen.
              </p>
            </div>



            {/* Legacy per-product AI block – hidden in favour of partner-level AI profile */}
            {false && (
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-semibold">AI & AUTOMATION</Label>
             <p className="text-xs text-muted-foreground mt-1 mb-3">
               Denna information används för att visa er nivå inom AI och automatisering.<br />
               Markera det ni faktiskt levererat – inte vad ni planerar.
             </p>

             <div className="space-y-5">
               {getAiOptionsForProduct(productKey).map((tierGroup) => (
                 <div key={tierGroup.tierLabel}>
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-sm">{tierGroup.emoji}</span>
                     <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">{tierGroup.tierLabel}</span>
                     <span className="text-xs text-muted-foreground ml-auto">({tierGroup.pointsLabel})</span>
                   </div>
                   <div className="space-y-2">
                     {tierGroup.options.map((option) => (
                       <label
                         key={option.value}
                         className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                           filter.aiCapabilities.includes(option.value)
                             ? 'border-primary bg-primary/5'
                             : 'border-border hover:border-primary/40'
                         }`}
                       >
                         <Checkbox
                           checked={filter.aiCapabilities.includes(option.value)}
                           onCheckedChange={(checked) => {
                             const current = filter.aiCapabilities;
                             const updated = checked
                               ? [...current, option.value]
                               : current.filter(v => v !== option.value);
                             updateProductFilter(productKey, { aiCapabilities: updated });
                           }}
                           className="mt-0.5"
                         />
                         <div>
                           <span className="text-sm font-medium">{option.label}</span>
                           {option.description && (
                             <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                           )}
                         </div>
                       </label>
                     ))}
                     {tierGroup.emoji === "🟡" && (
                       <div className="mt-2">
                         <Input
                           placeholder="Annat – beskriv er egenutvecklade lösning"
                           value={filter.aiOtherPartner}
                           maxLength={200}
                           onChange={(e) => updateProductFilter(productKey, { aiOtherPartner: e.target.value })}
                           className="text-sm"
                         />
                       </div>
                     )}
                     {tierGroup.emoji === "🔴" && (
                       <div className="mt-2">
                         <Input
                           placeholder="Annat – beskriv er avancerade AI-lösning"
                           value={filter.aiOtherAdvanced}
                           maxLength={200}
                           onChange={(e) => updateProductFilter(productKey, { aiOtherAdvanced: e.target.value })}
                           className="text-sm"
                         />
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>

             {filter.aiCapabilities.length > 0 && (
               <div className="mt-4 ml-2 pl-4 border-l-2 border-primary/30 space-y-4">
                 {filter.aiCapabilities.includes("sales-std-segmentation") && (
                   <div className="p-3 rounded-lg border border-border bg-muted/30">
                     <Label className="text-sm font-medium">Hur genomförs kundsegmenteringen?</Label>
                     <div className="mt-2 space-y-2">
                       {[
                         { value: "ci-platform", label: "Använder Microsoft Customer Insights" },
                         { value: "azure-ai", label: "Byggd med Azure AI" },
                         { value: "external-data", label: "Integrerad med externa datakällor" },
                       ].map((opt) => (
                         <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                           <Checkbox
                             checked={filter.aiSegmentationDetails.includes(opt.value)}
                             onCheckedChange={(checked) => {
                               const current = filter.aiSegmentationDetails;
                               const updated = checked
                                 ? [...current, opt.value]
                                 : current.filter(v => v !== opt.value);
                               updateProductFilter(productKey, { aiSegmentationDetails: updated });
                             }}
                           />
                           <span className="text-sm">{opt.label}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                 )}

                 {filter.aiCapabilities.includes("svc-adv-predictive") && (
                   <div className="p-3 rounded-lg border border-border bg-muted/30">
                     <Label className="text-sm font-medium">Hur genomförs prediktivt underhåll?</Label>
                     <div className="mt-2 space-y-2">
                       {[
                         { value: "iot-integrated", label: "Integrerat med IoT" },
                         { value: "azure-ai-built", label: "Byggt med Azure AI" },
                         { value: "standard-function", label: "Byggt med standardfunktion" },
                       ].map((opt) => (
                         <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                           <Checkbox
                             checked={filter.aiPredictiveDetails.includes(opt.value)}
                             onCheckedChange={(checked) => {
                               const current = filter.aiPredictiveDetails;
                               const updated = checked
                                 ? [...current, opt.value]
                                 : current.filter(v => v !== opt.value);
                               updateProductFilter(productKey, { aiPredictiveDetails: updated });
                             }}
                           />
                           <span className="text-sm">{opt.label}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                 )}
                 <div>
                   <Label className="text-sm font-semibold">Antal AI-projekt</Label>
                   <p className="text-xs text-muted-foreground mt-1 mb-2">
                     Ange ungefärlig nivå senaste 24 månaderna.<br />
                     Används för att ge kunder en bild av er praktiska erfarenhet.
                   </p>
                   <div className="mt-2 flex flex-wrap gap-2">
                     {["0–2", "3–5", "6+"].map((option) => (
                       <button
                         key={option}
                         type="button"
                         onClick={() => updateProductFilter(productKey, { aiProjectCount: option })}
                         className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                           filter.aiProjectCount === option
                             ? 'border-primary bg-primary text-primary-foreground'
                             : 'border-border hover:border-primary/50'
                         }`}
                       >
                         {option}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <Label className="text-sm">Kort beskrivning av ett AI-case (max 200 tecken)</Label>
                   <Input
                     placeholder="T.ex. 'Implementerade Copilot för att automatisera offertförslag inom tillverkningsindustrin'"
                     value={filter.aiCaseDescription}
                     maxLength={200}
                     onChange={(e) => updateProductFilter(productKey, { aiCaseDescription: e.target.value })}
                     className="mt-2"
                   />
                   <p className="text-xs text-muted-foreground mt-1">
                     {filter.aiCaseDescription.length}/200 tecken
                   </p>
                 </div>

                 {filter.aiCapabilities.some(c => c.includes('-adv-') || c === 'ai-advanced') && (
                   <div className="p-3 rounded-lg border-2 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
                     <Label className="text-sm font-semibold flex items-center gap-1.5">
                       🔴 Kravfält för Avancerad AI
                     </Label>
                     <p className="text-xs text-muted-foreground mt-1 mb-2">
                       Beskriv kort vilken affärseffekt lösningen skapade
                     </p>
                     <Input
                       placeholder="T.ex. 'Minskade lagerkostnader med 18% genom prediktiv efterfrågemodell för 12 produktionslinjer'"
                       value={filter.aiBusinessImpact}
                       maxLength={200}
                       onChange={(e) => updateProductFilter(productKey, { aiBusinessImpact: e.target.value })}
                     />
                     <p className="text-xs text-muted-foreground mt-1">
                       {filter.aiBusinessImpact.length}/200 tecken
                     </p>
                   </div>
                 )}
               </div>
             )}
            </div>
            )}
         </div>
       )}

        {/* Steg 2 – Målgrupp */}
        {currentStep === 2 && (
         <div className="space-y-4">
           {/* Industries */}
           <div>
             <div className="flex items-center justify-between mb-2">
               <Label className="text-sm">Branschfokus</Label>
               <span className={`text-xs font-medium px-2 py-0.5 rounded ${filter.industries.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                 {filter.industries.length}/3
               </span>
             </div>
             <div className="flex flex-wrap gap-1.5">
               {INDUSTRY_OPTIONS.map((ind) => (
                 <Badge
                   key={ind}
                   variant={filter.industries.includes(ind) ? "default" : "outline"}
                   className="cursor-pointer text-xs"
                   onClick={() => toggleProductIndustry(productKey, ind)}
                 >
                   {ind}
                 </Badge>
               ))}
             </div>
             <p className="text-xs text-muted-foreground mt-2">Välj max 3 branscher ni fokuserar på för denna produkt</p>
           </div>

           {/* Geography */}
           <div>
             <Label className="text-sm">Välj var ni levererar projekt</Label>
             <p className="text-xs text-muted-foreground mb-2">Markera endast där ni faktiskt levererar projekt.</p>
             <div className="flex flex-wrap gap-1.5">
               {GEOGRAPHY_OPTIONS.map((geo) => {
                 const isSelected = (filter.geography || []).includes(geo);
                 return (
                   <Badge
                     key={geo}
                     variant={isSelected ? "default" : "outline"}
                     className="cursor-pointer text-xs"
                     onClick={() => {
                       const current = filter.geography || [];
                       const newGeo = isSelected
                         ? getFilteredGeography(geo, current)
                         : getCascadingGeography(geo, current);
                       updateProductFilter(productKey, { geography: newGeo });
                     }}
                   >
                     {geo}
                   </Badge>
                 );
               })}
             </div>
           </div>

           {/* Målgrupp – kundens storlek */}
           <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
             <div>
               <Label className="text-sm font-semibold">Välj de kundsegment ni oftast arbetar med</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Inom respektive produktområde. Max 3 val per kategori, och valen måste ligga i rad
                  efter varandra (ett sammanhängande intervall). Detta används för matchning:
                </p>
                <div className="mt-2 rounded-md bg-background/70 border border-border/60 p-2 text-xs text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">Ju mer träffsäkert → desto bättre synlighet.</span>
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Tips:</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Markera endast där ni har tydlig erfarenhet</li>
                    <li>Välj ett sammanhängande spann, t.ex. 50–99, 100–249 och 250–999</li>
                    <li>Hoppa inte över steg i skalan – valen måste sitta ihop</li>
                    <li>Lämna tomt om ni arbetar brett</li>
                  </ul>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Antal anställda</Label>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${(filter.companySize?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {filter.companySize?.length || 0}/3
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {companySizes.map((size) => {
                    const current = filter.companySize || [];
                    const isSelected = current.includes(size);
                    const blocked = !isSelected && "error" in toggleContiguousRange(companySizes, current, size);
                    return (
                      <Badge
                        key={size}
                        variant={isSelected ? "default" : "outline"}
                        className={`text-xs ${blocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => {
                          const result = toggleContiguousRange(companySizes, current, size);
                          if ("error" in result) {
                            toast.error(result.error);
                            return;
                          }
                          updateProductFilter(productKey, { companySize: result.next });
                        }}
                      >
                        {size}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Max 3 val i rad efter varandra. Inget val = ni matchar kunder av alla storlekar.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Omsättning (MSEK)</Label>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${(filter.revenue?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {filter.revenue?.length || 0}/3
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {revenueOptions.map((rev) => {
                    const current = filter.revenue || [];
                    const isSelected = current.includes(rev);
                    const blocked = !isSelected && "error" in toggleContiguousRange(revenueOptions, current, rev);
                    return (
                      <Badge
                        key={rev}
                        variant={isSelected ? "default" : "outline"}
                        className={`text-xs ${blocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => {
                          const result = toggleContiguousRange(revenueOptions, current, rev);
                          if ("error" in result) {
                            toast.error(result.error);
                            return;
                          }
                          updateProductFilter(productKey, { revenue: result.next });
                        }}
                      >
                        {rev}
                      </Badge>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Max 3 val i rad efter varandra. Inget val = ni matchar kunder oavsett omsättning.
                </p>
              </div>
           </div>
         </div>
       )}

        {/* Steg 3 – Bevis */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Customer Examples */}
            <div>
              <Label className="text-sm">Ange kunder ni har arbetat med inom denna lösning</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Max 5–8 exempel räcker. Kända namn ökar förtroendet.
              </p>
              <Input
                placeholder="Volvo, IKEA, Scania..."
                value={(filter.customerExamples || []).join(', ')}
                onChange={(e) => {
                  const raw = e.target.value;
                  const examples = raw.split(',').map(s => s.trim());
                  updateProductFilter(productKey, { customerExamples: examples });
                }}
                onBlur={() => {
                  const cleaned = (filter.customerExamples || []).filter(s => s.length > 0);
                  updateProductFilter(productKey, { customerExamples: cleaned });
                }}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Om fältet lämnas tomt visas: "Kundexempel kan ges på förfrågan".
              </p>
            </div>

            {/* Customer Case Links */}
            <div>
              <Label className="text-sm">Länk till kundcase (vill ni stoltsera med kundcase, får ni gärna lägga in länken till dessa nedan)</Label>
              <Input
                placeholder="https://partner.se/kundcase1, https://partner.se/kundcase2"
                value={(filter.customerCaseLinks || []).join(', ')}
                onChange={(e) => {
                  const raw = e.target.value;
                  const links = raw.split(',').map(s => s.trim());
                  updateProductFilter(productKey, { customerCaseLinks: links });
                }}
                onBlur={() => {
                  const cleaned = (filter.customerCaseLinks || []).filter(s => s.length > 0);
                  updateProductFilter(productKey, { customerCaseLinks: cleaned });
                }}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Separera flera länkar med komma</p>
            </div>
          </div>
        )}

        {/* Steg 4 – Kontakt */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* Säljkontakt */}
            <div className="rounded-lg border border-border p-3 space-y-3">
              <Label className="text-sm font-semibold">Säljkontakt för {section.label}</Label>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Namn</Label>
                  <Input
                    placeholder="Anna Svensson"
                    value={filter.contactName || ''}
                    onChange={(e) => updateProductFilter(productKey, { contactName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">E-post</Label>
                  <Input
                    type="email"
                    placeholder="anna@foretag.se"
                    value={filter.contactEmail || ''}
                    onChange={(e) => updateProductFilter(productKey, { contactEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Telefon</Label>
                  <Input
                    placeholder="070-123 45 67"
                    value={filter.contactPhone || ''}
                    onChange={(e) => updateProductFilter(productKey, { contactPhone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                {filter.contactPhotoUrl ? (
                  <img
                    src={filter.contactPhotoUrl}
                    alt="Säljkontakt foto"
                    className="h-14 w-14 object-cover rounded border-2 border-border "
                  />
                ) : (
                  <div className="h-14 w-14 rounded bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Foto på säljkontakten (visas på partnerprofilen)</Label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      id={`contact-photo-${productKey}`}
                      className="hidden"
                      onChange={(e) => handleProductContactPhotoUpload(productKey, e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingProductPhoto === productKey}
                      onClick={() => document.getElementById(`contact-photo-${productKey}`)?.click()}
                    >
                      <Upload className={`mr-2 h-4 w-4 ${uploadingProductPhoto === productKey ? "animate-spin" : ""}`} />
                      {uploadingProductPhoto === productKey
                        ? "Laddar upp..."
                        : (filter.contactPhotoUrl ? "Byt foto" : "Ladda upp foto")}
                    </Button>
                    {filter.contactPhotoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateProductFilter(productKey, { contactPhotoUrl: '' })}
                      >
                        Ta bort
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* Nav */}
       <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
         <Button
           type="button"
           variant="ghost"
           size="sm"
           disabled={currentStep === 1}
           onClick={() => setStepFor(productKey, currentStep - 1)}
         >
           <ChevronLeft className="mr-1 h-4 w-4" /> Föregående
         </Button>
         <span className="text-xs text-muted-foreground">Steg {currentStep} av 4 – {PRODUCT_STEP_LABELS[currentStep - 1]}</span>
         <Button
           type="button"
           size="sm"
           disabled={currentStep === 4}
           onClick={() => setStepFor(productKey, currentStep + 1)}
         >
           Nästa <ChevronRight className="ml-1 h-4 w-4" />
         </Button>
       </div>
     </>
   );
 })()}
 </CardContent>
 </Card>
 );
 })}
 </div>
 </PremiumCollapsibleSection>

 {/* AI, Copilot & Automation – partner-level */}
 <PremiumCollapsibleSection
   title="AI, Copilot & Automation"
   description="En gemensam AI-profil för hela ert företag – ersätter den gamla per-produkt-modellen."
   icon={Sparkles}
   accent="crm"
    status={(aiProfile.capabilities || []).length > 0 ? "complete" : "empty"}
    open={openSections.ai}
    onOpenChange={() => toggleSection("ai")}

 >
   <AiProfileSection value={aiProfile} onChange={setAiProfile} />
 </PremiumCollapsibleSection>


 {/* Products Section */}

 {/* Specialty Products */}
 <PremiumCollapsibleSection
 title="Övriga produkter"
 description="Specialty-produkter (alla branscher är tillämpliga här)"
 icon={Package}
 accent="finance-supply"
 status={selectedSpecialtyProducts.length === 0 ? "empty" : "complete"}
 open={openSections.specialty}
 onOpenChange={() => toggleSection("specialty")}
 badge={selectedSpecialtyProducts.length > 0 ? <Badge variant="outline">{selectedSpecialtyProducts.length} valda</Badge> : undefined}
 >
 <div className="pt-1">
 <div className="flex flex-wrap gap-3">
 {specialtyProducts.map((product) => {
 const isSelected = selectedSpecialtyProducts.includes(product);
 const icon = specialtyProductIcons[product];
 return (
 <button
 key={product}
 type="button"
 onClick={() => {
 setSelectedSpecialtyProducts(prev =>
 isSelected
 ? prev.filter(p => p !== product)
 : [...prev, product]
 );
 }}
 className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
 isSelected
 ? 'bg-primary text-primary-foreground border-primary '
 : 'bg-card border-border hover:border-primary/50'
 }`}
 >
 {icon && (
 <img 
 src={icon} 
 alt={product} 
 className={`h-6 w-6 object-contain ${isSelected ? 'brightness-0 invert' : ''}`} 
 />
 )}
 Dynamics 365 {product}
 </button>
 );
 })}
 </div>
 </div>
 </PremiumCollapsibleSection>

 {/* Industry Pitches Section */}
 {activeProducts.length > 0 && (() => {
 const productsPerIndustry: Record<string, string[]> = {};
 const industriesSet = new Set<string>();
 activeProducts.forEach((key) => {
 const section = productSections.find((s) => s.key === key);
 if (!section) return;
 const inds = productFilters[key]?.industries || [];
 inds.forEach((ind) => {
 industriesSet.add(ind);
 if (!productsPerIndustry[ind]) productsPerIndustry[ind] = [];
 if (!productsPerIndustry[ind].includes(section.label)) {
 productsPerIndustry[ind].push(section.label);
 }
 });
 });
 const industriesList = Array.from(industriesSet);
 if (industriesList.length === 0) return null;
 const pitchCount = industryPitches.filter((p) => p.text?.trim()).length;
 return (
 <PremiumCollapsibleSection
 title="Branschpitchar"
 description="Korta, branschspecifika texter som visas på branschsidorna och på er partnerprofil."
 icon={Sparkles}
 accent="primary"
 status={pitchCount === 0 ? "empty" : (pitchCount >= industriesList.length ? "complete" : "partial")}
 open={openSections.pitches}
 onOpenChange={() => toggleSection("pitches")}
 badge={pitchCount > 0 ? <Badge variant="outline">{pitchCount} pitchar</Badge> : undefined}
 >
 <PartnerIndustryPitchesEditor
 industries={industriesList}
 productsPerIndustry={productsPerIndustry}
 value={industryPitches}
 onChange={setIndustryPitches}
 invitationToken={token || null}
 />
 </PremiumCollapsibleSection>
 );
 })()}

 {/* Industry Apps Section */}
 {activeProducts.length > 0 && (
 <PremiumCollapsibleSection
 title="Branschapplikationer (Microsoft Marketplace)"
 description="Era certifierade branschspecifika tillägg från Microsoft Marketplace."
 icon={ExternalLink}
 accent="business-central"
 status={industryApps.some((a) => a.name?.trim() && a.url?.trim()) ? "complete" : "empty"}
 open={openSections.industryApps}
 onOpenChange={() => toggleSection("industryApps")}
 badge={industryApps.filter((a) => a.name?.trim()).length > 0 ? <Badge variant="outline">{industryApps.filter((a) => a.name?.trim()).length} appar</Badge> : undefined}
 >
 <div className="space-y-4">
 {industryApps.map((app, index) => (
 <div key={index} className="relative p-4 rounded-lg border border-border bg-muted/30 space-y-3">
 <button
 type="button"
 onClick={() => setIndustryApps(prev => prev.filter((_, i) => i !== index))}
 className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-xs">Appnamn *</Label>
 <Input
 placeholder="Appnamn"
 value={app.name}
 onChange={(e) => {
 const updated = [...industryApps];
 updated[index] = { ...updated[index], name: e.target.value };
 setIndustryApps(updated);
 }}
 />
 </div>
 <div className="space-y-1">
 <Label className="text-xs">Marketplace-länk *</Label>
 <Input
 type="url"
 placeholder="https://appsource.microsoft.com/..."
 value={app.url}
 onChange={(e) => {
 const updated = [...industryApps];
 updated[index] = { ...updated[index], url: e.target.value };
 setIndustryApps(updated);
 }}
 />
 </div>
 </div>
 
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-xs">Dynamics 365-applikation</Label>
 <select
 className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
 value={app.application}
 onChange={(e) => {
 const updated = [...industryApps];
 updated[index] = { ...updated[index], application: e.target.value };
 setIndustryApps(updated);
 }}
 >
 <option value="">Välj applikation...</option>
 <option value="Business Central">Business Central</option>
 <option value="Finance">Finance</option>
 <option value="Supply Chain Management">Supply Chain Management</option>
 <option value="Sales">Sales</option>
 <option value="Customer Insights (Marketing)">Customer Insights (Marketing)</option>
 <option value="Customer Service">Customer Service</option>
 <option value="Field Service">Field Service</option>
 </select>
 </div>
 <div className="space-y-1">
 <Label className="text-xs">Branschinriktning</Label>
 <select
 className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
 value={app.industry}
 onChange={(e) => {
 const updated = [...industryApps];
 updated[index] = { ...updated[index], industry: e.target.value };
 setIndustryApps(updated);
 }}
 >
 <option value="">Välj bransch...</option>
 {INDUSTRY_OPTIONS.map(ind => (
 <option key={ind} value={ind}>{ind}</option>
 ))}
 </select>
 </div>
 </div>
 
 <div className="space-y-1">
 <Label className="text-xs">Kort beskrivning</Label>
 <Input
 placeholder="Vad tillför appen? T.ex. 'Automatiserar fakturamottagning och matchning'"
 value={app.description}
 onChange={(e) => {
 const updated = [...industryApps];
 updated[index] = { ...updated[index], description: e.target.value };
 setIndustryApps(updated);
 }}
 />
 </div>
 </div>
 ))}
 
 <Button
 type="button"
 variant="outline"
 onClick={() => setIndustryApps(prev => [...prev, { name: '', url: '', application: '', industry: '', description: '' }])}
 className="w-full"
 >
 <Plus className="w-4 h-4 mr-2" />
 Lägg till branschapplikation
 </Button>
 
 {industryApps.length === 0 && (
 <p className="text-sm text-muted-foreground text-center py-2">
 Inga branschappar tillagda ännu. Klicka ovan för att lägga till era certifierade Marketplace-tillägg.
 </p>
 )}
 </div>
 </PremiumCollapsibleSection>
 )}

 {/* Events Section - only for existing partners */}
 {invitation?.partner_id && (
 <PremiumCollapsibleSection
 title="Kommande events"
 description="Webinarier, workshops eller demos – granskas av admin innan publicering."
 icon={CalendarDays}
 accent="agents"
 status={partnerEvents.length === 0 ? "empty" : "complete"}
 open={openSections.events}
 onOpenChange={() => toggleSection("events")}
 badge={partnerEvents.length > 0 ? <Badge variant="outline">{partnerEvents.length} events</Badge> : undefined}
 >
 <div className="space-y-4">
 {loadingEvents ? (
 <div className="flex items-center justify-center py-4">
 <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
 <span className="ml-2 text-sm text-muted-foreground">Laddar events...</span>
 </div>
 ) : (
 <>
 {/* Existing events */}
 {partnerEvents.length > 0 && (
 <div className="space-y-3">
 {partnerEvents.map((event) => (
 <div key={event.id} className="relative p-4 rounded-lg border border-border bg-muted/30">
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <h4 className="font-semibold text-foreground truncate">{event.title}</h4>
 <Badge variant={
 event.status === "approved" ? "default" :
 event.status === "rejected" ? "destructive" : "secondary"
 } className="text-xs shrink-0">
 {event.status === "approved" ? "Godkänd" :
 event.status === "rejected" ? "Avvisad" : "Väntar"}
 </Badge>
 </div>
 <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
 <span className="flex items-center gap-1">
 <CalendarDays className="w-3.5 h-3.5" />
 {new Date(event.event_date).toLocaleDateString("sv-SE")}
 </span>
 {event.event_time && (
 <span className="flex items-center gap-1">
 <Clock className="w-3.5 h-3.5" />
 {event.event_time?.slice(0, 5)}
 {event.end_time && `–${event.end_time.slice(0, 5)}`}
 </span>
 )}
 {event.is_online ? (
 <span className="flex items-center gap-1">
 <Globe className="w-3.5 h-3.5" />Online
 </span>
 ) : event.location ? (
 <span className="flex items-center gap-1">
 <MapPin className="w-3.5 h-3.5" />{event.location}
 </span>
 ) : null}
 </div>
 </div>
 <button
 type="button"
 onClick={() => handleDeleteEvent(event.id!)}
 className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Add new event form */}
 {showAddEvent ? (
 <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-4">
 <h4 className="font-semibold text-foreground">Nytt event</h4>
 
 <div className="space-y-2">
 <Label className="text-sm">Titel *</Label>
 <Input
 placeholder="T.ex. 'Webinar: AI i Business Central'"
 value={newEvent.title}
 onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
 />
 </div>

 <div className="grid sm:grid-cols-3 gap-3">
 <div className="space-y-2">
 <Label className="text-sm">Datum *</Label>
 <Input
 type="date"
 value={newEvent.event_date}
 onChange={(e) => setNewEvent(prev => ({ ...prev, event_date: e.target.value }))}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Starttid</Label>
 <Input
 type="time"
 value={newEvent.event_time}
 onChange={(e) => setNewEvent(prev => ({ ...prev, event_time: e.target.value }))}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Sluttid</Label>
 <Input
 type="time"
 value={newEvent.end_time}
 onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
 />
 </div>
 </div>

 <div className="space-y-2">
 <Label className="text-sm">Beskrivning</Label>
 <Textarea
 rows={4}
 placeholder="Kort beskrivning av eventet..."
 value={newEvent.description}
 onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
 />
 </div>

 <div className="flex items-center gap-4">
 <label className="flex items-center gap-2 cursor-pointer">
 <Checkbox
 checked={newEvent.is_online}
 onCheckedChange={(checked) => setNewEvent(prev => ({ ...prev, is_online: !!checked }))}
 />
 <span className="text-sm">Online-event</span>
 </label>
 </div>

 {!newEvent.is_online && (
 <div className="space-y-2">
 <Label className="text-sm">Plats</Label>
 <Input
 placeholder="T.ex. Stockholm, Göteborg..."
 value={newEvent.location}
 onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
 />
 </div>
 )}

 <div className="grid sm:grid-cols-2 gap-3">
 <div className="space-y-2">
 <Label className="text-sm">Eventlänk</Label>
 <Input
 type="url"
 placeholder="https://..."
 value={newEvent.event_link}
 onChange={(e) => setNewEvent(prev => ({ ...prev, event_link: e.target.value }))}
 />
 </div>
 <div className="space-y-2">
 <Label className="text-sm">Registreringslänk</Label>
 <Input
 type="url"
 placeholder="https://..."
 value={newEvent.registration_link}
 onChange={(e) => setNewEvent(prev => ({ ...prev, registration_link: e.target.value }))}
 />
 </div>
 </div>

 <div className="flex gap-2 justify-end">
 <Button
 type="button"
 variant="outline"
 onClick={() => { setShowAddEvent(false); setNewEvent({ ...emptyEvent }); }}
 >
 Avbryt
 </Button>
 <Button
 type="button"
 disabled={savingEvent === "new" || !newEvent.title.trim() || !newEvent.event_date}
 onClick={() => handleSaveEvent(newEvent)}
 >
 {savingEvent === "new" ? (
 <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sparar...</>
 ) : (
 "Skapa ett event"
 )}
 </Button>
 </div>
 </div>
 ) : (
 <Button
 type="button"
 variant="outline"
 onClick={() => setShowAddEvent(true)}
 className="w-full"
 >
 <Plus className="w-4 h-4 mr-2" />
 Lägg till event
 </Button>
 )}

 {partnerEvents.length === 0 && !showAddEvent && (
 <p className="text-sm text-muted-foreground text-center py-2">
 Inga events tillagda ännu. Lägg till webinarier, demos eller workshops för att synas på D365.se.
 </p>
 )}
 </>
 )}
 </div>
 </PremiumCollapsibleSection>
 )}

 {/* Decision profile */}
 <PremiumCollapsibleSection
 title="Beslutsprofil"
 description="Hjälper köparen välja mellan partners. Visas högt upp på er profil."
 icon={Target}
 accent="primary"
 status={
   (() => {
     const apps = [
       ...activeProducts.flatMap((k) => productSections.find((s) => s.key === k)?.apps || []),
       ...selectedSpecialtyProducts,
     ];
     const filledPositioning = apps.filter((a) => productProfiles[a]?.positioning?.trim()).length;
      const anyDelivery = apps.some((a) => {
        const pp = productProfiles[a];
        return pp && (pp.methodology.trim() || pp.weeks_min.trim() || pp.weeks_max.trim() || pp.cost_band);
      });
      if (apps.length > 0 && filledPositioning === apps.length && notAFitInput.trim() && anyDelivery) return "complete";
      if (filledPositioning > 0 || notAFitInput.trim() || anyDelivery) return "partial";
      return "empty";
   })()
 }
 open={openSections.decision}
 onOpenChange={() => toggleSection("decision")}
 >
 <div className="space-y-6">
   {/* Partner-nivå: teamstorlek + implementationer per applikation */}
   <div className="grid sm:grid-cols-2 gap-4">
   <div>
     <Label htmlFor="team_size_sweden">Lokal teamstorlek (Sverige) – D365</Label>
     <select
       id="team_size_sweden"
       className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
       value={teamSizeSweden}
       onChange={(e) => setTeamSizeSweden(e.target.value)}
     >
       <option value="">Välj intervall…</option>
       <option value="1–10">1–10</option>
       <option value="11–25">11–25</option>
       <option value="26–50">26–50</option>
       <option value="50+">50+</option>
     </select>
   </div>

   {(() => {
     const apps = [
       ...activeProducts.flatMap((k) => productSections.find((s) => s.key === k)?.apps || []),
       ...selectedSpecialtyProducts,
     ];
     if (apps.length === 0) {
       return (
         <div className="rounded-md border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
           <Label className="text-sm text-foreground">Genomförda implementationer per applikation</Label>
           <p className="mt-1">Välj produkter ovan för att kunna ange antal implementationer per applikation.</p>
         </div>
       );
     }
     return (
       <div className="space-y-2">
         <Label>Genomförda implementationer per applikation</Label>
         <p className="text-[11px] text-muted-foreground -mt-1">
           Antal totalt per Dynamics 365-applikation. Visas i beslutsprofilen så att köparen ser volym där det är relevant.
         </p>
         <div className="grid sm:grid-cols-2 gap-2">
           {apps.map((app) => (
             <div key={app} className="flex items-center gap-2">
               <span className="text-sm flex-1 truncate" title={app}>{app}</span>
               <select
                 className="flex h-9 w-32 rounded-md border border-input bg-background px-2 py-1 text-sm"
                 value={implementationsPerApp[app] || ""}
                 onChange={(e) =>
                   setImplementationsPerApp((prev) => {
                     const next = { ...prev };
                     if (e.target.value) next[app] = e.target.value;
                     else delete next[app];
                     return next;
                   })
                 }
               >
                 <option value="">Välj…</option>
                 <option value="<10">&lt;10</option>
                 <option value="10–25">10–25</option>
                 <option value="25–100">25–100</option>
                 <option value="100+">100+</option>
               </select>
             </div>
           ))}
         </div>
       </div>
     );
   })()}
 </div>

   {/* Per-produkt beslutsprofil */}
   {(() => {
     const apps = [
       ...activeProducts.flatMap((k) => productSections.find((s) => s.key === k)?.apps || []),
       ...selectedSpecialtyProducts,
     ];
     if (apps.length === 0) {
       return (
         <div className="border-t border-border pt-4">
           <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
             Välj minst en Dynamics 365-produkt ovan för att fylla i positionering och leveransbild per produkt.
           </div>
         </div>
       );
     }
     return (
       <div className="border-t border-border pt-4 space-y-4">
         <div>
           <h4 className="font-semibold text-sm flex items-center gap-2">
             <Target className="w-4 h-4 text-[hsl(var(--cta-orange))]" /> Positionering & leveransbild – per Dynamics 365-produkt
           </h4>
           <p className="text-xs text-muted-foreground mt-1">
             Köpare ser olika beslutsprofiler beroende på vilken produkt de tittar på. Fyll i en kort positionering och er typiska leveransbild för varje aktiv produkt.
           </p>
         </div>
         {apps.map((app) => {
           const pp = productProfiles[app] || EMPTY_PRODUCT_PROFILE;
           return (
             <div key={app} className="rounded-lg border border-border bg-card p-4 space-y-4">
               <div className="flex items-center gap-2">
                 <Package className="w-4 h-4 text-muted-foreground" />
                 <h5 className="font-semibold text-sm">{app}</h5>
               </div>

               <div>
                 <Label htmlFor={`pp_pos_${app}`} className="text-xs">Positionering – en mening</Label>
                 <p className="text-[11px] text-muted-foreground mb-1">
                   Börja gärna med "Vi är valet när …". Konkret om bransch, storlek eller utmaning för {app}.
                 </p>
                 <Textarea
                   id={`pp_pos_${app}`}
                   rows={2}
                   maxLength={240}
                   placeholder={`Vi är valet när medelstora bolag i Sverige ska implementera ${app}.`}
                   value={pp.positioning}
                   onChange={(e) => updateProductProfile(app, { positioning: e.target.value })}
                 />
                 <div className="text-[11px] text-muted-foreground mt-1">{pp.positioning.length}/240</div>
               </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`pp_met_${app}`} className="text-xs">Projektmetodik</Label>
                    <Input
                      id={`pp_met_${app}`}
                      placeholder="t.ex. Sure Step, egen agil metod"
                      value={pp.methodology}
                      onChange={(e) => updateProductProfile(app, { methodology: e.target.value })}
                    />
                  </div>
                 <div>
                   <Label htmlFor={`pp_wmin_${app}`} className="text-xs">Typisk projektlängd – min (veckor)</Label>
                   <Input
                     id={`pp_wmin_${app}`}
                     type="number"
                     min={0}
                     placeholder="t.ex. 12"
                     value={pp.weeks_min}
                     onChange={(e) => updateProductProfile(app, { weeks_min: e.target.value })}
                   />
                 </div>
                 <div>
                   <Label htmlFor={`pp_wmax_${app}`} className="text-xs">Typisk projektlängd – max (veckor)</Label>
                   <Input
                     id={`pp_wmax_${app}`}
                     type="number"
                     min={0}
                     placeholder="t.ex. 26"
                     value={pp.weeks_max}
                     onChange={(e) => updateProductProfile(app, { weeks_max: e.target.value })}
                   />
                 </div>
                 <div className="sm:col-span-2">
                   <Label htmlFor={`pp_cost_${app}`} className="text-xs">Typisk total projektkostnad (kostnadsband, exkl. licenser)</Label>
                   <select
                     id={`pp_cost_${app}`}
                     className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                     value={pp.cost_band}
                     onChange={(e) => updateProductProfile(app, { cost_band: e.target.value })}
                   >
                     <option value="">— Välj kostnadsband —</option>
                     <option value="<250k">Mindre än 250 000 kr</option>
                     <option value="250k–500k">250 000 – 500 000 kr</option>
                     <option value="500k–1M">500 000 kr – 1 MSEK</option>
                     <option value="1M–2.5M">1 – 2,5 MSEK</option>
                     <option value="2.5M–5M">2,5 – 5 MSEK</option>
                     <option value="5M–10M">5 – 10 MSEK</option>
                     <option value=">10M">Över 10 MSEK</option>
                   </select>
                 </div>
               </div>
             </div>
           );
         })}
       </div>
     );
   })()}


    <div className="border-t border-border pt-4">
      <div className="rounded-lg border border-amber-300/60 bg-amber-50 dark:bg-amber-950/20 p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong className="font-semibold">Detta är en av era starkaste konkurrensfördelar.</strong>{" "}
            Nästan ingen annan partnerkatalog vågar visa när en leverantör <em>inte</em> är rätt val.
            Att ni själva sätter orden bygger trovärdighet hos köparen och filtrerar bort fel leads.
            Texten AI-genereras <strong>aldrig</strong> – den kommer bara från er.
          </div>
        </div>
      </div>
      <Label htmlFor="not_a_fit" className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        När passar ni <em>mindre bra</em>? (en punkt per rad)
      </Label>
      <p className="text-xs text-muted-foreground mb-2">
        Obligatoriskt. Var konkret om storlek, bransch, teknik eller projekttyp där andra passar bättre.
      </p>
      <Textarea
        id="not_a_fit"
        rows={4}
        placeholder={"Under 20 användare\nRen molnmigrering utan verksamhetsförändring\nOffentlig sektor\nRena Power Platform-projekt utan ERP-koppling"}
        value={notAFitInput}
        onChange={(e) => setNotAFitInput(e.target.value)}
      />
      <p className="text-[11px] text-muted-foreground mt-1.5">
        Tips: 3–5 punkter räcker. Skriv i er egen ton – köparen märker skillnaden.
      </p>
    </div>

 </div>
 </PremiumCollapsibleSection>

 {/* Notes */}
 <PremiumCollapsibleSection
 title="Övriga kommentarer"
 description="Något mer ni vill meddela oss?"
 icon={MessageSquare}
 accent="primary"
 status={formData.notes?.trim() ? "complete" : "empty"}
 open={openSections.notes}
 onOpenChange={() => toggleSection("notes")}
 >
 <Textarea
 id="notes"
 name="notes"
 rows={6}
 placeholder="Skriv eventuella kommentarer här..."
 value={formData.notes}
 onChange={handleInputChange}
 />
 </PremiumCollapsibleSection>

 {/* Submit */}
 <div className="flex justify-end gap-4">
 <Button type="submit" disabled={submitting || (activeProducts.length === 0 && selectedSpecialtyProducts.length === 0)} size="lg">
 {submitting ? (
 <>
 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
 Sparar...
 </>
 ) : (
 "Spara och Uppdatera"
 )}
 </Button>
 </div>
 </form>
 </div>
 </div>
 
 <Footer />
 </div>
 );
};

export default PartnerUpdate;
