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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { partners as staticPartners, allIndustries, geographyOptions, getCumulativeGeographyDisplay } from "@/data/partners";
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
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

// Icons for specialty products
const specialtyProductIcons: Record<string, string> = {
  "Project Operations": FinanceIcon,
  "Commerce": SupplyChainIcon,
  "Human Resources": CustomerServiceIcon,
};

import {
  Eye, Send, Trash2, RefreshCw, LogOut, BarChart3, MousePointerClick,
  Users, Building2, Plus, Pencil, Upload, Lock, TrendingUp, Calendar, Inbox, Globe, 
  ImageIcon, User, Phone, Mail, Link, FileText, CalendarCheck, CalendarX, AlertCircle,
  CheckCircle2, Circle, ArrowRight, MailPlus
} from "lucide-react";
import PartnerInvitationsTab from "@/components/PartnerInvitationsTab";
import { z } from "zod";

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
});

type PartnerFormErrors = Partial<Record<keyof z.infer<typeof partnerValidationSchema>, string>>;

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

// ==================== COMPONENT ====================

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, token, login, logout } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();
  const [editingPartner, setEditingPartner] = useState<FullPartner | null>(null);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [formErrors, setFormErrors] = useState<PartnerFormErrors>({});
  const [activeFormSection, setActiveFormSection] = useState(0);
  
  // Section refs for navigation
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  };

  const [partnerFormData, setPartnerFormData] = useState<PartnerInput & {
    activation_date?: string;
    monthly_fee?: number;
    cancellation_date?: string;
    admin_notes?: string;
    admin_contact_name?: string;
    admin_contact_email?: string;
  }>({
    slug: "",
    name: "",
    description: "",
    logo_url: "",
    website: "",
    email: "",
    contactPerson: "",
    phone: "",
    address: "",
    applications: [],
    industries: [],
    secondary_industries: [],
    geography: ["Sverige"],
    product_filters: {},
    is_featured: false,
    activation_date: "",
    monthly_fee: undefined,
    cancellation_date: "",
    admin_notes: "",
    admin_contact_name: "",
    admin_contact_email: "",
  });

  // ==================== LEAD FUNCTIONS ====================

  const fetchLeads = async () => {
    if (!token) return;
    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: { action: "list", token },
      });

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
      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: { action: "click-stats", token },
      });

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

      if (error) throw error;
      if (data.error) {
        if (data.error.includes("gått ut") || data.error.includes("session")) {
          logout();
        }
        throw new Error(data.error);
      }
      setFullPartners(data.partners || []);
    } catch (error: any) {
      console.error("Error fetching full partners:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta fullständig partnerdata",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFullPartners(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchLeads();
      fetchClickStats();
      fetchFullPartners();
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
      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: { action: "update", token, id: leadId, status },
      });

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
      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: { action: "update", token, id: selectedLead.id, admin_notes: adminNotes },
      });

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

      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: {
          action: "forward",
          token,
          id: selectedLead.id,
          partner_emails: partnerEmails,
          partner_names: selectedPartnersForLead,
        },
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
      const { data, error } = await supabase.functions.invoke("manage-leads", {
        body: { action: "delete", token, id: leadId },
      });

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
      phone: "",
      address: "",
      applications: [],
      industries: [],
      secondary_industries: [],
      geography: ["Sverige"],
      product_filters: {},
      is_featured: false,
      activation_date: "",
      monthly_fee: undefined,
      cancellation_date: "",
      admin_notes: "",
      admin_contact_name: "",
      admin_contact_email: "",
    });
    setEditingPartner(null);
    setFormErrors({});
  };

  const openCreatePartnerDialog = () => {
    resetPartnerForm();
    setIsPartnerDialogOpen(true);
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
      phone: partner.phone || "",
      address: partner.address || "",
      applications: partner.applications || [],
      industries: partner.industries || [],
      secondary_industries: partner.secondary_industries || [],
      geography: partner.geography || ["Sverige"],
      product_filters: partner.product_filters || {},
      is_featured: partner.is_featured || false,
      activation_date: partner.activation_date || "",
      monthly_fee: partner.monthly_fee || undefined,
      cancellation_date: partner.cancellation_date || "",
      admin_notes: partner.admin_notes || "",
      admin_contact_name: (partner as any).admin_contact_name || "",
      admin_contact_email: (partner as any).admin_contact_email || "",
    });
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
      const dataToSend = {
        ...partnerFormData,
        applications: [...new Set(applications)], // Deduplicate
        slug: partnerFormData.slug || generateSlug(partnerFormData.name),
      };

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

  // Form sections for navigation
  const formSections = [
    { id: 'basic', label: 'Grunduppgifter', icon: Building2 },
    { id: 'contact', label: 'Kontaktuppgifter', icon: User },
    { id: 'geography', label: 'Geografi', icon: Globe },
    { id: 'products', label: 'Produkter', icon: FileText },
    { id: 'admin', label: 'Administrativt', icon: Lock },
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

  // Scroll to section
  const scrollToSection = (index: number) => {
    setActiveFormSection(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={logout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logga ut
            </Button>
            <Button onClick={refreshAll} variant="outline" disabled={isLoadingLeads || isLoadingStats || isLoadingPartners}>
              <RefreshCw className={`mr-2 h-4 w-4 ${(isLoadingLeads || isLoadingStats || isLoadingPartners) ? "animate-spin" : ""}`} />
              Uppdatera
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totalt antal leads</p>
                  <p className="text-3xl font-bold">{leads.length}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Inbox className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {newLeadsCount} nya, {forwardedLeadsCount} vidarebefordrade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Klick denna månad</p>
                  <p className="text-3xl font-bold">{clicksThisMonth}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <MousePointerClick className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 capitalize">
                {currentMonthName}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totalt antal klick</p>
                  <p className="text-3xl font-bold">{totalClicks}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Sedan start
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partners i databasen</p>
                  <p className="text-3xl font-bold">{fullPartners.length}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Building2 className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {fullPartners.filter(p => p.is_featured).length} utvalda
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="clicks" className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              Partnerklick
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <MailPlus className="h-4 w-4" />
              Inbjudningar
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Partnerstatistik
            </TabsTrigger>
          </TabsList>

          {/* ==================== LEADS TAB ==================== */}
          <TabsContent value="leads">
            <Card>
              <CardContent className="pt-6">
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
              </div>
              <p className="text-sm text-muted-foreground">
                {fullPartners.length} partners i databasen
              </p>
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
              <div className="grid gap-4">
                {fullPartners.map((partner) => (
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
                                <Badge className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">✓ Utvald</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {partner.description || "Ingen beskrivning"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {productSections.map(section => {
                                const filter = partner.product_filters?.[section.key];
                                if (!filter || (filter.industries?.length === 0 && filter.secondaryIndustries?.length === 0)) return null;
                                return (
                                  <Badge key={section.key} variant="outline" className="text-xs">
                                    {section.label}
                                  </Badge>
                                );
                              })}
                            </div>
                            {(partner.activation_date || partner.monthly_fee) && (
                              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                {partner.activation_date && (
                                  <span className="flex items-center gap-1">
                                    <CalendarCheck className="h-3 w-3" />
                                    {format(new Date(partner.activation_date), "d MMM yyyy", { locale: sv })}
                                  </span>
                                )}
                                {partner.monthly_fee && (
                                  <span className="flex items-center gap-1">
                                    {partner.monthly_fee} kr/mån
                                  </span>
                                )}
                                {partner.cancellation_date && (
                                  <span className="flex items-center gap-1 text-destructive">
                                    <CalendarX className="h-3 w-3" />
                                    Uppsägning: {format(new Date(partner.cancellation_date), "d MMM yyyy", { locale: sv })}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
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
            )}
          </TabsContent>

          {/* ==================== INVITATIONS TAB ==================== */}
          <TabsContent value="invitations">
            <PartnerInvitationsTab 
              token={token || ""} 
              partners={fullPartners.map(p => ({ id: p.id, name: p.name, slug: p.slug }))}
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
                    Utvalda Partners
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
                        <img src={product.icon} alt="" className="h-6 w-6 brightness-0 invert" />
                        {product.label}
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        {partnersWithProduct} utvalda partners har denna produkt
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

              {/* All Industries Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Branschtäckning totalt
                  </CardTitle>
                  <CardDescription>
                    Antal utvalda partners per bransch (över alla produkter)
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
                {staticPartners.map((partner) => (
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
              {/* Section 1: Basic Info */}
              <div ref={el => sectionRefs.current[0] = el} className="space-y-4 scroll-mt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                  <Building2 className="h-5 w-5 text-primary" />
                  Grunduppgifter
                  {getSectionStatus('basic') === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </h3>
                
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
                  <Label htmlFor="website">Hemsida *</Label>
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
              </div>

              <Separator />

              {/* Section 2: Contact Info */}
              <div ref={el => sectionRefs.current[1] = el} className="space-y-4 scroll-mt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                  <User className="h-5 w-5 text-primary" />
                  Kontaktuppgifter
                  {getSectionStatus('contact') === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </h3>
                
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
              </div>

              <Separator />

              {/* Section 3: Geographic Coverage */}
              <div ref={el => sectionRefs.current[2] = el} className="space-y-4 scroll-mt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                  <Globe className="h-5 w-5 text-primary" />
                  Geografisk täckning
                  {getSectionStatus('geography') === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </h3>
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
                              geography: current.filter(g => g !== geo) 
                            });
                          } else {
                            setPartnerFormData({ 
                              ...partnerFormData, 
                              geography: [...current, geo] 
                            });
                          }
                        }}
                      >
                        {geo}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Section 4: Product Sections */}
              <div ref={el => sectionRefs.current[3] = el} className="space-y-4 scroll-mt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                  <FileText className="h-5 w-5 text-primary" />
                  Produktsektioner
                  {getSectionStatus('products') === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Välj max 3 fokusbranscher för varje produkt partnern erbjuder.
                </p>

                <div className="space-y-6">
                  {productSections.map((section) => {
                    const filter = getProductFilter(section.key);
                    const isActive = isProductActive(section.key);
                    
                    return (
                      <Card key={section.key} className={`${isActive ? "ring-2 ring-offset-2" : ""}`} style={{ borderColor: `hsl(var(--${section.key === 'bc' ? 'business-central' : section.key === 'fsc' ? 'finance-supply' : section.key === 'sales' ? 'crm' : 'customer-service'}))` }}>
                        <CardHeader className={`pb-4 ${section.colorClass} text-white rounded-t-lg`}>
                          <CardTitle className="text-xl font-bold flex items-center justify-between">
                            <span className="flex items-center gap-3">
                              <img src={section.icon} alt={section.label} className="h-8 w-8 object-contain" />
                              {section.label}
                            </span>
                            {isActive && <Badge variant="secondary" className="text-xs">Aktiv</Badge>}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {section.apps.map((app) => (
                              <Badge key={app} variant="secondary" className="text-xs font-normal bg-white/20 text-white border-white/30">
                                Dynamics 365 {app}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                          

                          <div>
                            <Label className="text-sm">Kundexempel (Ange kundnamn med kommatecken mellan alternativt endast "Kundexempel kan ges på förfrågan")</Label>
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
                                          ? current.filter(g => g !== geo)
                                          : [...current, geo];
                                        updateProductFilter(section.key, { geography: newGeo });
                                      }}
                                    >
                                      {geo}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {(filter.geography || []).includes("Sverige") && (
                              <div className="space-y-4">
                                {/* Sweden Regions */}
                                <div>
                                  <Label className="text-sm">Regioner i Sverige</Label>
                                  <p className="text-xs text-muted-foreground mb-2">Välj vilka regioner ni täcker i Sverige, dvs där ni har lokal leveransförmåga.</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {(["Storstockholm / Mälardalen", "Syd / Sydväst", "Väst", "Sydost", "Mellansverige", "Norr"] as const).map((region) => {
                                      const isSelected = (filter.swedenRegions || []).includes(region);
                                      return (
                                        <button
                                          key={region}
                                          type="button"
                                          onClick={() => {
                                            const current = filter.swedenRegions || [];
                                            const updated = isSelected
                                              ? current.filter(r => r !== region)
                                              : [...current, region];
                                            updateProductFilter(section.key, { swedenRegions: updated });
                                          }}
                                          className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                                            isSelected
                                              ? 'bg-primary text-primary-foreground border-primary'
                                              : 'bg-card border-border hover:border-primary/50'
                                          }`}
                                        >
                                          {region}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
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
                      Markera de produkter partnern erbjuder (alla branscher är tillämpliga)
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
              </div>

              <Separator />

              {/* Section 5: Admin Info */}
              <div ref={el => sectionRefs.current[4] = el} className="space-y-4 scroll-mt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 sticky top-0 bg-background py-2 z-10 border-b">
                  <Lock className="h-5 w-5 text-primary" />
                  Administrativt
                  {getSectionStatus('admin') === 'complete' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </h3>

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
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="activation_date">Aktiveringsdatum</Label>
                    <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="activation_date"
                        type="date"
                        value={partnerFormData.activation_date || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, activation_date: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cancellation_date">Uppsägningsdatum</Label>
                    <div className="relative">
                      <CalendarX className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cancellation_date"
                        type="date"
                        value={partnerFormData.cancellation_date || ""}
                        onChange={(e) =>
                          setPartnerFormData({ ...partnerFormData, cancellation_date: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Månadsavgift (beräknad)</Label>
                    {(() => {
                      // Count active products
                      // Sales & Customer Insights and Customer Service count as ONE product together (CRM bundle)
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
                      
                      // Count products: BC=1, FSC=1, CRM (Sales OR Service)=1
                      let activeProducts = 0;
                      
                      if (bcActive) activeProducts++;
                      if (fscActive) activeProducts++;
                      // CRM bundle: Sales and Service together count as ONE product
                      if (salesActive || serviceActive) activeProducts++;
                      
                      const totalFee = activeProducts * 1990;
                      const crmBundleBoth = salesActive && serviceActive;
                      
                      return (
                        <div className="mt-1 p-3 bg-muted/50 rounded-md border">
                          <p className="text-2xl font-bold text-foreground">
                            {totalFee.toLocaleString('sv-SE')} kr/mån
                          </p>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <p>{activeProducts} produkt(er) × 1 990 kr = {totalFee.toLocaleString('sv-SE')} kr</p>
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

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_featured"
                    checked={partnerFormData.is_featured}
                    onCheckedChange={(checked) =>
                      setPartnerFormData({ ...partnerFormData, is_featured: !!checked })
                    }
                  />
                  <Label htmlFor="is_featured">Utvald partner</Label>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Pris- och betalningsvillkor</h4>
                  <p className="text-sm text-muted-foreground">
                    Månadsavgiften faktureras löpande i förskott. Uppsägningstiden är 3 (tre) månader och skall meddelas i god tid före varje kvartals början.
                  </p>
                </div>
              </div>


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
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;