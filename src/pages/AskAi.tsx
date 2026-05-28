import { Helmet } from "react-helmet-async";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiChatPanel from "@/components/AiChatPanel";

export default function AskAi() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Fråga AI om Dynamics 365 – d365.se</title>
        <meta name="description" content="Ställ en fri fråga om Microsoft Dynamics 365, Copilot, AI-agenter eller hur du hittar rätt partner. Köparsidig, neutral AI-assistent." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12 max-w-3xl w-full flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4" /> AI-assistent
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Fråga AI om Dynamics 365</h1>
          <p className="text-muted-foreground">Få neutrala, hjälpsamma svar om produkter, AI och partnerval.</p>
        </div>

        <div className="flex-1 min-h-[60vh] rounded-xl border border-border bg-card overflow-hidden flex flex-col shadow-sm">
          <AiChatPanel className="flex-1" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
