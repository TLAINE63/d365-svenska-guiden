import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Building2, Upload, X, ImageIcon, Plus, Trash2, ExternalLink, CalendarDays, Clock, MapPin, Globe, Link } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import product icons
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import CommerceIcon from "@/assets/icons/Commerce.svg";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg";
import { getAiOptionsForProduct } from "@/utils/aiScoring";

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
  { key: 'fsc', label: 'Finance & Supply Chain', apps: ['Finance', 'Supply Chain Management'], colorClass: 'bg-finance-supply', icon: FinanceIcon },
  { key: 'sales', label: 'Sales & Customer Insights', apps: ['Sales', 'Customer Insights (Marketing)'], colorClass: 'bg-crm', icon: SalesIcon },
  { key: 'service', label: 'Customer Service / Field Service / Contact Center', apps: ['Customer Service', 'Field Service', 'Contact Center'], colorClass: 'bg-customer-service', icon: CustomerServiceIcon },
];

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
  "Konsulttjänster",
  "Bygg & Entreprenad",
  "Fastighet & Förvaltning",
  "Energi & Utilities",
  "Finans & Försäkring",
  "Life Science / Medtech",
  "Telekom & IT-tjänster",
  "Logistik & Transport",
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
  "Övriga världen",
];


interface ProductFilter {
  industries: string[];
  geography: string[];
  swedenRegions: string[];
  swedenCities: string[];
  ranking: number;
  customerExamples: string[];
  customerCaseLinks: string[];
  productDescription: string;
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
  aiCapabilities: [],
  aiProjectCount: "",
  hasBuiltAgents: null,
  aiCaseDescription: "",
  aiBusinessImpact: "",
  aiSegmentationDetails: [],
  aiPredictiveDetails: [],
  aiOtherPartner: "",
  aiOtherAdvanced: "",
};

const PartnerUpdate = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  
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
    email: "",
    phone: "",
    address: "",
    notes: "",
    office_cities_input: "",
  });

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

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("Ogiltig länk");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-invitation&token=${token}`,
          {
            method: "GET",
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
          setFormData({
            name: result.existingData.name || result.invitation.partner_name,
            description: result.existingData.description || "",
            website: result.existingData.website || "",
            logo_url: result.existingData.logo_url || "",
            contact_person: result.existingData.contact_person || "",
            email: result.existingData.email || result.invitation.email,
            phone: result.existingData.phone || "",
            address: result.existingData.address || "",
            notes: "",
            office_cities_input: (result.existingData.office_cities || []).join(", "),
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
    const hierarchy = ['Sverige', 'Norden', 'Europa', 'Övriga världen'];
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

      // Build submission data
      const submissionData = {
        ...formData,
        applications,
        industries: [],
        secondary_industries: [],
        geography: [],
        product_filters: productFilters,
        industry_apps: industryApps.filter(app => app.name.trim() && app.url.trim()),
        office_cities: officeCities,
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Uppdatera partnerprofil</h1>
            <p className="text-muted-foreground">
              Fyll i eller uppdatera era uppgifter för {invitation?.partner_name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Grundläggande information</CardTitle>
                <CardDescription>Företagets kontaktuppgifter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="website">Hemsida/Landsida (visas på Partnerprofilkortet) *</Label>
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
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Beskriv ert företag och era tjänster..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
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
                          <div className="rounded-full bg-muted p-3">
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
              </CardContent>
            </Card>

            {/* Products Section */}
            <Card>
              <CardHeader>
                <CardTitle>Dynamics 365-produkter</CardTitle>
                <CardDescription>
                  Välj de produkter ni arbetar med och fyll i detaljer för varje produkt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {productSections.map((section) => (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => toggleProduct(section.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                        activeProducts.includes(section.key)
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
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
                      ? "T.ex. 'Specialiserade på tillverkande företag med fokus på lageroptimering'"
                      : productKey === 'fsc'
                      ? "T.ex. 'Experter på koncernkonsolidering och supply chain för stora organisationer'"
                      : productKey === 'sales'
                      ? "T.ex. 'Fokus på säljautomation och pipeline-hantering för B2B-företag'"
                      : "T.ex. 'Specialister på omnikanal-support och Field Service för serviceorganisationer'";
                  
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
                        {/* Product Description */}
                        <div>
                          <Label className="text-sm">Kort beskrivning av erbjudande</Label>
                          <Input
                            placeholder={descriptionPlaceholder}
                            value={filter.productDescription || ''}
                            onChange={(e) => updateProductFilter(productKey, { productDescription: e.target.value })}
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Beskriv ert fokus och expertis för denna produkt (max ~100 tecken)</p>
                        </div>

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

                        {/* Customer Examples */}
                        <div>
                          <Label className="text-sm">Kundexempel (Ange kundnamn med kommatecken mellan alternativt endast "Kundexempel kan ges på förfrågan")</Label>
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

                        {/* Geography */}
                        <div>
                          <Label className="text-sm">Geografisk täckning</Label>
                          <p className="text-xs text-muted-foreground mb-2">Inom vilka geografier har ni möjlighet att leverera projekt och support?</p>
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
                        {/* AI Capabilities - Product-specific tier system */}
                        <div className="pt-4 border-t border-border">
                          <Label className="text-sm font-semibold">
                            AI & Automation inom {productKey === 'bc' ? 'Business Central' : productKey === 'fsc' ? 'Finance & Supply Chain' : productKey === 'sales' ? 'Sälj & Marknad' : 'Kundservice & Field Service'}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">Vilken typ av AI-lösningar har ni levererat inom denna applikation?</p>
                          
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
                                  {/* Free-text "Annat" field for 🟡 and 🔴 tiers */}
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

                          {/* Conditional follow-up questions - only show if any AI capability is selected */}
                          {filter.aiCapabilities.length > 0 && (
                            <div className="mt-4 ml-2 pl-4 border-l-2 border-primary/30 space-y-4">
                              {/* Segmentation follow-up (Sales only) */}
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

                              {/* Predictive maintenance follow-up (Service only) */}
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
                              {/* AI Project Count */}
                              <div>
                                <Label className="text-sm">Antal AI-relaterade projekt senaste 24 månader</Label>
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

                              {/* AI Case Description */}
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

                              {/* Business Impact - only for advanced (🔴) selections */}
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
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Specialty Products */}
            <Card>
              <CardHeader className="pb-4 bg-slate-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold">Övriga produkter</CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Markera de produkter som ni kan erbjuda (alla branscher är tillämpliga här)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
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

            {/* Industry Apps Section */}
            {activeProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-primary" />
                    Branschapplikationer (Microsoft Marketplace)
                  </CardTitle>
                  <CardDescription>
                    Lägg till era certifierade branschspecifika tillägg från Microsoft Marketplace. 
                    Dessa ska vara appar som tillför branschspecifik funktionalitet till en Dynamics 365-applikation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Övriga kommentarer</CardTitle>
                <CardDescription>Något mer ni vill meddela oss?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Skriv eventuella kommentarer här..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={submitting || (activeProducts.length === 0 && selectedSpecialtyProducts.length === 0)} size="lg">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Skicka in uppgifter"
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
