import { useState, useEffect, useRef, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { allIndustries, geographyOptions, getCumulativeGeographyDisplay, companySizes, revenueOptions } from "@/data/partners";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  generateSlug,
  DatabasePartner,
  PartnerInput,
  ProductFilters,
  ProductFilterInput,
} from "@/hooks/usePartners";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

// Product icons
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import CommerceIcon from "@/assets/icons/Commerce.svg";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg";
import { getAiOptionsForProduct } from "@/utils/aiScoring";

// Icons for specialty products
const specialtyProductIcons: Record<string, string> = {
  "Project Operations": ProjectOperationsIcon,
  "Commerce": CommerceIcon,
  "Human Resources": HumanResourcesIcon,
};

import {
  Eye, Send, Trash2, RefreshCw, LogOut, BarChart3, MousePointerClick,
  Users, Building2, Plus, Pencil, Upload, Lock, TrendingUp, Calendar, Inbox, Globe,
  ImageIcon, User, Phone, Mail, Link, FileText, CalendarCheck, CalendarX, AlertCircle,
  CheckCircle2, Circle, ArrowRight, MailPlus, CalendarDays, Download, ArrowUpDown, Clock, Award, ChevronDown,
  MailCheck, ScrollText, Megaphone, LineChart, Gauge, LayoutDashboard, FileSignature, Sparkles
} from "lucide-react";
import PartnerInvitationsTab from "@/components/PartnerInvitationsTab";
import { PremiumCollapsibleSection } from "@/components/admin/PremiumCollapsibleSection";
import PartnerIndustryPitchesEditor, { type IndustryPitch } from "@/components/PartnerIndustryPitchesEditor";
import PartnerIndustryPitchPreview from "@/components/PartnerIndustryPitchPreview";
import { assertPitchLabelsConsistency } from "@/data/pitchProductMapping";
import AdminAgreementTab from "@/components/AdminAgreementTab";
import AdminPartnerStatsTab from "@/components/AdminPartnerStatsTab";
import AdminPartnerAgreementTab from "@/components/AdminPartnerAgreementTab";
import AdminEventsTab from "@/components/AdminEventsTab";
import AdminVisitorStatsTab from "@/components/AdminVisitorStatsTab";
import AdminAllVisitorsTab from "@/components/AdminAllVisitorsTab";
import AdminFunnelTab from "@/components/AdminFunnelTab";
import AdminSalesOverview from "@/components/AdminSalesOverview";
import AdminSalesPitchTab from "@/components/AdminSalesPitchTab";
import AdminSalesPitchV2Tab from "@/components/AdminSalesPitchV2Tab";
import AdminSalesKpiTab from "@/components/AdminSalesKpiTab";
import AdminStatsSummary from "@/components/AdminStatsSummary";
import AdminEmailLogTab from "@/components/AdminEmailLogTab";
import AdminFeaturedArticleTab from "@/components/AdminFeaturedArticleTab";
import AdminKnowledgeArticlesTab from "@/components/AdminKnowledgeArticlesTab";
import AdminIndustryPagesTab from "@/components/AdminIndustryPagesTab";
import AdminSeoRankingsTab from "@/components/AdminSeoRankingsTab";
import AdminSemrushTab from "@/components/AdminSemrushTab";
import AdminCompetitorTab from "@/components/AdminCompetitorTab";
import AdminGscTab from "@/components/AdminGscTab";
import AdminPartnerDashboardTab from "@/components/AdminPartnerDashboardTab";
import AdminPartnerReportsTab from "@/components/AdminPartnerReportsTab";
import PartnerViewStatsCard from "@/components/PartnerViewStatsCard";
import SiteTrafficStatsCard from "@/components/SiteTrafficStatsCard";
import { SwedishDatePicker } from "@/components/ui/swedish-date-picker";
import { z } from "zod";
import { getPublicBaseUrl } from "@/lib/publicUrl";
import SEOHead from "@/components/SEOHead";

// ==================== VALIDATION SCHEMA ====================

const partnerValidationSchema = z.object({
  name: z.string().trim().min(1, "Namn är obligatoriskt").max(100, "Namn får max vara 100 tecken"),
  website: z.string().trim().min(1, "Hemsida är obligatoriskt").url("Ange en giltig URL (t.ex. https://example.com)"),
  slug: z.string().optional(),
  description: z.string().max(2000, "Beskrivning får max vara 2000 tecken").optional(),
  logo_url: z.string().url("Ange en giltig URL för logotypen").optional().or(z.literal("")),
  email: z.string().email("Ange en giltig e-postadress").optional().or(z.literal("")),
  contactPerson: z.string().max(100, "Kontaktperson får max vara 100 tecken").optional(),
  phone: z.string().max(30, "Telefonnummer får max vara 30 tecken").optional(),
  address: z.string().max(200, "Adress får max vara 200 tecken").optional(),
  admin_contact_name: z.string().max(100, "Administrativ kontakt får max vara 100 tecken").optional(),
  admin_contact_email: z.string().email("Ange en giltig e-postadress").optional().or(z.literal("")),
  invoice_email: z.string().email("Ange en giltig e-postadress").optional().or(z.literal("")),
  invoice_contact: z.string().max(100, "Fakturakontakt får max vara 100 tecken").optional(),
  org_number: z.string().max(20, "Organisationsnummer får max vara 20 tecken").optional(),
  legal_name: z.string().max(150, "Juridiskt namn får max vara 150 tecken").optional(),
});

type PartnerFormErrors = Partial<Record<keyof z.infer<typeof partnerValidationSchema>, string>>;

interface IndustryApp {
  name: string;
  url: string;
  application: string;
  industry: string;
  description: string;
}

// ==================== TYPES ====================

interface PartnerClickStats {
  partner_name: string;
  month: string;
  clicks: number;
}

interface IpStats {
  ip_prefix: string;
  clicks: number;
}

interface Lead {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  company_size: string | null;
  industry: string | null;
  selected_product: string | null;
  source_page: string | null;
  source_type: string | null;
  message: string | null;
  status: string;
  assigned_partners: string[];
  admin_notes: string | null;
  forwarded_at: string | null;
}

interface FullPartner extends DatabasePartner {
  activation_date: string | null;
  monthly_fee: number | null;
  cancellation_date: string | null;
  admin_notes: string | null;
  admin_contact_name: string | null;
  admin_contact_email: string | null;
  agreement_signed?: boolean | null;
  agreement_notes?: string | null;
  invoice_email: string | null;
  invoice_contact: string | null;
  org_number: string | null;
  legal_name: string | null;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Ny", variant: "default" },
  contacted: { label: "Kontaktad", variant: "secondary" },
  forwarded: { label: "Vidarebefordrad", variant: "outline" },
  closed: { label: "Avslutad", variant: "destructive" },
};

// Product sections as per user request
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

interface ProductSection {
  key: ProductKey;
  label: string;
  apps: string[];
  colorClass: string;
  icon: string;
}

// Additional specialty products (no industry selection needed)
const specialtyProducts = ['Project Operations', 'Commerce', 'Human Resources'] as const;
type SpecialtyProduct = typeof specialtyProducts[number];

const productSections: ProductSection[] = [
  { key: 'bc', label: 'Business Central', apps: ['Business Central'], colorClass: 'bg-business-central', icon: BusinessCentralIcon },
  { key: 'fsc', label: 'Finance & Supply Chain', apps: ['Finance', 'Supply Chain Management'], colorClass: 'bg-finance-supply', icon: FinanceIcon },
  { key: 'sales', label: 'Sales & Customer Insights', apps: ['Sales', 'Customer Insights (Marketing)'], colorClass: 'bg-crm', icon: SalesIcon },
  { key: 'service', label: 'Customer Service / Field Service / Contact Center', apps: ['Customer Service', 'Field Service', 'Contact Center'], colorClass: 'bg-customer-service', icon: CustomerServiceIcon },
];
// Dev-time guard: keep editor labels in sync with PartnerCard's pitch resolver.
import { assertPitchLabelsConsistency } from "@/data/pitchProductMapping";
assertPitchLabelsConsistency(productSections, "AdminDashboard productSections");

// Helper to calculate monthly fee from product_filters
function calcMonthlyFee(productFilters: Record<string, any> | undefined): number {
  let bcActive = false, fscActive = false, salesActive = false, serviceActive = false;
  productSections.forEach(section => {
    const industries = productFilters?.[section.key]?.industries || [];
    if (industries.length > 0) {
      if (section.key === 'bc') bcActive = true;
      else if (section.key === 'fsc') fscActive = true;
      else if (section.key === 'sales') salesActive = true;
      else if (section.key === 'service') serviceActive = true;
    }
  });
  let activeProducts = 0;
  if (bcActive) activeProducts++;
  if (fscActive) activeProducts++;
  if (salesActive || serviceActive) activeProducts++;
  const priceTiers: Record<number, number> = { 0: 0, 1: 995, 2: 1595, 3: 1995 };
  return priceTiers[Math.min(activeProducts, 3)] ?? 1995;
}

// ==================== TAB GROUPS ====================
import type { LucideIcon } from "lucide-react";

const tabGroups: { id: string; label: string; icon: LucideIcon; tabs: string[] }[] = [
  {
    id: "leads-partners",
    label: "Leads & Partners",
    icon: Building2,
    tabs: ["leads", "partners", "invitations", "agreement"],
  },
  {
    id: "innehall",
    label: "Innehåll & Events",
    icon: CalendarDays,
    tabs: ["events", "featured-article", "knowledge-articles", "industry-pages"],
  },
  {
    id: "salj",
    label: "Sälj",
    icon: Megaphone,
    tabs: ["sales-overview", "sales-pitch", "sales-pitch-v2", "sales-kpi"],
  },
  {
    id: "statistik",
    label: "Statistik",
    icon: BarChart3,
    tabs: ["clicks", "stats", "visitors", "all-visitors", "funnel", "summary", "email-log"],
  },
  {
    id: "seo",
    label: "SEO & Konkurrens",
    icon: TrendingUp,
    tabs: ["seo-rankings", "semrush", "competitor", "gsc"],
  },
  {
    id: "partnerportal",
    label: "Partnerportal",
    icon: LayoutDashboard,
    tabs: ["partner-stats-page", "partner-agreement-page", "partner-dashboard", "partner-reports"],
  },
];

