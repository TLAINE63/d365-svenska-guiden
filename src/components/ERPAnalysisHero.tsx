import erpAnalysisPdfImg from "@/assets/erp-analysis-pdf-hero.jpg";

const ERPAnalysisHero = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main PDF image */}
      <div className="relative">
        <img
          src={erpAnalysisPdfImg}
          alt="ERP Behovsanalys PDF-rapport"
          className="max-h-[350px] sm:max-h-[400px] md:max-h-[450px] w-auto object-contain rounded-lg shadow-2xl"
        />
        
        {/* Floating highlight badges */}
        <div className="absolute -top-4 -left-4 sm:-left-8 md:-left-12 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Personlig</div>
              <div className="text-sm font-bold text-gray-800">Rekommendation</div>
            </div>
          </div>
        </div>

        <div className="absolute -top-2 sm:-top-4 right-0 sm:right-4 md:right-0 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Ladda ner</div>
              <div className="text-sm font-bold text-gray-800">PDF-rapport</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 -right-2 sm:-right-4 md:-right-8 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">5 minuter</div>
              <div className="text-sm font-bold text-gray-800">Snabb analys</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPAnalysisHero;
