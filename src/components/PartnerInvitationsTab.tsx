import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import UpdateRoundSection from "@/components/UpdateRoundSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  Plus, Copy, RefreshCw, CheckCircle2, Clock, Send, 
  ExternalLink, Mail, FileEdit, Save
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getPublicBaseUrl } from "@/lib/publicUrl";

const DEFAULT_PROFILE_REFRESH_SUBJECT = "VIKTIGT! Uppdatera din partnerprofil på d365.se";

const DEFAULT_PROFILE_REFRESH_BODY = `Hej,

Nu finns möjlighet att se över och uppdatera din partnerprofil på d365.se.

Här är din unika profileringslänk:
{{INVITATION_LINK}}

Jag rekommenderar särskilt att du ser över:

• din generella beskrivning av bolaget
• beskrivningarna per produktområde
• bild/foto, både generellt och per område
• kommande event, webinarier eller seminarier kopplade till Dynamics 365 och/eller AI
• eventuell kort video om dig som partner

Syftet är inte bara att "fylla i en profil".

Många kunder som besöker d365.se är i en tidig men aktiv fas där de försöker förstå vilka partners som verkar relevanta för deras behov, bransch och lösningsområde.

En tydlig och aktuell profil hjälper dig att:

• framstå mer relevant i kundens urvalsprocess
• visa vilka typer av kunder och branscher du faktiskt passar bäst för
• skapa förtroende innan kunden tar direkt kontakt
• göra det enklare för kunden att förstå varför just du bör finnas med på deras shortlist

Det här är särskilt viktigt eftersom kundens köpresa sällan börjar med ett formulär eller ett direkt lead. Ofta börjar den med jämförelser, research och intern förankring långt innan kunden tar kontakt.

Därför är profilen på d365.se mer än en kontaktväg. Den är en del av hur du uppfattas när kunden börjar sortera marknaden.

Uppdatera gärna profilen här:
{{INVITATION_LINK}}

Vänliga hälsningar,
Thomas`;

interface Invitation {
  id: string;
  partner_id: string | null;
  partner_name: string;
  email: string;
  token: string;
  status: "pending" | "submitted" | "approved" | "expired";
  expires_at: string;
  created_at: string;
  submitted_at: string | null;
}

interface PartnerInvitationsTabProps {
  token: string;
  partners: Array<{ id: string; name: string; slug: string; email: string; admin_contact_email: string; admin_contact_name: string; is_featured: boolean; contact_person: string }>;
  onSessionExpired?: () => void;
}