// ==================== COMPONENT ====================

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, token, login, logout } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactPhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Login state
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Lead state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [selectedPartnersForLead, setSelectedPartnersForLead] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  
// Click stats state
  const [clickStats, setClickStats] = useState<PartnerClickStats[]>([]);
  const [ipStats, setIpStats] = useState<IpStats[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Partner management state
  const { data: dbPartners = [], isLoading: isLoadingPartners, refetch: refetchPartners } = usePartners();
  const [fullPartners, setFullPartners] = useState<FullPartner[]>([]);
  const [isLoadingFullPartners, setIsLoadingFullPartners] = useState(false);
  const [partnerSortBy, setPartnerSortBy] = useState<'name' | 'updated_at'>('name');
  const [partnerSortDir, setPartnerSortDir] = useState<'asc' | 'desc'>('asc');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'all' | 'published' | 'invited_unpublished' | 'not_invited' | 'agreement_signed' | 'has_email' | 'missing_email'>('all');
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();
  const [editingPartner, setEditingPartner] = useState<FullPartner | null>(null);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingContactPhoto, setIsUploadingContactPhoto] = useState(false);
  const [formErrors, setFormErrors] = useState<PartnerFormErrors>({});
  const [activeFormSection, setActiveFormSection] = useState(0);
  
  // Open invitations tracking (partner_id -> {status, email})
  const [openInvitations, setOpenInvitations] = useState<Record<string, { status: string; email: string }>>({});
  const [everInvitedPartnerIds, setEverInvitedPartnerIds] = useState<Set<string>>(new Set());

  // Agreement emails sent tracking (lowercase partner_name -> {template, sent_at, recipient})
  const [agreementEmails, setAgreementEmails] = useState<Record<string, { template: string; sent_at: string; recipient: string }>>({});

  // All emails sent per partner (lowercase partner_name -> {templates: [...], lastTemplate, lastSentAt, lastRecipient, count})
  const [partnerEmailHistory, setPartnerEmailHistory] = useState<Record<string, { templates: Set<string>; lastTemplate: string; lastSentAt: string; lastRecipient: string; count: number }>>({});
  
  // Bulk email state (shared selection for welcome + sales pitch)
  const [selectedForWelcome, setSelectedForWelcome] = useState<Set<string>>(new Set());
  const [sendingWelcome, setSendingWelcome] = useState(false);
  const [sendingSalesPitch, setSendingSalesPitch] = useState(false);
  
  // Email send dialog state
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailDialogType, setEmailDialogType] = useState<'welcome' | 'sales_pitch' | 'profile_refresh'>('sales_pitch');
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});
  const [emailCustomSubject, setEmailCustomSubject] = useState<string>("");
  const [emailCustomBody, setEmailCustomBody] = useState<string>("");
  const [sendingProfileRefresh, setSendingProfileRefresh] = useState(false);
  
  // Section refs for navigation
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Tab grouping
  const [activeGroup, setActiveGroup] = useState<string>(() => {
    if (typeof window === "undefined") return "leads-partners";
    return localStorage.getItem("admin-active-group") || "leads-partners";
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === "undefined") return "leads";
    return localStorage.getItem("admin-active-tab") || "leads";
  });
  useEffect(() => {
    try { localStorage.setItem("admin-active-group", activeGroup); } catch {}
  }, [activeGroup]);
  useEffect(() => {
    try { localStorage.setItem("admin-active-tab", activeTab); } catch {}
  }, [activeTab]);

  // AI summary generation state
  const [generatingSummaryId, setGeneratingSummaryId] = useState<string | null>(null);
  const [generatingAllSummaries, setGeneratingAllSummaries] = useState(false);

  const handleGenerateSummary = async (partnerId: string, partnerName: string) => {
    setGeneratingSummaryId(partnerId);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("generate-partner-summary", { token, partnerId });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "AI-summering klar", description: `Sammanfattning genererad för ${partnerName}.` });
      refetchPartners();
    } catch (e: any) {
      const msg = e?.message || "Okänt fel";
      toast({
        title: "Kunde inte generera",
        description: msg === "RATE_LIMIT" ? "AI-tjänsten är överbelastad – försök igen om en stund."
          : msg === "PAYMENT_REQUIRED" ? "AI-krediter slut. Lägg till krediter under Settings → Workspace → Usage."
          : msg,
        variant: "destructive",
      });
    } finally {
      setGeneratingSummaryId(null);
    }
  };

  const handleGenerateAllMissingSummaries = async () => {
    setGeneratingAllSummaries(true);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("generate-partner-summary", { token, all: true });
      if (error) throw error;
      const results = (data as any)?.results || [];
      const ok = results.filter((r: any) => r.ok).length;
      const failed = results.length - ok;
      toast({
        title: "Bulk-generering klar",
        description: `${ok} lyckades${failed > 0 ? `, ${failed} misslyckades` : ""}.`,
      });
      refetchPartners();
    } catch (e: any) {
      toast({ title: "Bulk-generering misslyckades", description: e?.message || "Okänt fel", variant: "destructive" });
    } finally {
      setGeneratingAllSummaries(false);
    }
  };

  // Collapsible sections state in partner edit dialog (all open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admin: true,
    basic: true,
    contact: true,
    geography: true,
    products: true,
    pitches: true,
    industryApps: true,
  });
  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const setSectionOpen = (id: string, open: boolean) =>
    setOpenSections((prev) => ({ ...prev, [id]: open }));

  // Per-product collapsible state inside Produktsektioner
  // Default: collapsed (false). Opens automatically for products that already have data when editing.
  const [openProducts, setOpenProducts] = useState<Record<string, boolean>>({});
  const toggleProduct = (key: string) =>
    setOpenProducts((prev) => ({ ...prev, [key]: !prev[key] }));

  // Industry apps state
  const [industryApps, setIndustryApps] = useState<IndustryApp[]>([]);
  // Industry pitches state
  const [industryPitches, setIndustryPitches] = useState<IndustryPitch[]>([]);

  // Empty product filter template
  const emptyProductFilter: ProductFilterInput = {
    industries: [],
    secondaryIndustries: [],
    companySize: [],
    geography: [],
    swedenRegions: [],
    swedenCities: [],
    ranking: 999,
    customerExamples: [],
    customerCaseLinks: [],
    aiCapabilities: [],
    aiProjectCount: "",
    hasBuiltAgents: false,
    aiCaseDescription: "",
    aiBusinessImpact: "",
    aiSegmentationDetails: [],
    aiPredictiveDetails: [],
    aiOtherPartner: "",
    aiOtherAdvanced: "",
  };

  const [partnerFormData, setPartnerFormData] = useState<PartnerInput & {
    activation_date?: string;
    monthly_fee?: number;
    cancellation_date?: string;
    admin_notes?: string;
    admin_contact_name?: string;
    admin_contact_email?: string;
    agreement_signed?: boolean;
    agreement_notes?: string;
    invoice_email?: string;
    invoice_contact?: string;
    org_number?: string;
    legal_name?: string;
    youtube_video_id?: string;
  }>({
    slug: "",
    name: "",
    description: "",
    logo_url: "",
    website: "",
    email: "",
    contactPerson: "",
    contact_photo_url: "",
    phone: "",
    address: "",
    applications: [],
    industries: [],
    secondary_industries: [],
    geography: ["Sverige"],
    product_filters: {},
    is_featured: false,
    office_cities: [],
    map_url: "",
    activation_date: "",
    monthly_fee: undefined,
    cancellation_date: "",
    admin_notes: "",
    admin_contact_name: "",
    admin_contact_email: "",
    agreement_signed: false,
    agreement_notes: "",
    invoice_email: "",
    invoice_contact: "",
    org_number: "",
    legal_name: "",
    youtube_video_id: "",
  });

  // ==================== LEAD FUNCTIONS ====================

  const fetchLeads = async () => {
    if (!token) return;
    setIsLoadingLeads(true);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", { action: "list", token });

      if (error) throw error;
      if (data.error) {
        if (data.error.includes("gått ut") || data.error.includes("session")) {
          logout();
        }
        throw new Error(data.error);
      }
      setLeads(data.leads || []);
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta leads",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchClickStats = async () => {
    if (!token) return;
    setIsLoadingStats(true);
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", { action: "click-stats", token });

      if (error) throw error;
      if (data.error) {
        if (data.error.includes("gått ut") || data.error.includes("session")) {
          logout();
        }
        throw new Error(data.error);
      }
      setClickStats(data.stats || []);
      setIpStats(data.ipStats || []);
    } catch (error: any) {
      console.error("Error fetching click stats:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta klickstatistik",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchFullPartners = async () => {
    if (!token) return;
    setIsLoadingFullPartners(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "get-full", token },
      });

      if (error) {
        const msg = error.message || "";
        if (msg.includes("gått ut") || msg.includes("session") || msg.includes("Session expired") || msg.includes("401")) {
          toast({ title: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
          logout();
          return;
        }
        throw error;
      }
      if (data.error) {
        if (data.error.includes("gått ut") || data.error.includes("session")) {
          toast({ title: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
          logout();
          return;
        }
        throw new Error(data.error);
      }
      setFullPartners(data.partners || []);
    } catch (error: any) {
      console.error("Error fetching full partners:", error);
      const msg = error.message || "";
      if (msg.includes("gått ut") || msg.includes("session") || msg.includes("401")) {
        toast({ title: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
        logout();
        return;
      }
      toast({
        title: "Fel",
        description: msg || "Kunde inte hämta fullständig partnerdata",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFullPartners(false);
    }
  };

  const fetchOpenInvitations = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
        logout();
        return;
      }
      if (!response.ok) return;
      const data = await response.json();
      const invitations = data?.invitations || [];
      const map: Record<string, { status: string; email: string }> = {};
      const everInvitedSet = new Set<string>();
      for (const inv of invitations) {
        if (inv.partner_id) {
          everInvitedSet.add(inv.partner_id);
          if (inv.status === 'pending' || inv.status === 'submitted') {
            map[inv.partner_id] = { status: inv.status, email: inv.email || '' };
          }
        }
      }
      setOpenInvitations(map);
      setEverInvitedPartnerIds(everInvitedSet);
    } catch {
      // silently ignore
    }
  };

  const EMAIL_DEFAULTS: Record<'welcome' | 'sales_pitch' | 'profile_refresh', { subject: string; body: string; label: string }> = {
    welcome: {
      label: "Välkomstmail (inbjudan)",
      subject: "Vem är kundens mest lämpade Dynamics 365-partner?",
      body: "Hej {{NAME}},\n\nDu har blivit inbjuden att skapa eller uppdatera er partnerprofil på D365.se – Sveriges oberoende guide för Microsoft Dynamics 365.\n\n{{INVITATION_LINK}}\n\nAllt Gott!\nThomas Laine & Michael Uhman\nd365.se",
    },
    sales_pitch: {
      label: "Införsäljningsmail",
      subject: "Prova d365.se kostnadsfritt – kvalificerade D365-leads direkt till er",
      body: "Hej {{NAME}},\n\nJag vill presentera d365.se – en oberoende köpguide för företag som utvärderar Microsoft Dynamics 365.\n\n{{INVITATION_LINK}}\n\nMed vänlig hälsning,\n\nThomas Laine & Michael Uhman\nd365.se",
    },
    profile_refresh: {
      label: "Profileringslänk (90 dgr)",
      subject: "VIKTIGT! Uppdatera er partnerprofil på d365.se",
      body: `Hej,

Nu finns möjlighet att se över och uppdatera er partnerprofil på d365.se.

Här är er unika profileringslänk:
{{INVITATION_LINK}}

Jag rekommenderar särskilt att ni ser över:

• er generella beskrivning av bolaget
• beskrivningarna per produktområde
• bild/foto, både generellt och per område
• kommande event, webinarier eller seminarier kopplade till Dynamics 365 och/eller AI
• eventuell kort video om er som partner

Syftet är inte bara att "fylla i en profil".

Många kunder som besöker d365.se är i en tidig men aktiv fas där de försöker förstå vilka partners som verkar relevanta för deras behov, bransch och lösningsområde.

En tydlig och aktuell profil hjälper er att:

• framstå mer relevant i kundens urvalsprocess
• visa vilka typer av kunder och branscher ni faktiskt passar bäst för
• skapa förtroende innan kunden tar direkt kontakt
• göra det enklare för kunden att förstå varför just ni bör finnas med på deras shortlist

Det här är särskilt viktigt eftersom kundens köpresa sällan börjar med ett formulär eller ett direkt lead. Ofta börjar den med jämförelser, research och intern förankring långt innan kunden tar kontakt.

Därför är profilen på d365.se mer än en kontaktväg. Den är en del av hur ni uppfattas när kunden börjar sortera marknaden.

Uppdatera gärna profilen här:
{{INVITATION_LINK}}

Vänliga hälsningar,
Thomas`,
    },
  };

  const fetchInvitationEmailTemplateValue = async (templateKey: string): Promise<string> => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=${encodeURIComponent(templateKey)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );

    if (response.status === 401) {
      toast({ title: "Sessionen har gått ut", variant: "destructive" });
      logout();
      return "";
    }
    if (!response.ok) throw new Error("Kunde inte hämta e-postmall");

    const data = await response.json();
    return data.template || "";
  };

  const openEmailDialog = async (type: 'welcome' | 'sales_pitch' | 'profile_refresh') => {
    const selected = fullPartners.filter(p => selectedForWelcome.has(p.id));
    if (selected.length === 0) return;
    // Pre-fill with existing emails
    const overrides: Record<string, string> = {};
    selected.forEach(p => {
      overrides[p.id] = p.admin_contact_email || p.email || "";
    });
    setEmailOverrides(overrides);
    setEmailDialogType(type);

    let subject = EMAIL_DEFAULTS[type].subject;
    let body = EMAIL_DEFAULTS[type].body;
    if (type === 'profile_refresh') {
      try {
        const [savedBody, savedSubject] = await Promise.all([
          fetchInvitationEmailTemplateValue("profile_refresh_email_body"),
          fetchInvitationEmailTemplateValue("profile_refresh_email_subject"),
        ]);
        subject = savedSubject || subject;
        body = savedBody || body;
      } catch (error) {
        console.error("Fetch profile refresh email template error:", error);
        toast({ title: "Kunde inte hämta sparad profileringslänkmall", description: "Standardmallen visas istället.", variant: "destructive" });
      }
    }

    setEmailCustomSubject(subject);
    setEmailCustomBody(body);
    setIsEmailDialogOpen(true);
  };

  const sendEmailsFromDialog = async () => {
    const selected = fullPartners.filter(p => selectedForWelcome.has(p.id));
    // Validate all have emails
    const missing = selected.filter(p => !emailOverrides[p.id]?.trim());
    if (missing.length > 0) {
      toast({ title: "Ange e-post för alla markerade partners", variant: "destructive" });
      return;
    }
    if (!emailCustomSubject.trim()) {
      toast({ title: "Ämne får inte vara tomt", variant: "destructive" });
      return;
    }
    if (!emailCustomBody.trim()) {
      toast({ title: "Innehåll får inte vara tomt", variant: "destructive" });
      return;
    }
    if (!emailCustomBody.includes("{{INVITATION_LINK}}")) {
      toast({ title: "Innehållet måste innehålla {{INVITATION_LINK}}", description: "Detta ersätts av personlig länk per partner.", variant: "destructive" });
      return;
    }

    if (emailDialogType === 'welcome') {
      await sendBulkWelcomeEmailsWithOverrides(selected);
    } else if (emailDialogType === 'sales_pitch') {
      await sendBulkSalesPitchEmailsWithOverrides(selected);
    } else {
      await sendBulkProfileRefreshEmailsWithOverrides(selected);
    }
    setIsEmailDialogOpen(false);
  };

  const sendBulkWelcomeEmailsWithOverrides = async (selected: FullPartner[]) => {
    if (!confirm(`Skicka välkomstmail till ${selected.length} partner(s)?`)) return;
    setSendingWelcome(true);
    try {
      const partnerList = selected.map(p => ({
        id: p.id,
        name: p.name,
        email: emailOverrides[p.id]?.trim() || "",
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=bulk-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ partners: partnerList, send_email: true, subject: emailCustomSubject, body: emailCustomBody }),
        }
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        logout();
        return;
      }
      if (!response.ok) throw new Error("Kunde inte skicka välkomstmail");
      const data = await response.json();
      toast({ title: data.message || "Välkomstmail skickade!" });
      setSelectedForWelcome(new Set());
      fetchOpenInvitations();
    } catch (error: any) {
      console.error("Send welcome error:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka välkomstmail",
        variant: "destructive",
      });
    } finally {
      setSendingWelcome(false);
    }
  };

  const sendBulkSalesPitchEmailsWithOverrides = async (selected: FullPartner[]) => {
    if (!confirm(`Skicka införsäljningsmail till ${selected.length} partner(s)?`)) return;
    setSendingSalesPitch(true);
    try {
      const partnerList = selected.map(p => ({
        id: p.id,
        name: p.name,
        email: emailOverrides[p.id]?.trim() || "",
        contact_name: p.admin_contact_name || (p as any).contact_person || p.name,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-sales-pitch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ partners: partnerList, subject: emailCustomSubject, body: emailCustomBody }),
        }
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        logout();
        return;
      }
      if (!response.ok) throw new Error("Kunde inte skicka införsäljningsmail");
      const data = await response.json();
      toast({ title: data.message || "Införsäljningsmail skickade!" });
      setSelectedForWelcome(new Set());
      fetchOpenInvitations();
    } catch (error: any) {
      console.error("Send sales pitch error:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka införsäljningsmail",
        variant: "destructive",
      });
    } finally {
      setSendingSalesPitch(false);
    }
  };

  const sendBulkProfileRefreshEmailsWithOverrides = async (selected: FullPartner[]) => {
    if (!confirm(`Skicka profileringslänk till ${selected.length} partner(s)?`)) return;
    setSendingProfileRefresh(true);
    try {
      const partnerList = selected.map(p => ({
        id: p.id,
        name: p.name,
        email: emailOverrides[p.id]?.trim() || "",
        contact_name: p.admin_contact_name || (p as any).contact_person || p.name,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-profile-refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ partners: partnerList, subject: emailCustomSubject, body: emailCustomBody }),
        }
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        logout();
        return;
      }
      if (!response.ok) throw new Error("Kunde inte skicka profileringslänk");
      const data = await response.json();
      toast({ title: data.message || "Profileringslänk skickad!" });
      setSelectedForWelcome(new Set());
      fetchOpenInvitations();
      fetchAgreementEmails();
    } catch (error: any) {
      console.error("Send profile refresh error:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka profileringslänk",
        variant: "destructive",
      });
    } finally {
      setSendingProfileRefresh(false);
    }
  };

  const fetchAgreementEmails = async () => {
    if (!token) return;
    try {
      // Fetch ALL sent emails (paginated) to build per-partner history
      const map: Record<string, { template: string; sent_at: string; recipient: string }> = {};
      const history: Record<string, { templates: Set<string>; lastTemplate: string; lastSentAt: string; lastRecipient: string; count: number }> = {};
      const pageSize = 500;
      let offset = 0;
      let total = Infinity;
      while (offset < total && offset < 5000) {
        const { data } = await invokeAdminEdgeWithRetry("manage-leads", {
          action: "email-logs", token, limit: pageSize, offset, statusFilter: "sent", templateFilter: "all",
        });
        const logs = data?.logs || [];
        total = data?.total ?? logs.length;
        for (const log of logs) {
          const name = (log.metadata as any)?.partner_name || (log.metadata as any)?.company_name;
          if (!name) continue;
          const key = String(name).toLowerCase().trim();
          // Agreement-specific map (legacy)
          if ((log.template_name === 'partner_agreement' || log.template_name === 'partner_prospect_agreement') && !map[key]) {
            map[key] = { template: log.template_name, sent_at: log.created_at, recipient: log.recipient_email };
          }
          // Full history (logs come ordered desc, so first occurrence is latest)
          if (!history[key]) {
            history[key] = { templates: new Set(), lastTemplate: log.template_name, lastSentAt: log.created_at, lastRecipient: log.recipient_email, count: 0 };
          }
          history[key].templates.add(log.template_name);
          history[key].count += 1;
        }
        if (logs.length < pageSize) break;
        offset += pageSize;
      }
      setAgreementEmails(map);
      setPartnerEmailHistory(history);
    } catch {
      // silently ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchLeads();
      fetchClickStats();
      fetchFullPartners();
      fetchOpenInvitations();
      fetchAgreementEmails();
    }
  }, [isAuthenticated, token]);

  const getMonthsFromStats = (): string[] => {
    const months = new Set(clickStats.map(s => s.month));
    return Array.from(months).sort().reverse();
  };

  const getStatsForMonth = (month: string): PartnerClickStats[] => {
    return clickStats
      .filter(s => s.month === month)
      .sort((a, b) => b.clicks - a.clicks);
  };

  const getTotalClicksForMonth = (month: string): number => {
    return clickStats
      .filter(s => s.month === month)
      .reduce((sum, s) => sum + s.clicks, 0);
  };

  const formatMonth = (monthStr: string): string => {
    const date = new Date(monthStr);
    return format(date, "MMMM yyyy", { locale: sv });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = await login(loginPassword);
    if (!result.success) {
      setLoginError(result.error || "Inloggning misslyckades");
    }
    setLoginPassword("");
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    if (!token) {
      toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
      logout();
      return;
    }
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", { action: "update", token, id: leadId, status });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
      toast({ title: "Status uppdaterad" });
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Kunde inte uppdatera status",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead || !token) {
      if (!token) {
        toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
        logout();
      }
      return;
    }
    
    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", { action: "update", token, id: selectedLead.id, admin_notes: adminNotes });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, admin_notes: adminNotes } : l));
      toast({ title: "Anteckningar sparade" });
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Kunde inte spara anteckningar",
        variant: "destructive",
      });
    }
  };

  const handleForward = async () => {
    if (!selectedLead || selectedPartnersForLead.length === 0 || !token) {
      if (!token) {
        toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
        logout();
      }
      return;
    }

    try {
      const partnerEmails = selectedPartnersForLead.map(name => {
        return `kontakt@${name.toLowerCase().replace(/\s+/g, '').replace(/[åä]/g, 'a').replace(/ö/g, 'o')}.se`;
      });

      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", {
        action: "forward",
        token,
        id: selectedLead.id,
        partner_emails: partnerEmails,
        partner_names: selectedPartnersForLead,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setLeads(leads.map(l => 
        l.id === selectedLead.id 
          ? { ...l, status: "forwarded", assigned_partners: selectedPartnersForLead, forwarded_at: new Date().toISOString() }
          : l
      ));
      
      setIsForwardDialogOpen(false);
      setSelectedPartnersForLead([]);
      toast({ title: "Lead vidarebefordrad till partners" });
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Kunde inte vidarebefordra lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna lead?")) return;
    if (!token) {
      toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
      logout();
      return;
    }

    try {
      const { data, error } = await invokeAdminEdgeWithRetry("manage-leads", { action: "delete", token, id: leadId });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setLeads(leads.filter(l => l.id !== leadId));
      toast({ title: "Lead borttagen" });
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Kunde inte ta bort lead",
        variant: "destructive",
      });
    }
  };

  // ==================== PARTNER FUNCTIONS ====================


  const resetPartnerForm = () => {
    setPartnerFormData({
      slug: "",
      name: "",
      description: "",
      logo_url: "",
      website: "",
      email: "",
      contactPerson: "",
      contact_photo_url: "",
      phone: "",
      address: "",
      youtube_video_id: "",
      applications: [],
      industries: [],
      secondary_industries: [],
      geography: ["Sverige"],
      product_filters: {},
      is_featured: false,
      office_cities: [],
      map_url: "",
      activation_date: "",
      monthly_fee: undefined,
      cancellation_date: "",
      admin_notes: "",
      admin_contact_name: "",
      admin_contact_email: "",
      agreement_signed: false,
      agreement_notes: "",
      invoice_email: "",
      invoice_contact: "",
      org_number: "",
      legal_name: "",
    });
    setEditingPartner(null);
    setFormErrors({});
    setIndustryApps([]);
    setIndustryPitches([]);
  };

  const openCreatePartnerDialog = () => {
    resetPartnerForm();
    setIsPartnerDialogOpen(true);
  };

  // Get or create a permanent self-service link for a published partner and copy it to clipboard
  const copyPermanentProfileLink = async (partnerId: string, partnerName: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-permanent-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ partner_id: partnerId }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.token) {
        throw new Error(result.error || "Kunde inte hämta länken");
      }
      const link = `${getPublicBaseUrl()}/partner-update/${result.token}`;
      await navigator.clipboard.writeText(link);
      toast({
        title: "Profileringslänk kopierad",
        description: `Permanent länk för ${partnerName} kopierad till urklipp.`,
      });
      return link;
    } catch (err: any) {
      console.error("copyPermanentProfileLink error:", err);
      toast({
        title: "Fel",
        description: err?.message || "Kunde inte hämta länken",
        variant: "destructive",
      });
      return null;
    }
  };

  const openEditPartnerDialog = (partner: FullPartner) => {
    setEditingPartner(partner);
    setPartnerFormData({
      slug: partner.slug,
      name: partner.name,
      description: partner.description || "",
      logo_url: partner.logo_url || "",
      website: partner.website,
      email: partner.email || "",
      contactPerson: (partner as any).contact_person || partner.contactPerson || "",
      contact_photo_url: (partner as any).contact_photo_url || "",
      phone: partner.phone || "",
      address: partner.address || "",
      applications: partner.applications || [],
      industries: partner.industries || [],
      secondary_industries: partner.secondary_industries || [],
      geography: partner.geography || ["Sverige"],
      product_filters: partner.product_filters || {},
      is_featured: partner.is_featured || false,
      office_cities: (partner as any).office_cities || [],
      map_url: (partner as any).map_url || "",
      activation_date: partner.activation_date || "",
      monthly_fee: partner.monthly_fee || undefined,
      cancellation_date: partner.cancellation_date || "",
      admin_notes: partner.admin_notes || "",
      admin_contact_name: (partner as any).admin_contact_name || "",
      admin_contact_email: (partner as any).admin_contact_email || "",
      agreement_signed: (partner as any).agreement_signed || false,
      agreement_notes: (partner as any).agreement_notes || "",
      invoice_email: (partner as any).invoice_email || "",
      invoice_contact: (partner as any).invoice_contact || "",
      org_number: (partner as any).org_number || "",
      legal_name: (partner as any).legal_name || "",
      youtube_video_id: (partner as any).youtube_video_id || "",
    });
    setIndustryApps(
      Array.isArray((partner as any).industry_apps) ? (partner as any).industry_apps : []
    );
    setIndustryPitches(
      Array.isArray((partner as any).industry_pitches) ? (partner as any).industry_pitches : []
    );
    // Auto-expand product sections that already have data
    const initialOpen: Record<string, boolean> = {};
    productSections.forEach((s) => {
      const f = (partner.product_filters as any)?.[s.key];
      const hasData = f && (
        (f.industries?.length || 0) > 0 ||
        (f.secondaryIndustries?.length || 0) > 0 ||
        (f.companySize?.length || 0) > 0 ||
        f.productDescription || f.contactName || f.contactEmail || f.contactPhone ||
        (f.aiCapabilities?.length || 0) > 0
      );
      initialOpen[s.key] = !!hasData;
    });
    setOpenProducts(initialOpen);
    setIsPartnerDialogOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);
      formData.append("partnerSlug", partnerFormData.slug || generateSlug(partnerFormData.name));

      // Use fetch directly since supabase.functions.invoke doesn't handle FormData properly
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-partner-logo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Uppladdning misslyckades");
      }

      setPartnerFormData({ ...partnerFormData, logo_url: data.url });
      toast({ title: "Logo uppladdad" });
    } catch (error: any) {
      toast({
        title: "Fel vid uppladdning",
        description: error.message || "Kunde inte ladda upp logo",
        variant: "destructive",
      });
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleContactPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploadingContactPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);
      formData.append("partnerSlug", partnerFormData.slug || generateSlug(partnerFormData.name));
      formData.append("kind", "contact");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-partner-logo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Uppladdning misslyckades");

      // Cache-bust so the new photo shows immediately
      const bustedUrl = `${data.url}?t=${Date.now()}`;
      setPartnerFormData({ ...partnerFormData, contact_photo_url: bustedUrl });
      toast({ title: "Foto på kundkontakt uppladdat" });
    } catch (error: any) {
      toast({
        title: "Fel vid uppladdning",
        description: error.message || "Kunde inte ladda upp foto",
        variant: "destructive",
      });
    } finally {
      setIsUploadingContactPhoto(false);
      if (contactPhotoInputRef.current) contactPhotoInputRef.current.value = "";
    }
  };

  // Per-product contact photo upload (uses kind="contact-<productKey>")
  const [uploadingProductPhoto, setUploadingProductPhoto] = useState<string | null>(null);
  const handleProductContactPhotoUpload = async (
    productKey: ProductKey,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingProductPhoto(productKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", token);
      formData.append("partnerSlug", partnerFormData.slug || generateSlug(partnerFormData.name));
      formData.append("kind", `contact-${productKey}`);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-partner-logo`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Uppladdning misslyckades");

      const bustedUrl = `${data.url}?t=${Date.now()}`;
      updateProductFilter(productKey, { contactPhotoUrl: bustedUrl });
      toast({ title: "Foto uppladdat" });
    } catch (error: any) {
      toast({
        title: "Fel vid uppladdning",
        description: error.message || "Kunde inte ladda upp foto",
        variant: "destructive",
      });
    } finally {
      setUploadingProductPhoto(null);
      e.target.value = "";
    }
  };
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
      logout();
      return;
    }

    // Validate form data
    const validationResult = partnerValidationSchema.safeParse(partnerFormData);
    if (!validationResult.success) {
      const errors: PartnerFormErrors = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as keyof PartnerFormErrors;
        if (field && !errors[field]) {
          errors[field] = err.message;
        }
      });
      setFormErrors(errors);
      toast({ 
        title: "Formulärfel", 
        description: "Vänligen korrigera de markerade fälten", 
        variant: "destructive" 
      });
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    // Build applications array from selected product sections
    const applications: string[] = [];
    productSections.forEach(section => {
      const filter = partnerFormData.product_filters?.[section.key];
      if (filter && filter.industries.length > 0) {
        applications.push(...section.apps);
      }
    });
    
    // Add specialty products from applications array
    specialtyProducts.forEach(product => {
      if (partnerFormData.applications?.includes(product)) {
        applications.push(product);
      }
    });

    try {
      // Clean out empty product filters (no industries and no description)
      const cleanedProductFilters: Record<string, any> = {};
      if (partnerFormData.product_filters) {
        Object.entries(partnerFormData.product_filters).forEach(([key, filter]) => {
          if (filter && (filter.industries?.length > 0 || filter.productDescription?.trim())) {
            cleanedProductFilters[key] = filter;
          }
        });
      }

      const dataToSend = {
        ...partnerFormData,
        product_filters: cleanedProductFilters,
        applications: [...new Set(applications)],
        slug: partnerFormData.slug || generateSlug(partnerFormData.name),
        industry_apps: industryApps.filter(app => app.name.trim() && app.url.trim()),
        industry_pitches: industryPitches.filter(p => p.text?.trim()),
      } as any;

      if (editingPartner) {
        await updatePartner.mutateAsync({
          id: editingPartner.id,
          partner: dataToSend,
          token,
        });
        toast({ title: "Partner uppdaterad", description: `${partnerFormData.name} har uppdaterats.` });
      } else {
        await createPartner.mutateAsync({ partner: dataToSend, token });
        toast({ title: "Partner skapad", description: `${partnerFormData.name} har lagts till.` });
      }
      setIsPartnerDialogOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      resetPartnerForm();
      fetchFullPartners();
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Något gick fel",
        variant: "destructive",
      });
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!token) {
      toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
      logout();
      return;
    }
    try {
      await deletePartner.mutateAsync({ id, token });
      toast({ title: "Partner borttagen" });
      setDeleteConfirmId(null);
      fetchFullPartners();
    } catch (error: any) {
      if (error.message?.includes("gått ut") || error.message?.includes("session")) {
        logout();
      }
      toast({
        title: "Fel",
        description: error.message || "Kunde inte ta bort partner",
        variant: "destructive",
      });
    }
  };

  // Product filter helpers
  const getProductFilter = (product: ProductKey): ProductFilterInput => {
    const existing = partnerFormData.product_filters?.[product];
    // Merge with emptyProductFilter to ensure all fields exist (including customerExamples)
    // Handle legacy single-string geography by converting to array
    const existingGeo = existing?.geography;
    const normalizedGeography = Array.isArray(existingGeo) 
      ? existingGeo 
      : (existingGeo ? [existingGeo] : []);
    
    return {
      ...emptyProductFilter,
      ...existing,
      // Ensure arrays are always initialized
      industries: existing?.industries || [],
      secondaryIndustries: existing?.secondaryIndustries || [],
      companySize: existing?.companySize || [],
      geography: normalizedGeography,
      swedenRegions: existing?.swedenRegions || [],
      swedenCities: existing?.swedenCities || [],
      customerExamples: existing?.customerExamples || [],
      customerCaseLinks: existing?.customerCaseLinks || [],
      productDescription: existing?.productDescription || '',
      aiCapabilities: existing?.aiCapabilities || [],
      aiProjectCount: existing?.aiProjectCount || '',
      hasBuiltAgents: existing?.hasBuiltAgents ?? false,
      aiCaseDescription: existing?.aiCaseDescription || '',
      aiBusinessImpact: existing?.aiBusinessImpact || '',
      aiSegmentationDetails: existing?.aiSegmentationDetails || [],
      aiPredictiveDetails: existing?.aiPredictiveDetails || [],
      aiOtherPartner: existing?.aiOtherPartner || '',
      aiOtherAdvanced: existing?.aiOtherAdvanced || '',
      contactName: existing?.contactName || '',
      contactEmail: existing?.contactEmail || '',
      contactPhone: existing?.contactPhone || '',
      contactPhotoUrl: existing?.contactPhotoUrl || '',
      youtubeVideoId: existing?.youtubeVideoId || '',
    };
  };

  const updateProductFilter = (product: ProductKey, updates: Partial<ProductFilterInput>) => {
    setPartnerFormData((prev) => ({
      ...prev,
      product_filters: {
        ...prev.product_filters,
        [product]: {
          ...getProductFilter(product),
          ...updates,
        },
      },
    }));
  };

  const toggleProductIndustry = (product: ProductKey, ind: string) => {
    const current = getProductFilter(product);
    const newIndustries = current.industries.includes(ind)
      ? current.industries.filter((i) => i !== ind)
      : current.industries.length < 3 
        ? [...current.industries, ind]
        : current.industries; // Max 3
    updateProductFilter(product, { industries: newIndustries });
  };

  const toggleProductSecondaryIndustry = (product: ProductKey, ind: string) => {
    const current = getProductFilter(product);
    const newIndustries = current.secondaryIndustries.includes(ind)
      ? current.secondaryIndustries.filter((i) => i !== ind)
      : current.secondaryIndustries.length < 2
        ? [...current.secondaryIndustries, ind]
        : current.secondaryIndustries; // Max 2
    updateProductFilter(product, { secondaryIndustries: newIndustries });
  };

  const isProductActive = (product: ProductKey): boolean => {
    const filter = getProductFilter(product);
    return filter.industries.length > 0;
  };

  // Helper function for cascading geography selection
  // When selecting a higher level, automatically include all lower levels
  const getCascadingGeography = (selectedGeo: string, currentSelection: string[]): string[] => {
    const hierarchy = ['Sverige', 'Norden', 'Europa', 'Övriga världen'];
    const selectedIndex = hierarchy.indexOf(selectedGeo);
    
    if (selectedIndex === -1) return [...currentSelection, selectedGeo];
    
    // Include all geographies at and below the selected level
    const toInclude = hierarchy.slice(0, selectedIndex + 1);
    const newSelection = new Set([...currentSelection, ...toInclude]);
    return Array.from(newSelection);
  };

  // Helper to remove geography and optionally its dependents
  const getFilteredGeography = (geoToRemove: string, currentSelection: string[]): string[] => {
    const hierarchy = ['Sverige', 'Norden', 'Europa', 'Övriga världen'];
    const removedIndex = hierarchy.indexOf(geoToRemove);
    
    if (removedIndex === -1) return currentSelection.filter(g => g !== geoToRemove);
    
    // When removing a lower level (e.g., Sverige), also remove higher levels that depend on it
    // Actually, for simplicity: just remove the clicked one
    return currentSelection.filter(g => g !== geoToRemove);
  };

  const formSections = [
    { id: 'admin', label: 'Administrativt', icon: Lock },
    { id: 'basic', label: 'Grunduppgifter', icon: Building2 },
    { id: 'contact', label: 'Kontaktuppgifter', icon: User },
    { id: 'geography', label: 'Geografi', icon: Globe },
    { id: 'products', label: 'Produkter', icon: FileText },
  ];

  // Calculate form completion percentage
  const formCompletion = useMemo(() => {
    let completed = 0;
    const total = 5;
    
    // Section 1: Basic info - name and website required
    if (partnerFormData.name && partnerFormData.website) completed++;
    
    // Section 2: Contact info - any contact info filled
    if (partnerFormData.contactPerson || partnerFormData.email || partnerFormData.phone) completed++;
    
    // Section 3: Geography - at least one selected
    if ((partnerFormData.geography || []).length > 0) completed++;
    
    // Section 4: Products - at least one product with industries
    const hasActiveProduct = productSections.some(section => {
      const filter = partnerFormData.product_filters?.[section.key];
      return filter && filter.industries.length > 0;
    });
    if (hasActiveProduct) completed++;
    
    // Section 5: Admin info - activation date or featured status
    if (partnerFormData.activation_date || partnerFormData.is_featured) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [partnerFormData]);

  // Scroll to section (and ensure it's open)
  const scrollToSection = (index: number) => {
    setActiveFormSection(index);
    const sectionId = formSections[index]?.id;
    if (sectionId) setSectionOpen(sectionId, true);
    // Wait a tick so the section expands before scrolling
    setTimeout(() => {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Get section status
  const getSectionStatus = (sectionId: string): 'complete' | 'partial' | 'empty' => {
    switch (sectionId) {
      case 'basic':
        if (partnerFormData.name && partnerFormData.website) return 'complete';
        if (partnerFormData.name || partnerFormData.website) return 'partial';
        return 'empty';
      case 'contact':
        if (partnerFormData.contactPerson && partnerFormData.email) return 'complete';
        if (partnerFormData.contactPerson || partnerFormData.email || partnerFormData.phone) return 'partial';
        return 'empty';
      case 'geography':
        return (partnerFormData.geography || []).length > 0 ? 'complete' : 'empty';
      case 'products':
        const activeCount = productSections.filter(section => {
          const filter = partnerFormData.product_filters?.[section.key];
          return filter && filter.industries.length > 0;
        }).length;
        if (activeCount >= 1) return 'complete';
        return 'empty';
      case 'admin':
        if (partnerFormData.activation_date) return 'complete';
        if (partnerFormData.admin_notes || partnerFormData.admin_contact_name) return 'partial';
        return 'empty';
      default:
        return 'empty';
    }
  };

  // ==================== RENDER ====================

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="Admin – d365.se" description="Adminpanel för d365.se." canonicalPath="/admin" noIndex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <p className="text-muted-foreground">Laddar...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="Admin – d365.se" description="Adminpanel för d365.se." canonicalPath="/admin" noIndex />
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Logga in för att hantera leads och partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Lösenord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Ange adminlösenord"
                  />
                  {loginError && (
                    <p className="text-sm text-destructive">{loginError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Logga in
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const refreshAll = () => {
    fetchLeads();
    fetchClickStats();
    refetchPartners();
    fetchFullPartners();
  };

  // Calculate summary stats
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const clicksThisMonth = clickStats
    .filter(s => s.month === currentMonth)
    .reduce((sum, s) => sum + s.clicks, 0);
  
  const totalClicks = clickStats.reduce((sum, s) => sum + s.clicks, 0);
  
  const newLeadsCount = leads.filter(l => l.status === "new").length;
  const forwardedLeadsCount = leads.filter(l => l.status === "forwarded").length;
  
  const currentMonthName = new Date().toLocaleDateString("sv-SE", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEOHead title="Admin – d365.se" description="Adminpanel för d365.se." canonicalPath="/admin" noIndex />
      <Navbar />
      <main className="flex-grow mt-16">
        {/* Premium dark hero header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border-b border-slate-700/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(249,115,22,0.08),_transparent_50%)] pointer-events-none" />
          <div className="container mx-auto px-4 py-8 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/40 ring-1 ring-white/10">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                      Premium
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">Översikt, partners, leads & utskick</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={refreshAll}
                  variant="outline"
                  disabled={isLoadingLeads || isLoadingStats || isLoadingPartners}
                  className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${(isLoadingLeads || isLoadingStats || isLoadingPartners) ? "animate-spin" : ""}`} />
                  Uppdatera
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white backdrop-blur"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logga ut
                </Button>
              </div>
            </div>

            {/* Summary Cards - premium glass */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="group relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Totalt antal leads</p>
                    <p className="text-3xl font-bold text-white mt-1">{leads.length}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-400/20">
                    <Inbox className="h-5 w-5 text-blue-300" strokeWidth={1.75} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <span className="text-blue-300 font-semibold">{newLeadsCount}</span> nya · {forwardedLeadsCount} vidarebefordrade
                </p>
              </div>

              <div className="group relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Klick denna månad</p>
                    <p className="text-3xl font-bold text-white mt-1">{clicksThisMonth}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
                    <MousePointerClick className="h-5 w-5 text-emerald-300" strokeWidth={1.75} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 capitalize">{currentMonthName}</p>
              </div>

              <div className="group relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Totalt antal klick</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalClicks}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 ring-1 ring-sky-400/20">
                    <TrendingUp className="h-5 w-5 text-sky-300" strokeWidth={1.75} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">Sedan start</p>
              </div>

              <div className="group relative rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Partners i databasen</p>
                    <p className="text-3xl font-bold text-white mt-1">{fullPartners.length}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-400/20">
                    <Building2 className="h-5 w-5 text-amber-300" strokeWidth={1.75} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  <span className="text-amber-300 font-semibold">{fullPartners.filter(p => p.is_featured).length}</span> publicerade
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          <span className="font-medium">All statistik utgår från d365.se</span>
          <span className="text-amber-200/70">– trafik från preview/staging spåras inte och syns inte i siffrorna.</span>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Group selector */}
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-border">
            {tabGroups.map((g) => {
              const isActive = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setActiveGroup(g.id);
                    setActiveTab(g.tabs[0]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60"
                  }`}
                >
                  <g.icon className="h-4 w-4" />
                  {g.label}
                </button>
              );
            })}
          </div>
          <TabsList data-active-group={activeGroup} className="flex-wrap h-auto gap-1.5 bg-slate-900/95 p-2 rounded-2xl border border-slate-700/50 shadow-lg [&_[data-state=active]]:bg-white [&_[data-state=active]]:text-slate-900 [&_[data-state=active]]:shadow-md [&_[data-state=active]_.tab-icon]:bg-slate-900/10 [&_[data-state=active]_.tab-icon]:ring-slate-900/10 [&_[data-state=active]_.tab-icon_svg]:text-slate-900 [&>button]:text-slate-300 [&>button]:rounded-xl [&>button]:px-3 [&>button]:py-2 [&>button]:transition-all [&>button:hover]:text-white [&>button:hover]:bg-white/5">
            <TabsTrigger value="leads" className={`flex items-center gap-2 ${activeGroup === "leads-partners" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-400/20">
                <Inbox className="h-3.5 w-3.5 text-blue-300" strokeWidth={1.75} />
              </span>
              Leads
            </TabsTrigger>
            <TabsTrigger value="clicks" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
                <MousePointerClick className="h-3.5 w-3.5 text-emerald-300" strokeWidth={1.75} />
              </span>
              Partnerklick
            </TabsTrigger>
            <TabsTrigger value="partners" className={`flex items-center gap-2 ${activeGroup === "leads-partners" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-400/20">
                <Building2 className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
              </span>
              Partners
            </TabsTrigger>
            <TabsTrigger value="invitations" className={`flex items-center gap-2 ${activeGroup === "leads-partners" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 ring-1 ring-violet-400/20">
                <MailPlus className="h-3.5 w-3.5 text-violet-300" strokeWidth={1.75} />
              </span>
              Inbjudningar
            </TabsTrigger>
            <TabsTrigger value="events" className={`flex items-center gap-2 ${activeGroup === "innehall" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 ring-1 ring-rose-400/20">
                <CalendarDays className="h-3.5 w-3.5 text-rose-300" strokeWidth={1.75} />
              </span>
              Events
            </TabsTrigger>
            <TabsTrigger value="stats" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 ring-1 ring-cyan-400/20">
                <BarChart3 className="h-3.5 w-3.5 text-cyan-300" strokeWidth={1.75} />
              </span>
              Partnerstatistik
            </TabsTrigger>
            <TabsTrigger value="visitors" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/10 ring-1 ring-sky-400/20">
                <LineChart className="h-3.5 w-3.5 text-sky-300" strokeWidth={1.75} />
              </span>
              Besökare
            </TabsTrigger>
            <TabsTrigger value="all-visitors" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 ring-1 ring-indigo-400/20">
                <Globe className="h-3.5 w-3.5 text-indigo-300" strokeWidth={1.75} />
              </span>
              Alla besökare
            </TabsTrigger>
            <TabsTrigger value="funnel" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-400/20">
                <TrendingUp className="h-3.5 w-3.5 text-orange-300" strokeWidth={1.75} />
              </span>
              Funnel
            </TabsTrigger>
            <TabsTrigger value="summary" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 ring-1 ring-teal-400/20">
                <LayoutDashboard className="h-3.5 w-3.5 text-teal-300" strokeWidth={1.75} />
              </span>
              Emailsammanfattning
            </TabsTrigger>
            <TabsTrigger value="email-log" className={`flex items-center gap-2 ${activeGroup === "statistik" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 ring-1 ring-indigo-400/20">
                <MailCheck className="h-3.5 w-3.5 text-indigo-300" strokeWidth={1.75} />
              </span>
              E-postlogg
            </TabsTrigger>
            <TabsTrigger value="agreement" className={`flex items-center gap-2 ${activeGroup === "leads-partners" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-stone-500/20 to-stone-600/10 ring-1 ring-stone-400/20">
                <ScrollText className="h-3.5 w-3.5 text-stone-200" strokeWidth={1.75} />
              </span>
              Partneravtal
            </TabsTrigger>
            <TabsTrigger value="sales-overview" className={`flex items-center gap-2 ${activeGroup === "salj" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-400/20">
                <Award className="h-3.5 w-3.5 text-orange-300" strokeWidth={1.75} />
              </span>
              Totalöversikt
            </TabsTrigger>
            <TabsTrigger value="sales-pitch" className={`flex items-center gap-2 ${activeGroup === "salj" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 ring-1 ring-pink-400/20">
                <Megaphone className="h-3.5 w-3.5 text-pink-300" strokeWidth={1.75} />
              </span>
              Säljunderlag
            </TabsTrigger>
            <TabsTrigger value="sales-pitch-v2" className={`flex items-center gap-2 ${activeGroup === "salj" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 ring-1 ring-rose-400/20">
                <Mail className="h-3.5 w-3.5 text-rose-300" strokeWidth={1.75} />
              </span>
              Införsäljningsmail
            </TabsTrigger>
            <TabsTrigger value="sales-kpi" className={`flex items-center gap-2 ${activeGroup === "salj" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-lime-500/20 to-lime-600/10 ring-1 ring-lime-400/20">
                <Gauge className="h-3.5 w-3.5 text-lime-300" strokeWidth={1.75} />
              </span>
              Sälj-KPI
            </TabsTrigger>
            <TabsTrigger value="partner-stats-page" className={`flex items-center gap-2 ${activeGroup === "partnerportal" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10 ring-1 ring-fuchsia-400/20">
                <Globe className="h-3.5 w-3.5 text-fuchsia-300" strokeWidth={1.75} />
              </span>
              Partnersida
            </TabsTrigger>
            <TabsTrigger value="partner-agreement-page" className={`flex items-center gap-2 ${activeGroup === "partnerportal" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-zinc-500/20 to-zinc-600/10 ring-1 ring-zinc-400/20">
                <FileSignature className="h-3.5 w-3.5 text-zinc-200" strokeWidth={1.75} />
              </span>
              Avtalssida
            </TabsTrigger>
            <TabsTrigger value="featured-article" className={`flex items-center gap-2 ${activeGroup === "innehall" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-400/20">
                <Sparkles className="h-3.5 w-3.5 text-orange-300" strokeWidth={1.75} />
              </span>
              Nytt i KC
            </TabsTrigger>
            <TabsTrigger value="knowledge-articles" className={`flex items-center gap-2 ${activeGroup === "innehall" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
                <FileText className="h-3.5 w-3.5 text-emerald-300" strokeWidth={1.75} />
              </span>
              Kunskapsartiklar
            </TabsTrigger>
            <TabsTrigger value="industry-pages" className={`flex items-center gap-2 ${activeGroup === "innehall" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-400/20">
                <FileText className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.75} />
              </span>
              Branschsidor
            </TabsTrigger>
            <TabsTrigger value="partner-dashboard" className={`flex items-center gap-2 ${activeGroup === "partnerportal" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 ring-1 ring-cyan-400/20">
                <LayoutDashboard className="h-3.5 w-3.5 text-cyan-300" strokeWidth={1.75} />
              </span>
              Partner-dashboard
            </TabsTrigger>
            <TabsTrigger value="partner-reports" className={`flex items-center gap-2 ${activeGroup === "partnerportal" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
                <Mail className="h-3.5 w-3.5 text-emerald-300" strokeWidth={1.75} />
              </span>
              Månadsrapporter
            </TabsTrigger>
            <TabsTrigger value="seo-rankings" className={`flex items-center gap-2 ${activeGroup === "seo" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/10 ring-1 ring-sky-400/20">
                <LineChart className="h-3.5 w-3.5 text-sky-300" strokeWidth={1.75} />
              </span>
              SEO-rankning
            </TabsTrigger>
            <TabsTrigger value="semrush" className={`flex items-center gap-2 ${activeGroup === "seo" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-400/20">
                <TrendingUp className="h-3.5 w-3.5 text-orange-300" strokeWidth={1.75} />
              </span>
              Semrush
            </TabsTrigger>
            <TabsTrigger value="competitor" className={`flex items-center gap-2 ${activeGroup === "seo" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 ring-1 ring-rose-400/20">
                <TrendingUp className="h-3.5 w-3.5 text-rose-300" strokeWidth={1.75} />
              </span>
              Konkurrent
            </TabsTrigger>
            <TabsTrigger value="gsc" className={`flex items-center gap-2 ${activeGroup === "seo" ? "" : "hidden"}`}>
              <span className="tab-icon p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
                <LineChart className="h-3.5 w-3.5 text-emerald-300" strokeWidth={1.75} />
              </span>
              Search Console
            </TabsTrigger>
          </TabsList>

          {/* ==================== LEADS TAB ==================== */}
          <TabsContent value="leads">
            <Card>
              <CardContent className="pt-6">
                <div className="admin-table-wrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Företag</TableHead>
                      <TableHead>Kontakt</TableHead>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Bransch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Åtgärder</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          Inga leads ännu
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(lead.created_at), "d MMM yyyy", { locale: sv })}
                          </TableCell>
                          <TableCell className="font-medium">{lead.company_name}</TableCell>
                          <TableCell>
                            <div>{lead.contact_name}</div>
                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                          </TableCell>
                          <TableCell>{lead.selected_product || "-"}</TableCell>
                          <TableCell>{lead.industry || "-"}</TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(value) => handleStatusChange(lead.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <Badge variant={statusLabels[lead.status]?.variant || "default"}>
                                  {statusLabels[lead.status]?.label || lead.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusLabels).map(([value, { label }]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setAdminNotes(lead.admin_notes || "");
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setSelectedPartnersForLead(lead.assigned_partners || []);
                                  setIsForwardDialogOpen(true);
                                }}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteLead(lead.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

{/* ==================== CLICKS TAB ==================== */}
          <TabsContent value="clicks">
            <div className="space-y-6">
              {isLoadingStats ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Laddar statistik...
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Geographic Overview */}
                  {ipStats.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-primary" />
                          Geografisk översikt (anonymiserade IP-prefix)
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Visar fördelning av klick baserat på anonymiserade IP-adresser (endast första två oktetter sparas för GDPR-efterlevnad)
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {ipStats.slice(0, 10).map((stat, idx) => (
                            <div 
                              key={stat.ip_prefix} 
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-muted-foreground">
                                  #{idx + 1}
                                </span>
                                <span className="font-medium font-mono">
                                  {stat.ip_prefix}.*.*
                                </span>
                              </div>
                              <Badge variant="secondary">
                                {stat.clicks} klick
                              </Badge>
                            </div>
                          ))}
                        </div>
                        {ipStats.length > 10 && (
                          <p className="text-sm text-muted-foreground mt-3 text-center">
                            + {ipStats.length - 10} fler IP-regioner
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Monthly Partner Stats */}
                  {getMonthsFromStats().length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Ingen klickstatistik ännu
                      </CardContent>
                    </Card>
                  ) : (
                    getMonthsFromStats().map((month) => (
                      <Card key={month}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="capitalize flex items-center gap-2">
                              <BarChart3 className="h-5 w-5 text-primary" />
                              {formatMonth(month)}
                            </span>
                            <Badge variant="secondary" className="text-base">
                              {getTotalClicksForMonth(month)} klick totalt
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="admin-table-wrap">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Partner</TableHead>
                                <TableHead className="text-right">Klick</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getStatsForMonth(month).map((stat, idx) => (
                                <TableRow key={`${stat.partner_name}-${idx}`}>
                                  <TableCell className="font-medium">{stat.partner_name}</TableCell>
                                  <TableCell className="text-right">
                                    <Badge variant="outline">{stat.clicks}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* ==================== PARTNERS TAB ==================== */}
          <TabsContent value="partners">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button onClick={openCreatePartnerDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Lägg till partner
                </Button>
                <Button variant="outline" onClick={() => {
                  const header = "Partnernamn\tKontaktperson\tE-post\tTelefon\tAdmin-kontakt\tAdmin-e-post\tPublicerad\tInbjuden via mail\tInbjuden men ej profilerad";
                  const rows = fullPartners.map(p => {
                    const invited = everInvitedPartnerIds.has(p.id);
                    const published = !!p.is_featured;
                    return [
                      p.name,
                      p.contactPerson || (p as any).contact_person || '',
                      p.email || '',
                      p.phone || '',
                      p.admin_contact_name || '',
                      p.admin_contact_email || '',
                      published ? 'Ja' : 'Nej',
                      invited ? 'Ja' : 'Nej',
                      invited && !published ? 'Ja' : 'Nej',
                    ].join('\t');
                  });
                  const tsv = [header, ...rows].join('\n');
                  const blob = new Blob(['\uFEFF' + tsv], { type: 'text/tab-separated-values;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `partners-kontakter-${new Date().toISOString().slice(0,10)}.xls`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportera kontakter
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateAllMissingSummaries}
                  disabled={generatingAllSummaries}
                  title="Generera AI-summeringar för alla publicerade partners"
                >
                  <Sparkles className={`mr-2 h-4 w-4 ${generatingAllSummaries ? "animate-pulse" : ""}`} />
                  {generatingAllSummaries ? "Genererar..." : "AI-summera alla"}
                </Button>
                {selectedForWelcome.size > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={sendingWelcome || sendingSalesPitch || sendingProfileRefresh}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Mail className={`mr-2 h-4 w-4 ${(sendingWelcome || sendingSalesPitch || sendingProfileRefresh) ? "animate-pulse" : ""}`} />
                        {(sendingWelcome || sendingSalesPitch || sendingProfileRefresh) ? "Skickar..." : `Skicka mail (${selectedForWelcome.size})`}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-background z-50">
                      <DropdownMenuItem onClick={() => openEmailDialog('welcome')}>
                        <Mail className="mr-2 h-4 w-4" />
                        Välkomstmail (inbjudan)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEmailDialog('profile_refresh')}>
                        <Mail className="mr-2 h-4 w-4" />
                        Profileringslänk (90 dgr)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEmailDialog('sales_pitch')}>
                        <Send className="mr-2 h-4 w-4" />
                        Införsäljningsmail
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {fullPartners.length} partners i databasen
              </p>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2">Snabbfilter</span>
                {([
                  { key: 'all', label: 'Alla', count: fullPartners.length, tone: 'slate' },
                  { key: 'published', label: 'Publicerade', count: fullPartners.filter(p => p.is_featured).length, tone: 'blue' },
                  { key: 'invited_unpublished', label: 'Inbjudna ej publ.', count: fullPartners.filter(p => !p.is_featured && everInvitedPartnerIds.has(p.id)).length, tone: 'violet' },
                  { key: 'not_invited', label: 'Ej inbjudna', count: fullPartners.filter(p => !p.is_featured && !everInvitedPartnerIds.has(p.id)).length, tone: 'amber' },
                  { key: 'agreement_signed', label: 'Avtal tecknat', count: fullPartners.filter(p => (p as any).agreement_signed).length, tone: 'emerald', icon: Award },
                  { key: 'has_email', label: 'Har e-post', count: fullPartners.filter(p => !!(p.admin_contact_email || p.email)).length, tone: 'sky', icon: Mail },
                  { key: 'missing_email', label: 'Saknar e-post', count: fullPartners.filter(p => !(p.admin_contact_email || p.email)).length, tone: 'rose', icon: AlertCircle },
                ] as Array<{ key: typeof partnerStatusFilter; label: string; count: number; tone: string; icon?: typeof Award }>).map(({ key, label, count, tone, icon: Icon }) => {
                  const active = partnerStatusFilter === key;
                  const toneMap: Record<string, { active: string; idle: string; badge: string }> = {
                    slate:   { active: 'bg-slate-900 text-white border-slate-900',     idle: 'bg-white text-slate-700 border-slate-200 hover:border-slate-400',         badge: active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600' },
                    blue:    { active: 'bg-blue-600 text-white border-blue-600',       idle: 'bg-white text-slate-700 border-slate-200 hover:border-blue-400',         badge: active ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700' },
                    violet:  { active: 'bg-violet-600 text-white border-violet-600',   idle: 'bg-white text-slate-700 border-slate-200 hover:border-violet-400',       badge: active ? 'bg-white/20 text-white' : 'bg-violet-50 text-violet-700' },
                    amber:   { active: 'bg-amber-500 text-white border-amber-500',     idle: 'bg-white text-slate-700 border-slate-200 hover:border-amber-400',        badge: active ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700' },
                    emerald: { active: 'bg-emerald-600 text-white border-emerald-600', idle: 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400',      badge: active ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700' },
                    sky:     { active: 'bg-sky-600 text-white border-sky-600',         idle: 'bg-white text-slate-700 border-slate-200 hover:border-sky-400',          badge: active ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-700' },
                    rose:    { active: 'bg-rose-600 text-white border-rose-600',       idle: 'bg-white text-slate-700 border-slate-200 hover:border-rose-400',         badge: active ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700' },
                  };
                  const tones = toneMap[tone];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPartnerStatusFilter(key as typeof partnerStatusFilter)}
                      className={`group inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border text-xs font-medium transition-all ${active ? tones.active + ' shadow-sm' : tones.idle}`}
                    >
                      {Icon && <Icon className="h-3 w-3" strokeWidth={2} />}
                      {label}
                      <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-semibold ${tones.badge}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
                <Separator orientation="vertical" className="h-6 mx-1" />
                <span className="text-xs text-muted-foreground">Sortera:</span>
                <Button
                  variant={partnerSortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setPartnerSortBy('name'); setPartnerSortDir('asc'); }}
                >
                  Namn
                </Button>
                <Button
                  variant={partnerSortBy === 'updated_at' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (partnerSortBy === 'updated_at') {
                      setPartnerSortDir(d => d === 'asc' ? 'desc' : 'asc');
                    } else {
                      setPartnerSortBy('updated_at');
                      setPartnerSortDir('asc');
                    }
                  }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Senast uppdaterad
                  {partnerSortBy === 'updated_at' && (
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {isLoadingFullPartners ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Laddar partners...
                </CardContent>
              </Card>
            ) : fullPartners.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Inga partners i databasen ännu. Lägg till en partner manuellt.
                </CardContent>
              </Card>
            ) : (
              <>
                {(() => {
                  const filtered = fullPartners.filter(p => {
                    if (partnerStatusFilter === 'all') return true;
                    if (partnerStatusFilter === 'published') return p.is_featured;
                    if (partnerStatusFilter === 'invited_unpublished') return !p.is_featured && everInvitedPartnerIds.has(p.id);
                    if (partnerStatusFilter === 'not_invited') return !p.is_featured && !everInvitedPartnerIds.has(p.id);
                    if (partnerStatusFilter === 'agreement_signed') return !!(p as any).agreement_signed;
                    if (partnerStatusFilter === 'has_email') return !!(p.admin_contact_email || p.email);
                    if (partnerStatusFilter === 'missing_email') return !(p.admin_contact_email || p.email);
                    return true;
                  });
                  const selectable = filtered;
                  
                  if (selectable.length === 0) return null;
                  return (
                    <div className="flex items-center gap-3 mb-2">
                      <Checkbox
                        checked={selectable.length > 0 && selectable.every(p => selectedForWelcome.has(p.id))}
                        onCheckedChange={(checked) => {
                          setSelectedForWelcome(prev => {
                            const next = new Set(prev);
                            selectable.forEach(p => { if (checked) next.add(p.id); else next.delete(p.id); });
                            return next;
                          });
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Markera alla ({selectable.length})
                      </span>
                    </div>
                  );
                })()}
              {/* Monthly fee total for published partners */}
              {(() => {
                const publishedPartners = fullPartners.filter(p => p.is_featured);
                const totalFee = publishedPartners.reduce((sum, p) => sum + calcMonthlyFee(p.product_filters), 0);
                if (totalFee === 0) return null;
                return (
                  <div className="flex items-center justify-between p-3 mb-2 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Total månadsintäkt ({publishedPartners.length} publicerade partners)
                    </span>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      {totalFee.toLocaleString('sv-SE')} kr/mån
                    </span>
                  </div>
                );
              })()}
              <div className="grid gap-4">
                {[...fullPartners]
                  .filter(p => {
                    if (partnerStatusFilter === 'all') return true;
                    if (partnerStatusFilter === 'published') return p.is_featured;
                    if (partnerStatusFilter === 'invited_unpublished') return !p.is_featured && everInvitedPartnerIds.has(p.id);
                    if (partnerStatusFilter === 'not_invited') return !p.is_featured && !everInvitedPartnerIds.has(p.id);
                    if (partnerStatusFilter === 'agreement_signed') return !!(p as any).agreement_signed;
                    if (partnerStatusFilter === 'has_email') return !!(p.admin_contact_email || p.email);
                    if (partnerStatusFilter === 'missing_email') return !(p.admin_contact_email || p.email);
                    return true;
                  })
                  .sort((a, b) => {
                  if (partnerSortBy === 'updated_at') {
                    const diff = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                    return partnerSortDir === 'asc' ? diff : -diff;
                  }
                  const diff = a.name.localeCompare(b.name, 'sv');
                  return partnerSortDir === 'asc' ? diff : -diff;
                }).map((partner) => (
                  <Card 
                    key={partner.id}
                    className={partner.is_featured 
                      ? "border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-md shadow-emerald-500/20" 
                      : "border border-border"
                    }
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedForWelcome.has(partner.id)}
                            onCheckedChange={(checked) => {
                              setSelectedForWelcome(prev => {
                                const next = new Set(prev);
                                if (checked) next.add(partner.id); else next.delete(partner.id);
                                return next;
                              });
                            }}
                            className="mt-1"
                            title="Markera för utskick"
                          />
                          {partner.logo_url ? (
                            <img 
                              src={partner.logo_url} 
                              alt={partner.name} 
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {partner.name}
                              {partner.is_featured && (
                                <Badge className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">✓ Publicerad</Badge>
                              )}
                              {(partner as any).agreement_signed && (
                                <Badge
                                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                                  title={(partner as any).agreement_notes || "Avtal tecknat"}
                                >
                                  <Award className="h-3 w-3 mr-1" />
                                  Avtal tecknat
                                </Badge>
                              )}
                              {openInvitations[partner.id] && (
                                <Badge variant="outline" className="text-xs border-amber-500 text-amber-700 dark:text-amber-400" title={openInvitations[partner.id].email}>
                                  <MailPlus className="h-3 w-3 mr-1" />
                                  {openInvitations[partner.id].status === 'submitted' ? 'Inskickad' : 'Inbjuden'}
                                  <span className="ml-1 font-normal text-muted-foreground">({openInvitations[partner.id].email})</span>
                                </Badge>
                              )}
                              {agreementEmails[partner.name?.toLowerCase().trim()] && (() => {
                                const ae = agreementEmails[partner.name.toLowerCase().trim()];
                                const isProspect = ae.template === 'partner_prospect_agreement';
                                const dateStr = new Date(ae.sent_at).toLocaleDateString('sv-SE').replace(/-/g, '/');
                                return (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-purple-500 text-purple-700 dark:text-purple-400"
                                    title={`${ae.recipient} • ${new Date(ae.sent_at).toLocaleString('sv-SE')}`}
                                  >
                                    <Award className="h-3 w-3 mr-1" />
                                    {isProspect ? 'Avtal (prospect)' : 'Avtal skickat'}
                                    <span className="ml-1 font-normal text-muted-foreground">({dateStr})</span>
                                  </Badge>
                                );
                              })()}
                              {partnerEmailHistory[partner.name?.toLowerCase().trim()] && (() => {
                                const eh = partnerEmailHistory[partner.name.toLowerCase().trim()];
                                const labels: Record<string, string> = {
                                  partner_welcome: "Välkomst",
                                  partner_invitation: "Inbjudan",
                                  partner_reminder: "Påminnelse",
                                  partner_bulk_invitation: "Bulkinbjudan",
                                  partner_sales_pitch: "Införsäljning",
                                  partner_profile_refresh: "Profileringslänk",
                                  partner_agreement: "Partneravtal",
                                  partner_prospect_agreement: "Avtal (prospect)",
                                  lead_forward: "Lead",
                                };
                                const dateStr = new Date(eh.lastSentAt).toLocaleDateString('sv-SE').replace(/-/g, '/');
                                const tplList = Array.from(eh.templates).map(t => labels[t] || t).join(', ');
                                return (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-blue-500 text-blue-700 dark:text-blue-400"
                                    title={`${eh.count} mail totalt till ${eh.lastRecipient}\nMailtyper: ${tplList}\nSenast: ${new Date(eh.lastSentAt).toLocaleString('sv-SE')}`}
                                  >
                                    <Mail className="h-3 w-3 mr-1" />
                                    {eh.count} mail • {labels[eh.lastTemplate] || eh.lastTemplate} ({dateStr})
                                  </Badge>
                                );
                              })()}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {partner.description || "Ingen beskrivning"}
                            </p>
                            {(partner.admin_contact_name || partner.admin_contact_email || partner.contactPerson || (partner as any).contact_person || partner.email) && (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                                {/* Show which email receives outgoing communications */}
                                <span className="flex items-center gap-1 font-medium text-foreground/80">
                                  <Mail className="h-3 w-3" />
                                  Utskick: {partner.admin_contact_email || partner.email || <span className="text-destructive">Saknas</span>}
                                </span>
                                {(partner.admin_contact_name || partner.admin_contact_email) && (
                                  <>
                                    <span className="font-medium text-foreground/70">Admin:</span>
                                    {partner.admin_contact_name && (
                                      <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {partner.admin_contact_name}
                                      </span>
                                    )}
                                    {partner.admin_contact_email && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {partner.admin_contact_email}
                                      </span>
                                    )}
                                  </>
                                )}
                                {(partner.contactPerson || (partner as any).contact_person || partner.email) && (
                                  <>
                                    <span className="font-medium text-foreground/70">Profil:</span>
                                    {(partner.contactPerson || (partner as any).contact_person) && (
                                      <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {partner.contactPerson || (partner as any).contact_person}
                                      </span>
                                    )}
                                    {partner.email && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {partner.email}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {productSections.map(section => {
                                const filter = partner.product_filters?.[section.key];
                                if (!filter || (filter.industries?.length === 0 && filter.secondaryIndustries?.length === 0)) return null;
                                return (
                                  <Badge key={section.key} variant="outline" className="text-xs">
                                    <img src={section.icon} alt="" aria-hidden="true" className="h-3 w-3 mr-1 inline-block" />
                                    {section.label}
                                  </Badge>
                                );
                              })}
                            </div>
                            {(() => {
                              const allInds = new Set<string>();
                              productSections.forEach(section => {
                                const filter = partner.product_filters?.[section.key];
                                filter?.industries?.forEach((ind: string) => allInds.add(ind));
                              });
                              if (allInds.size === 0) return null;
                              return (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Array.from(allInds).sort((a, b) => a.localeCompare(b, 'sv')).map(ind => (
                                    <Badge key={ind} variant="secondary" className="text-xs font-normal">
                                      {ind}
                                    </Badge>
                                  ))}
                                </div>
                              );
                            })()}
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                              {/* Updated at - always show */}
                              {(() => {
                                const daysSinceUpdate = Math.floor((Date.now() - new Date(partner.updated_at).getTime()) / (1000 * 60 * 60 * 24));
                                const isOld = daysSinceUpdate > 60;
                                const isStale = daysSinceUpdate > 30;
                                return (
                                  <span className={`flex items-center gap-1 ${isOld ? 'text-destructive font-medium' : isStale ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                                    <Clock className="h-3 w-3" />
                                    Uppdaterad: {format(new Date(partner.updated_at), "d MMM yyyy", { locale: sv })}
                                    {isOld && <span className="ml-1">({daysSinceUpdate} dagar sedan)</span>}
                                    {isStale && !isOld && <span className="ml-1">({daysSinceUpdate} d)</span>}
                                  </span>
                                );
                              })()}
                              {partner.activation_date && (
                                <span className="flex items-center gap-1">
                                  <CalendarCheck className="h-3 w-3" />
                                  {format(new Date(partner.activation_date), "yyyy-MM-dd")}
                                </span>
                              )}
                              {(() => {
                                const fee = calcMonthlyFee(partner.product_filters);
                                return fee > 0 ? (
                                  <span className="flex items-center gap-1 font-medium">
                                    {fee.toLocaleString('sv-SE')} kr/mån
                                  </span>
                                ) : null;
                              })()}
                              {partner.org_number && (
                                <span className="flex items-center gap-1">
                                  Orgnr: {partner.org_number}
                                </span>
                              )}
                              {partner.legal_name && (
                                <span className="flex items-center gap-1">
                                  {partner.legal_name}
                                </span>
                              )}
                              {(!partner.org_number || !partner.legal_name) && (
                                <span className="flex items-center gap-1 text-amber-500">
                                  {!partner.org_number && !partner.legal_name ? "Orgnr & bolagsnamn saknas" : !partner.org_number ? "Orgnr saknas" : "Bolagsnamn saknas"}
                                </span>
                              )}
                              {partner.cancellation_date && (
                                <span className="flex items-center gap-1 text-destructive">
                                  <CalendarX className="h-3 w-3" />
                                  Uppsägning: {format(new Date(partner.cancellation_date), "d MMM yyyy", { locale: sv })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {partner.is_featured && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyPermanentProfileLink(partner.id, partner.name)}
                              title="Kopiera permanent profileringslänk"
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          )}
                          {partner.is_featured && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateSummary(partner.id, partner.name)}
                              disabled={generatingSummaryId === partner.id}
                              title={(partner as any).ai_summary ? "Regenerera AI-summering" : "Generera AI-summering"}
                              className={(partner as any).ai_summary ? "" : "border-amber-400 text-amber-700"}
                            >
                              <Sparkles className={`h-4 w-4 ${generatingSummaryId === partner.id ? "animate-pulse" : ""}`} />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditPartnerDialog(partner)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirmId(partner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </>
            )}
          </TabsContent>

          {/* ==================== INVITATIONS TAB ==================== */}
          <TabsContent value="invitations">
            <PartnerInvitationsTab 
              token={token || ""} 
              partners={fullPartners.map(p => ({ id: p.id, name: p.name, slug: p.slug, email: p.email || "", admin_contact_email: p.admin_contact_email || "", is_featured: p.is_featured ?? false, contact_person: p.contactPerson || "" }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          {/* ==================== EVENTS TAB ==================== */}
          <TabsContent value="events">
            <AdminEventsTab
              token={token || ""}
              partners={fullPartners.map(p => ({ id: p.id, name: p.name, is_featured: p.is_featured || false, slug: p.slug, email: p.email || "", admin_contact_email: p.admin_contact_email || "" }))}
              onSessionExpired={logout}
            />
          </TabsContent>

          {/* ==================== PARTNER STATISTICS TAB ==================== */}
          <TabsContent value="stats">
            <div className="space-y-6">
              {/* Featured Partners Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Publicerade Partners
                  </CardTitle>
                  <CardDescription>
                    Partners som visas publikt på sajten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold text-emerald-600">
                      {fullPartners.filter(p => p.is_featured).length}
                    </div>
                    <div className="text-muted-foreground">
                      av {fullPartners.length} totalt
                    </div>
                  </div>
                  <Progress 
                    value={(fullPartners.filter(p => p.is_featured).length / Math.max(fullPartners.length, 1)) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              {/* Industry Distribution per Product */}
              {productSections.map((product) => {
                // Get industry counts for this product among featured partners
                const featuredPartners = fullPartners.filter(p => p.is_featured);
                const industryCounts: Record<string, number> = {};
                
                featuredPartners.forEach(partner => {
                  const productFilter = partner.product_filters?.[product.key];
                  if (productFilter?.industries) {
                    productFilter.industries.forEach((industry: string) => {
                      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
                    });
                  }
                });
                
                const sortedIndustries = Object.entries(industryCounts)
                  .sort((a, b) => b[1] - a[1]);
                
                const partnersWithProduct = featuredPartners.filter(
                  p => p.product_filters?.[product.key]
                ).length;
                
                return (
                  <Card key={product.key}>
                    <CardHeader className={`${product.colorClass} text-white rounded-t-lg`}>
                      <CardTitle className="flex items-center gap-3">
                        <img src={product.icon} alt="" aria-hidden="true" className="h-6 w-6 brightness-0 invert" />
                        {product.label}
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        {partnersWithProduct} publicerade partners har denna produkt
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {sortedIndustries.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          Inga branscher angivna för denna produkt
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {sortedIndustries.map(([industry, count]) => (
                            <div key={industry} className="flex items-center justify-between">
                              <span className="text-sm">{industry}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-full ${product.colorClass}`}
                                    style={{ width: `${(count / partnersWithProduct) * 100}%` }}
                                  />
                                </div>
                                <Badge variant="secondary" className="min-w-[2.5rem] justify-center">
                                  {count}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Specialty Products Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Övriga produkter
                  </CardTitle>
                  <CardDescription>
                    Antal publicerade partners per specialprodukt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const featuredPartners = fullPartners.filter(p => p.is_featured);
                    
                    const productCounts = specialtyProducts.map(product => {
                      const count = featuredPartners.filter(p => 
                        p.applications?.includes(product)
                      ).length;
                      return { product, count };
                    });
                    
                    return (
                      <div className="space-y-3">
                        {productCounts.map(({ product, count }) => (
                          <div key={product} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <img 
                                src={specialtyProductIcons[product]} 
                                alt={product} 
                                className="h-6 w-6"
                              />
                              <span className="font-medium">{product}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500"
                                  style={{ width: `${(count / Math.max(featuredPartners.length, 1)) * 100}%` }}
                                />
                              </div>
                              <Badge variant="secondary" className="min-w-[2.5rem] justify-center">
                                {count}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* All Industries Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Branschtäckning totalt
                  </CardTitle>
                  <CardDescription>
                    Antal publicerade partners per bransch (över alla produkter)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const featuredPartners = fullPartners.filter(p => p.is_featured);
                    const allIndustryCounts: Record<string, number> = {};
                    
                    featuredPartners.forEach(partner => {
                      // Count industries from all product filters
                      Object.values(partner.product_filters || {}).forEach((filter: any) => {
                        if (filter?.industries) {
                          filter.industries.forEach((industry: string) => {
                            allIndustryCounts[industry] = (allIndustryCounts[industry] || 0) + 1;
                          });
                        }
                      });
                    });
                    
                    const sortedAll = Object.entries(allIndustryCounts)
                      .sort((a, b) => b[1] - a[1]);
                    
                    if (sortedAll.length === 0) {
                      return (
                        <p className="text-muted-foreground text-sm">
                          Inga branscher angivna
                        </p>
                      );
                    }
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sortedAll.map(([industry, count]) => (
                          <div 
                            key={industry} 
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                          >
                            <span className="text-sm">{industry}</span>
                            <Badge variant="outline">{count} partner{count !== 1 ? 's' : ''}</Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ==================== VISITOR STATS TAB ==================== */}
          <TabsContent value="visitors">
            <div className="mb-6">
              <SiteTrafficStatsCard token={token} variant="full" />
            </div>
            <Card>
              <CardContent className="pt-6">
                <AdminVisitorStatsTab 
                  token={token || ""}
                  onSessionExpired={logout}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== ALL VISITORS (SNITCHER) TAB ==================== */}
          <TabsContent value="all-visitors">
            <AdminAllVisitorsTab token={token || null} />
          </TabsContent>

          {/* ==================== FUNNEL TAB ==================== */}
          <TabsContent value="funnel">
            <AdminFunnelTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== EMAIL SUMMARY TAB ==================== */}
          <TabsContent value="summary">
            <AdminStatsSummary
              token={token || ""}
              onSessionExpired={logout}
            />
          </TabsContent>

          {/* ==================== EMAIL LOG TAB ==================== */}
          <TabsContent value="email-log">
            <AdminEmailLogTab
              token={token || ""}
              onSessionExpired={logout}
            />
          </TabsContent>

          {/* ==================== AGREEMENT TAB ==================== */}
          <TabsContent value="agreement">
            <AdminAgreementTab
              partners={fullPartners}
              token={token}
              onRefresh={fetchFullPartners}
              logout={logout}
            />
          </TabsContent>

          {/* ==================== SALES OVERVIEW TAB ==================== */}
          <TabsContent value="sales-overview">
            <AdminSalesOverview
              token={token || ""}
              onSessionExpired={logout}
            />
          </TabsContent>

          {/* ==================== SALES PITCH TAB ==================== */}
          <TabsContent value="sales-pitch">
            <AdminSalesPitchTab />
          </TabsContent>

          {/* ==================== SALES PITCH V2 TAB ==================== */}
          <TabsContent value="sales-pitch-v2">
            <AdminSalesPitchV2Tab token={token || ""} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== SALES KPI TAB ==================== */}
          <TabsContent value="sales-kpi">
            <AdminSalesKpiTab token={token || ""} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== PARTNER STATS PAGE TAB ==================== */}
          <TabsContent value="partner-stats-page">
            <AdminPartnerStatsTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== PARTNER AGREEMENT PAGE TAB ==================== */}
          <TabsContent value="partner-agreement-page">
            <AdminPartnerAgreementTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== FEATURED ARTICLE TAB ==================== */}
          <TabsContent value="featured-article">
            <AdminFeaturedArticleTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="knowledge-articles">
            <AdminKnowledgeArticlesTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="industry-pages">
            <AdminIndustryPagesTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="partner-dashboard">
            <AdminPartnerDashboardTab token={token || null} />
          </TabsContent>

          {/* ==================== PARTNER REPORTS TAB ==================== */}
          <TabsContent value="partner-reports">
            <AdminPartnerReportsTab token={token || null} />
          </TabsContent>

          {/* ==================== SEO RANKINGS TAB ==================== */}
          <TabsContent value="seo-rankings">
            <AdminSeoRankingsTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          {/* ==================== SEMRUSH TAB ==================== */}
          <TabsContent value="semrush">
            <AdminSemrushTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="competitor">
            <AdminCompetitorTab token={token || null} onSessionExpired={logout} />
          </TabsContent>

          <TabsContent value="gsc">
            <AdminGscTab token={token || null} onSessionExpired={logout} />
          </TabsContent>
        </Tabs>

        {/* ==================== LEAD VIEW DIALOG ==================== */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lead: {selectedLead?.company_name}</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Kontaktperson</Label>
                    <p className="font-medium">{selectedLead.contact_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-post</Label>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefon</Label>
                    <p className="font-medium">{selectedLead.phone || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Företagsstorlek</Label>
                    <p className="font-medium">{selectedLead.company_size || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bransch</Label>
                    <p className="font-medium">{selectedLead.industry || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Produkt</Label>
                    <p className="font-medium">{selectedLead.selected_product || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Källa</Label>
                    <p className="font-medium">{selectedLead.source_page || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Inkom</Label>
                    <p className="font-medium">
                      {format(new Date(selectedLead.created_at), "d MMMM yyyy HH:mm", { locale: sv })}
                    </p>
                  </div>
                </div>

                {selectedLead.message && (
                  <div>
                    <Label className="text-muted-foreground">Meddelande</Label>
                    <p className="mt-1 p-3 bg-muted rounded-md">{selectedLead.message}</p>
                  </div>
                )}

                {selectedLead.assigned_partners?.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Tilldelade partners</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLead.assigned_partners.map((partner) => (
                        <Badge key={partner} variant="secondary">{partner}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Adminanteckningar</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                    placeholder="Lägg till anteckningar..."
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Stäng
                  </Button>
                  <Button onClick={handleSaveNotes}>
                    Spara anteckningar
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ==================== FORWARD LEAD DIALOG ==================== */}
        <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vidarebefordra lead till partners</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Välj vilka partners som ska ta emot denna lead. Varje partner kommer få ett mail med kundens kontaktuppgifter.
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {fullPartners.map((partner) => (
                  <div key={partner.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={partner.name}
                      checked={selectedPartnersForLead.includes(partner.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPartnersForLead([...selectedPartnersForLead, partner.name]);
                        } else {
                          setSelectedPartnersForLead(selectedPartnersForLead.filter(p => p !== partner.name));
                        }
                      }}
                    />
                    <label htmlFor={partner.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {partner.name}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsForwardDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleForward} disabled={selectedPartnersForLead.length === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  Skicka till {selectedPartnersForLead.length} partner{selectedPartnersForLead.length !== 1 ? "s" : ""}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ==================== PARTNER CREATE/EDIT DIALOG ==================== */}
        <Dialog open={isPartnerDialogOpen} onOpenChange={() => {}}>
          <DialogContent 
            className="fixed inset-4 max-w-none w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-h-none overflow-hidden flex flex-col"
            style={{ transform: 'none', left: '1rem', top: '1rem' }}
            onPointerDownOutside={(e) => e.preventDefault()} 
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0">
              <DialogTitle>
                {editingPartner ? "Redigera partner" : "Lägg till partner"}
              </DialogTitle>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPartnerDialogOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <span className="sr-only">Stäng</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </DialogHeader>

            {/* Progress and Section Navigation */}
            <div className="flex-shrink-0 border-b pb-4 mb-4 space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Formulärstatus</span>
                  <span className="font-medium">{formCompletion.completed}/{formCompletion.total} sektioner</span>
                </div>
                <Progress value={formCompletion.percentage} className="h-2" />
              </div>
              
              {/* Section Navigation */}
              <div className="flex flex-wrap gap-2">
                {formSections.map((section, index) => {
                  const status = getSectionStatus(section.id);
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(index)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                        ${activeFormSection === index 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-muted hover:bg-muted/80'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{section.label}</span>
                      {status === 'complete' && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      {status === 'partial' && (
                        <Circle className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handlePartnerSubmit} className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Top save button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={createPartner.isPending || updatePartner.isPending}>
                  {editingPartner ? "Spara ändringar" : "Skapa partner"}
                </Button>
              </div>

              {/* Permanent self-service link (only for published partners) */}
              {editingPartner && editingPartner.is_featured && (
                <div className="rounded-lg border bg-muted/40 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-semibold">Permanent profileringslänk</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Partnern kan när som helst använda denna länk för att uppdatera sin profil — utan utgångsdatum.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyPermanentProfileLink(editingPartner.id, editingPartner.name)}
                  >
                    Kopiera länk
                  </Button>
                </div>
              )}

              {/* View statistics (only when editing existing partner) */}
              {editingPartner && (
                <PartnerViewStatsCard
                  partnerSlug={editingPartner.slug}
                  partnerName={editingPartner.name}
                  variant="admin"
                  adminToken={token}
                />
              )}

              {/* Global site traffic (compact) – dold tills vidare, visas i fliken Visitor Stats */}

              {/* Section 1: Admin Info (moved to top for easy administration) */}
              <PremiumCollapsibleSection
                title="Administrativt"
                description="Organisation, fakturering, avtal och status"
                icon={Lock}
                accent="amber"
                status={getSectionStatus('admin')}
                open={openSections.admin}
                onOpenChange={(o) => setSectionOpen('admin', o)}
                sectionRef={(el) => (sectionRefs.current[0] = el)}
              >

                {/* Org Number & Legal Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_number">Organisationsnummer</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="org_number"
                        value={partnerFormData.org_number || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, org_number: e.target.value })
                        }
                        className="pl-10"
                        placeholder="556xxx-xxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="legal_name">Juridiskt bolagsnamn</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="legal_name"
                        value={partnerFormData.legal_name || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, legal_name: e.target.value })
                        }
                        className="pl-10"
                        placeholder="Företaget AB"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="admin_contact_name">Administrativ kontaktperson</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin_contact_name"
                        value={partnerFormData.admin_contact_name || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, admin_contact_name: e.target.value })
                        }
                        className="pl-10"
                        placeholder="Namn på kontaktperson"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="admin_contact_email">Administrativ e-post</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin_contact_email"
                        type="email"
                        value={partnerFormData.admin_contact_email || ""}
                        onChange={(e) => {
                          setPartnerFormData({ ...partnerFormData, admin_contact_email: e.target.value });
                          if (formErrors.admin_contact_email) setFormErrors({ ...formErrors, admin_contact_email: undefined });
                        }}
                        className={`pl-10 ${formErrors.admin_contact_email ? "border-destructive" : ""}`}
                        placeholder="admin@example.com"
                      />
                    </div>
                    {formErrors.admin_contact_email && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.admin_contact_email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Invoice Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoice_contact">Fakturakontakt (namn)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="invoice_contact"
                        value={partnerFormData.invoice_contact || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, invoice_contact: e.target.value })
                        }
                        className="pl-10"
                        placeholder="Namn på fakturamottagare"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="invoice_email">Faktura e-post</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="invoice_email"
                        type="email"
                        value={partnerFormData.invoice_email || ""}
                        onChange={(e) => {
                          setPartnerFormData({ ...partnerFormData, invoice_email: e.target.value });
                          if (formErrors.invoice_email) setFormErrors({ ...formErrors, invoice_email: undefined });
                        }}
                        className={`pl-10 ${formErrors.invoice_email ? "border-destructive" : ""}`}
                        placeholder="faktura@example.com"
                      />
                    </div>
                    {formErrors.invoice_email && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.invoice_email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="activation_date">Första faktureringsdatum</Label>
                    <SwedishDatePicker
                      id="activation_date"
                      value={partnerFormData.activation_date}
                      onChange={(val) =>
                        setPartnerFormData({ ...partnerFormData, activation_date: val })
                      }
                      icon={<CalendarCheck className="mr-2 h-4 w-4 text-muted-foreground" />}
                      placeholder="Välj datum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cancellation_date">Uppsägningsdatum</Label>
                    <SwedishDatePicker
                      id="cancellation_date"
                      value={partnerFormData.cancellation_date}
                      onChange={(val) =>
                        setPartnerFormData({ ...partnerFormData, cancellation_date: val })
                      }
                      icon={<CalendarX className="mr-2 h-4 w-4 text-muted-foreground" />}
                      placeholder="Välj datum"
                    />
                  </div>
                  <div>
                    <Label>Månadsavgift (beräknad)</Label>
                    {(() => {
                      let bcActive = false;
                      let fscActive = false;
                      let salesActive = false;
                      let serviceActive = false;
                      
                      productSections.forEach(section => {
                        const filter = partnerFormData.product_filters?.[section.key];
                        const industries = filter?.industries || [];
                        
                        if (industries.length > 0) {
                          if (section.key === 'bc') bcActive = true;
                          else if (section.key === 'fsc') fscActive = true;
                          else if (section.key === 'sales') salesActive = true;
                          else if (section.key === 'service') serviceActive = true;
                        }
                      });
                      
                      let activeProducts = 0;
                      if (bcActive) activeProducts++;
                      if (fscActive) activeProducts++;
                      if (salesActive || serviceActive) activeProducts++;
                      
                      const priceTiers: Record<number, number> = { 0: 0, 1: 995, 2: 1595, 3: 1995 };
                      const totalFee = priceTiers[Math.min(activeProducts, 3)] ?? 1995;
                      const crmBundleBoth = salesActive && serviceActive;
                      
                      return (
                        <div className="mt-1 p-3 bg-muted/50 rounded-md border">
                          <p className="text-2xl font-bold text-foreground">
                            {totalFee.toLocaleString('sv-SE')} kr/mån
                          </p>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <p>{activeProducts} produkt(er) = {totalFee.toLocaleString('sv-SE')} kr/mån</p>
                            <p className="text-muted-foreground/70">1 prod: 995 kr · 2 prod: 1 595 kr · 3 prod: 1 995 kr</p>
                            {crmBundleBoth && (
                              <p className="text-primary italic">Sales + Service räknas som 1 produkt</p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <Label htmlFor="admin_notes">Interna noteringar</Label>
                  <Textarea
                    id="admin_notes"
                    value={partnerFormData.admin_notes || ""}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, admin_notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Interna anteckningar som inte visas publikt..."
                  />
                </div>

                <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="agreement_signed"
                      checked={!!partnerFormData.agreement_signed}
                      onCheckedChange={(checked) =>
                        setPartnerFormData({ ...partnerFormData, agreement_signed: !!checked })
                      }
                    />
                    <Label htmlFor="agreement_signed" className="font-medium cursor-pointer flex items-center gap-2">
                      <Award className="h-4 w-4 text-emerald-600" />
                      Avtal tecknat med partner
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="agreement_notes" className="text-sm">Intern kommentar om avtalet</Label>
                    <Textarea
                      id="agreement_notes"
                      value={partnerFormData.agreement_notes || ""}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, agreement_notes: e.target.value })
                      }
                      rows={2}
                      placeholder="T.ex. Avtalet gäller i 6 månader, särskilda villkor, förlängningsdatum..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_featured"
                    checked={partnerFormData.is_featured}
                    onCheckedChange={(checked) =>
                      setPartnerFormData({ ...partnerFormData, is_featured: !!checked })
                    }
                  />
                  <Label htmlFor="is_featured">Publicerad partner</Label>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Pris- och betalningsvillkor</h4>
                  <p className="text-sm text-muted-foreground">
                    Månadsavgiften faktureras löpande i förskott. Uppsägningstiden är 3 (tre) månader och skall meddelas i god tid före varje kvartals början.
                  </p>
                </div>
              </PremiumCollapsibleSection>

              <Separator />

              {/* Section 2: Basic Info */}
              <PremiumCollapsibleSection
                title="Grunduppgifter"
                description="Företagsnamn, logotyp, beskrivning & video"
                icon={Building2}
                accent="business-central"
                status={getSectionStatus('basic')}
                open={openSections.basic}
                onOpenChange={(o) => setSectionOpen('basic', o)}
                sectionRef={(el) => (sectionRefs.current[1] = el)}
              >
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Namn *</Label>
                    <Input
                      id="name"
                      value={partnerFormData.name}
                      onChange={(e) => {
                        setPartnerFormData({ ...partnerFormData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className={formErrors.name ? "border-destructive" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={partnerFormData.slug}
                      onChange={(e) =>
                        setPartnerFormData({ ...partnerFormData, slug: e.target.value })
                      }
                      placeholder={generateSlug(partnerFormData.name) || "genereras-automatiskt"}
                    />
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <Label>Logotyp</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {partnerFormData.logo_url ? (
                      <img 
                        src={partnerFormData.logo_url} 
                        alt="Logo" 
                        className="h-16 w-16 object-contain border rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingLogo}
                      >
                        <Upload className={`mr-2 h-4 w-4 ${isUploadingLogo ? "animate-spin" : ""}`} />
                        {isUploadingLogo ? "Laddar upp..." : "Ladda upp logo"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG, WebP eller SVG. Max 5MB.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="logo_url" className="text-xs text-muted-foreground">Eller ange URL direkt:</Label>
                    <Input
                      id="logo_url"
                      type="url"
                      value={partnerFormData.logo_url}
                      onChange={(e) => {
                        setPartnerFormData({ ...partnerFormData, logo_url: e.target.value });
                        if (formErrors.logo_url) setFormErrors({ ...formErrors, logo_url: undefined });
                      }}
                      placeholder="https://example.com/logo.png"
                      className={`mt-1 ${formErrors.logo_url ? "border-destructive" : ""}`}
                    />
                    {formErrors.logo_url && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.logo_url}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Beskrivning</Label>
                  <Textarea
                    id="description"
                    value={partnerFormData.description}
                    onChange={(e) => {
                      setPartnerFormData({ ...partnerFormData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                    }}
                    rows={3}
                    className={formErrors.description ? "border-destructive" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Hemsida/Landsida (visas på Partnerprofilkortet) *</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      value={partnerFormData.website}
                      onChange={(e) => {
                        setPartnerFormData({ ...partnerFormData, website: e.target.value });
                        if (formErrors.website) setFormErrors({ ...formErrors, website: undefined });
                      }}
                      placeholder="https://example.com"
                      className={`pl-10 ${formErrors.website ? "border-destructive" : ""}`}
                    />
                  </div>
                  {formErrors.website && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.website}
                    </p>
                  )}
                </div>
              </PremiumCollapsibleSection>
              <PremiumCollapsibleSection
                title="Kontaktuppgifter"
                description="Visas på Partnerprofilkortet"
                icon={User}
                accent="crm"
                status={getSectionStatus('contact')}
                open={openSections.contact}
                onOpenChange={(o) => setSectionOpen('contact', o)}
                sectionRef={(el) => (sectionRefs.current[2] = el)}
              >
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Säljare/Säljansvarig</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactPerson"
                        value={partnerFormData.contactPerson}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, contactPerson: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={partnerFormData.phone}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, phone: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-post</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={partnerFormData.email}
                        onChange={(e) => {
                          setPartnerFormData({ ...partnerFormData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                        }}
                        className={`pl-10 ${formErrors.email ? "border-destructive" : ""}`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Photo Upload */}
                <div className="space-y-2">
                  <Label>Foto på kundkontakt (visas på partnerprofilen)</Label>
                  <div className="flex items-center gap-4">
                    {partnerFormData.contact_photo_url ? (
                      <img
                        src={partnerFormData.contact_photo_url}
                        alt="Kundkontakt foto"
                        className="h-20 w-20 object-cover rounded-full border-2 border-border shadow-sm"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-border">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        ref={contactPhotoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleContactPhotoUpload}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => contactPhotoInputRef.current?.click()}
                          disabled={isUploadingContactPhoto}
                        >
                          <Upload className={`mr-2 h-4 w-4 ${isUploadingContactPhoto ? "animate-spin" : ""}`} />
                          {isUploadingContactPhoto ? "Laddar upp..." : (partnerFormData.contact_photo_url ? "Byt foto" : "Ladda upp foto")}
                        </Button>
                        {partnerFormData.contact_photo_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPartnerFormData({ ...partnerFormData, contact_photo_url: "" })}
                          >
                            Ta bort
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Porträttfoto av säljaren/kundkontakten. JPEG, PNG eller WebP. Max 5MB. Visas som rund profilbild på partnerprofilen.
                      </p>
                    </div>
                  </div>
                </div>

                {/* YouTube intro video */}
                <div className="space-y-2">
                  <Label htmlFor="youtube_video_id">YouTube-video (kort introduktion, valfritt)</Label>
                  <Input
                    id="youtube_video_id"
                    placeholder="https://youtu.be/dQw4w9WgXcQ eller bara video-ID"
                    value={partnerFormData.youtube_video_id || ""}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, youtube_video_id: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Klistra in en YouTube-länk eller video-ID. Visas som play-knapp på kontaktfotot på partnerprofilen. Rekommenderad längd: 30–60 sekunder.
                  </p>
                </div>
              </PremiumCollapsibleSection>
              <PremiumCollapsibleSection
                title="Geografisk täckning"
                description="Visas överst på Partnerprofilkortet"
                icon={Globe}
                accent="finance-supply"
                status={getSectionStatus('geography')}
                open={openSections.geography}
                onOpenChange={(o) => setSectionOpen('geography', o)}
                sectionRef={(el) => (sectionRefs.current[3] = el)}
              >
                <p className="text-sm text-muted-foreground">Inom vilka geografier har ni möjlighet att leverera projekt och support?</p>
                <div className="flex flex-wrap gap-2">
                  {geographyOptions.map((geo) => {
                    const isSelected = (partnerFormData.geography || []).includes(geo);
                    return (
                      <Badge
                        key={geo}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer text-sm py-1.5 px-3"
                        onClick={() => {
                          const current = partnerFormData.geography || [];
                          if (isSelected) {
                            setPartnerFormData({ 
                              ...partnerFormData, 
                              geography: getFilteredGeography(geo, current) 
                            });
                          } else {
                            setPartnerFormData({ 
                              ...partnerFormData, 
                              geography: getCascadingGeography(geo, current) 
                            });
                          }
                        }}
                      >
                        {geo}
                      </Badge>
                    );
                  })}
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="office_cities" className="font-medium">Kontorsstäder (kommaseparerade)</Label>
                  <Input
                    id="office_cities"
                    defaultValue={(partnerFormData as any).office_cities?.join(', ') || ''}
                    key={`cities-${editingPartner?.id || 'new'}`}
                    onBlur={(e) => {
                      const cities = e.target.value.split(',').map((c: string) => c.trim()).filter(Boolean);
                      setPartnerFormData({ ...partnerFormData, office_cities: cities } as any);
                    }}
                    placeholder="Stockholm, Göteborg, Malmö"
                  />
                  <p className="text-xs text-muted-foreground">Ange städer separerade med komma (max 20)</p>
                </div>

                {/* Map URL */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor="map_url" className="font-medium">Google Maps-karta (URL)</Label>
                  <Input
                    id="map_url"
                    value={(partnerFormData as any).map_url || ''}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, map_url: e.target.value } as any)}
                    placeholder="https://www.google.com/maps/d/edit?mid=..."
                  />
                  <p className="text-xs text-muted-foreground">Länk till Google My Maps som bäddas in på partnerprofilen</p>
                </div>
              </PremiumCollapsibleSection>

              <Separator />

              {/* Section 5: Product Sections */}
              <PremiumCollapsibleSection
                title="Produktsektioner"
                description="Välj max 3 fokusbranscher per produkt"
                icon={FileText}
                accent="primary"
                status={getSectionStatus('products')}
                open={openSections.products}
                onOpenChange={(o) => setSectionOpen('products', o)}
                sectionRef={(el) => (sectionRefs.current[4] = el)}
              >
                <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">
                    <strong>Klicka på produktnamnet</strong> för att fälla ut och fylla i information för det produktområde partnern erbjuder. Hoppa över de produkter som inte är aktuella.
                  </p>
                </div>

                <div className="space-y-4">
                  {productSections.map((section) => {
                    const filter = getProductFilter(section.key);
                    const isActive = isProductActive(section.key);
                    const isOpen = !!openProducts[section.key];

                    return (
                      <Card
                        key={section.key}
                        className={`overflow-hidden transition-all ${isActive ? "ring-2 ring-offset-2 shadow-md" : "shadow-sm hover:shadow-md"}`}
                        style={{ borderColor: `hsl(var(--${section.key === 'bc' ? 'business-central' : section.key === 'fsc' ? 'finance-supply' : section.key === 'sales' ? 'crm' : 'customer-service'}))` }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleProduct(section.key)}
                          aria-expanded={isOpen}
                          className={`w-full text-left ${section.colorClass} text-white ${isOpen ? '' : 'rounded-b-lg'} rounded-t-lg transition-opacity hover:opacity-95`}
                        >
                          <div className="px-6 py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={section.icon} alt={section.label} className="h-8 w-8 object-contain shrink-0" />
                              <div className="min-w-0">
                                <div className="text-lg sm:text-xl font-bold flex items-center gap-2 flex-wrap">
                                  <span className="truncate">{section.label}</span>
                                  {isActive ? (
                                    <Badge variant="secondary" className="text-[10px] bg-white/25 text-white border-white/40">Ifylld</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px] bg-white/15 text-white/90 border-white/30">Ej ifylld</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-white/85 mt-0.5">
                                  {isOpen ? 'Klicka för att fälla ihop' : (isActive ? 'Klicka för att redigera' : 'Klicka för att fylla i om partnern erbjuder detta')}
                                </p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-white shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                          {isOpen && (
                            <div className="px-6 pb-4 flex flex-wrap gap-2">
                              {section.apps.map((app) => (
                                <Badge key={app} variant="secondary" className="text-xs font-normal bg-white/20 text-white border-white/30">
                                  Dynamics 365 {app}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </button>
                        {isOpen && (
                        <CardContent className="space-y-4 pt-5">
                          <div>
                            <Label className="text-sm">Kort beskrivning av erbjudande</Label>
                            <Input
                              placeholder={
                                section.key === 'bc' 
                                  ? "T.ex. 'Specialiserade på tillverkande företag med fokus på lageroptimering'"
                                  : section.key === 'fsc'
                                  ? "T.ex. 'Experter på koncernkonsolidering och supply chain för stora organisationer'"
                                  : section.key === 'sales'
                                  ? "T.ex. 'Fokus på säljautomation och pipeline-hantering för B2B-företag'"
                                  : "T.ex. 'Specialister på omnikanal-support och Field Service för serviceorganisationer'"
                              }
                              defaultValue={filter.productDescription || ''}
                              key={`${section.key}-productDescription-${editingPartner?.id || 'new'}`}
                              onBlur={(e) => {
                                updateProductFilter(section.key, { productDescription: e.target.value.trim() });
                              }}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Max ~100 tecken rekommenderas</p>
                          </div>

                          {/* Sales Contact for this product area */}
                          <div className="rounded-lg border border-border p-3 space-y-3">
                            <Label className="text-sm font-semibold">Säljkontakt för {section.label}</Label>
                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Namn</Label>
                                <Input
                                  placeholder="Anna Svensson"
                                  defaultValue={filter.contactName || ''}
                                  key={`${section.key}-contactName-${editingPartner?.id || 'new'}`}
                                  onBlur={(e) => updateProductFilter(section.key, { contactName: e.target.value.trim() })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">E-post</Label>
                                <Input
                                  type="email"
                                  placeholder="anna@foretag.se"
                                  defaultValue={filter.contactEmail || ''}
                                  key={`${section.key}-contactEmail-${editingPartner?.id || 'new'}`}
                                  onBlur={(e) => updateProductFilter(section.key, { contactEmail: e.target.value.trim() })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Telefon</Label>
                                <Input
                                  placeholder="070-123 45 67"
                                  defaultValue={filter.contactPhone || ''}
                                  key={`${section.key}-contactPhone-${editingPartner?.id || 'new'}`}
                                  onBlur={(e) => updateProductFilter(section.key, { contactPhone: e.target.value.trim() })}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            {/* Per-product contact photo */}
                            <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                              {filter.contactPhotoUrl ? (
                                <img
                                  src={filter.contactPhotoUrl}
                                  alt="Foto"
                                  className="h-14 w-14 object-cover rounded-full border-2 border-border shadow-sm"
                                />
                              ) : (
                                <div className="h-14 w-14 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-border">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1">
                                <Label className="text-xs text-muted-foreground">Foto av säljkontakt (valfritt)</Label>
                                <div className="flex gap-2 mt-1">
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => handleProductContactPhotoUpload(section.key, e)}
                                    className="hidden"
                                    id={`product-photo-${section.key}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingProductPhoto === section.key}
                                    onClick={() => document.getElementById(`product-photo-${section.key}`)?.click()}
                                  >
                                    <Upload className={`mr-2 h-3.5 w-3.5 ${uploadingProductPhoto === section.key ? "animate-spin" : ""}`} />
                                    {uploadingProductPhoto === section.key
                                      ? "Laddar upp..."
                                      : (filter.contactPhotoUrl ? "Byt foto" : "Ladda upp foto")}
                                  </Button>
                                  {filter.contactPhotoUrl && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateProductFilter(section.key, { contactPhotoUrl: '' })}
                                    >
                                      Ta bort
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Lämna tomt för att använda partnerns huvudkontakt.
                                </p>
                              </div>
                            </div>

                            {/* Per-product YouTube video */}
                            <div className="pt-2 border-t border-border/60">
                              <Label className="text-xs text-muted-foreground">YouTube-video för {section.label} (valfritt)</Label>
                              <Input
                                placeholder="https://youtu.be/... eller video-ID"
                                defaultValue={filter.youtubeVideoId || ''}
                                key={`${section.key}-youtubeVideoId-${editingPartner?.id || 'new'}`}
                                onBlur={(e) => updateProductFilter(section.key, { youtubeVideoId: e.target.value.trim() })}
                                className="mt-1"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Lämna tomt för att använda partnerns huvudvideo (om någon).
                              </p>
                            </div>

                            {/* Per-product landing page URL */}
                            <div className="pt-2 border-t border-border/60">
                              <Label className="text-xs text-muted-foreground">Landningssida för {section.label} (valfritt)</Label>
                              <Input
                                type="url"
                                placeholder="https://partner.se/dynamics-365-..."
                                defaultValue={filter.landingPageUrl || ''}
                                key={`${section.key}-landingPageUrl-${editingPartner?.id || 'new'}`}
                                onBlur={(e) => updateProductFilter(section.key, { landingPageUrl: e.target.value.trim() })}
                                className="mt-1"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Visas som knappen "Läs mer om [produkten] på [partnernamn] hemsida" på partnerprofilen och i partnerlistor. Klick spåras.
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm">Branschfokus</Label>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${filter.industries.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {filter.industries.length}/3
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {allIndustries.map((ind) => (
                                <Badge
                                  key={ind}
                                  variant={filter.industries.includes(ind) ? "default" : "outline"}
                                  className="cursor-pointer text-xs"
                                  onClick={() => toggleProductIndustry(section.key, ind)}
                                >
                                  {ind}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Målgrupp – kundens storlek (frivilligt) */}
                          <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/30">
                            <div>
                              <Label className="text-sm font-semibold">Målgrupp – kundstorlek (frivilligt)</Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Markera vilka kundsegment ni typiskt vänder er till för {section.label}. Detta används som ett mjukt filter när kunder söker partner.
                              </p>
                              <div className="mt-2 rounded-md bg-background/70 border border-border/60 p-2 text-xs text-muted-foreground space-y-1">
                                <p>
                                  <span className="font-medium text-foreground">Tomt fält = matchar alla.</span> Om ni inte markerar något visas ni för kunder oavsett storlek (vi straffar inte tystnad).
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">Markerade värden = era målsegment.</span> Ni visas tydligare för kunder som matchar något av era val. Kunder utanför era val kan fortfarande se er, men utan extra framhävning.
                                </p>
                                <p>
                                  Tips: markera bara om ni har en uttalad målgrupp – annars är det bättre att lämna tomt.
                                </p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Antal anställda</Label>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {companySizes.map((size) => {
                                  const isSelected = (filter.companySize || []).includes(size);
                                  return (
                                    <Badge
                                      key={size}
                                      variant={isSelected ? "default" : "outline"}
                                      className="cursor-pointer text-xs"
                                      onClick={() => {
                                        const current = filter.companySize || [];
                                        const next = isSelected
                                          ? current.filter((s) => s !== size)
                                          : [...current, size];
                                        updateProductFilter(section.key, { companySize: next });
                                      }}
                                    >
                                      {size}
                                    </Badge>
                                  );
                                })}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1.5">
                                Inget val = ni matchar kunder av alla storlekar.
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Omsättning (MSEK)</Label>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {revenueOptions.map((rev) => {
                                  const isSelected = (filter.revenue || []).includes(rev);
                                  return (
                                    <Badge
                                      key={rev}
                                      variant={isSelected ? "default" : "outline"}
                                      className="cursor-pointer text-xs"
                                      onClick={() => {
                                        const current = filter.revenue || [];
                                        const next = isSelected
                                          ? current.filter((r) => r !== rev)
                                          : [...current, rev];
                                        updateProductFilter(section.key, { revenue: next });
                                      }}
                                    >
                                      {rev}
                                    </Badge>
                                  );
                                })}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1.5">
                                Inget val = ni matchar kunder oavsett omsättning.
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Kundexempel (Ange kundnamn, separerade med kommatecken. Om fältet lämnas tomt visas "Kundexempel kan ges på förfrågan".)</Label>
                            <Input
                              placeholder="Volvo, IKEA, Scania..."
                              defaultValue={(filter.customerExamples || []).join(', ')}
                              key={`${section.key}-customerExamples-${editingPartner?.id || 'new'}`}
                              onBlur={(e) => {
                                const examples = e.target.value
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(s => s.length > 0);
                                updateProductFilter(section.key, { customerExamples: examples });
                              }}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="text-sm">Länk till kundcase (vill ni stoltsera med kundcase, får ni gärna lägga in länken till dessa nedan)</Label>
                            <Input
                              placeholder="https://partner.se/kundcase1, https://partner.se/kundcase2"
                              defaultValue={(filter.customerCaseLinks || []).join(', ')}
                              key={`${section.key}-customerCaseLinks-${editingPartner?.id || 'new'}`}
                              onBlur={(e) => {
                                const links = e.target.value
                                  .split(',')
                                  .map(s => s.trim())
                                  .filter(s => s.length > 0);
                                updateProductFilter(section.key, { customerCaseLinks: links });
                              }}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Separera flera länkar med komma</p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm">Geografisk täckning</Label>
                              <p className="text-xs text-muted-foreground mb-2">Markera de geografier där ni har möjlighet att hantera kundprojekt och support/förvaltning</p>
                              <div className="flex flex-wrap gap-1.5">
                                {geographyOptions.map((geo) => {
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
                                        updateProductFilter(section.key, { geography: newGeo });
                                      }}
                                    >
                                      {geo}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                            
                          </div>

                          {/* AI Capabilities Section */}
                          <div className="pt-4 border-t border-border">
                            <Label className="text-sm font-semibold">
                              AI & Automation inom {section.key === 'bc' ? 'Business Central' : section.key === 'fsc' ? 'Finance & Supply Chain' : section.key === 'sales' ? 'Sälj & Marknad' : 'Kundservice & Field Service'}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1 mb-3">Vilken typ av AI-lösningar har partnern levererat inom denna applikation?</p>
                            
                            <div className="space-y-5">
                              {getAiOptionsForProduct(section.key).map((tierGroup) => (
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
                                          (filter.aiCapabilities || []).includes(option.value)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/40'
                                        }`}
                                      >
                                        <Checkbox
                                          checked={(filter.aiCapabilities || []).includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            const current = filter.aiCapabilities || [];
                                            const updated = checked
                                              ? [...current, option.value]
                                              : current.filter((v: string) => v !== option.value);
                                            updateProductFilter(section.key, { aiCapabilities: updated });
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
                                          placeholder="Annat – beskriv egenutvecklad lösning"
                                          value={filter.aiOtherPartner || ''}
                                          maxLength={200}
                                          onChange={(e) => updateProductFilter(section.key, { aiOtherPartner: e.target.value })}
                                          className="text-sm"
                                        />
                                      </div>
                                    )}
                                    {tierGroup.emoji === "🔴" && (
                                      <div className="mt-2">
                                        <Input
                                          placeholder="Annat – beskriv avancerad AI-lösning"
                                          value={filter.aiOtherAdvanced || ''}
                                          maxLength={200}
                                          onChange={(e) => updateProductFilter(section.key, { aiOtherAdvanced: e.target.value })}
                                          className="text-sm"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {(filter.aiCapabilities || []).length > 0 && (
                              <div className="mt-4 ml-2 pl-4 border-l-2 border-primary/30 space-y-4">
                                {(filter.aiCapabilities || []).includes("sales-std-segmentation") && (
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
                                            checked={(filter.aiSegmentationDetails || []).includes(opt.value)}
                                            onCheckedChange={(checked) => {
                                              const current = filter.aiSegmentationDetails || [];
                                              const updated = checked
                                                ? [...current, opt.value]
                                                : current.filter((v: string) => v !== opt.value);
                                              updateProductFilter(section.key, { aiSegmentationDetails: updated });
                                            }}
                                          />
                                          <span className="text-sm">{opt.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {(filter.aiCapabilities || []).includes("svc-adv-predictive") && (
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
                                            checked={(filter.aiPredictiveDetails || []).includes(opt.value)}
                                            onCheckedChange={(checked) => {
                                              const current = filter.aiPredictiveDetails || [];
                                              const updated = checked
                                                ? [...current, opt.value]
                                                : current.filter((v: string) => v !== opt.value);
                                              updateProductFilter(section.key, { aiPredictiveDetails: updated });
                                            }}
                                          />
                                          <span className="text-sm">{opt.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <Label className="text-sm">Antal AI-relaterade projekt senaste 24 månader</Label>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {["0–2", "3–5", "6+"].map((option) => (
                                      <button
                                        key={option}
                                        type="button"
                                        onClick={() => updateProductFilter(section.key, { aiProjectCount: option })}
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
                                    placeholder="T.ex. 'Implementerade Copilot för att automatisera offertförslag'"
                                    value={filter.aiCaseDescription || ''}
                                    maxLength={200}
                                    onChange={(e) => updateProductFilter(section.key, { aiCaseDescription: e.target.value })}
                                    className="mt-2"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {(filter.aiCaseDescription || '').length}/200 tecken
                                  </p>
                                </div>

                                {(filter.aiCapabilities || []).some((c: string) => c.includes('-adv-') || c === 'ai-advanced') && (
                                  <div className="p-3 rounded-lg border-2 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
                                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                                      🔴 Kravfält för Avancerad AI
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                                      Beskriv kort vilken affärseffekt lösningen skapade
                                    </p>
                                    <Input
                                      placeholder="T.ex. 'Minskade lagerkostnader med 18% genom prediktiv modell'"
                                      value={filter.aiBusinessImpact || ''}
                                      maxLength={200}
                                      onChange={(e) => updateProductFilter(section.key, { aiBusinessImpact: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {(filter.aiBusinessImpact || '').length}/200 tecken
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                        </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>

                {/* Specialty Products Section */}
                <Card className="mt-6">
                  <CardHeader className="pb-4 bg-slate-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                      <FileText className="h-8 w-8" />
                      Övriga produkter
                    </CardTitle>
                    <p className="text-sm text-white/80 mt-1">
                      Markera de produkter som ni kan erbjuda (alla branscher är tillämpliga här)
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3">
                      {specialtyProducts.map((product) => {
                        const isSelected = (partnerFormData.applications || []).includes(product);
                        const icon = specialtyProductIcons[product];
                        return (
                          <button
                            key={product}
                            type="button"
                            onClick={() => {
                              const current = partnerFormData.applications || [];
                              const newApps = isSelected
                                ? current.filter(a => a !== product)
                                : [...current, product];
                              setPartnerFormData({ ...partnerFormData, applications: newApps });
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
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
                  </CardContent>
                </Card>
              </PremiumCollapsibleSection>

              {/* Industry Pitches Section */}
              {(() => {
                const productsPerIndustry: Record<string, string[]> = {};
                const industriesSet = new Set<string>();
                productSections.forEach((section) => {
                  const inds = partnerFormData.product_filters?.[section.key]?.industries || [];
                  inds.forEach((ind) => {
                    industriesSet.add(ind);
                    if (!productsPerIndustry[ind]) productsPerIndustry[ind] = [];
                    if (!productsPerIndustry[ind].includes(section.label)) {
                      productsPerIndustry[ind].push(section.label);
                    }
                  });
                });
                const industriesList = Array.from(industriesSet);
                const pitchCount = industryPitches.filter((p) => p.text?.trim()).length;
                return (
                  <PremiumCollapsibleSection
                    title="Branschpitchar"
                    description="Korta branschspecifika texter som visas på branschsidor och partnerprofilen. Generera AI-förslag och redigera fritt."
                    icon={Sparkles}
                    accent="primary"
                    status={industriesList.length === 0 ? 'empty' : (pitchCount === 0 ? 'empty' : (pitchCount >= industriesList.length ? 'complete' : 'partial'))}
                    open={openSections.pitches}
                    onOpenChange={(o) => setSectionOpen('pitches', o)}
                    badge={pitchCount > 0 ? <Badge variant="outline">{pitchCount} pitchar</Badge> : undefined}
                  >
                    <div className="space-y-6">
                      <PartnerIndustryPitchesEditor
                        industries={industriesList}
                        productsPerIndustry={productsPerIndustry}
                        value={industryPitches}
                        onChange={setIndustryPitches}
                        adminToken={token || null}
                        partnerId={editingPartner?.id || null}
                      />
                      <div className="pt-4 border-t border-border">
                        <PartnerIndustryPitchPreview
                          partnerName={partnerFormData.name}
                          generalDescription={partnerFormData.description}
                          industries={industriesList}
                          productsPerIndustry={productsPerIndustry}
                          pitches={industryPitches}
                        />
                      </div>
                    </div>
                  </PremiumCollapsibleSection>
                );
              })()}

              {/* Industry Apps Section */}
              <PremiumCollapsibleSection
                title="Branschapplikationer"
                description="Certifierade tillägg från Microsoft Marketplace"
                icon={Link}
                accent="copilot"
                status={industryApps.length > 0 ? 'complete' : 'empty'}
                open={openSections.industryApps}
                onOpenChange={(o) => setSectionOpen('industryApps', o)}
              >
                  {industryApps.map((app, index) => (
                    <div key={index} className="relative p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                      <button
                        type="button"
                        onClick={() => setIndustryApps(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-3">
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
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Dynamics 365-applikation</Label>
                          <select
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={app.industry}
                            onChange={(e) => {
                              const updated = [...industryApps];
                              updated[index] = { ...updated[index], industry: e.target.value };
                              setIndustryApps(updated);
                            }}
                          >
                            <option value="">Välj bransch...</option>
                            {allIndustries.map(ind => (
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
                      Inga branschappar tillagda ännu.
                    </p>
                  )}
              </PremiumCollapsibleSection>



              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPartnerDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={createPartner.isPending || updatePartner.isPending}>
                  {editingPartner ? "Spara ändringar" : "Skapa partner"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ==================== DELETE PARTNER CONFIRMATION DIALOG ==================== */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ta bort partner?</DialogTitle>
            </DialogHeader>
            <p>Är du säker på att du vill ta bort denna partner? Detta kan inte ångras.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Avbryt
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmId && handleDeletePartner(deleteConfirmId)}
                disabled={deletePartner.isPending}
              >
                Ta bort
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Send Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {emailDialogType === 'welcome' && 'Skicka välkomstmail'}
                {emailDialogType === 'sales_pitch' && 'Skicka införsäljningsmail'}
                {emailDialogType === 'profile_refresh' && 'Skicka profileringslänk (90 dgr)'}
                {' '}({selectedForWelcome.size})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <div><strong>Platshållare:</strong></div>
                <div><code>{'{{NAME}}'}</code> – ersätts med partnerns namn</div>
                <div><code>{'{{INVITATION_LINK}}'}</code> – ersätts med personlig länk + knapp (krävs)</div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Ämne</Label>
                <Input
                  value={emailCustomSubject}
                  onChange={(e) => setEmailCustomSubject(e.target.value)}
                  placeholder="Ämnesrad"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Innehåll</Label>
                <Textarea
                  value={emailCustomBody}
                  onChange={(e) => setEmailCustomBody(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Mottagaradresser ({selectedForWelcome.size})</p>
                <p className="text-xs text-muted-foreground">Bekräfta eller justera e-post per partner.</p>
                {fullPartners.filter(p => selectedForWelcome.has(p.id)).map(p => (
                  <div key={p.id} className="flex flex-col gap-1">
                    <Label className="text-xs">{p.name}</Label>
                    <Input
                      type="email"
                      placeholder="namn@foretag.se"
                      value={emailOverrides[p.id] || ""}
                      onChange={(e) => setEmailOverrides(prev => ({ ...prev, [p.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Avbryt
              </Button>
              <Button
                onClick={sendEmailsFromDialog}
                disabled={sendingWelcome || sendingSalesPitch || sendingProfileRefresh}
                className={emailDialogType === 'sales_pitch' ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              >
                {(sendingWelcome || sendingSalesPitch || sendingProfileRefresh) ? "Skickar..." : `Skicka till ${selectedForWelcome.size}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;