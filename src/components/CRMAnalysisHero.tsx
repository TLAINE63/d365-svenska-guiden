import crmAnalysisPdfImg from "@/assets/crm-analysis-pdf-hero.jpg";

const CRMAnalysisHero = () => {
  return (
    <div className="relative w-full max-w-lg">
      {/* Main PDF Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
        <img
          src={crmAnalysisPdfImg}
          alt="CRM-behovsanalys PDF-rapport"
          className="w-full h-auto"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 bg-[hsl(var(--crm))] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
        Personlig rekommendation
      </div>
      
      <div className="absolute -bottom-3 -left-3 bg-white text-slate-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-fade-in flex items-center gap-2" style={{ animationDelay: "0.2s" }}>
        <svg className="w-4 h-4 text-[hsl(var(--crm))]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Ladda ner PDF-rapport
      </div>

      <div className="absolute top-1/2 -right-6 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-md animate-fade-in" style={{ animationDelay: "0.4s" }}>
        Sales • Service • Marketing
      </div>
    </div>
  );
};

export default CRMAnalysisHero;