const PartnerInvitationsTab = ({ token, partners, onSessionExpired }: PartnerInvitationsTabProps) => {

  const handleResponse = (response: Response) => {
    if (response.status === 401 && onSessionExpired) {
      toast.error("Sessionen har gått ut. Logga in igen.");
      onSessionExpired();
      throw new Error("Session expired");
    }
    return response;
  };
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [selectedForReminder, setSelectedForReminder] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"created_desc" | "name_asc" | "latest_inv_desc" | "missing_contact">("created_desc");
  const [publishFilter, setPublishFilter] = useState<"all" | "published" | "unpublished">("all");
  
  // Email template state
  const [emailTemplate, setEmailTemplate] = useState("");
  const [emailTemplateOriginal, setEmailTemplateOriginal] = useState("");
  const [welcomeTemplate, setWelcomeTemplate] = useState("");
  const [welcomeTemplateOriginal, setWelcomeTemplateOriginal] = useState("");
  const [salesPitchTemplate, setSalesPitchTemplate] = useState("");
  const [salesPitchTemplateOriginal, setSalesPitchTemplateOriginal] = useState("");
  const [salesPitchSubject, setSalesPitchSubject] = useState("");
  const [salesPitchSubjectOriginal, setSalesPitchSubjectOriginal] = useState("");
  const [profileRefreshTemplate, setProfileRefreshTemplate] = useState("");
  const [profileRefreshTemplateOriginal, setProfileRefreshTemplateOriginal] = useState("");
  const [profileRefreshSubject, setProfileRefreshSubject] = useState("");
  const [profileRefreshSubjectOriginal, setProfileRefreshSubjectOriginal] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingWelcomeTemplate, setSavingWelcomeTemplate] = useState(false);
  const [savingSalesPitchTemplate, setSavingSalesPitchTemplate] = useState(false);
  const [savingProfileRefreshTemplate, setSavingProfileRefreshTemplate] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<"welcome" | "reminder" | "sales_pitch" | "profile_refresh">("profile_refresh");

  // Profile refresh send dialog state
  const [showProfileRefreshDialog, setShowProfileRefreshDialog] = useState(false);
  const [profileRefreshSendSubject, setProfileRefreshSendSubject] = useState("");
  const [profileRefreshSendBody, setProfileRefreshSendBody] = useState("");
  const [profileRefreshSelected, setProfileRefreshSelected] = useState<Set<string>>(new Set());
  const [profileRefreshEmails, setProfileRefreshEmails] = useState<Record<string, string>>({});
  const [profileRefreshSearch, setProfileRefreshSearch] = useState("");
  const [sendingProfileRefresh, setSendingProfileRefresh] = useState(false);

  // Custom email (Partnerkommunikation)
  const [showCustomEmailDialog, setShowCustomEmailDialog] = useState(false);
  const [customEmailSubject, setCustomEmailSubject] = useState("");
  const [customEmailBody, setCustomEmailBody] = useState("");
  const [customEmailGroup, setCustomEmailGroup] = useState<"published" | "unpublished" | "selected">("selected");
  const [customEmailSelected, setCustomEmailSelected] = useState<Set<string>>(new Set());
  const [customEmailSearch, setCustomEmailSearch] = useState("");
  const [sendingCustomEmail, setSendingCustomEmail] = useState(false);

  // Kopiera e-postadresser (för klistra in i eget mailprogram)
  const [showEmailListDialog, setShowEmailListDialog] = useState(false);
  const [emailListSelected, setEmailListSelected] = useState<Set<string>>(new Set());
  const [emailListSearch, setEmailListSearch] = useState("");
  const [emailListSeparator, setEmailListSeparator] = useState<"comma" | "semicolon" | "newline">("semicolon");
  const [emailListFilter, setEmailListFilter] = useState<"all" | "published" | "unpublished">("all");


  
  
  // Create form state
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    partner_name: "",
    partner_id: "",
    send_email: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      handleResponse(response);
      if (!response.ok) {
        throw new Error("Kunde inte hämta data");
      }

      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Kunde inte hämta inbjudningar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchTemplateValue = async (template_key: string): Promise<string> => {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=${template_key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      }
    );
    handleResponse(res);
    const data = await res.json();
    return data.template || "";
  };

  const fetchEmailTemplate = async () => {
    setLoadingTemplate(true);
    try {
      const [reminder, welcome, salesBody, salesSubject, refreshBody, refreshSubject] = await Promise.all([
        fetchTemplateValue("invitation_email_body"),
        fetchTemplateValue("invitation_welcome_email_body"),
        fetchTemplateValue("sales_pitch_email_body"),
        fetchTemplateValue("sales_pitch_email_subject"),
        fetchTemplateValue("profile_refresh_email_body"),
        fetchTemplateValue("profile_refresh_email_subject"),
      ]);
      setEmailTemplate(reminder);
      setEmailTemplateOriginal(reminder);
      setWelcomeTemplate(welcome);
      setWelcomeTemplateOriginal(welcome);
      setSalesPitchTemplate(salesBody);
      setSalesPitchTemplateOriginal(salesBody);
      setSalesPitchSubject(salesSubject);
      setSalesPitchSubjectOriginal(salesSubject);

      const refreshBodyOrDefault = refreshBody || DEFAULT_PROFILE_REFRESH_BODY;
      const refreshSubjectOrDefault = refreshSubject || DEFAULT_PROFILE_REFRESH_SUBJECT;
      setProfileRefreshTemplate(refreshBodyOrDefault);
      setProfileRefreshTemplateOriginal(refreshBody);
      setProfileRefreshSubject(refreshSubjectOrDefault);
      setProfileRefreshSubjectOriginal(refreshSubject);
    } catch (err) {
      console.error("Fetch template error:", err);
      toast.error("Kunde inte hämta e-postmallar");
    } finally {
      setLoadingTemplate(false);
    }
  };

  const saveEmailTemplate = async () => {
    setSavingTemplate(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ template: emailTemplate, template_key: "invitation_email_body" }),
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte spara mall");
      setEmailTemplateOriginal(emailTemplate);
      toast.success("Påminnelsemall sparad!");
    } catch (err) {
      console.error("Save template error:", err);
      toast.error("Kunde inte spara e-postmall");
    } finally {
      setSavingTemplate(false);
    }
  };

  const saveWelcomeTemplate = async () => {
    setSavingWelcomeTemplate(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ template: welcomeTemplate, template_key: "invitation_welcome_email_body" }),
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte spara mall");
      setWelcomeTemplateOriginal(welcomeTemplate);
      toast.success("Välkomstmall sparad!");
    } catch (err) {
      console.error("Save welcome template error:", err);
      toast.error("Kunde inte spara välkomstmall");
    } finally {
      setSavingWelcomeTemplate(false);
    }
  };

  const saveSalesPitchTemplate = async () => {
    setSavingSalesPitchTemplate(true);
    try {
      const [bodyRes, subjectRes] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ template: salesPitchTemplate, template_key: "sales_pitch_email_body" }),
          }
        ),
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ template: salesPitchSubject, template_key: "sales_pitch_email_subject" }),
          }
        ),
      ]);
      handleResponse(bodyRes);
      handleResponse(subjectRes);
      if (!bodyRes.ok || !subjectRes.ok) throw new Error("Kunde inte spara mall");
      setSalesPitchTemplateOriginal(salesPitchTemplate);
      setSalesPitchSubjectOriginal(salesPitchSubject);
      toast.success("Införsäljningsmall sparad!");
    } catch (err) {
      console.error("Save sales pitch template error:", err);
      toast.error("Kunde inte spara införsäljningsmall");
    } finally {
      setSavingSalesPitchTemplate(false);
    }
  };

  const saveProfileRefreshTemplate = async () => {
    setSavingProfileRefreshTemplate(true);
    try {
      const [bodyRes, subjectRes] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ template: profileRefreshTemplate, template_key: "profile_refresh_email_body" }),
          }
        ),
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ template: profileRefreshSubject, template_key: "profile_refresh_email_subject" }),
          }
        ),
      ]);
      handleResponse(bodyRes);
      handleResponse(subjectRes);
      if (!bodyRes.ok || !subjectRes.ok) throw new Error("Kunde inte spara mall");
      setProfileRefreshTemplateOriginal(profileRefreshTemplate);
      setProfileRefreshSubjectOriginal(profileRefreshSubject);
      toast.success("Profileringslänkmall sparad!");
    } catch (err) {
      console.error("Save profile refresh template error:", err);
      toast.error("Kunde inte spara mallen");
    } finally {
      setSavingProfileRefreshTemplate(false);
    }
  };

  const openProfileRefreshDialog = async () => {
    // Always fetch the latest templates from DB so we don't send a stale cached version
    let freshBody = "";
    let freshSubject = "";
    try {
      [freshBody, freshSubject] = await Promise.all([
        fetchTemplateValue("profile_refresh_email_body"),
        fetchTemplateValue("profile_refresh_email_subject"),
      ]);
      // Sync editor state too so the template tab shows current DB content
      const bodyOrDefault = freshBody || DEFAULT_PROFILE_REFRESH_BODY;
      const subjectOrDefault = freshSubject || DEFAULT_PROFILE_REFRESH_SUBJECT;
      setProfileRefreshTemplate(bodyOrDefault);
      setProfileRefreshTemplateOriginal(freshBody);
      setProfileRefreshSubject(subjectOrDefault);
      setProfileRefreshSubjectOriginal(freshSubject);
    } catch (err) {
      console.error("Fetch profile refresh template error:", err);
    }
    const subject = freshSubject || profileRefreshSubject || DEFAULT_PROFILE_REFRESH_SUBJECT;
    const body = freshBody || profileRefreshTemplate || DEFAULT_PROFILE_REFRESH_BODY;
    setProfileRefreshSendSubject(subject);
    setProfileRefreshSendBody(body);

    // Pre-populate emails for partners that already have a contact email
    const emails: Record<string, string> = {};
    partners.forEach(p => {
      emails[p.id] = p.admin_contact_email || p.email || "";
    });
    setProfileRefreshEmails(emails);
    setProfileRefreshSelected(new Set());
    setProfileRefreshSearch("");
    setShowProfileRefreshDialog(true);
  };

  const sendProfileRefreshEmails = async () => {
    const selectedPartners = partners.filter(p => profileRefreshSelected.has(p.id));
    if (selectedPartners.length === 0) {
      toast.error("Välj minst en partner");
      return;
    }
    const missing = selectedPartners.filter(p => !profileRefreshEmails[p.id]?.trim());
    if (missing.length > 0) {
      toast.error(`Ange e-post för: ${missing.map(p => p.name).join(", ")}`);
      return;
    }
    if (!profileRefreshSendSubject.trim()) {
      toast.error("Ämnesrad krävs");
      return;
    }
    if (!profileRefreshSendBody.includes("{{INVITATION_LINK}}")) {
      toast.error("Brödtexten måste innehålla {{INVITATION_LINK}}");
      return;
    }
    if (!confirm(`Skicka profileringslänk till ${selectedPartners.length} partner(s)? Länken är giltig hela 2026.`)) return;

    setSendingProfileRefresh(true);
    try {
      const partnerList = selectedPartners.map(p => ({
        id: p.id,
        name: p.name,
        email: profileRefreshEmails[p.id].trim(),
        contact_name: p.contact_person || p.name,
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
          body: JSON.stringify({
            partners: partnerList,
            subject: profileRefreshSendSubject,
            body: profileRefreshSendBody,
          }),
        }
      );
      handleResponse(response);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunde inte skicka");
      toast.success(data.message || "Mail skickade!");
      if (data.errors?.length) console.warn("Profile refresh errors:", data.errors);
      setShowProfileRefreshDialog(false);
      setProfileRefreshSelected(new Set());
      fetchData();
    } catch (err: any) {
      if (err.message !== "Session expired") {
        toast.error(err.message || "Kunde inte skicka mail");
      }
    } finally {
      setSendingProfileRefresh(false);
    }
  };

  const openCustomEmailDialog = () => {
    setCustomEmailGroup("selected");
    setCustomEmailSelected(new Set());
    setCustomEmailSearch("");
    if (!customEmailSubject) setCustomEmailSubject("");
    if (!customEmailBody) setCustomEmailBody("Hej {{NAME}},\n\n");
    setShowCustomEmailDialog(true);
  };

  const getCustomEmailRecipients = () => {
    if (customEmailGroup === "published") return partners.filter(p => p.is_featured);
    if (customEmailGroup === "unpublished") return partners.filter(p => !p.is_featured);
    return partners.filter(p => customEmailSelected.has(p.id));
  };

  const sendCustomEmail = async () => {
    const recipients = getCustomEmailRecipients();
    if (recipients.length === 0) {
      toast.error("Inga mottagare valda");
      return;
    }
    if (!customEmailSubject.trim()) {
      toast.error("Ämnesrad krävs");
      return;
    }
    if (!customEmailBody.trim()) {
      toast.error("Meddelandetext krävs");
      return;
    }
    const withoutEmail = recipients.filter(p => !(p.admin_contact_email || p.email));
    if (withoutEmail.length > 0) {
      toast.error(`Saknar e-post för: ${withoutEmail.map(p => p.name).slice(0, 5).join(", ")}${withoutEmail.length > 5 ? "..." : ""}`);
      return;
    }
    if (!confirm(`Skicka meddelande till ${recipients.length} partner(s)?`)) return;

    setSendingCustomEmail(true);
    try {
      const partnerList = recipients.map(p => ({
        id: p.id,
        name: p.name,
        email: (p.admin_contact_email || p.email).trim(),
        contact_name: p.contact_person || p.name,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-custom-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            partners: partnerList,
            subject: customEmailSubject,
            body: customEmailBody,
          }),
        }
      );
      handleResponse(response);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunde inte skicka");
      toast.success(data.message || "Meddelande skickat!");
      if (data.errors?.length) console.warn("Custom email errors:", data.errors);
      setShowCustomEmailDialog(false);
    } catch (err: any) {
      if (err.message !== "Session expired") {
        toast.error(err.message || "Kunde inte skicka meddelande");
      }
    } finally {
      setSendingCustomEmail(false);
    }
  };

  const createInvitation = async () => {
    if (!newInvitation.email || !newInvitation.partner_name) {
      toast.error("E-post och partnernamn krävs");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(newInvitation),
        }
      );

      handleResponse(response);
      if (!response.ok) {
        throw new Error("Kunde inte skapa inbjudan");
      }

      const result = await response.json();
      
      if (result.emailSent) {
        toast.success("Inbjudan skapad och e-post skickad!");
      } else if (result.emailError) {
        toast.success("Inbjudan skapad, men e-post kunde inte skickas: " + result.emailError);
      } else {
        toast.success("Inbjudan skapad!");
      }
      
      setShowCreateDialog(false);
      setNewInvitation({ email: "", partner_name: "", partner_id: "", send_email: true });
      fetchData();
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Kunde inte skapa inbjudan");
    } finally {
      setCreating(false);
    }
  };


  const copyInvitationLink = (invToken: string) => {
    // Använd alltid publik produktionsdomän — preview-domänen bryter POST/upload för partners
    const link = `${getPublicBaseUrl()}/partner-update/${invToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Länk kopierad (publik domän)!");
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date() && status === "pending";
    
    if (isExpired) {
      return <Badge variant="destructive">Utgången</Badge>;
    }
    
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600"><Clock className="w-3 h-3 mr-1" />Väntar</Badge>;
      case "submitted":
        return <Badge variant="outline" className="border-blue-500 text-blue-600"><Send className="w-3 h-3 mr-1" />Inskickad</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Godkänd</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Count pending (not expired) invitations for reminder button
  const pendingInvitations = invitations.filter(
    inv => inv.status === "pending" && new Date(inv.expires_at) >= new Date()
  );

  // Map partner_id -> latest invitation (used to enrich the partner-based list)
  const latestInvitationByPartner = useMemo(() => {
    const map = new Map<string, Invitation>();
    for (const inv of invitations) {
      if (!inv.partner_id) continue;
      const existing = map.get(inv.partner_id);
      if (!existing || new Date(inv.created_at) > new Date(existing.created_at)) {
        map.set(inv.partner_id, inv);
      }
    }
    return map;
  }, [invitations]);

  // Fallback lookup for invitations without partner_id (match on email)
  const latestInvitationByEmail = useMemo(() => {
    const map = new Map<string, Invitation>();
    for (const inv of invitations) {
      if (inv.partner_id) continue;
      const key = (inv.email || "").toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      if (!existing || new Date(inv.created_at) > new Date(existing.created_at)) {
        map.set(key, inv);
      }
    }
    return map;
  }, [invitations]);

  // Build partner-based rows: one per partner, with latest invitation (if any)
  const partnerRows = useMemo(() => {
    const rows = partners.map(p => {
      const contactEmail = p.admin_contact_email || p.email || "";
      const hasContactName = !!(p.admin_contact_name || p.contact_person);
      const hasContactEmail = !!(p.admin_contact_email || p.email);
      const missingContact = !hasContactName || !hasContactEmail;
      const inv =
        latestInvitationByPartner.get(p.id) ||
        (contactEmail ? latestInvitationByEmail.get(contactEmail.toLowerCase()) : undefined) ||
        (p.email ? latestInvitationByEmail.get(p.email.toLowerCase()) : undefined);
      return { partner: p, invitation: inv || null, contactEmail, missingContact };
    });

    const filtered = rows.filter(r => {
      if (publishFilter === "published") return r.partner.is_featured;
      if (publishFilter === "unpublished") return !r.partner.is_featured;
      return true;
    });

    switch (sortOrder) {
      case "name_asc":
        filtered.sort((a, b) => a.partner.name.localeCompare(b.partner.name, "sv"));
        break;
      case "missing_contact":
        filtered.sort((a, b) => {
          if (a.missingContact !== b.missingContact) return a.missingContact ? -1 : 1;
          return a.partner.name.localeCompare(b.partner.name, "sv");
        });
        break;
      case "latest_inv_desc":
      case "created_desc":
      default:
        filtered.sort((a, b) => {
          const at = a.invitation ? new Date(a.invitation.created_at).getTime() : 0;
          const bt = b.invitation ? new Date(b.invitation.created_at).getTime() : 0;
          if (bt !== at) return bt - at;
          return a.partner.name.localeCompare(b.partner.name, "sv");
        });
    }
    return filtered;
  }, [partners, latestInvitationByPartner, latestInvitationByEmail, publishFilter, sortOrder]);


  const toggleReminderSelection = (id: string) => {
    setSelectedForReminder(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllReminders = () => {
    if (selectedForReminder.size === pendingInvitations.length) {
      setSelectedForReminder(new Set());
    } else {
      setSelectedForReminder(new Set(pendingInvitations.map(i => i.id)));
    }
  };

  const sendReminders = async () => {
    const ids = Array.from(selectedForReminder);
    if (ids.length === 0) {
      toast.error("Välj minst en partner att skicka påminnelse till");
      return;
    }
    if (!confirm(`Skicka påminnelse till ${ids.length} partner(s)?`)) return;
    
    setSendingReminders(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-reminders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ invitation_ids: ids }),
        }
      );

      const data = await response.json();

      handleResponse(response);
      if (!response.ok) {
        throw new Error(data.error || "Kunde inte skicka påminnelser");
      }

      toast.success(data.message || `Påminnelse skickad till ${data.sent} partners`);
      if (data.errors?.length) {
        console.warn("Reminder errors:", data.errors);
      }
      setSelectedForReminder(new Set());
    } catch (err: any) {
      console.error("Send reminders error:", err);
      toast.error(err.message || "Kunde inte skicka påminnelser");
    } finally {
      setSendingReminders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (!showTemplateEditor) fetchEmailTemplate();
              setShowTemplateEditor(!showTemplateEditor);
            }}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            {showTemplateEditor ? "Dölj mailmall" : "Redigera mailmall"}
          </Button>
          {pendingInvitations.length > 0 && (
            <Button 
              variant="outline" 
              onClick={sendReminders} 
              disabled={sendingReminders || selectedForReminder.size === 0}
              className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Mail className={`w-4 h-4 mr-2 ${sendingReminders ? "animate-pulse" : ""}`} />
              {sendingReminders ? "Skickar..." : `Påminn valda (${selectedForReminder.size})`}
            </Button>
          )}
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Uppdatera
          </Button>
          <Button
            variant="outline"
            onClick={openProfileRefreshDialog}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Send className="w-4 h-4 mr-2" />
            Skicka profileringslänk (2026)
          </Button>
          <Button
            variant="outline"
            onClick={openCustomEmailDialog}
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
          >
            <Mail className="w-4 h-4 mr-2" />
            Skicka fritt meddelande
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEmailListDialog(true)}
            className="border-slate-400 text-slate-700 hover:bg-slate-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Kopiera e-postadresser
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ny inbjudan
          </Button>

        </div>
      </div>

      <UpdateRoundSection
        token={token}
        partners={partners}
        invitations={invitations}
        onSessionExpired={onSessionExpired}
        onRefresh={fetchData}
      />

      {/* Email template editor */}
      {showTemplateEditor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              E-postmallar
            </CardTitle>
            <CardDescription>
              Redigera texten som skickas till partners. Använd <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{INVITATION_LINK}}"}</code> där knappen för att uppdatera profil ska placeras. 
              Tomma rader skapar nya stycken. Webbadresser och e-postadresser görs automatiskt klickbara.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tab switcher */}
            <div className="flex gap-2 border-b pb-2 flex-wrap">
              <Button
                variant={activeTemplateTab === "welcome" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTemplateTab("welcome")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Välkomstmail
              </Button>
              <Button
                variant={activeTemplateTab === "sales_pitch" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTemplateTab("sales_pitch")}
              >
                <Send className="w-4 h-4 mr-2" />
                Införsäljning
              </Button>
              <Button
                variant={activeTemplateTab === "reminder" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTemplateTab("reminder")}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Påminnelse / uppdatering
              </Button>
              <Button
                variant={activeTemplateTab === "profile_refresh" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTemplateTab("profile_refresh")}
              >
                <Send className="w-4 h-4 mr-2" />
                Profileringslänk (2026)
              </Button>
            </div>

            {loadingTemplate ? (
              <div className="text-center py-8 text-muted-foreground">Laddar mallar...</div>
            ) : activeTemplateTab === "welcome" ? (
              <>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <strong>Välkomstmailet</strong> skickas till nya partners som bjuds in för första gången. 
                  Inkludera gärna instruktioner för hur de ska profilera sig, vilka uppgifter som är viktiga att fylla i, 
                  och tips för att maximera sin synlighet på D365.se.
                </div>
                <Textarea
                  value={welcomeTemplate}
                  onChange={(e) => setWelcomeTemplate(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Skriv välkomstmailet här..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Ämnesrad: &quot;Välkommen till D365.se – Vilken Dynamics 365-partner passar kunden bäst?&quot;
                  </p>
                  <div className="flex gap-2">
                    {welcomeTemplate !== welcomeTemplateOriginal && (
                      <Button 
                        variant="outline" 
                        onClick={() => setWelcomeTemplate(welcomeTemplateOriginal)}
                      >
                        Ångra ändringar
                      </Button>
                    )}
                    <Button 
                      onClick={saveWelcomeTemplate} 
                      disabled={savingWelcomeTemplate || welcomeTemplate === welcomeTemplateOriginal}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingWelcomeTemplate ? "Sparar..." : "Spara välkomstmall"}
                    </Button>
                  </div>
                </div>
              </>
            ) : activeTemplateTab === "sales_pitch" ? (
              <>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <strong>Införsäljningsmailet</strong> skickas till potentiella partners som ännu inte är kunder. 
                  Använd <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{NAME}}"}</code> för mottagarens namn 
                  och <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{INVITATION_LINK}}"}</code> för länken till profilsidan.
                  Ämnesraden kan också innehålla <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{NAME}}"}</code>.
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ämnesrad</Label>
                  <Input
                    value={salesPitchSubject}
                    onChange={(e) => setSalesPitchSubject(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="Skriv ämnesrad här..."
                  />
                </div>
                <Textarea
                  value={salesPitchTemplate}
                  onChange={(e) => setSalesPitchTemplate(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Skriv införsäljningstexten här..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Platshållare: {"{{NAME}}"} = mottagarens namn, {"{{INVITATION_LINK}}"} = profilsidans länk
                  </p>
                  <div className="flex gap-2">
                    {(salesPitchTemplate !== salesPitchTemplateOriginal || salesPitchSubject !== salesPitchSubjectOriginal) && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSalesPitchTemplate(salesPitchTemplateOriginal);
                          setSalesPitchSubject(salesPitchSubjectOriginal);
                        }}
                      >
                        Ångra ändringar
                      </Button>
                    )}
                    <Button 
                      onClick={saveSalesPitchTemplate} 
                      disabled={savingSalesPitchTemplate || (salesPitchTemplate === salesPitchTemplateOriginal && salesPitchSubject === salesPitchSubjectOriginal)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingSalesPitchTemplate ? "Sparar..." : "Spara införsäljningsmall"}
                    </Button>
                  </div>
                </div>
              </>
            ) : activeTemplateTab === "reminder" ? (
              <>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <strong>Påminnelsemailet</strong> skickas till partners som redan har en profil och behöver uppdatera sina uppgifter.
                  Används även vid uppdateringsrundor och manuella påminnelser.
                </div>
                <Textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Skriv påminnelsetext här..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Ämnesrad: &quot;Påminnelse: Vem är kundens mest lämpade Dynamics 365-partner?&quot;
                  </p>
                  <div className="flex gap-2">
                    {emailTemplate !== emailTemplateOriginal && (
                      <Button 
                        variant="outline" 
                        onClick={() => setEmailTemplate(emailTemplateOriginal)}
                      >
                        Ångra ändringar
                      </Button>
                    )}
                    <Button 
                      onClick={saveEmailTemplate} 
                      disabled={savingTemplate || emailTemplate === emailTemplateOriginal}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingTemplate ? "Sparar..." : "Spara påminnelsemall"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <strong>Profileringslänkmailet</strong> skickas till partners (publicerade eller inbjudna) för att de ska få en fräsch unik länk att uppdatera sin profil. Länken är giltig hela 2026.
                  Använd <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{INVITATION_LINK}}"}</code> där länken ska placeras och valfritt <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{NAME}}"}</code> för partnerns namn.
                  Mail skickas från <strong>info@d365.se</strong> med svar till <strong>thomas.laine@dynamicfactory.se</strong>.
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ämnesrad</Label>
                  <Input
                    value={profileRefreshSubject}
                    onChange={(e) => setProfileRefreshSubject(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="VIKTIGT! Uppdatera din partnerprofil på d365.se"
                  />
                </div>
                <Textarea
                  value={profileRefreshTemplate}
                  onChange={(e) => setProfileRefreshTemplate(e.target.value)}
                  rows={22}
                  className="font-mono text-sm"
                  placeholder="Skriv profileringslänkmailet här..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Platshållare: {"{{INVITATION_LINK}}"} = unik profileringslänk (2026), {"{{NAME}}"} = partnerns namn
                  </p>
                  <div className="flex gap-2">
                    {(profileRefreshTemplate !== profileRefreshTemplateOriginal || profileRefreshSubject !== profileRefreshSubjectOriginal) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setProfileRefreshTemplate(profileRefreshTemplateOriginal || DEFAULT_PROFILE_REFRESH_BODY);
                          setProfileRefreshSubject(profileRefreshSubjectOriginal || DEFAULT_PROFILE_REFRESH_SUBJECT);
                        }}
                      >
                        Ångra ändringar
                      </Button>
                    )}
                    <Button
                      onClick={saveProfileRefreshTemplate}
                      disabled={savingProfileRefreshTemplate || (profileRefreshTemplate === profileRefreshTemplateOriginal && profileRefreshSubject === profileRefreshSubjectOriginal)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingProfileRefreshTemplate ? "Sparar..." : "Spara profileringslänkmall"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* All invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Partnerkommunikation</CardTitle>
          <CardDescription className="flex items-center gap-3 flex-wrap">
            <span>{partnerRows.length} av {partners.length} partners</span>
            <span className="text-xs">Filter:</span>
            {([
              { key: "all", label: "Alla" },
              { key: "published", label: "Publicerad" },
              { key: "unpublished", label: "Ej publicerad" },
            ] as const).map(opt => (
              <Button
                key={opt.key}
                variant={publishFilter === opt.key ? "secondary" : "ghost"}
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => setPublishFilter(opt.key)}
              >
                {opt.label}
              </Button>
            ))}
            <span className="text-xs">Sortera:</span>
            {([
              { key: "created_desc", label: "Senaste kommunikationen" },
              { key: "missing_contact", label: "Saknar kontakt" },
              { key: "name_asc", label: "A–Ö" },
            ] as const).map(opt => (
              <Button
                key={opt.key}
                variant={sortOrder === opt.key ? "secondary" : "ghost"}
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => setSortOrder(opt.key as typeof sortOrder)}
              >
                {opt.label}
              </Button>
            ))}

          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar...</div>
          ) : partnerRows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Inga partners att visa med aktuellt filter.
            </div>
          ) : (
            <div className="admin-table-wrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedForReminder.size === pendingInvitations.length && pendingInvitations.length > 0}
                      onCheckedChange={toggleAllReminders}
                      title="Markera alla påminnelser"
                    />
                  </TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Huvudkontakt (e-post)</TableHead>
                  <TableHead>Senaste kommunikationen</TableHead>
                  <TableHead>Senast uppdaterad profil</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerRows.map(({ partner, invitation, contactEmail, missingContact }) => {
                  const isPending = !!invitation && invitation.status === "pending" && new Date(invitation.expires_at) >= new Date();
                  return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <Checkbox
                        checked={!!invitation && selectedForReminder.has(invitation.id)}
                        onCheckedChange={() => invitation && toggleReminderSelection(invitation.id)}
                        disabled={!isPending}
                        title={isPending ? "Välj för påminnelse" : "Endast pågående inbjudningar kan påminnas"}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        {partner.name}
                        {partner.is_featured
                          ? <Badge variant="outline" className="border-green-500 text-green-600 text-xs">Publicerad</Badge>
                          : <Badge variant="outline" className="border-orange-400 text-orange-600 text-xs">Ej publicerad</Badge>}
                        {missingContact && (
                          <Badge variant="destructive" className="text-xs">Saknar kontakt</Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        {partner.contact_person && (
                          <span className="text-xs text-muted-foreground">{partner.contact_person}</span>
                        )}
                        <span>{contactEmail || <span className="text-muted-foreground">—</span>}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invitation
                        ? format(new Date(invitation.created_at), "d MMM yyyy HH:mm", { locale: sv })
                        : <span className="text-muted-foreground">—</span>
                      }
                    </TableCell>
                    <TableCell>
                      {invitation?.submitted_at
                        ? format(new Date(invitation.submitted_at), "d MMM yyyy HH:mm", { locale: sv })
                        : <span className="text-muted-foreground">—</span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {invitation ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyInvitationLink(invitation.token)}
                              title="Kopiera länk"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/partner-update/${invitation.token}`, "_blank")}
                              title="Öppna formulär"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Ingen inbjudan</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create invitation dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa ny inbjudan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="partner_name">Partnernamn *</Label>
              <Input
                id="partner_name"
                value={newInvitation.partner_name}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, partner_name: e.target.value }))}
                placeholder="Företagsnamn AB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="text"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, email: e.target.value }))}
                placeholder="kontakt@foretag.se (flera adresser separeras med ;)"
              />
              <p className="text-[11px] text-muted-foreground">Tips: ange flera adresser separerade med ; för att skicka till flera kontakter samtidigt.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner_id">Koppla till befintlig partner (valfritt)</Label>
              <select
                id="partner_id"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newInvitation.partner_id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selected = partners.find(p => p.id === selectedId);
                  const autoEmail = selected ? (selected.admin_contact_email || selected.email || "") : "";
                  setNewInvitation(prev => ({ 
                    ...prev, 
                    partner_id: selectedId,
                    partner_name: selected ? selected.name : prev.partner_name,
                    email: autoEmail || prev.email,
                  }));
                }}
              >
                <option value="">-- Ny partner --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Om du väljer en befintlig partner kommer deras nuvarande uppgifter att förifyllas i formuläret.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="send_email"
                checked={newInvitation.send_email}
                onCheckedChange={(checked) => 
                  setNewInvitation(prev => ({ ...prev, send_email: checked === true }))
                }
              />
              <Label htmlFor="send_email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Skicka inbjudan via e-post
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Avbryt
            </Button>
            <Button onClick={createInvitation} disabled={creating}>
              {creating ? "Skapar..." : "Skapa inbjudan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile refresh send dialog */}
      <Dialog open={showProfileRefreshDialog} onOpenChange={setShowProfileRefreshDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Skicka profileringslänk (2026)
            </DialogTitle>
            <CardDescription>
              Skickar en unik profileringslänk till valda partners. Mailet skickas från <strong>info@d365.se</strong> med svar till <strong>thomas.laine@dynamicfactory.se</strong>.
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ämnesrad</Label>
              <Input
                value={profileRefreshSendSubject}
                onChange={(e) => setProfileRefreshSendSubject(e.target.value)}
                placeholder="Ämnesrad"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Brödtext <span className="text-xs text-muted-foreground">(måste innehålla {"{{INVITATION_LINK}}"})</span>
              </Label>
              <Textarea
                value={profileRefreshSendBody}
                onChange={(e) => setProfileRefreshSendBody(e.target.value)}
                rows={14}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  Välj mottagare ({profileRefreshSelected.size} valda)
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const visible = partners.filter(p =>
                        !profileRefreshSearch ||
                        p.name.toLowerCase().includes(profileRefreshSearch.toLowerCase())
                      );
                      setProfileRefreshSelected(new Set(visible.map(p => p.id)));
                    }}
                  >
                    Välj alla synliga
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileRefreshSelected(new Set())}
                  >
                    Avmarkera alla
                  </Button>
                </div>
              </div>
              <Input
                placeholder="Sök partner..."
                value={profileRefreshSearch}
                onChange={(e) => setProfileRefreshSearch(e.target.value)}
              />
              <div className="border rounded-md max-h-72 overflow-y-auto divide-y">
                {partners
                  .filter(p =>
                    !profileRefreshSearch ||
                    p.name.toLowerCase().includes(profileRefreshSearch.toLowerCase())
                  )
                  .sort((a, b) => a.name.localeCompare(b.name, "sv"))
                  .map(p => {
                    const checked = profileRefreshSelected.has(p.id);
                    return (
                      <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-muted/50">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            const next = new Set(profileRefreshSelected);
                            if (c === true) next.add(p.id);
                            else next.delete(p.id);
                            setProfileRefreshSelected(next);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate flex items-center gap-2">
                            {p.name}
                            {p.is_featured && (
                              <Badge variant="secondary" className="text-[10px]">Publicerad</Badge>
                            )}
                          </div>
                        </div>
                        <Input
                          type="text"
                          value={profileRefreshEmails[p.id] || ""}
                          onChange={(e) =>
                            setProfileRefreshEmails(prev => ({ ...prev, [p.id]: e.target.value }))
                          }
                          placeholder="kontakt@partner.se (flera med ;)"
                          className="h-8 text-sm w-72"
                          disabled={!checked}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileRefreshDialog(false)}>
              Avbryt
            </Button>
            <Button
              onClick={sendProfileRefreshEmails}
              disabled={sendingProfileRefresh || profileRefreshSelected.size === 0}
            >
              <Send className={`w-4 h-4 mr-2 ${sendingProfileRefresh ? "animate-pulse" : ""}`} />
              {sendingProfileRefresh
                ? "Skickar..."
                : `Skicka till ${profileRefreshSelected.size} partner${profileRefreshSelected.size === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom email (Partnerkommunikation) dialog */}
      <Dialog open={showCustomEmailDialog} onOpenChange={setShowCustomEmailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              Skicka fritt meddelande
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">Mottagargrupp</Label>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "published", label: `Alla publicerade (${partners.filter(p => p.is_featured).length})` },
                  { key: "unpublished", label: `Alla opublicerade (${partners.filter(p => !p.is_featured).length})` },
                  { key: "selected", label: "Markerade partners" },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCustomEmailGroup(key)}
                    className={`h-8 px-3 rounded border text-sm font-medium transition-all ${
                      customEmailGroup === key
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {customEmailGroup !== "selected" && (
                <p className="text-xs text-muted-foreground mt-2">
                  {getCustomEmailRecipients().length} mottagare
                </p>
              )}
            </div>

            {customEmailGroup === "selected" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Välj partners ({customEmailSelected.size} valda)</Label>
                  <Input
                    placeholder="Sök partner..."
                    value={customEmailSearch}
                    onChange={(e) => setCustomEmailSearch(e.target.value)}
                    className="max-w-xs h-8"
                  />
                </div>
                <div className="border rounded max-h-56 overflow-y-auto divide-y">
                  {partners
                    .filter(p => !customEmailSearch || p.name.toLowerCase().includes(customEmailSearch.toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name, "sv"))
                    .map(p => {
                      const checked = customEmailSelected.has(p.id);
                      const hasEmail = !!(p.admin_contact_email || p.email);
                      return (
                        <label key={p.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                              setCustomEmailSelected(prev => {
                                const next = new Set(prev);
                                if (v) next.add(p.id); else next.delete(p.id);
                                return next;
                              });
                            }}
                          />
                          <span className="flex-1">{p.name}</span>
                          {p.is_featured && <Badge variant="secondary" className="text-[10px]">Publicerad</Badge>}
                          {!hasEmail && <Badge variant="destructive" className="text-[10px]">Ingen e-post</Badge>}
                        </label>
                      );
                    })}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="custom-email-subject">Ämne</Label>
              <Input
                id="custom-email-subject"
                value={customEmailSubject}
                onChange={(e) => setCustomEmailSubject(e.target.value)}
                placeholder="T.ex. Uppdatering från d365.se"
              />
            </div>

            <div>
              <Label htmlFor="custom-email-body">Meddelande</Label>
              <Textarea
                id="custom-email-body"
                value={customEmailBody}
                onChange={(e) => setCustomEmailBody(e.target.value)}
                rows={14}
                placeholder="Hej {{NAME}},&#10;&#10;..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Variabler: <code>{"{{NAME}}"}</code> (kontaktperson), <code>{"{{PARTNER_NAME}}"}</code> (partnernamn). Använd tom rad för nytt stycke.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomEmailDialog(false)}>
              Avbryt
            </Button>
            <Button
              onClick={sendCustomEmail}
              disabled={sendingCustomEmail || getCustomEmailRecipients().length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className={`w-4 h-4 mr-2 ${sendingCustomEmail ? "animate-pulse" : ""}`} />
              {sendingCustomEmail
                ? "Skickar..."
                : `Skicka till ${getCustomEmailRecipients().length} partner${getCustomEmailRecipients().length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kopiera e-postadresser dialog */}
      <Dialog open={showEmailListDialog} onOpenChange={setShowEmailListDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5 text-slate-700" />
              Kopiera e-postadresser
            </DialogTitle>
            <CardDescription>
              Markera partners, välj separator och klistra sedan in listan i ditt eget mailprogram (t.ex. i Kopia/Hemlig kopia-fältet).
            </CardDescription>
          </DialogHeader>

          {(() => {
            const filtered = partners
              .filter(p => emailListFilter === "all" || (emailListFilter === "published" ? p.is_featured : !p.is_featured))
              .filter(p => !emailListSearch || p.name.toLowerCase().includes(emailListSearch.toLowerCase()))
              .sort((a, b) => a.name.localeCompare(b.name, "sv"));

            const selectedPartners = partners.filter(p => emailListSelected.has(p.id));
            const emailSet = new Set<string>();
            selectedPartners.forEach(p => {
              [p.admin_contact_email, p.email].forEach(e => {
                if (!e) return;
                e.split(/[;,\s]+/).forEach(part => {
                  const trimmed = part.trim().toLowerCase();
                  if (trimmed && trimmed.includes("@")) emailSet.add(trimmed);
                });
              });
            });
            const emailList = Array.from(emailSet).sort();
            const sep = emailListSeparator === "comma" ? ", " : emailListSeparator === "semicolon" ? "; " : "\n";
            const emailString = emailList.join(sep);

            const partnersWithoutEmail = selectedPartners.filter(p => !p.admin_contact_email && !p.email);

            return (
              <div className="space-y-4 py-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium mr-2">Filter:</span>
                  {([
                    { key: "all", label: `Alla (${partners.length})` },
                    { key: "published", label: `Publicerade (${partners.filter(p => p.is_featured).length})` },
                    { key: "unpublished", label: `Ej publicerade (${partners.filter(p => !p.is_featured).length})` },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEmailListFilter(key)}
                      className={`h-8 px-3 rounded border text-xs font-medium transition-all ${
                        emailListFilter === key
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Label className="text-sm">Välj partners ({emailListSelected.size} valda)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEmailListSelected(new Set([
                        ...emailListSelected,
                        ...filtered.map(p => p.id),
                      ]))}
                    >
                      Välj alla synliga
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEmailListSelected(new Set())}
                    >
                      Avmarkera alla
                    </Button>
                  </div>
                </div>

                <Input
                  placeholder="Sök partner..."
                  value={emailListSearch}
                  onChange={(e) => setEmailListSearch(e.target.value)}
                />

                <div className="border rounded-md max-h-64 overflow-y-auto divide-y">
                  {filtered.map(p => {
                    const checked = emailListSelected.has(p.id);
                    const primary = p.admin_contact_email || p.email;
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            setEmailListSelected(prev => {
                              const next = new Set(prev);
                              if (c === true) next.add(p.id); else next.delete(p.id);
                              return next;
                            });
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate flex items-center gap-2">
                            {p.name}
                            {p.is_featured && <Badge variant="secondary" className="text-[10px]">Publicerad</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {primary || <span className="text-destructive">Ingen e-post</span>}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">Inga partners matchar</div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {emailList.length} unika e-postadresser
                    </Label>
                    <div className="flex gap-1">
                      {([
                        { key: "semicolon", label: "; (Outlook)" },
                        { key: "comma", label: ", (Gmail)" },
                        { key: "newline", label: "Radbryt" },
                      ] as const).map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEmailListSeparator(key)}
                          className={`h-7 px-2 rounded border text-xs font-medium transition-all ${
                            emailListSeparator === key
                              ? "bg-slate-800 text-white border-slate-800"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={emailString}
                    readOnly
                    rows={6}
                    className="font-mono text-xs"
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  {partnersWithoutEmail.length > 0 && (
                    <p className="text-xs text-amber-700">
                      Obs: {partnersWithoutEmail.length} valda partner{partnersWithoutEmail.length === 1 ? "" : "s"} saknar e-post och ingår inte i listan.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailListDialog(false)}>
              Stäng
            </Button>
            <Button
              onClick={async () => {
                const selectedPartners = partners.filter(p => emailListSelected.has(p.id));
                const emailSet = new Set<string>();
                selectedPartners.forEach(p => {
                  [p.admin_contact_email, p.email].forEach(e => {
                    if (!e) return;
                    e.split(/[;,\s]+/).forEach(part => {
                      const t = part.trim().toLowerCase();
                      if (t && t.includes("@")) emailSet.add(t);
                    });
                  });
                });
                const sep = emailListSeparator === "comma" ? ", " : emailListSeparator === "semicolon" ? "; " : "\n";
                const text = Array.from(emailSet).sort().join(sep);
                if (!text) {
                  toast.error("Inga e-postadresser att kopiera");
                  return;
                }
                try {
                  await navigator.clipboard.writeText(text);
                  toast.success(`Kopierade ${emailSet.size} e-postadresser`);
                } catch {
                  toast.error("Kunde inte kopiera – markera och kopiera manuellt från fältet");
                }
              }}
              disabled={emailListSelected.size === 0}
            >
              <Copy className="w-4 h-4 mr-2" />
              Kopiera till urklipp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default PartnerInvitationsTab;
