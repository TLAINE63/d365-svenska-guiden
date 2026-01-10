import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { partners as staticPartners, allIndustries } from "@/data/partners";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
  generateSlug,
  DatabasePartner,
  PartnerInput,
} from "@/hooks/usePartners";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  Eye, Send, Trash2, RefreshCw, LogOut, BarChart3, MousePointerClick,
  Users, Building2, Plus, Pencil, Upload, Lock, TrendingUp, Calendar, Inbox
} from "lucide-react";

// ==================== TYPES ====================

interface PartnerClickStats {
  partner_name: string;
  month: string;
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

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Ny", variant: "default" },
  contacted: { label: "Kontaktad", variant: "secondary" },
  forwarded: { label: "Vidarebefordrad", variant: "outline" },
  closed: { label: "Avslutad", variant: "destructive" },
};

const allApplications = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations",
];

// ==================== COMPONENT ====================

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, token, login, logout } = useAdminAuth();
  
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
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Partner management state
  const { data: dbPartners = [], isLoading: isLoadingPartners, refetch: refetchPartners } = usePartners();
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const deletePartner = useDeletePartner();
  const [editingPartner, setEditingPartner] = useState<DatabasePartner | null>(null);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState<PartnerInput>({
    slug: "",
    name: "",
    description: "",
    logo_url: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    applications: [],
    industries: [],
    is_featured: false,
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

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchLeads();
      fetchClickStats();
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

  const handleImportPartners = async () => {
    if (!token) return;
    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-partners", {
        body: { token },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: "Import klar",
        description: `${data.imported} partners importerade, ${data.skipped} överhoppade`,
      });
      refetchPartners();
    } catch (error: any) {
      toast({
        title: "Fel vid import",
        description: error.message || "Kunde inte importera partners",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetPartnerForm = () => {
    setPartnerFormData({
      slug: "",
      name: "",
      description: "",
      logo_url: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      applications: [],
      industries: [],
      is_featured: false,
    });
    setEditingPartner(null);
  };

  const openCreatePartnerDialog = () => {
    resetPartnerForm();
    setIsPartnerDialogOpen(true);
  };

  const openEditPartnerDialog = (partner: DatabasePartner) => {
    setEditingPartner(partner);
    setPartnerFormData({
      slug: partner.slug,
      name: partner.name,
      description: partner.description || "",
      logo_url: partner.logo_url || "",
      website: partner.website,
      email: partner.email || "",
      phone: partner.phone || "",
      address: partner.address || "",
      applications: partner.applications || [],
      industries: partner.industries || [],
      is_featured: partner.is_featured || false,
    });
    setIsPartnerDialogOpen(true);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Fel", description: "Sessionen har gått ut. Logga in igen.", variant: "destructive" });
      logout();
      return;
    }

    try {
      if (editingPartner) {
        await updatePartner.mutateAsync({
          id: editingPartner.id,
          partner: partnerFormData,
          token,
        });
        toast({ title: "Partner uppdaterad", description: `${partnerFormData.name} har uppdaterats.` });
      } else {
        const dataWithSlug = {
          ...partnerFormData,
          slug: partnerFormData.slug || generateSlug(partnerFormData.name),
        };
        await createPartner.mutateAsync({ partner: dataWithSlug, token });
        toast({ title: "Partner skapad", description: `${partnerFormData.name} har lagts till.` });
      }
      setIsPartnerDialogOpen(false);
      resetPartnerForm();
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

  const toggleApplication = (app: string) => {
    setPartnerFormData((prev) => ({
      ...prev,
      applications: prev.applications?.includes(app)
        ? prev.applications.filter((a) => a !== app)
        : [...(prev.applications || []), app],
    }));
  };

  const toggleIndustry = (ind: string) => {
    setPartnerFormData((prev) => ({
      ...prev,
      industries: prev.industries?.includes(ind)
        ? prev.industries.filter((i) => i !== ind)
        : [...(prev.industries || []), ind],
    }));
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
                  <p className="text-3xl font-bold">{dbPartners.length}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <Building2 className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {dbPartners.filter(p => p.is_featured).length} utvalda
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
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
              ) : getMonthsFromStats().length === 0 ? (
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
            </div>
          </TabsContent>

          {/* ==================== PARTNERS TAB ==================== */}
          <TabsContent value="partners">
            <div className="flex justify-end gap-2 mb-4">
              <Button 
                variant="outline" 
                onClick={handleImportPartners}
                disabled={isImporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Importerar..." : "Importera partners"}
              </Button>
              <Button onClick={openCreatePartnerDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Lägg till partner
              </Button>
            </div>

            {isLoadingPartners ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Laddar partners...
                </CardContent>
              </Card>
            ) : dbPartners.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Inga partners har lagts till ännu. Klicka på "Lägg till partner" för att komma igång.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {dbPartners.map((partner) => (
                  <Card key={partner.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {partner.logo_url ? (
                            <img
                              src={partner.logo_url}
                              alt={partner.name}
                              className="w-12 h-12 object-contain rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                              Logo
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{partner.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {partner.description || "Ingen beskrivning"}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {partner.applications.slice(0, 3).map((app) => (
                                <Badge key={app} variant="secondary" className="text-xs">
                                  {app}
                                </Badge>
                              ))}
                              {partner.applications.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{partner.applications.length - 3}
                                </Badge>
                              )}
                            </div>
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
        <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Redigera partner" : "Lägg till partner"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Namn *</Label>
                  <Input
                    id="name"
                    value={partnerFormData.name}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, name: e.target.value })
                    }
                    required
                  />
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

              <div>
                <Label htmlFor="website">Hemsida *</Label>
                <Input
                  id="website"
                  type="url"
                  value={partnerFormData.website}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Beskrivning</Label>
                <Textarea
                  id="description"
                  value={partnerFormData.description}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="logo_url">Logotyp-URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={partnerFormData.logo_url}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, logo_url: e.target.value })
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-post</Label>
                  <Input
                    id="email"
                    type="email"
                    value={partnerFormData.email}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={partnerFormData.phone}
                    onChange={(e) =>
                      setPartnerFormData({ ...partnerFormData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Adress</Label>
                <Input
                  id="address"
                  value={partnerFormData.address}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, address: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Applikationer</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allApplications.map((app) => (
                    <Badge
                      key={app}
                      variant={partnerFormData.applications?.includes(app) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleApplication(app)}
                    >
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Branscher</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allIndustries.map((ind) => (
                    <Badge
                      key={ind}
                      variant={partnerFormData.industries?.includes(ind) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleIndustry(ind)}
                    >
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={partnerFormData.is_featured}
                  onChange={(e) =>
                    setPartnerFormData({ ...partnerFormData, is_featured: e.target.checked })
                  }
                />
                <Label htmlFor="is_featured">Utvald partner</Label>
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
